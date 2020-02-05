define([
    "settings",
    "views/panel"
], function(settings, PanelOutlineView) {
    var commands = monolith.require("core/commands/toolbar");
    var app = monolith.require("core/app");
    var panels = monolith.require("core/panels");
    var menu = monolith.require("core/commands/menu");
    var box = monolith.require("core/box");

    // Add outline panel
    var panel = panels.register("outline", PanelOutlineView, {
        title: "Outline"
    });
    
    // Add command to open outline panel
    panel.connectCommand(commands.register("outline.open", {
        category: "Panels",
        title: "Outline",
        description: "Open Outline Panel",
        icons: {
            'default': "code",
        },
        position: 2,
        shortcuts: []
    }));

    // Open panel during startup
    if (settings.user.get("startup")) panel.open();
});