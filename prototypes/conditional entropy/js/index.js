function calcRatio(tBodyRef, instanceVals){

    var sum = 0;
    rowSums = [];
    for (var i = 0; i < instanceVals.length; i++) {
        sum += parseInt(instanceVals[i].value);
        if(i % 2){
            rowSums.push(parseInt(instanceVals[i-1].value) + parseInt(instanceVals[i].value));
        }
    }

    ratioVals = [];
    rowCount = tBodyRef.rows.length;
    for (var i = 0; i < rowCount; i++) {
        ratio = rowSums[i] / sum;
        ratioVals.push(ratio);
        ratioCell = tBodyRef.getElementsByTagName('tr')[i].getElementsByTagName('td')[3];
        ratioLabel = ratioCell.getElementsByTagName('label')[0];
        ratioLabel.innerHTML = ratio;
    }
    return [rowSums, ratioVals];
}

function calcEntropyCat(rowSums, tBodyRef, instanceVals){
    // Get the Class values for each category
    rowValues = [];
    for (var i = 0; i < instanceVals.length; i++) {
        if(i % 2){
            rowValue = [parseInt(instanceVals[i-1].value), parseInt(instanceVals[i].value)];
            rowValues.push(rowValue);
        }
    }

    // Calculate the Entropy for each category
    var entropies = [];
    for (var i = 0; i < rowSums.length; i++) {
        entropy = 0;
        // Entropy is 0 if there are no instances belonging to one of the classes
        if (rowValues[i][0] != 0 && rowValues[i][1] != 0){
            for (var j = 0; j < 2; j++) {
                entropy -= (rowValues[i][j] / rowSums[i]) * Math.log2(rowValues[i][j] / rowSums[i]);
            }
        }

        entropyCell = tBodyRef.getElementsByTagName('tr')[i].getElementsByTagName('td')[4];
        entropyLabel = entropyCell.getElementsByTagName('label')[0];
        entropyLabel.innerHTML = entropy;
        entropies.push(entropy);
    }
    return entropies;

}

function calcCondEntropy(){
    // Calculate ratios and Entropies for each category first
    var table = document.getElementById('table-cond-entropy-1');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    var instanceVals = table.getElementsByTagName('input');
    var rowSumsRatios = calcRatio(tBodyRef, instanceVals);
    var rowSums = rowSumsRatios[0];
    var ratioVals = rowSumsRatios[1];
    var entropies = calcEntropyCat(rowSums, tBodyRef, instanceVals);

    condEntropy = 0;
    for (var i = 0; i < entropies.length; i++) {
        condEntropy += ratioVals[i] * entropies[i];
    }
    document.getElementById('ce').innerHTML = condEntropy;
}