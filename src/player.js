

const WHITE = "white";
const YELLOW = "yellow";

/*
	0 - builder
	1 - flat-caps
	
*/

class Trooper {
	constructor(grid, x, y) {
		this.x = x;
		this.y = y;
		this.team = YELLOW;
		
		this.grid = grid;
	}
	
	update() {
		let x = this.grid.getScreenX(x);
	}
	
	draw() {
		if (this.team == YELLOW) {
			fill(200, 200, 0);
		} else {
			fill(0, 0, 100);
		}
		
		// rect(this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		
		if (this.team == YELLOW) {
			image(sprites[0][0], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
		}
	}
}