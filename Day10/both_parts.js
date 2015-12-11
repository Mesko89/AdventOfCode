'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var value = '1113122113';
for (var i = 0; i < 40; i++) {
	value = translate(value);
}

console.log(sprintf('Length after 40 times: %d', value.length));

for (i = 0; i < 10; i++) {
	value = translate(value);
}

console.log(sprintf('Length after 50 times: %d', value.length));

function translate(value) {
	return value.split('').reduce((d, c, i) => {
		if (d.curr === null) {
			d.count = 0;
			d.curr = c;
			return d;

		} else if (i === value.length - 1 || d.curr !== c) {
			d.value += (d.count + 1) + '' + d.curr;
			d.curr = c;
			d.count = 0;
			if (i === value.length - 1)
				d.value += '1' + c;
			return d;

		} else {
			d.count++;
			return d;
		}
	}, { curr: null, value: '', count: 0 }).value;
}
