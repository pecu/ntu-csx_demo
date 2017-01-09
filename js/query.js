var queryData = function(options, callback) {
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