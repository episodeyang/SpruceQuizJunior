'use strict';
/* Controllers */

angular.module('SpruceQuizApp')
.controller('HomeCtrl',
['$filter','$rootScope', '$scope', 'Sections','Units','Materials','Students','Model',
    function($filter, $rootScope, $scope, Sections, Units, Materials, Students, Model) {
        $scope.model = {}
        $scope.model.user =$rootScope.user
        $scope.model.sections=[]
        $scope.Model = Model;
        $scope.model.subjects = Students.onErrata.list()

        $scope.viewCtrol={};
        $scope.viewCtrol.showErrataForm = false;
        //console.log($scope.user)
        //console.log($rootScope.userRoles)
        //console.log($rootScope.accessLevels)

        Students.onErrata.get({id: '' }
            ,function(results){
                $scope.model.sections = results;
                console.log('printing out the sections')
                console.log($scope.model.sections)
            }
        )

        //Students.onErrata.create({id:})

        $scope.model.feeds = Sections.onFeeds.get({uuid: 'g1', flim: '50'});

        //$rootScope.model.sections = Students.onSections.get({uuid: 'u1'});

        //console.log($scope.user.userRoles)
    //    $scope.sectionUnits = Sections.onUnits.get({uuid: this.section.sectionUUID})
        $scope.updateSection = function(index){
            Sections.onUnits.get({uuid: $scope.model.sections[index].sectionUUID}
                ,function(results){
                    //console.log(results);
                    $scope.model.sections[index].sectionUnits = results;
                    $scope.grabMaterials(results[0].unitUUID)

                }
                ,function(err){
                    $rootScope.error = "Failed to fetch sections"
                }
            );
        }

        $scope.model.unitID = "d1";
        $scope.grabMaterials = function(unitId){
            //$scope.model.unitID = unitId;
            $scope.model.tempUnit = Units.onUnits.get({uuid: unitId});
        };

        $scope.createNewSection = function(){
            $scope.newSection.sectionUUID = "new";
            $scope.newSection.sectionUnits = [];
            Sections.onSections.save($scope.newSection);
            $scope.list.push($scope.newSection);
        };

        $scope.closeAlert = function(index) {
            $scope.model.feeds.splice(index, 1);
            //console.log("print test");
        };
}]);

//ProblemCtrl.$inject = ['$scope', '$http'];


//function PhoneDetailCtrl($scope, $routeParams) {
//    $scope.phoneId = $routeParams.phoneId;
//}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams'];