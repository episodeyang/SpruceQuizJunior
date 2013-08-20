'use strict';

var createSVG, updateBarChart, updateLineGraph, updatePieChart;

angular.module('SpruceQuizApp')
    .directive('d3BarChart', function () {

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
    .directive('d3LineGraph', function () {

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

angular.module('SpruceQuizApp')
    .directive('d3PieChart', function () {
    return {
      restrict: 'CE',
      terminal: true,
      scope: {
        data: '='
      },
      link: function (scope, element, attrs) {
        // set the values up
        scope.h = 400;
        scope.r = 150;
        scope.w = 400;

        // call function to make graph
        createSVG(scope, element);
        scope.$watch('data', updatePieChart, true);

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
      attr("x", function (datum, index) { return x(index); }).
      attr("y", function (datum) { return scope.h - y(datum.score); }).
      attr("dx", scope.barW / 2).
      attr("dy", "1.2em").
      attr("text-anchor", "middle").
      text(function (datum) { return datum.score; }).
      attr("fill", "white");
  scope.svg.selectAll("text.yAxis").
      data(newVal).
      enter().append("svg:text").
      attr("x", function (datum, index) { return x(index); }).
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
  y = d3.scale.linear().domain([0, d3.max(scope.data)]).range([scope.h - scope.margin, scope.margin]);
  x = d3.scale.linear().domain([0, scope.data.length]).range([scope.margin, scope.w - scope.margin]);

  g = scope.svg.append("svg:g");
  //.attr("transform", "translate(0, 200)");

  line = d3.svg.line()
      .x(function (d, i) {
        return x(i);
      })
      .y(function (d) {
        return y(d);
      });

  g.append("svg:path").attr("d", line(scope.data));

  g.append("svg:line")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", x(scope.w))
      .attr("y2", y(0));

  g.append("svg:line")
      .attr("x1", x(0))
      .attr("y1", y(0))
      .attr("x2", x(0))
      .attr("y2", y(d3.max(scope.data)));

  g.selectAll(".xLabel")
      .data(x.ticks(5))
      .enter().append("svg:text")
      .attr("class", "xLabel")
      .text(String)
      .attr("x", function (d) { return x(d); })
      .attr("y", y(0) + scope.margin)
      .attr("text-anchor", "middle");

  g.selectAll(".yLabel")
      .data(y.ticks(4))
      .enter().append("svg:text")
      .attr("class", "yLabel")
      .text(String)
      .attr("x", 0)
      .attr("y", function (d) { return y(d); })
      .attr("text-anchor", "right")
      .attr("dy", 4);

  g.selectAll(".xTicks")
      .data(x.ticks(5))
      .enter().append("svg:line")
      .attr("class", "xTicks")
      .attr("x1", function (d) { return x(d); })
      .attr("y1", y(0))
      .attr("x2", function (d) { return x(d); })
      .attr("y2", y(-0.3));

  g.selectAll(".yTicks")
      .data(y.ticks(4))
      .enter().append("svg:line")
      .attr("class", "yTicks")
      .attr("y1", function (d) { return y(d); })
      .attr("x1", x(-0.3))
      .attr("y2", function (d) { return y(d); })
      .attr("x2", x(0));

};

updatePieChart = function (newVal, oldVal, scope) {

  console.log(newVal);
  var arc, pie, arcs, color;
  // more minor helpers
  color = d3.scale.category20c();

  scope.svg
      .data([newVal])                   //associate our data with the document
      .attr("width", scope.w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
      .attr("height", scope.h)
      .append("svg:g")               //make a group to hold our pie chart
      .attr("transform", "translate(" + 1.1 * scope.r + "," + scope.r + ")");    //move the center of the pie chart from 0, 0 to radius, radius

  arc = d3.svg.arc()              //this will create <path> elements for us using arc data
      .outerRadius(scope.r);

  pie = d3.layout.pie()           //this will create arc data for us given a list of values
      .value(function (d) { return d.value; });    //we must tell it out to access the value of each element in our data array

  arcs = scope.svg.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
      .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties)
      .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
      .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
      .attr("class", "slice")    //allow us to style things in the slices (like text)
      .attr("transform", "translate(" + 1.1 * scope.r + "," + scope.r + ")");

  arcs.append("svg:path")
      .attr("fill", function (d, i) { return color(i); }) //set the color for each slice to be chosen from the color function defined above
      .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function

  arcs.append("svg:text")                                     //add a label to each slice
      .attr("transform", function (d) {                    //set the label's origin to the center of the arc
        //we have to make sure to set these before calling arc.centroid
      d.innerRadius = 0;
      d.outerRadius = scope.r;
      return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
    })
    .attr("text-anchor", "middle")                          //center the text on it's origin
    .text(function (d, i) { return scope.data[i].label; });        //get the label from our original data array

}