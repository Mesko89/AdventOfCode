'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;
var permutate = require('../Utils/permutate');

var lines = fs.readFileSync('Day13/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var dinnerData = lines.map(toHappinessConnections).reduce(toDinnerData, getInitialDinnerData());
var permutations = permutate(dinnerData.people);

var maxHappiness = permutations.reduce(toMaxHappiness(dinnerData), { permutations: [], max: 0 }).max;
console.log('Total happiness for the optimal seating arrangment: %d', maxHappiness);

dinnerData = addMeToDinner(dinnerData);
permutations = permutate(dinnerData.people);
var maxHappinessWithMe = permutations
	.reduce(toMaxHappiness(dinnerData), { permutations: [], max: 0 }).max;

console.log('Total happiness for the optimal seating arrangement with me: %d', maxHappinessWithMe);

function addMeToDinner(dinnerData) {
	var me = 'Me';
	dinnerData.connections[me] = {};
	dinnerData.people.forEach(p => {
		dinnerData.connections[me][p] = 0;
		dinnerData.connections[p][me] = 0;
	});
	dinnerData.people.push(me);
	return dinnerData;
}

function toHappinessConnections(line) {
	var m = line.match(/(.+) would (gain|lose) (\d+) happiness units by sitting next to (.+)\./);
	return {
		from: m[1],
		to: m[4],
		happiness: parseInt(m[3], 10) * ( m[2] === 'lose' ? -1 : 1)
	};
}

function toDinnerData(data, d) {
	if (data.people.indexOf(d.from) === -1)
		data.people.push(d.from);
	if (data.people.indexOf(d.to) === -1)
		data.people.push(d.to);
	if (!(d.from in data.connections))
		data.connections[d.from] = {};
	data.connections[d.from][d.to] = d.happiness;
	return data;
}

function toMaxHappiness(dinnerData) {
	return (permutationsData, permutation) => {
		var happiness = calculateHappiness(permutation);
		if (permutationsData.max < happiness)
			permutationsData.max = happiness;
		permutationsData.permutations.push({ permutation: permutation, happiness: happiness });
		return permutationsData;
	};

	function calculateHappiness(permutation) {
		return permutation.reduce((total, p, i, a) => {
			if (i === 0) {
				return total +
					dinnerData.connections[p][a[a.length - 1]] +
					dinnerData.connections[a[a.length - 1]][p];
			} else {
				return total +
					dinnerData.connections[p][a[i-1]] +
					dinnerData.connections[a[i-1]][p];
			}
		}, 0);
	}
}

function getInitialDinnerData() {
	return { people: [], connections: {} };
}
