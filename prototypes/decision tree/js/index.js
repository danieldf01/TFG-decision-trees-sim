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

class NodeValues{
    constructor(class1, class2, n, entropy) {
        this.class1 = class1;
        this.class2 = class2;
        this.n = n;
        this.entropy = entropy;
    }
}

class TreeNode{
    constructor(id, attribute, nodeValues, isLeaf = false, label, prevBranchVal){
        this.id = id;
        this.attribute = attribute;

        this.nodeValues = nodeValues;
        this.isLeaf = isLeaf;
        this.label = label;

        this.prevBranchVal = prevBranchVal;
        this.children = [];
    }
}



function mostCommonLabel(data){
    var labels = [];
    data.forEach(function (row){
        labels.push(row.label);
    });

    var counts = {};
    for (const label of labels){
        counts[label] = counts[label]? counts[label] + 1 : 1;
    }

    var max = 0;
    var maxLabel = null;
    for (const label in counts){
        if (counts[label] > max){
            max = counts[label];
            maxLabel = label;
        }
    }

    return maxLabel;
}

function entropy(labels){
    // Count the occurrence of each label value
    var counts = {};
    for (const label of labels){
        counts[label] = counts[label]? counts[label] + 1 : 1;
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

function infoGain(data, attribute){
    // Save the labels for each of the attribute's instances in an array
    var attributeLabels = [];
    data.forEach(function(row){
        attributeLabels.push([row.attributes[attribute], row.label]);
    });

    // Save only the labels to calculate this attribute's entropy
    var labels = [];
    attributeLabels.forEach(function (row){
        labels.push(row[1]);
    });

    // Caclulate entropy for the whole attribute
    var e = entropy(labels);

    // Save the attribute values in a set
    var attributeValues = new Set(data.map(instance => instance.attributes[attribute]));

    // Count the number of instances for each value
    var attributeValuesCounts = (data.map(instance => instance.attributes[attribute]));
    var counts = {};
    attributeValuesCounts.forEach(function (row){
        counts[row] = counts[row]? counts[row] + 1 : 1;
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


function findBestAttribute(data, attributes){
    var bestAttribute = null;
    var maxGain = 0;
    attributes.forEach(function(attribute){
        var gain = infoGain(data, attribute);
        if (gain > maxGain){
            maxGain = gain;
            bestAttribute = attribute;
        }
    });
    return bestAttribute;
}

function id3(data, attributes, prevBranchVal, nodeId, leafId){
    if (data.length === 0) return null;
    var allPositive = true;
    var allNegative = true;
    var class1 = 0;
    var class2 = 0;
    var n = data.length;

    // Save the labels in an array
    var datasetLabels = [];
    data.forEach(function(row){
        datasetLabels.push(row.label);
    });

    // Caclulate entropy for the dataset
    var e = entropy(datasetLabels);

    for (const row of data){
        if (row.label == 'no'){
            class2++;
            allPositive = false;
        }
        if (row.label == 'yes'){
            class1++;
            allNegative = false;
        }
    }

    // Check if we have reached a leaf node
    if (allPositive){
        var nextLeafId = leafId[0] + (+leafId[1] + 1);
        return [new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, 'yes', prevBranchVal), nodeId, nextLeafId];
    }
    if (allNegative){
        var nextLeafId = leafId[0] + (+leafId[1] + 1);
        return [new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, 'no', prevBranchVal), nodeId, nextLeafId];
    }
    if (attributes.length === 0){
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
    for (const value of attributeValues){
        var subset = data.filter(instance => instance.attributes[bestAttribute] === value);
        var remainingAttributes = attributes.filter(attribute => attribute!== bestAttribute);

        if(subset.length === 0){
            tree.children.push(new TreeNode(leafId, null, new NodeValues(class1, class2, n, e), true, mostCommonLabel(subset), prevBranchVal));
        } else{
            tree.prevBranchVal = prevBranchVal;
            var returnVals = id3(subset, remainingAttributes, value, nodeId, leafId);
            tree.children.push(returnVals[0]);
            nodeId = returnVals[1];
            leafId = returnVals[2];
        }
    }
    return [tree, nodeId, leafId];
}

function buildTree(){
    var decisionTree = id3(data, attributes, null, "n1", "l1")[0];
    console.log(decisionTree);

}

function hideChildren(element){
    var node = element.querySelector('ellipse');
    var nodeId = node.id;

    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length !== 0 && connectedPaths[0].parentNode.style.display == "none"){
        showConnectedNodes(nodeId);
    } else{
        hideConnectedNodes(nodeId);
    }
}

function hideConnectedNodes(nodeId){
    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length === 0) return;

    for (const path of connectedPaths){
        var pathGroup = path.parentNode;
        pathGroup.style.display = "none";

        var pathIdNum = +path.id[1];
        var connectedNodeId = "n" + pathIdNum;

        hideConnectedNodes(connectedNodeId);
    }
}

function showConnectedNodes(nodeId){
    var connectedPaths = document.querySelectorAll('path[data-connected-to="' + nodeId + '"]');
    if (connectedPaths.length === 0) return;

    for (const path of connectedPaths){
        var pathGroup = path.parentNode;
        pathGroup.style.display = "block";

        var pathIdNum = +path.id[1];
        var connectedNodeId = "n" + pathIdNum;

        showConnectedNodes(connectedNodeId);
    }
}

buildTree();
