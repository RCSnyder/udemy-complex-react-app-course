"use strict";(self.webpackChunkcomplex_react_app=self.webpackChunkcomplex_react_app||[]).push([[504],{504:(e,t,a)=>{a.r(t),a.d(t,{default:()=>m});var l=a(294),o=a(250),s=a(387),n=a(817),r=a(983),c=a(564);const m=function(e){const[t,a]=(0,l.useState)(),[m,u]=(0,l.useState)(),p=(0,o.s0)(),d=(0,l.useContext)(r.Z),i=(0,l.useContext)(c.Z);return l.createElement(s.Z,{title:"Create New Post"},l.createElement("form",{onSubmit:async function(e){e.preventDefault();try{const e=await n.Z.post("/create-post",{title:t,body:m,token:i.user.token});d({type:"flashMessage",value:"Successfully created a new post!"}),p(`/post/${e.data}`),console.log("New post was created.")}catch(e){console.log("There was a problem")}}},l.createElement("div",{className:"form-group"},l.createElement("label",{htmlFor:"post-title",className:"text-muted mb-1"},l.createElement("small",null,"Title")),l.createElement("input",{onChange:e=>a(e.target.value),autoFocus:!0,name:"title",id:"post-title",className:"form-control form-control-lg form-control-title",type:"text",placeholder:"",autoComplete:"off"})),l.createElement("div",{className:"form-group"},l.createElement("label",{htmlFor:"post-body",className:"text-muted mb-1 d-block"},l.createElement("small",null,"Body Content")),l.createElement("textarea",{onChange:e=>u(e.target.value),name:"body",id:"post-body",className:"body-content tall-textarea form-control",type:"text"})),l.createElement("button",{className:"btn btn-primary"},"Save New Post")))}}}]);