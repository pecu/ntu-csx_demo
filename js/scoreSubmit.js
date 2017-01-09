$('#query').on('click', function() {
    formSubmit();
    // 設定查詢資料
    // dev api = https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev
    // exe api = https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec'
    var options = {
        //api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        action: 'updates',
        sheet: 'team_score',
    };

    var filter = {
        team_id: $("input[name$='TeamID']")[0].value
    };
    var data = {
        reviewer_id: $("input[name$='JudgeID']")[0].value,
        score_1: $("input[name$='score1']")[0].value,
        score_2: $("input[name$='score2']")[0].value,
        score_3: $("input[name$='score3']")[0].value,
        score_4: $("input[name$='score4']")[0].value,
        score_5: $("input[name$='score5']")[0].value
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