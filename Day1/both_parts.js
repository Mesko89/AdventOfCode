'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var input = fs.readFileSync('Day1/puzzle_input').toString().replace(/\r|\n/g,'');
var floorInfo = { basementPosition: null, floor: 0 };
floorInfo = input.split('').reduce(toFloorInfo, floorInfo);

console.log(sprintf('Instructions take santa to %dth floor.', floorInfo.floor));
console.log(sprintf('Santa goes into basement by following instruction at position %d.',
	floorInfo.basementPosition));

function toFloorInfo(floorInfo, c, i) {
	if (c === '(') floorInfo.floor++;
	else floorInfo.floor--;
	if (floorInfo.basementPosition === null && floorInfo.floor < 0)
		floorInfo.basementPosition = i + 1;
	return floorInfo;
}
