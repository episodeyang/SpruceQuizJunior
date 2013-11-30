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
            //placeholder: "@",
            icon: "@"
        },
        transclude: true,
        template:
            '<div style="" class="">'+
                '<span class="glyphicon glyphicon-{{icon}} metro"></span></div>'+
            '<select ng-model="value" type="{{type}}" ng-transclude class="transcluded">'+
            '</select>',
        compile: function compile(tElement, tAttrs, transclude){
            return{
                pre: function preLink(scope, iElement, iAttrs, controllers){
                    iElement.find('select').append('<option value="none" selected>'+scope.placeholder+'</option>');
                },
                post: function postLink(scope, iElement, iAttrs, controllers){
                    console.log("placeholder value is"+iAttrs.placeholder);
                    console.log("print all of the options"+iElement.find('select').children())
                    //iElement.find('select').append('<option value="" selected=true>'+scope.placeholder+'</option>');
                }
            }
        },
        link: function (scope, element, attrs) {
            console.log(attrs.value);
            console.log("print options in link function: "+element.find('select').children());
            scope.$apply();
        }
    }
});
