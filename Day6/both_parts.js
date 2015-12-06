'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;
var Command = require('./command');

var toNumberOfLitLights = (total, v) => Array.isArray(v) ?
	total + v.reduce(toNumberOfLitLights, 0) :
	v === 1 ? ++total : total;

var toBrightness = (total, v) => Array.isArray(v) ?
	total + v.reduce(toBrightness, 0) :
	total + v;

var lines = fs.readFileSync('Day6/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var commands = lines.map(toCommands);

var field1 = generatePart1Field();
commands.forEach(processCommand(field1));
var field2 = generatePart2Field();
commands.forEach(processCommand(field2));

var numberOfLitLightsPart1 = field1.reduce(toNumberOfLitLights, 0);
var totalBrightness = field2.reduce(toBrightness, 0);

console.log('Total lit lights by following badly translated message: %d', numberOfLitLightsPart1);
console.log('Total brightness by following correctly translated message: %d', totalBrightness);

function toCommands(line) {
	var type = Command.Types.Toggle;
	if (line.indexOf('turn on') === 0)
		type = Command.Types.On;
	else if (line.indexOf('turn off') === 0)
		type = Command.Types.Off;

	line = line.replace(/turn |on |off |toggle |through /g, '');
	var fromTo = line.split(' ').reduce((a, d) => {
		a.push(d.split(',').map(v => parseInt(v, 10)));
		return a;
	}, []);

	return new Command(type, fromTo[0], fromTo[1]);
}

function processCommand(field) {
	return c => {
		for (var x = c.from[0]; x <= c.to[0]; x++) {
			for (var y = c.from[1]; y <= c.to[1]; y++) {
				field[c.type](x, y);
			}
		}
	};
}

function generatePart1Field() {
	var a = generateField();
	a.on = (x, y) => {
		a[y][x] = 1;
	};
	a.off = (x, y) => {
		a[y][x] = 0;
	};
	a.toggle = (x, y) => {
		a[y][x] = a[y][x] === 1 ? 0 : 1;
	};
	return a;
}

function generatePart2Field() {
	var a = generateField();
	a.on = (x, y) => {
		a[y][x] += 1;
	};
	a.off = (x, y) => {
		a[y][x] = Math.max(0, a[y][x] - 1);
	};
	a.toggle = (x, y) => {
		a[y][x] += 2;
	};
	return a;
}

function generateField() {
	var a = [];
	for (var i = 0; i < 1000; i++) {
		var r = [];
		for (var j = 0; j < 1000; j++) {
			r.push(0);
		}
		a.push(r);
	}
	return a;
}
