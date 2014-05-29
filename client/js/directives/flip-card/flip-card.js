angular.module('flip-card', ['ngAnimate'])
    .directive('flip', ['$animate', function ($animate) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                flipped: '=flipped'
            },
            template: '<div class="flip"> ' +
                '<div class="flip-container"  ng-class="{flipped: flipped}" ng-transclude></div>' +
                '</div>',
            controller: function ($scope, $element, $attrs) {

            },
            link: function (scope, elm, attrs) {
//                scope.$watch('flipped', function (newValue, oldValue) {
//                    if (newValue) {
//                        $animate.removeClass(elm, 'front');
//                        $animate.addClass(elm, 'back');
//                    } else {
//                        $animate.removeClass(elm, 'back');
//                        $animate.addClass(elm, 'front');
//                    }
//                });
            }
        };
    }])
    .directive('flipFront', function () {
        return {
            require: '^flip',
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="front-panel" ng-transclude></div>'
        };
    })
    .directive('flipBack', function () {
        return {
            require: '^flip',
            restrict: 'E',
            replace: true,
            transclude: true,
            template: '<div class="back-panel" ng-transclude></div>'
        };
    })
    .directive('flipToggle', function () {
        return {
            require: '^flip',
            restrict: 'A',
            link: function (scope, elm, attrs, controller) {
                var previousValue;

                attrs.$observe('flipToggle', function (value) {
                    if (!value) {
                        value = 'click'
                    }

                    if (previousValue) elm.off(previousValue, controller.toggle);

                    previousValue = value;

                    elm.on(value, controller.toggle);

                });
            }
        };
    });

