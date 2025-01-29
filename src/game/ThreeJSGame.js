import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Tile from "./Tile.js";
import Piece from "./Piece.js";
import gsap from "gsap";
import { EventEmitter } from "eventemitter3"; // Import EventEmitter

class ThreeJSGame extends EventEmitter {
	constructor(containerId) {
		super();
		this.container = document.getElementById(containerId);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setPixelRatio(window.devicePixelRatio);
		// this.renderer.shadowMap.enabled = true;
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.container.appendChild(this.renderer.domElement);

		this.tiles = [];
		this.pieces = [];
		this.clickableTiles = [];
		this.clickablePieces = [];
		this.toMovePiece = null;
		this.gamePhase = "prep";
		this.capturedPieces = [new Array(), new Array()];
		this.animation = null;

		this.rankValues = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 13, 13,
			14,
		];
	}

	init(fieldColor = 0, piecesData = []) {
		//init tiles..
		this.createTiles(fieldColor);
		//init pieces.
		this.createPlayerPieces(0, piecesData);
		this.setupCameraAndControls();
		this.addLights();
		this.setupEventListeners();
		this.animate();
	}

	// initFieldAndPieces(fieldColor = 0, piecesData = []) {
	// 	//init tiles..
	// 	this.createTiles(fieldColor);
	// 	//init pieces.
	// 	this.createPlayerPieces(0, piecesData);
	// }

	setupCameraAndControls() {
		this.camera.position.set(0, 5, 6);
		this.camera.lookAt(0, 0, 0);
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.enableDamping = true;
		this.controls.dampingFactor = 0.1;
		this.controls.minPolarAngle = Math.PI / 4;
		this.controls.maxPolarAngle = Math.PI / 1.9;
		this.controls.minAzimuthAngle = -Math.PI / 2;
		this.controls.maxAzimuthAngle = Math.PI / 2;
		this.controls.enablePan = false;
		this.controls.target.set(0, 0, 0);
		this.controls.update();
	}

	addLights() {
		const ambientLight = new THREE.AmbientLight(0x404040); // Soft white light
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(0, 5, 5);
		this.scene.add(directionalLight);
	}

	initBrokenPieces(r, c, clr) {
		// const brokenPieces = [];

		for (let i = 0; i < 50; i++) {
			const size = Math.random() * 0.12 + 0.06;

			const xp = c - 9 / 2 + 0.5;
			const zp = r - 8 / 2 + 0.5;

			const boxMaterial = new THREE.MeshBasicMaterial({
				color: clr === 0 ? 0xffffff : 0x000000,
				transparent: true,
				opacity: 1,
				depthWrite: false,
			});
			const boxGeometry = new THREE.BoxGeometry(size, size, size);
			const box = new THREE.Mesh(boxGeometry, boxMaterial);

			// Initial position and rotation
			box.position.set(xp, 0.06, zp);
			box.rotation.set(
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2,
				Math.random() * Math.PI * 2
			);

			const toRandomSize = Math.random() * 0.8 + 0.5;

			gsap.to(box.position, {
				x: Math.random() * 3 - 1.5 + xp,
				y: Math.random() * 3 - 0.06,
				z: Math.random() * 1 - 0.5 + zp,
				duration: 0.4,
				delay: i * 0.002,
				ease: "power1.out",
				onComplete: () => {
					// brokenPieces.push(box);
					this.scene.remove(box);
					box.geometry.dispose();
					box.material.dispose();
				},
			});
			gsap.to(box.scale, {
				x: Math.random() * toRandomSize,
				y: Math.random() * toRandomSize,
				z: Math.random() * toRandomSize,
				duration: 0.4,
				ease: "linear",
			});

			this.scene.add(box);
		}
	}

	setupEventListeners() {
		window.addEventListener("click", this.onMouseClick.bind(this));
		window.addEventListener("resize", this.onWindowResize.bind(this));
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onMouseClick(event) {
		const mouse = new THREE.Vector2();
		const raycaster = new THREE.Raycaster();

		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, this.camera);

		const tilesIntersects = raycaster.intersectObjects(
			this.clickableTiles,
			true
		);
		const piecesIntersects = raycaster.intersectObjects(
			this.clickablePieces,
			true
		);

		if (piecesIntersects.length > 0) {
			const clickedPiece = piecesIntersects[0].object;
			const pieceIndex = this.clickablePieces.indexOf(clickedPiece);
			if (pieceIndex !== -1) {
				this.pieceClicked(pieceIndex);
			}
			return;
		}

		if (tilesIntersects.length > 0) {
			const clickedTile = tilesIntersects[0].object;
			const tileIndex = this.clickableTiles.indexOf(clickedTile);
			if (tileIndex !== -1) {
				this.tileClicked(tileIndex);
			}
			return;
		}
	}

	createTiles(zoneColor = 0) {
		const boardGroup = new THREE.Group();
		this.scene.add(boardGroup);

		const rows = 8;
		const cols = 9;

		const tileColor1 = zoneColor == 0 ? "red" : "blue";
		const tileColor2 = zoneColor == 0 ? "blue" : "red";

		for (let row = 0; row < rows; row++) {
			for (let col = 0; col < cols; col++) {
				const color = row < 4 ? tileColor1 : tileColor2;
				const square = new Tile(row, col, color);
				boardGroup.add(square.mesh);
				this.tiles.push(square);
				this.clickableTiles.push(square.mesh.children[1]);
			}
		}
	}

	createPlayerPieces(playerIndex, piecesData = []) {
		if (!Array.isArray(piecesData) || piecesData.length === 0) return;

		piecesData.forEach((pieceData, i) => {
			const { row, col, color, rank } = pieceData;
			const piece = new Piece(playerIndex, i, row, col, color, rank);
			this.pieces.push(piece);
			this.tiles[row * 9 + col].setIndexes(playerIndex, i);

			if (playerIndex !== 1) {
				this.clickablePieces.push(piece.mesh.children[0]);
			}
			this.scene.add(piece.mesh);
			// console.log(row, col, row * 9 + col);
		});
	}

	showOpponentRanks(ranks) {
		const oppoPieces = this.pieces.filter((piece) => piece.playerIndex === 1);
		oppoPieces.forEach((piece, i) => {
			piece.showRank(ranks[i].rank);
			console.log(ranks[i]);
		});
	}
	generatePiecesData(playerIndex, clr) {
		const piecesData = [];
		const ranks = this.getRandomRankValues(this.rankValues);
		ranks.forEach((rank, i) => {
			const row = Math.floor(i / 9);
			const col = i % 9;
			piecesData.push({
				row: playerIndex == 0 ? row + 5 : row,
				col: col,
				color: clr,
				rank: rank,
			});
		});
		return piecesData;
	}

	pieceClicked(index) {
		const piece = this.pieces[index] || null;

		if (!piece || !piece.isEnabled) return;

		this.clearPieces();
		this.clearTiles();

		if (this.gamePhase === "prep") {
			if (!this.toMovePiece) {
				this.toMovePiece = piece;
				piece.select();
				this.getTilesInZone();
			} else {
				if (index !== this.toMovePiece.index) {
					//emit..
					this.emit("sendAction", {
						action: "playerPieceMove",
						pieceIndex: this.toMovePiece.index,
						row: piece.row,
						col: piece.col,
					});
					//..
					this.switchPieces(index);
				}
				this.toMovePiece = null;
			}
		} else {
			if (!this.toMovePiece || index !== this.toMovePiece.index) {
				this.toMovePiece = piece;
				piece.select();
				this.getAdjacentTiles(piece.row, piece.col);
			} else {
				this.toMovePiece = null;
			}
		}
	}

	tileClicked(index) {
		const tile = this.tiles[index] || null;

		if (!tile || !tile.isEnabled) return;

		this.clearPieces();
		this.clearTiles();
		//emit data..
		this.emit("sendAction", {
			action: "playerPieceMove",
			pieceIndex: this.toMovePiece.index,
			row: tile.row,
			col: tile.col,
		});

		if (this.gamePhase === "prep") {
			if (tile.pieceIndex !== null) {
				this.switchPieces(tile.pieceIndex);
			} else {
				this.movePiece(index);
			}
		} else {
			//console.log("moving.. waiting for server..");
			const color = this.toMovePiece.color;
			this.setPlayerPiecesEnabled(false);
		}
	}

	switchPieces(clickedPieceIndex) {
		const toMoveRow = this.toMovePiece.row;
		const toMoveCol = this.toMovePiece.col;
		const toMoveTileIndex = this.toMovePiece.tileIndex;

		const clickedRow = this.pieces[clickedPieceIndex].row;
		const clickedCol = this.pieces[clickedPieceIndex].col;
		const clickedTileIndex = this.pieces[clickedPieceIndex].tileIndex;

		this.tiles[toMoveTileIndex].pieceIndex = clickedPieceIndex;
		this.tiles[clickedTileIndex].pieceIndex = this.toMovePiece.index;

		this.toMovePiece.updatePosition(clickedRow, clickedCol);
		this.pieces[clickedPieceIndex].updatePosition(toMoveRow, toMoveCol);

		this.toMovePiece = null;
	}

	movePiece(clickedTileIndex) {
		this.tiles[this.toMovePiece.tileIndex].clearIndexes();

		const newRow = this.tiles[clickedTileIndex].row;
		const newCol = this.tiles[clickedTileIndex].col;

		this.tiles[clickedTileIndex].setIndexes(
			this.toMovePiece.index,
			this.toMovePiece.playerIndex
		);
		this.toMovePiece.updatePosition(newRow, newCol);

		this.toMovePiece = null;
	}

	movePieceUpdate(data) {
		const {
			row,
			col,
			pieceIndex,
			playerIndex,
			clashResult,
			winner,
			captured,
		} = data;

		const piece = this.pieces[pieceIndex] || null;

		const newTileIndex = row * 9 + col;

		const currentTileIndex = piece.tileIndex;
		this.tiles[currentTileIndex].clearIndexes();

		if (clashResult >= 0) {
			//..
			piece.updatePosition(row, col);

			if (clashResult === 0) {
				this.tiles[newTileIndex].clearIndexes();
			} else if (clashResult === 1) {
				this.tiles[newTileIndex].setIndexes(playerIndex, pieceIndex);
			} else {
				//..nothing to do here
			}

			//remove
			setTimeout(() => {
				captured.forEach((p) => {
					var capturedLength = this.capturedPieces[p.playerIndex].length;
					if (!this.capturedPieces[p.playerIndex].includes(p.pieceIndex)) {
						this.capturedPieces[p.playerIndex].push(p.pieceIndex);
					}

					this.pieces[p.pieceIndex].setCaptured(capturedLength);
					//init piece exploding
					this.initBrokenPieces(row, col, this.pieces[p.pieceIndex].color);
				});
			}, 400);
		} else {
			//..
			this.tiles[newTileIndex].setIndexes(playerIndex, pieceIndex);
			piece.updatePosition(row, col);
		}

		this.toMovePiece = null; //
	}

	clearTiles() {
		this.tiles.forEach((tile) => tile.clear());
	}

	clearPieces() {
		this.pieces.forEach((piece) => piece.select(false));
	}

	getRandomRankValues(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
		}
		return array;
	}

	setPlayerPiecesEnabled(enabled = true) {
		this.pieces
			.filter((piece) => piece.playerIndex === 0)
			.forEach((piece) => (piece.isEnabled = enabled));
	}

	endPrep(oppoPiecesData = []) {
		this.setPlayerPiecesEnabled(false);
		this.clearPieces();
		this.clearTiles();
		this.createPlayerPieces(1, oppoPiecesData);
	}

	getTilesInZone() {
		this.tiles.forEach((tile) => {
			if (tile.row >= 5 && tile.pieceIndex !== this.toMovePiece.index) {
				tile.blink();
			}
		});
	}

	getAdjacentTiles(row, col) {
		const adjacentTiles = [];

		// Directions: up, down, left, right
		const directions = [
			[-1, 0], // up
			[1, 0], // down
			[0, -1], // left
			[0, 1], // right
		];

		// Check each direction
		for (let dir of directions) {
			const newRow = row + dir[0];
			const newCol = col + dir[1];

			if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 9) {
				adjacentTiles.push(newRow * 9 + newCol);
			}
		}

		adjacentTiles.forEach((tileIndex) => {
			// console.log(this.tiles[tileIndex]);
			if (this.tiles[tileIndex].playerIndex !== 0) {
				this.tiles[tileIndex].blink();
			}
		});
	}

	setPhase(phase) {
		this.gamePhase = phase;
	}

	animate() {
		this.animation = requestAnimationFrame(this.animate.bind(this));
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}
	cleanup() {
		cancelAnimationFrame(this.animation);
		this.scene.traverse((object) => {
			if (object.isMesh) {
				object.geometry.dispose();
				object.material.dispose();
			}
		});
		this.renderer.domElement.remove();
		this.renderer.dispose();
		this.controls.dispose();

		// Clear references
		this.scene = null;
		// this.camera = null;
		this.renderer = null;
		this.controls = null;
		console.log("cleanup complete");
	}
}

export default ThreeJSGame;
