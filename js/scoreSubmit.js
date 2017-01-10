$('#query').on('click', function() {
    // if (formSubmit() == 0) {
    //     return;
    // }
    // 設定查詢資料
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        action: 'update',
        sheet: 'team_score',
    };

    var filter = {
        team_id: parseInt($("input[name$='TeamID']")[0].value),
        reviewer_id: parseInt($("input[name$='JudgeID']")[0].value),
    };
    var data = {
        score_1: parseFloat($("input[name$='score1']")[0].value),
        score_2: parseFloat($("input[name$='score2']")[0].value),
        score_3: parseFloat($("input[name$='score3']")[0].value),
        score_4: parseFloat($("input[name$='score4']")[0].value),
        score_5: parseFloat($("input[name$='score5']")[0].value),
    };

    //console.log(filter);
    //console.log(data);

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