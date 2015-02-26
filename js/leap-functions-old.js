(function($){

	var stageW = 1200,
		stageH = 600;
	
	var level1_comets = 50;
	var	level2_comets = 100;

	var stage = new PIXI.Stage(0xFFFFFF);
	var render = new PIXI.autoDetectRenderer(stageW, stageH,
		{antialiasing: false, transparent: true, resolution: 1} );
	
	var play_btn = $('#game > span, #game > h1');
	document.getElementById('game').appendChild(render.view);


	var m = new FPSMeter();

	var rocketship, space, lazer, pixelateFilter, game_scene, game_over_scene, state;
	var fps = 20;
	var comet_count = 0;
	var comet_count_root = 0;
	var alien_count = 0;
	var collided = false;
	var is_firing = false;
	var not_hit = true;
	var adding_alien = false;
	var change_direction = false;
	var is_played = false;
	var remove_count = 0;
	var alien_index = 0;
	var lazers = [],
		aliens = [];


	var id_arry = [];

	var timer = window.performance.now();
	var options = {
		enableGestures: true,
		frameEventName: "animationFrame"
	};
	var loader =  new PIXI.AssetLoader([
		fp.path+"/img/sapcebg.png",
		fp.path+"/img/spaceship.png",
		fp.path+"/img/alien_sm.gif",
		fp.path+"/img/lazer.jpg",
		fp.path+"/img/asteroid1.png",
		fp.path+"/img/asteroid2.png",
		fp.path+"/img/asteroid3.png",
		fp.path+"/img/asteroid4.png"
	]);

	loader.onComplete = setup;
	loader.load();

	function create_sprite(img){
		var texture = PIXI.TextureCache[fp.path+""+img+""];
		
		var sprite = new PIXI.Sprite(texture);

		pixelateFilter = new PIXI.PixelateFilter();

    	pixelateFilter.size = new PIXI.Point(5, 5);
		sprite.filters = [pixelateFilter];

		sprite.vy = 0;

		return sprite;

	}

	var now, delta;
	function setup(){
		now = window.performance.now();
		delta = Math.min(now - timer, 100);
		timer = now;

		game_scene = new PIXI.DisplayObjectContainer();
		game_over_scene = new PIXI.DisplayObjectContainer();
		
		stage.addChild(game_scene);
		stage.addChild(game_over_scene);

		game_over_scene.visible = false;
		pixelateFilter = new PIXI.PixelateFilter();

    	pixelateFilter.size = new PIXI.Point(5, 5);
		
		var spacebg_texture = PIXI.TextureCache[fp.path+"/img/sapcebg.png"];
		rocketship = create_sprite('/img/spaceship.png');
		
		space = new PIXI.TilingSprite(spacebg_texture, stageW, stageH);

		game_scene.addChild(space);
		
		//TODO: Points system and display
		// var point_box = new PIXI.DisplayObjectContainer();
		play_message = new PIXI.Text("SPACE LEAP", 
			{font: "50px Helvetica", fill: "#0f0" });
		
		play_help = new PIXI.Text("Press enter to play", 
			{font: "24px Helvetica", fill: "#0f0" });
		
		game_over_message = new PIXI.Text("GAME OVER!", 
			{font: "50px Helvetica", fill: "red" });

		play_message.x = (stageW / 2) - (play_message.width / 2);
		play_message.y = stageH / 2;

		play_help.x = (stageW / 2) - (play_help.width / 2);
		play_help.y = (stageH / 2) + 150;

		game_over_message.x = (stageW / 2) - (game_over_message.width / 2);
		game_over_message.y = stageH / 2;

		play_message.filters = [pixelateFilter];

		game_scene.addChild(game_over_message);
		
		game_scene.addChild(play_message);
		game_scene.addChild(play_help);
		game_scene.addChild(rocketship);

		game_over_message.visible = false;
		rocketship.visible = false;

		window.addEventListener('keyup', keyboard, true);
		state = play;

		var controler = Leap.loop(options, function(frame){
			if(rocketship.visible){
				move_ship(frame);
				shoot_lazer(frame);
				restart_game_lisnter(frame);

			}
		})//end of leap loop

		gameLoop();

	}

	function gameLoop(){
		// setTimeout(function(){
		requestAnimFrame(gameLoop);
		// }, 1000/fps);
		
		state();
		render.render(stage);
	}//end of gameLoop function

	function play(){
		var now = window.performance.now();
		var delta = Math.min(now - timer, 100);
		timer = now;

		space.tilePosition.x -= 3;

		space.children.forEach(function(child){
			child.x -= 4;

			collection_dection(child);
			// if(frame.pointables.length > 0){
				// if(child.getBounds().contains(rocketship.x, rocketship.y)){
					// collection_dection();
				// }
			// }

			if(child.x < -child.width){
				space.removeChild(child);
				remove_count++;

				if(remove_count % 3 === 0){
					id_arry.splice(0, 1);
					// console.log(id_arry);
				}

			}	

		})

		if(is_played){
			rocketship.visible = true;

			game_scene.removeChild(play_message);
			game_scene.removeChild(play_help);
			if( now % 1000 <= 10){
				create_junk();
			}
		}

	}//end of play function

	function end(){

	}//end of end function 
	
	function move_ship(frame){
		if(frame.pointables.length > 0 && !collided){
	        var pos = frame.pointables[0].stabilizedTipPosition;
	        var normPos = frame.interactionBox.normalizePoint(pos, true);

	        // Move the rocket to the normalized finger position
	        rocketship.x = stageW * normPos[0];
	        rocketship.y = stageH * (1 - normPos[1]); 
		}
	}
	function shoot_lazer(frame){
		if(frame.gestures.length > 0){

			frame.gestures.forEach(function(gesture){
				if(gesture.type == "keyTap"){
					requestAnimFrame( lazer_animate );
					is_firing = true;
				}
			})
		};
	}
	function keyboard(kc){
		if(kc.keyCode === 13){
			is_played = true; 
		}
	}//end of keybord function
	var qq = 0;
	function create_junk(){
		// console.log('go ' + qq);
		qq++;
		var last = game_scene.children[game_scene.children.length - 1];
		
		if(space.children.length == 0 || last.x < (stageW - 250)){
			comet_count_root++;

				switch (comet_count){
					case 1:
						var img_src = "/img/asteroid2.png";
						break;
					
					case 2:
						var img_src = "/img/asteroid3.png";
						break;

					case 3:
						var img_src = "/img/asteroid4.png";
						comet_count = 0;
						break;

					default:
						var img_src = "/img/asteroid1.png";

				}

			var comet = create_sprite(img_src);
			var alien = create_sprite('/img/alien_sm.gif');

			comet.y = Math.floor(Math.random() * (stageH - 100));
			comet.x = stageW;

			space.addChild(comet);

			alien.y = Math.floor(Math.random() * (stageH - 105));
			alien.x = stageW + 200;

			var theta = 0.2 * delta;
			if(comet_count_root % 2 === 0){
				alien.vy = 0;
				space.addChild(alien);
				var floor_val = rand_num_gen(0, 40),
					celi_val = rand_num_gen(50, 90);
				
				id_arry.push({id: alien_count, sprite: alien, dir: false, fl: floor_val, ce: celi_val, vols: theta});
				animate_aliens(alien, alien_count);
				console.log(alien_count);
				alien_count++;
				
			}
			comet_count++;

		}

	}//end of create junk function

	function lazer_animate(){
		
		if(is_firing && is_played){
			lazer = create_sprite('/img/lazer.jpg');
			lazer.vx = 5;

			var pos = rocketship.position;
			lazer.anchor.x = 0.5;
			lazer.anchor.y = 0.5;
			lazer.position.x = pos.x + 80;
			lazer.position.y = pos.y + 40;
			
			if(lazers.length <= 30){
				lazers.push(lazer);
			}else{
				lazers = [];
				lazers.push(lazer);
			}

			stage.addChild(lazer);
			console.log('shot fired');
			is_firing = false;
		}

		lazers.forEach(function(LAZER){
			if(LAZER.x < stageW){
				LAZER.x += 5;
				space.children.forEach(function(child){
					if(hitTestRectangle(LAZER, child)){
						console.log('its a hit!');

						stage.removeChild(LAZER);
						space.removeChild(child);
						return;
					}	
				})
			}else{
				stage.removeChild(LAZER);
			}
		})

		requestAnimFrame( lazer_animate );
	}//end of Lazer animation

	function animate_aliens(child, index){
		// console.log(index);
		//TODO sinasotal wave
		//period = 
		//Math.sin(period/2PI)
		// console.log(id_arry);
		var id = rand_num_gen(0, 100);
		// console.log(id_arry);
		id_arry.forEach(function(sprite){
			var progress = Math.floor((sprite.sprite.y / stageH) * 100);
			sprite.sprite.vy = 2;

			if(!sprite.dir){
				sprite.sprite.y = sprite.sprite.y + sprite.sprite.vy;
				if(progress >= sprite.ce){
				// if(progress >= 90){
					// m.tick();
					change_direction = true;
					sprite.dir = true;
				}
			// }		
			}else if(sprite.dir){
				sprite.sprite.y = sprite.sprite.y - sprite.sprite.vy;

				if(progress <= sprite.fl){
				// if(progress <= 0){
					// m.tick();
					change_direction = false;
					sprite.dir = false;
				}
			}				
		})
			setTimeout(function(){
				requestAnimationFrame(animate_aliens);
			}, 1000/fps);
			// requestAnimFrame(animate_aliens);

	}	
	function rand_num_gen(min, max){
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function collection_dection(object){
		if(object.getBounds().contains(rocketship.x, rocketship.y)){
			collided = true;
			game_over_message.visible = true;
			is_played = false;

			return render.render(stage);
		}

	}//end collection_dection function

	function restart_game_lisnter(frame){
		
		if(frame.gestures.length > 0){
			if(!is_played && collided){
				frame.gestures.forEach(function(gesture){
					if(gesture.type == "screenTap"){
							// caption.visible = false;
							game_over_message.visible = false;

							is_played = true;
							collided = false;
					};

				})
			}


		}

	}//end of restart_game_lisnter function
	
	function hitTestRectangle(r1, r2) {

	  //Define the variables we'll need to calculate
	  var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

	  //hit will determine whether there's a collision
	  hit = false;

	  //Find the center points of each sprite
	  r1.centerX = r1.x + r1.width / 2;
	  r1.centerY = r1.y + r1.height / 2;
	  r2.centerX = r2.x + r2.width / 2;
	  r2.centerY = r2.y + r2.height / 2;

	  //Find the half-widths and half-heights of each sprite
	  r1.halfWidth = r1.width / 2;
	  r1.halfHeight = r1.height / 2;
	  r2.halfWidth = r2.width / 2;
	  r2.halfHeight = r2.height / 2;

	  //Calculate the distance vector between the sprites
	  vx = r1.centerX - r2.centerX;
	  vy = r1.centerY - r2.centerY;

	  //Figure out the combined half-widths and half-heights
	  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
	  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

	  //Check for a collision on the x axis
	  if (Math.abs(vx) < combinedHalfWidths) {

	    //A collision might be occuring. Check for a collision on the y axis
	    if (Math.abs(vy) < combinedHalfHeights) {

	      //There's definitely a collision happening
	      hit = true;
	    } else {

	      //There's no collision on the y axis
	      hit = false;
	    }
	  } else {

	    //There's no collision on the x axis
	    hit = false;
	  }

	  //`hit` will be either `true` or `false`
	  return hit;

	};//end of hitTestRectangle function

})(jQuery);