/**
 * Created by ge on 4/17/14.
 * adding escape and enter key trigger to the built-in
 * contenteditable attribute.
 */
angular.module('SpruceQuizApp')
    .directive('pushTo', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                pushTo: '=',
                ngModel: '=ngModel'
            },
            link: function (scope, element, attrs, ngModel) {
                if(!ngModel) return;
                // ngModel.$render = function () {
                //     element.html(ngModel.$viewValue || '');
                //     console.log(ngModel.$viewValue);
                // };
                // element.bind(
                //     'keydown keypress',
                //     function (event) {
                //         if (event.which == 65292 || event.which == 44) {
                //             scope.pushTo.push(ngModel.$modelValue.split(',').join('').split('，').join(''));
                //             scope.ngModel = '';
                //             scope.$apply( function () {
                //                 scope.ngModel = '';
                //             });
                //         } else {
                //             scope.$apply( function () {
                //                 try {
                //                     scope.ngModel = scope.ngModel.split(',').join('').split('，').join('');
                //                 } catch (e) {
                //                 }
                //             });
                //         }
                //     }
                // );
                /**
                 * This scope watch implementation is better, since we don't
                 * end up with comma left over in the input box.
                 */
                scope.$watch(
                    'ngModel',
                    function(newVal, oldVal) {
                        if (!newVal) {return}
                        if (newVal[newVal.length-1]=="," || newVal[newVal.length-1]=="，" || newVal[newVal.length-1]==" " ) {
                            scope.pushTo.push(ngModel.$modelValue.split(',').join('').split('，').join(''));
                            scope.ngModel = '';
                        }
                    }
                );
            }
        };
    });