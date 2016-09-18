
function isPrefix(a, b) {
    var p = b.slice(0, a.length);
    var isSame = (a.length == p.length) && a.every(function(element, index) {
        return element === p[index]; 
    });
    return isSame;
}

function genSeq(len, min, max) {
    var seq = [];
    for (var i = 0; i < len; i++) {
        seq.push(Math.floor(Math.random() * max));
    }
    return seq;
}

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
            if (isPrefix(this.$parent.playedSeq, this.$parent.showedSeq)) {
                if (this.$parent.playedSeq.length === this.$parent.showedSeq.length) {
                    var parent = this.$parent;
                    setTimeout(function() {
                        parent.$options.methods.nextSeq.apply(parent);
                    }, 2000);
                }
            } else {
                console.log("Error!");
                this.this.$parent.playedSeq = [];
            }
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
        nextSeq: function() {
            function showSeq(seq, quad, showedSeq) {
                console.log("showSeq");
                for (var i = 0; i < seq.length; i++) {
                    (function(ind, child) {
                        setTimeout(function(){
                            child.lighten();
                            showedSeq.push(child.qid);
                        }, 1000 * ind);
                    })(i, quad[seq[i]]);
                }
            }
            console.log("nextSeq");
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
            if (this.isOn) {
                this.isStrict = !this.isStrict;
            }
        },
        toggleOn: function() {
            if (this.isOn) {
                this.isStrict = false;
                this.count = 0;
                this.showedSeq = [];
                this.playedSeq = [];
            }
            this.isOn = !this.isOn;
        }
    }
});
