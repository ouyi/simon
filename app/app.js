
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
        'isOn': false,
        'count': 0,
        'showedSeq': [], 
        'playedSeq': []
    },
    components: {
        'quad': quad
    },
    methods: {
        startGame: function() {
            function showSeq(seq, quad) {
                for (var i = 0; i < seq.length; i++) {
                    (function(ind, child) {
                        setTimeout(function(){
                            child.lighten();
                        }, 1000 * ind);
                    })(i, quad[seq[i]]);
                }
            }
            function genSeq(len, min, max) {
                var seq = [];
                for (var i = 0; i < len; i++) {
                    seq.push(Math.floor(Math.random() * max));
                }
                return seq;
            }
            if (this.isOn) {
                this.count ++;
                this.showedSeq = genSeq(this.count, 0, this.$children.length);
                showSeq(this.showedSeq, this.$children);
            }
        },
        toggleStrict: function() {
            this.isStrict = !this.isStrict;
        },
        toggleOn: function() {
            if (this.isStrict) {
                this.toggleStrict();
            }
            this.isOn = !this.isOn;
        }
    }
});
