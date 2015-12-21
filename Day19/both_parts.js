'use strict';

Array.prototype.sum = function() {
	return this.reduce((t,v) => t + v, 0);
};

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var input = 'ORnPBPMgArCaCaCaSiThCaCaSiThCaCaPBSiRnFArRnFArCaCaSiThCaCaSiThCaCaCaCaCaCaSiRnFYFArSiRnMgArCaSiRnPTiTiBFYPBFArSiRnCaSiRnTiRnFArSiAlArPTiBPTiRnCaSiAlArCaPTiTiBPMgYFArPTiRnFArSiRnCaCaFArRnCaFArCaSiRnSiRnMgArFYCaSiRnMgArCaCaSiThPRnFArPBCaSiRnMgArCaCaSiThCaSiRnTiMgArFArSiThSiThCaCaSiRnMgArCaCaSiRnFArTiBPTiRnCaSiAlArCaPTiRnFArPBPBCaCaSiThCaPBSiThPRnFArSiThCaSiThCaSiThCaPTiBSiRnFYFArCaCaPRnFArPBCaCaPBSiRnTiRnFArCaPRnFArSiRnCaCaCaSiThCaRnCaFArYCaSiRnFArBCaCaCaSiThFArPBFArCaSiRnFArRnCaCaCaFArSiRnFArTiRnPMgArF';
var lines = fs.readFileSync('Day19/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed
var mappings = lines.reduce(toMappings, {});
var flippedMappings = lines.reduce(toFlippedMappings, {});
var results = tryGetAllPossibilities(input, mappings);

console.log(sprintf('Total distinct molecues: %d', results.length));

var possibleSolutionSteps = trySolveAMistery(input, flippedMappings, [], 0);
var minSteps = Math.min.apply(Math, possibleSolutionSteps);
console.log(sprintf('Fewest number of steps to get the molecule from e: %d', minSteps));

function trySolveAMistery(string, mappings, results, steps) {
	steps = steps || 0;
	if (string === 'e') {
		console.log(steps);
		results.push(steps);
		return;
	}
	if (string.indexOf('e') === -1) {
		Object.keys(mappings).forEach((k, i2, a) => {
			if (steps === 0)
				console.log(k, i2, a.length);
			var replacement = mappings[k];
			var i = 0;
			while ((i = string.indexOf(k, i)) !== -1) {
				var firstPart = string.substr(0, i);
				var secondPart = string.substr(i + k.length);
				trySolveAMistery(firstPart + replacement + secondPart, mappings, results, steps + 1);
				i++;
			}
		});
	}
	return results;
}

function tryGetAllPossibilities(string, mappings) {
	var results = [];
	Object.keys(mappings).forEach(k => {
		var possibilities = mappings[k]; // possibilities to change it
		possibilities.forEach(p => {
			var i = 0;
			while ((i = string.indexOf(k, i)) !== -1) {
				var firstPart = string.substr(0, i);
				var secondPart = string.substr(i + k.length);
				results.push(firstPart + p + secondPart);
				i++;
			}
		});
	});
	return results.reduce((d, r) => {
		if (r in d.map) return d;
		d.map[r] = r;
		d.list.push(r);
		return d;
	}, {map: {}, list: []}).list;
}

function toMappings(map, line) {
	var parts = line.split(' => ');
	if (!(parts[0] in map))
		map[parts[0]] = [];
	map[parts[0]].push(parts[1]);
	return map;
}

function toFlippedMappings(map, line) {
	var parts = line.split(' => ');
	map[parts[1]] = parts[0];
	return map;
}
