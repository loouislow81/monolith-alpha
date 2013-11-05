define([
    "Underscore",
    "jQuery",
    "hr/hr"
], function(_, $, hr) {
    var SettingsPageView = hr.View.extend({
        template: "settings/base.html",
        defaults: {
            'namespace': "",
            'section': "",
            'title': "",
            'settings': {}
        },
        events: {
            "click button[data-settings-action]": "triggerFieldAction"
        },

        // Constructor
        initialize: function() {
            SettingsPageView.__super__.initialize.apply(this, arguments);

            this.namespace = this.options.namespace;
            this.title = this.options.title || this.namespace;
            this.section = this.options.section;
            this.fields = this.options.fields || {};
            this.defaults = this.options.defaults || {};
        },

        // Define a field
        setField: function(fieldId, field) {
            this.fields[fieldId] = field;
            this.trigger("field:change", fieldId);
            return this;
        },

        // Template context
        templateContext: function() {
            return {
                'fields': this.fields,
                'defaults': this.defaults,
                'namespace': this.namespace,
                'section': this.section
            }
        },

        // Trigger action
        triggerFieldAction: function(e) {
            e.preventDefault();

            var $btn = $(e.currentTarget);
            var fieldId = $btn.data("settings-action");

            if (!this.fields[fieldId]) return;

            $btn.button("loading");
            this.fields[fieldId].trigger(fieldId).always(function() {
                $btn.button("reset");
            });
        },

        // Get settings to save
        submit: function() {
            var data = {};
            var that = this;

            var selectors = {
                'text': function(el) { return el.val(); },
                'number': function(el) { return el.val(); },
                'select': function(el) { return el.val(); },
                'checkbox': function(el) { return el.is(":checked"); },
                'action': function(el)  { return null; }
            };

            _.each(this.fields, function(field, key) {
                var v = selectors[field.type](that.$("*[name='"+ that.namespace+"_"+key+"']"));
                if (v !== null) data[key] = v;
            });

            return data;
        }
    });

    return SettingsPageView;
});