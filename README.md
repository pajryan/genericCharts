# Purpose
The purpose of this is to create a library of reusable chart types

This repo will use npm/node and express, but the goal is to have a generically includeable libary of charts


# Install & Run
- `npm install`
- `npm start`
- navigate to `http://localhost:8080/`


## Boilerplate
For hot reloading (using webpack), based this project on: https://github.com/UnlimitedHugs/hot-reload-boilerplate


# Charts
 - Line Chart: `lineChart.js`


### in scope
- [x] margins
- [ ] x-axis types: date, numeric, category
- [x] y-axis types: numeric
- [x] axes (both)
    - [x] tick count
    - [x] number format
    - [x] min & max
    - [x] prefix and suffix (done via number format function)
- [x] lines
    - [x] series-specific colors
    - [x] series-specific stroke width
    - [x] series-specific dash
- [ ] annotations
    - [ ] direct label at end of line(s) - best effort to deal with collisions
        - [ ] move labels when data updates
    - [ ] arbitrary annotation (any point) - no effort to deal with collisions
- [x] swapping data results in animation between data states
    - [x] full data swap
    - [x] series specific data swap
    - [x] control aniimation duration
- [x] mouseovers/tooltips showing:
    - [x] label
    - [x] formatted value
    - [ ] formatted date
- [ ] optional buttons (?) to toggle on/off lines
    - [x] set default state of lines (visible or not)
    - [ ] optionally rescale chart when lines are hidden/shown
- [ ] make sure all features work with **multiple** charts on a page (e.g. class selectors don't conflict)

### classes
Classes for each element are shown below. By specifing a class on the `chart` level, overrides can be created in CSS.
- chart: `.chart` *plus customizable*
- both axes: `.axis`
- x-axis classes:
    - overall: `.xAxis`
    - line: `.xAxis path`
    - ticks: `.xAxis .tick line`
    - labels: `.xAxis .tick text`
- y-axis class:
    - overall: `.yAxis`
    - line: `.yAxis path`
    - ticks: `.yAxis .tick line`
    - labels: `.yAxis .tick text`
- lines:
    - lines are paths, all accessible by `.line`
    - additional classnames (unique to each line) are added to path with `.series{[{class:"xyz"...}]}`
- tooltips:
    - the dot on the chart that reacts to the mouse: `.tooltipDot` and the passed classname for the series with `.series{[{class:"xyz"...}]}`
    - the tooltip itself (a single, reused `<div>` tag): `.tooltip`