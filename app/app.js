
var quad = Vue.extend({
    template: '<div class="quadrant" v-bind:class="{ \'lightened\': lightened }" v-on:click="lighten" ></div>',
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
            this.player.onended = this.darken;
        },
        darken: function() {
            this.lightened = false
        }
    }
});

var main = new Vue({
    el: '#main',
    data: {
        'isStrict': false,
        'isOn': false
    },
    components: {
        'quad': quad
    },
    methods: {
        startGame: function() {
            for (var i=0; i < this.$children.length; i++) {
                (function(ind, child) {
                    setTimeout(function(){
                        child.lighten();
                    }, 1000 * ind);
                })(i, this.$children[i]);
            }
        },
        toggleStrict: function() {
            this.isStrict = !this.isStrict;
        },
        toggleOn: function() {
            console.log(this.isOn);
            if (this.isStrict) {
                this.toggleStrict();
            }
            this.isOn = !this.isOn;
        }
    }
});
