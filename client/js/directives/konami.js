/**
 *
 * Created by ge on 2/9/14.
 */
var spApp = angular.module('SpruceQuizApp');
spApp.directive("konami", ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var konami_keys = [38, 38, 40, 40, 37, 39, 37, 39];//, 66, 65];
            var konami_index = 0;
            var konamiCallback = $parse(attrs['konami']);
            element.bind("keydown keypress", function(e) {
                if (e.which === konami_keys[konami_index++]) {
                    if (konami_index === konami_keys.length) {
//                        console.log('konami code activated.')
                        scope.$apply(function(){
                            konamiCallback(scope);
                        });
                        konami_index = 0;
                    }
                } else {
                    konami_index = 0;
                }
            });
        }
    };
}]);

