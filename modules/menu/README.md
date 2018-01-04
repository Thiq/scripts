# Menu
>A module based on [ChatMenuAPI for Spigot](https://github.com/timtomtim7/ChatMenuAPI)

## How to use

### Chat Menu
```
import { ChatMenu } from 'menu';
import * as ChatColor from '@org.bukkit';

let myMenu = new ChatMenu(true); // true for an interactive menu, false for none.
myMenu.add(new ChatMenu.TextElement('Hello world!'));
myMenu.add(new ChatMenu.CheckboxElement('Click me!', (s) => {
    // this is called when toggled. 's' contains the state data of the checkbox.
    if (s.isChecked) s.isDisabled = true; // disable element when checked
}));
myMenu.add(new ChatMenu.IncrementElement(1 /*min*/, 10 /*max*/, (s) => {
    if (s.value > 5) s.color = ChatColor.RED;
    else s.color = ChatColor.GREEN;
}));
myMenu.add(new ChatMenu.CloseElement('Close'));

var player = //..get player
myMenu.openFor(player);
// to close the window manually
myMenu.closeFor(player);
```
**State Object**  
`s.isVisible: boolean`  
`s.isDisabled: boolean`  
`s.color: org.bukkit.ChatColor`  


