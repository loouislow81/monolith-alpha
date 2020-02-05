define(["views/dialog"], function(SettingsDialog) {
    var Command = monolith.require("models/command");
    var app = monolith.require("core/app");
    var dialogs = monolith.require("utils/dialogs");
    var menu = monolith.require("core/commands/menu");

    // Add opening command
    var command = Command.register("settings", {
        category: "Application",
        title: "Settings",
        icons: {
            'default': "cog",
        },
        shortcuts: [
            "mod+,"
        ],
        position: 100,
        offline: false,
        action: function(page) {
            dialogs.open(SettingsDialog, {
                'page': page,
                'keyboardEnter': false
            });
        }
    });

    menu.getById("file").menu.add(command);
});

