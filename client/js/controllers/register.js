'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('RegisterCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', '$timeout', '$modal', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, $timeout, $modal, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                $scope.roleList = [{
                    title : "学生",
                    value : Auth.userRoles.student
                    },{
                    title : "老师",
                    value : Auth.userRoles.teacher
                    },{
                    title : "家长",
                    value : Auth.userRoles.parent
                    }
                ]

                $scope.registerData = {
                    username: '',
                    email: '',
                    schoolName: '',
                    password: '',
                    role: {},
                    firstName: '',
                    lastName: '',
                    dateOfBirth: '',
                    gender: ''
                };
                $scope.exitRegister = function(){
                    $scope.viewCtrl.showRegistForm = false;
                };

                $scope.view.clearErrors =
                    function () {
                        $scope.view.error = undefined;
                    }

                var dateFormater = function(rawString){
                    "use strict";
                    var len = 0;
                    if (rawString){
                        len = rawString.length;
//                        console.log(len);
//                        console.log('show the length')
                    } else {rawString = ''}
                    if (len == 5 || len == 8){
                        if (rawString.substring(len-1,len)!='-'){
                            return rawString.substring(0, len-1)+"-"+rawString.substring(len-1, len);
//                            console.log('fit the length')
                        } else {return rawString.substring(0, len-1);}
                    }
                    else if (len>=11){ return rawString.substring(0,10);}
                    else {return rawString;}
                };

                $scope.$watch('registerData.birthdayString', function(newValue, oldValue){
                    $scope.registerData.birthdayString = dateFormater(newValue);
                    $scope.registerData.dateOfBirth = new Date($scope.registerData.birthdayString.split('_'))
                })

                $scope.submit = function() {
                    var that = this;
                    if ($scope.registerData.password !== $scope.registerData.passwordConfirm){
                        $scope.view.error = '两次密码输入不相符。请再次输入密码。';
                        console.log($scope.view.error);
                    }
                    if ($scope.registerData.role == null ){
                        $scope.view.error = '请定义用户身份。';
                        console.log($scope.view.error);
                    } else {
                        $scope.registerData.role = Auth.userRoles[$scope.registerData.role];
                    }
                    if (!$rootScope.err){
                        console.log('sending registration data to /regist');
                        var query = {
                                username: $scope.registerData.username,
                                password: $scope.registerData.password,
                                role: $scope.registerData.role,
                                params: {
                                    email: $scope.registerData.email,
                                    schoolName: $scope.registerData.schoolName,
                                    name: $scope.registerData.lastName+''+$scope.registerData.firstName,
                                    DOB: $scope.registerData.dateOfBirth,
                                    gender: $scope.registerData.gender
                                }
                            };
                        console.log(query)
                        Auth.register(
                            query,
                            function(res) {
//                                console.log('now move to path "/"')
                                $location.path('/questions');
                                Model.init();
                                Model.queryQuestions();
                                that.$hide();
                            },
                            function(err) {
                                if ($scope.view.error === undefined ) {
                                    $scope.view.error = "注册信息有问题，请重新输入。";
                                }
                                $timeout(
                                    $scope.view.clearErrors
                                    , 3000);

                            }
                        );
                    }
                };
            }
        ]
    );
