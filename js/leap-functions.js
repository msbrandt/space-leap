jQuery(function($){
	console.log('Start program');
	var is_played = $('#game > span').data('play');
	
	var stageW = 1200,
		stageH = 600;

	var stage = new PIXI.Stage(0xFFFFFF);
	var render = new PIXI.autoDetectRenderer(stageW, stageH,
		{antialiasing: false, transparent: true, resolution: 1} );

	var renderer = new PIXI.CanvasRenderer(stageW, stageH);

	document.getElementById('game').appendChild(render.view);

	render.render(stage);

	var spacebg = PIXI.Texture.fromImage(fp.path+"/img/sapcebg.png");
	var space = new PIXI.TilingSprite(spacebg, stageW, stageH);
	
	var space_aliens = new PIXI.TilingSprite(spacebg, stageW, stageH);
	stage.addChild(space_aliens);
	stage.addChild(space);

	var rocketship = PIXI.Sprite.fromImage(fp.path+"/img/spaceship.png");
	stage.addChild(rocketship);

	var collided = false;
	var timer = window.performance.now();

	var options = {
		enableGestures: true,
		frameEventName: "animationFrame"
	};
	var swap = 0;
	var aliensss = 0;
	var is_firing = false;
	var add_alien = false;
	var lazers = [];
	var aliens = [];

	$('#game > span').on('click', function(){
		is_played = true;
		$('#game > h1, #game > span').hide();

		var controller = Leap.loop(options, function(frame){
			var now = window.performance.now();
			var delta = Math.min(now - timer, 100);
			timer = now;

			space.tilePosition.x -= 0.2 * delta;
			space_aliens.tilePosition.x -= 0.2 * delta; 

			stage.addChild(rocketship);

			if(collided){
				var caption = new PIXI.Text("GAME OVER", {
					font: "50px Helvetica", fill: "red"
				});
				caption.x = (stageW / 2) - (caption.width / 2);
				caption.y = stageH / 2
				stage.addChild(caption);

				if(frame.gestures.length > 0){
					frame.gestures.forEach(function(gesture){
						if(gesture.type = "swipe"){
							//TODO: reset game wiith swipe gesture
							console.log('Restart');
							return render.render(stage);

						};

					})
				}
				return render.render(stage);
			};

			if(frame.gestures.length > 0){
				frame.gestures.forEach(function(gesture){
					if(gesture.type == "keyTap"){
						requestAnimFrame( lazer_animate );
						is_firing = true;
					}
				})
			};

			space_aliens.children.forEach(function(child){
				child.x -= 0.2 * delta;
				if(child.x < -child.width){
					space_aliens.removeChild(child);
				}
			});

			space.children.forEach(function(child){
				child.x -= 0.2 * delta; 

				if(child.getBounds().contains(rocketship.x, rocketship.y)){
					collided = true;
				}
				if(child.x < -child.width){
					space.removeChild(child);
				}
			});

			//TODO: Added Aliens that also shoot back at you 


			// var last_alien = space_aliens.children[space_aliens.children.length - 1];
			// console.log(last_alien);
			
			// if(space.children.length == 0 || last_alien.x < (stageW - 250)){
			// 	var alien_src = fp.path+"/img/alien.gif";
			// 	var alien = new PIXI.Sprite.fromImage(alien_src);
			// 	alien.y = Math.floor(Math.random() * stageH - 100);
			// 	alien.x = stageW;

			// 	space_aliens.addChild(alien);
			// }

			var last = space.children[space.children.length - 1];

			if(space.children.length == 0 || last.x < (stageW - 250)){
				aliensss++;
				// console.log(aliensss);
				switch (swap){
					case 1:
						var img_src = fp.path+"/img/asteroid2.png";
						break;
					case 2:
						var img_src = fp.path+"/img/asteroid3.png";
						break;

					case 3:
						var img_src = fp.path+"/img/asteroid4.png";
						swap = 0;
						break;

					default:
						var img_src = fp.path+"/img/asteroid1.png"

				}
				var comet = new PIXI.Sprite.fromImage(img_src);

				comet.y = Math.floor(Math.random() * (stageH - 100));
				comet.x = stageW;
				


				if(aliensss % 5 === 0){
					add_alien = true;
					requestAnimFrame(alien_animation);
				}

				space.addChild(comet);

				swap++;
			}

			if(frame.pointables.length > 0){
		        var pos = frame.pointables[0].stabilizedTipPosition;
		        var normPos = frame.interactionBox.normalizePoint(pos, true);

		        // Move the rocket to the normalized finger position
		        rocketship.x = stageW * normPos[0];
		        rocketship.y = stageH * (1 - normPos[1]); 
			}

			function alien_animation(){
				if(add_alien){
					var alien = new PIXI.Sprite.fromImage(fp.path+"/img/alien_sm.gif");
					
					alien.y = Math.floor(Math.random() * (stageH - 150));
					alien.x = stageW;


					aliens.push(alien);
					space.addChild(alien);
					add_alien = false;
				}

				for(var b = 0; b < aliens.length; b++){
					var the_alien = aliens[b];

					if(the_alien.y < stageH){
						the_alien.y += 10;
					}else if(stageH >= the_alien.y){
						the_alien.y -= 10;
					}

					// if(the_alien.y > stageH){
					// 	the_alien.y -= 5;
					// }else if(the_alien.y == 0) {
					// 	the_alien.y += 5;
					// }
				}
				requestAnimFrame(alien_animation);
			}

			function lazer_animate(){
				if(is_firing){
					var lazer = new PIXI.Sprite(PIXI.Texture.fromImage(fp.path+"/img/lazer.jpg"));
					var pos = rocketship.position;
					lazer.anchor.x = 0.5;
					lazer.anchor.y = 0.5;
					lazer.position.x = pos.x + 90;
					lazer.position.y = pos.y + 40;
					lazers.push(lazer);
					
					stage.addChild(lazer);
					
					console.log('shot fired');
					is_firing = false;
				}

				for(var x = 0; x < lazers.length; x++){
					console.log(lazers[x]);
					var the_lazer = lazers[x];
					the_lazer.x += 5;
					
					space.children.forEach(function(child){
						// child.x -= 0.2 * delta; 

						if(hitTestRectangle(the_lazer, child)){
							console.log('its a hit!');

							stage.removeChild(the_lazer);
							space.removeChild(child);
							lazers.splice(the_lazer.index, 1);
							return;
						}
					})
				}
				requestAnimFrame( lazer_animate );

			}
			render.render(stage);

		});
	})

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
	};

});
