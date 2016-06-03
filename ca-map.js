//incrementColor function obtained from http://stackoverflow.com/questions/12934720/how-to-increment-decrement-hex-color-values-with-javascript-jquery/15776973#15776973   
var incrementColor = function (color, step) {
    var colorToInt = parseInt(color.substr(1), 16), // Convert HEX color to integer
        nstep = parseInt(step); // Convert step to integer
    if (!isNaN(colorToInt) && !isNaN(nstep)) { // Make sure that color has been converted to integer
        colorToInt += nstep; // Increment integer with step
        var ncolor = colorToInt.toString(16); // Convert back integer to HEX
        ncolor = '#' + (new Array(7 - ncolor.length).join(0)) + ncolor; // Left pad "0" to make HEX look like a color
        if (/^#[0-9a-f]{6}$/i.test(ncolor)) { // Make sure that HEX is a valid color
            return ncolor;
        }
    }
    return color;
};

var width = 1500, height = 800;


var projection = d3.geo.mercator()
    .scale(1000 * 3)
    .center([-120, 36])
    .translate([240, height / 2 + 10]);

var path = d3.geo.path().projection(projection);



var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height);


//Possible Legend
var color = d3.scale.threshold()
    .domain([1, 10, 50, 100, 500, 1000, 2000, 5000])
    .range(["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
//Land area of largest tract divided by 4
var largestDiv4 = 4525303421;

var tractScale = d3.scale.threshold()
    .domain([largestDiv4 / 8, largestDiv4 / 2, largestDiv4 * 2, largestDiv4 * 3, largestDiv4 * 4 + 1])
    .range(colorbrewer.Reds[5]);
var horizontalLegend = d3.svg.legend().cellWidth(130).units("land area ㎡").cellHeight(25).inputScale(tractScale).cellStepping(120);

d3.select("svg").append("g")
    .attr("transform", "translate(260,70)")
    .attr("class", "legend")
    .call(horizontalLegend);

var formatNumber = d3.format(",d");

// A position encoding for the key only.
var x = d3.scale.linear()
    .domain([0, 5100])
    .range([0, 480]);

//Creating the variables for the legend
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickSize(13)
    .tickValues(color.domain())
    .tickFormat(function (d) {
        return d >= 100 ? formatNumber(d) : null;
    });



//Actually Creating the legend
var g = svg.append("g")
    .attr("class", "key")
    .attr("transform", "translate(540,40)");

/*g.selectAll("rect")
    .data(color.range().map(function(d, i) {
      return {
        x0: i ? x(color.domain()[i - 1]) : x.range()[0],
        x1: i < color.domain().length ? x(color.domain()[i]) : x.range()[1],
        z: d
      };
    }))
  .enter().append("rect")
    .attr("height", 8)
    .attr("x", function(d) { return d.x0; })
    .attr("width", function(d) { return d.x1 - d.x0; })
    .style("fill", function(d) { return d.z; });*/

//g.call(xAxis).append("text")
//    .attr("class", "caption")
//  .attr("y", -6)
//    .text("Land area in ㎡ (square meter)");

var tractColors = "#000000";
var numTracts = 0;

d3.json("dataSets/caTractsAndCounties.json", function (error, ca) {
    if (error) throw error;

    //Tracts
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("path")
        .attr("class", "tract")
        .style("fill", function (d) {
            numTracts++;
            tractColors = incrementColor(tractColors, 2086.2);
            return tractScale(d.properties.ALAND);
        })
        .attr("d", path);


    //Counties
    svg.append("g")
        .selectAll("path")
        .data(topojson.feature(ca, ca.objects.counties).features)
        .enter().append("path")
        .attr("class", "county")
        .attr("d", path)
        .on("mouseover", function (d) {
            div.transition()
                .duration(200)
                .style("opacity", 0.9);
            div.html(d.properties.NAME)
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })
        .on("mouseout", function (d) {
            div.transition()
                .duration(500)
                .style("opacity", 0.0)
        });

    //tooltop declaration
    var div = d3.select("#map").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

});

d3.select(self.frameElement).style("height", height + "px");
