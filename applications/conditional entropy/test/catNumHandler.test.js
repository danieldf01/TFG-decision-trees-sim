// disabled to not trigger Codacy warnings because this is the recommended way to import modules for Jest testing
/* eslint-disable */
import { addCategory, removeCategory } from '../js/catNumHandler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
/* eslint-enable */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');


test('addCategory: properly add one category', () => {
    document.body.innerHTML = html;
    addCategory();
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    expect(tBodyRef.rows.length).toBe(3);
})

test('addCategory: properly add three categories', () => {
    document.body.innerHTML = html;
    addCategory();
    addCategory();
    addCategory();
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    expect(tBodyRef.rows.length).toBe(5);
})

test('removeCategory: properly remove one category after adding one', () => {
    document.body.innerHTML = html;
    addCategory();
    removeCategory();
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    expect(tBodyRef.rows.length).toBe(2);
})

test('removeCategory: properly remove two categories after adding three', () => {
    document.body.innerHTML = html;
    addCategory();
    addCategory();
    addCategory();
    removeCategory();
    removeCategory();
    var table = document.getElementById('table-cond-entropy');
    var tBodyRef = table.getElementsByTagName('tbody')[0];
    expect(tBodyRef.rows.length).toBe(3);
})

test('removeCategory: throw error when trying to remove a category when there are only 2', () => {
    document.body.innerHTML = html;
    expect(() => removeCategory()).toThrow(Error);
    expect(() => removeCategory()).toThrow("No categories can be removed if there are only 2 left");
})