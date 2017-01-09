

var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        // api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'team_list'
    };
	
var options2 = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        // api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'reviewer'
    };

var queryData = function(options, callback) {
	
	console.log(options);
	console.log(callback);
	
    var defaults = {
        action: 'qurey',
    };
    var params = $.extend({}, defaults, options);
    request = $.ajax({
        url: options.api,
        type: 'post',
        data: $.param(params)
    });

    request.done(function(response, textStatus, jqXHR) {
        callback(response, textStatus, jqXHR);
    });

    request.fail(function(jqXHR, textStatus, errorThrown) {
        console.error(
            "The following error occured: " +
            textStatus, errorThrown
        );
    });
};

queryData(options, function(res) {
	console.log(res);
	//console.log(res.data.length)
	var tlen = res.data.length;
	$( "input[name$='TeamID']" ).val( res.data[0].team_id);
	$( "input[name$='TeamName']" ).val( res.data[0].team_name);	
	
	/*
	$("#select").append($("<option></option>").attr("value", "值").text("文字"));
	$("#select").append($("<option></option>").prop("value", "值").text("文字"));	
	// 產生 Option 項目
	function GetOption(text, value) {
		return "<option value = '" + value + "'>" + text + "</option>"
	}
	*/
	for(var i=0;i<tlen;i++){
		$("#select").append($("<option></option>").attr("value", res.data[i].team_name).text(res.data[i].team_name));
	}
	
	$("#select").change(function(){
		$("option:selected",this).each(function(){
			//alert(this.value);
			$( "input[name$='TeamID']" ).val( res.data[this.index].team_id);
			$( "input[name$='TeamName']" ).val( res.data[this.index].team_name);	
		});
	});
})

queryData(options2, function(res) {
	console.log(res);
	
	var jlen = res.data.length;
	$( "input[name$='JudgeID']" ).val( res.data[0].reviewer_id);
	$( "input[name$='JudgeName']" ).val( res.data[0].reviewer_name);	
	
	for(var i=0;i<jlen;i++){
		$("#JudgeNames").append($("<option></option>").attr("value", res.data[i].reviewer_name).text(res.data[i].reviewer_name));
	}
	
	$("#JudgeNames").change(function(){
		$("option:selected",this).each(function(){
			//alert(this.value);
			$( "input[name$='JudgeID']" ).val( res.data[this.index].reviewer_id);
			$( "input[name$='JudgeName']" ).val( res.data[this.index].reviewer_name);	
		});
	});
})

