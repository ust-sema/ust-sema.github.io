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
            getEx("/cmd?core=" + $(this).attr("data-core") +"&command=" + $(this).attr("data-cmd")+"%201");
        });

        $(".hbt-command:not(.hbt-one-touch)").on("touchend touchcancel", function (event) {
            getEx("/cmd?core=" + $(this).attr("data-core") + "&command=" + $(this).attr("data-cmd") + "%200");
        });

        $("#go-home").on("touchstart", function (event) {
            getEx("/cmd?core=5&command=home");
            getEx("/cmd?core=7&command=home");
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
        getEx("/cmd?" + st);
        prevL = motorL;
        prevR = motorR;
    }

    var val = $("#servo1input").val();
    if (prevVal == val) return;

    $("#servo1val").text(val);
    getEx("/cmd?servo1=" + val);
    prevVal = val;
}

function baseTurn(val) {
    var b = val - 255;

    $("#baseTurnValue").text(b);
    if (b > 0) {
        getEx("/cmd?core=7&command=base-right%20"+b);
    } else {
        getEx("/cmd?core=7&command=base-left%20" + Math.abs(b));
    }
}

function move() {
    x = myStick.value.x;
    y = myStick.value.y;
    ax = Math.abs(x);
    ay = Math.abs(y);
    motorL = ay;
    motorR = ay;

    if (x < 0) {
        motorL = ay - ax/2;
    } else {
        motorR = ay - ax/2;
    }

    dirL = "dirL=" + (y < 0 ? "1" : "0") + "&";
    dirR = "dirR=" + (y < 0 ? "1" : "0") + "&";

    mt = 45; // parseInt($("#MotorThreshold").val());

    slope = 120 - mt; 

    motorL = motorL < 0 ? 0 : Math.round(motorL * slope) + mt;
    motorR = motorR < 0 ? 0 : Math.round(motorR * slope) + mt;

    z = motorL <= mt && motorR <= mt;
    motorL = z ? 0 : motorL;
    motorR = z ? 0 : motorR;

    $("#motorL").val(motorL);
    $("#motorR").val(motorR);
    $("#motorLval").text(motorL);
    $("#motorRval").text(motorR);

    return dirL + dirR + "motorL=" + motorL + "&motorR=" + motorR;
}

function getEx(url) {
    la = $("#MCUAddress").val(); 
    $.get(la ? la : '' + url);
}