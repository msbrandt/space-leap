jQuery(function($){
	// var decks = $('.deck'),
	// 	audios = decks.find('audio');
	// var fader = $('#sli');
	// var activate_btn = $('.active-deck-button');
	// var toggle_btns = $('.toggle-button');
	// var loaded_tracks = $('#loaded-playlist > ul > li');
	// var volume_controls = $('.v-slider').children('.vo-slider');
	// var wave_scrub = $('.wave-prog');
	// var s = $('section');
	// var windowH = $(window).height();
	// var refresh = $('#reload-playlist');
	// console.log(refresh);
	// $(window).on('load', function(){
	// 	volume_controls.attr('value', 1);
	// 	fader.attr('value', 0);
	// 	wave_scrub.attr('value', 0);
	// 	// if(is_mobile){
	// 	// 	s.addClass('mobile-mix');
	// 	// }
	// 	// if(windowH > 1000){
	// 	// 	s.height(1000);
	// 	// }else{
	// 	// 	s.height(windowH);
	// 	// }
	// });

	// SC.initialize({
 //  		client_id: '7d9677620e4d860d055604be6c25d43a'
	// });

	// activate_btn.on('click', function(e){
	// 	activate_deck($(this));
	// });

	// loaded_tracks.on('click', function(e){
	// 	e.preventDefault();
	// 	select_track($(this));
	// });

	// volume_controls.on('input', function(){
	// 	change_volume($(this));
	// });

	// toggle_btns.click(function(e){
	// 	e.preventDefault();
	// 	play_pause(e, true);

	// });
	// refresh.on('click', function(){
	// 	refresh_list();
	// });
	// var act_pos = -1;
	// var loaded_list = $('#loaded-playlist ul li');
	// var ll = loaded_list.length -1;
	// $(window).on('keypress', function(e){
	// 	var the_key = e.keyCode;
	// 	var x = e.which;
	// 	var active_d = $(document).find('.active').parent();

	// 	if(the_key == 37 || the_key == 39){
	// 		fader.focus();
	// 	}
	// 	if(the_key == 38){
	// 		if(act_pos > 0){
	// 			act_pos--;
	// 		}

	// 	}else if(the_key == 40){
	// 		if(act_pos < ll){
	// 			act_pos++;
	// 		}
	// 	};
	// 	loaded_list.removeClass('act-song');
	// 	$(loaded_list[act_pos]).addClass('act-song');
	// 	// loaded_list.scrollTo(800);

	// 	if(the_key == 13){
	// 		var to_ad = $(document).find('.act-song');
	// 		select_track(to_ad);
	// 	}

	// 	if(x == 32){
	// 		var active_btn = $(document).find('.active');
			
	// 		if (active_btn.length > 0) {
	// 			var the_tog_deck = active_btn.parent().find('.toggle-button');
	// 			play_pause(the_tog_deck, false);
	// 		};

	// 	}else if(x == 96){
	// 		var the_button = $(document).find('.active-deck-button');
	// 		// console.log(the_button);
	// 		if(the_button.hasClass('active')){
	// 			var deck_to_activate = $(document).find('.active-deck-button').not('.active');
	// 		}else{
	// 			var deck_to_activate = $(the_button[0]);
				
	// 		}
	// 		activate_deck(deck_to_activate);

	// 	}else if(x == 8){
	// 		var decks = $(document).find('.toggle-button');
	// 		for(var i=0; i<decks.length; i++){
	// 			var cd = decks[i];
	// 			play_pause(cd, false);
	// 		}
	// 	};

	// });

	// function activate_deck(button){
	// 	var tog_btn = button,
	// 		act_this_deck = tog_btn.parent(),
	// 		the_vinyl = act_this_deck.find('.vinyl');

	// 	activate_btn.removeClass('active');
	// 	activate_btn.children().removeClass('glyphicon-remove-sign');
		
	// 	tog_btn.addClass('active has-been');
	// 	tog_btn.children().addClass('glyphicon-remove-sign');

	// 	$('audio').removeClass('active-p');
	// 	the_vinyl.addClass('active-p');
	// }
	// function refresh_list(){
	// 	var list_container = $('#loaded-playlist ul');
	// 	$.ajax({
	// 		url: sc.ajaxurl,
	// 		type: 'GET',
	// 		data: {
	// 			action: 'refresh_list',
	// 		},
	// 		success: function(response){
	// 			list_container.children().remove();
	// 			list_container.append(response);
	// 			console.log(response);
	// 			// return false;
	// 		}
	// 	});		
	// }
	// function select_track(the_track){
	// 	var this_track_obj = the_track,
	// 		this_track_txt = this_track_obj.text(),
	// 		this_track_id = this_track_obj.data('id'),
	// 		this_duration = this_track_obj.data('duration'),
	// 		this_wave = this_track_obj.data('wave');
	// 	var l_this_deck = $('.active-deck-button.active').parent(),
	// 		active_deck = l_this_deck.find('audio');

	// 	var dt_lb = l_this_deck.find('.total-time'),
	// 		wave_lb = l_this_deck.find('.progress');
		
	// 	var text_durration = convert_time(this_duration);

	// 	dt_lb.text(text_durration);
	// 	wave_lb.css('background-image', 'url("'+this_wave+'")');
	// 	l_this_deck.find('.wave-prog').attr('max', this_duration).attr('value', 0);
	// 	l_this_deck.find('.now-playing').text(this_track_txt);
		
	// 	SC.stream('tracks/'+this_track_id, function(sound){
	// 		var raw_url = sound.url,
	// 			split_url = raw_url.split('.com');
	// 			use_url = split_url[0]+'.com/'+split_url[1];
	// 		active_deck.prop('src', use_url);
	// 		// active_deck.prop('defaultPlaybackRate', 0.5);
	// 		// console.log(active_deck.prop('defaultPlaybackRate'));
	// 		active_deck.load();

	// 	});
	// 	$('#loaded-playlist ul li').removeClass('act-song');
	// };
	// function change_volume(controler){
	// 	var this_control = controler,
	// 		control_id = this_control.attr('id'),
	// 		vol_this_deck = $('section').find("[data-volume_control='"+control_id+"']"),
	// 		volume_level = this_control.val();

	// 	vol_this_deck.find('audio').prop('volume', volume_level);
	// }


	// fader.on('input', function(){
	// 	var fader_value = parseFloat(fader.val());
	// 	if(fader_value > 0){
	// 		var new_volume_level = 1,
	// 			silance_volume_level = 1 - fader_value;
	// 			fd_this_deck = $('#deck-b'),
	// 			silance_deck = $('#deck-a');
	// 	} else if(fader_value < 0){
	// 		var new_volume_level = 1,
	// 			silance_volume_level = 1 - (-fader_value),
	// 			fd_this_deck = $('#deck-a'),
	// 			silance_deck = $('#deck-b');
	// 	}else if(fader_value == 0){
	// 		var fd_this_deck = $('#deck-a'),
	// 			silance_deck = $('#deck-b'),
	// 			new_volume_level = 1,
	// 			silance_volume_level = 1;
	// 	}

	// 	fd_this_deck.find('audio').prop('volume', new_volume_level);
	// 	silance_deck.find('audio').prop('volume', silance_volume_level);
	// });

	// wave_scrub.bind('change', function(){
	// 	var this_scrub = $(this),
	// 		wv_this_deck = this_scrub.parents(':eq(1)'),
	// 		wv_this_audio = wv_this_deck.find('audio'),
	// 		wv_ct_lb = wv_this_deck.find('.current-time'),
	// 		seek_value = parseInt(this_scrub.val())/1000;
			
	// 	wv_this_deck.find('.wave-prog').attr('value', this_scrub.val());
	// 	wv_this_audio.prop('currentTime', seek_value);
	// });

	// audios.on('timeupdate', function(){
	// 	var this_audio = this,
	// 		ct_raw = this_audio.currentTime,
	// 		du_raw = this_audio.duration,
	// 		scrb_time = Math.ceil(ct_raw*1000),
	// 		prog = (ct_raw / du_raw) * 100;

		
	// 	var a_this_deck = $(this).parent(),
	// 		ct_lb = a_this_deck.find('.current-time'),
	// 		a_this_scrub = a_this_deck.find('.wave-prog'),
	// 		progress_bar = a_this_deck.find('.progress label');

	// 	var time_secs = Math.floor(ct_raw),
	// 		mins = Math.floor(time_secs/60),
	// 		secs_raw = time_secs - mins * 60;
		
	// 	if(secs_raw > -1 && secs_raw < 10){
	// 		var secs = '0'+secs_raw;
	// 	}else{
	// 		var secs = secs_raw;
	// 	}

	// 	var current_time = mins + ':' + secs;
	// 	ct_lb.text(current_time);
	// 	a_this_scrub.attr('value', scrb_time);
	// 	// progress_bar.css('width', prog + '%');

	// 	if(ct_raw >= du_raw){
	// 		a_this_deck.find('.vinyl').removeClass('acvitve-v');
	// 		a_this_deck.find('.toggle-button').removeClass('sc-play').addClass('sc-stop');
	// 		a_this_deck.find('.toggle-button').children().removeClass('glyphicon-pause').addClass('glyphicon-play');
	// 	}
	// });

	// function play_pause(the_deck, is_clicked){
	// 	// console.log(the_deck);
	// 	if(is_clicked){
	// 		var the_toggle = $(the_deck.currentTarget);
	// 	}else{
	// 		var the_toggle = $(the_deck);
	// 	}
		
	// 	var the_player_id = the_toggle.parent().find('audio').attr('id'),
	// 		the_player = document.getElementById(the_player_id),
	// 		the_vinyl = the_toggle.parent().find('.vinyl');

	// 	// console.log(the_toggle);

	// 	if(the_toggle.hasClass('sc-stop')){
	// 		the_toggle.removeClass('sc-stop').addClass('sc-play');
	// 		the_toggle.children().removeClass('glyphicon-play').addClass('glyphicon-pause');
	// 		the_vinyl.addClass('acvitve-v');
	// 		the_player.play();

	// 	}else if(the_toggle.hasClass('sc-play')){
	// 		the_toggle.removeClass('sc-play').addClass('sc-stop');
	// 		the_toggle.children().removeClass('glyphicon-pause').addClass('glyphicon-play');
	// 		the_vinyl.removeClass('acvitve-v');
	// 		the_player.pause();
	// 	};		
	// }


	// function convert_time(time){
	// 	var minutes = Math.floor((time % 3600000) / 60000);
	// 	var sec = Math.floor(((time % 360000) % 60000) / 1000);
	// 	// console.log(sec);
			
	// 	if(sec > 0 && sec < 10){
	// 		if(sec < 6){
	// 			var use_sec = '0'+Math.ceil(sec);
	// 		}else{
	// 			var use_sec = '10';
	// 		}

	// 	}else{
	// 		var use_sec = sec;
	// 	}
	// 	var the_time = minutes + ':' + use_sec;
	// 	return the_time; 
	// };

	// function check_mobile(){
	// 	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
 // 			var is_mobile = true;
	// 	}else{
	// 		var is_mobile = false;
	// 	}
	// 	return is_mobile;
	// }

});