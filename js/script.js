(function($) {
    "use strict";

    // Windows load

    $(window).on("load", function() {

        // Site loader 

        $(".loader-inner").fadeOut();
        $(".loader").delay(200).fadeOut("slow");

    });


    // Scroll to

    $('a.scroll').smoothScroll({
        speed: 800,
        offset: -50
    });


    // Slider

    $('.slider').flexslider({
        animation: "fade",
        slideshow: true,
        directionNav: true,
        controlNav: false,
        pauseOnAction: false,
        animationSpeed: 500
    });


    $('.review-slider').flexslider({
        animation: "fade",
        slideshow: true,
        directionNav: false,
        controlNav: true,
        pauseOnAction: false,
        animationSpeed: 1000
    });



    // Mobile menu

    var mobileBtn = $('.mobile-but');
    var nav = $('.main-nav ul');
    var navHeight = nav.height();

    $(mobileBtn).on("click", function() {
        $(".toggle-mobile-but").toggleClass("active");
        nav.slideToggle();
        $('.main-nav li a').addClass('mobile');
        return false;


    });

    $(window).resize(function() {
        var w = $(window).width();
        if (w > 320 && nav.is(':hidden')) {
            nav.removeAttr('style');
            $('.main-nav li a').removeClass('mobile');
        }

    });

    $('.main-nav li a').on("click", function() {
        if ($(this).hasClass('mobile')) {
            nav.slideToggle();
            $(".toggle-mobile-but").toggleClass("active");
        }

    });



    // Append images as css background

    $('.background-img').each(function() {
        var path = $(this).children('img').attr('src');
        $(this).css('background-image', 'url("' + path + '")').css('background-position', 'initial');
    });




    // Count down setup

    $('.countdown').countdown('2017/8/20', function(event) {
        $(this).html(event.strftime('%D days %H:%M:%S'));
    });




    // Tabbed content 

    $(".block-tabs li").on("click", function() {
        if (!$(this).hasClass("active")) {
            var tabNum = $(this).index();
            var nthChild = tabNum + 1;
            $(".block-tabs li.active").removeClass("active");
            $(this).addClass("active");
            $(".block-tab li.active").removeClass("active");
            $(".block-tab li:nth-child(" + nthChild + ")").addClass("active");
        }
    });


    // Zoom	effect

    $('.block-gallery li').on("mouseenter", function() {
        $(this).closest('.gallery').find('.block-gallery li').removeClass('active');
        $(this).addClass('active');
    });



    $('.block-ticket').on("mouseenter", function() {
        $(this).closest('.tickets').find('.block-ticket').removeClass('active');
        $(this).addClass('active');
    });




    // Images zoom 

    $('.venobox').venobox({
        titleattr: 'data-title',
        numeratio: true
    });






  


})(jQuery);
