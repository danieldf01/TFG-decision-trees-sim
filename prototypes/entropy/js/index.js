const margin = {top: 10, right: 50, bottom: 50, left: 50},
    width = 450 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#root").attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")"); //move the svg area

// Define chart area
svg
    .append("clipPath") // clipPath restricts region to which paint can be applied
    .attr("id", "chart-area")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height);

// Add Axes
const xMax = 1;
const yMax = 1;

var xScale = d3.scaleLinear([0, xMax], [0, width]);
var yScale = d3.scaleLinear([0, yMax], [height, 0]);

var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale);
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
svg.append("g")
    .attr("transform", `translate(0,0)`)
    .call(yAxis);

// Axes label
svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width / 2 + 5)
    .attr("y", height + 35)
    .text("p");

svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -35)
    .attr("x", -height / 2)
    .attr("transform", "rotate(-90)")
    .html("Entropy");

function E(x) {
    if (x == 0 || x == 1 || 0.99999 <= x) {
        return 0;
    }
    return (-x) * Math.log2(x) - (1 - x) * Math.log2(1 - x);
}

// Returns array of points that represents E(x)
function graphFunction() {
    pointNum = 1;

    const data = [];
    for (var x = 0; x <= pointNum + 0.001; x = x + 0.001) {
        y = E(x);
        data.push([x, y])
    }
    return data;
}

// Add function graph
var line = d3.line()
    .x(d => xScale(d[0]))
    .y(d => yScale(d[1]));

var data = graphFunction();
svg.append("path")
    .datum(data)
    .attr("clip-path", "url(#chart-area)")
    .attr("fill", "none")
    .attr("stroke", "teal")
    .attr("stroke-width", 2)
    .attr("d", line);


function calcProbs() {
    var table = document.getElementById('table-classes');
    var items = table.getElementsByTagName('input');
    var sum = 0;
    for (var i = 0; i < items.length; i++) {
        sum += parseInt(items[i].value);
    }
    document.getElementById('sum-classes').innerHTML = sum;
    for (var i = 0; i < items.length; i++) {
        var pValue = parseInt(items[i].value) / sum
        document.getElementById('p' + (i + 1).toString()).innerHTML = pValue;
    }
}

function drawPoint(data, tableEntropy) {
    // FInd the closest data point to the x-value of p(Class 1)
    var targetValue = tableEntropy.tBodies[0].rows[0].cells[1].innerHTML;
    var closest = data[0][0];
    var closestPoint = data[0];
    // Assume the first number is the closest
    var closestDiff = Math.abs(targetValue - closest);

    // Calculate the difference between the target and closest
    for (var i = 0; i < data.length; i++) {
        var current = data[i][0];
        var currentDiff = Math.abs(targetValue - current);

        // Calculate the difference between the target and current number
        if (currentDiff < closestDiff) {
            // Update the closest number
            closestPoint = data[i];

            // Update the closest difference
            closestDiff = currentDiff;
        }

    }
    points = [[closestPoint[0], closestPoint[1]], [closestPoint[0], 0]];

    // Draw point on x-axis
    svg.append("circle")
        .attr("r", 3)
        .attr("fill", "red")
        .style("stroke", "red")
        .attr("opacity", .70)
        .attr("cx", xScale(points[0][0]))
        .attr("cy", yScale(0));

    // Draw line between point and entropy graph
    svg.append("path")
        .datum(points)
        .attr("fill", "red")
        .attr("stroke", "red")
        .attr("stroke-width", 1)
        .attr("opacity", .70)
        .attr("d", line)
        .attr("id", "pointLine");
}

function calcEntropy() {
    svg.select("#pointLine").remove();
    svg.selectAll("circle").remove();
    calcProbs();
    var table = document.getElementById('table-entropy');
    var rowCount = table.tBodies[0].rows.length;
    var columnIndex = 1;
    var sum = 0;
    for (var i = 0; i < rowCount; i++) {
        var pCurrent = table.rows[i].cells[columnIndex].innerHTML;
        sum -= pCurrent * Math.log2(pCurrent);
    }
    if (isNaN(sum)) {
        var output = document.getElementById('sum-entropy');
        output.innerHTML = 0;
    } else {
        var output = document.getElementById('sum-entropy');
        output.innerHTML = sum;
    }
    var tableClasses = document.getElementById('table-classes');
    var numberClasses = tableClasses.getElementsByTagName('tbody')[0].rows.length;
    if (numberClasses == 2) {
        drawPoint(data, table);
    }
}

function addClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var tBodyRef = tableEntropy.getElementsByTagName('tbody')[0];

    var clone = tableClasses.rows[tableClasses.rows.length - 2].cloneNode(true);
    clone.cells[0].firstChild.data =
        clone.cells[0].firstChild.data.replace(/(\d+):/, function (str, g1) {
            return (+g1 + 1) + ':';
        });
    tableClasses.tBodies[0].appendChild(clone);

    var pCount = +tBodyRef.rows[tBodyRef.rows.length - 1].cells[1].id[1] + 1;
    var newRow = tBodyRef.insertRow();
    var pCell = newRow.insertCell();
    var valueCell = newRow.insertCell();

    pCell.innerHTML = "p(Class " + +pCount + "):";

    valueCell.innerHTML = 0;
    valueCell.id = "p" + pCount;
}

function removeClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var numberClasses = tableClasses.getElementsByTagName('tbody')[0].rows.length;
    if (numberClasses == 2) {
        document.getElementById("removeClassErr").style.visibility = "visible";
        setTimeout(() => {
            var errorMessage = document.getElementById("removeClassErr");
            errorMessage.style.visibility = "hidden";
        }, 5000);
    } else {
        tableClasses.deleteRow(tableClasses.tBodies[0].rows.length);
        tableEntropy.deleteRow(tableEntropy.tBodies[0].rows.length - 1);
    }
}

