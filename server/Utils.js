class Utils {
	static shuffleList(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	static getAdjacent(row, col) {
		const adjacents = [];
		// Directions: up, down, left, right
		const directions = [
			[-1, 0], // up
			[1, 0], // down
			[0, -1], // left
			[0, 1], // right
		];

		for (let dir of directions) {
			const newRow = row + dir[0];
			const newCol = col + dir[1];

			if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 9) {
				adjacents.push({ row: newRow, col: newCol });
			}
		}
		return adjacents;
	}
}
export default Utils;
