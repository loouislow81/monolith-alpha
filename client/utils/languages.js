define([
    'Underscore'
], function (_) {
    var Languages = {
        /* Initialize */
        init: function() {
            _.each(Languages.LIST, function(infos, lang) {
                Languages.LIST[lang].lang = lang;
            })
        },


        /*
         *  Return informations about a language
         *  @lang : name of the language
         */
        get_infos: function(lang) {
            return Languages.LIST[lang];
        },

        /*
         *  Return color for the language
         *  @infos : language infos
         */
        get_color_byinfos: function(infos, def) {
            var color = def;
            if (infos == null) {
                return def;
            }
            if (infos.color != null) {
                return infos.color;
            }
            if (infos.group != null && infos.group != infos.lang) {
                return Languages.get_color(infos.group, def);
            }
            return def;
        },

        /*
         *  Return color for the language
         *  @lang : name of the language
         */
        get_color: function(lang, def) {
            var infos = Languages.get_infos(lang);
            return Languages.get_color_byinfos(infos, def)
        },

        /*
         *  Return color for the language
         *  @ext : file extension
         */
        get_color_byext: function(ext, def) {
            var infos = Languages.get_byextension(ext);
            return Languages.get_color_byinfos(infos, def)
        },

        /*
         *  Return language infos by extension
         *  @extension : extension of the file
         */
        get_byextension: function(extension) {
            extension = extension.toLowerCase();
            return _.find(_.values(Languages.LIST), function(lang) {
                if (lang.primary_extension.toLowerCase() == extension) {
                    return true;
                }
                var extensions = _.map(lang.extensions || [], function(ext) { return ext.toLowerCase(); });
                return _.contains(extensions, extension);
            });
        },

        /*
         *  Return mode of edition by extension
         *  @extension : extension of the file
         */
        get_mode_byextension: function(extension) {
            var lang = Languages.get_byextension(extension);
            if (lang != null && lang.ace_mode != null) {
                return lang.ace_mode;
            } else {
                return "text";
            }
        },

        /*
         *  Return suggestion
         */
        get_autosuggestions: function(query) {
            query = query.toLowerCase();
            return _.reduce(Languages.LIST, function(list, infos, language) {
                if (language.toLowerCase().search(query) >= 0) {
                    list.push({
                        name: language,
                        value: language
                    })
                }
                return list;
            }, []);
        },

        LIST: {
            'ASP': {'aliases': ['aspx', 'aspx-vb'],
                     'color': '#6a40fd',
                     'extensions': ['.asax', '.ascx', '.ashx', '.asmx', '.aspx', '.axd'],
                     'lexer': 'aspx-vb',
                     'primary_extension': '.asp',
                     'search_term': 'aspx-vb',
                     'type': 'programming'},
             'ActionScript': {'aliases': ['as3'],
                              'color': '#e3491a',
                              'lexer': 'ActionScript 3',
                              'primary_extension': '.as',
                              'search_term': 'as3',
                              'type': 'programming'},
             'Ada': {'color': '#02f88c',
                     'extensions': ['.ads'],
                     'primary_extension': '.adb',
                     'type': 'programming'},
             'ApacheConf': {'aliases': ['apache'],
                            'primary_extension': '.apacheconf',
                            'type': 'markup'},
             'Apex': {'lexer': 'Text only',
                      'primary_extension': '.cls',
                      'type': 'programming'},
             'AppleScript': {'aliases': ['osascript'],
                             'primary_extension': '.applescript',
                             'type': 'programming'},
             'Arc': {'color': '#ca2afe',
                     'lexer': 'Text only',
                     'primary_extension': '.arc',
                     'type': 'programming'},
             'Arduino': {'color': '#bd79d1',
                         'lexer': 'C++',
                         'primary_extension': '.ino',
                         'type': 'programming'},
             'Assembly': {'aliases': ['nasm'],
                          'color': '#a67219',
                          'lexer': 'NASM',
                          'primary_extension': '.asm',
                          'search_term': 'nasm',
                          'type': 'programming'},
             'Augeas': {'primary_extension': '.aug', 'type': 'programming'},
             'AutoHotkey': {'aliases': ['ahk'],
                            'color': '#6594b9',
                            'lexer': 'autohotkey',
                            'primary_extension': '.ahk',
                            'type': 'programming'},
             'Batchfile': {'aliases': ['bat'],
                           'extensions': ['.cmd'],
                           'group': 'Shell',
                           'primary_extension': '.bat',
                           'search_term': 'bat',
                           'type': 'programming'},
             'Befunge': {'primary_extension': '.befunge'},
             'BlitzMax': {'primary_extension': '.bmx'},
             'Boo': {'color': '#d4bec1',
                     'primary_extension': '.boo',
                     'type': 'programming'},
             'Brainfuck': {'extensions': ['.bf'], 'primary_extension': '.b'},
             'Bro': {'primary_extension': '.bro', 'type': 'programming'},
             'C': {'ace_mode': 'c_cpp',
                   'color': '#555',
                   'extensions': ['.w', '.h'],
                   'primary_extension': '.c',
                   'type': 'programming'},
             'C#': {'ace_mode': 'csharp',
                    'aliases': ['csharp'],
                    'color': '#5a25a2',
                    'primary_extension': '.cs',
                    'search_term': 'csharp',
                    'type': 'programming'},
             'C++': {'ace_mode': 'c_cpp',
                     'aliases': ['cpp'],
                     'color': '#f34b7d',
                     'extensions': ['.c',
                                    '.c++',
                                    '.cxx',
                                    '.h',
                                    '.h++',
                                    '.hh',
                                    '.hxx',
                                    '.tcc'],
                     'primary_extension': '.cpp',
                     'search_term': 'cpp',
                     'type': 'programming'},
             'C-ObjDump': {'lexer': 'c-objdump',
                           'primary_extension': '.c-objdump',
                           'type': 'data'},
             'C2hs Haskell': {'aliases': ['c2hs'],
                              'group': 'Haskell',
                              'lexer': 'Haskell',
                              'primary_extension': '.chs',
                              'type': 'programming'},
             'CMake': {'extensions': ['.cmake.in'],
                       'filenames': ['CMakeLists.txt'],
                       'primary_extension': '.cmake'},
             'CSS': {'ace_mode': 'css', 'primary_extension': '.css'},
             'Ceylon': {'lexer': 'Text only',
                        'primary_extension': '.ceylon',
                        'type': 'programming'},
             'ChucK': {'lexer': 'Java', 'primary_extension': '.ck'},
             'Clojure': {'ace_mode': 'clojure',
                         'color': '#db5855',
                         'extensions': ['.cljs'],
                         'primary_extension': '.clj',
                         'type': 'programming'},
             'CoffeeScript': {'ace_mode': 'coffee',
                              'aliases': ['coffee', 'coffee-script'],
                              'color': '#244776',
                              'extensions': ['._coffee'],
                              'filenames': ['Cakefile'],
                              'primary_extension': '.coffee',
                              'type': 'programming'},
             'ColdFusion': {'ace_mode': 'coldfusion',
                            'aliases': ['cfm'],
                            'color': '#ed2cd6',
                            'extensions': ['.cfc'],
                            'lexer': 'Coldfusion HTML',
                            'primary_extension': '.cfm',
                            'search_term': 'cfm',
                            'type': 'programming'},
             'Common Lisp': {'aliases': ['lisp'],
                             'color': '#3fb68b',
                             'extensions': ['.lsp', '.ny'],
                             'primary_extension': '.lisp',
                             'type': 'programming'},
             'Coq': {'primary_extension': '.coq', 'type': 'programming'},
             'Cpp-ObjDump': {'extensions': ['.c++objdump', '.cxx-objdump'],
                             'lexer': 'cpp-objdump',
                             'primary_extension': '.cppobjdump',
                             'type': 'data'},
             'Cucumber': {'lexer': 'Gherkin', 'primary_extension': '.feature'},
             'Cython': {'extensions': ['.pxd', '.pxi'],
                        'group': 'Python',
                        'primary_extension': '.pyx',
                        'type': 'programming'},
             'D': {'color': '#fcd46d',
                   'extensions': ['.di'],
                   'primary_extension': '.d',
                   'type': 'programming'},
             'D-ObjDump': {'lexer': 'd-objdump',
                           'primary_extension': '.d-objdump',
                           'type': 'data'},
             'DCPU-16 ASM': {'aliases': ['dasm16'],
                             'extensions': ['.dasm'],
                             'lexer': 'dasm16',
                             'primary_extension': '.dasm16',
                             'type': 'programming'},
             'Darcs Patch': {'aliases': ['dpatch'],
                             'extensions': ['.dpatch'],
                             'primary_extension': '.darcspatch',
                             'search_term': 'dpatch'},
             'Dart': {'primary_extension': '.dart', 'type': 'programming'},
             'Delphi': {'color': '#b0ce4e',
                        'extensions': ['.lpr'],
                        'primary_extension': '.pas',
                        'type': 'programming'},
             'Diff': {'primary_extension': '.diff'},
             'Dylan': {'color': '#3ebc27',
                       'primary_extension': '.dylan',
                       'type': 'programming'},
             'Ecere Projects': {'group': 'JavaScript',
                                'lexer': 'JSON',
                                'primary_extension': '.epj',
                                'type': 'data'},
             'Ecl': {'color': '#8a1267',
                     'extensions': ['.eclxml'],
                     'lexer': 'ECL',
                     'primary_extension': '.ecl',
                     'type': 'programming'},
             'Eiffel': {'color': '#946d57',
                        'lexer': 'Text only',
                        'primary_extension': '.e',
                        'type': 'programming'},
             'Elixir': {'color': '#6e4a7e',
                        'extensions': ['.exs'],
                        'primary_extension': '.ex',
                        'type': 'programming'},
             'Elm': {'group': 'Haskell',
                     'lexer': 'Haskell',
                     'primary_extension': '.elm',
                     'type': 'programming'},
             'Emacs Lisp': {'aliases': ['elisp', 'emacs'],
                            'color': '#c065db',
                            'extensions': ['.emacs'],
                            'lexer': 'Scheme',
                            'primary_extension': '.el',
                            'type': 'programming'},
             'Erlang': {'color': '#949e0e',
                        'extensions': ['.hrl'],
                        'primary_extension': '.erl',
                        'type': 'programming'},
             'F#': {'color': '#b845fc',
                    'extensions': ['.fsi', '.fsx'],
                    'lexer': 'FSharp',
                    'primary_extension': '.fs',
                    'search_term': 'ocaml',
                    'type': 'programming'},
             'FORTRAN': {'color': '#4d41b1',
                         'extensions': ['.F',
                                        '.F03',
                                        '.F08',
                                        '.F77',
                                        '.F90',
                                        '.F95',
                                        '.FOR',
                                        '.FPP',
                                        '.f',
                                        '.f03',
                                        '.f08',
                                        '.f77',
                                        '.f95',
                                        '.for',
                                        '.fpp'],
                         'lexer': 'Fortran',
                         'primary_extension': '.f90',
                         'type': 'programming'},
             'Factor': {'color': '#636746',
                        'primary_extension': '.factor',
                        'type': 'programming'},
             'Fancy': {'color': '#7b9db4',
                       'extensions': ['.fancypack'],
                       'filenames': ['Fakefile'],
                       'primary_extension': '.fy',
                       'type': 'programming'},
             'Fantom': {'color': '#dbded5',
                        'primary_extension': '.fan',
                        'type': 'programming'},
             'Forth': {'color': '#341708',
                       'extensions': ['.forth', '.fth'],
                       'lexer': 'Text only',
                       'primary_extension': '.fth',
                       'type': 'programming'},
             'GAS': {'extensions': ['.S'],
                     'group': 'Assembly',
                     'primary_extension': '.s',
                     'type': 'programming'},
             'Genshi': {'primary_extension': '.kid'},
             'Gentoo Ebuild': {'group': 'Shell',
                               'lexer': 'Bash',
                               'primary_extension': '.ebuild'},
             'Gentoo Eclass': {'group': 'Shell',
                               'lexer': 'Bash',
                               'primary_extension': '.eclass'},
             'Gettext Catalog': {'aliases': ['pot'],
                                 'extensions': ['.pot'],
                                 'primary_extension': '.po',
                                 'search_term': 'pot',
                                 'searchable': false},
             'Go': {'color': '#8d04eb', 'primary_extension': '.go', 'type': 'programming', 'ace_mode': 'golang'},
             'Gosu': {'color': '#82937f',
                      'primary_extension': '.gs',
                      'type': 'programming'},
             'Groff': {'extensions': ['.1', '.2', '.3', '.4', '.5', '.6', '.7'],
                       'primary_extension': '.man'},
             'Groovy': {'ace_mode': 'groovy',
                        'color': '#e69f56',
                        'primary_extension': '.groovy',
                        'type': 'programming'},
             'Groovy Server Pages': {'aliases': ['gsp'],
                                     'group': 'Groovy',
                                     'lexer': 'Java Server Page',
                                     'primary_extension': '.gsp'},
             'HTML': {'ace_mode': 'html',
                      'aliases': ['xhtml'],
                      'extensions': ['.htm', '.xhtml'],
                      'primary_extension': '.html',
                      'type': 'markup'},
             'HTML+Django': {'extensions': ['.mustache'],
                             'group': 'HTML',
                             'lexer': 'HTML+Django/Jinja',
                             'primary_extension': '.mustache',
                             'type': 'markup'},
             'HTML+ERB': {'aliases': ['erb'],
                          'extensions': ['.html.erb'],
                          'group': 'HTML',
                          'lexer': 'RHTML',
                          'primary_extension': '.erb',
                          'type': 'markup'},
             'HTML+PHP': {'group': 'HTML',
                          'primary_extension': '.phtml',
                          'type': 'markup'},
             'HTTP': {'primary_extension': '.http', 'type': 'data'},
             'Haml': {'group': 'HTML', 'primary_extension': '.haml', 'type': 'markup'},
             'Handlebars': {'lexer': 'Text only',
                            'primary_extension': '.handlebars',
                            'type': 'markup'},
             'Haskell': {'color': '#29b544',
                         'extensions': ['.hsc'],
                         'primary_extension': '.hs',
                         'type': 'programming'},
             'Haxe': {'ace_mode': 'haxe',
                      'color': '#346d51',
                      'extensions': ['.hxsl'],
                      'lexer': 'haXe',
                      'primary_extension': '.hx',
                      'type': 'programming'},
             'INI': {'extensions': ['.cfg', '.ini', '.prefs', '.properties'],
                     'primary_extension': '.ini',
                     'type': 'data'},
             'IRC log': {'aliases': ['irc'],
                         'extensions': ['.weechatlog'],
                         'lexer': 'IRC logs',
                         'primary_extension': '.irclog',
                         'search_term': 'irc'},
             'Io': {'color': '#a9188d', 'primary_extension': '.io', 'type': 'programming'},
             'Ioke': {'color': '#078193',
                      'primary_extension': '.ik',
                      'type': 'programming'},
             'JSON': {'ace_mode': 'json',
                      'group': 'JavaScript',
                      'primary_extension': '.json',
                      'searchable': false,
                      'type': 'data'},
             'Java': {'ace_mode': 'java',
                      'color': '#b07219',
                      'extensions': ['.pde'],
                      'primary_extension': '.java',
                      'type': 'programming'},
             'Java Server Pages': {'aliases': ['jsp'],
                                   'group': 'Java',
                                   'lexer': 'Java Server Page',
                                   'primary_extension': '.jsp',
                                   'search_term': 'jsp'},
             'JavaScript': {'ace_mode': 'javascript',
                            'aliases': ['js', 'node'],
                            'color': '#f15501',
                            'extensions': ['._js',
                                           '.bones',
                                           '.jake',
                                           '.jsfl',
                                           '.jsm',
                                           '.jss',
                                           '.jsx',
                                           '.pac',
                                           '.sjs',
                                           '.ssjs'],
                            'filenames': ['Jakefile'],
                            'primary_extension': '.js',
                            'type': 'programming'},
             'Julia': {'primary_extension': '.jl', 'type': 'programming'},
             'Kotlin': {'extensions': ['.ktm', '.kts'],
                        'primary_extension': '.kt',
                        'type': 'programming'},
             'LLVM': {'primary_extension': '.ll'},
             'Lasso': {'ace_mode': 'lasso',
                       'color': '#2584c3',
                       'extensions': ['.inc', '.las', '.lasso9', '.ldml'],
                       'lexer': 'Lasso',
                       'primary_extension': '.lasso',
                       'type': 'programming'},
             'Less': {'ace_mode': 'less',
                      'group': 'CSS',
                      'lexer': 'CSS',
                      'primary_extension': '.less',
                      'type': 'markup'},
             'LilyPond': {'extensions': ['.ily'],
                          'lexer': 'Text only',
                          'primary_extension': '.ly'},
             'Literate Haskell': {'aliases': ['lhs'],
                                  'group': 'Haskell',
                                  'primary_extension': '.lhs',
                                  'search_term': 'lhs',
                                  'type': 'programming'},
             'LiveScript': {'ace_mode': 'ls',
                            'aliases': ['ls'],
                            'color': '#499886',
                            'extensions': ['._ls'],
                            'filenames': ['Slakefile'],
                            'primary_extension': '.ls',
                            'type': 'programming'},
             'Logtalk': {'primary_extension': '.lgt', 'type': 'programming'},
             'Lua': {'ace_mode': 'lua',
                     'color': '#fa1fa1',
                     'extensions': ['.nse', '.pd_lua'],
                     'primary_extension': '.lua',
                     'type': 'programming'},
             'Makefile': {'aliases': ['make'],
                          'extensions': ['.mak', '.mk'],
                          'filenames': ['makefile', 'Makefile', 'GNUmakefile'],
                          'primary_extension': '.mak'},
             'Mako': {'extensions': ['.mao'], 'primary_extension': '.mako'},
             'Markdown': {'ace_mode': 'markdown',
                          'extensions': ['.markdown', '.mkd', '.mkdown', '.ron'],
                          'lexer': 'Text only',
                          'primary_extension': '.md',
                          'type': 'markup',
                          'wrap': true},
             'Matlab': {'color': '#bb92ac',
                        'primary_extension': '.matlab',
                        'type': 'programming'},
             'Max': {'aliases': ['max/msp', 'maxmsp'],
                     'color': '#ce279c',
                     'lexer': 'Text only',
                     'primary_extension': '.mxt',
                     'search_term': 'max/msp',
                     'type': 'programming'},
             'MiniD': {'primary_extension': '.minid', 'searchable': false},
             'Mirah': {'color': '#c7a938',
                       'extensions': ['.duby', '.mir', '.mirah'],
                       'lexer': 'Ruby',
                       'primary_extension': '.druby',
                       'search_term': 'ruby',
                       'type': 'programming'},
             'Moocode': {'lexer': 'MOOCode', 'primary_extension': '.moo'},
             'MoonScript': {'primary_extension': '.moon', 'type': 'programming'},
             'Myghty': {'primary_extension': '.myt'},
             'Nemerle': {'color': '#0d3c6e',
                         'primary_extension': '.n',
                         'type': 'programming'},
             'Nginx': {'lexer': 'Nginx configuration file',
                       'primary_extension': '.nginxconf',
                       'type': 'markup'},
             'Nimrod': {'color': '#37775b',
                        'extensions': ['.nimrod'],
                        'primary_extension': '.nim',
                        'type': 'programming'},
             'Nu': {'aliases': ['nush'],
                    'color': '#c9df40',
                    'filenames': ['Nukefile'],
                    'lexer': 'Scheme',
                    'primary_extension': '.nu',
                    'type': 'programming'},
             'NumPy': {'extensions': ['.numpyw', '.numsc'],
                       'group': 'Python',
                       'primary_extension': '.numpy'},
             'OCaml': {'ace_mode': 'ocaml',
                       'color': '#3be133',
                       'extensions': ['.mli', '.mll', '.mly'],
                       'primary_extension': '.ml',
                       'type': 'programming'},
             'ObjDump': {'lexer': 'objdump',
                         'primary_extension': '.objdump',
                         'type': 'data'},
             'Objective-C': {'aliases': ['obj-c', 'objc'],
                             'color': '#438eff',
                             'extensions': ['.mm'],
                             'primary_extension': '.m',
                             'type': 'programming'},
             'Objective-J': {'aliases': ['obj-j'],
                             'color': '#ff0c5a',
                             'extensions': ['.sj'],
                             'primary_extension': '.j',
                             'type': 'programming'},
             'Omgrofl': {'color': '#cabbff',
                         'extensions': ['.omgrofl'],
                         'lexer': 'Text only',
                         'primary_extension': '.omgrofl',
                         'type': 'programming'},
             'Opa': {'primary_extension': '.opa', 'type': 'programming'},
             'OpenCL': {'group': 'C',
                        'lexer': 'C',
                        'primary_extension': '.cl',
                        'type': 'programming'},
             'OpenEdge ABL': {'aliases': ['progress', 'openedge', 'abl'],
                              'primary_extension': '.p',
                              'type': 'programming'},
             'PHP': {'ace_mode': 'php',
                     'color': '#6e03c1',
                     'extensions': ['.aw', '.ctp', '.php3', '.php4', '.php5', '.phpt'],
                     'filenames': ['Phakefile'],
                     'primary_extension': '.php',
                     'type': 'programming'},
             'Parrot': {'color': '#f3ca0a',
                        'lexer': 'Text only',
                        'primary_extension': '.parrot',
                        'type': 'programming'},
             'Parrot Assembly': {'aliases': ['pasm'],
                                 'group': 'Parrot',
                                 'lexer': 'Text only',
                                 'primary_extension': '.pasm',
                                 'type': 'programming'},
             'Parrot Internal Representation': {'aliases': ['pir'],
                                                'group': 'Parrot',
                                                'lexer': 'Text only',
                                                'primary_extension': '.pir',
                                                'type': 'programming'},
             'Perl': {'ace_mode': 'perl',
                      'color': '#0298c3',
                      'extensions': ['.PL',
                                     '.perl',
                                     '.ph',
                                     '.plx',
                                     '.pm6',
                                     '.pod',
                                     '.psgi'],
                      'primary_extension': '.pl',
                      'type': 'programming'},
             'PowerShell': {'ace_mode': 'powershell',
                            'aliases': ['posh'],
                            'primary_extension': '.ps1',
                            'type': 'programming'},
             'Prolog': {'color': '#74283c',
                        'extensions': ['.pro'],
                        'primary_extension': '.prolog',
                        'type': 'programming'},
             'Puppet': {'color': '#cc5555',
                        'extensions': ['.pp'],
                        'filenames': ['Modulefile'],
                        'primary_extension': '.pp',
                        'type': 'programming'},
             'Pure Data': {'color': '#91de79',
                           'lexer': 'Text only',
                           'primary_extension': '.pd',
                           'type': 'programming'},
             'Python': {'ace_mode': 'python',
                        'color': '#3581ba',
                        'extensions': ['.pyw', '.wsgi', '.xpy'],
                        'filenames': ['wscript'],
                        'primary_extension': '.py',
                        'type': 'programming'},
             'Python traceback': {'group': 'Python',
                                  'lexer': 'Python Traceback',
                                  'primary_extension': '.pytb',
                                  'searchable': false,
                                  'type': 'data'},
             'R': {'color': '#198ce7',
                   'lexer': 'S',
                   'primary_extension': '.r',
                   'type': 'programming'},
             'RHTML': {'group': 'HTML', 'primary_extension': '.rhtml', 'type': 'markup'},
             'Racket': {'color': '#ae17ff',
                        'extensions': ['.rktd', '.rktl'],
                        'lexer': 'Racket',
                        'primary_extension': '.rkt',
                        'type': 'programming'},
             'Raw token data': {'aliases': ['raw'],
                                'primary_extension': '.raw',
                                'search_term': 'raw'},
             'Rebol': {'color': '#358a5b',
                       'extensions': ['.r2', '.r3'],
                       'lexer': 'REBOL',
                       'primary_extension': '.rebol',
                       'type': 'programming'},
             'Redcode': {'primary_extension': '.cw'},
             'Ruby': {'ace_mode': 'ruby',
                      'aliases': ['jruby', 'macruby', 'rake', 'rb', 'rbx'],
                      'color': '#701516',
                      'extensions': ['.builder',
                                     '.gemspec',
                                     '.god',
                                     '.irbrc',
                                     '.podspec',
                                     '.rbuild',
                                     '.rbw',
                                     '.rbx',
                                     '.ru',
                                     '.thor',
                                     '.watchr'],
                      'filenames': ['Gemfile',
                                    'Guardfile',
                                    'Podfile',
                                    'Thorfile',
                                    'Vagrantfile'],
                      'primary_extension': '.rb',
                      'type': 'programming'},
             'Rust': {'color': '#dea584',
                      'lexer': 'Text only',
                      'primary_extension': '.rs',
                      'type': 'programming'},
             'SCSS': {'ace_mode': 'scss',
                      'group': 'CSS',
                      'primary_extension': '.scss',
                      'type': 'markup'},
             'SQL': {'ace_mode': 'sql',
                     'primary_extension': '.sql',
                     'searchable': false,
                     'type': 'data'},
             'Sage': {'group': 'Python',
                      'lexer': 'Python',
                      'primary_extension': '.sage',
                      'type': 'programming'},
             'Sass': {'group': 'CSS', 'primary_extension': '.sass', 'type': 'markup'},
             'Scala': {'ace_mode': 'scala',
                       'color': '#7dd3b0',
                       'primary_extension': '.scala',
                       'type': 'programming'},
             'Scheme': {'color': '#1e4aec',
                        'extensions': ['.sls', '.ss'],
                        'primary_extension': '.scm',
                        'type': 'programming'},
             'Scilab': {'primary_extension': '.sci', 'type': 'programming'},
             'Self': {'color': '#0579aa',
                      'lexer': 'Text only',
                      'primary_extension': '.self',
                      'type': 'programming'},
             'Shell': {'aliases': ['sh', 'bash', 'zsh'],
                       'color': '#5861ce',
                       'lexer': 'Bash',
                       'primary_extension': '.sh',
                       'search_term': 'bash',
                       'type': 'programming'},
             'Smalltalk': {'color': '#596706',
                           'primary_extension': '.st',
                           'type': 'programming'},
             'Smarty': {'primary_extension': '.tpl'},
             'Standard ML': {'aliases': ['sml'],
                             'color': '#dc566d',
                             'primary_extension': '.sml',
                             'type': 'programming'},
             'SuperCollider': {'color': '#46390b',
                               'lexer': 'Text only',
                               'primary_extension': '.sc',
                               'type': 'programming'},
             'Tcl': {'color': '#e4cc98',
                     'primary_extension': '.tcl',
                     'type': 'programming'},
             'Tcsh': {'extensions': ['.csh'],
                      'group': 'Shell',
                      'primary_extension': '.tcsh',
                      'type': 'programming'},
             'TeX': {'ace_mode': 'latex',
                     'aliases': ['latex'],
                     'extensions': ['.aux', '.dtx', '.ins', '.ltx', '.sty', '.toc'],
                     'primary_extension': '.tex',
                     'type': 'markup'},
             'Tea': {'primary_extension': '.tea', 'type': 'markup'},
             'Textile': {'ace_mode': 'textile',
                         'lexer': 'Text only',
                         'primary_extension': '.textile',
                         'type': 'markup',
                         'wrap': true},
             'Turing': {'color': '#45f715',
                        'extensions': ['.tu'],
                        'lexer': 'Text only',
                        'primary_extension': '.t',
                        'type': 'programming'},
             'Twig': {'group': 'PHP',
                      'lexer': 'HTML+Django/Jinja',
                      'primary_extension': '.twig',
                      'type': 'markup'},
             'VHDL': {'color': '#543978',
                      'lexer': 'vhdl',
                      'primary_extension': '.vhdl',
                      'type': 'programming'},
             'Vala': {'color': '#ee7d06',
                      'extensions': ['.vapi'],
                      'primary_extension': '.vala',
                      'type': 'programming'},
             'Verilog': {'color': '#848bf3',
                         'lexer': 'verilog',
                         'primary_extension': '.v',
                         'type': 'programming'},
             'VimL': {'aliases': ['vim'],
                      'color': '#199c4b',
                      'filenames': ['vimrc', 'gvimrc'],
                      'primary_extension': '.vim',
                      'search_term': 'vim',
                      'type': 'programming'},
             'Visual Basic': {'color': '#945db7',
                              'extensions': ['.bas', '.frx', '.vba', '.vbs'],
                              'lexer': 'VB.net',
                              'primary_extension': '.vb',
                              'type': 'programming'},
             'XML': {'ace_mode': 'xml',
                     'aliases': ['rss', 'xsd', 'xsl', 'wsdl'],
                     'extensions': ['.ccxml',
                                    '.glade',
                                    '.grxml',
                                    '.kml',
                                    '.mxml',
                                    '.plist',
                                    '.rdf',
                                    '.rss',
                                    '.scxml',
                                    '.svg',
                                    '.vxml',
                                    '.wsdl',
                                    '.wxi',
                                    '.wxl',
                                    '.wxs',
                                    '.xaml',
                                    '.xlf',
                                    '.xliff',
                                    '.xsd',
                                    '.xsl',
                                    '.xul'],
                     'filenames': ['.classpath', '.project'],
                     'primary_extension': '.xml',
                     'type': 'markup'},
             'XQuery': {'color': '#2700e2',
                        'extensions': ['.xq', '.xqy'],
                        'primary_extension': '.xquery',
                        'type': 'programming'},
             'XS': {'lexer': 'C', 'primary_extension': '.xs'},
             'XSLT': {'group': 'XML', 'primary_extension': '.xslt', 'type': 'markup'},
             'YAML': {'aliases': ['yml'],
                      'extensions': ['.yaml'],
                      'primary_extension': '.yml',
                      'type': 'markup',
                      'ace_mode': 'yaml'},
             'eC': {'extensions': ['.eh'],
                    'primary_extension': '.ec',
                    'search_term': 'ec',
                    'type': 'programming'},
             'mupad': {'lexer': 'MuPAD', 'primary_extension': '.mu'},
             'ooc': {'color': '#b0b77e',
                     'lexer': 'Ooc',
                     'primary_extension': '.ooc',
                     'type': 'programming'},
             'reStructuredText': {'aliases': ['rst'],
                                  'extensions': ['.rest'],
                                  'primary_extension': '.rst',
                                  'search_term': 'rst',
                                  'type': 'markup',
                                  'wrap': true}
            } 

    };

    return Languages;
});