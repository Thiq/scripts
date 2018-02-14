# Sound Of Music (SoM)
> A music module for Spigot servers running Thiq

## How to use
```
var som = require('som');
var song = new som.Song(som.instruments.chime);

song.bpm('95') // sets the tempo of the song
    .measures(som.measures.threeQuarters) // sets the measure. Default is 4/4
    .play('c', 0) // plays a c in octave 0 for 1 beat
    .wait(1) // waits 1 beat
    .play('d', 0) // plays a d 
    .wait(1) // waits 1 beat
    .play('e', 0) // plays an e

var player = //..fetch player
song.playFor(player);
```
You can call `.bpm()` and `.measures()` at any time through the composition to change the beat or measure. Everything is built as functions are called, resulting in a WYSIWYG object.