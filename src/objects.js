

const BLOCKMAN = "blockman";
const PENMAN = "penman";

/*
	0 - blockman
		0 - normal
		1 - up
	1 - penman
	
*/

class Trooper {
	constructor(grid, x, y, team) {
		
		if (team != BLOCKMAN && team != PENMAN) {
			throw new Error("Assign a team, moron.");
		}
		
		this.x = x;
		this.y = y;
		this.team = team;
		
		this.grid = grid;
	}
	
	update() {
		let x = this.grid.getScreenX(this.x);
	}
	
	draw() {
		if (this.team == BLOCKMAN) {
			image(sprites[0][0], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		} else {
			image(sprites[1][0], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		}
	}
}