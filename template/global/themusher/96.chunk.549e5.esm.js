(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{EzH7:function(e,t,s){"use strict";function o(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,o)}return s}function r(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}s.r(t);var a,c=s("hosL"),n=(s("ox/y"),s("Utv1"),s("/eY4")),i=s("OhSV");s("go65"),s("Y3FI");const l=s("ZOvn").a.marginTopBack(!1),b={searchText:"",showInfo:{}};let m=Object(n.a)(a=class extends c.Component{constructor(e){super(e),this.back=()=>{const{history:e}=this.props.stores;e.goBack()},this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?o(Object(s),!0).forEach((function(t){r(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):o(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},b)}async loadTeams(){this.setState({isLoading:!0});const{teamStore:e,userStore:t,messageStore:s}=this.props.stores;await e.load(void 0,!1,{addData:["workoutSummary","musherSummary"]}),await t.getNotifications(),await s.getUnReadMessages(),this.setState({isLoading:!1})}componentDidMount(){this.loadTeams()}render(){const{teamStore:e}=this.props.stores,{teams:t}=e;return Object(c.h)("div",{class:"container-fluid",style:"margin-bottom: 200px; margin-top: 60px;"},Object(c.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:`top: ${l}; left: 5px; font-size: 35px; width: 45px;`,onClick:this.back},Object(c.h)("i",{class:"fas fa-arrow-circle-left"})),Object(c.h)("div",{class:"row m-2"},Object(c.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-0 mb-2"},Object(c.h)("h1",null,Object(c.h)(i.c,{id:"settings.team"},"Team")))),Object(c.h)("div",{class:"row m-2"},Object(c.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3 bg-light rounded-lg",style:"font-size: 1.2em;"},t&&t.map((e,t)=>{const s=e.image&&e.image.s3SmallLink?e.image:null;return Object(c.h)("div",{class:"row "+(t>0?"border-top":"")},Object(c.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(c.h)("div",{class:"text-center border rounded-circle imageRoundedThumb mr-3",style:s?`background-image: url("${s.s3SmallLink}"); background-size: cover;`:"line-height: 1.0em;"},!s&&Object(c.h)("i",{class:"fas fa-users text-muted mt-0",style:"font-size: 13px;"})),Object(c.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},Object(c.h)("a",{href:"/settings/team/"+e.id,class:"stretched-link"},e.name)),Object(c.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(c.h)("i",{class:"fas fa-angle-right"}))))}))))}})||a;t.default=m}}]);
//# sourceMappingURL=96.chunk.549e5.esm.js.map