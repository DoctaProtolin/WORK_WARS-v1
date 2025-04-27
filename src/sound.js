

class Sound {
	constructor(source, volume) {
		this.el = document.createElement("audio");
		this.el.style.visibility = "hidden";
		this.el.style.width = "0";
		this.el.style.height = "0";
		
		this.el.src = source;
		this.el.preload = true;
		this.el.autoplay = false;
		this.el.volume = volume;
		document.body.appendChild(this.el);
	}
	
	play() {
		this.el.play();
	}
	
	
}