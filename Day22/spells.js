'use strict';

const sprintf = require('sprintf-js').sprintf;

class Spell {
	constructor(manacost) {
		this.manacost = manacost;
	}

	onCast(player, boss) {
		player.mana -= this.manacost;
		player.manaUsed += this.manacost;
		player.spellsUsed.push(this);
	}
	onTick(player, boss) {}
	canBeCast(player, boss) {
		return player.mana >= this.manacost;
	}
}

class MagicMissileSpell extends Spell {

	constructor() {
		super(53);
	}

	onCast(player, boss) {
		super.onCast(player, boss);
		boss.hitPoints -= 4;
		//conosole.log('Player casts Magic Missile, attacking for 4.');
	}
}

class DrainSpell extends Spell {

	constructor() {
		super(73);
	}

	onCast(player, boss) {
		super.onCast(player, boss);
		boss.hitPoints -= 2;
		player.hitPoints += 2;
		//conosole.log('Player casts Drain, player attacks for 2 and heals for 2.');
	}
}

class ShieldSpell extends Spell {

	constructor() {
		super(113);
		this.duration = 0;
	}

	onCast(player, boss) {
		super.onCast(player, boss);
		this.duration = 6;
		player.armor += 7;
		//conosole.log('Player casts Shield, increasing armor by 7.');
		player.activeSpells.push(this);
	}

	onTick(player, boss) {
		super.onTick(player, boss);
		this.duration--;
		if (this.duration === 0) {
			player.armor -= 7;
			//conosole.log('Shield wears off.');
			return true;
		}
	}

	canBeCast(player, boss) {
		return super.canBeCast(player, boss) && this.duration === 0;
	}
}

class PoisonSpell extends Spell {

	constructor() {
		super(173);
		this.duration = 0;
	}

	onCast(player, boss) {
		super.onCast(player, boss);
		this.duration = 6;
		//console.log('Player casts Poison.');
		player.activeSpells.push(this);
	}

	onTick(player, boss) {
		super.onTick(player, boss);
		boss.hitPoints -= 3;
		this.duration--;
		//console.log(sprintf('Poison deals 3 damage; its timer is now %d.', this.duration));
		if (this.duration === 0) {
			//console.log('Poison wears off.');
			return true;
		}
	}

	canBeCast(player, boss) {
		return super.canBeCast(player, boss) && this.duration === 0;
	}
}

class RechargeSpell extends Spell {

	constructor() {
		super(229);
		this.duration = 0;
	}

	onCast(player, boss) {
		super.onCast(player, boss);
		//conosole.log('Player casts Recharge.');
		this.duration = 5;
		player.activeSpells.push(this);
	}

	onTick(player, boss) {
		super.onTick(player, boss);
		player.mana += 101;
		this.duration--;
		//conosole.log(sprintf('Recharge provides 101 mana; its timer is now %d.', this.duration));
		if (this.duration === 0) {
			//conosole.log('Recharge wears off.');
			return true;
		}
	}

	canBeCast(player, boss) {
		return super.canBeCast(player, boss) && this.duration === 0;
	}
}

module.exports = {
	spells: [MagicMissileSpell, DrainSpell, PoisonSpell, RechargeSpell, ShieldSpell],
	getSpells: function () {
		return this.spells.map((c) => new c());
	}
};
