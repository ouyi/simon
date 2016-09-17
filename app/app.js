
var quad = Vue.extend({
    template: '<div class="quadrant" v-bind:class="{ \'lightened\': lightened }" v-on:mouseup="darken" v-on:mousedown="lighten" ></div>',
    props: ['soundUrl'],
    data: function() {
        return {
            lightened: false,
            player: document.createElement('audio')
        }
    },
    methods: {
        lighten: function() {
            this.lightened = true
            //var player = document.createElement('audio');
            //player.setAttribute('controls', true);
            this.player.src = this.soundUrl;
            //this.player.setAttribute('autoplay', true);
            //document.body.appendChild(player);
            //this.player.load();
            this.player.play();
/*
            var audioContext;
            var audioBuffer = 0;
            try {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
            }
            catch(e) {
                alert('Web Audio API is not supported in this browser');
            }

            this.$http.jsonp(this.soundUrl).then(function(response) {
                console.log(response);
                // success callback
                audioContext.decodeAudioData(response.data, function(buffer) {
                        audioBuffer = buffer;
                    }, function(e){ 
                        console.log(e); 
                    }
                );
                var source = audioContext.createBufferSource(); // creates a sound source
                source.buffer = audioBuffer;                    // tell the source which sound to play
                source.connect(audioContext.destination);       // connect the source to the context's destination (the speakers)
                source.start(0);                  
            }, function(response) {
                // error callback
                alert('Error fetching ' + this.soundUrl);
            });
*/
        },
        darken: function() {
            this.lightened = false
        }
    }
});

var main = new Vue({
    el: '#main',
    components: {
        'quad': quad
    }
});
