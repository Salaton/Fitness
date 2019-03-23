// Menu-toggle button

$(document).ready(function() {
	$(".navbar-absolute").on("click", function() {
		$("nav ul").toggleClass("showing");
	});
});

// Scrolling Effect(Gives the navbar a black background color)

$(window).on("scroll", function() {
	if ($(window).scrollTop()) {
		$("nav").addClass("black");
	} else {
		$("nav").removeClass("black");
	}
});
//transition delay when moving to a hyperlink in the same page
$(document).ready(function() {
	$("nav").localScroll({ duration: 8000 });
});

// process.env.NODE_ENV = 'production';
