import * as d3 from 'd3';

export function chart() {
  // properties for the chart
  var xValues = [function(d) { return d; }],
      yValues = [function(d) { return d; }],
      x_domain, y_domain, x_min, x_max, y_min, y_max,
      x_tickCount, y_tickCount, 
      x_labelFormat, y_labelFormat,
      x_axis_title = '', y_axis_title = '',
      line_paths = [],  path_classes = [], _lines = [],
      // default to some height - zeros would confuse some users
      width = 700,
      height = 400,
      chartClass = 'chart',
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      transition_duration = 1000, 
      _data;

  // d3 components that we want to make available on getters
  var x = d3.scaleTime();   // default to time. can be changed with .x()
  var y = d3.scaleLinear(); // default to linear

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);



  var chartG;
  
  function line_chart(selection) {

    // do some error handling
    if(xValues.length != yValues.length){
      console.error("xValues and yValues must be of the same length", {xValues: xValues, yValues: yValues})
    }


    // set tick counts
    if(x_tickCount){ xAxis.ticks(x_tickCount); }
    if(y_tickCount){ yAxis.ticks(y_tickCount); }

    // set label format
    if(x_labelFormat){ xAxis.tickFormat(x_labelFormat); }
    if(y_labelFormat){ yAxis.tickFormat(y_labelFormat); }

    selection.each(function(data, i) {
      _data = data;

      // figure out the charts height and width to fit with the margins
      var chartHeight = height - margin.top - margin.bottom,
          chartWidth = width - margin.left - margin.right;

      // select the element that we want to append the chart to
      chartG = d3.select(this)
                  .append('g')
                  .attr('class', chartClass)
                  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // determine axis extents
      var extents = [];
      if (!x_domain) {
        extents = [];
        //get min/max (extent) for each accessor
        xValues.forEach( (d,i) => {
          extents = extents.concat(d3.extent(data, d))
        })
        //get min/max (extent) across all accessors
        x_domain = d3.extent(extents);

        if(x_min != undefined){x_domain[0] = x_min;}
        if(x_max != undefined){x_domain[1] = x_max;}
      }
      if (!y_domain) {
        extents = []
        yValues.forEach( (d,i) => {
          extents = extents.concat(d3.extent(data, d))
        })
        y_domain = d3.extent(extents);

        if(y_min !== undefined){ y_domain[0] = y_min; }
        if(y_max !== undefined){y_domain[1] = y_max;}
      }

      x.domain(x_domain);
      y.domain(y_domain);

      x.range([0, chartWidth]);
      y.range([chartHeight, 0]);

      // gather & create the line paths
      xValues.forEach( function (xv, i){
        line_paths.push(
          d3.line()
          .x(function(d) { return x(xValues[i](d)); })
          .y(function(d) { return y(yValues[i](d)); })
        )
      })

      // write x axis
      chartG.append('g')
          .attr('class', 'axis xAxis')
          .attr('transform', 'translate(0,' + chartHeight + ')')
          .call(xAxis);

      // write y axis
      chartG.append('g')
          .attr('class', 'axis yAxis')
          .call(yAxis)

      // draw each path
      line_paths.forEach( function(lp, i){
        var newLine = chartG.append('path')
          .datum(data)
          .attr('class', 'line ' + (path_classes[i] ? path_classes[i] : ''))
          .attr('d', lp);

        _lines.push(newLine);
      })
    });
  }





  // GETTERS / SETTERS

  // size
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

  // value handling (accessor functions)
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

  // axis formattting
  line_chart.xTickCount = function(val) {
    if (!arguments.length) { return x_tickCount; }
    x_tickCount = val;
    return line_chart;
  };

  line_chart.yTickCount = function(val) {
    if (!arguments.length) { return y_tickCount; }
    y_tickCount = val;
    return line_chart;
  };

  line_chart.xLabelFormat = function(val) {
    if (!arguments.length) { return x_labelFormat; }
    x_labelFormat = val;
    return line_chart;
  };

  line_chart.yLabelFormat = function(val) {
    if (!arguments.length) { return y_labelFormat; }
    y_labelFormat = val;
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

  // axis types (linear, time, etc)
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

  // axis min/max (domain)
  line_chart.xDomain = function(val) {
    if (!arguments.length) { return x_domain; }
    x_domain = val;
    return line_chart;
  };

  line_chart.xMax = function(val) {
    if (!arguments.length) { return x_max; }
    x_max = val;
    return line_chart;
  };

  line_chart.xMin = function(val) {
    if (!arguments.length) { return x_min; }
    x_min = val;
    return line_chart;
  };

  line_chart.yDomain = function(val) {
    if (!arguments.length) { return y_domain; }
    y_domain = val;
    return line_chart;
  };

  line_chart.yMax = function(val) {
    if (!arguments.length) { return y_max; }
    y_max = val;
    return line_chart;
  };

  line_chart.yMin = function(val) {
    if (!arguments.length) { return y_min; }
    y_min = val;
    return line_chart;
  };


  // getters for key elements
  line_chart.g = function() {
    return chartG;
  };

  line_chart.xAxis = function() {
    return xAxis;
  };

  line_chart.yAxis = function() {
    return yAxis;
  };

  line_chart.transitionChart = function(dataTo, duration){
    console.log(d3.transition().duration())
    line_paths.forEach( (lp, li) => {
      _lines[li].datum(dataTo).transition().duration(duration ? duration : transition_duration).attr("d", lp);
    });
  }

  line_chart.transitionLine = function(dataTo, pathClassname, duration){
    // find the line_path associated with the classname
    let pathI = path_classes.indexOf(pathClassname);
    if(pathI == -1){
      console.error('Tried to transition line by className "' + pathClassname + '", but that className was not passed in ".pathClasses().  Available classnames: ', path_classes);
      return;
    }
    if(!line_paths[pathI]){
      console.error('Attempting to transition line by className "' + pathClassname + '". There is a line by that name, but could not find the path by index ("'+pathI+'") in path array:', line_paths);
      return;
    }
    d3.select("."+pathClassname).datum(dataTo).transition().attr("d", line_paths[pathI]);
  }

  // classes
  line_chart.chartClass = function(val) {
    if (!arguments.length) { return chartClass; }
    chartClass = val + ' chart';
    return line_chart;
  }

  line_chart.pathClasses = function(val) {
    if (!arguments.length) { return path_classes; }
    path_classes = val;
    return line_chart;
  }

  return line_chart;
}