define([
    "text!templates/image.html",
    "less!stylesheets/image.less"
], function(templateFile) {
    var _ = monolith.require("hr/utils");
    var $ = monolith.require("hr/dom");
    var hr = monolith.require("hr/hr");
    var Dialogs = monolith.require("utils/dialogs");
    var FilesBaseView = monolith.require("views/files/base");

    var FileImageView = FilesBaseView.extend({
        className: "addon-files-imageviewer",
        templateLoader: "text",
        template: templateFile,
        events: {}
    });

    return FileImageView;
});