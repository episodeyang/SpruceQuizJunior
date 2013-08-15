'use strict';


/* Toy data for demo purposes; will be fetched through the database in the future */
var mydata = [{exam_id: "一月统练", score: 70}, {exam_id: "二月统练", score: 73}, {exam_id: "三月统练", score: 80}];
var mydata_chinese = [{exam_id: "一月统练", score: 80}, {exam_id: "二月统练", score: 78}, {exam_id: "三月统练", score: 88}];
var mydata_math = [{exam_id: "一月统练", score: 89}, {exam_id: "二月统练", score: 82}, {exam_id: "三月统练", score: 88}];
var mydata_english = [{exam_id: "一月统练", score: 84}, {exam_id: "二月统练", score: 85}, {exam_id: "三月统练", score: 90}];

/* Controllers */

angular.module('SpruceQuizApp')
  .controller('ReportVizCtrl', function ($scope) {
    console.log("calling from controller");
    console.log($scope);
    console.log("done with controller");
    $scope.data = mydata;
    $scope.getChineseScore = function () {
      $scope.data = mydata_chinese;
    };
    $scope.getMathScore = function () {
      $scope.data = mydata_math;
    };
    $scope.getEnglishScore = function () {
      $scope.data = mydata_english;
    };
  });