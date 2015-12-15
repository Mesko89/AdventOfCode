'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var timeFlying = 2503; // in seconds
var lines = fs.readFileSync('Day15/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed
var toMaxScore = (m, v) => m > v.score ? m : v.score;

var ingredients = lines.map(toIngredientsData);
var possibilities = getPossibilities(100);
var scores = possibilities.map(toRecipeScore(ingredients));
var maxScore = scores.reduce(toMaxScore, 0);
console.log(sprintf('Best scoring cookie had score of %d', maxScore));
var max500CaloriesScore = scores.filter(s => s.calories === 500).reduce(toMaxScore, 0);
console.log(sprintf('Best scoring 500 calories cookie had score of %d', max500CaloriesScore));

function toIngredientsData(line) {
	var name = line.split(': ')[0];
	var properties = line.split(': ')[1].split(', ').map(p => p.split(' '));
	var ingredient = {};
	properties.forEach(p => { ingredient[p[0]] = parseInt(p[1], 10); });
	ingredient.name = name;
	return ingredient;
}

function toRecipeScore(ingredients) {
	var properties = getProperties(ingredients[0]);
	return p => {
		var scores = properties.map(prop => {
			var score = ingredients.reduce((t, ingredient, i) => {
				return t + ingredient[prop] * p[i];
			}, 0);
			return score > 0 ? score : 0;
		});
		var score = scores.reduce((t, v) => t * v, 1);
		var calories = ingredients.reduce((t, ingredient, i) => t + ingredient.calories * p[i], 0);
		return { score: score, calories: calories };
	};
}

function getProperties(ingredient) {
	return Object.keys(ingredient).filter(i => i !== 'name' && i !== 'calories');
}

function getPossibilities(sumMax) {
	var possibilities = [];
	for (var a = 1; a < sumMax; a++) {
		for (var b = 1; b < sumMax - a; b++) {
			for (var c = 1; c < sumMax - a - b; c++) {
				var d = sumMax - a - b - c;
				if (d < 1) continue;
				possibilities.push([a, b, c, d]);
			}
		}
	}
	return possibilities;
}
