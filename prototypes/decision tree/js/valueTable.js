import { valueTableGroups } from './tree.js';

var label;
var labelValues;

// To retrieve locally stored csv data
const csvL = 'csvLabel';
const csvLV = 'csvLabelValues';

const firstHeaderRowCols = 7;
const indexHeaderLabelCol = 2;
const secondHeaderRowCols = 8;
var secondHeaderRowColLabels;

const bodyRowValCount = 4;
const indexBodyCondEntropy = 4;
const indexBodyInfoGain = 5;

const valueLabelsLength = 2;

function createHeaderForNode(tableEl) {
    var header = document.createElement('thead');
    var headerRow1 = document.createElement('tr');
    for (var i = 0; i < firstHeaderRowCols; i++) {
        var headerCell = document.createElement('th');
        if (i === indexHeaderLabelCol) {
            headerCell.colSpan = '2';
            headerCell.textContent = label;
            headerRow1.appendChild(headerCell);
        } else {
            headerCell.style.borderBottom = 'none';
            headerRow1.appendChild(headerCell);
        }
    }
    header.appendChild(headerRow1);

    var headerRow2 = document.createElement('tr');
    headerRow2.classList.add('sticky-top');
    for (var i = 0; i < secondHeaderRowCols; i++) {
        var headerCell = document.createElement('th');
        headerCell.textContent = secondHeaderRowColLabels[i];
        headerRow2.appendChild(headerCell);
    }
    header.appendChild(headerRow2);

    tableEl.appendChild(header);
}

function createBodyForNode(tableEl, step) {
    var body = document.createElement('tbody');
    body.classList.add('table-group-divider');
    var tableContents = valueTableGroups[step - 1];
    var maxInfoGain = -Infinity;
    var maxInfoGainCell = null;

    // Loop through each feature
    for (var i = 0; i < tableContents.length; i++) {
        var feature = tableContents[i];
        var featureName = Object.keys(feature)[0];
        var featureValues = Object.values(feature)[0];

        // Loop through each feature's values/rows
        for (var j = 0; j < featureValues.length; j++) {
            var currentRowVals = featureValues[j];
            var bodyRow = document.createElement('tr');

            // First row of the feature carries the feature name
            if (j === 0) {
                var bodyCell = document.createElement('td');
                bodyCell.rowSpan = featureValues.length;
                bodyCell.style.verticalAlign = 'middle';
                bodyCell.textContent = featureName;
                bodyRow.appendChild(bodyCell);
            }

            // Create column for each value
            for (var k = 0; k < bodyRowValCount; k++) {
                var bodyCell = document.createElement('td');
                // Label values
                if (k === 1) {
                    bodyCell.textContent = currentRowVals[k][0];
                    bodyRow.appendChild(bodyCell);
                    bodyCell = document.createElement('td');
                    bodyCell.textContent = currentRowVals[k][1];
                } else {
                    bodyCell.textContent = currentRowVals[k];
                }
                bodyRow.appendChild(bodyCell);
            }

            // First row of the feature carries the conditional entropy and info gain
            if (j === 0) {
                for (var k = indexBodyCondEntropy; k <= indexBodyInfoGain; k++) {
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

function createValueTableForNode(tableEl, step) {
    // Header
    createHeaderForNode(tableEl);

    // Body
    createBodyForNode(tableEl, step);
}

function createValueTableForLeaf(tableEl, step) {
    // Header
    var header = document.createElement('thead');
    var headerRow1 = document.createElement('tr');
    var headerCell = document.createElement('th');
    headerCell.colSpan = '2';
    headerCell.textContent = label;
    headerRow1.appendChild(headerCell);
    header.appendChild(headerRow1);

    var headerRow2 = document.createElement('tr');
    headerCell = document.createElement('th');
    headerCell.textContent = labelValues[0];
    headerRow2.appendChild(headerCell);
    headerCell = document.createElement('th');
    headerCell.textContent = labelValues[1];
    headerRow2.appendChild(headerCell);
    header.appendChild(headerRow2);

    tableEl.appendChild(header);

    // Body
    var body = document.createElement('tbody');
    body.classList.add('table-group-divider');

    var bodyRow = document.createElement('tr');
    var bodyCell = document.createElement('td');
    bodyCell.textContent = valueTableGroups[step - 1][0];
    bodyRow.appendChild(bodyCell);
    bodyCell = document.createElement('td');
    bodyCell.textContent = valueTableGroups[step - 1][1];
    bodyRow.appendChild(bodyCell);
    body.appendChild(bodyRow);

    tableEl.appendChild(body);

    // Foot
    var foot = document.createElement('tfoot');
    foot.classList.add('table-group-divider');
    var footRow = document.createElement('tr');
    var footCell = document.createElement('td');
    footCell.colSpan = '2';
    footCell.textContent = 'All labels have the same value';
    footRow.appendChild(footCell);
    foot.appendChild(footRow);

    tableEl.appendChild(foot);
}

function loadData(){
    let dataCsv = JSON.parse(localStorage.getItem('csvData'));
    label = dataCsv[csvL];
    labelValues = dataCsv[csvLV];
}

function createValueTable(step) {
    secondHeaderRowColLabels = ['Feature', 'Value', labelValues[0], labelValues[1], 'Ratio', 'E', 'CE', 'Info Gain']

    var tableDiv = document.getElementById('valueTable');

    // Remove table of a previous step
    if (tableDiv.getElementsByTagName('table')[0] != null) {
        tableDiv.removeChild(tableDiv.getElementsByTagName('table')[0]);
    }

    // Table element
    var tableEl = document.createElement('table');
    tableEl.classList.add('table');
    tableEl.setAttribute("id", "valueTableEl");

    if (valueTableGroups[step - 1].length === valueLabelsLength && Number.isInteger(valueTableGroups[step - 1][0])) {
        createValueTableForLeaf(tableEl, step);
    } else {
        createValueTableForNode(tableEl, step);
    }

    tableDiv.appendChild(tableEl);
}

export { createValueTable, loadData };