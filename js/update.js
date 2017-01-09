$('#query').on('click', function() {
    // 設定查詢資料
    // dev api = https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev
    // exe api = https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec'
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        // api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'team_list'
    };

    // 查詢資料
    queryData(options, function(response) {

        console.log(response);

        if (response.result) {
            // 找出 team id 為 1 的資料
            var team = $.grep(response.data, function(item) {
                return item.team_id == 1;
            });
            $('#output').text(JSON.stringify(team, null, 4));
        } else {
            $('#output').text(JSON.stringify(response, null, 4));
        }
    });
});