<?php 
/**
*
* @subpackage sc-playlist
* @since Today
*/

 get_header(); ?> 

<section id='main'>
	<div id="game">
		<h1>Space Leap</h1>
		<span>Play</span>
	</div>
	<!-- <div id="output"></div> -->
<!-- 	<div class="deck" id="deck-a" data-volume_control="vo-a">
		<audio class="audio" id="au-a"></audio>

		<div class="active-deck-button"><div class="glyphicon"></div></div>
		<div class="vinyl">
				<div class="time-display">
					<span class="current-time">0:00</span>
					<span>/</span>
					<span class="total-time">0:00</span>
				</div>
				<div class="vinyl-layer0">
					<div class="vinyl-layer1">
						<div class="vinyl-layer2">

						</div>
					</div>
				</div>
		</div>

		<div class="progress">
			<input class="wave-prog" value="0" id="wave-a" type="range" min='0' max="">
			
		</div>
		<div class="display">
			<div class="now-playing">none</div>
		</div>
		<div class="toggle-button sc-stop" id="tog-a">
			<div class="glyphicon glyphicon-play"></div>	
		</div>
	</div>

	<div class="deck" id="deck-b" data-volume_control="vo-b">
		<audio class="audio" id="au-b"></audio>

		<div class="active-deck-button"><div class="glyphicon"></div></div>

			<div class="vinyl">
				<div class="time-display">
					<span class="current-time">0:00</span>
					<span>/</span>
					<span class="total-time">0:00</span>
				</div>
				<div class="vinyl-layer0">
					<div class="vinyl-layer1">
						<div class="vinyl-layer2">

						</div>
					</div>
				</div>
			</div>

		<div class="progress">

			<input class="wave-prog" value="0" id="wave-b" type="range" min='0' max="">

		</div>
		<div class="display">
			<div class="now-playing">none</div>
		</div>
		<div class="toggle-button sc-stop" id="tog-b">
			<div class="glyphicon glyphicon-play"></div>	
		</div>
	</div>
	<div id="volum">
		<div class='vol-container'>
			<div class="v-slider" id="v-a">
				<input type="range" min="0" max="1" value="0" step="0.05" class="vo-slider" id='vo-a'>
			</div>
			<div class="v-slider" id="v-b">
				<input type="range" min="0" max="1" value="0" step="0.05" class="vo-slider" id='vo-b'>		
			</div>
		</div>
	</div>
	<div id="slider">
		<input type="range" min="-1" max="1" value="0" step=".05" id="sli">
	</div>
<div id="reload-playlist"><span class="glyphicon glyphicon-refresh"></span></div>

<div id="loaded-playlist">
	<ul>
	<?php
		load_song_list_li();
	?>
	</ul>
</div> -->
</section>

<!-- <audio src='http://api.soundcloud.com/tracks/175656698/stream?client_id=7d9677620e4d860d055604be6c25d43a' controls="controls"></audio> -->
<?php get_footer(); ?>