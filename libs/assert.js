global.assert = function(toCheck, error) {
    if (!toCheck) {
        if (!error) return false;
        else throw error;
    }
}