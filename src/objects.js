

const BLOCKMAN = "blockman";
const PENMAN = "penman";

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
		
		this.mCost = 10;
		
		this.moved = false;
		this.enable = false;
		
		this.goalTile = {
			x: 0,
			y: 0,
		}
		
		this.steps = [];
		this.movementIndex = 0;
		this.tStep = 0;
	}
	
	setTargetTile() {
		
		if (this.moved) {
			console.error("Cannot move/piece has already been moved");
			return;
		}
		
		this.steps = this.grid.generatePathEnd(this, mainCursor.x, mainCursor.y).steps;
		console.log(this.steps);
		this.movementIndex = 0;
		this.tStep = 0;
		
		this.enable = true;
		this.moved = false;
	}
	
	update() {
		
		
		
	}
	
	draw() {
		
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
			
			this.tStep += 0.05;
			
			if (this.tStep >= 1) {
				this.x = this.steps[this.movementIndex].goalX;
				this.y = this.steps[this.movementIndex].goalY;
				
				this.movementIndex ++;
				this.tStep = 0;
			}
		}
		
		if (this.team == BLOCKMAN) {
			image(sprites[0][0], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		} else {
			image(sprites[1][0], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		}
	}
}