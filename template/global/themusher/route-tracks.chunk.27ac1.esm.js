(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{nKYJ:function(e,t,r){"use strict";function c(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,c)}return r}function s(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}r.r(t);var a,n=r("hosL"),o=(r("Utv1"),r("/eY4"));const l={};let i=Object(o.a)(a=class extends n.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?c(Object(r),!0).forEach((function(t){s(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):c(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}({},l),this.loadTracks()}loadTracks(){const{trackStore:e}=this.props.stores;e.load()}render(){const{trackStore:e}=this.props.stores,{tracks:t}=e;return Object(n.h)("div",{class:"container-fluid",style:"margin-bottom: 100px; margin-top: 60px;"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12"},Object(n.h)("h5",null,"Treningsrundene dine - ",t.length," stk"),Object(n.h)("div",{class:"row"},t&&t.map(e=>Object(n.h)("div",{class:"col-12 col-sm-6 col-lg-2 mt-2 p-2 d-flex"},Object(n.h)("div",{class:"text-center border rounded-circle imageRounded",style:e.image?`background-image: url("${e.image.s3SmallLink}");`:""},!e.image&&Object(n.h)("i",{class:"fas fa-map-marked text-muted mt-3",style:"font-size: 40px;"})),Object(n.h)("div",{class:"flex-grow-1 pl-3"},Object(n.h)("a",{class:"stretched-link",href:"/tracks/"+e.id},Object(n.h)("h5",null,e.name)),Object(n.h)("small",{class:"text-muted"},Object(n.h)("i",{class:"fas fa-road"})," ",e.distanceKm," km",Object(n.h)("i",{class:"fas fa-mountain ml-2"})," ",e.elevation," m"))))),Object(n.h)("div",{class:"col-12"},Object(n.h)("a",{class:"btn btn-primary mt-5 float-right",href:"/tracks/new"},Object(n.h)("i",{class:"fas fa-plus"})," Legg til runde")))))}})||a;t.default=i}}]);
//# sourceMappingURL=route-tracks.chunk.27ac1.esm.js.map