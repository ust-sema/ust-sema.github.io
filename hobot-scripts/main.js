var html='\
    <div class="container text-center">\
        <div class="input-group mb-3 mt-4">\
            <span class="input-group-text" id="inputGroup-sizing-default">Адрес робота:</span>\
            <input type="text" class="form-control" id="hobotIp" >\
        </div>\
        <div class="row">\
            <div class="col-9 mb-3">\
                Сервопривод 1\
            </div>\
        </div>\
        <div class="row">\
            <div class="col-6">\
                <input type="range" class="form-range" min="0" max="180" id="servo1input">\
            </div>\
            <div id="servo1val" class="col-3">\
                100\
            </div>\
        </div>\
        <div class="row mt-3">\
            <div class="col-9 mb-3">\
                Трак 1\
            </div>\
        </div>\
        <div class="row">\
            <div class="col-6">\
                <input type="range" class="form-range" min="0" max="255" id="track1input">\
            </div>\
            <div id="track1val" class="col-3">\
                0\
            </div>\
        </div>\
    </div>';
	
	var prevVal=0, prevTrack1=0; 
	
	$(function() {
        $("body").append(html);

        $("#track1input").val(0);
		
        $("#track1input").on("input", function () {
            track1($("#track1input").val());
        });
        $("#track1input").on("mouseup touchend touchcancel", function () {
            $("#track1input").val(0);
            track1(0);
        });

		setInterval(send, 200);
	});

function send() {
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