'use strict';

angular.module('SpruceQuizApp')
.directive('accessLevel', ['$rootScope', 'Auth', function($rootScope, Auth) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var prevDisp = element.css('display');
            $rootScope.$watch('user.role', function(role) {
                if(!Auth.authorize(attrs.accessLevel))
                    element.css('display', 'none');
                else
                    element.css('display', prevDisp);
            });
        }
    };
}]);

angular.module('SpruceQuizApp').directive('activeNav', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var nestedA = element.find('a')[0];
            var path = nestedA.href;

            scope.location = location;
            scope.$watch('location.absUrl()', function(newPath) {
                if (path === newPath) {
                    element.addClass('active');
                } else {
                    element.removeClass('active');
                }
            });
        }

    };

}]);


//MathJax Directive
MathJax.Hub.Config({skipStartupTypeset: true});
MathJax.Hub.Configured();

angular.module('SpruceQuizApp')
.directive("mathjaxBind", function() {
    return {
        restrict: "A",
        controller: ["$scope", "$element", "$attrs", function($scope, $element, $attrs) {
            $scope.$watch($attrs.mathjaxBind, function(value) {
                $element.text(value == undefined ? "" : value);
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, $element[0]]);
            });
        }]
    };
});

//UI Directive

angular.module('SpruceQuizApp')
.directive('qmTypeahead', function($parse) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function postLink(scope, element, attrs, controller) {

                var getter = $parse(attrs.qmTypeahead),
                    setter = getter.assign,
                    value = getter(scope);

                // Watch qmTypeahead for changes
                scope.$watch(attrs.qmTypeahead, function(newValue, oldValue) {
                    if(newValue !== oldValue) {
                        value = newValue;
                    }
                });

                element.attr('data-provide', 'typeahead');
                element.typeahead({
                    source: function(query) { return angular.isFunction(value) ? value.apply(null, arguments) : value; },
                    minLength: attrs.minLength || 1,
                    items: attrs.items,
                    updater: function(value) {
                        // If we have a controller (i.e. ngModelController) then wire it up
                        if(controller) {
                            scope.$apply(function () {
                                controller.$setViewValue(value);
                            });
                        }
                        scope.$emit('typeahead-updated', value);
                        return value;
                    }
                });

                // Bootstrap override
                var typeahead = element.data('typeahead');
                // Fixes #2043: allows minLength of zero to enable show all for typeahead
                typeahead.lookup = function(ev) {
                    var items;
                    this.query = this.$element.val() || '';
                    if (this.query.length < this.options.minLength) {
                        return this.shown ? this.hide() : this;
                    }
                    items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source;
                    return items ? this.process(items) : this;
                };

                // Return true on every item, for example if the dropdown is populated with server-side sugggestions
                if(!!attrs.matchAll) {
                    typeahead.matcher = function(item) {
                        return true;
                    };
                }

                // Support 0-minLength
                if(attrs.minLength === '0') {
                    setTimeout(function() { // Push to the event loop to make sure element.typeahead is defined (breaks tests otherwise)
                        element.on('focus', function() {
                            element.val().length === 0 && setTimeout(element.typeahead.bind(element, 'lookup'), 200);
                        });
                    });
                }

            }
        };

    });
