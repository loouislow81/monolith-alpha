define([
    "views/section"
], function(DebugSection) {
    var _ = monolith.require("hr/utils");
    var $ = monolith.require("hr/dom");
    var hr = monolith.require("hr/hr");
    var rpc = monolith.require("core/backends/rpc");

    var LocalsSection = DebugSection.extend({
        title: "Locals",
        formats: [
            {
                id: "name",
                title: "Name"
            },
            {
                id: "value",
                title: "Value"
            }
        ],

        update: function() {
            var that = this;
            
            return this.dbg.locals()
            .then(function(locals) {
                that.clearLines();
                _.each(locals, function(value, key) {
                    that.addLine({
                        'name': key,
                        'value': value
                    });
                });
            });
        }
    });

    return LocalsSection;
});
