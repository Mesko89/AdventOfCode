'use strict';

Array.prototype.sum = function() {
	return this.reduce((t,v) => t + v, 0);
};

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

const onChar = '#';
const offChar = '.';
var lines = fs.readFileSync('Day18/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed
var field = lines.map(l => l.split(''));
var originalField = JSON.parse(JSON.stringify(field));

field.getNeighbours = getNeighbours;

field.totalNeighboursOn = totalNeighboursOn;

var tempField = JSON.parse(JSON.stringify(field));
tempField.getNeighbours = getNeighbours;
tempField.totalNeighboursOn = totalNeighboursOn;

var steps = 100;
while (steps--) {
	field.forEach((_, y) => {
		field[y].forEach((v, x) => {
			var totalOn = field.totalNeighboursOn(x, y);
			if (v === onChar) {
				tempField[y][x] = totalOn === 2 || totalOn === 3 ? onChar : offChar;
			} else {
				tempField[y][x] = totalOn === 3 ? onChar : offChar;
			}
		});
	});
	let t = field;
	field = tempField;
	tempField = t;
}

console.log(sprintf('Total light on after 100 steps: %d', getLightsOn(field)));

field = originalField;
field.getNeighbours = getNeighbours;
field.totalNeighboursOn = totalNeighboursOn;

field[0][0] = onChar;
field[0][field[0].length - 1] = onChar;
field[field.length - 1][0]= onChar;
field[field.length - 1][field[0].length - 1] = onChar;

steps = 100;
while (steps--) {
	field.forEach((_, y) => {
		field[y].forEach((v, x) => {
			var totalNeighbours = field.getNeighbours(x, y).length;
			if (totalNeighbours === 3) {
				tempField[x][y] = onChar;
				return;
			}
			var totalOn = field.totalNeighboursOn(x, y);
			if (v === onChar) {
				tempField[y][x] = totalOn === 2 || totalOn === 3 ? onChar : offChar;
			} else {
				tempField[y][x] = totalOn === 3 ? onChar : offChar;
			}
		});
	});
	let t = field;
	field = tempField;
	tempField = t;
}

console.log(sprintf('Total light on after 100 steps: %d', getLightsOn(field)));

function getNeighbours(x, y) {
	var neighbours = [];
	[x-1, x, x+1].forEach(x2 => {
		[y-1, y, y+1].forEach(y2 => {
			if (x2 >= 0 && y2 >= 0 && x2 < this[0].length && y2 < this.length) {
				if (x === x2 && y2 === y) // Ignore current position
					return;
				neighbours.push([x2, y2]);
			}
		});
	});
	return neighbours;
}

function totalNeighboursOn(x, y) {
	return this.getNeighbours(x, y).reduce((t, v) => {
		return this[v[1]][v[0]] === onChar ? t + 1 : t;
	}, 0);
}

function getLightsOn(field) {
	return field.reduce((t, l) => t + l.reduce((t, v) => v === onChar ? ++t : t, 0), 0);
}
