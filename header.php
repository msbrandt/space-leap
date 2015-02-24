<?php 
?>
<!DOCTYPE HTML>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?> >
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?> >
<![endif]-->
<!--[if !(IE 7) | !(IE 8)  ]><!-->
<html <?php language_attributes(); ?> >
<!--<![endif]-->
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, user-scalable=no width=device-width" />
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>" />

	<title>
		<?php
		 wp_title( '|', ture, 'right');
		 bloginfo( 'name');
		 ?>
	</title>

	<?php wp_head(); ?>


</head>
<!-- Start of navbar -->
<body <?php body_class(); ?>>
	

	<!-- <div class="clear"></div> -->
<div class="main_content">
       <header>
              <nav class="navbar-inverse my-nav" role="navigation">

              </nav>

       </header>