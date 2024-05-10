// const BOOTSTRAP_XS = 0;
// const BOOTSTRAP_SM = 576;
// const BOOTSTRAP_MD = 768;
// const BOOTSTRAP_LG = 992;
// const BOOTSTRAP_XL = 1200;
// const BOOTSTRAP_XXL = 1400;

const STD_LEAFHEIGHT = 133;
const STD_NODEHEIGHT = 92;
const STD_LEAFWIDTH = 82;
const STD_NODEWIDTH = 82;

var svgWidth = 0;
var svgHeight = 0;

// Example data
const data = [
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

const attributes = ['outlook', 'temperature', 'humidity', 'windy'];

class NodeValues {
    constructor(class1, class2, n, entropy) {
        this.class1 = class1;
        this.class2 = class2;
        this.n = n;
        this.entropy = entropy;
    }
}

class TreeNode {
    constructor(id, attribute, nodeValues, isLeaf = false, label, prevBranchVal) {
        this.id = id;
        this.attribute = attribute;

        this.nodeValues = nodeValues;
        this.isLeaf = isLeaf;
        this.label = label;

        this.prevBranchVal = prevBranchVal;
        this.children = [];
    }
}



function mostCommonLabel(data) {
    var labels = [];
    data.forEach(function (row) {
        labels.push(row.label);
    });

    var counts = {};
    for (const label of labels) {
        counts[label] = counts[label] ? counts[label] + 1 : 1;
    }

    var max = 0;
    var maxLabel = null;
    for (const label in counts) {
        if (counts[label] > max) {
            max = counts[label];
            maxLabel = label;
        }
    }

    return maxLabel;
}

function entropy(labels) {
    // Count the occurrence of each label value
    var counts = {};
    for (const label of labels) {
        counts[label] = counts[label] ? counts[label] + 1 : 1;
    }

    // Calculate probabilities
    var sum = labels.length;
    var pValues = [];
    for (const labelCount of Object.values(counts)) {
        pValues.push(labelCount / sum);
    }

    // Calculate the entropy
    var entropy = 0;
    for (const pValue of pValues) {
        entropy -= pValue * Math.log2(pValue);
    }
    if (isNaN(entropy)) {
        entropy = 0;
    }
    return entropy;
}

function infoGain(data, attribute) {
    // Save the labels for each of the attribute's instances in an array
    var attributeLabels = [];
    data.forEach(function (row) {
        attributeLabels.push([row.attributes[attribute], row.label]);
    });

    // Save only the labels to calculate this attribute's entropy
    var labels = [];
    attributeLabels.forEach(function (row) {
        labels.push(row[1]);
    });

    // Caclulate entropy for the whole attribute
    var e = entropy(labels);

    // Save the attribute values in a set
    var attributeValues = new Set(data.map(instance => instance.attributes[attribute]));

    // Count the number of instances for each value
    var attributeValuesCounts = (data.map(instance => instance.attributes[attribute]));
    var counts = {};
    attributeValuesCounts.forEach(function (row) {
        counts[row] = counts[row] ? counts[row] + 1 : 1;
    });

    // Calculate the entropy for each value
    var entropies = [];
    for (const value of attributeValues) {
        var subset = attributeLabels.filter(instance => instance[0] === value);
        entropies.push([entropy(subset), counts[value], value]);
    }

    // Calculate the information gain
    var infoGain = e;
    for (const entropy of entropies) {
        infoGain -= entropy[0] * (entropy[1] / data.length);
    }
    return infoGain;
}


function findBestAttribute(data, attributes) {
    var bestAttribute = null;
    var maxGain = 0;
    attributes.forEach(function (attribute) {
        var gain = infoGain(data, attribute);
        if (gain > maxGain) {
            maxGain = gain;
            bestAttribute = attribute;
        }
    });
    return bestAttribute;
}

function id3(data, attributes, prevBranchVal, nodeId, leafId) {
    if (data.length === 0) return null;
    var allPositive = true;
    var allNegative = true;
    var class1 = 0;
    var class2 = 0;
    var n = data.length;

    // Save the labels in an array
    var datasetLabels = [];
    data.forEach(function (row) {
        datasetLabels.push(row.label);
    });

    // Caclulate entropy for the dataset
    var e = entropy(datasetLabels).toFixed(2);

    for (const row of data) {
        if (row.label == 'no') {
            class2++;
            allPositive = false;
        }
        if (row.label == 'yes') {
            class1++;
            allNegative = false;
        }
    }

    // Check if we have reached a leaf node
    if (allPositive) {
        var nextLeafId = leafId[0] + (+leafId[1] + 1);
        return [new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, 'yes', prevBranchVal), nodeId, nextLeafId];
    }
    if (allNegative) {
        var nextLeafId = leafId[0] + (+leafId[1] + 1);
        return [new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, 'no', prevBranchVal), nodeId, nextLeafId];
    }
    if (attributes.length === 0) {
        var nextLeafId = leafId[0] + (+leafId[1] + 1);
        return [new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, mostCommonLabel(data), prevBranchVal), nodeId, nextLeafId];
    }

    // Find the current best attribute to split the data on
    var bestAttribute = findBestAttribute(data, attributes);
    var tree = new TreeNode(nodeId, bestAttribute, new NodeValues(class1, class2, n, e), false, null, null);

    // Split the data on the best attribute
    var attributeValues = new Set(data.map(instance => instance.attributes[bestAttribute]));

    nodeId = nodeId[0] + (+nodeId[1] + 1);

    // Do a recursive call for each value of the selected attribute or add a leaf node if the value's subset is empty
    for (const value of attributeValues) {
        var subset = data.filter(instance => instance.attributes[bestAttribute] === value);
        var remainingAttributes = attributes.filter(attribute => attribute !== bestAttribute);

        if (subset.length === 0) {
            tree.children.push(new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, mostCommonLabel(subset), prevBranchVal));
        } else {
            tree.prevBranchVal = prevBranchVal;
            var returnVals = id3(subset, remainingAttributes, value, nodeId, leafId);
            tree.children.push(returnVals[0]);
            nodeId = returnVals[1];
            leafId = returnVals[2];
        }
    }
    return [tree, nodeId, leafId];
}


function hideChildren(element) {
    var node = element.querySelector('ellipse');
    var nodeId = node.id;

    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length !== 0 && connectedPaths[0].parentNode.style.display == "none") {
        showConnectedNodes(nodeId);
    } else {
        hideConnectedNodes(nodeId);
    }
}

function hideConnectedNodes(nodeId) {
    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length === 0) return;

    for (const path of connectedPaths) {
        var pathGroup = path.parentNode;
        pathGroup.style.display = "none";

        var pathIdNum = +path.id[1];
        var connectedNodeId = "n" + pathIdNum;

        hideConnectedNodes(connectedNodeId);
    }
}

function showConnectedNodes(nodeId) {
    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length === 0) return;

    for (const path of connectedPaths) {
        var pathGroup = path.parentNode;
        pathGroup.style.display = "block";

        var pathIdNum = +path.id[1];
        var connectedNodeId = "n" + pathIdNum;

        showConnectedNodes(connectedNodeId);
    }
}

function createNode(nodeId, n, e, attribute, x, y, width, height) {
    var svgEl = document.getElementById('svgDT');
    var nodeTemplate = document.getElementById('node');
    var nodeNumber = nodeId.substring(1);

    // Clone the template
    var clonedTemplate = nodeTemplate.cloneNode(true);
    clonedTemplate.setAttribute('id', 'node' + nodeNumber);

    // Update text contents
    clonedTemplate.querySelector('#nodeNr').textContent += nodeNumber;
    clonedTemplate.querySelector('#nodeN').textContent += n;
    clonedTemplate.querySelector('#nodeE').textContent += e;
    clonedTemplate.querySelector('#nodeAttribute').textContent = attribute;

    // Create a new 'use' element and set the node's position attributes
    var newUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    newUse.setAttribute('id', 'useNode' + nodeNumber);
    newUse.setAttribute('href', '#node' + nodeNumber);
    newUse.setAttribute('x', x);
    newUse.setAttribute('y', y);
    newUse.setAttribute('width', width);
    newUse.setAttribute('height', height);

    // Append cloned template and use element to the svg
    svgEl.appendChild(clonedTemplate);
    svgEl.appendChild(newUse);
}


function createLeaf(leafId, n, yes, no, e, label, x, y, width, height) {
    var svgEl = document.getElementById('svgDT');
    var leafTemplate = document.getElementById('leaf');
    var leafNumber = leafId.substring(1);

    // Clone the template
    var clonedTemplate = leafTemplate.cloneNode(true);
    clonedTemplate.setAttribute('id', 'leaf' + leafNumber);

    // Update text contents
    clonedTemplate.querySelector('#leafNr').textContent += leafNumber;
    clonedTemplate.querySelector('#leafN').textContent += n;
    clonedTemplate.querySelector('#leafYes').textContent += yes;
    clonedTemplate.querySelector('#leafNo').textContent += no;
    clonedTemplate.querySelector('#leafE').textContent += e;
    clonedTemplate.querySelector('#leafLabel').textContent += label;

    // Create a new 'use' element and set the leaf's position attributes
    var newUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    newUse.setAttribute('id', 'useLeaf' + leafNumber);
    newUse.setAttribute('href', '#leaf' + leafNumber);
    newUse.setAttribute('x', x);
    newUse.setAttribute('y', y);
    newUse.setAttribute('width', width);
    newUse.setAttribute('height', height);

    // Append cloned template and use element to the svg
    svgEl.appendChild(clonedTemplate);
    svgEl.appendChild(newUse);
}


function createBranch(nodeId, x1, y1, x2, y2, value) {
    var svgEl = document.getElementById('svgDT');
    var branchTemplate = document.getElementById('branch');

    // Clone the template
    var clonedTemplate = branchTemplate.cloneNode(true);
    clonedTemplate.setAttribute('id', 'branch' + nodeId);

    // Update position attributes and ids
    if (x2 < x1) {
        var positionAttribute = 'M' + x2 + ' ' + y2 + ' ' + x1 + ' ' + y1;
        clonedTemplate.querySelector('#branchPath').setAttribute('marker-end', '');
        clonedTemplate.querySelector('#branchPath').setAttribute('marker-start', 'url(#arrowMarkerReverse)');
    } else {
        var positionAttribute = 'M' + x1 + ' ' + y1 + ' ' + x2 + ' ' + y2;
        clonedTemplate.querySelector('#branchPath').setAttribute('marker-end', 'url(#arrowMarker)');
    }
    clonedTemplate.querySelector('#branchPath').setAttribute('d', positionAttribute);
    clonedTemplate.querySelector('#branchValue').textContent = value;
    if (x1 === x2){
        clonedTemplate.querySelector('#branchTP').setAttribute('startOffset', (y2 - y1) * 0.1);
    } else{
        clonedTemplate.querySelector('#branchTP').setAttribute('startOffset', (y2 - y1) * 0.2);
    }
    clonedTemplate.querySelector('#branchPath').setAttribute('id', 'branchPath' + nodeId);
    clonedTemplate.querySelector('#branchTP').setAttribute('href', '#branchPath' + nodeId);
    clonedTemplate.querySelector('#branchTP').setAttribute('id', 'branchTP' + nodeId);

    // Create a new 'use' element
    var newUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    newUse.setAttribute('id', 'useBranch' + nodeId);
    newUse.setAttribute('href', '#branch' + nodeId);

    // Append cloned template and use element to the svg
    svgEl.appendChild(clonedTemplate);
    svgEl.appendChild(newUse);
}

function calcSvgSize(decisionTree) {
    var svgEl = document.getElementById('svgDT');
    const rect = svgEl.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    console.log('Width:', width);
    console.log('Height:', height);

    return [width, height];
}

function resizeViewBox(svgWidth, svgHeight) {
    var svgEl = document.getElementById('svgDT');
    svgEl.setAttribute('viewBox', '0 0 ' + svgWidth + ' ' + svgHeight);
}

// Calculate the tree's depth (including the root node)
function calcTreeDepth(rootNode) {
    if (!rootNode) return 0;
    if (rootNode.children.length === 0) return 1;

    var maxDepth = 0;

    rootNode.children.forEach(child => {
        maxDepth = Math.max(maxDepth, calcTreeDepth(child));
    });

    return maxDepth + 1;
}

// Calculate the tree's width by getting the maximum amount of nodes a level has
function calcTreeWidth(rootNode){
    if (!rootNode) return 0;
    if (rootNode.children.length === 0) return 0;

    var maxWidth = 0;
    var maxWidth2 = 0;

    rootNode.children.forEach(child => {
        maxWidth++;
        child.children.forEach(child2 => {
            maxWidth2++;
        });
    });
    maxWidth = Math.max(maxWidth, maxWidth2);

    rootNode.children.forEach(child => {
        maxWidth = Math.max(maxWidth, calcTreeWidth(child));
    });

    return maxWidth;
}

function calcNodePositions(decisionTree, levels, columns, treeWidth, treeHeight, nodeWidth, nodeHeight, leafWidth, leafHeight){
    var root = decisionTree;
    var rootXvalue = svgWidth / 2 - nodeWidth / 2;
    createNode(root.id, root.nodeValues.n, root.nodeValues.entropy, root.attribute, rootXvalue, svgHeight - treeHeight, nodeWidth, nodeHeight);
    
    var childrenNr = decisionTree.children.length;
    if (childrenNr == 0) return;

    // Calculate right borders for each subtree
    var subtreesWidths = [];
    for(var i = 0; i < childrenNr; i++){
        subtreesWidths.push((svgWidth / childrenNr) + (i * (svgWidth / childrenNr)));
    }
    
    var nodeSplit = nodeWidth / childrenNr;
    var branchX1values = [];
    for (var i = 0; i < childrenNr; i++) {
        branchX1values.push(rootXvalue + (nodeSplit - (nodeSplit / 2) + (i * nodeSplit)));
    }

    var branchX2values = [];
    for (var i = 0; i < childrenNr; i++) {
        branchX2values.push(subtreesWidths[i] - (subtreesWidths[0] / 2));
        console.log(branchX2values[i]);
    }

    var branchY1value = svgHeight - treeHeight + nodeHeight - 1;
    var branchY2value = svgHeight - treeHeight + (nodeHeight * 2);
    for (var i = 0; i < childrenNr; i++){
        createBranch(root.children[i].id, branchX1values[i], branchY1value, branchX2values[i], branchY2value, root.children[i].prevBranchVal);
    }
}

function buildTree() {
    var decisionTree = id3(data, attributes, null, "n1", "l1")[0];
    console.log(decisionTree);

    var svgSize = calcSvgSize(decisionTree);
    svgWidth = svgSize[0];
    svgHeight = svgSize[1];
    resizeViewBox(svgWidth, svgHeight);

    // createNode("n1", 14, 0.94, "Outlook", 100, 300, 81, 91);
    // createNode("n2", 5, 0.97, "Humidity", 200, 400, 81, 91);

    // createLeaf("l1", 4, 4, 0, 0, "Yes", 1, 0, 111.5, 138.6);
    // createLeaf("l1", 4, 4, 0, 0, "Yes", 1, 138.6, 111.5, 138.6);
    // createLeaf("l1", 4, 4, 0, 0, "Yes", 1, 277.2, 111.5, 138.6);
    // createLeaf("l1", 4, 4, 0, 0, "Yes", 1, 415.8, 111.5, 138.6);
    // createLeaf("l1", 4, 4, 0, 0, "Yes", 1, 554.4, 111.5, 138.6);

    // createBranch("n2", 200, 100, 200, 200, "Sunny");
    // createBranch("n1", 100, 100, 50, 200, "Overcast");

    var treeDepth = calcTreeDepth(decisionTree);
    console.log(treeDepth);

    var treeWidth = calcTreeWidth(decisionTree);
    console.log(treeWidth);

    

    // A level is a level of (leaf) nodes or branches 
    var levels = treeDepth + (treeDepth - 1);
    var levelHeight = svgHeight / levels;

    // The height of one level is based on a leaf's height because it's the element with the highest height
    var heightRatio = levelHeight / STD_LEAFHEIGHT

    var leafHeight = STD_LEAFHEIGHT * heightRatio;
    var nodeHeight = STD_NODEHEIGHT * heightRatio;

    // Maximum node width: width with which an amount of treeWidth (leaf nodes) would fit next to each other
    var maxNodeWidth = svgWidth / treeWidth;
    // So there can be space between nodes
    var realNodeWidth = maxNodeWidth / 2;

    var widthRatio = realNodeWidth / STD_LEAFWIDTH;

    var leafWidth = STD_LEAFWIDTH * widthRatio;
    var nodeWidth = STD_NODEWIDTH * widthRatio;

    calcNodePositions(decisionTree, levels, treeWidth / 2, svgWidth, svgHeight, nodeWidth, nodeHeight, leafWidth, leafHeight);
    
}

function handleResize() {
    if (calcSvgSize() != svgWidth || calcSvgSize() != svgHeight){
        buildTree();
    }
}

window.onresize = handleResize;
