function assert(toCheck, error) {
    if (!toCheck) {
        if (!error) return false;
        else throw error;
    }
}

module.exports = assert;