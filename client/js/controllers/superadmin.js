'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.controller('SuperAdminCtrl',
    ['$scope', //'Students',//'$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
        function ($scope) {//, Students ,$rootScope, $scope, Sections, Units, Materials, Students) {
            // this object is to hold data for future tables
            $scope.userData = {
                roleTitle: 'admin',
                firstName: '歌',
                lastName: '杨',
                schools: [
                    {schoolName: '北京景山学校'}
                ],
                sections: [
                    {
                        sectionName: '三年级二班',
                        sectionParent: null,
                        sectionChildren: []
                    }
                ]
            };
//            $scope.data = {}; // initialized here and updated later when things are clicked.
//            $scope.studentShowClicked = false;
//            var itemsPerPage = 10;
//            $scope.pageStatus = {};
//            $scope.pageStatus.currentPage = 0;
//            //$scope.student = "student";
//
//            // helper function: calculate page
//            // takes in the list and returns a processed list of lists.
//            var groupToPages = function (items) {
//                var pagedItems = [];
//
//                for (var i = 0; i < items.length; i++) {
//
//                    if (i % itemsPerPage === 0) {
//                        pagedItems[Math.floor(i / itemsPerPage)] = [ items[i] ];
//                    } else {
//                        pagedItems[Math.floor(i / itemsPerPage)].push(items[i]);
//                    }
//                }
//
//                return pagedItems;
//            };
//
//            $scope.range = function (start, end) {
//                var ret = [];
//                if (!end) {
//                    end = start;
//                    start = 0;
//                }
//                for (var i = start; i < end; i++) {
//                    ret.push(i);
//                }
//                return ret;
//            };
//
//            $scope.prevPage = function () {
//                if ($scope.currentPage > 0) {
//                    $scope.currentPage--;
//                }
//            };
//
//            $scope.nextPage = function () {
//                if ($scope.currentPage < $scope.pagedItems.length - 1) {
//                    $scope.currentPage++;
//                }
//            };
//
//            $scope.setPage = function () {
//                $scope.currentPage = this.n;
//            };
//
//            //$scope.listStudents = function () {
//            $scope.studentShowClicked = true;
//            $scope.data['student'] = {};
//            Students.onStudents.list(function (results) {
//                // the controller gets the data and puts in the correct data structure
//                $scope.data['student'].header = [
//                    {value: 'firstName', name: 'First Name'},
//                    {value: 'lastName', name: 'Last Name'},
//                    {value: 'dateOfBirth', name: 'DoB'},
//                    {value: 'gender', name: 'Gender'},
//                    {value: 'schools', name: 'Schools'},
//                    {value: 'sections', name: 'Sections'},
//                    {value: 'phone', name: 'Phone'}
//                ];
//
//                $scope.data['student'].data = groupToPages(results);
//                console.log("logging from controller:");
//                console.log($scope.data['student'].data);
//            });
//            //};
        }
    ]
);

spApp.controller('DevelopmentCtrl',
    ['$scope', '_', //'Students',//'$rootScope', '$scope', 'Sections', 'Units', 'Materials', 'Students',
        function ($scope, _) {//, Students ,$rootScope, $scope, Sections, Units, Materials, Students) {
            // this object is to hold data for future tables
            var designConfig = {
                frontEnd: {"title": "前端工作总表",
                    "main": [
                        {
                            "name": "登录",
                            fold: true,
                            complete: true,
                            url: '/img/ui_design/登录界面-01.png',
                            children: [
                                {name: '行为', description: '', complete: true},
                                {name: '设计', complete: true, url: '/img/ui_design/登录界面-01.png'},
                                {name: 'api', complete: true, children: [
                                    {name: '测试', complete: true}
                                ]},
                                {name: '数据库', complete: true},
                                {name: '网页', complete: true}
                            ]
                        },
                        {   "name": "注册",
                            fold:true,
                            complete: true,
                            url: '/img/ui_design/注册界面-01.png',
                            children: [
                                {name: '分类',
                                    complete: true,
                                    children: [
                                        {name: '学生', complete: true},
                                        {name: '教师', complete: true},
                                        {name: '家长', complete: true}
                                    ]},
                                {name: '设计'},
                                {name: 'api'},
                                {name: '数据库'},
                                {name: '网页'}
                            ]},
                        {
                            "name": "搜索问题",
                            fold: false,
                            complete: false,
                            url: '/img/ui_design/搜索问题-01.png'
                        },
                        {
                            "name": "提问",
                            fold: false,
                            complete:false,
                            url: '/img/ui_design/提问-01.png'
                        },
                        {
                            "name": "问题页面",
                            fold: false,
                            complete:false,
                            url: '/img/ui_design/问题页面-01.png'
                        },
                        {
                            "name": "用户主页",
                            fold: false,
                            complete:false,
                            url: '/img/ui_design/用户主页-01.png'
                        }
                    ]}

            };
            $scope.designConfig = designConfig;
            $scope.inputModel = {};
            $scope.inputModel.text = '';
            function edit() {
            };
            function add() {
                var newEntry = {
                    name: $scope.inputModel.entryInput
                };
                $scope.designConfig.frontEnd.main.push(newEntry);
                $scope.inputModel.textInput = '';
            };
            $scope.add = add;
            $scope.edit = edit;

            $scope.view = {};
            $scope.view.imageUrl = '/img/ui_design/搜索问题-01.png'
            $scope.hover = function (object) {
                console.log('mouse hover triggered')
                $scope.view.imageUrl = object.url;
            }


        }
    ]
);
