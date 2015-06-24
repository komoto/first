$(function(){
	// window-size fitting
	$('div.cover-visual').width($(window).width()).height($(window).height());
	$(window).on('resize', function(){
		$('div.cover-visual').width($(window).width()).height($(window).height());
	});
});

$(function(){
	// cover-arrow scroll
	$('a.cover-arrow').click(function(){
		var speed = 500;
		var href= $(this).attr("href");
		var target = $(href == "#" || href == "" ? 'html' : href);
		var position = target.offset().top;
		$("html, body").animate({scrollTop:position}, speed, "swing");
		return false;
	});
});