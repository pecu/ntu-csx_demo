var chartData = [
    { "radius": [], "order": "創意" },
    { "radius": [], "order": "實踐" },
    { "radius": [], "order": "溝通協作" },
    { "radius": [], "order": "專題報告表現" },
    { "radius": [], "order": "專業技術" }
];

// function getUrlParameter(sParam) {
//     var sPageURL = decodeURIComponent(window.location.search.substring(1)),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return sParameterName[1] === undefined ? true : sParameterName[1];
//         }
//     }
// }


var getScore = function(team_id) {

    team_id = parseInt(team_id);

    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        sheet: 'team_score',
        filter: {
            team_id: team_id,
        }
    };

    queryData(options, function(response) {
        if (response.result) {
            for (var key in response.data) {
                for (var i in response.data[key]) {
                    for (var number in chartData) {
                        if (i == 'score_1') {
                            chartData[0].radius[key] = response.data[key]['score_1'];
                        } else if (i == 'score_2') {
                            chartData[1].radius[key] = response.data[key]['score_2'];
                        } else if (i == 'score_3') {
                            chartData[2].radius[key] = response.data[key]['score_3'];
                        } else if (i == 'score_4') {
                            chartData[3].radius[key] = response.data[key]['score_4'];
                        } else if (i == 'score_5') {
                            chartData[4].radius[key] = response.data[key]['score_5'];
                        }
                    }
                }
            }


            var mychart = new plotdb.view.chart(chart, { data: chartData });
            mychart.attach(document.getElementById("wrapper"));
            mychart.update();
        }
    });
};

var team_id = $.url(document.URL).param('team_id');

getScore(team_id);