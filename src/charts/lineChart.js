import * as d3 from 'd3';
import * as d3Annotation from 'd3-svg-annotation';
import { interpolatePath } from 'd3-interpolate-path';
import { d3button } from '../charts/button.js';


export function chart() {
  // properties for the chart
  var xValues = [function(d) { return d; }],
      yValues = [function(d) { return d; }],
      x_domain, y_domain, x_min, x_max, y_min, y_max,
      x_domainIsCustom = false, y_domainIsCustom = false,
      x_tickCount, y_tickCount, 
      x_labelFormat, y_labelFormat,
      x_axis_title = '', y_axis_title = '',
      line_paths = [], _lines = [],
      _series = [],
      // default to some height - zeros would confuse some users
      width = 700,
      height = 400,
      chartClass = 'chart',
      margin = {top: 0, right: 0, bottom: 0, left: 0},
      transition_duration = 250,  // default duration of data transitions 
      _tooltipDiv,
      tooltip_dot_radius = 5,
      _data;

  // d3 components that we want to make available on getters
  var x = d3.scaleTime();   // default to time. can be changed with .x()
  var y = d3.scaleLinear(); // default to linear

  var xAxis = d3.axisBottom().scale(x);
  var yAxis = d3.axisLeft().scale(y);



  var chartG;
  
  function line_chart(selection) {

    // do some error handling
    // if(xValues.length != yValues.length){
    //   console.error("xValues and yValues must be of the same length", {xValues: xValues, yValues: yValues})
    // }


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

      // determine axis extents.  These are in a function because we repeat this for transitions
      x_domain = findXDomain(data);
      y_domain = findYDomain(data);

      x.domain(x_domain);
      y.domain(y_domain);

      x.range([0, chartWidth]);
      y.range([chartHeight, 0]);

      _series.forEach((s,i) => {
        line_paths.push(
          d3.line()
            .x(function(d) { return x(s.xAccessor(d)); })
            .y(function(d) { return y(s.yAccessor(d)); })
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
          .attr('class', 'line ' + (_series[i].class ? _series[i].class : ''))
          .attr('d', lp);

          //hide this line if specified
          if(!_series[i].startVisible){
            newLine.style("visibility", "hidden");
          }

        _lines.push(newLine);
      })




      // remember any changes in the creation/attributs of tooltip dots needs to be repeated in the transition functions
      _tooltipDiv = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

      _series.forEach( function(s, i){
        var tooltipG = chartG.append('g').attr("class", s.class+"Tooltips");
        if(s.showTooltips){
          var newTTdot = tooltipG.selectAll("tooltipDot")
            .data(data)
          .enter().append("circle")
            .attr("class", "tooltipDot " + s.class)
            .attr("r", tooltip_dot_radius)
            .attr("cx", function(d) { return x(s.xAccessor(d)); })
            .attr("cy", function(d) { return y(s.yAccessor(d)); })
            .on("mouseover", function(d){ tooltipMouseover(d, s);})
            .on("mouseout", function(d){ tooltipMouseout(d, s);});
        }
      })



      // BUTTONS
      //  only applied to series that request them
      let button = d3button()
        .on('release', function(d, i) { 
          chartG.select("path."+ d.class).style("visibility", "hidden");          //hide path
          chartG.select("g."+d.class+"Tooltips").style("visibility", "hidden");   //hide associated dots for mouseovers
        })
        .on('press', function(d, i) { 
          chartG.select("path."+ d.class).style("visibility", "visible");
          chartG.select("g."+d.class+"Tooltips").style("visibility", "visible");
        });
      
      let buttonG = chartG.append('g')
        .attr('class', 'chartButtons')
        .attr('transform', 'translate(' + margin.left + ',' + (height-30) + ')');

      let buttons = buttonG.selectAll('.button')
        .data(_series.filter(s => s.annotationLabel && s.annotationLabel.includes("button")))
      .enter()
        .append('g')
        .attr('class', (s) => 'chartButton ' + s.class)
        .call(button);



      // END-LINE ANNOTATIONS
      //  only applied to series that request them
      let endLabelsData = [];
      _series.filter(s => s.annotationLabel && s.annotationLabel.includes("end")).forEach(e => {
        endLabelsData.push(
          {
            seriesMetadata:e,
            seriesLastValue: e.yAccessor(data[data.length-1]),
            seriesLastYCoord: y(e.yAccessor(data[data.length-1]))
          }
        )
      });
      //sort the labels and adjust their yCoord to prevent overlaps
      let previousYCoord = 0;
      let endLabelsDataAdj = endLabelsData.sort( (a, b) => b.seriesLastYCoord - a.seriesLastYCoord )
      .reduce((p, c) => { //push annotation down if it will overlap
        
        let newY = c.seriesLastYCoord;
        if (c.seriesLastYCoord - previousYCoord < 10) {
          newY = previousYCoord + 15
        }
        p.push({  //this object is what d3-svg-annotation is expecting
          note: {label: c.seriesMetadata.label, orientation: "leftRight", align: "middle", wrap: margin.right},
          y: newY,
          x: width - margin.right - margin.left,
          dx: 5,
          class: c.seriesMetadata.class,
          id: c.seriesMetadata.class,
          disable: ["connector"],
          newY
        })
        previousYCoord = newY || c.seriesLastYCoord
        return p
      }, []);

      console.log("endLabelsDataAdj", endLabelsDataAdj)

      //write the annotations
      const makeAnnotations = d3Annotation
        .annotation()
        .type(d3Annotation.annotationLabel)
        .annotations([...endLabelsDataAdj])


       chartG
        .append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations)








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

  line_chart.series = function(val) {
    if (!arguments.length) { return _series; }
    _series = val;
    return line_chart;
  }

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
    x_domainIsCustom = true;
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
    y_domainIsCustom = true;
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


  // classes
  line_chart.chartClass = function(val) {
    if (!arguments.length) { return chartClass; }
    chartClass = val + ' chart';
    return line_chart;
  }
 


  // transitions
  line_chart.transitionChart = function(dataTo, duration){  

    // see if the domain changes.  If so, need to transition the axes
    let didXDomainChange = resetXDomain(dataTo);
    if(didXDomainChange){ // only transitioning if the domain changed
      d3.select(".xAxis").transition().duration(duration ? duration : transition_duration).call(xAxis);
    }

    let didYDomainChange = resetYDomain(dataTo);
    if(didYDomainChange){
      d3.select(".yAxis").transition().duration(duration ? duration : transition_duration).call(yAxis);
    }

    // transition the lines
    //below requires d3-interpolate-path https://bocoup.com/blog/improving-d3-path-animation
    line_paths.forEach( (lp, li) => { //transition all series in the chart
      _lines[li].datum(dataTo).transition().duration(duration ? duration : transition_duration)
        .attrTween("d", function(d){
          var previous = d3.select(this).attr('d'); //equivalently: _lines[li].attr('d')
          var current = lp(d); 
          return interpolatePath(previous, current);
        })
      // below only requires D3
      // _lines[li].datum(dataTo).transition().duration(duration ? duration : transition_duration).attr("d", lp);

      if(_series[li].showTooltips){
        //also need to move any dot series
        var seriesToolTips = chartG.selectAll("."+_series[li].class+"Tooltips");
        var selection = seriesToolTips.selectAll(".tooltipDot").data(dataTo);

        //update existing
        selection.transition().duration(duration ? duration : transition_duration)
          .attr("cx", (d,i) => { return x(_series[li].xAccessor(d))})
          .attr("cy", (d,i) => { return y(_series[li].yAccessor(d))})
          
        //add new
        selection.enter()
          .append('circle')
            .attr("class", "tooltipDot " + _series[li].class)
            .attr("cx", (d,i) => { return x(_series[li].xAccessor(d))})
            .attr("cy", (d,i) => { return y(_series[li].yAccessor(d))})
            .attr("r", tooltip_dot_radius)
            .attr("opacity", 0.0)
            .on("mouseover", function(d){ tooltipMouseover(d, _series[li]);})
            .on("mouseout", function(d){ tooltipMouseout(d, _series[li]);})
            .transition().duration(duration ? duration : transition_duration)
              .attr("opacity", 1.0)

        //remove
        selection.exit()
          .attr("opacity", 1.0)
          .transition().duration(duration ? duration : transition_duration)
            .attr("opacity", 0.0).remove();
      }
    });
  }




  line_chart.transitionLine = function(dataTo, pathClassname, duration){
    let pathI = -1;
    for( let i=0; i<_series.length; i++){
      if(_series[i].class === pathClassname){
        pathI = i;
        break;
      }
    }

    if(pathI == -1){
      console.error('Tried to transition line by className "' + pathClassname + '", but that className was not passed in ".pathClasses().  Available classnames can be found in the series: ', _series);
      return;
    }
    if(!line_paths[pathI]){
      console.error('Attempting to transition line by className "' + pathClassname + '". There is a line by that name, but could not find the path by index ("'+pathI+'") in path array:', line_paths);
      return;
    }

    // see if the domain changes.  If so, need to transition the axes
    let didXDomainChange = resetXDomain(dataTo);
    if(didXDomainChange){ // only transitioning if the domain changed
      d3.select(".xAxis").transition().duration(duration ? duration : transition_duration).call(xAxis);
    }

    let didYDomainChange = resetYDomain(dataTo);
    if(didYDomainChange){
      d3.select(".yAxis").transition().duration(duration ? duration : transition_duration).call(yAxis);
    }

    // below requires d3-interpolate-path https://bocoup.com/blog/improving-d3-path-animation
    d3.select("path."+pathClassname).datum(dataTo).transition().duration(duration ? duration : transition_duration)
      .attrTween("d", function(d){
        var previous = d3.select(this).attr('d'); //equivalently: _lines[li].attr('d')
        var current = line_paths[pathI](d); 
        return interpolatePath(previous, current);
      })

    // below only requires D3
    // d3.select("."+pathClassname).datum(dataTo).transition().attr("d", line_paths[pathI]);





    if(_series[pathI].showTooltips){
      //also need to move any dot series
      var seriesToolTips = chartG.selectAll("."+pathClassname+"Tooltips");
      var selection = seriesToolTips.selectAll(".tooltipDot").data(dataTo);

      console.log("seriesToolTips", seriesToolTips)
      console.log("selection", selection)

      //update existing
      selection.transition().duration(duration ? duration : transition_duration)
        .attr("cx", (d,i) => { return x(_series[pathI].xAccessor(d))})
        .attr("cy", (d,i) => { return y(_series[pathI].yAccessor(d))})
        
      //add new
      selection.enter()
        .append('circle')
          .attr("class", "tooltipDot " + _series[pathI].class)
          .attr("cx", (d,i) => { return x(_series[pathI].xAccessor(d))})
          .attr("cy", (d,i) => { return y(_series[pathI].yAccessor(d))})
          .attr("r", tooltip_dot_radius)
          .attr("opacity", 0.0)
          .on("mouseover", function(d){ tooltipMouseover(d, _series[pathI]);})
          .on("mouseout", function(d){ tooltipMouseout(d, _series[pathI]);})
          .transition().duration(duration ? duration : transition_duration)
            .attr("opacity", 1.0)

      //remove
      selection.exit()
        .attr("opacity", 1.0)
        .transition().duration(duration ? duration : transition_duration)
          .attr("opacity", 0.0).remove();

    }  


  }


  function tooltipMouseover(d, s){
    _tooltipDiv.transition()
      .duration(200)
      .style("opacity", 0.9);
    _tooltipDiv.html(s.label + "<br />" + d3.format(s.annotationValueFormat)(s.yAccessor(d)))
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  }
  function tooltipMouseout(d, s){
    _tooltipDiv.transition()
    .duration(500)
    .style("opacity", 0);
  }


  function resetXDomain(dataTo){
    let xDomainNew = findXDomain(dataTo);
    if(x_domain[0] !== xDomainNew[0] || x_domain[1] !== xDomainNew[1]){
      x_domain = xDomainNew;
      x.domain(x_domain);
      return true;
    }
    return false;
  }


  function resetYDomain(dataTo){
    let yDomainNew = findYDomain(dataTo);
    if(y_domain[0] !== yDomainNew[0] || y_domain[1] !== yDomainNew[1]){
      y_domain = yDomainNew;
      y.domain(y_domain);
      return true;
    }
    return false;
  }



  function findXDomain(data){
    if (!x_domainIsCustom) {  // if this is set, the y_domain is enforced by the user
      var extents = [];
      //get min/max (extent) for each accessor
      _series.forEach( (s, i) => {
        extents = extents.concat(d3.extent(data, s.xAccessor));
      })
      //get min/max (extent) across all accessors
      let domain = d3.extent(extents);

      if(x_min != undefined){ domain[0] = x_min; }
      if(x_max != undefined){ domain[1] = x_max; }

      return domain;
    }
    return x_domain;
    
  }
  function findYDomain(data){
    if (!y_domainIsCustom) {  // if this is set, the y_domain is enforced by the user
      var extents = []
      _series.forEach( (s, i) => {
        extents = extents.concat(d3.extent(data, s.yAccessor));
      })
      let domain = d3.extent(extents);

      if(y_min !== undefined){ domain[0] = y_min; }
      if(y_max !== undefined){ domain[1] = y_max; }

      return domain;
    }
    return y_domain;
  }





  return line_chart;
}