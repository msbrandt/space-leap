<?php
/**
* Create Bootstrap-flavored HTML list of nav menu items.
*
* @since 3.0.0
* @uses Walker_Nav_Menu
*/
class BS_Walker_Nav_Menu extends Walker_Nav_Menu {
	/**
	* Starts the list before the elements are added.
	*
	* @see Walker_Nav_Menu::start_lvl()
	*
	* @since 3.0.0
	*
	* @param string $output Passed by reference. Used to append additional content.
	* @param int $depth Depth of menu item. Used for padding.
	* @param array $args An array of arguments. @see wp_nav_menu()
	*/
	function start_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat( "\t", $depth );
		$output .= "\n$indent<ul class=\"myTHeme-nav\" role=\"menu\">\n";
	}
	/**
	* Ends the list of after the elements are added.
	*
	* @see Walker_Nav_Menu::end_lvl()
	*
	* @since 3.0.0
	*
	* @param string $output Passed by reference. Used to append additional content.
	* @param int $depth Depth of menu item. Used for padding.
	* @param array $args An array of arguments. @see wp_nav_menu()
	*/	
	function end_lvl( &$output, $depth = 0, $args = array() ) {
		$indent = str_repeat( "\t", $depth );
		$output .= "$indent</ul>\n";
	}
	/**
	* Start the element output.
	*
	* @see Walker_Nav_Menu::start_el()
	*
	* @since 3.0.0
	*
	* @param string $output Passed by reference. Used to append additional content.
	* @param object $item Menu item data object.
	* @param int $depth Depth of menu item. Used for padding.
	* @param array $args An array of arguments. @see wp_nav_menu()
	* @param int $id Current item ID.
	*/
	function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {
		$indent = $depth ? str_repeat( "\t", $depth ) : '';
		$class_names = '';
		$classes = array();
		$atts = array();
		$caret = '';

		if ( $item->current || $item->current_item_ancestor || $item->current_item_parent ) {
			$classes[] = 'active';
		}
		$class_names = join( ' ', apply_filters( 'nav_menu_css_class', array_filter( $classes ), $item, $args ) );
		$class_names = $class_names ? ' class="' . esc_attr( $class_names ) . '"' : '';
		$id = apply_filters( 'nav_item_id', 'menu-item-' . $item->ID, $item, $args );
		$id = $id ? ' id="' . esc_attr( $id ) . '"' : '';
		$output .= $indent . '<li' . $id . $class_names . '>';
		$atts['title'] = ! empty( $item->attr_title ) ? $item->attr_title : '';
		$atts['target'] = ! empty( $item->target ) ? $item->target : '';
		$atts['rel'] = ! empty( $item->xfn ) ? $item->xfn : '';
		$atts['href'] = ! empty( $item->url ) ? $item->url : '';
		$atts = apply_filters( 'nav_menu_link_attributes', $atts, $item, $args );
		$attributes = '';
		$this_link = strtolower( $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after);
		$item_output = $args->before;
		$item_output .= '<a href="#myTheme-' . $this_link . '" class="my-nav-button">';
		/** This filter is documented in wp-includes/post-template.php */
		$item_output .= $args->link_before . apply_filters( 'the_title', $item->title, $item->ID ) . $args->link_after;
		$item_output .= '</a>';
		$item_output .= $args->after;
		/**
		* Filter a menu item's starting output.
		*
		* The menu item's starting output only includes $args->before, the opening <a>,
		* the menu item's title, the closing </a>, and $args->after. Currently, there is
		* no filter for modifying the opening and closing <li> for a menu item.
		*
		* @since 3.0.0
		*
		* @see wp_nav_menu()
		*
		* @param string $item_output The menu item's starting HTML output.
		* @param object $item Menu item data object.
		* @param int $depth Depth of menu item. Used for padding.
		* @param array $args An array of wp_nav_menu() arguments.
		*/
		$output .= apply_filters( 'walker_nav_menu_start_el', $item_output, $item, $depth, $args );
	}
	/**
	* Ends the element output, if needed.
	*
	* @see Walker_Nav_Menu::end_el()
	*
	* @since 3.0.0
	*
	* @param string $output Passed by reference. Used to append additional content.
	* @param object $item Page data object. Not used.
	* @param int $depth Depth of page. Not Used.
	* @param array $args An array of arguments. @see wp_nav_menu()
	*/
	function end_el( &$output, $item, $depth = 0, $args = array() ) {
		$output .= "</li>\n";
	}
} // MJM_Walker_Nav_Menu
/**
* Displays a Bootstrap-flavored navigation menu. Uses wp_nav_menu().
*
* @since 3.0.0
*
* @param array $args {
* Optional. Array of nav menu arguments.
*
* @type string $menu Desired menu. Accepts (matching in order) id, slug, name. Default empty.
* @type string $menu_class CSS class to use for the ul element which forms the menu. Default 'nav navbar-nav'.
* @type string $menu_id The ID that is applied to the ul element which forms the menu.
* Default is the menu slug, incremented.
* @type string $container Whether to wrap the ul, and what to wrap it with. Default 'div'.
* @type string $container_class Class that is applied to the container. Default 'collapse navbar-collapse'.
* @type string $container_id The ID that is applied to the container. Default empty.
* @type callback|bool $fallback_cb If the menu doesn't exists, a callback function will fire.
* Default is 'wp_page_menu'. Set to false for no fallback.
* @type string $before Text before the link text. Default empty.
* @type string $after Text after the link text. Default empty.
* @type string $link_before Text before the link. Default empty.
* @type string $link_after Text after the link. Default empty.
* @type bool $echo Whether to echo the menu or return it. Default true.
* @type int $depth How many levels of the hierarchy are to be included. 0 means all. Default 0.
* @type string $walker Allows a custom walker class to be specified. Default new MJM_Walker_Nav_Menu().
* @type string $theme_location Theme location to be used. Must be registered with register_nav_menu()
* in order to be selectable by the user.
* @type string $items_wrap How the list items should be wrapped. Default is a ul with an id and class.
* Uses printf() format with numbered placeholders.
* }
* @return mixed Menu output if $echo is false, false if there are no items or no menu was found.
*/
function bs_navbar( $args, $search = false ) {
	$defaults = array(
		'container_class' => 'myTheme_nav',
		'menu_class' => 'navbar-myTheme',
		'walker' => new BS_Walker_Nav_Menu(),
		'theme_location' => ''
	);
	$args = wp_parse_args( $args, $defaults );
	?>
	<div class="navbar-header">
	<?php if ( get_header_image() ) : ?>
		<a class="navbar-img">
			<span class="navbar-txt"<?php echo sprintf( ' style="color:#%s;"', get_header_textcolor() ); ?>><?php bloginfo( 'name' ); ?></span>
		</a>
	<?php else: ?>
	<?php endif; ?>
	</div>
	<?php
	wp_nav_menu( $args );
}
?>