(function($){
	
	// window.requestAnimFrame = (function(){
	//   return  window.requestAnimationFrame       ||
	//           window.webkitRequestAnimationFrame ||
	//           window.mozRequestAnimationFrame    ||
	//           function( callback ){
	//             window.setTimeout(callback, 1000 / 60);
	//           };
	// })();

	var tst_mode = false,
		moveable_ship = true;

	var stageW = 1200,
		stageH = 600;
	
	var half_stage_h = stageH/2,
		foo = half_stage_h - 25;

	var level1_comets = 50;
	var	level2_comets = 100;

	var stage = new PIXI.Stage(0xFFFFFF);
	var render = new PIXI.autoDetectRenderer(stageW, stageH,
		{antialiasing: false, transparent: true, resolution: 1} );
	
	var play_btn = $('#game > span, #game > h1');
	document.getElementById('game').appendChild(render.view);


	var m = new FPSMeter();
	var jjj = true;
	var rocketship, space, lazer, a_lazer, pixelateFilter, game_scene, game_over_scene, alien_scene, state, rocket_lazer_scene;
	var alien_h;
	var sp_pos;
	var fps = 60;
	var comet_count = 0;
	// var comet_count_root = 0;
	var comet_count_root = 2;
	var alien_count = 0;
	var collided = false;
	var is_firing = false;
	var alien_firing = false;
	var not_hit = true;
	var adding_alien = false;
	var change_direction = false;
	var is_played = false;
	var remove_count = 0;
	var alien_index = 0;
	var lazers = [],
		aliens = [];
	var a_lazers = [];
	var ac = 0;
	var angle = 0;
	var alien_ar = [];
	var pig;


	var id_arry = [];

	var timer = window.performance.now();
	var options = {
		enableGestures: true,
		frameEventName: "animationFrame"
	};
	var loader =  new PIXI.AssetLoader([
		fp.path+"/img/sapcebg.png",
		fp.path+"/img/test_bg_3.png",
		fp.path+"/img/cloud_overlay.png",
		fp.path+"/img/stars.png",
		fp.path+"/img/semless.png",
		fp.path+"/img/spaceship.png",
		fp.path+"/img/alien_sm.gif",
		fp.path+"/img/lazer.jpg",
		fp.path+"/img/lazer-r.jpg",
		fp.path+"/img/asteroid1.png",
		fp.path+"/img/asteroid2.png",
		fp.path+"/img/asteroid3.png",
		fp.path+"/img/asteroid4.png"
	]);

	loader.onComplete = setup;
	loader.load();
	function create_txt(str, font_size, font_style, color){

		var new_txt = new PIXI.Text(String(str), 
			{font: ""+font_size+"px " +font_style+"", fill: color }); 

		return new_txt;
	}
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
		alien_scene = new PIXI.DisplayObjectContainer();
		game_over_scene = new PIXI.DisplayObjectContainer();
		
		stage.addChild(game_scene);
		
		stage.addChild(game_over_scene);

		game_over_scene.visible = false;
		pixelateFilter = new PIXI.PixelateFilter();

    	pixelateFilter.size = new PIXI.Point(5, 5);
		
		// var spacebg_texture = PIXI.TextureCache[fp.path+"/img/sapcebg.png"];
		// var spacebg_texture = PIXI.TextureCache[fp.path+"/img/semless.png"];
		var spacebg_texture = PIXI.TextureCache[fp.path+"/img/test_bg_3.png"];
		rocketship = create_sprite('/img/spaceship.png');
		
		space = new PIXI.TilingSprite(spacebg_texture, stageW, stageH);

		game_scene.addChild(space);
		game_scene.addChild(alien_scene);
		
		//TODO: Points system and display
		var point_box = new PIXI.DisplayObjectContainer();

		game_scene.addChild(point_box);

		var rect = new PIXI.Graphics();
		rect.lineStyle(3, 0x3E82BE, 1);
		rect.drawRect(0,0,250,75);
		rect.y = 5;
		rect.x = 945;

		// point_box.addChild(rect);
		var point_txt = create_txt('Pts', 30, 'Helvetica', '#3E82BE');
		point_txt.y = 10;
		point_txt.x = 1150;
		// point_box.addChild(point_txt);
		
		play_message = create_txt('SPACE LEAP', 50, 'Helvetica', '#3E82BE');
		// play_message = new PIXI.Text("SPACE LEAP", 
			// {font: "50px Helvetica", fill: "#3E82BE" });
		play_help = create_txt('Press enter to play', 24, 'Helvetica', '#3E82BE');
		
		// play_help = new PIXI.Text("Press enter to play", 
		// 	{font: "24px Helvetica", fill: "#3E82BE" });
		game_over_message = create_txt('GAME OVER!', 50, 'Helvetica', '#FF0000');
		// game_over_message = new PIXI.Text("GAME OVER!", 
		// 	{font: "50px Helvetica", fill: "red" });

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
			page_state(frame);

			if(rocketship.visible){
				if(moveable_ship){
					move_ship(frame);
				}
				shoot_lazer(frame);
				restart_game_lisnter(frame);

			}
		})//end of leap loop
		gameLoop();
		requestAnimFrame(animate);


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
		if(!tst_mode){
			space.tilePosition.x -= 3;
		}

		id_arry.forEach(function(ai){
			var pp = Math.floor((ai.sprite.y / stageH) * 100);
			var tl = ai.max - ai.min;

			ai.sprite.y = inc_alian(tl, ai.max, ai.sy);

		});
		alien_scene.children.forEach(function(child){
			if(Math.floor(timer) % 62 == 0){
				// console.log('lazer shot');
				alien_firing = true;
				alien_lazer(child);
				requestAnimFrame( alien_lazer );

			}
			if(!tst_mode){
				child.x -= 5;

			}
			// collection_dection(child);

			if(child.x < -child.width){
				alien_scene.removeChild(child);
				id_arry.splice(0, 1);
			}

		});

		space.children.forEach(function(child){
			if(!tst_mode){
				child.x -= 4;
			}
			// collection_dection(child);
			
			if(child.x < -child.width){
				space.removeChild(child);
			}	
			if(child.x > stageW){
				console.log('remove lazer');
			}

		});

		if(is_played){
			rocketship.visible = true;

			game_scene.removeChild(play_message);
			game_scene.removeChild(play_help);

			create_comet();
			
			if(!tst_mode){
				if(comet_count_root % 5 === 0){
					create_alien();
				}
			}else{
				create_alien();
			}
		}

	}//end of play function

	function end(){

	}//end of end function 
	function inc_alian(travel_length, max, start){

		angle += 0.005;
		new_pos_rad = (((Math.sin(angle * (2 * Math.PI))*travel_length)+start));
		// new_pos_deg = new_pos_rad * (180/Math.PI);
		// new_pos_rad = ((Math.sin(angle * (2 * Math.PI)) * half_stage_h)+foo);
		// console.log(new_pos_rad);
		return new_pos_rad;
	}//end inc_alian function
	function move_ship(frame){
		if(frame.pointables.length > 0 && !collided){
	        var pos = frame.pointables[0].stabilizedTipPosition;
	        var normPos = frame.interactionBox.normalizePoint(pos, true);

	        // Move the rocket to the normalized finger position
	        rocketship.x = stageW * normPos[0];
	        rocketship.y = stageH * (1 - normPos[1]); 
		}
	}//end move_ship function
	function shoot_lazer(frame){
		if(frame.gestures.length > 0){

			frame.gestures.forEach(function(gesture){
				if(gesture.type == "keyTap"){
					is_firing = true;
					// lazer_animate();
				}
			})
		};
	}//end shoot_lazer function
	function keyboard(kc){
		if(kc.keyCode === 13){
			is_played = true; 
		}
	}//end keybord function
	var qq = 0;
	function create_alien(){
		if(!tst_mode){
			var last = alien_scene.children[alien_scene.children.length - 1];
			
			if(alien_scene.children.length == 0 || last.x < (stageW - 250)){
				var alien = create_sprite('/img/alien_sm.gif');

				alien.y = Math.floor(Math.random() * (stageH - 105));

				alien.x = stageW + 200;

				alien_scene.addChild(alien);

				var min_val = rand_num_gen(0, half_stage_h),
					max_val = rand_num_gen(half_stage_h, (stageH - 50));

				// console.log('Max:'+ max_val+ ' min:'+ min_val+ ' start y:'+ alien.y);

				
				id_arry.push({id: alien_count, sprite: alien, dir: false, min: min_val, max: max_val, sy: alien.y});

				alien_count++;
			}

		}else{
			if(jjj){
				var alien = create_sprite('/img/alien_sm.gif');

				alien.y = Math.floor(Math.random() * (stageH - 105));

				alien.x = stageW - 400;

				alien_scene.addChild(alien);

				var min_val = rand_num_gen(0, half_stage_h),
					max_val = rand_num_gen(half_stage_h, (stageH - 50));
				// var min_val = 335,
					// max_val = 463;

				// console.log('Max:'+ max_val+ ' min:'+ min_val+ ' start y:'+ alien.y);

				
				id_arry.push({id: alien_count, sprite: alien, dir: false, min: min_val, max: max_val, sy: alien.y});
				// console.log(alien_count);


				// }
				alien_count++;
				// if(alien_count === 2){
					jjj = false;

				// }

			}
		}

		
	}//end create alien function
	function create_comet(){
		// console.log('go ' + qq);
		qq++;
		var last = space.children[space.children.length - 1];
		
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

			comet.y = Math.floor(Math.random() * (stageH - 100));
			comet.x = stageW;

			space.addChild(comet);


			var theta = 0.2 * delta;
			// if(comet_count_root % 2 === 0){
			// 	alien.vy = 0;
			// 	alien_scene.addChild(alien);
			// 	var floor_val = rand_num_gen(0, 40),
			// 		celi_val = rand_num_gen(50, 90);
				
			// 	id_arry.push({id: alien_count, sprite: alien, dir: false, fl: floor_val, ce: celi_val, vols: theta});
			// 	// animate_aliens(alien, alien_count);
			// 	// console.log(alien_count);
			// 	alien_count++;
				
			// }
			comet_count++;

		}
	}//end create comet function
	


	function alien_lazer(alien_ship){

		if(alien_firing && is_played){
			a_lazer = create_sprite('/img/lazer-r.jpg');
		
			var pos = alien_ship.position;
			// console.log(pos);
			a_lazer.anchor.x = 0.5;
			a_lazer.anchor.y = 0.5;

			a_lazer.position.x = pos.x - 20;
			a_lazer.position.y = pos.y + 30;
			
			if(a_lazers.length <= 20){
				a_lazers.push(a_lazer);
			}else{
				a_lazers = [];
				a_lazers.push(a_lazer);
			}
			// console.log(a_lazers);
			stage.addChild(a_lazer);
			// console.log('alien shot fired');
			alien_firing = false;

		}

		a_lazers.forEach(function(A_LAZER){
			// if(A_LAZER.x < stageW){
				A_LAZER.x -= 0.2 * delta;
				if(A_LAZER.x < -100){
					a_lazers.splice(0,1);
				}
				if(hitTestRectangle(A_LAZER, rocketship)){
				// alien_scene.children.forEach(function(child){
					// if(hitTestRectangle(A_LAZER, child)){
						console.log('alien lazer hit!');
						stage.removeChild(A_LAZER);
				// 		alien_scene.removeChild(child);
						
				// 		return;
				// 	}	
				// });

			}
			// 	stage.removeChild(A_LAZER);
			// }
		})

		// console.log(Math.floor(timer));

		requestAnimFrame(alien_lazer);
	}//end alien_lazer function

	function inc_lazer(the_lazer){
		// console.log(the_lazer);
		beta = 0.5 * delta;
		// the_lazer.x = rocketship.position.x + 80;
		var ang = the_lazer.x += beta;
		// console.log(ang);
		return ang;
	}//end inc_alien_lazer
	var limit = 3;
	function create_lazer(type){

	}
	function lazer_animate(){

		if(is_firing && is_played){
			// lazer.vx = 5;
			// for(var i = 0; i<limit; i++){

				lazer = create_sprite('/img/lazer.jpg');

				var pos = rocketship.position;
				lazer.anchor.x = 0.5;
				lazer.anchor.y = 0.5;
				lazer.position.x = pos.x + 80;
				lazer.position.y = pos.y + 40;
				
				lazers.push(lazer);

				// setTimeout(function(){
					stage.addChild(lazer);
				// }, 200);

				// stage.addChild(lazer);
				console.log('shot fired');

			// }
				console.log(lazers);


			is_firing = false;
		}
		// lazer.x += 5;
		for(var i = 0; i < lazers.length; i++){
			// console.log(lazers[i].x);
			if(lazers[i].x < stageW+100){
				lazers[i].x = inc_lazer(lazers[i]);
			}else if(lazers[i].x > stageW + 100){
				// lazers.splice(i, 1);
			}
		}
		// for(var x = 0; x<limit; x++){
			// var g = x - 1;
			
			// setTimeout(function(){
				// console.log(lazers[x]);
				// lazers[x].x = inc_lazer(lazers[x]);
				// if(lazers[x].x > stageW + 100){
				// 	lazers.splice(x, 1);
				// }
			// }, 10);


		// }
		// lazers.forEach(function(LAZER){
			// console.log(LAZER.x);
			// m.tickStart();
			// if(LAZER.x < stageW+100){
					// LAZER.x = inc_lazer(LAZER);


				// console.log(LAZER.x);
				// alien_scene.children.forEach(function(child){
				// 	if(hitTestRectangle(LAZER, child)){
				// 		console.log('its a hit!');
				// 		stage.removeChild(LAZER);
				// 		alien_scene.removeChild(child);
						
				// 		return;
				// 	}	
				// });

			// }else if(LAZER.x > stageW+100){
				// lazers.splice(0,1);

				// stage.removeChild(LAZER);
			// }
		// });

		// setTimeout(function(){
		// 	requestAnimationFrame(lazer_animate);
		// }, 1000/80);


	}//end of Lazer animation
	function animate(){
		// if(is_firing){
		lazer_animate();

		// }
		// console.log('go');
		requestAnimFrame(animate);
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
	function page_state(frame){
		if(frame.hands.length === 2){

			if(frame.gestures.length > 0){
				frame.gestures.forEach(function(g){
					if(g.type == "circle"){
						window.location.reload();
					}
					if(g.type == "keyTap"){
						is_played = true;
					}
				})
			}
		}
	}
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