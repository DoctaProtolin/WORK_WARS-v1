



const TILE_SIZE = 50;
let drawGridlines = true;

class Grid {
	constructor(mapData, enemyData, dim) {
		this.x = 100;
		this.y = 100;
		
		this.dimX = 7;
		this.dimY = 3;
		
		this.map = [
			[3, 1, 0, 0, 0, 0, 0],
			[0, 0, 0, 2, 3, 3, 0],
			[0, 0, 0, 0, 3, 3, 0],
		];
		
		this.enemies = [
			[3, 1, 3, 0, 0, 0, 0],
			[0, 0, 0, 2, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
		];
		
		// this.timTrooper = new Trooper(this, 0, 0);
	}
	
	getScreenX(x) { return x * TILE_SIZE + this.x; };
	getScreenY(y) { return y * TILE_SIZE + this.y; };
	
	isValidTile(x, y) {
		return x > -1 && x < this.dimX && y > -1 && y < this.dimY;
	}
	
	getTile(x, y) {
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
						
						push();
						
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
		
	}
	
	draw() {
		this.drawMap();
		
		if(drawGridlines) {
			this.drawGridlines();
		}
		
		
	}
}
