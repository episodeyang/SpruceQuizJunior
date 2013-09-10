'use strict';

var spApp = angular.module('SpruceQuizApp');

// declarations
var watchTest;

spApp.directive('dirTest', function () {
    var myHTML = "<h1>{{val}}</h1>";
    return {
        restrict: 'E',
        template: myHTML, // '<div>{{val}}</div>',
        link: function (scope) {
            scope.val = "hello world";
        }
    };
});

spApp.directive('jsonTable', function () {

    // putting the variable here so it doesn't clogger up
    var tableTemplate =
        '<div class="row-fluid">' +
            '<div class="span2">Sort by:</div>' +
            '<div class="span4"><select ng-model="orderProp" ng-options="key.name for key in data[\'student\'].header"></select></div>' + //{{data[type].header}}
            '<div class="span1">Query:</div>' +
            '<div class="span4"><input ng-model="query"></div>' +
            '<table class="table table-striped table-condensed table-hover">' +
            '<thead><tr>' +
            '<th ng-repeat="key in data[\'student\'].header">{{key.name}}</th>' +
            '</tr></thead>' +
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
            '<tbody>' +
            '<tr ng-repeat="item in data[type].data [currentPage] | filter:query | orderBy:orderProp">' +
        '</table></div>';

    // no need to have isolate scope because this directive need data from the controller's scope
    // FIXME: this is bad practice since it might pollute the scope but I'm not sure how to fix
    return {
        restrict: 'CE',
        replace: true,        // replace original markup with template
        template: tableTemplate,
        scope: {
            type: "@",
            data: "="
        },
        link: function (scope, element, attrs) {
            console.log("from directive");
            console.log(scope.data['student'].header);

            //scope.$watch('testVal', watchTest, true);
        }
    };
});

// directive listeners (from $watch)
watchTest = function (newVal, oldVal, scope) {
    scope.testVal = oldVal;
    console.log("logging from directive");
    console.log(newVal);
    console.log(oldVal);
}

