(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{KDoM:function(e,t,s){"use strict";var r,c=s("hosL"),a=s("Utv1"),o=s("/eY4");let n=Object(o.a)(r=class extends c.Component{render(){const{dog:e}=this.props,{userStore:t}=this.props.stores;return Object(c.h)("div",{class:"col-12 col-sm-6 col-lg-2 mt-2 d-flex"},Object(c.h)("div",{class:"text-center border rounded-circle imageRounded",style:e.image?`background-image: url("${e.image.s3SmallLink}");`:""},!e.image&&Object(c.h)("i",{class:"fas fa-dog text-muted mt-3",style:"font-size: 40px;"})),Object(c.h)("div",{class:"flex-grow-1 pl-3 pr-2",style:`border-right: 4px solid ${t.findHarness(e.harness,"colorNonstop")} !important;`},Object(c.h)("span",{class:"float-right"},e.birth&&Object(c.h)("span",{class:"mr-2"},a.a.age(e.birth,e.deceased)),"female"===e.gender?Object(c.h)("i",{class:"fas fa-venus"}):Object(c.h)("i",{class:"fas fa-mars"})),Object(c.h)("a",{class:"stretched-link",href:"/dogs/"+e.id},Object(c.h)("h5",null,e.shortname||e.name)),t.findTeam(e.team),Object(c.h)("br",null),Object(c.h)("small",{class:"text-muted"},e.chipId&&Object(c.h)("span",{class:"ml-0"},Object(c.h)("i",{class:"fas fa-microchip"})," ",e.chipId),e.history&&Object(c.h)("span",{class:"ml-3"},Object(c.h)("i",{class:"fas fa-file-signature"})," ",e.history.length),e.images&&Object(c.h)("span",{class:"ml-3"},Object(c.h)("i",{class:"fas fa-image"})," ",e.images.length))))}})||r;t.a=n},RUc2:function(e,t,s){"use strict";function r(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,r)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}s.r(t);var a,o=s("hosL"),n=(s("Utv1"),s("/eY4")),i=s("KDoM");const l={};let h=Object(n.a)(a=class extends o.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?r(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):r(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},l),this.loadDogs()}loadDogs(){const{dogStore:e}=this.props.stores;e.load()}render(){const{dogStore:e}=this.props.stores,{dogs:t}=e;return Object(o.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 60px;"},Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12"},Object(o.h)("h5",null,"Hundene - ",t.length," stk"),Object(o.h)("div",{class:"row"},t&&t.map(e=>Object(o.h)(i.a,{stores:this.props.stores,dog:e}))),Object(o.h)("div",{class:"col-12"},Object(o.h)("a",{class:"btn btn-primary mt-5 float-right",href:"/dogs/edit/new"},Object(o.h)("i",{class:"fas fa-plus"})," Legg til hunder")))))}})||a;t.default=h}}]);
//# sourceMappingURL=route-dogs.chunk.f8d67.esm.js.map