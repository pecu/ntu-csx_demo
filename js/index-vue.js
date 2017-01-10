var project_card_group = new Vue({
    el: '#project_card_group',
    data: {
        projects: [],
    },
    beforeCreate: function() {
        var options = {
            api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
            sheet: 'team_list',
            filter: {
                demo: true
            }
        };
        $('.loader-wrapper').removeClass('hide');
        queryData(options, function(res) {
            project_card_group.projects = res.data;
        });
    },
    updated: function() {
        $('.loader-wrapper').addClass('hide');
    }
});

var teammate_card_group = new Vue({
    el: '#teammate_card_group',
    data: {
        teammate: [],
    },
    beforeCreate: function() {
        var options = {
            api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
            sheet: 'teammate'
        };
        $('.loader-wrapper').removeClass('hide');
        queryData(options, function(res) {
            teammate_card_group.teammate = res.data;
        });
    },
    updated: function() {
        $('.loader-wrapper').addClass('hide');
    }
});