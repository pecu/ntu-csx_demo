var mychart = new plotdb.view.chart(chart, { data: chart.data });
mychart.attach(document.getElementById("wrapper"));

// console.log(chart.data);

// for (var key in chart.data) {
//     console.log(chart.data[key].order);
// }


// 取得分數名稱的資料
var getScoreName = function(callback) {
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        // api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'score_table'
    };

    queryData(options, function(response) {

        if (response.result) {

            console.log(response.data);
        } else {
            console.log(response);
        }
    });
};


$(window).load(function() {
    getScoreName();
});