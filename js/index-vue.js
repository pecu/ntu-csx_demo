var team_card_group = new Vue({
    el: '#team_card_group',
    data: {
        teams: [],
        imgUrl: '',
    },
    beforeCreate: function() {
        var options = {
            api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
            sheet: 'team_list',
            filter: {
                demo: true
            }
        };
        queryData(options, function(res) {
            console.log(res.data);
            team_card_group.teams = res.data;
        });
        // this.getData();
    },
    // beforeCreate: function() {
    //     this.$http.post(this.apiUrl, { sheet: 'team_list' })
    //         .then(function(response) {
    //             this.$set('teams', response.data);
    //         })
    //         .catch(function(response) {
    //             console.log(response)
    //         });
    // },
    // ready: function() {
    //     // this.getData();
    //     console.log("ok");
    // },
    // methods: {
    //     getData: function() {
    //         console.log("test");
    //         this.$http.jsonp(this.apiUrl, { sheet: 'team_list' }).then(function(response) {
    //             this.$set('teams', response.data);
    //         });
    //     }
    // }
});