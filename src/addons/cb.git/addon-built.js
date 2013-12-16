define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/git",[],function(){}),define("views/dialog",["less!stylesheets/git.less"],function(){var e=codebox.require("views/dialogs/base"),t=codebox.require("core/box"),n=e.extend({className:"addon-git-dialog modal fade",templateLoader:"addon.cb.git.templates",template:"dialog.html",events:_.extend({},e.prototype.events,{"submit .git-commit":"submit"}),initialize:function(e){var r=this;return n.__super__.initialize.apply(this,arguments),r.git=null,t.gitStatus().then(function(e){r.git=e,r.render()}),this},templateContext:function(){return{git:this.git}},render:function(){return this.git?n.__super__.render.apply(this,arguments):this},finish:function(){return n.__super__.finish.apply(this,arguments)},submit:function(e){e&&e.preventDefault();var n=this,r=this.$(".git-commit .btn-git-sync").hasClass("active"),i=this.$(".git-commit textarea").val();if(i.length==0)return;t.commit({message:i}).then(function(){if(r)return t.sync()}).then(function(){n.close()})}});return n}),define("client",["views/dialog"],function(e){var t=codebox.require("core/commands"),n=codebox.require("core/app"),r=codebox.require("utils/dialogs"),i=codebox.require("core/menu"),s=codebox.require("core/box");i.register("git",{title:"Repository"}).menuSection([{id:"git.sync",title:"Synchronize",shortcuts:["mod+S"],action:function(){s.sync()}}]).menuSection([{id:"git.commit",title:"Commit",shortcuts:["mod+shift+C"],action:function(){r.open(e)}}]).menuSection([{id:"git.push",title:"Push",shortcuts:["mod+P"],action:function(){s.gitPush()}},{id:"git.pull",title:"Pull",shortcuts:["shift+mod+P"],action:function(){s.gitPull()}}])}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}(".addon-git-dialog .modal-body{padding:0}.addon-git-dialog .modal-footer,.addon-git-dialog .navbar{margin:0}.addon-git-dialog .git-changes .git-commit{padding:15px 10px;background:#f8f8f8}.addon-git-dialog .git-changes .git-commit textarea{resize:none}.addon-git-dialog .git-changes .git-changes-files{list-style:none;margin:0;padding:0}.addon-git-dialog .git-changes .git-changes-files .file{background:#fdfdfd;box-shadow:0 1px 0 #fff inset;border-top:1px solid #ddd;padding:6px 6px 6px 55px;position:relative}.addon-git-dialog .git-changes .git-changes-files .file .file-type{position:absolute;display:block;top:0;left:0;width:45px;bottom:0;padding:6px;text-align:center;color:#fff}.addon-git-dialog .git-changes .git-changes-files .file .file-type.type-M{background:#3498db}.addon-git-dialog .git-changes .git-changes-files .file .file-type.type-A{background:#2ecc71}.addon-git-dialog .git-changes .git-changes-files .file .file-type.type-D{background:#e74c3c}")