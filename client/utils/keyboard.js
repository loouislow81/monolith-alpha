define([
    'hr/hr',
    'hr/utils',
    'vendors/mousetrap'
], function (hr, _, Mousetrap) {
    /**
     * Keyboard shortcuts manager
     *
     * @class
     * @constructor
     */
    var Keyboard = hr.Class.extend({
        initialize: function() {
            this.bindings = {};
            return this;
        },

        /**
         * Enable keyboard shortcut for a specific event
         *
         * @param {jqueryEvent} e
         */
        enableKeyEvent: function(e) {
            e.mousetrap = true;
        },

        /**
         * Handle manually a keyboard event
         *
         * @param {jqueryEvent} e
         */
        handleKeyEvent: function(e) {
            e.mousetrap = true;
            return Mousetrap.handleKeyEvent(e);
        },

        /*
         * Bind keyboard shortcuts to callback

         * @param {string|array} keys shortcut or list of shortcuts
         * @param {function} callback function to call for this shortcut
         * @param {object} context object which is binding key
         */
        bind: function(keys, callback, context) {
            // List of shortcuts for same action
            if (_.isArray(keys)) {
                _.each(keys, function(key) { this.bind(key, callback) }, this);
                return;
            }

            // Map shortcut -> action
            if (_.isObject(keys)) {
                _.each(keys, function(method, key) {
                    this.bind(key, method, callback);
                }, this)
                return;
            }

            // Bind
            if (this.bindings[keys] == null) {
                this.bindings[keys] = new hr.Class();
                Mousetrap.bind(keys, _.bind(function(e) {
                    this.bindings[keys].trigger("action", e);
                }, this));
            }
            context.listenTo(this.bindings[keys], "action", callback);
            return;
        },

        /*
         * Convert shortcut or list of shortcut to a string

         * @param {string|array} shortcut shortcut or list of shortcuts
         * @return {string}
         */
        toText: function(shortcut) {
            if (_.isArray(shortcut)) shortcut = _.first(shortcut);
            if (!shortcut) return null;

            var isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

            // Replace mod by equivalent for mac or windows
            shortcut = shortcut.replace("mod", isMac ? '&#8984;' : 'ctrl');

            // Replace ctrl
            shortcut = shortcut.replace("ctrl", "⌃");

            // Replace shift
            shortcut = shortcut.replace("shift", "⇧");

            if (isMac) {
                shortcut = shortcut.replace("alt", "⌥");
            } else {
                shortcut = shortcut.replace("alt", "⎇");
            }

            // Replace +
            shortcut = shortcut.replace(/\+/g, " ");

            return shortcut.toUpperCase();
        }
    });

    return new Keyboard();
});