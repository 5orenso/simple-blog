(window.webpackJsonp=window.webpackJsonp||[]).push([[88],{eT2M:function(t){t.exports={hoverelementonly:"hoverelementonly__3_DrK",hoverElement:"hoverElement__3ED7Q",hoverelementhide:"hoverelementhide__2AP13"}},pmcH:function(t,e,o){"use strict";o.r(e),function(t){function n(t,e){var o=Object.keys(t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(t);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),o.push.apply(o,n)}return o}function r(t,e,o){return e in t?Object.defineProperty(t,e,{value:o,enumerable:!0,configurable:!0,writable:!0}):t[e]=o,t}var i,s=o("hosL"),c=(o("Utv1"),o("/eY4")),a=(o("OhSV"),o("go65")),l=o("Y3FI"),u=o("ZOvn"),b=o("eT2M"),h=o.n(b),p=u.a.marginTop(!0),m=u.a.marginBottom(),f={},d=Object(c.a)(i=function(e){function o(t){var o;return(o=e.call(this,t)||this).gotoBib=function(){var t=o.state.bib,e=o.props.raceid;Object(l.route)("/tv/team/"+e+"/"+t)},o.checkForEnter=function(t){"Enter"===t.key&&o.gotoBib()},o.state=function(t){for(var e=1;e<arguments.length;e++){var o=null!=arguments[e]?arguments[e]:{};e%2?n(Object(o),!0).forEach((function(e){r(t,e,o[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))}))}return t}({},f),o}var i,c;c=e,(i=o).prototype=Object.create(c.prototype),i.prototype.constructor=i,i.__proto__=c;var b=o.prototype;return b.loadRace=function(t){return new Promise(function(e,o){var n,r,i;return void 0===t&&(t=this.props),this.setState({isLoading:!0}),n=t.stores.raceStore,r=t.raceid,Promise.resolve(n.load(r)).then(function(){try{if((i=n.race.classes.filter((function(t){return t.contestants&&t.contestants.length>0})).map((function(t){return t.contestants.filter((function(t){return t.team>0})).map((function(t){return t.team}))})).flat()).length>0&&r)return Promise.resolve(n.loadTeams(i.join(","))).then(function(){try{return Promise.resolve(n.loadWorkoutSummary(i.join(","),r)).then(function(){try{return n.getWorkoutSummaryActiveTeams(),t.call(this)}catch(t){return o(t)}}.bind(this),o)}catch(t){return o(t)}}.bind(this),o);function t(){return n.getAllClassesSortedBy(),e()}return t.call(this)}catch(t){return o(t)}}.bind(this),o)}.bind(this))},b.componentDidMount=function(){this.loadRace()},b.render=function(){var e=this.props,o=e.bib,n=this.props.stores,r=n.raceStore,i=r.getMusherByBibId(o),c=r.getTeamById(i.team),l=c.members?c.members.find((function(t){return t.email===i.email})):{},b=u.a.getImage({user:l,team:c,priority:"user",size:"s3LargeLink"});return Object(s.h)(t,null,Object(s.h)("div",{class:"fixed-top "+h.a.hoverElement,style:"height: 100px;"},Object(s.h)("div",{class:""+h.a.hoverelementonly},Object(s.h)("div",{class:"row"},Object(s.h)("div",{class:"col form-inline"},Object(s.h)("div",{class:"form-group"},Object(s.h)("label",{class:"text-success mr-2"},"Enter Bib"),Object(s.h)("input",{class:"form-control form-control-lg text-success border-success",style:"background-color: inherit;",type:"text",onInput:Object(a.a)(this,"bib"),onKeyDown:this.checkForEnter}),Object(s.h)("button",{type:"button",class:"btn btn-lg btn-outline-success",onClick:this.gotoBib},"Show Bib")))))),Object(s.h)("div",{class:"container-fluid position-relative",style:"margin-bottom: "+m+"; margin-top: "+p+"; height: calc(100% - "+m+" - "+p+");"},b&&Object(s.h)("div",{class:"d-flex position-absolute",style:" bottom: 20px; left: 248px; z-index: 9999; "},Object(s.h)("div",{class:"position-relative text-center border rounded-circle imageRounded imageRoundedLarge",style:b?'background-image: url("'+b+'"); background-size: cover;':""}," ")),Object(s.h)("div",{class:"d-flex position-absolute",style:' bottom: -100px; left: 125px; background-image: url("https://themusher.app/assets/tv-oneteam-background.png"); background-position: 0 100%; background-repeat: no-repeat; width: 740px; height: 400px; '},Object(s.h)("div",{class:"text-white text-center position-absolute",style:" font-size: 2.5em; font-weight: bold; bottom: 114px; left: 3px; width: 114px; "},o),Object(s.h)("div",{class:"text-white text-left position-absolute overflow-hidden",style:" font-size: 2.3em; font-weight: 400; text-transform: uppercase; bottom: 46px; left: 62px; width: 520px; "},Object(s.h)("nobr",null,i.firstname?Object(s.h)(t,null,Object(s.h)("span",{style:"font-weight: 300;"},i.firstname)," ",Object(s.h)("span",{style:"font-weight: 600;"},i.lastname)):Object(s.h)(t,null,i.name))),Object(s.h)("div",{class:"text-dark text-left position-absolute",style:" color: #000000 !important; font-size: 1.4em; font-weight: 600; bottom: 5px; left: 62px; width: 520px; "},i.flag&&Object(s.h)("div",{class:"float-left pt-1 mr-3",style:"font-size: 1.5em; line-height: 0.8em;"},i.flag)," ",i.sportsClub))))},o}(s.Component))||i;e.default=d}.call(this,o("hosL").Fragment)}}]);
//# sourceMappingURL=88.chunk.79404.js.map