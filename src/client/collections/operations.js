define([
    "underscore",
    "hr/hr",
    "q",
    "models/operation"
], function(_, hr, Q, Operation) {
    var Operations = hr.Collection.extend({
        model: Operation,

        // Sort comparator
        comparator: function(command) {
            return command.get("progress", 0);
        },

        // Get by id
        getById: function(opId) {
            return this.find(function(op) {
                return op.id == opId;
            });
        },

        // Start an operation
        start: function(opId, startMethod, properties, options) {
            var op, d;

            options = _.defaults({}, options || {}, {
                'unique': true
            });

            op = this.getById(opId);

            if (op) return Q.reject(new Error("An operation with this id is already running: "+opId));

            op = new Operation({}, _.extend({
                'id': opId
            }, properties || {}));

            this.add(op);

            d = startMethod(op);
            d.fin(function() {
                op.destroy();
            });
            return d;
        }
    });

    return Operations;
});