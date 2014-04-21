'use strict';

(function (exports) {
    if (typeof require !== 'undefined') {
        exports.jsSHA = require('jssha');
        console.log('require jssha module');
    }

    var config = {
        numberOfRuns: 1051
    };

    function passwordHash(string, ind) {
        if (ind >= 1) {
            return new exports.jsSHA(passwordHash(string, ind - 1), 'TEXT').getHash('SHA-256', 'HEX');
        } else {
            return new exports.jsSHA(string, 'TEXT').getHash('SHA-256', 'HEX');
        }
    }

    exports.getHash = function (string) {
        if (typeof require === 'undefined') {
            exports.jsSHA = jsSHA;
        }
        return passwordHash(string, config.numberOfRuns);
    };

})(typeof exports === 'undefined' ? this.passwordHash = {} : exports);