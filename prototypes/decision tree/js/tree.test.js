// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
import { mostCommonLabel, entropy, infoGain, findBestAttribute, id3, calcTreeDepth, calcTreeWidth, createNode, createLeaf, createBranch } from './tree';
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

test('mostCommonLabel: gets the right most common label in example dataset', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];

    expect(mostCommonLabel(data)).toBe('yes');
})

test('entropy: gets entropy = 0', () => {
    var labels = ['yes', 'yes', 'yes'];

    expect(entropy(labels)).toBe(0);
})

test('entropy: gets entropy = 1', () => {
    var labels = ['yes', 'no'];

    expect(entropy(labels)).toBe(1);
})

test('entropy: gets entropy = 0.94 for example data', () => {
    var labels = ['no', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'yes', 'no'];

    expect(parseFloat(entropy(labels).toFixed(2))).toBe(0.94);
})

test('infoGain: gets information gain = 0.25 for attribute outlook of example data', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];

    expect(parseFloat(infoGain(data, "outlook").toFixed(2))).toBe(0.25);
})

test('findBestAttribute: find "outlook" as best attribute of example data', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];
    var attributes = Object.keys(data[0].attributes);

    expect(findBestAttribute(data, attributes)).toBe("outlook");
})

test('id3: builds tree with right amount of decision nodes', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];
    var attributes = Object.keys(data[0].attributes);

    expect(+(id3(data, attributes, null, "n1", "l1")[1][1]) - 1).toBe(3);
})

test('id3: builds tree with right amount of leaf nodes', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];
    var attributes = Object.keys(data[0].attributes);

    expect(+(id3(data, attributes, null, "n1", "l1")[2][1]) - 1).toBe(5);
})

test('calcTreeDepth: calculates the right tree depth based on example data', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];
    var attributes = Object.keys(data[0].attributes);

    var decisionTree = id3(data, attributes, null, "n1", "l1")[0];

    expect(calcTreeDepth(decisionTree)).toBe(3);
})

test('calcTreeWidth: calculates the right tree width based on example data', () => {
    var data = [
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'hot', humidity: 'high', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'cool', humidity: 'normal', windy: true }, label: 'no' },
        { attributes: { outlook: 'overcast', temperature: 'cool', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'high', windy: false }, label: 'no' },
        { attributes: { outlook: 'sunny', temperature: 'cool', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'sunny', temperature: 'mild', humidity: 'normal', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'mild', humidity: 'high', windy: true }, label: 'yes' },
        { attributes: { outlook: 'overcast', temperature: 'hot', humidity: 'normal', windy: false }, label: 'yes' },
        { attributes: { outlook: 'rainy', temperature: 'mild', humidity: 'high', windy: true }, label: 'no' }
    ];
    var attributes = Object.keys(data[0].attributes);

    var decisionTree = id3(data, attributes, null, "n1", "l1")[0];

    expect(calcTreeWidth(decisionTree)).toBe(4);
})

test('createNode: creates a use element like specified', () => {
    document.body.innerHTML = html;
    
    var useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");

    useElement.setAttribute("id", "useNode1");
    useElement.setAttribute("href", "#node1");
    useElement.setAttribute("x", "50");
    useElement.setAttribute("y", "50");
    useElement.setAttribute("width", "50");
    useElement.setAttribute("height", "50");

    expect(String(createNode("n1", 5, 1, "outlook", 50, 50, 50, 50))).toBe(String(useElement));
})

test('createLeaf: creates a use element like specified', () => {
    document.body.innerHTML = html;
    
    var useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");

    useElement.setAttribute("id", "useLeaf1");
    useElement.setAttribute("href", "#leaf1");
    useElement.setAttribute("x", "50");
    useElement.setAttribute("y", "50");
    useElement.setAttribute("width", "50");
    useElement.setAttribute("height", "50");
    

    expect(String(createLeaf("l1", 5, 5, 0, 0, "yes", 50, 50, 50, 50))).toBe(String(useElement));
})

test('createBranch: creates a use element like specified', () => {
    document.body.innerHTML = html;
    
    var useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");

    // Set attributes
    useElement.setAttribute("id", "useBranchn2");
    useElement.setAttribute("href", "#branchn2");
    

    expect(String(createBranch("n2", 50, 50, 50, 100, "sunny"))).toBe(String(useElement));
})