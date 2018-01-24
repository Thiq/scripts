import { Pipe, PipeType } from './libs/pipes/pipe';
import * as PipedStack from './libs/pipes/stack';

export default class PipeFactory {
    
}

registerEvent(block, 'redstone', (e) => {
    let state = e.block.getState();
    setTimeout(() => {
        checkForPipeStart(state);
    }, 1);
});

function checkForPipeStart(blockState) {
    console.log(blockState.type);
}