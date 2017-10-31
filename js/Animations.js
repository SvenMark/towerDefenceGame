let laser;
let stop=0;
function placeshow(){
    $('#placetowerdiv').fadeIn(300);
    $('#placetowertxt').delay(300).animate({"width":"92%"}, 600);
    $('#placetowertxtp').delay(300).fadeIn(500);
}
function placehide(){
    $('#placetowertxt').animate({"width":"0%"}, 600);
    $('#placetowerdiv').delay(300).fadeOut(300);
    $('#placetowertxtp').fadeOut(500);
}
function upgradeshow(){
    $('#upgradetowerdiv').fadeIn(300);
    $('#upgradetowertxt').delay(300).animate({"width":"92%"}, 600);
    $('#upgradetowertxtp').delay(300).fadeIn(500);
}
function upgradehide(){
    $('#upgradetowertxt').animate({"width":"0%"}, 600);
    $('#upgradetowerdiv').delay(300).fadeOut(300);
    $('#upgradetowertxtp').fadeOut(500);
}

function firsttosecond(){
    preLoader();
    $('#first').fadeOut(400);
    $('#second').delay(500).fadeIn(10000);
    $('#audio').trigger("play").animate({volume: 0.0}, 1).delay(50).animate({volume: 0.1}, 20000);
    $('#blackwall').delay(12000).slideUp(3000);
    $('#gif').delay(10000).fadeOut(3000);
}
function removehelp() {
    $('#tutorial').fadeOut(300);
}
function gameover(){
    stop=1;
    $('#gameover').fadeIn(1000);
    $('#audio').delay(300).trigger("pause");
    $('#gameoveraudio').trigger("play").animate({volume: 0.3}, 1);
    setTimeout(function(){ location.reload(); }, 10000);
}
function pewpew(){
    if(stop===0){
        //$("#laser").currentTime=0;
        //$('#laser').trigger("play").animate({volume: 0.2}, 1);
        laser=new Audio("audio/laser.mp3");
        laser.volume=0.1;
        laser.play();
    }
}
function busters(){
    let busters=new Audio("audio/ghostbusters.mpeg");
    busters.play();
}