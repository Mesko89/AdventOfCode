'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var MFCSAMOutput = {
	children: 3,
	cats: 7,
	samoyeds: 2,
	pomeranians: 3,
	akitas: 0,
	vizslas: 0,
	goldfish: 5,
	trees: 3,
	cars: 2,
	perfumes: 1
}; // in seconds
var lines = fs.readFileSync('Day16/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var sues = lines.map(toSue);
var goodSues = sues.filter(s => {
	return Object.keys(s).filter(k => k !== 'sueNumber').every(key => MFCSAMOutput[key] === s[key]);
});
console.log(sprintf('We got a gift from Sue %d', goodSues[0].sueNumber));

var betterSues = sues.filter(s => {
	return Object.keys(s).filter(k => k !== 'sueNumber').every(key => {
		if (key === 'cats' || key === 'trees')
			return MFCSAMOutput[key] < s[key];
		else if (key === 'pomeranians' || key === 'goldfish')
			return MFCSAMOutput[key] > s[key];
		return MFCSAMOutput[key] === s[key];
	});
});
console.log(sprintf('We got a gift from Sue %d', betterSues[0].sueNumber));

function toSue(line, i) {
	var compounds = line.replace('Sue ' + (i+1) + ': ', '').split(', ');
	var compoundsObj = {sueNumber: i+1};
	compounds.forEach(c => {
		var parts = c.split(': ');
		compoundsObj[parts[0]] = parseInt(parts[1], 10);
	});
	return compoundsObj;
}
