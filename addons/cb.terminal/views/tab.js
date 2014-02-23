define([
    "vendors/sh",
    "less!stylesheets/tab.less"
], function(Terminal) {
    var _ = codebox.require("hr/utils");
    var $ = codebox.require("hr/dom");
    var hr = codebox.require("hr/hr");
    var Tab = codebox.require("views/tabs/base");
    var box = codebox.require("core/box");
    var user = codebox.require("core/user");

    var settings = user.settings("terminal");

    var TerminalTab = Tab.extend({
        className: Tab.prototype.className+ " addon-terminal-tab",
        defaults: {
            shellId: null,
            resize: true
        },
        menuTitle: "Terminal",

        initialize: function(options) {
            var that = this;
            TerminalTab.__super__.initialize.apply(this, arguments);
            this.connected = false;

            // Init menu
            this.menu.menuSection([
                {
                    'type': "checkbox",
                    'title': "Exit",
                    'action': function(state) {
                        that.closeTab();
                    }
                }
            ]);

            // Init rendering
            this.term_el = $("<div>", {
                'class': "tab-panel-inner terminal-body"
            }).appendTo($("<div>", {"class": "tab-panel-body"}).appendTo(this.$el)).get(0);

            // New terminal
            this.term = new Terminal({
                cols: 80,
                rows: 24,
                theme: settings.get("theme", 'default')
            });
            this.term.open(this.term_el);

            this.interval = setInterval(_.bind(this.resize, this), 2000);

            // Init codebox stream
            this.sessionId = this.options.shellId || _.uniqueId("term");
            this.shell = box.openShell({
                'shellId': this.options.shellId ? this.sessionId : this.sessionId+"-"+(new Date()).getSeconds()
            });

            this.on("tab:close", function() {
                clearInterval(this.interval);
                this.shell.disconnect();
                this.term.destroy();
            }, this);
            
            this.on("tab:state", function(state) {
                if (state) {
                    this.term.focus();
                }
            }, this);

            this.setTabTitle("Terminal - "+this.sessionId);


            this.shell.once('data', function() {
                that.resize();
            });

            this.shell.on('data', function(chunk) {
                that.write(chunk);
            });

            this.shell.on("connect", function() {
                that.connected = true;
                that.trigger("terminal:ready");
            }, this);

            this.shell.on('disconnect', function() {
                that.writeln("Connection closed");
                that.closeTab();
            });

            // Connect term
            this.term.on('data', function(data) {
                that.shell.write(data);
            });
            this.term.on("resize", function(w, h) {
                that.shell.resize(w, h);
            });

            this.shell.connect();
            return this;
        },

        // Render
        render: function() {
            this.$el.css({
                "font-family": settings.get("font", "monospace"),
                "font-size": settings.get("size", 13)+'px',
                "line-height": settings.get("line-height", 1.3)            
            });
            $(this.term_el).css({
                'background': this.term.colors[256],
                'border-color': this.term.colors[256]
            });

            return this.ready();
        },

        // Resize the terminal
        resize: function() {
            if (!this.options.resize) { return false; }

            var w = this.$el.width();
            var h = this.$el.height();

            if (w != this._width || h != this._height) {
                this._width = w;
                this._height = h;
                this.term.sizeToFit();
            }

            return this;
        },

        // Write
        write: function(content) {
            this.term.write(content);
            return this;
        },

        // Write a line
        writeln: function(line) {
            return this.write(line+"\r\n");
        }
    });

    return TerminalTab;
});
