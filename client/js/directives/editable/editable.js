/**
 * Created by ge on 4/17/14.
 */
var spApp = angular.module('SpruceQuizApp');
spApp.directive('contentEditable', function() {
    return {
        require: 'ngModel',
        link: function(scope, elm, attrs, ctrl) {
            // view -> model
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ctrl.$setViewValue(elm.html());
                });
            });

            // model -> view
            ctrl.render = function(value) {
                elm.html(value);
            };

            // load init value from DOM
//            ctrl.$setViewValue(elm.html());
            ctrl.$render();
            elm.bind('keydown', function(event) {
                console.log("keydown " + event.which);
                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                    console.log("esc");
                    ctrl.$setViewValue(elm.html());
                    el.blur();
                    event.preventDefault();
                }

            });

        }
    };
});