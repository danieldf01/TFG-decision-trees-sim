// disabled because this is the recommended way to import modules for Jest testing
/* eslint-disable */
const { addClass, removeClass } = require('./classNumHandler')
const fs = require('fs');
const path = require('path');
/* eslint-enable */
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

jest
    .dontMock('fs');

test('addClass: properly add one class', () => {
    document.body.innerHTML = html;
    addClass();
    var tableClasses = document.getElementById('table-classes');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    expect(tBodyRefClasses.rows.length).toBe(3);
})

test('addClass: properly add three classes', () => {
    document.body.innerHTML = html;
    addClass();
    addClass();
    addClass();
    var tableClasses = document.getElementById('table-classes');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    expect(tBodyRefClasses.rows.length).toBe(5);
})

test('removeClass: properly remove one class after adding one', () => {
    document.body.innerHTML = html;
    addClass();
    removeClass();
    var tableClasses = document.getElementById('table-classes');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    expect(tBodyRefClasses.rows.length).toBe(2);
})

test('removeClass: properly remove two classes after adding three', () => {
    document.body.innerHTML = html;
    addClass();
    addClass();
    addClass();
    removeClass();
    removeClass();
    var tableClasses = document.getElementById('table-classes');
    var tBodyRefClasses = tableClasses.getElementsByTagName('tbody')[0];
    expect(tBodyRefClasses.rows.length).toBe(3);
})

test('removeClass: throw error when trying to remove a class when there are only 2', () => {
    document.body.innerHTML = html;
    expect(() => removeClass()).toThrow(Error);
    expect(() => removeClass()).toThrow("No classes can be removed if there are only 2 left");
})