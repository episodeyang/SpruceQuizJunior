'use strict';

angular.module('SpruceQuizApp')
//.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
//    return {
//        restrict: 'A',
//        link: function(scope, element, attrs) {
//            var prevDisp = element.css('display');
//            $rootScope.$watch('user.role', function(role) {
//                if(!Auth.authorize(attrs.accessLevel))
//                    element.css('display', 'none');
//                else
//                    element.css('display', prevDisp);
//            });
//        }
//    };
//}])
    .directive('accessLevel', ['Auth', function (Auth) {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                $scope.user = Auth.user;
                $scope.$watch('user', function (user) {
                    if (user.role !== 'undefined')
                        userRole = user.role;
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function (al) {
                    if (al) accessLevel = $scope.$eval(al);
                    updateCSS();
                });

                function updateCSS() {
                    if (userRole && accessLevel) {
//                        console.log('userRole');
//                        console.log(userRole);
//                        console.log('accessLevel');
//                        console.log(accessLevel);
                        if (!Auth.authorize(accessLevel, userRole))
                            element.css('display', 'none');
                        else
                            element.css('display', prevDisp);
                    }
                }
            }
        };
    }]);
angular.module('SpruceQuizApp')
    .directive('activeNav', ['$location', function (location) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var nestedA = element.find('a')[0];
                var path = nestedA.href;

                scope.location = location;
                scope.$watch('location.absUrl()', function (newPath) {
                    if (path === newPath) {
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });
            }

        };

    }]);


//MathJax Directive
MathJax.Hub.Config({skipStartupTypeset: true});
MathJax.Hub.Configured();

angular.module('SpruceQuizApp')
    .directive("mathjaxBind", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function (value) {
                    $element.text(value == undefined ? "" : value);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });

//UI Directive

angular.module('SpruceQuizApp')
    .directive('batJsonTree', function ($compile) {
        return {
            restrict: 'E',
            terminal: true,
            scope: {
                val: '='
                //edit: '=',
            },
            link: function (scope, element, attrs) {
                // this is more complicated then it should be
                // see: https://github.com/angular/angular.js/issues/898

                var buildDom = function (object) {
                    var html = '';
                    var prop;
                    if (object === undefined) {
                        html += '<i>undefined</i>';
                    } else if (object === null) {
                        html += '<i>null</i>';
                    } else if (object instanceof Array) {
                        var i;
                        html += '<div class="scope-branch" style="margin-left: 30px;">[ ';
                        if (object.length > 0) {
                            html += buildDom(object[0]);
                            for (i = 1; i < object.length; i++) {
                                html += ', ' + buildDom(object[i]);
                            }
                        }
                        html += ' ]</div>';
                    } else if (object instanceof Object) {
                        html += ' { ';
                        for (prop in object) {
                            if (object.hasOwnProperty(prop)) {
                                html += '<div class="scope-branch" style="margin-left: 30px;">' + prop + ': ' + buildDom(object[prop]) + '</div>';
                            }
                        }
                        html += ' } ';
                    } else {
                        html += '<span>' + object.toString() + '</span>';
                    }
                    return html;
                };

                var isEmpty = function (object) {
                    var prop;
                    for (prop in object) {
                        if (object.hasOwnProperty(prop)) {
                            return false;
                        }
                    }
                    return true;
                };

                scope.$watch('val', function (newVal, oldVal) {
                    if (newVal === null) {
                        element.html('<div class="alert alert-info">Select a scope to view its models.</div>');
                    } else if (isEmpty(newVal)) {
                        element.html('<div>{ This scope has no models }</div>');
                    } else {
                        element.html('<div>' + buildDom(newVal) + '</div>');
                    }
                });
            }
        };
    });

angular.module('SpruceQuizApp')
    .directive('jsonStringify', function () {
        return {
            restrict: 'A',
            scope: {'data': '='},
            link: function (scope, elem, attr, ctrl) {
                scope.$watch('data', function (data) {
                    scope.parsedText = JSON.stringify(data, undefined, '    ');
                });
            }
        };
    });
angular.module('SpruceQuizApp')
    .directive('textParser', function () {
        return {
            restrict: 'A',
            scope: {'data': '=',
            output: '='},
            link: function (scope, elem, attr, ctrl) {
                scope.$watch('data', function (data) {
                    _.(newVal.split('\\n'), function (name) {
                        json.push({'name': name});
                    });
                });
            }
        };
    });
angular.module('SpruceQuizApp')
    .directive('jsonText', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                function into(input) {
                    return JSON.parse(input);
                }

                function out(data) {
                    return JSON.stringify(data, undefined, '    ');
                }

                ngModel.$parsers.push(into);
                ngModel.$formatters.push(out);

            }
        };
    });