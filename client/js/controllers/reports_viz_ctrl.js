'use strict';


/* Toy data for demo purposes; will be fetched through the database in the future */
var mydata = [{exam_id: "一月统练", score: 70},
  {exam_id: "二月统练", score: 73},
  {exam_id: "三月统练", score: 80},
  {exam_id: "四月统练", score: 82},
  {exam_id: "五月统练", score: 81},
  {exam_id: "六月统练", score: 88}
  ];

// these data don't work yet
var mydata_chinese = [{exam_id: "一月统练", score: 80}, {exam_id: "二月统练", score: 78}, {exam_id: "三月统练", score: 88}];
var mydata_math = [{exam_id: "一月统练", score: 89}, {exam_id: "二月统练", score: 82}, {exam_id: "三月统练", score: 88}];
var mydata_english = [{exam_id: "一月统练", score: 84}, {exam_id: "二月统练", score: 85}, {exam_id: "三月统练", score: 90}];

// this is for the line char
var student_subject_ranking = [[14, 20, 5, 48, 21], [1, 5, 4, 9, 2], [50, 32, 15, 30, 22]];
var test_line = [14, 20, 5, 48, 21, 50, 32, 15, 30, 22, 12, 15, 17];

// piechar data
var pie_data = [{"label": "作文", "value": 20},
  {"label": "阅读理解", "value": 50},
  {"label": "古文", "value": 30}];

// stacked data
var stacked_bar_data = [{x: "abc",  y1: "3",  y2: "4",  y3: "10"},
  {x: "abc2", y1: "6",  y2: "-2", y3: "-3" },
  {x: "abc3", y1: "-3", y2: "-9", y3: "4"}];

/* Controllers */

angular.module('SpruceQuizApp')
  .controller('ReportVizCtrl', function ($scope) {
    console.log("calling from controller");
    console.log($scope);
    console.log("done with controller");
    $scope.data = mydata;

    // these functions need to be fixed later
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

angular.module('SpruceQuizApp')
  .controller('StudentVizCtrl', function ($scope) {
    //$scope.data = student_subject_ranking;
    console.log("yay student viz controller calling");
    $scope.data = test_line;
  });

angular.module('SpruceQuizApp')
  .controller('topicDistroCtrl', function ($scope) {
    //$scope.data = student_subject_ranking;
    console.log("topic distro calling");
    $scope.data = pie_data;
  });

angular.module('SpruceQuizApp')
    .controller('timeSpendingCtrl', function ($scope) {
      console.log("stacked bar chart calling");
      $scope.data = stacked_bar_data;
    });