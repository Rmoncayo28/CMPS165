var width = 1900, height = 1000;

var projection = d3.geo.mercator()
    .scale(width * 2)
    .center([-120, 36])
    .translate([280, height / 2 + 50]);

var zoom = d3.behavior.zoom()
    .scaleExtent([1, 200])
    .on("zoom", zoomed);

var path = d3.geo.path().projection(projection);
var border = 1;
var borderColor = "black";
var svg = d3.select("#map").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("border", border)
    .append("g");

svg.call(zoom);

var g = svg.append("g");
//var borderPath = svg.append("rect")
//    .attr("x", 0)
//    .attr("y", 0)
//    .attr("height", height)
//    .attr("width", width)
//    .style("stroke", borderColor)
//    .style("fill", "none")
//    .style("stroke-width", border)

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

var formatPercent = d3.format(".0%");

var keyScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, 5]);

var keyAxis = d3.svg.axis()
    .scale(keyScale)
    .orient("bottom")
    .tickSize(20)
    .tickValues(educationScale.domain())
    .tickFormat(function (d) {
        return Math.ceil(d) >= 45 ? Math.ceil(d) + "%" : Math.ceil(d);
    });

var selected = {};

//set datatype equal to the default value of the dropdown menu
var dataType = "education";

d3.json("dataSets/caEduHealthPovertyBound.json", function (error, ca) {
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


                var x = document.getElementById("table1");
                var newRow = document.createElement("TR");
                newRow.setAttribute("id", "row" + d.properties.NAME);

                var newData = document.createElement("TD");
                newData.innerHTML = d.properties.NAME;
                newRow.appendChild(newData);
                newData = document.createElement("TD");
                newData.innerHTML = d.properties.county_name;
                newRow.appendChild(newData);
                newData = document.createElement("TD");
                newData.innerHTML = d.properties.population;
                newRow.appendChild(newData);
                newData = document.createElement("TD");
                newData.innerHTML = d.properties.inColCent;
                newRow.appendChild(newData);
                newData = document.createElement("TD");
                newData.innerHTML = d.properties.percent_insured;
                newRow.appendChild(newData);


                x.appendChild(newRow);
            } else {
                d3.select(this).style("fill", function (d) {
                    return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                });
                selected[d.properties.NAME] = undefined;
                var removeme = document.getElementById("row" + d.properties.NAME);
                removeme.parentElement.removeChild(removeme);
            }
        });
    tract1.append("path")
          .datum(topojson.mesh(ca, ca.objects.counties, function(a, b) { return a !== b; }))
          .attr("class", "county-border")
          .attr("d", path);

    //Tract 1 Legend

    //Tract 1 Legend x,y relative to tract1
    var legend1x = 80;
    var legend1y = 850;

    var legend1 = tract1.append("g")
        .attr("class", "key")
        .attr("transform", "translate(" + legend1x + "," + legend1y + ")");

    var legend1rects = legend1.selectAll("legend1-rect")
        .data(educationScale.range().map(function (color) {
            var d = educationScale.invertExtent(color);
            if (d[0] == null) d[0] = keyScale.domain()[0];
            if (d[1] == null) d[1] = keyScale.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend1-rect")
        .attr("x", function (d) {
            return keyScale(d[0]);
        })
        .attr("width", function (d) {
            return keyScale(d[1]) - keyScale(d[0]);
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return educationScale(d[0]);
        });

    legend1.call(keyAxis).append("text")
        .attr("class", "legend1-caption")
        .attr("y", -10)
        .attr("dy", ".35em")
        .text("% of population age 18 and over enrolled in college");

    //Tract 1 Legend Text
    //    legend1.append("text")
    //        .attr("x", legend1x + 13)
    //        .attr("y", legend1y + 25)
    //        .attr("dy", ".35em")
    //        .text(function (d) {
    //            return d3.round(d) + "%";
    //        });

    //Tract 1 Legend Caption
    //    tract1.append("text")
    //        .attr("class", "legend1-caption")
    //        .attr("x", legend1x + 5)
    //        .attr("y", legend1y - 6)
    //        .attr("font-size", "12px")
    //        .text("% of population age 18 and over enrolled in college");

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
    tract2.append("path")
          .datum(topojson.mesh(ca, ca.objects.counties, function(a, b) { return a !== b; }))
          .attr("class", "county-border")
          .attr("d", path);
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
        dataType = d3.select(this).property('value');
        if (dataType == "education") {
            changeData(tract1paths, "education")
        } else if (dataType == "health") {
            changeData(tract1paths, "health");
        } else if (dataType == "poverty") {
            changeData(tract1paths, "poverty");
        }

    });

    //Checkboxes
    d3.selectAll(".overlay_button").on("change", function () {
        var type = this.id;
        switch (type) {
        case "education_box":
            //Add functionality here
            break;
        case "health_box":

            break;
        case "poverty_box":

            break;
        }
    });

    //Button Presses!

    //Active the education button
    activeEduButton();

    var button_edu = "true";
    var button_health = "false";
    var button_poverty = "false";

    $('#selector button').click(function () {

        if ($(event.target).attr('id') == "button_education") {
            button_edu = $(event.target).attr('value');
        } else if ($(event.target).attr('id') == "button_health") {
            button_health = $(event.target).attr('value');
        } else if ($(event.target).attr('id') == "button_poverty") {
            button_poverty = $(event.target).attr('value');
        }

        //Selector Button Logic
        if(button_edu == "true" && button_health == "true" && button_poverty == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(25,-30)");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(650,-30)");
            
            //tract3 here;
        } else if(button_edu == "true" && button_health == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(25,-30)");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(650,-30)");
        } else if (button_edu == "true" && button_poverty == "true") {
            
        } else if (button_health == "true" && button_poverty == "true") {
            
        } else if (button_edu == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(450,-30)");

            tract2.transition()
                .duration(750)
                .attr("visibility", "hidden")
                .attr("transform", "translate(650,-30)");
        } else if (button_health == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "hidden")
                .attr("transform", "translate(25,-30)");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(650,-30)");
        } else if (button_poverty == "true") {
            
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
    switch (dataType) {
    case "education":
        div.html("County Name: " + d.properties.county_name + "<br>Tract: " + d.properties.NAME + "<br>Total Population: " + d.properties.population + "<br> % of 18+ in College: " + d.properties.inColCent).style("left", (d3.event.pageX - 180) + "px")
            .style("top", (d3.event.pageY) + "px").style("height", "50px");
        break;
    case "health":
        div.html("County Name: " + d.properties.county_name + "<br>Tract: " + d.properties.NAME + "<br>Total Population: " + d.properties.population + "<br>% Insured: " + d.properties.percent_insured + "<br>% Uninsured: " + d.properties.percent_uninsured).style("left", (d3.event.pageX - 180) + "px")
            .style("top", (d3.event.pageY) + "px").style("height", "60px");
        break;
    case "poverty":
        div.html("County Name: " + d.properties.county_name + "<br>Tract: " + d.properties.NAME + "<br>Total Population: " + d.properties.population + "<br> % living in poverty: " + d.properties.percent_poverty).style("left", (d3.event.pageX - 180) + "px")
            .style("top", (d3.event.pageY) + "px").style("height", "50px");
        break;
    default:
        console.log("Default: " + dataType);
        break;
    }
}

function mouseout(d) {
    div.style("display", "none");
}

function changeData(group, type) {
    if(type.toLowerCase() === "health") {
        group.transition()
            .style("fill", function(d) {
                if (selected[d.properties.NAME] === undefined) {
                     return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
                } else { return "red";}
            });
        group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                    var x = document.getElementById("table1");
                    var newRow = document.createElement("TR");
                    newRow.setAttribute("id" , "row" + d.properties.NAME);
                    newRow.setAttribute("class", "rowContent");

                    var newData = document.createElement("TD");
                    newData.innerHTML = d.properties.NAME;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.county_name;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.population;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.inColCent;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.percent_insured;
                    newRow.appendChild(newData);
                
                
                x.appendChild(newRow);
                } else {
                    d3.select(this).style("fill", function (d) {
                        return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                    var removeme = document.getElementById("row" + d.properties.NAME);
                    removeme.parentElement.removeChild(removeme);
                }
            })
    } else if(type.toLowerCase() === "poverty") {
        group.transition()
            .style("fill", function(d) {
            if (selected[d.properties.NAME] === undefined) {
                     return povertyScale(parseFloat(d.properties.inColCent, 10) || 0);
            } else { return "red";}
            });
         group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                    var x = document.getElementById("table1");
                    var newRow = document.createElement("TR");
                    newRow.setAttribute("id" , "row" + d.properties.NAME);
                    var newData = document.createElement("TD");
                    newData.innerHTML = d.properties.NAME;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.county_name;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.population;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.inColCent;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.percent_insured;
                    newRow.appendChild(newData);
                } else {
                    d3.select(this).style("fill", function (d) {
                        return povertyScale(parseFloat(d.properties.inColCent, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                    var removeme = document.getElementById("row" + d.properties.NAME);
                    removeme.parentElement.removeChild(removeme);
                }
            })
        
    } else if(type.toLowerCase() === "education") {
         group.transition()
            .style("fill", function(d) {
             if (selected[d.properties.NAME] === undefined) {
                     return educationScale(parseFloat(d.properties.inColCent, 10) || 0); 
             } else {return "red";}
            });
         group.on("click", function (d) {
                if (selected[d.properties.NAME] === undefined) {
                    selected[d.properties.NAME] = this;
                    d3.select(this).style("fill", "red");
                    var x = document.getElementById("table1");
                    var newRow = document.createElement("TR");
                    newRow.setAttribute("id" , "row" + d.properties.NAME);

                    var newData = document.createElement("TD");
                    newData.innerHTML = d.properties.NAME;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.county_name;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.population;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.inColCent;
                    newRow.appendChild(newData);
                    newData = document.createElement("TD");
                    newData.innerHTML = d.properties.percent_insured;
                    newRow.appendChild(newData);
                } else {
                    d3.select(this).style("fill", function (d) {
                        return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                    });
                    selected[d.properties.NAME] = undefined;
                    var removeme = document.getElementById("row" + d.properties.NAME);
                    removeme.parentElement.removeChild(removeme);
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
