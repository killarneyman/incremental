
var display = {
	updateValue : function(container, value) {
		// Make it a nice looking number
		$('#'+container+' .infoValue').html(value.toFixed(2));
	},
	button : function(name, display) {
		if(display == true) {
			$('#upgrade-'+name).prop("disabled",false);
		} else {
			$('#upgrade-'+name).prop("disabled",true);
		}
	}
}

var upgrades = {
	upgradeDetails : [
						//[0]Name - [1]Owned - [2]Added cps - [3]Cost
						['Type 1', 0, 1,  20],
						['Type 2', 0, 5,  95],
						['Type 3', 0, 50, 9100]
					 ],

	construct : function() {
	},

	buy : function(item) {
		// Purchase an upgrade, upgrading the money per second

		if(dollars.spend(this.upgradeDetails[item][3])) {
			// We have enough money? Great! Buy it.
			this.upgradeDetails[item][1] += 1;
			dollars.increaseRate(this.upgradeDetails[item][2]);
		} else {
			// Can't afford it :(
			return false;
		}
	},

	affordIt : function () {
		// Update disabled state of buttons

		for(i=0;i<this.upgradeDetails.length; i++) {
			if(dollars.owned >= this.upgradeDetails[i][3]) {
				display.button(i, true);
			} else {
				display.button(i, false);
			}
		}
	}


}

var dollars = {
	owned : 0,
	rate:0,
	clickValue:0,

	construct : function() {
		dollars.setOwned(0);
		this.clickValue = 1;
		display.updateValue('moneyPerSec', this.rate);
	},

	setOwned : function(value){
		// Set the total cash
		this.owned = value;
	},

	spend : function(value) {
		// Spend some moneys
		if(value > this.owned) {
			return false;
		} else {
			this.owned -= value;
			upgrades.affordIt();
			this.refresh();
			return true;
		}
	},

	increaseRate : function(value) {
		// Increase the money per second rate
		this.rate += value;
		display.updateValue('moneyPerSec', this.rate);
	},

	click : function() {
		// Click handler
		this.owned += this.clickValue;
		display.updateValue('money', this.owned);
	},

	increment : function() {
		// Timed event
		this.owned += this.rate;
		display.updateValue('money', this.owned);
	},

	refresh : function() {
		// Force refresh the cash value
		display.updateValue('money', this.owned);
	}
}

dollars.construct();
upgrades.construct();

window.setInterval(function(){
	// Fires every second
	dollars.increment();
	upgrades.affordIt();
}, 1000);

