
historicalBarChart = [ 
  {
    key: "Cumulative Return",
    values: [
      { 
        "label" : "Jan" ,
        "value" : 70
      } , 
      { 
        "label" : "Feb" , 
        "value" : 75
      } , 
      { 
        "label" : "Mar" , 
        "value" : 74
      } , 
      { 
        "label" : "Apr" , 
        "value" : 80
      } , 
      { 
        "label" : "May" ,
        "value" : 82
      } , 
      { 
        "label" : "Jun" , 
        "value" : 90
      } , 
      
    ]
  }
];




nv.addGraph(function() {  
  var chart = nv.models.discreteBarChart()
      .x(function(d) { return d.label })
      .y(function(d) { return d.value })
      .staggerLabels(true)
      //.staggerLabels(historicalBarChart[0].values.length > 8)
      .tooltips(false)
      .showValues(true)

  d3.select('#chart1 svg')
      .datum(historicalBarChart)
    .transition().duration(500)
      .call(chart);

  nv.utils.windowResize(chart.update);

  return chart;
});