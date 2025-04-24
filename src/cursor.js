


const FREE       = "free";
const RESTRICTED = "restricted";
const LOCKED     = "locked";

const ACTION_ATTACK    = 0;
const ACTION_MOVE      = 1;
const ACTION_NEVERMIND = 2;

const ACTION_NUM = 3;

class Cursor {
	constructor(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		
		this.usingCharActionMenu = false;
		this.charActionIndex = 0;
		
		this.boundToGrid = false; // Doesn't affect anything yet
		this.isLocked = false;
		
		this.drawDataWindow = false;
		
		this.selectedPiece = null;
		this.movementType = FREE;
	}
	
	handleInputMovement() {
		if (this.movementType == FREE) {
			if (inputHandler.upPress)    this.y --;
			if (inputHandler.downPress)  this.y ++;
			if (inputHandler.leftPress)  this.x --;
			if (inputHandler.rightPress) this.x ++;
		} else if (this.movementType == LOCKED) {
			
		}
	}
	
	handleInputAction() {
		
		if (inputHandler.gPress) {
			drawGridlines = !drawGridlines;
		}
		
		if (this.usingCharActionMenu) {
			
			if (this.charActionIndex % ACTION_NUM == ACTION_MOVE && this.selectedPiece.moved) {
				this.charActionIndex ++;
			}
			
			if (!this.selectedPiece) {
				console.error("Something's gone wrong.");
			}
			
			if (inputHandler.upPress) this.charActionIndex --;
			else if (inputHandler.downPress) this.charActionIndex ++;
			
			if (inputHandler.zPress) {
				switch (this.charActionIndex % ACTION_NUM) {
					case ACTION_ATTACK:
						console.error("Uh oh");
						this.charActionIndex = 0;
						break;
						
					case ACTION_MOVE:
						this.movementType = FREE;
						this.usingCharActionMenu = false;
						this.charActionIndex = 0;
						break;
						
					case ACTION_NEVERMIND:
					this.charActionIndex = 0;
						this.usingCharActionMenu = false;
						this.movementType = FREE;
						this.selectedPiece = null;
						break;
				}
			}
			
			return;
		}
		
		if (inputHandler.zPress) {
			console.log("z press");
			
			if (this.selectedPiece) {
				
				if (this.x == this.selectedPiece.x && this.y == this.selectedPiece.y) { // Deselect piece
					this.selectedPiece = null;
					this.movementType  = FREE;
					this.usingCharActionMenu = false;
					
				}
				
				if (this.selectedPiece) {
					if (this.selectedPiece.enable) {
						return; // Don't change selection if piece is moving
					}
				} else return;
				
				
				if (this.x == this.selectedPiece.x && this.y == this.selectedPiece.y) { // Deselect piece
					this.selectedPiece = null;
					this.movementType  = FREE;
					this.usingCharActionMenu = false;
				} else {
					this.selectedPiece.setTargetTile(this);
					this.movementType = LOCKED;
				}
			} else {
				let piece = this.grid.tileGetPiece(this.x, this.y);
				
				if (piece) {
					this.selectedPiece = piece;
					this.usingCharActionMenu = true;
					this.movementType = LOCKED;
					return;
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
	
	handleInputCharActionMenu() {
		
	}
	
	update() {
		
		if (this.selectedPiece) {
			if (!this.selectedPiece.moved && !this.selectedPiece.enabled) {
				let goalSquare = this.grid.generatePathEnd(this.selectedPiece, this.x, this.y);
			}
			
		}
		
		this.handleInputMovement();
		this.handleInputAction();
		
	}
	
	dataWindow() {
		rectMode(CORNER);
		fill(255, 255, 255);
		
		let originX = this.grid.x + TILE_SIZE * this.grid.dimX + TILE_SIZE/2;
		let originY = this.grid.y;
		
		let width = 300;
		let height = 300;
		
		rect(originX, originY, 200, 400);
		
		let tileData = getTileData(this.grid.getTile(this.x, this.y));
		
		for (let i = 0; i < width/TILE_SIZE; i ++ ) {
			image(tiles[100], originX + i * TILE_SIZE, originY, TILE_SIZE, TILE_SIZE);
		}
		
		for (let i = 0; i < width/TILE_SIZE; i ++ ) {
			image(tiles[100], originX + i * TILE_SIZE, originY + height, TILE_SIZE, TILE_SIZE);
		}
		
		for (let i = 0; i < height/TILE_SIZE; i ++ ) {
			image(tiles[100], originX, originY + i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}
		
		for(let i = 0; i < height/TILE_SIZE + 1; i ++ ) {
			image(tiles[100], originX + width, originY + i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}
		
		stroke(1);
		fill(0);
		
		if (tileData != -1) {
			textSize(20);
			text("NAME: " + tileData.name, originX + 10, originY + 20);
			text("M COST: " + tileData.mCost, originX + 10, originY + 40);
			text("DEF: " + tileData.defense, originX + 10, originY + 60);
		}
	}
	
	drawCharActionMenu() {
		let winX = this.grid.getScreenX(this.x) + TILE_SIZE * 1.2;
		let winY = this.grid.getScreenX(this.y);
		
		fill(255, 255, 255);
		rectMode(CORNER);
		rect(winX, winY, TILE_SIZE * 5, TILE_SIZE * 1.5);
		rectMode(CENTER);
		
		let menuText = [];
		
		menuText[ACTION_ATTACK] = "ATTACK";
		menuText[ACTION_MOVE] = "MOVE";
		menuText[ACTION_NEVERMIND] = "NEVERMIND";
		
		textSize(20);
		
		
		for (let i = 0; i < menuText.length; i ++) {
			fill((i%4)/3 * 255, (i%2) * 255, 0);
			
			let displayText = menuText[i];
			if (this.charActionIndex%ACTION_NUM == i) displayText = "<" + displayText; // Earthbound font has < and > flipped.
			
			if (i == ACTION_MOVE && this.selectedPiece.moved) fill(150, 150, 150);
			
			text(displayText, winX + 10, 30 * i + winY + 20, 10);
		}
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
		stroke(0);
		rect(displayX, displayY, TILE_SIZE, TILE_SIZE);
		
		if (this.selectedPiece) {
			let pieceCursorX = this.grid.getScreenX(this.selectedPiece.x);
			let pieceCursorY = this.grid.getScreenY(this.selectedPiece.y);
			
			fill(255, 0, 0, 50);
			rectMode(CENTER);
			stroke(0);
			rect(pieceCursorX, pieceCursorY, TILE_SIZE, TILE_SIZE);
		}
		
		if (this.usingCharActionMenu) {
			this.drawCharActionMenu();
		}
		
	}
}