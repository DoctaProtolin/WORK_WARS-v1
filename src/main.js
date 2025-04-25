

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


const LEFT   = 37;
const UP     = 38;
const DOWN   = 39;
const RIGHT  = 40;
const Z_CODE = 90;
const X_CODE = 88;
const G_CODE = 71;

const PRESS_TIME = 1;


let tiles = [];
let sprites = [];

let heartImage, bootImage;
let earthboundFont;

let gridSam = new Grid();
let playerCursor = new Cursor(gridSam, 0, 0, true);
let computerCursor = new ComputerCursor(gridSam, 0, 0, false);

let isPlayerTurn = true;

let endTurnTrigger = false;

let turns = 1;

let inputHandler = {
	up:    false,
	down:  false,
	left:  false,
	right: false,
	
	z:     false,
	x:     false,
	
	upPress:    PRESS_TIME,
	downPress:  PRESS_TIME,
	leftPress:  PRESS_TIME,
	rightPress: PRESS_TIME,
	zPress:     0,
	xPress:     0,
	gPress:     0,
}


function preload() {
	
	tiles[0] = loadImage(assets.tiles.grass);
	tiles[1] = loadImage(assets.tiles.river);
	tiles[2] = loadImage(assets.tiles.mountain);
	tiles[3] = [loadImage(assets.tiles.road_straight), loadImage(assets.tiles.road_corner), loadImage(assets.tiles.road_cross), loadImage(assets.tiles.road_t)];
	tiles[4] = loadImage(assets.tiles.wood);
	
	
	tiles[100] = loadImage(assets.tiles.border);
	
	earthboundFont = loadFont(assets.font.earthbound);
	
	sprites[0] = [loadImage(assets.sprites.blockman_frame_1), loadImage(assets.sprites.blockman_frame_2)];
	sprites[1] = [loadImage(assets.sprites.penman_frame_1),   loadImage(assets.sprites.penman_frame_2)];
	
	heartImage = loadImage(assets.ui.heart);
	bootImage  = loadImage(assets.ui.boot);

	// sprites[0] = loadImage(assets.sprites.builder_frame_1);
	
}

function setup() {
	rectMode(CENTER);
	imageMode(CENTER); // Set rotations
	angleMode(DEGREES);
	
	textFont(earthboundFont);
	createCanvas(window.windowWidth, window.windowHeight);
}

function draw() {
	background(100);
	
	gridSam.update();
	gridSam.draw();
	
	if (isPlayerTurn) {
		playerCursor.update();
		playerCursor.draw();
	} else {
		computerCursor.update();
		computerCursor.draw();
	}
	
	if (endTurnTrigger) {
		endTurnTrigger = false;
		isPlayerTurn = !isPlayerTurn;
		
		
		playerCursor = new Cursor(gridSam, playerCursor.x, playerCursor.y, true);
			console.log("reset player cursor");
		computerCursor = new ComputerCursor(gridSam, computerCursor.x, computerCursor.y);
		
		for (let blockman of gridSam.getBlockmen()) {
			blockman.moved = false;
		}
		
		for (let penman of gridSam.getPenmen()) {
			penman.moved = false;
		}
		
		turns ++;
	}
	
	if (inputHandler.upPress > 0)    inputHandler.upPress --;
	if (inputHandler.downPress > 0)  inputHandler.downPress --;
	if (inputHandler.leftPress > 0)  inputHandler.leftPress --;
	if (inputHandler.rightPress > 0) inputHandler.rightPress --;
	if (inputHandler.zPress > 0)     inputHandler.zPress --;
	if (inputHandler.xPress > 0)     inputHandler.xPress --;
	if (inputHandler.gPress > 0)     inputHandler.gPress --;
	
	textSize(100);
	fill(255);
	text("Words", 100, 100);
	
	
	image(heartImage, 800, 100, TILE_SIZE, TILE_SIZE);
	
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
			break;
		
		case G_CODE:
			inputHandler.g = true;
			inputHandler.gPress = PRESS_TIME;
			break;
			
	}
}

function keyReleased() {
	switch (keyCode) {
		case 37: inputHandler.left = false; break;
		case 38: inputHandler.up   = false; break;
		case 39: inputHandler.right= false; break;
		case 40: inputHandler.down = false; break;
		case Z_CODE: inputHandler.z = false; break;
		case X_CODE: inputHandler.x = false; break;
		case G_CODE: inputHandler.g = false; break;
	}
}


function linInterpolate (startX, startY, endX, endY, t) {
	let displacementX = (endX - startX) * t;
	let displacementY = (endY - startY) * t;
	
	return {
		dispX: displacementX,
		dispY: displacementY,
	}
}