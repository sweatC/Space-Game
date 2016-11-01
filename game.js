(function() {
	
	var Game = function(canvasId) {
		var canvas = document.getElementById(canvasId);
		var screen = canvas.getContext('2d');

		var gameSize = {
			x : canvas.width,
			y : canvas.height
		};

		// all objects
		this.objects = createInvaders(this).concat([new Player(this, gameSize)]);
		var self = this;

		var tick = function() {
			//this.prototype.update();
			//this.prototype.draw(screen, gameSize);
			self.update(gameSize);
			self.draw(screen, gameSize);
			requestAnimationFrame(tick);
		}
		tick();
		//tick.call(Game, screen, gameSize);
		//tick.apply(Game, [screen, gameSize]);
	}

	Game.prototype = {
		
		 update : function(gameSize) {
		 	console.log(this.objects.length);
		    for (var i = 0; i < this.objects.length; i++) {
				if(this.objects[i].position.y < 0) {
					this.objects.splice(i, 1);
				}
			}
			for (var i = 0; i < this.objects.length; i++) {
				this.objects[i].update();
			}
		},

		draw : function(screen, gameSize) {
			clearCanvas(screen, gameSize);
			for (var i = 0; i < this.objects.length; i++) {
				drawRect(screen, this.objects[i]);
			}
		},

		addObject : function(obj) {
			this.objects.push(obj);
		},
	}


	var Invader = function(game, position) {
		this.game = game;
		this.size = {width:16, height: 16};
		this.position  = position;
		this.patrolX = 0;
		this.speedX = 3;
	}

	Invader.prototype = {
		update : function() {
			if(this.patrolX < 0 || this.patrolX > 530) {
				this.speedX = -(this.speedX);
			}

			this.position.x += this.speedX;
			this.patrolX += this.speedX;
		}
	}
	var Player = function(game, gameSize) {
		this.game = game;
		this.bullets = 0;
		this.timer = 0;
		this.size = {
			width: 16,
			height : 16
		};
		this.gameSize = gameSize;

		this.position = {
			x : gameSize.x/2 - this.size.width/2,
			y : gameSize.y/2 - this.size.height/2
		};
		this.keyboader = new Keyboarder();
	}

	Player.prototype = {
		update : function() {
			if(this.keyboader.isDown(this.keyboader.KEYS.LEFT)){
				if(this.inTarget(this, this.gameSize) || (this.position.x + this.size.width) >= this.gameSize.x)
					this.position.x -= 2;
				
				this.position.x -= 0;
				
			}
			if(this.keyboader.isDown(this.keyboader.KEYS.RIGHT)){
				if(this.inTarget(this, this.gameSize) || this.position.x <= 0)
					this.position.x += 2;
				
				this.position.x += 0;
				
			}
			if(this.keyboader.isDown(this.keyboader.KEYS.SPACE)) {
				if(this.bullets < 3) {
					var bullet = new Bullet({x : this.position.x + this.size.width/2 - 3/2, y: this.position.y}, 
						{x: 0, y: -6});
					this.game.addObject(bullet);
					this.bullets++;
				}
			}
			this.timer++;
			if(this.timer % 12 == 0)
				this.bullets = 0;
		},

	    inTarget : function(player, gameSize) {
			if((player.position.x + player.size.width) >= gameSize.x)
				return false;
			
			else if(player.position.x <= 0) return false;
			
			else return true;
		}
	}

	var Bullet = function(position, velocity) {

		this.size = {
			width: 3,
			height : 3
		};

		this.position = position;
		this.velocity = velocity;
	}

	Bullet.prototype = {
		update : function() {
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y; 
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

	var inTarget = function(obj, gameSize) {
		if(obj.position.x < gameSize.x) {
			obj.position.x += 2;
		}
		else if(obj.position.x > gameSize.x) {
			obj.position.x -= 2;
		}
	}
	var createInvaders = function(game){
		var invaders = [];
		for (var i = 0; i < 24; i++) {
			var x = 30 + (i%8) * 30;
			var y = 30 + (i%3) * 30;
			invaders.push(new Invader(game, {x: x, y: y}));
		}
		return invaders;
	}

	window.onload = function() {
		new Game('screen');
	}

})();