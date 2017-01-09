var team_card_group = new Vue({
    el: '#team_card_group',
    data: {
        teams: [],
        apiUrl: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
    },
    // beforeCreate: function() {
    //     // var options = {
    //     //     api: 'https://script.google.com/macros/s/AKfycbzTfdt_q9aNqvWp7LW9JKy6sZeL9fK-KjDcsuaFdmoLlzYsu0-R/exec',
    //     //     sheet: 'team_list',
    //     // };
    //     // queryData(options, function(res) {
    //     //     console.log(res.data);
    //     //     team_card_group.teams = res.data;
    //     // });
    //     this.getData();
    // },
    beforeCreate: function() {
        this.$http.jsonp(this.apiUrl, { sheet: 'team_list' })
            .then(function(response) {
                this.$set('teams', response.data);
            });
    },
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