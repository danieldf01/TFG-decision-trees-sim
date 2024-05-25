// Get example data
import { data, attributes, label } from '../exampledata/example1.js';
import { nodeCount, leafCount, valueTableGroups } from './tree.js';

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
    
    var headerCell = document.createElement('th');
    headerCell.style.borderRight = '1px solid black';
    headerCell.textContent = '#';
    headerRow.appendChild(headerCell);
    for (const attribute of attributes){
        headerCell = document.createElement('th');
        headerCell.textContent = attribute;
        headerRow.appendChild(headerCell);
    }
    headerCell = createLabelCell();
    headerCell.textContent = label;
    headerRow.appendChild(headerCell);
    header.appendChild(headerRow);

    tableEl.appendChild(header);
}