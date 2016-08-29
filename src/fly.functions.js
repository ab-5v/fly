/**
 * Hide all fly instances
 */
fly.hideAll = function () {
    for (var i = 0, ln = fly._instances.length; i < ln; i++) {
        fly._instances[i].hide();
    }
};
