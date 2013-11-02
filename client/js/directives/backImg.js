'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.directive('backgroundImg', function () {
    return function (scope, element, attrs) {
        attrs.$observe('backgroundImg', function (value) {
            element.css({
                'background-image': 'url(' + value + ')',
                'background-size': 'cover'
            });
        });
    };
});