const d3 = require("d3");
const lc = require("../charts/lineChart.js")

document.getElementById('target').innerHTML = "javscript is working";


//create the svg
const width = 700, height = 500,
      margin = {top: 20, right: 30, bottom: 30, left: 40}

const svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
var formatDate = d3.timeParse('%d-%b-%y');

var data = [
  {date: "24-Apr-07", close: 93.55, open: 20},
  {date: "25-Apr-07", close: 95.35, open: 50}
]


console.log("DATA", data)
// define the chart
var lineChart = lc.chart()
                .chartClass('patrick')
                .width(width)
                .height(height)
                .margin(margin)
                .xValues([
                  function(d: any) { return formatDate(d.date); },  //will base axis construction off of this set
                  function(d: any) { return formatDate(d.date); }
                ])
                .yValues([
                  function(d: any) { return +d.close; },
                  function(d: any) { return +d.open; }
                ]);

svg.datum(data)     // set the data for the element
  .call(lineChart); // build the chart

