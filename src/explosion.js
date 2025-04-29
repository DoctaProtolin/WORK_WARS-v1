

class Explosion {
	constructor(grid, x, y) {
		this.grid = grid;
		this.x = x;
		this.y = y;
		this.frame = 0;
		this.animTimer = 0;
	}
	
	draw() {
		if (this.animTimer > 1) {
			this.animTimer = 0;
			this.frame ++;
		}
		this.animTimer ++;
		
		if (this.frame > 9) return;
		image(sprites[5][this.frame], this.grid.getScreenX(this.x), this.grid.getScreenY(this.y), TILE_SIZE, TILE_SIZE);
	}
}