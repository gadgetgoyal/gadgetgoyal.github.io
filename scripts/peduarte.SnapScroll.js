/**
* peduarte.SnapScroll.js
*
* @fileoverview Snap panels when user scrolls
*
* @requires jquery.mousewheel.js
* @requires jquery.scrollTo.js
* @requires jquery.easing.js
*
* @author Pedro Duarte
* @author http://pedroduarte.me
*/

//------------------------------------------------------------------------------------------------------------
var peduarte = peduarte || {};


peduarte.SnapScroll = (function() {

	function SnapScroll(aoOptions)
	{
		this.options = {
			panelSelector: '.panel',
			panelWrapperSelector: '.panel-wrapper',
			animDuration: 1000,
			animEasing: 'easeOutCubic',
			minHeight: 620,
			minWidth: 620,
			mobileWidth: 620,
			bottomReachedClass: 'is-snapped-bottom',
			topReachedClass: 'is-snapped-top',
			activeBodyClass: 'is-snap-scroll',
			notSnappableClass: 'not-snappable',
			isTouch: false
		};

		jQuery.extend(this.options, aoOptions || {});

		this.$body = $('body');
		this.$panel = $(this.options.panelSelector);
		this.$panelWrapper = $(this.options.panelWrapperSelector);

		this.panelLength = this.$panel.length;
		this.$window = $(window);
		this.wHeight = $(window).height();
		this.wWidth = $(window).width();
		this.isScrolling = false;
		this.distance = 0;
		this.counter = 1;

		this.checkCompability(true);
	}

	var SnapScrollProto = SnapScroll.prototype;

	SnapScrollProto.checkCompability = function(abIsFirstCheck) {
		if (this.options.isTouch || this.wHeight < this.options.minHeight || this.wWidth < this.options.minWidth) {
			this.$body.addClass(this.options.notSnappableClass);
			return;
		} else if (abIsFirstCheck) {
			this.attach();
		}
	};

	SnapScrollProto.attach = function()
	{
		this.$body.addClass(this.options.activeBodyClass);
		this.resizeListener();
		this.setPanelHeight();
		this.getDocumentHeight();
		this.bindMousewheel();

		var _this = this;
		setTimeout(function () {
			if ($(document).scrollTop() === 0) {
				_this.showHeader();
			}
		}, 1);

		return this;
	};

	SnapScrollProto.updateWindowDimension = function() {
		this.wHeight = this.$window.height();
		this.wWidth = this.$window.width();

		return this;
	};

	SnapScrollProto.setPanelHeight = function() {
		this.$panel.css({
			'height': this.wHeight,
			'min-height': 'auto'
		});

		return this;
	};

	SnapScrollProto.bindMousewheel = function() {
		var _this = this;

		this.$window.bind('mousewheel', function(aeEvt, delta, deltaX, deltaY) {
			aeEvt.preventDefault();

			if (delta < 0 && _this.isScrolling === false) {
				_this.move('down');
			}
			else if (delta > 0 && _this.isScrolling === false) {
				_this.move('up');
			}
		});

		return this;
	};

	SnapScrollProto.move = function(asDirection) {
		var _this = this;
		var index = 0;

		if (this.isScrolling) { return; }

		this.isScrolling = true;

		if (asDirection === 'down') {
			if (this.distance < (this.dHeight - this.wHeight)) {
				this.distance += this.wHeight;
				this.counter++;

				index = this.counter;

				this.$panel.eq(index).addClass('inview');
				this.hideHeader();
			}
		}
		else if (asDirection === 'up' && this.distance > 0) {
			this.distance -= this.wHeight;
			this.counter--;
			if (this.distance === 0) {
				this.showHeader();
			}
		}

		this.$panelWrapper.transition({y: -(this.distance)}, this.options.animDuration, this.options.animEasing);
		setTimeout(function() {
			_this.isScrolling = false;
		}, 1200);




		// $.scrollTo(this.distance, this.options.animDuration, {easing: this.options.animEasing, onAfter: function() {
		// 	_this.isScrolling = false;
		// }});

		return this;
	};

	SnapScrollProto.resetSnapScroll = function() {
		this.distance = 0;
		this.showHeader();
		$.scrollTo(this.distance, 0);

		return this;
	};

	SnapScrollProto.showHeader = function() {
		this.$body.addClass(this.options.topReachedClass);

		return this;
	};

	SnapScrollProto.hideHeader = function() {
		this.$body.removeClass(this.options.topReachedClass);

		return this;
	};

	SnapScrollProto.getDocumentHeight = function() {
		this.dHeight = $(document).height();

		return this;
	};

	SnapScrollProto.checkIfIsMobile = function() {
		if (this.wWidth <= this.options.mobileWidth) {
			this.destroy();
		}

		return this;
	};

	SnapScrollProto.destroy = function() {
		this.$panel.css({
			'height': '',
			'min-height': ''
		});
		this.$panelWrapper.removeAttr('style');
		this.$body.addClass('destroyed-snap');
		this.$window.unbind('mousewheel');
		this.$body.removeClass(this.options.activeBodyClass);
		this.showHeader();
	};

	SnapScrollProto.resizeListener = function() {
		var _this = this;

		this.$window.resize(function() {
			_this.updateWindowDimension();
			_this.setPanelHeight();
			_this.getDocumentHeight();
			_this.resetSnapScroll();
			_this.checkIfIsMobile();
		});

		return this;
	};

	return SnapScroll;

})();
