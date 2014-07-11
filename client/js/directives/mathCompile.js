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
    .directive("mathjaxBind", function() {
        /**
         * <span mathjax-bind="expression"></span>
         * expression can be of the form: \( \)
         */
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs",
                function($scope, $element, $attrs) {
                    $scope.$watch($attrs.mathjaxBind, function(value) {
                        var $script = angular
                                        .element("<script type='math/tex'>")
                                        .html(value == undefined ? "" : value);
                        $element.html("");
                        $element.append($script);
                        MathJax.Hub.Queue(["Reprocess", MathJax.Hub, $element[0]]);
                    });
                }]
        };
    })
//    .directive("mathjax", function () {
//        return {
//            restrict: "AE",
//            link: function (scope, element, attrs) {
//                MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);
//            }
//        };
//    })
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
        $provide.decorator('taOptions', ['taRegisterTool', 'textAngularManager', '$window', '$delegate', function (taRegisterTool, textAngularManager, $window, taOptions) {
            mathOnSelectAction = function (event, $element, editorScope) {
                alert('Lets show this!');
                // setup the editor toolbar
                // Credit to the work at http://hackerwins.github.io/summernote/ for this editbar logic/display
                // Credit to the work at https://github.com/fraywing/textAngular/blob/master/src/textAngularSetup.js#L370-L460
                var finishEdit = function(){
                    editorScope.updateTaBindtaTextElement();
                    editorScope.hidePopover();
                };
                event.preventDefault();
                editorScope.displayElements.popover.css('width', '375px');
                var container = editorScope.displayElements.popoverContainer;
                container.empty();
                var buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
                var fullButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">100% </button>');
                fullButton.on('click', function(event){
                    event.preventDefault();
                    $element.css({
                        'width': '100%',
                        'height': ''
                    });
                    finishEdit();
                });
                var halfButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">50% </button>');
                halfButton.on('click', function(event){
                    event.preventDefault();
                    $element.css({
                        'width': '50%',
                        'height': ''
                    });
                    finishEdit();
                });
                var quartButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">25% </button>');
                quartButton.on('click', function(event){
                    event.preventDefault();
                    $element.css({
                        'width': '25%',
                        'height': ''
                    });
                    finishEdit();
                });
                var resetButton = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1">Reset</button>');
                resetButton.on('click', function(event){
                    event.preventDefault();
                    $element.css({
                        width: '',
                        height: ''
                    });
                    finishEdit();
                });
                buttonGroup.append(fullButton);
                buttonGroup.append(halfButton);
                buttonGroup.append(quartButton);
                buttonGroup.append(resetButton);
                container.append(buttonGroup);

                buttonGroup = angular.element('<div class="btn-group" style="padding-right: 6px;">');
                var floatLeft = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-left"></i></button>');
                floatLeft.on('click', function(event){
                    event.preventDefault();
                    $element.css('float', 'left');
                    finishEdit();
                });
                var floatRight = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-right"></i></button>');
                floatRight.on('click', function(event){
                    event.preventDefault();
                    $element.css('float', 'right');
                    finishEdit();
                });
                var floatNone = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-align-justify"></i></button>');
                floatNone.on('click', function(event){
                    event.preventDefault();
                    $element.css('float', '');
                    finishEdit();
                });
                buttonGroup.append(floatLeft);
                buttonGroup.append(floatNone);
                buttonGroup.append(floatRight);
                container.append(buttonGroup);

                buttonGroup = angular.element('<div class="btn-group">');
                var remove = angular.element('<button type="button" class="btn btn-default btn-sm btn-small" unselectable="on" tabindex="-1"><i class="fa fa-trash-o"></i></button>');
                remove.on('click', function(event){
                    event.preventDefault();
                    $element.remove();
                    finishEdit();
                });
                buttonGroup.append(remove);
                container.append(buttonGroup);

                editorScope.showPopover($element);
                editorScope.showResizeOverlay($element);
            };
            function pasteHtmlAtCaret(html, selectPastedContent) {
                var sel, range;
                if (window.getSelection) {
                    // IE9 and non-IE
                    sel = window.getSelection();
                    if (sel.getRangeAt && sel.rangeCount) {
                        range = sel.getRangeAt(0);
                        range.deleteContents();

                        // Range.createContextualFragment() would be useful here but is
                        // only relatively recently standardized and is not supported in
                        // some browsers (IE9, for one)
                        var el = document.createElement("div");
                        el.innerHTML = html;
                        var frag = document.createDocumentFragment(), node, lastNode;
                        while ( (node = el.firstChild) ) {
                            lastNode = frag.appendChild(node);
                        }
                        var firstNode = frag.firstChild;
                        range.insertNode(frag);

                        // Preserve the selection
                        if (lastNode) {
                            range = range.cloneRange();
                            range.setStartAfter(lastNode);
                            if (selectPastedContent) {
                                range.setStartBefore(firstNode);
                            } else {
                                range.collapse(true);
                            }
                            sel.removeAllRanges();
                            sel.addRange(range);
                        }
                    }
                } else if ( (sel = document.selection) && sel.type != "Control") {
                    // IE < 9
                    var originalRange = sel.createRange();
                    originalRange.collapse(true);
                    sel.createRange().pasteHTML(html);
                    if (selectPastedContent) {
                        range = sel.createRange();
                        range.setEndPoint("StartToStart", originalRange);
                        range.select();
                    }
                }
            }
            taRegisterTool('mathJax', {
                iconclass: "fa",
                buttontext: '<span class="texhtml" style="font-family: \'CMU Serif\', cmr10, LMRoman10-Regular, \'Nimbus Roman No9 L\', \'Times New Roman\', Times, serif;">L<span style="text-transform: uppercase; font-size: 70%; margin-left: -0.36em; vertical-align: 0.3em; line-height: 0; margin-right: -0.15em;">a</span>T<span style="text-transform: uppercase; margin-left: -0.1667em; vertical-align: -0.5ex; line-height: 0; margin-right: -0.125em;">e</span>X</span>',
                action: function(){
                    var promptString;
                    promptString = $window.prompt('please input math equations', '$$');
                    if (promptString && promptString !== '') {
                        console.log(promptString);
                        var displayStr = promptString.match(/\$\$([^$]+)\$\$/);
                        var inlineStr = promptString.match(/\$([^$]+)\$/);
                        if (!displayStr && !inlineStr) inlineStr = promptString.match(/\\\(([^$]+)\)\\/);
                        // console.log('now print displayStr');
                        // console.log(displayStr);
                        // console.log('now print inlineStr');
                        // console.log(inlineStr);
                        // create the HTML
                        if (displayStr) {
                            var embed = '<div class="math-jax">' + promptString.toString() + '</div><p><br></p>';
                            console.log(embed);
                            // console.log(this.$editor());
                        } else if (inlineStr) {
                            console.log('this is inline');
                            console.log(promptString);
                            console.log(embed);
                            console.log(document);
                            var embed = '<span class="math-jax">' + promptString + '</span><span>&nbsp;</span>';
                        }
                        // insert
                        pasteHtmlAtCaret(embed, false);
                        return this.$editor().updateTaBindtaTextElement();
                        // get the video ID
                        /* istanbul ignore else: if it's invalid don't worry - though probably should show some kind of error message */
                    }
                },
                onElementSelect: {
                    element: 'font',
                    onlyWithAttrs: ['color'],
                    action: mathOnSelectAction
                }
            });
            taOptions.toolbar = [
                ['redo', 'undo', 'clear'],
                ['h3', 'h4'], ['p', 'pre', 'quote'],
                ['bold', 'italics', 'underline'], ['ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'],
                ['mathJax'], ['insertImage', 'insertLink', 'unlink'],
                ['html']
            ];
            // see https://github.com/fraywing/textAngular/issues/235
            taOptions.setup.textEditorSetup = function ($element) {
                $element.attr("ta-mathjax", '');
            };
            return taOptions;
        }]);
    }])
    .directive('mathJax', ['$compile', function ($compile) {
        return {
            restrict: 'ACE',
//            require: 'ngModel',
            priority: 1000, // to ensure that the ngModel has been edited by the ta-bind first
            link: function (scope, element, attrs, ngModel) {
//                console.log(element);
                element.on('click', function (){
                    alert('just clicked this!');
                    //console.log('just clicked this!')
                });
                /* Apply MathJax conversion here */
                return MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);
//                var innerHtml = element.html().split('$$')[1];
//                var $script = angular
//                    .element("<script type='math/tex; mode=display'>")
//                    .html(innerHtml);
//                element.html("");
//                element.append($script);
//                return MathJax.Hub.Queue(["Reprocess", MathJax.Hub, element[0]]);
            }
        };
    }])
    .directive('taMathjax', ['$compile', function ($compile) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1000, // to ensure that the ngModel has been edited by the ta-bind first
            link: function (scope, element, attrs, ngModel) {
//                var ngModel, _render;
//                ngModel = controllers[0];
                var _render;
                _render = ngModel.$render; // save the render function
                ngModel.$render = function () {
                    $compile(element.contents())(scope);
                    /* Apply MathJax conversion here */
//                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, element[0]]);

                    // make sure 'this' is ngModel for original render call;
                    return _render.apply(ngModel);
                };
                // unshift means it will be the first parser to run;
                return ngModel.$parsers.unshift(function (textvalue) {

                    /* unconvert mathjax nodes here */
                    console.log(textvalue);
                    textvalue = textvalue
                        .replace(/<span class=\"MathJax_Preview\"><\/span>/g, '')
                        .replace(/<div class=\"MathJax_Display((?!<\/div).)*<\/div>/g, '')
                        .replace(/<script type=\"math\/tex; mode=display\" id="MathJax-Element-[0-9]+">(((?!<\/script>).)*)<\/script>/g, '$$$$$1$$$$')
                        .replace(/ class=\"ng-scope\"/g, '')
                        .replace(/<nobr>((?!<\/nobr>).)*<\/nobr>/g, '')
                        .replace(/<span class=\"MathJax[^>]*><\/span>/g, '')
                        .replace(/<script type=\"math\/tex\" id=\"MathJax-Element-[0-9]+\">(((?!<\/script>).)*)<\/script>/g, '$$$1$$')
                        .replace(/\sng-scope/g, '')
                        .replace(/\sclass=\"\"/g, '')
                        .replace(/<span><\/span>/g, '') // removes all dangling spans.
                        .replace(/<p><\/p>/g, ''); // removes all dangling paragraphs.
                    console.log(textvalue);
                    return textvalue; // this must be the converted value
                });
            }
        };
    }]);
