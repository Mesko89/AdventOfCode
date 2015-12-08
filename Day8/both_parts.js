'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var lines = fs.readFileSync('Day8/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var stringSizeData = lines.reduce(toStringSizeData, getEmptyStringSizeData());

console.log(sprintf('Difference from chars in input (%d) and in memory (%d): %d',
	stringSizeData.chars, stringSizeData.memory, stringSizeData.diff));
console.log(sprintf('Difference from chars in input (%d) and encoded (%d): %d',
	stringSizeData.chars, stringSizeData.encoded, stringSizeData.encodedDiff));

function toStringSizeData(data, string) {
	data.chars += string.length;
	data.memory += eval(string).length;
	data.encoded += JSON.stringify(string).length;
	return data;
}

function getEmptyStringSizeData() {
	return {
		chars: 0,
		memory: 0,
		encoded: 0,
		get diff() { return Math.abs(this.chars - this.memory); },
		get encodedDiff() { return Math.abs(this.encoded - this.chars); }
	};
}
