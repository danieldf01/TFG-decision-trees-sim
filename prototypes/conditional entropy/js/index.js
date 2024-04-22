function calcRatio(tBodyRef, instanceVals){
    var sum = 0;
    var rowSums = [];
    for (var i = 0; i < instanceVals.length; i++) {
        currentVal = parseInt(instanceVals[i].value, 10);
        sum += currentVal;

        // Calculate the sum of the row's instance values
        if(i % 2){
            rowSums.push(parseInt(instanceVals[i-1].value, 10) + currentVal);
        }
    }

    // Show alert about all instance values being 0
    if(sum === 0){
        $('#alert-sum-0').removeClass('d-none');
    } else {
        // If the alert is still being displayed, hide it now that there is at least one non-zero instance value
        $('#alert-sum-0').addClass('d-none');
    }

    var rowCount = tBodyRef.rows.length;
    var ratioVals = []
    for (i = 0; i < rowCount; i++) {
        // To not divide by 0 if all instance values are 0
        var ratio = sum === 0? 0 : rowSums[i] / sum;
        ratioVals.push(ratio);
        var ratioCell = tBodyRef.rows[i].getElementsByTagName('td')[3];
        var ratioLabel = ratioCell.getElementsByTagName('label')[0];
        ratioLabel.textContent = ratio;
    }
    
    return [rowSums, ratioVals];
}

function calcEntropyCat(rowSums, tBodyRef, instanceVals){
    // Get the Class values for each category
    var rowValues = [];
    for (var i = 0; i < instanceVals.length; i++) {
        if(i % 2){
            rowValue = [parseInt(instanceVals[i-1].value, 10), parseInt(instanceVals[i].value)];
            rowValues.push(rowValue);
        }
    }

    // Calculate the Entropy for each category
    var entropies = [];
    for (i = 0; i < rowSums.length; i++) {
        var entropy = 0;
        // Entropy is 0 if there are no instances belonging to one of the classes
        if (rowValues[i][0] !== 0 && rowValues[i][1] !== 0){
            for (var j = 0; j < 2; j++) {
                entropy -= (rowValues[i][j] / rowSums[i]) * Math.log2(rowValues[i][j] / rowSums[i]);
            }
        }

        var entropyCell = tBodyRef.getElementsByTagName('tr')[i].getElementsByTagName('td')[4];
        var entropyLabel = entropyCell.getElementsByTagName('label')[0];
        entropyLabel.textContent = entropy;
        entropies.push(entropy);
    }
    return entropies;

}

function checkInput(instanceVals){
    try{
        var invalidVal = false;
        var emptyInput = false;
        errors = [];

        // Check if there are any negative values or empty inputs
        for (var i = 0; i < instanceVals.length; i++) {
            var value = instanceVals[i].value;
            if(value < 0 || isNaN(value) || value % 1 !== 0) invalidVal = true;
            if(value == "") emptyInput = true;
        }

        // If there are errors, display alerts and cancel the calculation
        if (invalidVal && emptyInput) throw ['#alert-invalid-val', '#alert-empty-input'];
        if (invalidVal) throw ['#alert-invalid-val'];
        if (emptyInput) throw ['#alert-empty-input'];

    } catch(errors){
        // Display all alerts
        errors.forEach(error => {
            $(error).removeClass('d-none');
        });
        // If only one error is found, remove the alert for the other in case it occurred before and has now been fixed
        if (errors.length === 1){
            if (errors[0] == '#alert-invalid-val'){
                $('#alert-empty-input').addClass('d-none');
            } else{
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

function calcCondEntropy(){
    // Calculate ratios and Entropies for each category first
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    var instanceVals = table.getElementsByTagName('input');

    // Cancel calculation if the input is invalid
    if(checkInput(instanceVals) === 1){
        return;
    }

    // If any of the alerts are still being displayed, hide it now that there are no input errors anymore
    $('#alert-invalid-val').addClass('d-none');
    $('#alert-empty-input').addClass('d-none');

    var rowSumsRatios = calcRatio(tBodyRef, instanceVals);
    var rowSums = rowSumsRatios[0];
    var ratioVals = rowSumsRatios[1];
    var entropies = calcEntropyCat(rowSums, tBodyRef, instanceVals);

    var condEntropy = 0;
    for (var i = 0; i < entropies.length; i++) {
        condEntropy += ratioVals[i] * entropies[i];
    }
    document.getElementById('ce').textContent = condEntropy;
}
    
function removeCategory(){
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    table.deleteRow(tBodyRef.rows.length);

    // add "Category remove button" to the now last row
    if(tBodyRef.rows.length >= 3) {
        var removeButton = document.createElement("div");
        removeButton.classList.add("btn");
        removeButton.classList.add("btn-outline-danger");
        removeButton.setAttribute("onclick", "removeCategory()");
        removeButton.innerHTML = "-";

        var cell = tBodyRef.rows[tBodyRef.rows.length - 1].cells[0]
        cell.appendChild(removeButton);
    }
}

function addCategory(){
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];

    var catCount = +tBodyRef.rows[tBodyRef.rows.length - 1].cells[0].id[1] + 1;
    var newRow = tBodyRef.insertRow();
    var catCell = newRow.insertCell();
    var class1Cell = newRow.insertCell();
    var class2Cell = newRow.insertCell();
    var ratioCell = newRow.insertCell();
    var entropyCell = newRow.insertCell();

    // Category cell
    catCell.id = "c" + catCount;
    var catLabel = document.createElement("label");
    catLabel.classList.add("form-control-plaintext");
    catLabel.textContent = "Category " + +catCount + ":";
    catCell.appendChild(catLabel);

    var removeButton = document.createElement("div");
    removeButton.classList.add("btn");
    removeButton.classList.add("btn-outline-danger");
    removeButton.setAttribute("onclick", "removeCategory()");
    removeButton.innerHTML = "-";
    catCell.appendChild(removeButton);

    // Class 1 cell
    class1Input = document.createElement("input");
    class1Input.setAttribute("value", "0");
    class1Input.setAttribute("type", "text");
    class1Input.classList.add("form-control");
    class1Cell.appendChild(class1Input);

    // Class 2 cell
    class2Input = document.createElement("input");
    class2Input.setAttribute("value", "0");
    class2Input.setAttribute("type", "text");
    class2Input.classList.add("form-control");
    class2Cell.appendChild(class2Input);

    // Ratio cell
    var ratioLabel = document.createElement("label");
    ratioLabel.classList.add("form-control-plaintext");
    ratioLabel.innerHTML = "0";
    ratioCell.appendChild(ratioLabel);

    // Entropy cell
    entropyLabel = document.createElement("label");
    entropyLabel.classList.add("form-control-plaintext");
    entropyLabel.innerHTML = "0";
    entropyCell.appendChild(entropyLabel);

    document.getElementById('ceCell').setAttribute("rowspan", catCount.toString());

    // remove "Category remove button" of previous input group so that there is only one
    if(tBodyRef.rows.length >= 4) {
        cell = tBodyRef.rows[tBodyRef.rows.length - 2].cells[0]
        button = cell.getElementsByTagName("div")[0];
        cell.removeChild(button);
    }
}