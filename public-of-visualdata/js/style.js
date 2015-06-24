jQuery(function($){
	// jQuery Lazy Load
	$("img.lazy").lazyload({
		effect: 'fadeIn',
		effectspeed: 1000,
		// threshold: 300
	});
});

$(document).ready(function(){
	// IE6-8 (attr data-original) fix
	var ua = navigator.userAgent;
	if(!/MSIE [6-8]/.test(ua)) return;
	var elm = $('.lazy');
	elm.attr('class', 'lazy lazy4ie8');
	elm.attr('src', elm.data('src'));
});

(function(){
	// center modal
	function centerModals(){
		$('.modal').each(function(i){
			var $clone = $(this).clone().css('display', 'block').appendTo('body');
			var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
			top = top > 0 ? top : 0;
			$clone.remove();
			$(this).find('.modal-content').css("margin-top", top);
		});
	}
	$('.modal').on('show.bs.modal', centerModals);
	$(window).on('resize', centerModals);
})();
