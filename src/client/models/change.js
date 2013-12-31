define([
    "underscore",
    "hr/hr",
    "models/command"
], function(_, hr, Command) {
    var Change = hr.Model.extend({
        defaults: {
            // Path
            'path': null,

            // Types of modification
            'type': "modified",

            // Time for the modification
            'time': 0,

            // Offline mode
            'offline': false
        },

        // apply the change
        apply: function() {
            var vfs = require("core/backends/vfs");

            if (this.get("offline") == false && !hr.Offline.isConnected()) {
                return Q.reject(new Error("Can't apply this change when offline"));
            }

            var url = ("/vfs/"+this.get("path")).replace("//", "/");
            var ctype = this.get("type");

            alert("operation: "+ctype+":"+url);

            if (ctype == "remove") {
                return vfs.execute("remove", {}, {
                    'url': url
                });
            } else if (ctype == "mkdir") {
                return vfs.execute("mkdir", {}, {
                    'url': url+"/"
                });
            } else if (ctype == "create") {
                return vfs.execute("create", {}, {
                    'url': url
                });
            } else if (ctype == "write") {
                return vfs.execute("write", this.get("content", ""), {
                    'url': url
                });
            }else {
                return Q.reject(new Error("Invalid change type"));
            }
        },

        // Return an associated command for this change
        command: function() {
            var that = this;
            var c = new Command({}, {
                'title': this.get("path"),
                'label': this.get("type"),
                'offline': this.get("offline"),
                'action': function() {
                    return that.apply().then(function() {
                        d.destroy();
                    }, function(err) {
                        console.error(err);
                    });
                }
            });
            return c;
        }
    });

    return Change;
});