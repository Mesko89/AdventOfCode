'use strict';

function Command(type, from, to) {
	this.type = type;
	this.from = from;
	this.to = to;
}

Command.Types = {
	On: 'on',
	Off: 'off',
	Toggle: 'toggle'
};

module.exports = Command;
