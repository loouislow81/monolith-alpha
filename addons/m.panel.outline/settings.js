define([], function() {
    var settings = monolith.require("core/settings");

    // Add settings
    return settings.add({
        'namespace': "outline",
        'title': "Outline",
        'defaults': {
            'separator': ".",
            'startup': false
        },
        'fields': {
            'separator': {
                'label': 'Tag Parts Separator',
                'type': "text"
            },
            'startup': {
                'label': 'Show Outline Panel at Startup',
                'type': "checkbox"
            }
        }
    });
});