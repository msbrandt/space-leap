(function($){

	var stageW = 1200,
		stageH = 600;

	var stage = new PIXI.Stage(0xFFFFFF);
	var render = new PIXI.autoDetectRenderer(stageW, stageH,
		{antialiasing: false, transparent: true, resolution: 1} );
	
	var play_btn = $('#game > span, #game > h1');
	document.getElementById('game').appendChild(render.view);

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

	var rocketship, space, lazer, pixelateFilter;
	
	var comet_count = 0;
	var comet_count_root = 0;
	var alien_count = 0;
	var collided = false;
	var is_firing = false;
	var not_hit = true;
	var adding_alien = false;
	var change_direction = false;

	var lazers = [],
		aliens = [];

	var id_arry = [];

	var timer = window.performance.now();
	var options = {
		enableGestures: true,
		frameEventName: "animationFrame"
	};

	function setup(){
		console.log('setup');

		var rocketship_texture = PIXI.TextureCache[fp.path+"/img/spaceship.png"];
		var spacebg_texture = PIXI.TextureCache[fp.path+"/img/sapcebg.png"];
		pixelateFilter = new PIXI.PixelateFilter();
    	pixelateFilter.size = new PIXI.Point(5, 5);

		rocketship = new PIXI.Sprite(rocketship_texture);
		
		space = new PIXI.TilingSprite(spacebg_texture, stageW, stageH);
		
		// rocketship.filters = [pixelateFilter];

		stage.addChild(space);

		render.render(stage);

		gameLoop();

	}

	function gameLoop(){
		
		play_btn.on('click', function(){
			play_btn.hide();
			stage.addChild(rocketship);

			Leap.loop(options, function(frame){
				var now = window.performance.now();
				var delta = Math.min(now - timer, 100);
				timer = now;

				var tile_pos = 0.1 * delta;

				//Animate space background
				space.tilePosition.x -= tile_pos;
				
				//Move rocketship around with Leap motion
				if(frame.pointables.length > 0 && !collided){
			        var pos = frame.pointables[0].stabilizedTipPosition;
			        var normPos = frame.interactionBox.normalizePoint(pos, true);

			        // Move the rocket to the normalized finger position
			        rocketship.x = stageW * normPos[0];
			        rocketship.y = stageH * (1 - normPos[1]); 
				}

				//Randomly place comets
				var last = space.children[space.children.length - 1];

				if(space.children.length == 0 || last.x < (stageW - 250)){
					comet_count_root++;

					switch (comet_count){
						case 1:
							var img_src = fp.path+"/img/asteroid2.png";
							break;
						
						case 2:
							var img_src = fp.path+"/img/asteroid3.png";
							break;

						case 3:
							var img_src = fp.path+"/img/asteroid4.png";
							comet_count = 0;
							break;

						default:
							var img_src = fp.path+"/img/asteroid1.png";

					}
					
					var comet_texture = PIXI.TextureCache[img_src];
					var alien_texture = PIXI.TextureCache[fp.path+"/img/alien_sm.gif"];
					
					var comet = new PIXI.Sprite(comet_texture);
					var alien = new PIXI.Sprite(alien_texture);

					comet.y = Math.floor(Math.random() * (stageH - 100));
					comet.x = stageW;
					
					alien.y = Math.floor(Math.random() * (stageH - 105));

					alien.x = stageW;
					space.addChild(comet);

					if(comet_count_root % 2 === 0){
					// 	aliens.push(alien);
						alien.vy = 0;
						space.addChild(alien);
						var floor_val = rand_num_gen(0, 40),
							celi_val = rand_num_gen(50, 90);
						
						id_arry.push({id: alien_count, sprite: alien, dir: false, fl: floor_val, ce: celi_val});
						animate_aliens(alien, alien_count);
						// requestAnimFrame(animate_aliens);

						alien_count++;
					// 	adding_alien = true;
					// alien.filters = [pixelateFilter];
						
					}
					comet_count++;
				}

				if(frame.gestures.length > 0){

					frame.gestures.forEach(function(gesture){
						if(gesture.type == "keyTap"){
							requestAnimFrame( lazer_animate );
							is_firing = true;
						}
					})
				};

				if(collided){
					var caption = new PIXI.Text("GAME OVER", {
						font: "50px Helvetica", fill: "red"
					});
					caption.x = (stageW / 2) - (caption.width / 2);
					caption.y = stageH / 2
					stage.addChild(caption);
					
					// if(frame.gestures.length > 0){
					// 	frame.gestures.forEach(function(gesture){
					// 		if(gesture.type = "swipe"){
					// 			//TODO: reset game wiith swipe gesture
					// 			console.log('Restart');
					// 			// return render.render(stage);

					// 		};

					// 	})
					// }
					return render.render(stage);	
				}

				//Animate aliens on screen 
				// for (var i = 0; i < space.children.length; i++) {
				// 	if(i % 5 === 0){
				// 		var cur = space.children[i];
				// 		var floor_val = rand_num_gen(0, 40),
				// 			celi_val = rand_num_gen(50, 90);
				// 			console.log(i);
				// 		id_arry.push({id: i, sprite: cur, dir: false, fl: floor_val, ce: celi_val});
				// 		animate_aliens(cur, i);
				// 	}
				// };
				
				//Display randomely generated comets 
				space.children.forEach(function(child){
					child.x -= 0.3 * delta;

					if(frame.pointables.length > 0){
						if(child.getBounds().contains(rocketship.x, rocketship.y)){
							collided = true;
						}
					}
					if(child.x < -child.width){
						space.removeChild(child);
						console.log(comet_count_root);
					}
				});

				function animate_aliens(child, index){
					var i = index;

					//TODO sinasotal wave
					//period = 
					//Math.sin(period/2PI)
					// console.log(id_arry);

					// var progress = Math.floor((child.y / stageH) * 100);
					var id = rand_num_gen(0, 100);
					// console.log(id_arry[index].id);
					id_arry.forEach(function(sprite){
						var progress = Math.floor((sprite.sprite.y / stageH) * 100);
						sprite.sprite.vy = 1;

						if(!sprite.dir){
							sprite.sprite.y += sprite.sprite.vy;
							if(progress >= sprite.ce){
							// if(progress >= 90){
								change_direction = true;
								sprite.dir = true;
							}
						// }		
						}else if(sprite.dir){
							sprite.sprite.y -= sprite.sprite.vy;

							if(progress <= sprite.fl){
							// if(progress <= 0){
								change_direction = false;
								sprite.dir = false;
							}
						}				
					})

						requestAnimFrame(animate_aliens);

				}

				function rand_num_gen(min, max){
					return Math.floor(Math.random() * (max - min + 1)) + min;
				}

				function lazer_animate(){
					if(is_firing){
						var lazer_texture = PIXI.TextureCache[fp.path+"/img/lazer.jpg"];

						lazer = new PIXI.Sprite(lazer_texture);
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

				//Display the stage 
				render.render(stage);

			}); //end of Leap.loop
		}); //end of Click function


	}//end of gameLoop function
	
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