'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('TeacherCtrl',
    ['_', '$rootScope', '$scope', '$timeout', 'Auth', 'Model', 'Students', '$http',
        function (_, $rootScope, $scope, $timeout, Auth, Model, Students, $http) {
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
            $scope.searchStudents = function(schoolName) {
                var query = {};
                if (schoolName) {
                    query.school = schoolName;
                }
                console.log(query);
                Students.search(query).$promise.then(function(students){
                    console.log(students);
                    $scope.model.students = students;
                }).catch(function(error){
                    console.log("error:", error);
                });
            };

            $scope.onFileSelect = function($files) {
                console.log($files);
                console.log('onFileSelect called');
                console.log(CSV.parse($file));
            };
            var keys = 'schoolName username passwordText classYear name gender DOBText address mobile email'.split(' ');
            $scope.makeStudents = function(text) {
                function makeStudent (line) {
                    var student = {};
                    var values = line.split('\t');
                    _.zip(keys, values).map(function (keyValue) {
                        student[keyValue[0]] = keyValue[1];
                    });
                    student.name = student.name.split(' ').join('');
                    //console.log(student);
                    return student;
                }
                var lines = text.split('\n');
                $scope.model.students = lines.map(makeStudent);
                $scope.studentDataText = '拷贝成功，请在学生标签中查看和注册。';
            };

            $scope.$watch('studentDataText', $scope.makeStudents);

            $scope.model.log = [];
            var genderDict = {
                "男": 'male',
                "male": 'male',
                "Male": 'male',
                "女": 'female',
                "female": 'female',
                "Female": 'female'
            };
            function validate (student, index, callback) {
                if (!student.username) return callback(student, index, '需要用户名');
                if (!student.name) return callback(student, index, '需要姓名');
                if (!student.mobile) return callback(student, index, '需要电话');
                student.gender = genderDict[student.gender];
                if (student.DOBText.length !== 8) return callback(null, index, '生日格式不正确');
                student.DOB = new Date(student.DOBText.slice(0,4), student.DOBText.slice(4,6), student.DOBText.slice(6,8));
                student.password = Auth.getHash(student.passwordText);
                return callback(student, index, null);
            }
            function register(student, index, error) {
                if (error) {
                    $scope.model.log.unshift(
                        {
                            class: 'error',
                            message: student.name + error
                        }
                    );
                    return $rootScope.error = error;
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
                            schoolName: student.schoolName,
                            email: student.email,
                            info : {
                                mobile: student.mobile,
                                address: student.address
                            }
                        }
                    };
                    return $http.post('/register/batch', payload)
                        .success(function(savedStudent){
                            // _.extend(student, savedStudent);
                            student._id = savedStudent._id;
                            student.$error = undefined;
                            $scope.model.log.unshift(
                                {
                                    class: 'success',
                                    message: student.name + '成功注册！'
                                }
                            );
                            student.$hide = true;
                        }).error(function(error) {
                            if (error == 'UserAlreadyExists') {
                                student.$error = true;
                                student.$message = student.name + '的用户名在数据库中已经注册过了，是否重名？';
                                $scope.model.log.unshift(
                                    {
                                        class: 'error',
                                        message: student.$message
                                    }
                                );
                            } else {
                                student.$error = true;
                                student.$uploading = false;
                                console.log(student.name + '注册失败');
                                $scope.model.log.unshift(
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
                if (student.$hide) {return 'already registered';}
                $scope.model.log = [];
                student.$uploading = true;
                return $timeout(
                    function () {
                        return validate(student, index, register)
                    },
                    100
                );
            }
            $scope.batchRegister = function() {
                console.log('开始批量注册');
                _.each($scope.model.students, validateAndRegister);
            };
        }
    ]);
