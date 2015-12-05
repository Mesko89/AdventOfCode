'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var byValue = (a, b) => a - b;
var byMultiply = (a, b) => a * b;
var toDimensions = l => l.split('x').map(v => parseInt(v, 10)).sort(byValue);

var input = fs.readFileSync('Day2/puzzle_input').toString().replace(/\r\n/g, '\n').split('\n');
input = input.filter(l => !!l); // Remove empty lines
var dimensions = input.map(toDimensions);

console.log(sprintf('Total wrapping paper needed: %d square feet',
	dimensions.reduce(toWrappingPaperSurface, 0)));
console.log(sprintf('Total ribbon needed: %d feet',
	dimensions.reduce(toRibbonLength, 0)));

function toWrappingPaperSurface(total, presentDimensions) {
	return total +
		presentDimensions[0] * presentDimensions[1] * 2 +
		presentDimensions[1] * presentDimensions[2] * 2 +
		presentDimensions[2] * presentDimensions[0] * 2 +
		presentDimensions[0] * presentDimensions[1]; // extra
}

function toRibbonLength(total, presentDimensions) {
	return total +
		presentDimensions[0] * 2 +
		presentDimensions[1] * 2 +
		presentDimensions.reduce(byMultiply, 1); // extra
}
