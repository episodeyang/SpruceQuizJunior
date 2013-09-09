'use strict';

var spApp = angular.module('SpruceQuizApp');

spApp.directive('jsonTable', function () {
    return {
        restrict: 'CE',
        terminal: true,
        scope: {
            type: '=',
            data: '='
        },
//        replace: true,        // replace original markup with template
//        transclude: false,    // do not copy original HTML content
        link: function (scope, element, attrs) {
            // a mapping from key word to data and headers (in the form of a tuple)
            //$scope.listVarName = 'model.studentList'
            // type is the iterator that's passed in to
            console.log("the directive is at least called");
            var th_list = '';
            var td_list = '';
            for (var key in data[type].header) {
                th_list.append('<th class="' + key.value + '">' + key.name + '</th>\n');
                td_list.append('<td>{{' + type + '.' + key.value + '.toString()}}<td>\n');
            }


            // the data should have already been fetched from the controller
            //colDataValName is a local variable passed to the function
            // which need to be stored
            //$scope.colDataValName = 'model.studentListColData'
            var htmlText =
                '<div class="row-fluid">' +
                    '<div class="span2">Sort by:</div>' +
                    '<div class="span4">' +
                    '<select ng-model="orderProp" ng-options="key.name for key in' + colDataValName + '></select></div>' +
                    '<div class="span1">Query:</div>' +
                    '<div class="span4"><input ng-model="query"></div>' +
                    '<table class="table table-striped table-condensed table-hover">' +
                    '<thead><tr>'
                    + th_list +
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
                    '<tr ng-repeat="item in ' + data[type].data + '[currentPage] | filter:query | orderBy:orderProp">' +
                    'td_list' +
                    '</tr></tbody></table>';
            //.html
            //$scope.watch()
            element.replaceWith(htmlText);
        }

    }
});