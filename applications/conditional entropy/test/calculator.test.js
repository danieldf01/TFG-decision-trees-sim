// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
import { calcRatio, calcEntropyCat, calcCondEntropy } from '../js/calculator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
/* eslint-enable */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// jest
//     .dontMock('fs');
    
test('calcRatio: properly calculates the ratio and between categories with instances [1, 5, 1, 8]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "1");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "5");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "1");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "8");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);

    var result = calcRatio(tBodyRef, inputElements)
    var rowSums = result[0];
    var ratioVals = result[1];
    expect(rowSums[0]).toBe(6);
    expect(rowSums[1]).toBe(9);
    expect(ratioVals[0]).toBe(0.4);
    expect(ratioVals[1]).toBe(0.6);
})

test('calcRatio: properly calculates the ratio and between categories with instances [0, 0, 1, 8]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "0");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "0");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "1");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "8");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);

    var result = calcRatio(tBodyRef, inputElements)
    var rowSums = result[0];
    var ratioVals = result[1];
    expect(rowSums[0]).toBe(0);
    expect(rowSums[1]).toBe(9);
    expect(ratioVals[0]).toBe(0);
    expect(ratioVals[1]).toBe(1);
})

test('calcRatio: properly calculates the ratio and between categories with instances [0, 0, 0, 0]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "0");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "0");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "0");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "0");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);

    var result = calcRatio(tBodyRef, inputElements)
    var rowSums = result[0];
    var ratioVals = result[1];
    expect(rowSums[0]).toBe(0);
    expect(rowSums[1]).toBe(0);
    expect(ratioVals[0]).toBe(0);
    expect(ratioVals[1]).toBe(0);
})

test('calcEntropyCat: properly calculates the entropies for each category with instances [1, 5, 1, 8]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "1");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "5");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "1");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "8");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    
    var rowSums = calcRatio(tBodyRef, inputElements)[0];

    var entropies = calcEntropyCat(rowSums, tBodyRef, inputElements);
    
    expect(entropies[0]).toBe(0.6500224216483541);
    expect(entropies[1]).toBe(0.5032583347756457);
})

test('calcEntropyCat: properly calculates the entropies for each category with instances [5, 5, 0, 0]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "5");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "0");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "0");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    
    var rowSums = calcRatio(tBodyRef, inputElements)[0];

    var entropies = calcEntropyCat(rowSums, tBodyRef, inputElements);
    
    expect(entropies[0]).toBe(1);
    expect(entropies[1]).toBe(0);
})

test('calcEntropyCat: properly calculates the entropies for each category with instances [0, 0, 0, 0]', () => {
    document.body.innerHTML = html;
    
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "0");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "0");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "0");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "0");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    
    var rowSums = calcRatio(tBodyRef, inputElements)[0];

    var entropies = calcEntropyCat(rowSums, tBodyRef, inputElements);
    
    expect(entropies[0]).toBe(0);
    expect(entropies[1]).toBe(0);
})

test('calcCondEntropy: properly calculates the conditional entropy with instances [1, 5, 1, 8]', () => {
    document.body.innerHTML = html;
    var table = document.getElementById('table-cond-entropy');
    var instanceVals = table.getElementsByTagName('input');
    instanceVals[0].value = "1";
    instanceVals[1].value = "5";
    instanceVals[2].value = "1";
    instanceVals[3].value = "8";

    calcCondEntropy();

    var condEntropy = document.getElementById('ce').textContent;

    expect(condEntropy).toBe("0.5619639695247292");
})

test('calcCondEntropy: properly calculates the conditional entropy with instances [0, 0, 5, 5]', () => {
    document.body.innerHTML = html;
    var table = document.getElementById('table-cond-entropy');
    var instanceVals = table.getElementsByTagName('input');
    instanceVals[0].value = "0";
    instanceVals[1].value = "0";
    instanceVals[2].value = "5";
    instanceVals[3].value = "5";

    calcCondEntropy();

    var condEntropy = document.getElementById('ce').textContent;

    expect(condEntropy).toBe("1");
})

test('calcCondEntropy: properly calculates the conditional entropy with instances [0, 0, 0, 0]', () => {
    document.body.innerHTML = html;
    var table = document.getElementById('table-cond-entropy');
    var instanceVals = table.getElementsByTagName('input');
    instanceVals[0].value = "0";
    instanceVals[1].value = "0";
    instanceVals[2].value = "0";
    instanceVals[3].value = "0";

    calcCondEntropy();

    var condEntropy = document.getElementById('ce').textContent;

    expect(condEntropy).toBe("0");
})

test('calcCondEntropy: properly calculates the conditional entropy with instances [4, 6, 3, 3]', () => {
    document.body.innerHTML = html;
    var table = document.getElementById('table-cond-entropy');
    var instanceVals = table.getElementsByTagName('input');
    instanceVals[0].value = "4";
    instanceVals[1].value = "6";
    instanceVals[2].value = "3";
    instanceVals[3].value = "3";

    calcCondEntropy();

    var condEntropy = document.getElementById('ce').textContent;

    expect(condEntropy).toBe("0.9818441215341679");
})