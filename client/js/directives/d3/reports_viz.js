angular.module('SpruceQuizApp')
    .directive('studentExamViz', function () {
    var barWidth = 40;
    var height = 260;

    return {
      restrict: 'CE',
      terminal: true,
      scope: {
        data: '='
      },
      link: function (scope, element, attrs) {
        console.log("calling from directive");
        console.log(scope);
        console.log(scope.data);

        var plotWithData = function () {
          var data = scope.data;

          // set the values up
          var width = (barWidth + 10) * data.length;
          var x = d3.scale.linear().domain([0, data.length]).range([0, width]);
          var y = d3.scale.linear().domain([0, d3.max(data,
                  function (datum) { return datum.score; })]).
              rangeRound([0, height]);

          var chart = d3.select(element[0])
              .append('svg')
              .attr('width', width)
              .attr('height', height);

          chart.selectAll("rect").data(data).
              data(data).
              enter().
              append('svg:rect').
              attr('x', function (datum, index) {return x(index); }).
              attr('y', function (datum) {return height - y(datum.score); }).
              attr('height', function (datum) {return y(datum.score); }).
              attr('width', barWidth).
              attr('fill', '#2d578b');
          chart.selectAll("text").
              data(data).
              enter().
              append("svg:text").
              attr("x", function (datum, index) { return x(index) + barWidth; }).
              attr("y", function (datum) { return height - y(datum.score); }).
              attr("dx", -barWidth / 2).
              attr("dy", "1.2em").
              attr("text-anchor", "middle").
              text(function (datum) { return datum.score; }).
              attr("fill", "white");
          chart.selectAll("text.yAxis").
              data(data).
              enter().append("svg:text").
              attr("x", function (datum, index) { return x(index) + barWidth; }).
              attr("y", height).
              attr("dx", -barWidth / 2).
              attr("text-anchor", "middle").
              attr("style", "font-size: 12; font-family: Helvetica, sans-serif").
              text(function (datum) { return datum.exam_id; }).
              attr("transform", "translate(0, 18)").
              attr("fill", "black").
              attr("class", "yAxis");
        };

        scope.$watch('data', plotWithData, true);

        }
    };

  });