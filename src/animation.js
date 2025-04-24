

/*
	This class is designed to make in-engine animations a snap by specifying frame objects with durations.
 Underscores are used for variables that should only be used in this class and not by a user, though frame._killedSelf is an exception. This is because the user might want to declare variables and attatch them to the frame.
*/

class Animation {
	constructor() {
		this.frame= -1;
		this.frames= [];
	}

	addFrame(action, onStart, d) {

		/*if(type == "s" || type == "second") {
			type= "millis";
			trigger *= 1000;
		}*/
		
		let frame= {};
		frame._duration= d;
		frame._draw= action;
		frame._onStart= onStart;

		this.frames.push(frame);
	}
	
	transition() {
		this.frame ++;
		let frame= this.frames[this.frame];

		if(typeof frame._onStart == "function") frame._started= false;
		else frame._started= true;

		if(typeof frame._duration == "number") {
			frame._start= millis();
		} else {
			frame._killedSelf= false;
		}

		console.log("Next frame set");
	}

	play() {
		// The animation object doesn't draw, it updates pre-existing objects

		if(this.frame < 0) {
			// If a transition is not declared before the frame, the frame is not properly prepared.
			this.transition();
			return;
		}

		
		let frame= this.frames[this.frame];

		if(!frame._started) {
			frame._onStart(frame);
			frame._started= true;
		}
		
		frame._draw(frame);

		let frameIsMillis= typeof frame._duration == "number";
		let endOfLife= millis() - frame._start >= frame._duration;
		
		if((frameIsMillis && endOfLife) || frame._killedSelf) this.transition();

		// console.log(millis() - frame._start);
	}
}

