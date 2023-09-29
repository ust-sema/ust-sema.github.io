var prevVal = 0, prevTrack1 = 0; 
var myStick;

var motorL = 0, prevL = 0;
var motorR = 0, prevR = 0;

$(function () {
    $.get(SourceUrlBase + "main.html", function (data) {

        data = data.replaceAll("@@SourceUrlBase_", SourceUrlBase);
        $("body").append(data);

        $("#track1input").val(0);

        $("#track1input").on("input", function () {
            track1($("#track1input").val());
        });
        $("#track1input").on("mouseup touchend touchcancel", function () {
            $("#track1input").val(0);
            track1(0);
        });

        while (typeof JoystickController === 'undefined') {
            // waiting until script loaded
        }

        myStick = new JoystickController("stick", 64, 8);

        setInterval(send, 100);

    });
   
});

function send() {
    $("#hobotIp").val(JSON.stringify(myStick.value));
    st = move();
    $("#hobotIp").val($("#hobotIp").val() + ' ' + st);

    if (motorL !== prevL || motorR !== prevR) {
        $.get("/cmd?" + st);
        prevL = motorL;
        prevR = motorR;
    }

    var val = $("#servo1input").val();
    if (prevVal == val) return;

    $("#servo1val").text(val);
    $.get("/cmd?servo1=" + val);
    prevVal = val;
}

function track1(val) {
    $("#track1val").text(val);
    $.get("/cmd?track1=" + val);
}

function move() {
    x = myStick.value.x;
    y = myStick.value.y;
    ax = Math.abs(x);
    ay = Math.abs(y);
    motorL = ay;
    motorR = ay;

    if (x < 0) {
        motorR = ay - ax;
    } else {
        motorL = ay - ax;
    }

    dirL = "dirL=" + (y < 0 ? "1" : "0") + "&";
    dirR = "dirR=" + (y < 0 ? "1" : "0") + "&";

    motorL = motorL < 0 ? 0 : motorL * 100;
    motorR = motorR < 0 ? 0 : motorR * 100;
    prc = 155 / 100;

    motorL = Math.round(motorL * prc) + 100;
    motorR = Math.round(motorR * prc) + 100;

    motorL = motorL == 100 ? 0 : motorL;
    motorR = motorR == 100 ? 0 : motorR;

    $("#motorL").val(motorL);
    $("#motorR").val(motorR);
    $("#motorLval").text(motorL);
    $("#motorRval").text(motorR);

    return dirL + dirR + "motorL=" + motorL + "&motorR=" + motorR;
}