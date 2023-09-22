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
    </div>';
	

	var roboCookie = 'Robot-Hobot-IP';
	var prevVal=0;
	
	$(function() {
		$("body").append(html);
		
		$("#servo1input").on("input", function() {
			$("#servo1val").text($(this).val());
		});
		
		setInterval(function(){
			var val = $("#servo1input").val();
			if (prevVal == val) return;
			
			$.get("/cmd"?servo1="+val);
			prevVal = val;
		}, 200);
	});