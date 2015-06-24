$(function(){
	// window-size fitting
	$('div.cover-visual').width($(window).width()).height($(window).height());
	$('div.cover-visual-2div').width($(window).width()).height($(window).height()/2); // window-size 1/2
	$('div.cover-visual-3div').width($(window).width()).height($(window).height()/3); // window-size 1/3
	$('div.cover-visual-4div').width($(window).width()).height($(window).height()/4); // window-size 1/4
	$(window).on('resize', function(){
		$('div.cover-visual').width($(window).width()).height($(window).height());
		$('div.cover-visual-2div').width($(window).width()).height($(window).height()/2); // window-size 1/2
		$('div.cover-visual-3div').width($(window).width()).height($(window).height()/3); // window-size 1/3
		$('div.cover-visual-4div').width($(window).width()).height($(window).height()/4); // window-size 1/4
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