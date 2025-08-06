(function($) {
    "use strict";
    $(window).on("load", function() {
        $(".loader-inner").fadeOut();
        $(".loader").delay(200).fadeOut("slow");
    });

    $('a.scroll').smoothScroll({
        speed: 800,
        offset: -50
    });

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

    $('.background-img').each(function() {
        var path = $(this).children('img').attr('src');
        $(this).css('background-image', 'url("' + path + '")').css('background-position', 'initial');
    });

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

    $('.block-gallery li').on("mouseenter", function() {
        $(this).closest('.gallery').find('.block-gallery li').removeClass('active');
        $(this).addClass('active');
    });

    $('.block-ticket').on("mouseenter", function() {
        $(this).closest('.tickets').find('.block-ticket').removeClass('active');
        $(this).addClass('active');
    });

    $('.venobox').venobox({
        titleattr: 'data-title',
        numeratio: true
    });

})(jQuery);