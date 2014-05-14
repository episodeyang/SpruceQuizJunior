/**
 * Created by ge on 4/17/14.
 * adding escape and enter key trigger to the built-in
 * contenteditable attribute.
 */
var spApp = angular.module('SpruceQuizApp');
spApp.directive('inlineEditable', function () {
    return {
        require: 'ngModel',
        scope: {
            submit: '&',
            cancel: '&'
        },
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

                if (enter) {
                    el.blur();
                    scope.submit('something here');
                    console.log('just called back');
                } else if (esc) {
                    el.blur();
                    scope.cancel();
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