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

	var rocketship, space, lazer;
	
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

	var timer = window.performance.now();


	function setup(){
		console.log('setup');

		var rocketship_texture = PIXI.TextureCache[fp.path+"/img/spaceship.png"];
		var spacebg_texture = PIXI.TextureCache[fp.path+"/img/sapcebg.png"];

		rocketship = new PIXI.Sprite(rocketship_texture);
		
		space = new PIXI.TilingSprite(spacebg_texture, stageW, stageH);
		
		
		stage.addChild(space);

		render.render(stage);

		gameLoop();

	}

	function gameLoop(){
		
		play_btn.on('click', function(){
			play_btn.hide();
			stage.addChild(rocketship);

			Leap.loop(function(frame){
				var now = window.performance.now();
				var delta = Math.min(now - timer, 100);
				timer = now;

				var tile_pos = 0.2 * delta;

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
					alien_count++;
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

					if(comet_count_root % 5 == 0){
						aliens.push(alien);
						space.addChild(alien);
						requestAnimFrame( alien_animate );
						alien_count++;
						adding_alien = true;



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

				//Display randomely generated comets 
				space.children.forEach(function(child){
					child.x -= 0.2 * delta;
					if(frame.pointables.length > 0){
						if(child.getBounds().contains(rocketship.x, rocketship.y)){
							collided = true;
						}
					}

					if(child.x < -child.width){
						space.removeChild(child);
					}
				});

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
						is_firing = false;
					}


					lazers.forEach(function(LAZER){
						if(LAZER.x < stageW){
							LAZER.x += 5;
							space.children.forEach(function(child){
								if(hitTestRectangle(LAZER, child)){
									console.log('its a hit!');
									console.log(child);

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

				function alien_animate(){

					aliens.forEach(function(al){
						var progress = Math.floor((al.y / stageH) * 100);
						if(progress <= 100 && !change_direction){
							al.y += 5;
							if(al.y >= 100){
								change_direction = true;
							}
						}else if(progress <= 100 && change_direction){
							al.y -= 5;
							if(al.y <= 0){
								change_direction = false;
							}
						}
					})
					requestAnimFrame(alien_animate);
					
				}//end of alien  animate


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