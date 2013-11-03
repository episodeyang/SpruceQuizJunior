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
            icon: "@",
            color: "@"
        },
        template:
            '<div style="background-color:{{color}};" class="metro input icon">'+
                '<span class="glyphicon glyphicon-{{icon}} metro"></span></div>'+
            '<input ng-model="value" type="{{type}}" style="color:{{color}};"'+
                'placeholder={{placeholder}} class="metro input"/>',
        link: function (scope, element, attrs) {
            console.log(attrs.data);
        }
    }
});

