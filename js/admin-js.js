jQuery(function($){
	var button = $('#sc-load-btn');
	var lda = $('#loaded > ul');
	var newData = [];

	button.on('click', function(e){
		var the_file = document.getElementById('input');
		var x = the_file.files[0];

		if(!x){
			alert('Please add file to load!');
		}else{
			remove_tbl();
			readFile(x);
		}

	});

	function readFile(file) {

		var reader = new FileReader();
		// console.log(reader);
		reader.onload = function(e){
			var text = reader.result;
			var lines = text.split(/[\r\n|\n]+/);
			for(var i =0; i<lines.length; i++){
				newData.push(lines[i]);

			}
			$('#select-from img').show();
			select_pl(newData);
		}
		reader.readAsText(file);
	}
	function remove_tbl(){
		var tbl_tr = $('#select-tlb tbody tr');
		tbl_tr.remove();
	}
	function select_pl(new_file){
		var g = JSON.stringify(new_file);
		$.ajax({
			url: sc.ajaxurl,
			type: 'POST',
			data: {
				action: 'select_songs',
				file_lines: g
			},
			success: function(response){
				$('#select-from img').hide();
				// $('#select-to-load .sel-box:eq(0) ul').append(response);
				$('#select-to-load #select-from #select-tlb tbody').append(response);
				return false;
			}
		});
	}

	var b = $('#select-to-load > .sel-box > table > tbody');

	b.on('click', 'tr', function(e){
		var selected = $(this);
		if(selected.hasClass('act')){
			selected.removeClass('act');
		}else if(!selected.hasClass('search-title')){
			selected.addClass('act');
		}
	});

	$('#add-btn').on('click', function(){
		var active = $('#select-to-load > .sel-box > #select-tlb > tbody > tr.act');
		var loaded_tlb = $('#que-to-load > #loaded-tlb > tbody');

		var act_array = [];
		for(var i = 0; i<active.length; i++){
			var current_track = $(active[i]);
			current_track.clone(true).removeClass('act').addClass('temp-sav').appendTo(loaded_tlb);
			current_track.remove();
		}

	});
	$('#save-btn').on('click', function(){
		var in_que = $('#que-to-load > #loaded-tlb > tbody > tr'),
			saved_list = [];

		for(var x = 0; x < in_que.length; x++ ) {

			var current_track = $(in_que[x]);
			if(!current_track.hasClass('db-list')){
				track_title = current_track.html(),
				track_data = current_track.data();
			
				saved_list.push(track_data);			
			}	
		};

		$.ajax({
			url: sc.ajaxurl,
			type: 'POST',
			data: {
				action: 'save_playlist',
				track_list: saved_list
			},
			success: function(response){
				$('#status').html('Songs Saved!');
				$('.temp-sav').removeClass().addClass('db-list');
				// return false;
			}
		});
		
	});

	$('#remove-btn').on('click', function(){
		var to_delete = $('#que-to-load > #loaded-tlb > tbody > tr.act'),
			delete_array = [];
			
			for(var x=0; x<to_delete.length; x++){
				var current_track = $(to_delete[x]).data(),
					t_id = current_track.id;
				delete_array.push(t_id);
			}

		$.ajax({
			url: sc.ajaxurl,
			type: 'POST',
			data: {
				action: 'delete_song',
				delete_data: delete_array
			},
			success: function(response){
				$('#status').html('Songs deleted!').fadeOut(3000);
			}
		});	
		to_delete.remove();

	});

});