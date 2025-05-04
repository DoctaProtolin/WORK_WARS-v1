

const SCREEN_GAME = "SCREEN_GAME";
const SCREEN_LOSE = "SCREEN_LOSE";
const SCREEN_WIN  = "SCREEN_WIN";
const SCREEN_TITLE = "SCREEN_TITLE";

function drawTileTest() {
	noSmooth();
	for(let i = 0; i < tiles.length; i ++) {
		image(tiles[i], 100 + i * 100, 100, 100, 100);
	}
}


let enableGame = false;
let isPlayerTurn = true;
let endTurnTrigger = false;
let turns = 1;

let gridCommon = new Grid();
let playerCursor = new Cursor(gridCommon, 0, 0, true);
let computerCursor = new ComputerCursor(gridCommon, 0, 0, false);

let explosionBuffer = [];

function gameScreen() {
	background(100);
	
	if (gridCommon.id == 2) {
		TILE_SIZE = 40;
	} else {
		TILE_SIZE = 50;
	}
	
	gridCommon.update();
	gridCommon.draw();
	
	if (screen == SCREEN_GAME) {
		if (isPlayerTurn) {
			playerCursor.update();
			playerCursor.draw();
		} else {
			computerCursor.update();
			computerCursor.draw();
		}
	}
	
	if (endTurnTrigger) {
		endTurnTrigger = false;
		isPlayerTurn = !isPlayerTurn;
		
		
		playerCursor = new Cursor(gridCommon, playerCursor.x, playerCursor.y, true);
		console.log("reset player cursor");
		computerCursor = new ComputerCursor(gridCommon, computerCursor.x, computerCursor.y);
		
		for (let blockman of gridCommon.getBlockmen()) {
			blockman.resetOnTurn();
		}
		
		for (let penman of gridCommon.getPenmen()) {
			penman.resetOnTurn();
			
			if (gridCommon.getTile(penman.x, penman.y) == 5) {
				penman.health ++;
			}
		}
		
		turns ++;
	}
	
	if (gridCommon.playerHasWon() == BLOCKMAN) {
		screen = SCREEN_LOSE;
		if (!soundtrack.lose.isPlaying()) soundtrack.lose.play();
	} else if (gridCommon.playerHasWon() == PENMAN) {
		screen = SCREEN_WIN;
		if (!soundtrack.win.isPlaying()) soundtrack.win.play();
	}
	
	for (let i in explosionBuffer) {
		let explosion = explosionBuffer[i];
		
		if (!explosion) continue;
		if (explosion.frame > 9) {
			explosionBuffer.splice(i, 1);
			continue;
		}
		explosion.draw();
	}
	
	
	// image(heartImage, 800, 100, TILE_SIZE, TILE_SIZE);
}

function winScreen() {
	soundtrack.win.loop();
	
	textAlign(CENTER);
	textSize(100);
	fill(0, 150, 0);
	text("NICE!", width/2 + 200, height/2);
	fill(0, 100, 200);
	textSize(30);
	text("Press Z to continue!", width/2+200, height/2 + 100);
	
	
	text("Turns: " + turns, width/2 + 200, height/2 + 150);
	fill(200, 0, 0);
	text("But can you do it faster?", width/2 + 200, height/2 + 200);
	
	if (inputHandler.zPress) {
		screen = SCREEN_TITLE;
		soundtrack.title.play();
		soundtrack.win.pause();
	}
}

function loseScreen() {
	textAlign(CENTER);
	textSize(100);
	fill(255, 0, 0);
	text("WELP!", width/2 + 200, height/2);
	fill(0, 0, 200);
	textSize(30);
	text("Press Z to continue...", width/2+200, height/2 + 100);
	
	soundtrack.lose.loop();
	if (inputHandler.zPress) {
		screen = SCREEN_TITLE;
		soundtrack.title.play();
		soundtrack.lose.pause();
	}
}

let titleData = {
	showGrids: false,
	grids: [],
	cursorIndex: 0,
	cursorXs: [],
}

function titleScreen() {
	TILE_SIZE = 30;
	background(0);
	
	push();
	translate(width/2, height/4);
	scale(4);	
	noSmooth();
	image(titleImage, 0, 0);
	pop();
	
	if (!titleData.showGrids) {
		push();
		translate(width/4, height/4 + 50);
		scale(4);
		noSmooth();
		image(zButtonImage, 0, 0);
		scale(0.25);
		fill(255, 255, 255);
		text("TO START", 0, 100);
		pop();
		
		push();
		translate(width * 3/4, height/4 + 50);
		scale(4);
		noSmooth();
		image(xButtonImage, 0, 0);
		scale(0.25);
		fill(255, 255, 255);
		text("TO INSTRUCT", 0, 100);
		pop();
	}
	
	// fill(255, 255, 255);
	// textAlign(CENTER);
	// text("Press X for instructions", width/2, 300);
	
	if (titleData.showGrids) {
		for (let grid of titleData.grids) grid.draw();
	}
	
	if (inputHandler.zPress) {
		if (!titleData.showGrids) {
			titleData.showGrids = true;
			sfx.selected.play();
		} else {
			screen = SCREEN_GAME;
			TILE_SIZE = 50;
			sfx.selected.play();
			soundtrack.title.pause();
			gridCommon.loadMap(levels[titleData.cursorIndex]);
			return;
		}
	}
	
	if (inputHandler.xPress) {
		location.href = "./INSTRUCTIONS.html";
	}
	
	if (titleData.showGrids) {
		if (inputHandler.leftPress) {
			titleData.cursorIndex --;
			sfx.sDown.play();
		} else if (inputHandler.rightPress) {
			titleData.cursorIndex ++;
			sfx.sUp.play();
		}
		
		if (titleData.cursorIndex < 0) titleData.cursorIndex = 2;
		else if (titleData.cursorIndex > 2) titleData.cursorIndex = 0;
		
		textSize(50);
		stroke(255, 255, 255);
		text("^", titleData.cursorXs[titleData.cursorIndex], height);
	}
	
	
	
	soundtrack.title.loop();
}