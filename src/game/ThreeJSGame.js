import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Tile from "./Tile.js";
import Piece from "./Piece.js";

class ThreeJSGame {
	constructor(containerId, eventCallBack) {
		this.container = document.getElementById(containerId);
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.renderer = new THREE.WebGLRenderer();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.container.appendChild(this.renderer.domElement);

		this.tiles = [];
		this.pieces = [];
		this.clickableTiles = [];
		this.clickablePieces = [];
		this.toMovePiece = null;
		this.gamePhase = "";

		this.rankValues = [
			0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 13, 13,
			14,
		];
		this.eventCallBack = eventCallBack;
	}

	init() {
		this.initTilesAndPieces();
		this.setupCameraAndControls();
		this.addLights();
		this.setupEventListeners();
		this.animate();
	}

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

	createTiles() {
		const boardGroup = new THREE.Group();
		this.scene.add(boardGroup);

		for (let x = 0; x < 8; x++) {
			for (let y = 0; y < 9; y++) {
				const square = new Tile(y, x, 1, x < 4 ? "blue" : "red");
				boardGroup.add(square.mesh);
				this.tiles.push(square);
				this.clickableTiles.push(square.mesh.children[1]);
			}
		}
	}

	createPlayerPieces(player, color) {
		const shuffledArray = this.shuffleArray(this.rankValues);

		for (let i = 0; i < 21; i++) {
			const row = i % 9;
			const col =
				player === "self" ? 7 - Math.floor(i / 9) : Math.floor(i / 9);
			const piece = new Piece(
				player === "self" ? i : i + 21,
				row,
				col,
				player,
				color,
				shuffledArray[i]
			);
			this.pieces.push(piece);

			this.clickablePieces.push(piece.mesh.children[0]);

			this.tiles[col * 9 + row].pieceIndex = i;

			this.scene.add(piece.mesh);
		}
	}

	initTilesAndPieces() {
		this.createTiles();
		const selfColor = Math.floor(Math.random() * 2);
		this.createPlayerPieces("self", selfColor === 0 ? "white" : "black");
		this.createPlayerPieces("oppo", selfColor === 1 ? "white" : "black");
	}

	pieceClicked(index) {
		if (this.pieces[index].isEnabled) {
			this.resetPieces();
			this.resetTiles();

			if (this.gamePhase === "prep") {
				if (!this.toMovePiece) {
					this.toMovePiece = this.pieces[index];
					this.pieces[index].select();
					this.getTilesInZone();
				} else {
					if (index !== this.toMovePiece.index) {
						this.switchPieces(index);
					}
					this.toMovePiece = null;
				}
			} else {
				if (!this.toMovePiece || index !== this.toMovePiece.index) {
					this.toMovePiece = this.pieces[index];
					this.pieces[index].select();
					this.getAdjacentTiles(
						this.pieces[index].row,
						this.pieces[index].col
					);
				} else {
					this.toMovePiece = null;
				}
			}
		}
	}

	tileClicked(index) {
		if (this.tiles[index].isEnabled) {
			this.resetPieces();
			this.resetTiles();

			if (this.tiles[index].pieceIndex) {
				if (this.gamePhase === "prep") {
					this.switchPieces(this.tiles[index].pieceIndex);
				} else {
					// Game logic for moving pieces
				}
			} else {
				this.movePiece(index);
			}
			this.toMovePiece = null;
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
	}

	movePiece(clickedTileIndex) {
		this.tiles[this.toMovePiece.tileIndex].pieceIndex = null;

		const newRow = this.tiles[clickedTileIndex].row;
		const newCol = this.tiles[clickedTileIndex].col;

		this.tiles[clickedTileIndex].pieceIndex = this.toMovePiece.index;
		this.toMovePiece.updatePosition(newRow, newCol);

		if (this.eventCallBack) {
			this.eventCallBack({
				type: "move",
				position: { row: newRow, col: newCol },
			});
		}
	}

	resetTiles() {
		this.tiles.forEach((tile) => tile.reset());
	}

	resetPieces() {
		this.pieces.forEach((piece) => piece.select(false));
	}

	shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const randomIndex = Math.floor(Math.random() * (i + 1));
			[array[i], array[randomIndex]] = [array[randomIndex], array[i]];
		}
		return array;
	}

	resetPieces() {
		this.pieces.forEach((piece) => piece.select(false));
	}

	resetTiles() {
		this.tiles.forEach((tile) => tile.reset());
	}

	getTilesInZone() {
		this.tiles.forEach((tile) => {
			if (tile.col > 4 && tile.pieceIndex !== toMovePiece.index) {
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

			if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 8) {
				adjacentTiles.push(newCol * 9 + newRow);
			}
		}

		adjacentTiles.forEach((tileIndex) => {
			if (!this.tiles[tileIndex].pieceIndex) {
				this.tiles[tileIndex].blink();
			}
		});
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.controls.update();
		this.renderer.render(this.scene, this.camera);
	}
}

export default ThreeJSGame;
