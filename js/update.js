$('#query').on('click', function() {
    // 設定查詢資料
    // dev api = https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev
    // exe api = https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec'
    var options = {
        //api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        action: 'updates',
        sheet: 'team_score',
    };

    var filter = [{
        team_id: 1,
        reviewer_id: 1
    }];
    var data = {

        score_1: 5,
        score_2: 5,
        score_3: 5,
        score_4: 5,
        score_5: 5
    };

    options.data = data;
    options.filter = filter;

    // 查詢資料
    queryData(options, function(response) {

        // console.log(response);

        if (response.result) {
            $('#output').text(JSON.stringify(response.data, null, 4));
        } else {
            console.log(response);
        }
    });
});