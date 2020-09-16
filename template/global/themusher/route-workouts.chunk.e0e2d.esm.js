(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{B7Gj:function(e,t,s){"use strict";s.r(t),function(e){function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function r(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var n,l,o=s("hosL"),c=s("Utv1"),i=s("/eY4"),h=s("JWe/"),d=s("bbv7");const u=["jan","feb","mar","apr","mai","jun","jul","aug","sep","okt","nov","des"],b={isLoading:!1};let m=Object(i.a)(n=class extends o.Component{constructor(...e){super(...e),this.toggleTeam=e=>{const{callback:t}=this.props,{workoutStore:s}=this.props.stores,{currentTeam:a}=s;s.setCurrentTeam(e===a?void 0:e),c.a.isDefined(t)&&t()}}render(){const{userStore:e,workoutStore:t}=this.props.stores,{teams:s}=e,{currentTeam:a}=t;return Object(o.h)("div",{class:"container-fluid px-0"},Object(o.h)("div",{class:"row"},s&&s.map(e=>Object(o.h)("div",{class:"col-6 mb-2"},Object(o.h)("div",{class:"border rounded rounded-pill px-3 py-2 "+(a===e.id?"bg-success":""),style:"line-height: 0.9em; cursor: pointer; pointer-events: inherit;",onClick:()=>this.toggleTeam(e.id)},Object(o.h)("small",null,Object(o.h)("i",{class:"fas fa-users mr-2"}),e.name))))))}})||n,g=Object(i.a)(l=class extends o.Component{constructor(e){var t;super(e),t=this,this.loadWorkouts=async function(){t.setState({isLoading:!0});const{workoutStore:e}=t.props.stores,{currentTeam:s}=e;await e.load({query:{team:s}}),await t.loadWorkoutSummary(),t.setState({isLoading:!1})},this.loadDogs=async function(){const{dogStore:e}=t.props.stores,{currentTeam:s}=e;await e.load({query:{team:s},addData:["workoutSummary"]})},this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){r(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},b),this.loadWorkouts(),this.loadDogs(),this.loadTracks()}async loadTracks(){const{trackStore:e}=this.props.stores;await e.load()}async loadWorkoutSummary(){const{userStore:e,workoutStore:t}=this.props.stores,{currentTeam:s}=t;await e.getWorkoutSummary(s)}render(){const{isLoading:t}=this.state,{trackStore:s,workoutStore:a,userStore:r,dogStore:n}=this.props.stores,{message:l}=this.props,{workouts:i}=a,{tracks:b}=s,{dogs:g}=n,{workoutSummary:f,graphWorkoutSummaryWeekDistanceCurrent:p,graphWorkoutSummaryWeekDistancePrev:j,graphWorkoutSummaryWeekElevationCurrent:O,graphWorkoutSummaryWeekElevationPrev:k}=r;return Object(o.h)("div",{class:"container-fluid",style:"margin-bottom: 200px; margin-top: 60px;"},l&&Object(o.h)("div",{class:"alert alert-success mb-3",role:"alert"},Object(o.h)("i",{class:"fas fa-check"})," ",l),Object(o.h)("div",{class:"row"},Object(o.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 border-bottom"},Object(o.h)(m,{stores:this.props.stores,callback:this.loadWorkouts})),Object(o.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 mt-2 mb-2"},Object(o.h)("a",{class:"btn btn-primary btn-sm float-right",href:"/workouts/edit/new"},Object(o.h)("i",{class:"fas fa-plus"})," Legg til treningstur")),Object(o.h)("div",{class:"col-12"},f&&f.length>0&&Object(o.h)(e,null,Object(o.h)("h5",null,"Trenings statistikk"),Object(o.h)("div",{class:"w-100 mt-3 mb-4"},Object(o.h)("small",{class:"mb-4"},Object(o.h)("small",null,Object(o.h)("table",{class:"table table-sm font-weigth-lighter border-bottom"},Object(o.h)("thead",null,Object(o.h)("tr",null,Object(o.h)("th",{style:"padding: .2rem;"},"Mnd"),c.a.range(1,12).map(e=>Object(o.h)("th",{class:"text-right",style:"padding: .2rem;"},u[e-1])))),Object(o.h)("tbody",null,Object(o.h)("tr",null,Object(o.h)("th",{scope:"row",style:"padding: .2rem;"},"2019"),c.a.range(1,12).map(t=>Object(o.h)(e,null,Object(o.h)("td",{class:"text-right",style:"padding: .2rem;"},r.findWorkoutSummaryMonth(2019,t),Object(o.h)("br",null),r.findWorkoutSummaryMonth(2019,t,"elevation"),Object(o.h)("br",null)))),Object(o.h)("td",{class:"text-muted",style:"padding: .2rem;"},Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-road"})," km"),Object(o.h)("br",null),Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-mountain"})," m"),Object(o.h)("br",null))),Object(o.h)("tr",null,Object(o.h)("th",{scope:"row",style:"padding: .2rem;"},"2020"),c.a.range(1,12).map(t=>Object(o.h)(e,null,Object(o.h)("td",{class:"text-right",style:"padding: .2rem;"},r.findWorkoutSummaryMonth(2020,t),Object(o.h)("br",null),r.findWorkoutSummaryMonth(2020,t,"elevation"),Object(o.h)("br",null)))),Object(o.h)("td",{class:"text-muted",style:"padding: .2rem;"},Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-road"})," km"),Object(o.h)("br",null),Object(o.h)("nobr",null,Object(o.h)("i",{class:"fas fa-mountain"})," m"),Object(o.h)("br",null))))))),Object(o.h)(d.a,{stores:this.props.stores,width:500,height:150,showXTicks:1,xTicksVal:e=>"uke "+e,paddingTop:30,lineFromXzero:!0,lineFromXmax:!0,dataLeft:[p,j],legendLeft:["2020 Distanse","2019 Distanse"],showYTicksLeft:1,yTicksLeftPostfix:"km",unitLeft:["km","km"],avgWindowLeft:[0,0],smoothLeft:[0,0],dataRight:[O,k],legendRight:["2020 Høydemeter","2019 Høydemeter"],showYTicksRight:1,yTicksRightPostfix:"m",unitRight:["m","m"],avgWindowRight:[0,0],smoothRight:[0,0]}))),p&&p.length<2&&Object(o.h)("div",{class:"mb-5 py-3 border-top border-bottom"},Object(o.h)("div",{class:"text-left",style:"line-height: 1.0em;"},Object(o.h)("div",{class:"display-4 float-left text-warning mr-3"},Object(o.h)("i",{class:"fas fa-paw"})),Object(o.h)("small",null,"Foreløpig er det litt lite data for å kunne vise noen fine grafer. Etterhvert som du legger inn flere treninger så vil dette bli en fin tabell og graf som viser progresjonen din."))),Object(o.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 px-0"},Object(o.h)("h5",null,"Treningsturene - ",i.length," stk")),!t&&i&&0===i.length&&Object(o.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 text-muted"},g&&0===g.length&&Object(o.h)("div",{class:"mb-5 py-3 text-center border-top border-bottom"},Object(o.h)("div",{class:"display-4"},Object(o.h)("i",{class:"fas fa-dog"})),Object(o.h)("h5",null,"Ingen hunder er registert."),"Det er lurt å legge inn hunder før du registrerer en treningstur.",Object(o.h)("br",null),Object(o.h)("a",{class:"btn btn-info mt-3",href:"/dogs/edit/new"},Object(o.h)("i",{class:"fas fa-dog"})," Legg til hund")),b&&0===b.length&&Object(o.h)("div",{class:"mb-5 py-3 text-center border-top border-bottom"},Object(o.h)("div",{class:"display-4"},Object(o.h)("i",{class:"fas fa-map-marked"})),Object(o.h)("h5",null,"Ingen runder er registert."),"Det er lurt å legge inn runden før du registrerer en treningstur. Da får du automatisk fylt ut distanse og høydemeter.",Object(o.h)("br",null),"Dersom du ikke har GPX-filen fra denne runden, så kan du likevel registrere treningen.",Object(o.h)("br",null),Object(o.h)("a",{class:"btn btn-info mt-3",href:"/tracks/edit/new"},Object(o.h)("i",{class:"fas fa-map-marked"})," Legg til runde")),Object(o.h)("div",{class:"text-center mb-5"},Object(o.h)("div",{class:"display-1"},Object(o.h)("i",{class:"fas fa-running"})),Object(o.h)("h5",null,"Ingen treningsturer er registrert ennå.")),Object(o.h)("p",{class:"text-center"},"Tracking i appen er ikke helt klart ennå pga noen tekniske begrensninger i Apple iOS. Når jeg får tak i en Android telefon skal jeg får satt opp denne funksjonen slik at den kan brukes der."),Object(o.h)("p",{class:"text-center"},"Kart over ruten du har kjørt legges inn som GPX under runder."),"Slik kommer du i gang:",Object(o.h)("ol",null,Object(o.h)("li",null,'Trykk på knappen "Legg til treningstur" oppe til høyre.'))),i&&i.map(e=>Object(o.h)(h.a,{stores:this.props.stores,workout:e})))))}})||l;t.default=g}.call(this,s("hosL").Fragment)},"JWe/":function(e,t,s){"use strict";function a(e){switch(e.type){case 1:return"border-primary";case 2:return"border-danger";case 3:return"border-success";default:return"border-warning"}}function r(e){switch(e.type){case 1:return"fas fa-running";case 2:return"fas fa-flag-checkered";case 3:default:return"fas fa-hiking"}}var n,l=s("hosL"),o=s("Utv1"),c=s("/eY4"),i=s("UJvz");let h=Object(c.a)(n=class extends l.Component{constructor(...e){super(...e),this.showModal=e=>{e.stopPropagation(),e.preventDefault();this.setState({displayModal:!0,currentImage:e.target.dataset.image,currentImageXXL:e.target.dataset.imagexxl,thumb:e.target.dataset.thumb,name:e.target.dataset.name,title:e.target.dataset.title,date:e.target.dataset.date})},this.closeModal=()=>{this.setState({displayModal:!1})},this.toggleDate=()=>{const{showDate:e}=this.state;this.setState({showDate:!e})}}render(){const{displayModal:e,currentImage:t,currentImageXXL:s,showDate:n,thumb:c,name:h,title:d,date:u}=this.state,{workout:b}=this.props,{userStore:m}=this.props.stores;return Object(l.h)("div",{class:"w-100 mb-3"},Object(l.h)("div",{class:"row"},e&&Object(l.h)(i.a,{close:this.closeModal,image:t,imagexxl:s,thumb:c,name:h,title:d,date:u}),Object(l.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 d-flex mb-0 position-relative"},Object(l.h)("div",{class:"text-center border rounded-circle imageRounded "+a(b),style:(b.image?`background-image: url("${b.image.s3SmallLink}");`:"")+" border-width: 3px !important;"},!b.image&&Object(l.h)("i",{class:r(b)+" text-muted mt-3",style:"font-size: 40px;"})),Object(l.h)("div",{class:"flex-grow-1 pl-3",style:"line-height: 1.0em;"},Object(l.h)("a",{class:"stretched-link",href:"/workouts/"+b.id},Object(l.h)("h5",{class:"my-0"},b.name)),Object(l.h)("span",{class:"font-weight-light"},m.findTeam(b.team)),Object(l.h)("br",null),Object(l.h)("small",{class:"text-muted"},b.date&&Object(l.h)("small",{onClick:this.toggleDate},n?o.a.formatDate(b.date,{locale:"no-NB"}):o.a.formatDistance(b.date,new Date,{locale:"no-NB"}),Object(l.h)("br",null))),Object(l.h)("small",null,Object(l.h)("span",{class:"text-muted"},Object(l.h)("i",{class:"fas fa-tools"})," ",m.findEquipment(b.equipment)||b.equipment,Object(l.h)("i",{class:"fas fa-road ml-2"})," ",b.distanceKm,"km",Object(l.h)("i",{class:"fas fa-mountain ml-2"})," ",b.elevation,"m",Object(l.h)("i",{class:"fas fa-tachometer-alt ml-2"})," ",o.a.format(b.speedAvg,1),"km/t",b.dogs&&Object(l.h)("span",null,Object(l.h)("i",{class:"fas fa-dog ml-2"})," ",b.dogs.length)),Object(l.h)("i",null,b.url),Object(l.h)("br",null)))),Object(l.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mt-1",style:"padding-left: 122px;"},Object(l.h)("div",{class:"row"},b.images&&b.images.map(e=>Object(l.h)("div",{class:"text-center border rounded imageRounded imageRoundedSmall",style:e?`background-image: url("${e.s3SmallLink}");`:"",onClick:this.showModal,"data-image":e.s3LargeLink,"data-imagexxl":e.s3XXLargeLink,"data-thumb":b.image&&b.image.s3SmallLink,"data-name":m.findTeam(b.team),"data-title":b.name,"data-date":b.date}," "))))))}})||n;t.a=h}}]);
//# sourceMappingURL=route-workouts.chunk.e0e2d.esm.js.map