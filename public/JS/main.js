 // Menu-toggle button

      $(document).ready(function() {
            $(".navbar-absolute").on("click", function() {
                  $("nav ul").toggleClass("showing");
            });
      });

      // Scrolling Effect(Gives the navbar a black background color)

      $(window).on("scroll", function() {
            if($(window).scrollTop()) {
                  $('nav').addClass('black');
            }

            else {
                  $('nav').removeClass('black');
            }
      });
// process.env.NODE_ENV = 'production';





