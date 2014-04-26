'use strict';
/* Controllers */
angular.module('SpruceQuizApp')
    .controller('BookCtrl',
        ['$routeParams', '$location', '$filter', '$rootScope', '$scope', 'Auth', 'Sections', 'Units', 'Materials', 'Students', 'Model',
            function ($routeParams, $location, $filter, $rootScope, $scope, Auth, Sections, Units, Materials, Students, Model) {
                //Boiler Plate for authentication info
                $scope.user = Auth.user;
                $scope.userRoles = Auth.userRoles;
                $scope.accessLevels = Auth.accessLevels; //to allow authentication based elements.

                if ( window.location.host.indexOf('youzi') == 0) {
                    $scope.orgTitle = "游子 - ";
                };
                $scope.debug= {
                    alert: function(){
                        alert('konami code success');
                    }
                };
                $rootScope.errorClear = function(){
                    $rootScope.error = null;
                };
                $scope.Model = Model;

                $scope.view = {
                    state: 'search'
                };
                $rootScope.errors = {};

                if ($routeParams.authorAndTitle) {
                    console.log("the book's title is " + $routeParams.authorAndTitle);
                    var titleAuthor = $routeParams.authorAndTitle.split(',').reverse();
                    var title = titleAuthor.splice(0,1)[0]
                    var author = titleAuthor[0]
                    console.log(title)
                    console.log(author)
                }
            }
        ]);
