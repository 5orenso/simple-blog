(window.webpackJsonp=window.webpackJsonp||[]).push([[104],{EzH7:function(t,e,r){"use strict";function o(t,e){var r=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),r.push.apply(r,o)}return r}function n(t,e,r){return e in t?Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}):t[e]=r,t}r.r(e);var s,i=r("hosL"),c=(r("ox/y"),r("Utv1"),r("/eY4")),a=r("OhSV"),l=(r("go65"),r("Y3FI"),r("ZOvn").a.marginTopBack(!1)),u={searchText:"",showInfo:{}},b=Object(c.a)(s=function(t){function e(e){var r;return(r=t.call(this,e)||this).back=function(){r.props.stores.history.goBack()},r.state=function(t){for(var e=1;e<arguments.length;e++){var r=null!=arguments[e]?arguments[e]:{};e%2?o(Object(r),!0).forEach((function(e){n(t,e,r[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))}))}return t}({},u),r}var r,s;s=t,(r=e).prototype=Object.create(s.prototype),r.prototype.constructor=r,r.__proto__=s;var c=e.prototype;return c.loadTeams=function(){return new Promise(function(t,e){var r,o,n;return this.setState({isLoading:!0}),o=(r=this.props.stores).userStore,n=r.messageStore,Promise.resolve(r.teamStore.load(void 0,!1,{addData:["workoutSummary","musherSummary"]})).then(function(){try{return Promise.resolve(o.getNotifications()).then(function(){try{return Promise.resolve(n.getUnReadMessages()).then(function(){try{return this.setState({isLoading:!1}),t()}catch(t){return e(t)}}.bind(this),e)}catch(t){return e(t)}}.bind(this),e)}catch(t){return e(t)}}.bind(this),e)}.bind(this))},c.componentDidMount=function(){this.loadTeams()},c.render=function(){var t=this.props.stores.teamStore.teams;return Object(i.h)("div",{class:"container-fluid",style:"margin-bottom: 200px; margin-top: 60px;"},Object(i.h)("button",{class:"btn btn-link pl-0 fixed-top text-primary",style:"top: "+l+"; left: 5px; font-size: 35px; width: 45px;",onClick:this.back},Object(i.h)("i",{class:"fas fa-arrow-circle-left"})),Object(i.h)("div",{class:"row m-2"},Object(i.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-0 mb-2"},Object(i.h)("h1",null,Object(i.h)(a.c,{id:"settings.team"},"Team")))),Object(i.h)("div",{class:"row m-2"},Object(i.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3 bg-light rounded-lg",style:"font-size: 1.2em;"},t&&t.map((function(t,e){var r=t.image&&t.image.s3SmallLink?t.image:null;return Object(i.h)("div",{class:"row "+(e>0?"border-top":"")},Object(i.h)("div",{class:"col-12 py-2 d-flex align-items-center position-relative"},Object(i.h)("div",{class:"text-center border rounded-circle imageRoundedThumb mr-3",style:r?'background-image: url("'+r.s3SmallLink+'"); background-size: cover;':"line-height: 1.0em;"},!r&&Object(i.h)("i",{class:"fas fa-users text-muted mt-0",style:"font-size: 13px;"})),Object(i.h)("span",{class:"flex-grow-1",style:"line-height: 1.0em;"},Object(i.h)("a",{href:"/settings/team/"+t.id,class:"stretched-link"},t.name)),Object(i.h)("button",{class:"btn btn-link btn-lg py-0 px-1 mr-3"},Object(i.h)("i",{class:"fas fa-angle-right"}))))})))))},e}(i.Component))||s;e.default=b}}]);
//# sourceMappingURL=104.chunk.5ddcc.js.map