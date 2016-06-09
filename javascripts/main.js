var width = $(window).width() - 45
    , height = 490;

var projection = d3.geo.mercator()
    .scale(2050)
    .center([-121, 36.7783])
    .translate([0, height / 2]);

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

var blueColors = colorbrewer.Blues[5];
blueColors.unshift("#ffffff");

//10.68 is the mean of the set of % of population in college
var educationScale = d3.scale.threshold()
    .domain([0, 2.67, 5.34, 10.68, 44.66, 100.1])
    .range(blueColors);

var educationScaleNum = d3.scale.threshold()
    .domain([0, 99, 198, 396, 6030, 11664 + 1])
    .range(colorbrewer.Blues[5]);

var greenColors = colorbrewer.Greens[5];
greenColors.unshift("#ffffff");

//mean value for percent_insured = 666172.3999999982/8046 = 82.7954760129
var healthScale = d3.scale.threshold()
    .domain([0, 20.69875, 41.3975, 82.795, 91.398, 100.1])
    .range(greenColors);

var healthScaleNum = d3.scale.threshold()
    .domain([0, 972.496425019, 1944.99285004, 3889.9857000746083, 13543.49285, 23197 + 1])
    .range(greenColors);

var purpleColors = colorbrewer.Purples[5];
purpleColors.unshift("#ffffff");

var purpleColorsNum = purpleColors.slice(0);

purpleColors.push("#696969");

var povertyScale = d3.scale.threshold()
    .domain([0, 4.15, 8.3, 16.6, 33.2, 66.4, 100.1])
    .range(purpleColors);

var povertyScaleNum = d3.scale.threshold()
    .domain([0, 190.103332504, 380.206665009, 760.4133300174086, 3246.20666501, 5732 + 1])
    .range(purpleColorsNum);

var formatPercent = d3.format(".0%");

var keyScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, 3]);

var keyScaleNum = d3.scale.linear()
    .domain([0, 1])
    .range([0, 0.03]);

var tickDistance = educationScale.domain();

var tickDistanceNum = educationScaleNum.domain();

var keyAxis = d3.svg.axis()
    .scale(keyScale)
    .orient("bottom")
    .tickSize(17)
    .tickFormat(function (d) {
        var currIndex = tickDistance.indexOf(d);
        var nextIndex = currIndex + 1;
        if (d === 100.1 || (nextIndex !== 0 && (tickDistance[nextIndex] - tickDistance[currIndex]) > 10)) {
            return '\u00A0' + '\u00A0' + '\u00A0' + Math.round(d) + "%";
        }
        return Math.round(d);
    });
jQuery.fn.d3Click = function () {
  this.each(function (i, e) {
    var evt = new MouseEvent("click");
    e.dispatchEvent(evt);
  });
};
var keyAxisNum = d3.svg.axis()
    .scale(keyScaleNum)
    .orient("bottom")
    .tickSize(17)
    .tickFormat(function (d) {
        var currIndex = tickDistanceNum.indexOf(d);
        var prevIndex = currIndex - 1;
        if (currIndex === 0 || (tickDistanceNum[currIndex] - tickDistanceNum[prevIndex]) > 990) {
            return Math.round(d);
        }
    });

var selected = {};

//x,y position for when there is one map displaying
var mapX = width / 2;
var mapY = 0;

//x,y position for when there are two maps
var map21X = width / 4;
var map21Y = 0;

var map22X = 3* width / 4;
var map22Y = 0;

//x,y position for when there are three maps

//first map
var map31X = width*0.2;
var map31Y = 0;

//second map
var map32X = width/2;
var map32Y = 0;

//third map
var map33X = width*0.8;
var map33Y = 0;

//set datatype equal to the default value of the dropdown menu
var dataType = "education";
var numbers = false;
d3.json("dataSets/caEduHealthPovertyBound.json", function (error, ca) {
    if (error) throw error;
$('.my-form').on('submit', function () {
        document.getElementById("errorText").innerHTML = "";
    var data = null;
    var x = document.getElementById("form");
    var street = "";
    street = x.elements[1].value;
    var city = "";
    city = x.elements[2].value;
    var zip = "";
    zip = x.elements[3].value;
    var state = "ca";
    console.log(street, city, zip);
    if(street != undefined ) street = street.replace(/ /g,"+");
    city = city.replace(/ /g,"+")
    var uri = "https://geocoding.geo.census.gov/geocoder/geographies/address?street=" + street +"&city=" + city + "&state=ca&zip=" + zip + "&benchmark=8&vintage=8&layers=8&format=jsonp";
    jsoncrap(uri, street, state, zip, city);
    document.getElementById("form").reset();
    return false;
});

function jsoncrap(uri, street, state, zip, city) {
     jQuery(function($) {
        $.ajax({
            url: uri,
            dataType: 'jsonp',
            success: function(response) {
                var geoid = response.result.addressMatches[0].geographies["Census Tracts"][0].GEOID;
                console.log(response.result.addressMatches[0].geographies["Census Tracts"][0].GEOID);
                if (selected[parseInt(geoid)] === undefined) {
                    console.log(d3.select("#P"+parseInt(geoid)).datum().properties.GEOID);
                    //addListeners(newRow, this, d, educationScale, "inColCent");
                    selected[d3.select("#P"+parseInt(geoid)).datum().properties.GEOID] = d3.select("#P"+parseInt(geoid));
                    populateRow(d3.select("#P"+parseInt(geoid)), d3.select("#P"+parseInt(geoid)).datum(), educationScale, "inColCent");
                    colorTracts(d3.select("#P"+parseInt(geoid)).datum().properties.GEOID, false);
                    //addListeners(newRow, this, d, educationScale, "inColCent");

                }

            },
            error: function(error) {
                document.getElementById("errorText").innerHTML = "invalid address";
                console.log("error");
                console.log(error);
                return false;
            }
        });
    });
    return true;
}
    var tracts = topojson.feature(ca, ca.objects.tracts);

    var deleteRow = function (row) {
        var table = row.parentNode;
        table.removeChild(row);
    };

    var addListeners = function (newRow, currObj, dee, scale, colorVariable) {
        var colorEval = "parseFloat(d.properties." + colorVariable + ", 10) || 0";
        newRow.addEventListener("click", function () {
            deleteRow(newRow);
            colorTracts(dee.properties.GEOID, true);
            selected[dee.properties.NAME] = undefined;
        });
        newRow.addEventListener("mouseover", function () {
            newRow.style.background = "red";
        });
        newRow.addEventListener("mouseout", function () {
            newRow.style.background = "";
        });
    };
    var colorTracts = function (geoid, reScale) {
        tract1.selectAll(".tract")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("fill", function (d) {
                if (reScale) {
                    if(numbers) {
                        return educationScaleNum(parseFloat(d.properties.numInCol, 10) || 0);
                    } else return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                } else return "orange";
            });
        tract2.selectAll(".tract-2")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("fill", function (d) {
                if (reScale) {
                    if(numbers) {
                        return healthScaleNum(parseFloat(d.properties.total_insured, 10) || 0);
                    } else return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
                } else return "orange";
            });
        tract3.selectAll(".tract-3")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("fill", function (d) {
                if (reScale) {
                    if(numbers) {
                        return povertyScaleNum(parseFloat(d.properties.total_poverty, 10) || 0);
                    } else return povertyScale(parseFloat(d.properties.percent_poverty, 10) || 0);
                } else return "orange";
            });
    };
    var dimTracts = function (d, dim) {
        geoid = d.properties.GEOID;
        tract1.selectAll(".tract")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("opacity", function (d) {
                if (dim) {
                    return "0.5";
                } else return "1";
            });
        tract2.selectAll(".tract-2")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("opacity", function (d) {
                if (dim) {
                    return "0.5";
                } else return "1";
            });
        tract3.selectAll(".tract-3")
            .filter(function (d) {
                return d.properties.GEOID === geoid;
            })
            .style("opacity", function (d) {
                if (dim) {
                    return "0.5";
                } else return "1";
            });
    };
    var populateRow = function (currObj, d, scale, colorVariable) {
        var x = document.getElementById("table1");
        var newRow = document.createElement("TR");
        newRow.setAttribute("id", "row" + d.properties.GEOID);

        var newData = document.createElement("TD");
        newData.innerHTML = d.properties.GEOID;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.county_name;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.population;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.numInCol;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.inColCent;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.total_insured;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.percent_insured;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.total_poverty;
        newRow.appendChild(newData);
        newData = document.createElement("TD");
        newData.innerHTML = d.properties.percent_poverty;
        newRow.appendChild(newData);
        x.appendChild(newRow);
        addListeners(newRow, currObj, d, scale, colorVariable);
    };

    //Tracts

    //Tract 1
    var tract1 = g.append("g")
        .attr("transform", "translate(" + mapX + "," + mapY + ")");

    //Tract 1 Paths
    var tract1paths = tract1.selectAll(".tract1")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("g").attr("class", "tract1")
        .append("path")
        .attr("class", "tract")
        .attr("id", function(d) {return "P" + parseInt(d.properties.GEOID);})
        .style("fill", function (d) {
            return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            mouseover(d);
            dimTracts(d, true);
        })
        .on("mouseout", function (d) {
            mouseout(d);
            dimTracts(d, false);
        })
        .on("mousemove", function (d) {
            mousemove(d);
        })
        .on("click", function (d) {
            console.log(this.id);
            if (selected[d.properties.GEOID] === undefined) {
                selected[d.properties.GEOID] = this;
                populateRow(this, d, educationScale, "inColCent");
                colorTracts(d.properties.GEOID, false);
                //addListeners(newRow, this, d, educationScale, "inColCent");

            } else {
                colorTracts(d.properties.GEOID, true);
                selected[d.properties.GEOID] = undefined;
                var removeme = document.getElementById("row" + d.properties.GEOID);
                removeme.parentElement.removeChild(removeme);
            }
        });
    tract1.append("path")
        .datum(topojson.mesh(ca, ca.objects.counties, function (a, b) {
            return a !== b;
        }))
        .attr("class", "county-border")
        .attr("d", path);

    //Tract 1 Legend - Percentage

    //Tract 1 Legend x,y relative to tract1
    var legend1x = -90;
    var legend1y = height - 35;

    //Set Tract tick values
    keyAxis
        .tickValues(educationScale.domain());

    var legend1 = tract1.append("g")
        .attr("class", "key")
        .attr("transform", "translate(" + legend1x + "," + legend1y + ")");

    var legend1rects = legend1.selectAll("legend1-rect")
        .data(educationScale.range().map(function (color) {
            var d = educationScale.invertExtent(color);
            if (d[0] === null) d[0] = keyScale.domain()[0];
            if (d[1] === null) d[1] = keyScale.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend1-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[1]) - keyScale(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return educationScale(d[0]);
        });

    legend1.call(keyAxis).append("text")
        .attr("class", "legend1-caption")
        .attr("x", 5)
        .attr("y", -9)
        .attr("dy", ".35em")
        .style("font-size", "12px")
        .text("Percentage of population age 18 and over enrolled in college");

    //Tract 1 Legend - Number

    //Set Tract tick values
    keyAxisNum
        .tickValues(educationScaleNum.domain());

    var legend1Num = tract1.append("g")
        .attr("class", "key")
        .attr("visibility", "hidden")
        .attr("transform", "translate(" + legend1x + "," + legend1y + ")");

    var legend1Numrects = legend1Num.selectAll("legend1Num-rect")
        .data(educationScaleNum.range().map(function (color) {
            var d = educationScaleNum.invertExtent(color);
            if (d[0] === null) d[0] = keyScaleNum.domain()[0];
            if (d[1] === null) d[1] = keyScaleNum.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend1Num-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[1]) - keyScaleNum(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return educationScaleNum(d[0]);
        });

    legend1Num.call(keyAxisNum).append("text")
        .attr("class", "legend1Num-caption")
        .attr("x", 5)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("font-size", "13px")
        .text("Total number of people age 18 and over enrolled in college");

    //Tract 2
    var tract2 = g.append("g")
        .attr("visibility", "hidden");

    //Tract 2 Paths
    var tract2paths = tract2.selectAll(".tract2")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("g").attr("class", "tract2")
        .append("path")
        .attr("class", "tract-2")
        .style("fill", function (d) {
            return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            mouseover(d);
            dimTracts(d, true);
        })
        .on("mouseout", function (d) {
            mouseout(d);
            dimTracts(d, false);
        })
        .on("mousemove", function (d) {
            mousemove(d);
        })
        .on("click", function (d) {
            if (selected[d.properties.GEOID] === undefined) {
                selected[d.properties.GEOID] = this;
                populateRow(this, d, healthScale, "percent_insured");
                colorTracts(d.properties.GEOID, false);
                //addListeners(newRow, this, d, healthScale, "percent_insured");
            } else {
                colorTracts(d.properties.GEOID, true);
                selected[d.properties.GEOID] = undefined;
                var removeme = document.getElementById("row" + d.properties.GEOID);
                removeme.parentElement.removeChild(removeme);
            }
        });

    tract2.append("path")
        .datum(topojson.mesh(ca, ca.objects.counties, function (a, b) {
            return a !== b;
        }))
        .attr("class", "county-border")
        .attr("d", path);

    //Tract 2 Legend - Percentage

    //Tract 2 Legend x,y relative to tract2
    var legend2x = -90;
    var legend2y = height - 35;

    //Set Tract tick values
    keyAxis.tickValues(healthScale.domain());
    tickDistance = healthScale.domain();

    var legend2 = tract2.append("g")
        .attr("class", "key")
        .attr("transform", "translate(" + legend2x + "," + legend2y + ")");

    var legend2rects = legend2.selectAll("legend2-rect")
        .data(healthScale.range().map(function (color) {
            var d = healthScale.invertExtent(color);
            if (d[0] === null) d[0] = keyScale.domain()[0];
            if (d[1] === null) d[1] = keyScale.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend2-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[1]) - keyScale(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return healthScale(d[0]);
        });

    legend2.call(keyAxis).append("text")
        .attr("class", "legend2-caption")
        .attr("x", 5)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("font-size", "14px")
        .text("Percentage of population with health insurance");

    //Tract 2 Legend - Number

    //Set Tract tick values

    keyScaleNum.range([0, 0.015]);

    keyAxisNum
        .tickValues(healthScaleNum.domain());

    tickDistanceNum = healthScaleNum.domain();

    var legend2Num = tract2.append("g")
        .attr("class", "key")
        .attr("visibility", "hidden")
        .attr("transform", "translate(" + legend2x + "," + legend2y + ")");

    var legend2Numrects = legend2Num.selectAll("legend2Num-rect")
        .data(healthScaleNum.range().map(function (color) {
            var d = healthScaleNum.invertExtent(color);
            if (d[0] === null) d[0] = keyScaleNum.domain()[0];
            if (d[1] === null) d[1] = keyScaleNum.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend2Num-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[1]) - keyScaleNum(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return healthScaleNum(d[0]);
        });

    legend2Num.call(keyAxisNum).append("text")
        .attr("class", "legend2Num-caption")
        .attr("x", 5)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("font-size", "14px")
        .text("Total number of people with health insurance");

    //Tract 3
    var tract3 = g.append("g")
        .attr("visibility", "hidden");

    //Tract 3 Paths
    var tract3paths = tract3.selectAll(".tract3")
        .data(topojson.feature(ca, ca.objects.tracts).features)
        .enter().append("g").attr("class", "tract3")
        .append("path")
        .attr("class", "tract-3")
        .style("fill", function (d) {
            return povertyScale(parseFloat(d.properties.percent_poverty, 10) || 0);
        })
        .attr("d", path)
        .on("mouseover", function (d) {
            mouseover(d);
            dimTracts(d, true);
        })
        .on("mouseout", function (d) {
            mouseout(d);
            dimTracts(d, false);
        })
        .on("mousemove", function (d) {
            mousemove(d);
        })
        .on("click", function (d) {
            if (selected[d.properties.GEOID] === undefined) {
                selected[d.properties.GEOID] = this;
                populateRow(this, d, povertyScale, "percent_poverty");
                colorTracts(d.properties.GEOID, false);
                //addListeners(newRow, this, d, povertyScale, "percent_poverty");

            } else {
                colorTracts(d.properties.GEOID, true);
                selected[d.properties.GEOID] = undefined;
                var removeme = document.getElementById("row" + d.properties.GEOID);
                removeme.parentElement.removeChild(removeme);
            }
        });

    tract3.append("path")
        .datum(topojson.mesh(ca, ca.objects.counties, function (a, b) {
            return a !== b;
        }))
        .attr("class", "county-border")
        .attr("d", path);

    //Tract 3 Legend - Percentage

    //Tract 3 Legend x,y relative to tract3
    var legend3x = -90;
    var legend3y = height - 35;

    //Set Tract tick values
    keyAxis.tickValues(povertyScale.domain());
    tickDistance = povertyScale.domain();

    var legend3 = tract3.append("g")
        .attr("class", "key")
        .attr("transform", "translate(" + legend3x + "," + legend3y + ")");

    var legend3rects = legend3.selectAll("legend3-rect")
        .data(povertyScale.range().map(function (color) {
            var d = povertyScale.invertExtent(color);
            if (d[0] === null) d[0] = keyScale.domain()[0];
            if (d[1] === null) d[1] = keyScale.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend3-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScale(d[1]) - keyScale(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return povertyScale(d[0]);
        });

    legend3.call(keyAxis).append("text")
        .attr("class", "legend3-caption")
        .attr("x", 5)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("font-size", "14px")
        .text("Percentage of population below poverty level");

    //Tract 3 Legend - Number

    //Set Tract tick values

    keyScaleNum.range([0, 0.06]);

    keyAxisNum
        .tickValues(povertyScaleNum.domain())
        .tickFormat(function (d) {
            var currIndex = tickDistanceNum.indexOf(d);
            var prevIndex = currIndex - 1;
            if (currIndex === 0 || (tickDistanceNum[currIndex] - tickDistanceNum[prevIndex]) > 380) {
                return Math.round(d);
            }
        });

    tickDistanceNum = povertyScaleNum.domain();

    var legend3Num = tract3.append("g")
        .attr("class", "key")
        .attr("visibility", "hidden")
        .attr("transform", "translate(" + legend3x + "," + legend3y + ")");

    var legend3Numrects = legend3Num.selectAll("legend3Num-rect")
        .data(povertyScaleNum.range().map(function (color) {
            var d = povertyScaleNum.invertExtent(color);
            if (d[0] === null) d[0] = keyScaleNum.domain()[0];
            if (d[1] === null) d[1] = keyScaleNum.domain()[1];
            return d;
        })).enter().append("rect")
        .attr("class", "legend3Num-rect")
        .attr("x", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[0]);
            }
        })
        .attr("width", function (d) {
            if (d[1] !== 0) {
                return keyScaleNum(d[1]) - keyScaleNum(d[0]);
            }
        })
        .attr("height", 15)
        .style("fill", function (d) {
            return povertyScaleNum(d[0]);
        });

    legend3Num.call(keyAxisNum).append("text")
        .attr("class", "legend3Num-caption")
        .attr("x", 5)
        .attr("y", -10)
        .attr("dy", ".35em")
        .style("font-size", "14px")
        .text("Total number of people below poverty level");

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


    d3.select("#wrapper").remove();

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
        if (button_edu == "true" && button_health == "true" && button_poverty == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map31X + "," + map31Y + ")");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map32X + "," + map32Y + ")");

            tract3.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map33X + "," + map33Y + ")");
        } else if (button_edu == "true" && button_health == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map21X + "," + map21Y + ")");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map22X + "," + map22Y + ")");

            tract3
                .attr("visibility", "hidden");
        } else if (button_edu == "true" && button_poverty == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map21X + "," + map21Y + ")");

            tract3.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map22X + "," + map22Y + ")");

            tract2
                .attr("visibility", "hidden");
        } else if (button_health == "true" && button_poverty == "true") {
            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map21X + "," + map21Y + ")");

            tract3.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + map22X + "," + map22Y + ")");

            tract1
                .attr("visibility", "hidden");
        } else if (button_edu == "true") {
            tract1.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + mapX + "," + mapY + ")");

            tract2
                .attr("visibility", "hidden");

            tract3
                .attr("visibility", "hidden");


        } else if (button_health == "true") {
            tract1
                .attr("visibility", "hidden");

            tract2.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + mapX + "," + mapY + ")");

            tract3
                .attr("visibility", "hidden");
        } else if (button_poverty == "true") {
            tract1
                .attr("visibility", "hidden");

            tract2
                .attr("visibility", "hidden");

            tract3.transition()
                .duration(750)
                .attr("visibility", "visible")
                .attr("transform", "translate(" + mapX + "," + mapY + ")");
        }

    });

    //Toggle Switch between number and percentage
    $('#switcher').click(function () {
        for(key in selected) {
            if(selected[key] != undefined) {
                selected[key] = undefined;
                var removeme = document.getElementById("row" + key);
                if(removeme === null) continue;
                removeme.parentElement.removeChild(removeme);
            }
        }
        numbers = !numbers;
        if ($('#filt-css').attr('class') === "toggler") {
            //Number
            tract1paths.transition().duration(450)
                .style("fill", function (d) {
                    return educationScaleNum(d.properties.numInCol);
                });

            tract2paths.transition().duration(450)
                .style("fill", function (d) {
                    return healthScaleNum(d.properties.total_insured);
                });

            tract3paths.transition().duration(450)
                .style("fill", function (d) {
                    return povertyScaleNum(d.properties.total_poverty);
                });

            legend1Num.attr("visibility", "");

            legend1.attr("visibility", "hidden");

            legend2Num.attr("visibility", "");

            legend2.attr("visibility", "hidden");

            legend3Num.attr("visibility", "");

            legend3.attr("visibility", "hidden");
        } else {
            //Percentage
            tract1paths.transition().duration(450)
                .style("fill", function (d) {
                    return educationScale(parseFloat(d.properties.inColCent, 10) || 0);
                });

            tract2paths.transition().duration(450)
                .style("fill", function (d) {
                    return healthScale(parseFloat(d.properties.percent_insured, 10) || 0);
                });

            tract3paths.transition().duration(450)
                .style("fill", function (d) {
                    return povertyScale(parseFloat(d.properties.percent_poverty, 10) || 0);
                });

            legend1Num.attr("visibility", "hidden");

            legend1.attr("visibility", "");

            legend2Num.attr("visibility", "hidden");

            legend2.attr("visibility", "");

            legend3Num.attr("visibility", "hidden");

            legend3.attr("visibility", "");
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
    
    if(numbers) {
        div.html("<p style=text-align:center> <strong> <font size=3>" + d.properties.county_name +
            " Tract </strong> </font> <p style=text-align:left> GeoID: " + "<span style=float:right;>" + d.properties.GEOID + "</span> </p>" +
            "<p style=text-align:left> Total Population: " + "<span style=float:right;>" + d.properties.population + "</span> </p>" +
            "<p style=text-align:left> 18+ in College: " + "<span style=float:right;>" + d.properties.numInCol + "</span> </p>" +
            "<p style=text-align:left> Insured " + "<span style=float:right;>" + d.properties.total_insured + "</span> </p>" +
            "<p style=text-align:left> Living in Poverty: " + "<span style=float:right;>" + d.properties.total_poverty + "</span> </p>").style("left", (d3.event.pageX - 260) + "px")
        .style("top", (d3.event.pageY) + 20 + "px");
    } else {
    div.html("<p style=text-align:center> <strong> <font size=3>" + d.properties.county_name +
            " Tract </strong> </font> <p style=text-align:left> GeoID: " + "<span style=float:right;>" + d.properties.GEOID + "</span> </p>" +
            "<p style=text-align:left> Total Population: " + "<span style=float:right;>" + d.properties.population + "</span> </p>" +
            "<p style=text-align:left> % of 18+ in College: " + "<span style=float:right;>" + d.properties.inColCent + "</span> </p>" +
            "<p style=text-align:left> % Insured " + "<span style=float:right;>" + d.properties.percent_insured + "</span> </p>" +
            "<p style=text-align:left> % Living in Poverty: " + "<span style=float:right;>" + d.properties.percent_poverty + "</span> </p>").style("left", (d3.event.pageX - 260) + "px")
        .style("top", (d3.event.pageY) + 20 + "px");
    }
}

function mouseout(d) {
    div.style("display", "none");
}


function zoomed() {
    if (d3.event.translate[0] === 0 && d3.event.translate[0] === 0) {
        window.scrollBy(0, 80);
    }

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