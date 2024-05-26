// Get example data
import { data, attributes, label, labelValues } from '../exampledata/example1.js';
import { nodeCount, leafCount, valueTableGroups } from './tree.js';

const firstHeaderRowCols = 7;
const indexHeaderLabelCol = 2;
const secondHeaderRowCols = 8;
const secondHeaderRowColLabels = ['Feature', 'Value', labelValues[0], labelValues[1], 'Ratio', 'E', 'CE', 'Info Gain'];

const bodyRowValCount = 4;
const indexBodyCondEntropy = 4;
const indexBodyInfoGain = 5;

function createBody(step, tableEl){
    var body = document.createElement('tbody');
    body.classList.add('table-group-divider');
    var tableContents = valueTableGroups[step];
    var maxInfoGain = 0;
    var maxInfoGainCell = null;
    console.log(tableContents);

    // Loop through each feature
    for (var i = 0; i < tableContents.length; i++){
        var feature = tableContents[i];
        var featureName = Object.keys(feature)[0];
        var featureValues = Object.values(feature)[0];
        console.log(featureValues);

        // Loop through each feature's values/rows
        for (var j = 0; j < featureValues.length; j++){
            var currentRowVals = featureValues[j];
            var bodyRow = document.createElement('tr');

            // First row of the feature carries the feature name
            if (j === 0){
                var bodyCell = document.createElement('td');
                bodyCell.rowSpan = featureValues.length;
                bodyCell.style.verticalAlign = 'middle';
                bodyCell.textContent = featureName;
                bodyRow.appendChild(bodyCell);
            }

            // Create column for each value
            for (var k = 0; k < bodyRowValCount; k++){
                var bodyCell = document.createElement('td');
                // Label values
                if (k === 1){
                    bodyCell.textContent = currentRowVals[k][0];
                    bodyRow.appendChild(bodyCell);
                    bodyCell = document.createElement('td');
                    bodyCell.textContent = currentRowVals[k][1];
                } else{
                    bodyCell.textContent = currentRowVals[k];
                }
                bodyRow.appendChild(bodyCell);
            }

            // First row of the feature carries the conditional entropy and info gain
            if (j === 0){
                for (var k = indexBodyCondEntropy; k <= indexBodyInfoGain; k++){
                    var bodyCell = document.createElement('td');
                    bodyCell.rowSpan = featureValues.length;
                    bodyCell.style.verticalAlign = 'middle';
                    bodyCell.textContent = currentRowVals[k];
                    bodyRow.appendChild(bodyCell);
                    
                    // Check if current info gain is the max info gain
                    if (k === indexBodyInfoGain && currentRowVals[k] > maxInfoGain) {
                        maxInfoGain = currentRowVals[k];
                        maxInfoGainCell = bodyCell;
                    }
                }
            }
            
            body.appendChild(bodyRow);
        }
    }

    // Mark the max info gain yellow
    maxInfoGainCell.classList.add('table-warning');

    tableEl.appendChild(body);
}

function createValueTable(){
    var tableDiv = document.getElementById('valueTable');

    // Table element
    var tableEl = document.createElement('table');
    tableEl.classList.add('table');
    tableEl.setAttribute("id", "valueTableEl");

    // Header
    var header = document.createElement('thead');
    header.classList.add('sticky-top');
    var headerRow1 = document.createElement('tr');
    for (var i = 0; i < firstHeaderRowCols; i++) {
        var headerCell = document.createElement('th');
        if(i === indexHeaderLabelCol) {
            headerCell.colSpan = '2';
            headerCell.textContent = label;
            headerRow1.appendChild(headerCell);
        } else{
            headerCell.style.borderBottom = 'none';
            headerRow1.appendChild(headerCell);
        }
    }
    header.appendChild(headerRow1);

    var headerRow2 = document.createElement('tr');
    for (var i = 0; i < secondHeaderRowCols; i++) {
        var headerCell = document.createElement('th');
        headerCell.textContent = secondHeaderRowColLabels[i];
        headerRow2.appendChild(headerCell);
    }
    header.appendChild(headerRow2);

    tableEl.appendChild(header);

    // Body
    createBody(0, tableEl);

    tableDiv.appendChild(tableEl);
}

document.addEventListener('DOMContentLoaded', createValueTable);