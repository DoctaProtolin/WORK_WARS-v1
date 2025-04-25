

const BLOCKMAN = "blockman";
const PENMAN = "penman";
const NOTEAM = "no-team";

const ANIM_IDLE = 0;

/*
	TILES
	0 - blockman
		0 - normal
		1 - up
	1 - penman
	
	
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
		this.mCost = 10;

		this.maxHealth = 10;
		this.attack = 3;
		this.health = this.maxHealth;
		
		// State variables
		this.moved  = false;
		this.enable = false;
		
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
	
	performAttack(enemy) {
		
		if (!this.grid.isAttackTile(enemy.x, enemy.y, this.x, this.y)) return;
		
		let enemyTileData = getTileData(this.grid.getTile(enemy.x, enemy.y));
		let tileData = getTileData(this.grid.getTile(this.x, this.y));
		
		let enemyDef = enemyTileData.defense;
		let def      = tileData.defense;
		
		
		this.health  -= enemy.attack - this.health*def/10;
		enemy.health -= this.attack - enemyDef/10;
		
		this.health  = min(this.health, this.maxHealth); // Learned this from reading Hysteria's code
		enemy.health = min(enemy.health, enemy.maxHealth);
	}
	
	update() {
		
		
	}
	
	draw() {
		
		let displayX = this.grid.getScreenX(this.x);
		let displayY = this.grid.getScreenY(this.y);
		
		if (this.enable) {
			
			if (this.movementIndex >= this.steps.length) {
				this.enable = false;
				return;
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
		}
		
		this.animTimer --;
		
		if(this.animTimer < 0) {
			this.animData.idleSprite = !this.animData.idleSprite;	
			this.animTimer  = 60;
		}
		
		let displaySprite;
		
		
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