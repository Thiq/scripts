// turns WorldGuard areas into key-card access areas only.
import * as crypto from 'crypto';

class KeycardLockedRegion {
    /**
     * The WorldGuard region the class is tied to.
     */
    wgRegionId: string;
    /**
     * A SHA-128 value that the key has embedded into it. If a key does not have this value, 
     * the key does not fit with this region.
     */
    keycardValue: string;

    constructor(wgRegionId: string) {
        this.wgRegionId = wgRegionId;
    }

    /**
     * Generates a new value for the keycard.
     */
    generateNewHash() {
        var sha = crypto.createHash('SHA256');
        sha = sha.update(this.wgRegionId + Date.now());
        this.keycardValue = sha.read().toString();
    }
}

class KeycardLockedItem {
    target; // Block

}

class Keycard {
    
}