import * as THREE from "three";
import gsap from "gsap";

class Piece {
	constructor(playerIndex, index, row, col, color, rankValue, texture) {
		// Create the piece..
		this.index = index;
		this.row = row;
		this.col = col;
		this.tileIndex = row * 9 + col;
		this.playerIndex = playerIndex;
		this.color = color;
		this.isEnabled = false;
		this.isSelected = false;
		this.isCaptured = false;
		this.anim = null;

		//rank..
		if (rankValue !== null && rankValue !== undefined) {
			this.rankValue = rankValue;
		} else {
			this.rankValue = 15;
		}

		this.mesh = new THREE.Group();

		this.init(texture);
	}

	init(texture) {
		// const pieceGroup = new THREE.Group();

		const clickAreaGeometry = new THREE.BoxGeometry(0.8, 1, 0.4);
		const clickAreaMaterial = new THREE.MeshBasicMaterial({
			visible: false,
		});
		const clickArea = new THREE.Mesh(clickAreaGeometry, clickAreaMaterial);
		this.mesh.add(clickArea);

		//create mesh..
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

		this.mesh.add(vert, vertBorder, base, baseBorder);

		//create ranks..

		const column = this.rankValue % 3;
		const row = Math.floor(this.rankValue / 3); // Floor division to get the row number

		const pieceTexture = texture.clone();
		pieceTexture.offset.set(column / 3, 1 - (row + 1) / 6);

		const planeGeometry = new THREE.PlaneGeometry(0.79, 0.51);
		const planeMaterial = new THREE.MeshBasicMaterial({
			map: pieceTexture, // Apply the texture
		});
		const plane = new THREE.Mesh(planeGeometry, planeMaterial);
		plane.position.set(0, 0.28, 0.06);
		plane.rotation.x = -Math.PI / 5;

		this.mesh.add(plane);

		//set pieceGroup position..
		const x = this.col - 9 / 2 + 0.5;
		const z = this.row - 8 / 2 + 0.5;

		this.mesh.position.set(x, 0.7, z);

		//set pieceGroup rotation..
		if (this.playerIndex !== 0) {
			this.mesh.rotation.y = Math.PI; // Rotate piece 180 degrees for self-placement
		}

		//drop..
		gsap.to(this.mesh.position, {
			y: 0.06,
			duration: (i) => {
				return Math.random() * 1 + 0.2;
			},
			ease: "bounce.out",
			delay: 0.3,
		});
	}

	updateRank() {
		//update rank with texture..
		const column = this.rankValue % 3;
		const row = Math.floor(this.rankValue / 3);

		// Loop through this.mesh children and find the plane with the texture
		this.mesh.children.forEach((child) => {
			if (child.isMesh && child.material.map) {
				child.material.map.offset.set(column / 3, 1 - (row + 1) / 6);
				child.material.map.needsUpdate = true; // Tell Three.js to refresh the texture
			}
		});
	}

	showRank(rank) {
		this.rankValue = rank;
		this.updateRank();
		this.rotate();
	}

	rotate() {
		var tl = gsap.timeline();

		tl.add("anim")
			.to(
				this.mesh.position,
				{ y: 0.3, duration: 0.3, ease: "power2.out" },
				"anim"
			)
			.to(
				this.mesh.rotation,
				{ y: 0, duration: 0.9, ease: "power1.out" },
				"anim"
			)
			.to(
				this.mesh.position,
				{ y: 0.06, duration: 0.6, ease: "bounce.out" },
				"anim+=0.3"
			);
	}

	setCaptured(i) {
		this.isCaptured = true;
		this.row = null;
		this.col = null;
		this.isEnabled = false;
		this.tileIndex = null;

		if (this.anim) {
			this.anim.kill();
			this.anim = null;
		}

		this.mesh.position.set(
			this.playerIndex == 0 ? -5.5 : 5.5,
			0,
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

		this.anim = gsap.timeline();
		this.anim
			.add("anim")
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
