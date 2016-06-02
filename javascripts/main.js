var width = 1900, height = 1000;

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
var educationScale = d3.scale.threshold()
    .domain([2.67, 5.34, 10.68, 44.66, 100])
    .range(colorbrewer.Blues[5]);
//mean value for percent_insured = 666172.3999999982/8046 = 82.7954760129
var healthScale = d3.scale.threshold()
    .domain([20.69875, 41.3975, 82.795, 91.398, 101])
    .range(colorbrewer.Greens[5]);
var povertyScale = d3.scale.threshold()
    .domain([20.69875, 41.3975, 82.795, 91.398, 101])
    .range(colorbrewer.Purples[5]);

var selected = {};

d3.json("dataSets/caEduHealthBound.json", function (error, ca) {
    if (error) throw error;

    var tracts = topojson.feature(ca, ca.objects.tracts);

    //Tracts
    
    //Tract 1
    var tract1 = g.append("g")
        .attr("transform", "translate(450,-30)");

    //Tract 1 Paths
    var tract1paths = tract1.selectAll(".tract1")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("g").attr("class", "tract1")
        .append("path")
        .attr("class", "tract")
        .style("fill", function (d) {
            return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
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
            if (selected[d.properties.NAME] === undefined) {
                selected[d.properties.NAME] = this;
                d3.select(this).style("fill", "red");
            } else {
                d3.select(this).style("fill", function (d) {
                    return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                });
                selected[d.properties.NAME] = undefined;
            }
        });

    //Tract 1 Legend
    
    //Tract 1 Legend x,y relative to tract1
    var legend1x = 350;
    var legend1y = 330;
    
    var legend1 = tract1.selectAll(".legend1")
        .data(educationScale.domain(), function (d) {
            return d;
        })
        .enter().append("g")
        .attr("class", "legend1")
        .attr("transform", function (d, i) {
            return "translate(" + i * 50 + ", 0 )";
        });

    //Tract 1 Legend Color
    legend1.append("rect")
        .attr("x", legend1x)
        .attr("y", legend1y)
        .attr("width", 50)
        .attr("height", 15)
        .style("fill", function (d, i) {
            return colorbrewer.Blues[5][i];
        });

    //Tract 1 Legend Text
    legend1.append("text")
        .attr("x", legend1x + 13)
        .attr("y", legend1y + 25)
        .attr("dy", ".35em")
        .text(function (d) {
            return d3.round(d) + "%";
        });

    //Tract 1 Legend Caption
    tract1.append("text")
        .attr("class", "legend1-caption")
        .attr("x", legend1x + 5)
        .attr("y", legend1y - 6)
        .attr("font-size", "12px")
        .text("% of population age 18 and over enrolled in college");
    
    //Tract 2
    var tract2 = g.append("g")
        .attr("transform", "translate(650,-30)")
        .attr("visibility", "hidden");

    //Tract 2 Paths
    var tract2paths = tract2.selectAll(".tract2")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("g").attr("class", "tract2")
        .append("path")
        .attr("class", "tract")
        .style("fill", function (d) {
            return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
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
            if (selected[d.properties.NAME] === undefined) {
                selected[d.properties.NAME] = this;
                d3.select(this).style("fill", "red");
            } else {
                d3.select(this).style("fill", function (d) {
                    return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                });
                selected[d.properties.NAME] = undefined;
            }
        });

    //Tract 2 Legend
    
    //Tract 2 Legend x,y relative to tract1
    var legend2x = 350;
    var legend2y = 330;
    
    var legend2 = tract2.selectAll(".legend2")
        .data(educationScale.domain(), function (d) {
            return d;
        })
        .enter().append("g")
        .attr("class", "legend2")
        .attr("transform", function (d, i) {
            return "translate(" + i * 50 + ", 0 )";
        });

    //Tract 2 Legend Color
    legend2.append("rect")
        .attr("x", legend2x)
        .attr("y", legend2y)
        .attr("width", 50)
        .attr("height", 15)
        .style("fill", function (d, i) {
            return colorbrewer.Blues[5][i];
        });

    //Tract 2 Legend Text
    legend2.append("text")
        .attr("x", legend2x + 13)
        .attr("y", legend2y + 25)
        .attr("dy", ".35em")
        .text(function (d) {
            return d3.round(d) + "%";
        });

    //Tract 2 Legend Caption
    tract2.append("text")
        .attr("class", "legend1-caption")
        .attr("x", legend2x + 5)
        .attr("y", legend2y - 6)
        .attr("font-size", "12px")
        .text("% of population age 18 and over enrolled in college");
    
    // Drop Down Menu!
    d3.select("#dropdown").on("change", function () {
        var type = d3.select(this).property('value');
        if (type == "education") {
            changeData(tract1paths, "education")
        } else if (type == "health") {
            changeData(tract1paths, "health");
        } else if (type == "poverty") {
            changeData(tract1paths, "poverty");
        }
    });

    //Layer Selection
    d3.selectAll(".radio").on("change", function () {
        if (document.getElementById("single").checked) {
            d3.select("#dropdown").style("opacity", 1);
            
            tract1.transition()
                .duration(750)
                .attr("transform", "translate(450,-30)");
            
            tract2.transition()
                .duration(750)
                .attr("visibility", "hidden")
                .attr("transform", "translate(650,-30)");
            
        } else if (document.getElementById("side-by-side").checked) {
            d3.select("#dropdown").style("opacity", 0);
            
            tract1.transition()
                .duration(750)
                .attr("transform", "translate(25,-30)");
            
            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(650,-30)");

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

function changeData(group, type) {
    if(type.toLowerCase() === "health") {
        group.transition()
            .style("fill", function(d) {
                     return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
            });
        group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                } else {
                    d3.select(this).style("fill", function (d) {
                        return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                }
            })
    } else if(type.toLowerCase() === "poverty") {
        group.transition()
            .style("fill", function(d) {
                     return povertyScale(parseFloat(d.properties.inColCent, 10) || 0);
            });
         group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                } else {
                    d3.select(this).style("fill", function (d) {
                        return povertyScale(parseFloat(d.properties.inColCent, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                }
            })
        
    } else if(type.toLowerCase() === "education") {
         group.transition()
            .style("fill", function(d) {
                     return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
            });
         group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                } else {
                    d3.select(this).style("fill", function (d) {
                        return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                }
            })
    }
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
