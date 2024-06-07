var prevVal = 0, prevTrack1 = 0; 
var myStick;

var motorL = 0, prevL = 0;
var motorR = 0, prevR = 0;

$(function () {
    $.get(SourceUrlBase + "main.html", function (data) {

        data = data.replaceAll("@@SourceUrlBase_", SourceUrlBase);
        $("body").append(data);

        getEx("/cmd?freq=40");

        $(".hbt-command").on("touchstart", function (event) {
            getEx("/cmd?core=" + $(this).attr("data-core") +"&command=" + $(this).attr("data-cmd")+"%201");
        });

        $(".hbt-command:not(.hbt-one-touch)").on("touchend touchcancel", function (event) {
            getEx("/cmd?core=" + $(this).attr("data-core") + "&command=" + $(this).attr("data-cmd") + "%200");
        });

        $("#go-home").on("touchstart", function (event) {
            getEx("/cmd?core=5&command=home");
            setTimeout(function () { getEx("/cmd?core=7&command=home"); }, 700);
        });

        $.getScript(SourceUrlBase + 'joystick.js', function () {
            myStick = new JoystickController("stick", 64, 8);
            setInterval(send, 100);
        });

    });
   
});

function send() {
    st = move();

    if (motorL !== prevL || motorR !== prevR) {
        getEx("/cmd?" + st);
        prevL = motorL;
        prevR = motorR;
    }
}
function move() {
    x = myStick.value.x;
    y = myStick.value.y;

    motorL = y - x;
    motorR = y + x;

    dirL = "dirL=" + (motorL < 0 ? "1" : "0") + "&";
    dirR = "dirR=" + (motorR < 0 ? "1" : "0") + "&";

    mt = 20;
    slope = 100 - mt;

    motorL = Math.abs(Math.round(motorL * slope)) + mt;
    motorR = Math.abs(Math.round(motorR * slope)) + mt;

    z = motorL <= mt && motorR <= mt;
    motorL = z ? 0 : motorL;
    motorR = z ? 0 : motorR;

    return dirL + dirR + "motorL=" + motorL + "&motorR=" + motorR;
}

function getEx(url) {
    la = $("#MCUAddress").val(); 
    $.get((la ? la : '') + url);
}