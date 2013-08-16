'use strict';

var createSVG, updateBarChart, updateLineGraph;

angular.module('SpruceQuizApp')
    .directive('studentExamViz', function () {

    return {
      restrict: 'CE',
      terminal: true,
      scope: {
        data: '='
      },
      link: function (scope, element, attrs) {
        // set the values up
        scope.h = 300;
        scope.barW = 40;
        scope.w = (scope.barW + 30) * scope.data.length;
        console.log(scope.w);
        console.log(scope.data.length);

        // call function to make graph
        createSVG(scope, element);
        scope.$watch('data', updateBarChart, true);

      }
    };

  });

angular.module('SpruceQuizApp')
    .directive('studentSubjectViz', function () {

    return {
      restrict: 'CE',
      terminal: true,
      scope: {
        data: '='
      },
      link: function (scope, element, attrs) {
        // set the values up
        scope.h = 300;
        scope.margin = 20;
        scope.w = 400;
        console.log(scope.w);
        console.log(scope.data.length);

        // call function to make graph
        createSVG(scope, element);
        scope.$watch('data', updateLineGraph, true);

      }
    };
  });

// don't create if already exist
// avoid creating more than more svg
createSVG = function (scope, element) {

  if (!(scope.svg != null)) {
    return scope.svg = d3.select(element[0])
        .append("svg")
        .attr("width", scope.w)
        .attr("height", scope.h);
  }
};

// helper functions
updateBarChart = function (newVal, oldVal, scope) {
  var x = d3.scale.linear().domain([0, newVal.length]).range([0, scope.w]);
  var y = d3.scale.linear().domain([0, d3.max(newVal,
          function (datum) { return datum.score; })]).
      rangeRound([0, scope.h]);

  scope.svg.selectAll("rect").
      data(newVal).
      enter().
      append('svg:rect').
      attr('x', function (datum, index) {return x(index); }).
      attr('y', function (datum) {return scope.h - y(datum.score); }).
      attr('height', function (datum) {return y(datum.score); }).
      attr('width', scope.barW).
      attr('fill', '#2d578b');
  scope.svg.selectAll("text").
      data(newVal).
      enter().
      append("svg:text").
      attr("x", function (datum, index) { return x(index) ; }).
      attr("y", function (datum) { return scope.h - y(datum.score); }).
      attr("dx", scope.barW / 2).
      attr("dy", "1.2em").
      attr("text-anchor", "middle").
      text(function (datum) { return datum.score; }).
      attr("fill", "white");
  scope.svg.selectAll("text.yAxis").
      data(newVal).
      enter().append("svg:text").
      attr("x", function (datum, index) { return x(index) ; }).
      attr("y", scope.h).
      attr("dx", scope.barW / 2).
      attr("text-anchor", "middle").
      attr("style", "font-size: 12; font-family: Helvetica, sans-serif").
      text(function (datum) { return datum.exam_id; }).
      attr("transform", "translate(0, 28)").
      attr("fill", "black").
      attr("class", "yAxis");
};

updateLineGraph = function (newVal, oldVal, scope) {
  var y, x, line, g;
  y = d3.scale.linear().domain([0, d3.max(scope.data)]).range([0 + scope.margin, scope.h - scope.margin]);
  x = d3.scale.linear().domain([0, scope.data.length]).range([0 + scope.margin, scope.w - scope.margin]);

  g = scope.svg.append("svg:g")
      .attr("transform", "translate(0, 200)");

  line = d3.svg.line()
    .x(function (d, i) {
      return x(i);
    })
    .y(function (d) {
      return -1 * y(d);
    });

  g.append("svg:path").attr("d", line(scope.data));

  g.append("svg:line")
      .attr("x1", x(0))
      .attr("y1", -1 * y(0))
      .attr("x2", x(scope.w))
      .attr("y2", -1 * y(0));

  g.append("svg:line")
      .attr("x1", x(0))
      .attr("y1", -1 * y(0))
      .attr("x2", x(0))
      .attr("y2", -1 * y(d3.max(scope.data)));

  g.selectAll(".xLabel")
      .data(x.ticks(5))
      .enter().append("svg:text")
      .attr("class", "xLabel")
      .text(String)
      .attr("x", function (d) { return x(d); })
      .attr("y", 0)
      .attr("text-anchor", "middle");

  g.selectAll(".yLabel")
      .data(y.ticks(4))
      .enter().append("svg:text")
      .attr("class", "yLabel")
      .text(String)
      .attr("x", 0)
      .attr("y", function (d) { return -1 * y(d); })
      .attr("text-anchor", "right")
      .attr("dy", 4);

  g.selectAll(".xTicks")
      .data(x.ticks(5))
      .enter().append("svg:line")
      .attr("class", "xTicks")
      .attr("x1", function (d) { return x(d); })
      .attr("y1", -1 * y(0))
      .attr("x2", function (d) { return x(d); })
      .attr("y2", -1 * y(-0.3));

  g.selectAll(".yTicks")
      .data(y.ticks(4))
      .enter().append("svg:line")
      .attr("class", "yTicks")
      .attr("y1", function (d) { return -1 * y(d); })
      .attr("x1", x(-0.3))
      .attr("y2", function (d) { return -1 * y(d); })
      .attr("x2", x(0));

};