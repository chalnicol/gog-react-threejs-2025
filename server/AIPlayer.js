import { Player } from "./Player.js";
import Utils from "./Utils.js";

class AIPlayer extends Player {
	constructor(id, username) {
		super(id, null, username, true);
		this.gridData = []; // Stores board data
	}

	//..
	initGridData() {
		for (let i = 0; i < 8; i++) {
			for (let j = 0; j < 9; j++) {
				this.gridData[i][j] = {
					rank: null,
					player: null, //self or oppo
				};
			}
		}
	}
	//get initial data from owned piece initial position
	getInitialData() {
		//todo..
	}

	setGridData(data) {
		this.gridData;
	}
}

export default AIPlayer;
