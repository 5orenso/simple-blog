(window.webpackJsonp=window.webpackJsonp||[]).push([[71],{"/DnB":function(e,t,s){"use strict";function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var o,n=s("hosL"),r=(s("Utv1"),s("/eY4"));const i={};let l=Object(r.a)(o=class extends n.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},i),this.container=null}componentDidMount(){const{horizontal:e,vertical:t=""}=this.props,s={behavior:"smooth"};e&&(s.inline=e),t&&(s.block=t),this.container.scrollIntoView(s)}render(){return Object(n.h)("div",{ref:e=>this.container=e}," ")}})||o;t.a=l},"3sR/":function(e,t,s){"use strict";function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}s.r(t);var o,n=s("hosL"),r=(s("Utv1"),s("/eY4")),i=(s("cneo"),s("OhSV")),l=s("ZOvn"),h=(s("KDoM"),s("2X7c")),d=s("7g1v"),b=s("pJjI");const p=l.a.marginTop(!0),m=l.a.marginBottom(),g=l.a.subMenuMarginTop(),u={isLoading:!1};let O=Object(r.a)(o=class extends n.Component{constructor(e){var t;super(e),t=this,this.loadDogs=async function(){t.setState({isLoading:!0});const{dogStore:e}=t.props.stores,{currentTeam:s}=e,a={team:s};await e.load({query:a,addData:["team","user","workoutSummary","vaccineStatuses","historyStatuses","vaccineLogStatuses","allDogs"]}),t.setState({isLoading:!1})},this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},u)}componentDidMount(){this.loadDogs()}render(){const{scrolledDown:e}=this.props,{dogStore:t,appState:s}=this.props.stores,{darkmode:a}=s,c=t.findDogsByStatus(10),o=t.findDogsByStatus([2,4,8,9]),r=t.findDogsWithNeeds();return Object(n.h)("div",{class:"container-fluid",style:`margin-bottom: ${m}; margin-top: ${p};`},Object(n.h)("div",{class:"row fixed-top pt-2",style:`margin-top: ${e>0?0:g}; background-color: ${a?"#191d21":"#f8f9fa"}; transition: all 0.3s ease-in-out;`},Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-chart-line"})," ",Object(n.h)(i.c,{id:"dogs.dashboard"},"Oversikt")))),Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/list",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-list"})," ",Object(n.h)(i.c,{id:"dogs.list"},"Liste")))),Object(n.h)("div",{class:"col text-center subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/feed",class:"text-secondary stretched-link"},Object(n.h)("i",{class:"fas fa-rss"})," ",Object(n.h)(i.c,{id:"dogs.feed"},"Feed")))),Object(n.h)("div",{class:"col text-center border-bottom border-primary subtopmenu"},Object(n.h)("nobr",null,Object(n.h)("a",{href:"/dogs/todo",class:"text-primary stretched-link"},Object(n.h)("i",{class:"fas fa-calendar-check"})," ",Object(n.h)(i.c,{id:"dogs.todo"},"Todo"))))),Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 mb-2 border-bottom"},Object(n.h)(b.a,{stores:this.props.stores,callback:this.loadDogs})),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0 pb-2 clearfix"},Object(n.h)("span",{class:"float-right"},Object(n.h)(h.a,{stores:this.props.stores,dog:{},callback:this.loadDogs}))))),Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-follow-up"},"Hunder som trenger oppfølging")),Object(n.h)("div",{class:"row"},o&&o.map(e=>Object(n.h)(d.a,{stores:this.props.stores,dog:e})),!o||0===o.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-follow-up"},"Ingen hunder som trenger ekstra oppfølging.")))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-special-needs"},"Hunder med spesielle behov")),Object(n.h)("div",{class:"row"},r&&r.map(e=>Object(n.h)(d.a,{stores:this.props.stores,dog:e})),!r||0===r.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-special-needs"},"Ingen hunder med spesielle behov.")))),Object(n.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mb-4"},Object(n.h)("h5",null,Object(n.h)(i.c,{id:"dogs.dog-with-maturity"},"Hunder med løpetid")),Object(n.h)("div",{class:"row"},c&&c.map(e=>Object(n.h)(d.a,{stores:this.props.stores,dog:e})),!c||0===c.length&&Object(n.h)("div",{class:"col-12 text-center text-muted"},Object(n.h)("h3",null,Object(n.h)("i",{class:"fas fa-thumbs-up"})),Object(n.h)(i.c,{id:"dogs.no-dogs-with-maturity"},"Ingen hunder med løpetid."))))))}})||o;t.default=O},"7g1v":function(e,t,s){"use strict";(function(e){var a,c=s("hosL"),o=s("Utv1"),n=s("/eY4"),r=(s("cneo"),s("OhSV")),i=s("wanP"),l=s("ZOvn");let h=Object(n.a)(a=class extends c.Component{render(){const{dog:t,showWorkout:s,showInfo:a,hideTeam:n=!1,fullWidth:h=!1,daysBack:d=7,filterBy:b=""}=this.props,{userStore:p,dogStore:m,workoutPlanStore:g}=this.props.stores;if(!t)return"";const{user:u}=p,{language:O="en"}=u,f=p.findDogstatus({status:t.status,language:O}),j=t.statuses?t.statuses.map(e=>p.findDogstatus({status:e,language:O})):[],v=p.findDogposition({position:t.position,language:O}),w=m.findCurrentWorkoutSummary(t.id)||{},y=o.a.getWeek(new Date),x=o.a.getYear(),k=(new Date).getMonth()+1,D=parseInt(k<8?x-1:x,10),{week:S=y,year:T=D}=this.props,P=g.sumWorkoutPlanDaysBack(parseInt(T,10),parseInt(S,10),d)||0,$=o.a.format(w.distanceKm||0,0),K=l.a.hasBirthday(t.birth);let L=!1,_=0;return $&&P&&(_=$/P*100,L=!0),Object(c.h)("div",{class:`${h?"":"col-4"} mb-3 ${L?"mt-2":""} position-relative`},Object(c.h)("div",{class:"text-center border border-secondary rounded-circle imageRounded mx-auto text-muted pt-2 position-relative",style:(t.image?`background-image: url("${t.image.s3SmallLink}"); background-size: cover;`:"")+" border-width: 2px !important;"},!t.image&&Object(c.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},o.a.ucfirst(t.name,!0)),L&&Object(c.h)("div",{class:"position-absolute",style:"top: -12px; left: -12px;"},Object(c.h)(i.a,{key:"gauge-"+_,radius:48,heightAdd:15,showPercentText:!1,percent:_,prefix:"%",total:P+" km",totalY:"95%",completed:$+" km",completedY:"85%"}))),Object(c.h)("div",{class:""+(L?"mt-4":""),style:"line-height: 1.0em;"},Object(c.h)("small",null,Object(c.h)("span",{class:"float-right"},t.birth&&Object(c.h)("span",{class:"mr-2"},o.a.age(t.birth,t.deceased)),"female"===t.gender?Object(c.h)("i",{class:"fas fa-venus"}):Object(c.h)("i",{class:"fas fa-mars"})),Object(c.h)("a",{class:"stretched-link",href:"/dogs/"+t.id},Object(c.h)("h5",{class:"mb-1 font-weight-light",style:"line-height: 1.0em; font-size: 1.3em;"},t.shortname||t.name,K&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-birthday-cake ml-3"})))),!n&&Object(c.h)(e,null,Object(c.h)("span",{class:"font-weight-light"},p.findTeam(t.team)),Object(c.h)("br",null))),b&&t.positions&&t.positions.lead&&Object(c.h)("div",{class:""},"leadOnly"===b&&t.positions.lead.distanceKm>0&&Object(c.h)("span",{class:"badge badge-success mr-2"},Object(c.h)("span",null,Object(c.h)(r.c,{id:"dogs.sort-lead"},"Lead"),":")," ",o.a.format(t.positions.lead.distanceKm,0)," km"),"pointOnly"===b&&t.positions.point.distanceKm>0&&Object(c.h)("span",{class:"badge badge-success mr-2"},Object(c.h)("span",null,Object(c.h)(r.c,{id:"dogs.sort-point"},"Point"),":")," ",o.a.format(t.positions.point.distanceKm,0)," km"),"teamOnly"===b&&t.positions.team.distanceKm>0&&Object(c.h)("span",{class:"badge badge-success mr-2"},Object(c.h)("span",null,Object(c.h)(r.c,{id:"dogs.sort-team"},"Team"),":")," ",o.a.format(t.positions.team.distanceKm,0)," km"),"wheelOnly"===b&&t.positions.wheel.distanceKm>0&&Object(c.h)("span",{class:"badge badge-success mr-2"},Object(c.h)("span",null,Object(c.h)(r.c,{id:"dogs.sort-wheel"},"Wheel"),":")," ",o.a.format(t.positions.wheel.distanceKm,0)," km")),Object(c.h)("small",null,s&&Object(c.h)("small",{class:"text-muted"},w&&w.distanceKm>0&&Object(c.h)("span",{class:"mr-2"},Object(c.h)("i",{class:"fas fa-road"})," ",o.a.format(w.distanceKm,0),"km"),w&&w.elevation>0&&Object(c.h)("span",{class:"mr-2"},Object(c.h)("i",{class:"fas fa-mountain"})," ",o.a.format(w.elevation,0),"m"),w&&w.duration>0&&Object(c.h)("span",{class:"mr-2"},Object(c.h)("i",{class:"fas fa-clock"})," ",o.a.secToHms(w.duration,!0)),w&&w.speedAvg>0&&Object(c.h)("span",{class:"mr-2"},Object(c.h)("i",{class:"fas fa-tachometer-alt"})," ",o.a.format(w.speedAvg,1),"km/t")),a&&Object(c.h)("small",{class:"text-muted"},t.weight&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-balance-scale ml-2"})," ",o.a.format(t.weight,1)," kg"),t.bodyScore&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-dog ml-2"})," ",o.a.format(t.bodyScore,1))),Object(c.h)("div",{class:"clearfix pb-0 pt-1"},v&&v.class&&Object(c.h)("span",{class:`badge badge-${v.class||"primary"} mr-2`},v.icon&&Object(c.h)("i",{class:v.icon})," ",v.name),t.specialNeeds&&Object(c.h)("span",{class:"badge badge-warning mr-2"},Object(c.h)("i",{class:"fas fa-exclamation-triangle"})," ",t.specialNeeds),f&&f.class&&Object(c.h)("span",{class:`badge badge-${f.class} mr-2 mt-1`},f.icon&&Object(c.h)("i",{class:f.icon})," ",f.name),j&&j.map(t=>Object(c.h)(e,null,t&&t.class&&Object(c.h)("span",{class:`badge badge-${t.class} mr-2 mt-1`},t.icon&&Object(c.h)("i",{class:t.icon})," ",t.name)))))))}})||a;t.a=h}).call(this,s("hosL").Fragment)},KDoM:function(e,t,s){"use strict";(function(e){var a,c=s("hosL"),o=s("Utv1"),n=s("/eY4"),r=s("OhSV"),i=s("nHdA"),l=s("irB3"),h=s("UwwE"),d=s("8Lgr"),b=(s("QkTp"),s("ZOvn"));let p=Object(n.a)(a=class extends c.Component{render(){const{dog:t}=this.props,{userStore:s,dogStore:a,appState:n}=this.props.stores,{user:p}=s,{language:m="en"}=p,{viewmode:g}=n,u=(new Date).getMonth()+1,O=(new Date).getFullYear(),{month:f=u,year:j=O}=this.props,v=parseInt(f<8?j-1:j,10),w=a.findWorkoutSummary(t.id,v)||{},y=t.statuses?t.statuses.map(e=>s.findDogstatus({status:e,language:m})):[],x=a.findVaccineStatuses(t.id),k=a.findVaccineLogStatuses(t.chipId),D=a.findHistoryStatuses(t.id),S=s.findDogstatus({status:t.status,language:m}),T=s.findDogposition({position:t.position,language:m}),P=[];s.findTeam(t.team)&&P.push(s.findTeam(t.team)),t.teams&&t.teams.forEach(e=>{s.findTeam(e)&&P.push(s.findTeam(e))});const $=b.a.hasBirthday(t.birth),K=t.birth?Math.ceil(b.a.daysUntilNextBirthday(t.birth)):365,{url:L="/dogs/"+t.id}=this.props;return Object(c.h)("div",{class:"w-100 mb-3"},Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 d-flex mb-0 position-relative"},Object(c.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:t.image?`background-image: url("${t.image.s3SmallLink}"); background-size: cover;`:""},!t.image&&Object(c.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},o.a.ucfirst(t.name,!0))),Object(c.h)("div",{class:"flex-grow-1 pl-3 pr-2",style:`border-right: 4px solid ${s.findHarness(t.harness,"colorNonstop")} !important; line-height: 1.2em;`},Object(c.h)("span",{class:"float-right"},T&&Object(c.h)("span",{class:`badge badge-${T.class||"primary"} mr-3`},T.icon&&Object(c.h)("i",{class:T.icon})," ",T.name),K<7&&Object(c.h)(e,null,Object(c.h)("span",{class:"text-muted mr-2"},Object(c.h)("i",{class:"fas fa-birthday-cake"})," in ",K," days")),t.birth&&Object(c.h)("span",{class:"mr-2"},o.a.age(t.birth,t.deceased)),"female"===t.gender?Object(c.h)("i",{class:"fas fa-venus"}):Object(c.h)("i",{class:"fas fa-mars"})),Object(c.h)("a",{class:"stretched-link",href:L},Object(c.h)("h5",{class:"mb-1",style:"line-height: 1.0em;"},t.shortname||t.name," ",t.shortname&&""!==t.shortname&&Object(c.h)(e,null," - ",Object(c.h)("span",{class:"font-weight-lighter"},t.name)),$&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-birthday-cake ml-3"})))),Object(c.h)("div",null,P&&P.length>0&&Object(c.h)("small",{class:"font-weight-lighter"},P.map((t,s)=>Object(c.h)(e,null,s>0?", ":"",t))),Object(c.h)("br",null)),Object(c.h)("small",{class:"text-muted"},t.history>0&&Object(c.h)("span",{class:"ml-0"},Object(c.h)("i",{class:"fas fa-file-signature"})," ",t.history.length),t.images>0&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-image"})," ",t.images.length),w&&w.distanceKm>0&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-road"})," ",Object(c.h)(d.a,{stores:this.props.stores,value:w.distanceKm})),w&&w.elevation>0&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-mountain"})," ",Object(c.h)(l.a,{stores:this.props.stores,value:w.elevation})),w&&w.duration>0&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-clock"})," ",o.a.secToHms(w.duration,!0)),w&&w.speedAvg>0&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-tachometer-alt"})," ",Object(c.h)(i.a,{stores:this.props.stores,value:w.speedAvg})),t.weight>0&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-balance-scale ml-2"})," ",Object(c.h)(h.a,{stores:this.props.stores,value:t.weight})),t.bodyScore>0&&Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-dog ml-2"})," ",o.a.format(t.bodyScore,1))),["beta","advanced","normal"].indexOf(g)>-1&&Object(c.h)(e,null,Object(c.h)("div",null,x&&x.map(e=>Object(c.h)("span",{class:"badge badge-success mr-2",title:o.a.isoDate(e.endDate,!1,!1,!0)},e.vaccineType,Object(c.h)("span",{class:"font-weight-light ml-3"},Object(c.h)("i",{class:"fas fa-calendar-check"})," ",o.a.isoDate(e.endDate,!1,!1,!0)))),D&&D.map(e=>Object(c.h)("span",{class:"badge badge-warning mr-2",title:o.a.isoDate(e.endDate,!1,!1,!0)},e.title)))),["beta","advanced"].indexOf(g)>-1&&Object(c.h)(e,null,t.positions&&t.positions.lead&&Object(c.h)("div",{class:""},t.positions.lead.distanceKm>0&&Object(c.h)("span",{class:"badge badge-secondary mr-2"},Object(c.h)("span",{class:"font-weight-lighter"},Object(c.h)(r.c,{id:"dogs.sort-lead"},"Lead"),":")," ",Object(c.h)(d.a,{stores:this.props.stores,value:t.positions.lead.distanceKm})),t.positions.point.distanceKm>0&&Object(c.h)("span",{class:"badge badge-secondary mr-2"},Object(c.h)("span",{class:"font-weight-lighter"},Object(c.h)(r.c,{id:"dogs.sort-point"},"Point"),":")," ",Object(c.h)(d.a,{stores:this.props.stores,value:t.positions.point.distanceKm})),t.positions.team.distanceKm>0&&Object(c.h)("span",{class:"badge badge-secondary mr-2"},Object(c.h)("span",{class:"font-weight-lighter"},Object(c.h)(r.c,{id:"dogs.sort-team"},"Team"),":")," ",Object(c.h)(d.a,{stores:this.props.stores,value:t.positions.team.distanceKm})),t.positions.wheel.distanceKm>0&&Object(c.h)("span",{class:"badge badge-secondary mr-2"},Object(c.h)("span",{class:"font-weight-lighter"},Object(c.h)(r.c,{id:"dogs.sort-wheel"},"Wheel"),":")," ",Object(c.h)(d.a,{stores:this.props.stores,value:t.positions.wheel.distanceKm})))),Object(c.h)("div",{class:"clearfix pb-0"},t.specialNeeds&&Object(c.h)("span",{class:"badge badge-warning ml-2 mt-1 float-right"},Object(c.h)("i",{class:"fas fa-exclamation-triangle"})," ",t.specialNeeds),S&&Object(c.h)("span",{class:`badge badge-${S.class} ml-2 mt-1 float-right`},S.icon&&Object(c.h)("i",{class:S.icon})," ",S.name),y&&y.map(t=>Object(c.h)(e,null,Object(c.h)("span",{class:`badge badge-${t.class} ml-2 mt-1 float-right`},t.icon&&Object(c.h)("i",{class:t.icon})," ",t.lang&&t.lang[m]?t.lang[m]:t.name)))),k&&k.length>0&&Object(c.h)(e,null,Object(c.h)("div",{class:"mt-2"},k&&k.filter(e=>e.chipId===t.chipId).map(e=>Object(c.h)("span",{class:`badge badge-${e.inKarens?"warning":"success"} mr-2 mb-1`},Object(c.h)("i",{class:"fas fa-user-md"})," ",e.vaccineAgens.name))))))))}})||a;t.a=p}).call(this,s("hosL").Fragment)},eK6s:function(e){e.exports={gaugeBackground:"gaugeBackground__1UGxt",gauge:"gauge__2ZDxd",success:"success__3UQxg",primary:"primary__3pPV6",secondary:"secondary__-Vrk_",info:"info__3t5zs",warning:"warning__1jHlR",danger:"danger__BLVC9",gaugeText:"gaugeText__1on-w"}},pJjI:function(e,t,s){"use strict";(function(e){var a,c=s("hosL"),o=s("Utv1"),n=s("/eY4"),r=s("OhSV");s("/DnB");let i=Object(n.a)(a=class extends c.Component{constructor(...e){super(...e),this.toggleTeam=e=>{const{callback:t,unsetTeamIfSelected:s=!0}=this.props,{dogStore:a,workoutStore:c}=this.props.stores,{currentTeam:n}=a;s&&e===n?(a.setCurrentTeam(void 0),c.setCurrentTeam(void 0)):(a.setCurrentTeam(e),c.setCurrentTeam(e)),o.a.isDefined(t)&&t()},this.showAllTeams=()=>{const{callback:e}=this.props,{dogStore:t,workoutStore:s}=this.props.stores;t.setCurrentTeam(void 0),s.setCurrentTeam(void 0),o.a.isDefined(e)&&e()}}render(){const{userStore:t,dogStore:s}=this.props.stores,{teams:a}=t,{currentTeam:o}=s,{highlight:n,showAll:i=!0}=this.props;return Object(c.h)("div",{class:"row mt-2"},Object(c.h)("div",{class:"w-100 overflow-hidden"},Object(c.h)("div",{class:"d-flex flex-row flex-nowrap pb-2 px-1 no-scrollbar",style:"overflow: auto; scroll-snap-type: x mandatory;"},a&&a.map((t,s)=>{let r;return 1===a.length?r="rounded-pill-both":0===s?r="rounded-pill-left":s+1===a.length&&(r="rounded-pill-right"),Object(c.h)("div",{class:"col mb-0 px-0 clearfix",key:t.id},Object(c.h)("button",{class:`btn btn-sm btn-block \n\t\t\t\t\t\t\t\t\t\t\trounded-none ${r}\n\t\t\t\t\t\t\t\t\t\t\t${o===t.id?"btn-success":"btn-outline-success"}\n\t\t\t\t\t\t\t\t\t\t\ttext-nowrap clearfix`,style:"text-overflow: ellipsis; overflow: hidden;",onClick:()=>this.toggleTeam(t.id)},Object(c.h)("i",{class:"fas fa-users"})," ",t.name,n&&n.indexOf(t.id)>-1&&Object(c.h)(e,null,o===t.id?Object(c.h)(e,null,Object(c.h)("i",{class:"fas fa-check float-right"})):Object(c.h)(e,null,Object(c.h)("div",{class:"spinner-grow text-warning float-right",role:"status"},Object(c.h)("span",{class:"sr-only"},"Loading...")),Object(c.h)("i",{class:"far fa-hand-point-left float-right",style:"font-size: 2.0em;"})))))})),i&&Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"col-12 mb-1 px-1 d-flex justify-content-center"},Object(c.h)("button",{class:"btn btn-sm rounded-lg btn-link text-nowrap clearfix",style:"text-overflow: ellipsis; overflow: hidden;",onClick:this.showAllTeams},Object(c.h)("i",{class:"fas fa-users"})," ",Object(c.h)(r.c,{id:"teams.show-all"},"Show all"))))))}})||a;t.a=i}).call(this,s("hosL").Fragment)},wanP:function(e,t,s){"use strict";(function(e){function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var o,n=s("hosL"),r=(s("Utv1"),s("/eY4")),i=s("eK6s"),l=s.n(i);const h={mouseData:{}};let d=Object(r.a)(o=class extends n.Component{constructor(e){super(e),this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},h),this.svgRef=null}render(){const{radius:t=50,heightAdd:s=0,color:a="success",showPercentText:c=!0,percent:o=0,prefix:r="",showCenterText:i=!1,centerText:h,centerTextSize:d,centerTextX:b,centerTextY:p,total:m="",totalY:g="90%",totalX:u="50%",totalTextAnchor:O="middle",completed:f="",completedY:j="65%",completedX:v="50%",completedTextAnchor:w="middle"}=this.props,y=.3*t,x=t-y/2,k=.3*t,D=2*x*Math.PI,S=.75*D,T=`${S} ${D}`,P=`rotate(135, ${t}, ${t})`,$=S-Math.min(Math.max(o,0),100)/100*S,K=d||t/2.5,L=t/5;return Object(n.h)(e,null,Object(n.h)("svg",{xmlns:"http://www.w3.org/2000/svg",class:l.a.svg,width:2*t,height:2*t+s,preserveAspectRatio:"none",ref:e=>this.svgRef=e},Object(n.h)("circle",{class:""+l.a.gaugeBackground,cx:t,cy:t,r:x,strokeWidth:y,strokeDasharray:T,strokeLinecap:"round",transform:P}),Object(n.h)("circle",{class:`${l.a[a]} ${l.a.gauge}`,cx:t,cy:t,r:x,stroke:"url(#grad)",strokeDasharray:T,strokeDashoffset:$,strokeLinecap:"round",strokeWidth:k,style:{transition:"stroke-dashoffset 0.3s"},transform:P}),c&&Object(n.h)("text",{class:`${l.a.gaugeText} ${l.a[a]}`,x:b||"50%",y:p||"50%","dominant-baseline":"middle","text-anchor":"middle","font-size":K},o," ",r),i&&Object(n.h)("text",{class:`${l.a.gaugeText} ${l.a[a]}`,x:b||"50%",y:p||"50%","dominant-baseline":"middle","text-anchor":"middle","font-size":K},h),f&&Object(n.h)("text",{class:`${l.a.gaugeText} ${l.a[a]}`,x:v,y:j,"dominant-baseline":"middle","text-anchor":w,"font-size":L},f),Object(n.h)("text",{class:`${l.a.gaugeText} ${l.a.secondary}`,x:u,y:g,"dominant-baseline":"middle","text-anchor":O,"font-size":L},m)))}})||o;t.a=d}).call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=71.chunk.1157a.esm.js.map