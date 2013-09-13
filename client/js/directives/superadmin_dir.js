'use strict';

var spApp = angular.module('SpruceQuizApp');

// declarations
var watchTest;

spApp.directive('dirTest', function () {
    var myHTML = "<h1>{{pageStatus.currentPage}}</h1>";
    return {
        restrict: 'E',
        template: myHTML,
//        scope: {
//            pageStatus: "="
//        },
        link: function (scope, element) {
            scope.val = "hello world";
//            element.replaceWith('<div>Object.toString()</div>');
        }
    };
});
/*
spApp.directive('jsonTable', function () {

    // putting the variable here so it doesn't clogger up
    var tableTemplate =
        '<div class="row-fluid">' +
            //'<p>{{data[\'student\'].data[0]}}</p>'+
            //'<p>{{pageStatus}}</p>'+
            //'<p>{{pageStatus.currentPage}}</p>'+
            '<div class="span2">Sort by:</div>' +
            '<div class="span4"><select ng-model="orderProp" ng-options="key.name for key in data[type].header"></select></div>' + //{{data[type].header}}
            '<div class="span1">Query:</div>' +
            '<div class="span4"><input ng-model="query"></div>' +
            '<table class="table table-striped table-condensed table-hover">' +
            '<thead><tr>' +
            '<th ng-repeat="key in data[\'student\'].header">{{key.name}}</th>' +
            '</tr></thead>' +
            '<tbody>' +
            '<tr ng-repeat="item in data[\'student\'].data[0] | filter:query | orderBy:orderProp">' +
            '<td ng-repeat="key in data[\'student\'].header">{{item[key.value].toString()}}</td>' +
            '</tr></tbody>' +
            '<tfoot><tr>' +
            '<td colspan="6">' +
            '<div class="pagination pull-right">' +
            '<ul>' +
            '<li ng-class="{disabled: currentPage == 0}"><a href="href" ng-click="prevPage()">«' +
            'Prev</a></li>' +
            '<li ng-repeat="n in range(pagedItems.length)" ng-class="{active: n == currentPage}"' +
            'ng-click="setPage()"><a href="href" ng-bind="n + 1">1</a></li>' +
            '<li ng-class="{disabled: currentPage == 0 || currentPage &lt;= pagedItems.length - 1}">' +
            '<a href="href" ng-click="nextPage()">Next »</a></li>' +
            '</ul></div></td></tr></tfoot>' +
            '</table></div>';

    // no need to have isolate scope because this directive need data from the controller's scope
    return {
        restrict: 'CE',
        replace: true,        // replace original markup with template
        template: tableTemplate,
        scope: {
            type: "@",
            data: "=",
            pageStatus: "="
        },
        link: function (scope, element, attrs) {
            console.log("current page");
            console.log(scope.pageStatus.currentPage);
            console.log(scope.studentShowChecked);

        }
//            console.log(scope.type);
//            console.log(scope.data['student'].header);
//            console.log(scope.data['student'].data);
//            scope.$watch('data', function (newVal, oldVal) {
//                //console.log("logging from watch of directive, and the new value is:");
////                console.log("changing, the new val is:");
//                //console.log(newVal);
//                //console.log(oldVal);
//                //element.replaceWith(tableTemplate);
//                console.log('show new value')
//                console.log(newVal);
//                console.log('show old value');
//                console.log(oldVal);
//                console.log(scope.data['student'].header);
//                console.log(scope.data['student'].data);
//            });
        };
    //};
});

 */


