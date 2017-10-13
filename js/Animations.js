$(document).ready(function() {
    $('#instructioncontent').hide();
    $('#topbar').animate({
        top: '0px'
    }, 700);
    $('#bottombar').delay(500).animate({
        top: '90vh'
    }, 1000);
});
$( "#buttonleft" ).click(function() {
    $('#topbar').animate({
        top: '-440px'
    }, 700);
    $('#bottombar').animate({
        top: '100vh'
    }, 700);
    $('#midbar').slideUp(400);
    $('.fullscreen').slideUp(1000);
});
$( "#buttonright" ).click(function() {
    $('#instructioncontent').show();
    $('#topbar').animate({
        top: '-440px'
    }, 700);
    $('#bottombar').animate({
        top: '100vh'
    }, 700);
    $('#midbar').slideUp(400);
    $('#welcomescreen').slideUp(1000);
});
$( "#instrplay" ).click(function() {
    $('#instructions').slideUp(1000);
});