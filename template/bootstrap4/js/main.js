$(document).ready(function () {

    // Add listeners to main menu
    // navbar-nav nav-link
    $('.navbar-nav .nav-item').each(function( index ) {
        // console.log(index + ": " + $(this).text());
        $(this).click(function() {
            $('.navbar-nav .nav-item').removeClass("active");
            $(this).addClass('active');
        });
    });

    $('.nav .nav-link').each(function( index ) {
        // console.log(index + ": " + $(this).text());
        $(this).click(function() {
            $('.nav .nav-link').removeClass("active");
            $(this).addClass('active');
        });
    });


});

function createCookie(name, value, days = 365) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}
