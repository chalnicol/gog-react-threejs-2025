import * as THREE from "three";

class Tile {
	constructor(row, col, color) {
		// Create the box (tile)
		this.row = row;
		this.col = col;
		this.color = color;
		this.timer = null;
		this.isEnabled = false;
		// this.isResided = false;
		this.pieceIndex = null;
		this.playerIndex = null;
		this.blinkAnim = null;

		this.mesh = new THREE.Group();

		this.init();
	}

	init() {
		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;

		const boxGeometry = new THREE.BoxGeometry(1, 0.1, 1);
		const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xdedede });
		const square = new THREE.Mesh(boxGeometry, boxMaterial);

		const insideBoxGeometry = new THREE.BoxGeometry(1 - 0.06, 0.11, 1 - 0.06);
		const insideBoxMaterial = new THREE.MeshBasicMaterial({ color: clr });
		const insideSquare = new THREE.Mesh(insideBoxGeometry, insideBoxMaterial);

		this.mesh.add(square, insideSquare);

		const x = this.col - 9 / 2 + 0.5;
		const z = this.row - 8 / 2 + 0.5;
		this.mesh.position.set(x, 0, z);
	}

	blink() {
		let blinking = false;

		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;

		const blinkColor = this.color === "blue" ? 0x4d4dff : 0xff6666;

		this.mesh.children[1].material.color.set(blinkColor);

		this.timer = setInterval(() => {
			blinking = !blinking;
			this.mesh.children[1].material.color.set(blinking ? clr : blinkColor);
		}, 400);

		this.isEnabled = true;
	}

	clear() {
		clearInterval(this.timer);
		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;
		this.mesh.children[1].material.color.set(clr);
		this.isEnabled = false;
	}

	setIndexes(playerIndex, pieceIndex) {
		this.pieceIndex = pieceIndex;
		this.playerIndex = playerIndex;
	}
	clearIndexes() {
		this.pieceIndex = null;
		this.playerIndex = null;
	}
}

export default Tile;
