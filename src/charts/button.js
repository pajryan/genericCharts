// https://bl.ocks.org/pbogden/7487564

import * as d3 from 'd3';

export function d3button() {

  var dispatch = d3.dispatch('press', 'release');

  var paddingTop = 2,
      paddingSides = 4,
      radius = 2,
      gap = 12;

  function my(selection) {
    var runningWidth = 0;
    selection.each(function(d, i) {
      var g = d3.select(this)
          .attr('id', 'd3-button' + i)
          .attr('transform', 'translate(' + (i * 40) + ',' + 0 + ')');

      var text = g.append('text').text(d.label);
      var bbox = text.node().getBBox();
      var rect = g.insert('rect', 'text')
          .attr("x", bbox.x - paddingSides)
          .attr("y", bbox.y - paddingTop)
          .attr("width", bbox.width + 2 * paddingSides)
          .attr("height", bbox.height + 2 * paddingTop)
          .attr('rx', radius)
          .attr('ry', radius)
          .on('click', toggle)

      // move button - making space for each previous button
      g.attr('transform', 'translate(' + (runningWidth) + ',' + 0 + ')');
      runningWidth += bbox.width + (paddingSides*2) + gap;

      if(d.startVisible){
        g.classed('active', true);
        rect.classed('pressed', true);
      }

    });
  }


  function activate() {
    d3.select(this.parentNode).classed('active', true)
  }

  function deactivate() {
    d3.select(this.parentNode).classed('active', false)
  }

  function toggle(d, i) {
    if (d3.select(this).classed('pressed')) {
        release.call(this, d, i);
        deactivate.call(this, d, i);
    } else {
        press.call(this, d, i);
        activate.call(this, d, i);
    }
  }

  function press(d, i) {
    dispatch.call('press', this, d, i)
    d3.select(this).classed('pressed', true);
  }

  function release(d, i) {
    dispatch.call('release', this, d, i)
    my.clear.call(this, d, i);
  }

  my.clear = function(d, i) {
    d3.select(this).classed('pressed', false);
  }

  my.on = function() {
    var value = dispatch.on.apply(dispatch, arguments);
    return value === dispatch ? my : value;
  };

  return my;
}