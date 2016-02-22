'use strict';

Array.prototype.first = function() {
	return this[0];
};

Array.prototype.last = function() {
	return this[this.length-1];
};

let sprintf = require('sprintf-js').sprintf;
let spells = require('./spells.js');

console.log(sprintf('Least mana used for easy mode: %d', getLeastManaUsed(false, 10000000)));
console.log(sprintf('Least mana used for hard mode: %d', getLeastManaUsed(true, 10000000)));


function getLeastManaUsed(hardMode, totalSimulations) {
	const debug = false;
	let n = totalSimulations;
	let manaUsagesForWins = [];

	while (n--) {
		let player = getPlayer();
		let boss = getBoss();
		let isPlayerTurn = true;

		if (debug) console.log('');
		if (debug) console.log('### GAME STARTS');
		while (!isGameOver(player, boss)) {
			if (debug) console.log('');
			if (debug) console.log(isPlayerTurn ? '-- Player turn --' : '-- Boss turn --');
			if (debug) console.log(player.toString());
			if (debug) console.log(boss.toString());

			if (hardMode === true && isPlayerTurn) {
				player.hitPoints--;
				if (debug) console.log('Player loses 1 hit point to hard mode');
				if (isGameOver(player, boss))
					break;
			}

			player.activeSpells = player.activeSpells.filter(s => !s.onTick(player, boss));

			if (isGameOver(player, boss))
				break;

			if (isPlayerTurn) {
				let spell = getPlayerSpellChoice(player);
				if (spell)
					spell.onCast(player, boss);
			} else {
				let dmg = Math.max(boss.damage - player.armor, 1);
				if (player.armor === 0)
					if (debug) 	console.log(sprintf('Boss attacks for %d damage!', dmg));
				else
					if (debug) console.log(sprintf('Boss attacks for %d - %d = %d damage!', boss.damage, player.armor, dmg));
				player.hitPoints -= dmg;
			}

			isPlayerTurn = !isPlayerTurn;
		}

		if (player.hitPoints > 0) {
			manaUsagesForWins.push(player.manaUsed);
			if (debug) console.log(sprintf('Winner is player! Mana spent: %d', player.manaUsed));
		} else {
			if (debug) console.log('Player is WASTED!');
		}
	}

	return Math.min.apply(Math, manaUsagesForWins);
}

function getPlayerSpellChoice(player) {
	var availableSpells = player.spells.filter(s => s.canBeCast(player));
	var len = availableSpells.length;
	var randomIndex = Math.floor(Math.random()*len);
	return availableSpells[randomIndex];
}

function isGameOver(player, boss) {
	return player.hitPoints <= 0 || boss.hitPoints <= 0;
}

function getPlayer() {
	var player = {
		hitPoints: 50,
		mana: 500,
		manaUsed: 0,
		armor: 0,
		activeSpells: [],
		spells: spells.getSpells(),
		spellsUsed: []
	};
	player.toString = () => sprintf('- Player has %d hit points, %d armor, %d mana', player.hitPoints, player.armor, player.mana);
	return player;
}

function getBoss() {
	var boss = {hitPoints: 71, damage: 10};
	boss.toString = () => sprintf('- Boss has %d hit points', boss.hitPoints);
	return boss;
}
