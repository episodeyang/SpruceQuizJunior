/**
 * Created by ge on 3/1/14.
 */

angular.module('SpruceQuizApp')
    .directive('compile', ['$compile', '$parse', function ($compile, $parse) {
        return function (scope, element, attrs) {
            // do the parsing here to improve performance.
            var parsedExp = $parse(attrs.compile);
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
//                    return scope.$eval(attrs.compile);
                    return parsedExp(scope);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }]);
/**
 * for static recompile, the following works. but we usually
 * need the one above with dynamically loaded data.
 */
//    .directive('compile', ['$compile', function ($compile) {
//        return function (scope, element, attrs) {
//            var ensureCompileRunsOnce = scope.$watch(
//                function (scope) {
//                    // watch the 'compile' expression for changes
//                    return scope.$eval(attrs.compile);
//                },
//                function (value) {
//                    // when the 'compile' expression changes
//                    // assign it into the current DOM
//                    element.html(value);
//
//                    // compile the new DOM and link it to the current
//                    // scope.
//                    // NOTE: we only compile .childNodes so that
//                    // we don't get into infinite loop compiling ourselves
//                    $compile(element.contents())(scope);
//
//                    // Use Angular's un-watch feature to ensure compilation only happens once.
//                    ensureCompileRunsOnce();
//                }
//            );
//        };
//    }]);
/**
 * Configure MathJax to process with the following syntax.
 */
MathJax.Hub.Config({
    skipStartupTypeset: true,
    processUpdateTime: 1000,
    processUpdateDelay: 500,
    extensions: ["tex2jax.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
        inlineMath: [
            ['$', '$'],
            ["\\(", "\\)"]
        ],
        displayMath: [
            ['$$', '$$'],
            ["\\[", "\\]"]
        ],
        processEscapes: true
    },
    "HTML-CSS": { availableFonts: ["TeX"] }
});
MathJax.Hub.Configured();

angular.module('SpruceQuizApp')
    .directive("mathjaxBind", function () {
        return {
            restrict: "AE",
            controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
                $scope.$watch($attrs.mathjaxBind, function (value) {
                    $element.text(value == undefined ? "" : value);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                });
            }]
        };
    })
    .directive("mathjax", function () {
        return {
            restrict: "AE",
            link: function (scope, element, attrs) {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);
            }
        };
    })
    .directive("mathHtml", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs","$compile", function ($scope, $element, $attrs, $compile) {
                $scope.$watch($attrs.mathHtml, function (value) {
                    $element.html(value);
                    $compile($element.contents())($scope);
//                    $element.text(value == undefined ? "" : value);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                });
            }]
        };
    })
//    .directive('mathCompile', ['$compile', '$parse', function ($compile, $parse) {
//        return {
//            scope: { mathCompile : "=mathCompile" },
//            template: "<mathjax-link compile='mathCompile'> </mathjax-link>",
//            compile: function(scope, element, attrs) {
//                "use strict";
//                $observe('mathCompile', function (val) {});
//            }
//        }
//    }]);
