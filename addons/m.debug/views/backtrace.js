define([
    "views/section"
], function(DebugSection) {
    var _ = monolith.require("hr/utils");
    var $ = monolith.require("hr/dom");
    var hr = monolith.require("hr/hr");
    var rpc = monolith.require("core/backends/rpc");

    var BacktraceSection = DebugSection.extend({
        title: "Backtrace",
        formats: [
            {
                id: "filename",
                title: "File",
                type: "file"
            },
            {
                id: "line",
                title: "Line"
            }
        ],

        update: function() {
            var that = this;
            
            return this.dbg.backtrace()
            .then(function(stack) {
                that.clearLines();
                _.each(stack, that.addLine, that);
            });
        }
    });

    return BacktraceSection;
});
