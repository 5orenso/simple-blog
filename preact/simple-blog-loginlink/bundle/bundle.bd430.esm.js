!function(e){function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(n){return e[n]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s="mdyV")}({A61a:function(e,n,t){"use strict";(function(e){function r(n){const{apiServer:t}=n,[r,i]=Object(_.b)({}),l=Object(_.a)((async()=>{await(async()=>{const e=await function({url:e,headers:n={},body:t={},settings:r={}}){const o={credentials:"omit",method:"GET",mode:"cors",cache:"default",headers:{}};r.jwtToken&&(o.headers={Authorization:`Bearer ${r.jwtToken}`});let _="";return"POST"===r.method||"PUT"===r.method||"PATCH"===r.method||"DELETE"===r.method?(o.method=r.method,o.body=JSON.stringify(t),o.headers["Content-Type"]="application/json"):_=u.a.stringify(t),fetch(`${r.apiServer}${e}${_?`?${_}`:""}`,o).then((e=>e)).then((e=>e.json())).catch((e=>{throw e}))}({url:"/api/send-magic-link",body:{},settings:{apiServer:t,method:"POST"}});i(e)})()}),[]);return Object(o.h)(e,null,200===r.status?Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-check text-success"})," ",r.title):Object(o.h)(e,null,Object(o.h)("button",{class:"btn btn-link btn-sm",onClick:l},"Send a magic link 🎩 to login.")))}t.d(n,"a",(function(){return r}));var o=t("hosL"),_=t("QRet"),i=t("UKnr"),u=t.n(i)}).call(this,t("hosL").Fragment)},MNOf:function(e){"use strict";function n(e,n){return Object.prototype.hasOwnProperty.call(e,n)}e.exports=function(e,r,o,_){o=o||"=";var i={};if("string"!=typeof e||0===e.length)return i;var u=/\+/g;e=e.split(r=r||"&");var l=1e3;_&&"number"==typeof _.maxKeys&&(l=_.maxKeys);var c=e.length;l>0&&c>l&&(c=l);for(var a=0;a<c;++a){var s,f,p,d,h=e[a].replace(u,"%20"),v=h.indexOf(o);v>=0?(s=h.substr(0,v),f=h.substr(v+1)):(s=h,f=""),p=decodeURIComponent(s),d=decodeURIComponent(f),n(i,p)?t(i[p])?i[p].push(d):i[p]=[i[p],d]:i[p]=d}return i};var t=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)}},QRet:function(e,n,t){"use strict";function r(e,n){h.options.__h&&h.options.__h(p,e,v||n),v=0;var t=p.__H||(p.__H={__:[],__h:[]});return e>=t.__.length&&t.__.push({}),t.__[e]}function o(e){return v=1,function(e,n,t){var o=r(f++,2);return o.t=e,o.__c||(o.__=[t?t(n):s(void 0,n),function(e){var n=o.t(o.__[0],e);o.__[0]!==n&&(o.__=[n,o.__[1]],o.__c.setState({}))}],o.__c=p),o.__}(s,e)}function _(e,n){var t=r(f++,7);return a(t.__H,n)&&(t.__=e(),t.__H=n,t.__h=e),t.__}function i(e,n){return v=8,_((function(){return e}),n)}function u(){y.forEach((function(e){if(e.__P)try{e.__H.__h.forEach(l),e.__H.__h.forEach(c),e.__H.__h=[]}catch(n){e.__H.__h=[],h.options.__e(n,e.__v)}})),y=[]}function l(e){var n=p;"function"==typeof e.__c&&e.__c(),p=n}function c(e){var n=p;e.__c=e.__(),p=n}function a(e,n){return!e||e.length!==n.length||n.some((function(n,t){return n!==e[t]}))}function s(e,n){return"function"==typeof n?n(e):n}t.d(n,"b",(function(){return o})),t.d(n,"a",(function(){return i}));var f,p,d,h=t("hosL"),v=0,y=[],m=h.options.__b,b=h.options.__r,g=h.options.diffed,k=h.options.__c,O=h.options.unmount;h.options.__b=function(e){p=null,m&&m(e)},h.options.__r=function(e){b&&b(e),f=0;var n=(p=e.__c).__H;n&&(n.__h.forEach(l),n.__h.forEach(c),n.__h=[])},h.options.diffed=function(e){g&&g(e);var n=e.__c;n&&n.__H&&n.__H.__h.length&&(1!==y.push(n)&&d===h.options.requestAnimationFrame||((d=h.options.requestAnimationFrame)||function(e){var n,t=function(){clearTimeout(r),C&&cancelAnimationFrame(n),setTimeout(e)},r=setTimeout(t,100);C&&(n=requestAnimationFrame(t))})(u)),p=void 0},h.options.__c=function(e,n){n.some((function(e){try{e.__h.forEach(l),e.__h=e.__h.filter((function(e){return!e.__||c(e)}))}catch(t){n.some((function(e){e.__h&&(e.__h=[])})),n=[],h.options.__e(t,e.__v)}})),k&&k(e,n)},h.options.unmount=function(e){O&&O(e);var n=e.__c;if(n&&n.__H)try{n.__H.__.forEach(l)}catch(e){h.options.__e(e,n.__v)}};var C="function"==typeof requestAnimationFrame},QfWi:function(e,n,t){"use strict";function r(){return(r=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e}).apply(this,arguments)}t.r(n);var o=t("hosL"),_=function(e){var n,t=e.selector,r=e.inline,o=e.clientSpecified,_=[],i=document.currentScript||(n=document.getElementsByTagName("script"))[n.length-1];!0===r&&_.push(i.parentNode);return!0!==o||t||(t=function(e){var n=e.attributes,t=null;return Object.keys(n).forEach((function(e){n.hasOwnProperty(e)&&"data-mount-in"===n[e].name&&(t=n[e].nodeValue)})),t}(i)),t&&[].forEach.call(document.querySelectorAll(t),(function(e){_.push(e)})),_},i=function(e,n,t,_,i){n.forEach((function(n){var u=n;if(!u._habitat){u._habitat=!0;var l=function(e,n){void 0===n&&(n={});var t=e.attributes,o=r({},n);return Object.keys(t).forEach((function(e){if(t.hasOwnProperty(e)){var n=t[e].name;if(!n||"string"!=typeof n)return!1;var r=n.split(/(data-props?-)/).pop()||"";n!==(r=r.replace(/-([a-z])/gi,(function(e,n){return n.toUpperCase()})))&&(o[r]=t[e].nodeValue)}})),[].forEach.call(e.getElementsByTagName("script"),(function(e){var n={};if(e.hasAttribute("type")){if("text/props"!==e.getAttribute("type")&&"application/json"!==e.getAttribute("type"))return;try{n=JSON.parse(e.innerHTML)}catch(e){throw new Error(e)}r(o,n)}})),o}(n,i)||i;return _&&(u.innerHTML=""),Object(o.render)(Object(o.h)(e,l),u,t)}}))};(function(e){var n=e;return{render:function(e){void 0===e&&(e={});var t=e.selector;void 0===t&&(t=null);var r=e.inline;void 0===r&&(r=!1);var o=e.clean;void 0===o&&(o=!1);var u=e.clientSpecified;void 0===u&&(u=!1);var l=e.defaultProps;void 0===l&&(l={});var c=_({selector:t,inline:r,clientSpecified:u}),a=function(){if(c.length>0){var e=_({selector:t,inline:r,clientSpecified:u});return i(n,e,null,o,l)}};a(),document.addEventListener("DOMContentLoaded",a),document.addEventListener("load",a)}}})(t("A61a").a).render({selector:'[data-widget-host="simple-blog-loginlink"]',clean:!0})},THQi:function(e){"use strict";function n(e,n){if(e.map)return e.map(n);for(var t=[],r=0;r<e.length;r++)t.push(n(e[r],r));return t}var t=function(e){switch(typeof e){case"string":return e;case"boolean":return e?"true":"false";case"number":return isFinite(e)?e:"";default:return""}};e.exports=function(e,_,i,u){return _=_||"&",i=i||"=",null===e&&(e=void 0),"object"==typeof e?n(o(e),(function(o){var u=encodeURIComponent(t(o))+i;return r(e[o])?n(e[o],(function(e){return u+encodeURIComponent(t(e))})).join(_):u+encodeURIComponent(t(e[o]))})).join(_):u?encodeURIComponent(t(u))+i+encodeURIComponent(t(e)):""};var r=Array.isArray||function(e){return"[object Array]"===Object.prototype.toString.call(e)},o=Object.keys||function(e){var n=[];for(var t in e)Object.prototype.hasOwnProperty.call(e,t)&&n.push(t);return n}},UKnr:function(e,n,t){"use strict";n.decode=n.parse=t("MNOf"),n.encode=n.stringify=t("THQi")},hosL:function(e,n,t){"use strict";function r(e,n){for(var t in n)e[t]=n[t];return e}function o(e){var n=e.parentNode;n&&n.removeChild(e)}function _(e,n,t){var r,o,_,u={};for(_ in n)"key"==_?r=n[_]:"ref"==_?o=n[_]:u[_]=n[_];if(arguments.length>2&&(u.children=arguments.length>3?U.call(arguments,2):t),"function"==typeof e&&null!=e.defaultProps)for(_ in e.defaultProps)void 0===u[_]&&(u[_]=e.defaultProps[_]);return i(e,u,r,o,null)}function i(e,n,t,r,o){var _={type:e,props:n,key:t,ref:r,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==o?++L:o};return null!=H.vnode&&H.vnode(_),_}function u(){return{current:null}}function l(e){return e.children}function c(e,n){this.props=e,this.context=n}function a(e,n){if(null==n)return e.__?a(e.__,e.__.__k.indexOf(e)+1):null;for(var t;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e)return t.__e;return"function"==typeof e.type?a(e):null}function s(e){var n,t;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e){e.__e=e.__c.base=t.__e;break}return s(e)}}function f(e){(!e.__d&&(e.__d=!0)&&D.push(e)&&!p.__r++||R!==H.debounceRendering)&&((R=H.debounceRendering)||N)(p)}function p(){for(var e;p.__r=D.length;)e=D.sort((function(e,n){return e.__v.__b-n.__v.__b})),D=[],e.some((function(e){var n,t,o,_,i,u;e.__d&&(i=(_=(n=e).__v).__e,(u=n.__P)&&(t=[],(o=r({},_)).__v=_.__v+1,O(u,_,o,n.__n,void 0!==u.ownerSVGElement,null!=_.__h?[i]:null,t,null==i?a(_):i,_.__h),C(t,_),_.__e!=i&&s(_)))}))}function d(e,n,t,r,o,_,u,c,s,f){var p,d,v,m,b,g,k,C=r&&r.__k||W,S=C.length;for(t.__k=[],p=0;p<n.length;p++)if(null!=(m=t.__k[p]=null==(m=n[p])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m||"bigint"==typeof m?i(null,m,null,null,m):Array.isArray(m)?i(l,{children:m},null,null,null):m.__b>0?i(m.type,m.props,m.key,null,m.__v):m)){if(m.__=t,m.__b=t.__b+1,null===(v=C[p])||v&&m.key==v.key&&m.type===v.type)C[p]=void 0;else for(d=0;d<S;d++){if((v=C[d])&&m.key==v.key&&m.type===v.type){C[d]=void 0;break}v=null}O(e,m,v=v||F,o,_,u,c,s,f),b=m.__e,(d=m.ref)&&v.ref!=d&&(k||(k=[]),v.ref&&k.push(v.ref,null,m),k.push(d,m.__c||b,m)),null!=b?(null==g&&(g=b),"function"==typeof m.type&&null!=m.__k&&m.__k===v.__k?m.__d=s=h(m,s,e):s=y(e,m,v,C,b,s),f||"option"!==t.type?"function"==typeof t.type&&(t.__d=s):e.value=""):s&&v.__e==s&&s.parentNode!=e&&(s=a(v))}for(t.__e=g,p=S;p--;)null!=C[p]&&("function"==typeof t.type&&null!=C[p].__e&&C[p].__e==t.__d&&(t.__d=a(r,p+1)),j(C[p],C[p]));if(k)for(p=0;p<k.length;p++)E(k[p],k[++p],k[++p])}function h(e,n,t){var r,o;for(r=0;r<e.__k.length;r++)(o=e.__k[r])&&(o.__=e,n="function"==typeof o.type?h(o,n,t):y(t,o,o,e.__k,o.__e,n));return n}function v(e,n){return n=n||[],null==e||"boolean"==typeof e||(Array.isArray(e)?e.some((function(e){v(e,n)})):n.push(e)),n}function y(e,n,t,r,o,_){var i,u,l;if(void 0!==n.__d)i=n.__d,n.__d=void 0;else if(null==t||o!=_||null==o.parentNode)e:if(null==_||_.parentNode!==e)e.appendChild(o),i=null;else{for(u=_,l=0;(u=u.nextSibling)&&l<r.length;l+=2)if(u==o)break e;e.insertBefore(o,_),i=_}return void 0!==i?i:o.nextSibling}function m(e,n,t){"-"===n[0]?e.setProperty(n,t):e[n]=null==t?"":"number"!=typeof t||$.test(n)?t:t+"px"}function b(e,n,t,r,o){var _;e:if("style"===n)if("string"==typeof t)e.style.cssText=t;else{if("string"==typeof r&&(e.style.cssText=r=""),r)for(n in r)t&&n in t||m(e.style,n,"");if(t)for(n in t)r&&t[n]===r[n]||m(e.style,n,t[n])}else if("o"===n[0]&&"n"===n[1])_=n!==(n=n.replace(/Capture$/,"")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+_]=t,t?r||e.addEventListener(n,_?k:g,_):e.removeEventListener(n,_?k:g,_);else if("dangerouslySetInnerHTML"!==n){if(o)n=n.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==n&&"list"!==n&&"form"!==n&&"tabIndex"!==n&&"download"!==n&&n in e)try{e[n]=null==t?"":t;break e}catch(e){}"function"==typeof t||(null!=t&&(!1!==t||"a"===n[0]&&"r"===n[1])?e.setAttribute(n,t):e.removeAttribute(n))}}function g(e){this.l[e.type+!1](H.event?H.event(e):e)}function k(e){this.l[e.type+!0](H.event?H.event(e):e)}function O(e,n,t,o,_,i,u,a,s){var f,p,h,v,y,m,b,g,k,O,C,E=n.type;if(void 0!==n.constructor)return null;null!=t.__h&&(s=t.__h,a=n.__e=t.__e,n.__h=null,i=[a]),(f=H.__b)&&f(n);try{e:if("function"==typeof E){if(g=n.props,k=(f=E.contextType)&&o[f.__c],O=f?k?k.props.value:f.__:o,t.__c?b=(p=n.__c=t.__c).__=p.__E:("prototype"in E&&E.prototype.render?n.__c=p=new E(g,O):(n.__c=p=new c(g,O),p.constructor=E,p.render=T),k&&k.sub(p),p.props=g,p.state||(p.state={}),p.context=O,p.__n=o,h=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=E.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=r({},p.__s)),r(p.__s,E.getDerivedStateFromProps(g,p.__s))),v=p.props,y=p.state,h)null==E.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==E.getDerivedStateFromProps&&g!==v&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(g,O),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(g,p.__s,O)||n.__v===t.__v){p.props=g,p.state=p.__s,n.__v!==t.__v&&(p.__d=!1),p.__v=n,n.__e=t.__e,n.__k=t.__k,n.__k.forEach((function(e){e&&(e.__=n)})),p.__h.length&&u.push(p);break e}null!=p.componentWillUpdate&&p.componentWillUpdate(g,p.__s,O),null!=p.componentDidUpdate&&p.__h.push((function(){p.componentDidUpdate(v,y,m)}))}p.context=O,p.props=g,p.state=p.__s,(f=H.__r)&&f(n),p.__d=!1,p.__v=n,p.__P=e,f=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(o=r(r({},o),p.getChildContext())),h||null==p.getSnapshotBeforeUpdate||(m=p.getSnapshotBeforeUpdate(v,y)),C=null!=f&&f.type===l&&null==f.key?f.props.children:f,d(e,Array.isArray(C)?C:[C],n,t,o,_,i,u,a,s),p.base=n.__e,n.__h=null,p.__h.length&&u.push(p),b&&(p.__E=p.__=null),p.__e=!1}else null==i&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=S(t.__e,n,t,o,_,i,u,s);(f=H.diffed)&&f(n)}catch(e){n.__v=null,(s||null!=i)&&(n.__e=a,n.__h=!!s,i[i.indexOf(a)]=null),H.__e(e,n,t)}}function C(e,n){H.__c&&H.__c(n,e),e.some((function(n){try{e=n.__h,n.__h=[],e.some((function(e){e.call(n)}))}catch(e){H.__e(e,n.__v)}}))}function S(e,n,t,r,_,i,u,l){var c,s,f,p=t.props,h=n.props,v=n.type,y=0;if("svg"===v&&(_=!0),null!=i)for(;y<i.length;y++)if((c=i[y])&&(c===e||(v?c.localName==v:3==c.nodeType))){e=c,i[y]=null;break}if(null==e){if(null===v)return document.createTextNode(h);e=_?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,h.is&&h),i=null,l=!1}if(null===v)p===h||l&&e.data===h||(e.data=h);else{if(i=i&&U.call(e.childNodes),s=(p=t.props||F).dangerouslySetInnerHTML,f=h.dangerouslySetInnerHTML,!l){if(null!=i)for(p={},y=0;y<e.attributes.length;y++)p[e.attributes[y].name]=e.attributes[y].value;(f||s)&&(f&&(s&&f.__html==s.__html||f.__html===e.innerHTML)||(e.innerHTML=f&&f.__html||""))}if(function(e,n,t,r,o){var _;for(_ in t)"children"===_||"key"===_||_ in n||b(e,_,null,t[_],r);for(_ in n)o&&"function"!=typeof n[_]||"children"===_||"key"===_||"value"===_||"checked"===_||t[_]===n[_]||b(e,_,n[_],t[_],r)}(e,h,p,_,l),f)n.__k=[];else if(y=n.props.children,d(e,Array.isArray(y)?y:[y],n,t,r,_&&"foreignObject"!==v,i,u,i?i[0]:t.__k&&a(t,0),l),null!=i)for(y=i.length;y--;)null!=i[y]&&o(i[y]);l||("value"in h&&void 0!==(y=h.value)&&(y!==e.value||"progress"===v&&!y)&&b(e,"value",y,p.value,!1),"checked"in h&&void 0!==(y=h.checked)&&y!==e.checked&&b(e,"checked",y,p.checked,!1))}return e}function E(e,n,t){try{"function"==typeof e?e(n):e.current=n}catch(e){H.__e(e,t)}}function j(e,n,t){var r,_;if(H.unmount&&H.unmount(e),(r=e.ref)&&(r.current&&r.current!==e.__e||E(r,null,n)),null!=(r=e.__c)){if(r.componentWillUnmount)try{r.componentWillUnmount()}catch(e){H.__e(e,n)}r.base=r.__P=null}if(r=e.__k)for(_=0;_<r.length;_++)r[_]&&j(r[_],n,"function"!=typeof e.type);t||null==e.__e||o(e.__e),e.__e=e.__d=void 0}function T(e,n,t){return this.constructor(e,t)}function x(e,n,t){var r,o,i;H.__&&H.__(e,n),o=(r="function"==typeof t)?null:t&&t.__k||n.__k,i=[],O(n,e=(!r&&t||n).__k=_(l,null,[e]),o||F,F,void 0!==n.ownerSVGElement,!r&&t?[t]:o?null:n.firstChild?U.call(n.childNodes):null,i,!r&&t?t:o?o.__e:n.firstChild,r),C(i,e)}function A(e,n){x(e,n,A)}function P(e,n,t){var o,_,u,l=r({},e.props);for(u in n)"key"==u?o=n[u]:"ref"==u?_=n[u]:l[u]=n[u];return arguments.length>2&&(l.children=arguments.length>3?U.call(arguments,2):t),i(e.type,l,o||e.key,_||e.ref,null)}function w(e,n){var t={__c:n="__cC"+I++,__:e,Consumer:function(e,n){return e.children(n)},Provider:function(e){var t,r;return this.getChildContext||(t=[],(r={})[n]=this,this.getChildContext=function(){return r},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&t.some(f)},this.sub=function(e){t.push(e);var n=e.componentWillUnmount;e.componentWillUnmount=function(){t.splice(t.indexOf(e),1),n&&n.call(e)}}),e.children}};return t.Provider.__=t.Consumer.contextType=t}t.r(n),t.d(n,"render",(function(){return x})),t.d(n,"hydrate",(function(){return A})),t.d(n,"createElement",(function(){return _})),t.d(n,"h",(function(){return _})),t.d(n,"Fragment",(function(){return l})),t.d(n,"createRef",(function(){return u})),t.d(n,"isValidElement",(function(){return M})),t.d(n,"Component",(function(){return c})),t.d(n,"cloneElement",(function(){return P})),t.d(n,"createContext",(function(){return w})),t.d(n,"toChildArray",(function(){return v})),t.d(n,"options",(function(){return H}));var U,H,L,M,D,N,R,I,F={},W=[],$=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;U=W.slice,H={__e:function(e,n){for(var t,r,o;n=n.__;)if((t=n.__c)&&!t.__)try{if((r=t.constructor)&&null!=r.getDerivedStateFromError&&(t.setState(r.getDerivedStateFromError(e)),o=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(e),o=t.__d),o)return t.__E=t}catch(n){e=n}throw e}},L=0,M=function(e){return null!=e&&void 0===e.constructor},c.prototype.setState=function(e,n){var t;t=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=r({},this.state),"function"==typeof e&&(e=e(r({},t),this.props)),e&&r(t,e),null!=e&&this.__v&&(n&&this.__h.push(n),f(this))},c.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),f(this))},c.prototype.render=l,D=[],N="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,p.__r=0,I=0},mdyV:function(e,n,t){"use strict";t.r(n);var r=t("hosL");const{h:o,render:_,hydrate:i}=r,u=e=>e&&e.default?e.default:e;if("function"==typeof u(t("QfWi"))){let e=document.getElementById("preact_root")||document.body.firstElementChild;0,(()=>{let n=u(t("QfWi")),r={};const i=document.querySelector('[type="__PREACT_CLI_DATA__"]');i&&(r=JSON.parse(decodeURI(i.innerHTML)).preRenderData||r);r.url&&(l=r.url);var l;e=_(o(n,{CLI_DATA:{preRenderData:r}}),document.body,e)})()}}});
//# sourceMappingURL=bundle.bd430.esm.js.map