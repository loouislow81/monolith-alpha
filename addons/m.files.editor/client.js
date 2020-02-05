define([
    "ace",
    "editor/view"
], function(ace, FileEditorView) {
    var $ = monolith.require("hr/dom");
    var commands = monolith.require("core/commands/toolbar");
    var files = monolith.require("core/files");
    
    var aceconfig = ace.require("ace/config");
    aceconfig.set("basePath", "static/addons/m.files.editor/ace");

    // Add files handler
    files.addHandler("ace", {
        'name': "Edit",
        'fallback': true,
        'setActive': true,
        'position': 5,
        'View': FileEditorView,
        'valid': function(file) {
            return (!file.isDirectory());
        }
    });

    // Return globals
    return {
        'ace': ace
    };
});