


// Doing a proper state machine for this guy.

const FIND_CLOSEST = "find-closest";
const ACTION_CLOSEST = "action-closest";
const ACTION_SECONDARY = "action-secondary";


class ComputerCursor {
	constructor(grid, x, y) {
		let c = new Cursor(); // For stealing
		
		this.grid = grid;
		this.x = x;
		this.y = y;
		
		this.drawCharActionMenu = c.drawCharActionMenu;
		this.draw = c.draw;
		
		this.enabled = true;
		this.state = FIND_CLOSEST;
		
		this.pAttack = null;
		this.bAttack = null;
	}
	
	update() {
		switch (this.state) {
			
			case FIND_CLOSEST:
				let penmen = this.grid.getPenmen();
				let blockmen = this.grid.getBlockmen();
				
				this.pAttack = null;
				this.bAttack = null;
				
				let maxDist = Infinity;
				
				for (let pen of penmen) {
					for (let block of blockmen) {
						let newDist = dist(pen.x, pen.y, block.x, block.y);
						
						if (newDist < maxDist && !block.moved) {
							maxDist = newDist;
							this.pAttack = pen;
							this.bAttack = block;
						}
					}
				}
				console.log("Computercursor: found closest");
				
				if (this.bAttack) {
					this.x = this.pAttack.x;
					this.y = this.pAttack.y;
					this.bAttack.setTargetTile(this); // takes in cursor coords as arguments
					this.state = ACTION_CLOSEST;
				} else {
					
				}
				break;
				
			case ACTION_CLOSEST: // Wait for it to finish an action
				
				if (!this.bAttack.enable && this.bAttack.moved) {
					this.state = ACTION_SECONDARY;
				}
				break;
			
			case ACTION_SECONDARY:
				console.log(this.bAttack);
				this.bAttack.performAttack(this.pAttack);
				this.state = FIND_CLOSEST;
				break;
			
			
		}
	}
	
	
}