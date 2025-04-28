

const SCREEN_GAME = "SCREEN_GAME";
const SCREEN_LOSE = "SCREEN_LOSE";

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

function gameScreen() {
	background(100);
	
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
		}
		
		turns ++;
	}
	
	soundtrack.title.loop();
	
	if (gridCommon.playerHasWon() == BLOCKMAN) {
		screen = SCREEN_LOSE;
		if (!soundtrack.lose.isPlaying()) soundtrack.lose.play();
	}
	
	
	image(heartImage, 800, 100, TILE_SIZE, TILE_SIZE);
}

function loseScreen() {
	textAlign(CENTER);
	text("WELP!", width/2, height/2);
}