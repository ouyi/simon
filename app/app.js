
// n: number, z: 0
function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

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

function errorSound() {
    var p = document.createElement('audio');
    p.src = "http://www.soundjay.com/button/button-4.wav";
    p.play();
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
            if (this.$parent.isOn) {
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
                    var parent = this.$parent;
                    parent.hasError = true;
                    parent.playedSeq = [];
                    parent.showedSeq = [];
                    parent.countDisplay = '!!';
                    setTimeout(function() {
                        errorSound();
                    }, 300);
                    setTimeout(function() {
                        parent.hasError = false;
                        parent.$options.methods.showSeq.apply(parent);
                    }, 2000);
                }
            }
        },
        lighten: function() {
            this.lightened = true
            this.$parent.countDisplay = pad(this.$parent.count, 2);
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
        'countDisplay': '--',
        'hasError': false,
        'showedSeq': [], 
        'playedSeq': [],
        'generatedSeq': []
    },
    components: {
        'quad': quad
    },
    methods: {
        showSeq: function() {
            console.log("showSeq");
            var seq = this.generatedSeq;
            var quad = this.$children;
            var showedSeq = this.showedSeq;
            for (var i = 0; i < seq.length; i++) {
                (function(ind, child) {
                    setTimeout(function(){
                        child.lighten();
                        showedSeq.push(child.qid);
                    }, 1000 * ind);
                })(i, quad[seq[i]]);
            }
        },
        nextSeq: function() {
            console.log("nextSeq");
            if (this.isOn) {
                this.count ++;
                this.countDisplay = pad(this.count, 2);
                this.showedSeq = [];
                this.playedSeq = [];
                this.generatedSeq = genSeq(this.count, 0, this.$children.length);
                this.showSeq();
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
                this.countDisplay = '--';
                this.showedSeq = [];
                this.playedSeq = [];
                this.generatedSeq = [];
                this.hasError = false;
            }
            this.isOn = !this.isOn;
        }
    }
});
