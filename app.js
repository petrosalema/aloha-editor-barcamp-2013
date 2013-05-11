(function () {
	'use strict';

	var Aloha = {};
	window.jQuery.fn.aloha = function () {
		return this;
	};

	var $ = window.jQuery;
	var Transformer = window.Transformer;
	var operation = null;

	function mousedown_on_element(event) {
		operation = Transformer.start(
			'rotate',
			$(event.target).closest('.lettering>b'),
			event
		);
	}

	function mouseup_on_document(event) {
		if (operation) {
			Transformer.end(operation);
			operation = null;
		}
	}

	function mousemove_on_document(event) {
		if (operation) {
			Transformer.update(operation, event);
		}
	}

	var parallax_factor = 0.2;
	var window_height = 0;
	var body_height = 0;
	var containers = [];
	var contents = [];
	var heights = [];
	var bottoms = [];
	var offsets = [];
	var $window = $(window);
	var $sections = $('.parallax');

	function reset_element($element) {
		return $element.css({
			height: '',
			marginTop: '',
			zIndex: ''
		});
	}

	function resize_on_window() {
		window_height = $window.height();
		var zIndex = $sections.length;

		$sections.css('position', 'relative').each(function (i) {
			var $element = reset_element($(this)).css({
				zIndex: zIndex--
			});

			containers[i] = $element;
			contents[i] = reset_element($element.children().first());
			offsets[i] = $element.offset().top;
			heights[i] = Math.max(window_height, $element.height());
			bottoms[i] = offsets[i] + heights[i];

			contents[i].height(heights[i]);
			containers[i].height(heights[i]);
		}).css('position', 'fixed');

		body_height = bottoms.length ? bottoms[bottoms.length - 1] : 0;

		$('body').height(body_height);

		scroll_on_document();
	}

	function scroll_on_document() {
		var offset = $window.scrollTop();
		var i;
		var len = containers.length
		for (i = 0; i < len; i++) {
			containers[i].css('height', bottoms[i] - offset);
			contents[i].css(
				'margin-top',
				Math.round((offsets[i] - offset) * parallax_factor)
			);
		}
	}

	$(document)
		.on('mouseup', mouseup_on_document)
		.on('mousemove', mousemove_on_document)
		.on('mousedown', '.lettering>b', mousedown_on_element)
		.on('scroll', scroll_on_document);

	var scroll_delay = null;
	$window.on('resize', function () {
		if (scroll_delay) {
			clearTimeout(scroll_delay);
		}
		scroll_delay = setTimeout(resize_on_window, 200);
	});

	resize_on_window();
}());
