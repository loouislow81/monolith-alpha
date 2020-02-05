define([], function() {
    var box = monolith.require("core/box");
    var menu = monolith.require("core/commands/menu");
    var commands = monolith.require("core/commands/toolbar");
    var operations = monolith.require("core/operations");
    var hr = monolith.require("hr/hr");
    var Command = monolith.require("models/command");
    var localfs = monolith.require("core/localfs");
    var dialogs = monolith.require("utils/dialogs");

    // Command to check connection
    var checkConnection = commands.register("offline.check", {
        'category': "Offline",
        'title': "Check Connection",
        'offline': true,
        'icons': {
            'default': "bolt",
        }
    }, function() {
        hr.Offline.check();
    });

    // Changes list
    var menuListChanges = new Command({}, {
        'title': "Changes",
        'type': "menu",
        'flags': "disabled"
    });

    // Menu Synchronize
    var menuSync = menu.register("offline.synchronize", {
        title: "Synchronize",
        position: 95,
        offline: false
    }).menuSection([
        checkConnection
    ]).menuSection([
        {
            'id': "offline.changes.calcul",
            'category': "Offline",
            'title': "Calcul Changes",
            'offline': false,
            'action': function() {
                return localfs.sync();
            }
        }
    ]).menuSection([
        {
            'id': "offline.changes.reset",
            'category': "Offline",
            'title': "Reset All Changes",
            'offline': false,
            'action': function() {
                return localfs.reset();
            }
        },
        {
            'id': "offline.changes.apply",
            'category': "Offline",
            'title': "Apply All Changes",
            'offline': false,
            'action': function() {
                var n = localfs.changes.size();
                if (n == 0) return;

                dialogs.confirm("Do you really want to apply "+n+" changes?").then(function(yes) {
                    if (!yes) return;
                    return localfs.changes.applyAll();
                });   
            }
        }
    ]).menuSection([
        menuListChanges
    ]);

    // Changes update
    localfs.changes.on("add remove reset", function() {
        menuListChanges.toggleFlag("disabled", localfs.changes.size() == 0);
        menuListChanges.menu.reset(localfs.changes.map(function(change) {
            return change.command();
        }));
    });

    return {
        'sync': menuSync
    }
});