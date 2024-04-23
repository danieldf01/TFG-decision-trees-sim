// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
const { E, graphFunction, calcSum, calcProbs, checkInput, entropy } = require('./calculator')
const fs = require('fs');
const path = require('path');
/* eslint-enable */
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

jest
    .dontMock('fs');
    
test('E: properly calculates the Binary Entropy of a p value 0.5', () => {
    expect(E(0.5)).toBe(1);
})

test('E: properly calculates the Entropy of a p value 0', () => {
    expect(E(0)).toBe(0);
})

test('E: properly calculates the Entropy of a p value 1', () => {
    expect(E(1)).toBe(0);
})

test('E: throws error when calculating values below 0', () => {
    expect(() => E(-0.01)).toThrow(Error);
    expect(() => E(-0.01)).toThrow("The Binary Entropy function was tried to be calculated with an invalid x value input");
})

test('E: throws error when calculating values above 1.00001', () => {
    expect(() => E(-0.01)).toThrow(Error);
    expect(() => E(-0.01)).toThrow("The Binary Entropy function was tried to be calculated with an invalid x value input");
})

test('graphFunction: creates 1001 data points', () => {
    expect(graphFunction().length).toBe(1001);
})

test('graphFunction: the first and last data points have an y-value of 0', () => {
    expect(graphFunction()[0][1]).toBe(0);
    expect(graphFunction()[1000][1]).toBe(0);
})

test('calcSum: 2 inputs with value 0 should return sum === 0', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "0");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "0");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(calcSum(inputElements)).toBe(0);
})

test('calcSum: 2 inputs with value 5 should return sum === 10', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "5");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(calcSum(inputElements)).toBe(10);
})

test('calcProbs: 2 inputs with value 0 should return probabilities [0, 0]', () => {
    document.body.innerHTML = html;
    var sum = 0 + 0;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "0");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "0");
    inputElements.push(input1);
    inputElements.push(input2);
    var pValues = calcProbs(inputElements, sum);
    expect(pValues[0]).toBe(0);
    expect(pValues[1]).toBe(0);
})

test('calcProbs: 2 inputs with value 4 and 6 should return probabilities [0.4, 0.6]', () => {
    document.body.innerHTML = html;
    var sum = 4 + 6;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "4");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "6");
    inputElements.push(input1);
    inputElements.push(input2);
    var pValues = calcProbs(inputElements, sum);
    expect(pValues[0]).toBe(0.4);
    expect(pValues[1]).toBe(0.6);
})

test('checkInput: 2 inputs with values 1 and 3 should not produce an error (return 0)', () => {
    document.body.innerHTML = html;
     var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "1");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "3");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(checkInput(inputElements)).toBe(0);
})

test('checkInput: 2 inputs with values 1 and -1 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "1");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "-1");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 2 inputs with values "" and 1 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "1");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 2 inputs with values -5 and "" should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "-5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(checkInput(inputElements)).toBe(1);
})

test('checkInput: 2 inputs with values 5 and 3.5 should produce error (return 1)', () => {
    document.body.innerHTML = html;
    var inputElements = []
    var input1 = document.createElement('input');
    input1.setAttribute("value", "5");
    var input2 = document.createElement('input');
    input2.setAttribute("value", "3.5");
    inputElements.push(input1);
    inputElements.push(input2);
    expect(checkInput(inputElements)).toBe(1);
})

test('entropy: properly calculate Entropy for probability values [1, 0]', () => {
    var pValues = [1, 0];
    expect(entropy(pValues)).toBe(0);
})

test('entropy: properly calculate Entropy for probability values [0.5, 0.5]', () => {
    var pValues = [0.5, 0.5];
    expect(entropy(pValues)).toBe(1);
})

test('entropy: properly calculate Entropy for probability values [0.5, 0.5, 0, 0]', () => {
    var pValues = [0.5, 0.5, 0, 0];
    expect(entropy(pValues)).toBe(0);
})