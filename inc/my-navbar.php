<?php
require get_template_directory() . '/inc/bs/bs-navbar.php';

function blank_nav() {
	$items_wrap = '<ul id="%1$s" class="%2$s">%3$s</ul>';
	bs_navbar( array( 'theme_location' => 'primary', 'container_id' => 'primary', 'items_wrap' => $items_wrap ) );
}
?>
