/**
 * Created by ge on 4/17/14.
 * adding escape and enter key trigger to the built-in
 * contenteditable attribute.
 */
var spApp = angular.module('SpruceQuizApp');
spApp.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attrs, ngModel) {
            if (!ngModel) return; // do nothing if no ng-model

            // Specify how UI should be updated
            ngModel.$render = function (value) {
                element.html(value || ngModel.$viewValue || '');
            };

            // Listen for change events to enable binding
            element.on('blur keydown keyup change', function () {
                var esc = event.which == 27,
                    enter = event.which == 13,
                    el = event.target;

                if (esc || enter) {
                    el.blur();
                }

                scope.$apply(read);
            });

            ngModel.$render();

            // Write data to the model
            function read() {
                var html = element.html();
                element.html(html.split('<br>').join(''))
                ngModel.$setViewValue(html);
            }
        }
    };
});