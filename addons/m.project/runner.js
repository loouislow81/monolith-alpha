define([
    'autorun'
], function(autorun) {
    var _ = monolith.require("hr/utils");
    var operations = monolith.require("core/operations");
    var box = monolith.require("core/box");
    var dialogs = monolith.require("utils/dialogs");
    var alerts = monolith.require("utils/alerts");
    var Command = monolith.require("models/command");

    // Run commands
    var runCommands = Command.register("project.run.action", {
        'category': "Project",
        'title': "Perform Action",
        'type': "menu",
        'offline': false,
        'search': false
    });

    // Update runner list
    var updateList = function() {
        return box.runner().then(function(runner) {
            runCommands.menu.reset(_.map(runner, function(_runner) {
                return {
                    'title': _runner.name,
                    'action': function() {
                        autorun.command.run({
                            'id': _runner.id
                        });
                    }
                };
            }));

            return ports;
        });
    };

    return {
        'command': runCommands,
        'update': updateList
    }
});