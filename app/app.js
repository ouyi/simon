
var topLeft = new Vue({
    el: '#top-l',
    data: {
        lightened: false
    },
    methods: {
        lighten: function() {
            this.lightened = true
        },
        darken: function() {
            this.lightened = false
        }
    }
});

