'use strict';

var fs = require('fs');
var sprintf = require('sprintf-js').sprintf;

var lines = fs.readFileSync('Day7/puzzle_input').toString().replace(/\r\n/g,'\n').split('\n');
lines = lines.filter(w => !!w); // Remove last empty line if needed

var instructions = lines.map(toInstruction);
var runningInstructions = instructions.filter(() => true);
var memoryMap = {};
while (runningInstructions.length > 0) {
	runningInstructions = runningInstructions.filter(i => !runInstruction(i, memoryMap));
}

console.log(sprintf('Signal on wire "a" is: %d', memoryMap['a']));
console.log(sprintf('Override value for wire "b" to be: %d', memoryMap['a']));

var bWireInstruction = instructions.filter(i => i.out === 'b')[0];
bWireInstruction.ops = [memoryMap['a']];
memoryMap = {};
runningInstructions = instructions.filter(() => true);
while (runningInstructions.length > 0) {
	runningInstructions = runningInstructions.filter(i => !runInstruction(i, memoryMap));
}
console.log(sprintf('Signal on wire "a" is: %d', memoryMap['a']));


function toInstruction(line) {
	var parts = line.split('->');
	var out = parts[parts.length - 1].trim();
	var opData = parts[0].split(' ').filter(w => !!w).map(toNumberIfPossible);
	if (opData.length === 3) {
		opData = [opData[1], opData[0], opData[2]];
	}
	return {
		ops: opData,
		out: out
	};
}

function runInstruction(instruction, memory) {
	if (instruction.ops.length === 1) {
		var value = fromMemory(memory)(instruction.ops[0]);
		if (typeof value === 'undefined') return false;
		memory[instruction.out] = value;
		return true;
	}
	var op = instruction.ops[0];
	var isDefinedInMemory = instruction.ops.every((op, i) => i === 0 || op in memory || isNumber(op));
	if (!isDefinedInMemory) return false;
	var values = instruction.ops.filter((_, i) => i > 0).map(fromMemory(memory));
	switch (op) {
	case 'NOT':
		memory[instruction.out] = ~values[0] + 65536;
		break;
	case 'AND':
		memory[instruction.out] = values[0] & values[1];
		break;
	case 'OR':
		memory[instruction.out] = values[0] | values[1];
		break;
	case 'RSHIFT':
		memory[instruction.out] = values[0] >> values[1];
		break;
	case 'LSHIFT':
		memory[instruction.out] = values[0] << values[1];
		break;
	}
	return true;
}

function fromMemory(memory) {
	return v => isNumber(v) ? v : memory[v]
}

function toNumberIfPossible(value) {
	var number = parseInt(value);
	return number === number ? number : value.trim();
}

function isNumber(value) {
	return typeof value === "number";
}
