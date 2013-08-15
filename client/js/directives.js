'use strict';

angular.module('SpruceQuizApp')
    .directive('accessLevel', ['Auth', function(Auth) {
        return {
            restrict: 'A',
            link: function($scope, element, attrs) {
                var prevDisp = element.css('display')
                    , userRole
                    , accessLevel;

                $scope.user = Auth.user;
                $scope.$watch('user', function(user) {
                    if(user.role)
                        userRole = user.role;
                    updateCSS();
                }, true);

                attrs.$observe('accessLevel', function(al) {
                    if(al) accessLevel = $scope.$eval(al);
                    updateCSS();
                });

                function updateCSS() {
                    if(userRole && accessLevel) {
                        if(!Auth.authorize(accessLevel, userRole))
                            element.css('display', 'none');
                        else
                            element.css('display', prevDisp);
                    }
                }
            }
        };
    }]);

angular.module('SpruceQuizApp').directive('activeNav', ['$location', function($location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = $location;
            scope.$watch('location.absUrl()', function(newPath) {
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
.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                $element.text(value == undefined ? "" : value);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
            });
        }]
    };
});

//UI Directive

