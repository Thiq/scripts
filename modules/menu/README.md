# Menu
>A module based on [ChatMenuAPI for Spigot](https://github.com/timtomtim7/ChatMenuAPI)

## How to use

### Chat Menu
```
import { ChatMenu } from 'menu';
import * as ChatColor from '@org.bukkit';

let myMenu = new ChatMenu(true); // true for an interactive menu, false for none.
// Most elements have at least 2 arguments.
// 1: the text of the element
// 2: the state object (like an options object) that describes the element 
// 3: the OnClickEventHandler that takes the state object as an argument
myMenu.add(new ChatMenu.TextElement('Hello world!'));
myMenu.add(new ChatMenu.CheckboxElement('Click me!', (s) => {
    // this is called when toggled. 's' contains the state data of the checkbox.
    if (s.isChecked) s.isDisabled = true; // disable element when checked
}));
// by using the string interpolation syntax, you can use placeholders from values in the state object
myMenu.add(new ChatMenu.IncrementElement('${value}', { min: 1, max: 10, value: 5 }, (s) => {
    if (s.value > 5) s.color = 'red';
    else s.color = ChatColor.GREEN;
}));
myMenu.add(new ChatMenu.ButtonElement('CLOSE', { color: 'red' }, (s) => {
    s.menu.close();
}));

var player = //..get player
myMenu.openFor(player);
// to close the window manually
myMenu.closeFor(player);
```
>**State Object**  
`s.text: string`  
`s.isVisible: boolean`  
`s.isDisabled: boolean`  
`s.color: string`  
`s.style: string[]` (strikethrough, underlined, bold, italic, magic)  
`s.horizontalAlignment: ChatMenu.HorizontalAlignment`  
`s.verticalAlignment: ChatMenu.VerticalAlignment`  
`s.left: number`  
`s.right: number`  
`s.top: number`  
`s.bottom: number`  
`s.display: ChatMenu.Display`  
`s.menu: ChatMenu`  
`s.player: org.bukkit.entity.Player`  
