'use strict';

var errorSound = "http://www.soundjay.com/button/sounds/button-10.mp3";
var startSound = "http://www.soundjay.com/misc/bell-ringing-05.mp3";
var victoryCount = 3;
var victorySeq = [3, 1, 0, 2, 3, 1, 0, 2];

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

function sleepPromise(ms) {
    return new Promise(function(resolve) {
        setTimeout(resolve, ms);
    });
}

function playSoundPromise(url) {
    return new Promise(function(resolve, reject) {
        var audio = new Audio();
        audio.preload = "auto";
        audio.autoplay = true;
        audio.onerror = reject;
        audio.onended = resolve;

        audio.src = url
    });
}

var quad = Vue.extend({
    template: '#quad-template',
    props: ['qid', 'soundUrl'],
    data: function() {
        return {
            lightened: false,
        }
    },
    methods: {
        play: function() {
            this.lighten().then(this.darken);
            this.$dispatch('quad-played', this.qid);
        },
        lighten: function() {
            this.lightened = true
            this.$parent.countDisplay = pad(this.$parent.count, 2);
            return playSoundPromise(this.soundUrl);
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
        'latency': 500,
        'countDisplay': '--',
        'blink': false,
        'showedSeq': [],
        'playedSeq': [],
        'generatedSeq': [],
        'quads': []
    },
    components: {
        'quad': quad
    },
    methods: {
        showSeq: function() {
            console.log("showSeq");
            var sequence = Promise.resolve();
            for (var i = 0; i < this.generatedSeq.length; i++) {
                var child = this.quads[this.generatedSeq[i]];
                sequence = sequence.then(sleepPromise.bind(null, this.latency))
                .then(child.lighten)
                .then(child.darken)
                .then(function(showedSeq, qid) {
                    showedSeq.push(qid);
                }.bind(null, this.showedSeq, parseInt(child.qid)));
            }
            return sequence;
        },
        nextSeq: function() {
            console.log("nextSeq");
            if (this.isOn) {
                this.count ++;
                this.countDisplay = pad(this.count, 2);
                this.showedSeq = [];
                this.playedSeq = [];
                this.generatedSeq = genSeq(this.count, 0, this.quads.length);
                return this.showSeq();
            }
        },
        toggleStrict: function() {
            if (this.isOn) {
                this.isStrict = !this.isStrict;
            }
        },
        reset: function() {
            this.count = 0;
            this.countDisplay = '--';
            this.showedSeq = [];
            this.playedSeq = [];
            this.generatedSeq = [];
            this.blink = false;
            this.latency = 500;
            this.quads = this.$children.sort(function(a, b){ 
                return parseInt(a.qid) - parseInt(b.qid);
            })
        },
        start: function() {
            if (this.isOn) {
                this.reset();
                playSoundPromise(startSound).then(this.nextSeq);
            }
        },
        toggleOn: function() {
            this.reset();
            this.isStrict = false;
            this.isOn = !this.isOn;
        },
        quadPlayed: function(qid) {
            if (this.isOn) {
                this.playedSeq.push(qid);
                // check array contains
                console.log(this.playedSeq);
                if (isPrefix(this.playedSeq, this.showedSeq)) {
                    if (this.playedSeq.length === this.showedSeq.length) {
                        if (this.count === victoryCount) {
                            this.generatedSeq = victorySeq;
                            this.blink = true;
                            this.latency = 0;
                            sleepPromise(500)
                                .then(this.showSeq)
                                .then(sleepPromise.bind(null, 3000))
                                .then(this.start);
                        } else {
                            sleepPromise(2000).then(this.nextSeq);
                        }
                    }
                } else {
                    console.log("Error!");
                    var that = this;
                    this.blink = true;
                    this.playedSeq = [];
                    this.showedSeq = [];
                    this.countDisplay = '!!';
                    sleepPromise(300)
                        .then(playSoundPromise.bind(null, errorSound))
                        .then(sleepPromise.bind(null, 2000))
                        .then(function(){
                            that.blink = false;
                            if (that.isStrict) {
                                that.start();
                            } else {
                                that.showSeq();
                            }
                        });
                }
            }
        }
    }
});
