'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var words = fs.readFileSync('Day5/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
words = words.filter(w => !!w); // Remove last empty line if needed
var firstCriteria = [doesNotContainBadParts, containsThreeVowels, containsDoubleLetter];
var secondCriteria = [containsAPairThatAppearsTwice, containsThreeLetterPalindrome];
var niceWordsBySillyCriteria = words.filter(isGoodWord(firstCriteria));
var niceWordsByBetterCriteria = words.filter(isGoodWord(secondCriteria));

console.log(sprintf('Total nice words by silly criteria: %d', niceWordsBySillyCriteria.length));
console.log(sprintf('Total nice words by better criteria: %d', niceWordsByBetterCriteria.length));


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

function containsAPairThatAppearsTwice(word) {
	return word.split('').some((c, i, a) => {
		var couple = a[i-1] + c;
		return i > 0 && word.lastIndexOf(couple) - word.indexOf(couple) >= 2;
	});
}

function containsThreeLetterPalindrome(word) {
	return word.split('').some((c, i, a) => {
		return i > 2 && c === a[i-2];
	});
}
