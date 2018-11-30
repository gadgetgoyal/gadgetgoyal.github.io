var CTS = {};
if (typeof console == 'undefined') console = { log: function(){} };


(function(CTS) {

	/**
	Global vars
	*/
	var $html;
	var $body;
	var $window;
	var $projectHolder;
	var isTouch;

	/**
	Dom Ready
	*/
	$(function() {
		$html = $('html');
		$body = $('body');

		initGlobal();
	});

	function initGlobal() {

		isTouch = $html.hasClass('touch');

		var snapScroll = new peduarte.SnapScroll({
			animDuration: 600, // Scroll duration/speed in ms
			animEasing: 'easeOutCubic', // Scroll easing, see for http://gsgd.co.uk/sandbox/jquery/easing/ full list
			isTouch: isTouch
		});

		var infoIsOpened = false;

		$('.more-info-button').click(function () {
			if (infoIsOpened) {
				$(this).removeClass('is-opened');
				$body.addClass('hide-info').removeClass('show-info');
				infoIsOpened = false;
			} else {
				$(this).addClass('is-opened');
				$body.addClass('show-info').removeClass('hide-info');
				infoIsOpened = true;
			}
		});

		// Move back to top
		if (!isTouch) {
			$('.logo a').click(function(e) {
				e.preventDefault();
				snapScroll.distance = 0;
				snapScroll.move('up');
			});

			// Scroll down
			$('.scroll-down').click(function() {
				snapScroll.move('down');
			});
		}
	}


})(CTS);
