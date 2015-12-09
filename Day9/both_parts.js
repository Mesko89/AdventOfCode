'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var lines = fs.readFileSync('Day9/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var map = lines.map(toConnections).reduce(toCitiesMap, {});
var cities = Object.keys(map);
var routeDistances = permutate(cities).map(toRouteDistances(map));

console.log('Shortest distance is: %d', Math.min.apply(null, routeDistances));
console.log('Longest distance is: %d', Math.max.apply(null, routeDistances));

function toConnections(line) {
	var parts = line.split(' = ');
	var distance = parseInt(parts[1], 10);
	var cities = parts[0].split(' to ');
	return { cities: cities, distance: distance };
}

function toCitiesMap(map, c) {
	map[c.cities[0]] = map[c.cities[0]] || {};
	map[c.cities[1]] = map[c.cities[1]] || {};
	map[c.cities[0]][c.cities[1]] = c.distance;
	map[c.cities[1]][c.cities[0]] = c.distance;
	return map;
}

function toRouteDistances(map) {
	return (cities) => {
		return cities.reduce((sum, city, i) => {
			if (i === 0 || sum === null) return sum;
			if (cities[i-1] in map && city in map[cities[i-1]]) {
				return sum + map[cities[i-1]][city];
			} else {
				return null;
			}
		}, 0);
	};
}

function permutate(list) {
	var permutations = [];
	function permute(currentList, options) {
		if (!options.length) {
			permutations.push(currentList);
			return;
		}
		options.forEach(o => permute(currentList.concat([o]), options.filter(o2 => o !== o2)));
	}
	permute([], list);
	return permutations;
}
