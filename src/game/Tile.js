import * as THREE from "three";

class Tile {
	constructor(row, col, size, color) {
		// Create the box (tile)
		this.row = row;
		this.col = col;
		this.size = size;
		this.color = color;
		this.timer = null;
		this.isEnabled = false;
		// this.isResided = false;
		this.pieceIndex = null;
		this.mesh = this.createMesh();
		this.blinkAnim = null;
	}

	createMesh() {
		const pieceGroup = new THREE.Group();

		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;

		const boxGeometry = new THREE.BoxGeometry(this.size, 0.1, this.size);
		const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xdedede });
		const square = new THREE.Mesh(boxGeometry, boxMaterial);

		const insideBoxGeometry = new THREE.BoxGeometry(
			this.size - 0.06,
			0.11,
			this.size - 0.06
		);
		const insideBoxMaterial = new THREE.MeshBasicMaterial({ color: clr });
		const insideSquare = new THREE.Mesh(insideBoxGeometry, insideBoxMaterial);

		pieceGroup.add(square, insideSquare);

		const x = this.row - 9 / 2 + 0.5;
		const z = this.col - 8 / 2 + 0.5;

		pieceGroup.position.set(x, 0, z);

		return pieceGroup;
	}

	blink() {
		let blinking = false;

		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;

		const blinkColor = this.color === "blue" ? 0x8080ff : 0xff6666;

		this.mesh.children[1].material.color.set(blinkColor);

		this.timer = setInterval(() => {
			blinking = !blinking;
			this.mesh.children[1].material.color.set(blinking ? clr : blinkColor);
		}, 400);

		this.isEnabled = true;
	}

	reset() {
		clearInterval(this.timer);
		const clr = this.color === "blue" ? 0x0000ff : 0xff0000;
		this.mesh.children[1].material.color.set(clr);
		this.isEnabled = false;
	}
}

export default Tile;
