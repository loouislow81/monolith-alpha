define([
    "settings",
    "views/tags"
], function(panelSettings, TagsView) {
    var PanelFileView = monolith.require("views/panels/file");

    var PanelOutlineView = PanelFileView.extend({
        className: "cb-panel-outline",
        FileView: TagsView
    });

    return PanelOutlineView;
});