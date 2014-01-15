define([
    'underscore',
    'jQuery',
    'q',
    'hr/hr',
    'views/tabs/base',
    'utils/dialogs'
], function(_, $, Q, hr, Tab, dialogs) {

    var FileTab = Tab.extend({
        defaults: {},
        menuTitle: "Code Editor",

        initialize: function(options) {
            FileTab.__super__.initialize.apply(this, arguments);

            this.fileHandler = this.options.handler;

            if (!this.fileHandler || !this.fileHandler.View) {
                throw "Invalid handler for file tab";
            }

            // Bind file events
            this.model.on("set", this.update, this);
            this.model.on("destroy", function() {
                this.closeTab();
            }, this);
            
            // When tab is ready : load file
            this.on("tab:ready", function() {
                this.adaptFile();
            }, this);

            return this;
        },

        /* Render */
        render: function() {
            this.$el.empty();
            var f = new this.fileHandler.View({
                model: this.model
            }, this);
            f.update();
            f.$el.appendTo(this.$el);
            this.adaptFile();
            return this.ready();
        },

        /* Change the file */
        load: function(path, handler) {
            var that = this;
            if (handler) {
                this.fileHandler = handler;
            }
            this.model.getByPath(path).then(null, function() {
                that.closeTab();
            })
            return this;
        },

        /* Adapt the tab to the file (title, ...) */
        adaptFile: function() {
            this.setTabTitle(this.model.get("name", "loading..."));
            this.setTabType(this.model.isDirectory() ? "directory" : "file");
            this.setTabId(this.fileHandler.id+":"+this.model.syncEnvId());
            return this;
        },

        /* Close the tab: check that file is saved */
        tabCanBeClosed: function() {
            var that = this;

            if (this.model.modified && !this.model.isNewfile()) {
                return dialogs.confirm("Do you really want to close "+_.escape(this.model.get("name"))+" without saving changes?", "Your changes will be lost if you don't save them.").then(function(c) {
                    return true;
                }, function() {
                    return false;
                });
            }
            return true;
        }
    });

    return FileTab;
});