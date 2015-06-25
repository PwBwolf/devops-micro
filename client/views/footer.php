<footer>

<div class="container clearfix">
<div class="ftrchannels">
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Sports
<?php else: ?>
Deportes
<?php endif; ?>
</h4>
<?php
            wp_nav_menu( array(
                'menu'              => 'menu',
                'theme_location'    => 'sports',
                'depth'             => 2)
            );
			  
        ?>
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Kids
<?php else: ?>
Niños
<?php endif; ?>

</h4>
<?php
            wp_nav_menu( array(
                'theme_location'    => 'kids',
                'depth'             => 2)
            );
			  
        ?>
        
        
<h4>General</h4>
<?php
            wp_nav_menu( array(
  
                'theme_location'    => 'general',
                'depth'             => 2)
            );
			  
        ?>





</div>

<div class="ftrchannels">
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
News
<?php else: ?>
Noticias
<?php endif; ?>


</h4>
<?php
            wp_nav_menu( array(

                'theme_location'    => 'news',
                'depth'             => 2)
            );
			  
        ?>

</div>

<div class="ftrchannels">
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Music
<?php else: ?>
Musica
<?php endif; ?>


</h4>
<?php
            wp_nav_menu( array(

                'theme_location'    => 'music',
                'depth'             => 2)
            );
			  
        ?>
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Educational
<?php else: ?>
Educacional
<?php endif; ?>

</h4>
<?php
            wp_nav_menu( array(

                'theme_location'    => 'educational',
                'depth'             => 2)
            );
			  
        ?>



</div>

<div class="ftrchannels">
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Lifestyle
<?php else: ?>
Estilo de Vida
<?php endif; ?>

</h4>
<?php
            wp_nav_menu( array(

                'theme_location'    => 'lifestyle',
                'depth'             => 2)
            );
			  
        ?>
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Faith
<?php else: ?>
Fe
<?php endif; ?>

</h4>
<?php
            wp_nav_menu( array(

                'theme_location'    => 'faith',
                'depth'             => 2)
            );
			  
        ?>



</div>


<div class="ftrchannels">
<h4>
<?php

$currentlang = get_bloginfo('language');
if($currentlang=="en-US"):?>
Entertainment
<?php else: ?>
Entretenimiento
<?php endif; ?>


</h4>
<?php
            wp_nav_menu( array(
  
                'theme_location'    => 'entertainment',
                'depth'             => 2)
            );
			  
        ?>

</div>



<div class="ftrchannels social clearfix" >

<a href="https://www.facebook.com/pages/Yiptv/670093559720356?fref=ts" target="_blank"><img src="<?php bloginfo('template_url'); ?>/images/Facebook.png" alt="Facebook" ></a>
<a href="https://twitter.com/YipTV" target="_blank"><img src="<?php bloginfo('template_url'); ?>/images/Twitter.png" alt="Twitter" ></a>
<a href="http://linkedin.com/company/yiptv" target="_blank"><img src="<?php bloginfo('template_url'); ?>/images/Linkedin.png" alt="Linkedin" ></a>
<a href="https://plus.google.com/110377468150377213884" target="_blank"><img src="<?php bloginfo('template_url'); ?>/images/Google.png" alt="Google+" ></a>
<h4 style="clear:left;margin-top:15px">Yip Now</h4>
<?php 
//the query

$args = array(
    'cat'=> 491,
    'posts_per_page' => 1
  );

query_posts($args);
//the loop
while ( have_posts() ) : the_post(); 
echo '<div id="yipnow">';
echo '<p>';
echo '<a href="';
the_permalink();
echo '">';
the_title();
echo '</a>';
echo '</p>';
the_excerpt();
echo '</div>';
endwhile;
// Reset Query
wp_reset_query();
?>
</div>

</div><!-- END CONTAINER -->

</footer>


<section id="greybnr">

<?php
            wp_nav_menu( array(
             
                'theme_location'    => 'footer',
                'depth'             => 2,
                'container'         => 'div',
                'container_class'   => 'container clearfix')
            );
			  
        ?>

</section>

<section id="bottom">
<div class="container">

<?php
            wp_nav_menu( array(
              
                'theme_location'    => 'legalfooter',
                'depth'             => 2)
            );
			  
        ?>

<p>Copyright &copy; <?php echo date("Y"); echo " "; bloginfo('name'); ?>. Use of the YipTV Service and this website constitutes acceptance of our terms of service and privacy policy.</p>
</div>
</section>
<!-- MAIN SITE CONTENT -->
</div>

</footer>
</div> <!-- end outerWrapper -->
  <script src="<?php bloginfo('template_url'); ?>/js/swiper.min.js"></script>
    <script src="<?php bloginfo('template_url'); ?>/js/swiper.jquery.min.js"></script>

 <script>
    var swiper = new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
		nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev'
		
    });
	
	var swiper2 = new Swiper('.swiper-container1', {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
		nextButton: '.swiper-button-next1',
        prevButton: '.swiper-button-prev1'
		
    });
	var swiper3 = new Swiper('.swiper-container2', {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
    });
	var swiper3 = new Swiper('.swiper-container3', {
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 10,
		nextButton: '.swiper-button-next2',
        prevButton: '.swiper-button-prev2'
    });
    </script>

</body>
</html>