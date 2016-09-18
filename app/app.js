
var quad = Vue.extend({
    template: '<div class="quadrant" v-bind:class="{ \'lightened\': lightened }" v-on:mouseup="darken" v-on:mousedown="lighten" ></div>',
    props: ['soundUrl'],
    data: function() {
        var p = document.createElement('audio');
        p.src = this.soundUrl;
        return {
            lightened: false,
            player: p
        }
    },
    methods: {
        lighten: function() {
            this.lightened = true
            this.player.play();
        },
        darken: function() {
            this.lightened = false
        }
    }
});

var strictColumn = new Vue({
    el: '#strict-column',
    data: {
        'isStrict': false
    },
    methods: {
        stricten: function() {
            this.isStrict = true;
        }
    }
});

var main = new Vue({
    el: '#main',
    components: {
        'quad': quad
    }
});
