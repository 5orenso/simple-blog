(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{"/DnB":function(e,t,s){"use strict";function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function o(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var c,n=s("hosL"),r=(s("Utv1"),s("/eY4")),i={},l=Object(r.a)(c=function(e){function t(t){var s;return(s=e.call(this,t)||this).state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){o(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},i),s.container=null,s}var s,c;c=e,(s=t).prototype=Object.create(c.prototype),s.prototype.constructor=s,s.__proto__=c;var r=t.prototype;return r.componentDidMount=function(){var e=this.props,t=e.horizontal,s=e.vertical,a=void 0===s?"":s,o={behavior:"smooth"};t&&(o.inline=t),a&&(o.block=a),this.container.scrollIntoView(o)},r.render=function(){var e=this;return Object(n.h)("div",{ref:function(t){return e.container=t}}," ")},t}(n.Component))||c;t.a=l},"3sR/":function(e,t,s){"use strict";function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function o(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}s.r(t);var c,n=s("hosL"),r=(s("Utv1"),s("/eY4")),i=(s("cneo"),s("OhSV")),l=s("ZOvn"),h=(s("KDoM"),s("2X7c")),d=s("7g1v"),b=s("pJjI"),p=l.a.marginTop(!0),u=l.a.marginBottom(),f=l.a.subMenuMarginTop(),m={isLoading:!1},g=Object(r.a)(c=function(e){function t(t){var s;return(s=e.call(this,t)||this).loadDogs=function(){return new Promise((function(e,t){var a;return s.setState({isLoading:!0}),a=s.props.stores.dogStore,Promise.resolve(a.load({query:{team:a.currentTeam},addData:["team","user","workoutSummary","vaccineStatuses","historyStatuses","vaccineLogStatuses","allDogs"]})).then((function(){try{return s.setState({isLoading:!1}),e()}catch(e){return t(e)}}),t)}))},s.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){o(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},m),s}var s,c;c=e,(s=t).prototype=Object.create(c.prototype),s.prototype.constructor=s,s.__proto__=c;var r=t.prototype;return r.componentDidMount=function(){this.loadDogs()},r.render=function(){var e=this,t=this.props.scrolledDown,s=this.props.stores,a=s.dogStore,o=s.appState.darkmode,c=a.findDogsByStatus(10),r=a.findDogsByStatus([2,4,8,9]),l=a.findDogsWithNeeds();return Object(n.h)("div",{class:"container-fluid",style:"margin-bottom: "+u+"; margin-top: "+p+";"},Object(n.h)("div",{class:"row fixed-top",style:"margin-top: "+(t>0?0:f)+"; background-color: "+(o?"#191d21":"#f8f9fa")+"; transition: all 0.3s ease-in-out;"},Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-chart-line"})," ",Object(n.h)(i.c,{id:"dogs.dashboard"},"Oversikt")))),Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/list",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-list"})," ",Object(n.h)(i.c,{id:"dogs.list"},"Liste")))),Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/feed",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-rss"})," ",Object(n.h)(i.c,{id:"dogs.feed"},"Feed")))),Object(n.h)("div",{class:"col text-center border-bottom border-primary subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/todo",class:"text-primary stretched-link"},Object(n.h)("i",{class:"fas fa-calendar-check"})," ",Object(n.h)(i.c,{id:"dogs.todo"},"Todo"))))),Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 mb-2 border-bottom"},Object(n.h)(b.a,{stores:this.props.stores,callback:this.loadDogs})),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 pb-2 clearfix"},Object(n.h)("span",{class:"float-right"},Object(n.h)(h.a,{stores:this.props.stores,dog:{},callback:this.loadDogs}))))),Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-follow-up"},"Hunder som trenger oppfølging")),Object(n.h)("div",{class:"row"},r&&r.map((function(t){return Object(n.h)(d.a,{stores:e.props.stores,dog:t})})),!r||0===r.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-follow-up"},"Ingen hunder som trenger ekstra oppfølging.")))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-special-needs"},"Hunder med spesielle behov")),Object(n.h)("div",{class:"row"},l&&l.map((function(t){return Object(n.h)(d.a,{stores:e.props.stores,dog:t})})),!l||0===l.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-special-needs"},"Ingen hunder med spesielle behov.")))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-maturity"},"Hunder med løpetid")),Object(n.h)("div",{class:"row"},c&&c.map((function(t){return Object(n.h)(d.a,{stores:e.props.stores,dog:t})})),!c||0===c.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-maturity"},"Ingen hunder med løpetid."))))))},t}(n.Component))||c;t.default=g},"7g1v":function(e,t,s){"use strict";(function(e){var a,o=s("hosL"),c=s("Utv1"),n=s("/eY4"),r=(s("cneo"),s("OhSV")),i=s("wanP"),l=s("ZOvn"),h=Object(n.a)(a=function(t){function s(){return t.apply(this,arguments)||this}var a,n;return n=t,(a=s).prototype=Object.create(n.prototype),a.prototype.constructor=a,a.__proto__=n,s.prototype.render=function(){var t=this.props,s=t.dog,a=t.showWorkout,n=t.showInfo,h=t.hideTeam,d=void 0!==h&&h,b=t.fullWidth,p=void 0!==b&&b,u=t.daysBack,f=void 0===u?7:u,m=t.filterBy,g=void 0===m?"":m,O=this.props.stores,j=O.userStore,v=O.dogStore,y=O.workoutPlanStore;if(!s)return"";var w=j.user.language,x=void 0===w?"en":w,k=j.findDogstatus({status:s.status,language:x}),D=s.statuses?s.statuses.map((function(e){return j.findDogstatus({status:e,language:x})})):[],S=j.findDogposition({position:s.position,language:x}),T=v.findCurrentWorkoutSummary(s.id)||{},_=c.a.getWeek(new Date),P=c.a.getYear(),K=(new Date).getMonth()+1,L=parseInt(K<8?P-1:P,10),C=this.props,B=C.week,I=void 0===B?_:B,A=C.year,z=y.sumWorkoutPlanDaysBack(parseInt(void 0===A?L:A,10),parseInt(I,10),f)||0,Y=c.a.format(T.distanceKm||0,0),M=l.a.hasBirthday(s.birth),W=!1,U=0;return Y&&z&&(U=Y/z*100,W=!0),Object(o.h)("div",{class:(p?"":"col-4")+" mb-3 "+(W?"mt-2":"")+" position-relative"},Object(o.h)("div",{class:"text-center border border-secondary rounded-circle imageRounded mx-auto text-muted pt-2 position-relative",style:(s.image?'background-image: url("'+s.image.s3SmallLink+'"); background-size: cover;':"")+" border-width: 2px !important;"},!s.image&&Object(o.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},c.a.ucfirst(s.name,!0)),W&&Object(o.h)("div",{class:"position-absolute",style:"top: -12px; left: -12px;"},Object(o.h)(i.a,{key:"gauge-"+U,radius:48,heightAdd:15,showPercentText:!1,percent:U,prefix:"%",total:z+" km",totalY:"95%",completed:Y+" km",completedY:"85%"}))),Object(o.h)("div",{class:W?"mt-4":"",style:"line-height: 1.0em;"},Object(o.h)("small",null,Object(o.h)("span",{class:"float-right"},s.birth&&Object(o.h)("span",{class:"mr-2"},c.a.age(s.birth,s.deceased)),"female"===s.gender?Object(o.h)("i",{class:"fas fa-venus"}):Object(o.h)("i",{class:"fas fa-mars"})),Object(o.h)("a",{class:"stretched-link",href:"/dogs/"+s.id},Object(o.h)("h5",{class:"mb-1 font-weight-light",style:"line-height: 1.0em; font-size: 1.3em;"},s.shortname||s.name,M&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-birthday-cake ml-3"})))),!d&&Object(o.h)(e,null,Object(o.h)("span",{class:"font-weight-light"},j.findTeam(s.team)),Object(o.h)("br",null))),g&&s.positions&&s.positions.lead&&Object(o.h)("div",{class:""},"leadOnly"===g&&s.positions.lead.distanceKm>0&&Object(o.h)("span",{class:"badge badge-success mr-2"},Object(o.h)("span",null,Object(o.h)(r.c,{id:"dogs.sort-lead"},"Lead"),":")," ",c.a.format(s.positions.lead.distanceKm,0)," km"),"pointOnly"===g&&s.positions.point.distanceKm>0&&Object(o.h)("span",{class:"badge badge-success mr-2"},Object(o.h)("span",null,Object(o.h)(r.c,{id:"dogs.sort-point"},"Point"),":")," ",c.a.format(s.positions.point.distanceKm,0)," km"),"teamOnly"===g&&s.positions.team.distanceKm>0&&Object(o.h)("span",{class:"badge badge-success mr-2"},Object(o.h)("span",null,Object(o.h)(r.c,{id:"dogs.sort-team"},"Team"),":")," ",c.a.format(s.positions.team.distanceKm,0)," km"),"wheelOnly"===g&&s.positions.wheel.distanceKm>0&&Object(o.h)("span",{class:"badge badge-success mr-2"},Object(o.h)("span",null,Object(o.h)(r.c,{id:"dogs.sort-wheel"},"Wheel"),":")," ",c.a.format(s.positions.wheel.distanceKm,0)," km")),Object(o.h)("small",null,a&&Object(o.h)("small",{class:"text-muted"},T&&T.distanceKm>0&&Object(o.h)("span",{class:"mr-2"},Object(o.h)("i",{class:"fas fa-road"})," ",c.a.format(T.distanceKm,0),"km"),T&&T.elevation>0&&Object(o.h)("span",{class:"mr-2"},Object(o.h)("i",{class:"fas fa-mountain"})," ",c.a.format(T.elevation,0),"m"),T&&T.duration>0&&Object(o.h)("span",{class:"mr-2"},Object(o.h)("i",{class:"fas fa-clock"})," ",c.a.secToHms(T.duration,!0)),T&&T.speedAvg>0&&Object(o.h)("span",{class:"mr-2"},Object(o.h)("i",{class:"fas fa-tachometer-alt"})," ",c.a.format(T.speedAvg,1),"km/t")),n&&Object(o.h)("small",{class:"text-muted"},s.weight&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-balance-scale ml-2"})," ",c.a.format(s.weight,1)," kg"),s.bodyScore&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-dog ml-2"})," ",c.a.format(s.bodyScore,1))),Object(o.h)("div",{class:"clearfix pb-0 pt-1"},S&&S.class&&Object(o.h)("span",{class:"badge badge-"+(S.class||"primary")+" mr-2"},S.icon&&Object(o.h)("i",{class:S.icon})," ",S.name),s.specialNeeds&&Object(o.h)("span",{class:"badge badge-warning mr-2"},Object(o.h)("i",{class:"fas fa-exclamation-triangle"})," ",s.specialNeeds),k&&k.class&&Object(o.h)("span",{class:"badge badge-"+k.class+" mr-2 mt-1"},k.icon&&Object(o.h)("i",{class:k.icon})," ",k.name),D&&D.map((function(t){return Object(o.h)(e,null,t&&t.class&&Object(o.h)("span",{class:"badge badge-"+t.class+" mr-2 mt-1"},t.icon&&Object(o.h)("i",{class:t.icon})," ",t.name))}))))))},s}(o.Component))||a;t.a=h}).call(this,s("hosL").Fragment)},KDoM:function(e,t,s){"use strict";(function(e){var a,o=s("hosL"),c=s("Utv1"),n=s("/eY4"),r=s("OhSV"),i=s("nHdA"),l=s("irB3"),h=s("UwwE"),d=s("8Lgr"),b=(s("QkTp"),s("ZOvn")),p=Object(n.a)(a=function(t){function s(){return t.apply(this,arguments)||this}var a,n;return n=t,(a=s).prototype=Object.create(n.prototype),a.prototype.constructor=a,a.__proto__=n,s.prototype.render=function(){var t=this.props.dog,s=this.props.stores,a=s.userStore,n=s.dogStore,p=a.user.language,u=void 0===p?"en":p,f=s.appState.viewmode,m=(new Date).getMonth()+1,g=(new Date).getFullYear(),O=this.props,j=O.month,v=O.year,y=void 0===v?g:v,w=parseInt((void 0===j?m:j)<8?y-1:y,10),x=n.findWorkoutSummary(t.id,w)||{},k=t.statuses?t.statuses.map((function(e){return a.findDogstatus({status:e,language:u})})):[],D=n.findVaccineStatuses(t.id),S=n.findVaccineLogStatuses(t.chipId),T=n.findHistoryStatuses(t.id),_=a.findDogstatus({status:t.status,language:u}),P=a.findDogposition({position:t.position,language:u}),K=[];a.findTeam(t.team)&&K.push(a.findTeam(t.team)),t.teams&&t.teams.forEach((function(e){a.findTeam(e)&&K.push(a.findTeam(e))}));var L=b.a.hasBirthday(t.birth),C=t.birth?Math.ceil(b.a.daysUntilNextBirthday(t.birth)):365,B=this.props.url,I=void 0===B?"/dogs/"+t.id:B;return Object(o.h)("div",{class:"w-100 mb-3"},Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 d-flex mb-0 position-relative"},Object(o.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:t.image?'background-image: url("'+t.image.s3SmallLink+'"); background-size: cover;':""},!t.image&&Object(o.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},c.a.ucfirst(t.name,!0))),Object(o.h)("div",{class:"flex-grow-1 pl-3 pr-2",style:"border-right: 4px solid "+a.findHarness(t.harness,"colorNonstop")+" !important; line-height: 1.2em;"},Object(o.h)("span",{class:"float-right"},P&&Object(o.h)("span",{class:"badge badge-"+(P.class||"primary")+" mr-3"},P.icon&&Object(o.h)("i",{class:P.icon})," ",P.name),C<7&&Object(o.h)(e,null,Object(o.h)("span",{class:"text-muted mr-2"},Object(o.h)("i",{class:"fas fa-birthday-cake"})," in ",C," days")),t.birth&&Object(o.h)("span",{class:"mr-2"},c.a.age(t.birth,t.deceased)),"female"===t.gender?Object(o.h)("i",{class:"fas fa-venus"}):Object(o.h)("i",{class:"fas fa-mars"})),Object(o.h)("a",{class:"stretched-link",href:I},Object(o.h)("h5",{class:"mb-1",style:"line-height: 1.0em;"},t.shortname||t.name," ",t.shortname&&""!==t.shortname&&Object(o.h)(e,null," - ",Object(o.h)("span",{class:"font-weight-lighter"},t.name)),L&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-birthday-cake ml-3"})))),Object(o.h)("div",null,K&&K.length>0&&Object(o.h)("small",{class:"font-weight-lighter"},K.map((function(t,s){return Object(o.h)(e,null,s>0?", ":"",t)}))),Object(o.h)("br",null)),Object(o.h)("small",{class:"text-muted"},t.history>0&&Object(o.h)("span",{class:"ml-0"},Object(o.h)("i",{class:"fas fa-file-signature"})," ",t.history.length),t.images>0&&Object(o.h)("span",{class:"ml-2"},Object(o.h)("i",{class:"fas fa-image"})," ",t.images.length),x&&x.distanceKm>0&&Object(o.h)("span",{class:"ml-2"},Object(o.h)("i",{class:"fas fa-road"})," ",Object(o.h)(d.a,{stores:this.props.stores,value:x.distanceKm})),x&&x.elevation>0&&Object(o.h)("span",{class:"ml-2"},Object(o.h)("i",{class:"fas fa-mountain"})," ",Object(o.h)(l.a,{stores:this.props.stores,value:x.elevation})),x&&x.duration>0&&Object(o.h)("span",{class:"ml-2"},Object(o.h)("i",{class:"fas fa-clock"})," ",c.a.secToHms(x.duration,!0)),x&&x.speedAvg>0&&Object(o.h)("span",{class:"ml-2"},Object(o.h)("i",{class:"fas fa-tachometer-alt"})," ",Object(o.h)(i.a,{stores:this.props.stores,value:x.speedAvg})),t.weight>0&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-balance-scale ml-2"})," ",Object(o.h)(h.a,{stores:this.props.stores,value:t.weight})),t.bodyScore>0&&Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-dog ml-2"})," ",c.a.format(t.bodyScore,1))),["beta","advanced","normal"].indexOf(f)>-1&&Object(o.h)(e,null,Object(o.h)("div",null,D&&D.map((function(e){return Object(o.h)("span",{class:"badge badge-success mr-2",title:c.a.isoDate(e.endDate,!1,!1,!0)},e.vaccineType,Object(o.h)("span",{class:"font-weight-light ml-3"},Object(o.h)("i",{class:"fas fa-calendar-check"})," ",c.a.isoDate(e.endDate,!1,!1,!0)))})),T&&T.map((function(e){return Object(o.h)("span",{class:"badge badge-warning mr-2",title:c.a.isoDate(e.endDate,!1,!1,!0)},e.title)})))),["beta","advanced"].indexOf(f)>-1&&Object(o.h)(e,null,t.positions&&t.positions.lead&&Object(o.h)("div",{class:""},t.positions.lead.distanceKm>0&&Object(o.h)("span",{class:"badge badge-secondary mr-2"},Object(o.h)("span",{class:"font-weight-lighter"},Object(o.h)(r.c,{id:"dogs.sort-lead"},"Lead"),":")," ",Object(o.h)(d.a,{stores:this.props.stores,value:t.positions.lead.distanceKm})),t.positions.point.distanceKm>0&&Object(o.h)("span",{class:"badge badge-secondary mr-2"},Object(o.h)("span",{class:"font-weight-lighter"},Object(o.h)(r.c,{id:"dogs.sort-point"},"Point"),":")," ",Object(o.h)(d.a,{stores:this.props.stores,value:t.positions.point.distanceKm})),t.positions.team.distanceKm>0&&Object(o.h)("span",{class:"badge badge-secondary mr-2"},Object(o.h)("span",{class:"font-weight-lighter"},Object(o.h)(r.c,{id:"dogs.sort-team"},"Team"),":")," ",Object(o.h)(d.a,{stores:this.props.stores,value:t.positions.team.distanceKm})),t.positions.wheel.distanceKm>0&&Object(o.h)("span",{class:"badge badge-secondary mr-2"},Object(o.h)("span",{class:"font-weight-lighter"},Object(o.h)(r.c,{id:"dogs.sort-wheel"},"Wheel"),":")," ",Object(o.h)(d.a,{stores:this.props.stores,value:t.positions.wheel.distanceKm})))),Object(o.h)("div",{class:"clearfix pb-0"},t.specialNeeds&&Object(o.h)("span",{class:"badge badge-warning ml-2 mt-1 float-right"},Object(o.h)("i",{class:"fas fa-exclamation-triangle"})," ",t.specialNeeds),_&&Object(o.h)("span",{class:"badge badge-"+_.class+" ml-2 mt-1 float-right"},_.icon&&Object(o.h)("i",{class:_.icon})," ",_.name),k&&k.map((function(t){return Object(o.h)(e,null,Object(o.h)("span",{class:"badge badge-"+t.class+" ml-2 mt-1 float-right"},t.icon&&Object(o.h)("i",{class:t.icon})," ",t.lang&&t.lang[u]?t.lang[u]:t.name))}))),S&&S.length>0&&Object(o.h)(e,null,Object(o.h)("div",{class:"mt-2"},S&&S.filter((function(e){return e.chipId===t.chipId})).map((function(e){return Object(o.h)("span",{class:"badge badge-"+(e.inKarens?"warning":"success")+" mr-2 mb-1"},Object(o.h)("i",{class:"fas fa-user-md"})," ",e.vaccineAgens.name)}))))))))},s}(o.Component))||a;t.a=p}).call(this,s("hosL").Fragment)},eK6s:function(e){e.exports={gaugeBackground:"gaugeBackground__1UGxt",gauge:"gauge__2ZDxd",success:"success__3UQxg",primary:"primary__3pPV6",secondary:"secondary__-Vrk_",info:"info__3t5zs",warning:"warning__1jHlR",danger:"danger__BLVC9",gaugeText:"gaugeText__1on-w"}},pJjI:function(e,t,s){"use strict";(function(e){var a,o=s("hosL"),c=s("Utv1"),n=s("/eY4"),r=s("OhSV"),i=(s("/DnB"),Object(n.a)(a=function(t){function s(){for(var e,s=arguments.length,a=new Array(s),o=0;o<s;o++)a[o]=arguments[o];return(e=t.call.apply(t,[this].concat(a))||this).toggleTeam=function(t){var s=e.props,a=s.callback,o=s.unsetTeamIfSelected,n=e.props.stores,r=n.dogStore,i=n.workoutStore;(void 0===o||o)&&t===r.currentTeam?(r.setCurrentTeam(void 0),i.setCurrentTeam(void 0)):(r.setCurrentTeam(t),i.setCurrentTeam(t)),c.a.isDefined(a)&&a()},e.showAllTeams=function(){var t=e.props.callback,s=e.props.stores,a=s.workoutStore;s.dogStore.setCurrentTeam(void 0),a.setCurrentTeam(void 0),c.a.isDefined(t)&&t()},e}var a,n;return n=t,(a=s).prototype=Object.create(n.prototype),a.prototype.constructor=a,a.__proto__=n,s.prototype.render=function(){var t=this,s=this.props.stores,a=s.userStore.teams,c=s.dogStore.currentTeam,n=this.props,i=n.highlight,l=n.showAll,h=void 0===l||l;return Object(o.h)("div",{class:"row mt-2"},Object(o.h)("div",{class:"w-100 overflow-hidden"},Object(o.h)("div",{class:"d-flex flex-row flex-nowrap pb-2 px-1",style:"overflow: auto; scroll-snap-type: x mandatory;"},a&&a.map((function(s,n){return Object(o.h)("div",{class:"col mb-0 px-0 clearfix",key:s.id},Object(o.h)("button",{class:"btn btn-sm btn-block \n\t\t\t\t\t\t\t\t\t\trounded-none "+(0===n?"rounded-pill-left":n+1===a.length?"rounded-pill-right":"")+"\n\t\t\t\t\t\t\t\t\t\t"+(c===s.id?"btn-success":"btn-outline-success")+"\n\t\t\t\t\t\t\t\t\t\ttext-nowrap clearfix",style:"text-overflow: ellipsis; overflow: hidden;",onClick:function(){return t.toggleTeam(s.id)}},Object(o.h)("i",{class:"fas fa-users"})," ",s.name,i&&i.indexOf(s.id)>-1&&Object(o.h)(e,null,c===s.id?Object(o.h)(e,null,Object(o.h)("i",{class:"fas fa-check float-right"})):Object(o.h)(e,null,Object(o.h)("div",{class:"spinner-grow text-warning float-right",role:"status"},Object(o.h)("span",{class:"sr-only"},"Loading...")),Object(o.h)("i",{class:"far fa-hand-point-left float-right",style:"font-size: 2.0em;"})))))}))),h&&Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12 mb-1 px-1 d-flex justify-content-center"},Object(o.h)("button",{class:"btn btn-sm rounded-lg btn-link text-nowrap clearfix",style:"text-overflow: ellipsis; overflow: hidden;",onClick:this.showAllTeams},Object(o.h)("i",{class:"fas fa-users"})," ",Object(o.h)(r.c,{id:"teams.show-all"},"Show all"))))))},s}(o.Component))||a);t.a=i}).call(this,s("hosL").Fragment)},wanP:function(e,t,s){"use strict";(function(e){function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function o(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var c,n=s("hosL"),r=(s("Utv1"),s("/eY4")),i=s("eK6s"),l=s.n(i),h={mouseData:{}},d=Object(r.a)(c=function(t){function s(e){var s;return(s=t.call(this,e)||this).state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){o(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},h),s.svgRef=null,s}var c,r;return r=t,(c=s).prototype=Object.create(r.prototype),c.prototype.constructor=c,c.__proto__=r,s.prototype.render=function(){var t=this,s=this.props,a=s.radius,o=void 0===a?50:a,c=s.heightAdd,r=void 0===c?0:c,i=s.color,h=void 0===i?"success":i,d=s.showPercentText,b=void 0===d||d,p=s.percent,u=void 0===p?0:p,f=s.prefix,m=void 0===f?"":f,g=s.showCenterText,O=void 0!==g&&g,j=s.centerText,v=s.centerTextSize,y=s.centerTextX,w=s.centerTextY,x=s.total,k=void 0===x?"":x,D=s.totalY,S=void 0===D?"90%":D,T=s.totalX,_=void 0===T?"50%":T,P=s.totalTextAnchor,K=void 0===P?"middle":P,L=s.completed,C=void 0===L?"":L,B=s.completedY,I=void 0===B?"65%":B,A=s.completedX,z=void 0===A?"50%":A,Y=s.completedTextAnchor,M=void 0===Y?"middle":Y,W=.3*o,U=o-W/2,V=.3*o,H=2*U*Math.PI,E=.75*H,N=E+" "+H,R="rotate(135, "+o+", "+o+")",F=E-Math.min(Math.max(u,0),100)/100*E,J=v||o/2.5,X=o/5;return Object(n.h)(e,null,Object(n.h)("svg",{xmlns:"http://www.w3.org/2000/svg",class:l.a.svg,width:2*o,height:2*o+r,preserveAspectRatio:"none",ref:function(e){return t.svgRef=e}},Object(n.h)("circle",{class:""+l.a.gaugeBackground,cx:o,cy:o,r:U,strokeWidth:W,strokeDasharray:N,strokeLinecap:"round",transform:R}),Object(n.h)("circle",{class:l.a[h]+" "+l.a.gauge,cx:o,cy:o,r:U,stroke:"url(#grad)",strokeDasharray:N,strokeDashoffset:F,strokeLinecap:"round",strokeWidth:V,style:{transition:"stroke-dashoffset 0.3s"},transform:R}),b&&Object(n.h)("text",{class:l.a.gaugeText+" "+l.a[h],x:y||"50%",y:w||"50%","dominant-baseline":"middle","text-anchor":"middle","font-size":J},u," ",m),O&&Object(n.h)("text",{class:l.a.gaugeText+" "+l.a[h],x:y||"50%",y:w||"50%","dominant-baseline":"middle","text-anchor":"middle","font-size":J},j),C&&Object(n.h)("text",{class:l.a.gaugeText+" "+l.a[h],x:z,y:I,"dominant-baseline":"middle","text-anchor":M,"font-size":X},C),Object(n.h)("text",{class:l.a.gaugeText+" "+l.a.secondary,x:_,y:S,"dominant-baseline":"middle","text-anchor":K,"font-size":X},k)))},s}(n.Component))||c;t.a=d}).call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=71.chunk.76f45.js.map