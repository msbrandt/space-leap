(function($){
	
	var tst_mode = false,
		moveable_ship = true,
		coli = false;

	var stageW = 1200,
		stageH = 600;
	
	var half_stage_h = stageH/2,
		foo = half_stage_h - 25;

	var stage = new PIXI.Stage(0xFFFFFF);
	var render = new PIXI.autoDetectRenderer(stageW, stageH,
		{antialiasing: false, transparent: true, resolution: 1} );
	
	document.getElementById('game').appendChild(render.view);

	var current_level;
	var use_lvl = 'l0';
	var jjj = true;
	var rocketship, space_tile, space_container, bg_stars, fg_stars, lazer, a_lazer, pixelateFilter, game_scene, game_over_scene, alien_scene, state, rocket_lazer_scene, comet_scene;
	var comet_count = 0;
	var comet_count_root = 0;
	var alien_count = 0;
	var collided = false;
	var is_firing = false;
	var alien_firing = false;
	var is_played = false;
	var lazers = [];
	var a_lazers = [];
	var angle = 0;
	var ma = false;
	var secs_lb, mins_lb;
	var total_s = 0;

	var id_arry = [];

	var timer = window.performance.now();

	var options = {
		enableGestures: true,
		frameEventName: "animationFrame"
	};

	var levels = {
		l0: {
			space_bg: 'space-home',
			space_speed: .25,
			back_star_speed: 1,
			for_star_speed: 2,
			comet_speed: 3,
			alien_speed: 3.5,
			comet_rate: 0,
			alien_rate: 0,
			// a_lazer_timer: 
		},		
		l1: {
			space_bg: 'space-lvl1',
			space_speed: .25,
			back_star_speed: 1,
			for_star_speed: 2,
			comet_speed: 3,
			alien_speed: 3.5,
			comet_rate: 600,
			alien_rate: 5,
			// a_lazer_timer: 
		},
		// l2: {
		// 	space_bg: 'space-lvl2',
		// 	space_speed: 0.15,
		// 	back_star_speed: 0.2,
		// 	for_star_speed: .25,
		// 	comet_speed: 5,
		// 	alien_speed: 6,
		// 	comet_rate: 400,
		// 	alien_rate: 5,
		// 	// a_lazer_timer: 
		// },
		l2: {
			space_bg: 'space-lvl3',
			space_speed: .5,
			back_star_speed: 1.5 ,
			for_star_speed: 3,
			comet_speed: 4,
			alien_speed: 4.5,
			comet_rate: 300,
			alien_rate: 6,
			// a_lazer_timer: 
		},
		l3: {
			space_bg: 'space-lvl4',
			space_speed: 1,
			back_star_speed: 2.5,
			for_star_speed: 5,
			comet_speed: 6.5,
			alien_speed: 7,
			comet_rate: 200,
			alien_rate: 7,
			// a_lazer_timer: 
		},
		// l5: {
		// 	space_bg: 'space-lvl5',
		// 	space_speed: 0.7,
		// 	back_star_speed: 0.8,
		// 	for_star_speed: 0.9,
		// 	comet_speed: 10,
		// 	alien_speed: 11,
		// 	comet_rate: 100,
		// 	alien_rate: 5,
		// 	// a_lazer_timer: 
		// },

	};


	var loader =  new PIXI.AssetLoader([
		fp.path+"/img/space/space-lvl1.png",
		// fp.path+"/img/space/space-lvl2.png",
		fp.path+"/img/space/space-lvl3.png",
		fp.path+"/img/space/space-lvl4.png",
		fp.path+"/img/space/space-lvl5.png",
		// fp.path+"/img/space/space-lvlb_1.png",
		fp.path+"/img/space/space-home.png",
		fp.path+"/img/comet-canvas.png",
		fp.path+"/img/stars-sm.png",
		fp.path+"/img/stars-lg.png",
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

		pixelate(sprite);

		sprite.vy = 0;

		return sprite;

	}
	function pixelate(obj){
		var filter = new PIXI.PixelateFilter();
		filter.size = new PIXI.Point(6,6);
		obj.filters = [filter];

	}//end pixelate function

	function parallax_bg(d){
		space_tile.tilePosition.x -= .5;
		bg_stars.tilePosition.x -=  1.5;
		fg_stars.tilePosition.x -=  3;		
	}//end parallax_bg function 

	var now, delta;
	
	function setup(){
		the_level = 0;

		now = window.performance.now();
		delta = Math.min(now - timer, 100);
		timer = now;

		game_scene = new PIXI.DisplayObjectContainer();
		alien_scene = new PIXI.DisplayObjectContainer();
		
		game_over_scene = new PIXI.DisplayObjectContainer();
		
		stage.addChild(game_scene);
		
		stage.addChild(game_over_scene);

		game_over_scene.visible = false;

		
		var spacebg_texture = PIXI.TextureCache[fp.path+"/img/space/"+levels[use_lvl].space_bg+".png"];
		var trans_texture = PIXI.TextureCache[fp.path+"/img/comet-canvas.png"];
		var stars_sm_texture = PIXI.TextureCache[fp.path+"/img/stars-sm.png"];
		var stars_lg_texture = PIXI.TextureCache[fp.path+"/img/stars-lg.png"];
		
		rocketship = create_sprite('/img/spaceship.png');
		
		space_tile = new PIXI.TilingSprite(spacebg_texture, stageW, stageH);
		space_container = new PIXI.TilingSprite(trans_texture, stageW, stageH);

		bg_stars = new PIXI.TilingSprite(stars_sm_texture, stageW, stageH);
		fg_stars = new PIXI.TilingSprite(stars_lg_texture, stageW, stageH);
		
		game_scene.addChild(space_tile);
		game_scene.addChild(space_container);
		game_scene.addChild(bg_stars);
		
		game_scene.addChild(rocketship);
		game_scene.addChild(alien_scene);

		game_scene.addChild(fg_stars);
		
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
		
		play_message = create_txt('SPACE LEAP', 50, 'Helvetica', '#0FF');
		play_help = create_txt('Press enter to play', 24, 'Helvetica', '#0FF');
		game_over_message = create_txt('GAME OVER!', 50, 'Helvetica', '#FF0000');
		win_message = create_txt('YOU WIN!', 50, 'Helvetica', "#00FF00");

		play_message.x = (stageW / 2) - (play_message.width / 2);
		play_message.y = stageH / 2;

		play_help.x = (stageW / 2) - (play_help.width / 2);
		play_help.y = (stageH / 2) + 150;

		game_over_message.x = (stageW / 2) - (game_over_message.width / 2);
		game_over_message.y = stageH / 2;

		win_message.x = (stageW / 2) - (win_message.width / 2);
		win_message.y = stageH / 2;


		game_scene.addChild(game_over_message);
		game_scene.addChild(win_message);
		game_scene.addChild(play_message);
		game_scene.addChild(play_help);

		game_over_message.visible = false;
		win_message.visible = false;
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
	}//end setup function

	function gameLoop(){
		requestAnimFrame(gameLoop);
		
		state();

		render.render(stage);
	}//end gameLoop function

	function play(){
		var now = window.performance.now();
		var delta = Math.min(now - timer, 100);
		timer = now;
		
		if(is_played){
			var lego = window.performance.now();			
			

			the_level = level_check(45);
			// the_level = 1;
			console.log(the_level);
		}
		// console.log(the_level);
		switch(the_level){
			case 1:
				use_lvl = 'l1';
				break;
			case 2:
				use_lvl = 'l2';
				break;
			case 3:
				use_lvl = 'l3';
				break;
			case 4:
				use_lvl = 'l4';
				break;
			case 5:
				use_lvl = 'l5';
				break;
			default:
				use_lvl = 'l0';

		}
		// console.log(use_lvl);
		// console.log(levels[use_lvl].space_bg);

		if(!tst_mode){
			parallax_bg(delta)
		}

		id_arry.forEach(function(ai){
			var tl = ai.max - ai.min;

			ai.sprite.y = inc_alian(tl, ai.max, ai.sy);

		});

		alien_scene.children.forEach(function(child){
			if(Math.floor(timer) % 62 == 0){
				alien_firing = true;
				create_lazer('a', child)
			}
			if(!tst_mode){
				child.x -= levels[use_lvl].alien_speed;

			}
			if(coli){
				collection_dection(child);

			}

			if(child.x < -child.width){
				alien_scene.removeChild(child);
				id_arry.splice(0, 1);
			}

		});

		space_container.children.forEach(function(child){
			if(!tst_mode){
				child.x -= levels[use_lvl].comet_speed;
			}
			if(coli){
				collection_dection(child);

			}
			
			if(child.x < -child.width){
				space_container.removeChild(child);
			}	

		});

		if(is_played){
			rocketship.visible = true;

			game_scene.removeChild(play_message);
			game_scene.removeChild(play_help);

			create_comet();
			
			if(!tst_mode){
				// console.log(levels[use_lvl].alien_rate);
				if(comet_count_root % levels[use_lvl].alien_rate === 0){
					create_alien();
					comet_count_root ++;
				}
			}else{
				create_alien();
			}
		}
		// console.log(comet_count_root);
	}//end play function

	function end(){

	}//end end function 

	function level_check(ms, points){
		// var time = Math.floor((ms/1000));
		var time = ms;
		if(is_played){
			if(time > 30 && time < 60){
				current_level = 2;
				update_bg();

			}else if(time > 60 && time < 90){
				current_level = 3;
				update_bg();

			}
			// else if(time > 90 && time < 120){
			// 	current_level = 4;
			// 	update_bg();

			// }else if(time > 120 && time < 150){
			// 	current_level = 5;
			// 	update_bg();

			// }
			else if(time > 150){
				is_played = false;
				win_message.visible = true;
			}else{
				current_level = 1;
				update_bg();

			}
		}
		

		return current_level;
	}//end level_check

	function inc_alian(travel_length, max, start){

		angle += 0.005;
		new_pos_rad = (((Math.sin(angle * (2 * Math.PI))*travel_length)+start));

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
					create_lazer('r', rocketship);
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

	function create_alien(){
		// console.log(levels[use_lvl].space_bg);
		if(!tst_mode){
			var last = alien_scene.children[alien_scene.children.length - 1];
			
			if(alien_scene.children.length == 0 || last.x < (stageW - 200)){
				var alien = create_sprite('/img/alien_sm.gif');

				alien.y = Math.floor(Math.random() * (stageH - 105));

				alien.x = stageW + 200;

				alien_scene.addChild(alien);

				var min_val = rand_num_gen(0, half_stage_h),
					max_val = rand_num_gen(half_stage_h, (stageH - 50));

				
				id_arry.push({id: alien_count, sprite: alien, dir: false, min: min_val, max: max_val, sy: alien.y});

				alien_count++;
				ma = false;
			}

		}else{
			if(jjj){
				var alien = create_sprite('/img/alien_sm.gif');

				alien.y = Math.floor(Math.random() * (stageH - 105));

				alien.x = stageW - 400;

				alien_scene.addChild(alien);

				var min_val = rand_num_gen(0, half_stage_h),
					max_val = rand_num_gen(half_stage_h, (stageH - 50));


				
				id_arry.push({id: alien_count, sprite: alien, dir: false, min: min_val, max: max_val, sy: alien.y});


				alien_count++;
					jjj = false;


			}
		}

		
	}//end create alien function
	function create_comet(){
		// console.log('go ' + qq);
		var last = space_container.children[space_container.children.length - 1];
		
		if(space_container.children.length == 0 || last.x < (stageW - levels[use_lvl].comet_rate)){
			comet_count_root++;
			// console.log(comet_count_root);

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

			space_container.addChild(comet);


			comet_count++;

		}
	}//end create comet function


	function inc_lazer(the_lazer, direction){
		// console.log(the_lazer);
		beta = 0.5 * delta;
		// the_lazer.x = rocketship.position.x + 80;
		if(direction === 'pos'){
			var ang = the_lazer.x += beta;

		}else if(direction === 'neg'){
			var ang = the_lazer.x -= beta;
		}
		return ang;
	}//end inc_alien_lazer


	function create_lazer(type, obj){
		if(type === 'r'){
			var lazer_src = '/img/lazer.jpg';
			var the_arr = lazers;
			var pos_x = 80,
				pos_y = 40;
			var firing = is_firing;

		}else if(type === 'a'){
			var lazer_src = '/img/lazer-r.jpg';
			var the_arr = a_lazers;
			var pos_x = -20,
				pos_y = 30;
			var firing = alien_firing;
		}

		var new_lazer = create_sprite(lazer_src);
		var pos = obj.position;

		new_lazer.anchor.x = 0.5;
		new_lazer.anchor.y = 0.5;
		new_lazer.position.x = pos.x + pos_x;
		new_lazer.position.y = pos.y + pos_y;

		the_arr.push(new_lazer);
		stage.addChild(new_lazer);

		firing = false;
		// console.log(the_arr);

	}//end create_lazer function
	function update_bg(){
		is_played = false;
		var this_texture = PIXI.TextureCache[fp.path+"/img/space/"+levels[use_lvl].space_bg+".png"];
		space_tile.setTexture(this_texture);
		is_played = true;
		// game_scene.addChild(space_tile);

	}
	function lazer_animate(type){
		var this_arr;
		if(type === 'r'){
			for(var i = 0; i < lazers.length; i++){
				// console.log(lazers[i].x);
				if(lazers[i].x < stageW+100){
					lazers[i].x = inc_lazer(lazers[i], 'pos');
					for(var x = 0; x<alien_scene.children.length; x++){
						var this_alien = alien_scene.children[x];
						
						if(hitTestRectangle(lazers[i], this_alien)){
							if(coli){
								alien_scene.removeChild(this_alien);
								stage.removeChild(lazers[i]);
								lazers.splice(i, 1);
								id_arry.splice(x, 1);
							}
						}

					}

				}else{
					lazers.splice(i, 1);
				}
			}
		}else if(type === 'a'){
			for(var i = 0; i < a_lazers.length; i++){
				// console.log(lazers[i].x);
				if(a_lazers[i].x < stageW+100){
					a_lazers[i].x = inc_lazer(a_lazers[i], 'neg');
					if(hitTestRectangle(a_lazers[i], rocketship)){
						if(coli){
							collided = true;

							game_over_message.visible = true;

							is_played = false;
						}
					}
				}else{
					a_lazers.splice(i, 1);
				}
			}
		}

	}//end Lazer animation
	function animate(){
		// if(is_firing){
		lazer_animate('r');
		lazer_animate('a');

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

	}//end restart_game_lisnter function
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
	}//end page_state
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

	};//end hitTestRectangle function

})(jQuery);