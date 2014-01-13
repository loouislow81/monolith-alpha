define("settings",[],function(){var e=codebox.require("core/settings");return e.add({namespace:"offline",title:"Offline",defaults:{enabled:!0,syncInterval:10},fields:{enabled:{label:"Enable Files Synchronization",type:"checkbox"},syncInterval:{label:"Synchronization (minutes)",type:"number",min:1,max:1e3,step:1},syncIgnore:{label:"Ignored files (one by line)",type:"textarea"}}})}),define("menus",[],function(){var e=codebox.require("core/box"),t=codebox.require("core/commands/menu"),n=codebox.require("core/commands/toolbar"),r=codebox.require("core/operations"),i=codebox.require("hr/hr"),s=codebox.require("models/command"),o=codebox.require("core/localfs"),u=codebox.require("utils/dialogs"),a=n.register("offline.check",{title:"Check Connexion",offline:!0,icon:"bolt"},function(){i.Offline.check()}),f=new s({},{title:"Changes",type:"menu",flags:"disabled"}),l=t.register("offline.synchronize",{title:"Synchronize",position:95,offline:!1}).menuSection(a).menuSection([{title:"Calcul Changes",offline:!1,action:function(){return o.sync()}}]).menuSection([{title:"Reset All Changes",offline:!1,action:function(){return o.reset()}},{title:"Apply All Changes",offline:!1,action:function(){var e=o.changes.size();if(e==0)return;u.confirm("Do you really want to apply "+e+" changes?").then(function(e){if(!e)return;return o.changes.applyAll()})}}]).menuSection([f]);return t.register("offline",{title:"Offline",position:90,offline:!0}).menuSection([a]),o.changes.on("add remove reset",function(){f.toggleFlag("disabled",o.changes.size()==0),f.menu.reset(o.changes.map(function(e){return e.command()}))}),{sync:l}}),define("client",["settings","menus"],function(e,t){var n=codebox.require("jQuery"),r=codebox.require("q"),i=codebox.require("core/app"),s=codebox.require("core/box"),o=codebox.require("core/commands/menu"),u=codebox.require("core/commands/toolbar"),a=codebox.require("core/operations"),f=codebox.require("hr/hr"),l=codebox.require("models/command"),c=codebox.require("core/localfs"),h=null,p=a.start("offline.update",null,{title:"Downloading new version",icon:"fa-download",state:window.applicationCache.status==window.applicationCache.IDLE?"idle":"running",progress:0});n(window.applicationCache).bind("downloading progress",function(e){var t=0;e&&e.originalEvent&&e.originalEvent.lengthComputable&&(t=Math.round(100*e.originalEvent.loaded/e.originalEvent.total)),p.state("running"),p.progress(t)}),n(window.applicationCache).bind("checking",function(e){p.state("running"),p.progress(0)}),n(window.applicationCache).bind("noupdate cached obsolete error",function(e){p.state("idle")});var d=function(){h&&clearInterval(h),c.enableSync(e.user.get("enabled",!0)),c.setIgnoredFiles(e.user.get("syncIgnore","").split("\n")),t.sync.toggleFlag("disabled",!e.user.get("enabled",!0)),h=setInterval(function(){c.autoSync()},e.user.get("syncInterval",10)*60*1e3)};setTimeout(function(){c.sync()},5e3),s.on("box:watch",function(){c.autoSync()}),e.user.change(d),d()})