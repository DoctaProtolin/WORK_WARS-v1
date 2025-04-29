

let globalVolume = 0.1;

const SECTION_INTRO = "SECTION_INTRO";
const SECTION_LOOP  = "SECTION_LOOP";
const SECTION_OUTRO = "SECTION_OUTRO";

class Sound {
	constructor(source, loopPoint) {
		
		if (typeof loopPoint != "number") throw new Error("loopPoint must be a number. Recieved: " + loopPoint);
		
		this.el = document.createElement("audio");
		this.el.style.visibility = "hidden";
		this.el.style.width = "0";
		this.el.style.height = "0";
		
		this.el.src = source;
		this.el.preload = "auto";
		this.el.autoplay = false;
		this.el.volume = globalVolume;
		
		/*this.loopEl = document.createElement("audio");
		this.loopEl.style.visibility = "hidden";
		this.loopEl.style.width = "0";
		this.loopEl.style.height = "0";
		
		this.loopEl.src = loop;
		this.loopEl.preload = "auto";
		this.loopEl.autoplay = false;
		this.loopEl.volume = globalVolume;
		this.loopEl.loop = true;*/
		
		this.section = SECTION_INTRO;
		this.loopPoint = loopPoint;
		this.setVolume(1);
		this.el.pause();
		
		//document.body.appendChild(this.el);
		document.body.appendChild(this.el);
	}
	
	getDuration() {
		return this.el.duration;
	}
	
	getTime() { return this.el.currentTime; }
	setTime(t) { this.el.currentTime = t; }

	getVolume() { return this.el.volume; }
	setVolume(v) { this.el.volume = v; }
	
	isPlaying() {
		return !this.el.paused && this.el.currentTime > 0;
	}
	
	play() { this.el.currentTime = 0; this.el.play(); }
	pause() { this.el.pause(); }
	continueFromPause() { this.el.play() };
	
	loop() {
		if (this.el.currentTime >= this.el.duration - 0.09) {
			this.el.currentTime = this.loopPoint;
		}
	}
}