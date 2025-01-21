import * as THREE from "three";
import gsap from "gsap";

class Piece {
	constructor(index, row, col, player, color, rankValue) {
		// Create the box (tile)

		this.index = index;
		this.row = row;
		this.col = col;
		this.tileIndex = col * 9 + row;

		this.player = player;
		this.rankValue = rankValue;
		this.color = color;
		this.isEnabled = player == "self";
		this.isSelected = false;
		this.mesh = this.createMesh();
	}

	createMesh() {
		const pieceGroup = new THREE.Group();

		const clr = this.color == "white" ? 0xffffff : 0x000000;

		const pieceMaterial = new THREE.MeshBasicMaterial({ color: clr });
		const borderMaterial = new THREE.LineBasicMaterial({
			color: this.color === "white" ? 0xc3c3c3 : 0xdedede,
			linewidth: 2,
		});

		const vertGeometry = new THREE.BoxGeometry(0.8, 0.53, 0.05);
		const vert = new THREE.Mesh(vertGeometry, pieceMaterial);
		vert.position.set(0, 0.26, 0.04);
		vert.rotation.x = -Math.PI / 5;

		const baseGeometry = new THREE.BoxGeometry(0.8, 0.05, 0.35);
		const base = new THREE.Mesh(baseGeometry, pieceMaterial);

		const baseEdges = new THREE.EdgesGeometry(baseGeometry);
		const baseBorder = new THREE.LineSegments(baseEdges, borderMaterial);

		const vertEdges = new THREE.EdgesGeometry(vertGeometry);
		const vertBorder = new THREE.LineSegments(vertEdges, borderMaterial);
		vertBorder.position.set(0, 0.26, 0.04);
		vertBorder.rotation.x = -Math.PI / 5;

		//apply rank with texture..
		const texturePath = "/game/assets/images/ranks_" + this.color + ".png";
		const texture = new THREE.TextureLoader().load(texturePath);
		texture.generateMipmaps = false; // Disable mipmaps
		texture.minFilter = THREE.LinearFilter;

		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.repeat.set(1 / 3, 1 / 5);

		const column = this.rankValue % 3;
		const row = Math.floor(this.rankValue / 3); // Floor division to get the row number

		texture.offset.set(column / 3, 1 - (row + 1) / 5); // Adjust offset

		const planeGeometry = new THREE.PlaneGeometry(0.79, 0.51);
		const planeMaterial = new THREE.MeshBasicMaterial({
			map: texture, // Apply the texture
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.set(0, 0.28, 0.06);
		plane.rotation.x = -Math.PI / 5;

		pieceGroup.add(vert, vertBorder, base, baseBorder);

		if (this.player === "self") {
			pieceGroup.add(plane);
		}

		//set pieceGroup rotation..
		if (this.player !== "self") {
			pieceGroup.rotation.y = Math.PI; // Rotate piece 180 degrees for self-placement
		}

		//set pieceGroup position..
		const x = this.row - 9 / 2 + 0.5;
		const z = this.col - 8 / 2 + 0.5;

		pieceGroup.position.set(x, 0.06, z);

		return pieceGroup;
	}

	// Set position of the square
	updatePosition(row, col) {
		this.row = row;
		this.col = col;
		this.tileIndex = col * 9 + row;
		// this.mesh.position.set(row - 9 / 2 + 0.5, 0, col - 8 / 2 + 0.5);
		gsap.to(this.mesh.position, {
			x: row - 9 / 2 + 0.5,
			y: 0.06,
			z: col - 8 / 2 + 0.5,
			ease: "elastic.out(1, 0.6)",
			duration: 0.6,
		});
	}

	select(selected = true) {
		this.isSelected = selected;
		if (selected) {
			this.mesh.children[0].material.color.set(
				this.color === "white" ? 0xffffcc : 0x999900
			);
		} else {
			this.mesh.children[0].material.color.set(
				this.color === "white" ? 0xffffff : 0x000000
			);
		}
	}
}

export default Piece;
