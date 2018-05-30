// A quick writeup as to what custom pipes might look like in JS. This is basically a plugin version of BuildCraft's pipe system.
// On any container, you can place a piston that points to the container (i.e.: chest, furnace, etc).
// Chests can output and input items from any side.
// Furnaces can only receive smeltable items from the top, fuel from bottom, and only output from side faces.
// Pipes are glass blocks. They act as standard pipes. Stained glass blocks can only transport to other stained glass blocks of the same color OR standard pipes.
// Modifying blocks can be placed between the pipes to add flow mechanics:
// Diamond blocks act as gates. You can place up to 9 different blocks per stained color. Those that match no criteria will pass through any pipe that has no filter at random.
// Gold blocks speed up the item. 
// Obsidian acts as a teleporting block. The obsidian must have a sign at the end of it in the format:
// [TX:0] (sends on channel 0. Max of 65535, min of 0)
// [RX:0] (receives on channel 0. Doesn't have to match TX)
// At normal speed, it should take a block 3 seconds to move 1 MCU (minecraft unit), no matter which vector direction. At high speed, it'll move 1 block in .5 seconds, increasing time by .5 seconds every block, essentially boosting it for 5 blocks.
// If an item reaches the container and there is no room, it will drop onto the ground.

import * as PipeFactory from './factory';


