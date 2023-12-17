window.isMac = navigator.platform.toUpperCase().indexOf('MAC')>=0;
window.MOBILE_WIDTH = 740;
$(function(){
	

	function start() {

        if ($('body').hasClass('loaded') ) return;
        $('body').addClass('loaded');
    
        
        if ( window.location && window.location.hash && window.location.hash != '') {
            checkHash();
        } else {
           showPage('home');
        }

    }

    window.onhashchange = function(e){
        if ( window.location && window.location.hash && window.location.hash != '') {
            checkHash();
        }
    };


    $('.wrapper').on('touchmove', function(e){
        
        if ( $('body').hasClass('modal-opened')) {
            e.preventDefault();
            return;
        }
    });

    function checkHash() {
    	var hash = window.location.hash;
        var target = hash.replace('#/', '');
        var target = $('.page[id="' + target.replace('#', '') + '"]');
        if ( target.size() > 0 ) {
            showPage(target.attr('id'));
        } else {
            showPage('home');
        }
    }

    function showPage(id) {
        var target = $('.page#' + id).removeClass('prev next').addClass('active');
        target.prevAll().removeClass('active prev next').addClass('prev');
        target.nextAll().removeClass('active prev next').addClass('next');

        var pageId = target.data('page-id')
        $('#nav li').removeClass('active');
        $('#nav a[href="#' + pageId + '"]').closest('li').addClass('active');


        $('#side').attr('data-page', id);
        var totalPage = $('.page').length;
        var currentPageIndex = $('.page.active').index();
        $('#side .current').html(String('0' + Math.max(currentPageIndex, 1)).substring(-1,2) );
        $('#side .total').html( String('0' + (totalPage-1)).substring(-1,2) );
        

        if ( $(window).innerWidth() <= MOBILE_WIDTH) {
            var st = target.offset().top;
            $('html,body').stop().animate({'scrollTop':st}, 1000, 'easeInOutQuint');
            $('.btn-toggle-nav').removeClass('active');
        } else {
            window.location.hash = id;
        }

        
    }


    
    var isAutoScrolling = false;
    $(document).on('mousewheel', function(e){
        if ( $(window).innerWidth() <= MOBILE_WIDTH) { 
            return;
        }
        if ( $('body').hasClass('modal-opened')) {
            return;
        }

        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault();


        if ( $('body').hasClass('loaded') && isAutoScrolling == false) {
            if ( e.deltaY < 0 ) {
                moveNextPage();
            } else {
                movePrevPage();
            }

            isAutoScrolling = true;
            setTimeout(function(){
                isAutoScrolling = false;
            }, 1000);
        }

    });

    function moveNextPage() {
        if ( $('.page.active').next().length == 0 )  return;
        var target = $('.page.active').next().attr('id');
        showPage(target);
    }

    function movePrevPage() {
        if ( $('.page.active').prev().length == 0 )  return;
        var target = $('.page.active').prev().attr('id');
        console.log(target);
        showPage(target);
    }

    $('.btn-toggle-nav').on('click', function(e){
        e.preventDefault();
        $(this).toggleClass('active')
    });

    $('#header .logo a, #nav a').on('click', function(e){
        if ( $(window).innerWidth() <= MOBILE_WIDTH) { 
            e.preventDefault();
            var href = $(this).attr('href');
            console.log(href);
            var  st = $('.page' + href).offset().top;
            $('html,body').stop().animate({'scrollTop':st}, 1000, 'easeInOutQuint');
            $('.btn-toggle-nav').removeClass('active');
        }
    });



    

    $('.side .scroll').on('click', function(e){
        e.preventDefault();
        showPage('about');
    });



    $(window).on('scroll', function(){
        var st = $(window).scrollTop();
        if ( st > 50) {
            $('#side').addClass('inactive');
        } else {
            $('#side').removeClass('inactive');
        }
    });

    $(window).on('load', function(){
        start();
    });

    $(window).on('resize', function(){
        $('.process li').css({'height':'auto'});
        var maxHeight = 0;
        $('.process li').each(function(){
            maxHeight = Math.max(maxHeight, $(this).innerHeight());
        });
        $('.process li').css({'height':maxHeight});

        var windowHeight = $(window).innerHeight();
        $('.modal .modal-box').each(function(){
            var boxHeight = $(this).innerHeight();
            var mt = (windowHeight - boxHeight ) * .5;
            mt = Math.max(80,mt);
            $(this).css({
                'margin-top': mt
            });
        });

    }).trigger('resize');

    setTimeout(function(){
        start();
    }, 2000);

});




// modal
$(function(){
    $('a[data-modal-open="true"]').on('click', function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        openModal(target);
    })

    $('a[data-modal-close="true"]').on('click', function(e){
        e.preventDefault();
        var target = $(this).attr('href');
        closeModal(target);
    })


    function openModal(target) {
        $('.modal' + target).addClass('active');
        $('body').addClass('modal-opened');
        $(window).trigger('resize');
    }

    function closeModal(target) {
        $('.modal' + target).removeClass('active');
        if ($('.modal.active').length == 0 ) {
            $('body').removeClass('modal-opened');
        }
    }
});


// office
$(function(){

    var totalCnt = $('.office .slider .slide').length;

    $('.office .slider').slick({
        dots:true,
        arrows:false
    });

    
    $('.office .slider').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        
        setSlideNav(nextSlide + 1);
    });


    function setSlideNav(current) {
       
        var total = String('0' + totalCnt).substring(-1,2);
        current = String('0' + current).substring(-1,2);
        $('.office .nav .total').html(total);
        $('.office .nav .current').html(current);
    }


    $('.office .nav .btn-next').on('click', function(e){
        e.preventDefault();
        $('.office .slider').slick('slickNext');
    });
    $('.office .nav .btn-prev').on('click', function(e){
         e.preventDefault();
        $('.office .slider').slick('slickPrev');
    });
    setSlideNav(1);
});


