// disabled to not trigger Codacy warnings because this is the recommended way to import modules for Jest testing
/* eslint-disable */
import { mostCommonLabel, entropyLabels, infoGain, findBestAttribute, id3 } from '../js/tree';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
/* eslint-enable */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');


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

test('entropyLabels: gets entropy = 0', () => {
    var labels = ['yes', 'yes', 'yes'];

    expect(entropyLabels(labels)).toBe(0);
})

test('entropyLabels: gets entropy = 1', () => {
    var labels = ['yes', 'no'];

    expect(entropyLabels(labels)).toBe(1);
})

test('entropyLabels: gets entropy = 0.94 for example data', () => {
    var labels = ['no', 'no', 'yes', 'yes', 'yes', 'no', 'yes', 'no', 'yes', 'yes', 'yes', 'yes', 'yes', 'no'];

    expect(parseFloat(entropyLabels(labels).toFixed(2))).toBe(0.94);
})
