/**
 * 抓取 Google Sheet 的資料，並且以 JSON 格式回傳
 * @param {any} options
 *              action = 'query'; 設定為抓取的動作為查詢
 *
 * @param {any} callback
 * @author kchen.tw
 * @since 0.1.0 11/07/2016 kchen.tw
 * @version 0.1.0
 *
 */
function queryData(options, callback) {
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
}

function a() {

}