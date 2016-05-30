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
var width = 1900
    , height = 1000;


var projection = d3.geo.mercator()
    .scale(width * 2)
    .center([-120, 36])
    .translate([280, height / 2 + 50]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 200])
    .on("zoom", zoomed);

var path = d3.geo.path().projection(projection);


var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g");

var g = svg.append("g");

svg.call(zoom)
    .call(zoom.event);


//Possible Legend
var color = d3.scale.threshold()
    .domain([1, 10, 50, 100, 500, 1000, 2000, 5000])
    .range(["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"]);
//Land area of largest tract divided by 4

//10.68 is the mean of the set of % of population in college
var tractScale = d3.scale.threshold()
    .domain([2.67, 5.34, 10.68, 44.66, 101])
    .range(colorbrewer.Blues[5]);
var horizontalLegend = d3.svg.legend().cellWidth(130).units("% pop in col").cellHeight(25).inputScale(tractScale).cellStepping(120);

d3.select("svg").append("g")
    .attr("transform", "translate(290,70)")
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
//   var g = svg.append("g")
//     .attr("class", "key")
//   .attr("transform", "translate(540,40)");
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
//    .text("Land area in ? (square meter)");

d3.json("dataSets/caEducationBound.json", function (error, ca) {
    if (error) throw error;

    var tracts = topojson.feature(ca, ca.objects.tracts);

    //Tracts


    var tract1 = g.selectAll(".tract1")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter()
        .append("g").attr("class", "tract1")
        .append("path")
        .attr("class", "tract")
        .style("fill", function (d) {

            return tractScale(parseFloat(d.properties.inColCent, 10) || 0);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            mouseover(d);
        })
        /*
           div.transition()
                .style("opacity", 0.75);
            div.html("tract name = " + d.properties.NAME + "<br>" + "Total Population 18+ = " + d.properties.totPop18p + "<br>" +"Total population 18+ in college =" + d.properties.numInCol +
                     "<br>" + "% of population 18+ in college =" + d.properties.inColCent)
                .style("left", (d3.event.pageX) + 10 + "px")
                .style("top", (d3.event.pageY - 30) + "px");
        })*/
        .on("mouseout", function (d) {
            mouseout(d);
        })
        .on("mousemove", function (d) {
            mousemove(d);
        });

    var tract2 = g.selectAll(".tract2")
        .data(topojson.feature(ca, ca.objects.tracts).features);

    var tract2Gs = tract2.enter()
        .append("g").attr("class", "tract2")
        .attr("transform", "translate(500,0)")
        .style("opacity", 0);

    tract2Gs.append("path")
        .attr("class", "tract")
        .style("fill", function (d) {

            return tractScale(parseFloat(d.properties.inColCent, 10) || 0);
        })
        .attr("d", path);


    d3.selectAll(".radio").on("change", function () {
        if (document.getElementById("single").checked) {
            tract2Gs
                .on("mouseover", function (d) {
                })
                /*
                   div.transition()
                        .style("opacity", 0.75);
                    div.html("tract name = " + d.properties.NAME + "<br>" + "Total Population 18+ = " + d.properties.totPop18p + "<br>" +"Total population 18+ in college =" + d.properties.numInCol +
                             "<br>" + "% of population 18+ in college =" + d.properties.inColCent)
                        .style("left", (d3.event.pageX) + 10 + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                })*/
                .on("mouseout", function (d) {
                })
                .on("mousemove", function (d) {
                })
                .transition()
                .duration(850)
                .style("opacity", 0);
        } else if (document.getElementById("side-by-side").checked) {
            tract2Gs
                .on("mouseover", function (d) {
                    mouseover(d);
                })
                /*
                   div.transition()
                        .style("opacity", 0.75);
                    div.html("tract name = " + d.properties.NAME + "<br>" + "Total Population 18+ = " + d.properties.totPop18p + "<br>" +"Total population 18+ in college =" + d.properties.numInCol +
                             "<br>" + "% of population 18+ in college =" + d.properties.inColCent)
                        .style("left", (d3.event.pageX) + 10 + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                })*/
                .on("mouseout", function (d) {
                    mouseout(d);
                })
                .on("mousemove", function (d) {
                    mousemove(d);
                })
                .transition()
                .duration(850)
                .style("opacity", 1);

        }
    });


});
//tooltop declaration
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("display", "none");

function mouseover(d) {
    div.style("display", "inline");
}

function mousemove(d) {
    div
        .html("tract name = " + d.properties.NAME + "<br>" + "Total Population 18+ = " + d.properties.totPop18p + "<br>" + "Total population 18+ in college =" + d.properties.numInCol + "<br>" + "% of population 18+ in college =" + d.properties.inColCent)
        .style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout(d) {
    div.style("display", "none");
}

function zoomed() {
    g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
d3.select(self.frameElement).style("height", height + "px");
