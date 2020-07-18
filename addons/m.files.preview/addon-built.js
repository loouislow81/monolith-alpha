/**
 * @license RequireJS text 2.0.10 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */

// Released under MIT license
// Copyright (c) 2009-2010 Dominic Baggott
// Copyright (c) 2009-2010 Ash Berlin
// Copyright (c) 2011 Christoph Dorn <christoph@christophdorn.com> (http://www.christophdorn.com)

define("settings",[],function(){var e=monolith.require("core/settings");return e.add({namespace:"preview",title:"Preview",defaults:{refresh:!0},fields:{refresh:{label:"Reload on Save",type:"checkbox"}}})}),define("require-tools/text/text",["module"],function(e){var t,n,r,i,s,o=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],u=/^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,a=/<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,f=typeof location!="undefined"&&location.href,l=f&&location.protocol&&location.protocol.replace(/\:/,""),c=f&&location.hostname,h=f&&(location.port||undefined),p={},d=e.config&&e.config()||{};t={version:"2.0.10",strip:function(e){if(e){e=e.replace(u,"");var t=e.match(a);t&&(e=t[1])}else e="";return e},jsEscape:function(e){return e.replace(/(['\\])/g,"\\$1").replace(/[\f]/g,"\\f").replace(/[\b]/g,"\\b").replace(/[\n]/g,"\\n").replace(/[\t]/g,"\\t").replace(/[\r]/g,"\\r").replace(/[\u2028]/g,"\\u2028").replace(/[\u2029]/g,"\\u2029")},createXhr:d.createXhr||function(){var e,t,n;if(typeof XMLHttpRequest!="undefined")return new XMLHttpRequest;if(typeof ActiveXObject!="undefined")for(t=0;t<3;t+=1){n=o[t];try{e=new ActiveXObject(n)}catch(r){}if(e){o=[n];break}}return e},parseName:function(e){var t,n,r,i=!1,s=e.indexOf("."),o=e.indexOf("./")===0||e.indexOf("../")===0;return s!==-1&&(!o||s>1)?(t=e.substring(0,s),n=e.substring(s+1,e.length)):t=e,r=n||t,s=r.indexOf("!"),s!==-1&&(i=r.substring(s+1)==="strip",r=r.substring(0,s),n?n=r:t=r),{moduleName:t,ext:n,strip:i}},xdRegExp:/^((\w+)\:)?\/\/([^\/\\]+)/,useXhr:function(e,n,r,i){var s,o,u,a=t.xdRegExp.exec(e);return a?(s=a[2],o=a[3],o=o.split(":"),u=o[1],o=o[0],(!s||s===n)&&(!o||o.toLowerCase()===r.toLowerCase())&&(!u&&!o||u===i)):!0},finishLoad:function(e,n,r,i){r=n?t.strip(r):r,d.isBuild&&(p[e]=r),i(r)},load:function(e,n,r,i){if(i.isBuild&&!i.inlineText){r();return}d.isBuild=i.isBuild;var s=t.parseName(e),o=s.moduleName+(s.ext?"."+s.ext:""),u=n.toUrl(o),a=d.useXhr||t.useXhr;if(u.indexOf("empty:")===0){r();return}!f||a(u,l,c,h)?t.get(u,function(n){t.finishLoad(e,s.strip,n,r)},function(e){r.error&&r.error(e)}):n([o],function(e){t.finishLoad(s.moduleName+"."+s.ext,s.strip,e,r)})},write:function(e,n,r,i){if(p.hasOwnProperty(n)){var s=t.jsEscape(p[n]);r.asModule(e+"!"+n,"define(function () { return '"+s+"';});\n")}},writeFile:function(e,n,r,i,s){var o=t.parseName(n),u=o.ext?"."+o.ext:"",a=o.moduleName+u,f=r.toUrl(o.moduleName+u)+".js";t.load(a,r,function(n){var r=function(e){return i(f,e)};r.asModule=function(e,t){return i.asModule(e,f,t)},t.write(e,a,r,s)},s)}};if(d.env==="node"||!d.env&&typeof process!="undefined"&&process.versions&&!!process.versions.node&&!process.versions["node-webkit"])n=require.nodeRequire("fs"),t.get=function(e,t,r){try{var i=n.readFileSync(e,"utf8");i.indexOf("﻿")===0&&(i=i.substring(1)),t(i)}catch(s){r(s)}};else if(d.env==="xhr"||!d.env&&t.createXhr())t.get=function(e,n,r,i){var s=t.createXhr(),o;s.open("GET",e,!0);if(i)for(o in i)i.hasOwnProperty(o)&&s.setRequestHeader(o.toLowerCase(),i[o]);d.onXhr&&d.onXhr(s,e),s.onreadystatechange=function(t){var i,o;s.readyState===4&&(i=s.status,i>399&&i<600?(o=new Error(e+" HTTP status: "+i),o.xhr=s,r(o)):n(s.responseText),d.onXhrComplete&&d.onXhrComplete(s,e))},s.send(null)};else if(d.env==="rhino"||!d.env&&typeof Packages!="undefined"&&typeof java!="undefined")t.get=function(e,t){var n,r,i="utf-8",s=new java.io.File(e),o=java.lang.System.getProperty("line.separator"),u=new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(s),i)),a="";try{n=new java.lang.StringBuffer,r=u.readLine(),r&&r.length()&&r.charAt(0)===65279&&(r=r.substring(1)),r!==null&&n.append(r);while((r=u.readLine())!==null)n.append(o),n.append(r);a=String(n.toString())}finally{u.close()}t(a)};else if(d.env==="xpconnect"||!d.env&&typeof Components!="undefined"&&Components.classes&&Components.interfaces)r=Components.classes,i=Components.interfaces,Components.utils["import"]("resource://gre/modules/FileUtils.jsm"),s="@mozilla.org/windows-registry-key;1"in r,t.get=function(e,t){var n,o,u,a={};s&&(e=e.replace(/\//g,"\\")),u=new FileUtils.File(e);try{n=r["@mozilla.org/network/file-input-stream;1"].createInstance(i.nsIFileInputStream),n.init(u,1,0,!1),o=r["@mozilla.org/intl/converter-input-stream;1"].createInstance(i.nsIConverterInputStream),o.init(n,"utf-8",n.available(),i.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER),o.readString(n.available(),a),o.close(),n.close(),t(a.value)}catch(f){throw new Error((u&&u.path||"")+": "+f)}};return t}),define("require-tools/text/text!templates/preview_html.html",[],function(){return'<div class="tab-panel-body">\n<iframe src="<%- file.exportUrl() %>"></iframe>\n</div>'}),define("require-tools/less/normalize",[],function(){function r(e,r,i){if(e.indexOf("data:")===0)return e;e=t(e);var u=i.match(n),a=r.match(n);return a&&(!u||u[1]!=a[1]||u[2]!=a[2])?s(e,r):o(s(e,r),i)}function s(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));if(e.match(/^\//)||e.match(n))return e;var r=t.split("/"),i=e.split("/");r.pop();while(curPart=i.shift())curPart==".."?r.pop():r.push(curPart);return r.join("/")}function o(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var e=/([^:])\/+/g,t=function(t){return t.replace(e,"$1/")},n=/[^\:\/]*:\/\/([^\/])*/,u=function(e,n,i){n=t(n),i=t(i);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,o,u,e;while(o=s.exec(e)){u=o[3]||o[2]||o[5]||o[6]||o[4];var a;a=r(u,n,i);var f=o[5]||o[6]?1:0;e=e.substr(0,s.lastIndex-u.length-f-1)+a+e.substr(s.lastIndex-f-1),s.lastIndex=s.lastIndex+(a.length-u.length)}return e};return u.convertURIBase=r,u.absoluteURI=s,u.relativeURI=o,u}),define("require-tools/less/less",["require"],function(e){var t={};t.pluginBuilder="./less-builder";if(typeof window=="undefined")return t.load=function(e,t,n){n()},less;t.normalize=function(e,t){return e.substr(e.length-5,5)==".less"&&(e=e.substr(0,e.length-5)),e=t(e),e};var n=document.getElementsByTagName("head")[0],r=window.location.href.split("/");r[r.length-1]="",r=r.join("/");var i;window.less=window.less||{env:"development"};var s=0,o;t.inject=function(e){s<31&&(o=document.createElement("style"),o.type="text/css",n.appendChild(o),s++),o.styleSheet?o.styleSheet.cssText+=e:o.appendChild(document.createTextNode(e))};var u;return t.load=function(n,s,o,a){e(["./lessc","./normalize"],function(a,f){if(!i){var l=e.toUrl("base_url").split("/");l[l.length-1]="",i=f.absoluteURI(l.join("/"),r)+"/"}var c=s.toUrl(n+".less");c=f.absoluteURI(c,i),u=u||new a.Parser(window.less),u.parse('@import "'+c+'";',function(e,n){if(e)return o.error(e);t.inject(f(n.toCSS(),c,r)),setTimeout(o,7)})})},t}),define("require-tools/less/less!stylesheets/preview",[],function(){}),define("views/preview_html",["settings","text!templates/preview_html.html","less!stylesheets/preview.less"],function(e,t){var n=monolith.require("hr/utils"),r=monolith.require("hr/dom"),i=monolith.require("core/box"),s=monolith.require("views/files/tab"),o=s.extend({className:"addon-files-previewviewer",templateLoader:"text",template:t,events:{},initialize:function(){o.__super__.initialize.apply(this,arguments);var t=this;return this.tab.menu.menuSection([{type:"action",title:"Refresh",shortcuts:["mod+r"],bindKeyboard:!0,action:function(){t.refresh()}}]),i.on("box:watch:change:update",function(){e.user.get("refresh")&&t.refresh()},this),this},refresh:function(){r(this.$el).find("iframe").attr("src",function(e,t){return t})}});return o}),function(e){function n(){return"Markdown.mk_block( "+uneval(this.toString())+", "+uneval(this.trailing)+", "+uneval(this.lineNumber)+" )"}function r(){var e=require("util");return"Markdown.mk_block( "+e.inspect(this.toString())+", "+e.inspect(this.trailing)+", "+e.inspect(this.lineNumber)+" )"}function s(e){var t=0,n=-1;while((n=e.indexOf("\n",n+1))!==-1)t++;return t}function o(e,t){function i(e){this.len_after=e,this.name="close_"+t}var n=e+"_state",r=e=="strong"?"em_state":"strong_state";return function(s,o){if(this[n][0]==t)return this[n].shift(),[s.length,new i(s.length-t.length)];var u=this[r].slice(),a=this[n].slice();this[n].unshift(t);var f=this.processInline(s.substr(t.length)),l=f[f.length-1],c=this[n].shift();if(l instanceof i){f.pop();var h=s.length-l.len_after;return[h,[e].concat(f)]}return this[r]=u,this[n]=a,[t.length,t]}}function u(e){var t=e.split(""),n=[""],r=!1;while(t.length){var i=t.shift();switch(i){case" ":r?n[n.length-1]+=i:n.push("");break;case"'":case'"':r=!r;break;case"\\":i=t.shift();default:n[n.length-1]+=i}}return n}function h(e){return f(e)&&e.length>1&&typeof e[1]=="object"&&!f(e[1])?e[1]:undefined}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function v(e){if(typeof e=="string")return d(e);var t=e.shift(),n={},r=[];e.length&&typeof e[0]=="object"&&!(e[0]instanceof Array)&&(n=e.shift());while(e.length)r.push(v(e.shift()));var i="";for(var s in n)i+=" "+s+'="'+d(n[s])+'"';return t=="img"||t=="br"||t=="hr"?"<"+t+i+"/>":"<"+t+i+">"+r.join("")+"</"+t+">"}function m(e,t,n){var r;n=n||{};var i=e.slice(0);typeof n.preprocessTreeNode=="function"&&(i=n.preprocessTreeNode(i,t));var s=h(i);if(s){i[1]={};for(r in s)i[1][r]=s[r];s=i[1]}if(typeof i=="string")return i;switch(i[0]){case"header":i[0]="h"+i[1].level,delete i[1].level;break;case"bulletlist":i[0]="ul";break;case"numberlist":i[0]="ol";break;case"listitem":i[0]="li";break;case"para":i[0]="p";break;case"markdown":i[0]="html",s&&delete s.references;break;case"code_block":i[0]="pre",r=s?2:1;var o=["code"];o.push.apply(o,i.splice(r,i.length-r)),i[r]=o;break;case"inlinecode":i[0]="code";break;case"img":i[1].src=i[1].href,delete i[1].href;break;case"linebreak":i[0]="br";break;case"link":i[0]="a";break;case"link_ref":i[0]="a";var u=t[s.ref];if(!u)return s.original;delete s.ref,s.href=u.href,u.title&&(s.title=u.title),delete s.original;break;case"img_ref":i[0]="img";var u=t[s.ref];if(!u)return s.original;delete s.ref,s.src=u.href,u.title&&(s.title=u.title),delete s.original}r=1;if(s){for(var a in i[1]){r=2;break}r===1&&i.splice(r,1)}for(;r<i.length;++r)i[r]=m(i[r],t,n);return i}function g(e){var t=h(e)?2:1;while(t<e.length)typeof e[t]=="string"?t+1<e.length&&typeof e[t+1]=="string"?e[t]+=e.splice(t+1,1)[0]:++t:(g(e[t]),++t)}var t=e.Markdown=function(e){switch(typeof e){case"undefined":this.dialect=t.dialects.Gruber;break;case"object":this.dialect=e;break;default:if(!(e in t.dialects))throw new Error("Unknown Markdown dialect '"+String(e)+"'");this.dialect=t.dialects[e]}this.em_state=[],this.strong_state=[],this.debug_indent=""};e.parse=function(e,n){var r=new t(n);return r.toTree(e)},e.toHTML=function(n,r,i){var s=e.toHTMLTree(n,r,i);return e.renderJsonML(s)},e.toHTMLTree=function(t,n,r){typeof t=="string"&&(t=this.parse(t,n));var i=h(t),s={};i&&i.references&&(s=i.references);var o=m(t,s,r);return g(o),o};var i=t.mk_block=function(e,t,i){arguments.length==1&&(t="\n\n");var s=new String(e);return s.trailing=t,s.inspect=r,s.toSource=n,i!=undefined&&(s.lineNumber=i),s};t.prototype.split_blocks=function(t,n){t=t.replace(/(\r\n|\n|\r)/g,"\n");var r=/([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g,o=[],u,a=1;(u=/^(\s*\n)/.exec(t))!=null&&(a+=s(u[0]),r.lastIndex=u[0].length);while((u=r.exec(t))!==null)u[2]=="\n#"&&(u[2]="\n",r.lastIndex--),o.push(i(u[1],u[2],a)),a+=s(u[0]);return o},t.prototype.processBlock=function(t,n){var r=this.dialect.block,i=r.__order__;if("__call__"in r)return r.__call__.call(this,t,n);for(var s=0;s<i.length;s++){var o=r[i[s]].call(this,t,n);if(o)return(!f(o)||o.length>0&&!f(o[0]))&&this.debug(i[s],"didn't return a proper array"),o}return[]},t.prototype.processInline=function(t){return this.dialect.inline.__call__.call(this,String(t))},t.prototype.toTree=function(t,n){var r=t instanceof Array?t:this.split_blocks(t),i=this.tree;try{this.tree=n||this.tree||["markdown"];e:while(r.length){var s=this.processBlock(r.shift(),r);if(!s.length)continue e;this.tree.push.apply(this.tree,s)}return this.tree}finally{n&&(this.tree=i)}},t.prototype.debug=function(){var e=Array.prototype.slice.call(arguments);e.unshift(this.debug_indent),typeof print!="undefined"&&print.apply(print,e),typeof console!="undefined"&&typeof console.log!="undefined"&&console.log.apply(null,e)},t.prototype.loop_re_over_block=function(e,t,n){var r,i=t.valueOf();while(i.length&&(r=e.exec(i))!=null)i=i.substr(r[0].length),n.call(this,r);return i},t.dialects={},t.dialects.Gruber={block:{atxHeader:function(t,n){var r=t.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);if(!r)return undefined;var s=["header",{level:r[1].length}];return Array.prototype.push.apply(s,this.processInline(r[2])),r[0].length<t.length&&n.unshift(i(t.substr(r[0].length),t.trailing,t.lineNumber+2)),[s]},setextHeader:function(t,n){var r=t.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);if(!r)return undefined;var s=r[2]==="="?1:2,o=["header",{level:s},r[1]];return r[0].length<t.length&&n.unshift(i(t.substr(r[0].length),t.trailing,t.lineNumber+2)),[o]},code:function(t,n){var r=[],s=/^(?: {0,3}\t| {4})(.*)\n?/,o;if(!t.match(s))return undefined;e:do{var u=this.loop_re_over_block(s,t.valueOf(),function(e){r.push(e[1])});if(u.length){n.unshift(i(u,t.trailing));break e}if(!n.length)break e;if(!n[0].match(s))break e;r.push(t.trailing.replace(/[^\n]/g,"").substring(2)),t=n.shift()}while(!0);return[["code_block",r.join("\n")]]},horizRule:function(t,n){var r=t.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);if(!r)return undefined;var s=[["hr"]];return r[1]&&s.unshift.apply(s,this.processBlock(r[1],[])),r[3]&&n.unshift(i(r[3])),s},lists:function(){function o(t){return new RegExp("(?:^("+s+"{0,"+t+"} {0,3})("+e+")\\s+)|"+"(^"+s+"{0,"+(t-1)+"}[ ]{0,4})")}function u(e){return e.replace(/ {0,3}\t/g,"    ")}function a(e,t,n,r){if(t){e.push(["para"].concat(n));return}var i=e[e.length-1]instanceof Array&&e[e.length-1][0]=="para"?e[e.length-1]:e;r&&e.length>1&&n.unshift(r);for(var s=0;s<n.length;s++){var o=n[s],u=typeof o=="string";u&&i.length>1&&typeof i[i.length-1]=="string"?i[i.length-1]+=o:i.push(o)}}function f(e,t){var n=new RegExp("^("+s+"{"+e+"}.*?\\n?)*$"),r=new RegExp("^"+s+"{"+e+"}","gm"),o=[];while(t.length>0){if(!n.exec(t[0]))break;var u=t.shift(),a=u.replace(r,"");o.push(i(a,u.trailing,u.lineNumber))}return o}function c(e,t,n){var r=e.list,i=r[r.length-1];if(i[1]instanceof Array&&i[1][0]=="para")return;if(t+1==n.length)i.push(["para"].concat(i.splice(1,i.length-1)));else{var s=i.pop();i.push(["para"].concat(i.splice(1,i.length-1)),s)}}var e="[*+-]|\\d+\\.",t=/[*+-]/,n=/\d+\./,r=new RegExp("^( {0,3})("+e+")[ 	]+"),s="(?: {0,3}\\t| {4})";return function(e,n){function s(e){var n=t.exec(e[2])?["bulletlist"]:["numberlist"];return h.push({list:n,indent:e[1]}),n}var i=e.match(r);if(!i)return undefined;var h=[],p=s(i),d,v=!1,m=[h[0].list],g;e:for(;;){var y=e.split(/(?=\n)/),b="";for(var w=0;w<y.length;w++){var E="",S=y[w].replace(/^\n/,function(e){return E=e,""}),x=o(h.length);i=S.match(x);if(i[1]!==undefined){b.length&&(a(d,v,this.processInline(b),E),v=!1,b=""),i[1]=u(i[1]);var T=Math.floor(i[1].length/4)+1;if(T>h.length)p=s(i),d.push(p),d=p[1]=["listitem"];else{var N=!1;for(g=0;g<h.length;g++){if(h[g].indent!=i[1])continue;p=h[g].list,h.splice(g+1,h.length-(g+1)),N=!0;break}N||(T++,T<=h.length?(h.splice(T,h.length-T),p=h[T-1].list):(p=s(i),d.push(p))),d=["listitem"],p.push(d)}E=""}S.length>i[0].length&&(b+=E+S.substr(i[0].length))}b.length&&(a(d,v,this.processInline(b),E),v=!1,b="");var C=f(h.length,n);C.length>0&&(l(h,c,this),d.push.apply(d,this.toTree(C,[])));var k=n[0]&&n[0].valueOf()||"";if(k.match(r)||k.match(/^ /)){e=n.shift();var L=this.dialect.block.horizRule(e,n);if(L){m.push.apply(m,L);break}l(h,c,this),v=!0;continue e}break}return m}}(),blockquote:function(t,n){if(!t.match(/^>/m))return undefined;var r=[];if(t[0]!=">"){var s=t.split(/\n/),o=[],u=t.lineNumber;while(s.length&&s[0][0]!=">")o.push(s.shift()),u++;var a=i(o.join("\n"),"\n",t.lineNumber);r.push.apply(r,this.processBlock(a,[])),t=i(s.join("\n"),t.trailing,u)}while(n.length&&n[0][0]==">"){var f=n.shift();t=i(t+t.trailing+f,f.trailing,t.lineNumber)}var l=t.replace(/^> ?/gm,""),p=this.tree,d=this.toTree(l,["blockquote"]),v=h(d);return v&&v.references&&(delete v.references,c(v)&&d.splice(1,1)),r.push(d),r},referenceDefn:function(t,n){var r=/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/;if(!t.match(r))return undefined;h(this.tree)||this.tree.splice(1,0,{});var s=h(this.tree);s.references===undefined&&(s.references={});var o=this.loop_re_over_block(r,t,function(e){e[2]&&e[2][0]=="<"&&e[2][e[2].length-1]==">"&&(e[2]=e[2].substring(1,e[2].length-1));var t=s.references[e[1].toLowerCase()]={href:e[2]};e[4]!==undefined?t.title=e[4]:e[5]!==undefined&&(t.title=e[5])});return o.length&&n.unshift(i(o,t.trailing)),[]},para:function(t,n){return[["para"].concat(this.processInline(t))]}}},t.dialects.Gruber.inline={__oneElement__:function(t,n,r){var i,s,o=0;n=n||this.dialect.inline.__patterns__;var u=new RegExp("([\\s\\S]*?)("+(n.source||n)+")");i=u.exec(t);if(!i)return[t.length,t];if(i[1])return[i[1].length,i[1]];var s;return i[2]in this.dialect.inline&&(s=this.dialect.inline[i[2]].call(this,t.substr(i.index),i,r||[])),s=s||[i[2].length,i[2]],s},__call__:function(t,n){function s(e){typeof e=="string"&&typeof r[r.length-1]=="string"?r[r.length-1]+=e:r.push(e)}var r=[],i;while(t.length>0)i=this.dialect.inline.__oneElement__.call(this,t,n,r),t=t.substr(i.shift()),l(i,s);return r},"]":function(){},"}":function(){},__escape__:/^\\[\\`\*_{}\[\]()#\+.!\-]/,"\\":function(t){return this.dialect.inline.__escape__.exec(t)?[2,t.charAt(1)]:[1,"\\"]},"![":function(t){var n=t.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);if(n){n[2]&&n[2][0]=="<"&&n[2][n[2].length-1]==">"&&(n[2]=n[2].substring(1,n[2].length-1)),n[2]=this.dialect.inline.__call__.call(this,n[2],/\\/)[0];var r={alt:n[1],href:n[2]||""};return n[4]!==undefined&&(r.title=n[4]),[n[0].length,["img",r]]}return n=t.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),n?[n[0].length,["img_ref",{alt:n[1],ref:n[2].toLowerCase(),original:n[0]}]]:[2,"!["]},"[":function y(e){var n=String(e),r=t.DialectHelpers.inline_until_char.call(this,e.substr(1),"]");if(!r)return[1,"["];var i=1+r[0],s=r[1],y,o;e=e.substr(i);var u=e.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);if(u){var a=u[1];i+=u[0].length,a&&a[0]=="<"&&a[a.length-1]==">"&&(a=a.substring(1,a.length-1));if(!u[3]){var f=1;for(var l=0;l<a.length;l++)switch(a[l]){case"(":f++;break;case")":--f==0&&(i-=a.length-l,a=a.substring(0,l))}}return a=this.dialect.inline.__call__.call(this,a,/\\/)[0],o={href:a||""},u[3]!==undefined&&(o.title=u[3]),y=["link",o].concat(s),[i,y]}return u=e.match(/^\s*\[(.*?)\]/),u?(i+=u[0].length,o={ref:(u[1]||String(s)).toLowerCase(),original:n.substr(0,i)},y=["link_ref",o].concat(s),[i,y]):s.length==1&&typeof s[0]=="string"?(o={ref:s[0].toLowerCase(),original:n.substr(0,i)},y=["link_ref",o,s[0]],[i,y]):[1,"["]},"<":function(t){var n;return(n=t.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/))!=null?n[3]?[n[0].length,["link",{href:"mailto:"+n[3]},n[3]]]:n[2]=="mailto"?[n[0].length,["link",{href:n[1]},n[1].substr("mailto:".length)]]:[n[0].length,["link",{href:n[1]},n[1]]]:[1,"<"]},"`":function(t){var n=t.match(/(`+)(([\s\S]*?)\1)/);return n&&n[2]?[n[1].length+n[2].length,["inlinecode",n[3]]]:[1,"`"]},"  \n":function(t){return[3,["linebreak"]]}},t.dialects.Gruber.inline["**"]=o("strong","**"),t.dialects.Gruber.inline.__=o("strong","__"),t.dialects.Gruber.inline["*"]=o("em","*"),t.dialects.Gruber.inline._=o("em","_"),t.buildBlockOrder=function(e){var t=[];for(var n in e){if(n=="__order__"||n=="__call__")continue;t.push(n)}e.__order__=t},t.buildInlinePatterns=function(e){var t=[];for(var n in e){if(n.match(/^__.*__$/))continue;var r=n.replace(/([\\.*+?|()\[\]{}])/g,"\\$1").replace(/\n/,"\\n");t.push(n.length==1?r:"(?:"+r+")")}t=t.join("|"),e.__patterns__=t;var i=e.__call__;e.__call__=function(e,n){return n!=undefined?i.call(this,e,n):i.call(this,e,t)}},t.DialectHelpers={},t.DialectHelpers.inline_until_char=function(e,t){var n=0,r=[];for(;;){if(e.charAt(n)==t)return n++,[n,r];if(n>=e.length)return null;var i=this.dialect.inline.__oneElement__.call(this,e.substr(n));n+=i[0],r.push.apply(r,i.slice(1))}},t.subclassDialect=function(e){function t(){}function n(){}return t.prototype=e.block,n.prototype=e.inline,{block:new t,inline:new n}},t.buildBlockOrder(t.dialects.Gruber.block),t.buildInlinePatterns(t.dialects.Gruber.inline),t.dialects.Maruku=t.subclassDialect(t.dialects.Gruber),t.dialects.Maruku.processMetaHash=function(t){var n=u(t),r={};for(var i=0;i<n.length;++i)if(/^#/.test(n[i]))r.id=n[i].substring(1);else if(/^\./.test(n[i]))r["class"]?r["class"]=r["class"]+n[i].replace(/./," "):r["class"]=n[i].substring(1);else if(/\=/.test(n[i])){var s=n[i].split(/\=/);r[s[0]]=s[1]}return r},t.dialects.Maruku.block.document_meta=function(t,n){if(t.lineNumber>1)return undefined;if(!t.match(/^(?:\w+:.*\n)*\w+:.*$/))return undefined;h(this.tree)||this.tree.splice(1,0,{});var r=t.split(/\n/);for(p in r){var i=r[p].match(/(\w+):\s*(.*)$/),s=i[1].toLowerCase(),o=i[2];this.tree[1][s]=o}return[]},t.dialects.Maruku.block.block_meta=function(t,n){var r=t.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);if(!r)return undefined;var i=this.dialect.processMetaHash(r[2]),s;if(r[1]===""){var o=this.tree[this.tree.length-1];s=h(o);if(typeof o=="string")return undefined;s||(s={},o.splice(1,0,s));for(a in i)s[a]=i[a];return[]}var u=t.replace(/\n.*$/,""),f=this.processBlock(u,[]);s=h(f[0]),s||(s={},f[0].splice(1,0,s));for(a in i)s[a]=i[a];return f},t.dialects.Maruku.block.definition_list=function(t,n){var r=/^((?:[^\s:].*\n)+):\s+([\s\S]+)$/,i=["dl"],s,o;if(!(o=t.match(r)))return undefined;var u=[t];while(n.length&&r.exec(n[0]))u.push(n.shift());for(var a=0;a<u.length;++a){var o=u[a].match(r),f=o[1].replace(/\n$/,"").split(/\n/),l=o[2].split(/\n:\s+/);for(s=0;s<f.length;++s)i.push(["dt",f[s]]);for(s=0;s<l.length;++s)i.push(["dd"].concat(this.processInline(l[s].replace(/(\n)\s+/,"$1"))))}return[i]},t.dialects.Maruku.block.table=function b(e,t){var n=function(e,t){t=t||"\\s",t.match(/^[\\|\[\]{}?*.+^$]$/)&&(t="\\"+t);var n=[],r=new RegExp("^((?:\\\\.|[^\\\\"+t+"])*)"+t+"(.*)"),i;while(i=e.match(r))n.push(i[1]),e=i[2];return n.push(e),n},r=/^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/,i=/^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/,s,o;if(o=e.match(r))o[3]=o[3].replace(/^\s*\|/gm,"");else if(!(o=e.match(i)))return undefined;var b=["table",["thead",["tr"]],["tbody"]];o[2]=o[2].replace(/\|\s*$/,"").split("|");var u=[];l(o[2],function(e){e.match(/^\s*-+:\s*$/)?u.push({align:"right"}):e.match(/^\s*:-+\s*$/)?u.push({align:"left"}):e.match(/^\s*:-+:\s*$/)?u.push({align:"center"}):u.push({})}),o[1]=n(o[1].replace(/\|\s*$/,""),"|");for(s=0;s<o[1].length;s++)b[1][1].push(["th",u[s]||{}].concat(this.processInline(o[1][s].trim())));return l(o[3].replace(/\|\s*$/mg,"").split("\n"),function(e){var t=["tr"];e=n(e,"|");for(s=0;s<e.length;s++)t.push(["td",u[s]||{}].concat(this.processInline(e[s].trim())));b[2].push(t)},this),[b]},t.dialects.Maruku.inline["{:"]=function(t,n,r){if(!r.length)return[2,"{:"];var i=r[r.length-1];if(typeof i=="string")return[2,"{:"];var s=t.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);if(!s)return[2,"{:"];var o=this.dialect.processMetaHash(s[1]),u=h(i);u||(u={},i.splice(1,0,u));for(var a in o)u[a]=o[a];return[s[0].length,""]},t.dialects.Maruku.inline.__escape__=/^\\[\\`\*_{}\[\]()#\+.!\-|:]/,t.buildBlockOrder(t.dialects.Maruku.block),t.buildInlinePatterns(t.dialects.Maruku.inline);var f=Array.isArray||function(e){return Object.prototype.toString.call(e)=="[object Array]"},l;Array.prototype.forEach?l=function(e,t,n){return e.forEach(t,n)}:l=function(e,t,n){for(var r=0;r<e.length;r++)t.call(n||e,e[r],r,e)};var c=function(e){for(var t in e)if(hasOwnProperty.call(e,t))return!1;return!0};e.renderJsonML=function(e,t){t=t||{},t.root=t.root||!1;var n=[];if(t.root)n.push(v(e));else{e.shift(),e.length&&typeof e[0]=="object"&&!(e[0]instanceof Array)&&e.shift();while(e.length)n.push(v(e.shift()))}return n.join("\n\n")}}(function(){return typeof exports=="undefined"?(window.markdown={},window.markdown):exports}()),define("node_modules/markdown/lib/markdown",function(){}),define("require-tools/text/text!templates/preview_markdown.html",[],function(){return'<div class="tab-panel-body"></div>'}),define("views/preview_markdown",["settings","node_modules/markdown/lib/markdown","text!templates/preview_markdown.html","less!stylesheets/preview.less"],function(e,t,n){var r=monolith.require("hr/utils"),i=monolith.require("hr/dom"),s=monolith.require("core/box"),o=monolith.require("views/files/tab"),u=window.markdown,a=o.extend({className:"addon-files-previewviewer",templateLoader:"text",template:n,events:{},initialize:function(){a.__super__.initialize.apply(this,arguments);var t=this;return this.tab.menu.menuSection([{type:"action",title:"Refresh",shortcuts:["mod+r"],bindKeyboard:!0,action:function(){t.refresh()}}]),this.model.on("file:change:update",function(){e.user.get("refresh")&&t.refresh()},this),this.refresh(),this},refresh:function(){var e=this;this.model.download().then(function(t){e.$el.html("<div class='markdown'>"+u.toHTML(t)+"</div>")})}});return a}),define("client",["views/preview_html","views/preview_markdown"],function(e,t){var n=monolith.require("hr/utils"),r=monolith.require("core/files"),i=[".html",".htm"];r.addHandler("preview",{name:"HTML Preview",icon:"eye",position:10,View:e,valid:function(e){return!e.isDirectory()&&n.contains(i,e.extension())}});var s=[".md",".markdown",".txt"];r.addHandler("preview-markdown",{name:"Markdown Preview",icon:"eye",position:10,View:t,valid:function(e){return!e.isDirectory()&&n.contains(s,e.extension())}})}),function(e){var t=document,n="appendChild",r="styleSheet",i=t.createElement("style");i.type="text/css",t.getElementsByTagName("head")[0][n](i),i[r]?i[r].cssText=e:i[n](t.createTextNode(e))}(".addon-files-previewviewer{height:100%}.addon-files-previewviewer iframe,.addon-files-previewviewer .markdown{border:0;width:100%;height:100%;background-color:#fff}.addon-files-previewviewer .markdown{margin-top:1px;padding:3px}");