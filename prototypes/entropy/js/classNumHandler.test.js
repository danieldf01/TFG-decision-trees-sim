// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
const { E, graphFunction, calcSum, calcProbs, checkInput, calcEntropy } = require('./classNumHandler')
const fs = require('fs');
const path = require('path');
/* eslint-enable */
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

jest
    .dontMock('fs');