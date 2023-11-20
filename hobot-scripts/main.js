var prevVal = 0, prevTrack1 = 0; 
var myStick;

var motorL = 0, prevL = 0;
var motorR = 0, prevR = 0;

$(function () {
    $.get(SourceUrlBase + "main.html", function (data) {

        data = data.replaceAll("@@SourceUrlBase_", SourceUrlBase);
        $("body").append(data);

        $("#baseTurn").val(255);

        $("#baseTurn").on("input", function () {
            baseTurn($("#baseTurn").val());
        });
        $("#baseTurn").on("mouseup touchend touchcancel", function () {
            $("#baseTurn").val(255);
            baseTurn(255);
        });
        $('#JoyScript').on('load', function () {
           
        });

        $(".hbt-command").on("touchstart", function (event) {
            $.get("/cmd?core=" + $(this).attr("data-core") +"&command=" + $(this).attr("data-cmd")+"%201");
        });

        $(".hbt-command:not(.hbt-one-touch)").on("touchend touchcancel", function (event) {
            $.get("/cmd?core=" + $(this).attr("data-core") + "&command=" + $(this).attr("data-cmd") + "%200");
        });


        $.getScript(SourceUrlBase + 'joystick.js', function () {
            myStick = new JoystickController("stick", 64, 8);
            setInterval(send, 100);
        });

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

function baseTurn(val) {
    var b = val - 255;

    $("#baseTurnValue").text(b);
    if (b > 0) {
        $.get("/cmd?core=7&command=base-right%20"+b);
    } else {
        $.get("/cmd?core=7&command=base-left%20" + Math.abs(b));
    }
    //$.get("/cmd?track1=" + val);
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