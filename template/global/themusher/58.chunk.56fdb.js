(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{"+CFY":function(e,t,o){"use strict";o.r(t),function(e){function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,s)}return o}function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var r,c=o("hosL"),l=o("Utv1"),a=o("/eY4"),i=(o("Y3FI"),o("OhSV")),u=(o("fh8t"),o("X9Km"),o("ZOvn")),b=(o("NDEG"),o("eQ6k"),o("rWES")),h=o("jtG4"),d=o("5TgH"),m=o("XPU5"),f=u.a.marginTop(!0),p=(u.a.marginTopBack(!1),u.a.marginBottom()),O={requestSent:{},submenu:"notfollowing"},j=Object(a.a)(r=function(t){function o(e){var o;return(o=t.call(this,e)||this).back=function(){o.props.stores.history.goBack()},o.chooseSubmenu=function(e){o.setState({submenu:e.target.parentElement.dataset.menu||e.target.dataset.menu})},o.state=function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}({},O),o.updateTimer={},o}var r,a;a=t,(r=o).prototype=Object.create(a.prototype),r.prototype.constructor=r,r.__proto__=a;var u=o.prototype;return u.loadAll=function(e){return new Promise(function(t,o){return void 0===e&&(e=this.props),Promise.resolve(this.loadPublicTeams(e)).then((function(){try{return t()}catch(e){return o(e)}}),o)}.bind(this))},u.loadPublicTeams=function(e){return new Promise(function(t,o){return void 0===e&&(e=this.props),e.teamid,Promise.resolve(e.stores.teamStore.loadPublic({})).then((function(){try{return t()}catch(e){return o(e)}}),o)}.bind(this))},u.componentDidMount=function(){this.loadAll()},u.componentWillReceiveProps=function(e){e.dog!==this.props.dog&&this.loadAll(e)},u.render=function(){var t=this,o=this.state.submenu,s=this.props.stores,n=s.userStore.user,r=s.teamStore.publicTeamsToFollow,a=r.filter((function(e){return e.followRequests&&e.followRequests.findIndex((function(e){return e.id===n.id}))>-1})),u=r.filter((function(e){return e.followers&&e.followers.indexOf(n.id)>-1})),O=r.filter((function(e){return!(e.members&&e.members.findIndex((function(e){return e.id===n.id}))>-1)&&(!(a.findIndex((function(t){return t.id===e.id}))>-1)&&!(u.findIndex((function(t){return t.id===e.id}))>-1))}));return Object(c.h)(e,null,Object(c.h)("div",{class:"container-fluid",style:"margin-bottom: "+p+"; margin-top: "+f+";"},Object(c.h)(i.b,null,Object(c.h)(d.a,{stores:this.props.stores,title:Object(c.h)(i.c,{id:"home.find-teams"},"Find teams to follow"),backtext:Object(c.h)(i.c,{id:"home.back"},"Back")})),Object(c.h)("div",{class:"row mt-4"},Object(c.h)("div",{class:"col-12"},Object(c.h)(b.a,{stores:this.props.stores}))),Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3 my-3"},Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"col px-1 pt-2"},Object(c.h)("button",{class:"btn btn-block "+("notfollowing"===o?"btn-primary":"btn-outline-primary")+" text-nowrap",style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"notfollowing",onClick:this.chooseSubmenu},Object(c.h)("i",{class:"fas fa-tachometer-alt"})," ",Object(c.h)(i.c,{id:"teams.notfollowing"},"Not following"))),Object(c.h)("div",{class:"col px-1 pt-2"},Object(c.h)("button",{class:"btn btn-block "+("waiting"===o?"btn-primary":"btn-outline-primary")+" text-nowrap",style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"waiting",onClick:this.chooseSubmenu},Object(c.h)("i",{class:"fas fa-chalkboard-teacher"})," ",Object(c.h)(i.c,{id:"teams.waiting-approval"},"Waiting for approval"))),Object(c.h)("div",{class:"col px-1 pt-2"},Object(c.h)("button",{class:"btn btn-block "+("following"===o?"btn-primary":"btn-outline-primary")+" text-nowrap",style:"text-overflow: ellipsis; overflow: hidden;","data-menu":"following",onClick:this.chooseSubmenu},Object(c.h)("i",{class:"fas fa-chalkboard-teacher"})," ",Object(c.h)(i.c,{id:"teams.following"},"Following")))))),Object(c.h)("div",{class:"row mt-4"},Object(c.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mb-0 position-relative"},Object(c.h)("div",{class:"row"},"notfollowing"===o&&Object(c.h)(e,null,(!l.a.isArray(O)||0===O.length)&&Object(c.h)(e,null,Object(c.h)("div",{class:"col-12 text-center text-muted mb-5"},Object(c.h)("div",{class:"display-1"},Object(c.h)("i",{class:"fas fa-search"})),Object(c.h)("h3",{class:"font-weight-lighter"},Object(c.h)(i.c,{id:"teams.no-more-teams-to-follow"},"No more teams to follow."))),Object(c.h)(m.a,{stores:this.props.stores,forceShow:!0})),l.a.isArray(O)&&O.map((function(e){return Object(c.h)(h.a,{stores:t.props.stores,team:e})}))),"waiting"===o&&Object(c.h)(e,null,(!l.a.isArray(a)||0===a.length)&&Object(c.h)(e,null,Object(c.h)("div",{class:"col-12 text-center text-muted mb-5"},Object(c.h)("div",{class:"display-1"},Object(c.h)("i",{class:"fas fa-check"})),Object(c.h)("h3",{class:"font-weight-lighter"},Object(c.h)(i.c,{id:"teams.no-pending-follow-requests"},"No pending follow requests.")))),Object(c.h)(m.a,{stores:this.props.stores,forceShow:!0}),l.a.isArray(a)&&a.map((function(e){return Object(c.h)(h.a,{stores:t.props.stores,team:e})}))),"following"===o&&Object(c.h)(e,null,(!l.a.isArray(u)||0===u.length)&&Object(c.h)(e,null,Object(c.h)("div",{class:"col-12 text-center text-muted mb-5"},Object(c.h)("div",{class:"display-1"},Object(c.h)("i",{class:"fas fa-check"})),Object(c.h)("h3",{class:"font-weight-lighter"},Object(c.h)(i.c,{id:"teams.not-following-any-teams"},"You are not following any teams.")))),Object(c.h)(m.a,{stores:this.props.stores,forceShow:!0}),l.a.isArray(u)&&u.map((function(e){return Object(c.h)(h.a,{stores:t.props.stores,team:e})})))))),Object(c.h)("div",{class:"row mt-4"},Object(c.h)("div",{class:"col-12 offset-0 col-sm-8 offset-sm-2 col-lg-6 offset-lg-3"},Object(c.h)("div",{class:"text-center text-muted"},Object(c.h)("div",{class:"display-1"},Object(c.h)("i",{class:"fas fa-ellipsis-h"})),Object(c.h)("div",{style:"line-height: 0.9em;"},Object(c.h)("small",null,Object(c.h)(i.c,{id:"teams.something-missing"},"Er det noe du savner på denne siden? Send oss en melding på Facebook."))))))))},o}(c.Component))||r;t.default=j}.call(this,o("hosL").Fragment)},"5TgH":function(e,t,o){"use strict";(function(e){function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,s)}return o}function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var r,c=o("hosL"),l=(o("ox/y"),o("Utv1"),o("/eY4")),a=(o("go65"),o("Y3FI")),i=o("OhSV"),u=o("ZOvn").a.subMenuMarginTop(),b={},h=Object(l.a)(r=function(t){function o(e){var o;return(o=t.call(this,e)||this).back=function(){var e=o.props.stores.appState.previousPath,t=void 0===e?"/":e;Object(a.route)(t)},o.state=function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}({},b),o}var r,l;return l=t,(r=o).prototype=Object.create(l.prototype),r.prototype.constructor=r,r.__proto__=l,o.prototype.render=function(){var t=this.props,o=t.title,s=t.backtext,n=this.props.stores.appState.darkmode;return Object(c.h)("div",{class:"row fixed-top border-bottom",style:"margin-top: "+u+"; background-color: "+(n?"#191d21":"#f8f9fa")+";"},Object(c.h)("div",{class:"col text-center subtopmenu position-relative"},Object(c.h)("div",{class:"text-left subtopmenu position-absolute",style:"top: 0px; left: 20px; line-height: 1.8em;"},Object(c.h)("button",{class:"btn btn-link text-secondary p-0",onClick:this.back},Object(c.h)("nobr",null,Object(c.h)("i",{class:"fas fa-chevron-left font-weight-bold"})," ",s?Object(c.h)(e,null,s):Object(c.h)(e,null,Object(c.h)(i.c,{id:"home.home"},"Home"))))),Object(c.h)("nobr",null,Object(c.h)("strong",null,o))))},o}(c.Component))||r;t.a=h}).call(this,o("hosL").Fragment)},NDEG:function(e,t,o){"use strict";(function(e){var s,n=o("hosL"),r=o("Utv1"),c=o("/eY4"),l=o("ZOvn"),a=Object(c.a)(s=function(t){function o(){return t.apply(this,arguments)||this}var s,c;return c=t,(s=o).prototype=Object.create(c.prototype),s.prototype.constructor=s,s.__proto__=c,o.prototype.render=function(){var t=this.props,o=t.dog,s=void 0===o?{}:o,c=t.dogs,a=void 0===c?[]:c,i=t.showTeam,u=t.showInfo,b=t.showName,h=void 0===b||b,d=t.showPosition,m=void 0===d||d,f=t.showAge,p=void 0!==f&&f,O=t.className,j=t.size,g=t.onDogClick,v=void 0===g?function(){}:g,w=this.props.stores.userStore,y=w.user.language,k=w.findDogposition({position:s.position,language:void 0===y?"en":y}),x=l.a.hasBirthday(s.birth),S=(Math.ceil(l.a.daysUntilNextBirthday(s.birth)),"92px"),P="",q="35px";return"small"===j?(S="50px",P="imageRoundedSmall",q="20px"):"medium"===j&&(S="60px",P="imageRoundedMedium",q="25px"),Object(n.h)("div",{class:"mb-2 position-relative "+O+" clearfix",style:"width: "+S,onTouchstart:function(e){e.stopPropagation()},onTouchend:function(e){e.stopPropagation()},onTouchmove:function(e){e.stopPropagation()}},m&&k&&Object(n.h)("small",{class:"position-absolute",style:"left:0px; top: 50px;"},Object(n.h)("span",{class:"badge badge-"+(k.class||"primary")+" mr-3"},k.icon&&Object(n.h)("i",{class:k.icon})," ",k.name)),Object(n.h)("div",{class:"text-center border rounded-circle imageRounded "+P+" mx-auto text-muted pt-2",style:(s.image?'background-image: url("'+s.image.s3SmallLink+'"); background-size: cover;':"")+" border-width: 2px !important;"},!s.image&&Object(n.h)("span",{class:"font-weight-lighter",style:"font-size: "+q+";"},r.a.ucfirst(s.name,!0))),Object(n.h)("div",{class:"text-center text-overflow",style:"line-height: 1.0em;"},Object(n.h)("small",null,Object(n.h)("a",{href:"/dogs/public/"+s.uuidv4,onClick:function(e){return v(e,s.uuidv4,a)},class:"stretched-link"},h&&Object(n.h)(e,null,Object(n.h)("span",{class:"mb-1 font-weight-light"},Object(n.h)("nobr",null,s.shortname||s.name,x&&Object(n.h)(e,null,Object(n.h)("i",{class:"fas fa-birthday-cake ml-3"})))))))),Object(n.h)("div",{class:"text-center text-overflow",style:"line-height: 1.0em;"},Object(n.h)("small",null,s.birth&&p&&Object(n.h)(e,null,Object(n.h)("span",{class:"float-right"},s.birth&&Object(n.h)("span",{class:"mr-2"},r.a.age(s.birth,s.deceased)),"female"===s.gender?Object(n.h)("i",{class:"fas fa-venus"}):Object(n.h)("i",{class:"fas fa-mars"}))),i&&Object(n.h)(e,null,Object(n.h)("span",{class:"font-weight-light"},w.findTeam(s.team)),Object(n.h)("br",null)),u&&Object(n.h)("small",{class:"text-muted"},s.weight&&Object(n.h)(e,null,Object(n.h)("i",{class:"fas fa-balance-scale ml-2"})," ",r.a.format(s.weight,1)," kg"),s.bodyScore&&Object(n.h)(e,null,Object(n.h)("i",{class:"fas fa-dog ml-2"})," ",r.a.format(s.bodyScore,1))))))},o}(n.Component))||s;t.a=a}).call(this,o("hosL").Fragment)},XPU5:function(e,t,o){"use strict";var s,n=o("hosL"),r=(o("Utv1"),o("/eY4")),c=o("OhSV"),l=o("go65"),a=Object(r.a)(s=function(e){function t(){for(var t,o=arguments.length,s=new Array(o),n=0;n<o;n++)s[n]=arguments[n];return(t=e.call.apply(e,[this].concat(s))||this).inviteKennel=function(){return new Promise((function(e,o){return Promise.resolve(t.props.stores.userStore.inviteKennel({email:t.state.friendEmail})).then((function(s){try{return t.setState({response:s,inviteSent:!0}),e()}catch(e){return o(e)}}),o)}))},t.inviteNew=function(){t.setState({inviteSent:!1})},t.hideInvite=function(){return new Promise((function(e,o){return Promise.resolve(t.props.stores.userStore.updateSetting({"settings.hideInvite":1})).then((function(){try{return t.setState({hideInvite:!0}),e()}catch(e){return o(e)}}),o)}))},t}var o,s;return s=e,(o=t).prototype=Object.create(s.prototype),o.prototype.constructor=o,o.__proto__=s,t.prototype.render=function(){var e=this.state,t=this.props.forceShow,o=this.props.stores.userStore.user.settings;return!t&&(void 0===o?{}:o).hideInvite||e.hideInvite?"":e.inviteSent?Object(n.h)("div",{class:"col-12"},Object(n.h)(c.c,{id:"users.invite.thanks"},"Takk for at du hjelper oss til å bli flere 😃"),Object(n.h)("button",{type:"button",class:"btn btn-sm btn-link mb-2",onClick:this.inviteNew},Object(n.h)(c.c,{id:"users.invite.more"},"Invitere flere"))):Object(n.h)("div",{class:"col-12 pb-4 clearfix"},Object(n.h)("h5",null,Object(n.h)(c.c,{id:"users.invite.title"},"Inviter ny kennel til The Musher")),Object(n.h)("p",null,Object(n.h)(c.c,{id:"users.invite.text"},"Jeg håper du vil hjelpe oss til å bli flere. Appen vil bli lansert veldig snart og det er påtide å invitere inn flere brukere.")),Object(n.h)("div",null,Object(n.h)("div",{class:"form-row align-items-center"},Object(n.h)("div",{class:"col-auto"},Object(n.h)("label",{class:"sr-only",for:"inlineFormInput"},Object(n.h)(c.c,{id:"users.invite.email"},"E-post")),Object(n.h)(c.b,null,Object(n.h)("input",{type:"text",class:"form-control form-control-sm mb-2",id:"inlineFormInput",placeholder:Object(n.h)(c.c,{id:"users.invite.email-placeholder"},"E-post til ny kennel"),onInput:Object(l.a)(this,"friendEmail")}))),Object(n.h)("div",{class:"col-auto"},Object(n.h)("button",{type:"button",class:"btn btn-sm btn-primary mb-2",onClick:this.inviteKennel},Object(n.h)(c.c,{id:"users.invite.send"},"Send invitasjon"))))),!t&&Object(n.h)("button",{type:"button",class:"btn btn-sm btn-link mb-2 float-left",onClick:this.hideInvite},Object(n.h)("i",{class:"fas fa-eye-slash"})," ",Object(n.h)(c.c,{id:"users.invite.hide"},"Skjul")))},t}(n.Component))||s;t.a=a},eQ6k:function(e,t,o){"use strict";(function(e){var s,n=o("hosL"),r=(o("Utv1"),o("/eY4")),c=o("OhSV"),l=Object(r.a)(s=function(t){function o(){for(var o,s=arguments.length,r=new Array(s),l=0;l<s;l++)r[l]=arguments[l];return(o=t.call.apply(t,[this].concat(r))||this).requestFollowTeam=function(e){var t=o.props.stores,s=t.teamStore,n=t.userStore.user,r=parseInt(e.target.parentElement.dataset.team||e.target.dataset.team,10);s.followRequest(r,n),o.setState({requestSent:!0})},o.unFollowTeam=function(e){var t=o.props.stores,s=t.teamStore,n=parseInt(e.target.parentElement.dataset.team||e.target.dataset.team,10);s.unollowTeam(n),o.setState({unfollowed:!0})},o.getButton=function(t){void 0===t&&(t="");var s=o.state.requestSent,r=o.props.stores.userStore.user,l=o.props,a=l.team,i=l.skipHome,u=a.members&&a.members.indexOf(r.id)>-1,b=a.followers&&a.followers.indexOf(r.id)>-1,h=a.blockedFollowers&&a.blockedFollowers.indexOf(r.id)>-1,d=s||a.followRequests&&a.followRequests.findIndex((function(e){return e.id===r.id}))>-1;return u?i?"":Object(n.h)("i",{class:"fas fa-home"}):b?Object(n.h)(e,null,Object(n.h)("button",{class:"btn btn-block btn-outline-secondary float-right",onClick:o.unFollowTeam,disabled:"true","data-team":a.id},Object(n.h)("i",{class:"fas fa-link mr-2"}),Object(n.h)(c.c,{id:"teams.connect.is-following"},"Følger")," ",t),Object(n.h)("button",{class:"btn btn-sm btn-block btn-danger float-right",onClick:o.unFollowTeam,"data-team":a.id},Object(n.h)("i",{class:"fas fa-unlink mr-2"}),Object(n.h)(c.c,{id:"teams.connect.unfollow"},"Unfollow"))):h?"":d?Object(n.h)("button",{class:"btn btn-block btn-outline-secondary float-right",disabled:"true"},Object(n.h)("i",{class:"fas fa-hourglass-half mr-2"}),Object(n.h)(c.c,{id:"teams.connect.has-requested"},"Venter på godkjenning")," ",t):a.public?Object(n.h)("button",{class:"btn btn-block btn-outline-success float-right",onClick:o.requestFollowTeam,"data-team":a.id},Object(n.h)("i",{class:"far fa-hand-point-right mr-2"}),Object(n.h)(c.c,{id:"teams.connect.follow"},"Følg")," ",t):void 0},o}var s,r;return r=t,(s=o).prototype=Object.create(r.prototype),s.prototype.constructor=s,s.__proto__=r,o.prototype.render=function(){var t=this.state.unfollowed,o=this.props,s=o.team,r=o.buttonOnly,c=this.props.stores.userStore,l=c.user.language,a=void 0===l?"en":l,i=c.findTeamAmbition({ambition:s.ambitions,language:a}),u=c.findTeamType({type:s.type,language:a}),b=s.image&&s.image.s3SmallLink?s.image:null;return r?Object(n.h)(e,null,this.getButton(""+s.name)):Object(n.h)("div",{class:"w-100 mb-3"},Object(n.h)("div",{class:"row"},Object(n.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 d-flex mb-0 position-relative border-top pt-3",style:t?"text-decoration: line-through; opacity: 0.3;":""},Object(n.h)("a",{href:"/teams/public/"+s.uuidv4},Object(n.h)("div",{class:"text-center border rounded-circle imageRounded",style:b?'background-image: url("'+b.s3SmallLink+'");  background-size: cover;':""},!b&&Object(n.h)("i",{class:"fas fa-users text-muted mt-3",style:"font-size: 40px;"}))),Object(n.h)("div",{class:"flex-grow-1 pl-3",style:"line-height: 1.2em;"},Object(n.h)("h5",{class:"mb-1",style:"line-height: 1.0em;"},s.public?Object(n.h)(e,null,Object(n.h)("a",{href:"/teams/public/"+s.uuidv4},s.name)):Object(n.h)(e,null,s.name)),Object(n.h)("div",null,s.place," ",s.country),Object(n.h)("div",null,u&&Object(n.h)("span",{class:"badge badge-pill badge-secondary"},u),i&&Object(n.h)("span",{class:"badge badge-pill badge-secondary ml-2"},i)),Object(n.h)("small",{class:"text-muted"},s&&s.dogs&&Object(n.h)("span",{class:""},Object(n.h)("i",{class:"fas fa-dog"})," ",s.dogs.length),s&&s.followers&&Object(n.h)("span",{class:"ml-2"},Object(n.h)("i",{class:"fas fa-user"})," ",s.followers.length))),Object(n.h)("div",null,this.getButton()))))},o}(n.Component))||s;t.a=l}).call(this,o("hosL").Fragment)},jtG4:function(e,t,o){"use strict";(function(e){function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,s)}return o}function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var r,c=o("hosL"),l=(o("Utv1"),o("/eY4")),a=(o("Y3FI"),o("OhSV")),i=o("ZOvn"),u={requestSent:{},confirmed:{},deleted:{},submenu:"notfollowing"},b=Object(l.a)(r=function(t){function o(o){var r;return(r=t.call(this,o)||this).requestFollowTeam=function(e){return new Promise((function(t){var o=r.props.stores,s=o.teamStore,n=o.userStore.user,c=parseInt(e.target.parentElement.dataset.team||e.target.dataset.team,10);s.followRequest(c,n);var l=r.state.requestSent;return l[c]=!0,r.setState({requestSent:l}),t()}))},r.confirmRequest=function(e){return new Promise((function(t,o){var s,n,c,l,a,i,u,b,h;return n=void 0===(s=r.props.callback)?function(){}:s,c=e.target.closest("button").dataset,i=r.props.stores.teamStore,h=(u=r.state).deleted,(b=u.confirmed)[(l=c.team)+"-"+(a=c.user)]=!0,delete h[l+"-"+a],r.setState({confirmed:b,deleted:h}),Promise.resolve(i.confirmFollowRequest({team:parseInt(l,10),user:parseInt(a,10)})).then((function(){try{return n(),t()}catch(e){return o(e)}}),o)}))},r.deleteRequest=function(e){return new Promise((function(t,o){var s,n,c,l,a,i,u,b,h;return n=void 0===(s=r.props.callback)?function(){}:s,c=e.target.closest("button").dataset,i=r.props.stores.teamStore,h=(u=r.state).confirmed,(b=u.deleted)[(l=c.team)+"-"+(a=c.user)]=!0,delete h[l+"-"+a],r.setState({deleted:b,confirmed:h}),Promise.resolve(i.deleteFollowRequest({team:parseInt(l,10),user:parseInt(a,10)})).then((function(){try{return n(),t()}catch(e){return o(e)}}),o)}))},r.unFollowTeam=function(e){var t=r.props.stores,o=t.teamStore,s=parseInt(e.target.parentElement.dataset.team||e.target.dataset.team,10);o.unollowTeam(s),r.setState({unfollowed:!0})},r.getUnblockButton=function(t,o){var s=r.state.confirmed[o+"-"+t];return Object(c.h)(e,null,s?Object(c.h)(e,null,Object(c.h)("small",{class:"text-success"},Object(c.h)("i",{class:"fas fa-check"})," ",Object(c.h)(a.c,{id:"teams.connect.confirmed"},"Confirmed"))):Object(c.h)(e,null,Object(c.h)("button",{class:"btn btn-sm btn-block btn-success text-overflow mt-1",onClick:r.confirmRequest,"data-team":o,"data-user":t},Object(c.h)(a.c,{id:"teams.connect.confirm"},"Confirm"))))},r.getButton=function(t){var o=r.state.requestSent,s=r.props.stores.userStore.user,n=t.members&&t.members.indexOf(s.id)>-1,l=t.followers&&t.followers.indexOf(s.id)>-1,i=t.blockedFollowers&&t.blockedFollowers.indexOf(s.id)>-1,u=o[t.id]||t.followRequests&&t.followRequests.findIndex((function(e){return e.id===s.id}))>-1;return n?Object(c.h)("i",{class:"fas fa-home"}):t.public?l?Object(c.h)(e,null,Object(c.h)("button",{class:"btn btn-sm btn-block btn-outline-secondary float-right",onClick:r.unFollowTeam,disabled:"true","data-team":t.id},Object(c.h)("i",{class:"fas fa-link mr-2"}),Object(c.h)(a.c,{id:"teams.connect.is-following"},"Følger")),Object(c.h)("button",{class:"btn btn-sm btn-block btn-outline-danger float-right",onClick:r.unFollowTeam,disabled:"true","data-team":t.id},Object(c.h)(a.c,{id:"teams.connect.unfollow"},"Unfollow"))):i?Object(c.h)(e,null):u?Object(c.h)("button",{class:"btn btn-sm btn-block btn-outline-secondary float-right",disabled:"true"},Object(c.h)("i",{class:"fas fa-hourglass-half mr-2"}),Object(c.h)(a.c,{id:"teams.connect.has-requested"},"Venter på godkjenning")):Object(c.h)("button",{class:"btn btn-sm btn-block btn-outline-success float-right",onClick:r.requestFollowTeam,"data-team":t.id},Object(c.h)("i",{class:"far fa-hand-point-right mr-2"}),Object(c.h)(a.c,{id:"teams.connect.follow"},"Følg")):Object(c.h)(e,null,Object(c.h)("small",{class:"text-muted"},Object(c.h)(a.c,{id:"teams.not-public"},"Ikke offentlig")))},r.state=function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}({},u),r.updateTimer={},r}var r,l;return l=t,(r=o).prototype=Object.create(l.prototype),r.prototype.constructor=r,r.__proto__=l,o.prototype.render=function(){var t,o,s,n,r=this.state,l=r.deleted,u=void 0===l?{}:l,b=r.unfollowed,h=this.props,d=h.team,m=h.isBlocked,f=h.myTeamId,p=h.showBlockButton,O=this.props.stores.storyStore.findPublicUser(d.user)||d.user||{};d.image&&d.image.s3SmallLink?t=d.image:d.images&&d.images[0]&&d.images[0].s3SmallLink?t=d.images[0]:O.image&&O.image.s3SmallLink?t=O.image:O.images&&O.images[0]&&O.images[0].s3SmallLink&&(t=O.images[0]),d&&d.name?(o=i.a.displayNameShort(d),s=i.a.displayName(d),n=i.a.displayName(O)):O&&O.id&&(o=i.a.displayNameShort(O),s=i.a.displayName(O));var j=u[f+"-"+O.id];return Object(c.h)("div",{class:"col-12 mb-2 pb-2 border-bottom",style:b?"text-decoration: line-through; opacity: 0.3;":""},Object(c.h)("div",{class:"d-flex position-relative"},Object(c.h)("div",{class:"text-center border rounded-circle imageRounded imageRoundedMedium",style:t?'background-image: url("'+t.s3MediumLink+'"); background-size: cover;':""},!t&&Object(c.h)("div",{class:"text-muted",style:"font-size: 20px; padding-top: 3px;"},o)),Object(c.h)("div",{class:"flex-grow-1 pl-3 text-overflow",style:"line-height: 1.2em;"},Object(c.h)("h5",{class:"mb-0"},d.public?Object(c.h)(e,null,Object(c.h)("a",{href:"/teams/public/"+d.uuidv4},s)):Object(c.h)(e,null,s)),Object(c.h)("div",null,d.place?d.place+", ":""," ",d.country,"  "),Object(c.h)("div",null,Object(c.h)("small",{class:"text-muted"},d&&d.dogs&&Object(c.h)("span",{class:""},Object(c.h)("i",{class:"fas fa-dog"})," ",d.dogs.length),d&&d.followers&&Object(c.h)("span",{class:"ml-2"},Object(c.h)("i",{class:"fas fa-user"})," ",d.followers.length),n&&Object(c.h)(e,null,Object(c.h)("small",{class:"ml-2 text-muted"},n)),p&&Object(c.h)(e,null,j?Object(c.h)(e,null,Object(c.h)("small",{class:"text-danger ml-3"},Object(c.h)("i",{class:"fas fa-ban"})," ",Object(c.h)(a.c,{id:"teams.connect.deleted"},"Deleted"))):Object(c.h)(e,null,Object(c.h)("button",{class:"btn btn-sm btn-link text-overflow p-0 text-muted ml-3",style:"font-size: 0.8em;",onClick:this.deleteRequest,"data-team":f,"data-user":O.id},Object(c.h)("i",{class:"fas fa-ban"})," ",Object(c.h)(a.c,{id:"teams.connect.block"},"Blokkere"))))))),Object(c.h)("div",null,m?Object(c.h)(e,null,this.getUnblockButton(O.id,f)):Object(c.h)(e,null,this.getButton(d)))))},o}(c.Component))||r;t.a=b}).call(this,o("hosL").Fragment)},rWES:function(e,t,o){"use strict";(function(e){function s(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,s)}return o}function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}var r,c=o("hosL"),l=o("Utv1"),a=o("/eY4"),i=o("OhSV"),u=o("ZOvn"),b=(o("eQ6k"),{confirmed:{},deleted:{}}),h=Object(a.a)(r=function(t){function o(e){var o;return(o=t.call(this,e)||this).confirmRequest=function(e){var t=e.target.closest("button").dataset,s=t.team,n=t.user,r=t.follow,c=o.props.stores.teamStore;c.confirmFollowRequest({team:parseInt(s,10),user:parseInt(n,10)});var l=o.state.confirmed;l[s+"-"+n]=!0,o.setState({confirmed:l}),r&&c.followRequestUser(n)},o.deleteRequest=function(e){var t=e.target.closest("button").dataset,s=t.team,n=t.user;o.props.stores.teamStore.deleteFollowRequest({team:parseInt(s,10),user:parseInt(n,10)});var r=o.state.deleted;r[s+"-"+n]=!0,o.setState({deleted:r})},o.state=function(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?s(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):s(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}({},b),o}var r,a;a=t,(r=o).prototype=Object.create(a.prototype),r.prototype.constructor=r,r.__proto__=a;var h=o.prototype;return h.loadTeams=function(){return new Promise(function(e,t){return Promise.resolve(this.props.stores.teamStore.load({query:{},addData:["followRequests"]})).then((function(){try{return e()}catch(e){return t(e)}}),t)}.bind(this))},h.componentDidMount=function(){this.loadTeams()},h.render=function(){var t=this,o=this.state,s=o.deleted,n=void 0===s?{}:s,r=o.confirmed,a=void 0===r?{}:r,b=this.props.stores,h=b.teamStore,d=h.teams,m=h.followRequests,f=void 0===m?[]:m,p=b.appState.darkmode;return h.hasFollowRequests?Object(c.h)("div",{class:"row pb-4"},Object(c.h)("div",{class:"col-12 col-sm-8 col-lg-6 offset-sm-2 offset-lg-3 mb-0 position-relative rounded rounded-lg py-3 bg-"+(p?"black":"white")+" shadow-sm"},Object(c.h)("div",{class:"container-fluid"},Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"col-12"},Object(c.h)("h5",null,Object(c.h)(i.c,{id:"teams.connect.teams-follow-requests"},"Forespørsel om å følge"),":"))),Object(c.h)("div",{class:"row"},Object(c.h)("div",{class:"d-flex flex-row flex-nowrap",style:"overflow: auto;"},l.a.isArray(d)&&d.map((function(o){return Object(c.h)(e,null,o&&l.a.isArray(o.followRequests)&&o.followRequests.map((function(s){var r=s.image&&s.image.s3SmallLink?s.image:null,l=n[o.id+"-"+s.id],b=a[o.id+"-"+s.id],h=f.find((function(e){return e.user.id===s.id}));return Object(c.h)("div",{class:"mr-2",style:"width: 150px;"},Object(c.h)("div",{class:"text-center border rounded-circle imageRounded mx-auto",style:r?'background-image: url("'+r.s3SmallLink+'");':""},!r&&Object(c.h)("div",{class:"text-muted font-weight-lighter",style:"font-size: 40px; padding-top: 5px;"},u.a.displayNameShort(s))),Object(c.h)("small",null,Object(c.h)("div",{class:"text-overflow text-center"},Object(c.h)("strong",null,u.a.displayName(s)),Object(c.h)("br",null),h&&h.public>0?Object(c.h)(e,null,Object(c.h)("a",{href:"/teams/public/"+h.uuidv4},h.name)):Object(c.h)(e,null,h?Object(c.h)(e,null,h.name):"",Object(c.h)("br",null),Object(c.h)("span",{class:"text-muted"},"(",Object(c.h)(i.c,{id:"teams.not-public"},"Not public"),")"))),Object(c.h)("div",{class:"text-overflow text-center"},Object(c.h)(i.c,{id:"teams.connect.wants-to-follow"},"wants to follow your team:")),Object(c.h)("div",{class:"text-overflow text-center"},Object(c.h)("strong",null,u.a.displayName(o)))),b||l?Object(c.h)(e,null,Object(c.h)("div",{class:"text-center"},b?Object(c.h)("div",{class:"text-success"},Object(c.h)(i.c,{id:"teams.connect.confirmed"},"Confirmed")," ",Object(c.h)("i",{class:"fas fa-check"})):Object(c.h)("div",{class:"text-danger"},Object(c.h)(i.c,{id:"teams.connect.deleted"},"Deleted")," ",Object(c.h)("i",{class:"fas fa-trash-alt"})))):Object(c.h)(e,null,Object(c.h)("div",null,Object(c.h)("button",{class:"btn btn-sm btn-block btn-success text-overflow mt-1",onClick:t.confirmRequest,"data-team":o.id,"data-user":s.id},Object(c.h)(i.c,{id:"teams.connect.confirm"},"Confirm")),h&&h.public>0&&Object(c.h)("button",{class:"btn btn-sm btn-block btn-outline-success text-overflow mt-1",onClick:t.confirmRequest,"data-team":o.id,"data-user":s.id,"data-follow":!0},Object(c.h)(i.c,{id:"teams.connect.confirm-and-follow"},"Confirm & follow back")),Object(c.h)("small",{class:"mt-3"},Object(c.h)("button",{class:"btn btn-sm btn-block btn-link text-overflow",onClick:t.deleteRequest,"data-team":o.id,"data-user":s.id},Object(c.h)(i.c,{id:"teams.connect.delete"},"Del"))))))})))})))),Object(c.h)("details",{class:"mt-3"},Object(c.h)("summary",null,Object(c.h)(i.c,{id:"teams.connect.how-summary"},"How does this work?")),Object(c.h)("p",null,Object(c.h)(i.c,{id:"teams.connect.how-text"},"What can followers see when I grant them access to follow? The answer is very little. They can see main details of the workouts you share and name of the dogs. That's all. Try to follow a team and check out the workout tab.")))))):""},o}(c.Component))||r;t.a=h}).call(this,o("hosL").Fragment)}}]);
//# sourceMappingURL=58.chunk.56fdb.js.map