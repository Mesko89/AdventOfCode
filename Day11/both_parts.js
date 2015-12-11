'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
var passwordCriteria = [
	doesNotContainLettersCriteria('iol'.split('')),
	hasThreeContinuousChars,
	hasTwoDifferentPairs
];
var value = 'vzbxkghb';
while (!isValidPassword(value, alphabet, passwordCriteria))
	value = add(value, alphabet);

console.log(sprintf('Next valid password after "vzbxkghb" is: %s', value));
value = add(value, alphabet);
while (!isValidPassword(value, alphabet, passwordCriteria))
	value = add(value, alphabet);
console.log(sprintf('Next Next valid password after "vzbxkghb" is: %s', value));

function add(value, alphabet, index) {
	index = index || 0;
	if (index === value.length)
		return alphabet[0] + value;
	var splitIndex = value.length - index - 1;
	var char = value.substring(splitIndex, splitIndex + 1);
	var cIndex = alphabet.indexOf(char);
	cIndex++;
	if (cIndex >= alphabet.length) {
		cIndex = 0;
		return add(newValue(alphabet[0]), alphabet, index + 1);
	}
	return newValue(alphabet[cIndex]);

	function newValue(char) {
		return value.substring(0, splitIndex) + char + value.substring(splitIndex + 1);
	}
}

function isValidPassword(value, alphabet, criterias) {
	return criterias.every(c => c(value, alphabet));
}

function hasThreeContinuousChars(value, alphabet) {
	var alphabetInOrder = alphabet.join('');
	return value.split('').some(
		(c, i, a) => i > 1 && alphabetInOrder.indexOf(a[i-2] + a[i-1] + a[i]) !== -1
	);
}

function doesNotContainLettersCriteria(letters) {
	return (value) => {
		return letters.every(l => value.indexOf(l) === -1);
	};
}

function hasTwoDifferentPairs(value) {
	var foundPairs = {};
	var totalPairs = 0;
	return value.split('').some((c, i, a) => {
		if (i === 0) return false;
		if (a[i] === a[i-1] && !(a[i] in foundPairs)) {
			foundPairs[a[i]] = true;
			totalPairs++;
		}
		return totalPairs >= 2;
	});

}
