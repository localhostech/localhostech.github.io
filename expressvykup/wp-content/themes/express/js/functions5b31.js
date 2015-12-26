jQuery.noConflict();
(function($) {
    $(function() {

        $('.thumb_overflow img').imageScale();

        window.onload=function(){
            $('.thumb_overflow img').each(function(){
                $(this).animate({
                    'opacity': '1'
                }, 300);
            });          
        }

/*        $('a[href^="#"]').on('click', function(event) {
            event.preventDefault();
            var id = $(this).attr('href'),
                top = $(id).offset().top;

            if ( $(window).width() > 998 ) {
                $('body,html').animate({
                    scrollTop: top-headerHeight
                }, 750);
            }
            else {
                $('body,html').animate({
                    scrollTop: top-headerHeight
                }, 750);
            }
        });*/

        $('input[type=tel]').mask('+38 999 999-99-99');

        $('.tab_title').eq(0).addClass('active');
        $('.tabs_content').eq(0).css({'left':0, 'position':'relative'});

        $('.tab_title').click(function(){
            if (! $(this).hasClass('active') ) {
                $('.tab_title').removeClass('active');
                $(this).addClass('active');
                var index = $('.tab_title').index(this);
                $('.tabs_content').animate({
                    'left': -5000+'px'
                }).css('position','absolute');
                $('.tabs_content').eq(index).animate({
                    'left': 0
                }).css('position','relative');
            }
        });

        function YO() {

        var years_old = $('.years').text(),
            i = 0,
            timer = setInterval(function() {
                p = i++;
                if ( p <= years_old ){
                    $('.years').html(p);
                }
            },80);

        }

        function PC() {

        var peoples_count = $('.peoples').text(),
            ii = 0,
            p_count = setInterval(function() {
                pp = ii++;
                if ( pp <= peoples_count ){
                    $('.peoples').html(pp);
                }
            },1);

        }

        function AnimateRotate(angle) {
            var $elem = $('.big_icon .icon_bg');

            $({deg: 0}).animate({deg: angle}, {
                duration: 2000,
                step: function(now) {
                    // in the step-callback (that is fired each step of the animation),
                    // you can use the `now` paramter which contains the current
                    // animation-position (`0` up to `angle`)
                    $elem.css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
        }

        $('#why_us').viewportChecker({
            callbackFunction: function(elem, action){
                YO();
                PC();
                AnimateRotate(360);
            }
        });

        if ( $('body').hasClass('page-id-6') ) {
            $count = 0;
            $('.content h3').each(function(){
                $text = $(this).text();
                $count++;
                $(this).html('<span>'+$text+'</span>')
                $(this).prepend('<span class="counter">' + $count + '</span>')
            });
        }

        $('.acc_title').click(function(){
            if ( ! $(this).parent().hasClass('active') ) {
                $('.acc_content').slideUp();
                $('.acc_item').removeClass('active');
                $(this).next().slideDown();
                $(this).parent().addClass('active');
            }
        });

        $("#brand").on('change', function(){
            var brand_id = $("#brand").val();
            $.post("wp-content/themes/express/getbrand.html", {brand_id:brand_id}, function(data){
                $("#model").html(data);
            });
            $.get("wp-content/themes/express/getcity.html",function(data){
                $("#city").html(data);
            });
        });

        var brand = $('#brand');
        var model = $('#model');
        var year = $('#year');
        var client_price = $('#client_price');

        var engine = $("#engine");
        var probeg = $("#probeg");
        var city = $("#city");
       // var quick = $('#quick');
       // var credit = $('#credit');
       // var crash = $('#crash');
        var client_text = $('#client_text');

        var client_name = $('#client_name');
        var phone = $('#phone');
        var email = $('#email');

        function client_validation() {
            if((brand.val().length > 0) && (brand.val() != 0)) {}
            else {$("#continue").html("ЗАПОЛНИТЕ ПРАВИЛЬНО МАРКУ АВТО"); return false;}

            if(model.val().length > 0) {}
            else {$("#continue").html("ЗАПОЛНИТЕ ПРАВИЛЬНО МОДЕЛЬ АВТО"); return false;}

            if((year.val().length > 0)&& (year.val().match(/^([0-9]{4})$/i))) {}
            else {$("#continue").html("ЗАПОЛНИТЕ ПРАВИЛЬНО ГОД АВТО"); return false;}

            return true;
        }

        /*
        function client_validation_row2() {
            if(email.val().match(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i)) {}
            else {$("#submit_car").html("ЗАПОЛНИТЕ ПРАВИЛЬНО ПОЧТОВЫЙ ЯЩИК"); return false;}
            return true;
        }
        */

        function client_validation_row2() {
            if( email.val().match(/^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i) || phone.val() ) { return true; }
            else {$("#submit_car").val("Укажите телефон или e-mail"); return false;}
        }

        $('#continue').on('click', function(){
            if (client_validation() == true){
                $("#continue").html("ОЦЕНИТЕ СВОЕ АВТО");
                $('#row2').slideDown(500);
                $('#continue').hide();
                $('#submit_ticket').css('display', 'inline-block');
            }
        });

        $('#submit_ticket').on('click', function(){
            var fH = $('.o_form').height(),
                fW = $('.o_form').width();
            $('.overlay, .o_form').fadeIn();
            $('.o_form').css({
                'margin-top': -fH/2,
                'margin-left': -fW/2
            });
        });

        $('.overlay').on('click', function(){
            $(this).fadeOut();
            $('.o_form, .mobile_nav').fadeOut();
            $('.pull').removeClass('active');
        });

        function hideForm() {
            $('.overlay, .o_form').fadeOut();
        }

        $('#submit_car').on('click', function(){

            if (client_validation_row2() == true){

                if ( $('#quick').is(':checked') ) {
                    var quick = $('#quick').val();
                } else {
                    var quick = 'нет';
                }
                if ( $('#credit').is(':checked') ) {
                    var credit = $('#credit').val();
                } else {
                    var credit = 'нет';
                }
                if ( $('#crash').is(':checked') ) {
                    var crash = $('#crash').val();
                } else {
                    var crash = 'нет';
                }

                $.post("wp-content/themes/express/ticket.html",
                    {
                        brand:$('#brand').val(),model:$('#model').val(),year:$('#year').val(),client_price:$('#client_price').val(),engine:$('#engine').val(),probeg:$('#probeg').val(),
                        city:$('#city').val(),quick:quick,credit:credit,crash:crash,client_text:$('#client_text').val(),auto_class:$('#auto_class').val(),
                        client_name:$('#client_name').val(),phone:$('#phone').val(),email:$('#email').val()
                    }, function(data){
                        $("#submit_ticket").html(data);
                    })
            }
        });

        $('.pull').on('click', function(){

            if( ! $(this).hasClass('active') ) {
                var nH = $('.mobile_nav').height(),
                    nW = $('.mobile_nav').width();

                $(this).addClass('active');
                $('.mobile_nav, .overlay').fadeIn();
                $('.mobile_nav').css({
                    'margin-top': -nH/2,
                    'margin-left': -nW/2
                });
            } else {
                $(this).removeClass('active');
                $('.mobile_nav, .overlay').fadeOut();
            }
        });

        $('#s_spec').on('click',function(){
            alert('WINNER');
        });
        
        $(function() {

        var $allVideos = $("iframe[src^='https://www.youtube.com']"),
            $fluidEl = $(".wrapper");

        $allVideos.each(function() {

            $(this)
                .data('aspectRatio', this.height / this.width)

                .removeAttr('height')
                .removeAttr('width');

        });

            $(window).resize(function() {

            var newWidth = $fluidEl.width();

            $allVideos.each(function() {

                var $el = $(this);
                $el
                    .width(newWidth)
                    .height(newWidth * $el.data('aspectRatio'));

            });

        }).resize();

        });

    });
})(jQuery)