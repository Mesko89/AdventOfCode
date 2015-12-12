'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var input = fs.readFileSync('Day12/puzzle_input').toString().replace(/\r|\n/g, '');
var obj = JSON.parse(input);

console.log(sprintf('Total sum in data structure: %d',
	sum(obj)));
console.log(sprintf('Total sum in data structure without objects with "red" value: %d',
	sum(obj, 'red')));

function sum(obj, ignoreObjectsWithValue) {
	var total = 0;
	var values = [];

	if (Array.isArray(obj)) {
		values = obj;
	} else if (isObject(obj)) {
		values = Object.keys(obj).map(k => obj[k]);
		if (ignoreObjectsWithValue && values.some(v => v === ignoreObjectsWithValue))
			return total;
	} else {
		values.push(obj);
	}

	values.forEach(v => addValue(v));

	return total;

	function addValue(v) {
		if (isNumber(v))
			total += v;
		else if (isObject(v))
			total += sum(v, ignoreObjectsWithValue);
	}
}

function isNumber(v) { return typeof v === 'number'; }
function isObject(v) { return typeof v === 'object'; }
