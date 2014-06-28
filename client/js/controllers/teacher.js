'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('TeacherCtrl',
    ['_', '$rootScope', '$scope', '$timeout', '$filter', 'Auth', 'Model', 'Students', 'Schools', '$http',
        function (_, $rootScope, $scope, $timeout, $filter, Auth, Model, Students, Schools, $http) {
            //Boiler Plate for authentication info
            $scope.user = Auth.user;
            $scope.userRoles = Auth.userRoles;
            $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

            if (window.location.host.indexOf('youzi') == 0) {
                $scope.orgTitle = "游子 - ";
            }
            $scope.debug = {
                alert: function () {
                    alert('konami code success');
                }
            };
            $rootScope.errorClear = function () {
                $rootScope.error = null;
            };
            $scope.Model = Model;
            $scope.model = {};
            $scope.view = {};
            $scope.view.alertQue = [];
            $scope.formData = {students: ''};

            $scope.getSchools = function (){
                Model.getSchools().then(function(schools) {
                    _.each(schools, function(school){
                        school.stats =  Schools.stats({name: school._id});
                    });
                },
                function(error){
                    $rootScope.error = error;
                });
            };

            $scope.searchStudents = function (schoolName) {
                var query = {};
                if (schoolName) {
                    query.school = schoolName;
                }
                // console.log(query);
                Students.search(
                    query,
                    function (students) {
                        $scope.model.students = students;
                    },
                    function (error) {
                        console.log("error:", error);
                    });
            };

            $scope.onFileSelect = function ($files) {
                console.log($files);
                console.log('onFileSelect called');
                console.log(CSV.parse($file));
            };
            var keys = 'schoolName username passwordText classYear name gender DOBText address mobile email'.split(' ');
            var lines;
            $scope.makeStudents = function (text, oldText) {
                if (!text || text == '') return;
                var student, error;
                function makeStudent(line) {
                    student = {};
                    var values = line.split('\t');
                    _.zip(keys, values).map(function (keyValue) {
                        student[keyValue[0]] = keyValue[1];
                    });
                    if (student.name) {
                        student.name = student.name.split(' ').join('');
                    } else { error = "表格格式不正确，请确定包含下面的列，并按照该顺序排列：\n 学校	用户名	密码	毕业年份	姓名	性别	出生日期	通信地址	联系电话	邮箱地址"}
                    return student;
                }
//
                lines = text.split('\n');
                $scope.model.students = lines.map(makeStudent);
                $scope.view.pasteView = false;

                if (error) {
                    $scope.view.alertQue.unshift({
                        class: 'error',
                        message: error
                    });
                }
                $timeout(function(){
                    $scope.formData.student = '';
                }, 100);
            };

            $scope.$watch('formData.student', $scope.makeStudents);

            var genderDict = {
                "男": 'male',
                "male": 'male',
                "Male": 'male',
                "女": 'female',
                "female": 'female',
                "Female": 'female'
            };

            function validate(student, index, callback) {
                if (student._id) return callback(student, index, student.name + '已经注册过了。');
                if (!student.username) return callback(student, index, '需要用户名');
                if (!student.name) return callback(student, index, '需要姓名');
                if (!student.mobile) return callback(student, index, '需要电话');
                student.gender = genderDict[student.gender];
                if (student.DOBText.length !== 8) return callback(null, index, '生日格式不正确');
                student.DOB = new Date(student.DOBText.slice(0, 4), student.DOBText.slice(4, 6) - 1, student.DOBText.slice(6, 8));
                student.password = Auth.getHash(student.passwordText);
                return callback(student, index, null);
            }

            function register(student, index, error) {
                if (error) {
                    $scope.view.alertQue.unshift(
                        {
                            class: 'error',
                            message: student.name + error
                        }
                    );
//                    return $rootScope.error = error;
                }
                if (!student.$success && !student.$server) {
                    student.$error = undefined;
                    student.$uploading = true;
                    var payload = {
                        username: student.username,
                        password: student.password,
                        role: {
                            title: 'student',
                            bitMask: 2
                        },
                        params: {
                            domain: 'youzi',
                            DOB: student.DOB,
                            gender: student.gender,
                            name: student.name,
                            classYear: student.classYear,
                            schoolName: student.schoolName,
                            email: student.email,
                            info: {
                                mobile: student.mobile,
                                address: student.address
                            }
                        }
                    };
                    return $http.post('/register/batch', payload)
                        .success(function (savedStudent) {
                            // _.extend(student, savedStudent);
                            student._id = savedStudent._id;
                            student.$error = undefined;
                            $scope.view.alertQue.unshift(
                                {
                                    class: 'success',
                                    message: student.name + '成功注册！'
                                }
                            );
                            student.$hide = true;
                        }).error(function (error) {
                            if (error == 'UserAlreadyExists') {
                                student.$error = true;
                                student.$message = student.name + '的用户名在数据库中已经注册过了，是否重名？';
                                $scope.view.alertQue.unshift(
                                    {
                                        class: 'error',
                                        message: student.$message
                                    }
                                );
                            } else {
                                student.$error = true;
                                student.$uploading = false;
                                console.log(student.name + '注册失败');
                                $scope.view.alertQue.unshift(
                                    {
                                        class: 'error',
                                        message: student.name + error
                                    }
                                );
                            }
                        });
                }
            }

            function validateAndRegister(student, index) {
                if (student.$hide) {
                    return 'already registered';
                }
                $scope.view.alertQue = [];
                student.$uploading = true;
                return $timeout(
                    function () {
                        return validate(student, index, register)
                    },
                    100
                );
            }

            $scope.batchRegister = function () {
                console.log('开始批量注册');
                _.each($scope.model.students, validateAndRegister);
            };

            $scope.removeUser = function (student) {
                student.$uploading = true;
                $http.delete('/api/users/' + student.username).success(function () {
                    student.$hide = true;
                    delete student.$uploading;
                }).error(function (error) {
                    student.$error = true;
                    delete student.$uploading;
                })
            };

        }
    ]);
