(window.webpackJsonp=window.webpackJsonp||[]).push([[94],{WLRO:function(e,t,s){"use strict";s.r(t),function(e){function o(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,o)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var a,l=s("hosL"),n=s("ox/y"),r=(s("Utv1"),s("/eY4")),i=s("OhSV"),b=(s("go65"),s("Y3FI"),s("ZOvn").a.marginTopBack(!1)),f={searchText:""},g={no:"🇳🇴",en:"🇬🇧",es:"🇪🇸",de:"🇩🇪",fr:"🇫🇷",ru:"🇷🇺",se:"🇸🇪"},p=Object(r.a)(a=function(t){function s(e){var s;return(s=t.call(this,e)||this).toggleDarkmode=function(){s.props.stores.appState.toggleDarkmode()},s.toggleViewmode=function(e){var t=s.props.stores.appState,o=e.target.closest("a").dataset.mode;t.toggleViewmode(o)},s.changeLanguage=function(e){var t=e.target.closest("a").dataset.lang,o=s.props.stores.userStore;o.setLanguage({email:o.user.email,language:t})},s.back=function(){s.props.stores.history.goBack()},s.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?o(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):o(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},f),s}var a,r;r=t,(a=s).prototype=Object.create(r.prototype),a.prototype.constructor=a,a.__proto__=r;var p=s.prototype;return p.componentWillReceiveProps=function(e){e.search!==this.props.search&&this.loadAll(e)},p.render=function(){var t=this,s=this.props.stores,o=s.appState,c=s.userStore,a=o.viewmode,r=c.user,f=r.language,p=void 0===f?"en":f;return Object(l.h)("div",{class:"container-fluid",style:"margin-bottom: 200px; margin-top: 60px;"},Object(l.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:"top: "+b+"; left: 5px; font-size: 35px; width: 45px;",onClick:this.back},Object(l.h)("i",{class:"fas fa-arrow-circle-left"})),Object(l.h)("div",{class:"row m-2"},Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-0 mb-2"},Object(l.h)("h1",null,Object(l.h)(i.c,{id:"settings.title"},"Settings")))),Object(l.h)("div",{class:"row m-2"},Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(l.h)("h5",{class:"m-0 text-muted"},Object(l.h)(i.c,{id:"settings.viewmode"},"View mode"))),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:"font-size: 1.2em;"},["simple","normal","advanced","beta"].map((function(s,o){return Object(l.h)(e,null,Object(l.h)("div",{class:"row "+(o>0?"border-top":"")},Object(l.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(l.h)("span",{class:"flex-grow-1"},Object(l.h)(n.Link,{className:"stretched-link",activeClassName:"active","data-mode":s,onClick:t.toggleViewmode},Object(l.h)(i.c,{id:"settings.viewmode-"+s},s))),a===s&&Object(l.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(l.h)("i",{class:"fas fa-check text-primary"})))))}))),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-3 mb-2"},Object(l.h)("h5",{class:"m-0 text-muted"},Object(l.h)(i.c,{id:"settings.language"},"Language"))),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-3 bg-light rounded-lg",style:"font-size: 1.2em;"},["no","en","de","es","fr","ru","se"].map((function(s,o){return Object(l.h)(e,null,Object(l.h)("div",{class:"row "+(o>0?"border-top":"")},Object(l.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(l.h)("button",{class:"btn btn-link py-0 px-1 mr-3",style:"width: 2.0em;"},g[s]),Object(l.h)("span",{class:"flex-grow-1"},Object(l.h)(n.Link,{className:"stretched-link",activeClassName:"active","data-lang":s,onClick:t.changeLanguage},Object(l.h)(i.c,{id:"settings.language-"+s},s))),p===s&&Object(l.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(l.h)("i",{class:"fas fa-check text-primary"})))))}))),Object(l.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3 bg-light rounded-lg",style:"font-size: 1.2em;"},Object(l.h)("div",{class:"row"},Object(l.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(l.h)("button",{class:"btn btn-secondary py-0 px-1 mr-3",style:"width: 2.0em;"},Object(l.h)("i",{class:"fas fa-sign-out-alt"})),Object(l.h)("span",{class:"flex-grow-1"},Object(l.h)(n.Link,{className:"stretched-link",activeClassName:"active",href:"/logout"},Object(l.h)(i.c,{id:"settings.logout"},"Logout"))))))))},s}(l.Component))||a;t.default=p}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=94.chunk.107b8.js.map