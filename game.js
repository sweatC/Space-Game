+function() {
	
	var Game = function(canvasId) {
		var canvas = document.getElementById( canvasId );
		var screen = canvas.getContext( '2d' );

		var gameSize = {
			x : canvas.width,
			y : canvas.height
		};

		// all objects
		this.objects = createInvaders( this ).concat( [new Player( this, gameSize )] );
		var self = this;
		loadSound('shoot.wav', function(shootSound) {
			self.shootSound = shootSound;
			var tick = function() {
			//this.prototype.update();
			//this.prototype.draw(screen, gameSize);
			self.update( gameSize );
			self.draw( screen, gameSize );
			requestAnimationFrame( tick );
		}
			tick();
		});

		//tick.call(Game, screen, gameSize);
		//tick.apply(Game, [screen, gameSize]);
	}

	Game.prototype = {
		
		 update : function(gameSize) {
		 	var objects = this.objects;

		 	var notCollidingWithAnything  = function(o1) {
		 		return objects.filter(function(o2) {
		 			return colliding( o1, o2 );
		 		}).length == 0;
		 	}

		 	this.objects = this.objects.filter( notCollidingWithAnything );
		    
		    for (var i = 0; i < this.objects.length; i++) {
				if(this.objects[i].position.y < 0) {
					this.objects.splice( i, 1 );
				}
			}
			
			for (var i = 0; i < this.objects.length; i++) {
				this.objects[i].update();
			}
		},

		draw : function(screen, gameSize) {
			clearCanvas( screen, gameSize );
			for (var i = 0; i < this.objects.length; i++) {
				drawRect( screen, this.objects[i] );
			}
		},

		addObject : function(obj) {
			this.objects.push( obj );
		},

		invadersBelow : function(invader) {
			return this.objects.filter(function(o) {
				return o instanceof Invader &&
				o.position.y > invader.position.y &&
				o.position.x - invader.position.x < invader.size.width;
			}).length > 0;
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
			//count of bullets
			if(Math.random() < 0.01 && !this.game.invadersBelow(this)) {
				var bullet = new Bullet( { x : this.position.x + this.size.width/2 - 3/2, y : this.position.y + this.size.height/2}, 
						{x: Math.random() - 0.5, y: 2} );
				
				this.game.addObject( bullet );
			}
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
			if(this.keyboader.isDown( this.keyboader.KEYS.LEFT )) {
				if(this.inTargetX(this, this.gameSize) || (this.position.x + this.size.width) >= this.gameSize.x)
					this.position.x -= 2;
				
				this.position.x -= 0;
				
			}

			if(this.keyboader.isDown( this.keyboader.KEYS.RIGHT )) {
				if(this.inTargetX(this, this.gameSize) || this.position.x <= 0)
					this.position.x += 2;
				
				this.position.x += 0;
				
			}

			if(this.keyboader.isDown( this.keyboader.KEYS.DOWN )) {
				if(this.inTargetY(this, this.gameSize) || this.position.y <= 100)
					this.position.y += 2;

				this.position.y += 0;
			}

			if(this.keyboader.isDown( this.keyboader.KEYS.UP )) {
				if(this.inTargetY(this, this.gameSize) || (this.position.y + this.size.height) >= this.gameSize.y)
					this.position.y -= 2;

				this.position.y -= 0;
			}


			if(this.keyboader.isDown( this.keyboader.KEYS.SPACE )) {
				if(this.bullets < 3) {
					var bullet = new Bullet( { x : this.position.x + this.size.width/2 - 3/2, y : this.position.y-4}, 
						{x: 0, y: -6} );
					this.game.addObject( bullet );
					this.bullets++;
					this.game.shootSound.load();
					this.game.shootSound.play();
				}
			}

			this.timer++;
			if(this.timer % 12 == 0)
				this.bullets = 0;
		},

	    inTargetX : function(player, gameSize) {
			if((player.position.x + player.size.width) >= gameSize.x 
				|| player.position.x <= 0)
				return false;
			
			else return true;
		},

		inTargetY : function(player, gameSize) {
			if((player.position.y + player.size.height) >= gameSize.y 
				|| player.position.y <= 100) 
		  		return false;

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
			DOWN : 40,
			UP : 38,
			SPACE : 32
		}
	}
	
	// collision detection condition
	var colliding = function(o1, o2) {
		return !(o1 == o2 ||
			o1.position.x + o1.size.width/2 < o2.position.x - o2.size.width/2 ||
			o1.position.y + o1.size.height/2 < o2.position.y - o2.size.height/2 ||
			o1.position.x - o1.size.width/2 > o2.position.x + o2.size.width/2 ||
			o1.position.y - o1.size.height/2 > o2.position.y + o2.size.height/2
			);
	}

	var loadSound = function(url, callback) {
		var loaded = function() {
			callback( sound );
			sound.removeEventListener( 'canplaythrough', loaded );
		}
		var sound = new Audio( url );
		sound.addEventListener( 'canplaythrough', loaded );
		sound.loaded();
	}

	var drawRect = function(screen, object) {
		screen.fillRect( object.position.x, object.position.y, object.size.width, object.size.height );
	}

	var clearCanvas = function(screen, gameSize) {
		screen.clearRect( 0, 0, gameSize.x, gameSize.y );
	}
	
	var createInvaders = function(game) {
		var invaders = [];
		for (var i = 0; i < 24; i++) {
			var x = 30 + ( i % 8 ) * 30;
			var y = 30 + ( i % 3 ) * 30;
			invaders.push(new Invader( game, { x : x, y : y } ));
		}
		return invaders;
	}

	window.onload = function() {
		new Game( 'screen' );
	}

}();