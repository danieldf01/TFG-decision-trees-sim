// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
const { mostCommonLabel } = require('./tree')
const fs = require('fs');
const path = require('path');
/* eslint-enable */
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

jest
    .dontMock('fs');
    
test('E: properly calculates the Binary Entropy of a p value 0.5', () => {
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