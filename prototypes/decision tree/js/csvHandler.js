import { buildTree, destroyTree } from './tree.js';
import { createTable } from './table.js';
import { createValueTable, loadData } from './valueTable.js';
import { initialStep } from './stepbystep.js';
import { getDataInfo, getDataLink } from "../exampledata/dataInfo.js";

const svgId = 'svgDT';

// Example dataset names
const dataset1 = "Play Golf 1";
const dataset2 = "Iris";

function transformData(data) {
    const headers = data[0];
    const attributes = headers.slice(0, -1);
    const label = headers[headers.length - 1];

    console.log(attributes);
    const attributeValues = attributes.map((key, index) => {
        const values = new Set();
        for (let i = 1; i < data.length; i++) {
            values.add(data[i][index]);
        }
        return Array.from(values);
    });

    const labelValues = new Set();
    const dataRows = data.slice(1).map(row => {
        const attributeObj = {};
        attributes.forEach((key, index) => {
            attributeObj[key] = row[index];
        });
        const label = row[row.length - 1];
        labelValues.add(label);
        return { attributes: attributeObj, label: label };
    });

    const labelValuesArray = Array.from(labelValues);

    let dataCsv = {};
    dataCsv['csvAttributes'] = attributes;
    dataCsv['csvAttributeValues'] = attributeValues;
    dataCsv['csvLabel'] = label;
    dataCsv['csvLabelValues'] = labelValuesArray;
    dataCsv['csvDataRows'] = dataRows;

    console.log(dataCsv);

    // Save to local storage
    localStorage.setItem('csvData', JSON.stringify(dataCsv));

    // Reset everything and build the tree and tables based on the new data 
    var svgEl = document.getElementById(svgId);
    destroyTree(svgEl);
    buildTree();

    createTable();
    loadData();
    createValueTable(1);
    initialStep();
}

function loadExampleData(selectedExample) {
    var contContainer = document.getElementById("contentContainer");
    if (contContainer.style.display == "none") {
        contContainer.style.display = "block";
    }

    var filePath = null;
    switch (selectedExample) {
        case dataset1:
            filePath = "exampledata/playgolf_1.csv";
            break;
        case dataset2:
            filePath = "exampledata/iris.csv";
            break;
    }
    if (filePath != null) {
        $.ajax({
            type: "GET",
            url: filePath,
            dataType: "text",
            success: function (data) {
                var parsedData = Papa.parse(data, { skipEmptyLines: true });
                transformData(parsedData.data);
            }
        });

        var currentDatasetSpan = document.getElementById('currentDatasetSpan');
        currentDatasetSpan.textContent = selectedExample;

        var datasetCardBody = document.getElementById('datasetCardBody');
        if (datasetCardBody.style.display == "none") {
            datasetCardBody.style.display = "block";
        }

        var datasetCardText = document.getElementById('datasetCardText');
        datasetCardText.textContent = getDataInfo(selectedExample);

        var datasetCardLink = document.getElementById('datasetCardLink');
        datasetCardLink.href = getDataLink(selectedExample);
    }
}

export { loadExampleData, transformData }
export default loadExampleData;