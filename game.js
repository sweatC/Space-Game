(function() {
	
	var Game = function(canvasId) {
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');

		var gameSize = {
			x : canvas.width,
			y : canvas.height
		};
		// all objects
		this.objects = [new Player(this, gameSize)];
		
		var self = this;

		var tick = function() {
			//this.prototype.update();
			//this.prototype.draw(screen, gameSize);
			self.update();
			self.draw(screen, gameSize);
			requestAnimationFrame(tick);
		}
		tick();
		//tick.call(Game, screen, gameSize);
		//tick.apply(Game, [screen, gameSize]);
	}

	Game.prototype = {
		
		 update : function() {
			for (var i = 0; i < this.objects.length; i++) {
				this.objects[i].update();
			}
		},

		draw : function(screen, gameSize) {
			clearCanvas(screen, gameSize);
			for (var i = 0; i < this.objects.length; i++) {
				drawRect(screen, this.objects[i]);
			}
		} 
	}


	var Player = function(game, gameSize) {
		this.game = game;

		this.size = {
			width: 16,
			height : 16
		};

		this.position = {
			x : gameSize.x/2 - this.size.width/2,
			y : gameSize.y/2 - this.size.height/2
		};

		this.keyboader = new Keyboarder();
	}

	Player.prototype = {
		update : function() {
			if(this.keyboader.isDown(this.keyboader.KEYS.LEFT))
				this.position.x -= 2;
			if(this.keyboader.isDown(this.keyboader.KEYS.RIGHT))
				this.position.x += 2;
		}
	}

	var Keyboarder = function() {
		var keyState = {};

		window.onkeydown = function(e) {
			keyState[e.keyCode] = true;
		}
		window.onkeyup = function(e) {
			keyState[e.keyCode] = false;
		}

		this.isDown = function(keyCode) {
			return keyState[keyCode] === true;
		}

		this.KEYS = {
			LEFT : 37,
			RIGHT : 39,
			SPACE : 32
		}
	}
	
	var drawRect = function(screen, object) {
		screen.fillRect(object.position.x, object.position.y, object.size.width, object.size.height);
	}

	var clearCanvas = function(screen, gameSize) {
		screen.clearRect(0, 0, gameSize.x, gameSize.y);
	}

	window.onload = function() {
		new Game('screen');
	}

})();