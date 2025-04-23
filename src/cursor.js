

class Cursor {
	constructor(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		
		this.boundToGrid = false; // Doesn't affect anything yet
		this.isLocked = false;
		
		this.drawDataWindow = false;
		
		this.selectedPiece = null;
	}
	
	tileHasPiece() {
		return false;
	}
	
	handleInputMovement() {
		if (inputHandler.upPress)    this.y --;
		if (inputHandler.downPress)  this.y ++;
		if (inputHandler.leftPress)  this.x --;
		if (inputHandler.rightPress) this.x ++;
	}
	
	handleInputAction() {
		if (inputHandler.zPress) {
			console.log("z press");
			if (this.tileHasPiece()) {
				console.error("Doesn't handle pieces yet.");
			} else {
				
				if (!this.drawDataWindow) {
					if(this.grid.isValidTile(this.x, this.y)) {
						this.drawDataWindow = true;
					}
				} else {
					this.drawDataWindow = false;
				}
				
			}
		}
		
		if(this.drawDataWindow) return;
		
		if(inputHandler.xPress) {
			if(this.grid.map[this.y][this.x] == 3) {
				this.grid.map[this.y][this.x] = 0;
			} else {
				this.grid.map[this.y][this.x] = 3;
			}
		}
	}
	
	update() {
		if (!this.isLocked && !this.drawDataWindow) this.handleInputMovement();
		this.handleInputAction();
	}
	
	dataWindow() {
		rectMode(CORNER);
		fill(255, 255, 255);
		
		let originX = this.grid.x + TILE_SIZE * this.grid.dimX + TILE_SIZE/2;
		let originY = this.grid.y;
		
		rect(originX, originY, 200, 400);
		
		let tileData = getTileData(this.grid.getTile(this.x, this.y));
		
		stroke(1);
		fill(0);
		textSize(20);
		text("NAME: " + tileData.name, originX + 10, originY + 20);
		text("M COST: " + tileData.mCost, originX + 10, originY + 40);
		text("DEF: " + tileData.defense, originX + 10, originY + 60);
	}
	
	draw() {
		let displayX = this.grid.getScreenX(this.x);
		let displayY = this.grid.getScreenY(this.y);
		
		// Data window code
		if (this.drawDataWindow) {
			this.dataWindow();
		}
		
		fill(255, 255, 255, 50);
		rectMode(CENTER);
		rect(displayX, displayY, TILE_SIZE, TILE_SIZE);
		
	}
}