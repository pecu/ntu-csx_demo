$('#query').on('click', function() {
    // 設定查詢資料
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        //api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'team_list'
    };
    // var filter = [
    //     { team_id: 23 },
    //     { team_id: 22 }
    // ];
    // options.filter = filter;

    // 查詢資料
    queryData(options, function(response) {

        if (response.result) {
            $('#output').text(JSON.stringify(response.data, null, 4));
        } else {
            console.log(response);
        }
    });
});