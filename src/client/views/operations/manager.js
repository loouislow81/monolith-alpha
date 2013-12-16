define([
    "hr/hr",
    "models/operation",
    "collections/operations"
], function(hr, Operation, Operations) {

    var OperationItem = hr.List.Item.extend({
        className: "operation-item",
        template: "operations/operation.html",
        events: {
            
        }
    });

    // Operations list
    var OperationsView = hr.List.extend({
        tagName: "ul",
        className: "cb-operations",
        Item: OperationItem,
        Collection: Operations,

        start: function() {
            return this.collection.start.apply(this.collection, arguments)
        }
    });

    return OperationsView;
});