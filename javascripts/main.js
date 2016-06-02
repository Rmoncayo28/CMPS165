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

svg.call(zoom);

var g = svg.append("g");

//10.68 is the mean of the set of % of population in college
var tractScale = d3.scale.threshold()
    .domain([2.67, 5.34, 10.68, 44.66, 101])
    .range(colorbrewer.Blues[5]);
var horizontalLegend = d3.svg.legend().cellWidth(130).units("% pop in col").cellHeight(25).inputScale(tractScale).cellStepping(120);

d3.select("svg").append("g")
    .attr("transform", "translate(290,70)")
    .attr("class", "legend")
    .call(horizontalLegend);


var selected = {};
var drawnOnce = false;
var tract2Visible = false;
d3.json("dataSets/caEduHealthBound.json", function (error, ca) {
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
        .on("mouseout", function (d) {
            mouseout(d);
        })
        .on("mousemove", function (d) {
            mousemove(d);
        })
        .on("click", function (d) {
            if(selected[d.properties.NAME] === undefined) {
                selected[d.properties.NAME] = this;
                d3.select(this).style("fill", "red");
            } else {
                d3.select(this).style("fill", function(d) {
                   return tractScale(parseFloat(d.properties.inColCent, 10) || 0); 
                });
                selected[d.properties.NAME] = undefined;
            }
        });


    
    // Drop Down Menu!
    d3.select("#dropdown").on("change", function() {
        var type = d3.select(this).property('value');
        if ( type == "education" ) {
            
        } else if ( type == "health" ) {
            
        } else if ( type == "poverty" ) {
            
        }
    });

    d3.selectAll(".radio").on("change", function () {
        if (document.getElementById("single").checked) {
            tract2Visible = false;
            g.selectAll(".tract2")
                .on("mouseover", function (d) {})
                /*
                   div.transition()
                        .style("opacity", 0.75);
                    div.html("tract name = " + d.properties.NAME + "<br>" + "Total Population 18+ = " + d.properties.totPop18p + "<br>" +"Total population 18+ in college =" + d.properties.numInCol +
                             "<br>" + "% of population 18+ in college =" + d.properties.inColCent)
                        .style("left", (d3.event.pageX) + 10 + "px")
                        .style("top", (d3.event.pageY - 30) + "px");
                })*/
                .on("mouseout", function (d) {})
                .on("mousemove", function (d) {})
                .style("opacity", 0)
                .attr("transform", "translate(0, " + -height +")");
        } else if (document.getElementById("side-by-side").checked) {
                tract2Visible = true;
                if (!drawnOnce) {
                    drawnOnce = true;
                    var tract2 = g.selectAll(".tract2")
                    .data(topojson.feature(ca, ca.objects.tracts).features);

                    var tract2Gs = tract2.enter()
                        .append("g")
                        .attr("class", "tract2")
                        .attr("transform", "translate(500,0)")
                        .style("opacity", 0);

                    tract2Gs.append("path")
                        .attr("class", "tract")
                        .style("fill", function (d) {
                            return tractScale(parseFloat(d.properties.inColCent, 10) || 0);
                        })
                        .attr("d", path);
                }
                    g.selectAll(".tract2")
                    .on("mouseover", function (d) {
                            mouseover(d);
                        })
                    .on("mouseout", function (d) {
                        mouseout(d);
                    })
                    .on("mousemove", function (d) {
                        mousemove(d);
                    })
                    .style("opacity", 1)
                    .attr("transform", "translate(500, 0)");  

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
    div.html("County Name: " + d.properties.county_name + "<br>Tract: " + d.properties.NAME + "<br>Total Population: " + d.properties.population + "<br> % of 18+ in College: " + d.properties.inColCent + "<br>% Insured: " + d.properties.percent_insured + "<br>% Uninsured: " + d.properties.percent_uninsured).style("left", (d3.event.pageX - 34) + "px")
        .style("top", (d3.event.pageY - 12) + "px");
}

function mouseout(d) {
    div.style("display", "none");
}

function zoomed() {
    // the "zoom" event populates d3.event with an object that has
    // a "translate" property (a 2-element Array in the form [x, y])
    // and a numeric "scale" property
    var e = d3.event, // now, constrain the x and y components of the translation by the
        // dimensions of the viewport
        tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale))
        , ty = Math.min(0, Math.max(e.translate[1], height - height * e.scale));
    // then, update the zoom behavior's internal translation, so that
    // it knows how to properly manipulate it on the next movement
    zoom.translate([tx, ty]);
    // and finally, update the <g> element's transform attribute with the
    // correct translation and scale (in reverse order)    
    g.attr("transform", [
            "translate(" + [tx, ty] + ")", "scale(" + e.scale + ")"
    ].join(" "));

}

d3.select(self.frameElement).style("height", height + "px");
