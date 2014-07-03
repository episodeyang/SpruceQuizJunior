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
            controller: ["$scope", "$element", "$attrs", "$compile", function ($scope, $element, $attrs, $compile) {
                $scope.$watch($attrs.mathHtml, function (value) {
                    $element.html(value);
                    $compile($element.contents())($scope);
//                    $element.text(value == undefined ? "" : value);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });

angular.module('SpruceQuizApp')
    .config(['$provide', function ($provide) {
        // see https://github.com/fraywing/textAngular/wiki/Setting-Defaults
        $provide.decorator('taOptions', ['$delegate', function (taOptions) {
            // see https://github.com/fraywing/textAngular/issues/235
            taOptions.setup.textEditorSetup = function ($element) {
                $element.attr("ta-mathjax", "taMathJax");
            };
            return taOptions;
        }]);
    }])
    .directive('taMathjax', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1000, // to ensure that the ngModel has been edited by the ta-bind first
            link: function (scope, element, attrs, ngModel) {
                //var ngModel, _render;
                //ngModel = controllers[0];
                var _render;
                _render = ngModel.$render; // save the render function
                ngModel.$render = function () {
                    //$compile(element.contents())(scope);
                    /* Apply MathJax conversion here */
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);

                    // make sure 'this' is ngModel for original render call;
                    return _render.apply(ngModel);
                };
                // unshift means it will be the first parser to run;
                return ngModel.$parsers.unshift(function (textvalue) {

                    /* unconvert mathjax nodes here */
                    console.log(textvalue.slice(0, 150));
                    textvalue = textvalue
                        .replace(/<span class=\"MathJax_Preview\"><\/span>/g, '')
                        .replace(/<div class=\"MathJax_Display"((?!<\/div).)*<\/div>/g, '')
                        .replace(/<script type=\"math\/tex; mode=display\" id="MathJax-Element-[0-9]+">(((?!<\/script>).)*)<\/script>/g, '$$$$$1$$$$');

                    textvalue = textvalue
                        .replace(/<nobr>((?!<\/nobr>).)*<\/nobr>/g, '')
                        .replace(/<span class=\"MathJax\" [^>]*><\/span>/g, '')
                        .replace(/<script type=\"math\/tex\" id=\"MathJax-Element-[0-9]+\">(((?!<\/script>).)*)<\/script>/g, '$$$1$$')
                        .replace(/ class=\"ng-scope\"/g, '');
                    console.log(textvalue);
                    return textvalue; // this must be the converted value
                });
            }
        };
    }]);
