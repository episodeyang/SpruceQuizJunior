'use strict';

/* Controllers */

angular.module('SpruceQuizApp')
.controller('ErrataCtrl',
['$filter','$routeParams','$rootScope', '$scope', 'Sections','Units','Materials','Students','Model','dataModel',
    function($filter, $routeParams, $rootScope, $scope, Sections, Units, Materials, Students, Model, dataModel) {


        $scope.model = {}
        $scope.model.user =$rootScope.user
        $scope.model.sections=[]

        $scope.model.erratum = {}
        $scope.model.erratum['_id'] = $routeParams.errataId;

        $scope.Model = Model;
        $scope.Model['problemNotes'] = [
            {   numberId: "124",
                problemId: "",
                tagName:"东城区统测",
                mainText:"二元一次不等式\\(A_x+B_y+C_z\\)",
                reasons:["审题不清", "概念模糊"],
                note: "审题不清，没有看到题干中对角度的要求",
                problem: dataModel.problems[0]
            },
            {   numberId: "125",
                problemId: "",
                tagName:"西城区第一次模拟",
                mainText:"二元一次不等式\\(A_x+B_y+C\\)",
                reasons:["审题不清", "概念模糊"],
                note: "审题不清，没有看到题干中对角度的要求",
                problem: dataModel.problems[1]
            },
            {   numberId: "126",
                problemId: "",
                tagName:"东城区统测",
                mainText:"二元一次不等式\\(A_x+B_y+C\\)",
                reasons:["审题不清", "概念模糊"],
                note: "审题不清，没有看到题干中对角度的要求",
                problem: dataModel.problems[2]
            },
        ];
        //console.log($scope.user)
        //console.log($rootScope.userRoles)
        //console.log($rootScope.accessLevels)

        Students.onSections.get({uuid: $scope.model.user.id}
            ,function(results){
                $scope.model.sections = results;
                console.log('printing out the sections')
                console.log($scope.model.sections)
            }
        )

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