'use strict';

var sprintf = require('sprintf-js').sprintf;

var minPresent = 29000000;
var currentPresents = 0;
var houseNumber = 0;
do {
	houseNumber++;
	currentPresents = getDividers(houseNumber).reduce(toHousePresents(10), 0);
} while(currentPresents < minPresent);

console.log(sprintf('Lowest house number with at least %d presents: %d', minPresent, houseNumber));

var elvesDeliveries = {};
houseNumber = 0;
do {
	houseNumber++;
	currentPresents = getDividers(houseNumber).filter(d => {
		if (!(d in elvesDeliveries)) elvesDeliveries[d] = 0;
		elvesDeliveries[d]++;
		return elvesDeliveries[d] <= 50;
	}).reduce(toHousePresents(11), 0);
} while (currentPresents < minPresent);

console.log(sprintf('Lowest house number with at least %d presents: %d', minPresent, houseNumber));

function getDividers(n) {
	var s = Math.floor(n / 2);
	var r = [n];
	for (var i = 1; i <= s; i++) {
		if (n % i === 0)
			r.push(i);
	}
	return r;
}

function toHousePresents(factor) {
	return (t, c) => t + c * factor;
}
