/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

define("require-tools/text/text",["module"],function(e){var t,n,r,i,s,o=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],u=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,a=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,f=typeof location!="undefined"&&location.href,l=f&&location.protocol&&location.protocol.replace(/\:/,""),c=f&&location.hostname,h=f&&(location.port||undefined),p={},d=e.config&&e.config()||{};t={version:"2.0.10",strip:function(e){if(e){e=e.replace(u,"");var t=e.match(a);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:d.createXhr||function(){var e,t,n;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(t=0;t<3;t+=1){n=o[t];try{e=new ActiveXObject(n)}catch(r){}if(e){o=[n];break}}return e},parseName:function(e){var t,n,r,i=!1,s=e.indexOf("."),o=e.indexOf("./")===0||e.indexOf("../")===0;return s!==-1&&(!o||s>1)?(t=e.substring(0,s),n=e.substring(s+1,e.length)):t=e,r=n||t,s=r.indexOf("!"),s!==-1&&(i=r.substring(s+1)==="strip",r=r.substring(0,s),n?n=r:t=r),{moduleName:t,ext:n,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,n,r,i){var s,o,u,a=t.xdRegExp.exec(e);return a?(s=a[2],o=a[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===n)&&(!o||o.toLowerCase()===r.toLowerCase())&&(!u&&!o||u===i)):!0},finishLoad:function(e,n,r,i){r=n?t.strip(r):r,d.isBuild&&(p[e]=r),i(r)},load:function(e,n,r,i){if(i.isBuild&&!i.inlineText){r();return}d.isBuild=i.isBuild;var s=t.parseName(e),o=s.moduleName+(s.ext?"."+s.ext:""),u=n.toUrl(o),a=d.useXhr||t.useXhr;if(u.indexOf("empty:")===0){r();return}!f||a(u,l,c,h)?t.get(u,function(n){t.finishLoad(e,s.strip,n,r)},function(e){r.error&&r.error(e)}):n([o],function(e){t.finishLoad(s.moduleName+"."+s.ext,s.strip,e,r)})},write:function(e,n,r,i){if(p.hasOwnProperty(n)){var s=t.jsEscape(p[n]);r.asModule(e+"!"+n,"define(function () { return '"+s+"';});\n")}},writeFile:function(e,n,r,i,s){var o=t.parseName(n),u=o.ext?"."+o.ext:"",a=o.moduleName+u,f=r.toUrl(o.moduleName+u)+".js";t.load(a,r,function(n){var r=function(e){return i(f,e)};r.asModule=function(e,t){return i.asModule(e,f,t)},t.write(e,a,r,s)},s)}};if(d.env==="node"||!d.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])n=require.nodeRequire("fs"),t.get=function(e,t,r){try{var i=n.readFileSync(e,"utf8");i.indexOf("﻿")===0&&(i=i.substring(1)),t(i)}catch(s){r(s)}};else if(d.env==="xhr"||!d.env&&t.createXhr())t.get=function(e,n,r,i){var s=t.createXhr(),o;s.open("GET",e,!0);if(i)for(o in i)i.hasOwnProperty(o)&&s.setRequestHeader(o.toLowerCase(),i[o]);d.onXhr&&d.onXhr(s,e),s.onreadystatechange=function(t){var i,o;s.readyState===4&&(i=s.status,i>399&&i<600?(o=new Error(e+" HTTP status: "+i),o.xhr=s,r(o)):n(s.responseText),d.onXhrComplete&&d.onXhrComplete(s,e))},s.send(null)};else if(d.env==="rhino"||!d.env&&typeof Packages!="undefined"&&typeof java!="undefined")t.get=function(e,t){var n,r,i="utf-8",s=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),u=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s),i)),a="";try{n=new java.lang.StringBuffer,r=u.readLine(),r&&r.length()&&r.charAt(0)===65279&&(r=r.substring(1)),r!==null&&n.append(r);while((r=u.readLine())!==null)n.append(o),n.append(r);a=String(n.toString())}finally{u.close()}t(a)};else if(d.env==="xpconnect"||!d.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)r=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),s="@mozilla.org/windows-registry-key;1"in r,t.get=function(e,t){var n,o,u,a={};s&&(e=e.replace(/\//g,"\\")),u=new FileUtils.File(e);try{n=r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream),n.init(u,1,0,!1),o=r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream),o.init(n,"utf-8",n.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),o.readString(n.available(),a),o.close(),n.close(),t(a.value)}catch(f){throw new Error((u&&u.path||"")+": "+f)}};return t}),define("require-tools/text/text!templates/item.html",[],function(){return'<span class="name">\n    <% if (file.isDirectory()) { %>\n    <i class="fa fa-caret-right"></i>\n    <i class="fa fa-caret-down"></i>\n    <% } else { %>\n    <i class="fa fa-file"></i>\n    <% } %>\n    <%- file.get("name") %>\n</span>\n<% if (file.isDirectory()) { %>\n    <div class="files"></div>\n<% } %>'}),define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/files",[],function(){}),define("views/tree",["text!templates/item.html","less!stylesheets/files.less"],function(e){var t=codebox.require("underscore"),n=codebox.require("jQuery"),r=codebox.require("hr/hr"),i=codebox.require("core/box"),s=codebox.require("utils/contextmenu"),o=codebox.require("views/files/base"),u=o.extend({tagName:"li",className:"file-item",templateLoader:"text",template:e,events:{"click .name":"select","dblclick .name":"open"},initialize:function(e){u.__super__.initialize.apply(this,arguments);var t=this;return this.subFiles=null,this.paddingLeft=this.options.paddingLeft||0,s.add(this.$el,this.model.contextMenu()),i.on("file.active",function(e){this.$el.toggleClass("active",this.model.path()==e)},this),this},finish:function(){return this.$el.toggleClass("disabled",!this.model.canOpen()),this.$(">.name").css("padding-left",this.paddingLeft),this.$el.toggleClass("type-directory",this.model.isDirectory()),this.subFiles&&this.subFiles.$el.appendTo(this.$(".files")),u.__super__.finish.apply(this,arguments)},select:function(e){e!=null&&(e.preventDefault(),e.stopPropagation());if(!this.model.canOpen())return;this.model.isDirectory()?(this.subFiles==null&&(this.subFiles=new a({codebox:this.codebox,model:this.model,paddingLeft:this.paddingLeft+15}),this.subFiles.$el.appendTo(this.$(".files")),this.subFiles.update()),this.$el.toggleClass("open")):this.open()},open:function(e){e!=null&&(e.preventDefault(),e.stopPropagation());if(!this.model.canOpen())return;this.model.isDirectory()?this.select():this.model.open({userChoice:!1})}}),a=o.extend({tagName:"ul",className:"cb-files-tree",initialize:function(e){a.__super__.initialize.apply(this,arguments);var n=this;return this.countFiles=0,this.paddingLeft=this.options.paddingLeft||10,this.model.on("loading:action",function(e,r){if(!t.contains(["mkdir","create"],r))return;n.update()}),this},render:function(){var e=this;return this.$el.toggleClass("root",this.model.isRoot()),s.add(this.$el,this.model.contextMenu()),this.model.listdir().then(function(r){e.empty(),e.countFiles=0,e.model.isRoot()&&n("<li>",{"class":"file-header",text:"folders"}).appendTo(e.$el),t.each(r,function(n){if(n.isGit())return;var r=new u({codebox:e.codebox,model:n,paddingLeft:e.paddingLeft});r.update(),r.$el.appendTo(e.$el),n.on("loading:action",function(n,r){if(!t.contains(["rename","remove"],r))return;e.update()}),e.countFiles=e.countFiles+1}),e.trigger("count",e.countFiles)}),e.ready()}},{Item:u});return a}),define("views/list",["views/tree"],function(e){var t=codebox.require("underscore"),n=codebox.require("jQuery"),r=codebox.require("hr/hr"),i=r.List.extend({tagName:"ul",className:"cb-files-tree",Item:e.Item});return i}),define("require-tools/less/less!stylesheets/panel",[],function(){}),define("views/panel",["views/tree","views/list","less!stylesheets/panel.less"],function(e,t){var n=codebox.require("underscore"),r=codebox.require("jQuery"),i=codebox.require("hr/hr"),s=codebox.require("core/box"),o=codebox.require("core/files"),u=codebox.require("core/search"),a=codebox.require("utils/contextmenu"),f=codebox.require("views/panels/base"),l=f.extend({className:"cb-panel-files",initialize:function(){l.__super__.initialize.apply(this,arguments),this.treeActive=new t({collection:o.active}),this.tree=new e({path:"/"}),this.tree.on("count",function(e){this.toggle(e>0)},this),i.Offline.on("state",function(){this.update()},this)},render:function(){return this.$el.empty(),a.add(this.$el,s.root.contextMenu()),this.treeActive.$el.appendTo(this.$el),this.treeActive.render(),this.tree.$el.appendTo(this.$el),this.tree.render(),this.ready()},finish:function(){return this.toggle(this.tree.countFiles>0),l.__super__.finish.apply(this,arguments)}});return l}),define("client",["views/panel"],function(e){var t=codebox.require("models/command"),n=codebox.require("core/commands/toolbar"),r=codebox.require("core/app"),i=codebox.require("core/panels"),s=codebox.require("core/files"),o=codebox.require("core/commands/menu"),u=codebox.require("core/box"),a=i.register("files",e);a.connectCommand(n.register("files.tree.open",{title:"Files",icon:"folder-o",position:2,shortcuts:["f"]}));var f=t.register("file.recents",{type:"menu",title:"Open Recent"});s.recent.on("add remove reset",function(){f.menu.reset(s.recent.map(function(e){var t=e.path();return{title:e.get("name"),action:function(){s.open(t)}}}).reverse())}),o.getById("file").menuSection([{id:"file.new",type:"action",title:"New File",shortcuts:["ctrl+shift+N"],action:function(){s.openNew()}},{id:"folder.create",type:"action",title:"New Folder",shortcuts:["ctrl+shift+F"],action:function(){u.root.actionMkdir()}},f],{position:0}).menuSection([{id:"workspace.save.zip",type:"action",title:"Save Project As ZIP",offline:!1,action:function(){window.open("/export/zip")}}])}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}(".cb-files-tree{margin:0;padding:0;list-style:none}.cb-files-tree .file-header{text-transform:uppercase;font-weight:800;padding:0 10px;font-size:13px;opacity:.65;line-height:28px}.cb-files-tree .file-item{cursor:default;line-height:24px;font-size:14px}.cb-files-tree .file-item>.files{display:none}.cb-files-tree .file-item.active>.name,.cb-files-tree .file-item.active:hover>.name{background:rgba(0,0,0,.08);color:inherit}.cb-files-tree .file-item.disabled>.name{color:#999}.cb-files-tree .file-item.ui-context-menu>.name{background:rgba(0,0,0,.15)}.cb-files-tree .file-item>.name{color:inherit;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:block;z-index:1;position:relative}.cb-files-tree .file-item>.name:hover{background:#5E9EF3;color:#fff}.cb-files-tree .file-item>.name>i{width:11px;text-align:center}.cb-files-tree .file-item>.name>i.fa-file{color:transparent;text-shadow:none}.cb-files-tree .file-item>.name>.fa-caret-right{display:inline-block}.cb-files-tree .file-item>.name>.fa-caret-down{display:none}.cb-files-tree .file-item.open>.files{display:block}.cb-files-tree .file-item.open>.name>.fa-caret-right{display:none}.cb-files-tree .file-item.open>.name>.fa-caret-down{display:inline-block}.cb-panel-files{position:absolute;top:0;bottom:0;left:0;width:100%;z-index:10}")