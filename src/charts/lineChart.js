// bar_chart.js
// import * as d3_selection from 'd3-selection';
// import {max as d3_max, extent as d3_extent} from 'd3-array';
// import * as d3_scale from 'd3-scale';
// import * as d3_axis from 'd3-axis';
// import * as d3_shape from 'd3-shape';

import * as d3 from 'd3';

export function chart() {
  // properties for the chart
  var xValues = [function(d) { return d; }],
      yValues = [function(d) { return d; }],
      x_domain, y_domain,
      // default to some height - zeros would confuse some users
      width = 700,
      height = 400,
      chartClass = 'chart',
      // default to zero margins
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      x_axis_title = '', y_axis_title = '';

  // d3 components that we want to make available on getters
  var x = d3.scaleTime();
  var y = d3.scaleLinear();

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);

  var chartG;

  function line_chart(selection) {

    // do some error handling
    if(xValues.length != yValues.length){
      console.error("xValues and yValues must be of the same length", {xValues: xValues, yValues: yValues})
    }



    selection.each(function(data, i) {

      // figure out the charts height and width to fit with the margins
      var chartHeight = height - margin.top - margin.bottom,
          chartWidth = width - margin.left - margin.right;

      // select the element that we want to append the chart to
      chartG = d3.select(this)
                  .append('g')
                  .attr('class', chartClass)
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      if (!x_domain) {
        x_domain = d3.extent(data, xValues[0]);
      }
      if (!y_domain) {
        y_domain = [0, d3.max(data, yValues[0])];
      }

      x.domain(x_domain);
      y.domain(y_domain);

      x.range([0, chartWidth]);
      y.range([chartHeight, 0]);

      var line_paths = [];

      xValues.forEach( function (xv, i){
        line_paths.push(
          d3.line()
          .x(function(d) { return x(xValues[i](d)); })
          .y(function(d) { return y(yValues[i](d)); })
        )
      })

      // var line_path = d3.line()
      //     .x(function(d) { return x(xValue(d)); })
      //     .y(function(d) { return y(yValue(d)); });

      chartG.append('g')
          .attr('class', 'axis xAxis')
          .attr('transform', 'translate(0,' + chartHeight + ')')
          .call(xAxis);

      chartG.append('g')
          .attr('class', 'axis yAxis')
          .call(yAxis)

      line_paths.forEach( function(lp, i){
        chartG.append('path')
          .datum(data)
          .attr('class', 'line')
          .attr('d', lp);
      })
      // chartG.append('path')
      //     .datum(data)
      //     .attr('class', 'line')
      //     .attr('d', line_path);
    });
  }


  // getters / setters

  line_chart.xValues = function(val) {
    if (!arguments.length) { return xValue; }
    xValues = val;
    return line_chart;
  };

  line_chart.yValues = function(val) {
    if (!arguments.length) { return yValue; }
    yValues = val;
    return line_chart;
  };

  // line_chart.xValue = function(val) {
  //   if (!arguments.length) { return xValue; }
  //   xValue = val;
  //   return line_chart;
  // };

  // line_chart.yValue = function(val) {
  //   if (!arguments.length) { return yValue; }
  //   yValue = val;
  //   return line_chart;
  // };

  line_chart.width = function(val) {
    if (!arguments.length) { return width; }
    width = val;
    return line_chart;
  };

  line_chart.height = function(val) {
    if (!arguments.length) { return height; }
    height = val;
    return line_chart;
  };

  line_chart.margin = function(val) {
    if (!arguments.length) { return margin; }
    margin = val;
    return line_chart;
  };

  line_chart.xAxisTitle = function(val) {
    if (!arguments.length) { return x_axis_title; }
    x_axis_title = val;
    return line_chart;
  };

  line_chart.yAxisTitle = function(val) {
    if (!arguments.length) { return y_axis_title; }
    y_axis_title = val;
    return line_chart;
  };

  line_chart.x = function(val) {
    if (!arguments.length) { return x; }
    x = val;
    return line_chart;
  };

  line_chart.y = function(val) {
    if (!arguments.length) { return y; }
    y = val;
    return line_chart;
  };

  line_chart.xDomain = function(val) {
    if (!arguments.length) { return x_domain; }
    x_domain = val;
    return line_chart;
  };

  line_chart.yDomain = function(val) {
    if (!arguments.length) { return y_domain; }
    y_domain = val;
    return line_chart;
  };

  line_chart.g = function() {
    return chartG;
  };

  line_chart.xAxis = function() {
    return xAxis;
  };

  line_chart.yAxis = function() {
    return yAxis;
  };

  line_chart.chartClass = function(val) {
    if (!arguments.length) { return chartClass; }
    chartClass = val + ' chart';
    return line_chart;
  }

  return line_chart;
}