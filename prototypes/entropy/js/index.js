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
        var value = parseInt(items[i].value);
        // If there is a negative value, display alert and cancel the calculation
        try{
            if(value < 0) throw new Error;
            sum += value;
        } catch(err){
            $('#alert-negative-val').removeClass('d-none');
            // If the alert for all-0 values is still being displayed:
            // hide it now that it is not all-0 values anymore
            $('#alert-sum-0').addClass('d-none');
            return;
        }
    }

    // If the alert is still being displayed, hide it now that there are no negative values anymore
    $('#alert-negative-val').addClass('d-none');

    document.getElementById('sum-classes').innerHTML = sum;

    // Show alert about all instance values being 0
    if(sum == 0){
        $('#alert-sum-0').removeClass('d-none');
    } else {
        // If the alert is still being displayed, hide it now that there is at least one non-zero instance value
        $('#alert-sum-0').addClass('d-none');
    }
    
    var pValues = [];
    for (var i = 0; i < items.length; i++) {
        // To not divide by 0 if all instance values are 0
        var pValue = sum == 0? 0 : parseInt(items[i].value) / sum;
        pValues.push(pValue);
        document.getElementById('p' + (i + 1).toString()).innerHTML = pValue;
    }
    
    return pValues;
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
    // If there is a negative value, cancel the calculation
    try{
        var pValues = calcProbs();
        if(pValues == null) throw new Error;
    } catch(err){
        return;
    }

    // Remove the previous point and line
    svg.select("#pointLine").remove();
    svg.selectAll("circle").remove();

    var columnIndex = 1;
    var sum = 0;
    for (var i = 0; i < pValues.length; i++) {
        sum -= pValues[i] * Math.log2(pValues[i]);
    }
    
    if (isNaN(sum)) {
        var output = document.getElementById('sum-entropy');
        output.innerHTML = 0;
    } else {
        var output = document.getElementById('sum-entropy');
        output.innerHTML = sum;
    }

    var tableEntropy = document.getElementById('table-entropy');
    var tableClasses = document.getElementById('table-classes');
    var numberClasses = tableClasses.getElementsByTagName('tbody')[0].rows.length;
    if (numberClasses == 2) {
        drawPoint(data, tableEntropy);
    }
}

function addClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    var tBodyRef = tableEntropy.getElementsByTagName('tbody')[0];

    // Classes table
    // add border under class cell of the current last row
    tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[0].setAttribute("style", "border-bottom: visible");

    var cCount = +tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[1].id[1] + 1;
    var newRow = tBodyRefClasses.insertRow();
    var cCell = newRow.insertCell();
    var cValueCell = newRow.insertCell();
    
    // Class cell
    newLabel = document.createElement("label");
    newLabel.classList.add("form-control-plaintext");
    newLabel.innerHTML = "Class " + +cCount + ":";
    cCell.appendChild(newLabel);
    cCell.setAttribute("style", "border-bottom: hidden");
    
    // Value (Number of instances) cell
    cValueCell.id = "c" + cCount;
    inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    newInput = document.createElement("input");
    newInput.setAttribute("value", "0");
    newInput.setAttribute("style", "width:100px");
    newInput.setAttribute("type", "text");
    newInput.classList.add("form-control");
    inputGroup.appendChild(newInput);

    removeButton = document.createElement("div");
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-outline-danger");
    removeButton.setAttribute("onclick", "removeClass()");
    removeButton.innerHTML = "-";
    inputGroup.appendChild(removeButton);

    cValueCell.appendChild(inputGroup);

    // remove "Class remove button" of previous input group so that there is only one
    if(tBodyRefClasses.rows.length >= 4) {
        cell = tBodyRefClasses.rows[tBodyRefClasses.rows.length - 2].cells[1]
        inputG = cell.getElementsByTagName("div")[0];
        input = inputG.getElementsByTagName("input")[0];
        button = inputG.getElementsByTagName("div")[0];
        inputG.removeChild(button);
        cell.removeChild(inputG);
        cell.appendChild(input);
    }
    

    // Entropy table
    var pCount = +tBodyRef.rows[tBodyRef.rows.length - 1].cells[1].id[1] + 1;
    var newRow = tBodyRef.insertRow();
    var pCell = newRow.insertCell();
    var valueCell = newRow.insertCell();

    // Probability cell
    pCell.innerHTML = "p(Class " + +pCount + "):";

    // Value cell
    valueCell.innerHTML = 0;
    valueCell.id = "p" + pCount;
}

function removeClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var numberClasses = tableClasses.getElementsByTagName('tbody')[0].rows.length;

    tableClasses.deleteRow(tableClasses.tBodies[0].rows.length);
    tableEntropy.deleteRow(tableEntropy.tBodies[0].rows.length - 1);

    // remove border under class cell of the new last row
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[0].setAttribute("style", "border-bottom: hidden");

    // add "Class remove button" to the now last row
    if(tBodyRefClasses.rows.length >= 3) {
        inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");
        
        cell = tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[1]
        input = cell.getElementsByTagName("input")[0];
        cell.removeChild(input);
        inputGroup.appendChild(input);
        
        removeButton = document.createElement("div");
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-outline-danger");
        removeButton.setAttribute("onclick", "removeClass()");
        removeButton.innerHTML = "-";
        inputGroup.appendChild(removeButton);
        
        cell.appendChild(inputGroup);
    }
}

