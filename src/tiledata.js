

/*
	TILE RULES
	
	Every tile has an unchangable ID. This is a game jam, I don't have time for fanciness.
	
	0 - grass
		movement cost: 1
		defense:  0
	1 - river
		movement cost: 2
		defense: 0
	2 - mountain
		movement cost: 3
		defense: 3
	3 - road
		movement cost: 0
		defense: 0
	4 - wood
		movement cost: 2
		defense: 2
	5 - town
		movement cost: 1
		defense: 3
	6 - levelSwitch
		movement cost: 1
		defense: 0
	7 - factory
		movement cost: 1
		defense: 0
	
	100 - border
*/

function getTileData(index) {
	let name;
	let mCost;
	let defense;
	
	switch (index) {
		case 0:
			name = "GRASS";
			mCost = 1;
			defense = 0;
			break;
		
		case 1:
			name = "RIVER";
			mCost = 2;
			defense = 0;
			break;
		
		case 2:
			name = "MOUNTAIN";
			mCost = 3;
			defense = 3;
			break;
		
		case 3:
			name = "ROAD";
			mCost = 1;
			defense = 0;
			break;
			
		case 4:
			name = "WOOD";
			mCost = 2;
			defense = 2;
			break;
			
		case 5:
			name = "TOWN";
			mCost = 1;
			defense = 3;
			break;
		
		case 6:
			name = "LEVEL_SWITCH";
			mCost = 1;
			defense = 0;
			break;
			
		case 7:
			name = "FACTORY";
			mCost = 1;
			defense = 1;
			break;
		
		default:
			throw new Error("Unidentified tile index " + index);
			break;
	}
	
	return {
		name: name,
		mCost: mCost,
		defense: defense,
	}
}

function generateRoadTile(up, right, down, left) {
	let code = up * 8 + right * 4 + down * 2 + left;
	
	let angle = 0;
	let type = 0;
	
	const STRAIGHT = 0;
	const CORNER   = 1; // should be 1
	const CROSS    = 2;
	const T        = 3;
	
	switch (code) {
		case 0: break;
		case 1:
			angle = 90;
			type  = STRAIGHT;
			break;
			
		case 2:
			angle = 0;
			type  = STRAIGHT;
			break;
			
		case 3: // 0011
			angle = 0;
			type  = CORNER;
			break;
		
		case 4: // 0100
			angle = 90;
			type  = STRAIGHT;
			break;
			
		case 5: // 0101
			angle = 90;
			type = STRAIGHT;
			break;
			
		case 6: // 0110
			angle = 270;
			type  = CORNER;
			break;
		
		case 7: // 0111
			angle = 0;
			type  = T;
			break;
		
		case 8: // 1000
			angle = 0;
			type = STRAIGHT;
			break;
		
		case 9: // 1001
			angle = 90;
			type = CORNER;
			break;
			
		case 10: // 1010
			angle = 0;
			type = STRAIGHT;
			break;
			
		case 11: // 1011
			angle = 90;
			type = T;
			break;
		
		case 12: // 1100
			angle = 180;
			type  = CORNER;
			break;
			
		case 13: // 1101
			angle = 180;
			type = T;
			break;
		
		case 14: // 1110
			angle = 270;
			type  = T;
			break;
			
		case 15:
			angle = 0;
			type  = CROSS;
			break;
		
	}
	
	return {
		angle: angle,
		tile: type,
	};
}



// end