const E = require('./calculator')

test('properly calculates the Entropy of a p value 0.5', () => {
    expect(E(0.5)).toBe(1);
})

test('properly calculates the Entropy of a p value 0', () => {
    expect(E(0)).toBe(0);
})

test('properly calculates the Entropy of a p value 1', () => {
    expect(E(1)).toBe(0);
})

test('throws error when calculating values below 0', () => {
    expect(() => E(-0.01)).toThrow(Error);
    expect(() => E(-0.01)).toThrow("The Binary Entropy function was tried to be calculated with an invalid x value input");
})

test('throws error when calculating values above 1.00001', () => {
    expect(() => E(-0.01)).toThrow(Error);
    expect(() => E(-0.01)).toThrow("The Binary Entropy function was tried to be calculated with an invalid x value input");
})