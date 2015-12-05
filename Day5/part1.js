'use strict';

var fs = require('fs');
var words = fs.readFileSync('Day5/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
words = words.filter(w => !!w); // Remove last empty line if needed
var criteria = [doesNotContainBadParts, containsThreeVowels, containsDoubleLetter];
var goodWords = words.filter(isGoodWord(criteria));

console.log('Total good words: ' + goodWords.length);


function isGoodWord(criteria) { return (word) => criteria.every(c => c(word)); }

function containsThreeVowels(word) {
	var vowels = 'aeiou';
	return word.split('').reduce((total, c) => {
		return vowels.indexOf(c) !== -1 ? ++total : total;
	}, 0) >= 3;
}

function containsDoubleLetter(word) {
	return word.split('').some((c, i, a) => c === a[i - 1]);
}

function doesNotContainBadParts(word) {
	var badWords = ['ab', 'cd', 'pq', 'xy'];
	return !word.split('').some((c, i, a) => badWords.indexOf(a[i - 1] + c) !== -1);
}
