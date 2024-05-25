import { nodeCount, leafCount, dataTableGroups } from './tree.js';

var currentStep = 1;

var changedCells = [];

function grayOutRows(){
    var rowsToMark = dataTableGroups[currentStep - 2][0];
    var colsToMark = dataTableGroups[currentStep - 2][1];

    var table = document.getElementById('dataTableEl');
    var tHead = table.getElementsByTagName('thead')[0];
    var tHeadCols = tHead.getElementsByTagName('tr')[0].getElementsByTagName('th');

    var tBody = table.getElementsByTagName('tbody')[0];
    var tRows = tBody.getElementsByTagName('tr');
    for (var i = 0; i < tRows.length; i++) {
        if(rowsToMark.includes(i)){
            var rowCols = tRows[i].getElementsByTagName('td');
            console.log(rowCols);
            for (var j  = 0; j < rowCols.length; j++){
                if(colsToMark.includes(j)){
                    console.log(rowCols[j]);
                    rowCols[j+1].classList.add('table-warning');
                    changedCells.push(rowCols[j+1]);
                }
            }
        } else{
            tRows[i].classList.add('table-secondary');
            changedCells.push(tRows[i]);
        }
    }

    for (var i = 0; i < tHeadCols.length; i++){
        if (colsToMark.includes(i)){
            tHeadCols[i+1].classList.add('table-warning');
            changedCells.push(tHeadCols[i+1]);
        }
    }
}

function initialStep() {
    currentStep = 1;
    document.getElementById('stepCount').textContent = "Step: 1";
    for (var i = 2; i <= nodeCount + leafCount; i++) {
        var groupId = 'g' + i;
        var groupToHide = document.getElementById(groupId);
        groupToHide.style.display = "none";
    }
}

function stepForward() {
    if (currentStep === nodeCount + leafCount) return;

    for (var i = 0; i < changedCells.length; i++){
        if(changedCells[i].tagName == 'TD' || changedCells[i].tagName == 'TH'){
            changedCells[i].classList.remove('table-warning');
        } else if (changedCells[i].tagName == 'TR'){
            changedCells[i].classList.remove('table-secondary');
        }
    }

    currentStep++;
    document.getElementById('stepCount').textContent = "Step: " + currentStep;
    var groupId = 'g' + currentStep;
    var groupToShow = document.getElementById(groupId);
    groupToShow.style.display = "block";

    grayOutRows();
}

function stepBack() {
    if (currentStep === 1) return;
    currentStep--;
    document.getElementById('stepCount').textContent = "Step: " + currentStep;
    var groupId = 'g' + (currentStep + 1);
    var groupToHide = document.getElementById(groupId);
    groupToHide.style.display = "none";
}

function lastStep() {
    currentStep = nodeCount + leafCount;
    document.getElementById('stepCount').textContent = "Step: " + (nodeCount + leafCount);
    for (var i = 2; i <= nodeCount + leafCount; i++) {
        var groupId = 'g' + i;
        var groupToShow = document.getElementById(groupId);
        groupToShow.style.display = "block";
    }
}

function goToStep() {
    for (var i = 2; i <= currentStep; i++) {
        var groupId = 'g' + i;
        var groupToShow = document.getElementById(groupId);
        groupToShow.style.display = "block";
    }
}

export { initialStep, stepForward, stepBack, lastStep, goToStep };