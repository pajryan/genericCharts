# Purpose
The purpose of this is to create a library of reusable chart types

This repo will use npm/node and express, but the goal is to have a generically includeable libary of charts


# Install & Run
`npm install`
`npm start`
navigate to `http://localhost:8080/`


## Boilerplate
For hot reloading (using webpack), based this project on: https://github.com/UnlimitedHugs/hot-reload-boilerplate


# Charts

## Line Chart
`lineChart.js`

### in scope
- [ ] margins
- [ ] x-axis types: date, numeric, category
- [ ] y-axis types: numeric
- [ ] axes (both)
 - [ ] tick count
 - [ ] number format
 - [ ] min & max
- [ ] lines
 - [ ] series-specific colors
 - [ ] series-specific stroke width
 - [ ] series-specific dash
- [ ] annotations
 - [ ] direct label at end of line(s) - best effort to deal with collisions
 - [ ] arbitrary annotation (any point) - no effort to deal with collisions
- [ ] swap data results in animation between data states

### classes
all classes may be overridden, but by default:
 - x-axis classes:
   - overall: *TBD*
   - line: *TBD*
   - ticks: *TBD*
   - labels: *TBD*
 - y-axis class:
   - overall: *TBD*
   - line: *TBD*
   - ticks: *TBD*
   - labels: *TBD*
