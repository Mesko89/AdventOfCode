'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var timeFlying = 2503; // in seconds
var lines = fs.readFileSync('Day14/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var reindeers = lines.map(toReindeerInfo);
reindeers.forEach(calculateDistance(timeFlying));
var bestReindeer = reindeers.reduce(toMaxDistanceReindeer, null);

console.log(sprintf('%s was the best reindeer by traveling %d km.',
	bestReindeer.name, bestReindeer.distance));

bestReindeer = bestReindeerByLeadingPoints(reindeers, timeFlying);
console.log(sprintf('%s was the best reindeer by leading points scoring %d points.',
	bestReindeer.name, bestReindeer.points));

function bestReindeerByLeadingPoints(reindeers, timeFlying) {
	reindeers.forEach(r => {
		r.flyTimer = r.flyTime;
		r.restTimer = 0;
		r.points = 0;
		r.distance = 0;
	});
	while (--timeFlying) {
		reindeers.forEach(r => {
			if (r.flyTimer > 0) {
				r.distance += r.velocity;
				r.flyTimer--;
				if (r.flyTimer === 0)
					r.restTimer = r.restTime;
			} else {
				r.restTimer--;
				if (r.restTimer === 0) {
					r.flyTimer = r.flyTime;
				}
			}
		});
		var bestReindeer = reindeers.reduce(toMaxDistanceReindeer, null);
		bestReindeer.points++;
	}
	return reindeers.reduce(toMaxPointsReindeer, null);
}

function toReindeerInfo(line) {
	var rx = /(\w*) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./;
	var d = line.match(rx);
	return {
		name: d[1],
		velocity: parseInt(d[2], 10), // km/s
		flyTime: parseInt(d[3], 10), // seconds
		restTime: parseInt(d[4], 10) // seconds
	};
}

function calculateDistance(timeFlying) {
	return reindeer => {
		var cycleTime = reindeer.flyTime + reindeer.restTime;
		var cycles = timeFlying / cycleTime;
		var distance = Math.floor(cycles) * reindeer.flyTime * reindeer.velocity;
		var lastCycleTime = Math.round((cycles - Math.floor(cycles)) * cycleTime);
		if (lastCycleTime > 0) {
			var lastCycleFlyTime = Math.min(reindeer.flyTime, lastCycleTime);
			distance += lastCycleFlyTime * reindeer.velocity;
		}
		reindeer.distance = distance;
		return reindeer;
	};
}

function toMaxDistanceReindeer(max, reindeer) {
	return max === null ? reindeer : max.distance < reindeer.distance ? reindeer : max;
}

function toMaxPointsReindeer(max, reindeer) {
	return max === null ? reindeer : max.points < reindeer.points ? reindeer : max;
}
