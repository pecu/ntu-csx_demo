var mychart = new plotdb.view.chart(chart, { data: chart.data });
mychart.attach(document.getElementById("wrapper"));

console.log(chart.data);

for (var key in chart.data) {
    console.log(chart.data[key].order);
}

var getScore = function(callback) {
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        sheet: 'team_score'
    };
    queryData(options, function(response) {

        if (response.result) {
            chart.data[0].radius = [1, 1, 1, 1, 1, 1];
            console.log(response.data);
        } else {
            console.log(response);
        }
    });
};

// 取得分數名稱的資料
var getScoreName = function(callback) {
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
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

getScoreName();
getScore();
// $(window).load(function() {
//     getScoreName();
// });