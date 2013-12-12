define(["views/dialog"], function(InstallerDialog) {
    var commands = codebox.require("core/commands");
    var app = codebox.require("core/app");
    var dialogs = codebox.require("utils/dialogs");
    var settings = codebox.require("core/settings");

    // Add settings
    settings.add({
        'namespace': "manager",
        'title': "Addons",
        'defaults': {
            'registry': "https://api.codebox.io"
        },
        'fields': {
            'registry': {
                'label': "Registry",
                'type': "text"
            }
        }
    });

    // Add opening command
    commands.register("addons.manager.open", {
        title: "Add-ons",
        icon: "puzzle-piece",
        visible: false
    }, function() {
        dialogs.open(InstallerDialog);
    });
});

