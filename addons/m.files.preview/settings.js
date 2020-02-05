define([], function() {
    var settings = monolith.require("core/settings");

    return settings.add({
        'namespace': "preview",
        'title': "Preview",
        'defaults': {
            'refresh': true
        },
        'fields': {
            'refresh': {
                'label': "Reload on Save",
                'type': "checkbox"
            }
        }
    });
});