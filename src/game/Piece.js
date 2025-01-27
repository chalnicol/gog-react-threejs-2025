import * as THREE from "three";
import gsap from "gsap";

class Piece {
	constructor(playerIndex, index, row, col, color, rankValue) {
		// Create the piece..
		this.index = index;
		this.row = row;
		this.col = col;
		this.tileIndex = row * 9 + col;
		this.playerIndex = playerIndex;
		this.rankValue = rankValue;
		this.color = color;
		this.isEnabled = false;
		this.isSelected = false;
		this.isCaptured = false;
		this.mesh = this.createMesh();
	}

	createMesh() {
		const pieceGroup = new THREE.Group();

		const clr = this.color == 0 ? 0xffffff : 0x000000;

		const pieceMaterial = new THREE.MeshBasicMaterial({ color: clr });
		const borderMaterial = new THREE.LineBasicMaterial({
			color: this.color === 0 ? 0xc3c3c3 : 0xdedede,
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

		pieceGroup.add(vert, vertBorder, base, baseBorder);

		if (this.rankValue !== null) {
			//apply rank with texture..
			const texturePath = `/game/assets/images/ranks_${
				this.color == 0 ? "white" : "black"
			}.png`;
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

			pieceGroup.add(plane);
		}

		//set pieceGroup rotation..
		if (this.playerIndex !== 0) {
			pieceGroup.rotation.y = Math.PI; // Rotate piece 180 degrees for self-placement
		}

		//set pieceGroup position..
		const x = this.col - 9 / 2 + 0.5;
		const z = this.row - 8 / 2 + 0.5;

		pieceGroup.position.set(x, 0.06, z);

		return pieceGroup;
	}

	setCaptured(i) {
		this.isCaptured = true;
		this.row = null;
		this.col = null;
		this.isEnabled = false;
		this.tileIndex = null;

		this.mesh.position.set(
			this.playerIndex == 0 ? 5.5 : -5.5,
			0.06,
			this.playerIndex == 0 ? i * 0.4 - 3.5 : -i * 0.4 + 3.5
		);
		// this.mesh.rotation.y = this.playerIndex == 0 ? Math.PI : 0;

		// gsap.to(this.mesh.position, { x: xpos, z: zpos, duration: 1 });
	}
	// Set position of the square
	updatePosition(row, col) {
		this.jump(row, col);

		this.row = row;
		this.col = col;
		this.tileIndex = row * 9 + col;
	}

	jump(row, col) {
		const xpos = col - 9 / 2 + 0.5;
		const ypos = row - 8 / 2 + 0.5;

		const disX = Math.abs(this.row - row);
		const disZ = Math.abs(this.col - col);
		const isLong = disX > 3 || disZ > 1;

		const tl = gsap.timeline();
		tl.add("anim")
			.to(
				this.mesh.position,
				{
					x: xpos,
					z: ypos,
					ease: "power2.out",
					duration: isLong ? 1 : 0.6,
				},
				"anim"
			)
			.to(
				this.mesh.position,
				{
					y: isLong ? 1.2 : 0.8,
					ease: "power4.out",
					duration: 0.3,
				},
				"anim"
			)
			.to(
				this.mesh.position,
				{ y: 0.06, ease: "bounce.out", duration: isLong ? 0.7 : 0.3 },
				"anim+=0.3"
			);
	}

	select(selected = true) {
		this.isSelected = selected;
		if (selected) {
			this.mesh.children[0].material.color.set(
				this.color === 0 ? 0xffffcc : 0x999900
			);
		} else {
			this.mesh.children[0].material.color.set(
				this.color === 0 ? 0xffffff : 0x000000
			);
		}
	}
}

export default Piece;
