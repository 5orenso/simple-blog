!function(e){function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}var t={};n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(n){return e[n]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s="mdyV")}({QfWi:function(e,n,t){"use strict";function o(){return(o=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&(e[o]=t[o])}return e}).apply(this,arguments)}function r(e,n){v.options.__h&&v.options.__h(d,e,b||n),b=0;var t=d.__H||(d.__H={__:[],__h:[]});return e>=t.__.length&&t.__.push({}),t.__[e]}function _(e){return b=1,function(e,n,t){var o=r(p++,2);return o.t=e,o.__c||(o.__=[t?t(n):a(void 0,n),function(e){var n=o.t(o.__[0],e);o.__[0]!==n&&(o.__=[n,o.__[1]],o.__c.setState({}))}],o.__c=d),o.__}(a,e)}function i(e,n){var t=r(p++,3);!v.options.__s&&f(t.__H,n)&&(t.__=e,t.__H=n,d.__H.__h.push(t))}function l(){k.forEach((function(e){if(e.__P)try{e.__H.__h.forEach(u),e.__H.__h.forEach(c),e.__H.__h=[]}catch(n){e.__H.__h=[],v.options.__e(n,e.__v)}})),k=[]}function u(e){var n=d;"function"==typeof e.__c&&e.__c(),d=n}function c(e){var n=d;e.__c=e.__(),d=n}function f(e,n){return!e||e.length!==n.length||n.some((function(n,t){return n!==e[t]}))}function a(e,n){return"function"==typeof n?n(e):n}function s(e){let n=String(e);return 1===n.length&&(n=`0${n}`),n}t.r(n);var p,d,h,v=t("hosL"),y=function(e){var n,t=e.selector,o=e.inline,r=e.clientSpecified,_=[],i=document.currentScript||(n=document.getElementsByTagName("script"))[n.length-1];!0===o&&_.push(i.parentNode);return!0!==r||t||(t=function(e){var n=e.attributes,t=null;return Object.keys(n).forEach((function(e){n.hasOwnProperty(e)&&"data-mount-in"===n[e].name&&(t=n[e].nodeValue)})),t}(i)),t&&[].forEach.call(document.querySelectorAll(t),(function(e){_.push(e)})),_},m=function(e,n,t,r,_){n.forEach((function(n){var i=n;if(!i._habitat){i._habitat=!0;var l=function(e,n){void 0===n&&(n={});var t=e.attributes,r=o({},n);return Object.keys(t).forEach((function(e){if(t.hasOwnProperty(e)){var n=t[e].name;if(!n||"string"!=typeof n)return!1;var o=n.split(/(data-props?-)/).pop()||"";n!==(o=o.replace(/-([a-z])/gi,(function(e,n){return n.toUpperCase()})))&&(r[o]=t[e].nodeValue)}})),[].forEach.call(e.getElementsByTagName("script"),(function(e){var n={};if(e.hasAttribute("type")){if("text/props"!==e.getAttribute("type")&&"application/json"!==e.getAttribute("type"))return;try{n=JSON.parse(e.innerHTML)}catch(e){throw new Error(e)}o(r,n)}})),r}(n,_)||_;return r&&(i.innerHTML=""),Object(v.render)(Object(v.h)(e,l),i,t)}}))},g=function(e){var n=e;return{render:function(e){void 0===e&&(e={});var t=e.selector;void 0===t&&(t=null);var o=e.inline;void 0===o&&(o=!1);var r=e.clean;void 0===r&&(r=!1);var _=e.clientSpecified;void 0===_&&(_=!1);var i=e.defaultProps;void 0===i&&(i={});var l=y({selector:t,inline:o,clientSpecified:_}),u=function(){if(l.length>0){var e=y({selector:t,inline:o,clientSpecified:_});return m(n,e,null,r,i)}};u(),document.addEventListener("DOMContentLoaded",u),document.addEventListener("load",u)}}},b=0,k=[],E=v.options.__b,S=v.options.__r,C=v.options.diffed,w=v.options.__c,x=v.options.unmount;v.options.__b=function(e){d=null,E&&E(e)},v.options.__r=function(e){S&&S(e),p=0;var n=(d=e.__c).__H;n&&(n.__h.forEach(u),n.__h.forEach(c),n.__h=[])},v.options.diffed=function(e){C&&C(e);var n=e.__c;n&&n.__H&&n.__H.__h.length&&(1!==k.push(n)&&h===v.options.requestAnimationFrame||((h=v.options.requestAnimationFrame)||function(e){var n,t=function(){clearTimeout(o),O&&cancelAnimationFrame(n),setTimeout(e)},o=setTimeout(t,100);O&&(n=requestAnimationFrame(t))})(l)),d=void 0},v.options.__c=function(e,n){n.some((function(e){try{e.__h.forEach(u),e.__h=e.__h.filter((function(e){return!e.__||c(e)}))}catch(t){n.some((function(e){e.__h&&(e.__h=[])})),n=[],v.options.__e(t,e.__v)}})),w&&w(e,n)},v.options.unmount=function(e){x&&x(e);var n=e.__c;if(n&&n.__H)try{n.__H.__.forEach(u)}catch(e){v.options.__e(e,n.__v)}};var O="function"==typeof requestAnimationFrame;g((function(e){const{countdownto:n,showDateOnly:t=!1,showSeconds:o=!0,showTimezone:r=!1}=e,l=()=>{(new Date).getFullYear();const e=+new Date(`${n}`)-+new Date;let t={};return e>0&&(t={d:Math.floor(e/864e5),h:Math.floor(e/36e5%24),m:Math.floor(e/1e3/60%60),s:Math.floor(e/1e3%60)}),t},u=()=>{const e=new Date,n=e.getMonth()+1,_=e.getDate(),i=e.getFullYear(),l=e.getHours(),u=e.getMinutes(),c=e.getSeconds(),f=-e.getTimezoneOffset(),a=f>=0?"+":"-";let p=`${s(i)}-${s(n)}-${s(_)}`;return t||(p+=` ${s(l)}:${s(u)}`,o&&(p+=`:${s(c)}`),r&&(p+=`${a}${f}`)),p},[c,f]=_(l()),[a,p]=_(u()),d=[];return n?(i((()=>{setTimeout((()=>{f(l())}),1e3)})),Object.keys(c).forEach((e=>{c[e]&&d.push(Object(v.h)("span",null,c[e],Object(v.h)("span",{class:"text-muted font-weight-lighter"},e)," "))}))):i((()=>{setTimeout((()=>{p(u())}),1e3)})),Object(v.h)("div",null,d.length?d:Object(v.h)("span",null,a))})).render({selector:'[data-widget-host="simple-blog-clock"]',clean:!0})},hosL:function(e,n,t){"use strict";function o(e,n){for(var t in n)e[t]=n[t];return e}function r(e){var n=e.parentNode;n&&n.removeChild(e)}function _(e,n,t){var o,r,_,l={};for(_ in n)"key"==_?o=n[_]:"ref"==_?r=n[_]:l[_]=n[_];if(arguments.length>2&&(l.children=arguments.length>3?D.call(arguments,2):t),"function"==typeof e&&null!=e.defaultProps)for(_ in e.defaultProps)void 0===l[_]&&(l[_]=e.defaultProps[_]);return i(e,l,o,r,null)}function i(e,n,t,o,r){var _={type:e,props:n,key:t,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,__h:null,constructor:void 0,__v:null==r?++j:r};return null!=M.vnode&&M.vnode(_),_}function l(){return{current:null}}function u(e){return e.children}function c(e,n){this.props=e,this.context=n}function f(e,n){if(null==n)return e.__?f(e.__,e.__.__k.indexOf(e)+1):null;for(var t;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e)return t.__e;return"function"==typeof e.type?f(e):null}function a(e){var n,t;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,n=0;n<e.__k.length;n++)if(null!=(t=e.__k[n])&&null!=t.__e){e.__e=e.__c.base=t.__e;break}return a(e)}}function s(e){(!e.__d&&(e.__d=!0)&&U.push(e)&&!p.__r++||F!==M.debounceRendering)&&((F=M.debounceRendering)||N)(p)}function p(){for(var e;p.__r=U.length;)e=U.sort((function(e,n){return e.__v.__b-n.__v.__b})),U=[],e.some((function(e){var n,t,r,_,i,l;e.__d&&(i=(_=(n=e).__v).__e,(l=n.__P)&&(t=[],(r=o({},_)).__v=_.__v+1,E(l,_,r,n.__n,void 0!==l.ownerSVGElement,null!=_.__h?[i]:null,t,null==i?f(_):i,_.__h),S(t,_),_.__e!=i&&a(_)))}))}function d(e,n,t,o,r,_,l,c,a,s){var p,d,v,m,g,b,k,S=o&&o.__k||R,C=S.length;for(t.__k=[],p=0;p<n.length;p++)if(null!=(m=t.__k[p]=null==(m=n[p])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m||"bigint"==typeof m?i(null,m,null,null,m):Array.isArray(m)?i(u,{children:m},null,null,null):m.__b>0?i(m.type,m.props,m.key,null,m.__v):m)){if(m.__=t,m.__b=t.__b+1,null===(v=S[p])||v&&m.key==v.key&&m.type===v.type)S[p]=void 0;else for(d=0;d<C;d++){if((v=S[d])&&m.key==v.key&&m.type===v.type){S[d]=void 0;break}v=null}E(e,m,v=v||$,r,_,l,c,a,s),g=m.__e,(d=m.ref)&&v.ref!=d&&(k||(k=[]),v.ref&&k.push(v.ref,null,m),k.push(d,m.__c||g,m)),null!=g?(null==b&&(b=g),"function"==typeof m.type&&null!=m.__k&&m.__k===v.__k?m.__d=a=h(m,a,e):a=y(e,m,v,S,g,a),s||"option"!==t.type?"function"==typeof t.type&&(t.__d=a):e.value=""):a&&v.__e==a&&a.parentNode!=e&&(a=f(v))}for(t.__e=b,p=C;p--;)null!=S[p]&&("function"==typeof t.type&&null!=S[p].__e&&S[p].__e==t.__d&&(t.__d=f(o,p+1)),x(S[p],S[p]));if(k)for(p=0;p<k.length;p++)w(k[p],k[++p],k[++p])}function h(e,n,t){var o,r;for(o=0;o<e.__k.length;o++)(r=e.__k[o])&&(r.__=e,n="function"==typeof r.type?h(r,n,t):y(t,r,r,e.__k,r.__e,n));return n}function v(e,n){return n=n||[],null==e||"boolean"==typeof e||(Array.isArray(e)?e.some((function(e){v(e,n)})):n.push(e)),n}function y(e,n,t,o,r,_){var i,l,u;if(void 0!==n.__d)i=n.__d,n.__d=void 0;else if(null==t||r!=_||null==r.parentNode)e:if(null==_||_.parentNode!==e)e.appendChild(r),i=null;else{for(l=_,u=0;(l=l.nextSibling)&&u<o.length;u+=2)if(l==r)break e;e.insertBefore(r,_),i=_}return void 0!==i?i:r.nextSibling}function m(e,n,t){"-"===n[0]?e.setProperty(n,t):e[n]=null==t?"":"number"!=typeof t||I.test(n)?t:t+"px"}function g(e,n,t,o,r){var _;e:if("style"===n)if("string"==typeof t)e.style.cssText=t;else{if("string"==typeof o&&(e.style.cssText=o=""),o)for(n in o)t&&n in t||m(e.style,n,"");if(t)for(n in t)o&&t[n]===o[n]||m(e.style,n,t[n])}else if("o"===n[0]&&"n"===n[1])_=n!==(n=n.replace(/Capture$/,"")),n=n.toLowerCase()in e?n.toLowerCase().slice(2):n.slice(2),e.l||(e.l={}),e.l[n+_]=t,t?o||e.addEventListener(n,_?k:b,_):e.removeEventListener(n,_?k:b,_);else if("dangerouslySetInnerHTML"!==n){if(r)n=n.replace(/xlink[H:h]/,"h").replace(/sName$/,"s");else if("href"!==n&&"list"!==n&&"form"!==n&&"tabIndex"!==n&&"download"!==n&&n in e)try{e[n]=null==t?"":t;break e}catch(e){}"function"==typeof t||(null!=t&&(!1!==t||"a"===n[0]&&"r"===n[1])?e.setAttribute(n,t):e.removeAttribute(n))}}function b(e){this.l[e.type+!1](M.event?M.event(e):e)}function k(e){this.l[e.type+!0](M.event?M.event(e):e)}function E(e,n,t,r,_,i,l,f,a){var s,p,h,v,y,m,g,b,k,E,S,w=n.type;if(void 0!==n.constructor)return null;null!=t.__h&&(a=t.__h,f=n.__e=t.__e,n.__h=null,i=[f]),(s=M.__b)&&s(n);try{e:if("function"==typeof w){if(b=n.props,k=(s=w.contextType)&&r[s.__c],E=s?k?k.props.value:s.__:r,t.__c?g=(p=n.__c=t.__c).__=p.__E:("prototype"in w&&w.prototype.render?n.__c=p=new w(b,E):(n.__c=p=new c(b,E),p.constructor=w,p.render=O),k&&k.sub(p),p.props=b,p.state||(p.state={}),p.context=E,p.__n=r,h=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=w.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=o({},p.__s)),o(p.__s,w.getDerivedStateFromProps(b,p.__s))),v=p.props,y=p.state,h)null==w.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==w.getDerivedStateFromProps&&b!==v&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(b,E),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(b,p.__s,E)||n.__v===t.__v){p.props=b,p.state=p.__s,n.__v!==t.__v&&(p.__d=!1),p.__v=n,n.__e=t.__e,n.__k=t.__k,n.__k.forEach((function(e){e&&(e.__=n)})),p.__h.length&&l.push(p);break e}null!=p.componentWillUpdate&&p.componentWillUpdate(b,p.__s,E),null!=p.componentDidUpdate&&p.__h.push((function(){p.componentDidUpdate(v,y,m)}))}p.context=E,p.props=b,p.state=p.__s,(s=M.__r)&&s(n),p.__d=!1,p.__v=n,p.__P=e,s=p.render(p.props,p.state,p.context),p.state=p.__s,null!=p.getChildContext&&(r=o(o({},r),p.getChildContext())),h||null==p.getSnapshotBeforeUpdate||(m=p.getSnapshotBeforeUpdate(v,y)),S=null!=s&&s.type===u&&null==s.key?s.props.children:s,d(e,Array.isArray(S)?S:[S],n,t,r,_,i,l,f,a),p.base=n.__e,n.__h=null,p.__h.length&&l.push(p),g&&(p.__E=p.__=null),p.__e=!1}else null==i&&n.__v===t.__v?(n.__k=t.__k,n.__e=t.__e):n.__e=C(t.__e,n,t,r,_,i,l,a);(s=M.diffed)&&s(n)}catch(e){n.__v=null,(a||null!=i)&&(n.__e=f,n.__h=!!a,i[i.indexOf(f)]=null),M.__e(e,n,t)}}function S(e,n){M.__c&&M.__c(n,e),e.some((function(n){try{e=n.__h,n.__h=[],e.some((function(e){e.call(n)}))}catch(e){M.__e(e,n.__v)}}))}function C(e,n,t,o,_,i,l,u){var c,a,s,p=t.props,h=n.props,v=n.type,y=0;if("svg"===v&&(_=!0),null!=i)for(;y<i.length;y++)if((c=i[y])&&(c===e||(v?c.localName==v:3==c.nodeType))){e=c,i[y]=null;break}if(null==e){if(null===v)return document.createTextNode(h);e=_?document.createElementNS("http://www.w3.org/2000/svg",v):document.createElement(v,h.is&&h),i=null,u=!1}if(null===v)p===h||u&&e.data===h||(e.data=h);else{if(i=i&&D.call(e.childNodes),a=(p=t.props||$).dangerouslySetInnerHTML,s=h.dangerouslySetInnerHTML,!u){if(null!=i)for(p={},y=0;y<e.attributes.length;y++)p[e.attributes[y].name]=e.attributes[y].value;(s||a)&&(s&&(a&&s.__html==a.__html||s.__html===e.innerHTML)||(e.innerHTML=s&&s.__html||""))}if(function(e,n,t,o,r){var _;for(_ in t)"children"===_||"key"===_||_ in n||g(e,_,null,t[_],o);for(_ in n)r&&"function"!=typeof n[_]||"children"===_||"key"===_||"value"===_||"checked"===_||t[_]===n[_]||g(e,_,n[_],t[_],o)}(e,h,p,_,u),s)n.__k=[];else if(y=n.props.children,d(e,Array.isArray(y)?y:[y],n,t,o,_&&"foreignObject"!==v,i,l,i?i[0]:t.__k&&f(t,0),u),null!=i)for(y=i.length;y--;)null!=i[y]&&r(i[y]);u||("value"in h&&void 0!==(y=h.value)&&(y!==e.value||"progress"===v&&!y)&&g(e,"value",y,p.value,!1),"checked"in h&&void 0!==(y=h.checked)&&y!==e.checked&&g(e,"checked",y,p.checked,!1))}return e}function w(e,n,t){try{"function"==typeof e?e(n):e.current=n}catch(e){M.__e(e,t)}}function x(e,n,t){var o,_;if(M.unmount&&M.unmount(e),(o=e.ref)&&(o.current&&o.current!==e.__e||w(o,null,n)),null!=(o=e.__c)){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(e){M.__e(e,n)}o.base=o.__P=null}if(o=e.__k)for(_=0;_<o.length;_++)o[_]&&x(o[_],n,"function"!=typeof e.type);t||null==e.__e||r(e.__e),e.__e=e.__d=void 0}function O(e,n,t){return this.constructor(e,t)}function P(e,n,t){var o,r,i;M.__&&M.__(e,n),r=(o="function"==typeof t)?null:t&&t.__k||n.__k,i=[],E(n,e=(!o&&t||n).__k=_(u,null,[e]),r||$,$,void 0!==n.ownerSVGElement,!o&&t?[t]:r?null:n.firstChild?D.call(n.childNodes):null,i,!o&&t?t:r?r.__e:n.firstChild,o),S(i,e)}function T(e,n){P(e,n,T)}function A(e,n,t){var r,_,l,u=o({},e.props);for(l in n)"key"==l?r=n[l]:"ref"==l?_=n[l]:u[l]=n[l];return arguments.length>2&&(u.children=arguments.length>3?D.call(arguments,2):t),i(e.type,u,r||e.key,_||e.ref,null)}function H(e,n){var t={__c:n="__cC"+W++,__:e,Consumer:function(e,n){return e.children(n)},Provider:function(e){var t,o;return this.getChildContext||(t=[],(o={})[n]=this,this.getChildContext=function(){return o},this.shouldComponentUpdate=function(e){this.props.value!==e.value&&t.some(s)},this.sub=function(e){t.push(e);var n=e.componentWillUnmount;e.componentWillUnmount=function(){t.splice(t.indexOf(e),1),n&&n.call(e)}}),e.children}};return t.Provider.__=t.Consumer.contextType=t}t.r(n),t.d(n,"render",(function(){return P})),t.d(n,"hydrate",(function(){return T})),t.d(n,"createElement",(function(){return _})),t.d(n,"h",(function(){return _})),t.d(n,"Fragment",(function(){return u})),t.d(n,"createRef",(function(){return l})),t.d(n,"isValidElement",(function(){return L})),t.d(n,"Component",(function(){return c})),t.d(n,"cloneElement",(function(){return A})),t.d(n,"createContext",(function(){return H})),t.d(n,"toChildArray",(function(){return v})),t.d(n,"options",(function(){return M}));var D,M,j,L,U,N,F,W,$={},R=[],I=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;D=R.slice,M={__e:function(e,n){for(var t,o,r;n=n.__;)if((t=n.__c)&&!t.__)try{if((o=t.constructor)&&null!=o.getDerivedStateFromError&&(t.setState(o.getDerivedStateFromError(e)),r=t.__d),null!=t.componentDidCatch&&(t.componentDidCatch(e),r=t.__d),r)return t.__E=t}catch(n){e=n}throw e}},j=0,L=function(e){return null!=e&&void 0===e.constructor},c.prototype.setState=function(e,n){var t;t=null!=this.__s&&this.__s!==this.state?this.__s:this.__s=o({},this.state),"function"==typeof e&&(e=e(o({},t),this.props)),e&&o(t,e),null!=e&&this.__v&&(n&&this.__h.push(n),s(this))},c.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),s(this))},c.prototype.render=u,U=[],N="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,p.__r=0,W=0},mdyV:function(e,n,t){"use strict";t.r(n);var o=t("hosL");const{h:r,render:_,hydrate:i}=o,l=e=>e&&e.default?e.default:e;if("function"==typeof l(t("QfWi"))){let e=document.getElementById("preact_root")||document.body.firstElementChild;0,(()=>{let n=l(t("QfWi")),o={};const i=document.querySelector('[type="__PREACT_CLI_DATA__"]');i&&(o=JSON.parse(decodeURI(i.innerHTML)).preRenderData||o);o.url&&(u=o.url);var u;e=_(r(n,{CLI_DATA:{preRenderData:o}}),document.body,e)})()}}});
//# sourceMappingURL=bundle.197a1.esm.js.map