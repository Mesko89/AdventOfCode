'use strict';

Array.prototype.sum = function() {
	return this.reduce((t,v) => t + v, 0);
};

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var fitLiters = 150;
var lines = fs.readFileSync('Day17/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed
var containers = lines.map(v => parseInt(v, 10));

var combinations = [];

getCombinations([], containers);
console.log(sprintf(
	'We can fill 150 l by using %d combinations of containers', combinations.length
));

var minContainers = Math.min.apply(Math, combinations.map(c => c.length));
console.log(sprintf('Minimum containers to fill 150 l: %d', minContainers));
var totalMinContainersCombinations = combinations.filter(c => c.length === minContainers).length;
console.log(sprintf(
	'Combinations that use max %d container: %d', minContainers, totalMinContainersCombinations
));

function getCombinations(current, possibilities) {
	if (current.sum() === fitLiters) {
		combinations.push(current);
		return;
	}
	if (possibilities.length === 0 || current.sum() > fitLiters) {
		return;
	}
	var newPossibilities = JSON.parse(JSON.stringify(possibilities));
	while (newPossibilities.length) {
		var c = newPossibilities.shift();
		getCombinations(current.concat([c]), newPossibilities);
	}
}
