(window.webpackJsonp=window.webpackJsonp||[]).push([[12],{"6a5D":function(e,t,s){"use strict";function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var o,n=s("hosL"),l=s("ox/y"),r=(s("Utv1"),s("/eY4")),i=(s("go65"),s("Y3FI")),h=s("OhSV");const b={menu:{profile:!1,main:!1},searchText:""};let d=Object(r.a)(o=class extends n.Component{constructor(e){var t;super(e),t=this,this.toggleDropdown=e=>{const{menu:t}=this.state;let s=e.target.dataset.name;!s&&e.target.parentNode&&(s=e.target.parentNode.dataset.name),s&&(t[s]=!t[s]),this.setState({menu:t})},this.toggleDarkmode=e=>{const{appState:t}=this.props.stores;t.toggleDarkmode(),this.toggleDropdown(e)},this.toggleViewmode=e=>{const{appState:t}=this.props.stores;let s=e.target.dataset.mode;!s&&e.target.parentNode&&(s=e.target.parentNode.dataset.mode),t.toggleViewmode(s),this.toggleDropdown(e)},this.reloadApp=()=>{window.location.reload(!0)},this.adminLoadAll=async function(){const{userStore:e}=t.props.stores;await e.getInfo(!0)},this.changeLanguage=e=>{const t=e.target.value;console.log("changeLanguage",t);const{appState:s,userStore:a}=this.props.stores,{user:c={}}=a;c.email&&a.setLanguage({email:c.email,language:t}),s.setLanguage(t)},this.search=()=>{const{searchText:e}=this.state;Object(i.route)("/search/"+e,!0)},this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},b)}render(){const{menu:e}=this.state,{appState:t,userStore:s}=this.props.stores,{darkmode:a}=t,{user:c,notifications:o=[]}=s,{language:r="no"}=(o.filter(e=>!e.read),c);return Object(n.h)("nav",{class:"navbar navbar-expand-lg navbar-themed fixed-top",style:"z-index: 99999;"},Object(n.h)("a",{class:"navbar-brand",href:"/veterinary"},Object(n.h)("img",{src:"./assets/logo.png",height:"37",class:"position-absolute",style:"top: 10px; left: 6px"}),Object(n.h)("span",{class:"font-weight-normal",style:"margin-left: 30px; font-size: 25px;"},"The Musher")),Object(n.h)("button",{class:"navbar-toggler",type:"button","data-name":"main",onClick:this.toggleDropdown},Object(n.h)("span",{class:"navbar-toggler-icon"})),Object(n.h)("div",{class:"collapse navbar-collapse "+(e.main?"show":""),id:"navbarSupportedContent"},Object(n.h)("ul",{class:"navbar-nav mr-auto ml-5"}),Object(n.h)("ul",{class:"navbar-nav ml-auto "},Object(n.h)("li",{class:"nav-item mr-2"},Object(n.h)("div",{class:"form-row align-items-center"},Object(n.h)("div",{class:"col-auto my-1",style:"width: 80px;"},Object(n.h)("select",{class:"custom-select",style:"background-color: inherit; border: none; padding: 0; height: 1.1em; font-size: 0.9em;",onInput:this.changeLanguage},Object(n.h)("option",{value:"no",selected:"no"===r},"🇳🇴 NO"),Object(n.h)("option",{value:"en",selected:"en"===r},"🇬🇧 EN"),Object(n.h)("option",{value:"de",selected:"de"===r},"🇩🇪 DE"))))),Object(n.h)("li",{class:"nav-item d-block d-lg-none"},Object(n.h)(l.Link,{className:"nav-link",activeClassName:"active","data-name":"main",onClick:this.toggleDarkmode},Object(n.h)("i",{class:(a?"fas text-warning":"far")+" fa-moon"})," ",Object(n.h)(h.c,{id:"header.darkmode"},"Nattmodus"))),Object(n.h)("li",{class:"nav-item mr-2 d-none d-lg-block"},Object(n.h)("button",{class:"btn btn-link","data-name":"profile",onClick:this.toggleDarkmode},Object(n.h)("i",{class:(a?"fas text-warning":"far")+" fa-moon"}))))))}})||o;t.a=d},atwK:function(e,t,s){"use strict";s.r(t),function(e){function a(e,t){var s=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),s.push.apply(s,a)}return s}function c(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var o,n,l,r=s("hosL"),i=(s("QRet"),s("Utv1")),h=s("/eY4"),b=s("OhSV"),d=s("go65"),p=(s("fh8t"),s("6a5D")),g=s("ZOvn");const u=g.a.marginTop(!0),O=g.a.marginBottom(),m=(g.a.subMenuMarginTop(),g.a.getVaccineTypes(),{isLoading:!1,email:"",submenu:"ads",jwtToken:i.a.getJwtToken()});let j=Object(h.a)(o=class extends r.Component{constructor(...e){var t;super(...e),t=this,this.selectTeam=async function(e){e.preventDefault();t.setState({displayTeam:parseInt(e.target.value,10)})}}render(){const{teams:t=[]}=this.props,{userStore:s}=this.props.stores,{isLoading:a}=s,c=t[0]?t[0]:{},{displayTeam:o=c.id}=this.state;return Object(r.h)("div",{class:"bg-light p-4"},a.getDogs?Object(r.h)(e,null,"Loading..."):Object(r.h)(e,null,Object(r.h)("label",{for:"team"},Object(r.h)("i",{class:"fas fa-users"})," ",Object(r.h)(b.c,{id:"dog.veterinary-team"},"Team")),Object(r.h)("select",{class:"form-control form-control-lg mb-2",id:"team",onChange:this.selectTeam},Object(r.h)("option",{value:""},"-- Choose team --"),t&&t.map(t=>Object(r.h)(e,null,Object(r.h)("option",{value:t.id},t.name)))),t&&t.map(t=>Object(r.h)(e,null,o===t.id&&Object(r.h)(e,null,Object(r.h)(f,{stores:this.props.stores,dogs:t.dogs}))))))}})||o,f=Object(h.a)(n=class extends r.Component{constructor(e){super(e),this.selectDog=e=>{const{id:t}=e.target.closest("tr").dataset,{selectedDogs:s}=this.state,a=parseInt(t,10),c=s.indexOf(a);-1===c?s.push(a):s.splice(c,1),this.setState({selectedDogs:s})},this.selectDogSection=e=>{const{id:t}=e.target.closest("section").dataset,{selectedDogs:s}=this.state,a=parseInt(t,10),c=s.indexOf(a);-1===c?s.push(a):s.splice(c,1),this.setState({selectedDogs:s})},this.selectAllDogs=()=>{const{dogs:e}=this.props,t=e.map(e=>e.id);this.setState({selectedDogs:t})},this.removeAllDogs=()=>{this.setState({selectedDogs:[]})},this.state={selectedDogs:[]}}render(){const{selectedDogs:t}=this.state,{userStore:s}=this.props.stores,{vaccineStatuses:a}=s,{dogs:c}=this.props;return Object(r.h)("div",{class:"table-responsive mt-3"},t&&t.length>0&&Object(r.h)(e,null,Object(r.h)("label",{for:"team"},Object(r.h)("i",{class:"fas fa-dog"})," ",Object(r.h)(b.c,{id:"dog.veterinary-choosen-dogs"},"Valgte hunder")),Object(r.h)("div",{class:"d-flex flex-wrap"},c&&c.map(s=>{let a;s.images&&s.images[0]&&(a=s.images[0]),s.image&&(a=s.image);return t.indexOf(s.id)>-1?Object(r.h)(e,null,Object(r.h)("section",{class:"text-overflow p-2 position-relative",onClick:this.selectDogSection,"data-id":s.id,style:"width: 90px;"},Object(r.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:""+(a?`background-image: url('${a.s3ThumbLink}');`:"")},!a&&Object(r.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},i.a.ucfirst(s.name,!0))),Object(r.h)("small",null,s.name),Object(r.h)("div",{class:"position-absolute",style:"top: 0px; right: 0px;"},Object(r.h)("i",{class:"fas fa-times-circle text-danger"})))):""})),Object(r.h)("div",{class:"form-row align-items-center"},Object(r.h)("div",{class:"col-12"},Object(r.h)("label",{for:"vaccineTypeInput"},Object(r.h)("i",{class:"fas fa-syringe"})," ",Object(r.h)(b.c,{id:"dog.addlog.vaccine-type"},"Vaksinetype")),Object(r.h)("select",{class:"form-control form-control-lg mb-2",id:"vaccineTypeInput","aria-describedby":"vaccineTypeHelp",onInput:Object(d.a)(this,"vaccineType"),autocomplete:"off"},Object(r.h)("option",{value:""},"-- ",Object(r.h)(b.c,{id:"dog.addlog.choose-vaccine"},"Velg vaksinetype")," --"),Object(r.h)("option",{value:"rabies"},Object(r.h)(b.c,{id:"dog.addlog.rabies"},"Rabies (3 år)")),Object(r.h)("option",{value:"deworming"},Object(r.h)(b.c,{id:"dog.addlog.deworming"},"Ormekur")),Object(r.h)("option",{value:"BbPi"},Object(r.h)(b.c,{id:"dog.addlog.BbPi"},"BbPi - Nesevaksine (1 år)")),Object(r.h)("option",{value:"DHP"},Object(r.h)(b.c,{id:"dog.addlog.DHP"},"DHP (3 år)")),Object(r.h)("option",{value:"DHPPi"},Object(r.h)(b.c,{id:"dog.addlog.DHPPi"},"DHPPi (3 år)")))),Object(r.h)("div",{class:"col-12 pt-4"},Object(r.h)("button",{type:"button",class:"btn btn-lg btn-block btn-danger mb-2",onClick:this.searchForMusher},"Add vaccine to ",t.length," dogs")))),Object(r.h)("button",{class:"btn btn-lg btn-block btn-outline-success mt-5",onClick:this.selectAllDogs},"Select all dogs"),t&&t.length>0&&Object(r.h)(e,null,Object(r.h)("button",{class:"btn btn-sm btn-block btn-link",onClick:this.removeAllDogs},"Remove all dogs")),Object(r.h)("table",{class:"table table-striped"},Object(r.h)("thead",null,Object(r.h)("tr",null,Object(r.h)("th",{scope:"col",style:"width: 100px;"}," "),Object(r.h)("th",{scope:"col"},"Name"))),Object(r.h)("tbody",null,c&&c.map(s=>{let c;s.images&&s.images[0]&&(c=s.images[0]),s.image&&(c=s.image);const o=t.indexOf(s.id)>-1;return Object(r.h)(e,null,Object(r.h)("tr",{class:"pointerCursor",onClick:this.selectDog,"data-id":s.id},Object(r.h)("td",{class:"position-relative"},Object(r.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:""+(c?`background-image: url('${c.s3ThumbLink}');`:"")},!c&&Object(r.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},i.a.ucfirst(s.name,!0))),o&&Object(r.h)("span",{class:"position-absolute display-4",style:"top: 0px; left: 0px;"},Object(r.h)("i",{class:"fas fa-check text-success"}))),Object(r.h)("td",null,Object(r.h)("span",{class:"float-right"},s.birth&&Object(r.h)("span",{class:"mr-2"},i.a.age(s.birth,s.deceased)),"female"===s.gender?Object(r.h)("i",{class:"fas fa-venus"}):Object(r.h)("i",{class:"fas fa-mars"})),Object(r.h)("h5",null,s.name," ",s.shortname&&Object(r.h)("span",{class:"font-weight-lighter"}," - '",s.shortname,"'")),Object(r.h)("div",null,s.chipId&&Object(r.h)("small",null,Object(r.h)("i",{class:"fas fa-microchip"})," ",s.chipId)),Object(r.h)("div",null,a&&a.filter(e=>e.dogId===s.id).map(e=>Object(r.h)("span",{class:"badge badge-success mr-2",title:i.a.isoDate(e.endDate,!1,!1,!0)},e.vaccineType))))))}))))}})||n,v=Object(h.a)(l=class extends r.Component{constructor(e){var t;super(e),t=this,this.searchForMusher=async function(){const{userStore:e}=t.props.stores,{search:s}=t.state;t.setState({isSearcing:!0,displayUser:null}),await e.searchUsers({search:s}),t.setState({isSearcing:!1})},this.selectMusher=async function(e){const{id:s}=e.target.closest("tr").dataset,{displayUser:a}=t.state,c=parseInt(s,10);if(a===c)t.setState({displayUser:null});else{t.setState({displayUser:c});const{userStore:e}=t.props.stores;await e.getDogs({id:c})}},this.state=function(e){for(var t=1;t<arguments.length;t++){var s=null!=arguments[t]?arguments[t]:{};t%2?a(Object(s),!0).forEach((function(t){c(e,t,s[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(s)):a(Object(s)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(s,t))}))}return e}({},m)}componentDidMount(){}componentWillReceiveProps(e){}render(){const{displayUser:t,isSearcing:s}=this.state,{appState:a,userStore:c}=this.props.stores,{isVeterinary:o,searchUsersResult:n,searchUserTeams:l}=c,{language:h="no"}=a,{col:b=12,offset:m=0}=this.props;return o?Object(r.h)(e,null,Object(r.h)(p.a,{stores:this.props.stores}),Object(r.h)("div",{class:"container-fluid",style:`margin-bottom: ${O}; margin-top: ${u};`},Object(r.h)("div",{class:"row"},Object(r.h)("div",{class:`col-${b} offset-${m} col-sm-8 col-lg-8 offset-sm-2 offset-lg-2`},Object(r.h)("h1",null,"Veterinary search"),Object(r.h)("form",{onSubmit:this.searchForMusher},Object(r.h)("div",{class:"form-row align-items-center"},Object(r.h)("div",{class:"col-10"},Object(r.h)("label",{class:"sr-only",for:"vetSearch"},"Name"),Object(r.h)("input",{type:"text",class:"form-control form-control-lg mb-2",id:"vetSearch",placeholder:"Search for musher by email, cellphone or name...",onInput:Object(d.a)(this,"search")})),Object(r.h)("div",{class:"col-2"},Object(r.h)("button",{type:"button",class:"btn btn-lg btn-primary mb-2",onClick:this.searchForMusher},"Search"))))),Object(r.h)("div",{class:`col-${b} offset-${m} col-sm-8 col-lg-8 offset-sm-2 offset-lg-2`},s&&Object(r.h)(e,null,"Searcing..."),n&&0!==n.length?Object(r.h)("div",{class:"table-responsive"},Object(r.h)("table",{class:"table table-striped"},Object(r.h)("thead",null,Object(r.h)("tr",null,Object(r.h)("th",{scope:"col",style:"width: 100px;"}," "),Object(r.h)("th",{scope:"col"},"Name"),Object(r.h)("th",{scope:"col"},"Cellphone"),Object(r.h)("th",{scope:"col"},"Email"))),Object(r.h)("tbody",null,n&&n.filter(e=>!t||e.id===t).map(s=>{let a;return s.images&&s.images[0]&&(a=s.images[0]),s.image&&(a=s.image),Object(r.h)(e,null,Object(r.h)("tr",{class:"pointerCursor",onClick:this.selectMusher,"data-id":s.id},Object(r.h)("td",null,Object(r.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:""+(a?`background-image: url('${a.s3ThumbLink}');`:"")},!a&&Object(r.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},s.firstname?Object(r.h)(e,null,i.a.ucfirst(s.firstname,!0),i.a.ucfirst(s.lastname,!0)):Object(r.h)(e,null,i.a.ucfirst(s.email,!0))))),Object(r.h)("td",null,s.firstname," ",s.lastname,Object(r.h)("br",null),s.facebook&&Object(r.h)("a",{class:"mr-2",href:g.a.asFacebookLink(s.facebook),target:"_blank",rel:"noreferrer"},Object(r.h)("i",{class:"fab fa-facebook-square"})),s.instagram&&Object(r.h)("a",{class:"mr-2",href:g.a.asInstagramLink(s.instagram),target:"_blank",rel:"noreferrer"},Object(r.h)("i",{class:"fab fa-instagram"}))),Object(r.h)("td",null,s.cellphone),Object(r.h)("td",null,s.email)),t===s.id&&Object(r.h)(e,null,Object(r.h)("tr",null,Object(r.h)("td",{colspan:"4"},Object(r.h)(j,{stores:this.props.stores,teams:l})))))})))):Object(r.h)(e,null," "))))):Object(r.h)(e,null,Object(r.h)("div",{class:"container-fluid h-100"},Object(r.h)("div",{class:"row h-100"},Object(r.h)("div",{class:"col-12 text-center my-auto"},Object(r.h)("div",{class:"display-1 text-danger"},Object(r.h)("i",{class:"fas fa-hand-paper"})),Object(r.h)("h5",null,"No access!"),Object(r.h)("p",null,"All attempts are logged and reported."),Object(r.h)("a",{class:"mt-3 btn btn-lg btn-primary",href:"/"},"Go to the frontpage")))))}})||l;t.default=v}.call(this,s("hosL").Fragment)}}]);
//# sourceMappingURL=route-veterinary.chunk.a70a4.esm.js.map