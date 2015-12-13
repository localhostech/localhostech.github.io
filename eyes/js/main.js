$(document).on('ready', function() {
	var pip = new Audio('assets/pip.wav');
	function doPip() {
		pip.play();
	}
	function start() {
		console.log('Started!');
		$('.control-block').fadeOut();
		$('.control-block').html('<h2>Закройте глаза</h2><p>Держите глаза закрытыми до звукового сигнала</p><div class="timer">20</div>');
		$('.control-block').fadeIn();
		$('.point').show();
		$('.point').addClass('transport-point');
		setTimeout(function() {
			$('.point').removeClass('transport-point');
			$('.point').addClass('transported-point');
			$('.point').addClass('pulse-point');
		}, 4000);
	}
	function timerControl(seconds, next) {
		function interval() {
			$('.timer').text(seconds);
			seconds -= 1;
			if (seconds < 0) {
				clearInterval(intervalID);
				changeTask(next);
				doPip();
			}
		}
		intervalID=setInterval(interval,1000);
	}
	function changeTask(task) {
		var time = 20;
		if (task == 'top-down') {
			$('.control-block').fadeOut();
			$('.control-block').html('<h2>Вверх - вниз</h2><p>На секунду задерживайте взгляд в верхней и нижней точках</p><div class="timer">' + time + '</div>');
			$('.control-block').fadeIn();
			timerControl(time, 'blink');
			$('.point').removeClass('pulse-point');
			$('.point').addClass('point-topdown');
		}
		if (task == 'left-right') {
			$('.control-block').fadeOut();
			$('.control-block').html('<h2>Влево - вправо</h2><p>На секунду задерживайте взгляд на левой и правой точках</p><div class="timer">' + time + '</div>');
			$('.control-block').fadeIn();
			timerControl(time, 'end');
			$('.point').removeClass('point-topdown');
			$('.point').addClass('point-leftright');
		}
		if (task == 'blink') {
			time = 10;
			$('.control-block').fadeOut();
			$('.control-block').html('<h2>Поморгайте глазами</h2><p>Поморгайте глазами или закройте их ладонями</p><div class="timer">' + 15 + '</div>');
			$('.control-block').fadeIn();
			timerControl(time, 'left-right');
			$('.point').removeClass('point-topdown');
			$('.point').removeClass('point-leftright');
			$('.point').addClass('pulse-point');
		}
		if (task == 'end') {
			$('.control-block').fadeOut();
			$('.control-block').html('<h2>Разминка почти закончилась</h2><p>Посмотрите в окно или прогуляйтесь. Через час начните разминку снова.</p>');
			$('.control-block').fadeIn();
			$('.point').hide();

		}
	}
	$('#startbtn').on('click', function() {
		start();
		timerControl(20, 'top-down');
	});
	$('.btn-start').on('click', function() {
		start();
		timerControl(20, 'top-down');
	});
});