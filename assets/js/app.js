//  establish dimensions of our SVG graphic
var svgWidth = 990;
var svgHeight = 500;
var margin = {top: 20, right: 40, bottom: 60, left: 100};
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper that 
var svg = d3
  .select('.chart')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
var chart = svg.append('g');

// begins the giant block that deals with D3 graphic generation and the tooltip function
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// read the data file provided
d3.csv("../../data/data.csv", function(healthData) {

    healthData.forEach(function(data) {
        data.poverty = +data.poverty;
        data.phys_act = +data.phys_act;
    });
    
    // next few chunks tell d3 how to scale
    var yLinearScale = d3.scaleLinear().range([height, 0]);
    var xLinearScale = d3.scaleLinear().range([0, width]);
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    var xMin;
    var xMax;
    var yMin;
    var yMax;

    //populates pop-ups
    xMin = d3.min(healthData, function(data) {
        return +data.poverty * 0.95;
    });

    xMax = d3.max(healthData, function(data) {
        return +data.poverty * 1.05;
    });

    yMin = d3.min(healthData, function(data) {
        return +data.phys_act * 0.98;
    });

    yMax = d3.max(healthData, function(data) {
        return +data.phys_act *1.02;
    });
    
    xLinearScale.domain([xMin, xMax]);
    yLinearScale.domain([yMin, yMax]);

    
    // tooltip code that for some reason doesn't seem to be connected to the css from the starter code, I'm not sure why.
    var toolTip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(data) {
            var stateName = data.state;
            var poverty = +data.poverty;
            var physAct = +data.phys_act;
            return (
                stateName + '<br> Poverty: ' + poverty + '% <br> Physically Active: ' + physAct +'%'
            );
        });

    // init tooltip
    chart.call(toolTip);

    chart.selectAll("circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("cx", function(data, index) {
            return xLinearScale(data.poverty)
        })
        .attr("cy", function(data, index) {
            return yLinearScale(data.phys_act)
        })
        .attr("r", "15")
        .attr("fill", "lightblue")
        // I somehow screwed this up. I wanted it to pop up on hover, or on click, but this makes it so you have to hover
        // the mouse over the very top of the circle. Not sure how to get this to be a "onmouseover" event.
        .on("mouseenter", function(data) {
            toolTip.show(data);
        })
        // make popups disappear after mouse moves off of very top of circle
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });
    
    // Labeling circles
    chart.append("text")
        .style("text-anchor", "middle")
        .style("font-size", "12px")
        .selectAll("tspan")
        .data(healthData)
        .enter()
        .append("tspan")
            .attr("x", function(data) {
                return xLinearScale(data.poverty - 0);
            })
            .attr("y", function(data) {
                return yLinearScale(data.phys_act - 0.2);
            })
            .text(function(data) {
                return data.abbr
            });
            
    //next few chunks inform how to handle chart for display
    chart
        .append("g")
        .attr('transform', `translate(0, ${height})`)
        .call(bottomAxis);

    chart.append("g").call(leftAxis);

    chart
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0-margin.left + 40)
        .attr("x", 0 - height/2)
        .attr("dy","1em")
        .attr("class", "axis-text")
        .text("Percent of Residents Who Exercise Regularly")
    chart
        .append("text")
        .attr(
            "transform",
            "translate(" + width / 2 + " ," + (height + margin.top + 30) + ")"
        )
        .attr("class", "axis-text")
        .text("Per Capita  Below Poverty Line");
    });