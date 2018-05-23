/**
 * Registers a permission. 
 * @param {string} permission 
 * @param {*} perm_default: Can be true for anybody to use it, false for permission only, or 'op' for operator only.
 * @param {string[]} parents 
 */
global.registerPermission = function(permission, perm_default, parents) {
    try {
        if (loader.server.pluginManager.getPermission(permission)) {
            loader.server.pluginManager.removePermission(loader.server.pluginManager.getPermission(permission));
        }

        if (perm_default === true) perm_default = 'true';
        if (perm_default === false) perm_default = 'false';

        var perm_default = org.bukkit.permissions.PermissionDefault[perm_default.toUpperCase()]
        var permission = new org.bukkit.permissions.Permission(permission, perm_default);

        if (parents) {
            for (var i in parents) {
                permission.addParent(parents[i].permission, parents[i].value);
            }
        }

        loader.server.pluginManager.addPermission(permission);
        permission.recalculatePermissibles();
        return permission;
    } catch (ex) {
        console.log(ex);
        return null;
    }
}
