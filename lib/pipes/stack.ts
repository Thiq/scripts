import { Location } from '@org.bukkit';

function getUpdateCount(time) {
    return time/50;
}

// show items moving through pipes
// to do this, we get the piston being powered event and then call setInterval() to process what items are being transported. All movements are async promise based.
export default class PipedStack {
    itemstack;
    startat;
    at;

    constructor(itemstack, startAt) {
        this.itemstack = itemstack;
        itemstack.setCanPickup(false);
        
        this.startat = startAt + new Location(0.5, 0.5, 0.5);
        this.at = this.startat.clone();
    }

    animate(target, speed) {
        return new Promise(function (resolve, reject) {
            var updateCount = getUpdateCount(speed);
            var diff = (target - this.start) / updateCount;
            this.itemstack.spawn(this.at);
            var interval = setInterval(function (currentCount) {
                try {
                    if (currentCount >= updateCount) {
                        clearInterval(interval);
                    }
                    this.at += diff;
                    this.itemstack.teleport(this.at);
                    currentCount++;
                    resolve(this);
                } catch (ex) {
                    clearInterval(interval);
                    reject(ex);
                }

            }, 50, 0);
        });
    }

    animateUp(speed) {
        return this.animate(this.at + new Location(0, 1, 0), speed);
    }

    animateDown(speed) {
        return this.animate(this.at - new Location(0, 1, 0), speed);
    }

    animateEast(speed) {
        return this.animate(this.at + new Location(1, 0, 0), speed);
    }

    animateWest(speed) {
        return this.animate(this.at - new Location(1, 0, 0), speed);
    }

    animateNorth(speed) {
        return this.animate(this.at + new Location(0, 0, 1), speed);
    }

    animateSouth(speed) {
        return this.animate(this.at - new Location(0, 0, 1), speed);
    }

    tryInventoryMerge(inventory) {
        var leftOver = inventory.add(this.itemstack);
        return leftOver.amount == 0;
    }

    drop() {
        // basically, this'll spawn a new itemstack off of this one
        var newstack = this.itemstack.clone();
        newstack.setCanPickup(true);
        newstack.spawn(this.at);
    }

    destroy() {
        this.itemstack.delete();
    }
}