// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
const { calcRatio, calcEntropyCat, checkInput, calcCondEntropy } = require('./calculator')
const fs = require('fs');
const path = require('path');
/* eslint-enable */
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

jest
    .dontMock('fs');
    
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

test('checkInput: 4 inputs with values 1, 3, 5 and 8 should not produce an error (return 0)', () => {
    document.body.innerHTML = html;
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
    expect(checkInput(inputElements)).toBe(0);
})

test('checkInput: 4 inputs with values 1, 1, 1 and -1 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "1");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "1");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "1");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "-1");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 2 inputs with values "", 4, "" and 1 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "4");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "1");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 4 inputs with values -5, "", 7.2 and 4 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "-5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "7.2");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "4");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 4 inputs with values 5, g, -7.3 and 3.5 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "g");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "-7.3");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "3.5");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 4 inputs with values f, 4, 6 and 3 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "f");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "4");
    var input3 = document.createElement('input');
    input3.setAttribute("value", "6");
    var input4 = document.createElement('input');
    input4.setAttribute("value", "3");
    inputElements.push(input1);
    inputElements.push(input2);
    inputElements.push(input3);
    inputElements.push(input4);
    expect(checkInput(inputElements)).toBe(1);
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