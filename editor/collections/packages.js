define([
    "hr/hr",
    "hr/promise",
    "models/package",
    "core/rpc"
], function(hr, Q, Package, rpc) {
    var Packages = hr.Collection.extend({
        model: Package,

        listAll: function() {
            return rpc.execute("packages/list")
            .then(this.reset.bind(this));
        },

        loadAll: function() {
            var that = this;
            var errors = {};

            return this.listAll()
            .then(function() {
                return that.reduce(function(prev, pkg) {
                    return prev.then(pkg.load.bind(pkg))
                    .fail(function(err) {
                        errors[pkg.get("name")] = err;
                        return Q();
                    });
                }, Q());
            })
            .then(function() {
                if (_.size(errors) > 0) return Q.reject(errors);
            });
        }
    });

    return Packages;
});