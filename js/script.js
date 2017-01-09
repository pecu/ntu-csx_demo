var link = [];

var initEvent = function() {
    var l = link.length;
    var a = 0;

    var COUNT_START = 1 * 5 * 10; // tenths * seconds * hours
    var count = COUNT_START;
    var playing = false;

    playpause = document.getElementById('playpause');
    reset = document.getElementById('reset');
    playpause.onclick = playbtn;
    reset.onclick = reseting;

    function playbtn() {
        if (playing) {
            playing = false;
            console.log("Pause!");
            playpause.innerHTML = "▶";
        } else if (!playing) {
            playing = true;
            console.log("Play!");
            playpause.innerHTML = "‖";
        }
    }
    function reseting() {
        playing = false;
        playpause.innerHTML = "▶";
        console.log("Reset Timer!");
        count = COUNT_START;
        clearTimeout(tt);
        countdown();
    }

    function countdown() {
        avs = a < l - 1 && a >=0 ? true : false;
        displayTime();
        if (count == 0) {
            playing = false;
            // console.log(avs);
            if (avs) {
                var j = confirm('時間到，下一組！');
                reseting();
            } else {
                alert('這是最後一組了！謝謝觀賞');
            }
            console.log('第' + (a + 1) + "組");
            if (j) {
                $('iframe').attr('src', link[++a]);
                setTimeout(playbtn, 2000);
            }
        } else if (playing) {
            // clearTimeout(tt);
            tt = setTimeout(countdown, 100);
            count--
        } else {
            // clearTimeout(tt);
            tt = setTimeout(countdown, 100);
        }
    }


    function displayTime() {
        var tenths = count;
        var sec = Math.floor(tenths / 10); // 300
        var hours = Math.floor(sec / 3600); //  1 / 12
        var mins = Math.floor(sec / 60); // 5
        sec = sec - mins * (60);
        // console.log('0');
        if (hours < 1) {
            document.getElementById('time_left').innerHTML = LeadingZero(mins) + ':' + LeadingZero(sec);
        } else {
            document.getElementById('time_left').innerHTML = hours + ':' + LeadingZero(mins) + ':' + LeadingZero(sec);
        }
    }

    function LeadingZero(Time) {
        return (Time < 10) ? "0" + Time : +Time;
    }

    // 頁面跳轉

    $('#next').on('click', function() {
        console.log(avs);
        if (avs) {
            $('iframe').attr('src', link[++a]);
            console.log('第' + (a + 1) + "組");
        } else {
            return false ;
        }
    });

    $('#pre').on('click', function() {
        if (a> 0){
            $('iframe').attr('src', link[--a]);
            console.log('第' + (a + 1) + "組");
        } else {
            return false ;
        }
    });

    $('#jump').on('click', function() {
        var jump = prompt("輸入要跳轉的組別");
        a = +jump;
        if(a < l){
            $('iframe').attr('src', link[a]);
            console.log('第' + (a + 1) + "組");
        }else{
            alert("沒這麼多組別，跳至最後一組");
            a = l-1 ;
            $('iframe').attr('src', link[a]);
        }
    });

    countdown();
}

var initData = function() {
    var options = {
        api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
        // api: 'https://script.google.com/a/macros/csie.ntu.edu.tw/s/AKfycbx2VJc30mJ_EeQ2zN_8W0EYBoHf5yhyeuflgzx_bl6H/dev',
        sheet: 'team_list'
    };

    // 查詢資料
    queryData(options, function(response) {

        if (response.result) {
            for(var i = 0; i < response.data.length; i++) {
                // link.push(response.data[i].project_url);
                link.push(response.data[i].slide_url);
            }

            // 找出 team id 為 1 的資料
            var team = $.grep(response.data, function(item) {
                return item.team_id == 1;
            });
            $('#output').text(JSON.stringify(team, null, 4));

            initEvent();
        } else {
            $('#output').text(JSON.stringify(response, null, 4));
        }
    });
}

initData();
