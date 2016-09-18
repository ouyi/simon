
var quad = Vue.extend({
    template: '<div class="quadrant" v-bind:class="{ \'lightened\': lightened }" v-on:click="play" ></div>',
    props: ['qid', 'soundUrl'],
    data: function() {
        var p = document.createElement('audio');
        p.src = this.soundUrl;
        return {
            lightened: false,
            player: p
        }
    },
    methods: {
        play: function() {
            this.lighten();
            this.$parent.playedSeq.push(this.qid);
            // check array contains
            console.log(this.$parent.playedSeq);
        },
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
            function showSeq(seq, quad, showedSeq) {
                for (var i = 0; i < seq.length; i++) {
                    (function(ind, child) {
                        setTimeout(function(){
                            child.lighten();
                            showedSeq.push(child.qid);
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
                this.showedSeq = [];
                this.playedSeq = [];
                var seq = genSeq(this.count, 0, this.$children.length);
                showSeq(seq, this.$children, this.showedSeq);
                console.log(this.showedSeq);
            }
        },
        toggleStrict: function() {
            this.isStrict = !this.isStrict;
        },
        toggleOn: function() {
            if (this.isStrict) {
                this.toggleStrict();
            }
            if (this.isOn) {
                this.count = 0;
                this.showedSeq = [];
                this.playedSeq = [];
            }
            this.isOn = !this.isOn;
        }
    }
});
