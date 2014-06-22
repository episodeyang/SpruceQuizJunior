'use strict';

angular.module('SpruceQuizApp')
    .filter('mapStudents', function () {
        return function (input, query) {
            if (!query || !query.schools || !query.sections) return input;
            if (query.schools.length == 0 && query.sections.length == 0) return input;
            var result = [];
            angular.forEach(input, function (student) {
                if (query.schools.length == 0) {
                    angular.forEach(query.sections, function (section) {
                        if (student.sections.indexOf(section) > -1) {
                            result.push(student);
                        }
                    });
                } else {
                    angular.forEach(query.schools, function (school) {
                        if (student.schools.indexOf(school) > -1) {
                            if (query.sections.length == 0) {
                                result.push(student);
                            } else {
                                angular.forEach(query.sections, function (section) {
                                    if (student.sections.indexOf(section) > -1) {
                                        result.push(student);
                                    }
                                });
                            }
                        }
                        ;
                    });
                }
            });
            //console.log("result");
            //console.log(result);
            return result;
        }
    })
    .filter('noIdField', ['_', function (_) {
        return function (array) {
            if (!array){return array;}
            var out = [];

            function filter(element) {
                if (!element._id) out.push(element);
            }

            angular.forEach(array, filter);
            if (out.length == array.length ) {
                return array;
            } else {
                return out;
            }
        }
    }])
    .filter('hasIdField', ['_', function (_) {
        return function (array) {
            if (!array){return array;}
            var out = [];

            function filter(element) {
                if (element._id) out.push(element);
            }

            angular.forEach(array, filter);
            if (out.length == array.length ) {
                return array;
            } else {
                return out;
            }
        }
    }]);
