function E(x) {
    if (x === 0 || x === 1 || 0.99999 <= x) {
        return 0;
    }
    return (-x) * Math.log2(x) - (1 - x) * Math.log2(1 - x);
}

// Returns array of points that represents E(x)
function graphFunction() {
    var pointNum = 1;

    const data = [];
    for (var x = 0; x <= pointNum + 0.001; x = x + 0.001) {
        var y = E(x);
        data.push([x, y])
    }
    return data;
}

function calcProbs(inputElements) {
    var sum = 0;
    for (const element of inputElements) {
        sum += parseInt(element.value, 10);
    }

    document.getElementById('sum-classes').textContent = sum;

    // Show alert about all instance values being 0
    if (sum === 0) {
        $('#alert-sum-0').removeClass('d-none');
    } else {
        // If the alert is still being displayed, hide it now that there is at least one non-zero instance value
        $('#alert-sum-0').addClass('d-none');
    }

    var pValues = [];
    for (var i = 0; i < inputElements.length; i++) {
        // To not divide by 0 if all instance values are 0
        var pValue = sum === 0 ? 0 : parseInt(inputElements[i].value, 10) / sum;
        pValues.push(pValue);
        document.getElementById('p' + (i + 1).toString()).textContent = pValue;
    }

    return pValues;
}

function drawPoint(data, tableEntropy) {
    // FInd the closest data point to the x-value of p(Class 1)
    var targetXvalue = tableEntropy.tBodies[0].rows[0].cells[1].textContent;
    var closest = data[0][0];
    var closestPoint = data[0];
    // Assume the first number is the closest
    var closestDiff = Math.abs(targetXvalue - closest);

    // Calculate the difference between the target and closest  
    for (const dataPoint of data) {
        var currentXvalue = dataPoint[0];
        var currentDiff = Math.abs(targetXvalue - currentXvalue);

        // Calculate the difference between the target and current number
        if (currentDiff < closestDiff) {
            // Update the closest number
            closestPoint = dataPoint;

            // Update the closest difference
            closestDiff = currentDiff;
        }

    }
    var points = [[closestPoint[0], closestPoint[1]], [closestPoint[0], 0]];

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

function checkInput(instanceVals) {
    try {
        var invalidVal = false;
        var emptyInput = false;

        // Check if there are any negative values or empty inputs
        for (const instanceVal of instanceVals) {
            var value = instanceVal.value;
            if (value < 0 || isNaN(value) || value % 1 !== 0) invalidVal = true;
            if (value == "") emptyInput = true;
        }

        // If there are errors, display alerts and cancel the calculation
        if (invalidVal && emptyInput) throw ['#alert-invalid-val', '#alert-empty-input'];
        if (invalidVal) throw ['#alert-invalid-val'];
        if (emptyInput) throw ['#alert-empty-input'];

    } catch (errors) {
        // Display all alerts
        errors.forEach(error => {
            $(error).removeClass('d-none');
        });
        // If only one error is found, remove the alert for the other in case it occurred before and has now been fixed
        if (errors.length === 1) {
            if (errors[0] == '#alert-invalid-val') {
                $('#alert-empty-input').addClass('d-none');
            } else {
                $('#alert-invalid-val').addClass('d-none');
            }

        }
        // If the alert for all-0 values is still being displayed:
        // hide it now that it is not all-0 values anymore
        $('#alert-sum-0').addClass('d-none');
        return 1;
    }
    return 0;
}

function calcEntropy() {
    var table = document.getElementById('table-classes');
    var inputElements = table.getElementsByTagName('input');

    // Cancel calculation if the input is invalid
    if (checkInput(inputElements) === 1) {
        return;
    }

    // If any of the alerts are still being displayed, hide it now that there are no input errors anymore
    $('#alert-invalid-val').addClass('d-none');
    $('#alert-empty-input').addClass('d-none');

    // Calculate the probabilities
    var pValues = calcProbs(inputElements);

    // Remove the previous point and line
    svg.select("#pointLine").remove();
    svg.selectAll("circle").remove();

    var sum = 0;
    for (const pValue of pValues) {
        sum -= pValue * Math.log2(pValue);
    }

    if (isNaN(sum)) {
        var output = document.getElementById('sum-entropy');
        output.textContent = 0;
    } else {
        var output = document.getElementById('sum-entropy');
        output.textContent = sum;
    }

    var tableEntropy = document.getElementById('table-entropy');
    var tableClasses = document.getElementById('table-classes');
    var numberClasses = tableClasses.getElementsByTagName('tbody')[0].rows.length;
    if (numberClasses === 2) {
        var data = graphFunction();
        drawPoint(data, tableEntropy);
    }
}

function createRemoveButton() {
    var removeButton = document.createElement("div");
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-outline-danger");
    removeButton.setAttribute("onclick", "removeClass()");
    removeButton.textContent = "-";
    return removeButton;
}

function addClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    var tBodyRefEntropy = tableEntropy.getElementsByTagName('tbody')[0];

    // Display info alert for calculating the Entropy with more than 2 classes
    // (change it here so that it's only called when the rows length goes from 2 to 3)
    if (tBodyRefClasses.rows.length === 2) {
        $('#alert-3-plus-classes').removeClass('d-none');
    }

    // Classes table
    // add border under class cell of the current last row
    tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[0].setAttribute("style", "border-bottom: visible");

    var cCount = +tBodyRefClasses.rows[tBodyRefClasses.rows.length - 1].cells[1].id[1] + 1;
    var newRow = tBodyRefClasses.insertRow();
    var cCell = newRow.insertCell();
    var cValueCell = newRow.insertCell();

    // Class cell
    var newLabel = document.createElement("label");
    newLabel.classList.add("form-control-plaintext");
    newLabel.textContent = "Class " + +cCount + ":";
    cCell.appendChild(newLabel);
    cCell.setAttribute("style", "border-bottom: hidden");

    // Value (Number of instances) cell
    cValueCell.id = "c" + cCount;
    var inputGroup = document.createElement("div");
    inputGroup.classList.add("input-group");

    var newInput = document.createElement("input");
    newInput.setAttribute("value", "0");
    newInput.setAttribute("style", "width:100px");
    newInput.setAttribute("type", "text");
    newInput.classList.add("form-control");
    inputGroup.appendChild(newInput);

    var removeButton = createRemoveButton();
    inputGroup.appendChild(removeButton);

    cValueCell.appendChild(inputGroup);

    // remove "Class remove button" of previous input group so that there is only one
    if (tBodyRefClasses.rows.length >= 4) {
        var cell = tBodyRefClasses.rows[tBodyRefClasses.rows.length - 2].cells[1]
        var inputG = cell.getElementsByTagName("div")[0];
        var input = inputG.getElementsByTagName("input")[0];
        var button = inputG.getElementsByTagName("div")[0];
        inputG.removeChild(button);
        cell.removeChild(inputG);
        cell.appendChild(input);
    }

    // Entropy table
    var pCount = +tBodyRefEntropy.rows[tBodyRefEntropy.rows.length - 1].cells[1].id[1] + 1;
    var newRowE = tBodyRefEntropy.insertRow();
    var pCell = newRowE.insertCell();
    var valueCell = newRowE.insertCell();

    // Probability cell
    pCell.textContent = "p(Class " + +pCount + "):";

    // Value cell
    valueCell.textContent = 0;
    valueCell.id = "p" + pCount;
}

function removeClass() {
    var tableClasses = document.getElementById('table-classes');
    var tableEntropy = document.getElementById('table-entropy');
    var tBodyRefClasses = tableClasses.tBodies[0]
    var numClassesBefore = tBodyRefClasses.rows.length;

    tableClasses.deleteRow(numClassesBefore);
    tableEntropy.deleteRow(numClassesBefore - 1);

    var numClassesAfter = tBodyRefClasses.rows.length;

    // remove border under class cell of the new last row
    tBodyRefClasses.rows[numClassesAfter - 1].cells[0].setAttribute("style", "border-bottom: hidden");

    // add "Class remove button" to the now last row
    if (numClassesAfter >= 3) {
        var inputGroup = document.createElement("div");
        inputGroup.classList.add("input-group");

        var cell = tBodyRefClasses.rows[numClassesAfter - 1].cells[1]
        var input = cell.getElementsByTagName("input")[0];
        cell.removeChild(input);
        inputGroup.appendChild(input);

        var removeButton = createRemoveButton();
        inputGroup.appendChild(removeButton);

        cell.appendChild(inputGroup);
    }

    // Display info alert for calculating the Entropy with more than 2 classes
    // (change it here so that it's only called when the rows length goes from 2 to 3)
    if (numClassesAfter === 2) {
        $('#alert-3-plus-classes').addClass('d-none');
    }
}

