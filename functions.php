<?php
 require get_template_directory() . '/inc/my-navbar.php';

/**
 * blank setup.
 *
 * @since myTheme 1.0
 */
function blank_setup(){
	/**
	* Register wp nav menu to create custom navbars
	*
	* @since blank 1.0 
	*
	*/
	add_theme_support( 'html5' );

	register_nav_menu( 'primary', __( 'Primary Menu', 'blank') );

	add_theme_support( 'post-thumbnails' );

}
add_action( 'after_setup_theme', 'blank_setup' );

/**
 * Enqueue scripts and styles for the front end.
 *
 * @since blank 1.0
 *
 * @return void
 */
function blank_scripts() {
	// Add Lato font, used in the main stylesheet.
	// wp_enqueue_style( 'blank-lato', blank_font_url(), array(), null );

	// Load main stylesheet.
	wp_enqueue_style( 'blank-bootstrap', get_template_directory_uri() . '/css/bootstrap.min.css');
	wp_enqueue_style( 'blank-style', get_stylesheet_uri());
	wp_enqueue_style( 'blank-fonts', '//fonts.googleapis.com/css?family=Raleway|Open+Sans|Ubuntu|Ubuntu+Condensed|Oswald|Press+Start+2P' );
	wp_enqueue_script( 'soundcloud', '//connect.soundcloud.com/sdk.js' ); 
	wp_enqueue_script( 'blank-bootstrapjs', get_template_directory_uri() . '/js/bootstrap.min.js', array( 'jquery' ), '20131209', true );
	
	wp_register_script( 'sc-script', get_template_directory_uri() . '/js/functions.js', array( 'jquery' ), '20131209', true );
	wp_localize_script( 'sc-script', 'sc', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' ),
	) );	
	wp_enqueue_script( 'sc-script' );

	wp_enqueue_script( 'leapjs-source', get_template_directory_uri() . '/js/leap.js', array( 'jquery' ), '20131209', true );
	wp_enqueue_script( 'leapjs-plugins', get_template_directory_uri() . '/js/leap-plugins.js', array( 'jquery' ), '20131209', true );
	
	wp_enqueue_script( 'fps', get_template_directory_uri() . '/js/fps.js', array( 'jquery' ), '20131209', true );
	
	
	wp_enqueue_script( 'pixijs', get_template_directory_uri() . '/inc/pixijs/bin/pixi.dev.js', array( 'jquery' ), '20131209', true );
	

	wp_register_script( 'leapjs-fn', get_template_directory_uri() . '/js/leap-functions-old.js', array( 'jquery' ), '20131209', true );
	// wp_register_script( 'leapjs-fn', get_template_directory_uri() . '/js/leap-functions-tst.js', array( 'jquery' ), '20131209', true );
	// wp_register_script( 'leapjs-fn', get_template_directory_uri() . '/js/leap-functions.js', array( 'jquery' ), '20131209', true );
	
	wp_localize_script( 'leapjs-fn', 'fp', array(
		'path' => get_template_directory_uri(),
	) );	
	wp_enqueue_script( 'leapjs-fn' );

}
add_action( 'wp_enqueue_scripts', 'blank_scripts' );

function add_admin_stuff(){
	wp_enqueue_style( 'admin-style', get_template_directory_uri() . '/css/admin-styles.css' );
	wp_register_script( 'admin-script', get_template_directory_uri() . '/js/admin-js.js', array( 'jquery' ), '20131209', true );
	
	wp_localize_script( 'admin-script', 'sc', array(
		'ajaxurl' => admin_url( 'admin-ajax.php' ),
	) );
	wp_enqueue_script( 'admin-script' );

}
add_action( 'admin_enqueue_scripts', 'add_admin_stuff' );

/**
 * Added dashboard icon for soundcloud plugin
 *
 * @since blank 1.0
 *
 * @return void
 */

function sc_menu_page() {
	add_menu_page( 'SC-Loader', 'SC-Loader', 'manage_options', 'sc-list', 'sc_list_page', 'dashicons-format-audio', '80' );
	add_theme_page( 'Theme Options', 'Theme Options', 'manage_options', 'sc-opt-page.php', 'sc_opts');
}
add_action( 'admin_menu', 'sc_menu_page' );
function sc_opts(){
	include get_template_directory() . '/admin/sc-opt-page.php';
}
function sc_list_page() {
	include get_template_directory() . '/admin/sc-admin.php';
}

function install_table(){

	global $wpdb;

	$table_name = $wpdb->prefix . 'sc_sp_alpha';

	$sql = "CREATE TABLE " . $table_name . "(
		song_id MEDIUMINT NOT NULL AUTO_INCREMENT,
		sc_id BIGINT NOT NULL,
		song_title MEDIUMTEXT NOT NULL,
		song_duration MEDIUMINT NOT NULL,
		sc_wave MEDIUMTEXT NOT NULL,
		sc_art MEDIUMINT NOT NULL,
		PRIMARY KEY  song_id (song_id)
		);";
	require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
	dbDelta( $sql );
}

add_action( 'init', 'install_table');

function remove_table(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'sc_sp_alpha';

	$wpdb->query("DROP TABLE IF EXISTS $table_name;");

}
add_action( 'switch_theme', 'remove_table');

function refresh_list_handler(){
	echo load_song_list_li();
	exit();
}

add_action( 'wp_ajax_refresh_list', 'refresh_list_handler');
add_action( 'wp_ajax_nopriv_refresh_list', 'refresh_list_handler' );

function select_songs_handler(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'sc_sp_alpha';
	$the_file = json_decode( stripcslashes( $_REQUEST['file_lines']), true);

	require_once get_template_directory() .'/Services/Soundcloud.php';
	
	$client = new Services_Soundcloud('7d9677620e4d860d055604be6c25d43a', 'ecbbaf33f2f146a8ebb92d195074e219');
	$client->setCurlOptions(array(CURLOPT_FOLLOWLOCATION => 1) );

	foreach ($the_file as $f) {
		$seachTracks = json_decode($client->get('tracks', array('q'=> $f, 'limit'=>5)));
		echo '<tr class="search-title"><td colspan="4">'.$f.'</td></tr>';
		foreach ($seachTracks as $track) {
			$t = $track->title;
			$t_id = $track->id;
			$t_wave = $track->waveform_url;
			$t_d = $track->duration;
			$t_a = $track->artwork_url;

			$new_duration = convert_duration($t_d);

			$tlb_str = '<tr data-title="'.$t.'" data-wave="'.$t_wave.'" data-duration="'.$t_d.'"data-ID="'.$t_id.'">'.
							'<td id="sc-id">'.$t_id.'</td>'.
							'<td id="t-title">'.$t.'</td>'.
							'<td id="t-duration">'.$new_duration.'</td>'.
							'<td id="t-art"><div class="artwork" style="backgorund-url: url('.$t_a.')"></div></td>'.
							'<td id="t-wave" class="hidden-data">'.$t_wave.'</td>'.
						'</tr>';

			$this_str = '<li data-title="'.$t.'" data-wave="'.$t_wave.'" data-duration="'.$t_d.'"data-ID="'.$t_id.'">'.$t.'</li>';
			// echo $this_str;
			echo $tlb_str;

		}

	}
	
	exit();	
}
add_action( 'wp_ajax_select_songs', 'select_songs_handler');

function save_playlist_handler(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'sc_sp_alpha';
	$saved_list = $_REQUEST['track_list'];
	
	foreach ($saved_list as $file) {
		var_dump($file);
		$sc_title = $file['title'];
		$sc_id = $file['id'];
		$sc_duration = $file['duration'];
		$sc_wave = $file['wave'];
		$sc_art = $file['art'];

		$wpdb->insert( 
			$table_name, 
			array(
			'song_id'=> '',
			'sc_id'=>$sc_id,
			'song_title'=>$sc_title,
			'song_duration'=>$sc_duration,
			'sc_wave'=>$sc_wave,
			'sc_art'=>$sc_art
			),
			array(
				'%d',
				'%d',
				'%s',
				'%d',
				'%s',
				'%s'
				)
			);
	}

	exit();
}
add_action( 'wp_ajax_save_playlist', 'save_playlist_handler');

function delete_song_handler(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'sc_sp_alpha';
	$to_delete =  $_REQUEST['delete_data'];

	foreach ($to_delete as $track_id) {
		$wpdb->delete( $table_name, array( 'sc_id' => $track_id ) );	
	}
	
	exit();
}
add_action( 'wp_ajax_delete_song', 'delete_song_handler');

function load_song_list_tbl(){
	global $wpdb;
	$table_name = $wpdb->prefix . 'sc_sp_alpha';
	
	$this_q = $wpdb->get_results("SELECT * FROM " . $table_name . "");
	foreach ($this_q as $s) {
		$read_duration = convert_duration($s->song_duration);
		$tlb_str =  
			'<tr class="db-list" data-title="'.$s->song_title.'" data-wave="'.$s->sc_wave.'" data-duration="'.$s->song_duration.'"data-ID="'.$s->sc_id.'">'.
				'<td id="sc-id">'.$s->sc_id.'</td>'.
				'<td id="t-title">'.$s->song_title.'</td>'.
				'<td id="t-duration">'.$read_duration.'</td>'.
				'<td id="t-art"><div class="artwork" style="backgorund-url: url('.$t_a.')"></div></td>'.
				'<td id="t-wave" class="hidden-data">'.$s->sc_wave.'</td>'.
			'</tr>';
		// $the_str = '<li class="db-list" data-wave="'.$s->sc_wave.'" data-duration="'.$s->song_duration.'"data-ID="'.$s->sc_id.'">'.$s->song_title.'</li>';
		echo $tlb_str;
	}

}
function load_song_list_li(){
	global $wpdb;

	$table_name = $wpdb->prefix . 'sc_sp_alpha';
	$this_q = $wpdb->get_results("SELECT * FROM " . $table_name . "");
	foreach ($this_q as $s) {
		$the_str = '<li class="db-list" data-wave="'.$s->sc_wave.'" data-duration="'.$s->song_duration.'"data-ID="'.$s->sc_id.'">'.$s->song_title.'</li>';
		echo $the_str;
	}
}

function convert_duration($mili){
	// $seconds = floor($mili / 1000);
	// $minutes = floor($seconds / 60);

	// // $minutes = floor($mili / 60);
	// // $minutes = $minutes % 60;

	// $time = $minutes . ':' . $seconds;
	$input = $mili;

	$usec = $input % 1000;
	$input = floor($mili / 1000);

	$seconds = $input % 60;
	$input = floor($input / 60);

	$minutes = $input % 60;
	$input = floor($input / 60);


	$time = $minutes.':'.$seconds;
	return $time;
}

// function load_songs($track_list){
// 	global $wpdb;
// 	$table_name = $wpdb->prefix . 'sc_sp_alpha';

// 	// var_dump( $track_list );
// 	require_once get_template_directory() .'/Services/Soundcloud.php';
	
// 	$client = new Services_Soundcloud('7d9677620e4d860d055604be6c25d43a', 'ecbbaf33f2f146a8ebb92d195074e219');
// 	$client->setCurlOptions(array(CURLOPT_FOLLOWLOCATION => 1) );
	
// 	foreach ($track_list as $track) {
// 		$raw_track = explode('-', $track);
// 		$artist = $raw_track[0];
// 		$song = $raw_track[1];
			
	
// 		$tracks = json_decode($client->get('tracks', array('q'=> $track)));	

// 		$track_arry = array();

// 		foreach ($tracks as $tra) {

// 			$track_title = $tra->title;
// 			$this_id = $tra->id;
// 			$this_duration = $tra->duration;
// 			$wave = $tra->waveform_url;
// 			$bpm = $thr->bpm;
// 			$dl = $thr->download_url;
// 			// echo $this_id;
// 			// var_dump($tra);
// 			$the_str = '<li data-art="'.$wave.'" data-bpm="'.$dl.'" data-duration="'.$this_duration.'"data-ID="'.$this_id.'">'.$track_title.'</li>';
// 			array_push($track_arry, $the_str);
// 		}
// 			// echo $bpm . '<br />';

// 		echo $track_arry[0];
// 	}

// }

// add_action( 'wp_ajax_nopriv_otn_ogs_query', 'otn_ogs_query' );

?>