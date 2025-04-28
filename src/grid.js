



const TILE_SIZE = 50;
let drawGridlines = true;

class Grid {
	constructor(mapData, enemyData, dim) {
		this.x = 100;
		this.y = 100;
		
		this.dimX = 15;
		this.dimY = 8;
		
		this.map = [
			[2, 2, 2, 2, 2, 2, 2, 0, 0, 4, 4, 2, 2, 3, 4],
			[4, 2, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 2],
			[4, 4, 0, 3, 0, 4, 2, 0, 4, 0, 3, 2, 4, 0, 0],
			[0, 0, 0, 3, 4, 4, 2, 2, 4, 4, 3, 3, 3, 0, 0],
			[0, 0, 4, 3, 4, 2, 4, 0, 2, 4, 4, 0, 3, 4, 0],
			[4, 4, 0, 3, 2, 0, 0, 0, 4, 2, 4, 0, 3, 3, 3],
			[3, 3, 3, 3, 0, 2, 2, 4, 0, 0, 0, 4, 0, 4, 4],
			[0, 4, 4, 2, 2, 2, 4, 0, 2, 2, 2, 2, 4, 4, 4],
		];

		let objectMap = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
			[2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1],
			[2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		];
		
		this.pieces = [];
		
		for(let i = 0; i < this.dimY; i ++) {
			for(let j = 0; j < this.dimX; j ++) {
				let index = objectMap[i][j];
				
				let trooper = -1;
				
				switch (index) {
					case 0: continue;
					case 1: trooper = new Trooper(this, j, i, BLOCKMAN); break;
					case 2: trooper = new Trooper(this, j, i, PENMAN); break;
				}
				
				if (trooper != -1) this.pieces.push(trooper);
			}
		}
		
	}
	
	getScreenX(x) { return x * TILE_SIZE + this.x; };
	getScreenY(y) { return y * TILE_SIZE + this.y; };
	
	getBlockmen() {
		let b = [];
		
		for (let piece of this.pieces) {
			if (piece.team == BLOCKMAN) {
				b.push(piece);
			}
		}
		
		return b;
	}
	
	getPenmen() {
		let b = [];
		
		for (let piece of this.pieces) {
			if (piece.team == PENMAN) {
				b.push(piece);
			}
		}
		
		return b;
	}
	
	playerHasWon() {
		if (this.getPenmen().length > 0 && this.getBlockmen().length <= 0) {
			return PENMAN;
		} else if (this.getPenmen().length <= 0 && this.getBlockmen().length > 0) {
			return BLOCKMAN;
		} else {
			return NOTEAM;
		}
	}
	
	tileGetPiece(x, y) {
		for (let piece of this.pieces) {
			if (piece.x == x && piece.y == y) return piece;
		}
		
		return false;
	}
	
	generatePathEnd(piece, goalX, goalY) { // Must be a grid function to check for valid movemet tiles.
		let startX = piece.x;
		let startY = piece.y;
		
		let stepX = startX;
		let stepY = startY;
		let stepNum = 0;
		
		let steps = [];
		
		// Does not check for if a troop can move over a tile.
		/* 
			Remember to subtract a piece's mobility before ending up on a tile.
			This'll prevent them from ending on a river when they should be ending before the river. Something like that.
		*/
		
		function notOnGoal() {
			return (stepX != goalX || stepY != goalY) && stepNum < piece.movementDist;
		}
		stroke(0);
		while (notOnGoal()) {
			
			if (stepX != goalX) {
				stepNum += getTileData(this.getTile(stepX, stepY)).mCost;
				
				if (stepX < goalX) {
					if (this.isEmptyTile(stepX + 1, stepY)) stepX ++;
				} else {
					if (this.isEmptyTile(stepX - 1, stepY)) stepX --;
				}
				
				let x = this.getScreenX(stepX);
				let y = this.getScreenY(stepY);
				
				stepNum += getTileData(this.getTile(stepX, stepY)).mCost;
				
				fill(255, 255, 255);
				rect(x, y, TILE_SIZE, TILE_SIZE);
				
				steps.push({ goalX : stepX, goalY : stepY });
			}
			
			console.log(stepNum);
			
			if (!notOnGoal()) {
				break;
			}
			
			if (stepY != goalY) {
				
				
				if (stepY < goalY) {
					if (this.isEmptyTile(stepX, stepY + 1)) stepY ++;
				} else {
					if (this.isEmptyTile(stepX, stepY - 1)) stepY --;
				}
				
				let x = this.getScreenX(stepX);
				let y = this.getScreenY(stepY);
				
				stepNum += getTileData(this.getTile(stepX, stepY)).mCost;
				
				fill(255, 255, 255);
				rect(x, y, TILE_SIZE, TILE_SIZE);
				
				steps.push({ goalX : stepX, goalY : stepY });
				
			}
			
			console.log(stepNum);
			
		}
		
		return {
			goalX: stepX, // A little confusing with the names but ultimately a good choice for when I use these struct values.
			goalY: stepY,
			steps: steps,
		}
	}
	
	isValidTile(x, y) {
		return x > -1 && x < this.dimX && y > -1 && y < this.dimY;
	}
	
	isEmptyTile(x, y) {
		if (!this.isValidTile(x, y)) return false;
		
		for (let piece of this.pieces) {
			if (piece.x == x && piece.y == y) return false;
		}
		
		return true;
	}
	
	isAttackTile(pieceX, pieceY, targetX, targetY) {
		if (!this.isValidTile(targetX, targetY)) return false;
		
		let attackTiles = [
			[pieceX, pieceY - 1],
			[pieceX, pieceY + 1],
			[pieceX - 1, pieceY],
			[pieceX + 1, pieceY]
		];
		
		for (let coords of attackTiles) {
			if (coords[0] == targetX && coords[1] == targetY) {
				return true;
			}
		}
		
		return false;
	}
	
	
	getTile(x, y) {
		
		if (!this.isValidTile(x, y)) return -1;
		
		return this.map[y][x];
	}
	
	drawMap() {
		noStroke();
		
		for(let i = 0; i < this.dimY; i ++) {
			let localY = TILE_SIZE * i;
			
			for(let j = 0; j < this.dimX; j ++) {
				let localX = TILE_SIZE * j;
				
				noSmooth();
				
				let tileIndex = this.map[i][j];
				
				if (tileIndex != 3) {
					image(tiles[tileIndex], this.x + localX, this.y + localY, TILE_SIZE, TILE_SIZE);
				} else {
					if (tileIndex == 3) {
						noSmooth();
						
						let upTile    = i-1 < 0         ? 0 : this.map[i-1][j] == 3;
						let downTile  = i+1 > this.dimY-1 ? 0 : this.map[i+1][j] == 3;
						let leftTile  = j-1 < 0         ? 0 : this.map[i][j-1] == 3;
						let rightTile = j+1 > this.dimX-1 ? 0 : this.map[i][j+1] == 3; 
						let displayData = generateRoadTile(upTile, rightTile, downTile, leftTile);
						
						if (i == 1 && j == 4) {
							//console.log(displayData.tile);
							//console.log((upTile * 8) + (rightTile * 4) + (downTile * 2) + leftTile);
						}
						
						push();
						translate(this.x + localX, this.y + localY);
						rotate(displayData.angle);
						image(tiles[3][displayData.tile], 0, 0, TILE_SIZE, TILE_SIZE);
						pop();
					}
				}
			}
		}
	}
	
	drawGridlines() {
		stroke(0);
		strokeWeight(2);
			
		for(let i = 1; i < this.dimY; i ++) {
			let localY = TILE_SIZE * i;
			line(this.x - TILE_SIZE/2, this.y + localY - TILE_SIZE/2, this.x - TILE_SIZE/2 + TILE_SIZE * this.dimX, this.y + localY - TILE_SIZE/2);
		}
		
		for(let j = 1; j < this.dimX; j ++) {
			let localX = TILE_SIZE * j;
			line(this.x + localX - TILE_SIZE/2, this.y - TILE_SIZE/2, this.x + localX - TILE_SIZE/2, this.y + TILE_SIZE * this.dimY - TILE_SIZE/2);
		}
	}
	
	update() {
		for (let i in this.pieces) {
			let enemy = this.pieces[i];
			if (!enemy) continue;
			enemy.update();
			
			if (enemy.health <= 0) {
				this.pieces.splice(i, 1);
				
				if (random() > 0.05) sfx.unitDestroyed.play();
				else sfx.unitDestroyedAwesome.play();
			}
		}
		
		
	}
	
	draw() {
		this.drawMap();
		
		if(drawGridlines) {
			this.drawGridlines();
		}
		
		for (let enemy of this.pieces) {
			if (!enemy) continue;
			enemy.draw();
		}
	}
}
