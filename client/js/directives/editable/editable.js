/**
 * Created by ge on 4/17/14.
 * adding escape and enter key trigger to the built-in
 * contenteditable attribute.
 */
var spApp = angular.module('SpruceQuizApp');
spApp.directive('contenteditable', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            // view -> model
            function onBlur () {
                scope.$apply(function () {
                    ctrl.$setViewValue(elm.html());
                });
            }
            elm.bind('blur', onBlur);

            // model -> view
            ctrl.render = function (value) {
                elm.html(value);
            };

            // load init value from DOM
            ctrl.$render();
            elm.bind('keydown', function (event) {
                // console.log("keydown " + event.which);
                var esc = event.which == 27,
                    enter = event.which == 13,
                    el = event.target;

                if (esc) {
                    // console.log("esc");
                    ctrl.$setViewValue(elm.html());
                    el.blur();
                    event.preventDefault();
                }

                if (enter) {
                    // console.log("enter");
                    ctrl.$setViewValue(elm.html());
                    el.blur();
                    event.preventDefault();
                }

            });

        }
    };
});