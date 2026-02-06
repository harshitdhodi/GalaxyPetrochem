import{a9 as r,x as o}from"./ContextIsolator-BPb4AaW6-1770363384403.js";import"./index-CeZ4ocjI-1770363384403.js";import"./AntdIcon-C2xKGZtm-1770363384403.js";const c=new o("antFadeIn",{"0%":{opacity:0},"100%":{opacity:1}}),s=new o("antFadeOut",{"0%":{opacity:1},"100%":{opacity:0}}),f=(t,a=!1)=>{const{antCls:e}=t,n=`${e}-fade`,i=a?"&":"";return[r(n,c,s,t.motionDurationMid,a),{[`
        ${i}${n}-enter,
        ${i}${n}-appear
      `]:{opacity:0,animationTimingFunction:"linear"},[`${i}${n}-leave`]:{animationTimingFunction:"linear"}}]};export{f as i};
