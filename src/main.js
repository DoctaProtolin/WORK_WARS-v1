

/*
	TODO LIST
	- Create cursor to select things ✓
	- Create object action commands
	- Create simple pathfinding
	- Create Animation class
	- Make both teams show up
	- Add turns
	
	- Add all sprites to game
	- Implement ground tiles
I will only implement the ground tiles and add a block for the player. Then I'll send you the game, then I'll add animations and test them with a guy.

*/

/*
	SPRITES TO ADD
	
	- grass          ✓
	- road           ✓
	- road turns     ✓
	- road cross     ✓
	- road T     
	- mountain       ✓
	- wood           ✓
	- river straight
	- river turn
*/


const LEFT  = 37;
const UP    = 38;
const DOWN  = 39;
const RIGHT = 40;
const Z_CODE = 90;
const X_CODE = 88;

const PRESS_TIME = 1;


let tiles = [];
let sprites = [];

let gridSam = new Grid();
let mainCursor = new Cursor(gridSam, 0, 0);

let inputHandler = {
	up:    false,
	down:  false,
	left:  false,
	right: false,
	
	z:     false,
	x:     false,
	
	upPress: PRESS_TIME,
	downPress: PRESS_TIME,
	leftPress: PRESS_TIME,
	rightPress: PRESS_TIME,
	zPress:     0,
	xPress:     0,
}


function preload() {
	
	tiles[0] = loadImage(assets.tiles.grass);
	tiles[1] = loadImage(assets.tiles.river);
	tiles[2] = loadImage(assets.tiles.mountain);
	tiles[3] = [loadImage(assets.tiles.road_straight), loadImage(assets.tiles.road_corner), loadImage(assets.tiles.road_cross)];
	
	sprites[0] = [loadImage(assets.sprites.builder_frame_1), loadImage(assets.sprites.builder_frame_2)];
	sprites[1] = [loadImage(assets.sprites.flat_frame_1), loadImage(assets.sprites.builder_frame_2)];

	// sprites[0] = loadImage(assets.sprites.builder_frame_1);
	
}

function setup() {
	rectMode(CENTER);
	imageMode(CENTER); // Set rotations
	angleMode(DEGREES);
	createCanvas(window.windowWidth, window.windowHeight);
}

function draw() {
	background(100);
	
	gridSam.update();
	gridSam.draw();
	
	mainCursor.update();
	mainCursor.draw();
	
	if(inputHandler.upPress > 0) inputHandler.upPress --;
	if(inputHandler.downPress > 0) inputHandler.downPress --;
	if(inputHandler.leftPress > 0) inputHandler.leftPress --;
	if(inputHandler.rightPress > 0) inputHandler.rightPress --;
	if(inputHandler.zPress > 0)     inputHandler.zPress --;
	if(inputHandler.xPress > 0)     inputHandler.xPress --;
	
	
}

function keyPressed() {
	switch (keyCode) {
		case 37: 
			inputHandler.left = true; 
			inputHandler.leftPress = PRESS_TIME;
			break;
		case 38:
			inputHandler.up   = true;
			inputHandler.upPress = PRESS_TIME;
			break;
		case 39:
			inputHandler.right= true;
			inputHandler.rightPress = PRESS_TIME;
			
			break;
		case 40:
			inputHandler.down = true;
			inputHandler.downPress = PRESS_TIME;
			break;
			
		case Z_CODE:
			inputHandler.z = true;
			inputHandler.zPress = PRESS_TIME;
			break;
			
		case X_CODE:
			inputHandler.x = true;
			inputHandler.xPress = PRESS_TIME;
			
	}
}

function keyReleased() {
	switch (keyCode) {
		case 37: inputHandler.left = false; break;
		case 38: inputHandler.up   = false; break;
		case 39: inputHandler.right= false; break;
		case 40: inputHandler.down = false; break;
		case Z_CODE: inputHandler.z = false; break;
	}
}