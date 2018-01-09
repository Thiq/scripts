# Titles
>A simple module to create titles for in-game.

## How do I use it?
```
var Title = require('titles');
var player = getaplayer();
var greeting = new Title('Welcome to the server!', 'Enjoy your stay!')
    .color('red') // the color of the header
    .subColor('white') // the color of the subtitle
    .fadeIn(50) // the fade in of the header in ms
    .subFadeIn(100) // the fade in of the subtitle. If this isn't set, it'll default to the header fade in
    .stay(2000) // how long the header stays in ms
    .subStay(2000) // how long the subtitle stays. If this isn't set, it'll default to the header stay
    .fadeOut(50) // the fade out of the header in ms
    .subFadeOut(50); // the fade out of the subtitle. If this isn't set, it'll default to the header fade out
greeting.send(player); // sends the title to the player
greeting.sendAll(); // sends the title to all players
greeting.header('The new header!'); // sets the new header
greeting.sub('The new subtitle'); // sets the subtitle

```