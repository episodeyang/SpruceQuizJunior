/**
 *
 * front end spec code using Karma and Jasmin
 */

'use strict';

describe('Model test', function () {
    // a rather trivial hello world example, need to clean up later
    describe('when I call Model.test', function () {
        it('returns 1', function () {
            var $injector = angular.injector([ 'modelServices','ngResource' ]);
            var Model = $injector.get('Model');
            expect(Model.test).toEqual(1);
        });

    });

});

