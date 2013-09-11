/**
 *
 * Created with JetBrains WebStorm.
 * User: Ge Yang
 * Date: 9/10/13
 * Time: 8:41 PM
 * To change this template use File | Settings | File Templates.
 */

'use strict';

describe('Controller: MainCtrl', function () {

    // load the controller's module
    beforeEach(module('yoTempApp'));

    var MainCtrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        MainCtrl = $controller('MainCtrl', {
            $scope: scope
        });
    }));

    it('should attach a list of awesomeThings to the scope', function () {
        expect(scope.awesomeThings.length).toBe(3);
    });
});
