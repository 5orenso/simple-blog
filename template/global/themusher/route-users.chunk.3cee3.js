(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{ztHd:function(e,r,t){"use strict";t.r(r);var o,s=t("hosL"),i=(t("Utv1"),t("/eY4")),a=t("tJLP"),n=t("Cjoz"),c=Object(i.a)(o=function(e){function r(r){var t;return(t=e.call(this,r)||this).resetEmailMessage=function(){var e=t.props.stores.userStore;e.updateField("emailMessage",""),e.updateField("emailMessageIcon","")},t.resetEmailError=function(){var e=t.props.stores.userStore;e.updateField("emailError",""),e.updateField("emailErrorIcon","")},t.state={time:Date.now(),count:10},t}var t,o;o=e,(t=r).prototype=Object.create(o.prototype),t.prototype.constructor=t,t.__proto__=o;var i=r.prototype;return i.componentDidMount=function(){this.props.verifyEmailToken&&this.props.stores.userStore.verifyEmail({token:this.props.verifyEmailToken})},i.render=function(){var e=this.props.stores.userStore,r=e.emailMessage,t=e.emailError,o=e.emailMessageIcon,i=e.emailErrorIcon,c=e.user.email;return Object(s.h)("div",{class:"container-fluid"},Object(s.h)("div",{class:"row"},Object(s.h)("div",{class:"col-12"},Object(s.h)(a.a,{message:t,icon:i,remove:this.resetEmailError}),Object(s.h)(n.a,{message:r,icon:o,remove:this.resetEmailMessage}),Object(s.h)("h1",null,"Users: ",c),Object(s.h)("p",null,"This is the user profile for a user named ",c,"."))))},r}(s.Component))||o;r.default=c}}]);
//# sourceMappingURL=route-users.chunk.3cee3.js.map