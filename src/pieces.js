

const BLOCKMAN = "blockman";
const PENMAN = "penman";
const NOTEAM = "no-team";

const ANIM_IDLE = 0;

/*
	SPRITES
	0 - blockman
		0 - normal
		1 - up
	1 - penman
	
	2 - penman forklifts
	
	3 - botmen
	
	
	STATS
	0 - blockman
		mCost - 3
*/

class Trooper {
	constructor(grid, x, y, team) {
		
		if (team != BLOCKMAN && team != PENMAN) {
			throw new Error("Assign a team, moron!");
		}
		
		this.x = x;
		this.y = y;
		this.team = team;
		
		this.grid = grid;
		
		// Game variables
		this.movementDist = 4;

		this.maxHealth = 10;
		this.attack = 3;
		this.health = this.maxHealth;
		this.blocks = 0;
		
		// State variables
		this.moved    = false;
		this.enable   = false;
		this.attacked = false;
		
		this.goalTile = {
			x: 0,
			y: 0,
		}
		
		this.animTimer = 0;
		
		this.animData = {
			idleSprite: true, // easier to manipulate
		}
		
		this.steps = [];
		this.movementIndex = 0;
		this.tStep = 0;
		
		this.animation = ANIM_IDLE;
	}
	
	resetOnTurn() {
		this.moved    = false;
		this.enable   = false;
		this.attacked = false;
		this.built    = false;
	}
	
	setTargetTile(cursor) {
		
		if (this.moved) return;
		
		if (this.moved) {
			console.error("Cannot move/piece has already been moved");
			return;
		}
		
		this.steps = this.grid.generatePathEnd(this, cursor.x, cursor.y).steps;
		console.log(this.steps);
		this.movementIndex = 0;
		this.tStep = 0;
		
		this.enable = true;
		this.moved  = true;
	}
	
	playAttackSound() {
		let gHammerIndex = floor(random(0, 4));
		sfx.gHammer[gHammerIndex].play();
	}
	
	performAttack(enemy) {
		
		if (!this.grid.isAttackTile(enemy.x, enemy.y, this.x, this.y)) return;
		
		let enemyTileData = getTileData(this.grid.getTile(enemy.x, enemy.y));
		let tileData = getTileData(this.grid.getTile(this.x, this.y));
		
		let enemyDef = enemyTileData.defense;
		let def      = tileData.defense;
		
		let healthScalar = 10; // I don't exactly know what this is.
		
		enemy.health -= (this.health/this.maxHealth) * this.attack * (healthScalar-enemyDef)/healthScalar;
		console.log("Performed attack");
		
		this.playAttackSound();
		
		if (enemy.health == 0 && isPlayerTurn) {
			return;
		}
		
		this.health  -= (enemy.health/enemy.maxHealth) * enemy.attack * (healthScalar-def)/healthScalar;
		
		enemy.health = floor(enemy.health);
		this.health  = floor(this.health);
		
	}
	
	move() {
		let displayX = this.grid.getScreenX(this.x);
		let displayY = this.grid.getScreenY(this.y);
		
		if (this.enable) {
			
			if (this.movementIndex >= this.steps.length) {
				this.enable = false;
				
				
				if (this.grid.getTile(this.x, this.y) == 6 && this.constructor.name != 'Forklift') {
					for (let blockman of this.grid.getBlockmen()) {
						blockman.health = 0;
					}
				} else {
					playerCursor.usingCharActionMenu = true;
				}
				
				return {
					displayX: displayX,
					displayY: displayY,
				}
			}
			
			let x = this.grid.getScreenX(this.x);
			let y = this.grid.getScreenY(this.y);
			
			let endX = this.grid.getScreenX(this.steps[this.movementIndex].goalX);
			let endY = this.grid.getScreenY(this.steps[this.movementIndex].goalY);
			
			let disp = linInterpolate(x, y, endX, endY, this.tStep);
			
			this.tStep += 0.2;
			
			let framerateControl = 8;
			
			displayX += Math.trunc(disp.dispX/framerateControl) * framerateControl;
			displayY += Math.trunc(disp.dispY/framerateControl) * framerateControl;
			
			if (this.tStep >= 1) {
				this.x = this.steps[this.movementIndex].goalX;
				this.y = this.steps[this.movementIndex].goalY;
				
				this.movementIndex ++;
				this.tStep = 0;
			}
			
			if (!sfx.hWalkFast.isPlaying()) sfx.hWalkFast.play();
			else sfx.hWalkFast.loop();	 
		} else {
			//sfx.rWalkFast.pause();
		}
		
		return {
			displayX: displayX,
			displayY: displayY,
		}
	}
	
	update() {
		
	}
	

	draw() {
		
		this.move();
		
		this.animTimer --;
		
		if(this.animTimer < 0) {
			this.animData.idleSprite = !this.animData.idleSprite;	
			this.animTimer  = 60;
		}
		
		let displaySprite;
		
		let d = this.move();       // Not very elegant but we have one day left.
		let displayX = d.displayX;
		let displayY = d.displayY;
		
		
		if (this.team == BLOCKMAN) {
			displaySprite = sprites[0][this.animData.idleSprite?1:0];
		} else {
			displaySprite = sprites[1][this.animData.idleSprite?1:0];
		}
		
		image(displaySprite, displayX, displayY, TILE_SIZE, TILE_SIZE);
		
		textSize(20);
		fill(255, 50, 0);
		text(this.health, displayX + TILE_SIZE/2, displayY - TILE_SIZE/2);
	}
}










class Forklift extends Trooper {
	constructor(grid, x, y, team) {
		
		super(grid, x, y, team);
		
		// Game variables
		this.movementDist = 6;

		this.maxHealth = 15;
		this.health = this.maxHealth;
		this.attack = 5;
		this.blocks = 0;
		
		
		this.goalTile = {
			x: 0,
			y: 0,
		}
		
		this.animTimer = 0;
		
		this.animData = {
			idleSprite: true, // easier to manipulate
		}
	}
	
	draw() {
		this.move();
		
		this.animTimer --;
		
		if(this.animTimer < 0) {
			this.animData.idleSprite = !this.animData.idleSprite;	
			this.animTimer  = 60;
		}
		
		let displaySprite;
		
		let d = this.move();       // Not very elegant but we have one day left.
		let displayX = d.displayX;
		let displayY = d.displayY;
		
		if (this.team == BLOCKMAN) {
			displaySprite = sprites[0][this.animData.idleSprite?1:0];
		} else {
			displaySprite = sprites[2][this.animData.idleSprite?1:0];
		}
		
		image(displaySprite, displayX, displayY, TILE_SIZE, TILE_SIZE);
		
		textSize(20);
		fill(255, 50, 0);
		text(this.health, displayX + TILE_SIZE/2, displayY - TILE_SIZE/2);
	}
}