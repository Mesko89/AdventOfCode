'use strict';

Array.prototype.first = function() {
	return this[0];
};

Array.prototype.last = function() {
	return this[this.length-1];
};

let fs = require('fs');
let sprintf = require('sprintf-js').sprintf;
let lines = fs.readFileSync('Day23/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed
let instructions = lines.map(l => toInstruction(l));
let registers = instructions.reduce((map, i) => {
	if (i.register && !(i.register in map)) map[i.register] = 0;
	return map;
}, {});

let firstRunResult = run(instructions, registers);
console.log(sprintf('Value of register "b" after running instructions: %d', firstRunResult.b));

Object.keys(registers).forEach(k => registers[k] = 0);
registers.a = 1;
let secondRunResult = run(instructions, registers);
console.log(sprintf('Value of register "b" after running instructions: %d', secondRunResult.b));

function run(instructions, registers) {
	let position = 0;
	while(typeof instructions[position] !== 'undefined') {
		let instruction = instructions[position];
		switch(instruction.id) {
		case 'hlf':
			registers[instruction.register] = Math.floor(registers[instruction.register] / 2);
			position++;
			break;
		case 'tpl':
			registers[instruction.register] *= 3;
			position++;
			break;
		case 'inc':
			registers[instruction.register]++;
			position++;
			break;
		case 'jmp':
			position += instruction.jump;
			break;
		case 'jie':
			if (registers[instruction.register] % 2 === 0)
				position += instruction.jump;
			else
				position++;
			break;
		case 'jio':
			if (registers[instruction.register] === 1)
				position += instruction.jump;
			else
				position++;
			break;
		}
	}
	return registers;
}

function toInstruction(line) {
	let id;
	let jump = 1;
	let register = null;
	let d;
	if (line.indexOf('jmp') !== -1) {
		id = 'jmp';
		jump = parseInt(line.replace('jmp ', ''), 10);
	} else if (line.indexOf(', ') !== -1) {
		d = line.match(/(\w{3}) (\w), ([+\-]\d+)/);
		id = d[1];
		register = d[2];
		jump = parseInt(d[3], 10);
	} else {
		d = line.match(/(\w{3}) (\w)/);
		id = d[1];
		register = d[2];
	}
	return { id: id, register: register, jump: jump };
}
