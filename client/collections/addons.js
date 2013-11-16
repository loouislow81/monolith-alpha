define([
    "q",
    "underscore",
    "hr/hr",
    "core/api",
    "models/addon"
], function(Q, _, hr, api, Addon) {
    var Addons = hr.Collection.extend({
        model: Addon,
        defaults: _.defaults({
            loader: "getInstalled",
            loaderArgs: [],
        }, hr.Collection.prototype.defaults),

        // Constructor
        initialize: function() {
            Addons.__super__.initialize.apply(this, arguments);

            this.resolved = {};
            this.provides = {};

            return this;
        },
        
        // Get installed addons
        getInstalled: function(options) {
            var that = this;
            
            options = _.defaults(options || {}, {});

            return api.rpc("/addons/list").then(function(data) {
                that.add(_.values(data));
            });
        },

        // Get by name
        getByName: function(name) {
            return this.find(function(addon) {
                return addon.get("name") == name;
            });
        },

        // Check addons is installed
        isInstalled: function(name) {
            return this.getByName(name) != null;
        },

        // Check addons is a default addon
        isDefault: function(name) {
            var m = this.getByName(name);
            if (m == null) return false;
            return m.get("default");
        },

        // Get addon state
        getState: function(name) {
            var m = this.getByName(name);
            if (m == null) return null;
            return m.get("state");
        },

        // Install an addon
        install: function(git) {
            var that = this;

            return api.rpc("/addons/install", {
                'git': git
            }).then(function(data) {
                that.add(data);
            });
        },
        uninstall: function(name) {
            var that = this;

            return api.rpc("/addons/uninstall", {
                'name': name
            }).then(function() {
                that.reset([]);
                that.getInstalled();
            });
        },

        // Extract from engineer, order addons for loading
        checkCycles: function() {
            var that = this;
            var plugins = this.map(function(addon, index) {
                return {
                    name: addon.get("name"),
                    provides: addon.get("client.provides", []).concat(),
                    consumes: addon.get("client.consumes", []).concat(),
                    i: index
                };
            });

            var changed = true;
            var sorted = [];

            while(plugins.length && changed) {
                changed = false;

                plugins.concat().forEach(function(plugin) {
                    var consumes = plugin.consumes.concat();

                    var resolvedAll = true;
                    for (var i=0; i<consumes.length; i++) {
                        var service = consumes[i];
                        if (!that.resolved[service]) {
                            resolvedAll = false;
                        } else {
                            plugin.consumes.splice(plugin.consumes.indexOf(service), 1);
                        }
                    }

                    if (!resolvedAll)
                        return;

                    plugins.splice(plugins.indexOf(plugin), 1);
                    plugin.provides.forEach(function(service) {
                        that.resolved[service] = true;
                    });
                    sorted.push(that.models[plugin.i]);
                    changed = true;
                });
            }

            if (plugins.length) {
                var unresolved = {};
                plugins.forEach(function(plugin) {
                    delete plugin.config;
                    plugin.consumes.forEach(function(name) {
                        if (unresolved[name] == false)
                            return;
                        if (!unresolved[name])
                            unresolved[name] = [];
                        unresolved[name].push(plugin.name);
                    });
                    plugin.provides.forEach(function(name) {
                        unresolved[name] = false;
                    });
                });

                Object.keys(unresolved).forEach(function(name) {
                    if (unresolved[name] == false)
                        delete unresolved[name];
                });

                console.error("Could not resolve dependencies of these plugins:", plugins);
                console.error("Resolved services:", Object.keys(resolved));
                console.error("Missing services:", unresolved);
                throw new Error("Could not resolve dependencies");
            }

            return sorted;
        },

        // Load all this addons collection
        // similar loading to engineer
        loadAll: function() {
            var that = this;
            var addons = this.checkCycles();

            return _.reduce(addons, function(d, addon) {
                return d.then(function() {
                    return addon.load({}, _.pick(that.provides, addon.get("client.consumes", [])));
                }).then(function(provides) {
                    _.extend(that.provides, provides || {});
                });
            }, Q({}));
        }
    });

    return Addons;
});