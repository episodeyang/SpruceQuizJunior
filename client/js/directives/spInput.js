/**
 * Created by: ge
 * Date: 10/30/13 0:26 PM
 */

'use strict';

var spApp = angular.module('SpruceQuizApp');
spApp.directive('MetroQuare', function(){
    return {
        template:"<div."
    }
});

spApp.directive('spInput', function () {
    return {
        restrict: 'E',
        scope: {
            value: "=",
            type: "@",
            placeholder: "@",
            icon: "@"
        },
        template:
            '<div style="" class="">'+
                '<span class="glyphicon glyphicon-{{icon}} metro"></span></div>'+
            '<input ng-model="value" type="{{type}}" style=""'+
                'placeholder={{placeholder}} class="metro input"/>',
        link: function (scope, element, attrs) {
            console.log(attrs.value);
        }
    }
});

spApp.directive('spSelect', function () {
    return {
        restrict: 'E',
        scope: {
            value: "=",
            placeholder: "@",
            icon: "@"
        },
        transclude: true,
        template:
            '<div style="" class="">'+
                '<span class="glyphicon glyphicon-{{icon}} metro"></span></div>'+
            '<select ng-model="value" type="{{type}}" ng-transclude class="transcluded">'+
                '<option value="test this" selected> {{placeholder}} </option>' +
            '</select>',
        link: function (scope, element, attrs) {
            console.log(attrs.value);
        }
    }
});
