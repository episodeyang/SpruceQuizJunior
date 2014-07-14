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
    .directive("mathHtml", function () {
        return {
            restrict: "A",
            controller: ["$scope", "$element", "$attrs", "$compile", function ($scope, $element, $attrs, $compile) {
                $scope.$watch($attrs.mathHtml, function (value) {
                    $element.html(value == undefined ? "" : value);
                    $compile($element.contents())($scope);
                    MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
                });
            }]
        };
    });
angular.module('SpruceQuizApp')
    .factory('taMathUtil', ['$timeout', function($timeout){
        return {
            script: '',
            mathJaxParser: function (textvalue) {
                /* unconvert mathjax nodes here */
                if (textvalue.match(/something/g)) console.log('success!! ---=-=-=-=-=-=-=-=-======');
                if (textvalue) {
                    textvalue = textvalue
                        .replace(/<span class=\"MathJax_Preview\"><\/span>/g, '')
                        .replace(/<div class=\"MathJax_Display((?!<\/div).)*<\/div>/g, '')
                        .replace(/<script type=\"math\/tex; mode=display\" id="MathJax-Element-[0-9]+">(((?!<\/script>).)*)<\/script>/g, '$$$$$1$$$$')
                        .replace(/ class=\"ng-scope\"/g, '')
                        .replace(/<nobr>((?!<\/nobr>).)*<\/nobr>/g, '')
                        .replace(/<span class=\"MathJax[^>]*><\/span>/g, '')
                        .replace(/<script type=\"math\/tex\" id=\"MathJax-Element-[0-9]+\">(((?!<\/script>).)*)<\/script>/g, '$$$1$$')
                        .replace(/\sng-scope/g, '')
                        .replace(/\sng-binding/g, '')
                        .replace(/\sclass=\"\"/g, '')
                        .replace(/<span><\/span>/g, '') // removes all dangling spans.
                        .replace(/<p><\/p>/g, ''); // removes all dangling paragraphs.
                    console.log('mathjax Parsed! - ---------------');
                    console.log(textvalue);
                }
                return textvalue; // this must be the converted value
            },
            onOnce : function(_element, event, action){
                var _action = _element.off(event);
                _element.on(event, function (e){
                    action(e);
                    _action(e);
                    _element.on(event, _action);
                })
            },
            onOnceOffOriginal : function(_element, event, action){
                var _action = _element.off(event);
                _element.on(event, function (e){
                    action(e);
                    _element.on(event, _action);
                })
            },
            clearWatchers: function () {
                if (this.deregisterHandles) {
                    _.each(this.deregisterHandles, function (handle) {
                        handle();
                    });
                    this.deregisterHandles = [];
                }
            },
            addDeregisterHandle: function (handle) {
                "use strict";
                if (!this.deregisterHandles) {
                    this.deregisterHandles = [handle];
                } else {
                    this.deregisterHandles.push(handle);
                }
            }
        };
    }])
    .config(['$provide', function ($provide) {
        // see https://github.com/fraywing/textAngular/wiki/Setting-Defaults
        $provide.decorator('taOptions', ['taRegisterTool', 'textAngularManager', '$window', '$delegate', function (taRegisterTool, textAngularManager, $window, taOptions) {
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
            var mathOnSelectAction = function(event, $element, editorScope) {};

            var mathjaxToolAction = function(){
                var promptString;
                promptString = $window.prompt('please input math equations', '$$');
                if (promptString && promptString !== '') {
                    console.log(promptString);
                    var displayStr = promptString.match(/\$\$([^$]+)\$\$/);
                    var inlineStr = promptString.match(/\$([^$]+)\$/);
                    if (!displayStr && !inlineStr) inlineStr = promptString.match(/\\\(([^$]+)\)\\/);
                    // create the HTML
                    if (displayStr) {
                        var embed = '<div class="math-jax">' + promptString.toString() + '</div><p><br></p>';
//                            var embed = '<div math-jax="">' + promptString.toString() + '</div><p><br></p>';
                    } else if (inlineStr) {
                        var embed = '<span class="math-jax">' + promptString + '</span><span>&nbsp;</span>';
//                            var embed = '<span math-jax="">' + promptString + '</span><span>&nbsp;</span>';
                    }
                    // insert
                    pasteHtmlAtCaret(embed, false);
                    return this.$editor().updateTaBindtaTextElement();
                }
            };

            taRegisterTool('mathJax', {
                //iconclass: "fa",
                buttontext: '<span class="texhtml" style="font-family: \'CMU Serif\', cmr10, LMRoman10-Regular, \'Nimbus Roman No9 L\', \'Times New Roman\', Times, serif;">L<span style="text-transform: uppercase; font-size: 70%; margin-left: -0.36em; vertical-align: 0.3em; line-height: 0; margin-right: -0.15em;">a</span>T<span style="text-transform: uppercase; margin-left: -0.1667em; vertical-align: -0.5ex; line-height: 0; margin-right: -0.125em;">e</span>X</span>',
                action: mathjaxToolAction
                //onElementSelect: {
                //    element: 'span', 'div',
                //    withClass: 'math-jax',
                //    action: mathOnSelectAction
                //}
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
    .controller('taMathPopoverCtrl',
        ['$scope', 'taMathUtil', function($scope, taMathUtil) {
            if (!taMathUtil.taPopover) taMathUtil.taPopover = {};
            $scope.data = taMathUtil.taPopover;
    }])
    .directive('mathJax', ['$rootScope', '$compile', '$timeout', '$animate', 'taMathUtil', 'textAngularManager', function ($rootScope, $compile, $timeout, $animate, taMathUtil, textAngularManager) {
        return {
            restrict: 'ACE',
            requre: '^ngModel',
            priority: 1000, // to ensure that the ngModel has been edited by the ta-bind first
            scope: true, // $new() ProtoInherent. {} creates an empty new scope.
            controller: function($scope, $element, $attrs) {
                console.log('controller');
                if (!taMathUtil.taPopover) taMathUtil.taPopover = {};
                $scope.data = taMathUtil.taPopover;
                $scope.destroy = function () {
                    console.log('removing element!');
                    $element.remove();
                    $scope.updateTaBindtaTextElement();
                };
            },
            compile: function(tElement, tAttrs, transclude) {
                console.log("compile");
                /**
                 * directive rewrite. Use templates to allow editing on the fly.
                 */
                return function postLink(scope, iElement, iAttrs, ctrls) {
                    console.log('postLink');
                    tElement.on('click', function (event) {
                        event.preventDefault();
                        // this is to prevent the editor from loosing focus;
                        // the returned function is the original callback. Need that to recover.
                        //scope._editorElement.off('blur');
                        taMathUtil.onOnceOffOriginal(scope._editorElement, 'blur', function(e){e.preventDefault();});
//                        scope.displayElements.popoverContainer.on('focus', function(){
//                            taMathUtil.oneEvent(scope._editorElement, 'blur', function(e){e.preventDefault();});
//                        });

                        scope.displayElements.popover.css('width', '375px');
                        //scope.displayElements.popover.css('height', '9em');
                        scope.displayElements.popover.css('min-height', '2em');
                        scope.displayElements.popover.css('border-radius', '14px');

                        var container = scope.displayElements.popoverContainer;
                        container.empty();
                        var form = angular.element('<form class="form-horizontal no-bottom-margin" role="form" style="padding-right: 6px;" ng-controller="taMathPopoverCtrl">');
                        var formGroup = angular.element('<div class="form-group no-bottom-margin">');
                        var leftCol = angular.element('<div class="col-xs-10">');
                        var rightCol = angular.element('<div class="col-xs-2">');
//                        var remove = angular.element('<button type="button" class="btn btn-transparent btn-sm btn-small close" unselectable="on" tabindex="-1"><i class="fa fa-times"></i></button>');
                        var remove = angular.element('<button type="button" class="btn btn-transparent btn-sm btn-small close" unselectable="on" tabindex="-1"><i class="fa fa-trash-o"></i></button>');
                        remove.on('click', function(event){
                            event.preventDefault();
                            tElement.remove();
                            finishEdit();
                        });
                        var textarea = angular.element('<textarea type="text" class="form-control" style="z-index: 10;" rows="5" placeholder="请在这里输入LaTeX代码" ng-model="data.mathScript">');
                        textarea.on('click', function (event){
                            event.preventDefault();
                            event.stopPropagation();
                            this.focus();
                        }).on('keydown', function(event){
                            event.stopPropagation();
                        }).on('keyup', function(event){
                            event.stopPropagation();
                        });
                        leftCol.append(textarea);
                        rightCol.append(remove);
                        formGroup.append(leftCol);
                        formGroup.append(rightCol);
                        form.append(formGroup);
                        container.append(form);
                        $compile(container)(scope);

                        var mathFrameId = tElement.find('script').attr('id') + '-Frame';
                        scope.showPopover(tElement);
                        // deregistering all other $wathers
                        taMathUtil.clearWatchers();
                        //scope.showResizeOverlay([tElement.contents()[1], ]);

                        var deregister = scope.$watch('data.mathScript', function (newVal, oldVal) {
                            if (newVal == oldVal){ return ; }
                            console.log('data.mathScript just ran!         ' + newVal);
                            iElement.find('script').html(newVal);
                            $compile(iElement.contents())(scope);
                            MathJax.Hub.Queue(['Reprocess', MathJax.Hub, iElement[0]]);
                            MathJax.Hub.Queue(function(){textAngularManager.retrieveEditor(scope._editorName).scope.updateTaBindtaTextElement();});

//                            taMathUtil.onOnce(scope._editorElement, 'click keyup blur focus', function(){
//                                console.log('watch is unregistered!!');
//                                console.log(deregister());
//                                scope.$destroy();
//                            });
                        });
                        taMathUtil.addDeregisterHandle(deregister);
                    });
                };
            }
        };
    }])
    .directive('taMathjax', ['$compile', 'taMathUtil', 'textAngularManager', '$timeout', function ($compile, taMathUtil, textAngularManager, $timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            priority: 1000, // to ensure that the ngModel has been edited by the ta-bind first
            controller: ["$scope", "$element", "$attrs", "$transclude", "$compile", function ($scope, $element, $attrs, $transclude, $compile) {
                $scope._editorName = 'textAngularEditor' + $attrs.id.split('taTextElement')[1];
                taMathUtil[$scope._editorName] = {};
                $scope._editorElement = $element;
            }],
            compile: function(tElement, tAttrs) {
                "use strict";
                return {
                    pre: function  (scope, iElement, iAttrs, ngModel, transcludeFn) {
                    },
                    post: function (scope, iElement, iAttrs, ngModel, transcludeFn) {
                        taMathUtil[scope._editorName].ngModel = ngModel;
                        var _render;
                        // make sure 'this' is ngModel for original render call;
                        _render = ngModel.$render; // save the render function
                        ngModel.$render = function () {
                            _render.apply(ngModel);
                            $compile(iElement.contents())(scope);
                            /* Apply MathJax conversion here */
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, iElement[0]]);
                        };
                        scope.$setEditorViewValue = function(editorHtml){
                            ngModel.$setViewValue(editorHtml);
                        };
                        // unshift means it will be the first parser to run;
                        return ngModel.$parsers.unshift(taMathUtil.mathJaxParser);
                    }
                }
            }
        };
    }]);
