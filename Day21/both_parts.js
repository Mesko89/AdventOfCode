'use strict';

Array.prototype.first = function() {
	return this[0];
};

Array.prototype.last = function() {
	return this[this.length-1];
};

var sprintf = require('sprintf-js').sprintf;
var equipments = require('./equipments.js');
var boss = {hitPoints: 100, damage: 8, armor: 2};
//var possibleEquipments = getPossibleEquipments(equipments);

var playerConfigurations = getPossibleEquipments(equipments).map(toPlayer);
playerConfigurations.sort((a,b) => a.cost - b.cost);
var fights = playerConfigurations.map(p => simulateFight(p, boss));
console.log(sprintf(
	'Minimum equipment cost to win a fight: %d',
	fights.filter(f => f.playerWon).first().player.cost
));
console.log(sprintf(
	'Maximum equipment cost to lose a fight: %d',
	fights.filter(f => !f.playerWon).last().player.cost
));

function toPlayer(equipment) {
	return {
		hitPoints: 100,
		damage: equipment.reduce((d, e) => d + e.damage, 0),
		armor: equipment.reduce((d, e) => d + e.armor, 0),
		cost: equipment.reduce((d, e) => d + e.cost, 0)
	};
}

function simulateFight(player, boss) {
	var playerDps = Math.max(player.damage - boss.armor, 1);
	var bossDps = Math.max(boss.damage - player.armor, 1);
	return {player: player, boss: boss, playerWon: playerDps >= bossDps};
}

function getPossibleEquipments(equipments) {
	var possibilities = [];
	equipments.weapons.forEach(w => {
		possibilities.push([w]);
		possibilities = possibilities.concat(addArmor([w], equipments));
		for (var i = 1; i <= 2; i++) {
			possibilities = possibilities.concat(addRings([w], equipments, i));
		}
	});
	return possibilities;
}

function addArmor(currentEquipment, equipments) {
	var possibilities = [];
	equipments.armors.forEach(a => {
		var possibleEquipment = currentEquipment.filter(_ => true).concat([a]);
		possibilities.push(possibleEquipment);
		for (var i = 1; i <= 2; i++) {
			possibilities = possibilities.concat(addRings(possibleEquipment, equipments, i));
		}
	});
	return possibilities;
}

function addRings(currentEquipment, equipments, totalRings) {
	var possibilities = [];
	equipments.rings.forEach(r1 => {
		var possibleEquipment = currentEquipment.filter(_ => true).concat([r1]);
		possibilities.push(possibleEquipment);
		if (totalRings > 1) {
			equipments.rings.forEach(r2 => {
				if (r1 !== r2) {
					possibleEquipment = currentEquipment.filter(_ => true).concat([r1, r2]);
					possibilities.push(possibleEquipment);
				}
			});
		}
	});
	return possibilities;
}
