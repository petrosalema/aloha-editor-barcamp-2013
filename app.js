(function ($, Parallaxing, Transformer, Aloha) {
	'use strict';

	var operation = null;

	function mousedown(event) {
		operation = Transformer.start(
			'rotate',
			$(event.target).closest('.lettering>b'),
			event
		);
	}

	function mouseup(event) {
		if (operation) {
			Transformer.end(operation);
			operation = null;
		}
	}

	function mousemove(event) {
		if (operation) {
			Transformer.update(operation, event);
		}
	}

	var indexes = {};
	$('.parallax').each(function (i) {
		indexes[this.id] = i;
	});

	var SCROLL_TO = /#scrollTo\(([a-z0-9]+)\)/;

	function scrollTo(hash) {
		var match = hash.match(SCROLL_TO);
		var id = match ? match[1] : hash.replace('#', '');
		var offset = Parallaxing.MIN_WINDOW_WIDTH < $(window).width()
		           ? (indexes[id] || 0) * $(window).height()
				   : $('#' + id).offset().top;
		$('html, body').animate({scrollTop: offset}, 1000);
	}

	$(document)
		.on('mouseup', mouseup)
		.on('mousemove', mousemove)
		.on('mousedown', '.lettering>b', mousedown)
		.on('scroll', Parallaxing.scroll);

	$(window).on('resize', Parallaxing.delayed_resize);

	Parallaxing.resize();

	$('a[href^="#scrollTo"]').on('click', function () {
		scrollTo($(this).attr('href'));
	});

	if (window.location.hash) {
		scrollTo(window.location.hash);
	}

	Aloha.jQuery('*[contentEditable=true]').aloha();

	$('body').addClass('vendor' + Transformer.VENDOR_PREFIX);
}(
	window.jQuery,
	window.Parallaxing,
	window.Transformer,
	window.Aloha
));
