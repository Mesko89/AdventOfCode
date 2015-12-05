'use strict';

var fs = require('fs');
var words = fs.readFileSync('Day5/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
words = words.filter(w => !!w); // Remove last empty line if needed
var criteria = [containsAPairThatAppearsTwice, containsThreeLetterPalindrome];
var goodWords = words.filter(isGoodWord(criteria));

console.log('Total good words: ' + goodWords.length);

function isGoodWord(criteria) { return (word) => criteria.every(c => c(word)); }

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
