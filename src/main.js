

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



let screen = SCREEN_TITLE;

let tiles = [];
let sprites = [];

// Image vars
let heartImage, bootImage, zButtonImage, xButtonImage;
let earthboundFont;

let soundtrack = {};
let sfx        = {};

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
	tiles[1] = [loadImage(assets.tiles.river_straight), loadImage(assets.tiles.river_curve)];
	tiles[2] = loadImage(assets.tiles.mountain);
	tiles[3] = [loadImage(assets.tiles.road_straight), loadImage(assets.tiles.road_corner), loadImage(assets.tiles.road_cross), loadImage(assets.tiles.road_t)];
	tiles[4] = loadImage(assets.tiles.wood);
	tiles[5] = loadImage(assets.tiles.town);
	tiles[6] = loadImage(assets.tiles.levelSwitch);
	tiles[7] = loadImage(assets.tiles.factory);
	tiles[8] = loadImage(assets.tiles.brick);
	tiles[9] = [];
	
	
	tiles[100] = loadImage(assets.tiles.border);
	
	earthboundFont = loadFont(assets.font.earthbound);
	
	sprites[0] = [loadImage(assets.sprites.blockman_frame_1), loadImage(assets.sprites.blockman_frame_2)];
	sprites[1] = [loadImage(assets.sprites.penman_frame_1),   loadImage(assets.sprites.penman_frame_2), loadImage(assets.sprites.penman_walk_frame_1), loadImage(assets.sprites.penman_walk_frame_2)];
	sprites[2] = [loadImage(assets.sprites.penman_forklift_frame_1), loadImage(assets.sprites.penman_forklift_frame_2)];
	sprites[3] = [loadImage(assets.sprites.botman_frame_1), loadImage(assets.sprites.botman_frame_2)];
	sprites[4] = [];
	sprites[5] = [];
	
	for (let i = 0; i < 10; i ++) {
		sprites[5].push(loadImage(assets.sprites["explosion_frame_"+(i+1)]));
	}
	
	heartImage = loadImage(assets.ui.heart);
	bootImage  = loadImage(assets.ui.boot);
	titleImage = loadImage(assets.ui.title);
	
	zButtonImage = loadImage(assets.ui.z);
	xButtonImage = loadImage(assets.ui.x);
	
	

	// sprites[0] = loadImage(assets.sprites.builder_frame_1);
	
	soundtrack.title = new Sound("mus/Title.mp3", 16.274); // loop: 16.274
	soundtrack.lose  = new Sound("mus/Lose.mp3", 8.27);
	soundtrack.win   = new Sound("mus/Win.mp3", 7.094);
	
	for (let track of Object.values(soundtrack)) {
		track.setVolume(0.08);	
	}
	
	
	sfx.rWalkFast = new Sound("sfx/RWalkFast.wav", 0);
	sfx.hWalkFast = new Sound("sfx/HWalkFast.wav", 0);
	sfx.incorrect = new Sound("sfx/Incorrect.mp3", 0);
	sfx.sUp       = new Sound("sfx/SUp.wav", 0);
	sfx.sDown     = new Sound("sfx/SDown.wav", 0);
	sfx.selected  = new Sound("sfx/Selected.wav", 0);
	sfx.unitDestroyed = new Sound("sfx/UnitDestroyed.wav", 0);
	sfx.unitDestroyedAwesome = new Sound("sfx/UnitDestroyedAwesome.wav", 0);
	sfx.forkliftMoving = new Sound("sfx/ForkliftMoving.wav", 0);
	sfx.building  = new Sound("sfx/Building.wav", 0);
	
	
	sfx.gHammer   = [];
	
	for (let i = 0; i < 4; i ++) {
		sfx.gHammer.push(new Sound("./sfx/GHammer" + (i+1) + ".wav", 0));
	}
	
}

function setup() {
	
	let link = document.createElement("link");
	link.rel = "icon";
	link.href = assets.sprites.blockman_frame_1;
	document.head.appendChild(link);
	
	rectMode(CENTER);
	imageMode(CENTER); // Set rotations
	angleMode(DEGREES);
	textAlign("left");
	
	textFont(earthboundFont);
	createCanvas(window.windowWidth, window.windowHeight);
	
	
	
	TILE_SIZE = 30;
	
	for (let i in levels){
		let level = levels[i];
		let g = new Grid(level);
		g.loadMap(level);
		titleData.grids.push(g);
		
		g.x += 500 * i;
		g.y = height/2 - 50;
	}
	
	titleData.cursorXs = [ 
		titleData.grids[0].x + titleData.grids[0].dimX*TILE_SIZE/2,
		titleData.grids[1].x + titleData.grids[1].dimX*TILE_SIZE/2,
		titleData.grids[2].x + titleData.grids[2].dimX*TILE_SIZE/2,
	];
	
	let a = document.createElement("a");
	a.href = "./INSTRUCTIONS.txt";
	a.target = "_blank";
	a.click();
}

function draw() {
	
	
	if (!enableGame) {
		background(0, 0, 0);
		textSize(50);
		fill(255, 255, 255);
		text("CLICK TO START.", width/2, height/2);
		return;
	}
	
	// Yes I know about switch cases. Not today.
	if (screen == SCREEN_TITLE) {
		if (!soundtrack.title.isPlaying()) soundtrack.title.play();
		else soundtrack.title.loop();
		titleScreen();
	} else if (screen == SCREEN_GAME) {
		gameScreen();
	} else if (screen == SCREEN_LOSE) {
		loseScreen();
	} else if (screen == SCREEN_WIN) {
		winScreen();
	}
	
	if (inputHandler.upPress > 0)    inputHandler.upPress --;
	if (inputHandler.downPress > 0)  inputHandler.downPress --;
	if (inputHandler.leftPress > 0)  inputHandler.leftPress --;
	if (inputHandler.rightPress > 0) inputHandler.rightPress --;
	if (inputHandler.zPress > 0)     inputHandler.zPress --;
	if (inputHandler.xPress > 0)     inputHandler.xPress --;
	if (inputHandler.gPress > 0)     inputHandler.gPress --;
	
	
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

function isPlayingGunshots() {
	for (let gHammerSfx of sfx.gHammer) {
		if (gHammerSfx.getTime() < gHammerSfx.getDuration() && gHammerSfx.getTime() != 0) {
			return true;
		}
	}
	
	return false;
}

function mouseClicked() {
	if (!enableGame) {
		
		soundtrack.title.play();
		enableGame = true;
	}
}