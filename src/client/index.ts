const d3 = require("d3");
const lc = require("../charts/lineChart.js");

document.getElementById('target').innerHTML = "javscript is working";


//create the svg
const width = 700, height = 500,
      margin = {top: 20, right: 30, bottom: 30, left: 40}

const svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom);
var formatDate = d3.timeParse('%d-%b-%y');

var data = [
  {date: "24-Apr-07", close: 93.55, open: 20, date2: "24-May-07"},
  {date: "25-Apr-07", close: 96.35, open: 50, date2: "25-May-07"},
  {date: "26-Apr-07", close: 97.35, open: 30, date2: "26-May-07"},
  {date: "27-Apr-07", close: 92.35, open: 30, date2: "27-May-07"},
  {date: "28-Apr-07", close: 93.35, open: 20, date2: "28-May-07"},
  {date: "29-Apr-07", close: 94.35, open: 40, date2: "29-May-07"},
];


console.log("DATA", data)
// define the chart
var lineChart = lc.chart()
                .chartClass('patrick')
                .width(width)
                .height(height)
                .margin(margin)
                .xValues([
                  function(d: any) { return formatDate(d.date); },
                  function(d: any) { return formatDate(d.date2); }
                ])
                .yValues([
                  function(d: any) { return +d.close; },
                  function(d: any) { return +d.open; }
                ])
                .yMin(0)
                .pathClasses(['firstline', 'secondline'])
                .xTickCount(5).yTickCount(10)
                .yLabelFormat(d3.format(".2f"))
                .xLabelFormat(function(d: any){ return "day: " + d3.timeFormat("%a %d")(d) + "!"});

svg.datum(data)     // set the data for the element
  .call(lineChart); // build the chart



// swap in new data
var data2= [
  {date: "24-Apr-07", close: 83.55, open: 10, date2: "24-May-07"},
  {date: "25-Apr-07", close: 86.35, open: 40, date2: "25-May-07"},
  {date: "26-Apr-07", close: 87.35, open: 15, date2: "26-May-07"},
  {date: "27-Apr-07", close: 72.35, open: 20, date2: "27-May-07"},
  {date: "28-Apr-07", close: 63.35, open: 3, date2: "28-May-07"},
  {date: "29-Apr-07", close: 84.35, open: 10, date2: "29-May-07"},
  
  {date: "30-Apr-07", close: 160, open: 10, date2: "01-Jun-07"},
  {date: "01-May-07", close: 170, open: 15, date2: "02-Jun-07"},
  {date: "02-May-07", close: 170, open: 10, date2: "03-Jun-07"},
  {date: "03-May-07", close: 160, open: 15, date2: "04-Jun-07"},
  {date: "04-May-07", close: 170, open: 10, date2: "05-Jun-07"},
  {date: "05-May-07", close: 160, open: 15, date2: "06-Jun-07"},
  {date: "06-May-07", close: 170, open: 10, date2: "07-Jun-07"},
];


setTimeout(function(){
  lineChart.transitionChart(data2, 1200);        //all line series (duration optional)
  // lineChart.transitionLine(data2, "firstline"); // individual line series (duration optional)
}, 1000)


