/**
 *
 * Created with JetBrains WebStorm.
 * User: Ge Yang
 * Date: 9/10/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

describe('Model test', function () {
    describe('when I call Model.test', function () {
        it('returns 1', function () {
            var $injector = angular.injector([ 'modelServices','ngResource' ]);
            var Model = $injector.get('Model');
            expect(Model.test).toEqual(1);
        });

    });

});

