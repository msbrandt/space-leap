<h1>Load your playlist here</h1>
<h3 id="status"></h3>
<form id="sc-load">
	<input id="input" type="file" placeholder="select playlist"></input>
	<div id="sc-load-btn">Load</div>
</form>
<div id="select-to-load">
	<div class="sel-box" id="select-from">
		<h3>Please select the songs you would like to load</h3>
		<img src="<?php echo get_template_directory_uri(); ?>/img/pageloaderat.gif">

		<table id="select-tlb" class="admin-tlb">
			<thead>
				<tr>
					<th>SC ID</th>
					<th>Track</th>
					<th>Duration</th>
					<th>Artwork</th>
				</tr>
			</thead>
			<tbody>
			</tbody>

		</table>
	</div>
	<div id="select-buttons">
		<div id="add-btn" class="sel-btn">Add</div>
		<div id="remove-btn" class="sel-btn">Delete</div>
		<div id="save-btn" class="sel-btn">Save</div>

	</div>
	<!-- <div id="select-btn">Select</div> -->

	<div class="sel-box" id='que-to-load'>
		<h3>Songs Loaded</h3>
		<table id="loaded-tlb" class="admin-tlb">
			<thead>
				<tr>
					<th>SC ID</th>
					<th>Track</th>
					<th>Duration</th>
					<th>Artwork</th>
				</tr>
			</thead>
			<tbody>
				<?php load_song_list_tbl(); ?>
			</tbody>

		</table>
	</div>
</div>
<div id="text-area"></div>
