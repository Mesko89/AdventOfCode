'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var charToDirectionMap = {'^': [1, 0], 'v': [-1, 0], '<': [0, -1], '>': [0, 1]};

var toDirections = c => charToDirectionMap[c];

var input = fs.readFileSync('Day3/puzzle_input').toString().replace(/\r|\n/g, '').split('');
var directions = input.map(toDirections);

var finalMap1 = directions.reduce(toVisitedMap, getInitialMap(1));
var finalMap2 = directions.reduce(toVisitedMap, getInitialMap(2));

console.log(sprintf('Santa visited %d unique houses.',
	Object.keys(finalMap1.map).length))
console.log(sprintf('Santa and Robo-Santa visited %d unique houses.',
	Object.keys(finalMap2.map).length))

function toVisitedMap(data, d) {
	var pos = data.pos[data.agentIndex];
	pos[0] += d[0];
	pos[1] += d[1];
	var posKey = sprintf('%d,%d', pos[0], pos[1]);
	if (posKey in data.map) data.map[posKey]++;
	else data.map[posKey] = 1;
	data.agentIndex = (data.agentIndex + 1) % data.totalAgents;
	return data;
}

function getInitialMap(totalAgents) {
	var i = totalAgents;
	var pos = [];
	while (i--)
		pos.push([0,0]);
	return {
		pos: pos,
		agentIndex: 0,
		totalAgents: totalAgents,
		map: { '0,0': totalAgents }
	};
}
