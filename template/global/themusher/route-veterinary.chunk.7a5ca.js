(window.webpackJsonp=window.webpackJsonp||[]).push([[13],{"6a5D":function(e,t,a){"use strict";function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var s,r=a("hosL"),o=a("ox/y"),i=(a("Utv1"),a("/eY4")),l=(a("go65"),a("Y3FI")),h=a("OhSV"),d={menu:{profile:!1,main:!1},searchText:""};Object(i.a)(s=function(e){function t(t){var a;return(a=e.call(this,t)||this).toggleDropdown=function(e){var t=a.state.menu,n=e.target.dataset.name;!n&&e.target.parentNode&&(n=e.target.parentNode.dataset.name),n&&(t[n]=!t[n]),a.setState({menu:t})},a.toggleDarkmode=function(e){a.props.stores.appState.toggleDarkmode(),a.toggleDropdown(e)},a.toggleViewmode=function(e){var t=e.target.dataset.mode;!t&&e.target.parentNode&&(t=e.target.parentNode.dataset.mode),a.props.stores.appState.toggleViewmode(t),a.toggleDropdown(e)},a.reloadApp=function(){window.location.reload(!0)},a.adminLoadAll=function(){return new Promise((function(e,t){return Promise.resolve(a.props.stores.userStore.getInfo(!0)).then((function(){try{return e()}catch(e){return t(e)}}),t)}))},a.changeLanguage=function(e){var t=e.target.value;console.log("changeLanguage",t);var n=a.props.stores,c=n.appState,s=n.userStore,r=s.user,o=void 0===r?{}:r;o.email&&s.setLanguage({email:o.email,language:t}),c.setLanguage(t)},a.search=function(){var e=a.state.searchText;Object(l.route)("/search/"+e,!0)},a.state=function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){c(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},d),a}var a,s;return s=e,(a=t).prototype=Object.create(s.prototype),a.prototype.constructor=a,a.__proto__=s,t.prototype.render=function(){var e=this.state,t=e.menu,a=this.props.stores,n=a.appState,c=a.userStore,s=n.darkmode,i=c.user,l=c.notifications,d=((void 0===l?[]:l).filter((function(e){return!e.read})),i.language),b=void 0===d?"no":d;return Object(r.h)("nav",{class:"navbar navbar-expand-lg navbar-themed fixed-top",style:"z-index: 99999;"},Object(r.h)("a",{class:"navbar-brand",href:"/"},Object(r.h)("img",{src:"./assets/logo.png",height:"37",class:"position-absolute",style:"top: 10px; left: 6px"}),Object(r.h)("span",{class:"font-weight-normal",style:"margin-left: 30px; font-size: 25px;"},"The Musher")),Object(r.h)("button",{class:"navbar-toggler",type:"button","data-name":"main",onClick:this.toggleDropdown},Object(r.h)("span",{class:"navbar-toggler-icon"})),Object(r.h)("div",{class:"collapse navbar-collapse "+(t.main?"show":""),id:"navbarSupportedContent"},Object(r.h)("ul",{class:"navbar-nav mr-auto ml-5"}),Object(r.h)("ul",{class:"navbar-nav ml-auto "},Object(r.h)("li",{class:"nav-item mr-2"},Object(r.h)("div",{class:"form-row align-items-center"},Object(r.h)("div",{class:"col-auto my-1",style:"width: 80px;"},Object(r.h)("select",{class:"custom-select",style:"background-color: inherit; border: none; padding: 0; height: 1.1em; font-size: 0.9em;",onInput:this.changeLanguage},Object(r.h)("option",{value:"no",selected:"no"===b},"🇳🇴 NO"),Object(r.h)("option",{value:"en",selected:"en"===b},"🇬🇧 EN"),Object(r.h)("option",{value:"de",selected:"de"===b},"🇩🇪 DE"))))),Object(r.h)("li",{class:"nav-item d-block d-lg-none"},Object(r.h)(o.Link,{className:"nav-link",activeClassName:"active","data-name":"main",onClick:this.toggleDarkmode},Object(r.h)("i",{class:(s?"fas text-warning":"far")+" fa-moon"})," ",Object(r.h)(h.c,{id:"header.darkmode"},"Nattmodus"))),Object(r.h)("li",{class:"nav-item mr-2 d-none d-lg-block"},Object(r.h)("button",{class:"btn btn-link","data-name":"profile",onClick:this.toggleDarkmode},Object(r.h)("i",{class:(s?"fas text-warning":"far")+" fa-moon"}))))))},t}(r.Component))},atwK:function(e,t,a){"use strict";a.r(t),function(e){function n(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function c(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?n(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):n(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,e.__proto__=t}var o,i,l,h=a("hosL"),d=(a("QRet"),a("Utv1")),b=a("/eY4"),u=a("OhSV"),g=a("go65"),p=(a("fh8t"),a("cneo"),a("6a5D"),a("ZOvn")),O=p.a.marginTop(!0),m=p.a.marginBottom(),j=(p.a.subMenuMarginTop(),p.a.getVaccineTypesVet()),f=d.a.getApiServer(),v={isLoading:!1,email:"",submenu:"ads",jwtToken:d.a.getJwtToken()},y=Object(b.a)(o=function(t){function a(){for(var e,a=arguments.length,n=new Array(a),c=0;c<a;c++)n[c]=arguments[c];return(e=t.call.apply(t,[this].concat(n))||this).selectTeam=function(t){return new Promise((function(a){return t.preventDefault(),e.setState({displayTeam:parseInt(t.target.value,10)}),a()}))},e}return r(a,t),a.prototype.render=function(){var t=this,a=this.props,n=a.teams,c=void 0===n?[]:n,s=a.displayUser,r=this.props.stores.userStore.isLoading,o=this.state.displayTeam,i=void 0===o?(c[0]?c[0]:{}).id:o;return Object(h.h)("div",{class:"bg-light p-4"},r.getDogs?Object(h.h)(e,null,"Loading..."):Object(h.h)(e,null,Object(h.h)("label",{for:"team"},Object(h.h)("i",{class:"fas fa-users"})," ",Object(h.h)(u.c,{id:"dog.veterinary.team"},"Team")),Object(h.h)("select",{class:"form-control form-control-lg mb-2",id:"team",onChange:this.selectTeam},Object(h.h)("option",{value:""},"-- ",Object(h.h)(u.c,{id:"dog.veterinary.choose-team"},"Choose team")," --"),c&&c.map((function(t){return Object(h.h)(e,null,Object(h.h)("option",{value:t.id},t.name))}))),c&&c.map((function(a){return Object(h.h)(e,null,i===a.id&&Object(h.h)(e,null,Object(h.h)(k,{stores:t.props.stores,dogs:a.dogs,displayUser:s})))}))))},a}(h.Component))||o,k=Object(b.a)(i=function(t){function a(e){var a;return(a=t.call(this,e)||this).selectDog=function(e){var t=e.target.closest("tr").dataset.id,n=a.state,c=n.selectedDogs,s=n.missingChipId,r=parseInt(t,10),o=c.indexOf(r);if(a.props.dogs.find((function(e){return e.id===r})).chipId.length<10)return s[r]=!s[r],a.setState({missingChipId:s}),"";-1===o?c.push(r):c.splice(o,1),a.setState({selectedDogs:c})},a.selectDogSection=function(e){var t=e.target.closest("i").dataset.id,n=a.state,c=n.selectedDogs,s=n.missingChipId,r=parseInt(t,10),o=c.indexOf(r);if(a.props.dogs.find((function(e){return e.id===r})).chipId.length<10)return s[r]=!s[r],a.setState({missingChipId:s}),"";-1===o?c.push(r):c.splice(o,1),a.setState({selectedDogs:c})},a.selectAllDogs=function(){for(var e=a.props.dogs,t=e.filter((function(e){return e.chipId.length>10})).map((function(e){return e.id})),n=e.filter((function(e){return e.chipId.length<10})).map((function(e){return e.id})),c=a.state.missingChipId,s=0,r=n.length;s<r;s+=1){var o=n[s];c[o]=!c[o]}a.setState({selectedDogs:t,missingChipId:c})},a.removeAllDogs=function(){a.setState({selectedDogs:[]})},a.selectVaccine=function(e){var t=e.target.closest("tr").dataset.id,n=a.state.selectedVaccines,c=parseInt(t,10),s=n.indexOf(c);-1===s?n.push(c):n.splice(s,1),a.setState({selectedVaccines:n})},a.addVaccinesToDogs=function(){return new Promise((function(e,t){var n,s,r,o,i,l,h,d,b,u,g,p,O,m;for(r=(n=a.state).selectedVaccines,o=n.vaccineDate,h=(i=a.props.stores).vaccineLogStore,b=[],u=a.props.dogs,g={id:(d=(l=i.userStore).user).id,firstname:d.firstname,lastname:d.lastname,email:d.email,image:d.image},p=function(e){for(var t=s[e],a=u.find((function(e){return e.id===t})),n={id:a.id,user:a.user,team:a.team,name:a.name,shortname:a.shortname,chipId:a.chipId},i=function(e){var t=r[e],a=j.find((function(e){return e.id===t})),s={date:o,id:a.id,name:a.name,agens:a.agens,comment:a.comment};b.push({dog:c({},n),vaccine:c({},s),veterinary:c({},g)})},l=0,h=r.length;l<h;l+=1)i(l)},O=0,m=(s=n.selectedDogs).length;O<m;O+=1)p(O);return Promise.resolve(h.insert({data:b})).then((function(){try{return a.setState({data:b,selectedDogs:[],selectedVaccines:[]}),l.addVaccineLogStatuses(b),e()}catch(e){return t(e)}}),t)}))},a.toggleShowAddVaccineToDogs=function(){var e=a.state.showAddVaccineToDogs;a.setState({showAddVaccineToDogs:!(void 0!==e&&e)})},a.state={missingChipId:{},selectedDogs:[],selectedVaccines:[],vaccineDate:d.a.isoDate(new Date,!1,!1,!0)},a}return r(a,t),a.prototype.render=function(){var t=this,a=this.state,n=a.selectedDogs,c=a.selectedVaccines,s=a.missingChipId,r=a.data,o=a.showAddVaccineToDogs,i=void 0!==o&&o,l=a.vaccineDate,b=this.props.stores.userStore,p=b.vaccineLogStatuses,O=this.props.dogs,m=j.filter((function(e){return c.indexOf(e.id)>-1})).map((function(e){return e.agens.map((function(e){return e.name}))})).flat();return Object(h.h)(e,null,Object(h.h)("div",{class:"table-responsive mt-3"},Object(h.h)("button",{class:"btn btn-lg btn-block btn-outline-success mt-5",onClick:this.selectAllDogs},Object(h.h)(u.c,{id:"dog.veterinary.select-all-dogs"},"Select all dogs")),n&&n.length>0&&Object(h.h)(e,null,Object(h.h)("button",{class:"btn btn-sm btn-block btn-link",onClick:this.removeAllDogs},Object(h.h)(u.c,{id:"dog.veterinary.remove-all-dogs"},"Remove all dogs"))),Object(h.h)("table",{class:"table table-striped"},Object(h.h)("thead",null,Object(h.h)("tr",null,Object(h.h)("th",{scope:"col",style:"width: 100px;"}," "),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.name"},"Name")))),Object(h.h)("tbody",null,O&&O.map((function(a){var c;a.images&&a.images[0]&&(c=a.images[0]),a.image&&(c=a.image);var r=n.indexOf(a.id)>-1,o=s[a.id];return Object(h.h)(e,null,Object(h.h)("tr",{class:"pointerCursor",onClick:t.selectDog,"data-id":a.id},Object(h.h)("td",{class:"position-relative"},Object(h.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:c?"background-image: url('"+c.s3ThumbLink+"');":""},!c&&Object(h.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},d.a.ucfirst(a.name,!0))),r&&Object(h.h)("span",{class:"position-absolute display-4",style:"top: 0px; left: 0px;"},Object(h.h)("i",{class:"fas fa-check text-success"})),o&&Object(h.h)("span",{class:"position-absolute display-4",style:"top: 0px; left: 0px;"},Object(h.h)("i",{class:"fas fa-hand-paper text-danger"}))),Object(h.h)("td",null,Object(h.h)("span",{class:"float-right"},a.birth&&Object(h.h)("span",{class:"mr-2"},d.a.age(a.birth,a.deceased)),"female"===a.gender?Object(h.h)("i",{class:"fas fa-venus"}):Object(h.h)("i",{class:"fas fa-mars"})),Object(h.h)("h5",null,a.name," ",a.shortname&&Object(h.h)("span",{class:"font-weight-lighter"}," - '",a.shortname,"'")),Object(h.h)("div",null,Object(h.h)("span",{class:"text-muted"},a.chipId&&Object(h.h)(e,null,Object(h.h)("i",{class:"fas fa-microchip"})," ",a.chipId))),Object(h.h)("div",null,p&&p.filter((function(e){return e.chipId===a.chipId})).map((function(t){return Object(h.h)("span",{class:"badge badge-"+(t.inKarens?"warning":"success")+" mr-2 mb-1"},t.vaccineAgens.name,Object(h.h)("span",{class:"font-weight-lighter ml-2"},Object(h.h)("i",{class:"fas fa-calendar-check"})," ",d.a.isoDate(t.vaccineAgens.durationEnd,!1,!1,!0),t.inKarens&&Object(h.h)(e,null,Object(h.h)("br",null),"(karens: ",d.a.format(t.karensDaysLeft,0)," days left)")))}))))))}))))),Object(h.h)("div",{class:"mt-5"},n&&n.length>0&&Object(h.h)(e,null,Object(h.h)("div",{class:"form-row align-items-center"},Object(h.h)("div",{class:"col-12"},Object(h.h)("label",{for:"vaccineTypeInput"},Object(h.h)("i",{class:"fas fa-syringe"})," ",Object(h.h)(u.c,{id:"dog.addlog.vaccine-type"},"Vaksinetype")),Object(h.h)("table",{class:"table table-striped"},Object(h.h)("thead",null,Object(h.h)("tr",null,Object(h.h)("th",{scope:"col",style:"width: 100px;"}," "),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.name"},"Name")),Object(h.h)("th",{scope:"col",style:"width: 130px;"},Object(h.h)(u.c,{id:"dog.veterinary.image"},"Image")))),Object(h.h)("tbody",null,j&&j.map((function(a){var n=c.indexOf(a.id)>-1;return Object(h.h)("tr",{"data-id":a.id,onClick:t.selectVaccine},Object(h.h)("td",null,n?Object(h.h)(e,null,Object(h.h)("div",{class:"display-4 text-center"},Object(h.h)("i",{class:"fas fa-check text-success"}))):Object(h.h)(e,null,Object(h.h)("div",{class:"display-4 border rounded-lg text-center"},Object(h.h)("i",{class:"fas fa-radio text-success"})))),Object(h.h)("td",null,a.name,Object(h.h)("br",null),Object(h.h)("small",null,a.agens.map((function(t){return Object(h.h)(e,null,Object(h.h)("span",{class:"badge badge-dark mr-2 mt-1"},t.name," (",t.durationMonths," months, ",t.karensDays," days)"))})))),Object(h.h)("td",null,a.image&&Object(h.h)("img",{class:"img-fluid",src:""+f+a.image})))}))))),Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("label",{for:"team"},Object(h.h)("i",{class:"fas fa-dog"})," ",Object(h.h)(u.c,{id:"dog.veterinary.choosen-dogs"},"Valgte hunder")),Object(h.h)("div",{class:"d-flex flex-wrap"},O&&O.map((function(a){var c;if(a.images&&a.images[0]&&(c=a.images[0]),a.image&&(c=a.image),!(n.indexOf(a.id)>-1))return"";var s=p.filter((function(e){return e.chipId===a.chipId})).map((function(e){return e.vaccineAgens.name})).flat();return Object(h.h)(e,null,Object(h.h)("section",{class:"p-2 position-relative",style:"width: 120px;"},Object(h.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:c?"background-image: url('"+c.s3ThumbLink+"');":""},!c&&Object(h.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},d.a.ucfirst(a.name,!0))),Object(h.h)("small",null,a.name),Object(h.h)("br",null),Object(h.h)("small",{class:"text-muted"},a.birth&&Object(h.h)("span",{class:"mr-2"},d.a.age(a.birth,a.deceased)),"female"===a.gender?Object(h.h)("i",{class:"fas fa-venus"}):Object(h.h)("i",{class:"fas fa-mars"})),m&&Object(h.h)(e,null,m.filter((function(e){return s.indexOf(e)>-1})).map((function(t){return Object(h.h)(e,null,Object(h.h)("span",{class:"badge badge-danger mr-2 mb-1"},Object(h.h)("i",{class:"fas fa-exclamation-triangle"})," ",t))}))),Object(h.h)("div",{class:"position-absolute",style:"top: 0px; right: 0px; font-size: 2.0em;"},Object(h.h)("i",{class:"fas fa-times-circle text-danger",onClick:t.selectDogSection,"data-id":a.id}))))})))),Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("label",null,Object(h.h)("i",{class:"fas fa-syringe"})," ",Object(h.h)(u.c,{id:"dog.veterinary.chosen-vaccines"},"Valgte vaksiner")),j&&j.map((function(t){return c.indexOf(t.id)>-1?Object(h.h)("div",{class:"mb-3"},Object(h.h)("span",{class:"font-weight-lighter"},"+")," ",t.name,Object(h.h)("br",null),Object(h.h)("small",null,t.agens.map((function(t){return Object(h.h)(e,null,Object(h.h)("span",{class:"badge badge-dark mr-2 mt-1"},t.name," (",t.durationMonths," months, ",t.karensDays," days)"))})))):""}))),c&&c.length>0?Object(h.h)(e,null,Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("label",null,Object(h.h)("i",{class:"fas fa-calendar-alt"})," ",Object(h.h)(u.c,{id:"dog.veterinary.vaccine-date"},"Dato for vaksine")),Object(h.h)(u.b,null,Object(h.h)("input",{type:"date",class:"form-control form-control-lg mb-2",id:"vetSearch",placeholder:Object(h.h)(u.c,{id:"dog.veterinary.vaccine-date-placeholder"},"Velg dato for vaksine. Dersom vaksine er dagens dato, så trenger du ikke velge."),onInput:Object(g.a)(this,"vaccineDate"),value:l}))),i?Object(h.h)(e,null,Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("h5",null,Object(h.h)(u.c,{id:"dog.veterinary.are-you-sure",fields:{dogs:n.length}},"Are you sure you want to add vaccine to ",n.length," dog?")),Object(h.h)("button",{type:"button",class:"btn btn-lg btn-block btn-success mb-2",onClick:this.addVaccinesToDogs},Object(h.h)(u.c,{id:"dog.veterinary.yes-iam-sure"},"Yes, I'm sure!")),Object(h.h)("button",{type:"button",class:"btn btn-lg btn-block btn-danger mb-2",onClick:this.toggleShowAddVaccineToDogs},Object(h.h)(u.c,{id:"dog.veterinary.cancel"},"Cancel")))):Object(h.h)(e,null,Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("button",{type:"button",class:"btn btn-lg btn-block btn-success mb-2",onClick:this.toggleShowAddVaccineToDogs},Object(h.h)(u.c,{id:"dog.veterinary.add-vaccine-to-dogs",fields:{dogs:n.length}},"Add vaccine to ",n.length," dogs"))))):Object(h.h)(e,null,Object(h.h)("h3",{class:"text-muted mt-4"},Object(h.h)(u.c,{id:"dog.veterinary.choose-vaccines"},"Velg vaksiner i listen over")))))),r&&Object(h.h)(e,null,Object(h.h)("div",{class:"mt-5"},Object(h.h)("div",{class:"row"},Object(h.h)("div",{class:"col-12 pt-4"},Object(h.h)("h5",null,Object(h.h)(u.c,{id:"dog.veterinary.recepipt"},"Receipt")),Object(h.h)("table",{class:"table table-striped"},Object(h.h)("thead",null,Object(h.h)("tr",null,Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.dog"},"Dog")),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.vaccine"},"Vaccine")))),Object(h.h)("tbody",null,r&&r.map((function(t){var a=t.dog,n=t.vaccine;return Object(h.h)(e,null,Object(h.h)("tr",null,Object(h.h)("td",null,a.name,Object(h.h)("br",null),Object(h.h)("small",{class:"text-muted"},a.chipId)),Object(h.h)("td",null,n.name,Object(h.h)("small",null,n.agens.map((function(t){return Object(h.h)(e,null,Object(h.h)("span",{class:"badge badge-dark mr-2 mt-1"},t.name," (",t.durationMonths," months, ",t.karensDays," days)"))}))))))})))))))))},a}(h.Component))||i,w=Object(b.a)(l=function(t){function a(e){var a;return(a=t.call(this,e)||this).searchForMusher=function(e){return new Promise((function(t,n){var c,s;return e.preventDefault(),c=a.props.stores.userStore,s=a.state.search,a.setState({isSearcing:!0,displayUser:null}),Promise.resolve(c.searchUsers({search:s})).then((function(){try{return a.setState({isSearcing:!1}),t()}catch(e){return n(e)}}),n)}))},a.selectMusher=function(e){return new Promise((function(t,n){function c(){return t()}var s,r;return s=e.target.closest("tr").dataset.id,a.state.displayUser===(r=parseInt(s,10))?(a.setState({displayUser:null}),c.call(this)):(a.setState({displayUser:r}),Promise.resolve(a.props.stores.userStore.getDogs({id:r})).then(function(){try{return c.call(this)}catch(e){return n(e)}}.bind(this),n))}))},a.state=c({},v),a}r(a,t);var n=a.prototype;return n.componentDidMount=function(){},n.componentWillReceiveProps=function(){},n.render=function(){var t=this,a=this.state,n=a.displayUser,c=a.isSearcing,s=this.props.stores,r=s.userStore,o=r.searchUsersResult,i=r.searchUserTeams,l=this.props,b=l.col,j=void 0===b?12:b,f=l.offset,v=void 0===f?0:f;return r.isVeterinary?Object(h.h)(e,null,Object(h.h)("div",{class:"container-fluid",style:"margin-bottom: "+m+"; margin-top: "+O+";"},Object(h.h)("div",{class:"row"},Object(h.h)("div",{class:"col-"+j+" offset-"+v+" col-sm-8 col-lg-8 offset-sm-2 offset-lg-2"},Object(h.h)("h1",null,Object(h.h)(u.c,{id:"dog.veterinary.title"},"Veterinary search")),Object(h.h)("form",{onSubmit:this.searchForMusher},Object(h.h)("div",{class:"form-row align-items-center"},Object(h.h)("div",{class:"col-10"},Object(h.h)("label",{class:"sr-only",for:"vetSearch"},Object(h.h)(u.c,{id:"dog.veterinary.name"},"Name")),Object(h.h)(u.b,null,Object(h.h)("input",{type:"text",class:"form-control form-control-lg mb-2",id:"vetSearch",placeholder:Object(h.h)(u.c,{id:"dog.veterinary.search-placeholder"},"Search for musher by email, cellphone or name..."),onInput:Object(g.a)(this,"search")}))),Object(h.h)("div",{class:"col-2"},Object(h.h)("button",{type:"button",class:"btn btn-lg btn-primary mb-2",onClick:this.searchForMusher},Object(h.h)(u.c,{id:"dog.veterinary.search"},"Search")))))),Object(h.h)("div",{class:"col-"+j+" offset-"+v+" col-sm-8 col-lg-8 offset-sm-2 offset-lg-2"},c&&Object(h.h)(e,null,Object(h.h)("div",{class:"spinner-border text-primary",role:"status"},Object(h.h)("span",{class:"sr-only"},Object(h.h)(u.c,{id:"dog.veterinary.searching"},"Searcing...")))),o&&0!==o.length?Object(h.h)("div",{class:"table-responsive"},Object(h.h)("table",{class:"table table-striped"},Object(h.h)("thead",null,Object(h.h)("tr",null,Object(h.h)("th",{scope:"col",style:"width: 100px;"}," "),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.name"},"Name")),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.cellphone"},"Cellphone")),Object(h.h)("th",{scope:"col"},Object(h.h)(u.c,{id:"dog.veterinary.email"},"Email")))),Object(h.h)("tbody",null,o&&o.filter((function(e){return!n||e.id===n})).map((function(a){var c;return a.images&&a.images[0]&&(c=a.images[0]),a.image&&(c=a.image),Object(h.h)(e,null,Object(h.h)("tr",{class:"pointerCursor",onClick:t.selectMusher,"data-id":a.id},Object(h.h)("td",null,Object(h.h)("div",{class:"text-center border rounded-circle imageRounded text-muted pt-2",style:c?"background-image: url('"+c.s3ThumbLink+"');":""},!c&&Object(h.h)("span",{class:"font-weight-lighter",style:"font-size: 35px;"},a.firstname?Object(h.h)(e,null,d.a.ucfirst(a.firstname,!0),d.a.ucfirst(a.lastname,!0)):Object(h.h)(e,null,d.a.ucfirst(a.email,!0))))),Object(h.h)("td",null,a.firstname," ",a.lastname,Object(h.h)("br",null),a.facebook&&Object(h.h)("a",{class:"mr-2",href:p.a.asFacebookLink(a.facebook),target:"_blank",rel:"noreferrer"},Object(h.h)("i",{class:"fab fa-facebook-square"})),a.instagram&&Object(h.h)("a",{class:"mr-2",href:p.a.asInstagramLink(a.instagram),target:"_blank",rel:"noreferrer"},Object(h.h)("i",{class:"fab fa-instagram"}))),Object(h.h)("td",null,a.cellphone),Object(h.h)("td",null,a.email)),n===a.id&&Object(h.h)(e,null,Object(h.h)("tr",null,Object(h.h)("td",{colspan:"4"},Object(h.h)(y,{stores:t.props.stores,teams:i,displayUser:n})))))}))))):Object(h.h)(e,null," "))))):Object(h.h)(e,null,Object(h.h)("div",{class:"container-fluid h-100"},Object(h.h)("div",{class:"row h-100"},Object(h.h)("div",{class:"col-12 text-center my-auto"},Object(h.h)("div",{class:"display-1 text-danger"},Object(h.h)("i",{class:"fas fa-hand-paper"})),Object(h.h)("h5",null,Object(h.h)(u.c,{id:"dog.veterinary.no-access"},"No access!")),Object(h.h)("p",null,Object(h.h)(u.c,{id:"dog.veterinary.attempts-logged"},"All attempts are logged and reported.")),Object(h.h)("a",{class:"mt-3 btn btn-lg btn-primary",href:"/"},Object(h.h)(u.c,{id:"dog.veterinary.goto-frontpage"},"Go to the frontpage"))))))},a}(h.Component))||l;t.default=w}.call(this,a("hosL").Fragment)}}]);
//# sourceMappingURL=route-veterinary.chunk.7a5ca.js.map