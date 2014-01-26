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
//            $scope.studentShowClicked = false;
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
                    "modules": [
                        {
                            "name": "登陆界面",
                            fold: true,
                            complete: true,
                            url: '/img/ui_design/登录界面-01.png',
                            children: [
                                {name: '登陆', description: '', complete: true,
                                    url: '/img/ui_design/登录界面-01.png'
                                },
                                {name: '注册', complete: true,
                                    url: '/img/ui_design/注册界面-01.png',
                                    children: [
                                        {name: '学生', complete: true},
                                        {name: '教师', complete: true},
                                        {name: '家长', complete: true}
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "标题栏",
                            fold: true,
                            complete: false,
                            url: '/img/ui_design/标题栏收件栏和用户选项-01.png',
                            children: [
                                {name: 'logo', complete: false},
                                {name: '收件夹', complete: false},
                                {name: '统计', complete: false},
                                {name: '用户图标和得分', complete: false}
                            ]
                        },
                        {
                            "name": "搜索问题",
                            fold: false,
                            complete: false,
                            url: '/img/ui_design/搜索问题-01.png',
                            children: [
                                {
                                    name: '对象', complete: false,
                                    children: [
                                        {name: '问题', complete: false},
                                        {name: '搜索关键词', complete: false},
                                        {name: '标签', complete: false},
                                        {name: '相关问题', complete: false}
                                    ]
                                },
                                {name: 'api', complete: false,
                                    children: [
                                        {name: 'api/question/:id', complete: false},
                                        {name: 'api/user/:id', complete: false},
                                        {name: 'api/question/search?math+text+otherkeyword', complete: false},
                                        {name: '', complete: false}
                                    ]
                                },
                                {name: '数据库', complete: false,
                                    children: [
                                        {   name: 'Question', complete: false,
                                            description: ''
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "name": "提问",
                            fold: false,
                            complete: false,
                            url: '/img/ui_design/提问-01.png'
                        },
                        {
                            "name": "问题页面",
                            fold: false,
                            complete: false,
                            url: '/img/ui_design/问题页面-01.png'
                        },
                        {
                            "name": "用户主页",
                            fold: false,
                            complete: false,
                            url: '/img/ui_design/用户主页-01.png'
                        },
                        {
                            "name": "工具和事物",
                            fold: true,
                            complete: false,
                            children: [
                                {name: '文档', complete: false,
                                    children: [
                                        {name: 'jsDoc', complete: false},
                                        {name: 'apidoc', complete: false},
                                        {name: 'code coverage', complete: false}
                                    ]
                                },
                                {name: 'grunt 测试', complete: false},
                                {name: 'single line deployment', complete: false},
                                {name: '', complete: false}
                            ]
                        }
                    ],
                    tags: [
                        {name: '设计', url: '/img/ui_design/登录界面-01.png'},
                        {name: 'api', children: [
                            {name: '测试', complete: true}
                        ]},
                        {name: '数据库', complete: true},
                        {name: '网页', complete: true}
                    ],
                    tasks: {

                    }

                }

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
            $scope.view.imageUrl = '/img/ui_design/搜索问题-01.png';
            $scope.view.description = 'Ta很懒，什么都没有留下...';
            $scope.hover = function (object) {
                console.log('mouse hover triggered')
                $scope.view.imageUrl = object.url;
                $scope.view.description = object.description;
            }


        }
    ]
);
