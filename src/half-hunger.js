eventHandler('entity', 'foodLevelChange', function (e) {
    var entity = e.getEntity();
    var targetFoodLevel = e.getFoodLevel();
    if (!entity.getFoodLevel) return;
    var currentFoodlevel = entity.getFoodLevel();
    var dif = currentFoodLevel - targetFoodLevel;
    e.setFoodLevel(dif / 2);
});