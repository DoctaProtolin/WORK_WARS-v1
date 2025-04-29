


const FREE       = "free";
const RESTRICTED = "restricted";
const LOCKED     = "locked";

const ACTION_NEVERMIND = 0;
const ACTION_ATTACK    = 1;
const ACTION_MOVE      = 2;
const ACTION_BUILD     = 3;
const ACTION_END_TURN  = 4;



const ACTION_NUM = 5;

const BUILD_MODE = "BUILD_MODE";
const ATTACK_MODE = "ATTACK_MODE";
const NORMAL_MODE = "NORMAL_MODE";

class Cursor {
	constructor(grid, x, y, isPlayerCursor) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		
		this.drawDataWindow = false;
		this.usingCharActionMenu = false;
		this.charActionIndex = 0;
		
		this.boundToGrid = false; // Doesn't affect anything yet
		this.isLocked = false;
		
		this.selectedPiece = null;
		this.movementType = FREE;
		this.isPlayerCursor = isPlayerCursor;
		this.mode = NORMAL_MODE;
	}
	
	handleInputMovement() {
		if (this.movementType == FREE) {
			if (inputHandler.upPress)    {
				if (this.grid.isValidTile(this.x, this.y-1)) this.y --;
			}
			if (inputHandler.downPress) {
				if (this.grid.isValidTile(this.x, this.y+1)) this.y ++;
			}
			
			if (inputHandler.leftPress) {
				if (this.grid.isValidTile(this.x-1, this.y)) this.x --;
			}
			
			if (inputHandler.rightPress) {
				if (this.grid.isValidTile(this.x+1, this.y)) this.x ++;
			}
		} else if (this.movementType == LOCKED) {
			if (!this.selectedPiece) return;
			this.x = this.selectedPiece.x;
			this.y = this.selectedPiece.y;
		} else if (this.movementType == RESTRICTED) {
			if (inputHandler.upPress || inputHandler.downPress || inputHandler.leftPress || inputHandler.rightPress) {
				this.x = this.selectedPiece.x;
				this.y = this.selectedPiece.y;
				
				if (inputHandler.upPress    && this.grid.isValidTile(this.x, this.y-1)) this.y = this.selectedPiece.y -1;
				else if (inputHandler.downPress  && this.grid.isValidTile(this.x, this.y+1)) this.y = this.selectedPiece.y +1;
				else if (inputHandler.leftPress  && this.grid.isValidTile(this.x-1, this.y)) this.x = this.selectedPiece.x -1;
				else if (inputHandler.rightPress && this.grid.isValidTile(this.x+1, this.y)) this.x = this.selectedPiece.x +1;
			}
		}
	}
	
	isCharActionUnselectable(i) {
		return i == ACTION_MOVE && this.selectedPiece.moved || i == ACTION_ATTACK && this.selectedPiece.attacked || i == ACTION_BUILD && this.selectedPiece.built;
	}
	
	handleInputCharAction() {
		if (!this.selectedPiece) {
			console.error("Something's gone wrong.");
		}
		
		if (inputHandler.upPress) {
			this.charActionIndex --;
			sfx.sUp.play();
		} else if (inputHandler.downPress) {
			this.charActionIndex ++;
			sfx.sDown.play();
		}
		
		if (this.charActionIndex < 0) {
			this.charActionIndex = ACTION_NUM-1;
		}
		
		if (inputHandler.zPress) {
			
			if (this.isCharActionUnselectable(this.charActionIndex)) {
				sfx.incorrect.play();
				return;
			}
			
			sfx.selected.play();
			
			switch (this.charActionIndex % ACTION_NUM) {
				case ACTION_ATTACK:
					this.movementType = RESTRICTED;
					this.usingCharActionMenu = false;
					this.mode = ATTACK_MODE;
					this.charActionIndex = 0;
					break;
					
				case ACTION_MOVE:
					this.movementType = FREE;
					this.usingCharActionMenu = false;
					this.charActionIndex = 0;
					this.mode = NORMAL_MODE;
					break;
					
				case ACTION_NEVERMIND:
					this.charActionIndex = 0;
					this.usingCharActionMenu = false;
					this.movementType = FREE;
					this.selectedPiece = null;
					this.mode = NORMAL_MODE;
					break;
					
				case ACTION_END_TURN:
					this.charActionIndex = 0;
					this.usingCharActionMenu = false;
					this.movementType = FREE;
					this.mode = NORMAL_MODE;
					this.selectedPiece = null;
					endTurnTrigger = true;
					break;
					
				case ACTION_BUILD:
					this.charActionIndex = 0;
					this.usingCharActionMenu = false;
					this.mode = BUILD_MODE;
					this.movementType = RESTRICTED;
					break;
			}
		}
	}
	
	handleInputAction() {
		
		if (inputHandler.gPress) {
			drawGridlines = !drawGridlines;
		}
		
		if (this.usingCharActionMenu) {
			this.handleInputCharAction();
			return;
		}
		
		if (inputHandler.zPress) {
			
			if (this.selectedPiece) {
				
				if (this.movementType == RESTRICTED) {
					if (this.mode == ATTACK_MODE) {
						let attackPiece = this.grid.tileGetPiece(this.x, this.y);
						let tile  = this.grid.getTile(this.x, this.y);
						
						if (attackPiece) {
							if (attackPiece.team != this.selectedPiece.team) {
								this.selectedPiece.performAttack(this.grid.tileGetPiece(this.x, this.y));
								this.selectedPiece.attacked = true;
							} else {
								sfx.incorrect.play();
							}
						} else if (tile == 4) {
							this.selectedPiece.blocks ++;
							this.selectedPiece.attacked = true;
							this.grid.setTile(this.x, this.y, 0);
							sfx.unitDestroyed.play();
							explosionBuffer.push(new Explosion(this.grid, this.x, this.y));
						} else sfx.incorrect.play();
						
						
						this.selectedPiece = null;
						this.movementType = FREE;
					} else if (this.mode == BUILD_MODE) {
						let tile  = this.grid.getTile(this.x, this.y);
						
						if (tile != -1 && this.selectedPiece.blocks > 0) {
							this.selectedPiece.blocks --;
							this.selectedPiece.attacked = true;
							this.grid.setTile(this.x, this.y, 8);
							sfx.unitDestroyedAwesome.play();
							explosionBuffer.push(new Explosion(this.grid, this.x, this.y));
						}else sfx.incorrect.play();
						
						
						this.selectedPiece = null;
						this.movementType = FREE;
					}
					return;
				}
				
				if (this.x == this.selectedPiece.x && this.y == this.selectedPiece.y) { // Deselect piece
					this.selectedPiece = null;
					this.movementType  = FREE;
					this.usingCharActionMenu = false;
				}
				
				if (this.selectedPiece) {
					if (this.selectedPiece.enabled) {
						return; // Don't change selection if piece is moving
					}
				} else return;
				
				
				if (this.x == this.selectedPiece.x && this.y == this.selectedPiece.y) { // Deselect piece
					this.selectedPiece = null;
					this.movementType  = FREE;
					this.usingCharActionMenu = false;
				} else {
					if (this.grid.isEmptyTile(this.x, this.y)) {
						this.selectedPiece.setTargetTile(this);
						this.movementType = LOCKED;
					} else {
						console.log("Tile is not empty.");
					}
				}
			} else {
				let piece = this.grid.tileGetPiece(this.x, this.y);
				
				if (piece) {
					console.log(piece);
					if (piece.team != PENMAN) return;
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
			/*if(this.grid.map[this.y][this.x] == 3) {
				this.grid.map[this.y][this.x] = 0;
			} else {
				this.grid.map[this.y][this.x] = 3;
			}*/
		}
	}



	update() {
		
		//let attackIsHappening = false;
		
		if (isPlayingGunshots()) return;
		
		
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
		
		for (let i = 0; i < width/TILE_SIZE; i ++) {
			image(tiles[100], originX + i * TILE_SIZE, originY, TILE_SIZE, TILE_SIZE);
		}
		
		for (let i = 0; i < width/TILE_SIZE; i ++) {
			image(tiles[100], originX + i * TILE_SIZE, originY + height, TILE_SIZE, TILE_SIZE);
		}
		
		for (let i = 0; i < height/TILE_SIZE; i ++) {
			image(tiles[100], originX, originY + i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
		}
		
		for(let i = 0; i < height/TILE_SIZE + 1; i ++) {
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
		rect(winX, winY, TILE_SIZE * 4, TILE_SIZE * 3);
		rectMode(CENTER);
		
		let menuText = [];
		
		menuText[ACTION_NEVERMIND]    = "NEVERMIND";
		menuText[ACTION_MOVE]      = "MOVE";
		menuText[ACTION_ATTACK] = "ATTACK";
		menuText[ACTION_END_TURN]  = "END_TURN";
		menuText[ACTION_BUILD] = "BUILD(" + this.selectedPiece.blocks +")";
		
		textSize(20);
		textAlign("left");
		
		
		for (let i = 0; i < menuText.length; i ++) {
			fill((i%4)/3 * 255, (i%2) * 255, (i%3)/2 * 255);
			
			let displayText = menuText[i];
			if (this.charActionIndex%ACTION_NUM == i) displayText = "<" + displayText; // Earthbound font has < and > flipped.
			
			if (this.isCharActionUnselectable(i)) fill(150, 150, 150);
			
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