var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,a)=>(a=n==null?{}:e(i(n)),c(r||!n||!n.__esModule?t(a,`default`,{value:n,enumerable:!0}):a,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin===`use-credentials`?t.credentials=`include`:e.crossOrigin===`anonymous`?t.credentials=`omit`:t.credentials=`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var u=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.portal`),r=Symbol.for(`react.fragment`),i=Symbol.for(`react.strict_mode`),a=Symbol.for(`react.profiler`),o=Symbol.for(`react.consumer`),s=Symbol.for(`react.context`),c=Symbol.for(`react.forward_ref`),l=Symbol.for(`react.suspense`),u=Symbol.for(`react.memo`),d=Symbol.for(`react.lazy`),f=Symbol.for(`react.activity`),p=Symbol.iterator;function m(e){return typeof e!=`object`||!e?null:(e=p&&e[p]||e[`@@iterator`],typeof e==`function`?e:null)}var h={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},g=Object.assign,_={};function v(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}v.prototype.isReactComponent={},v.prototype.setState=function(e,t){if(typeof e!=`object`&&typeof e!=`function`&&e!=null)throw Error(`takes an object of state variables to update or a function which returns an object of state variables.`);this.updater.enqueueSetState(this,e,t,`setState`)},v.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,`forceUpdate`)};function y(){}y.prototype=v.prototype;function b(e,t,n){this.props=e,this.context=t,this.refs=_,this.updater=n||h}var x=b.prototype=new y;x.constructor=b,g(x,v.prototype),x.isPureReactComponent=!0;var ee=Array.isArray;function S(){}var C={H:null,A:null,T:null,S:null},w=Object.prototype.hasOwnProperty;function T(e,n,r){var i=r.ref;return{$$typeof:t,type:e,key:n,ref:i===void 0?null:i,props:r}}function te(e,t){return T(e.type,t,e.props)}function E(e){return typeof e==`object`&&!!e&&e.$$typeof===t}function ne(e){var t={"=":`=0`,":":`=2`};return`$`+e.replace(/[=:]/g,function(e){return t[e]})}var re=/\/+/g;function ie(e,t){return typeof e==`object`&&e&&e.key!=null?ne(``+e.key):t.toString(36)}function ae(e){switch(e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason;default:switch(typeof e.status==`string`?e.then(S,S):(e.status=`pending`,e.then(function(t){e.status===`pending`&&(e.status=`fulfilled`,e.value=t)},function(t){e.status===`pending`&&(e.status=`rejected`,e.reason=t)})),e.status){case`fulfilled`:return e.value;case`rejected`:throw e.reason}}throw e}function oe(e,r,i,a,o){var s=typeof e;(s===`undefined`||s===`boolean`)&&(e=null);var c=!1;if(e===null)c=!0;else switch(s){case`bigint`:case`string`:case`number`:c=!0;break;case`object`:switch(e.$$typeof){case t:case n:c=!0;break;case d:return c=e._init,oe(c(e._payload),r,i,a,o)}}if(c)return o=o(e),c=a===``?`.`+ie(e,0):a,ee(o)?(i=``,c!=null&&(i=c.replace(re,`$&/`)+`/`),oe(o,r,i,``,function(e){return e})):o!=null&&(E(o)&&(o=te(o,i+(o.key==null||e&&e.key===o.key?``:(``+o.key).replace(re,`$&/`)+`/`)+c)),r.push(o)),1;c=0;var l=a===``?`.`:a+`:`;if(ee(e))for(var u=0;u<e.length;u++)a=e[u],s=l+ie(a,u),c+=oe(a,r,i,s,o);else if(u=m(e),typeof u==`function`)for(e=u.call(e),u=0;!(a=e.next()).done;)a=a.value,s=l+ie(a,u++),c+=oe(a,r,i,s,o);else if(s===`object`){if(typeof e.then==`function`)return oe(ae(e),r,i,a,o);throw r=String(e),Error(`Objects are not valid as a React child (found: `+(r===`[object Object]`?`object with keys {`+Object.keys(e).join(`, `)+`}`:r)+`). If you meant to render a collection of children, use an array instead.`)}return c}function se(e,t,n){if(e==null)return e;var r=[],i=0;return oe(e,r,``,``,function(e){return t.call(n,e,i++)}),r}function ce(e){if(e._status===-1){var t=e._result;t=t(),t.then(function(t){(e._status===0||e._status===-1)&&(e._status=1,e._result=t)},function(t){(e._status===0||e._status===-1)&&(e._status=2,e._result=t)}),e._status===-1&&(e._status=0,e._result=t)}if(e._status===1)return e._result.default;throw e._result}var D=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},O={map:se,forEach:function(e,t,n){se(e,function(){t.apply(this,arguments)},n)},count:function(e){var t=0;return se(e,function(){t++}),t},toArray:function(e){return se(e,function(e){return e})||[]},only:function(e){if(!E(e))throw Error(`React.Children.only expected to receive a single React element child.`);return e}};e.Activity=f,e.Children=O,e.Component=v,e.Fragment=r,e.Profiler=a,e.PureComponent=b,e.StrictMode=i,e.Suspense=l,e.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=C,e.__COMPILER_RUNTIME={__proto__:null,c:function(e){return C.H.useMemoCache(e)}},e.cache=function(e){return function(){return e.apply(null,arguments)}},e.cacheSignal=function(){return null},e.cloneElement=function(e,t,n){if(e==null)throw Error(`The argument must be a React element, but you passed `+e+`.`);var r=g({},e.props),i=e.key;if(t!=null)for(a in t.key!==void 0&&(i=``+t.key),t)!w.call(t,a)||a===`key`||a===`__self`||a===`__source`||a===`ref`&&t.ref===void 0||(r[a]=t[a]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var o=Array(a),s=0;s<a;s++)o[s]=arguments[s+2];r.children=o}return T(e.type,i,r)},e.createContext=function(e){return e={$$typeof:s,_currentValue:e,_currentValue2:e,_threadCount:0,Provider:null,Consumer:null},e.Provider=e,e.Consumer={$$typeof:o,_context:e},e},e.createElement=function(e,t,n){var r,i={},a=null;if(t!=null)for(r in t.key!==void 0&&(a=``+t.key),t)w.call(t,r)&&r!==`key`&&r!==`__self`&&r!==`__source`&&(i[r]=t[r]);var o=arguments.length-2;if(o===1)i.children=n;else if(1<o){for(var s=Array(o),c=0;c<o;c++)s[c]=arguments[c+2];i.children=s}if(e&&e.defaultProps)for(r in o=e.defaultProps,o)i[r]===void 0&&(i[r]=o[r]);return T(e,a,i)},e.createRef=function(){return{current:null}},e.forwardRef=function(e){return{$$typeof:c,render:e}},e.isValidElement=E,e.lazy=function(e){return{$$typeof:d,_payload:{_status:-1,_result:e},_init:ce}},e.memo=function(e,t){return{$$typeof:u,type:e,compare:t===void 0?null:t}},e.startTransition=function(e){var t=C.T,n={};C.T=n;try{var r=e(),i=C.S;i!==null&&i(n,r),typeof r==`object`&&r&&typeof r.then==`function`&&r.then(S,D)}catch(e){D(e)}finally{t!==null&&n.types!==null&&(t.types=n.types),C.T=t}},e.unstable_useCacheRefresh=function(){return C.H.useCacheRefresh()},e.use=function(e){return C.H.use(e)},e.useActionState=function(e,t,n){return C.H.useActionState(e,t,n)},e.useCallback=function(e,t){return C.H.useCallback(e,t)},e.useContext=function(e){return C.H.useContext(e)},e.useDebugValue=function(){},e.useDeferredValue=function(e,t){return C.H.useDeferredValue(e,t)},e.useEffect=function(e,t){return C.H.useEffect(e,t)},e.useEffectEvent=function(e){return C.H.useEffectEvent(e)},e.useId=function(){return C.H.useId()},e.useImperativeHandle=function(e,t,n){return C.H.useImperativeHandle(e,t,n)},e.useInsertionEffect=function(e,t){return C.H.useInsertionEffect(e,t)},e.useLayoutEffect=function(e,t){return C.H.useLayoutEffect(e,t)},e.useMemo=function(e,t){return C.H.useMemo(e,t)},e.useOptimistic=function(e,t){return C.H.useOptimistic(e,t)},e.useReducer=function(e,t,n){return C.H.useReducer(e,t,n)},e.useRef=function(e){return C.H.useRef(e)},e.useState=function(e){return C.H.useState(e)},e.useSyncExternalStore=function(e,t,n){return C.H.useSyncExternalStore(e,t,n)},e.useTransition=function(){return C.H.useTransition()},e.version=`19.2.4`})),d=o(((e,t)=>{t.exports=u()})),f=o((e=>{function t(e,t){var n=e.length;e.push(t);a:for(;0<n;){var r=n-1>>>1,a=e[r];if(0<i(a,t))e[r]=t,e[n]=a,n=r;else break a}}function n(e){return e.length===0?null:e[0]}function r(e){if(e.length===0)return null;var t=e[0],n=e.pop();if(n!==t){e[0]=n;a:for(var r=0,a=e.length,o=a>>>1;r<o;){var s=2*(r+1)-1,c=e[s],l=s+1,u=e[l];if(0>i(c,n))l<a&&0>i(u,c)?(e[r]=u,e[l]=n,r=l):(e[r]=c,e[s]=n,r=s);else if(l<a&&0>i(u,n))e[r]=u,e[l]=n,r=l;else break a}}return t}function i(e,t){var n=e.sortIndex-t.sortIndex;return n===0?e.id-t.id:n}if(e.unstable_now=void 0,typeof performance==`object`&&typeof performance.now==`function`){var a=performance;e.unstable_now=function(){return a.now()}}else{var o=Date,s=o.now();e.unstable_now=function(){return o.now()-s}}var c=[],l=[],u=1,d=null,f=3,p=!1,m=!1,h=!1,g=!1,_=typeof setTimeout==`function`?setTimeout:null,v=typeof clearTimeout==`function`?clearTimeout:null,y=typeof setImmediate<`u`?setImmediate:null;function b(e){for(var i=n(l);i!==null;){if(i.callback===null)r(l);else if(i.startTime<=e)r(l),i.sortIndex=i.expirationTime,t(c,i);else break;i=n(l)}}function x(e){if(h=!1,b(e),!m)if(n(c)!==null)m=!0,ee||(ee=!0,E());else{var t=n(l);t!==null&&ie(x,t.startTime-e)}}var ee=!1,S=-1,C=5,w=-1;function T(){return g?!0:!(e.unstable_now()-w<C)}function te(){if(g=!1,ee){var t=e.unstable_now();w=t;var i=!0;try{a:{m=!1,h&&(h=!1,v(S),S=-1),p=!0;var a=f;try{b:{for(b(t),d=n(c);d!==null&&!(d.expirationTime>t&&T());){var o=d.callback;if(typeof o==`function`){d.callback=null,f=d.priorityLevel;var s=o(d.expirationTime<=t);if(t=e.unstable_now(),typeof s==`function`){d.callback=s,b(t),i=!0;break b}d===n(c)&&r(c),b(t)}else r(c);d=n(c)}if(d!==null)i=!0;else{var u=n(l);u!==null&&ie(x,u.startTime-t),i=!1}}break a}finally{d=null,f=a,p=!1}i=void 0}}finally{i?E():ee=!1}}}var E;if(typeof y==`function`)E=function(){y(te)};else if(typeof MessageChannel<`u`){var ne=new MessageChannel,re=ne.port2;ne.port1.onmessage=te,E=function(){re.postMessage(null)}}else E=function(){_(te,0)};function ie(t,n){S=_(function(){t(e.unstable_now())},n)}e.unstable_IdlePriority=5,e.unstable_ImmediatePriority=1,e.unstable_LowPriority=4,e.unstable_NormalPriority=3,e.unstable_Profiling=null,e.unstable_UserBlockingPriority=2,e.unstable_cancelCallback=function(e){e.callback=null},e.unstable_forceFrameRate=function(e){0>e||125<e?console.error(`forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported`):C=0<e?Math.floor(1e3/e):5},e.unstable_getCurrentPriorityLevel=function(){return f},e.unstable_next=function(e){switch(f){case 1:case 2:case 3:var t=3;break;default:t=f}var n=f;f=t;try{return e()}finally{f=n}},e.unstable_requestPaint=function(){g=!0},e.unstable_runWithPriority=function(e,t){switch(e){case 1:case 2:case 3:case 4:case 5:break;default:e=3}var n=f;f=e;try{return t()}finally{f=n}},e.unstable_scheduleCallback=function(r,i,a){var o=e.unstable_now();switch(typeof a==`object`&&a?(a=a.delay,a=typeof a==`number`&&0<a?o+a:o):a=o,r){case 1:var s=-1;break;case 2:s=250;break;case 5:s=1073741823;break;case 4:s=1e4;break;default:s=5e3}return s=a+s,r={id:u++,callback:i,priorityLevel:r,startTime:a,expirationTime:s,sortIndex:-1},a>o?(r.sortIndex=a,t(l,r),n(c)===null&&r===n(l)&&(h?(v(S),S=-1):h=!0,ie(x,a-o))):(r.sortIndex=s,t(c,r),m||p||(m=!0,ee||(ee=!0,E()))),r},e.unstable_shouldYield=T,e.unstable_wrapCallback=function(e){var t=f;return function(){var n=f;f=t;try{return e.apply(this,arguments)}finally{f=n}}}})),p=o(((e,t)=>{t.exports=f()})),m=o((e=>{var t=d();function n(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function r(){}var i={d:{f:r,r:function(){throw Error(n(522))},D:r,C:r,L:r,m:r,X:r,S:r,M:r},p:0,findDOMNode:null},a=Symbol.for(`react.portal`);function o(e,t,n){var r=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:a,key:r==null?null:``+r,children:e,containerInfo:t,implementation:n}}var s=t.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;function c(e,t){if(e===`font`)return``;if(typeof t==`string`)return t===`use-credentials`?t:``}e.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE=i,e.createPortal=function(e,t){var r=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)throw Error(n(299));return o(e,t,null,r)},e.flushSync=function(e){var t=s.T,n=i.p;try{if(s.T=null,i.p=2,e)return e()}finally{s.T=t,i.p=n,i.d.f()}},e.preconnect=function(e,t){typeof e==`string`&&(t?(t=t.crossOrigin,t=typeof t==`string`?t===`use-credentials`?t:``:void 0):t=null,i.d.C(e,t))},e.prefetchDNS=function(e){typeof e==`string`&&i.d.D(e)},e.preinit=function(e,t){if(typeof e==`string`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin),a=typeof t.integrity==`string`?t.integrity:void 0,o=typeof t.fetchPriority==`string`?t.fetchPriority:void 0;n===`style`?i.d.S(e,typeof t.precedence==`string`?t.precedence:void 0,{crossOrigin:r,integrity:a,fetchPriority:o}):n===`script`&&i.d.X(e,{crossOrigin:r,integrity:a,fetchPriority:o,nonce:typeof t.nonce==`string`?t.nonce:void 0})}},e.preinitModule=function(e,t){if(typeof e==`string`)if(typeof t==`object`&&t){if(t.as==null||t.as===`script`){var n=c(t.as,t.crossOrigin);i.d.M(e,{crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0})}}else t??i.d.M(e)},e.preload=function(e,t){if(typeof e==`string`&&typeof t==`object`&&t&&typeof t.as==`string`){var n=t.as,r=c(n,t.crossOrigin);i.d.L(e,n,{crossOrigin:r,integrity:typeof t.integrity==`string`?t.integrity:void 0,nonce:typeof t.nonce==`string`?t.nonce:void 0,type:typeof t.type==`string`?t.type:void 0,fetchPriority:typeof t.fetchPriority==`string`?t.fetchPriority:void 0,referrerPolicy:typeof t.referrerPolicy==`string`?t.referrerPolicy:void 0,imageSrcSet:typeof t.imageSrcSet==`string`?t.imageSrcSet:void 0,imageSizes:typeof t.imageSizes==`string`?t.imageSizes:void 0,media:typeof t.media==`string`?t.media:void 0})}},e.preloadModule=function(e,t){if(typeof e==`string`)if(t){var n=c(t.as,t.crossOrigin);i.d.m(e,{as:typeof t.as==`string`&&t.as!==`script`?t.as:void 0,crossOrigin:n,integrity:typeof t.integrity==`string`?t.integrity:void 0})}else i.d.m(e)},e.requestFormReset=function(e){i.d.r(e)},e.unstable_batchedUpdates=function(e,t){return e(t)},e.useFormState=function(e,t,n){return s.H.useFormState(e,t,n)},e.useFormStatus=function(){return s.H.useHostTransitionStatus()},e.version=`19.2.4`})),h=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=m()})),g=o((e=>{var t=p(),n=d(),r=h();function i(e){var t=`https://react.dev/errors/`+e;if(1<arguments.length){t+=`?args[]=`+encodeURIComponent(arguments[1]);for(var n=2;n<arguments.length;n++)t+=`&args[]=`+encodeURIComponent(arguments[n])}return`Minified React error #`+e+`; visit `+t+` for the full message or use the non-minified dev environment for full errors and additional helpful warnings.`}function a(e){return!(!e||e.nodeType!==1&&e.nodeType!==9&&e.nodeType!==11)}function o(e){var t=e,n=e;if(e.alternate)for(;t.return;)t=t.return;else{e=t;do t=e,t.flags&4098&&(n=t.return),e=t.return;while(e)}return t.tag===3?n:null}function s(e){if(e.tag===13){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function c(e){if(e.tag===31){var t=e.memoizedState;if(t===null&&(e=e.alternate,e!==null&&(t=e.memoizedState)),t!==null)return t.dehydrated}return null}function l(e){if(o(e)!==e)throw Error(i(188))}function u(e){var t=e.alternate;if(!t){if(t=o(e),t===null)throw Error(i(188));return t===e?e:null}for(var n=e,r=t;;){var a=n.return;if(a===null)break;var s=a.alternate;if(s===null){if(r=a.return,r!==null){n=r;continue}break}if(a.child===s.child){for(s=a.child;s;){if(s===n)return l(a),e;if(s===r)return l(a),t;s=s.sibling}throw Error(i(188))}if(n.return!==r.return)n=a,r=s;else{for(var c=!1,u=a.child;u;){if(u===n){c=!0,n=a,r=s;break}if(u===r){c=!0,r=a,n=s;break}u=u.sibling}if(!c){for(u=s.child;u;){if(u===n){c=!0,n=s,r=a;break}if(u===r){c=!0,r=s,n=a;break}u=u.sibling}if(!c)throw Error(i(189))}}if(n.alternate!==r)throw Error(i(190))}if(n.tag!==3)throw Error(i(188));return n.stateNode.current===n?e:t}function f(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e;for(e=e.child;e!==null;){if(t=f(e),t!==null)return t;e=e.sibling}return null}var m=Object.assign,g=Symbol.for(`react.element`),_=Symbol.for(`react.transitional.element`),v=Symbol.for(`react.portal`),y=Symbol.for(`react.fragment`),b=Symbol.for(`react.strict_mode`),x=Symbol.for(`react.profiler`),ee=Symbol.for(`react.consumer`),S=Symbol.for(`react.context`),C=Symbol.for(`react.forward_ref`),w=Symbol.for(`react.suspense`),T=Symbol.for(`react.suspense_list`),te=Symbol.for(`react.memo`),E=Symbol.for(`react.lazy`),ne=Symbol.for(`react.activity`),re=Symbol.for(`react.memo_cache_sentinel`),ie=Symbol.iterator;function ae(e){return typeof e!=`object`||!e?null:(e=ie&&e[ie]||e[`@@iterator`],typeof e==`function`?e:null)}var oe=Symbol.for(`react.client.reference`);function se(e){if(e==null)return null;if(typeof e==`function`)return e.$$typeof===oe?null:e.displayName||e.name||null;if(typeof e==`string`)return e;switch(e){case y:return`Fragment`;case x:return`Profiler`;case b:return`StrictMode`;case w:return`Suspense`;case T:return`SuspenseList`;case ne:return`Activity`}if(typeof e==`object`)switch(e.$$typeof){case v:return`Portal`;case S:return e.displayName||`Context`;case ee:return(e._context.displayName||`Context`)+`.Consumer`;case C:var t=e.render;return e=e.displayName,e||=(e=t.displayName||t.name||``,e===``?`ForwardRef`:`ForwardRef(`+e+`)`),e;case te:return t=e.displayName||null,t===null?se(e.type)||`Memo`:t;case E:t=e._payload,e=e._init;try{return se(e(t))}catch{}}return null}var ce=Array.isArray,D=n.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,O=r.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,le={pending:!1,data:null,method:null,action:null},ue=[],de=-1;function fe(e){return{current:e}}function pe(e){0>de||(e.current=ue[de],ue[de]=null,de--)}function me(e,t){de++,ue[de]=e.current,e.current=t}var he=fe(null),ge=fe(null),_e=fe(null),ve=fe(null);function ye(e,t){switch(me(_e,t),me(ge,e),me(he,null),t.nodeType){case 9:case 11:e=(e=t.documentElement)&&(e=e.namespaceURI)?Vd(e):0;break;default:if(e=t.tagName,t=t.namespaceURI)t=Vd(t),e=Hd(t,e);else switch(e){case`svg`:e=1;break;case`math`:e=2;break;default:e=0}}pe(he),me(he,e)}function be(){pe(he),pe(ge),pe(_e)}function xe(e){e.memoizedState!==null&&me(ve,e);var t=he.current,n=Hd(t,e.type);t!==n&&(me(ge,e),me(he,n))}function Se(e){ge.current===e&&(pe(he),pe(ge)),ve.current===e&&(pe(ve),Qf._currentValue=le)}var Ce,we;function Te(e){if(Ce===void 0)try{throw Error()}catch(e){var t=e.stack.trim().match(/\n( *(at )?)/);Ce=t&&t[1]||``,we=-1<e.stack.indexOf(`
    at`)?` (<anonymous>)`:-1<e.stack.indexOf(`@`)?`@unknown:0:0`:``}return`
`+Ce+e+we}var Ee=!1;function De(e,t){if(!e||Ee)return``;Ee=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{var r={DetermineComponentFrameRoot:function(){try{if(t){var n=function(){throw Error()};if(Object.defineProperty(n.prototype,`props`,{set:function(){throw Error()}}),typeof Reflect==`object`&&Reflect.construct){try{Reflect.construct(n,[])}catch(e){var r=e}Reflect.construct(e,[],n)}else{try{n.call()}catch(e){r=e}e.call(n.prototype)}}else{try{throw Error()}catch(e){r=e}(n=e())&&typeof n.catch==`function`&&n.catch(function(){})}}catch(e){if(e&&r&&typeof e.stack==`string`)return[e.stack,r.stack]}return[null,null]}};r.DetermineComponentFrameRoot.displayName=`DetermineComponentFrameRoot`;var i=Object.getOwnPropertyDescriptor(r.DetermineComponentFrameRoot,`name`);i&&i.configurable&&Object.defineProperty(r.DetermineComponentFrameRoot,`name`,{value:`DetermineComponentFrameRoot`});var a=r.DetermineComponentFrameRoot(),o=a[0],s=a[1];if(o&&s){var c=o.split(`
`),l=s.split(`
`);for(i=r=0;r<c.length&&!c[r].includes(`DetermineComponentFrameRoot`);)r++;for(;i<l.length&&!l[i].includes(`DetermineComponentFrameRoot`);)i++;if(r===c.length||i===l.length)for(r=c.length-1,i=l.length-1;1<=r&&0<=i&&c[r]!==l[i];)i--;for(;1<=r&&0<=i;r--,i--)if(c[r]!==l[i]){if(r!==1||i!==1)do if(r--,i--,0>i||c[r]!==l[i]){var u=`
`+c[r].replace(` at new `,` at `);return e.displayName&&u.includes(`<anonymous>`)&&(u=u.replace(`<anonymous>`,e.displayName)),u}while(1<=r&&0<=i);break}}}finally{Ee=!1,Error.prepareStackTrace=n}return(n=e?e.displayName||e.name:``)?Te(n):``}function Oe(e,t){switch(e.tag){case 26:case 27:case 5:return Te(e.type);case 16:return Te(`Lazy`);case 13:return e.child!==t&&t!==null?Te(`Suspense Fallback`):Te(`Suspense`);case 19:return Te(`SuspenseList`);case 0:case 15:return De(e.type,!1);case 11:return De(e.type.render,!1);case 1:return De(e.type,!0);case 31:return Te(`Activity`);default:return``}}function ke(e){try{var t=``,n=null;do t+=Oe(e,n),n=e,e=e.return;while(e);return t}catch(e){return`
Error generating stack: `+e.message+`
`+e.stack}}var Ae=Object.prototype.hasOwnProperty,je=t.unstable_scheduleCallback,Me=t.unstable_cancelCallback,Ne=t.unstable_shouldYield,Pe=t.unstable_requestPaint,Fe=t.unstable_now,Ie=t.unstable_getCurrentPriorityLevel,Le=t.unstable_ImmediatePriority,Re=t.unstable_UserBlockingPriority,ze=t.unstable_NormalPriority,Be=t.unstable_LowPriority,Ve=t.unstable_IdlePriority,He=t.log,Ue=t.unstable_setDisableYieldValue,We=null,Ge=null;function Ke(e){if(typeof He==`function`&&Ue(e),Ge&&typeof Ge.setStrictMode==`function`)try{Ge.setStrictMode(We,e)}catch{}}var qe=Math.clz32?Math.clz32:Xe,Je=Math.log,Ye=Math.LN2;function Xe(e){return e>>>=0,e===0?32:31-(Je(e)/Ye|0)|0}var Ze=256,Qe=262144,$e=4194304;function et(e){var t=e&42;if(t!==0)return t;switch(e&-e){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:return 64;case 128:return 128;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:return e&261888;case 262144:case 524288:case 1048576:case 2097152:return e&3932160;case 4194304:case 8388608:case 16777216:case 33554432:return e&62914560;case 67108864:return 67108864;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 0;default:return e}}function tt(e,t,n){var r=e.pendingLanes;if(r===0)return 0;var i=0,a=e.suspendedLanes,o=e.pingedLanes;e=e.warmLanes;var s=r&134217727;return s===0?(s=r&~a,s===0?o===0?n||(n=r&~e,n!==0&&(i=et(n))):i=et(o):i=et(s)):(r=s&~a,r===0?(o&=s,o===0?n||(n=s&~e,n!==0&&(i=et(n))):i=et(o)):i=et(r)),i===0?0:t!==0&&t!==i&&(t&a)===0&&(a=i&-i,n=t&-t,a>=n||a===32&&n&4194048)?t:i}function nt(e,t){return(e.pendingLanes&~(e.suspendedLanes&~e.pingedLanes)&t)===0}function rt(e,t){switch(e){case 1:case 2:case 4:case 8:case 64:return t+250;case 16:case 32:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t+5e3;case 4194304:case 8388608:case 16777216:case 33554432:return-1;case 67108864:case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function it(){var e=$e;return $e<<=1,!($e&62914560)&&($e=4194304),e}function at(e){for(var t=[],n=0;31>n;n++)t.push(e);return t}function ot(e,t){e.pendingLanes|=t,t!==268435456&&(e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0)}function st(e,t,n,r,i,a){var o=e.pendingLanes;e.pendingLanes=n,e.suspendedLanes=0,e.pingedLanes=0,e.warmLanes=0,e.expiredLanes&=n,e.entangledLanes&=n,e.errorRecoveryDisabledLanes&=n,e.shellSuspendCounter=0;var s=e.entanglements,c=e.expirationTimes,l=e.hiddenUpdates;for(n=o&~n;0<n;){var u=31-qe(n),d=1<<u;s[u]=0,c[u]=-1;var f=l[u];if(f!==null)for(l[u]=null,u=0;u<f.length;u++){var p=f[u];p!==null&&(p.lane&=-536870913)}n&=~d}r!==0&&ct(e,r,0),a!==0&&i===0&&e.tag!==0&&(e.suspendedLanes|=a&~(o&~t))}function ct(e,t,n){e.pendingLanes|=t,e.suspendedLanes&=~t;var r=31-qe(t);e.entangledLanes|=t,e.entanglements[r]=e.entanglements[r]|1073741824|n&261930}function lt(e,t){var n=e.entangledLanes|=t;for(e=e.entanglements;n;){var r=31-qe(n),i=1<<r;i&t|e[r]&t&&(e[r]|=t),n&=~i}}function ut(e,t){var n=t&-t;return n=n&42?1:dt(n),(n&(e.suspendedLanes|t))===0?n:0}function dt(e){switch(e){case 2:e=1;break;case 8:e=4;break;case 32:e=16;break;case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:e=128;break;case 268435456:e=134217728;break;default:e=0}return e}function ft(e){return e&=-e,2<e?8<e?e&134217727?32:268435456:8:2}function pt(){var e=O.p;return e===0?(e=window.event,e===void 0?32:mp(e.type)):e}function mt(e,t){var n=O.p;try{return O.p=e,t()}finally{O.p=n}}var ht=Math.random().toString(36).slice(2),gt=`__reactFiber$`+ht,_t=`__reactProps$`+ht,vt=`__reactContainer$`+ht,yt=`__reactEvents$`+ht,bt=`__reactListeners$`+ht,xt=`__reactHandles$`+ht,St=`__reactResources$`+ht,Ct=`__reactMarker$`+ht;function wt(e){delete e[gt],delete e[_t],delete e[yt],delete e[bt],delete e[xt]}function Tt(e){var t=e[gt];if(t)return t;for(var n=e.parentNode;n;){if(t=n[vt]||n[gt]){if(n=t.alternate,t.child!==null||n!==null&&n.child!==null)for(e=df(e);e!==null;){if(n=e[gt])return n;e=df(e)}return t}e=n,n=e.parentNode}return null}function Et(e){if(e=e[gt]||e[vt]){var t=e.tag;if(t===5||t===6||t===13||t===31||t===26||t===27||t===3)return e}return null}function Dt(e){var t=e.tag;if(t===5||t===26||t===27||t===6)return e.stateNode;throw Error(i(33))}function Ot(e){var t=e[St];return t||=e[St]={hoistableStyles:new Map,hoistableScripts:new Map},t}function kt(e){e[Ct]=!0}var At=new Set,jt={};function Mt(e,t){Nt(e,t),Nt(e+`Capture`,t)}function Nt(e,t){for(jt[e]=t,e=0;e<t.length;e++)At.add(t[e])}var Pt=RegExp(`^[:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD][:A-Z_a-z\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD\\-.0-9\\u00B7\\u0300-\\u036F\\u203F-\\u2040]*$`),Ft={},It={};function Lt(e){return Ae.call(It,e)?!0:Ae.call(Ft,e)?!1:Pt.test(e)?It[e]=!0:(Ft[e]=!0,!1)}function Rt(e,t,n){if(Lt(t))if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:e.removeAttribute(t);return;case`boolean`:var r=t.toLowerCase().slice(0,5);if(r!==`data-`&&r!==`aria-`){e.removeAttribute(t);return}}e.setAttribute(t,``+n)}}function zt(e,t,n){if(n===null)e.removeAttribute(t);else{switch(typeof n){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(t);return}e.setAttribute(t,``+n)}}function Bt(e,t,n,r){if(r===null)e.removeAttribute(n);else{switch(typeof r){case`undefined`:case`function`:case`symbol`:case`boolean`:e.removeAttribute(n);return}e.setAttributeNS(t,n,``+r)}}function Vt(e){switch(typeof e){case`bigint`:case`boolean`:case`number`:case`string`:case`undefined`:return e;case`object`:return e;default:return``}}function Ht(e){var t=e.type;return(e=e.nodeName)&&e.toLowerCase()===`input`&&(t===`checkbox`||t===`radio`)}function Ut(e,t,n){var r=Object.getOwnPropertyDescriptor(e.constructor.prototype,t);if(!e.hasOwnProperty(t)&&r!==void 0&&typeof r.get==`function`&&typeof r.set==`function`){var i=r.get,a=r.set;return Object.defineProperty(e,t,{configurable:!0,get:function(){return i.call(this)},set:function(e){n=``+e,a.call(this,e)}}),Object.defineProperty(e,t,{enumerable:r.enumerable}),{getValue:function(){return n},setValue:function(e){n=``+e},stopTracking:function(){e._valueTracker=null,delete e[t]}}}}function Wt(e){if(!e._valueTracker){var t=Ht(e)?`checked`:`value`;e._valueTracker=Ut(e,t,``+e[t])}}function Gt(e){if(!e)return!1;var t=e._valueTracker;if(!t)return!0;var n=t.getValue(),r=``;return e&&(r=Ht(e)?e.checked?`true`:`false`:e.value),e=r,e===n?!1:(t.setValue(e),!0)}function Kt(e){if(e||=typeof document<`u`?document:void 0,e===void 0)return null;try{return e.activeElement||e.body}catch{return e.body}}var qt=/[\n"\\]/g;function Jt(e){return e.replace(qt,function(e){return`\\`+e.charCodeAt(0).toString(16)+` `})}function Yt(e,t,n,r,i,a,o,s){e.name=``,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`?e.type=o:e.removeAttribute(`type`),t==null?o!==`submit`&&o!==`reset`||e.removeAttribute(`value`):o===`number`?(t===0&&e.value===``||e.value!=t)&&(e.value=``+Vt(t)):e.value!==``+Vt(t)&&(e.value=``+Vt(t)),t==null?n==null?r!=null&&e.removeAttribute(`value`):Zt(e,o,Vt(n)):Zt(e,o,Vt(t)),i==null&&a!=null&&(e.defaultChecked=!!a),i!=null&&(e.checked=i&&typeof i!=`function`&&typeof i!=`symbol`),s!=null&&typeof s!=`function`&&typeof s!=`symbol`&&typeof s!=`boolean`?e.name=``+Vt(s):e.removeAttribute(`name`)}function Xt(e,t,n,r,i,a,o,s){if(a!=null&&typeof a!=`function`&&typeof a!=`symbol`&&typeof a!=`boolean`&&(e.type=a),t!=null||n!=null){if(!(a!==`submit`&&a!==`reset`||t!=null)){Wt(e);return}n=n==null?``:``+Vt(n),t=t==null?n:``+Vt(t),s||t===e.value||(e.value=t),e.defaultValue=t}r??=i,r=typeof r!=`function`&&typeof r!=`symbol`&&!!r,e.checked=s?e.checked:!!r,e.defaultChecked=!!r,o!=null&&typeof o!=`function`&&typeof o!=`symbol`&&typeof o!=`boolean`&&(e.name=o),Wt(e)}function Zt(e,t,n){t===`number`&&Kt(e.ownerDocument)===e||e.defaultValue===``+n||(e.defaultValue=``+n)}function Qt(e,t,n,r){if(e=e.options,t){t={};for(var i=0;i<n.length;i++)t[`$`+n[i]]=!0;for(n=0;n<e.length;n++)i=t.hasOwnProperty(`$`+e[n].value),e[n].selected!==i&&(e[n].selected=i),i&&r&&(e[n].defaultSelected=!0)}else{for(n=``+Vt(n),t=null,i=0;i<e.length;i++){if(e[i].value===n){e[i].selected=!0,r&&(e[i].defaultSelected=!0);return}t!==null||e[i].disabled||(t=e[i])}t!==null&&(t.selected=!0)}}function $t(e,t,n){if(t!=null&&(t=``+Vt(t),t!==e.value&&(e.value=t),n==null)){e.defaultValue!==t&&(e.defaultValue=t);return}e.defaultValue=n==null?``:``+Vt(n)}function en(e,t,n,r){if(t==null){if(r!=null){if(n!=null)throw Error(i(92));if(ce(r)){if(1<r.length)throw Error(i(93));r=r[0]}n=r}n??=``,t=n}n=Vt(t),e.defaultValue=n,r=e.textContent,r===n&&r!==``&&r!==null&&(e.value=r),Wt(e)}function tn(e,t){if(t){var n=e.firstChild;if(n&&n===e.lastChild&&n.nodeType===3){n.nodeValue=t;return}}e.textContent=t}var nn=new Set(`animationIterationCount aspectRatio borderImageOutset borderImageSlice borderImageWidth boxFlex boxFlexGroup boxOrdinalGroup columnCount columns flex flexGrow flexPositive flexShrink flexNegative flexOrder gridArea gridRow gridRowEnd gridRowSpan gridRowStart gridColumn gridColumnEnd gridColumnSpan gridColumnStart fontWeight lineClamp lineHeight opacity order orphans scale tabSize widows zIndex zoom fillOpacity floodOpacity stopOpacity strokeDasharray strokeDashoffset strokeMiterlimit strokeOpacity strokeWidth MozAnimationIterationCount MozBoxFlex MozBoxFlexGroup MozLineClamp msAnimationIterationCount msFlex msZoom msFlexGrow msFlexNegative msFlexOrder msFlexPositive msFlexShrink msGridColumn msGridColumnSpan msGridRow msGridRowSpan WebkitAnimationIterationCount WebkitBoxFlex WebKitBoxFlexGroup WebkitBoxOrdinalGroup WebkitColumnCount WebkitColumns WebkitFlex WebkitFlexGrow WebkitFlexPositive WebkitFlexShrink WebkitLineClamp`.split(` `));function rn(e,t,n){var r=t.indexOf(`--`)===0;n==null||typeof n==`boolean`||n===``?r?e.setProperty(t,``):t===`float`?e.cssFloat=``:e[t]=``:r?e.setProperty(t,n):typeof n!=`number`||n===0||nn.has(t)?t===`float`?e.cssFloat=n:e[t]=(``+n).trim():e[t]=n+`px`}function an(e,t,n){if(t!=null&&typeof t!=`object`)throw Error(i(62));if(e=e.style,n!=null){for(var r in n)!n.hasOwnProperty(r)||t!=null&&t.hasOwnProperty(r)||(r.indexOf(`--`)===0?e.setProperty(r,``):r===`float`?e.cssFloat=``:e[r]=``);for(var a in t)r=t[a],t.hasOwnProperty(a)&&n[a]!==r&&rn(e,a,r)}else for(var o in t)t.hasOwnProperty(o)&&rn(e,o,t[o])}function on(e){if(e.indexOf(`-`)===-1)return!1;switch(e){case`annotation-xml`:case`color-profile`:case`font-face`:case`font-face-src`:case`font-face-uri`:case`font-face-format`:case`font-face-name`:case`missing-glyph`:return!1;default:return!0}}var sn=new Map([[`acceptCharset`,`accept-charset`],[`htmlFor`,`for`],[`httpEquiv`,`http-equiv`],[`crossOrigin`,`crossorigin`],[`accentHeight`,`accent-height`],[`alignmentBaseline`,`alignment-baseline`],[`arabicForm`,`arabic-form`],[`baselineShift`,`baseline-shift`],[`capHeight`,`cap-height`],[`clipPath`,`clip-path`],[`clipRule`,`clip-rule`],[`colorInterpolation`,`color-interpolation`],[`colorInterpolationFilters`,`color-interpolation-filters`],[`colorProfile`,`color-profile`],[`colorRendering`,`color-rendering`],[`dominantBaseline`,`dominant-baseline`],[`enableBackground`,`enable-background`],[`fillOpacity`,`fill-opacity`],[`fillRule`,`fill-rule`],[`floodColor`,`flood-color`],[`floodOpacity`,`flood-opacity`],[`fontFamily`,`font-family`],[`fontSize`,`font-size`],[`fontSizeAdjust`,`font-size-adjust`],[`fontStretch`,`font-stretch`],[`fontStyle`,`font-style`],[`fontVariant`,`font-variant`],[`fontWeight`,`font-weight`],[`glyphName`,`glyph-name`],[`glyphOrientationHorizontal`,`glyph-orientation-horizontal`],[`glyphOrientationVertical`,`glyph-orientation-vertical`],[`horizAdvX`,`horiz-adv-x`],[`horizOriginX`,`horiz-origin-x`],[`imageRendering`,`image-rendering`],[`letterSpacing`,`letter-spacing`],[`lightingColor`,`lighting-color`],[`markerEnd`,`marker-end`],[`markerMid`,`marker-mid`],[`markerStart`,`marker-start`],[`overlinePosition`,`overline-position`],[`overlineThickness`,`overline-thickness`],[`paintOrder`,`paint-order`],[`panose-1`,`panose-1`],[`pointerEvents`,`pointer-events`],[`renderingIntent`,`rendering-intent`],[`shapeRendering`,`shape-rendering`],[`stopColor`,`stop-color`],[`stopOpacity`,`stop-opacity`],[`strikethroughPosition`,`strikethrough-position`],[`strikethroughThickness`,`strikethrough-thickness`],[`strokeDasharray`,`stroke-dasharray`],[`strokeDashoffset`,`stroke-dashoffset`],[`strokeLinecap`,`stroke-linecap`],[`strokeLinejoin`,`stroke-linejoin`],[`strokeMiterlimit`,`stroke-miterlimit`],[`strokeOpacity`,`stroke-opacity`],[`strokeWidth`,`stroke-width`],[`textAnchor`,`text-anchor`],[`textDecoration`,`text-decoration`],[`textRendering`,`text-rendering`],[`transformOrigin`,`transform-origin`],[`underlinePosition`,`underline-position`],[`underlineThickness`,`underline-thickness`],[`unicodeBidi`,`unicode-bidi`],[`unicodeRange`,`unicode-range`],[`unitsPerEm`,`units-per-em`],[`vAlphabetic`,`v-alphabetic`],[`vHanging`,`v-hanging`],[`vIdeographic`,`v-ideographic`],[`vMathematical`,`v-mathematical`],[`vectorEffect`,`vector-effect`],[`vertAdvY`,`vert-adv-y`],[`vertOriginX`,`vert-origin-x`],[`vertOriginY`,`vert-origin-y`],[`wordSpacing`,`word-spacing`],[`writingMode`,`writing-mode`],[`xmlnsXlink`,`xmlns:xlink`],[`xHeight`,`x-height`]]),cn=/^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;function ln(e){return cn.test(``+e)?`javascript:throw new Error('React has blocked a javascript: URL as a security precaution.')`:e}function un(){}var dn=null;function fn(e){return e=e.target||e.srcElement||window,e.correspondingUseElement&&(e=e.correspondingUseElement),e.nodeType===3?e.parentNode:e}var pn=null,mn=null;function hn(e){var t=Et(e);if(t&&(e=t.stateNode)){var n=e[_t]||null;a:switch(e=t.stateNode,t.type){case`input`:if(Yt(e,n.value,n.defaultValue,n.defaultValue,n.checked,n.defaultChecked,n.type,n.name),t=n.name,n.type===`radio`&&t!=null){for(n=e;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll(`input[name="`+Jt(``+t)+`"][type="radio"]`),t=0;t<n.length;t++){var r=n[t];if(r!==e&&r.form===e.form){var a=r[_t]||null;if(!a)throw Error(i(90));Yt(r,a.value,a.defaultValue,a.defaultValue,a.checked,a.defaultChecked,a.type,a.name)}}for(t=0;t<n.length;t++)r=n[t],r.form===e.form&&Gt(r)}break a;case`textarea`:$t(e,n.value,n.defaultValue);break a;case`select`:t=n.value,t!=null&&Qt(e,!!n.multiple,t,!1)}}}var gn=!1;function _n(e,t,n){if(gn)return e(t,n);gn=!0;try{return e(t)}finally{if(gn=!1,(pn!==null||mn!==null)&&(xu(),pn&&(t=pn,e=mn,mn=pn=null,hn(t),e)))for(t=0;t<e.length;t++)hn(e[t])}}function vn(e,t){var n=e.stateNode;if(n===null)return null;var r=n[_t]||null;if(r===null)return null;n=r[t];a:switch(t){case`onClick`:case`onClickCapture`:case`onDoubleClick`:case`onDoubleClickCapture`:case`onMouseDown`:case`onMouseDownCapture`:case`onMouseMove`:case`onMouseMoveCapture`:case`onMouseUp`:case`onMouseUpCapture`:case`onMouseEnter`:(r=!r.disabled)||(e=e.type,r=!(e===`button`||e===`input`||e===`select`||e===`textarea`)),e=!r;break a;default:e=!1}if(e)return null;if(n&&typeof n!=`function`)throw Error(i(231,t,typeof n));return n}var yn=!(typeof window>`u`||window.document===void 0||window.document.createElement===void 0),bn=!1;if(yn)try{var xn={};Object.defineProperty(xn,`passive`,{get:function(){bn=!0}}),window.addEventListener(`test`,xn,xn),window.removeEventListener(`test`,xn,xn)}catch{bn=!1}var Sn=null,Cn=null,k=null;function wn(){if(k)return k;var e,t=Cn,n=t.length,r,i=`value`in Sn?Sn.value:Sn.textContent,a=i.length;for(e=0;e<n&&t[e]===i[e];e++);var o=n-e;for(r=1;r<=o&&t[n-r]===i[a-r];r++);return k=i.slice(e,1<r?1-r:void 0)}function Tn(e){var t=e.keyCode;return`charCode`in e?(e=e.charCode,e===0&&t===13&&(e=13)):e=t,e===10&&(e=13),32<=e||e===13?e:0}function A(){return!0}function j(){return!1}function En(e){function t(t,n,r,i,a){for(var o in this._reactName=t,this._targetInst=r,this.type=n,this.nativeEvent=i,this.target=a,this.currentTarget=null,e)e.hasOwnProperty(o)&&(t=e[o],this[o]=t?t(i):i[o]);return this.isDefaultPrevented=(i.defaultPrevented==null?!1===i.returnValue:i.defaultPrevented)?A:j,this.isPropagationStopped=j,this}return m(t.prototype,{preventDefault:function(){this.defaultPrevented=!0;var e=this.nativeEvent;e&&(e.preventDefault?e.preventDefault():typeof e.returnValue!=`unknown`&&(e.returnValue=!1),this.isDefaultPrevented=A)},stopPropagation:function(){var e=this.nativeEvent;e&&(e.stopPropagation?e.stopPropagation():typeof e.cancelBubble!=`unknown`&&(e.cancelBubble=!0),this.isPropagationStopped=A)},persist:function(){},isPersistent:A}),t}var Dn={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(e){return e.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},On=En(Dn),kn=m({},Dn,{view:0,detail:0}),An=En(kn),jn,Mn,Nn,Pn=m({},kn,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Gn,button:0,buttons:0,relatedTarget:function(e){return e.relatedTarget===void 0?e.fromElement===e.srcElement?e.toElement:e.fromElement:e.relatedTarget},movementX:function(e){return`movementX`in e?e.movementX:(e!==Nn&&(Nn&&e.type===`mousemove`?(jn=e.screenX-Nn.screenX,Mn=e.screenY-Nn.screenY):Mn=jn=0,Nn=e),jn)},movementY:function(e){return`movementY`in e?e.movementY:Mn}}),Fn=En(Pn),In=En(m({},Pn,{dataTransfer:0})),Ln=En(m({},kn,{relatedTarget:0})),Rn=En(m({},Dn,{animationName:0,elapsedTime:0,pseudoElement:0})),zn=En(m({},Dn,{clipboardData:function(e){return`clipboardData`in e?e.clipboardData:window.clipboardData}})),Bn=En(m({},Dn,{data:0})),Vn={Esc:`Escape`,Spacebar:` `,Left:`ArrowLeft`,Up:`ArrowUp`,Right:`ArrowRight`,Down:`ArrowDown`,Del:`Delete`,Win:`OS`,Menu:`ContextMenu`,Apps:`ContextMenu`,Scroll:`ScrollLock`,MozPrintableKey:`Unidentified`},Hn={8:`Backspace`,9:`Tab`,12:`Clear`,13:`Enter`,16:`Shift`,17:`Control`,18:`Alt`,19:`Pause`,20:`CapsLock`,27:`Escape`,32:` `,33:`PageUp`,34:`PageDown`,35:`End`,36:`Home`,37:`ArrowLeft`,38:`ArrowUp`,39:`ArrowRight`,40:`ArrowDown`,45:`Insert`,46:`Delete`,112:`F1`,113:`F2`,114:`F3`,115:`F4`,116:`F5`,117:`F6`,118:`F7`,119:`F8`,120:`F9`,121:`F10`,122:`F11`,123:`F12`,144:`NumLock`,145:`ScrollLock`,224:`Meta`},Un={Alt:`altKey`,Control:`ctrlKey`,Meta:`metaKey`,Shift:`shiftKey`};function Wn(e){var t=this.nativeEvent;return t.getModifierState?t.getModifierState(e):(e=Un[e])?!!t[e]:!1}function Gn(){return Wn}var Kn=En(m({},kn,{key:function(e){if(e.key){var t=Vn[e.key]||e.key;if(t!==`Unidentified`)return t}return e.type===`keypress`?(e=Tn(e),e===13?`Enter`:String.fromCharCode(e)):e.type===`keydown`||e.type===`keyup`?Hn[e.keyCode]||`Unidentified`:``},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Gn,charCode:function(e){return e.type===`keypress`?Tn(e):0},keyCode:function(e){return e.type===`keydown`||e.type===`keyup`?e.keyCode:0},which:function(e){return e.type===`keypress`?Tn(e):e.type===`keydown`||e.type===`keyup`?e.keyCode:0}})),qn=En(m({},Pn,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0})),Jn=En(m({},kn,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Gn})),Yn=En(m({},Dn,{propertyName:0,elapsedTime:0,pseudoElement:0})),Xn=En(m({},Pn,{deltaX:function(e){return`deltaX`in e?e.deltaX:`wheelDeltaX`in e?-e.wheelDeltaX:0},deltaY:function(e){return`deltaY`in e?e.deltaY:`wheelDeltaY`in e?-e.wheelDeltaY:`wheelDelta`in e?-e.wheelDelta:0},deltaZ:0,deltaMode:0})),Zn=En(m({},Dn,{newState:0,oldState:0})),Qn=[9,13,27,32],$n=yn&&`CompositionEvent`in window,er=null;yn&&`documentMode`in document&&(er=document.documentMode);var tr=yn&&`TextEvent`in window&&!er,nr=yn&&(!$n||er&&8<er&&11>=er),rr=` `,ir=!1;function ar(e,t){switch(e){case`keyup`:return Qn.indexOf(t.keyCode)!==-1;case`keydown`:return t.keyCode!==229;case`keypress`:case`mousedown`:case`focusout`:return!0;default:return!1}}function or(e){return e=e.detail,typeof e==`object`&&`data`in e?e.data:null}var sr=!1;function cr(e,t){switch(e){case`compositionend`:return or(t);case`keypress`:return t.which===32?(ir=!0,rr):null;case`textInput`:return e=t.data,e===rr&&ir?null:e;default:return null}}function lr(e,t){if(sr)return e===`compositionend`||!$n&&ar(e,t)?(e=wn(),k=Cn=Sn=null,sr=!1,e):null;switch(e){case`paste`:return null;case`keypress`:if(!(t.ctrlKey||t.altKey||t.metaKey)||t.ctrlKey&&t.altKey){if(t.char&&1<t.char.length)return t.char;if(t.which)return String.fromCharCode(t.which)}return null;case`compositionend`:return nr&&t.locale!==`ko`?null:t.data;default:return null}}var ur={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function dr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t===`input`?!!ur[e.type]:t===`textarea`}function fr(e,t,n,r){pn?mn?mn.push(r):mn=[r]:pn=r,t=Ed(t,`onChange`),0<t.length&&(n=new On(`onChange`,`change`,null,n,r),e.push({event:n,listeners:t}))}var pr=null,mr=null;function hr(e){yd(e,0)}function gr(e){if(Gt(Dt(e)))return e}function _r(e,t){if(e===`change`)return t}var vr=!1;if(yn){var yr;if(yn){var br=`oninput`in document;if(!br){var xr=document.createElement(`div`);xr.setAttribute(`oninput`,`return;`),br=typeof xr.oninput==`function`}yr=br}else yr=!1;vr=yr&&(!document.documentMode||9<document.documentMode)}function Sr(){pr&&(pr.detachEvent(`onpropertychange`,Cr),mr=pr=null)}function Cr(e){if(e.propertyName===`value`&&gr(mr)){var t=[];fr(t,mr,e,fn(e)),_n(hr,t)}}function wr(e,t,n){e===`focusin`?(Sr(),pr=t,mr=n,pr.attachEvent(`onpropertychange`,Cr)):e===`focusout`&&Sr()}function Tr(e){if(e===`selectionchange`||e===`keyup`||e===`keydown`)return gr(mr)}function Er(e,t){if(e===`click`)return gr(t)}function Dr(e,t){if(e===`input`||e===`change`)return gr(t)}function Or(e,t){return e===t&&(e!==0||1/e==1/t)||e!==e&&t!==t}var kr=typeof Object.is==`function`?Object.is:Or;function Ar(e,t){if(kr(e,t))return!0;if(typeof e!=`object`||!e||typeof t!=`object`||!t)return!1;var n=Object.keys(e),r=Object.keys(t);if(n.length!==r.length)return!1;for(r=0;r<n.length;r++){var i=n[r];if(!Ae.call(t,i)||!kr(e[i],t[i]))return!1}return!0}function jr(e){for(;e&&e.firstChild;)e=e.firstChild;return e}function Mr(e,t){var n=jr(e);e=0;for(var r;n;){if(n.nodeType===3){if(r=e+n.textContent.length,e<=t&&r>=t)return{node:n,offset:t-e};e=r}a:{for(;n;){if(n.nextSibling){n=n.nextSibling;break a}n=n.parentNode}n=void 0}n=jr(n)}}function Nr(e,t){return e&&t?e===t?!0:e&&e.nodeType===3?!1:t&&t.nodeType===3?Nr(e,t.parentNode):`contains`in e?e.contains(t):e.compareDocumentPosition?!!(e.compareDocumentPosition(t)&16):!1:!1}function Pr(e){e=e!=null&&e.ownerDocument!=null&&e.ownerDocument.defaultView!=null?e.ownerDocument.defaultView:window;for(var t=Kt(e.document);t instanceof e.HTMLIFrameElement;){try{var n=typeof t.contentWindow.location.href==`string`}catch{n=!1}if(n)e=t.contentWindow;else break;t=Kt(e.document)}return t}function Fr(e){var t=e&&e.nodeName&&e.nodeName.toLowerCase();return t&&(t===`input`&&(e.type===`text`||e.type===`search`||e.type===`tel`||e.type===`url`||e.type===`password`)||t===`textarea`||e.contentEditable===`true`)}var Ir=yn&&`documentMode`in document&&11>=document.documentMode,Lr=null,Rr=null,zr=null,Br=!1;function Vr(e,t,n){var r=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Br||Lr==null||Lr!==Kt(r)||(r=Lr,`selectionStart`in r&&Fr(r)?r={start:r.selectionStart,end:r.selectionEnd}:(r=(r.ownerDocument&&r.ownerDocument.defaultView||window).getSelection(),r={anchorNode:r.anchorNode,anchorOffset:r.anchorOffset,focusNode:r.focusNode,focusOffset:r.focusOffset}),zr&&Ar(zr,r)||(zr=r,r=Ed(Rr,`onSelect`),0<r.length&&(t=new On(`onSelect`,`select`,null,t,n),e.push({event:t,listeners:r}),t.target=Lr)))}function Hr(e,t){var n={};return n[e.toLowerCase()]=t.toLowerCase(),n[`Webkit`+e]=`webkit`+t,n[`Moz`+e]=`moz`+t,n}var Ur={animationend:Hr(`Animation`,`AnimationEnd`),animationiteration:Hr(`Animation`,`AnimationIteration`),animationstart:Hr(`Animation`,`AnimationStart`),transitionrun:Hr(`Transition`,`TransitionRun`),transitionstart:Hr(`Transition`,`TransitionStart`),transitioncancel:Hr(`Transition`,`TransitionCancel`),transitionend:Hr(`Transition`,`TransitionEnd`)},Wr={},Gr={};yn&&(Gr=document.createElement(`div`).style,`AnimationEvent`in window||(delete Ur.animationend.animation,delete Ur.animationiteration.animation,delete Ur.animationstart.animation),`TransitionEvent`in window||delete Ur.transitionend.transition);function Kr(e){if(Wr[e])return Wr[e];if(!Ur[e])return e;var t=Ur[e],n;for(n in t)if(t.hasOwnProperty(n)&&n in Gr)return Wr[e]=t[n];return e}var qr=Kr(`animationend`),Jr=Kr(`animationiteration`),Yr=Kr(`animationstart`),Xr=Kr(`transitionrun`),Zr=Kr(`transitionstart`),Qr=Kr(`transitioncancel`),$r=Kr(`transitionend`),ei=new Map,ti=`abort auxClick beforeToggle cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel`.split(` `);ti.push(`scrollEnd`);function ni(e,t){ei.set(e,t),Mt(t,[e])}var ri=typeof reportError==`function`?reportError:function(e){if(typeof window==`object`&&typeof window.ErrorEvent==`function`){var t=new window.ErrorEvent(`error`,{bubbles:!0,cancelable:!0,message:typeof e==`object`&&e&&typeof e.message==`string`?String(e.message):String(e),error:e});if(!window.dispatchEvent(t))return}else if(typeof process==`object`&&typeof process.emit==`function`){process.emit(`uncaughtException`,e);return}console.error(e)},ii=[],ai=0,oi=0;function si(){for(var e=ai,t=oi=ai=0;t<e;){var n=ii[t];ii[t++]=null;var r=ii[t];ii[t++]=null;var i=ii[t];ii[t++]=null;var a=ii[t];if(ii[t++]=null,r!==null&&i!==null){var o=r.pending;o===null?i.next=i:(i.next=o.next,o.next=i),r.pending=i}a!==0&&N(n,i,a)}}function ci(e,t,n,r){ii[ai++]=e,ii[ai++]=t,ii[ai++]=n,ii[ai++]=r,oi|=r,e.lanes|=r,e=e.alternate,e!==null&&(e.lanes|=r)}function M(e,t,n,r){return ci(e,t,n,r),ui(e)}function li(e,t){return ci(e,null,null,t),ui(e)}function N(e,t,n){e.lanes|=n;var r=e.alternate;r!==null&&(r.lanes|=n);for(var i=!1,a=e.return;a!==null;)a.childLanes|=n,r=a.alternate,r!==null&&(r.childLanes|=n),a.tag===22&&(e=a.stateNode,e===null||e._visibility&1||(i=!0)),e=a,a=a.return;return e.tag===3?(a=e.stateNode,i&&t!==null&&(i=31-qe(n),e=a.hiddenUpdates,r=e[i],r===null?e[i]=[t]:r.push(t),t.lane=n|536870912),a):null}function ui(e){if(50<fu)throw fu=0,pu=null,Error(i(185));for(var t=e.return;t!==null;)e=t,t=e.return;return e.tag===3?e.stateNode:null}var di={};function fi(e,t,n,r){this.tag=e,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.refCleanup=this.ref=null,this.pendingProps=t,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=r,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function pi(e,t,n,r){return new fi(e,t,n,r)}function P(e){return e=e.prototype,!(!e||!e.isReactComponent)}function mi(e,t){var n=e.alternate;return n===null?(n=pi(e.tag,t,e.key,e.mode),n.elementType=e.elementType,n.type=e.type,n.stateNode=e.stateNode,n.alternate=e,e.alternate=n):(n.pendingProps=t,n.type=e.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=e.flags&65011712,n.childLanes=e.childLanes,n.lanes=e.lanes,n.child=e.child,n.memoizedProps=e.memoizedProps,n.memoizedState=e.memoizedState,n.updateQueue=e.updateQueue,t=e.dependencies,n.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext},n.sibling=e.sibling,n.index=e.index,n.ref=e.ref,n.refCleanup=e.refCleanup,n}function hi(e,t){e.flags&=65011714;var n=e.alternate;return n===null?(e.childLanes=0,e.lanes=t,e.child=null,e.subtreeFlags=0,e.memoizedProps=null,e.memoizedState=null,e.updateQueue=null,e.dependencies=null,e.stateNode=null):(e.childLanes=n.childLanes,e.lanes=n.lanes,e.child=n.child,e.subtreeFlags=0,e.deletions=null,e.memoizedProps=n.memoizedProps,e.memoizedState=n.memoizedState,e.updateQueue=n.updateQueue,e.type=n.type,t=n.dependencies,e.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),e}function gi(e,t,n,r,a,o){var s=0;if(r=e,typeof e==`function`)P(e)&&(s=1);else if(typeof e==`string`)s=Uf(e,n,he.current)?26:e===`html`||e===`head`||e===`body`?27:5;else a:switch(e){case ne:return e=pi(31,n,t,a),e.elementType=ne,e.lanes=o,e;case y:return _i(n.children,a,o,t);case b:s=8,a|=24;break;case x:return e=pi(12,n,t,a|2),e.elementType=x,e.lanes=o,e;case w:return e=pi(13,n,t,a),e.elementType=w,e.lanes=o,e;case T:return e=pi(19,n,t,a),e.elementType=T,e.lanes=o,e;default:if(typeof e==`object`&&e)switch(e.$$typeof){case S:s=10;break a;case ee:s=9;break a;case C:s=11;break a;case te:s=14;break a;case E:s=16,r=null;break a}s=29,n=Error(i(130,e===null?`null`:typeof e,``)),r=null}return t=pi(s,n,t,a),t.elementType=e,t.type=r,t.lanes=o,t}function _i(e,t,n,r){return e=pi(7,e,r,t),e.lanes=n,e}function vi(e,t,n){return e=pi(6,e,null,t),e.lanes=n,e}function yi(e){var t=pi(18,null,null,0);return t.stateNode=e,t}function bi(e,t,n){return t=pi(4,e.children===null?[]:e.children,e.key,t),t.lanes=n,t.stateNode={containerInfo:e.containerInfo,pendingChildren:null,implementation:e.implementation},t}var xi=new WeakMap;function Si(e,t){if(typeof e==`object`&&e){var n=xi.get(e);return n===void 0?(t={value:e,source:t,stack:ke(t)},xi.set(e,t),t):n}return{value:e,source:t,stack:ke(t)}}var Ci=[],wi=0,Ti=null,Ei=0,Di=[],Oi=0,ki=null,Ai=1,ji=``;function Mi(e,t){Ci[wi++]=Ei,Ci[wi++]=Ti,Ti=e,Ei=t}function Ni(e,t,n){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,ki=e;var r=Ai;e=ji;var i=32-qe(r)-1;r&=~(1<<i),n+=1;var a=32-qe(t)+i;if(30<a){var o=i-i%5;a=(r&(1<<o)-1).toString(32),r>>=o,i-=o,Ai=1<<32-qe(t)+i|n<<i|r,ji=a+e}else Ai=1<<a|n<<i|r,ji=e}function Pi(e){e.return!==null&&(Mi(e,1),Ni(e,1,0))}function Fi(e){for(;e===Ti;)Ti=Ci[--wi],Ci[wi]=null,Ei=Ci[--wi],Ci[wi]=null;for(;e===ki;)ki=Di[--Oi],Di[Oi]=null,ji=Di[--Oi],Di[Oi]=null,Ai=Di[--Oi],Di[Oi]=null}function Ii(e,t){Di[Oi++]=Ai,Di[Oi++]=ji,Di[Oi++]=ki,Ai=t.id,ji=t.overflow,ki=e}var Li=null,Ri=null,F=!1,zi=null,Bi=!1,Vi=Error(i(519));function Hi(e){throw Ji(Si(Error(i(418,1<arguments.length&&arguments[1]!==void 0&&arguments[1]?`text`:`HTML`,``)),e)),Vi}function Ui(e){var t=e.stateNode,n=e.type,r=e.memoizedProps;switch(t[gt]=e,t[_t]=r,n){case`dialog`:Q(`cancel`,t),Q(`close`,t);break;case`iframe`:case`object`:case`embed`:Q(`load`,t);break;case`video`:case`audio`:for(n=0;n<_d.length;n++)Q(_d[n],t);break;case`source`:Q(`error`,t);break;case`img`:case`image`:case`link`:Q(`error`,t),Q(`load`,t);break;case`details`:Q(`toggle`,t);break;case`input`:Q(`invalid`,t),Xt(t,r.value,r.defaultValue,r.checked,r.defaultChecked,r.type,r.name,!0);break;case`select`:Q(`invalid`,t);break;case`textarea`:Q(`invalid`,t),en(t,r.value,r.defaultValue,r.children)}n=r.children,typeof n!=`string`&&typeof n!=`number`&&typeof n!=`bigint`||t.textContent===``+n||!0===r.suppressHydrationWarning||Md(t.textContent,n)?(r.popover!=null&&(Q(`beforetoggle`,t),Q(`toggle`,t)),r.onScroll!=null&&Q(`scroll`,t),r.onScrollEnd!=null&&Q(`scrollend`,t),r.onClick!=null&&(t.onclick=un),t=!0):t=!1,t||Hi(e,!0)}function Wi(e){for(Li=e.return;Li;)switch(Li.tag){case 5:case 31:case 13:Bi=!1;return;case 27:case 3:Bi=!0;return;default:Li=Li.return}}function Gi(e){if(e!==Li)return!1;if(!F)return Wi(e),F=!0,!1;var t=e.tag,n;if((n=t!==3&&t!==27)&&((n=t===5)&&(n=e.type,n=!(n!==`form`&&n!==`button`)||Ud(e.type,e.memoizedProps)),n=!n),n&&Ri&&Hi(e),Wi(e),t===13){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ri=uf(e)}else if(t===31){if(e=e.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(317));Ri=uf(e)}else t===27?(t=Ri,Zd(e.type)?(e=lf,lf=null,Ri=e):Ri=t):Ri=Li?cf(e.stateNode.nextSibling):null;return!0}function Ki(){Ri=Li=null,F=!1}function qi(){var e=zi;return e!==null&&(eu===null?eu=e:eu.push.apply(eu,e),zi=null),e}function Ji(e){zi===null?zi=[e]:zi.push(e)}var Yi=fe(null),Xi=null,Zi=null;function Qi(e,t,n){me(Yi,t._currentValue),t._currentValue=n}function $i(e){e._currentValue=Yi.current,pe(Yi)}function ea(e,t,n){for(;e!==null;){var r=e.alternate;if((e.childLanes&t)===t?r!==null&&(r.childLanes&t)!==t&&(r.childLanes|=t):(e.childLanes|=t,r!==null&&(r.childLanes|=t)),e===n)break;e=e.return}}function ta(e,t,n,r){var a=e.child;for(a!==null&&(a.return=e);a!==null;){var o=a.dependencies;if(o!==null){var s=a.child;o=o.firstContext;a:for(;o!==null;){var c=o;o=a;for(var l=0;l<t.length;l++)if(c.context===t[l]){o.lanes|=n,c=o.alternate,c!==null&&(c.lanes|=n),ea(o.return,n,e),r||(s=null);break a}o=c.next}}else if(a.tag===18){if(s=a.return,s===null)throw Error(i(341));s.lanes|=n,o=s.alternate,o!==null&&(o.lanes|=n),ea(s,n,e),s=null}else s=a.child;if(s!==null)s.return=a;else for(s=a;s!==null;){if(s===e){s=null;break}if(a=s.sibling,a!==null){a.return=s.return,s=a;break}s=s.return}a=s}}function na(e,t,n,r){e=null;for(var a=t,o=!1;a!==null;){if(!o){if(a.flags&524288)o=!0;else if(a.flags&262144)break}if(a.tag===10){var s=a.alternate;if(s===null)throw Error(i(387));if(s=s.memoizedProps,s!==null){var c=a.type;kr(a.pendingProps.value,s.value)||(e===null?e=[c]:e.push(c))}}else if(a===ve.current){if(s=a.alternate,s===null)throw Error(i(387));s.memoizedState.memoizedState!==a.memoizedState.memoizedState&&(e===null?e=[Qf]:e.push(Qf))}a=a.return}e!==null&&ta(t,e,n,r),t.flags|=262144}function ra(e){for(e=e.firstContext;e!==null;){if(!kr(e.context._currentValue,e.memoizedValue))return!0;e=e.next}return!1}function ia(e){Xi=e,Zi=null,e=e.dependencies,e!==null&&(e.firstContext=null)}function aa(e){return sa(Xi,e)}function oa(e,t){return Xi===null&&ia(e),sa(e,t)}function sa(e,t){var n=t._currentValue;if(t={context:t,memoizedValue:n,next:null},Zi===null){if(e===null)throw Error(i(308));Zi=t,e.dependencies={lanes:0,firstContext:t},e.flags|=524288}else Zi=Zi.next=t;return n}var ca=typeof AbortController<`u`?AbortController:function(){var e=[],t=this.signal={aborted:!1,addEventListener:function(t,n){e.push(n)}};this.abort=function(){t.aborted=!0,e.forEach(function(e){return e()})}},la=t.unstable_scheduleCallback,ua=t.unstable_NormalPriority,da={$$typeof:S,Consumer:null,Provider:null,_currentValue:null,_currentValue2:null,_threadCount:0};function fa(){return{controller:new ca,data:new Map,refCount:0}}function pa(e){e.refCount--,e.refCount===0&&la(ua,function(){e.controller.abort()})}var ma=null,ha=0,ga=0,_a=null;function va(e,t){if(ma===null){var n=ma=[];ha=0,ga=dd(),_a={status:`pending`,value:void 0,then:function(e){n.push(e)}}}return ha++,t.then(ya,ya),t}function ya(){if(--ha===0&&ma!==null){_a!==null&&(_a.status=`fulfilled`);var e=ma;ma=null,ga=0,_a=null;for(var t=0;t<e.length;t++)(0,e[t])()}}function ba(e,t){var n=[],r={status:`pending`,value:null,reason:null,then:function(e){n.push(e)}};return e.then(function(){r.status=`fulfilled`,r.value=t;for(var e=0;e<n.length;e++)(0,n[e])(t)},function(e){for(r.status=`rejected`,r.reason=e,e=0;e<n.length;e++)(0,n[e])(void 0)}),r}var xa=D.S;D.S=function(e,t){nu=Fe(),typeof t==`object`&&t&&typeof t.then==`function`&&va(e,t),xa!==null&&xa(e,t)};var Sa=fe(null);function Ca(){var e=Sa.current;return e===null?Wl.pooledCache:e}function wa(e,t){t===null?me(Sa,Sa.current):me(Sa,t.pool)}function Ta(){var e=Ca();return e===null?null:{parent:da._currentValue,pool:e}}var Ea=Error(i(460)),Da=Error(i(474)),Oa=Error(i(542)),ka={then:function(){}};function Aa(e){return e=e.status,e===`fulfilled`||e===`rejected`}function ja(e,t,n){switch(n=e[n],n===void 0?e.push(t):n!==t&&(t.then(un,un),t=n),t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Fa(e),e;default:if(typeof t.status==`string`)t.then(un,un);else{if(e=Wl,e!==null&&100<e.shellSuspendCounter)throw Error(i(482));e=t,e.status=`pending`,e.then(function(e){if(t.status===`pending`){var n=t;n.status=`fulfilled`,n.value=e}},function(e){if(t.status===`pending`){var n=t;n.status=`rejected`,n.reason=e}})}switch(t.status){case`fulfilled`:return t.value;case`rejected`:throw e=t.reason,Fa(e),e}throw Na=t,Ea}}function Ma(e){try{var t=e._init;return t(e._payload)}catch(e){throw typeof e==`object`&&e&&typeof e.then==`function`?(Na=e,Ea):e}}var Na=null;function Pa(){if(Na===null)throw Error(i(459));var e=Na;return Na=null,e}function Fa(e){if(e===Ea||e===Oa)throw Error(i(483))}var Ia=null,La=0;function Ra(e){var t=La;return La+=1,Ia===null&&(Ia=[]),ja(Ia,e,t)}function za(e,t){t=t.props.ref,e.ref=t===void 0?null:t}function Ba(e,t){throw t.$$typeof===g?Error(i(525)):(e=Object.prototype.toString.call(t),Error(i(31,e===`[object Object]`?`object with keys {`+Object.keys(t).join(`, `)+`}`:e)))}function Va(e){function t(t,n){if(e){var r=t.deletions;r===null?(t.deletions=[n],t.flags|=16):r.push(n)}}function n(n,r){if(!e)return null;for(;r!==null;)t(n,r),r=r.sibling;return null}function r(e){for(var t=new Map;e!==null;)e.key===null?t.set(e.index,e):t.set(e.key,e),e=e.sibling;return t}function a(e,t){return e=mi(e,t),e.index=0,e.sibling=null,e}function o(t,n,r){return t.index=r,e?(r=t.alternate,r===null?(t.flags|=67108866,n):(r=r.index,r<n?(t.flags|=67108866,n):r)):(t.flags|=1048576,n)}function s(t){return e&&t.alternate===null&&(t.flags|=67108866),t}function c(e,t,n,r){return t===null||t.tag!==6?(t=vi(n,e.mode,r),t.return=e,t):(t=a(t,n),t.return=e,t)}function l(e,t,n,r){var i=n.type;return i===y?d(e,t,n.props.children,r,n.key):t!==null&&(t.elementType===i||typeof i==`object`&&i&&i.$$typeof===E&&Ma(i)===t.type)?(t=a(t,n.props),za(t,n),t.return=e,t):(t=gi(n.type,n.key,n.props,null,e.mode,r),za(t,n),t.return=e,t)}function u(e,t,n,r){return t===null||t.tag!==4||t.stateNode.containerInfo!==n.containerInfo||t.stateNode.implementation!==n.implementation?(t=bi(n,e.mode,r),t.return=e,t):(t=a(t,n.children||[]),t.return=e,t)}function d(e,t,n,r,i){return t===null||t.tag!==7?(t=_i(n,e.mode,r,i),t.return=e,t):(t=a(t,n),t.return=e,t)}function f(e,t,n){if(typeof t==`string`&&t!==``||typeof t==`number`||typeof t==`bigint`)return t=vi(``+t,e.mode,n),t.return=e,t;if(typeof t==`object`&&t){switch(t.$$typeof){case _:return n=gi(t.type,t.key,t.props,null,e.mode,n),za(n,t),n.return=e,n;case v:return t=bi(t,e.mode,n),t.return=e,t;case E:return t=Ma(t),f(e,t,n)}if(ce(t)||ae(t))return t=_i(t,e.mode,n,null),t.return=e,t;if(typeof t.then==`function`)return f(e,Ra(t),n);if(t.$$typeof===S)return f(e,oa(e,t),n);Ba(e,t)}return null}function p(e,t,n,r){var i=t===null?null:t.key;if(typeof n==`string`&&n!==``||typeof n==`number`||typeof n==`bigint`)return i===null?c(e,t,``+n,r):null;if(typeof n==`object`&&n){switch(n.$$typeof){case _:return n.key===i?l(e,t,n,r):null;case v:return n.key===i?u(e,t,n,r):null;case E:return n=Ma(n),p(e,t,n,r)}if(ce(n)||ae(n))return i===null?d(e,t,n,r,null):null;if(typeof n.then==`function`)return p(e,t,Ra(n),r);if(n.$$typeof===S)return p(e,t,oa(e,n),r);Ba(e,n)}return null}function m(e,t,n,r,i){if(typeof r==`string`&&r!==``||typeof r==`number`||typeof r==`bigint`)return e=e.get(n)||null,c(t,e,``+r,i);if(typeof r==`object`&&r){switch(r.$$typeof){case _:return e=e.get(r.key===null?n:r.key)||null,l(t,e,r,i);case v:return e=e.get(r.key===null?n:r.key)||null,u(t,e,r,i);case E:return r=Ma(r),m(e,t,n,r,i)}if(ce(r)||ae(r))return e=e.get(n)||null,d(t,e,r,i,null);if(typeof r.then==`function`)return m(e,t,n,Ra(r),i);if(r.$$typeof===S)return m(e,t,n,oa(t,r),i);Ba(t,r)}return null}function h(i,a,s,c){for(var l=null,u=null,d=a,h=a=0,g=null;d!==null&&h<s.length;h++){d.index>h?(g=d,d=null):g=d.sibling;var _=p(i,d,s[h],c);if(_===null){d===null&&(d=g);break}e&&d&&_.alternate===null&&t(i,d),a=o(_,a,h),u===null?l=_:u.sibling=_,u=_,d=g}if(h===s.length)return n(i,d),F&&Mi(i,h),l;if(d===null){for(;h<s.length;h++)d=f(i,s[h],c),d!==null&&(a=o(d,a,h),u===null?l=d:u.sibling=d,u=d);return F&&Mi(i,h),l}for(d=r(d);h<s.length;h++)g=m(d,i,h,s[h],c),g!==null&&(e&&g.alternate!==null&&d.delete(g.key===null?h:g.key),a=o(g,a,h),u===null?l=g:u.sibling=g,u=g);return e&&d.forEach(function(e){return t(i,e)}),F&&Mi(i,h),l}function g(a,s,c,l){if(c==null)throw Error(i(151));for(var u=null,d=null,h=s,g=s=0,_=null,v=c.next();h!==null&&!v.done;g++,v=c.next()){h.index>g?(_=h,h=null):_=h.sibling;var y=p(a,h,v.value,l);if(y===null){h===null&&(h=_);break}e&&h&&y.alternate===null&&t(a,h),s=o(y,s,g),d===null?u=y:d.sibling=y,d=y,h=_}if(v.done)return n(a,h),F&&Mi(a,g),u;if(h===null){for(;!v.done;g++,v=c.next())v=f(a,v.value,l),v!==null&&(s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return F&&Mi(a,g),u}for(h=r(h);!v.done;g++,v=c.next())v=m(h,a,g,v.value,l),v!==null&&(e&&v.alternate!==null&&h.delete(v.key===null?g:v.key),s=o(v,s,g),d===null?u=v:d.sibling=v,d=v);return e&&h.forEach(function(e){return t(a,e)}),F&&Mi(a,g),u}function b(e,r,o,c){if(typeof o==`object`&&o&&o.type===y&&o.key===null&&(o=o.props.children),typeof o==`object`&&o){switch(o.$$typeof){case _:a:{for(var l=o.key;r!==null;){if(r.key===l){if(l=o.type,l===y){if(r.tag===7){n(e,r.sibling),c=a(r,o.props.children),c.return=e,e=c;break a}}else if(r.elementType===l||typeof l==`object`&&l&&l.$$typeof===E&&Ma(l)===r.type){n(e,r.sibling),c=a(r,o.props),za(c,o),c.return=e,e=c;break a}n(e,r);break}else t(e,r);r=r.sibling}o.type===y?(c=_i(o.props.children,e.mode,c,o.key),c.return=e,e=c):(c=gi(o.type,o.key,o.props,null,e.mode,c),za(c,o),c.return=e,e=c)}return s(e);case v:a:{for(l=o.key;r!==null;){if(r.key===l)if(r.tag===4&&r.stateNode.containerInfo===o.containerInfo&&r.stateNode.implementation===o.implementation){n(e,r.sibling),c=a(r,o.children||[]),c.return=e,e=c;break a}else{n(e,r);break}else t(e,r);r=r.sibling}c=bi(o,e.mode,c),c.return=e,e=c}return s(e);case E:return o=Ma(o),b(e,r,o,c)}if(ce(o))return h(e,r,o,c);if(ae(o)){if(l=ae(o),typeof l!=`function`)throw Error(i(150));return o=l.call(o),g(e,r,o,c)}if(typeof o.then==`function`)return b(e,r,Ra(o),c);if(o.$$typeof===S)return b(e,r,oa(e,o),c);Ba(e,o)}return typeof o==`string`&&o!==``||typeof o==`number`||typeof o==`bigint`?(o=``+o,r!==null&&r.tag===6?(n(e,r.sibling),c=a(r,o),c.return=e,e=c):(n(e,r),c=vi(o,e.mode,c),c.return=e,e=c),s(e)):n(e,r)}return function(e,t,n,r){try{La=0;var i=b(e,t,n,r);return Ia=null,i}catch(t){if(t===Ea||t===Oa)throw t;var a=pi(29,t,null,e.mode);return a.lanes=r,a.return=e,a}}}var Ha=Va(!0),Ua=Va(!1),Wa=!1;function Ga(e){e.updateQueue={baseState:e.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,lanes:0,hiddenCallbacks:null},callbacks:null}}function Ka(e,t){e=e.updateQueue,t.updateQueue===e&&(t.updateQueue={baseState:e.baseState,firstBaseUpdate:e.firstBaseUpdate,lastBaseUpdate:e.lastBaseUpdate,shared:e.shared,callbacks:null})}function qa(e){return{lane:e,tag:0,payload:null,callback:null,next:null}}function Ja(e,t,n){var r=e.updateQueue;if(r===null)return null;if(r=r.shared,V&2){var i=r.pending;return i===null?t.next=t:(t.next=i.next,i.next=t),r.pending=t,t=ui(e),N(e,null,n),t}return ci(e,r,t,n),ui(e)}function Ya(e,t,n){if(t=t.updateQueue,t!==null&&(t=t.shared,n&4194048)){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}function Xa(e,t){var n=e.updateQueue,r=e.alternate;if(r!==null&&(r=r.updateQueue,n===r)){var i=null,a=null;if(n=n.firstBaseUpdate,n!==null){do{var o={lane:n.lane,tag:n.tag,payload:n.payload,callback:null,next:null};a===null?i=a=o:a=a.next=o,n=n.next}while(n!==null);a===null?i=a=t:a=a.next=t}else i=a=t;n={baseState:r.baseState,firstBaseUpdate:i,lastBaseUpdate:a,shared:r.shared,callbacks:r.callbacks},e.updateQueue=n;return}e=n.lastBaseUpdate,e===null?n.firstBaseUpdate=t:e.next=t,n.lastBaseUpdate=t}var Za=!1;function Qa(){if(Za){var e=_a;if(e!==null)throw e}}function $a(e,t,n,r){Za=!1;var i=e.updateQueue;Wa=!1;var a=i.firstBaseUpdate,o=i.lastBaseUpdate,s=i.shared.pending;if(s!==null){i.shared.pending=null;var c=s,l=c.next;c.next=null,o===null?a=l:o.next=l,o=c;var u=e.alternate;u!==null&&(u=u.updateQueue,s=u.lastBaseUpdate,s!==o&&(s===null?u.firstBaseUpdate=l:s.next=l,u.lastBaseUpdate=c))}if(a!==null){var d=i.baseState;o=0,u=l=c=null,s=a;do{var f=s.lane&-536870913,p=f!==s.lane;if(p?(U&f)===f:(r&f)===f){f!==0&&f===ga&&(Za=!0),u!==null&&(u=u.next={lane:0,tag:s.tag,payload:s.payload,callback:null,next:null});a:{var h=e,g=s;f=t;var _=n;switch(g.tag){case 1:if(h=g.payload,typeof h==`function`){d=h.call(_,d,f);break a}d=h;break a;case 3:h.flags=h.flags&-65537|128;case 0:if(h=g.payload,f=typeof h==`function`?h.call(_,d,f):h,f==null)break a;d=m({},d,f);break a;case 2:Wa=!0}}f=s.callback,f!==null&&(e.flags|=64,p&&(e.flags|=8192),p=i.callbacks,p===null?i.callbacks=[f]:p.push(f))}else p={lane:f,tag:s.tag,payload:s.payload,callback:s.callback,next:null},u===null?(l=u=p,c=d):u=u.next=p,o|=f;if(s=s.next,s===null){if(s=i.shared.pending,s===null)break;p=s,s=p.next,p.next=null,i.lastBaseUpdate=p,i.shared.pending=null}}while(1);u===null&&(c=d),i.baseState=c,i.firstBaseUpdate=l,i.lastBaseUpdate=u,a===null&&(i.shared.lanes=0),G|=o,e.lanes=o,e.memoizedState=d}}function eo(e,t){if(typeof e!=`function`)throw Error(i(191,e));e.call(t)}function to(e,t){var n=e.callbacks;if(n!==null)for(e.callbacks=null,e=0;e<n.length;e++)eo(n[e],t)}var no=fe(null),ro=fe(0);function io(e,t){e=Yl,me(ro,e),me(no,t),Yl=e|t.baseLanes}function ao(){me(ro,Yl),me(no,no.current)}function oo(){Yl=ro.current,pe(no),pe(ro)}var so=fe(null),co=null;function lo(e){var t=e.alternate;me(ho,ho.current&1),me(so,e),co===null&&(t===null||no.current!==null||t.memoizedState!==null)&&(co=e)}function uo(e){me(ho,ho.current),me(so,e),co===null&&(co=e)}function fo(e){e.tag===22?(me(ho,ho.current),me(so,e),co===null&&(co=e)):po(e)}function po(){me(ho,ho.current),me(so,so.current)}function mo(e){pe(so),co===e&&(co=null),pe(ho)}var ho=fe(0);function go(e){for(var t=e;t!==null;){if(t.tag===13){var n=t.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||af(n)||of(n)))return t}else if(t.tag===19&&(t.memoizedProps.revealOrder===`forwards`||t.memoizedProps.revealOrder===`backwards`||t.memoizedProps.revealOrder===`unstable_legacy-backwards`||t.memoizedProps.revealOrder===`together`)){if(t.flags&128)return t}else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return null;t=t.return}t.sibling.return=t.return,t=t.sibling}return null}var _o=0,I=null,L=null,vo=null,yo=!1,bo=!1,xo=!1,So=0,Co=0,wo=null,To=0;function Eo(){throw Error(i(321))}function Do(e,t){if(t===null)return!1;for(var n=0;n<t.length&&n<e.length;n++)if(!kr(e[n],t[n]))return!1;return!0}function Oo(e,t,n,r,i,a){return _o=a,I=t,t.memoizedState=null,t.updateQueue=null,t.lanes=0,D.H=e===null||e.memoizedState===null?Gs:Ks,xo=!1,a=n(r,i),xo=!1,bo&&(a=Ao(t,n,r,i)),ko(e),a}function ko(e){D.H=Ws;var t=L!==null&&L.next!==null;if(_o=0,vo=L=I=null,yo=!1,Co=0,wo=null,t)throw Error(i(300));e===null||lc||(e=e.dependencies,e!==null&&ra(e)&&(lc=!0))}function Ao(e,t,n,r){I=e;var a=0;do{if(bo&&(wo=null),Co=0,bo=!1,25<=a)throw Error(i(301));if(a+=1,vo=L=null,e.updateQueue!=null){var o=e.updateQueue;o.lastEffect=null,o.events=null,o.stores=null,o.memoCache!=null&&(o.memoCache.index=0)}D.H=qs,o=t(n,r)}while(bo);return o}function jo(){var e=D.H,t=e.useState()[0];return t=typeof t.then==`function`?Ro(t):t,e=e.useState()[0],(L===null?null:L.memoizedState)!==e&&(I.flags|=1024),t}function Mo(){var e=So!==0;return So=0,e}function No(e,t,n){t.updateQueue=e.updateQueue,t.flags&=-2053,e.lanes&=~n}function Po(e){if(yo){for(e=e.memoizedState;e!==null;){var t=e.queue;t!==null&&(t.pending=null),e=e.next}yo=!1}_o=0,vo=L=I=null,bo=!1,Co=So=0,wo=null}function Fo(){var e={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return vo===null?I.memoizedState=vo=e:vo=vo.next=e,vo}function Io(){if(L===null){var e=I.alternate;e=e===null?null:e.memoizedState}else e=L.next;var t=vo===null?I.memoizedState:vo.next;if(t!==null)vo=t,L=e;else{if(e===null)throw I.alternate===null?Error(i(467)):Error(i(310));L=e,e={memoizedState:L.memoizedState,baseState:L.baseState,baseQueue:L.baseQueue,queue:L.queue,next:null},vo===null?I.memoizedState=vo=e:vo=vo.next=e}return vo}function Lo(){return{lastEffect:null,events:null,stores:null,memoCache:null}}function Ro(e){var t=Co;return Co+=1,wo===null&&(wo=[]),e=ja(wo,e,t),t=I,(vo===null?t.memoizedState:vo.next)===null&&(t=t.alternate,D.H=t===null||t.memoizedState===null?Gs:Ks),e}function zo(e){if(typeof e==`object`&&e){if(typeof e.then==`function`)return Ro(e);if(e.$$typeof===S)return aa(e)}throw Error(i(438,String(e)))}function Bo(e){var t=null,n=I.updateQueue;if(n!==null&&(t=n.memoCache),t==null){var r=I.alternate;r!==null&&(r=r.updateQueue,r!==null&&(r=r.memoCache,r!=null&&(t={data:r.data.map(function(e){return e.slice()}),index:0})))}if(t??={data:[],index:0},n===null&&(n=Lo(),I.updateQueue=n),n.memoCache=t,n=t.data[t.index],n===void 0)for(n=t.data[t.index]=Array(e),r=0;r<e;r++)n[r]=re;return t.index++,n}function Vo(e,t){return typeof t==`function`?t(e):t}function Ho(e){return Uo(Io(),L,e)}function Uo(e,t,n){var r=e.queue;if(r===null)throw Error(i(311));r.lastRenderedReducer=n;var a=e.baseQueue,o=r.pending;if(o!==null){if(a!==null){var s=a.next;a.next=o.next,o.next=s}t.baseQueue=a=o,r.pending=null}if(o=e.baseState,a===null)e.memoizedState=o;else{t=a.next;var c=s=null,l=null,u=t,d=!1;do{var f=u.lane&-536870913;if(f===u.lane?(_o&f)===f:(U&f)===f){var p=u.revertLane;if(p===0)l!==null&&(l=l.next={lane:0,revertLane:0,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null}),f===ga&&(d=!0);else if((_o&p)===p){u=u.next,p===ga&&(d=!0);continue}else f={lane:0,revertLane:u.revertLane,gesture:null,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=f,s=o):l=l.next=f,I.lanes|=p,G|=p;f=u.action,xo&&n(o,f),o=u.hasEagerState?u.eagerState:n(o,f)}else p={lane:f,revertLane:u.revertLane,gesture:u.gesture,action:u.action,hasEagerState:u.hasEagerState,eagerState:u.eagerState,next:null},l===null?(c=l=p,s=o):l=l.next=p,I.lanes|=f,G|=f;u=u.next}while(u!==null&&u!==t);if(l===null?s=o:l.next=c,!kr(o,e.memoizedState)&&(lc=!0,d&&(n=_a,n!==null)))throw n;e.memoizedState=o,e.baseState=s,e.baseQueue=l,r.lastRenderedState=o}return a===null&&(r.lanes=0),[e.memoizedState,r.dispatch]}function Wo(e){var t=Io(),n=t.queue;if(n===null)throw Error(i(311));n.lastRenderedReducer=e;var r=n.dispatch,a=n.pending,o=t.memoizedState;if(a!==null){n.pending=null;var s=a=a.next;do o=e(o,s.action),s=s.next;while(s!==a);kr(o,t.memoizedState)||(lc=!0),t.memoizedState=o,t.baseQueue===null&&(t.baseState=o),n.lastRenderedState=o}return[o,r]}function Go(e,t,n){var r=I,a=Io(),o=F;if(o){if(n===void 0)throw Error(i(407));n=n()}else n=t();var s=!kr((L||a).memoizedState,n);if(s&&(a.memoizedState=n,lc=!0),a=a.queue,gs(Jo.bind(null,r,a,e),[e]),a.getSnapshot!==t||s||vo!==null&&vo.memoizedState.tag&1){if(r.flags|=2048,ds(9,{destroy:void 0},qo.bind(null,r,a,n,t),null),Wl===null)throw Error(i(349));o||_o&127||Ko(r,t,n)}return n}function Ko(e,t,n){e.flags|=16384,e={getSnapshot:t,value:n},t=I.updateQueue,t===null?(t=Lo(),I.updateQueue=t,t.stores=[e]):(n=t.stores,n===null?t.stores=[e]:n.push(e))}function qo(e,t,n,r){t.value=n,t.getSnapshot=r,Yo(t)&&Xo(e)}function Jo(e,t,n){return n(function(){Yo(t)&&Xo(e)})}function Yo(e){var t=e.getSnapshot;e=e.value;try{var n=t();return!kr(e,n)}catch{return!0}}function Xo(e){var t=li(e,2);t!==null&&gu(t,e,2)}function Zo(e){var t=Fo();if(typeof e==`function`){var n=e;if(e=n(),xo){Ke(!0);try{n()}finally{Ke(!1)}}}return t.memoizedState=t.baseState=e,t.queue={pending:null,lanes:0,dispatch:null,lastRenderedReducer:Vo,lastRenderedState:e},t}function Qo(e,t,n,r){return e.baseState=n,Uo(e,L,typeof r==`function`?r:Vo)}function $o(e,t,n,r,a){if(Vs(e))throw Error(i(485));if(e=t.action,e!==null){var o={payload:a,action:e,next:null,isTransition:!0,status:`pending`,value:null,reason:null,listeners:[],then:function(e){o.listeners.push(e)}};D.T===null?o.isTransition=!1:n(!0),r(o),n=t.pending,n===null?(o.next=t.pending=o,es(t,o)):(o.next=n.next,t.pending=n.next=o)}}function es(e,t){var n=t.action,r=t.payload,i=e.state;if(t.isTransition){var a=D.T,o={};D.T=o;try{var s=n(i,r),c=D.S;c!==null&&c(o,s),ts(e,t,s)}catch(n){rs(e,t,n)}finally{a!==null&&o.types!==null&&(a.types=o.types),D.T=a}}else try{a=n(i,r),ts(e,t,a)}catch(n){rs(e,t,n)}}function ts(e,t,n){typeof n==`object`&&n&&typeof n.then==`function`?n.then(function(n){ns(e,t,n)},function(n){return rs(e,t,n)}):ns(e,t,n)}function ns(e,t,n){t.status=`fulfilled`,t.value=n,is(t),e.state=n,t=e.pending,t!==null&&(n=t.next,n===t?e.pending=null:(n=n.next,t.next=n,es(e,n)))}function rs(e,t,n){var r=e.pending;if(e.pending=null,r!==null){r=r.next;do t.status=`rejected`,t.reason=n,is(t),t=t.next;while(t!==r)}e.action=null}function is(e){e=e.listeners;for(var t=0;t<e.length;t++)(0,e[t])()}function as(e,t){return t}function os(e,t){if(F){var n=Wl.formState;if(n!==null){a:{var r=I;if(F){if(Ri){b:{for(var i=Ri,a=Bi;i.nodeType!==8;){if(!a){i=null;break b}if(i=cf(i.nextSibling),i===null){i=null;break b}}a=i.data,i=a===`F!`||a===`F`?i:null}if(i){Ri=cf(i.nextSibling),r=i.data===`F!`;break a}}Hi(r)}r=!1}r&&(t=n[0])}}return n=Fo(),n.memoizedState=n.baseState=t,r={pending:null,lanes:0,dispatch:null,lastRenderedReducer:as,lastRenderedState:t},n.queue=r,n=Rs.bind(null,I,r),r.dispatch=n,r=Zo(!1),a=Bs.bind(null,I,!1,r.queue),r=Fo(),i={state:t,dispatch:null,action:e,pending:null},r.queue=i,n=$o.bind(null,I,i,a,n),i.dispatch=n,r.memoizedState=e,[t,n,!1]}function ss(e){return cs(Io(),L,e)}function cs(e,t,n){if(t=Uo(e,t,as)[0],e=Ho(Vo)[0],typeof t==`object`&&t&&typeof t.then==`function`)try{var r=Ro(t)}catch(e){throw e===Ea?Oa:e}else r=t;t=Io();var i=t.queue,a=i.dispatch;return n!==t.memoizedState&&(I.flags|=2048,ds(9,{destroy:void 0},ls.bind(null,i,n),null)),[r,a,e]}function ls(e,t){e.action=t}function us(e){var t=Io(),n=L;if(n!==null)return cs(t,n,e);Io(),t=t.memoizedState,n=Io();var r=n.queue.dispatch;return n.memoizedState=e,[t,r,!1]}function ds(e,t,n,r){return e={tag:e,create:n,deps:r,inst:t,next:null},t=I.updateQueue,t===null&&(t=Lo(),I.updateQueue=t),n=t.lastEffect,n===null?t.lastEffect=e.next=e:(r=n.next,n.next=e,e.next=r,t.lastEffect=e),e}function fs(){return Io().memoizedState}function ps(e,t,n,r){var i=Fo();I.flags|=e,i.memoizedState=ds(1|t,{destroy:void 0},n,r===void 0?null:r)}function ms(e,t,n,r){var i=Io();r=r===void 0?null:r;var a=i.memoizedState.inst;L!==null&&r!==null&&Do(r,L.memoizedState.deps)?i.memoizedState=ds(t,a,n,r):(I.flags|=e,i.memoizedState=ds(1|t,a,n,r))}function hs(e,t){ps(8390656,8,e,t)}function gs(e,t){ms(2048,8,e,t)}function _s(e){I.flags|=4;var t=I.updateQueue;if(t===null)t=Lo(),I.updateQueue=t,t.events=[e];else{var n=t.events;n===null?t.events=[e]:n.push(e)}}function vs(e){var t=Io().memoizedState;return _s({ref:t,nextImpl:e}),function(){if(V&2)throw Error(i(440));return t.impl.apply(void 0,arguments)}}function ys(e,t){return ms(4,2,e,t)}function bs(e,t){return ms(4,4,e,t)}function xs(e,t){if(typeof t==`function`){e=e();var n=t(e);return function(){typeof n==`function`?n():t(null)}}if(t!=null)return e=e(),t.current=e,function(){t.current=null}}function Ss(e,t,n){n=n==null?null:n.concat([e]),ms(4,4,xs.bind(null,t,e),n)}function Cs(){}function ws(e,t){var n=Io();t=t===void 0?null:t;var r=n.memoizedState;return t!==null&&Do(t,r[1])?r[0]:(n.memoizedState=[e,t],e)}function Ts(e,t){var n=Io();t=t===void 0?null:t;var r=n.memoizedState;if(t!==null&&Do(t,r[1]))return r[0];if(r=e(),xo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r}function Es(e,t,n){return n===void 0||_o&1073741824&&!(U&261930)?e.memoizedState=t:(e.memoizedState=n,e=hu(),I.lanes|=e,G|=e,n)}function Ds(e,t,n,r){return kr(n,t)?n:no.current===null?!(_o&42)||_o&1073741824&&!(U&261930)?(lc=!0,e.memoizedState=n):(e=hu(),I.lanes|=e,G|=e,t):(e=Es(e,n,r),kr(e,t)||(lc=!0),e)}function Os(e,t,n,r,i){var a=O.p;O.p=a!==0&&8>a?a:8;var o=D.T,s={};D.T=s,Bs(e,!1,t,n);try{var c=i(),l=D.S;l!==null&&l(s,c),typeof c==`object`&&c&&typeof c.then==`function`?zs(e,t,ba(c,r),mu(e)):zs(e,t,r,mu(e))}catch(n){zs(e,t,{then:function(){},status:`rejected`,reason:n},mu())}finally{O.p=a,o!==null&&s.types!==null&&(o.types=s.types),D.T=o}}function ks(){}function As(e,t,n,r){if(e.tag!==5)throw Error(i(476));var a=js(e).queue;Os(e,a,t,le,n===null?ks:function(){return Ms(e),n(r)})}function js(e){var t=e.memoizedState;if(t!==null)return t;t={memoizedState:le,baseState:le,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Vo,lastRenderedState:le},next:null};var n={};return t.next={memoizedState:n,baseState:n,baseQueue:null,queue:{pending:null,lanes:0,dispatch:null,lastRenderedReducer:Vo,lastRenderedState:n},next:null},e.memoizedState=t,e=e.alternate,e!==null&&(e.memoizedState=t),t}function Ms(e){var t=js(e);t.next===null&&(t=e.alternate.memoizedState),zs(e,t.next.queue,{},mu())}function Ns(){return aa(Qf)}function Ps(){return Io().memoizedState}function Fs(){return Io().memoizedState}function Is(e){for(var t=e.return;t!==null;){switch(t.tag){case 24:case 3:var n=mu();e=qa(n);var r=Ja(t,e,n);r!==null&&(gu(r,t,n),Ya(r,t,n)),t={cache:fa()},e.payload=t;return}t=t.return}}function Ls(e,t,n){var r=mu();n={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null},Vs(e)?Hs(t,n):(n=M(e,t,n,r),n!==null&&(gu(n,e,r),Us(n,t,r)))}function Rs(e,t,n){zs(e,t,n,mu())}function zs(e,t,n,r){var i={lane:r,revertLane:0,gesture:null,action:n,hasEagerState:!1,eagerState:null,next:null};if(Vs(e))Hs(t,i);else{var a=e.alternate;if(e.lanes===0&&(a===null||a.lanes===0)&&(a=t.lastRenderedReducer,a!==null))try{var o=t.lastRenderedState,s=a(o,n);if(i.hasEagerState=!0,i.eagerState=s,kr(s,o))return ci(e,t,i,0),Wl===null&&si(),!1}catch{}if(n=M(e,t,i,r),n!==null)return gu(n,e,r),Us(n,t,r),!0}return!1}function Bs(e,t,n,r){if(r={lane:2,revertLane:dd(),gesture:null,action:r,hasEagerState:!1,eagerState:null,next:null},Vs(e)){if(t)throw Error(i(479))}else t=M(e,n,r,2),t!==null&&gu(t,e,2)}function Vs(e){var t=e.alternate;return e===I||t!==null&&t===I}function Hs(e,t){bo=yo=!0;var n=e.pending;n===null?t.next=t:(t.next=n.next,n.next=t),e.pending=t}function Us(e,t,n){if(n&4194048){var r=t.lanes;r&=e.pendingLanes,n|=r,t.lanes=n,lt(e,n)}}var Ws={readContext:aa,use:zo,useCallback:Eo,useContext:Eo,useEffect:Eo,useImperativeHandle:Eo,useLayoutEffect:Eo,useInsertionEffect:Eo,useMemo:Eo,useReducer:Eo,useRef:Eo,useState:Eo,useDebugValue:Eo,useDeferredValue:Eo,useTransition:Eo,useSyncExternalStore:Eo,useId:Eo,useHostTransitionStatus:Eo,useFormState:Eo,useActionState:Eo,useOptimistic:Eo,useMemoCache:Eo,useCacheRefresh:Eo};Ws.useEffectEvent=Eo;var Gs={readContext:aa,use:zo,useCallback:function(e,t){return Fo().memoizedState=[e,t===void 0?null:t],e},useContext:aa,useEffect:hs,useImperativeHandle:function(e,t,n){n=n==null?null:n.concat([e]),ps(4194308,4,xs.bind(null,t,e),n)},useLayoutEffect:function(e,t){return ps(4194308,4,e,t)},useInsertionEffect:function(e,t){ps(4,2,e,t)},useMemo:function(e,t){var n=Fo();t=t===void 0?null:t;var r=e();if(xo){Ke(!0);try{e()}finally{Ke(!1)}}return n.memoizedState=[r,t],r},useReducer:function(e,t,n){var r=Fo();if(n!==void 0){var i=n(t);if(xo){Ke(!0);try{n(t)}finally{Ke(!1)}}}else i=t;return r.memoizedState=r.baseState=i,e={pending:null,lanes:0,dispatch:null,lastRenderedReducer:e,lastRenderedState:i},r.queue=e,e=e.dispatch=Ls.bind(null,I,e),[r.memoizedState,e]},useRef:function(e){var t=Fo();return e={current:e},t.memoizedState=e},useState:function(e){e=Zo(e);var t=e.queue,n=Rs.bind(null,I,t);return t.dispatch=n,[e.memoizedState,n]},useDebugValue:Cs,useDeferredValue:function(e,t){return Es(Fo(),e,t)},useTransition:function(){var e=Zo(!1);return e=Os.bind(null,I,e.queue,!0,!1),Fo().memoizedState=e,[!1,e]},useSyncExternalStore:function(e,t,n){var r=I,a=Fo();if(F){if(n===void 0)throw Error(i(407));n=n()}else{if(n=t(),Wl===null)throw Error(i(349));U&127||Ko(r,t,n)}a.memoizedState=n;var o={value:n,getSnapshot:t};return a.queue=o,hs(Jo.bind(null,r,o,e),[e]),r.flags|=2048,ds(9,{destroy:void 0},qo.bind(null,r,o,n,t),null),n},useId:function(){var e=Fo(),t=Wl.identifierPrefix;if(F){var n=ji,r=Ai;n=(r&~(1<<32-qe(r)-1)).toString(32)+n,t=`_`+t+`R_`+n,n=So++,0<n&&(t+=`H`+n.toString(32)),t+=`_`}else n=To++,t=`_`+t+`r_`+n.toString(32)+`_`;return e.memoizedState=t},useHostTransitionStatus:Ns,useFormState:os,useActionState:os,useOptimistic:function(e){var t=Fo();t.memoizedState=t.baseState=e;var n={pending:null,lanes:0,dispatch:null,lastRenderedReducer:null,lastRenderedState:null};return t.queue=n,t=Bs.bind(null,I,!0,n),n.dispatch=t,[e,t]},useMemoCache:Bo,useCacheRefresh:function(){return Fo().memoizedState=Is.bind(null,I)},useEffectEvent:function(e){var t=Fo(),n={impl:e};return t.memoizedState=n,function(){if(V&2)throw Error(i(440));return n.impl.apply(void 0,arguments)}}},Ks={readContext:aa,use:zo,useCallback:ws,useContext:aa,useEffect:gs,useImperativeHandle:Ss,useInsertionEffect:ys,useLayoutEffect:bs,useMemo:Ts,useReducer:Ho,useRef:fs,useState:function(){return Ho(Vo)},useDebugValue:Cs,useDeferredValue:function(e,t){return Ds(Io(),L.memoizedState,e,t)},useTransition:function(){var e=Ho(Vo)[0],t=Io().memoizedState;return[typeof e==`boolean`?e:Ro(e),t]},useSyncExternalStore:Go,useId:Ps,useHostTransitionStatus:Ns,useFormState:ss,useActionState:ss,useOptimistic:function(e,t){return Qo(Io(),L,e,t)},useMemoCache:Bo,useCacheRefresh:Fs};Ks.useEffectEvent=vs;var qs={readContext:aa,use:zo,useCallback:ws,useContext:aa,useEffect:gs,useImperativeHandle:Ss,useInsertionEffect:ys,useLayoutEffect:bs,useMemo:Ts,useReducer:Wo,useRef:fs,useState:function(){return Wo(Vo)},useDebugValue:Cs,useDeferredValue:function(e,t){var n=Io();return L===null?Es(n,e,t):Ds(n,L.memoizedState,e,t)},useTransition:function(){var e=Wo(Vo)[0],t=Io().memoizedState;return[typeof e==`boolean`?e:Ro(e),t]},useSyncExternalStore:Go,useId:Ps,useHostTransitionStatus:Ns,useFormState:us,useActionState:us,useOptimistic:function(e,t){var n=Io();return L===null?(n.baseState=e,[e,n.queue.dispatch]):Qo(n,L,e,t)},useMemoCache:Bo,useCacheRefresh:Fs};qs.useEffectEvent=vs;function Js(e,t,n,r){t=e.memoizedState,n=n(r,t),n=n==null?t:m({},t,n),e.memoizedState=n,e.lanes===0&&(e.updateQueue.baseState=n)}var Ys={enqueueSetState:function(e,t,n){e=e._reactInternals;var r=mu(),i=qa(r);i.payload=t,n!=null&&(i.callback=n),t=Ja(e,i,r),t!==null&&(gu(t,e,r),Ya(t,e,r))},enqueueReplaceState:function(e,t,n){e=e._reactInternals;var r=mu(),i=qa(r);i.tag=1,i.payload=t,n!=null&&(i.callback=n),t=Ja(e,i,r),t!==null&&(gu(t,e,r),Ya(t,e,r))},enqueueForceUpdate:function(e,t){e=e._reactInternals;var n=mu(),r=qa(n);r.tag=2,t!=null&&(r.callback=t),t=Ja(e,r,n),t!==null&&(gu(t,e,n),Ya(t,e,n))}};function Xs(e,t,n,r,i,a,o){return e=e.stateNode,typeof e.shouldComponentUpdate==`function`?e.shouldComponentUpdate(r,a,o):t.prototype&&t.prototype.isPureReactComponent?!Ar(n,r)||!Ar(i,a):!0}function Zs(e,t,n,r){e=t.state,typeof t.componentWillReceiveProps==`function`&&t.componentWillReceiveProps(n,r),typeof t.UNSAFE_componentWillReceiveProps==`function`&&t.UNSAFE_componentWillReceiveProps(n,r),t.state!==e&&Ys.enqueueReplaceState(t,t.state,null)}function Qs(e,t){var n=t;if(`ref`in t)for(var r in n={},t)r!==`ref`&&(n[r]=t[r]);if(e=e.defaultProps)for(var i in n===t&&(n=m({},n)),e)n[i]===void 0&&(n[i]=e[i]);return n}function $s(e){ri(e)}function ec(e){console.error(e)}function tc(e){ri(e)}function nc(e,t){try{var n=e.onUncaughtError;n(t.value,{componentStack:t.stack})}catch(e){setTimeout(function(){throw e})}}function rc(e,t,n){try{var r=e.onCaughtError;r(n.value,{componentStack:n.stack,errorBoundary:t.tag===1?t.stateNode:null})}catch(e){setTimeout(function(){throw e})}}function ic(e,t,n){return n=qa(n),n.tag=3,n.payload={element:null},n.callback=function(){nc(e,t)},n}function ac(e){return e=qa(e),e.tag=3,e}function oc(e,t,n,r){var i=n.type.getDerivedStateFromError;if(typeof i==`function`){var a=r.value;e.payload=function(){return i(a)},e.callback=function(){rc(t,n,r)}}var o=n.stateNode;o!==null&&typeof o.componentDidCatch==`function`&&(e.callback=function(){rc(t,n,r),typeof i!=`function`&&(iu===null?iu=new Set([this]):iu.add(this));var e=r.stack;this.componentDidCatch(r.value,{componentStack:e===null?``:e})})}function sc(e,t,n,r,a){if(n.flags|=32768,typeof r==`object`&&r&&typeof r.then==`function`){if(t=n.alternate,t!==null&&na(t,n,a,!0),n=so.current,n!==null){switch(n.tag){case 31:case 13:return co===null?Ou():n.alternate===null&&Xl===0&&(Xl=3),n.flags&=-257,n.flags|=65536,n.lanes=a,r===ka?n.flags|=16384:(t=n.updateQueue,t===null?n.updateQueue=new Set([r]):t.add(r),Ku(e,r,a)),!1;case 22:return n.flags|=65536,r===ka?n.flags|=16384:(t=n.updateQueue,t===null?(t={transitions:null,markerInstances:null,retryQueue:new Set([r])},n.updateQueue=t):(n=t.retryQueue,n===null?t.retryQueue=new Set([r]):n.add(r)),Ku(e,r,a)),!1}throw Error(i(435,n.tag))}return Ku(e,r,a),Ou(),!1}if(F)return t=so.current,t===null?(r!==Vi&&(t=Error(i(423),{cause:r}),Ji(Si(t,n))),e=e.current.alternate,e.flags|=65536,a&=-a,e.lanes|=a,r=Si(r,n),a=ic(e.stateNode,r,a),Xa(e,a),Xl!==4&&(Xl=2)):(!(t.flags&65536)&&(t.flags|=256),t.flags|=65536,t.lanes=a,r!==Vi&&(e=Error(i(422),{cause:r}),Ji(Si(e,n)))),!1;var o=Error(i(520),{cause:r});if(o=Si(o,n),$l===null?$l=[o]:$l.push(o),Xl!==4&&(Xl=2),t===null)return!0;r=Si(r,n),n=t;do{switch(n.tag){case 3:return n.flags|=65536,e=a&-a,n.lanes|=e,e=ic(n.stateNode,r,e),Xa(n,e),!1;case 1:if(t=n.type,o=n.stateNode,!(n.flags&128)&&(typeof t.getDerivedStateFromError==`function`||o!==null&&typeof o.componentDidCatch==`function`&&(iu===null||!iu.has(o))))return n.flags|=65536,a&=-a,n.lanes|=a,a=ac(a),oc(a,e,n,r),Xa(n,a),!1}n=n.return}while(n!==null);return!1}var cc=Error(i(461)),lc=!1;function uc(e,t,n,r){t.child=e===null?Ua(t,null,n,r):Ha(t,e.child,n,r)}function dc(e,t,n,r,i){n=n.render;var a=t.ref;if(`ref`in r){var o={};for(var s in r)s!==`ref`&&(o[s]=r[s])}else o=r;return ia(t),r=Oo(e,t,n,o,a,i),s=Mo(),e!==null&&!lc?(No(e,t,i),Fc(e,t,i)):(F&&s&&Pi(t),t.flags|=1,uc(e,t,r,i),t.child)}function fc(e,t,n,r,i){if(e===null){var a=n.type;return typeof a==`function`&&!P(a)&&a.defaultProps===void 0&&n.compare===null?(t.tag=15,t.type=a,pc(e,t,a,r,i)):(e=gi(n.type,null,r,t,t.mode,i),e.ref=t.ref,e.return=t,t.child=e)}if(a=e.child,!Ic(e,i)){var o=a.memoizedProps;if(n=n.compare,n=n===null?Ar:n,n(o,r)&&e.ref===t.ref)return Fc(e,t,i)}return t.flags|=1,e=mi(a,r),e.ref=t.ref,e.return=t,t.child=e}function pc(e,t,n,r,i){if(e!==null){var a=e.memoizedProps;if(Ar(a,r)&&e.ref===t.ref)if(lc=!1,t.pendingProps=r=a,Ic(e,i))e.flags&131072&&(lc=!0);else return t.lanes=e.lanes,Fc(e,t,i)}return xc(e,t,n,r,i)}function mc(e,t,n,r){var i=r.children,a=e===null?null:e.memoizedState;if(e===null&&t.stateNode===null&&(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),r.mode===`hidden`){if(t.flags&128){if(a=a===null?n:a.baseLanes|n,e!==null){for(r=t.child=e.child,i=0;r!==null;)i=i|r.lanes|r.childLanes,r=r.sibling;r=i&~a}else r=0,t.child=null;return gc(e,t,a,n,r)}if(n&536870912)t.memoizedState={baseLanes:0,cachePool:null},e!==null&&wa(t,a===null?null:a.cachePool),a===null?ao():io(t,a),fo(t);else return r=t.lanes=536870912,gc(e,t,a===null?n:a.baseLanes|n,n,r)}else a===null?(e!==null&&wa(t,null),ao(),po(t)):(wa(t,a.cachePool),io(t,a),po(t),t.memoizedState=null);return uc(e,t,i,n),t.child}function hc(e,t){return e!==null&&e.tag===22||t.stateNode!==null||(t.stateNode={_visibility:1,_pendingMarkers:null,_retryCache:null,_transitions:null}),t.sibling}function gc(e,t,n,r,i){var a=Ca();return a=a===null?null:{parent:da._currentValue,pool:a},t.memoizedState={baseLanes:n,cachePool:a},e!==null&&wa(t,null),ao(),fo(t),e!==null&&na(e,t,r,!0),t.childLanes=i,null}function _c(e,t){return t=Ac({mode:t.mode,children:t.children},e.mode),t.ref=e.ref,e.child=t,t.return=e,t}function vc(e,t,n){return Ha(t,e.child,null,n),e=_c(t,t.pendingProps),e.flags|=2,mo(t),t.memoizedState=null,e}function yc(e,t,n){var r=t.pendingProps,a=(t.flags&128)!=0;if(t.flags&=-129,e===null){if(F){if(r.mode===`hidden`)return e=_c(t,r),t.lanes=536870912,hc(null,e);if(uo(t),(e=Ri)?(e=rf(e,Bi),e=e!==null&&e.data===`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,Li=t,Ri=null)):e=null,e===null)throw Hi(t);return t.lanes=536870912,null}return _c(t,r)}var o=e.memoizedState;if(o!==null){var s=o.dehydrated;if(uo(t),a)if(t.flags&256)t.flags&=-257,t=vc(e,t,n);else if(t.memoizedState!==null)t.child=e.child,t.flags|=128,t=null;else throw Error(i(558));else if(lc||na(e,t,n,!1),a=(n&e.childLanes)!==0,lc||a){if(r=Wl,r!==null&&(s=ut(r,n),s!==0&&s!==o.retryLane))throw o.retryLane=s,li(e,s),gu(r,e,s),cc;Ou(),t=vc(e,t,n)}else e=o.treeContext,Ri=cf(s.nextSibling),Li=t,F=!0,zi=null,Bi=!1,e!==null&&Ii(t,e),t=_c(t,r),t.flags|=4096;return t}return e=mi(e.child,{mode:r.mode,children:r.children}),e.ref=t.ref,t.child=e,e.return=t,e}function bc(e,t){var n=t.ref;if(n===null)e!==null&&e.ref!==null&&(t.flags|=4194816);else{if(typeof n!=`function`&&typeof n!=`object`)throw Error(i(284));(e===null||e.ref!==n)&&(t.flags|=4194816)}}function xc(e,t,n,r,i){return ia(t),n=Oo(e,t,n,r,void 0,i),r=Mo(),e!==null&&!lc?(No(e,t,i),Fc(e,t,i)):(F&&r&&Pi(t),t.flags|=1,uc(e,t,n,i),t.child)}function Sc(e,t,n,r,i,a){return ia(t),t.updateQueue=null,n=Ao(t,r,n,i),ko(e),r=Mo(),e!==null&&!lc?(No(e,t,a),Fc(e,t,a)):(F&&r&&Pi(t),t.flags|=1,uc(e,t,n,a),t.child)}function Cc(e,t,n,r,i){if(ia(t),t.stateNode===null){var a=di,o=n.contextType;typeof o==`object`&&o&&(a=aa(o)),a=new n(r,a),t.memoizedState=a.state!==null&&a.state!==void 0?a.state:null,a.updater=Ys,t.stateNode=a,a._reactInternals=t,a=t.stateNode,a.props=r,a.state=t.memoizedState,a.refs={},Ga(t),o=n.contextType,a.context=typeof o==`object`&&o?aa(o):di,a.state=t.memoizedState,o=n.getDerivedStateFromProps,typeof o==`function`&&(Js(t,n,o,r),a.state=t.memoizedState),typeof n.getDerivedStateFromProps==`function`||typeof a.getSnapshotBeforeUpdate==`function`||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(o=a.state,typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount(),o!==a.state&&Ys.enqueueReplaceState(a,a.state,null),$a(t,r,a,i),Qa(),a.state=t.memoizedState),typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!0}else if(e===null){a=t.stateNode;var s=t.memoizedProps,c=Qs(n,s);a.props=c;var l=a.context,u=n.contextType;o=di,typeof u==`object`&&u&&(o=aa(u));var d=n.getDerivedStateFromProps;u=typeof d==`function`||typeof a.getSnapshotBeforeUpdate==`function`,s=t.pendingProps!==s,u||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(s||l!==o)&&Zs(t,a,r,o),Wa=!1;var f=t.memoizedState;a.state=f,$a(t,r,a,i),Qa(),l=t.memoizedState,s||f!==l||Wa?(typeof d==`function`&&(Js(t,n,d,r),l=t.memoizedState),(c=Wa||Xs(t,n,c,r,f,l,o))?(u||typeof a.UNSAFE_componentWillMount!=`function`&&typeof a.componentWillMount!=`function`||(typeof a.componentWillMount==`function`&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount==`function`&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount==`function`&&(t.flags|=4194308)):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),t.memoizedProps=r,t.memoizedState=l),a.props=r,a.state=l,a.context=o,r=c):(typeof a.componentDidMount==`function`&&(t.flags|=4194308),r=!1)}else{a=t.stateNode,Ka(e,t),o=t.memoizedProps,u=Qs(n,o),a.props=u,d=t.pendingProps,f=a.context,l=n.contextType,c=di,typeof l==`object`&&l&&(c=aa(l)),s=n.getDerivedStateFromProps,(l=typeof s==`function`||typeof a.getSnapshotBeforeUpdate==`function`)||typeof a.UNSAFE_componentWillReceiveProps!=`function`&&typeof a.componentWillReceiveProps!=`function`||(o!==d||f!==c)&&Zs(t,a,r,c),Wa=!1,f=t.memoizedState,a.state=f,$a(t,r,a,i),Qa();var p=t.memoizedState;o!==d||f!==p||Wa||e!==null&&e.dependencies!==null&&ra(e.dependencies)?(typeof s==`function`&&(Js(t,n,s,r),p=t.memoizedState),(u=Wa||Xs(t,n,u,r,f,p,c)||e!==null&&e.dependencies!==null&&ra(e.dependencies))?(l||typeof a.UNSAFE_componentWillUpdate!=`function`&&typeof a.componentWillUpdate!=`function`||(typeof a.componentWillUpdate==`function`&&a.componentWillUpdate(r,p,c),typeof a.UNSAFE_componentWillUpdate==`function`&&a.UNSAFE_componentWillUpdate(r,p,c)),typeof a.componentDidUpdate==`function`&&(t.flags|=4),typeof a.getSnapshotBeforeUpdate==`function`&&(t.flags|=1024)):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),t.memoizedProps=r,t.memoizedState=p),a.props=r,a.state=p,a.context=c,r=u):(typeof a.componentDidUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=4),typeof a.getSnapshotBeforeUpdate!=`function`||o===e.memoizedProps&&f===e.memoizedState||(t.flags|=1024),r=!1)}return a=r,bc(e,t),r=(t.flags&128)!=0,a||r?(a=t.stateNode,n=r&&typeof n.getDerivedStateFromError!=`function`?null:a.render(),t.flags|=1,e!==null&&r?(t.child=Ha(t,e.child,null,i),t.child=Ha(t,null,n,i)):uc(e,t,n,i),t.memoizedState=a.state,e=t.child):e=Fc(e,t,i),e}function wc(e,t,n,r){return Ki(),t.flags|=256,uc(e,t,n,r),t.child}var Tc={dehydrated:null,treeContext:null,retryLane:0,hydrationErrors:null};function Ec(e){return{baseLanes:e,cachePool:Ta()}}function Dc(e,t,n){return e=e===null?0:e.childLanes&~n,t&&(e|=K),e}function Oc(e,t,n){var r=t.pendingProps,a=!1,o=(t.flags&128)!=0,s;if((s=o)||(s=e!==null&&e.memoizedState===null?!1:(ho.current&2)!=0),s&&(a=!0,t.flags&=-129),s=(t.flags&32)!=0,t.flags&=-33,e===null){if(F){if(a?lo(t):po(t),(e=Ri)?(e=rf(e,Bi),e=e!==null&&e.data!==`&`?e:null,e!==null&&(t.memoizedState={dehydrated:e,treeContext:ki===null?null:{id:Ai,overflow:ji},retryLane:536870912,hydrationErrors:null},n=yi(e),n.return=t,t.child=n,Li=t,Ri=null)):e=null,e===null)throw Hi(t);return of(e)?t.lanes=32:t.lanes=536870912,null}var c=r.children;return r=r.fallback,a?(po(t),a=t.mode,c=Ac({mode:`hidden`,children:c},a),r=_i(r,a,n,null),c.return=t,r.return=t,c.sibling=r,t.child=c,r=t.child,r.memoizedState=Ec(n),r.childLanes=Dc(e,s,n),t.memoizedState=Tc,hc(null,r)):(lo(t),kc(t,c))}var l=e.memoizedState;if(l!==null&&(c=l.dehydrated,c!==null)){if(o)t.flags&256?(lo(t),t.flags&=-257,t=jc(e,t,n)):t.memoizedState===null?(po(t),c=r.fallback,a=t.mode,r=Ac({mode:`visible`,children:r.children},a),c=_i(c,a,n,null),c.flags|=2,r.return=t,c.return=t,r.sibling=c,t.child=r,Ha(t,e.child,null,n),r=t.child,r.memoizedState=Ec(n),r.childLanes=Dc(e,s,n),t.memoizedState=Tc,t=hc(null,r)):(po(t),t.child=e.child,t.flags|=128,t=null);else if(lo(t),of(c)){if(s=c.nextSibling&&c.nextSibling.dataset,s)var u=s.dgst;s=u,r=Error(i(419)),r.stack=``,r.digest=s,Ji({value:r,source:null,stack:null}),t=jc(e,t,n)}else if(lc||na(e,t,n,!1),s=(n&e.childLanes)!==0,lc||s){if(s=Wl,s!==null&&(r=ut(s,n),r!==0&&r!==l.retryLane))throw l.retryLane=r,li(e,r),gu(s,e,r),cc;af(c)||Ou(),t=jc(e,t,n)}else af(c)?(t.flags|=192,t.child=e.child,t=null):(e=l.treeContext,Ri=cf(c.nextSibling),Li=t,F=!0,zi=null,Bi=!1,e!==null&&Ii(t,e),t=kc(t,r.children),t.flags|=4096);return t}return a?(po(t),c=r.fallback,a=t.mode,l=e.child,u=l.sibling,r=mi(l,{mode:`hidden`,children:r.children}),r.subtreeFlags=l.subtreeFlags&65011712,u===null?(c=_i(c,a,n,null),c.flags|=2):c=mi(u,c),c.return=t,r.return=t,r.sibling=c,t.child=r,hc(null,r),r=t.child,c=e.child.memoizedState,c===null?c=Ec(n):(a=c.cachePool,a===null?a=Ta():(l=da._currentValue,a=a.parent===l?a:{parent:l,pool:l}),c={baseLanes:c.baseLanes|n,cachePool:a}),r.memoizedState=c,r.childLanes=Dc(e,s,n),t.memoizedState=Tc,hc(e.child,r)):(lo(t),n=e.child,e=n.sibling,n=mi(n,{mode:`visible`,children:r.children}),n.return=t,n.sibling=null,e!==null&&(s=t.deletions,s===null?(t.deletions=[e],t.flags|=16):s.push(e)),t.child=n,t.memoizedState=null,n)}function kc(e,t){return t=Ac({mode:`visible`,children:t},e.mode),t.return=e,e.child=t}function Ac(e,t){return e=pi(22,e,null,t),e.lanes=0,e}function jc(e,t,n){return Ha(t,e.child,null,n),e=kc(t,t.pendingProps.children),e.flags|=2,t.memoizedState=null,e}function Mc(e,t,n){e.lanes|=t;var r=e.alternate;r!==null&&(r.lanes|=t),ea(e.return,t,n)}function Nc(e,t,n,r,i,a){var o=e.memoizedState;o===null?e.memoizedState={isBackwards:t,rendering:null,renderingStartTime:0,last:r,tail:n,tailMode:i,treeForkCount:a}:(o.isBackwards=t,o.rendering=null,o.renderingStartTime=0,o.last=r,o.tail=n,o.tailMode=i,o.treeForkCount=a)}function Pc(e,t,n){var r=t.pendingProps,i=r.revealOrder,a=r.tail;r=r.children;var o=ho.current,s=(o&2)!=0;if(s?(o=o&1|2,t.flags|=128):o&=1,me(ho,o),uc(e,t,r,n),r=F?Ei:0,!s&&e!==null&&e.flags&128)a:for(e=t.child;e!==null;){if(e.tag===13)e.memoizedState!==null&&Mc(e,n,t);else if(e.tag===19)Mc(e,n,t);else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break a;for(;e.sibling===null;){if(e.return===null||e.return===t)break a;e=e.return}e.sibling.return=e.return,e=e.sibling}switch(i){case`forwards`:for(n=t.child,i=null;n!==null;)e=n.alternate,e!==null&&go(e)===null&&(i=n),n=n.sibling;n=i,n===null?(i=t.child,t.child=null):(i=n.sibling,n.sibling=null),Nc(t,!1,i,n,a,r);break;case`backwards`:case`unstable_legacy-backwards`:for(n=null,i=t.child,t.child=null;i!==null;){if(e=i.alternate,e!==null&&go(e)===null){t.child=i;break}e=i.sibling,i.sibling=n,n=i,i=e}Nc(t,!0,n,null,a,r);break;case`together`:Nc(t,!1,null,null,void 0,r);break;default:t.memoizedState=null}return t.child}function Fc(e,t,n){if(e!==null&&(t.dependencies=e.dependencies),G|=t.lanes,(n&t.childLanes)===0)if(e!==null){if(na(e,t,n,!1),(n&t.childLanes)===0)return null}else return null;if(e!==null&&t.child!==e.child)throw Error(i(153));if(t.child!==null){for(e=t.child,n=mi(e,e.pendingProps),t.child=n,n.return=t;e.sibling!==null;)e=e.sibling,n=n.sibling=mi(e,e.pendingProps),n.return=t;n.sibling=null}return t.child}function Ic(e,t){return(e.lanes&t)===0?(e=e.dependencies,!!(e!==null&&ra(e))):!0}function Lc(e,t,n){switch(t.tag){case 3:ye(t,t.stateNode.containerInfo),Qi(t,da,e.memoizedState.cache),Ki();break;case 27:case 5:xe(t);break;case 4:ye(t,t.stateNode.containerInfo);break;case 10:Qi(t,t.type,t.memoizedProps.value);break;case 31:if(t.memoizedState!==null)return t.flags|=128,uo(t),null;break;case 13:var r=t.memoizedState;if(r!==null)return r.dehydrated===null?(n&t.child.childLanes)===0?(lo(t),e=Fc(e,t,n),e===null?null:e.sibling):Oc(e,t,n):(lo(t),t.flags|=128,null);lo(t);break;case 19:var i=(e.flags&128)!=0;if(r=(n&t.childLanes)!==0,r||=(na(e,t,n,!1),(n&t.childLanes)!==0),i){if(r)return Pc(e,t,n);t.flags|=128}if(i=t.memoizedState,i!==null&&(i.rendering=null,i.tail=null,i.lastEffect=null),me(ho,ho.current),r)break;return null;case 22:return t.lanes=0,mc(e,t,n,t.pendingProps);case 24:Qi(t,da,e.memoizedState.cache)}return Fc(e,t,n)}function Rc(e,t,n){if(e!==null)if(e.memoizedProps!==t.pendingProps)lc=!0;else{if(!Ic(e,n)&&!(t.flags&128))return lc=!1,Lc(e,t,n);lc=!!(e.flags&131072)}else lc=!1,F&&t.flags&1048576&&Ni(t,Ei,t.index);switch(t.lanes=0,t.tag){case 16:a:{var r=t.pendingProps;if(e=Ma(t.elementType),t.type=e,typeof e==`function`)P(e)?(r=Qs(e,r),t.tag=1,t=Cc(null,t,e,r,n)):(t.tag=0,t=xc(null,t,e,r,n));else{if(e!=null){var a=e.$$typeof;if(a===C){t.tag=11,t=dc(null,t,e,r,n);break a}else if(a===te){t.tag=14,t=fc(null,t,e,r,n);break a}}throw t=se(e)||e,Error(i(306,t,``))}}return t;case 0:return xc(e,t,t.type,t.pendingProps,n);case 1:return r=t.type,a=Qs(r,t.pendingProps),Cc(e,t,r,a,n);case 3:a:{if(ye(t,t.stateNode.containerInfo),e===null)throw Error(i(387));r=t.pendingProps;var o=t.memoizedState;a=o.element,Ka(e,t),$a(t,r,null,n);var s=t.memoizedState;if(r=s.cache,Qi(t,da,r),r!==o.cache&&ta(t,[da],n,!0),Qa(),r=s.element,o.isDehydrated)if(o={element:r,isDehydrated:!1,cache:s.cache},t.updateQueue.baseState=o,t.memoizedState=o,t.flags&256){t=wc(e,t,r,n);break a}else if(r!==a){a=Si(Error(i(424)),t),Ji(a),t=wc(e,t,r,n);break a}else{switch(e=t.stateNode.containerInfo,e.nodeType){case 9:e=e.body;break;default:e=e.nodeName===`HTML`?e.ownerDocument.body:e}for(Ri=cf(e.firstChild),Li=t,F=!0,zi=null,Bi=!0,n=Ua(t,null,r,n),t.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling}else{if(Ki(),r===a){t=Fc(e,t,n);break a}uc(e,t,r,n)}t=t.child}return t;case 26:return bc(e,t),e===null?(n=kf(t.type,null,t.pendingProps,null))?t.memoizedState=n:F||(n=t.type,e=t.pendingProps,r=Bd(_e.current).createElement(n),r[gt]=t,r[_t]=e,Pd(r,n,e),kt(r),t.stateNode=r):t.memoizedState=kf(t.type,e.memoizedProps,t.pendingProps,e.memoizedState),null;case 27:return xe(t),e===null&&F&&(r=t.stateNode=ff(t.type,t.pendingProps,_e.current),Li=t,Bi=!0,a=Ri,Zd(t.type)?(lf=a,Ri=cf(r.firstChild)):Ri=a),uc(e,t,t.pendingProps.children,n),bc(e,t),e===null&&(t.flags|=4194304),t.child;case 5:return e===null&&F&&((a=r=Ri)&&(r=tf(r,t.type,t.pendingProps,Bi),r===null?a=!1:(t.stateNode=r,Li=t,Ri=cf(r.firstChild),Bi=!1,a=!0)),a||Hi(t)),xe(t),a=t.type,o=t.pendingProps,s=e===null?null:e.memoizedProps,r=o.children,Ud(a,o)?r=null:s!==null&&Ud(a,s)&&(t.flags|=32),t.memoizedState!==null&&(a=Oo(e,t,jo,null,null,n),Qf._currentValue=a),bc(e,t),uc(e,t,r,n),t.child;case 6:return e===null&&F&&((e=n=Ri)&&(n=nf(n,t.pendingProps,Bi),n===null?e=!1:(t.stateNode=n,Li=t,Ri=null,e=!0)),e||Hi(t)),null;case 13:return Oc(e,t,n);case 4:return ye(t,t.stateNode.containerInfo),r=t.pendingProps,e===null?t.child=Ha(t,null,r,n):uc(e,t,r,n),t.child;case 11:return dc(e,t,t.type,t.pendingProps,n);case 7:return uc(e,t,t.pendingProps,n),t.child;case 8:return uc(e,t,t.pendingProps.children,n),t.child;case 12:return uc(e,t,t.pendingProps.children,n),t.child;case 10:return r=t.pendingProps,Qi(t,t.type,r.value),uc(e,t,r.children,n),t.child;case 9:return a=t.type._context,r=t.pendingProps.children,ia(t),a=aa(a),r=r(a),t.flags|=1,uc(e,t,r,n),t.child;case 14:return fc(e,t,t.type,t.pendingProps,n);case 15:return pc(e,t,t.type,t.pendingProps,n);case 19:return Pc(e,t,n);case 31:return yc(e,t,n);case 22:return mc(e,t,n,t.pendingProps);case 24:return ia(t),r=aa(da),e===null?(a=Ca(),a===null&&(a=Wl,o=fa(),a.pooledCache=o,o.refCount++,o!==null&&(a.pooledCacheLanes|=n),a=o),t.memoizedState={parent:r,cache:a},Ga(t),Qi(t,da,a)):((e.lanes&n)!==0&&(Ka(e,t),$a(t,null,null,n),Qa()),a=e.memoizedState,o=t.memoizedState,a.parent===r?(r=o.cache,Qi(t,da,r),r!==a.cache&&ta(t,[da],n,!0)):(a={parent:r,cache:r},t.memoizedState=a,t.lanes===0&&(t.memoizedState=t.updateQueue.baseState=a),Qi(t,da,r))),uc(e,t,t.pendingProps.children,n),t.child;case 29:throw t.pendingProps}throw Error(i(156,t.tag))}function zc(e){e.flags|=4}function Bc(e,t,n,r,i){if((t=(e.mode&32)!=0)&&(t=!1),t){if(e.flags|=16777216,(i&335544128)===i)if(e.stateNode.complete)e.flags|=8192;else if(Tu())e.flags|=8192;else throw Na=ka,Da}else e.flags&=-16777217}function Vc(e,t){if(t.type!==`stylesheet`||t.state.loading&4)e.flags&=-16777217;else if(e.flags|=16777216,!Wf(t))if(Tu())e.flags|=8192;else throw Na=ka,Da}function Hc(e,t){t!==null&&(e.flags|=4),e.flags&16384&&(t=e.tag===22?536870912:it(),e.lanes|=t,q|=t)}function Uc(e,t){if(!F)switch(e.tailMode){case`hidden`:t=e.tail;for(var n=null;t!==null;)t.alternate!==null&&(n=t),t=t.sibling;n===null?e.tail=null:n.sibling=null;break;case`collapsed`:n=e.tail;for(var r=null;n!==null;)n.alternate!==null&&(r=n),n=n.sibling;r===null?t||e.tail===null?e.tail=null:e.tail.sibling=null:r.sibling=null}}function Wc(e){var t=e.alternate!==null&&e.alternate.child===e.child,n=0,r=0;if(t)for(var i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags&65011712,r|=i.flags&65011712,i.return=e,i=i.sibling;else for(i=e.child;i!==null;)n|=i.lanes|i.childLanes,r|=i.subtreeFlags,r|=i.flags,i.return=e,i=i.sibling;return e.subtreeFlags|=r,e.childLanes=n,t}function Gc(e,t,n){var r=t.pendingProps;switch(Fi(t),t.tag){case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Wc(t),null;case 1:return Wc(t),null;case 3:return n=t.stateNode,r=null,e!==null&&(r=e.memoizedState.cache),t.memoizedState.cache!==r&&(t.flags|=2048),$i(da),be(),n.pendingContext&&(n.context=n.pendingContext,n.pendingContext=null),(e===null||e.child===null)&&(Gi(t)?zc(t):e===null||e.memoizedState.isDehydrated&&!(t.flags&256)||(t.flags|=1024,qi())),Wc(t),null;case 26:var a=t.type,o=t.memoizedState;return e===null?(zc(t),o===null?(Wc(t),Bc(t,a,null,r,n)):(Wc(t),Vc(t,o))):o?o===e.memoizedState?(Wc(t),t.flags&=-16777217):(zc(t),Wc(t),Vc(t,o)):(e=e.memoizedProps,e!==r&&zc(t),Wc(t),Bc(t,a,e,r,n)),null;case 27:if(Se(t),n=_e.current,a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&zc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Wc(t),null}e=he.current,Gi(t)?Ui(t,e):(e=ff(a,r,n),t.stateNode=e,zc(t))}return Wc(t),null;case 5:if(Se(t),a=t.type,e!==null&&t.stateNode!=null)e.memoizedProps!==r&&zc(t);else{if(!r){if(t.stateNode===null)throw Error(i(166));return Wc(t),null}if(o=he.current,Gi(t))Ui(t,o);else{var s=Bd(_e.current);switch(o){case 1:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case 2:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;default:switch(a){case`svg`:o=s.createElementNS(`http://www.w3.org/2000/svg`,a);break;case`math`:o=s.createElementNS(`http://www.w3.org/1998/Math/MathML`,a);break;case`script`:o=s.createElement(`div`),o.innerHTML=`<script><\/script>`,o=o.removeChild(o.firstChild);break;case`select`:o=typeof r.is==`string`?s.createElement(`select`,{is:r.is}):s.createElement(`select`),r.multiple?o.multiple=!0:r.size&&(o.size=r.size);break;default:o=typeof r.is==`string`?s.createElement(a,{is:r.is}):s.createElement(a)}}o[gt]=t,o[_t]=r;a:for(s=t.child;s!==null;){if(s.tag===5||s.tag===6)o.appendChild(s.stateNode);else if(s.tag!==4&&s.tag!==27&&s.child!==null){s.child.return=s,s=s.child;continue}if(s===t)break a;for(;s.sibling===null;){if(s.return===null||s.return===t)break a;s=s.return}s.sibling.return=s.return,s=s.sibling}t.stateNode=o;a:switch(Pd(o,a,r),a){case`button`:case`input`:case`select`:case`textarea`:r=!!r.autoFocus;break a;case`img`:r=!0;break a;default:r=!1}r&&zc(t)}}return Wc(t),Bc(t,t.type,e===null?null:e.memoizedProps,t.pendingProps,n),null;case 6:if(e&&t.stateNode!=null)e.memoizedProps!==r&&zc(t);else{if(typeof r!=`string`&&t.stateNode===null)throw Error(i(166));if(e=_e.current,Gi(t)){if(e=t.stateNode,n=t.memoizedProps,r=null,a=Li,a!==null)switch(a.tag){case 27:case 5:r=a.memoizedProps}e[gt]=t,e=!!(e.nodeValue===n||r!==null&&!0===r.suppressHydrationWarning||Md(e.nodeValue,n)),e||Hi(t,!0)}else e=Bd(e).createTextNode(r),e[gt]=t,t.stateNode=e}return Wc(t),null;case 31:if(n=t.memoizedState,e===null||e.memoizedState!==null){if(r=Gi(t),n!==null){if(e===null){if(!r)throw Error(i(318));if(e=t.memoizedState,e=e===null?null:e.dehydrated,!e)throw Error(i(557));e[gt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Wc(t),e=!1}else n=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=n),e=!0;if(!e)return t.flags&256?(mo(t),t):(mo(t),null);if(t.flags&128)throw Error(i(558))}return Wc(t),null;case 13:if(r=t.memoizedState,e===null||e.memoizedState!==null&&e.memoizedState.dehydrated!==null){if(a=Gi(t),r!==null&&r.dehydrated!==null){if(e===null){if(!a)throw Error(i(318));if(a=t.memoizedState,a=a===null?null:a.dehydrated,!a)throw Error(i(317));a[gt]=t}else Ki(),!(t.flags&128)&&(t.memoizedState=null),t.flags|=4;Wc(t),a=!1}else a=qi(),e!==null&&e.memoizedState!==null&&(e.memoizedState.hydrationErrors=a),a=!0;if(!a)return t.flags&256?(mo(t),t):(mo(t),null)}return mo(t),t.flags&128?(t.lanes=n,t):(n=r!==null,e=e!==null&&e.memoizedState!==null,n&&(r=t.child,a=null,r.alternate!==null&&r.alternate.memoizedState!==null&&r.alternate.memoizedState.cachePool!==null&&(a=r.alternate.memoizedState.cachePool.pool),o=null,r.memoizedState!==null&&r.memoizedState.cachePool!==null&&(o=r.memoizedState.cachePool.pool),o!==a&&(r.flags|=2048)),n!==e&&n&&(t.child.flags|=8192),Hc(t,t.updateQueue),Wc(t),null);case 4:return be(),e===null&&Sd(t.stateNode.containerInfo),Wc(t),null;case 10:return $i(t.type),Wc(t),null;case 19:if(pe(ho),r=t.memoizedState,r===null)return Wc(t),null;if(a=(t.flags&128)!=0,o=r.rendering,o===null)if(a)Uc(r,!1);else{if(Xl!==0||e!==null&&e.flags&128)for(e=t.child;e!==null;){if(o=go(e),o!==null){for(t.flags|=128,Uc(r,!1),e=o.updateQueue,t.updateQueue=e,Hc(t,e),t.subtreeFlags=0,e=n,n=t.child;n!==null;)hi(n,e),n=n.sibling;return me(ho,ho.current&1|2),F&&Mi(t,r.treeForkCount),t.child}e=e.sibling}r.tail!==null&&Fe()>Y&&(t.flags|=128,a=!0,Uc(r,!1),t.lanes=4194304)}else{if(!a)if(e=go(o),e!==null){if(t.flags|=128,a=!0,e=e.updateQueue,t.updateQueue=e,Hc(t,e),Uc(r,!0),r.tail===null&&r.tailMode===`hidden`&&!o.alternate&&!F)return Wc(t),null}else 2*Fe()-r.renderingStartTime>Y&&n!==536870912&&(t.flags|=128,a=!0,Uc(r,!1),t.lanes=4194304);r.isBackwards?(o.sibling=t.child,t.child=o):(e=r.last,e===null?t.child=o:e.sibling=o,r.last=o)}return r.tail===null?(Wc(t),null):(e=r.tail,r.rendering=e,r.tail=e.sibling,r.renderingStartTime=Fe(),e.sibling=null,n=ho.current,me(ho,a?n&1|2:n&1),F&&Mi(t,r.treeForkCount),e);case 22:case 23:return mo(t),oo(),r=t.memoizedState!==null,e===null?r&&(t.flags|=8192):e.memoizedState!==null!==r&&(t.flags|=8192),r?n&536870912&&!(t.flags&128)&&(Wc(t),t.subtreeFlags&6&&(t.flags|=8192)):Wc(t),n=t.updateQueue,n!==null&&Hc(t,n.retryQueue),n=null,e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),r=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(r=t.memoizedState.cachePool.pool),r!==n&&(t.flags|=2048),e!==null&&pe(Sa),null;case 24:return n=null,e!==null&&(n=e.memoizedState.cache),t.memoizedState.cache!==n&&(t.flags|=2048),$i(da),Wc(t),null;case 25:return null;case 30:return null}throw Error(i(156,t.tag))}function Kc(e,t){switch(Fi(t),t.tag){case 1:return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 3:return $i(da),be(),e=t.flags,e&65536&&!(e&128)?(t.flags=e&-65537|128,t):null;case 26:case 27:case 5:return Se(t),null;case 31:if(t.memoizedState!==null){if(mo(t),t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 13:if(mo(t),e=t.memoizedState,e!==null&&e.dehydrated!==null){if(t.alternate===null)throw Error(i(340));Ki()}return e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 19:return pe(ho),null;case 4:return be(),null;case 10:return $i(t.type),null;case 22:case 23:return mo(t),oo(),e!==null&&pe(Sa),e=t.flags,e&65536?(t.flags=e&-65537|128,t):null;case 24:return $i(da),null;case 25:return null;default:return null}}function qc(e,t){switch(Fi(t),t.tag){case 3:$i(da),be();break;case 26:case 27:case 5:Se(t);break;case 4:be();break;case 31:t.memoizedState!==null&&mo(t);break;case 13:mo(t);break;case 19:pe(ho);break;case 10:$i(t.type);break;case 22:case 23:mo(t),oo(),e!==null&&pe(Sa);break;case 24:$i(da)}}function Jc(e,t){try{var n=t.updateQueue,r=n===null?null:n.lastEffect;if(r!==null){var i=r.next;n=i;do{if((n.tag&e)===e){r=void 0;var a=n.create,o=n.inst;r=a(),o.destroy=r}n=n.next}while(n!==i)}}catch(e){X(t,t.return,e)}}function Yc(e,t,n){try{var r=t.updateQueue,i=r===null?null:r.lastEffect;if(i!==null){var a=i.next;r=a;do{if((r.tag&e)===e){var o=r.inst,s=o.destroy;if(s!==void 0){o.destroy=void 0,i=t;var c=n,l=s;try{l()}catch(e){X(i,c,e)}}}r=r.next}while(r!==a)}}catch(e){X(t,t.return,e)}}function Xc(e){var t=e.updateQueue;if(t!==null){var n=e.stateNode;try{to(t,n)}catch(t){X(e,e.return,t)}}}function Zc(e,t,n){n.props=Qs(e.type,e.memoizedProps),n.state=e.memoizedState;try{n.componentWillUnmount()}catch(n){X(e,t,n)}}function Qc(e,t){try{var n=e.ref;if(n!==null){switch(e.tag){case 26:case 27:case 5:var r=e.stateNode;break;case 30:r=e.stateNode;break;default:r=e.stateNode}typeof n==`function`?e.refCleanup=n(r):n.current=r}}catch(n){X(e,t,n)}}function $c(e,t){var n=e.ref,r=e.refCleanup;if(n!==null)if(typeof r==`function`)try{r()}catch(n){X(e,t,n)}finally{e.refCleanup=null,e=e.alternate,e!=null&&(e.refCleanup=null)}else if(typeof n==`function`)try{n(null)}catch(n){X(e,t,n)}else n.current=null}function el(e){var t=e.type,n=e.memoizedProps,r=e.stateNode;try{a:switch(t){case`button`:case`input`:case`select`:case`textarea`:n.autoFocus&&r.focus();break a;case`img`:n.src?r.src=n.src:n.srcSet&&(r.srcset=n.srcSet)}}catch(t){X(e,e.return,t)}}function tl(e,t,n){try{var r=e.stateNode;Fd(r,e.type,n,t),r[_t]=t}catch(t){X(e,e.return,t)}}function nl(e){return e.tag===5||e.tag===3||e.tag===26||e.tag===27&&Zd(e.type)||e.tag===4}function rl(e){a:for(;;){for(;e.sibling===null;){if(e.return===null||nl(e.return))return null;e=e.return}for(e.sibling.return=e.return,e=e.sibling;e.tag!==5&&e.tag!==6&&e.tag!==18;){if(e.tag===27&&Zd(e.type)||e.flags&2||e.child===null||e.tag===4)continue a;e.child.return=e,e=e.child}if(!(e.flags&2))return e.stateNode}}function il(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?(n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n).insertBefore(e,t):(t=n.nodeType===9?n.body:n.nodeName===`HTML`?n.ownerDocument.body:n,t.appendChild(e),n=n._reactRootContainer,n!=null||t.onclick!==null||(t.onclick=un));else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode,t=null),e=e.child,e!==null))for(il(e,t,n),e=e.sibling;e!==null;)il(e,t,n),e=e.sibling}function al(e,t,n){var r=e.tag;if(r===5||r===6)e=e.stateNode,t?n.insertBefore(e,t):n.appendChild(e);else if(r!==4&&(r===27&&Zd(e.type)&&(n=e.stateNode),e=e.child,e!==null))for(al(e,t,n),e=e.sibling;e!==null;)al(e,t,n),e=e.sibling}function ol(e){var t=e.stateNode,n=e.memoizedProps;try{for(var r=e.type,i=t.attributes;i.length;)t.removeAttributeNode(i[0]);Pd(t,r,n),t[gt]=e,t[_t]=n}catch(t){X(e,e.return,t)}}var sl=!1,cl=!1,ll=!1,ul=typeof WeakSet==`function`?WeakSet:Set,dl=null;function fl(e,t){if(e=e.containerInfo,Rd=sp,e=Pr(e),Fr(e)){if(`selectionStart`in e)var n={start:e.selectionStart,end:e.selectionEnd};else a:{n=(n=e.ownerDocument)&&n.defaultView||window;var r=n.getSelection&&n.getSelection();if(r&&r.rangeCount!==0){n=r.anchorNode;var a=r.anchorOffset,o=r.focusNode;r=r.focusOffset;try{n.nodeType,o.nodeType}catch{n=null;break a}var s=0,c=-1,l=-1,u=0,d=0,f=e,p=null;b:for(;;){for(var m;f!==n||a!==0&&f.nodeType!==3||(c=s+a),f!==o||r!==0&&f.nodeType!==3||(l=s+r),f.nodeType===3&&(s+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===e)break b;if(p===n&&++u===a&&(c=s),p===o&&++d===r&&(l=s),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=c===-1||l===-1?null:{start:c,end:l}}else n=null}n||={start:0,end:0}}else n=null;for(zd={focusedElem:e,selectionRange:n},sp=!1,dl=t;dl!==null;)if(t=dl,e=t.child,t.subtreeFlags&1028&&e!==null)e.return=t,dl=e;else for(;dl!==null;){switch(t=dl,o=t.alternate,e=t.flags,t.tag){case 0:if(e&4&&(e=t.updateQueue,e=e===null?null:e.events,e!==null))for(n=0;n<e.length;n++)a=e[n],a.ref.impl=a.nextImpl;break;case 11:case 15:break;case 1:if(e&1024&&o!==null){e=void 0,n=t,a=o.memoizedProps,o=o.memoizedState,r=n.stateNode;try{var h=Qs(n.type,a);e=r.getSnapshotBeforeUpdate(h,o),r.__reactInternalSnapshotBeforeUpdate=e}catch(e){X(n,n.return,e)}}break;case 3:if(e&1024){if(e=t.stateNode.containerInfo,n=e.nodeType,n===9)ef(e);else if(n===1)switch(e.nodeName){case`HEAD`:case`HTML`:case`BODY`:ef(e);break;default:e.textContent=``}}break;case 5:case 26:case 27:case 6:case 4:case 17:break;default:if(e&1024)throw Error(i(163))}if(e=t.sibling,e!==null){e.return=t.return,dl=e;break}dl=t.return}}function pl(e,t,n){var r=n.flags;switch(n.tag){case 0:case 11:case 15:Ol(e,n),r&4&&Jc(5,n);break;case 1:if(Ol(e,n),r&4)if(e=n.stateNode,t===null)try{e.componentDidMount()}catch(e){X(n,n.return,e)}else{var i=Qs(n.type,t.memoizedProps);t=t.memoizedState;try{e.componentDidUpdate(i,t,e.__reactInternalSnapshotBeforeUpdate)}catch(e){X(n,n.return,e)}}r&64&&Xc(n),r&512&&Qc(n,n.return);break;case 3:if(Ol(e,n),r&64&&(e=n.updateQueue,e!==null)){if(t=null,n.child!==null)switch(n.child.tag){case 27:case 5:t=n.child.stateNode;break;case 1:t=n.child.stateNode}try{to(e,t)}catch(e){X(n,n.return,e)}}break;case 27:t===null&&r&4&&ol(n);case 26:case 5:Ol(e,n),t===null&&r&4&&el(n),r&512&&Qc(n,n.return);break;case 12:Ol(e,n);break;case 31:Ol(e,n),r&4&&yl(e,n);break;case 13:Ol(e,n),r&4&&bl(e,n),r&64&&(e=n.memoizedState,e!==null&&(e=e.dehydrated,e!==null&&(n=Yu.bind(null,n),sf(e,n))));break;case 22:if(r=n.memoizedState!==null||sl,!r){t=t!==null&&t.memoizedState!==null||cl,i=sl;var a=cl;sl=r,(cl=t)&&!a?Al(e,n,(n.subtreeFlags&8772)!=0):Ol(e,n),sl=i,cl=a}break;case 30:break;default:Ol(e,n)}}function ml(e){var t=e.alternate;t!==null&&(e.alternate=null,ml(t)),e.child=null,e.deletions=null,e.sibling=null,e.tag===5&&(t=e.stateNode,t!==null&&wt(t)),e.stateNode=null,e.return=null,e.dependencies=null,e.memoizedProps=null,e.memoizedState=null,e.pendingProps=null,e.stateNode=null,e.updateQueue=null}var hl=null,gl=!1;function _l(e,t,n){for(n=n.child;n!==null;)vl(e,t,n),n=n.sibling}function vl(e,t,n){if(Ge&&typeof Ge.onCommitFiberUnmount==`function`)try{Ge.onCommitFiberUnmount(We,n)}catch{}switch(n.tag){case 26:cl||$c(n,t),_l(e,t,n),n.memoizedState?n.memoizedState.count--:n.stateNode&&(n=n.stateNode,n.parentNode.removeChild(n));break;case 27:cl||$c(n,t);var r=hl,i=gl;Zd(n.type)&&(hl=n.stateNode,gl=!1),_l(e,t,n),pf(n.stateNode),hl=r,gl=i;break;case 5:cl||$c(n,t);case 6:if(r=hl,i=gl,hl=null,_l(e,t,n),hl=r,gl=i,hl!==null)if(gl)try{(hl.nodeType===9?hl.body:hl.nodeName===`HTML`?hl.ownerDocument.body:hl).removeChild(n.stateNode)}catch(e){X(n,t,e)}else try{hl.removeChild(n.stateNode)}catch(e){X(n,t,e)}break;case 18:hl!==null&&(gl?(e=hl,Qd(e.nodeType===9?e.body:e.nodeName===`HTML`?e.ownerDocument.body:e,n.stateNode),Np(e)):Qd(hl,n.stateNode));break;case 4:r=hl,i=gl,hl=n.stateNode.containerInfo,gl=!0,_l(e,t,n),hl=r,gl=i;break;case 0:case 11:case 14:case 15:Yc(2,n,t),cl||Yc(4,n,t),_l(e,t,n);break;case 1:cl||($c(n,t),r=n.stateNode,typeof r.componentWillUnmount==`function`&&Zc(n,t,r)),_l(e,t,n);break;case 21:_l(e,t,n);break;case 22:cl=(r=cl)||n.memoizedState!==null,_l(e,t,n),cl=r;break;default:_l(e,t,n)}}function yl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null))){e=e.dehydrated;try{Np(e)}catch(e){X(t,t.return,e)}}}function bl(e,t){if(t.memoizedState===null&&(e=t.alternate,e!==null&&(e=e.memoizedState,e!==null&&(e=e.dehydrated,e!==null))))try{Np(e)}catch(e){X(t,t.return,e)}}function xl(e){switch(e.tag){case 31:case 13:case 19:var t=e.stateNode;return t===null&&(t=e.stateNode=new ul),t;case 22:return e=e.stateNode,t=e._retryCache,t===null&&(t=e._retryCache=new ul),t;default:throw Error(i(435,e.tag))}}function Sl(e,t){var n=xl(e);t.forEach(function(t){if(!n.has(t)){n.add(t);var r=Xu.bind(null,e,t);t.then(r,r)}})}function Cl(e,t){var n=t.deletions;if(n!==null)for(var r=0;r<n.length;r++){var a=n[r],o=e,s=t,c=s;a:for(;c!==null;){switch(c.tag){case 27:if(Zd(c.type)){hl=c.stateNode,gl=!1;break a}break;case 5:hl=c.stateNode,gl=!1;break a;case 3:case 4:hl=c.stateNode.containerInfo,gl=!0;break a}c=c.return}if(hl===null)throw Error(i(160));vl(o,s,a),hl=null,gl=!1,o=a.alternate,o!==null&&(o.return=null),a.return=null}if(t.subtreeFlags&13886)for(t=t.child;t!==null;)Tl(t,e),t=t.sibling}var wl=null;function Tl(e,t){var n=e.alternate,r=e.flags;switch(e.tag){case 0:case 11:case 14:case 15:Cl(t,e),El(e),r&4&&(Yc(3,e,e.return),Jc(3,e),Yc(5,e,e.return));break;case 1:Cl(t,e),El(e),r&512&&(cl||n===null||$c(n,n.return)),r&64&&sl&&(e=e.updateQueue,e!==null&&(r=e.callbacks,r!==null&&(n=e.shared.hiddenCallbacks,e.shared.hiddenCallbacks=n===null?r:n.concat(r))));break;case 26:var a=wl;if(Cl(t,e),El(e),r&512&&(cl||n===null||$c(n,n.return)),r&4){var o=n===null?null:n.memoizedState;if(r=e.memoizedState,n===null)if(r===null)if(e.stateNode===null){a:{r=e.type,n=e.memoizedProps,a=a.ownerDocument||a;b:switch(r){case`title`:o=a.getElementsByTagName(`title`)[0],(!o||o[Ct]||o[gt]||o.namespaceURI===`http://www.w3.org/2000/svg`||o.hasAttribute(`itemprop`))&&(o=a.createElement(r),a.head.insertBefore(o,a.querySelector(`head > title`))),Pd(o,r,n),o[gt]=e,kt(o),r=o;break a;case`link`:var s=Vf(`link`,`href`,a).get(r+(n.href||``));if(s){for(var c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`href`)===(n.href==null||n.href===``?null:n.href)&&o.getAttribute(`rel`)===(n.rel==null?null:n.rel)&&o.getAttribute(`title`)===(n.title==null?null:n.title)&&o.getAttribute(`crossorigin`)===(n.crossOrigin==null?null:n.crossOrigin)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;case`meta`:if(s=Vf(`meta`,`content`,a).get(r+(n.content||``))){for(c=0;c<s.length;c++)if(o=s[c],o.getAttribute(`content`)===(n.content==null?null:``+n.content)&&o.getAttribute(`name`)===(n.name==null?null:n.name)&&o.getAttribute(`property`)===(n.property==null?null:n.property)&&o.getAttribute(`http-equiv`)===(n.httpEquiv==null?null:n.httpEquiv)&&o.getAttribute(`charset`)===(n.charSet==null?null:n.charSet)){s.splice(c,1);break b}}o=a.createElement(r),Pd(o,r,n),a.head.appendChild(o);break;default:throw Error(i(468,r))}o[gt]=e,kt(o),r=o}e.stateNode=r}else Hf(a,e.type,e.stateNode);else e.stateNode=If(a,r,e.memoizedProps);else o===r?r===null&&e.stateNode!==null&&tl(e,e.memoizedProps,n.memoizedProps):(o===null?n.stateNode!==null&&(n=n.stateNode,n.parentNode.removeChild(n)):o.count--,r===null?Hf(a,e.type,e.stateNode):If(a,r,e.memoizedProps))}break;case 27:Cl(t,e),El(e),r&512&&(cl||n===null||$c(n,n.return)),n!==null&&r&4&&tl(e,e.memoizedProps,n.memoizedProps);break;case 5:if(Cl(t,e),El(e),r&512&&(cl||n===null||$c(n,n.return)),e.flags&32){a=e.stateNode;try{tn(a,``)}catch(t){X(e,e.return,t)}}r&4&&e.stateNode!=null&&(a=e.memoizedProps,tl(e,a,n===null?a:n.memoizedProps)),r&1024&&(ll=!0);break;case 6:if(Cl(t,e),El(e),r&4){if(e.stateNode===null)throw Error(i(162));r=e.memoizedProps,n=e.stateNode;try{n.nodeValue=r}catch(t){X(e,e.return,t)}}break;case 3:if(Bf=null,a=wl,wl=gf(t.containerInfo),Cl(t,e),wl=a,El(e),r&4&&n!==null&&n.memoizedState.isDehydrated)try{Np(t.containerInfo)}catch(t){X(e,e.return,t)}ll&&(ll=!1,Dl(e));break;case 4:r=wl,wl=gf(e.stateNode.containerInfo),Cl(t,e),El(e),wl=r;break;case 12:Cl(t,e),El(e);break;case 31:Cl(t,e),El(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Sl(e,r)));break;case 13:Cl(t,e),El(e),e.child.flags&8192&&e.memoizedState!==null!=(n!==null&&n.memoizedState!==null)&&(tu=Fe()),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Sl(e,r)));break;case 22:a=e.memoizedState!==null;var l=n!==null&&n.memoizedState!==null,u=sl,d=cl;if(sl=u||a,cl=d||l,Cl(t,e),cl=d,sl=u,El(e),r&8192)a:for(t=e.stateNode,t._visibility=a?t._visibility&-2:t._visibility|1,a&&(n===null||l||sl||cl||kl(e)),n=null,t=e;;){if(t.tag===5||t.tag===26){if(n===null){l=n=t;try{if(o=l.stateNode,a)s=o.style,typeof s.setProperty==`function`?s.setProperty(`display`,`none`,`important`):s.display=`none`;else{c=l.stateNode;var f=l.memoizedProps.style,p=f!=null&&f.hasOwnProperty(`display`)?f.display:null;c.style.display=p==null||typeof p==`boolean`?``:(``+p).trim()}}catch(e){X(l,l.return,e)}}}else if(t.tag===6){if(n===null){l=t;try{l.stateNode.nodeValue=a?``:l.memoizedProps}catch(e){X(l,l.return,e)}}}else if(t.tag===18){if(n===null){l=t;try{var m=l.stateNode;a?$d(m,!0):$d(l.stateNode,!1)}catch(e){X(l,l.return,e)}}}else if((t.tag!==22&&t.tag!==23||t.memoizedState===null||t===e)&&t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break a;for(;t.sibling===null;){if(t.return===null||t.return===e)break a;n===t&&(n=null),t=t.return}n===t&&(n=null),t.sibling.return=t.return,t=t.sibling}r&4&&(r=e.updateQueue,r!==null&&(n=r.retryQueue,n!==null&&(r.retryQueue=null,Sl(e,n))));break;case 19:Cl(t,e),El(e),r&4&&(r=e.updateQueue,r!==null&&(e.updateQueue=null,Sl(e,r)));break;case 30:break;case 21:break;default:Cl(t,e),El(e)}}function El(e){var t=e.flags;if(t&2){try{for(var n,r=e.return;r!==null;){if(nl(r)){n=r;break}r=r.return}if(n==null)throw Error(i(160));switch(n.tag){case 27:var a=n.stateNode;al(e,rl(e),a);break;case 5:var o=n.stateNode;n.flags&32&&(tn(o,``),n.flags&=-33),al(e,rl(e),o);break;case 3:case 4:var s=n.stateNode.containerInfo;il(e,rl(e),s);break;default:throw Error(i(161))}}catch(t){X(e,e.return,t)}e.flags&=-3}t&4096&&(e.flags&=-4097)}function Dl(e){if(e.subtreeFlags&1024)for(e=e.child;e!==null;){var t=e;Dl(t),t.tag===5&&t.flags&1024&&t.stateNode.reset(),e=e.sibling}}function Ol(e,t){if(t.subtreeFlags&8772)for(t=t.child;t!==null;)pl(e,t.alternate,t),t=t.sibling}function kl(e){for(e=e.child;e!==null;){var t=e;switch(t.tag){case 0:case 11:case 14:case 15:Yc(4,t,t.return),kl(t);break;case 1:$c(t,t.return);var n=t.stateNode;typeof n.componentWillUnmount==`function`&&Zc(t,t.return,n),kl(t);break;case 27:pf(t.stateNode);case 26:case 5:$c(t,t.return),kl(t);break;case 22:t.memoizedState===null&&kl(t);break;case 30:kl(t);break;default:kl(t)}e=e.sibling}}function Al(e,t,n){for(n&&=(t.subtreeFlags&8772)!=0,t=t.child;t!==null;){var r=t.alternate,i=e,a=t,o=a.flags;switch(a.tag){case 0:case 11:case 15:Al(i,a,n),Jc(4,a);break;case 1:if(Al(i,a,n),r=a,i=r.stateNode,typeof i.componentDidMount==`function`)try{i.componentDidMount()}catch(e){X(r,r.return,e)}if(r=a,i=r.updateQueue,i!==null){var s=r.stateNode;try{var c=i.shared.hiddenCallbacks;if(c!==null)for(i.shared.hiddenCallbacks=null,i=0;i<c.length;i++)eo(c[i],s)}catch(e){X(r,r.return,e)}}n&&o&64&&Xc(a),Qc(a,a.return);break;case 27:ol(a);case 26:case 5:Al(i,a,n),n&&r===null&&o&4&&el(a),Qc(a,a.return);break;case 12:Al(i,a,n);break;case 31:Al(i,a,n),n&&o&4&&yl(i,a);break;case 13:Al(i,a,n),n&&o&4&&bl(i,a);break;case 22:a.memoizedState===null&&Al(i,a,n),Qc(a,a.return);break;case 30:break;default:Al(i,a,n)}t=t.sibling}}function jl(e,t){var n=null;e!==null&&e.memoizedState!==null&&e.memoizedState.cachePool!==null&&(n=e.memoizedState.cachePool.pool),e=null,t.memoizedState!==null&&t.memoizedState.cachePool!==null&&(e=t.memoizedState.cachePool.pool),e!==n&&(e!=null&&e.refCount++,n!=null&&pa(n))}function R(e,t){e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pa(e))}function Ml(e,t,n,r){if(t.subtreeFlags&10256)for(t=t.child;t!==null;)Nl(e,t,n,r),t=t.sibling}function Nl(e,t,n,r){var i=t.flags;switch(t.tag){case 0:case 11:case 15:Ml(e,t,n,r),i&2048&&Jc(9,t);break;case 1:Ml(e,t,n,r);break;case 3:Ml(e,t,n,r),i&2048&&(e=null,t.alternate!==null&&(e=t.alternate.memoizedState.cache),t=t.memoizedState.cache,t!==e&&(t.refCount++,e!=null&&pa(e)));break;case 12:if(i&2048){Ml(e,t,n,r),e=t.stateNode;try{var a=t.memoizedProps,o=a.id,s=a.onPostCommit;typeof s==`function`&&s(o,t.alternate===null?`mount`:`update`,e.passiveEffectDuration,-0)}catch(e){X(t,t.return,e)}}else Ml(e,t,n,r);break;case 31:Ml(e,t,n,r);break;case 13:Ml(e,t,n,r);break;case 23:break;case 22:a=t.stateNode,o=t.alternate,t.memoizedState===null?a._visibility&2?Ml(e,t,n,r):(a._visibility|=2,Pl(e,t,n,r,(t.subtreeFlags&10256)!=0||!1)):a._visibility&2?Ml(e,t,n,r):Fl(e,t),i&2048&&jl(o,t);break;case 24:Ml(e,t,n,r),i&2048&&R(t.alternate,t);break;default:Ml(e,t,n,r)}}function Pl(e,t,n,r,i){for(i&&=(t.subtreeFlags&10256)!=0||!1,t=t.child;t!==null;){var a=e,o=t,s=n,c=r,l=o.flags;switch(o.tag){case 0:case 11:case 15:Pl(a,o,s,c,i),Jc(8,o);break;case 23:break;case 22:var u=o.stateNode;o.memoizedState===null?(u._visibility|=2,Pl(a,o,s,c,i)):u._visibility&2?Pl(a,o,s,c,i):Fl(a,o),i&&l&2048&&jl(o.alternate,o);break;case 24:Pl(a,o,s,c,i),i&&l&2048&&R(o.alternate,o);break;default:Pl(a,o,s,c,i)}t=t.sibling}}function Fl(e,t){if(t.subtreeFlags&10256)for(t=t.child;t!==null;){var n=e,r=t,i=r.flags;switch(r.tag){case 22:Fl(n,r),i&2048&&jl(r.alternate,r);break;case 24:Fl(n,r),i&2048&&R(r.alternate,r);break;default:Fl(n,r)}t=t.sibling}}var Il=8192;function Ll(e,t,n){if(e.subtreeFlags&Il)for(e=e.child;e!==null;)z(e,t,n),e=e.sibling}function z(e,t,n){switch(e.tag){case 26:Ll(e,t,n),e.flags&Il&&e.memoizedState!==null&&Gf(n,wl,e.memoizedState,e.memoizedProps);break;case 5:Ll(e,t,n);break;case 3:case 4:var r=wl;wl=gf(e.stateNode.containerInfo),Ll(e,t,n),wl=r;break;case 22:e.memoizedState===null&&(r=e.alternate,r!==null&&r.memoizedState!==null?(r=Il,Il=16777216,Ll(e,t,n),Il=r):Ll(e,t,n));break;default:Ll(e,t,n)}}function Rl(e){var t=e.alternate;if(t!==null&&(e=t.child,e!==null)){t.child=null;do t=e.sibling,e.sibling=null,e=t;while(e!==null)}}function zl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];dl=r,Vl(r,e)}Rl(e)}if(e.subtreeFlags&10256)for(e=e.child;e!==null;)B(e),e=e.sibling}function B(e){switch(e.tag){case 0:case 11:case 15:zl(e),e.flags&2048&&Yc(9,e,e.return);break;case 3:zl(e);break;case 12:zl(e);break;case 22:var t=e.stateNode;e.memoizedState!==null&&t._visibility&2&&(e.return===null||e.return.tag!==13)?(t._visibility&=-3,Bl(e)):zl(e);break;default:zl(e)}}function Bl(e){var t=e.deletions;if(e.flags&16){if(t!==null)for(var n=0;n<t.length;n++){var r=t[n];dl=r,Vl(r,e)}Rl(e)}for(e=e.child;e!==null;){switch(t=e,t.tag){case 0:case 11:case 15:Yc(8,t,t.return),Bl(t);break;case 22:n=t.stateNode,n._visibility&2&&(n._visibility&=-3,Bl(t));break;default:Bl(t)}e=e.sibling}}function Vl(e,t){for(;dl!==null;){var n=dl;switch(n.tag){case 0:case 11:case 15:Yc(8,n,t);break;case 23:case 22:if(n.memoizedState!==null&&n.memoizedState.cachePool!==null){var r=n.memoizedState.cachePool.pool;r!=null&&r.refCount++}break;case 24:pa(n.memoizedState.cache)}if(r=n.child,r!==null)r.return=n,dl=r;else a:for(n=e;dl!==null;){r=dl;var i=r.sibling,a=r.return;if(ml(r),r===n){dl=null;break a}if(i!==null){i.return=a,dl=i;break a}dl=a}}}var Hl={getCacheForType:function(e){var t=aa(da),n=t.data.get(e);return n===void 0&&(n=e(),t.data.set(e,n)),n},cacheSignal:function(){return aa(da).controller.signal}},Ul=typeof WeakMap==`function`?WeakMap:Map,V=0,Wl=null,H=null,U=0,W=0,Gl=null,Kl=!1,ql=!1,Jl=!1,Yl=0,Xl=0,G=0,Zl=0,Ql=0,K=0,q=0,$l=null,eu=null,J=!1,tu=0,nu=0,Y=1/0,ru=null,iu=null,au=0,ou=null,su=null,cu=0,lu=0,uu=null,du=null,fu=0,pu=null;function mu(){return V&2&&U!==0?U&-U:D.T===null?pt():dd()}function hu(){if(K===0)if(!(U&536870912)||F){var e=Qe;Qe<<=1,!(Qe&3932160)&&(Qe=262144),K=e}else K=536870912;return e=so.current,e!==null&&(e.flags|=32),K}function gu(e,t,n){(e===Wl&&(W===2||W===9)||e.cancelPendingCommit!==null)&&(Cu(e,0),bu(e,U,K,!1)),ot(e,n),(!(V&2)||e!==Wl)&&(e===Wl&&(!(V&2)&&(Zl|=n),Xl===4&&bu(e,U,K,!1)),id(e))}function _u(e,t,n){if(V&6)throw Error(i(327));var r=!n&&(t&127)==0&&(t&e.expiredLanes)===0||nt(e,t),a=r?ju(e,t):ku(e,t,!0),o=r;do{if(a===0){ql&&!r&&bu(e,t,0,!1);break}else{if(n=e.current.alternate,o&&!yu(n)){a=ku(e,t,!1),o=!1;continue}if(a===2){if(o=t,e.errorRecoveryDisabledLanes&o)var s=0;else s=e.pendingLanes&-536870913,s=s===0?s&536870912?536870912:0:s;if(s!==0){t=s;a:{var c=e;a=$l;var l=c.current.memoizedState.isDehydrated;if(l&&(Cu(c,s).flags|=256),s=ku(c,s,!1),s!==2){if(Jl&&!l){c.errorRecoveryDisabledLanes|=o,Zl|=o,a=4;break a}o=eu,eu=a,o!==null&&(eu===null?eu=o:eu.push.apply(eu,o))}a=s}if(o=!1,a!==2)continue}}if(a===1){Cu(e,0),bu(e,t,0,!0);break}a:{switch(r=e,o=a,o){case 0:case 1:throw Error(i(345));case 4:if((t&4194048)!==t)break;case 6:bu(r,t,K,!Kl);break a;case 2:eu=null;break;case 3:case 5:break;default:throw Error(i(329))}if((t&62914560)===t&&(a=tu+300-Fe(),10<a)){if(bu(r,t,K,!Kl),tt(r,0,!0)!==0)break a;cu=t,r.timeoutHandle=Kd(vu.bind(null,r,n,eu,ru,J,t,K,Zl,q,Kl,o,`Throttled`,-0,0),a);break a}vu(r,n,eu,ru,J,t,K,Zl,q,Kl,o,null,-0,0)}}break}while(1);id(e)}function vu(e,t,n,r,i,a,o,s,c,l,u,d,f,p){if(e.timeoutHandle=-1,d=t.subtreeFlags,d&8192||(d&16785408)==16785408){d={stylesheets:null,count:0,imgCount:0,imgBytes:0,suspenseyImages:[],waitingForImages:!0,waitingForViewTransition:!1,unsuspend:un},z(t,a,d);var m=(a&62914560)===a?tu-Fe():(a&4194048)===a?nu-Fe():0;if(m=qf(d,m),m!==null){cu=a,e.cancelPendingCommit=m(Ru.bind(null,e,t,a,n,r,i,o,s,c,u,d,null,f,p)),bu(e,a,o,!l);return}}Ru(e,t,a,n,r,i,o,s,c)}function yu(e){for(var t=e;;){var n=t.tag;if((n===0||n===11||n===15)&&t.flags&16384&&(n=t.updateQueue,n!==null&&(n=n.stores,n!==null)))for(var r=0;r<n.length;r++){var i=n[r],a=i.getSnapshot;i=i.value;try{if(!kr(a(),i))return!1}catch{return!1}}if(n=t.child,t.subtreeFlags&16384&&n!==null)n.return=t,t=n;else{if(t===e)break;for(;t.sibling===null;){if(t.return===null||t.return===e)return!0;t=t.return}t.sibling.return=t.return,t=t.sibling}}return!0}function bu(e,t,n,r){t&=~Ql,t&=~Zl,e.suspendedLanes|=t,e.pingedLanes&=~t,r&&(e.warmLanes|=t),r=e.expirationTimes;for(var i=t;0<i;){var a=31-qe(i),o=1<<a;r[a]=-1,i&=~o}n!==0&&ct(e,n,t)}function xu(){return V&6?!0:(Z(0,!1),!1)}function Su(){if(H!==null){if(W===0)var e=H.return;else e=H,Zi=Xi=null,Po(e),Ia=null,La=0,e=H;for(;e!==null;)qc(e.alternate,e),e=e.return;H=null}}function Cu(e,t){var n=e.timeoutHandle;n!==-1&&(e.timeoutHandle=-1,qd(n)),n=e.cancelPendingCommit,n!==null&&(e.cancelPendingCommit=null,n()),cu=0,Su(),Wl=e,H=n=mi(e.current,null),U=t,W=0,Gl=null,Kl=!1,ql=nt(e,t),Jl=!1,q=K=Ql=Zl=G=Xl=0,eu=$l=null,J=!1,t&8&&(t|=t&32);var r=e.entangledLanes;if(r!==0)for(e=e.entanglements,r&=t;0<r;){var i=31-qe(r),a=1<<i;t|=e[i],r&=~a}return Yl=t,si(),n}function wu(e,t){I=null,D.H=Ws,t===Ea||t===Oa?(t=Pa(),W=3):t===Da?(t=Pa(),W=4):W=t===cc?8:typeof t==`object`&&t&&typeof t.then==`function`?6:1,Gl=t,H===null&&(Xl=1,nc(e,Si(t,e.current)))}function Tu(){var e=so.current;return e===null?!0:(U&4194048)===U?co===null:(U&62914560)===U||U&536870912?e===co:!1}function Eu(){var e=D.H;return D.H=Ws,e===null?Ws:e}function Du(){var e=D.A;return D.A=Hl,e}function Ou(){Xl=4,Kl||(U&4194048)!==U&&so.current!==null||(ql=!0),!(G&134217727)&&!(Zl&134217727)||Wl===null||bu(Wl,U,K,!1)}function ku(e,t,n){var r=V;V|=2;var i=Eu(),a=Du();(Wl!==e||U!==t)&&(ru=null,Cu(e,t)),t=!1;var o=Xl;a:do try{if(W!==0&&H!==null){var s=H,c=Gl;switch(W){case 8:Su(),o=6;break a;case 3:case 2:case 9:case 6:so.current===null&&(t=!0);var l=W;if(W=0,Gl=null,Fu(e,s,c,l),n&&ql){o=0;break a}break;default:l=W,W=0,Gl=null,Fu(e,s,c,l)}}Au(),o=Xl;break}catch(t){wu(e,t)}while(1);return t&&e.shellSuspendCounter++,Zi=Xi=null,V=r,D.H=i,D.A=a,H===null&&(Wl=null,U=0,si()),o}function Au(){for(;H!==null;)Nu(H)}function ju(e,t){var n=V;V|=2;var r=Eu(),a=Du();Wl!==e||U!==t?(ru=null,Y=Fe()+500,Cu(e,t)):ql=nt(e,t);a:do try{if(W!==0&&H!==null){t=H;var o=Gl;b:switch(W){case 1:W=0,Gl=null,Fu(e,t,o,1);break;case 2:case 9:if(Aa(o)){W=0,Gl=null,Pu(t);break}t=function(){W!==2&&W!==9||Wl!==e||(W=7),id(e)},o.then(t,t);break a;case 3:W=7;break a;case 4:W=5;break a;case 7:Aa(o)?(W=0,Gl=null,Pu(t)):(W=0,Gl=null,Fu(e,t,o,7));break;case 5:var s=null;switch(H.tag){case 26:s=H.memoizedState;case 5:case 27:var c=H;if(s?Wf(s):c.stateNode.complete){W=0,Gl=null;var l=c.sibling;if(l!==null)H=l;else{var u=c.return;u===null?H=null:(H=u,Iu(u))}break b}}W=0,Gl=null,Fu(e,t,o,5);break;case 6:W=0,Gl=null,Fu(e,t,o,6);break;case 8:Su(),Xl=6;break a;default:throw Error(i(462))}}Mu();break}catch(t){wu(e,t)}while(1);return Zi=Xi=null,D.H=r,D.A=a,V=n,H===null?(Wl=null,U=0,si(),Xl):0}function Mu(){for(;H!==null&&!Ne();)Nu(H)}function Nu(e){var t=Rc(e.alternate,e,Yl);e.memoizedProps=e.pendingProps,t===null?Iu(e):H=t}function Pu(e){var t=e,n=t.alternate;switch(t.tag){case 15:case 0:t=Sc(n,t,t.pendingProps,t.type,void 0,U);break;case 11:t=Sc(n,t,t.pendingProps,t.type.render,t.ref,U);break;case 5:Po(t);default:qc(n,t),t=H=hi(t,Yl),t=Rc(n,t,Yl)}e.memoizedProps=e.pendingProps,t===null?Iu(e):H=t}function Fu(e,t,n,r){Zi=Xi=null,Po(t),Ia=null,La=0;var i=t.return;try{if(sc(e,i,t,n,U)){Xl=1,nc(e,Si(n,e.current)),H=null;return}}catch(t){if(i!==null)throw H=i,t;Xl=1,nc(e,Si(n,e.current)),H=null;return}t.flags&32768?(F||r===1?e=!0:ql||U&536870912?e=!1:(Kl=e=!0,(r===2||r===9||r===3||r===6)&&(r=so.current,r!==null&&r.tag===13&&(r.flags|=16384))),Lu(t,e)):Iu(t)}function Iu(e){var t=e;do{if(t.flags&32768){Lu(t,Kl);return}e=t.return;var n=Gc(t.alternate,t,Yl);if(n!==null){H=n;return}if(t=t.sibling,t!==null){H=t;return}H=t=e}while(t!==null);Xl===0&&(Xl=5)}function Lu(e,t){do{var n=Kc(e.alternate,e);if(n!==null){n.flags&=32767,H=n;return}if(n=e.return,n!==null&&(n.flags|=32768,n.subtreeFlags=0,n.deletions=null),!t&&(e=e.sibling,e!==null)){H=e;return}H=e=n}while(e!==null);Xl=6,H=null}function Ru(e,t,n,r,a,o,s,c,l){e.cancelPendingCommit=null;do Uu();while(au!==0);if(V&6)throw Error(i(327));if(t!==null){if(t===e.current)throw Error(i(177));if(o=t.lanes|t.childLanes,o|=oi,st(e,n,o,s,c,l),e===Wl&&(H=Wl=null,U=0),su=t,ou=e,cu=n,lu=o,uu=a,du=r,t.subtreeFlags&10256||t.flags&10256?(e.callbackNode=null,e.callbackPriority=0,Zu(ze,function(){return Wu(),null})):(e.callbackNode=null,e.callbackPriority=0),r=(t.flags&13878)!=0,t.subtreeFlags&13878||r){r=D.T,D.T=null,a=O.p,O.p=2,s=V,V|=4;try{fl(e,t,n)}finally{V=s,O.p=a,D.T=r}}au=1,zu(),Bu(),Vu()}}function zu(){if(au===1){au=0;var e=ou,t=su,n=(t.flags&13878)!=0;if(t.subtreeFlags&13878||n){n=D.T,D.T=null;var r=O.p;O.p=2;var i=V;V|=4;try{Tl(t,e);var a=zd,o=Pr(e.containerInfo),s=a.focusedElem,c=a.selectionRange;if(o!==s&&s&&s.ownerDocument&&Nr(s.ownerDocument.documentElement,s)){if(c!==null&&Fr(s)){var l=c.start,u=c.end;if(u===void 0&&(u=l),`selectionStart`in s)s.selectionStart=l,s.selectionEnd=Math.min(u,s.value.length);else{var d=s.ownerDocument||document,f=d&&d.defaultView||window;if(f.getSelection){var p=f.getSelection(),m=s.textContent.length,h=Math.min(c.start,m),g=c.end===void 0?h:Math.min(c.end,m);!p.extend&&h>g&&(o=g,g=h,h=o);var _=Mr(s,h),v=Mr(s,g);if(_&&v&&(p.rangeCount!==1||p.anchorNode!==_.node||p.anchorOffset!==_.offset||p.focusNode!==v.node||p.focusOffset!==v.offset)){var y=d.createRange();y.setStart(_.node,_.offset),p.removeAllRanges(),h>g?(p.addRange(y),p.extend(v.node,v.offset)):(y.setEnd(v.node,v.offset),p.addRange(y))}}}}for(d=[],p=s;p=p.parentNode;)p.nodeType===1&&d.push({element:p,left:p.scrollLeft,top:p.scrollTop});for(typeof s.focus==`function`&&s.focus(),s=0;s<d.length;s++){var b=d[s];b.element.scrollLeft=b.left,b.element.scrollTop=b.top}}sp=!!Rd,zd=Rd=null}finally{V=i,O.p=r,D.T=n}}e.current=t,au=2}}function Bu(){if(au===2){au=0;var e=ou,t=su,n=(t.flags&8772)!=0;if(t.subtreeFlags&8772||n){n=D.T,D.T=null;var r=O.p;O.p=2;var i=V;V|=4;try{pl(e,t.alternate,t)}finally{V=i,O.p=r,D.T=n}}au=3}}function Vu(){if(au===4||au===3){au=0,Pe();var e=ou,t=su,n=cu,r=du;t.subtreeFlags&10256||t.flags&10256?au=5:(au=0,su=ou=null,Hu(e,e.pendingLanes));var i=e.pendingLanes;if(i===0&&(iu=null),ft(n),t=t.stateNode,Ge&&typeof Ge.onCommitFiberRoot==`function`)try{Ge.onCommitFiberRoot(We,t,void 0,(t.current.flags&128)==128)}catch{}if(r!==null){t=D.T,i=O.p,O.p=2,D.T=null;try{for(var a=e.onRecoverableError,o=0;o<r.length;o++){var s=r[o];a(s.value,{componentStack:s.stack})}}finally{D.T=t,O.p=i}}cu&3&&Uu(),id(e),i=e.pendingLanes,n&261930&&i&42?e===pu?fu++:(fu=0,pu=e):fu=0,Z(0,!1)}}function Hu(e,t){(e.pooledCacheLanes&=t)===0&&(t=e.pooledCache,t!=null&&(e.pooledCache=null,pa(t)))}function Uu(){return zu(),Bu(),Vu(),Wu()}function Wu(){if(au!==5)return!1;var e=ou,t=lu;lu=0;var n=ft(cu),r=D.T,a=O.p;try{O.p=32>n?32:n,D.T=null,n=uu,uu=null;var o=ou,s=cu;if(au=0,su=ou=null,cu=0,V&6)throw Error(i(331));var c=V;if(V|=4,B(o.current),Nl(o,o.current,s,n),V=c,Z(0,!1),Ge&&typeof Ge.onPostCommitFiberRoot==`function`)try{Ge.onPostCommitFiberRoot(We,o)}catch{}return!0}finally{O.p=a,D.T=r,Hu(e,t)}}function Gu(e,t,n){t=Si(n,t),t=ic(e.stateNode,t,2),e=Ja(e,t,2),e!==null&&(ot(e,2),id(e))}function X(e,t,n){if(e.tag===3)Gu(e,e,n);else for(;t!==null;){if(t.tag===3){Gu(t,e,n);break}else if(t.tag===1){var r=t.stateNode;if(typeof t.type.getDerivedStateFromError==`function`||typeof r.componentDidCatch==`function`&&(iu===null||!iu.has(r))){e=Si(n,e),n=ac(2),r=Ja(t,n,2),r!==null&&(oc(n,r,t,e),ot(r,2),id(r));break}}t=t.return}}function Ku(e,t,n){var r=e.pingCache;if(r===null){r=e.pingCache=new Ul;var i=new Set;r.set(t,i)}else i=r.get(t),i===void 0&&(i=new Set,r.set(t,i));i.has(n)||(Jl=!0,i.add(n),e=qu.bind(null,e,t,n),t.then(e,e))}function qu(e,t,n){var r=e.pingCache;r!==null&&r.delete(t),e.pingedLanes|=e.suspendedLanes&n,e.warmLanes&=~n,Wl===e&&(U&n)===n&&(Xl===4||Xl===3&&(U&62914560)===U&&300>Fe()-tu?!(V&2)&&Cu(e,0):Ql|=n,q===U&&(q=0)),id(e)}function Ju(e,t){t===0&&(t=it()),e=li(e,t),e!==null&&(ot(e,t),id(e))}function Yu(e){var t=e.memoizedState,n=0;t!==null&&(n=t.retryLane),Ju(e,n)}function Xu(e,t){var n=0;switch(e.tag){case 31:case 13:var r=e.stateNode,a=e.memoizedState;a!==null&&(n=a.retryLane);break;case 19:r=e.stateNode;break;case 22:r=e.stateNode._retryCache;break;default:throw Error(i(314))}r!==null&&r.delete(t),Ju(e,n)}function Zu(e,t){return je(e,t)}var Qu=null,$u=null,ed=!1,td=!1,nd=!1,rd=0;function id(e){e!==$u&&e.next===null&&($u===null?Qu=$u=e:$u=$u.next=e),td=!0,ed||(ed=!0,ud())}function Z(e,t){if(!nd&&td){nd=!0;do for(var n=!1,r=Qu;r!==null;){if(!t)if(e!==0){var i=r.pendingLanes;if(i===0)var a=0;else{var o=r.suspendedLanes,s=r.pingedLanes;a=(1<<31-qe(42|e)+1)-1,a&=i&~(o&~s),a=a&201326741?a&201326741|1:a?a|2:0}a!==0&&(n=!0,ld(r,a))}else a=U,a=tt(r,r===Wl?a:0,r.cancelPendingCommit!==null||r.timeoutHandle!==-1),!(a&3)||nt(r,a)||(n=!0,ld(r,a));r=r.next}while(n);nd=!1}}function ad(){od()}function od(){td=ed=!1;var e=0;rd!==0&&Gd()&&(e=rd);for(var t=Fe(),n=null,r=Qu;r!==null;){var i=r.next,a=sd(r,t);a===0?(r.next=null,n===null?Qu=i:n.next=i,i===null&&($u=n)):(n=r,(e!==0||a&3)&&(td=!0)),r=i}au!==0&&au!==5||Z(e,!1),rd!==0&&(rd=0)}function sd(e,t){for(var n=e.suspendedLanes,r=e.pingedLanes,i=e.expirationTimes,a=e.pendingLanes&-62914561;0<a;){var o=31-qe(a),s=1<<o,c=i[o];c===-1?((s&n)===0||(s&r)!==0)&&(i[o]=rt(s,t)):c<=t&&(e.expiredLanes|=s),a&=~s}if(t=Wl,n=U,n=tt(e,e===t?n:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r=e.callbackNode,n===0||e===t&&(W===2||W===9)||e.cancelPendingCommit!==null)return r!==null&&r!==null&&Me(r),e.callbackNode=null,e.callbackPriority=0;if(!(n&3)||nt(e,n)){if(t=n&-n,t===e.callbackPriority)return t;switch(r!==null&&Me(r),ft(n)){case 2:case 8:n=Re;break;case 32:n=ze;break;case 268435456:n=Ve;break;default:n=ze}return r=cd.bind(null,e),n=je(n,r),e.callbackPriority=t,e.callbackNode=n,t}return r!==null&&r!==null&&Me(r),e.callbackPriority=2,e.callbackNode=null,2}function cd(e,t){if(au!==0&&au!==5)return e.callbackNode=null,e.callbackPriority=0,null;var n=e.callbackNode;if(Uu()&&e.callbackNode!==n)return null;var r=U;return r=tt(e,e===Wl?r:0,e.cancelPendingCommit!==null||e.timeoutHandle!==-1),r===0?null:(_u(e,r,t),sd(e,Fe()),e.callbackNode!=null&&e.callbackNode===n?cd.bind(null,e):null)}function ld(e,t){if(Uu())return null;_u(e,t,!0)}function ud(){Yd(function(){V&6?je(Le,ad):od()})}function dd(){if(rd===0){var e=ga;e===0&&(e=Ze,Ze<<=1,!(Ze&261888)&&(Ze=256)),rd=e}return rd}function fd(e){return e==null||typeof e==`symbol`||typeof e==`boolean`?null:typeof e==`function`?e:ln(``+e)}function pd(e,t){var n=t.ownerDocument.createElement(`input`);return n.name=t.name,n.value=t.value,e.id&&n.setAttribute(`form`,e.id),t.parentNode.insertBefore(n,t),e=new FormData(e),n.parentNode.removeChild(n),e}function md(e,t,n,r,i){if(t===`submit`&&n&&n.stateNode===i){var a=fd((i[_t]||null).action),o=r.submitter;o&&(t=(t=o[_t]||null)?fd(t.formAction):o.getAttribute(`formAction`),t!==null&&(a=t,o=null));var s=new On(`action`,`action`,null,r,i);e.push({event:s,listeners:[{instance:null,listener:function(){if(r.defaultPrevented){if(rd!==0){var e=o?pd(i,o):new FormData(i);As(n,{pending:!0,data:e,method:i.method,action:a},null,e)}}else typeof a==`function`&&(s.preventDefault(),e=o?pd(i,o):new FormData(i),As(n,{pending:!0,data:e,method:i.method,action:a},a,e))},currentTarget:i}]})}}for(var hd=0;hd<ti.length;hd++){var gd=ti[hd];ni(gd.toLowerCase(),`on`+(gd[0].toUpperCase()+gd.slice(1)))}ni(qr,`onAnimationEnd`),ni(Jr,`onAnimationIteration`),ni(Yr,`onAnimationStart`),ni(`dblclick`,`onDoubleClick`),ni(`focusin`,`onFocus`),ni(`focusout`,`onBlur`),ni(Xr,`onTransitionRun`),ni(Zr,`onTransitionStart`),ni(Qr,`onTransitionCancel`),ni($r,`onTransitionEnd`),Nt(`onMouseEnter`,[`mouseout`,`mouseover`]),Nt(`onMouseLeave`,[`mouseout`,`mouseover`]),Nt(`onPointerEnter`,[`pointerout`,`pointerover`]),Nt(`onPointerLeave`,[`pointerout`,`pointerover`]),Mt(`onChange`,`change click focusin focusout input keydown keyup selectionchange`.split(` `)),Mt(`onSelect`,`focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange`.split(` `)),Mt(`onBeforeInput`,[`compositionend`,`keypress`,`textInput`,`paste`]),Mt(`onCompositionEnd`,`compositionend focusout keydown keypress keyup mousedown`.split(` `)),Mt(`onCompositionStart`,`compositionstart focusout keydown keypress keyup mousedown`.split(` `)),Mt(`onCompositionUpdate`,`compositionupdate focusout keydown keypress keyup mousedown`.split(` `));var _d=`abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting`.split(` `),vd=new Set(`beforetoggle cancel close invalid load scroll scrollend toggle`.split(` `).concat(_d));function yd(e,t){t=(t&4)!=0;for(var n=0;n<e.length;n++){var r=e[n],i=r.event;r=r.listeners;a:{var a=void 0;if(t)for(var o=r.length-1;0<=o;o--){var s=r[o],c=s.instance,l=s.currentTarget;if(s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ri(e)}i.currentTarget=null,a=c}else for(o=0;o<r.length;o++){if(s=r[o],c=s.instance,l=s.currentTarget,s=s.listener,c!==a&&i.isPropagationStopped())break a;a=s,i.currentTarget=l;try{a(i)}catch(e){ri(e)}i.currentTarget=null,a=c}}}}function Q(e,t){var n=t[yt];n===void 0&&(n=t[yt]=new Set);var r=e+`__bubble`;n.has(r)||(Cd(t,e,2,!1),n.add(r))}function bd(e,t,n){var r=0;t&&(r|=4),Cd(n,e,r,t)}var xd=`_reactListening`+Math.random().toString(36).slice(2);function Sd(e){if(!e[xd]){e[xd]=!0,At.forEach(function(t){t!==`selectionchange`&&(vd.has(t)||bd(t,!1,e),bd(t,!0,e))});var t=e.nodeType===9?e:e.ownerDocument;t===null||t[xd]||(t[xd]=!0,bd(`selectionchange`,!1,t))}}function Cd(e,t,n,r){switch(mp(t)){case 2:var i=cp;break;case 8:i=lp;break;default:i=up}n=i.bind(null,t,n,e),i=void 0,!bn||t!==`touchstart`&&t!==`touchmove`&&t!==`wheel`||(i=!0),r?i===void 0?e.addEventListener(t,n,!0):e.addEventListener(t,n,{capture:!0,passive:i}):i===void 0?e.addEventListener(t,n,!1):e.addEventListener(t,n,{passive:i})}function wd(e,t,n,r,i){var a=r;if(!(t&1)&&!(t&2)&&r!==null)a:for(;;){if(r===null)return;var s=r.tag;if(s===3||s===4){var c=r.stateNode.containerInfo;if(c===i)break;if(s===4)for(s=r.return;s!==null;){var l=s.tag;if((l===3||l===4)&&s.stateNode.containerInfo===i)return;s=s.return}for(;c!==null;){if(s=Tt(c),s===null)return;if(l=s.tag,l===5||l===6||l===26||l===27){r=a=s;continue a}c=c.parentNode}}r=r.return}_n(function(){var r=a,i=fn(n),s=[];a:{var c=ei.get(e);if(c!==void 0){var l=On,u=e;switch(e){case`keypress`:if(Tn(n)===0)break a;case`keydown`:case`keyup`:l=Kn;break;case`focusin`:u=`focus`,l=Ln;break;case`focusout`:u=`blur`,l=Ln;break;case`beforeblur`:case`afterblur`:l=Ln;break;case`click`:if(n.button===2)break a;case`auxclick`:case`dblclick`:case`mousedown`:case`mousemove`:case`mouseup`:case`mouseout`:case`mouseover`:case`contextmenu`:l=Fn;break;case`drag`:case`dragend`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`dragstart`:case`drop`:l=In;break;case`touchcancel`:case`touchend`:case`touchmove`:case`touchstart`:l=Jn;break;case qr:case Jr:case Yr:l=Rn;break;case $r:l=Yn;break;case`scroll`:case`scrollend`:l=An;break;case`wheel`:l=Xn;break;case`copy`:case`cut`:case`paste`:l=zn;break;case`gotpointercapture`:case`lostpointercapture`:case`pointercancel`:case`pointerdown`:case`pointermove`:case`pointerout`:case`pointerover`:case`pointerup`:l=qn;break;case`toggle`:case`beforetoggle`:l=Zn}var d=(t&4)!=0,f=!d&&(e===`scroll`||e===`scrollend`),p=d?c===null?null:c+`Capture`:c;d=[];for(var m=r,h;m!==null;){var g=m;if(h=g.stateNode,g=g.tag,g!==5&&g!==26&&g!==27||h===null||p===null||(g=vn(m,p),g!=null&&d.push(Td(m,g,h))),f)break;m=m.return}0<d.length&&(c=new l(c,u,null,n,i),s.push({event:c,listeners:d}))}}if(!(t&7)){a:{if(c=e===`mouseover`||e===`pointerover`,l=e===`mouseout`||e===`pointerout`,c&&n!==dn&&(u=n.relatedTarget||n.fromElement)&&(Tt(u)||u[vt]))break a;if((l||c)&&(c=i.window===i?i:(c=i.ownerDocument)?c.defaultView||c.parentWindow:window,l?(u=n.relatedTarget||n.toElement,l=r,u=u?Tt(u):null,u!==null&&(f=o(u),d=u.tag,u!==f||d!==5&&d!==27&&d!==6)&&(u=null)):(l=null,u=r),l!==u)){if(d=Fn,g=`onMouseLeave`,p=`onMouseEnter`,m=`mouse`,(e===`pointerout`||e===`pointerover`)&&(d=qn,g=`onPointerLeave`,p=`onPointerEnter`,m=`pointer`),f=l==null?c:Dt(l),h=u==null?c:Dt(u),c=new d(g,m+`leave`,l,n,i),c.target=f,c.relatedTarget=h,g=null,Tt(i)===r&&(d=new d(p,m+`enter`,u,n,i),d.target=h,d.relatedTarget=f,g=d),f=g,l&&u)b:{for(d=Dd,p=l,m=u,h=0,g=p;g;g=d(g))h++;g=0;for(var _=m;_;_=d(_))g++;for(;0<h-g;)p=d(p),h--;for(;0<g-h;)m=d(m),g--;for(;h--;){if(p===m||m!==null&&p===m.alternate){d=p;break b}p=d(p),m=d(m)}d=null}else d=null;l!==null&&Od(s,c,l,d,!1),u!==null&&f!==null&&Od(s,f,u,d,!0)}}a:{if(c=r?Dt(r):window,l=c.nodeName&&c.nodeName.toLowerCase(),l===`select`||l===`input`&&c.type===`file`)var v=_r;else if(dr(c))if(vr)v=Dr;else{v=Tr;var y=wr}else l=c.nodeName,!l||l.toLowerCase()!==`input`||c.type!==`checkbox`&&c.type!==`radio`?r&&on(r.elementType)&&(v=_r):v=Er;if(v&&=v(e,r)){fr(s,v,n,i);break a}y&&y(e,c,r),e===`focusout`&&r&&c.type===`number`&&r.memoizedProps.value!=null&&Zt(c,`number`,c.value)}switch(y=r?Dt(r):window,e){case`focusin`:(dr(y)||y.contentEditable===`true`)&&(Lr=y,Rr=r,zr=null);break;case`focusout`:zr=Rr=Lr=null;break;case`mousedown`:Br=!0;break;case`contextmenu`:case`mouseup`:case`dragend`:Br=!1,Vr(s,n,i);break;case`selectionchange`:if(Ir)break;case`keydown`:case`keyup`:Vr(s,n,i)}var b;if($n)b:{switch(e){case`compositionstart`:var x=`onCompositionStart`;break b;case`compositionend`:x=`onCompositionEnd`;break b;case`compositionupdate`:x=`onCompositionUpdate`;break b}x=void 0}else sr?ar(e,n)&&(x=`onCompositionEnd`):e===`keydown`&&n.keyCode===229&&(x=`onCompositionStart`);x&&(nr&&n.locale!==`ko`&&(sr||x!==`onCompositionStart`?x===`onCompositionEnd`&&sr&&(b=wn()):(Sn=i,Cn=`value`in Sn?Sn.value:Sn.textContent,sr=!0)),y=Ed(r,x),0<y.length&&(x=new Bn(x,e,null,n,i),s.push({event:x,listeners:y}),b?x.data=b:(b=or(n),b!==null&&(x.data=b)))),(b=tr?cr(e,n):lr(e,n))&&(x=Ed(r,`onBeforeInput`),0<x.length&&(y=new Bn(`onBeforeInput`,`beforeinput`,null,n,i),s.push({event:y,listeners:x}),y.data=b)),md(s,e,r,n,i)}yd(s,t)})}function Td(e,t,n){return{instance:e,listener:t,currentTarget:n}}function Ed(e,t){for(var n=t+`Capture`,r=[];e!==null;){var i=e,a=i.stateNode;if(i=i.tag,i!==5&&i!==26&&i!==27||a===null||(i=vn(e,n),i!=null&&r.unshift(Td(e,i,a)),i=vn(e,t),i!=null&&r.push(Td(e,i,a))),e.tag===3)return r;e=e.return}return[]}function Dd(e){if(e===null)return null;do e=e.return;while(e&&e.tag!==5&&e.tag!==27);return e||null}function Od(e,t,n,r,i){for(var a=t._reactName,o=[];n!==null&&n!==r;){var s=n,c=s.alternate,l=s.stateNode;if(s=s.tag,c!==null&&c===r)break;s!==5&&s!==26&&s!==27||l===null||(c=l,i?(l=vn(n,a),l!=null&&o.unshift(Td(n,l,c))):i||(l=vn(n,a),l!=null&&o.push(Td(n,l,c)))),n=n.return}o.length!==0&&e.push({event:t,listeners:o})}var kd=/\r\n?/g,Ad=/\u0000|\uFFFD/g;function jd(e){return(typeof e==`string`?e:``+e).replace(kd,`
`).replace(Ad,``)}function Md(e,t){return t=jd(t),jd(e)===t}function $(e,t,n,r,a,o){switch(n){case`children`:typeof r==`string`?t===`body`||t===`textarea`&&r===``||tn(e,r):(typeof r==`number`||typeof r==`bigint`)&&t!==`body`&&tn(e,``+r);break;case`className`:zt(e,`class`,r);break;case`tabIndex`:zt(e,`tabindex`,r);break;case`dir`:case`role`:case`viewBox`:case`width`:case`height`:zt(e,n,r);break;case`style`:an(e,r,o);break;case`data`:if(t!==`object`){zt(e,`data`,r);break}case`src`:case`href`:if(r===``&&(t!==`a`||n!==`href`)){e.removeAttribute(n);break}if(r==null||typeof r==`function`||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=ln(``+r),e.setAttribute(n,r);break;case`action`:case`formAction`:if(typeof r==`function`){e.setAttribute(n,`javascript:throw new Error('A React form was unexpectedly submitted. If you called form.submit() manually, consider using form.requestSubmit() instead. If you\\'re trying to use event.stopPropagation() in a submit event handler, consider also calling event.preventDefault().')`);break}else typeof o==`function`&&(n===`formAction`?(t!==`input`&&$(e,t,`name`,a.name,a,null),$(e,t,`formEncType`,a.formEncType,a,null),$(e,t,`formMethod`,a.formMethod,a,null),$(e,t,`formTarget`,a.formTarget,a,null)):($(e,t,`encType`,a.encType,a,null),$(e,t,`method`,a.method,a,null),$(e,t,`target`,a.target,a,null)));if(r==null||typeof r==`symbol`||typeof r==`boolean`){e.removeAttribute(n);break}r=ln(``+r),e.setAttribute(n,r);break;case`onClick`:r!=null&&(e.onclick=un);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`multiple`:e.multiple=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`muted`:e.muted=r&&typeof r!=`function`&&typeof r!=`symbol`;break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`defaultValue`:case`defaultChecked`:case`innerHTML`:case`ref`:break;case`autoFocus`:break;case`xlinkHref`:if(r==null||typeof r==`function`||typeof r==`boolean`||typeof r==`symbol`){e.removeAttribute(`xlink:href`);break}n=ln(``+r),e.setAttributeNS(`http://www.w3.org/1999/xlink`,`xlink:href`,n);break;case`contentEditable`:case`spellCheck`:case`draggable`:case`value`:case`autoReverse`:case`externalResourcesRequired`:case`focusable`:case`preserveAlpha`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``+r):e.removeAttribute(n);break;case`inert`:case`allowFullScreen`:case`async`:case`autoPlay`:case`controls`:case`default`:case`defer`:case`disabled`:case`disablePictureInPicture`:case`disableRemotePlayback`:case`formNoValidate`:case`hidden`:case`loop`:case`noModule`:case`noValidate`:case`open`:case`playsInline`:case`readOnly`:case`required`:case`reversed`:case`scoped`:case`seamless`:case`itemScope`:r&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,``):e.removeAttribute(n);break;case`capture`:case`download`:!0===r?e.setAttribute(n,``):!1!==r&&r!=null&&typeof r!=`function`&&typeof r!=`symbol`?e.setAttribute(n,r):e.removeAttribute(n);break;case`cols`:case`rows`:case`size`:case`span`:r!=null&&typeof r!=`function`&&typeof r!=`symbol`&&!isNaN(r)&&1<=r?e.setAttribute(n,r):e.removeAttribute(n);break;case`rowSpan`:case`start`:r==null||typeof r==`function`||typeof r==`symbol`||isNaN(r)?e.removeAttribute(n):e.setAttribute(n,r);break;case`popover`:Q(`beforetoggle`,e),Q(`toggle`,e),Rt(e,`popover`,r);break;case`xlinkActuate`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:actuate`,r);break;case`xlinkArcrole`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:arcrole`,r);break;case`xlinkRole`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:role`,r);break;case`xlinkShow`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:show`,r);break;case`xlinkTitle`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:title`,r);break;case`xlinkType`:Bt(e,`http://www.w3.org/1999/xlink`,`xlink:type`,r);break;case`xmlBase`:Bt(e,`http://www.w3.org/XML/1998/namespace`,`xml:base`,r);break;case`xmlLang`:Bt(e,`http://www.w3.org/XML/1998/namespace`,`xml:lang`,r);break;case`xmlSpace`:Bt(e,`http://www.w3.org/XML/1998/namespace`,`xml:space`,r);break;case`is`:Rt(e,`is`,r);break;case`innerText`:case`textContent`:break;default:(!(2<n.length)||n[0]!==`o`&&n[0]!==`O`||n[1]!==`n`&&n[1]!==`N`)&&(n=sn.get(n)||n,Rt(e,n,r))}}function Nd(e,t,n,r,a,o){switch(n){case`style`:an(e,r,o);break;case`dangerouslySetInnerHTML`:if(r!=null){if(typeof r!=`object`||!(`__html`in r))throw Error(i(61));if(n=r.__html,n!=null){if(a.children!=null)throw Error(i(60));e.innerHTML=n}}break;case`children`:typeof r==`string`?tn(e,r):(typeof r==`number`||typeof r==`bigint`)&&tn(e,``+r);break;case`onScroll`:r!=null&&Q(`scroll`,e);break;case`onScrollEnd`:r!=null&&Q(`scrollend`,e);break;case`onClick`:r!=null&&(e.onclick=un);break;case`suppressContentEditableWarning`:case`suppressHydrationWarning`:case`innerHTML`:case`ref`:break;case`innerText`:case`textContent`:break;default:if(!jt.hasOwnProperty(n))a:{if(n[0]===`o`&&n[1]===`n`&&(a=n.endsWith(`Capture`),t=n.slice(2,a?n.length-7:void 0),o=e[_t]||null,o=o==null?null:o[n],typeof o==`function`&&e.removeEventListener(t,o,a),typeof r==`function`)){typeof o!=`function`&&o!==null&&(n in e?e[n]=null:e.hasAttribute(n)&&e.removeAttribute(n)),e.addEventListener(t,r,a);break a}n in e?e[n]=r:!0===r?e.setAttribute(n,``):Rt(e,n,r)}}}function Pd(e,t,n){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`img`:Q(`error`,e),Q(`load`,e);var r=!1,a=!1,o;for(o in n)if(n.hasOwnProperty(o)){var s=n[o];if(s!=null)switch(o){case`src`:r=!0;break;case`srcSet`:a=!0;break;case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,o,s,n,null)}}a&&$(e,t,`srcSet`,n.srcSet,n,null),r&&$(e,t,`src`,n.src,n,null);return;case`input`:Q(`invalid`,e);var c=o=s=a=null,l=null,u=null;for(r in n)if(n.hasOwnProperty(r)){var d=n[r];if(d!=null)switch(r){case`name`:a=d;break;case`type`:s=d;break;case`checked`:l=d;break;case`defaultChecked`:u=d;break;case`value`:o=d;break;case`defaultValue`:c=d;break;case`children`:case`dangerouslySetInnerHTML`:if(d!=null)throw Error(i(137,t));break;default:$(e,t,r,d,n,null)}}Xt(e,o,c,l,u,s,a,!1);return;case`select`:for(a in Q(`invalid`,e),r=s=o=null,n)if(n.hasOwnProperty(a)&&(c=n[a],c!=null))switch(a){case`value`:o=c;break;case`defaultValue`:s=c;break;case`multiple`:r=c;default:$(e,t,a,c,n,null)}t=o,n=s,e.multiple=!!r,t==null?n!=null&&Qt(e,!!r,n,!0):Qt(e,!!r,t,!1);return;case`textarea`:for(s in Q(`invalid`,e),o=a=r=null,n)if(n.hasOwnProperty(s)&&(c=n[s],c!=null))switch(s){case`value`:r=c;break;case`defaultValue`:a=c;break;case`children`:o=c;break;case`dangerouslySetInnerHTML`:if(c!=null)throw Error(i(91));break;default:$(e,t,s,c,n,null)}en(e,r,a,o);return;case`option`:for(l in n)if(n.hasOwnProperty(l)&&(r=n[l],r!=null))switch(l){case`selected`:e.selected=r&&typeof r!=`function`&&typeof r!=`symbol`;break;default:$(e,t,l,r,n,null)}return;case`dialog`:Q(`beforetoggle`,e),Q(`toggle`,e),Q(`cancel`,e),Q(`close`,e);break;case`iframe`:case`object`:Q(`load`,e);break;case`video`:case`audio`:for(r=0;r<_d.length;r++)Q(_d[r],e);break;case`image`:Q(`error`,e),Q(`load`,e);break;case`details`:Q(`toggle`,e);break;case`embed`:case`source`:case`link`:Q(`error`,e),Q(`load`,e);case`area`:case`base`:case`br`:case`col`:case`hr`:case`keygen`:case`meta`:case`param`:case`track`:case`wbr`:case`menuitem`:for(u in n)if(n.hasOwnProperty(u)&&(r=n[u],r!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:throw Error(i(137,t));default:$(e,t,u,r,n,null)}return;default:if(on(t)){for(d in n)n.hasOwnProperty(d)&&(r=n[d],r!==void 0&&Nd(e,t,d,r,n,void 0));return}}for(c in n)n.hasOwnProperty(c)&&(r=n[c],r!=null&&$(e,t,c,r,n,null))}function Fd(e,t,n,r){switch(t){case`div`:case`span`:case`svg`:case`path`:case`a`:case`g`:case`p`:case`li`:break;case`input`:var a=null,o=null,s=null,c=null,l=null,u=null,d=null;for(m in n){var f=n[m];if(n.hasOwnProperty(m)&&f!=null)switch(m){case`checked`:break;case`value`:break;case`defaultValue`:l=f;default:r.hasOwnProperty(m)||$(e,t,m,null,r,f)}}for(var p in r){var m=r[p];if(f=n[p],r.hasOwnProperty(p)&&(m!=null||f!=null))switch(p){case`type`:o=m;break;case`name`:a=m;break;case`checked`:u=m;break;case`defaultChecked`:d=m;break;case`value`:s=m;break;case`defaultValue`:c=m;break;case`children`:case`dangerouslySetInnerHTML`:if(m!=null)throw Error(i(137,t));break;default:m!==f&&$(e,t,p,m,r,f)}}Yt(e,s,c,l,u,d,o,a);return;case`select`:for(o in m=s=c=p=null,n)if(l=n[o],n.hasOwnProperty(o)&&l!=null)switch(o){case`value`:break;case`multiple`:m=l;default:r.hasOwnProperty(o)||$(e,t,o,null,r,l)}for(a in r)if(o=r[a],l=n[a],r.hasOwnProperty(a)&&(o!=null||l!=null))switch(a){case`value`:p=o;break;case`defaultValue`:c=o;break;case`multiple`:s=o;default:o!==l&&$(e,t,a,o,r,l)}t=c,n=s,r=m,p==null?!!r!=!!n&&(t==null?Qt(e,!!n,n?[]:``,!1):Qt(e,!!n,t,!0)):Qt(e,!!n,p,!1);return;case`textarea`:for(c in m=p=null,n)if(a=n[c],n.hasOwnProperty(c)&&a!=null&&!r.hasOwnProperty(c))switch(c){case`value`:break;case`children`:break;default:$(e,t,c,null,r,a)}for(s in r)if(a=r[s],o=n[s],r.hasOwnProperty(s)&&(a!=null||o!=null))switch(s){case`value`:p=a;break;case`defaultValue`:m=a;break;case`children`:break;case`dangerouslySetInnerHTML`:if(a!=null)throw Error(i(91));break;default:a!==o&&$(e,t,s,a,r,o)}$t(e,p,m);return;case`option`:for(var h in n)if(p=n[h],n.hasOwnProperty(h)&&p!=null&&!r.hasOwnProperty(h))switch(h){case`selected`:e.selected=!1;break;default:$(e,t,h,null,r,p)}for(l in r)if(p=r[l],m=n[l],r.hasOwnProperty(l)&&p!==m&&(p!=null||m!=null))switch(l){case`selected`:e.selected=p&&typeof p!=`function`&&typeof p!=`symbol`;break;default:$(e,t,l,p,r,m)}return;case`img`:case`link`:case`area`:case`base`:case`br`:case`col`:case`embed`:case`hr`:case`keygen`:case`meta`:case`param`:case`source`:case`track`:case`wbr`:case`menuitem`:for(var g in n)p=n[g],n.hasOwnProperty(g)&&p!=null&&!r.hasOwnProperty(g)&&$(e,t,g,null,r,p);for(u in r)if(p=r[u],m=n[u],r.hasOwnProperty(u)&&p!==m&&(p!=null||m!=null))switch(u){case`children`:case`dangerouslySetInnerHTML`:if(p!=null)throw Error(i(137,t));break;default:$(e,t,u,p,r,m)}return;default:if(on(t)){for(var _ in n)p=n[_],n.hasOwnProperty(_)&&p!==void 0&&!r.hasOwnProperty(_)&&Nd(e,t,_,void 0,r,p);for(d in r)p=r[d],m=n[d],!r.hasOwnProperty(d)||p===m||p===void 0&&m===void 0||Nd(e,t,d,p,r,m);return}}for(var v in n)p=n[v],n.hasOwnProperty(v)&&p!=null&&!r.hasOwnProperty(v)&&$(e,t,v,null,r,p);for(f in r)p=r[f],m=n[f],!r.hasOwnProperty(f)||p===m||p==null&&m==null||$(e,t,f,p,r,m)}function Id(e){switch(e){case`css`:case`script`:case`font`:case`img`:case`image`:case`input`:case`link`:return!0;default:return!1}}function Ld(){if(typeof performance.getEntriesByType==`function`){for(var e=0,t=0,n=performance.getEntriesByType(`resource`),r=0;r<n.length;r++){var i=n[r],a=i.transferSize,o=i.initiatorType,s=i.duration;if(a&&s&&Id(o)){for(o=0,s=i.responseEnd,r+=1;r<n.length;r++){var c=n[r],l=c.startTime;if(l>s)break;var u=c.transferSize,d=c.initiatorType;u&&Id(d)&&(c=c.responseEnd,o+=u*(c<s?1:(s-l)/(c-l)))}if(--r,t+=8*(a+o)/(i.duration/1e3),e++,10<e)break}}if(0<e)return t/e/1e6}return navigator.connection&&(e=navigator.connection.downlink,typeof e==`number`)?e:5}var Rd=null,zd=null;function Bd(e){return e.nodeType===9?e:e.ownerDocument}function Vd(e){switch(e){case`http://www.w3.org/2000/svg`:return 1;case`http://www.w3.org/1998/Math/MathML`:return 2;default:return 0}}function Hd(e,t){if(e===0)switch(t){case`svg`:return 1;case`math`:return 2;default:return 0}return e===1&&t===`foreignObject`?0:e}function Ud(e,t){return e===`textarea`||e===`noscript`||typeof t.children==`string`||typeof t.children==`number`||typeof t.children==`bigint`||typeof t.dangerouslySetInnerHTML==`object`&&t.dangerouslySetInnerHTML!==null&&t.dangerouslySetInnerHTML.__html!=null}var Wd=null;function Gd(){var e=window.event;return e&&e.type===`popstate`?e===Wd?!1:(Wd=e,!0):(Wd=null,!1)}var Kd=typeof setTimeout==`function`?setTimeout:void 0,qd=typeof clearTimeout==`function`?clearTimeout:void 0,Jd=typeof Promise==`function`?Promise:void 0,Yd=typeof queueMicrotask==`function`?queueMicrotask:Jd===void 0?Kd:function(e){return Jd.resolve(null).then(e).catch(Xd)};function Xd(e){setTimeout(function(){throw e})}function Zd(e){return e===`head`}function Qd(e,t){var n=t,r=0;do{var i=n.nextSibling;if(e.removeChild(n),i&&i.nodeType===8)if(n=i.data,n===`/$`||n===`/&`){if(r===0){e.removeChild(i),Np(t);return}r--}else if(n===`$`||n===`$?`||n===`$~`||n===`$!`||n===`&`)r++;else if(n===`html`)pf(e.ownerDocument.documentElement);else if(n===`head`){n=e.ownerDocument.head,pf(n);for(var a=n.firstChild;a;){var o=a.nextSibling,s=a.nodeName;a[Ct]||s===`SCRIPT`||s===`STYLE`||s===`LINK`&&a.rel.toLowerCase()===`stylesheet`||n.removeChild(a),a=o}}else n===`body`&&pf(e.ownerDocument.body);n=i}while(n);Np(t)}function $d(e,t){var n=e;e=0;do{var r=n.nextSibling;if(n.nodeType===1?t?(n._stashedDisplay=n.style.display,n.style.display=`none`):(n.style.display=n._stashedDisplay||``,n.getAttribute(`style`)===``&&n.removeAttribute(`style`)):n.nodeType===3&&(t?(n._stashedText=n.nodeValue,n.nodeValue=``):n.nodeValue=n._stashedText||``),r&&r.nodeType===8)if(n=r.data,n===`/$`){if(e===0)break;e--}else n!==`$`&&n!==`$?`&&n!==`$~`&&n!==`$!`||e++;n=r}while(n)}function ef(e){var t=e.firstChild;for(t&&t.nodeType===10&&(t=t.nextSibling);t;){var n=t;switch(t=t.nextSibling,n.nodeName){case`HTML`:case`HEAD`:case`BODY`:ef(n),wt(n);continue;case`SCRIPT`:case`STYLE`:continue;case`LINK`:if(n.rel.toLowerCase()===`stylesheet`)continue}e.removeChild(n)}}function tf(e,t,n,r){for(;e.nodeType===1;){var i=n;if(e.nodeName.toLowerCase()!==t.toLowerCase()){if(!r&&(e.nodeName!==`INPUT`||e.type!==`hidden`))break}else if(!r)if(t===`input`&&e.type===`hidden`){var a=i.name==null?null:``+i.name;if(i.type===`hidden`&&e.getAttribute(`name`)===a)return e}else return e;else if(!e[Ct])switch(t){case`meta`:if(!e.hasAttribute(`itemprop`))break;return e;case`link`:if(a=e.getAttribute(`rel`),a===`stylesheet`&&e.hasAttribute(`data-precedence`)||a!==i.rel||e.getAttribute(`href`)!==(i.href==null||i.href===``?null:i.href)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin)||e.getAttribute(`title`)!==(i.title==null?null:i.title))break;return e;case`style`:if(e.hasAttribute(`data-precedence`))break;return e;case`script`:if(a=e.getAttribute(`src`),(a!==(i.src==null?null:i.src)||e.getAttribute(`type`)!==(i.type==null?null:i.type)||e.getAttribute(`crossorigin`)!==(i.crossOrigin==null?null:i.crossOrigin))&&a&&e.hasAttribute(`async`)&&!e.hasAttribute(`itemprop`))break;return e;default:return e}if(e=cf(e.nextSibling),e===null)break}return null}function nf(e,t,n){if(t===``)return null;for(;e.nodeType!==3;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!n||(e=cf(e.nextSibling),e===null))return null;return e}function rf(e,t){for(;e.nodeType!==8;)if((e.nodeType!==1||e.nodeName!==`INPUT`||e.type!==`hidden`)&&!t||(e=cf(e.nextSibling),e===null))return null;return e}function af(e){return e.data===`$?`||e.data===`$~`}function of(e){return e.data===`$!`||e.data===`$?`&&e.ownerDocument.readyState!==`loading`}function sf(e,t){var n=e.ownerDocument;if(e.data===`$~`)e._reactRetry=t;else if(e.data!==`$?`||n.readyState!==`loading`)t();else{var r=function(){t(),n.removeEventListener(`DOMContentLoaded`,r)};n.addEventListener(`DOMContentLoaded`,r),e._reactRetry=r}}function cf(e){for(;e!=null;e=e.nextSibling){var t=e.nodeType;if(t===1||t===3)break;if(t===8){if(t=e.data,t===`$`||t===`$!`||t===`$?`||t===`$~`||t===`&`||t===`F!`||t===`F`)break;if(t===`/$`||t===`/&`)return null}}return e}var lf=null;function uf(e){e=e.nextSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`/$`||n===`/&`){if(t===0)return cf(e.nextSibling);t--}else n!==`$`&&n!==`$!`&&n!==`$?`&&n!==`$~`&&n!==`&`||t++}e=e.nextSibling}return null}function df(e){e=e.previousSibling;for(var t=0;e;){if(e.nodeType===8){var n=e.data;if(n===`$`||n===`$!`||n===`$?`||n===`$~`||n===`&`){if(t===0)return e;t--}else n!==`/$`&&n!==`/&`||t++}e=e.previousSibling}return null}function ff(e,t,n){switch(t=Bd(n),e){case`html`:if(e=t.documentElement,!e)throw Error(i(452));return e;case`head`:if(e=t.head,!e)throw Error(i(453));return e;case`body`:if(e=t.body,!e)throw Error(i(454));return e;default:throw Error(i(451))}}function pf(e){for(var t=e.attributes;t.length;)e.removeAttributeNode(t[0]);wt(e)}var mf=new Map,hf=new Set;function gf(e){return typeof e.getRootNode==`function`?e.getRootNode():e.nodeType===9?e:e.ownerDocument}var _f=O.d;O.d={f:vf,r:yf,D:Sf,C:Cf,L:wf,m:Tf,X:Df,S:Ef,M:Of};function vf(){var e=_f.f(),t=xu();return e||t}function yf(e){var t=Et(e);t!==null&&t.tag===5&&t.type===`form`?Ms(t):_f.r(e)}var bf=typeof document>`u`?null:document;function xf(e,t,n){var r=bf;if(r&&typeof t==`string`&&t){var i=Jt(t);i=`link[rel="`+e+`"][href="`+i+`"]`,typeof n==`string`&&(i+=`[crossorigin="`+n+`"]`),hf.has(i)||(hf.add(i),e={rel:e,crossOrigin:n,href:t},r.querySelector(i)===null&&(t=r.createElement(`link`),Pd(t,`link`,e),kt(t),r.head.appendChild(t)))}}function Sf(e){_f.D(e),xf(`dns-prefetch`,e,null)}function Cf(e,t){_f.C(e,t),xf(`preconnect`,e,t)}function wf(e,t,n){_f.L(e,t,n);var r=bf;if(r&&e&&t){var i=`link[rel="preload"][as="`+Jt(t)+`"]`;t===`image`&&n&&n.imageSrcSet?(i+=`[imagesrcset="`+Jt(n.imageSrcSet)+`"]`,typeof n.imageSizes==`string`&&(i+=`[imagesizes="`+Jt(n.imageSizes)+`"]`)):i+=`[href="`+Jt(e)+`"]`;var a=i;switch(t){case`style`:a=Af(e);break;case`script`:a=Pf(e)}mf.has(a)||(e=m({rel:`preload`,href:t===`image`&&n&&n.imageSrcSet?void 0:e,as:t},n),mf.set(a,e),r.querySelector(i)!==null||t===`style`&&r.querySelector(jf(a))||t===`script`&&r.querySelector(Ff(a))||(t=r.createElement(`link`),Pd(t,`link`,e),kt(t),r.head.appendChild(t)))}}function Tf(e,t){_f.m(e,t);var n=bf;if(n&&e){var r=t&&typeof t.as==`string`?t.as:`script`,i=`link[rel="modulepreload"][as="`+Jt(r)+`"][href="`+Jt(e)+`"]`,a=i;switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:a=Pf(e)}if(!mf.has(a)&&(e=m({rel:`modulepreload`,href:e},t),mf.set(a,e),n.querySelector(i)===null)){switch(r){case`audioworklet`:case`paintworklet`:case`serviceworker`:case`sharedworker`:case`worker`:case`script`:if(n.querySelector(Ff(a)))return}r=n.createElement(`link`),Pd(r,`link`,e),kt(r),n.head.appendChild(r)}}}function Ef(e,t,n){_f.S(e,t,n);var r=bf;if(r&&e){var i=Ot(r).hoistableStyles,a=Af(e);t||=`default`;var o=i.get(a);if(!o){var s={loading:0,preload:null};if(o=r.querySelector(jf(a)))s.loading=5;else{e=m({rel:`stylesheet`,href:e,"data-precedence":t},n),(n=mf.get(a))&&Rf(e,n);var c=o=r.createElement(`link`);kt(c),Pd(c,`link`,e),c._p=new Promise(function(e,t){c.onload=e,c.onerror=t}),c.addEventListener(`load`,function(){s.loading|=1}),c.addEventListener(`error`,function(){s.loading|=2}),s.loading|=4,Lf(o,t,r)}o={type:`stylesheet`,instance:o,count:1,state:s},i.set(a,o)}}}function Df(e,t){_f.X(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),kt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function Of(e,t){_f.M(e,t);var n=bf;if(n&&e){var r=Ot(n).hoistableScripts,i=Pf(e),a=r.get(i);a||(a=n.querySelector(Ff(i)),a||(e=m({src:e,async:!0,type:`module`},t),(t=mf.get(i))&&zf(e,t),a=n.createElement(`script`),kt(a),Pd(a,`link`,e),n.head.appendChild(a)),a={type:`script`,instance:a,count:1,state:null},r.set(i,a))}}function kf(e,t,n,r){var a=(a=_e.current)?gf(a):null;if(!a)throw Error(i(446));switch(e){case`meta`:case`title`:return null;case`style`:return typeof n.precedence==`string`&&typeof n.href==`string`?(t=Af(n.href),n=Ot(a).hoistableStyles,r=n.get(t),r||(r={type:`style`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};case`link`:if(n.rel===`stylesheet`&&typeof n.href==`string`&&typeof n.precedence==`string`){e=Af(n.href);var o=Ot(a).hoistableStyles,s=o.get(e);if(s||(a=a.ownerDocument||a,s={type:`stylesheet`,instance:null,count:0,state:{loading:0,preload:null}},o.set(e,s),(o=a.querySelector(jf(e)))&&!o._p&&(s.instance=o,s.state.loading=5),mf.has(e)||(n={rel:`preload`,as:`style`,href:n.href,crossOrigin:n.crossOrigin,integrity:n.integrity,media:n.media,hrefLang:n.hrefLang,referrerPolicy:n.referrerPolicy},mf.set(e,n),o||Nf(a,e,n,s.state))),t&&r===null)throw Error(i(528,``));return s}if(t&&r!==null)throw Error(i(529,``));return null;case`script`:return t=n.async,n=n.src,typeof n==`string`&&t&&typeof t!=`function`&&typeof t!=`symbol`?(t=Pf(n),n=Ot(a).hoistableScripts,r=n.get(t),r||(r={type:`script`,instance:null,count:0,state:null},n.set(t,r)),r):{type:`void`,instance:null,count:0,state:null};default:throw Error(i(444,e))}}function Af(e){return`href="`+Jt(e)+`"`}function jf(e){return`link[rel="stylesheet"][`+e+`]`}function Mf(e){return m({},e,{"data-precedence":e.precedence,precedence:null})}function Nf(e,t,n,r){e.querySelector(`link[rel="preload"][as="style"][`+t+`]`)?r.loading=1:(t=e.createElement(`link`),r.preload=t,t.addEventListener(`load`,function(){return r.loading|=1}),t.addEventListener(`error`,function(){return r.loading|=2}),Pd(t,`link`,n),kt(t),e.head.appendChild(t))}function Pf(e){return`[src="`+Jt(e)+`"]`}function Ff(e){return`script[async]`+e}function If(e,t,n){if(t.count++,t.instance===null)switch(t.type){case`style`:var r=e.querySelector(`style[data-href~="`+Jt(n.href)+`"]`);if(r)return t.instance=r,kt(r),r;var a=m({},n,{"data-href":n.href,"data-precedence":n.precedence,href:null,precedence:null});return r=(e.ownerDocument||e).createElement(`style`),kt(r),Pd(r,`style`,a),Lf(r,n.precedence,e),t.instance=r;case`stylesheet`:a=Af(n.href);var o=e.querySelector(jf(a));if(o)return t.state.loading|=4,t.instance=o,kt(o),o;r=Mf(n),(a=mf.get(a))&&Rf(r,a),o=(e.ownerDocument||e).createElement(`link`),kt(o);var s=o;return s._p=new Promise(function(e,t){s.onload=e,s.onerror=t}),Pd(o,`link`,r),t.state.loading|=4,Lf(o,n.precedence,e),t.instance=o;case`script`:return o=Pf(n.src),(a=e.querySelector(Ff(o)))?(t.instance=a,kt(a),a):(r=n,(a=mf.get(o))&&(r=m({},n),zf(r,a)),e=e.ownerDocument||e,a=e.createElement(`script`),kt(a),Pd(a,`link`,r),e.head.appendChild(a),t.instance=a);case`void`:return null;default:throw Error(i(443,t.type))}else t.type===`stylesheet`&&!(t.state.loading&4)&&(r=t.instance,t.state.loading|=4,Lf(r,n.precedence,e));return t.instance}function Lf(e,t,n){for(var r=n.querySelectorAll(`link[rel="stylesheet"][data-precedence],style[data-precedence]`),i=r.length?r[r.length-1]:null,a=i,o=0;o<r.length;o++){var s=r[o];if(s.dataset.precedence===t)a=s;else if(a!==i)break}a?a.parentNode.insertBefore(e,a.nextSibling):(t=n.nodeType===9?n.head:n,t.insertBefore(e,t.firstChild))}function Rf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.title??=t.title}function zf(e,t){e.crossOrigin??=t.crossOrigin,e.referrerPolicy??=t.referrerPolicy,e.integrity??=t.integrity}var Bf=null;function Vf(e,t,n){if(Bf===null){var r=new Map,i=Bf=new Map;i.set(n,r)}else i=Bf,r=i.get(n),r||(r=new Map,i.set(n,r));if(r.has(e))return r;for(r.set(e,null),n=n.getElementsByTagName(e),i=0;i<n.length;i++){var a=n[i];if(!(a[Ct]||a[gt]||e===`link`&&a.getAttribute(`rel`)===`stylesheet`)&&a.namespaceURI!==`http://www.w3.org/2000/svg`){var o=a.getAttribute(t)||``;o=e+o;var s=r.get(o);s?s.push(a):r.set(o,[a])}}return r}function Hf(e,t,n){e=e.ownerDocument||e,e.head.insertBefore(n,t===`title`?e.querySelector(`head > title`):null)}function Uf(e,t,n){if(n===1||t.itemProp!=null)return!1;switch(e){case`meta`:case`title`:return!0;case`style`:if(typeof t.precedence!=`string`||typeof t.href!=`string`||t.href===``)break;return!0;case`link`:if(typeof t.rel!=`string`||typeof t.href!=`string`||t.href===``||t.onLoad||t.onError)break;switch(t.rel){case`stylesheet`:return e=t.disabled,typeof t.precedence==`string`&&e==null;default:return!0}case`script`:if(t.async&&typeof t.async!=`function`&&typeof t.async!=`symbol`&&!t.onLoad&&!t.onError&&t.src&&typeof t.src==`string`)return!0}return!1}function Wf(e){return!(e.type===`stylesheet`&&!(e.state.loading&3))}function Gf(e,t,n,r){if(n.type===`stylesheet`&&(typeof r.media!=`string`||!1!==matchMedia(r.media).matches)&&!(n.state.loading&4)){if(n.instance===null){var i=Af(r.href),a=t.querySelector(jf(i));if(a){t=a._p,typeof t==`object`&&t&&typeof t.then==`function`&&(e.count++,e=Jf.bind(e),t.then(e,e)),n.state.loading|=4,n.instance=a,kt(a);return}a=t.ownerDocument||t,r=Mf(r),(i=mf.get(i))&&Rf(r,i),a=a.createElement(`link`),kt(a);var o=a;o._p=new Promise(function(e,t){o.onload=e,o.onerror=t}),Pd(a,`link`,r),n.instance=a}e.stylesheets===null&&(e.stylesheets=new Map),e.stylesheets.set(n,t),(t=n.state.preload)&&!(n.state.loading&3)&&(e.count++,n=Jf.bind(e),t.addEventListener(`load`,n),t.addEventListener(`error`,n))}}var Kf=0;function qf(e,t){return e.stylesheets&&e.count===0&&Xf(e,e.stylesheets),0<e.count||0<e.imgCount?function(n){var r=setTimeout(function(){if(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend){var t=e.unsuspend;e.unsuspend=null,t()}},6e4+t);0<e.imgBytes&&Kf===0&&(Kf=62500*Ld());var i=setTimeout(function(){if(e.waitingForImages=!1,e.count===0&&(e.stylesheets&&Xf(e,e.stylesheets),e.unsuspend)){var t=e.unsuspend;e.unsuspend=null,t()}},(e.imgBytes>Kf?50:800)+t);return e.unsuspend=n,function(){e.unsuspend=null,clearTimeout(r),clearTimeout(i)}}:null}function Jf(){if(this.count--,this.count===0&&(this.imgCount===0||!this.waitingForImages)){if(this.stylesheets)Xf(this,this.stylesheets);else if(this.unsuspend){var e=this.unsuspend;this.unsuspend=null,e()}}}var Yf=null;function Xf(e,t){e.stylesheets=null,e.unsuspend!==null&&(e.count++,Yf=new Map,t.forEach(Zf,e),Yf=null,Jf.call(e))}function Zf(e,t){if(!(t.state.loading&4)){var n=Yf.get(e);if(n)var r=n.get(null);else{n=new Map,Yf.set(e,n);for(var i=e.querySelectorAll(`link[data-precedence],style[data-precedence]`),a=0;a<i.length;a++){var o=i[a];(o.nodeName===`LINK`||o.getAttribute(`media`)!==`not all`)&&(n.set(o.dataset.precedence,o),r=o)}r&&n.set(null,r)}i=t.instance,o=i.getAttribute(`data-precedence`),a=n.get(o)||r,a===r&&n.set(null,i),n.set(o,i),this.count++,r=Jf.bind(this),i.addEventListener(`load`,r),i.addEventListener(`error`,r),a?a.parentNode.insertBefore(i,a.nextSibling):(e=e.nodeType===9?e.head:e,e.insertBefore(i,e.firstChild)),t.state.loading|=4}}var Qf={$$typeof:S,Provider:null,Consumer:null,_currentValue:le,_currentValue2:le,_threadCount:0};function $f(e,t,n,r,i,a,o,s,c){this.tag=1,this.containerInfo=e,this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.next=this.pendingContext=this.context=this.cancelPendingCommit=null,this.callbackPriority=0,this.expirationTimes=at(-1),this.entangledLanes=this.shellSuspendCounter=this.errorRecoveryDisabledLanes=this.expiredLanes=this.warmLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=at(0),this.hiddenUpdates=at(null),this.identifierPrefix=r,this.onUncaughtError=i,this.onCaughtError=a,this.onRecoverableError=o,this.pooledCache=null,this.pooledCacheLanes=0,this.formState=c,this.incompleteTransitions=new Map}function ep(e,t,n,r,i,a,o,s,c,l,u,d){return e=new $f(e,t,n,o,c,l,u,d,s),t=1,!0===a&&(t|=24),a=pi(3,null,null,t),e.current=a,a.stateNode=e,t=fa(),t.refCount++,e.pooledCache=t,t.refCount++,a.memoizedState={element:r,isDehydrated:n,cache:t},Ga(a),e}function tp(e){return e?(e=di,e):di}function np(e,t,n,r,i,a){i=tp(i),r.context===null?r.context=i:r.pendingContext=i,r=qa(t),r.payload={element:n},a=a===void 0?null:a,a!==null&&(r.callback=a),n=Ja(e,r,t),n!==null&&(gu(n,e,t),Ya(n,e,t))}function rp(e,t){if(e=e.memoizedState,e!==null&&e.dehydrated!==null){var n=e.retryLane;e.retryLane=n!==0&&n<t?n:t}}function ip(e,t){rp(e,t),(e=e.alternate)&&rp(e,t)}function ap(e){if(e.tag===13||e.tag===31){var t=li(e,67108864);t!==null&&gu(t,e,67108864),ip(e,67108864)}}function op(e){if(e.tag===13||e.tag===31){var t=mu();t=dt(t);var n=li(e,t);n!==null&&gu(n,e,t),ip(e,t)}}var sp=!0;function cp(e,t,n,r){var i=D.T;D.T=null;var a=O.p;try{O.p=2,up(e,t,n,r)}finally{O.p=a,D.T=i}}function lp(e,t,n,r){var i=D.T;D.T=null;var a=O.p;try{O.p=8,up(e,t,n,r)}finally{O.p=a,D.T=i}}function up(e,t,n,r){if(sp){var i=dp(r);if(i===null)wd(e,t,r,fp,n),Cp(e,r);else if(Tp(i,e,t,n,r))r.stopPropagation();else if(Cp(e,r),t&4&&-1<Sp.indexOf(e)){for(;i!==null;){var a=Et(i);if(a!==null)switch(a.tag){case 3:if(a=a.stateNode,a.current.memoizedState.isDehydrated){var o=et(a.pendingLanes);if(o!==0){var s=a;for(s.pendingLanes|=2,s.entangledLanes|=2;o;){var c=1<<31-qe(o);s.entanglements[1]|=c,o&=~c}id(a),!(V&6)&&(Y=Fe()+500,Z(0,!1))}}break;case 31:case 13:s=li(a,2),s!==null&&gu(s,a,2),xu(),ip(a,2)}if(a=dp(r),a===null&&wd(e,t,r,fp,n),a===i)break;i=a}i!==null&&r.stopPropagation()}else wd(e,t,r,null,n)}}function dp(e){return e=fn(e),pp(e)}var fp=null;function pp(e){if(fp=null,e=Tt(e),e!==null){var t=o(e);if(t===null)e=null;else{var n=t.tag;if(n===13){if(e=s(t),e!==null)return e;e=null}else if(n===31){if(e=c(t),e!==null)return e;e=null}else if(n===3){if(t.stateNode.current.memoizedState.isDehydrated)return t.tag===3?t.stateNode.containerInfo:null;e=null}else t!==e&&(e=null)}}return fp=e,null}function mp(e){switch(e){case`beforetoggle`:case`cancel`:case`click`:case`close`:case`contextmenu`:case`copy`:case`cut`:case`auxclick`:case`dblclick`:case`dragend`:case`dragstart`:case`drop`:case`focusin`:case`focusout`:case`input`:case`invalid`:case`keydown`:case`keypress`:case`keyup`:case`mousedown`:case`mouseup`:case`paste`:case`pause`:case`play`:case`pointercancel`:case`pointerdown`:case`pointerup`:case`ratechange`:case`reset`:case`resize`:case`seeked`:case`submit`:case`toggle`:case`touchcancel`:case`touchend`:case`touchstart`:case`volumechange`:case`change`:case`selectionchange`:case`textInput`:case`compositionstart`:case`compositionend`:case`compositionupdate`:case`beforeblur`:case`afterblur`:case`beforeinput`:case`blur`:case`fullscreenchange`:case`focus`:case`hashchange`:case`popstate`:case`select`:case`selectstart`:return 2;case`drag`:case`dragenter`:case`dragexit`:case`dragleave`:case`dragover`:case`mousemove`:case`mouseout`:case`mouseover`:case`pointermove`:case`pointerout`:case`pointerover`:case`scroll`:case`touchmove`:case`wheel`:case`mouseenter`:case`mouseleave`:case`pointerenter`:case`pointerleave`:return 8;case`message`:switch(Ie()){case Le:return 2;case Re:return 8;case ze:case Be:return 32;case Ve:return 268435456;default:return 32}default:return 32}}var hp=!1,gp=null,_p=null,vp=null,yp=new Map,bp=new Map,xp=[],Sp=`mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset`.split(` `);function Cp(e,t){switch(e){case`focusin`:case`focusout`:gp=null;break;case`dragenter`:case`dragleave`:_p=null;break;case`mouseover`:case`mouseout`:vp=null;break;case`pointerover`:case`pointerout`:yp.delete(t.pointerId);break;case`gotpointercapture`:case`lostpointercapture`:bp.delete(t.pointerId)}}function wp(e,t,n,r,i,a){return e===null||e.nativeEvent!==a?(e={blockedOn:t,domEventName:n,eventSystemFlags:r,nativeEvent:a,targetContainers:[i]},t!==null&&(t=Et(t),t!==null&&ap(t)),e):(e.eventSystemFlags|=r,t=e.targetContainers,i!==null&&t.indexOf(i)===-1&&t.push(i),e)}function Tp(e,t,n,r,i){switch(t){case`focusin`:return gp=wp(gp,e,t,n,r,i),!0;case`dragenter`:return _p=wp(_p,e,t,n,r,i),!0;case`mouseover`:return vp=wp(vp,e,t,n,r,i),!0;case`pointerover`:var a=i.pointerId;return yp.set(a,wp(yp.get(a)||null,e,t,n,r,i)),!0;case`gotpointercapture`:return a=i.pointerId,bp.set(a,wp(bp.get(a)||null,e,t,n,r,i)),!0}return!1}function Ep(e){var t=Tt(e.target);if(t!==null){var n=o(t);if(n!==null){if(t=n.tag,t===13){if(t=s(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===31){if(t=c(n),t!==null){e.blockedOn=t,mt(e.priority,function(){op(n)});return}}else if(t===3&&n.stateNode.current.memoizedState.isDehydrated){e.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}e.blockedOn=null}function Dp(e){if(e.blockedOn!==null)return!1;for(var t=e.targetContainers;0<t.length;){var n=dp(e.nativeEvent);if(n===null){n=e.nativeEvent;var r=new n.constructor(n.type,n);dn=r,n.target.dispatchEvent(r),dn=null}else return t=Et(n),t!==null&&ap(t),e.blockedOn=n,!1;t.shift()}return!0}function Op(e,t,n){Dp(e)&&n.delete(t)}function kp(){hp=!1,gp!==null&&Dp(gp)&&(gp=null),_p!==null&&Dp(_p)&&(_p=null),vp!==null&&Dp(vp)&&(vp=null),yp.forEach(Op),bp.forEach(Op)}function Ap(e,n){e.blockedOn===n&&(e.blockedOn=null,hp||(hp=!0,t.unstable_scheduleCallback(t.unstable_NormalPriority,kp)))}var jp=null;function Mp(e){jp!==e&&(jp=e,t.unstable_scheduleCallback(t.unstable_NormalPriority,function(){jp===e&&(jp=null);for(var t=0;t<e.length;t+=3){var n=e[t],r=e[t+1],i=e[t+2];if(typeof r!=`function`){if(pp(r||n)===null)continue;break}var a=Et(n);a!==null&&(e.splice(t,3),t-=3,As(a,{pending:!0,data:i,method:n.method,action:r},r,i))}}))}function Np(e){function t(t){return Ap(t,e)}gp!==null&&Ap(gp,e),_p!==null&&Ap(_p,e),vp!==null&&Ap(vp,e),yp.forEach(t),bp.forEach(t);for(var n=0;n<xp.length;n++){var r=xp[n];r.blockedOn===e&&(r.blockedOn=null)}for(;0<xp.length&&(n=xp[0],n.blockedOn===null);)Ep(n),n.blockedOn===null&&xp.shift();if(n=(e.ownerDocument||e).$$reactFormReplay,n!=null)for(r=0;r<n.length;r+=3){var i=n[r],a=n[r+1],o=i[_t]||null;if(typeof a==`function`)o||Mp(n);else if(o){var s=null;if(a&&a.hasAttribute(`formAction`)){if(i=a,o=a[_t]||null)s=o.formAction;else if(pp(i)!==null)continue}else s=o.action;typeof s==`function`?n[r+1]=s:(n.splice(r,3),r-=3),Mp(n)}}}function Pp(){function e(e){e.canIntercept&&e.info===`react-transition`&&e.intercept({handler:function(){return new Promise(function(e){return i=e})},focusReset:`manual`,scroll:`manual`})}function t(){i!==null&&(i(),i=null),r||setTimeout(n,20)}function n(){if(!r&&!navigation.transition){var e=navigation.currentEntry;e&&e.url!=null&&navigation.navigate(e.url,{state:e.getState(),info:`react-transition`,history:`replace`})}}if(typeof navigation==`object`){var r=!1,i=null;return navigation.addEventListener(`navigate`,e),navigation.addEventListener(`navigatesuccess`,t),navigation.addEventListener(`navigateerror`,t),setTimeout(n,100),function(){r=!0,navigation.removeEventListener(`navigate`,e),navigation.removeEventListener(`navigatesuccess`,t),navigation.removeEventListener(`navigateerror`,t),i!==null&&(i(),i=null)}}}function Fp(e){this._internalRoot=e}Ip.prototype.render=Fp.prototype.render=function(e){var t=this._internalRoot;if(t===null)throw Error(i(409));var n=t.current;np(n,mu(),e,t,null,null)},Ip.prototype.unmount=Fp.prototype.unmount=function(){var e=this._internalRoot;if(e!==null){this._internalRoot=null;var t=e.containerInfo;np(e.current,2,null,e,null,null),xu(),t[vt]=null}};function Ip(e){this._internalRoot=e}Ip.prototype.unstable_scheduleHydration=function(e){if(e){var t=pt();e={blockedOn:null,target:e,priority:t};for(var n=0;n<xp.length&&t!==0&&t<xp[n].priority;n++);xp.splice(n,0,e),n===0&&Ep(e)}};var Lp=n.version;if(Lp!==`19.2.4`)throw Error(i(527,Lp,`19.2.4`));O.findDOMNode=function(e){var t=e._reactInternals;if(t===void 0)throw typeof e.render==`function`?Error(i(188)):(e=Object.keys(e).join(`,`),Error(i(268,e)));return e=u(t),e=e===null?null:f(e),e=e===null?null:e.stateNode,e};var Rp={bundleType:0,version:`19.2.4`,rendererPackageName:`react-dom`,currentDispatcherRef:D,reconcilerVersion:`19.2.4`};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<`u`){var zp=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!zp.isDisabled&&zp.supportsFiber)try{We=zp.inject(Rp),Ge=zp}catch{}}e.createRoot=function(e,t){if(!a(e))throw Error(i(299));var n=!1,r=``,o=$s,s=ec,c=tc;return t!=null&&(!0===t.unstable_strictMode&&(n=!0),t.identifierPrefix!==void 0&&(r=t.identifierPrefix),t.onUncaughtError!==void 0&&(o=t.onUncaughtError),t.onCaughtError!==void 0&&(s=t.onCaughtError),t.onRecoverableError!==void 0&&(c=t.onRecoverableError)),t=ep(e,1,!1,null,null,n,r,null,o,s,c,Pp),e[vt]=t.current,Sd(e),new Fp(t)}})),_=o(((e,t)=>{function n(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>`u`||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!=`function`))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(n)}catch(e){console.error(e)}}n(),t.exports=g()}))(),v=l(d(),1),y=o((e=>{var t=Symbol.for(`react.transitional.element`),n=Symbol.for(`react.fragment`);function r(e,n,r){var i=null;if(r!==void 0&&(i=``+r),n.key!==void 0&&(i=``+n.key),`key`in n)for(var a in r={},n)a!==`key`&&(r[a]=n[a]);else r=n;return n=r.ref,{$$typeof:t,type:e,key:i,ref:n===void 0?null:n,props:r}}e.Fragment=n,e.jsx=r,e.jsxs=r})),b=o(((e,t)=>{t.exports=y()}))(),x=({onMinimize:e,onMaximize:t,onClose:n})=>(0,b.jsxs)(`div`,{className:`title-bar-controls`,children:[(0,b.jsx)(`button`,{"aria-label":`Minimize`,onClick:e}),(0,b.jsx)(`button`,{"aria-label":`Maximize`,onClick:t}),(0,b.jsx)(`button`,{"aria-label":`Close`,onClick:n})]}),ee=({title:e,onMinimize:t,onMaximize:n,onClose:r,active:i=!0})=>(0,b.jsxs)(`div`,{className:`title-bar ${i?``:`inactive`}`,children:[(0,b.jsx)(`div`,{className:`title-bar-text`,children:e}),(0,b.jsx)(x,{onMinimize:t,onMaximize:n,onClose:r})]}),S=(0,v.createContext)(null),C=({children:e,id:t,onClose:n})=>(0,b.jsx)(S.Provider,{value:{id:t,onClose:n},children:e}),w=()=>(0,v.useContext)(S),T=({id:e,title:t,children:n,initialPosition:r={x:50,y:50},initialSize:i={width:400,height:300},isActive:a=!1,isMinimized:o=!1,centered:s=!1,zIndex:c=10,isMaximized:l=!1,currentPosition:u=null,onFocus:d,onMinimize:f,onMaximize:p,onClose:m,onMove:h,onResize:g})=>{let[_,y]=(0,v.useState)(i),[x,S]=(0,v.useState)(()=>u||(s?{x:(window.innerWidth-i.width)/2,y:(window.innerHeight-i.height)/2}:r)),[w,T]=(0,v.useState)(!1),[te,E]=(0,v.useState)(!1),ne=(0,v.useRef)({x:0,y:0,posX:0,posY:0,width:0,height:0}),re=()=>{f?.(e)},ie=()=>{m?.(e)},ae=e=>{e.target.closest(`.title-bar`)&&(T(!0),ne.current={x:e.clientX,y:e.clientY,posX:x.x,posY:x.y,width:_.width,height:_.height})},oe=e=>{e.stopPropagation(),E(!0),ne.current={x:e.clientX,y:e.clientY,posX:x.x,posY:x.y,width:_.width,height:_.height}},se=e=>{if(w){let t=e.clientX-ne.current.x,n=e.clientY-ne.current.y,r=ne.current.posX+t,i=ne.current.posY+n,a=window.innerWidth,o=window.innerHeight-30;S({x:Math.max(0,Math.min(r,a-_.width)),y:Math.max(30,Math.min(i,o-_.height))})}if(te){let t=e.clientX-ne.current.x,n=e.clientY-ne.current.y,r=window.innerWidth,i=window.innerHeight-30;y({width:Math.max(200,Math.min(ne.current.width+t,r-x.x)),height:Math.max(150,Math.min(ne.current.height+n,i-x.y))})}},ce=()=>{w&&(T(!1),h?.(e,x)),te&&(E(!1),g?.(e,_))};if(o)return null;let D=()=>(0,b.jsxs)(C,{id:e,onClose:ie,children:[(0,b.jsx)(ee,{title:t,onMinimize:re,onMaximize:()=>p?.(e),onClose:ie,active:a}),(0,b.jsx)(`div`,{className:`window-body`,children:n}),!l&&(0,b.jsx)(`div`,{className:`window-resize-handle`,onMouseDown:oe})]});return l?(0,b.jsx)(`div`,{className:`window ${a?`active`:``}`,style:{position:`absolute`,width:`100%`,height:`calc(100% - 30px)`,zIndex:c,left:`0px`,top:`30px`},onClick:()=>d?.(e),children:D()}):(0,b.jsx)(`div`,{className:`window ${a?`active`:``}`,style:{position:`absolute`,width:_.width,height:_.height,zIndex:c,left:x.x,top:x.y,cursor:w?`move`:`default`,userSelect:w||te?`none`:`auto`},onMouseDown:ae,onMouseMove:se,onMouseUp:ce,onMouseLeave:ce,onClick:()=>d?.(e),children:D()})},te=()=>{let[e,t]=(0,v.useState)(!1),n=(0,v.useCallback)(()=>{t(e=>!e)},[]),r=(0,v.useCallback)(()=>{t(!0)},[]),i=(0,v.useCallback)(()=>{t(!1)},[]);return(0,v.useEffect)(()=>{let n=n=>{let r=document.querySelector(`.start-menu`);e&&r&&!r.contains(n.target)&&t(!1)};return document.addEventListener(`click`,n),()=>document.removeEventListener(`click`,n)},[e]),(0,v.useMemo)(()=>({isOpen:e,toggle:n,open:r,close:i}),[e,n,r,i])},E=()=>{let[e,t]=(0,v.useState)(()=>new Date);return(0,v.useEffect)(()=>{let e=setInterval(()=>{t(new Date)},1e3);return()=>clearInterval(e)},[]),e},ne=({windows:e,activeWindowId:t,onWindowClick:n,onRestore:r,isStartOpen:i,onStartClick:a})=>{let o=E();return(0,b.jsxs)(`div`,{className:`taskbar`,style:{position:`fixed`,top:0,left:0,right:0,height:`30px`,display:`flex`,alignItems:`center`,padding:`2px 4px`,background:`#c0c0c0`,borderBottom:`2px solid #808080`,zIndex:1e3},children:[(0,b.jsxs)(`button`,{className:`start-button ${i?`active`:``}`,style:{display:`flex`,alignItems:`center`,gap:`4px`,fontWeight:`bold`,marginRight:`8px`},onClick:a,children:[(0,b.jsx)(`img`,{src:`https://win98icons.alexmeub.com/icons/png/windows-0.png`,width:`16`,height:`16`,alt:``}),`Start`]}),(0,b.jsx)(`div`,{style:{borderLeft:`2px solid #808080`,borderRight:`2px solid #fff`,height:`20px`,marginRight:`8px`}}),(0,b.jsx)(`div`,{style:{display:`flex`,gap:`4px`,flex:1},children:e.map(e=>(0,b.jsx)(`button`,{className:t===e.id&&!e.isMinimized?`active`:``,style:{maxWidth:`150px`,overflow:`hidden`,textOverflow:`ellipsis`,whiteSpace:`nowrap`,textAlign:`left`},onClick:()=>e.isMinimized?r(e.id):n(e.id),children:e.title},e.id))}),(0,b.jsx)(`div`,{style:{borderLeft:`2px solid #808080`,borderRight:`2px solid #fff`,height:`20px`,marginLeft:`8px`}}),(0,b.jsx)(`div`,{style:{marginLeft:`8px`,fontSize:`12px`},children:o.toLocaleTimeString([],{hour:`2-digit`,minute:`2-digit`,second:`2-digit`})})]})},re=(0,v.createContext)(void 0),ie=({children:e})=>{let[t,n]=(0,v.useState)(()=>localStorage.getItem(`language`)||`en`);return(0,v.useEffect)(()=>{localStorage.setItem(`language`,t)},[t]),(0,b.jsx)(re.Provider,{value:{language:t,changeLanguage:e=>{n(e)}},children:e})},ae=()=>{let e=(0,v.useContext)(re);if(!e)throw Error(`useLanguage must be used within a LanguageProvider`);return e},oe=(0,v.createContext)(null),se=({children:e,initialWindows:t=[]})=>{let[n,r]=(0,v.useState)(t),[i,a]=(0,v.useState)(t[0]?.id||null),[o,s]=(0,v.useState)(10),c=(0,v.useCallback)(e=>{let t=o+1;s(t),a(e),r(n=>n.map(n=>({...n,isActive:n.id===e,zIndex:n.id===e?t:n.zIndex})))},[o]),l=(0,v.useCallback)(e=>{c(e)},[c]),u=(0,v.useCallback)(e=>{r(t=>t.map(t=>t.id===e?{...t,isMinimized:!0}:t));let t=n.filter(t=>!t.isMinimized&&t.id!==e);t.length>0&&a(t[0].id)},[n]),d=(0,v.useCallback)(e=>{c(e),r(t=>t.map(t=>t.id===e?{...t,isMinimized:!1,isActive:!0}:{...t,isActive:!1})),a(e)},[c]),f=(0,v.useCallback)(e=>{r(t=>{let n=t.filter(t=>t.id!==e);return n.length>0&&a(n[n.length-1].id),n})},[]),p=(0,v.useCallback)(e=>{let t=o+1;s(t),r(n=>n.map(n=>{if(n.id===e){let e=!n.isMaximized;return{...n,isMaximized:e,isActive:!0,zIndex:t}}return{...n,isActive:!1}})),a(e)},[o]),m=(0,v.useCallback)((e,t)=>{r(n=>n.map(n=>n.id===e?{...n,currentPosition:t}:n))},[]),h=(0,v.useCallback)(e=>{let t=o+1;s(t);let n=Math.floor((t-10)/2)*20,i=e.initialSize?.width||400,c=e.initialSize?.height||300,l=window.innerWidth,u=window.innerHeight-30,d=Math.min(i,l-40),f=Math.min(c,u-40),p=e.initialPosition?.x??100+n,m=e.initialPosition?.y??100+n,h=Math.max(0,Math.min(p,l-d)),g=Math.max(30,Math.min(m,u-f)),_={appId:e.appId,id:e.appId+`-`+Date.now(),title:e.title||`Window`,isMinimized:!1,isActive:!0,isMaximized:!1,initialPosition:{x:h,y:g},initialSize:{width:d,height:f},currentPosition:null,centered:e.centered||!1,zIndex:t,content:e.content,windowKey:e.windowKey};r(e=>[...e,_]),a(_.id)},[o]),g={windows:n,activeWindowId:i,handleWindowFocus:l,handleMinimize:u,handleRestore:d,handleClose:f,handleMaximize:p,handleWindowMove:m,addWindow:h,openApp:(0,v.useCallback)((e,t=null)=>{let i=Qp(e);if(!i)return;let c=t?.windowKey||null,l=i.singleInstance===!1,u=null;if(c?u=n.find(t=>t.appId===e&&t.windowKey===c):l!==!0&&(u=n.find(t=>t.appId===e)),u){let e=o+1;s(e),r(t=>t.map(t=>t.id===u.id?{...t,zIndex:e,isMinimized:!1,isActive:!0}:{...t,isActive:!1})),a(u.id)}else{let e=i.component;h({appId:i.id,windowKey:c,title:t?.title||i.title,initialSize:i.defaultSize,centered:i.centered,content:(0,b.jsx)(e,{file:t?.file})})}},[n,o,h]),isWindowOpen:(0,v.useCallback)(e=>n.some(t=>t.appId===e),[n])};return(0,b.jsx)(oe.Provider,{value:g,children:e})},ce=()=>{let e=(0,v.useContext)(oe);if(!e)throw Error(`useDesktop must be used within a DesktopProvider`);return e},D=`Date: 17/03/2026
# Project Features

This project is a Windows 95/98 style desktop environment built with React. Below are the main features available to the user:

## 🖥️ Desktop and Window Management
- **Multitasking**: Open multiple applications simultaneously in independent windows.
- **Window Management**: Each window can be:
  - **Dragged**: Move across the desktop from the title bar.
  - **Minimized**: Hide the window while keeping the application open in the Taskbar.
  - **Maximized/Restored**: Expand the window to full screen or return to its original size.
  - **Closed**: End the application.
  - **Focused**: Clicking a window or its taskbar icon brings it to the front (Z-Index).

## 🚀 Start Menu and Taskbar
- **Start Menu**: Quick access to all installed applications (\`Programs\`, \`Documents\`, \`Settings\`).
- **Taskbar**: View open applications, allowing you to switch between them quickly.
- **System Clock**: Real-time display of the current time in the bottom right corner.

## 📂 Document Explorer (Documents)
- **Folder Navigation**: View the file structure organized by categories (\`YouTube\`, \`Systems\`, \`Pages\`, \`Internet\`).
- **View Modes**: 
  - **Table View**: Detailed list of files with name, location, and last modification date (sorted by most recent).
  - **Tree View**: Classic hierarchical folder navigation.
- **Direct Access**: Open any document directly with a click.

## 📄 File Viewer (File Viewer)
- **Markdown Rendering**: View documents with rich formatting, including images, lists, links, and code blocks.
- **View Tabs**:
  - **Preview**: See the rendered document.
  - **Source**: See the original raw content (Markdown).
- **Image Support**: Images are loaded dynamically from the project's public folder.

## 🔍 Document Search (Search)
- **Real-time Search**: Search for files by name or by content within the documents.
- **Interactive Results**: Shows the location and type of match, allowing you to open the file directly from the results.

## ⚙️ Settings (Settings)
- **Language Change**: Allows switching the entire interface between **English** and **Spanish**.
- **Internationalization (i18n)**: App texts, buttons, and menus update dynamically when changing the language.

## 🔗 URL Routing
- **Deep Linking**: The system can open specific files directly from the URL (e.g., \`/youtube/ollama-en-linux\`).
- **URL Synchronization**: When closing or minimizing a window opened by URL, the browser address is automatically cleared back to the root (\`/\`).

## 👋 Welcome Screen (Welcome)
- **Tips of the Day**: Interactive screen with useful tips on how to use the system.
- **Startup Settings**: Option to decide whether to see the screen when loading the project.
`,O=`Fecha: 31-12-2023\r
# Hoja de vida | Juan David Ochoa\r
<p class="message">\r
Full Stack Developer con más de 20 años de experiencia, enfocado en el análisis y la optimización de procesos. Experto en transformar necesidades en soluciones eficientes y creativas mediante la sistematización.\r
</p>\r
\r
\`\`\`\r
Experto en Sistematización de Procesos en la Nube (Test-driven development (TDD), Behavior Driven Development (BDD), PHPunit, Metodologías Ágiles (Scrum), Bitbucket Pipelines (Atlassian), Amazon Web Service Administrator, Control de versiones (GIT), Bases de datos no relacionales (mongoDB), SOAP WebServices (C#), ERP SAP Business One (SDK - UIAPI), TCP server (Sockets)).\r
\`\`\`\r
<hr>\r
\r
### Full Stack Developer en Sophos Solutions S.A.S.\r
2021 – Presente<br>\r
<b>Clientes:</b> Tuya, Sistecredito, Comfama, Bolsa de Valores de Colombia<br>\r
(Flutter, .Net Core, React, Next, Swagger)\r
<hr/>\r
\r
### Full Stack Developer en Solvo Global\r
2020 – 2021<br>\r
<b>Clientes:</b> OneSeven Technology.<br>\r
(Flutter, Net Core, Node, React, API, PHP, GraphQL)\r
<hr/>\r
\r
### Director Departamento de Desarrollo en Misión Empresarial\r
2019 – 2020<br>\r
Sistematización de procesos e integración con ERP Novasoft en .NET CORE<br>\r
(Stored Procedure SQL, C#, Javascript, API-REST, Swagger, GLPI, Scraping, HTML5, Bootstrap.\r
<hr/>\r
\r
### Director Departamento de Desarrollo en Diez Equis S.A.\r
2017 – 2019<br>\r
Sistematización de procesos e integración con SAP Business One<br>\r
(AWS, Rackspace Cloud, C#, SOAP, Javascript, PHP, Kubernetes, Docker, MongoDB, TDD, BDD, Laravel, PHPunit, TCP sockets)\r
<hr/>\r
\r
### Director Departamento de Desarrollo en Suiche Creativo\r
2014 – 2017<br>\r
Sistematización de procesos en la nube, Herramientas web, módulos y componentes joomla, Realidad aumentada, inteligencia artificial y bots para redes sociales.\r
<hr/>\r
\r
### Desarrollador Web en Agencia Estratégico Digital\r
2012 – 2014<br>\r
Creación de Herramientas Web y Sistematización de procesos integrados con diversos CMS (Joomla - Wordpress).\r
<hr/>\r
\r
### Director Departamento de Desarrollo en Promesas del Fútbol\r
2009 – 2012<br>\r
Creación de plataforma digital para pruebas antropométricas, tecnicas y fisicas, con informes avanzados basados en somatocartas o somatotipo que permiten la evaluación y selección científica de jugadores de fútbol.\r
<hr>\r
\r
### Director Departamento de Desarrollo en Tactica Web\r
2007 – 2009<br>\r
Sistematización de procesos, Herramientas Web, Gestores de Contenido, Javascript, AJAX, HTML, PHP, MYSQL\r
<hr>\r
\r
### Director Departamento de Desarrollo en Neon Group\r
2006 – 2007<br>\r
Sistematización de procesos, Herramientas Web, Gestores de Contenido, Javascript, AJAX, HTML, PHP, MYSQL\r
`,le=`Fecha: 20/09/2019\r
---\r
tags: Links\r
---\r
\r
# Enlaces curiosos de la Internet y la DeepWeb\r
\r
Recopilación de sitios web, herramientas o simplemente cosas curiosas de la red\r
\r
En <a target="_blank" href="{{ page.youtube }}">Esta lista de reproduccón</a> hay más información.\r
\r
\`\`\`csharp\r
//Capitalización de las criptomonedas\r
https://coinmarketcap.com/\r
\r
//Navegador minador de bitcoin\r
https://cryptotab.net/es/\r
\r
//Compra - venta bitcoin\r
https://www.coinsenda.com/\r
\r
//Billetera bitcoin\r
http://s7a4rvc6425y72d2.onion/es/\r
\r
//Mapa mundial de negocios que aceptan bitcoin\r
https://coinmap.org/\r
\r
//Navegador web onion TORCH\r
http://xmh57jrzrnw6insl.onion/\r
\r
//Navegador web onion NOT EVIL\r
http://hss3uro2hsxfogfq.onion/\r
\r
//Navegador Phobos\r
http://phobosxilamwcg75xt22id7aywkzol6q6rfl2flipcqoc4e4ahima5id.onion\r
\r
//Email TORBOX\r
http://torbox3uiot6wchz.onion/\r
\r
//Email SecMail\r
http://secmailw453j7piv.onion\r
\r
//wordpress\r
http://torpress2sarn7xw.onion\r
\r
//Free Hosting\r
http://dhosting4okcs22v.onion/\r
http://fhostingineiwjg6cppciac2bemu42nwsupvvisihnczinok362qfrqd.onion\r
\r
//Intercambio anonimo de archivos BLACK CLOUD\r
http://bcloud2suoza3ybr.onion/\r
\r
//Comunidad latina CEBOLLA CHAN\r
http://s6cco2jylmxqcdeh.onion\r
\r
//Servidor de Email ONIONMAIL\r
http://jgzvkisiov642jlc.onion/\r
\r
//Chat con estraños\r
http://tetatl6umgbmtv27.onion/\r
\r
//Url de facebook accesible desde deepweb\r
https://www.facebookwkhpilnemxj7asaniu7vnjjbiltxjqhye3mhbshg7kx5tfyd.onion/\r
\r
//Blog EL BINARIO\r
http://binario5yvaed5ie.onion/\r
\r
//Hidden Answers \r
http://answerszuvs3gg2l64e6hmnryudl5zgrmwm3vh65hzszdghblddvfiqd.onion/\r
\r
//radio\r
http://76qugh5bey5gum7l.onion/\r
\r
//Recopilación de emisoras online del mundo\r
https://radio.garden/\r
\r
//WINAMP online\r
https://webamp.org/\r
\r
//URL API banco de la republica TRM\r
http://app.docm.co/prod/Dmservices/Utilities.svc/GetTRM\r
\r
//hosting de imagenes\r
https://imgur.com/\r
\r
//Pagina llena de juegos retro online\r
https://classicreload.com/\r
\r
//Aplicacion para instalar drivers online\r
https://driverpack.io/es\r
\`\`\`\r
`,ue=`Fecha: 25/09/2019\r
---\r
tags: Links\r
---\r
\r
# Puntos curiosos en google maps de Chernobyl\r
\r
Recopilación de puntos en google maps sobre sitios curiosos dentro de Chernobyl \r
\r
En [mi canal de youtube](https://youtu.be/Sp00ZqfBnM4) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
//Hospital Unit Number 126\r
https://goo.gl/maps/EBvNcwCj7G4xjy5p9\r
https://goo.gl/maps/25tidTmLVq76DmxUA\r
https://goo.gl/maps/kQvS2UhXsc2AA5os7\r
\r
//El "Pájaro Carpintero Ruso" ("Russian Woodpecker")\r
https://goo.gl/maps/9N4XHV6cH8tfHS4m7\r
\r
//Barcos abandonados\r
https://goo.gl/maps/z1EbbN6qGSJC7GTGA\r
\r
//La famosa rueda de chicago\r
https://goo.gl/maps/vHXuNzurTL9M9VcQA\r
\r
//Carros chocones\r
https://goo.gl/maps/VvuEfgAUpPkzwwwt5\r
\r
//Supuestas manchas de sangre en edificios\r
https://goo.gl/maps/2yUSzsvBfusYbt2J9\r
\r
//Pripiat vista aerea\r
https://goo.gl/maps/1Xp299MbuYng2rHD9\r
\r
//Estadio\r
https://goo.gl/maps/CXevmEM1qDrkGvx3A\r
\r
//La planta\r
https://goo.gl/maps/HQzH4zGhVnVXwLNV8\r
https://goo.gl/maps/f7pUmGbdyrzkwFsH8\r
https://goo.gl/maps/hDXtXw9GJdHjDsUG8\r
\r
//Planta vista aerea\r
https://goo.gl/maps/1PhNz6zr94rzmW8u6\r
\r
//Las muñecas de trapo\r
https://goo.gl/maps/4P1mWMNx2JpUqJi2A\r
\`\`\`\r
`,de=`Fecha: 05/01/2022\r
---\r
tags: Links Servicios\r
---\r
\r
# Servicios gratuitos para desarrolladores\r
\r
Recopilación de herramientas o recursos gratuitos en la red para desarrolladores.\r
<hr>\r
\r
### FREEASPHOSTING:\r
Hosting gratuito para aplicaciones C# (.net core)\r
###### <a target="_blank" href="{{ page.videofreeasp }}">Ver video</a> \r
###### <a target="_blank" href="{{ page.linkfreeasp }}">https://freeasphosting.net</a> \r
- [x] SQL\r
- [x] SSL automatico\r
- [ ] No FTP\r
<hr>\r
\r
### SOMEE:\r
Hosting gratuito para aplicaciones C# (.net core)\r
###### <a target="_blank" href="{{ page.videosomee }}">Ver video</a> \r
###### <a target="_blank" href="{{ page.linksome }}">https://somee.com</a> \r
- [x] SQL\r
- [x] FTP\r
- [x] Free SSL (Hay que renovarlo manualmente cada 3 meses)\r
- [ ] Pone un anuncio en el pie de pagina del sitio\r
<hr>\r
\r
### BLOGGER:\r
Web Blog que se puede convertir en web profesional, portafolio o E-commerce\r
###### <a target="_blank" href="{{ page.videoblogger }}">Ver video</a> \r
###### <a target="_blank" href="{{ page.linkblogger }}">https://www.blogger.com</a> \r
- [x] Sin limite de post (productos)\r
- [x] Dominio personalizado\r
- [x] SSL (por defecto)\r
- [x] Templates (Gratis y de pago)\r
<hr>\r
\r
### GITHUB:\r
Repositorios que se pueden convertir en paginas web estaticas HTML\r
###### <a target="_blank" href="{{ page.videogithub }}">Ver video</a> \r
###### <a target="_blank" href="{{ page.linkgithub }}">https://github.com</a> \r
- [x] Dominio personalizado\r
- [x] SSL (por defecto)\r
- [x] Templates HTML (Gratis y de pago)\r
- [ ] Base de datos`,fe=`Fecha: 03/02/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Backend\r
\r
<p>Frontend y Backend privado construido sobre Framework Laravel que permite al area adminsitrativa gestionar usuarios del sistema, crear roles y permisos.</p>\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
<img src="/images/SapbusinessOne-Backend1.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-Backend2.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Backend3.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Backend4.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Backend5.png" style="width: 100%;"/> \r
`,pe=`Fecha: 01/02/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Cotización Pagina Web\r
\r
<p>Frontend y Backend público construido sobre Framework Laravel que permite a los visitantes del sitio web crear una cotización de venta y enviarla automaticamente al sistema de gestión de prospectos, donde serán verificados los datos y papeleria del nuevo cliente y posteriormente atender su solicitud.</p>\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
<img src="/images/SapbusinessOne-1.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-2.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-3.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-4.png" style="width: 100%;"/> \r
`,me=`Fecha: 29/01/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Horario\r
\r
<p>Sistema web PHP para administrar la hora de entrada y salida de todos los operarios de bodega, adicional permite llevar control de novedades y el inventario de canastas para transporte de articulos.</p>\r
\r
<img src="/images/SapbusinessOne-Horario.png" style="width: 100%;"/>\r
`,he=`Fecha: 04/02/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Informes\r
\r
<p>Frontend y Backend privado construido sobre Framework Laravel que permite al los usuarios del sistema con roles y privilegios suficientes para visualizar informes (últimos cambios de precios, Alistamientos de bodega para despachos e historicos de venta de los ejecutivos de cuenta).</p>\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
\r
<img src="/images/SapbusinessOne-informes-ArticulosBajaRotacion.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-Informes1.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-Informes2.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Informes3.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Informes6.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-Informes-ActividadesDeLlamada.png" style="width: 100%;"/>\r
`,ge=`Fecha: 05/02/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Ofertas de Venta\r
\r
<p>Frontend y Backend privado construido sobre Framework Laravel que permite a los empleados de un CallCenter atender a los Soicos de Negocio que tiene asigandos.</p>\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
<img src="/images/SapbusinessOne-CallCenter-ListaSociosDeNegocio.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-CallCenter-InformacionSocioDeNegocio.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-CallCenter-Cotizaciones.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-CallCenter-OrdenesDeVenta.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-CallCenter-FacturasYNotasCredito.png" style="width: 100%;"/> \r
`,_e=`Fecha: 02/02/2019\r
---\r
tags: SapBusinessOne Integración PHP Laravel\r
---\r
\r
# Sap Business One | Venta Externa\r
\r
<p>Frontend y Backend público construido sobre Framework Laravel que permite al los vendores externos gestionar los clientes que tienen asignados, visualizar el historico de compras, crear una oferta de venta y enviarla automaticamente al sistema de aprobaciones para convertirla en orden de venta, luego en factura y finalmente despachar al cliente final.</p>\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
<img src="/images/SapbusinessOne-5.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/SapbusinessOne-6.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-7.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-8.png" style="width: 100%;"/> \r
<hr>\r
<img src="/images/SapbusinessOne-9.png" style="width: 100%;"/> \r
`,ve=`Fecha: 01/01/2019\r
---\r
tags: Android Node\r
---\r
\r
# Pantalla Errores\r
\r
<p>Pantalla informativa que usa una APP android en un MiniPC HDMI alimentada por un Servidor TCP (sockets) creado con NodeJS que lee la base de datos (LOG) del sistema y avisa con alerta visual y sonora cuando ocurre un error, registra los eventos, las variables enviadas y la respuesta de cada uno de los micro-servicios que la alimenta.</p>\r
<hr>\r
### Errores versión Televisión\r
<img src="/images/pantallaErrores.png" style="width: 100%;"/>\r
<hr>\r
\r
### Errores versión Web\r
<img src="/images/SapbusinessOne-Errores.png" style="width: 100%;"/>\r
`,ye=`Fecha: 02/01/2019\r
---\r
tags: Raspberry Android Integración\r
---\r
\r
# Pantalla Metas\r
\r
<p>Pantalla informativa que corre una APP web en una Raspberry Pi conectada a una pantalla y a la vista de todos los ejecutivos de cuenta, esta APP consulta varios procedimientos almacenados del servidor privado (windows) principal donde esta la base de datos SQL del ERP SAP BUSINESS ONE. Esta pantalla muestra el porcentaje global de las metas mensuales del equipo del CallCenter, lo facturado y el faltante en tiempo real.</p>\r
\r
> Este sistema es una integración con el ERP SAP BUSINESS ONE instalado en servidor windows privado en la nube y accedido por medio del SDK DIAPI\r
\r
<img src="/images/pantallaMetas.png" style="width: 100%;"/>\r
`,be=`Fecha: 01/01/2010\r
---\r
tags: Integración CMS PHP\r
---\r
\r
# Promesas del Futbol\r
\r
<img src="/images/promesas.jpg" style="width: 100%;"/>\r
\r
\r
Vitrina virtual para deportistas de alto rendimiento en Colombia y el mundo. Sistematización de datos antropometricos, pruebas técnicas, físicas y psicológicas para promoción de futbolistas.\r
\r
Tecnologias: Html, Javascript, Php, MySql, Bootstrap.\r
\r
* Sistema de registro y cambio de contraseñas.\r
* Registro de perfiles, foto de perfil con movimiento 360, fotos generales, videos y datos de biotipo. \r
* Bases de datos con informacion antropométricas, formulas y resultados gráficos somatotipos (somato-carta). \r
* Buscador especializado para directivos deportivos y cazatalentos.\r
* Informes administrativos con graficación de resultados y estados. \r
* Exportador, importador de archivos planos.\r
* Notificaciones especializadas a email y dispositivos. \r
`,xe=`Fecha: 01/02/2009\r
---\r
tags: Integración CMS Joomla\r
---\r
\r
# Fundación el Cinco\r
\r
<img src="/images/elcinco.png" style="width: 100%;"/>\r
\r
Sistematización de procesos (Backend y Frontend) para el desarrollo de proyectos productivos de carácter asociativo. Se establece encadenamientos productivos, empleando para ello recursos provenientes de individuos e instituciones.\r
\r
Tecnologias: Php, Html, Javascript, MySql. Todo como un modulo integrado a un CMS Joomla.\r
\r
* Sistema de registro y cambio de contraseñas.\r
* Registro de aportes y voluntariados.\r
* Informes personalizados a los aportantes. \r
* Informes administrativos de los aportes.\r
* Seguimento de proyectos productivos. \r
* Exportador, importador de archivos planos. \r
* Notificaciones a email y dispositivos.\r
`,Se=`Fecha: 01/02/2009\r
---\r
tags: Integración CMS Joomla\r
---\r
\r
# Positivo + Group Publicidad\r
\r
<img src="/images/positivoGroup.png" style="width: 100%;"/>\r
\r
(Backend y Frontend) Base de datos nacional con información de ascensores disponibles para publicidad en edificios recidenciales y comerciales, todo en un mapa interactivo con geo-localización. \r
\r
Tecnologias: Php, Html, Javascript, MySql, Google maps. Todo integrado como modulo en un CMS JOOMLA. \r
\r
* Registro de edificios con datos generales y coordenadas de geo-localización.\r
* Búsqueda y navegación interactiva con Google Maps.\r
* Reservas y programación en línea. \r
* Notificaciones a email y dispositivos. \r
* Importación y exportación de archivos planos.\r
`,Ce=`Fecha: 01/03/2009\r
---\r
tags: Integración CMS Joomla E-commerce\r
---\r
\r
# Renacer Prendas\r
\r
<img src="/images/renacerPrendas.jpg" style="width: 100%;"/>\r
\r
Sistematización de procesos internos en Colombia y Venezuela para empresa dedicada a la comercialización por sistema de Venta Directa de las Colecciones de Accesorios en fantasía fina, baño de oro y plata.\r
\r
Tecnologias: Php, Html, Javascript, MySql.  Todo integrado como modulo en un CMS JOOMLA. \r
\r
* registro de hojas de vida. \r
* registro de gerentes de zona. \r
* registro de vendedoras. \r
* registro de mercancía entregada. \r
* Registro de ventas y cuotas. \r
* Registro de premios y catálogos. \r
* Reportes personalizados para usuarios. \r
* Reportes personalizados para administrativos con graficación.\r
`,we=`Fecha: 01/04/2009\r
---\r
tags: Integración CMS Joomla\r
---\r
\r
# Revista Turistica PasoBueno\r
\r
<img src="/images/pasoBueno.png" style="width: 100%;"/>\r
\r
Directorio turístico (Backend y Frontend) Paso Bueno: La primera guía turística especializada del Corregimiento de Santa Elena.\r
\r
Tecnologias: Php, Html, Javascript, MySql. Todo integrado como modulo en un CMS JOOMLA.\r
\r
* Directorio turistico por orden alfabetico, más populares o recomendados.\r
* Ingreso de sitios turisticos (Información general, fotos y videos).\r
* Publicación de las revistas impresas en version digital.\r
* Sistemas de contacto (Chat, foro, NewsLetter).\r
`,Te=`Fecha: 03/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Colmedicos\r
\r
<img src="/images/colmedicos.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/colmedicos1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/colmedicos2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/colmedicos3.jpg" style="width: 100%;"/>\r
`,Ee=`Fecha: 01/06/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Arepas La Cajonera\r
\r
<img src="/images/laCajonera.jpg" style="width: 100%;"/>\r
`,De=`Fecha: 01/04/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Azimut Consultores\r
\r
<img src="/images/azimutConsultores1.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/azimutConsultores2.png" style="width: 100%;"/>\r
<hr>\r
<img src="/images/azimutConsultores3.jpg" style="width: 100%;"/>\r
`,Oe=`Fecha: 01/02/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Cabayo De Troya\r
\r
<img src="/images/caballoDeTroya.jpg" style="width: 100%;"/>\r
`,ke=`Fecha: 04/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Constructora Latinco S.A.\r
\r
<img src="/images/constructoraLatinco.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/constructoraLatinco1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/constructoraLatinco2.jpg" style="width: 100%;" />\r
<hr>\r
<img src="/images/constructoraLatinco3.jpg" style="width: 100%;"/>\r
`,Ae=`Fecha: 01/03/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Galletas Marce\r
\r
<img src="/images/galletasMarce.jpg" style="width: 100%;"/>\r
`,je=`Fecha: 07/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Hotel La Naval\r
\r
<img src="/images/hotelLaNaval.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/hotelLaNaval1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/hotelLaNaval2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/hotelLaNaval3.jpg" style="width: 100%;"/>\r
`,Me=`Fecha: 01/01/2016\r
---\r
tags: Integración CMS Joomla\r
---\r
\r
# Arquitectura y Concreto\r
\r
<img src="/images/arquitectura.png" style="width: 100%;"/>\r
\r
Herramienta web (Backend y Frontend) para la empresa Arquitectura y Concreto, dedicada a la construcción, comercialización y gerencia de proyectos inmobiliarios de índole institucional, pública, comercial, empresarial, turística y residencial.\r
\r
Tecnologias: Web Services SOAP, Html, Javascript, Php, MySql, Google maps, Bootstrap, Joomla.\r
\r
* Herramienta web integrada con CMR Vtiger.\r
* Herramienta web integrada con CMS Joomla.\r
* Formularios avanzados y filtros para sistema post-venta.\r
* Formularios avanzados y filtros para sistema prospectos.\r
* Formularios avanzados y filtros para sistema de quejas, reclamos y felicitaciones.\r
* Pagina web con catalogo de proyectos a nivel nacional.\r
* Buscador de proyectos con filtros avanzados.\r
* Perfiles de proyectos con información general, ubicación geo-referenciada en google maps con puntos cercanos destacados totalmente interactivos.\r
* Administracion avanzada de registros fotográficos (Proyectos, avances, planos, plantas).\r
* Administracion avanzada de informacion general y fichas tecnicas.\r
`,Ne=`Fecha: 01/03/2016\r
---\r
tags: Integración CMS Joomla E-commerce\r
---\r
\r
# Colchones Fantasia\r
\r
<img src="/images/colchonesFantasia.png" style="width: 100%;"/>\r
\r
(Backend y Frontend) Maquetación web, e-commerce y creación de sistema de envíos a la medida. \r
\r
Tecnologias: Php, Html, Javascript, MySql, Virtuemart y modulo de envios personalizado. Todo integrado como CMS JOOMLA. \r
`,Pe=`Fecha: 01/02/2016\r
---\r
tags: Integración CMS Joomla E-commerce\r
---\r
\r
# Tienda Virtual Durespo\r
\r
<img src="/images/ecomerceDurespo.jpg" style="width: 100%;"/>\r
`,Fe=`Fecha: 01/01/2017\r
---\r
tags: Integración CMS Joomla\r
---\r
\r
# Lumes Ingenieria\r
\r
<img src="/images/lumesIngenieria.jpg" style="width: 100%;"/>\r
`,Ie=`Fecha: 06/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Motel Las Palmas\r
\r
<img src="/images/motelLasPalmas.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/motelLasPalmas1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/motelLasPalmas2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/motelLasPalmas3.jpg" style="width: 100%;"/>\r
\r
`,Le=`Fecha: 09/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Papeleria Portafolio\r
\r
<img src="/images/portafolio.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/portafolio1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/portafolio2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/portafolio3.jpg" style="width: 100%;"/>\r
`,Re=`Fecha: 05/01/2017\r
---\r
tags: CMS Joomla E-commerce\r
---\r
\r
# Restaurante Entremaderos\r
\r
<img src="/images/entremaderos1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/entremaderos2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/entremaderos3.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/entremaderos4.jpg" style="width: 100%;"/>\r
`,ze=`Fecha: 08/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Restaurante FreshCircus\r
\r
<img src="/images/freshCircus.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/freshCircus1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/freshCircus2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/freshCircus3.jpg" style="width: 100%;"/>\r
`,Be=`Fecha: 10/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Restaurante Parmesano\r
\r
<img src="/images/parmesano.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/parmesano2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/parmesano3.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/parmesano4.jpg" style="width: 100%;"/>\r
`,Ve=`Fecha: 01/05/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Restaurante Sancho Paisa\r
\r
<img src="/images/sanchoPaisa.jpg" style="width: 100%;"/>\r
`,He=`Fecha: 13/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Restaurante TodoFresa\r
\r
<img src="/images/todofresa.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/todofresa1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/todofresa2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/todofresa3.jpg" style="width: 100%;"/>\r
`,Ue=`Fecha: 12/01/2017\r
---\r
tags: CMS Joomla\r
---\r
\r
# Soluciones Massol\r
\r
<img src="/images/remaster.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/remaster1.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/remaster2.jpg" style="width: 100%;"/>\r
<hr>\r
<img src="/images/remaster3.jpg" style="width: 100%;"/>\r
`,We=`Fecha: 11/01/2017\r
---\r
tags: CMS Joomla E-commerce\r
---\r
\r
# Tienda Makeno\r
\r
<img src="/images/tiendaMakeno.jpg" style="width: 100%;"/>\r
`,Ge=`Fecha: 02/01/2017\r
---\r
tags: CMS Joomla PHP\r
---\r
\r
# TAG36 Medellin\r
\r
<img src="/images/paintball-Tag36.png" style="width: 100%;"/>\r
`,Ke=`Fecha: 10/03/2020\r
---\r
tags: Trucos Linux\r
---\r
\r
# Cómo instalar un certificado SSL gratis en Ubuntu Server\r
\r
Paso a paso para instalar un certificado SSL gratis en servidor web ubuntu\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
Instalamos Certbot\r
\`\`\`csharp\r
sudo apt-get update\r
sudo apt-get install software-properties-common\r
sudo add-apt-repository universe\r
sudo add-apt-repository ppa:certbot/certbot\r
sudo apt-get update\r
sudo apt-get install certbot python-certbot-apache -y\r
\`\`\`\r
`,qe=`Fecha: 13/03/2020\r
---\r
tags: Tutoriales Linux\r
---\r
\r
# Cómo instalar IDE VSCode en Ubuntu Server\r
\r
Paso a paso para instalar el IDE de desarrollo VSCode y correrlo directamente en la nube desde una URL en un Servidor Linux Ubuntu alojado en Amazon AWS\r
\r
En [mi canal de youtube](https://youtu.be/tWzzzGoNEq4) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
cd bin\r
sudo wget https://github.com/cdr/code-server/releases/download/2.1698/code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz\r
sudo tar xvzf code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz\r
\r
cd code-server2.1698-vsc1.41.1-linux-x86_64\r
sudo mv code-server /bin\r
cd ..\r
sudo rm -rf code-server2.1698-vsc1.41.1-linux-x86_64.tar.gz\r
sudo rm -rf code-server2.1698-vsc1.41.1-linux-x86_64\r
sudo code-server\r
\`\`\`\r
`,Je=`Fecha: 13/10/2020\r
---\r
tags: Trucos\r
---\r
\r
# Cómo activar filtros en WISH\r
\r
Paso a paso para activar los filtros en la pagina de WISH, que por algun motivo no los tiene disponibles para filtar el historial de pedidos en la version web.\r
\r
En [mi canal de youtube](https://youtu.be/07tvORy7cOw) hay un video del paso a paso:\r
\r
1. Entrar a WISH\r
2. Entrar al historial de pedidos\r
3. Inspeccionar la pagina\r
4. Ver en version movil\r
5. Usar los filtros\r
6. Cerrar inspeccionador de codigo\r
`,Ye=`Fecha: 28/09/2019\r
---\r
tags: Trucos Windows\r
---\r
\r
# Quitar | Desactivar alerta de HP Client Security\r
\r
Paso a paso para lograr Quitar | Desactivar alerta de HP Client Security:\r
Al instalar todos los drivers en un portatil HP necesarios para activar la huella digital y poder iniciar sesión sin necesidad de escribir una contraseña ... empieza a salir un molesto mensaje de alerta que hasta el día en que escribo este post, no existe manera de quitarlo por configuración. \r
\r
La única opción que encontré para desactivar esta molesta alerta fue forzarlo por medio de un archivo de configuración que modifique el registro de Windows.\r
\r
La solución es muy rápida, pues cuenta solo con dos pasos.\r
\r
En [mi canal de youtube](https://youtu.be/fp5xfIOVwR8) hay un video del paso a paso:\r
\r
\`\`\`\r
Windows Registry Editor Version 5.00\r
\r
[HKEY_CURRENT_USER\\Software\\DigitalPersona\\Applications\\OTAppSettings]\r
"ShowTrainingPrompt"=dword:00000000\r
\r
[HKEY_CURRENT_USER\\Software\\DigitalPersona\\Applications\\OTAppSettings\\BrowserIntegration]\r
"Firefox_notice"="-1"\r
"Chrome_notice"="-1"\r
\`\`\`\r
1. Se crea un archivo de texto con las lineas anteriores\r
2. Se abre el registro de windows\r
3. Se importa el archivo\r
`,Xe=`Fecha: 08/03/2021\r
---\r
tags: Trucos Error CMS WordPress\r
---\r
\r
# Cómo arreglar el error Memory Exhausted de WordPress en WP Engine\r
\r
Un par de lineas necesarias para arreglar en WordPress el error Memory Exhausted, o en otras palabras como incrementar la memoria de PHP (Increase PHP Memory) y en este caso lo haremos a un sitio web que esta alojado en la plataforma WP Engine. Los pasos son utiles para cualquier pagina web en wordpress y en cualquier hosting.\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
Debemos buscar el archivo "wp-config.php" y agregar las siguientes lineas\r
\r
\`\`\`php\r
define('WP_MEMORY_LIMIT', '256M');\r
define( 'WP_MAX_MEMORY_LIMIT', '512M' );\r
\`\`\`\r
`,Ze=`Fecha: 20/03/2019\r
---\r
tags: Error VirtualBox Linux Windows\r
---\r
\r
# Resize Disk - VirtualBox - Linux - Windows\r
\r
<p>Dos sencillos pasos para ampliar el disco de virtualbox desde Linux para Windows.</p>\r
<p>En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso: </p>\r
\r
\`\`\`csharp\r
vboxmanage modifyhd "/home/ochoa/VirtualBox VMs/win10/win10.vdi" --resize 102400\r
\`\`\`\r
y en windows:\r
\r
1. Click derecho sobre el boton de inicio\r
2. Administración de discos\r
3. Click derecho extender volumen\r
`,Qe=`Fecha: 14/01/2022\r
---\r
tags: Error CSharp Framework Trucos NetCore\r
---\r
\r
# Cómo arreglar error ciclos objetos para NetCore 5\r
\r
Paso a paso para arreglar el error "System.Text.Json.JsonException: A possible object cycle was detected. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32. Consider using ReferenceHandler.Preserve on JsonSerializerOptions to support cycles." para .NetCore 5\r
\r
En [mi canal de youtube](https://youtu.be/EbKw0Dcaf6o) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
services.AddControllers().AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);\r
\`\`\`\r
`,$e=`Fecha: 17/08/2023\r
---\r
tags: Tutoriales AWS Node\r
---\r
\r
# Cómo enviar un topic a AWS IOT con Node.js\r
\r
\r
Codigo paso a paso para conectar y enviar un topic a AWS IOT usando Node.js.\r
\r
En [mi canal de youtube](https://youtu.be/AQay6bFg7jU) hay un video del paso a paso:\r
\r
1. Creamos un objeto en AWS y descargamos el código de ejemplo\r
\r
2. Creamos un proyecto node\r
- npm init\r
\r
3. Agregamos archivo:\r
- index.js\r
  \r
4. instalamos libreria \r
- npm i aws-iot-device-sdk\r
\r
5. Ingresamos el codigo node:\r
\r
\`\`\`react\r
const awsIot = require('aws-iot-device-sdk');\r
\r
const today = new Date();\r
const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();\r
const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();\r
const dateTime = date + ' ' + time;\r
const topic = "topic"\r
\r
const device = awsIot.device({\r
    clientId: 'clientId',\r
    host: 'host',\r
    port: 8883,\r
    keyPath: './private.key',\r
    certPath: './cert.pem',\r
    caPath: './CA.crt',\r
});\r
\r
const IoTDevice = {\r
    serialNumber: "SN-D7F3C8947867",\r
    dateTime,\r
    activated: true,\r
    device: "MyRaspperry-01",\r
    type: "MySmartIoTDevice",\r
    payload: {}\r
}\r
\r
const getSensorData = (cb) => getDummySensorData(cb);\r
\r
const getDummySensorData = (cb) => {\r
    const temperatureData = { temp: '100°C', humidity: '52%' }\r
    return cb(temperatureData)\r
}\r
\r
const sendData = (data) => {\r
    const telemetryData = {\r
        ...IoTDevice,\r
        payload: data\r
    }\r
    console.log(\`STEP - Sending data to AWS  IoT Core'\`, telemetryData)\r
    console.log(\`---------------------------------------------------------------------------------\`)\r
    return device.publish(topic, JSON.stringify(telemetryData))\r
}\r
\r
device\r
    .on('connect', function () {\r
        console.log('STEP - Connecting to AWS  IoT Core');\r
        console.log(\`---------------------------------------------------------------------------------\`)\r
        setInterval(() => getSensorData(sendData), 3000)\r
\r
    });\r
\r
device\r
    .on('message', function (topic, payload) {\r
        console.log('message', topic, payload.toString());\r
    });\r
\r
device\r
    .on('error', function (topic, payload) {\r
        console.log('Error:', topic, payload.toString());\r
    });\r
\`\`\`\r
`,et=`Fecha: 20/05/2021\r
---\r
tags: Error Trucos Node Framework\r
---\r
\r
# Cómo solucionar regenerator runtime error nodejs\r
\r
Un par de lineas necesarias para solucionar el error de node.js (ReferenceError: regeneratorRuntime is not defined) que se presenta cuando se usa Babel.\r
\r
En [mi canal de youtube](https://youtu.be/5Kk3DcBNROE) hay un video del paso a paso:\r
\r
\`\`\`\r
npm install -D\xA0 @babel/plugin-transform-runtime\r
npm install @babel/runtime\r
\`\`\`\r
Agregar al archivo .babelrc\r
\`\`\`react\r
"plugins": [\r
    ["@babel/plugin-transform-runtime",\r
      {\r
        "regenerator": true\r
      }\r
    ]\r
  ],\r
\`\`\`\r
`,tt=`Fecha: 02/12/2018\r
---\r
tags: Forex Inversiones Links\r
---\r
\r
# Bonos sin deposito en brokers de Forex\r
\r
A continuación les dejo una URL que recopila los brokers que dan bonos de bienvenida sin necesidad de hacer deposito, algunos solo requieren que confirmemos la cuenta.\r
\r
[https://www.bestfxbonus.com/es/forex-no-deposit-bonus.html](https://www.bestfxbonus.com/es/forex-no-deposit-bonus.html)\r
`,nt=`Fecha: 20/12/2018\r
---\r
tags: Tutoriales Laravel Framework PHP\r
---\r
\r
# Instalación Cloud9 Laravel 5.7\r
\r
A continuación describo linea a linea lo que hay que hacer en la consola para tener en menos de 10 minutos un proyecto Laravel 5.7 corriendo en Cloud9.\r
\r
En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso: \r
\r
\r
\`\`\`\r
# Clear existing files\r
#\r
rm hello-world.php php.ini README.md\r
\r
# Install and configure PHP 7.1 Ondrej Repository\r
#\r
sudo add-apt-repository ppa:ondrej/php -y\r
sudo apt-get update\r
sudo apt-get install libapache2-mod-php7.1 -y\r
sudo a2dismod php5\r
sudo a2enmod php7.1\r
sudo apt-get install php7.1-curl php7.1-cli php7.1-dev php7.1-gd php7.1-intl php7.1-mcrypt php7.1-json php7.1-mysql php7.1-opcache php7.1-bcmath php7.1-mbstring php7.1-soap php7.1-xml php7.1-zip -y\r
\r
#Install Laravel\r
#\r
sudo composer global require 'laravel/installer'\r
export PATH=~/.composer/vendor/bin:$PATH\r
sudo chown -R $USER $HOME/.composer\r
laravel new \r
rm -rf ./composer\r
\r
#Configure public folder\r
#\r
printf '%s\\n' ':%s/DocumentRoot\\ \\/home\\/ubuntu\\/workspace/DocumentRoot\\ \\/home\\/ubuntu\\/workspace\\/public/g' 'x'  | sudo ex /etc/apache2/sites-enabled/001-cloud9.conf\r
\r
#Select and install the mysql version 5.7 or up\r
#\r
wget https://dev.mysql.com/get/mysql-apt-config_0.8.9-1_all.deb\r
sudo dpkg -i mysql-apt-config_0.8.9-1_all.deb\r
sudo service apache2 restart\r
sudo apt-get update\r
sudo apt-get install mysql-server -y \r
sudo service  mysql restart \r
sudo mysql_upgrade\r
\r
#Configure database and .env file database=laravel, user=root, no password\r
#\r
sudo mysql --user="root" -e "CREATE DATABASE laravel character set UTF8mb4 collate utf8mb4_bin;"\r
printf '%s\\n' ':%s/DB_DATABASE=homestead/DB_DATABASE=laravel/g' 'x'  | sudo ex .env\r
printf '%s\\n' ':%s/DB_USERNAME=homestead/DB_USERNAME=root/g' 'x'  | sudo ex .env\r
printf '%s\\n' ':%s/DB_PASSWORD=secret/DB_PASSWORD=/g' 'x'  | sudo ex .env\r
\r
#Artisan auth scaffolding and migration\r
#\r
php artisan make:auth\r
php artisan migrate\r
\r
#remove laravel installer\r
#\r
rm -rf laravel.sh\r
rm -rf mysql-apt-config_0.8.9-1_all.deb\r
\r
\`\`\`\r
`,rt=`Fecha: 01/11/2022\r
---\r
tags: Trucos Linux\r
---\r
\r
# Cómo agregar templates turnkey a proxmox\r
\r
Comando de consola para lograr agregar los contenedores de turnkey al administrador de maquinas virtuales Proxmox.\r
\r
En [mi canal de youtube](https://youtu.be/x2nCjLq2KLE) hay un video del paso a paso:\r
\r
* Ingresamos a nuestro panel de control de Proxmox\r
* Ingresamos a nuestro servidor\r
* Ingresamos al Shell\r
* Copiamos y pegamos el siguiente comando\r
\r
\`\`\`csharp\r
pveam update\r
\`\`\`\r
`,it=`Fecha: 15/07/2021\r
---\r
tags: Error Framework CSharp NetCore Trucos\r
---\r
\r
# Solucionar problema CORS en .Net Core 5\r
\r
Un par de lineas para solucionar el problema de CORS en API .Net Core 5\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
- Poner en el archivo startup en la seccion de servicios\r
\`\`\`csharp\r
services.AddCors(options =>\r
{\r
    options.AddDefaultPolicy(builder => { \r
        builder\r
        .AllowAnyOrigin()\r
        .AllowAnyHeader()\r
        .AllowAnyMethod(); \r
    });\r
});\r
\`\`\`\r
\r
- Poner en el archivo startup en la seccion de aplicaciones\r
\`\`\`csharp\r
app.UseCors();\r
\`\`\`\r
`,at=`Fecha: 04/01/2022\r
---\r
tags: Trucos Flutter Framework Links\r
---\r
\r
# Cómo buscar y encontrar librerias flutter\r
\r
Una página web para buscar librerias Flutter\r
\r
En [mi canal de youtube](https://youtu.be/DHhiFybG-Mg) hay un video del paso a paso:\r
\r
<a target="_blank" href="{{ page.link }}">https://fluttergems.dev/</a> \r
`,ot=`Fecha: 26/04/2022\r
---\r
tags: Tutoriales Linux Docker\r
---\r
\r
# Cómo instalar docker en Raspbian linux\r
\r
Paso a paso para tener docker instalado junto con un administrador visual de contenedores en una Raspberry Pi.\r
\r
En [mi canal de youtube](https://youtu.be/EbKw0Dcaf6o) hay un video del paso a paso:\r
\r
Instalar docker\r
\`\`\`csharp\r
sudo apt update\r
sudo apt upgrade\r
sudo apt install raspberrypi-kernel raspberrypi-kernel-headers\r
curl -sSL https://get.docker.com | sh\r
sudo usermod -aG docker pi\r
sudo reboot\r
docker version\r
\`\`\`\r
\r
Instalar Portainer\r
\`\`\`csharp\r
docker run -itd -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /docker/portainer:/data portainer/portainer-ce\r
localhost:9000\r
docker ps\r
\`\`\`\r
`,st=`Fecha: 01/11/2022\r
---\r
tags: Tutoriales Linux Windows\r
---\r
\r
# Cómo instalar windows en proxmox\r
\r
Paso a paso para poder instalar una maquina virtual windows en Proxmox.\r
\r
En [mi canal de youtube](https://youtu.be/At5CpVwy-iY) hay un video del paso a paso:\r
\r
* Descargar ISO Windows y agregarlo a Proxmox\r
* Descargar ISO <a target="_blank" href="{{ page.link }}">Windows VirtIO Drivers</a> y agregarlo a Proxmox\r
* Crear maquina virtual\r
* System = Qemu\r
* Hard Disck = SCSI - cache write back\r
* CPU = 4 cores\r
* Network = VirtIO\r
* Montar CDRoom con ISO VirtIO\r
* Cargar drivers para instalacion desde el CDRoom\r
* Instalar drivers del controlador desde el CDRoom\r
* Instalar Guest Agent\r
`,ct=`Fecha: 01/01/2020\r
---\r
tags: Trucos Video\r
---\r
\r
# Cómo saber el nombre de un video bloqueado o borrado de youtube\r
\r
Paso a paso de cómo saber el nombre de un video borrado o bloqueado en una lista de reproducción en youtube.\r
\r
En [mi canal de youtube](https://youtu.be/5JCQUHk7rP4) hay un video del paso a paso:\r
\r
1. Buscar y dar clic en el video bloqueado o borrado\r
2. Copiar la URL del video donde esta el código\r
3. Abrir google\r
4. Pegar la url del video y darle buscar\r
5. Revisar los resultado en busqueda del nombre del video\r
6. Copio el nombre del video en youtube y vuelvo a agregarlos a mi lista de reproducción\r
`,lt=`Fecha: 28/02/2019\r
---\r
tags: Tutoriales Linux\r
---\r
\r
# Instalación Theme Arc-Dark Linux Mint\r
\r
A continuación describo los comandos de consola SSH para instalar en menos de 5 minutos el Theme Arc-Dark para Linux Mint.\r
\r
En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
sudo rm -rf /usr/share/themes/{Arc,Arc-Darker,Arc-Dark}\r
rm -rf ~/.local/share/themes/{Arc,Arc-Darker,Arc-Dark}\r
rm -rf ~/.themes/{Arc,Arc-Darker,Arc-Dark}\r
\r
sudo apt-get install autoconf automake pkg-config libgtk-3-dev\r
git clone https://github.com/horst3180/arc-theme --depth 1 && cd arc-theme\r
\r
./autogen.sh --prefix=/usr\r
sudo make install\r
\`\`\`\r
`,ut=`Fecha: 30/06/2021\r
---\r
tags: Trucos BaseDeDatos\r
---\r
\r
# Cómo eliminar todas las tablas SQL\r
\r
Código SQL para eliminar todas las tablas de una base de datos SQL sin eliminar la base de datos\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
\`\`\`sql\r
DECLARE @sql NVARCHAR(max)=''\r
\r
SELECT @sql += ' Drop table ' + QUOTENAME(TABLE_SCHEMA) + '.'+ QUOTENAME(TABLE_NAME) + '; '\r
FROM   INFORMATION_SCHEMA.TABLES\r
WHERE  TABLE_TYPE = 'BASE TABLE'\r
\r
Exec Sp_executesql @sql\r
\`\`\`\r
`,dt=`Fecha: 20/06/2021\r
---\r
tags: Trucos Javascript\r
---\r
\r
# Cómo listar contactos inactivos de facebook\r
\r
Codigo javascript que nos permite listar todos los contactos inactivos de facebook y despues poder borrarlos\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
\`\`\`javascript\r
let segundos = 0;\r
\r
function hacerScrollUnMinuto() {\r
if(segundos < 10) {\r
segundos++\r
window.scrollBy(0, 1000)\r
setTimeout(hacerScrollUnMinuto, 1000)\r
}\r
}\r
function mostrarInactivos() {\r
let activos = document.querySelectorAll('.right[data-store*=is_deactivated\\\\"\\\\:false')\r
activos.forEach(p => p.parentElement.parentElement.parentElement.parentElement.remove())\r
window.scrollBy(0, 1000)\r
}\r
\`\`\`\r
`,ft=`Fecha: 07/04/2020\r
---\r
tags: Trucos Framework React\r
---\r
\r
# Cómo arreglar dependencias NPM package.json\r
\r
Paso a paso para arreglar las dependencias registradas en el package.json y poder correr los proyectos correctamente\r
\r
En [mi canal de youtube](https://youtu.be/ut9QZQX2_as) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
//Instalamos\r
npm i -g npm-check-updates\r
\r
//ejecutamos\r
ncu -u\r
\`\`\`\r
`,pt=`Fecha: 11/11/2023\r
---\r
tags: Tutoriales AWS Framework CSharp NetCore\r
---\r
\r
# Cómo hacer deploy App Net Core en AWS\r
\r
\r
Código paso a paso para desplegar un proyecto API Net Core en AWS Elastic Beanstalk.\r
\r
En [mi canal de youtube](https://youtu.be/9yIJg7i-Xxo) hay un video del paso a paso:\r
\r
1. Crear Aplicación Elastic Beanstalk\r
- Application Name / Enviroment / Domain / Platform Linux\r
- Create Service Role\r
- Create EC2 Intance Profile / IAM\r
- Create Role / AWS Service / UseCase = EC2\r
- Add Policies = WebTier / WorkerTier / MulticontainerDocker\r
- VPC / Public IP Address = Activated / Instance Subnets \r
- EC2 Security Gropus = default\r
 \r
2. Configurar Visual Studio\r
- Crear Usuario / Crear Grupo / Crear Role = administrator\r
- Descargar e Instalar = AWS Toolkit for Visual Studio\r
- Crear perfil / Access Key / Secret Key\r
`,mt=`Fecha: 08/04/2021\r
---\r
tags: Error Trucos Next Framework GitHub\r
---\r
\r
# Cómo hacer Deploy de una app next.js en Heroku\r
\r
Un par de lineas necesarias para poder hacer deploy correctamente de una aplicación next.js desde Github a Heroku.\r
\r
En [mi canal de youtube](https://youtu.be/5Kk3DcBNROE) hay un video del paso a paso:\r
\r
\`\`\`react\r
"start": "next start -p $PORT",\r
"heroku-postbuild": "npm run build"\r
\`\`\`\r
`,ht=`Fecha: 26/12/2024\r
---\r
tags: Tutoriales React Framework GitHub\r
---\r
\r
# Cómo desplegar una app React + Vite a Github Pages\r
\r
\r
Código paso a paso para hacer un deploy de una aplicación React + Vite en Github Pages.\r
\r
En [mi canal de youtube](https://youtu.be/QZ7y90shOPY) hay un video del paso a paso:\r
--- \r
1 Creamos un proyecto React + Vite \r
\`\`\`react\r
npm create vite@latest\r
\`\`\`\r
\r
2 Creamos un repositorio en Github\r
\r
3 Iniciamos y configuramos el git en el nuevo proyecto\r
\r
4 Agregamos al package.json\r
\`\`\`react\r
"homepage": "https://juandavid.site/reactapp" \r
"predeploy":"npm run build",\r
"deploy":"gh-pages -d dist",\r
\`\`\`\r
\r
5 Agregamos al vite.config.ts\r
\`\`\`react\r
base: "https://juandavid.site/reactapp"\r
\`\`\`\r
\r
6 Instalamos libreria gh-pages\r
\`\`\`react\r
pnpm add gh-pages -D\r
\`\`\`\r
\r
7 Ejecutamos\r
\`\`\`react\r
npm run deploy\r
\`\`\`\r
`,gt=`Fecha: 04/09/2023\r
---\r
tags: Tutoriales AWS Framework React\r
---\r
\r
# Cómo hacer deploy de react.js en AWS\r
\r
\r
Código paso a paso para desplegar un proyecto React.JS en AWS Elastic Beanstalk.\r
\r
En [mi canal de youtube](https://youtu.be/YmArl7GQqCc) hay un video del paso a paso:\r
\r
1. Crear S3\r
- Block all public access\r
- Properties / Static website hosting / index.html\r
- Bucket policy / S3 / GetObject\r
- "Principal": "*"\r
 \r
2. Crear proyecto Reat.JS\r
- npx create-react-app reactapp\r
- npm run build\r
    \r
4. Hacer deploy\r
- login en aws\r
- https://aws.amazon.com/es/cli/\r
- aws --version\r
- aws configure\r
\`\`\`csharp\r
Default region name [None]: us-west-2\r
Default output format [None]: json\r
\`\`\`   \r
- aws s3 sync build/ s3://reactapp-bucket\r
`,_t=`Fecha: 15/10/2020\r
---\r
tags: Trucos Windows \r
---\r
\r
# Cómo descargar ISO windows 10 desde Microsoft\r
\r
Paso a paso para descargar el ISO original de windows 10 desde Microsoft\r
\r
En [mi canal de youtube](https://youtu.be/SUPPpapA3lg) hay un video del paso a paso:\r
\r
1. Buscar en google "windows 10 iso"\r
2. Entrar en la primera respuesta que es la pagina original de Microsoft\r
3. Inspeccionar la pagina\r
4. Ver en version movil\r
5. Simular Ipad\r
6. Seleccionar edicción e idioma\r
7. Seleccionar 32bit o 64bit\r
`,vt=`Fecha: 14/02/2026\r
---\r
tags: Tutoriales Linux\r
---\r
\r
# Cómo ejecutar un proyecto Jekyll localmente\r
\r
\r
Paso a paso para correr un proyecto Jeckyll localmente y poder editarlo.\r
\r
En [mi canal de youtube](https://youtu.be/WRT0RgIEXus) hay un video del paso a paso:\r
\r
1. Crear archivo docker-compose.yaml\r
\`\`\`csharp\r
services:\r
  jekyll:\r
    image: jekyll/jekyll\r
    command: jekyll serve --watch --host 0.0.0.0\r
    ports:\r
"4000:4000"\r
    volumes:\r
.:/srv/jekyll\r
\`\`\`\r
`,yt=`Fecha: 01/02/2020\r
---\r
tags: Trucos Windows\r
---\r
\r
# Cómo descargar e instalar drivers facil y rápido\r
\r
Paso a paso para bajar aplicativo que analiza nuestro equipo y automaticamente baja los drivers y los instala por nosotros. Adicional a esto tiene un paquete extenso de programas muy útiles, herramientas de administracion, seguridad y otros que pueden ser instalados al tiempo\r
\r
En [mi canal de youtube](https://youtu.be/GJ-GbLifU2Q) hay un video del paso a paso:\r
\r
1. Ingresar a la página: <a target="_blank" href="https://driverpack.io/es">https://driverpack.io/es</a>\r
2. Descargar instalador .exe\r
3. Activar modo experto\r
4. Activar o desactivar programas y/o drivers\r
5. Instalar y reiniciar el equipo\r
`,bt=`Fecha: 23/09/2019\r
---\r
tags: CSharp\r
---\r
\r
# Encriptación factura electrónica AES\r
\r
Este tutorial es un código muy simple para encriptar los números de facturas electrónicas y poderlas bajar en PDF desde la plataforma de CADENA\r
\r
En [mi canal de youtube](https://youtu.be/Sp00ZqfBnM4) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
private static readonly int tamanyoClave = 32;\r
private static readonly int tamanyoVector = 16;\r
// Define la palabra clave para el cifrado y\r
private static readonly string Clave = "Cadena_clave_para_cifrar";\r
private static readonly string Vector = "m2PCs0Ju9m1u3AIPkO3RUQ==";\r
// se convierte el vector y la key a bytes\r
public static byte[] Key = SHA256.Create().ComputeHash(Encoding.UTF8.GetBytes(Clave));\r
public static byte[] IV = Convert.FromBase64String(Vector);\r
\r
Array.Resize(ref Key, tamanyoClave);\r
Array.Resize(ref IV, tamanyoVector);\r
Rijndael RijndaelAlg = Rijndael.Create();\r
MemoryStream memoryStream = new MemoryStream();\r
CryptoStream cryptoStream = new CryptoStream(memoryStream, RijndaelAlg.CreateEncryptor(Key, IV), CryptoStreamMode.Write);\r
byte[] txtPlanoBytes = UTF8Encoding.UTF8.GetBytes(txtPlano);\r
cryptoStream.Write(txtPlanoBytes, 0, txtPlanoBytes.Length);\r
cryptoStream.FlushFinalBlock();\r
byte[] cipherMessageBytes = memoryStream.ToArray();\r
memoryStream.Close();\r
cryptoStream.Close();\r
var numeroDeFacturaEncriptado = Convert.ToBase64String(cipherMessageBytes);\r
\`\`\`\r
`,xt=`Fecha: 01/07/2021\r
---\r
tags: CSharp Framework NetCore\r
---\r
\r
# Cómo instalar EntityUser y JWT NetCore 5\r
\r
Paso a paso para instalar el servicio EntityUser que trae por defecto .Net Core 5 y activar JWT para el login de usuarios desde un front-end\r
\r
En [mi canal de youtube](https://youtu.be/EbKw0Dcaf6o) hay un video del paso a paso:\r
\r
- Crear la carpeta Models\r
- Crear el modelo: ApplicationUser\r
\`\`\`csharp\r
public class ApplicationUser : IdentityUser\r
{\r
}\r
\`\`\`\r
- Crear un modelo de prueba\r
- Crear un controlador de prueba para el modelo de prueba\r
- Renombrar el DbContext por: ApplicationDbContext\r
- Actualizar el DbContext\r
\r
\`\`\`csharp\r
: IdentityDbContext<ApplicationUser>\r
\`\`\`\r
\r
- Actualizar el ConnectionString\r
- Actualizar dependencias\r
- Crear migracion\r
- Actualizar base de datos\r
- Crear modelo: RegisterModel\r
\r
\`\`\`csharp\r
[Required(ErrorMessage ="User Name is required")]\r
public string Username { get; set; }\r
\r
[EmailAddress]\r
[Required(ErrorMessage = "Email is required")]\r
public string Email { get; set; }\r
\r
[Required(ErrorMessage = "Password is required")]\r
public string Password { get; set; }\r
\`\`\`\r
\r
- Crear modelo: LoginModel\r
\r
\`\`\`csharp\r
[Required(ErrorMessage = "User Name is required")]\r
public string Username { get; set; }\r
\r
[Required(ErrorMessage = "Password is required")]\r
public string Password { get; set; }\r
\`\`\`\r
\r
- Crear el controlador: AccountController\r
- Agregar el constructor al controlador\r
\r
\`\`\`csharp\r
private readonly UserManager<ApplicationUser> userManager;\r
private readonly RoleManager<IdentityRole> roleManager;\r
private readonly IConfiguration _configuration;\r
\r
public AccountController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)\r
{\r
    this.userManager = userManager;\r
    this.roleManager = roleManager;\r
    _configuration = configuration;\r
}\r
\`\`\`\r
\r
- Agregar el metodo registrar dentro del controlador\r
\r
\`\`\`csharp\r
[HttpPost]\r
[Route("register")]\r
public async Task<IActionResult> Register([FromBody] RegisterModel model)\r
{\r
    var userExists = await userManager.FindByNameAsync(model.Username);\r
    if (userExists != null)\r
        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User already exists!" });\r
\r
    ApplicationUser user = new ApplicationUser()\r
    {\r
        Email = model.Email,\r
        SecurityStamp = Guid.NewGuid().ToString(),\r
        UserName = model.Username\r
    };\r
    var result = await userManager.CreateAsync(user, model.Password);\r
    if (!result.Succeeded)\r
        return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = "User creation failed! Please check user details and try again." });\r
\r
    return Ok(new Response { Status = "Success", Message = "User created successfully!" });\r
}\r
\`\`\`\r
\r
- Agregar en metodo login dentro del controlador\r
\r
\`\`\`csharp\r
[HttpPost]\r
[Route("login")]\r
public async Task<IActionResult> Login([FromBody] LoginModel model)\r
{\r
    var user = await userManager.FindByNameAsync(model.Username);\r
    if (user != null && await userManager.CheckPasswordAsync(user, model.Password))\r
    {\r
        var userRoles = await userManager.GetRolesAsync(user);\r
\r
        var authClaims = new List<Claim>\r
        {\r
            new Claim(ClaimTypes.Name, user.UserName),\r
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),\r
        };\r
\r
        foreach (var userRole in userRoles)\r
        {\r
            authClaims.Add(new Claim(ClaimTypes.Role, userRole));\r
        }\r
\r
        var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));\r
\r
        var token = new JwtSecurityToken(\r
            issuer: _configuration.GetSection("JWT:ValidIssuer").Value,\r
            audience: _configuration.GetSection("JWT:ValidAudience").Value,\r
            expires: DateTime.Now.AddHours(3),\r
            claims: authClaims,\r
            signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)\r
        );\r
\r
        return Ok(new\r
        {\r
            token = new JwtSecurityTokenHandler().WriteToken(token),\r
            expiration = token.ValidTo\r
        });\r
    }\r
    return Unauthorized();\r
}\r
\`\`\`\r
\r
- Agregamos los servicios en startup\r
\r
\`\`\`csharp\r
// For Identity\r
services.AddIdentity<ApplicationUser, IdentityRole>()\r
.AddEntityFrameworkStores<ApplicationDbContext>()\r
.AddDefaultTokenProviders();\r
\r
// Adding Authentication\r
services.AddAuthentication(options =>\r
{\r
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;\r
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;\r
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;\r
})\r
\r
// Adding Jwt Bearer\r
.AddJwtBearer(options =>\r
{\r
    options.SaveToken = true;\r
    options.RequireHttpsMetadata = false;\r
    options.TokenValidationParameters = new TokenValidationParameters()\r
    {\r
        ValidateIssuer = true,\r
        ValidateAudience = true,\r
        ValidAudience = Configuration.GetSection("JWT:ValidAudience").Value,\r
        ValidIssuer = Configuration.GetSection("JWT:ValidIssuer").Value,\r
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration.GetSection("JWT:SecretKey").Value))\r
    };\r
});\r
\`\`\`\r
\r
- Actualizamos el servicio de Swagger en startup\r
\r
\`\`\`csharp\r
services.AddSwaggerGen(swagger =>\r
{\r
    //This is to generate the Default UI of Swagger Documentation\r
    swagger.SwaggerDoc("v1", new OpenApiInfo\r
    {\r
        Version = "v1",\r
        Title = "ASP.NET 5 Web API",\r
        Description = "Authentication and Authorization in ASP.NET 5 with JWT and Swagger"\r
    });\r
    // To Enable authorization using Swagger (JWT)\r
    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()\r
    {\r
        Name = "Authorization",\r
        Type = SecuritySchemeType.ApiKey,\r
        Scheme = "Bearer",\r
        BearerFormat = "JWT",\r
        In = ParameterLocation.Header,\r
        Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\\r\\n\\r\\nExample: \\"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\\"",\r
    });\r
    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement\r
    {\r
        {\r
            new OpenApiSecurityScheme\r
            {\r
                Reference = new OpenApiReference\r
                {\r
                    Type = ReferenceType.SecurityScheme,\r
                    Id = "Bearer"\r
                }\r
            },\r
            new string[] {}\r
        }\r
    });\r
});\r
\`\`\`\r
\r
- Agregamos las aplicaciones en startup\r
\r
\`\`\`csharp\r
app.UseAuthentication();\r
app.UseAuthorization();\r
\`\`\`\r
\r
- Agregamos al: appsettings\r
\r
\`\`\`csharp\r
"JWT": {\r
  "SecretKey": "LJLKSFJYEWIYEWBBLKASJDASDASDTWEBNVASNBDVCAS",\r
  "ValidAudience": "https://localhost:44324",\r
  "ValidIssuer": "https://localhost:44324"\r
}\r
\`\`\`\r
- Proteger los metodos con: [Authorize]\r
`,St=`Fecha: 07/04/2019\r
---\r
tags: Error Impresora\r
---\r
\r
# Problema Impresora Canon G3100 - G3000 series\r
\r
A continuación doy una solución rápida al problema de aire en las mangueras de una impresora Canon G3100 o G3000 Series, que hace que algunos colores o un color no imprima correctamente.\r
\r
En [mi canal de youtube](https://youtu.be/KvldwGjCg5M) hay un video del paso a paso:\r
\r
Hay tres niveles de mantenimeinto para este problema (Limpieza del cabezal de impresión: Standar, A fondo y profundo). Cada una de ellas lleva un consumo mayor de tiempo y de tinta para realizarse.\r
\r
1. Lo primero a revisar el nivel de tinta (no debe estar en el nivel mas bajo), pues lo que vamos a hacer genera un gasto importante de tinta y los manuales dicen que si se queda sin tinta se pueden generar problemas graves al sistema.\r
2. Nivel uno: Limpieza del cabezal de impresión Standar (mantenga pulsado el botón Parar (Stop) hasta que la luz de Alarma (Alarm) parpadee 2 veces y, a continuación, suelte el botón.)\r
3. Revisar si el problema esta resuelto con la impresion de un patron de prueba (mantenga pulsado el botón Parar (Stop) hasta que la luz de Alarma (Alarm) parpadee 1 vez y, a continuación, suelte el botón.) \r
4. Nivel dos: Limpieza del cabezal de impresión a fondo (mantenga pulsado el botón Parar (Stop) hasta que la luz de Alarma (Alarm) parpadee 3 veces y, a continuación, suelte el botón.)\r
5. Revisar si el problema esta resuelto con la impresion de un patron de prueba (mantenga pulsado el botón Parar (Stop) hasta que la luz de Alarma (Alarm) parpadee 1 vez y, a continuación, suelte el botón.)\r
6. Nivel tres: Limpieza del cabezal de impresión Profundo (mantenga pulsado el botón Parar (Stop) hasta que la luz de Alarma (Alarm) parpadee 5 veces y, a continuación, suelte el botón.)\r
\r
Este ultimo nivel es la limpieza más profunda, que más tiempo lleva realizarla y que más tinta consume\r
`,Ct=`Fecha: 20/02/2024\r
---\r
tags: Tutoriales Inversiones Forex\r
---\r
\r
# Cómo crear un Expert Advisor metatrader 5\r
\r
\r
Código paso a paso para crear un expert advisor que nos ayude a administrar las posiciones que vamos abriendo manualmente.\r
\r
En [mi canal de youtube](https://youtu.be/rcEfVyMp8XE) hay un video del paso a paso:\r
 \r
1. Crear un nuevo proyecto.\r
\r
2. Crear variables:\r
   - globalTrailing\r
   - globaltrailingStop\r
   - globalStopLoss\r
   - globalSpread\r
\r
4. Copiar codigo:\r
   \r
\`\`\`php\r
//+------------------------------------------------------------------+\r
//|                                                      vikingo.mq5 |\r
//|                                  Copyright 2023, MetaQuotes Ltd. |\r
//|                                             https://www.mql5.com |\r
//+------------------------------------------------------------------+\r
#property copyright "Copyright 2023, MetaQuotes Ltd."\r
#property link      "https://www.mql5.com"\r
#property version   "1.00"\r
\r
#include <Trade\\Trade.mqh>\r
CTrade trade;\r
\r
//--- input parameters\r
input int globalTrailing;\r
input int globalTrailingStop;\r
input int globalStopLoss;\r
input int globalSpread;\r
\r
bool     test = false;\r
bool     globalPositionInit = true;\r
long     globalPositionTrailing;\r
double   globalTickValue;\r
ulong    globalTicket;\r
string   globalSymbol;\r
string   globalPositionSymbol;\r
long     globalPositionType;\r
long     globalPositionOpen;\r
long     globalPositionStop;\r
double   globalGross;\r
long     globalPrice;\r
//+------------------------------------------------------------------+\r
//| Expert initialization function                                   |\r
//+------------------------------------------------------------------+\r
int OnInit()\r
  {\r
//---\r
   globalSymbol = Symbol();\r
   globalTickValue = SymbolInfoDouble(Symbol(), SYMBOL_TRADE_TICK_VALUE);\r
//---\r
   return(INIT_SUCCEEDED);\r
  }\r
\r
//+------------------------------------------------------------------+\r
//| Expert tick function                                             |\r
//+------------------------------------------------------------------+\r
void OnTick()\r
  {\r
   if(test)\r
     {\r
      ulong ticket = trade.Buy(0.01, Symbol(), SymbolInfoDouble(Symbol(), SYMBOL_ASK));\r
      //ulong ticket = trade.Sell(0.01, Symbol(), SymbolInfoDouble(Symbol(), SYMBOL_BID));\r
      test = false;\r
     }\r
   int total = PositionsTotal();\r
   if(total > 0)\r
     {\r
      globalTicket = PositionGetTicket(0);\r
      globalGross = PositionGetDouble(POSITION_PROFIT);\r
      globalPositionSymbol = PositionGetString(POSITION_SYMBOL);\r
      globalPositionOpen = priceConvert(PositionGetDouble(POSITION_PRICE_OPEN));\r
      globalPositionType = PositionGetInteger(POSITION_TYPE);\r
\r
      if(globalPositionType == POSITION_TYPE_SELL)\r
        {\r
         globalPrice = priceConvert(SymbolInfoDouble(globalPositionSymbol, SYMBOL_ASK));\r
         if(globalPositionInit)\r
           {\r
            globalPositionStop = globalPositionOpen + globalStopLoss;\r
            globalPositionTrailing = globalPositionOpen - globalTrailing - globalSpread;\r
            globalPositionInit = false;\r
           }\r
\r
         if(globalPrice <= globalPositionTrailing && globalGross > 0)\r
           {\r
            globalPositionTrailing = globalPrice - globalTrailing;\r
            globalPositionStop = globalPrice + globalTrailingStop;\r
           }\r
\r
         if(globalPrice >= globalPositionStop)\r
           {\r
            bool result = trade.PositionClose(globalTicket);\r
            if(result)\r
              {\r
               resetInit();\r
              }\r
            else\r
              {\r
               Print("No se pudo cerrar la posición de venta");\r
              }\r
           }\r
        }\r
      else\r
         if(globalPositionType == POSITION_TYPE_BUY)\r
           {\r
            globalPrice = priceConvert(SymbolInfoDouble(globalPositionSymbol, SYMBOL_BID));\r
            if(globalPositionInit)\r
              {\r
               globalPositionStop = globalPositionOpen - globalStopLoss;\r
               globalPositionTrailing = globalPositionOpen + globalTrailing + globalSpread;\r
               globalPositionInit = false;\r
              }\r
\r
            if(globalPrice >= globalPositionTrailing && globalGross > 0)\r
              {\r
               globalPositionTrailing = globalPrice + globalTrailing;\r
               globalPositionStop = globalPrice - globalTrailingStop;\r
              }\r
\r
            if(globalPrice <= globalPositionStop)\r
              {\r
               bool result = trade.PositionClose(globalTicket);\r
               if(result)\r
                 {\r
                  resetInit();\r
                 }\r
               else\r
                 {\r
                  Print("No se pudo cerrar la posición de compra");\r
                 }\r
              }\r
           }\r
      Print("Ticket: ", globalTicket, " Apertura: ", globalPositionOpen, " Profit: ", globalGross, " Precio: ", globalPrice, " Trail: ", globalPositionTrailing, " Stop: ", globalPositionStop);\r
     }\r
   else\r
     {\r
      resetInit();\r
     }\r
  }\r
\r
//+------------------------------------------------------------------+\r
//| PRICE CONVERT                                                    |\r
//+------------------------------------------------------------------+\r
long priceConvert(double price)\r
  {\r
   string price_str = DoubleToString(price, 5);\r
   string parts[];\r
   int count = StringSplit(price_str, '.', parts);\r
   if(StringLen(parts[1])==4)\r
     {\r
      parts[1] = parts[1] + "0";\r
     }\r
   long price_int = StringToInteger(parts[0] + parts[1]);\r
   return price_int;\r
  }\r
//+------------------------------------------------------------------+\r
\r
//+------------------------------------------------------------------+\r
//| RESET INIT                                                       |\r
//+------------------------------------------------------------------+\r
void resetInit()\r
  {\r
   globalPositionInit = true;\r
   globalPositionTrailing = 0;\r
   globalTickValue = 0;\r
   globalTicket = 0;\r
   globalSymbol = "";\r
   globalPositionSymbol = "";\r
   globalPositionType = 0;\r
   globalPositionOpen = 0;\r
   globalPositionStop = 0;\r
   globalGross = 0;\r
   globalPrice = 0;\r
  }\r
//+------------------------------------------------------------------+\r
\r
//+------------------------------------------------------------------+\r
//| UPDATE STOPLOSS                                                  |\r
//+------------------------------------------------------------------+\r
void setStopLoss()\r
  {\r
   double priceOpen = PositionGetDouble(POSITION_PRICE_OPEN);\r
   double tickSize = SymbolInfoDouble(_Symbol, SYMBOL_TRADE_TICK_SIZE);\r
   double newStopLoss = priceOpen - globalStopLoss * tickSize;\r
   trade.OrderModify(globalTicket, 0, priceOpen, newStopLoss, 0, CLR_NONE);\r
  }\r
//+------------------------------------------------------------------+\r
`,wt=`Fecha: 25/04/2020\r
---\r
tags: Tutoriales BaseDeDatos Trucos\r
---\r
\r
# Cómo importar un excel o CSV a firebase firestore\r
\r
Paso a paso para importar un archivo excel o CSV a una base de datos firestore de firebase \r
\r
En [mi canal de youtube](https://youtu.be/ut9QZQX2_as) hay un video del paso a paso:\r
\r
Ingresamos a consola\r
- https://console.cloud.google.com\r
\r
\`\`\`\r
gcloud config set project IDPROJECT\r
mkdir csv\r
npm init\r
npm install @google-cloud/firestore\r
npm install csv-parse\r
touch csvExport.js\r
node csvExport.js archivo.csv\r
\`\`\`\r
\r
\`\`\`javascript\r
const {readFile}  = require('fs').promises;\r
const {promisify} = require('util');\r
const parse       = promisify(require('csv-parse'));\r
const {Firestore} = require('@google-cloud/firestore');\r
\r
if (process.argv.length < 3) {\r
  console.error('Please include a path to a csv file');\r
  process.exit(1);\r
}\r
\r
\r
const db = new Firestore();\r
\r
function writeToFirestore(records) {\r
  const batchCommits = [];\r
  let batch = db.batch();\r
  records.forEach((record, i) => {\r
    var docRef = db.collection('fasecolda').doc(record.Codigo);\r
    batch.set(docRef, record);\r
    if ((i + 1) % 500 === 0) {\r
      console.log(\`Writing record \${i + 1}\`);\r
      batchCommits.push(batch.commit());\r
      batch = db.batch();\r
    }\r
  });\r
  batchCommits.push(batch.commit());\r
  return Promise.all(batchCommits);\r
}\r
\r
async function importCsv(csvFileName) {\r
  const fileContents = await readFile(csvFileName, 'utf8');\r
  const records = await parse(fileContents, { columns: true });\r
  try {\r
    await writeToFirestore(records);\r
  }\r
  catch (e) {\r
    console.error(e);\r
    process.exit(1);\r
  }\r
  console.log(\`Wrote \${records.length} records\`);\r
}\r
\r
importCsv(process.argv[2]).catch(e => console.error(e));\r
\`\`\`\r
`,Tt=`Fecha: 08/11/2022\r
---\r
tags: Tutoriales Trucos Linux Raspberry\r
---\r
\r
# Cómo instalar Raspbian en Raspberry Pi\r
\r
Listado de cosas por instalar en una Raspberry, otras aplicaciones y configuraciones.\r
\r
En [mi canal de youtube](https://youtu.be/m60_OxnNz5s) hay un video del paso a paso:\r
\r
Raspberry Pi Image\r
\`\`\`csharp\r
https://www.raspberrypi.com/software/\r
\`\`\`\r
\r
Aplicación para saber la ip: \r
\`\`\`csharp\r
https://www.advanced-ip-scanner.com/\r
\`\`\`\r
\r
Instalar escritorio remoto: \r
\`\`\`csharp\r
sudo apt update\r
sudo apt upgrade\r
sudo reboot\r
sudo apt install xrdp\r
\`\`\`\r
`,Et=`Fecha: 10/07/2025\r
---\r
tags: Tutoriales Docker Linux\r
---\r
\r
# Cómo instalar Evolution-api en Docker Desktop\r
\r
\r
Paso a paso para instalar Evolution-API con un sólo comando.\r
\r
En [mi canal de youtube](https://youtu.be/rSuEqJ1YvwQ) hay un video del paso a paso:\r
\r
1. Instalar GIT\r
2. Instalar Docker Desktop\r
\r
Ejecutar en PowerShell\r
\`\`\`csharp\r
git clone https://github.com/codigo8a/evolution-api-script.git\r
cd evolution-api-script\r
& "C:\\Program Files\\Git\\bin\\bash.exe"\r
./evolution.sh\r
\`\`\`\r
Usar la Api Key Global\r
\`\`\`csharp\r
429683C4C977415CAAFCCE10F7D57E11\r
\`\`\`\r
`,Dt=`Fecha: 02/01/2019\r
---\r
tags: Tutoriales Laravel PHP AWS\r
---\r
\r
# Instalación Laravel SSH Servidor UBUNTU\r
\r
A continuación describo linea a linea lo que hay que hacer en la consola SSH para tener en menos de 10 minutos un proyecto Laravel corriendo en un servidor UBUNTU (AWS Amazon Web Services).\r
\r
En [mi canal de youtube](https://www.youtube.com/watch?v=nExuiPqHkVA) hay un video del paso a paso: \r
\r
\`\`\`\r
sudo apt-get update\r
sudo apt-get install apache2 -y\r
echo $USER \r
sudo nano /etc/apache2/envvars\r
export APACHE_RUN_USER=ubuntu\r
export APACHE_RUN_GROUP=ubuntu\r
sudo chown ubuntu:ubuntu /var/www/html -R\r
sudo a2enmod rewrite\r
sudo nano /etc/apache2/sites-available/000-default.conf\r
\r
<Directory "/var/www/html/">\r
        Options Indexes FollowSymLinks\r
        AllowOverride All\r
        Require all granted\r
</Directory>\r
\r
sudo systemctl restart apache2\r
sudo apt-add-repository ppa:ondrej/php\r
sudo apt-get update\r
sudo apt install php7.2 libapache2-mod-php7.2 php7.2-mbstring php7.2-xmlrpc php7.2-soap php7.2-gd php7.2-xml php7.2-cli php7.2-zip zip unzip -y\r
sudo apt-get install git\r
cd /tmp\r
wget https://getcomposer.org/composer.phar\r
sudo mv composer.phar /bin/composer\r
sudo chmod 755 /bin/composer\r
composer global require "laravel/installer"\r
sudo nano ~/.profile\r
\r
export PATH=$PATH:/home/ubuntu/.config/composer/vendor/bin\r
\r
sudo reboot\r
cd /var/www/html/\r
laravel new aplication-sample\r
\r
//Si no ha configurado la swap\r
free -m\r
sudo /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=1024\r
sudo /sbin/mkswap /var/swap.1\r
sudo /sbin/swapon /var/swap.1\r
\`\`\`\r
`,Ot=`Fecha: 09/07/2025\r
---\r
tags: Tutoriales Linux Docker\r
---\r
\r
# Cómo instalar docker en Ububtu Server linux\r
\r
\r
Paso a paso para tener docker instalado junto con un administrador visual de contenedores.\r
\r
En [mi canal de youtube](https://youtu.be/N1C96pBweWY) hay un video del paso a paso:\r
\r
Instalar docker\r
\`\`\`csharp\r
sudo apt update\r
sudo apt upgrade\r
curl -sSL https://get.docker.com | sh\r
sudo usermod -aG docker pi\r
sudo reboot\r
docker version\r
\`\`\`\r
\r
Instalar Portainer\r
\`\`\`csharp\r
docker run -itd -p 8000:8000 -p 9000:9000 --name=portainer --restart=always -v /var/run/docker.sock:/var/run/docker.sock -v /docker/portainer:/data portainer/portainer-ce\r
localhost:9000\r
docker ps\r
\`\`\`\r
`,kt=`Fecha: 15/12/2018\r
---\r
tags: Tutoriales PHP\r
---\r
\r
# Instalación Sistema Wiki DOKUWIKI\r
\r
A continuación describo linea a linea lo que hay que hacer en la consola SSH para tener en menos de 5 minutos un proyecto de <a target="_blank" href="{{ page.dokuwiki }}">documentación WIKI usando DOKUWIKI</a>.\r
\r
En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso: \r
\r
\`\`\`\r
git clone https://github.com/splitbrain/dokuwiki.git\r
sudo chmod -R 755 /dokuwiki/data/\r
\r
//ejecutar dominio-IP/dokuwiki/install.php\r
\`\`\`\r
\r
### Mini-tutorial de manejo \r
1. Cómo crear un pagina nueva\r
2. Cómo crear una pagina dentro de una sección\r
3. Cómo activar url amigables\r
`,At=`Fecha: 05/02/2024\r
---\r
tags: Trucos Windows\r
---\r
\r
# Cómo instalar tienda de windows Microsoft Store\r
\r
\r
Código paso a paso para instalar la tienda de windows "Microsoft Store".\r
\r
En [mi canal de youtube](https://youtu.be/-wq8jncHdPI) hay un video del paso a paso:\r
 \r
1. Abrir Power Shell.\r
\r
2. Ejecutar codigo\r
\`\`\`csharp\r
Get-AppxPackage -allusers Microsoft.WindowsStore | Foreach {Add-AppxPackage -DisableDevelopmentMode -Register "$($_.InstallLocation)\\AppXManifest.xml"}\r
\`\`\`\r
`,jt=`Fecha: 07/03/2019\r
---\r
tags: CMS Joomla Javascript PHP\r
---\r
\r
# Menú JOOMLA con imagenes\r
\r
Codigo javascript para manejo de menus en joomla con imagenes (Hover y Active)\r
\r
En [mi canal de youtube](https://youtu.be/2NfTcPnlSpc) hay un video del paso a paso: \r
\r
![ejemplo menu](https://raw.githubusercontent.com/juandavid8a/javascript-menu-images-joomla/master/menu-images.gif)\r
\r
Es un código rápido para poder manejar menus en joomla sólo con imagenes, esta dividido en dos partes:\r
* Revisamos si hay algun item del menu con submenus y los desHabilitamos (si se quiere que aparezcan solo se bede comentar el FOR de los subItem)\r
* Recorre los item que contienen la clase "menu-hover" y revisa si el parent tiene la clase "active", osea que ya se le dio clic a un menú, obtiene la url de la imagen y modifica la etiqueta IMG asignandole una nueva url con la imagen que contiene la terminación "-hover" por defecto\r
* La segunda parte del codigo reacciona al posicionar el mouse sobre cualquier item del menu y busca automaticamente las imagenes con terminacion "-hover" de cada uno y genera el efecto hover.\r
\r
\`\`\`javascript\r
imageOver=[];	\r
var items = document.getElementsByClassName("menu-hover");\r
var subItems = document.getElementsByClassName("sp-has-child");\r
\r
//Revisamos si hay submenus y los deshabilitamos\r
for (i = 0; i < subItems.length; i++) {\r
	subItems[i].classList.remove("sp-has-child");\r
}\r
var i;\r
//Revisamos si hay algun parent con active y le remplazamos la imagen por el hover\r
for (i = 0; i < items.length; i++) {\r
	if(items[i].parentNode.className.indexOf("active") > 0){\r
		var img = items[i].firstChild.attributes["src"].nodeValue;\r
		imageOver = img.split(".");\r
		items[i].firstChild.src=imageOver[0]+'-hover.'+imageOver[1];\r
		items[i].classList.remove("menu-hover");\r
	}\r
} 	\r
//Esperamos a que el mouse pase por un menu y realizamos el efecto hover  \r
$(".menu-hover").hover(function(){\r
	var img = $(this).find('img').attr('src');\r
	imageOver = img.split(".");\r
	$(this).find('img').attr('src', imageOver[0]+'-hover.'+imageOver[1])\r
}, function() {\r
	$(this).find('img').attr('src', imageOver[0]+'.'+imageOver[1])\r
});\r
\`\`\`\r
\r
### Requiere dos imagenes:\r
* nombreDelaImagen.png\r
* nombreDeLaImagen-hover.png\r
\r
### Si es para usar en JOOMLA:\r
Poner clase CSS "menu-hover" en cada menu para que el código sepa sobre cual o cuales menus debe activarse y buscar las imagenes con terminacion "-hover" y generar el efecto.\r
\r
### Si es para usar fuera de JOOMLA esta debe ser la estructura:\r
\r
\`\`\`html\r
<ul class="sp-megamenu-parent menu-fade hidden-sm hidden-xs">\r
      <li class="sp-menu-item current-item active">\r
          <a class="menu-hover" href="/web/index.php/nuestra-escencia">\r
            <img src="/web/images/menu-nuestra-esencia-hover.png" alt="Nuestra Escencia">\r
          </a>\r
      </li>\r
      <li class="sp-menu-item">\r
          <a class="menu-hover" href="/web/index.php/fresh-perfum">\r
              <img src="/web/images/menu-tu-esencia.png" alt="Tu esencia">\r
          </a>\r
      </li>\r
      <li class="sp-menu-item">\r
          <a class="" href="/web/index.php/esencias">\r
              <img src="/web/images/menu-esencias.png" alt="Esencias">\r
          </a>\r
      </li>\r
</ul>\r
\`\`\`\r
`,Mt=`Fecha: 30/07/2023\r
---\r
tags: Tutoriales Framework CSharp NetCore\r
---\r
\r
# Cómo integrar Clean Arquitecture a Net Core 7\r
\r
Codigo paso a paso para integrar Clean Arquitecture a Net Core 7.\r
\r
En [mi canal de youtube](https://youtu.be/vItyn5jd-k8) hay un video del paso a paso:\r
\r
1 Creamos una Blank Solution\r
\r
2 Agregamos proyecto API .Api\r
- Controllers\r
- Responses\r
  \r
3 Agregamos proyecto Class Library .Core\r
- DTOs\r
- Entities\r
- Enumerations\r
- Interfaces\r
- Exceptions\r
- QueryFilters\r
- Services\r
  \r
4 Agregamos proyecto Class Library .Infrastructure\r
- Data\r
- Repositories\r
- Filters\r
- Mappings\r
- Validators\r
\r
5 Reference\r
- .API = .Core, .Infrastructure\r
- .Infrastructure = .Core\r
\r
6 Ingresamos al appsettings:\r
\`\`\`csharp\r
,\r
"MongoDbSettings": {\r
  "ConnectionString": "url",\r
  "DatabaseName": "namestring"\r
}\r
\`\`\`\r
\r
7 Creamos MongoDbSettingsEntity:\r
\`\`\`csharp\r
public string ConnectionString { get; set; } = string.Empty;\r
public string DatabaseName { get; set; } = string.Empty;\r
\`\`\`\r
\r
8 Instalamos paquetes:\r
\`\`\`csharp\r
MongoDB.Bson\r
MongoDB.Driver\r
Microsoft.Extensions.Options\r
AspNetCore.Identity.MongoDbCore\r
\`\`\`\r
\r
9 Agregamos al program:\r
\`\`\`csharp\r
builder.Services.Configure<MongoDbSettingsEntity>(builder.Configuration.GetSection(nameof(MongoDbSettings)));\r
\`\`\`\r
\r
10 Creamos el UserEntity:\r
\`\`\`csharp\r
[BsonIgnoreExtraElements]\r
public class UserEntity\r
{\r
    [BsonId]\r
    [BsonRepresentation(MongoDB.Bson.BsonType.ObjectId)]\r
    public string Id { get; set; } = string.Empty;\r
    public string Username { get; set; } = string.Empty;\r
    public string Fullmane { get; set; } = string.Empty;\r
    public string Email { get; set; } = string.Empty;\r
}\r
\`\`\`\r
\r
11 Creamos IUserRepository y IUserService:\r
\`\`\`csharp\r
Task<List<UserEntity>> GetAll();\r
\`\`\`\r
\r
12 Creamos IContext:\r
\`\`\`csharp\r
IMongoCollection<UserEntity> Users { get;  }\r
\`\`\`\r
\r
13 Creamos Context:\r
\`\`\`csharp\r
public class Context : IContext\r
{\r
    private readonly IMongoDatabase _database;\r
    public Context(IOptions<MongoDbSettingsEntity> options)\r
    {\r
        MongoClient _mongoClient = new MongoClient(options.Value.ConnectionString);\r
        _database = _mongoClient.GetDatabase(options.Value.DatabaseName);\r
    }\r
    public IMongoCollection<UserEntity> Users => _database.GetCollection<UserEntity>("users");\r
}\r
\`\`\`\r
\r
14 Creamos UserRepository:\r
\`\`\`csharp\r
public class UserRepository : IUserRepository\r
{\r
    private readonly IContext _context;\r
    public UserRepository(IContext context)\r
    {\r
        _context = context;\r
    }\r
    public async Task<List<UserEntity>> GetAll() => await _context.Users.Find(_ => true).ToListAsync();\r
}\r
\`\`\`\r
\r
15 Creamos UserService:\r
\`\`\`csharp\r
public class UserService : IUserService\r
{\r
    private readonly IUserRepository _userRepository;\r
    public UserService(IUserRepository userRepository)\r
    {\r
        _userRepository = userRepository;\r
    }\r
    public Task<List<UserEntity>> GetAll()\r
    {\r
        return _userRepository.GetAll();\r
    }\r
}\r
\`\`\`\r
\r
16 Creamos UserService:\r
\`\`\`csharp\r
public class UserService : IUserService\r
{\r
    private readonly IUserRepository _userRepository;\r
    public UserService(IUserRepository userRepository)\r
    {\r
        _userRepository = userRepository;\r
    }\r
    public Task<List<UserEntity>> GetAll()\r
    {\r
        return _userRepository.GetAll();\r
    }\r
}\r
\`\`\`\r
\r
17 Agregamos al program:\r
\`\`\`csharp\r
builder.Services.AddSingleton<IUserService, UserService>();\r
builder.Services.AddSingleton<IUserRepository, UserRepository>();\r
\`\`\`\r
\r
18 Creo UserController:\r
\`\`\`csharp\r
[Route("api/[controller]")]\r
[ApiController]\r
public class UserController : ControllerBase\r
{\r
    private readonly IUserService _userService;\r
    public UserController(IUserService userService)\r
    {\r
        _userService = userService;\r
    }\r
\r
    // GET: api/<UserController>\r
    [HttpGet]\r
    public async Task<List<UserEntity>> GetAll()\r
    {\r
        return await _userService.GetAll();\r
    }\r
}\r
\`\`\`\r
`,Nt=`Fecha: 29/07/2023\r
---\r
tags: Tutoriales Framework CSharp BaseDeDatos NetCore\r
---\r
\r
# Cómo usar EntityUser y JWT con MongoDB\r
\r
Codigo paso a paso para integrar EntityUser y JWT con MongoDB.\r
\r
En [mi canal de youtube](https://youtu.be/f1hoUoB16NI) hay un video del paso a paso:\r
\r
Instalamos paquetes:\r
\`\`\`csharp\r
AspNetCore.Identity.MongoDbCore\r
MongoDB.Bson\r
MongoDB.Driver\r
Microsoft.AspNetCore.Authentication.JwtBearer\r
\`\`\`\r
\r
Ingresamos al appsettings:\r
\`\`\`csharp\r
  ,\r
"MongoDbSettings": {\r
  "ConnectionString": "url",\r
  "DatabaseName": "namestring"\r
}\r
\`\`\`\r
\r
Creamos ApplicationUser:\r
\`\`\`csharp\r
[CollectionName("users")]\r
public class ApplicationUser : MongoIdentityUser<Guid>\r
{\r
    public string FullName { get; set; } = string.Empty;\r
}\r
\`\`\`\r
\r
Creamos ApplicationRole:\r
\`\`\`csharp\r
[CollectionName("roles")]\r
public class ApplicationRole : MongoIdentityRole<Guid>\r
{\r
    \r
}\r
\`\`\`\r
\r
Agregamos a Program.cs:\r
\`\`\`csharp\r
// Add services to the container.\r
builder.Services.Configure<MongoDbSettings>(builder.Configuration.GetSection(nameof(MongoDbSettings)));\r
BsonSerializer.RegisterSerializer(new GuidSerializer(MongoDB.Bson.BsonType.String));\r
BsonSerializer.RegisterSerializer(new DateTimeSerializer(MongoDB.Bson.BsonType.String));\r
BsonSerializer.RegisterSerializer(new DateTimeOffsetSerializer(MongoDB.Bson.BsonType.String));\r
\r
//add mongoIdentityConfiguration...\r
var mongoDbIdentityConfig = new MongoDbIdentityConfiguration\r
{\r
    MongoDbSettings = builder.Configuration.GetSection(nameof(MongoDbSettings)).Get<MongoDbSettings>(),\r
    IdentityOptionsAction = options =>\r
    {\r
        options.Password.RequireDigit = false;\r
        options.Password.RequiredLength = 8;\r
        options.Password.RequireNonAlphanumeric = true;\r
        options.Password.RequireLowercase = false;\r
\r
        //lockout\r
        options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);\r
        options.Lockout.MaxFailedAccessAttempts = 5;\r
        options.User.RequireUniqueEmail = true;\r
    }\r
};\r
\r
builder.Services.ConfigureMongoDbIdentity<ApplicationUser, ApplicationRole, Guid>(mongoDbIdentityConfig)\r
    .AddUserManager<UserManager<ApplicationUser>>()\r
    .AddSignInManager<SignInManager<ApplicationUser>>()\r
    .AddRoleManager<RoleManager<ApplicationRole>>()\r
    .AddDefaultTokenProviders();\r
\r
builder.Services.AddAuthentication(x =>\r
{\r
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;\r
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;\r
}).AddJwtBearer(x =>\r
{\r
    x.RequireHttpsMetadata = true;\r
    x.SaveToken = true;\r
    x.TokenValidationParameters = new TokenValidationParameters\r
    {\r
        ValidateIssuerSigningKey = true,\r
        ValidateIssuer = true,\r
        ValidateAudience = true,\r
        ValidateLifetime = true,\r
        ValidIssuer = "https://localhost:5001",\r
        ValidAudience = "https://localhost:5001",\r
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("1swek3u4uo2u4a6e")),\r
        ClockSkew = TimeSpan.Zero\r
    };\r
});\r
\r
builder.Services.AddSwaggerGen(setup =>\r
{\r
    // Include 'SecurityScheme' to use JWT Authentication\r
    var jwtSecurityScheme = new OpenApiSecurityScheme\r
    {\r
        BearerFormat = "JWT",\r
        Name = "JWT Authentication",\r
        In = ParameterLocation.Header,\r
        Type = SecuritySchemeType.Http,\r
        Scheme = JwtBearerDefaults.AuthenticationScheme,\r
        Description = "Put **_ONLY_** your JWT Bearer token on textbox below!",\r
\r
        Reference = new OpenApiReference\r
        {\r
            Id = JwtBearerDefaults.AuthenticationScheme,\r
            Type = ReferenceType.SecurityScheme\r
        }\r
    };\r
    setup.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);\r
    setup.AddSecurityRequirement(new OpenApiSecurityRequirement\r
    {\r
        { jwtSecurityScheme, Array.Empty<string>() }\r
    });\r
});\r
\`\`\`\r
\r
Creamos LoginRequest Dto:\r
\`\`\`csharp\r
[Required, EmailAddress]\r
public string Email { get; set; } = string.Empty;\r
[Required, DataType(DataType.Password)]\r
public string Password { get; set; } = string.Empty;\r
\`\`\`\r
\r
Creamos RegisterRequest Dto:\r
\`\`\`csharp\r
[Required, EmailAddress]\r
public string Email { get; set; } = string.Empty;\r
public string Username { get; set; } = string.Empty;\r
[Required]\r
public string FullName { get; set; } = string.Empty;\r
\r
[Required, DataType(DataType.Password)]\r
public string Password { get; set; } = string.Empty;\r
[Required, DataType(DataType.Password), Compare(nameof(Password), ErrorMessage = "Passwords do not match")]\r
public string ConfirmPassword { get; set; } = string.Empty;\r
\`\`\`\r
\r
Creamos CreateRoleRequest Dto:\r
\`\`\`csharp\r
public string Role { get; set; } = string.Empty;\r
\`\`\`\r
\r
Creamos LoginResponse Dto:\r
\`\`\`csharp\r
public bool Success { get; set; }\r
public string AccessToken { get; set; } = string.Empty;\r
public string Email { get; set; } = string.Empty;\r
public string UserId { get; set; } = string.Empty;\r
public string Message { get; set; } = string.Empty;\r
\`\`\`\r
\r
Creamos RegisterResponse Dto:\r
\`\`\`csharp\r
public string Message { get; set; } = string.Empty;\r
public bool Success { get; set; }\r
\`\`\`\r
\r
Creamos AuthenticationController:\r
\`\`\`csharp\r
[ApiController]\r
[Route("api/v1/authenticate")]\r
public class AuthenticationController : ControllerBase\r
{\r
    private readonly UserManager<ApplicationUser> _userManager;\r
    private readonly RoleManager<ApplicationRole> _roleManager;\r
\r
    public AuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<ApplicationRole> roleManager)\r
    {\r
        _userManager = userManager;\r
        _roleManager = roleManager;\r
    }\r
\r
    [HttpPost]\r
    [Route("roles/add")]\r
    public async Task<IActionResult> CreateRole([FromBody] CreateRoleRequest request)\r
    {\r
        var appRole = new ApplicationRole { Name = request.Role };\r
        var createRole = await _roleManager.CreateAsync(appRole);\r
        return Ok(new { message = "role created succesfully" });\r
    }\r
\r
    [HttpPost]\r
    [Route("register")]\r
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)\r
    {\r
        var result = await RegisterAsync(request);\r
        return result.Success ? Ok(result) : BadRequest(result.Message);\r
    }\r
\r
    private async Task<RegisterResponse> RegisterAsync(RegisterRequest request)\r
    {\r
        try\r
        {\r
            var userExists = await _userManager.FindByEmailAsync(request.Email);\r
            if(userExists != null) return new RegisterResponse { Message = "User already exists", Success = false };\r
\r
            //if we get here, no user with this email..\r
\r
            userExists = new ApplicationUser\r
            {\r
                FullName = request.FullName,\r
                Email = request.Email,\r
                ConcurrencyStamp = Guid.NewGuid().ToString(),\r
                UserName = request.Email,\r
\r
            };\r
            var createUserResult = await _userManager.CreateAsync(userExists, request.Password);\r
            if(!createUserResult.Succeeded) return new RegisterResponse { Message = $"Create user failed {createUserResult?.Errors?.First()?.Description}", Success = false };\r
            //user is created...\r
            //then add user to a role...\r
            var addUserToRoleResult = await _userManager.AddToRoleAsync(userExists, "USER");\r
            if(!addUserToRoleResult.Succeeded) return new RegisterResponse { Message = $"Create user succeeded but could not add user to role {addUserToRoleResult?.Errors?.First()?.Description}", Success = false };\r
\r
            //all is still well..\r
            return new RegisterResponse\r
            {\r
                Success = true,\r
                Message = "User registered successfully"\r
            };\r
        }\r
        catch (Exception ex)\r
        {\r
            return new RegisterResponse { Message = ex.Message, Success = false };\r
        }\r
    }\r
\r
    [HttpPost]\r
    [Route("login")]\r
    [ProducesResponseType((int) HttpStatusCode.OK , Type = typeof(LoginResponse))]\r
    public async Task<IActionResult> Login([FromBody] LoginRequest request)\r
    {\r
        var result = await LoginAsync(request);\r
        return result.Success ? Ok(result) : BadRequest(result.Message);\r
    }\r
\r
    private async Task<LoginResponse> LoginAsync(LoginRequest request)\r
    {\r
        try\r
        {\r
            var user = await _userManager.FindByEmailAsync(request.Email);\r
            if (user is null) return new LoginResponse { Message = "Invalid email/password", Success = false };\r
\r
            //all is well if ew reach here\r
            var claims = new List<Claim>\r
        {\r
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),\r
            new Claim(ClaimTypes.Name, user.UserName),\r
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),\r
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())\r
        };\r
            var roles = await _userManager.GetRolesAsync(user);\r
            var roleClaims = roles.Select(x => new Claim(ClaimTypes.Role, x));\r
            claims.AddRange(roleClaims);\r
\r
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("1swek3u4uo2u4a6e"));\r
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);\r
            var expires = DateTime.Now.AddMinutes(30);\r
\r
            var token = new JwtSecurityToken(\r
                issuer: "https://localhost:5001",\r
                audience: "https://localhost:5001",\r
                claims: claims,\r
                expires: expires,\r
                signingCredentials: creds\r
                );\r
\r
            return new LoginResponse\r
            {\r
                AccessToken = new JwtSecurityTokenHandler().WriteToken(token),\r
                Message = "Login Successful",\r
                Email = user?.Email,\r
                Success = true,\r
                UserId = user?.Id.ToString()\r
            };\r
        }\r
        catch (Exception ex)\r
        {\r
            Console.WriteLine(ex.Message);\r
            return new LoginResponse { Success = false, Message = ex.Message };\r
        }\r
    }\r
}\r
\`\`\`\r
\r
Agregamos [Authorize]\r
`,Pt=`Fecha: 15/02/2026\r
---\r
tags: Tutoriales Linux IA\r
---\r
\r
# Cómo instalar ollama en linux\r
\r
\r
Paso a paso para instalar Ollama en Linux y poder ejectar nuestros propios modelos localmente.\r
\r
En [mi canal de youtube](https://youtu.be/HJKoVXKV3Oc) hay un video del paso a paso:\r
\r
1. Conectar a la consola (Putty o Cockpit).\r
2. Instalar Ollama (ollama.com).\r
3. Validar instalación.\r
\`\`\`csharp\r
ollama --version\r
\`\`\`\r
4. Cargar módelo (ollama.com/search).\r
\`\`\`csharp\r
ollama pull <modeloName>\r
\`\`\`\r
5. Comandos más usados:\r
\`\`\`csharp\r
ollama list\r
ollama rm\r
systemctl status ollama\r
\`\`\`\r
6. Escuchar toda la red\r
\`\`\`csharp\r
sudo systemctl edit ollama\r
\`\`\`\r
\`\`\`csharp\r
[Service]\r
Environment="OLLAMA_HOST=0.0.0.0"\r
\`\`\`\r
\`\`\`csharp\r
sudo systemctl daemon-reload\r
sudo systemctl restart ollama\r
\`\`\`\r
\r
`,Ft=`Fecha: 10/03/2026\r
---\r
tags: Tutoriales Python\r
---\r
\r
# Cómo obtener un ollama local con GPU gratis\r
\r
\r
Paso a paso para correr un ollama local gratuitamente y con acceso a GPU.\r
\r
En [mi canal de youtube](https://youtu.be/WRT0RgIEXus) hay un video del paso a paso:\r
\r
1. Obtener un APIKEY de Ngrok.\r
2. Ejecuta <a target="_blank" href="{{ page.googlecolab }}">setup_and_query_a_ollama_server.ipynb</a> en Google Colab\r
3. Configura ollama en Claude Code:\r
\`\`\`csharp\r
$env:ANTHROPIC_AUTH_TOKEN="ollama"\r
$env:ANTHROPIC_BASE_URL="tu-url-de-ngrok"\r
$env:ANTHROPIC_API_KEY=""\r
claude --model qwen3-coder\r
\`\`\`\r
`,It=`Fecha: 30/11/2023\r
---\r
tags: Tutoriales GitHub Servicios\r
---\r
\r
# Cómo crear página web en Github Pages\r
\r
\r
Código paso a paso para crear una pagina web usando el hosting gratuito de Github Pages, con dominio personalizado y certificado SSL.\r
\r
En [mi canal de youtube](https://youtu.be/h9FvfSM9zW8) hay un video del paso a paso:\r
 \r
1. Buscar pantilla HTML\r
- Descargar\r
- Descomprimir\r
\r
2. Crear Repositorio\r
- Agregar al nombre del repositorio = .github.io\r
- Vincular repositorio\r
- Subir plantilla\r
\r
3. Configurar dominio\r
- Crear DNS personalizados\r
\`\`\`csharp\r
185.199.108.153\r
185.199.109.153\r
185.199.110.153\r
185.199.111.153\r
\`\`\` \r
- Crear C-NAME\r
- Esperar creación de SSL\r
`,Lt=`Fecha: 24/07/2025\r
---\r
tags: Tutoriales Windows\r
---\r
\r
# Cómo transmitir pantalla del celular a Windows\r
\r
\r
Paso a paso para transmitir la pantalla del celular al escitorio de windows.\r
\r
En [mi canal de youtube](https://youtu.be/lT1rHovN86M) hay un video del paso a paso:\r
\r
1. Bajar archivos:\r
- <a target="_blank" href="https://mega.nz/file/6lFBnAYY#YanFe094ssBA3T5IT9nbNajq-gxPes_me5ziGTyOT3k">platform-tools_r28.0.0-windows.zip</a>\r
- <a target="_blank" href="https://mega.nz/file/6tUWlKiT#PUTe5FHlUMcgo4d8qHNjqI7R480Zucar_f-XfxLyAjk">scrcpy-win64.rar</a>\r
2. Descomprimir en una carpeta\r
3. Conectar celular en modo solo carga  \r
4. Ejecutar\r
\`\`\`csharp\r
adb devices\r
scrcpy\r
\`\`\`\r
`,Rt=`Fecha: 01/01/2019\r
---\r
tags: Tutoriales PHP BaseDeDatos AWS\r
---\r
\r
# Instalación PHP - MYSQL - PHPMYADMIN\r
\r
A continuación describo los comandos de consola SSH para instalar en menos de 5 minutos PHP - MYSQL - PHPMYADMIN en un servidor UBUNTU (AWS Amazon Web Services).\r
\r
En [mi canal de youtube](https://bit.ly/2wSo5iD) hay un video del paso a paso:\r
\r
\`\`\`\r
sudo apt-get install apache2 -y\r
sudo apt-get install mysql-server -y\r
sudo mysql_secure_installation ()\r
sudo apt-get install php libapache2-mod-php php-mysql -y\r
sudo service apache2 restart\r
\r
sudo chown root:root -R /var/www/\r
sudo chmod 777 -R /var/www/\r
sudo apt-get install phpmyadmin -y\r
sudo systemctl restart apache2\r
sudo mysql -u root -p \r
\r
CREATE USER 'ubuntu'@'localhost' IDENTIFIED BY 'tu_contrasena';\r
GRANT ALL PRIVILEGES ON * . * TO 'ubuntu'@'localhost';\r
FLUSH PRIVILEGES;\r
\r
//solucionar error al entrar a las tablas\r
sudo cp /usr/share/phpmyadmin/libraries/sql.lib.php /usr/share/phpmyadmin/libraries/sql.lib.php.bak\r
sudo nano /usr/share/phpmyadmin/libraries/sql.lib.php\r
\r
//buscar \r
(count($analyzed_sql_results['select_expr'] == 1)\r
//remplazar por\r
((count($analyzed_sql_results['select_expr']) == 1)\r
\`\`\`\r
`,zt=`Fecha: 15/02/2020\r
---\r
tags: Framework Error PHP Laravel\r
---\r
\r
# Solucionar problema CORS en Laravel 6 | 2020\r
\r
Este tutorial es la actualización de un post anterior que ya no funciona ya que la libreria barryvdh/laravel-cors no esta disponible.\r
\r
A continuación doy una solución rápida al problema Access-Control-Allow-Origin - CORS en Laravel 6 que sucede por razones de seguridad, los exploradores restringen las solicitudes HTTP de origen cruzado iniciadas dentro de un script.\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
Instalamos\r
\`\`\`\r
composer require fruitcake/laravel-cors\r
\`\`\`\r
\r
Agregamos esta linea al archivo app/Http/Kernel.php en "protected $middleware"\r
\`\`\`php\r
\\Fruitcake\\Cors\\HandleCors::class,\r
\`\`\`\r
\r
Creamos arvhivo de conficuración\r
\`\`\`php\r
php artisan vendor:publish --tag="cors"\r
\`\`\`\r
\r
Abrimos el archivo de configuracion config/cors.php y agregamos el Path que queremos darle acceso de origenes\r
\`\`\`php\r
'paths' => ['api/*'],\r
\`\`\`\r
`,Bt=`Fecha: 21/09/2019\r
---\r
tags: Error Framework Laravel PHP\r
---\r
\r
# Solucionar problema CORS en Laravel 6 | 2019\r
\r
Este tutorial es la actualización de un post anterior que ya no funciona en versiones nuevas:\r
A continuación doy una solución rápida al problema Access-Control-Allow-Origin - CORS en Laravel 6 que sucede por razones de seguridad, los exploradores restringen las solicitudes HTTP de origen cruzado iniciadas dentro de un script.\r
\r
En [mi canal de youtube](https://youtu.be/CDEaBtEeVwM) hay un video del paso a paso:\r
\r
\`\`\`csharp\r
//Instalamos\r
composer require barryvdh/laravel-cors\r
\r
//Agregamos esta linea al archivo config/app.php\r
//en el array de providers\r
Barryvdh\\Cors\\ServiceProvider::class,\r
\r
//Agregamos esta linea al archivo app/Http/Kernel.php\r
//en "protected $middleware"\r
\\Barryvdh\\Cors\\HandleCors::class,\r
\r
//ejecutamos\r
php artisan vendor:publish --provider="Barryvdh\\Cors\\ServiceProvider"\r
\`\`\`\r
`,Vt=`Fecha: 29/09/2018\r
---\r
tags: Tutoriales Laravel Error Framework PHP\r
---\r
\r
# Solucionar problema CORS en Laravel 5\r
\r
A continuación doy una solución rápida al problema Access-Control-Allow-Origin - CORS en Laravel 5 que sucede por razones de seguridad, los exploradores restringen las solicitudes HTTP de origen cruzado iniciadas dentro de un script.\r
\r
En [mi canal de youtube](https://youtu.be/KvldwGjCg5M) hay un video del paso a paso:\r
\r
\`\`\`PHP\r
//Creamos un middleware\r
->header('Access-Control-Allow-Origin', '*’)\r
->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS’);\r
\r
//ingresamos al Kernel\r
'cors' => \\App\\Http\\Middleware\\Cors::class,\r
\r
//Agregamos a las rutas\r
Route::group(['middleware' => 'cors'], function(){\r
    //aqui van todas las rutas que necesitan CORS\r
}); \r
\`\`\`\r
`,Ht=`Fecha: 10/10/2020\r
---\r
tags: Error Video Trucos\r
---\r
\r
# Cómo solucionar problema de pantalla negra en OBS studio\r
\r
Paso a paso para solucionar el problema de pantalla negra de la aplicación OBS studio.\r
\r
En [mi canal de youtube](https://youtu.be/6sUfXk17g8g) hay un video del paso a paso:\r
\r
1. Asegurarse que tiene los Drivers en la ultima versión\r
2. Configurar el panel de control de Nvidia\r
3. Agregrar OBS studio y poner graficos integrados\r
4. Entrar a configuracion de pantalla\r
5. Entrar a configuracion de graficos\r
6. Agregar OBS studio y poner ahorro de energia\r
`,Ut=`Fecha: 31/10/2024\r
---\r
tags: Tutoriales React Framework\r
---\r
\r
# Cómo manejar errores en React\r
\r
\r
Código paso a paso para agregar un archivo que nos maneje los errores en un Micro-FrontEnd.\r
\r
En [mi canal de youtube](https://youtu.be/nm8AcpPduV0) hay un video del paso a paso:\r
 \r
1 Crear ErrorBoundary.tsx\r
\`\`\`react\r
import { Component, ErrorInfo, ReactNode } from "react";\r
\r
interface ErrorBoundaryState {\r
  hasError: boolean;\r
}\r
\r
interface ErrorBoundaryProps {\r
  children: ReactNode\r
}\r
\r
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {\r
  constructor(props: ErrorBoundaryProps) {\r
    super(props)\r
    this.state = { hasError: false }\r
  }\r
\r
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {\r
    console.log("Derived Error", error)\r
    return { hasError: true }\r
  }\r
\r
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {\r
    console.log('Error: ', error)\r
    console.log('Error Info: ', errorInfo)\r
  }\r
\r
  render() {\r
    if (this.state.hasError) {\r
      return <h1>Oops! RemoteAPP falló</h1>\r
    }\r
\r
    return this.props.children\r
  }\r
}\r
\r
export default ErrorBoundary;\r
\`\`\`\r
\r
2 Envolver app\r
\`\`\`react\r
<ErrorBoundary>\r
  <App />\r
</ErrorBoundary>\r
\`\`\`\r
\r
3 Error de ejemplo\r
\`\`\`react\r
  useEffect(() => {\r
      throw new Error('Este es un error generado intencionalmente');\r
  }, []);\r
\`\`\`\r
`,Wt=`Fecha: 30/10/2024\r
---\r
tags: Tutoriales React Framework\r
---\r
\r
# Cómo crear un Micro-FrontEnd React + Vite + Federation\r
\r
\r
Código paso a paso para crear dos aplicaciones (remoto y cliente) React + Vite + Federation para Micro-FrontEnd.\r
\r
En [mi canal de youtube](https://youtu.be/M2o32pzNXI8) hay un video del paso a paso:\r
 \r
1 Crear dos proyectos (remoto y cliente)\r
- npm create vite@latest\r
\r
2 Instalar pnpm (PowerShell)\r
\`\`\`react\r
Invoke-WebRequest https://get.pnpm.io/install.ps1 -UseBasicParsing | Invoke-Expression\r
\`\`\`\r
\r
3 Instalar federation (cliente y remoto)\r
- pnpm add @originjs/vite-plugin-federation\r
\r
4 Configurar package.json (cliente y remoto)\r
\`\`\`react\r
"preview": "vite preview --port 5001 --strictPort",\r
"start": "npm run build && npm run preview"\r
\`\`\`\r
\r
5 Configurar vite.config (remoto)\r
\`\`\`react\r
import { defineConfig } from 'vite'\r
import react from '@vitejs/plugin-react-swc'\r
import federation from "@originjs/vite-plugin-federation";\r
\r
export default defineConfig({\r
  plugins: [\r
    react(),\r
    federation({\r
      name: "remote-app",\r
      filename: "remoteEntry.js",\r
      exposes: {\r
        "./remote-app": "./src/main.tsx",\r
      },\r
      shared: ["react", "react-dom"],\r
    }),\r
  ],\r
  build: {\r
    modulePreload: false,\r
    target: "esnext",\r
    minify: false,\r
    cssCodeSplit: false,\r
  },\r
});\r
\`\`\`\r
\r
6 Configurar main.tsx (remoto)\r
\`\`\`react\r
const Main = () => (\r
  <StrictMode>\r
    <App />\r
  </StrictMode>\r
)\r
\r
export default Main;\r
\`\`\`\r
\r
7 Configurar vite.config (cliente)  \r
\`\`\`react\r
import { defineConfig } from 'vite'\r
import react from '@vitejs/plugin-react-swc'\r
import federation from "@originjs/vite-plugin-federation";\r
\r
export default defineConfig({\r
  plugins: [\r
    react(),\r
    federation({\r
      name: "client-app",\r
      remotes: {\r
        remoteApp: "http://localhost:5001/assets/remoteEntry.js",\r
      },\r
      shared: ["react"],\r
    }),\r
  ],\r
  build: {\r
    modulePreload: false,\r
    target: "esnext",\r
\r
    minify: false,\r
    cssCodeSplit: false,\r
  },\r
});\r
\`\`\`\r
\r
8 Crear declares.d.ts (cliente)  \r
\`\`\`react\r
declare module 'remoteApp/remote-app' {\r
    export default RemoteApp;\r
}\r
\`\`\`\r
\r
9 Modificar app remoto  \r
10 Importar app remoto y llamarla cómo un componente  \r
11 npm run start (remoto y cliente)\r
`,Gt=`Fecha: 01/07/2022\r
---\r
tags: Python Trucos\r
---\r
\r
# Cómo renombrar archivos en masa con Python\r
\r
Paso a paso para renombrar archivos MP3 en masa y poder darle un orden aleatorio para reproducir en un radio vehicular\r
\r
En [mi canal de youtube](https://youtu.be/6fsG3UX7Cfo) hay un video del paso a paso:\r
\r
\`\`\`python\r
cont = 1\r
for i in file_list:\r
        print ("file: "+i)\r
        try:\r
                x = i.split(".")\r
                y = x[0].split("-")\r
                if len(y) == 1:\r
                    print(">>> no tiene separador \\n")\r
                elif len(y) > 2:\r
                    print(">>> tiene más de un separador \\n")\r
                else:\r
                    title = y[0].title().strip()\r
                    artist = y[1].title().strip()\r
                    \r
                current = EasyID3(i)\r
                newname = str(cont).zfill(3) + " " + title + " - " + artist + ".mp3"\r
                #print(newname)\r
                newname = current["title"][0] + ".mp3"\r
                #newname.replace(" ", "_")\r
                del current\r
                print ("renaming "+i+" to "+newname)\r
                os.rename(i, newname)\r
                cont = cont + 1\r
        except:\r
                print (">>> that file didn't work for some reason.")\r
\`\`\`\r
`,Kt=`Fecha: 07/10/2019\r
---\r
tags: Error Impresora Windows\r
---\r
\r
# Reset Impresora Cannon G3100 | 5B00\r
\r
Paso a paso para realizarle un reset a la imprersora Canon G3100 y solucionar el problema de deposito (absorbedor) de tinta lleno.\r
\r
En <a target="_blank" href="https://en.printkita.com/2020/09/download-canon-service-tool-v1050.html">esta web</a> hay un tutorial del paso a paso:\r
\r
1. <div id="cf-pdf-down">Descargar <a target="_blank" href="{{ page.tool }}">aplicación para reseteo</a></div>\r
2. Seguir paso a paso del link.\r
`,qt=`Fecha: 3/02/2023\r
---\r
tags: Tutoriales Trucos Juegos\r
---\r
\r
# Cómo agregar un contador de balas en Roblox Studio\r
\r
\r
Codigo para agregar un contador de balas en Roblox Studio usando el (ACS) Advanced Combat System.\r
\r
En [mi canal de youtube](https://youtu.be/EbKw0Dcaf6o) hay un video del paso a paso:\r
\r
Editar linea 1511 en StarterPlayer/StarterCharacterScripts/ACS_Client/ACS_Framework\r
\`\`\`csharp\r
	if WeaponData.ShootType == 1 then\r
		HUD.FText.Text = Ammo.."/"..StoredAmmo.." | Semi"\r
	elseif WeaponData.ShootType == 2 then\r
		HUD.FText.Text = Ammo.."/"..StoredAmmo.." | Burst"\r
	elseif WeaponData.ShootType == 3 then\r
		HUD.FText.Text = Ammo.."/"..StoredAmmo.." | Auto"\r
	elseif WeaponData.ShootType == 4 then\r
		HUD.FText.Text = Ammo.."/"..StoredAmmo.." | Pump-Action"\r
	elseif WeaponData.ShootType == 5 then\r
		HUD.FText.Text = Ammo.."/"..StoredAmmo.." | Bolt-Action"\r
	end\r
\`\`\`\r
`,Jt=`Fecha: 17/02/2026\r
---\r
tags: Tutoriales Linux\r
---\r
\r
# Cómo instalar sistema gráfico Linux\r
\r
Paso a paso para instalar un sistema grafico liviano a Linux server.\r
\r
En [mi canal de youtube](https://youtu.be/bZnSi0pwkxI) hay un video del paso a paso:\r
\r
1. Descargar\r
\`\`\`csharp\r
sudo apt update && sudo apt upgrade -y\r
sudo apt install xfce4 xfce4-goodies -y\r
\`\`\`\r
2. Sistema de inicio de session\r
\`\`\`csharp\r
sudo apt install slim -y\r
echo "startxfce4" > ~/.xsession\r
\`\`\`\r
3. Escritorio remoto\r
\`\`\`csharp\r
sudo apt install xrdp -y\r
sudo systemctl restart xrdp\r
sudo systemctl enable xrdp\r
\`\`\`\r
`,Yt=`Fecha: 21/01/2023\r
---\r
tags: Tutoriales Framework React\r
---\r
\r
# Cómo crear y configurar prueba unitaria Jest en React con Vite y Typescript\r
\r
Paso a paso para crear una prueba unitaria basica con Jest en React con Vite y Typescript.\r
\r
En [mi canal de youtube](https://youtu.be/62yuvCMZHco) hay un video del paso a paso:\r
\r
\`\`\`react\r
yarn add --dev jest babel-jest @babel/preset-env @babel/preset-react \r
yarn add --dev @testing-library/react @testing-library/dom @testing-library/user-event @types/jest jest-environment-jsdom\r
yarn add --dev jest-svg-transformer\r
pnpm i --save-dev @babel/core @babel/preset-typescript\r
pnpm i --save-dev identity-obj-proxy\r
\`\`\`\r
package.json\r
\`\`\`react\r
"test": "jest --watchAll=false --coverage --CI=true"\r
\`\`\`\r
\r
babel.config.js \r
\`\`\`react\r
module.exports = {\r
    presets: [\r
        [ '@babel/preset-env', { targets: { esmodules: true } } ],\r
        [ '@babel/preset-react', { runtime: 'automatic' } ],\r
        '@babel/preset-typescript',\r
    ],\r
};\r
\`\`\`\r
\r
jest.config.js\r
\`\`\`react\r
module.exports = {\r
    testEnvironment: 'jest-environment-jsdom',\r
    setupFiles: ['./jest.setup.js'],\r
    moduleNameMapper: {\r
        "^.+\\\\.svg$": "jest-svg-transformer",\r
	"\\\\.(css|less|scss)$": "identity-obj-proxy",\r
  }\r
}\r
\`\`\`\r
jest.setup.js\r
\r
App.test.tsx\r
\`\`\`react\r
import { render, screen } from '@testing-library/react';\r
import App from '../App';\r
\r
test('Renders main page correctly', async () => {\r
  render(<App />);\r
  const buttonCount = await screen.findByRole('button');\r
  expect(buttonCount.innerHTML).toBe('count is 0');\r
  expect(true).toBeTruthy();\r
});\r
\`\`\`\r
`,Xt=`Fecha: 16/02/2026\r
---\r
tags: Tutoriales Linux\r
---\r
\r
# Cómo instalar VS Code en Linux\r
\r
\r
Paso a paso para instalar VS Code en Linux server y poder acceder a el desde cualquier parte por medio de una url.\r
\r
En [mi canal de youtube](https://youtu.be/kN0RcPp5W7Y) hay un video del paso a paso:\r
\r
1. Descargar y ejecutar\r
\`\`\`csharp\r
curl -fsSL https://code-server.dev/install.sh | sh\r
\`\`\`\r
2. Revisar version.\r
\`\`\`csharp\r
code-server --version\r
\`\`\`\r
3. Ejecutar desde cualquier ip:\r
\`\`\`csharp\r
nano .config/code-server/config.yaml\r
bind-addr: 0.0.0.0:8080\r
\`\`\`\r
4. Activar servicio\r
\`\`\`csharp\r
sudo systemctl enable code-server@$USER\r
sudo systemctl start code-server@$USER\r
sudo systemctl status code-server@$USER\r
\`\`\`\r
5. Saber contraseña\r
\`\`\`csharp\r
cat ~/.config/code-server/config.yaml\r
\`\`\`\r
6. Ejecutar ip con puerto\r
\`\`\`csharp\r
http://IP_DEL_SERVIDOR:8080\r
\`\`\`\r
`,Zt=e=>{if(!e)return`01/01/2026`;let t=e.match(/Fecha:\s*(\d{1,2}\/\d{1,2}\/\d{4})/);return t?t[1]:`01/01/2026`},Qt=e=>e?e.replace(/^Fecha:\s*\d{1,2}\/\d{1,2}\/\d{4}\n?/gm,``):``,$t=e=>e||``,en=Object.assign({"../data/files/content/features.md":D,"../data/files/content/hoja-de-vida.md":O,"../data/files/internet/enlaces-curiosos-internet-deepweb.md":le,"../data/files/internet/puntos-google-maps-chernobyl.md":ue,"../data/files/internet/servicios-gratuitos-para-desarrolladores.md":de,"../data/files/system/foodservice-backend.md":fe,"../data/files/system/foodservice-cotizacion.md":pe,"../data/files/system/foodservice-horario.md":me,"../data/files/system/foodservice-informes.md":he,"../data/files/system/foodservice-ofertas-de-venta.md":ge,"../data/files/system/foodservice-venta-externa.md":_e,"../data/files/system/pantalla-errores.md":ve,"../data/files/system/pantalla-metas.md":ye,"../data/files/system/sistema-antropometrico.md":be,"../data/files/system/sistema-aportes.md":xe,"../data/files/system/sistema-ascensores.md":Se,"../data/files/system/sistema-joyas.md":Ce,"../data/files/system/sistema-turistico.md":we,"../data/files/web/IPS-colmedicos.md":Te,"../data/files/web/arepas-la-cajonera.md":Ee,"../data/files/web/azimut-consultores.md":De,"../data/files/web/caballo-de-troya.md":Oe,"../data/files/web/constructora-latinco.md":ke,"../data/files/web/galletas-marce.md":Ae,"../data/files/web/hotel-la-naval.md":je,"../data/files/web/integracion-arquitectura-y-concreto.md":Me,"../data/files/web/integracion-colchones-fantasia.md":Ne,"../data/files/web/integracion-durespo.md":Pe,"../data/files/web/lumes-ingenieria.md":Fe,"../data/files/web/motel-las-palmas.md":Ie,"../data/files/web/papeleria-portafolio.md":Le,"../data/files/web/restaurante-entremaderos.md":Re,"../data/files/web/restaurante-fresh-circus.md":ze,"../data/files/web/restaurante-parmesano.md":Be,"../data/files/web/restaurante-sancho-paisa.md":Ve,"../data/files/web/restaurante-todofresa.md":He,"../data/files/web/soluciones-massol.md":Ue,"../data/files/web/tienda-makeno.md":We,"../data/files/web/web-paintball.md":Ge,"../data/files/youtube/SSL-free-gratis.md":Ke,"../data/files/youtube/VScode-online.md":qe,"../data/files/youtube/activar-filtros-pagina-wish.md":Je,"../data/files/youtube/alerta-hp-client-security.md":Ye,"../data/files/youtube/allowed-memory-size-error.md":Xe,"../data/files/youtube/ampliar-disco-virtualbox.md":Ze,"../data/files/youtube/arreglar-error-ciclo-de-objetos-netcore5.md":Qe,"../data/files/youtube/aws-iot-node-topic.md":$e,"../data/files/youtube/babel-regenerator-runtime-error.md":et,"../data/files/youtube/bonos-forex-sin-deposito.md":tt,"../data/files/youtube/cloud9-laravel-57.md":nt,"../data/files/youtube/como-agregar-contenedores-turnkey-proxmox.md":rt,"../data/files/youtube/como-arreglar-problema-cors-netcore.md":it,"../data/files/youtube/como-buscar-librerias-flutter.md":at,"../data/files/youtube/como-instalar-docker-portainer-.md":ot,"../data/files/youtube/como-instalar-windows-proxmox.md":st,"../data/files/youtube/como-saber-el-nombre-de-un-video-bloqueado-en-youtube.md":ct,"../data/files/youtube/dark-linux-mint.md":lt,"../data/files/youtube/delete-all-tables-sql.md":ut,"../data/files/youtube/delete-inactive-contact-facebook.md":dt,"../data/files/youtube/dependencias-package-npm.md":ft,"../data/files/youtube/deploy-api-netcore-aws.md":pt,"../data/files/youtube/deploy-nextjs-to-heroku.md":mt,"../data/files/youtube/deploy-react-app-github.md":ht,"../data/files/youtube/deploy-react-aws.md":gt,"../data/files/youtube/descargar-iso-windows10.md":_t,"../data/files/youtube/docker-servidor-Jekyll.md":vt,"../data/files/youtube/drivers-online-gratis.md":yt,"../data/files/youtube/encriptacion-aes-facturacion-electronica-cadena.md":bt,"../data/files/youtube/entity-user-net-core-5.md":xt,"../data/files/youtube/error-tinta-canon-g3100-G3000-series.md":St,"../data/files/youtube/expert-advisor-metatrader5.md":Ct,"../data/files/youtube/exportar-CSV-firebase.md":wt,"../data/files/youtube/instalacion-configuracion-raspberry.md":Tt,"../data/files/youtube/instalacion-evolution-api.md":Et,"../data/files/youtube/instalacion-laravel-amazon.md":Dt,"../data/files/youtube/instalacion-portainer-linux.md":Ot,"../data/files/youtube/instalacion-wiki-dokuwiki.md":kt,"../data/files/youtube/instalar-windows-store.md":At,"../data/files/youtube/menu-imagenes-joomla.md":jt,"../data/files/youtube/net-core-clean-arquitecture.md":Mt,"../data/files/youtube/net-core-mongo-jwt.md":Nt,"../data/files/youtube/ollama-en-linux.md":Pt,"../data/files/youtube/ollama-gratis-con-gpu.md":Ft,"../data/files/youtube/pagina-web-github-pages.md":It,"../data/files/youtube/pantalla-celular-windows.md":Lt,"../data/files/youtube/php-mysql-phpmyadmin.md":Rt,"../data/files/youtube/problema-cors-laravel-6-2020.md":zt,"../data/files/youtube/problema-cors-laravel-6.md":Bt,"../data/files/youtube/problema-cors-laravel.md":Vt,"../data/files/youtube/problema-pantalla-negra-obs-studio.md":Ht,"../data/files/youtube/react-error-boundary.md":Ut,"../data/files/youtube/react-vite-federation.md":Wt,"../data/files/youtube/renombrar-archivos-en-masa-con-python.md":Gt,"../data/files/youtube/reset-canon-g3100.md":Kt,"../data/files/youtube/roblox-studio-contador-de-balas.md":qt,"../data/files/youtube/sistema-grafico-linux.md":Jt,"../data/files/youtube/vite-jest-typescript-app.md":Yt,"../data/files/youtube/vscode-server.md":Xt}),tn=()=>{let e=(0,v.useCallback)(()=>{let e={};return Object.entries(en).forEach(([t,n])=>{let r=t.replace(`../data/files/`,``).split(`/`),i=r[0],a=r[1].replace(`.md`,``);e[i]||(e[i]=[]),e[i].push({name:a,content:Qt(n),date:Zt(n)})}),Object.entries(e).map(([e,t])=>({name:e,type:`folder`,children:t.map(e=>({name:e.name+`.md`,type:`file`,date:e.date}))}))},[]),t=(0,v.useCallback)((e,t)=>{let n=en[`../data/files/${t}/${e}`];return n?Qt(n):`File not found`},[]),n=(0,v.useCallback)((e,t)=>{let n=en[`../data/files/${t}/${e}`];return n?$t(n):`File not found`},[]),r=(0,v.useCallback)((e,t)=>{let n=en[`../data/files/${t}/${e}`];return n?{content:Qt(n),rawContent:$t(n),date:Zt(n)}:null},[]),i=(0,v.useCallback)(()=>{let e=[];return Object.entries(en).forEach(([t,n])=>{let r=t.replace(`../data/files/`,``).split(`/`),i=r[0],a=r[1];e.push({folder:i,name:a,content:Qt(n),rawContent:$t(n),date:Zt(n)})}),e},[]);return{getFileStructure:e,getFileContent:t,getRawFileContent:n,getFileWithDate:r,getAllFiles:i,findFileByUrl:(0,v.useCallback)((e,t)=>{let n=i(),r=e.toLowerCase(),a=t.toLowerCase().endsWith(`.md`)?t.toLowerCase():`${t.toLowerCase()}.md`;return n.find(e=>e.folder.toLowerCase()===r&&e.name.toLowerCase()===a)},[i])}},nn={welcome:{es:`Bienvenido a juandavid.site`,en:`Welcome to juandavid.site`},objects:{es:`objeto(s)`,en:`object(s)`},folders:{es:`carpeta(s)`,en:`folder(s)`},preview:{es:`Vista Previa`,en:`Preview`},source:{es:`Código Fuente`,en:`Source`},welcomeTip:{es:`¿Sabías que...?`,en:`Did you know...?`},didYouKnow:{es:`¿Sabías que...?`,en:`Did you know...?`},nextTip:{es:`Siguiente Tip`,en:`Next Tip`},whatsNew:{es:`Qué hay de nuevo`,en:`What's New`},onlineRegistration:{es:`Registro en línea`,en:`Online Registration`},close:{es:`Cerrar`,en:`Close`},showWelcomeScreen:{es:`Mostrar esta pantalla de bienvenida al iniciar Windows`,en:`Show this Welcome Screen next time you start Windows`},settings:{es:`Configuración`,en:`Settings`},language:{es:`Idioma`,en:`Language`},selectLanguage:{es:`Seleccione el idioma:`,en:`Select language:`},spanish:{es:`Español`,en:`Spanish`},english:{es:`Inglés`,en:`English`},apply:{es:`Aceptar`,en:`Apply`},cancel:{es:`Cancelar`,en:`Cancel`},search:{es:`Buscar`,en:`Search`},searchPlaceholder:{es:`Escribe una palabra...`,en:`Type a word...`},typeToSearch:{es:`Escribe una palabra para buscar en los archivos`,en:`Type a word to search in files`},noFilesFound:{es:`No se encontraron archivos con`,en:`No files found matching`},name:{es:`Nombre`,en:`Name`},location:{es:`Ubicación`,en:`Location`},date:{es:`Fecha`,en:`Date`},type:{es:`Tipo`,en:`Type`},title:{es:`Título`,en:`Title`},content:{es:`Contenido`,en:`Content`},ready:{es:`Listo`,en:`Ready`},noSearch:{es:`Sin búsqueda`,en:`No search`},results:{es:`resultados`,en:`results`},tableView:{es:`Vista de Tabla`,en:`Table View`},treeView:{es:`Vista de Árbol`,en:`Tree View`}},rn=()=>{let{language:e}=ae(),t=e===`es`||e===`en`?e:`en`;return{t:e=>nn[e]?.[t]||e}},an={LANGUAGE:`language`,SHOW_WELCOME:`show_welcome`},on=()=>{let[e,t]=(0,v.useState)(()=>localStorage.getItem(an.SHOW_WELCOME)!==`false`);(0,v.useEffect)(()=>{localStorage.setItem(an.SHOW_WELCOME,String(e))},[e]);let[n,r]=(0,v.useState)(0),i=w()?.onClose,{language:a,changeLanguage:o}=ae(),{openApp:s}=ce(),{getRawFileContent:c}=tn(),{t:l}=rn(),u=()=>{s(`fileViewer`,{file:{name:`hoja-de-vida`,content:c(`hoja-de-vida.md`,`content`),folder:`content`,date:`01/01/2009`},windowKey:`content/hoja-de-vida.md`,title:`hoja-de-vida`})},d=()=>{s(`fileViewer`,{file:{name:`features`,content:c(`features.md`,`content`),folder:`content`,date:`17/03/2026`},windowKey:`content/features.md`,title:l(`whatsNew`)})},f={en:[`Full Stack Developer expert in Cloud Process Automation, PaintBall, Softcombat and Roller derby Player, Robotics, Electronics and Technology Lover.`,(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:{margin:`0 0 8px 0`,fontStyle:`italic`},children:`About me`}),(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,b.jsx)(`div`,{onClick:u,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`,cursor:`pointer`},children:`📄 Resume`}),(0,b.jsx)(`a`,{href:`https://www.linkedin.com/in/juandavid8a`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`💼 LinkedIn`}),(0,b.jsx)(`a`,{href:`https://www.youtube.com/@JuanDavidOchoa`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`▶️ YouTube`}),(0,b.jsx)(`a`,{href:`https://www.instagram.com/zarkito8a`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📷 Instagram`})]})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:{margin:`0 0 8px 0`,fontStyle:`italic`},children:`Contact Info`}),(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,b.jsx)(`a`,{href:`mailto:juandavid8a@gmail.com`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📧 juandavid8a@gmail.com`}),(0,b.jsx)(`a`,{href:`tel:+573052370311`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📞 (+57) 3052370311`}),(0,b.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:`📍 Medellín - Colombia`})]})]}),`Available for consulting, mentoring, or hourly freelance work. Let's build something great together!`],es:[`Desarrollador Full Stack experto en Automatización de Procesos en la Nube, jugador de PaintBall, Softcombat y Roller derby, Gomoso de la Robótica, Electrónica y Tecnología.`,(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:{margin:`0 0 8px 0`,fontStyle:`italic`},children:`Sobre mí`}),(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,b.jsx)(`div`,{onClick:u,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`,cursor:`pointer`},children:`📄 Hoja de vida`}),(0,b.jsx)(`a`,{href:`https://www.linkedin.com/in/juandavid8a`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`💼 LinkedIn`}),(0,b.jsx)(`a`,{href:`https://www.youtube.com/@JuanDavidOchoa`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`▶️ YouTube`}),(0,b.jsx)(`a`,{href:`https://www.instagram.com/zarkito8a`,target:`_blank`,rel:`noopener noreferrer`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📷 Instagram`})]})]}),(0,b.jsxs)(`div`,{children:[(0,b.jsx)(`p`,{style:{margin:`0 0 8px 0`,fontStyle:`italic`},children:`Datos de contacto`}),(0,b.jsxs)(`div`,{style:{display:`flex`,flexDirection:`column`,gap:`6px`},children:[(0,b.jsx)(`a`,{href:`mailto:juandavid8a@gmail.com`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📧 juandavid8a@gmail.com`}),(0,b.jsx)(`a`,{href:`tel:+573052370311`,style:{color:`#0000ff`,textDecoration:`none`,display:`flex`,alignItems:`center`,gap:`8px`},children:`📞 (+57) 3052370311`}),(0,b.jsx)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`8px`},children:`📍 Medellín - Colombia`})]})]}),`Disponible para asesorías, mentorías o trabajos por horas. ¡Impulsemos tu proyecto juntos!`]},p=a===`es`?f.es:f.en;return(0,b.jsxs)(`div`,{className:`welcome-container`,style:{height:`100%`,display:`flex`,flexDirection:`column`,background:`#c0c0c0`,color:`#000`,fontFamily:`"MS Sans Serif", Arial, sans-serif`,fontSize:`11px`,padding:`20px`,boxSizing:`border-box`},children:[(0,b.jsx)(`h2`,{style:{fontSize:`18px`,margin:`0 0 15px 0`,fontWeight:`normal`,color:`#000`},children:l(`welcome`)}),(0,b.jsxs)(`div`,{style:{display:`flex`,flex:1,gap:`20px`},children:[(0,b.jsx)(`div`,{style:{flex:1,background:`#fff`,border:`2px inset #ffffff`,padding:`20px`,display:`flex`,flexDirection:`column`,gap:`20px`,overflowY:`auto`},children:(0,b.jsxs)(`div`,{style:{display:`flex`,gap:`20px`,alignItems:`flex-start`},children:[(0,b.jsx)(`div`,{style:{fontSize:`32px`},children:`💡`}),(0,b.jsxs)(`div`,{style:{flex:1},children:[(0,b.jsx)(`p`,{style:{margin:`0 0 12px 0`,fontWeight:`bold`,fontSize:`13px`},children:l(`didYouKnow`)}),(0,b.jsx)(`div`,{style:{margin:0,lineHeight:`1.5`,fontSize:`12px`},children:p[n]})]})]})}),(0,b.jsxs)(`div`,{className:`welcome-buttons`,style:{width:`140px`,display:`flex`,flexDirection:`column`,gap:`10px`},children:[(0,b.jsx)(`button`,{onClick:()=>{r(e=>(e+1)%p.length)},style:{padding:`6px 12px`,background:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`1px 1px 0px #000`,cursor:`pointer`,textAlign:`left`,width:`100%`},children:l(`nextTip`)}),(0,b.jsx)(`button`,{onClick:d,style:{padding:`6px 12px`,background:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`1px 1px 0px #000`,cursor:`pointer`,textAlign:`left`,width:`100%`},children:l(`whatsNew`)}),(0,b.jsx)(`button`,{style:{padding:`6px 12px`,background:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`1px 1px 0px #000`,cursor:`pointer`,textAlign:`left`,width:`100%`},children:l(`onlineRegistration`)}),(0,b.jsx)(`button`,{onClick:()=>{i?.()},style:{padding:`6px 12px`,background:`#c0c0c0`,border:`2px outset #ffffff`,boxShadow:`1px 1px 0px #000`,cursor:`pointer`,textAlign:`left`,width:`100%`,marginTop:`10px`},children:l(`close`)}),(0,b.jsxs)(`fieldset`,{style:{marginTop:`auto`,padding:`10px`},children:[(0,b.jsx)(`legend`,{children:l(`language`)}),(0,b.jsxs)(`div`,{className:`field-row`,children:[(0,b.jsx)(`input`,{id:`lang-en`,type:`radio`,name:`language-select`,value:`en`,checked:a===`en`,onChange:()=>o(`en`)}),(0,b.jsx)(`label`,{htmlFor:`lang-en`,children:`English`})]}),(0,b.jsxs)(`div`,{className:`field-row`,style:{marginTop:`4px`},children:[(0,b.jsx)(`input`,{id:`lang-es`,type:`radio`,name:`language-select`,value:`es`,checked:a===`es`,onChange:()=>o(`es`)}),(0,b.jsx)(`label`,{htmlFor:`lang-es`,children:`Español`})]})]})]})]}),(0,b.jsxs)(`div`,{className:`welcome-footer`,style:{marginTop:`20px`,display:`flex`,alignItems:`center`,gap:`8px`,justifyContent:`flex-start`},children:[(0,b.jsx)(`input`,{type:`checkbox`,checked:e,onChange:e=>t(e.target.checked),id:`startup-check`,style:{cursor:`pointer`}}),(0,b.jsx)(`label`,{htmlFor:`startup-check`,style:{cursor:`pointer`},children:l(`showWelcomeScreen`)})]})]})},sn=()=>{let[e,t]=(0,v.useState)(``),[n,r]=(0,v.useState)(1),[i,a]=(0,v.useState)(1);return(0,b.jsxs)(`div`,{className:`notepad-container`,style:{padding:`4px`,background:`#c0c0c0`,height:`100%`,display:`flex`,flexDirection:`column`,overflow:`hidden`},children:[(0,b.jsx)(`div`,{className:`sunken-panel`,style:{flex:1,background:`#fff`,display:`flex`,flexDirection:`column`},children:(0,b.jsx)(`textarea`,{className:`notepad-textarea`,value:e,onChange:e=>{t(e.target.value);let n=e.target.value.split(`
`);r(n.length),a(n[n.length-1].length+1)},placeholder:`Type here...`,style:{border:`none`,flex:1,width:`100%`,resize:`none`,padding:`5px`}})}),(0,b.jsxs)(`div`,{className:`notepad-statusbar`,children:[`Ln `,n,`, Col `,i]})]})},cn=()=>{let{getFileStructure:e,getRawFileContent:t}=tn(),{openApp:n}=ce(),[r,i]=(0,v.useState)({}),[a,o]=(0,v.useState)(`table`),{t:s}=rn(),c=(0,v.useMemo)(()=>e(),[e]),l=(0,v.useMemo)(()=>{let e=c.length,t=0;return c.forEach(e=>{t+=e.children?.length||0}),{folderCount:e,fileCount:t}},[c]),u=(0,v.useCallback)(e=>{i(t=>({...t,[e]:!t[e]}))},[]),d=(0,v.useCallback)((e,r)=>{let i=t(e.name,r);n(`fileViewer`,{file:{name:e.name.replace(`.md`,``),content:i,folder:r,date:e.date||`01/01/2026`},windowKey:`${r}/${e.name}`,title:e.name.replace(`.md`,``)})},[t,n]),f=()=>c.map(e=>{let t=r[e.name]===!0;return(0,b.jsxs)(`li`,{children:[(0,b.jsxs)(`div`,{className:`fileexplorer-folder`,onClick:()=>u(e.name),children:[t?`📂`:`📁`,` `,e.name]}),t&&(0,b.jsx)(`ul`,{children:e.children?.map(t=>(0,b.jsxs)(`li`,{className:`fileexplorer-file`,onClick:n=>{n.stopPropagation(),d(t,e.name)},children:[`📄 `,t.name]},t.name))})]},e.name)}),p=()=>{let e=[];return c.forEach(t=>{t.children?.forEach(n=>{e.push({name:n.name,folder:t.name,date:n.date||`01/01/2026`,dateObj:new Date((n.date||`01/01/2026`).split(`/`).reverse().join(`-`))})})}),e.sort((e,t)=>t.dateObj.getTime()-e.dateObj.getTime()),(0,b.jsxs)(`table`,{className:`interactive`,style:{width:`100%`,borderCollapse:`collapse`,border:`none`,margin:0},children:[(0,b.jsx)(`thead`,{style:{position:`sticky`,top:0,zIndex:1,background:`#c0c0c0`},children:(0,b.jsxs)(`tr`,{children:[(0,b.jsx)(`th`,{style:{textAlign:`left`,width:`50%`},children:s(`name`)}),(0,b.jsx)(`th`,{style:{textAlign:`left`,width:`25%`},children:s(`location`)}),(0,b.jsx)(`th`,{style:{textAlign:`left`,width:`25%`},children:s(`date`)})]})}),(0,b.jsx)(`tbody`,{children:e.map((e,r)=>(0,b.jsxs)(`tr`,{onClick:()=>{let r=t(e.name,e.folder);n(`fileViewer`,{file:{name:e.name.replace(`.md`,``),content:r,folder:e.folder,date:e.date},windowKey:`${e.folder}/${e.name}`,title:e.name.replace(`.md`,``)})},children:[(0,b.jsx)(`td`,{children:e.name}),(0,b.jsx)(`td`,{children:e.folder}),(0,b.jsx)(`td`,{children:e.date})]},r))})]})};return(0,b.jsxs)(`div`,{className:`fileexplorer-container`,children:[(0,b.jsxs)(`menu`,{role:`tablist`,children:[(0,b.jsx)(`li`,{role:`tab`,"aria-selected":a===`table`,children:(0,b.jsx)(`a`,{href:`#table`,onClick:e=>{e.preventDefault(),o(`table`)},children:s(`tableView`)})}),(0,b.jsx)(`li`,{role:`tab`,"aria-selected":a===`tree`,children:(0,b.jsx)(`a`,{href:`#tree`,onClick:e=>{e.preventDefault(),o(`tree`)},children:s(`treeView`)})})]}),(0,b.jsx)(`div`,{className:`window`,role:`tabpanel`,style:{flex:1,display:`flex`,flexDirection:`column`,margin:`0`,border:`none`,boxShadow:`none`,overflow:`hidden`},children:(0,b.jsx)(`div`,{className:`window-body`,style:{flex:1,display:`flex`,flexDirection:`column`,margin:`0`,padding:`4px`,background:`#c0c0c0`,overflow:`hidden`},children:a===`tree`?(0,b.jsx)(`div`,{className:`sunken-panel`,style:{flex:1,overflow:`auto`,background:`#fff`},children:(0,b.jsx)(`ul`,{className:`tree-view`,style:{border:`none`,boxShadow:`none`,margin:0,width:`max-content`,minWidth:`100%`,overflow:`visible`},children:f()})}):(0,b.jsx)(`div`,{className:`sunken-panel`,style:{flex:1,overflow:`auto`,background:`#fff`},children:p()})})}),(0,b.jsxs)(`div`,{className:`status-bar`,style:{marginTop:`4px`},children:[(0,b.jsxs)(`p`,{className:`status-bar-field`,children:[l.folderCount,` `,s(`folders`)]}),(0,b.jsxs)(`p`,{className:`status-bar-field`,children:[l.fileCount,` `,s(`objects`)]}),(0,b.jsx)(`p`,{className:`status-bar-field`,children:s(`ready`)})]})]})};function ln(e){let t=[],n=String(e||``),r=n.indexOf(`,`),i=0,a=!1;for(;!a;){r===-1&&(r=n.length,a=!0);let e=n.slice(i,r).trim();(e||!a)&&t.push(e),i=r+1,r=n.indexOf(`,`,i)}return t}function un(e,t){let n=t||{};return(e[e.length-1]===``?[...e,``]:e).join((n.padRight?` `:``)+`,`+(n.padLeft===!1?``:` `)).trim()}var dn=/^[$_\p{ID_Start}][$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,fn=/^[$_\p{ID_Start}][-$_\u{200C}\u{200D}\p{ID_Continue}]*$/u,pn={};function mn(e,t){return((t||pn).jsx?fn:dn).test(e)}var hn=/[ \t\n\f\r]/g;function gn(e){return typeof e==`object`?e.type===`text`?_n(e.value):!1:_n(e)}function _n(e){return e.replace(hn,``)===``}var vn=class{constructor(e,t,n){this.normal=t,this.property=e,n&&(this.space=n)}};vn.prototype.normal={},vn.prototype.property={},vn.prototype.space=void 0;function yn(e,t){let n={},r={};for(let t of e)Object.assign(n,t.property),Object.assign(r,t.normal);return new vn(n,r,t)}function bn(e){return e.toLowerCase()}var xn=class{constructor(e,t){this.attribute=t,this.property=e}};xn.prototype.attribute=``,xn.prototype.booleanish=!1,xn.prototype.boolean=!1,xn.prototype.commaOrSpaceSeparated=!1,xn.prototype.commaSeparated=!1,xn.prototype.defined=!1,xn.prototype.mustUseProperty=!1,xn.prototype.number=!1,xn.prototype.overloadedBoolean=!1,xn.prototype.property=``,xn.prototype.spaceSeparated=!1,xn.prototype.space=void 0;var Sn=s({boolean:()=>k,booleanish:()=>wn,commaOrSpaceSeparated:()=>Dn,commaSeparated:()=>En,number:()=>A,overloadedBoolean:()=>Tn,spaceSeparated:()=>j}),Cn=0,k=On(),wn=On(),Tn=On(),A=On(),j=On(),En=On(),Dn=On();function On(){return 2**++Cn}var kn=Object.keys(Sn),An=class extends xn{constructor(e,t,n,r){let i=-1;if(super(e,t),jn(this,`space`,r),typeof n==`number`)for(;++i<kn.length;){let e=kn[i];jn(this,kn[i],(n&Sn[e])===Sn[e])}}};An.prototype.defined=!0;function jn(e,t,n){n&&(e[t]=n)}function Mn(e){let t={},n={};for(let[r,i]of Object.entries(e.properties)){let a=new An(r,e.transform(e.attributes||{},r),i,e.space);e.mustUseProperty&&e.mustUseProperty.includes(r)&&(a.mustUseProperty=!0),t[r]=a,n[bn(r)]=r,n[bn(a.attribute)]=r}return new vn(t,n,e.space)}var Nn=Mn({properties:{ariaActiveDescendant:null,ariaAtomic:wn,ariaAutoComplete:null,ariaBusy:wn,ariaChecked:wn,ariaColCount:A,ariaColIndex:A,ariaColSpan:A,ariaControls:j,ariaCurrent:null,ariaDescribedBy:j,ariaDetails:null,ariaDisabled:wn,ariaDropEffect:j,ariaErrorMessage:null,ariaExpanded:wn,ariaFlowTo:j,ariaGrabbed:wn,ariaHasPopup:null,ariaHidden:wn,ariaInvalid:null,ariaKeyShortcuts:null,ariaLabel:null,ariaLabelledBy:j,ariaLevel:A,ariaLive:null,ariaModal:wn,ariaMultiLine:wn,ariaMultiSelectable:wn,ariaOrientation:null,ariaOwns:j,ariaPlaceholder:null,ariaPosInSet:A,ariaPressed:wn,ariaReadOnly:wn,ariaRelevant:null,ariaRequired:wn,ariaRoleDescription:j,ariaRowCount:A,ariaRowIndex:A,ariaRowSpan:A,ariaSelected:wn,ariaSetSize:A,ariaSort:null,ariaValueMax:A,ariaValueMin:A,ariaValueNow:A,ariaValueText:null,role:null},transform(e,t){return t===`role`?t:`aria-`+t.slice(4).toLowerCase()}});function Pn(e,t){return t in e?e[t]:t}function Fn(e,t){return Pn(e,t.toLowerCase())}var In=Mn({attributes:{acceptcharset:`accept-charset`,classname:`class`,htmlfor:`for`,httpequiv:`http-equiv`},mustUseProperty:[`checked`,`multiple`,`muted`,`selected`],properties:{abbr:null,accept:En,acceptCharset:j,accessKey:j,action:null,allow:null,allowFullScreen:k,allowPaymentRequest:k,allowUserMedia:k,alt:null,as:null,async:k,autoCapitalize:null,autoComplete:j,autoFocus:k,autoPlay:k,blocking:j,capture:null,charSet:null,checked:k,cite:null,className:j,cols:A,colSpan:null,content:null,contentEditable:wn,controls:k,controlsList:j,coords:A|En,crossOrigin:null,data:null,dateTime:null,decoding:null,default:k,defer:k,dir:null,dirName:null,disabled:k,download:Tn,draggable:wn,encType:null,enterKeyHint:null,fetchPriority:null,form:null,formAction:null,formEncType:null,formMethod:null,formNoValidate:k,formTarget:null,headers:j,height:A,hidden:Tn,high:A,href:null,hrefLang:null,htmlFor:j,httpEquiv:j,id:null,imageSizes:null,imageSrcSet:null,inert:k,inputMode:null,integrity:null,is:null,isMap:k,itemId:null,itemProp:j,itemRef:j,itemScope:k,itemType:j,kind:null,label:null,lang:null,language:null,list:null,loading:null,loop:k,low:A,manifest:null,max:null,maxLength:A,media:null,method:null,min:null,minLength:A,multiple:k,muted:k,name:null,nonce:null,noModule:k,noValidate:k,onAbort:null,onAfterPrint:null,onAuxClick:null,onBeforeMatch:null,onBeforePrint:null,onBeforeToggle:null,onBeforeUnload:null,onBlur:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onContextLost:null,onContextMenu:null,onContextRestored:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnded:null,onError:null,onFocus:null,onFormData:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLanguageChange:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadEnd:null,onLoadStart:null,onMessage:null,onMessageError:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRejectionHandled:null,onReset:null,onResize:null,onScroll:null,onScrollEnd:null,onSecurityPolicyViolation:null,onSeeked:null,onSeeking:null,onSelect:null,onSlotChange:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnhandledRejection:null,onUnload:null,onVolumeChange:null,onWaiting:null,onWheel:null,open:k,optimum:A,pattern:null,ping:j,placeholder:null,playsInline:k,popover:null,popoverTarget:null,popoverTargetAction:null,poster:null,preload:null,readOnly:k,referrerPolicy:null,rel:j,required:k,reversed:k,rows:A,rowSpan:A,sandbox:j,scope:null,scoped:k,seamless:k,selected:k,shadowRootClonable:k,shadowRootDelegatesFocus:k,shadowRootMode:null,shape:null,size:A,sizes:null,slot:null,span:A,spellCheck:wn,src:null,srcDoc:null,srcLang:null,srcSet:null,start:A,step:null,style:null,tabIndex:A,target:null,title:null,translate:null,type:null,typeMustMatch:k,useMap:null,value:wn,width:A,wrap:null,writingSuggestions:null,align:null,aLink:null,archive:j,axis:null,background:null,bgColor:null,border:A,borderColor:null,bottomMargin:A,cellPadding:null,cellSpacing:null,char:null,charOff:null,classId:null,clear:null,code:null,codeBase:null,codeType:null,color:null,compact:k,declare:k,event:null,face:null,frame:null,frameBorder:null,hSpace:A,leftMargin:A,link:null,longDesc:null,lowSrc:null,marginHeight:A,marginWidth:A,noResize:k,noHref:k,noShade:k,noWrap:k,object:null,profile:null,prompt:null,rev:null,rightMargin:A,rules:null,scheme:null,scrolling:wn,standby:null,summary:null,text:null,topMargin:A,valueType:null,version:null,vAlign:null,vLink:null,vSpace:A,allowTransparency:null,autoCorrect:null,autoSave:null,disablePictureInPicture:k,disableRemotePlayback:k,prefix:null,property:null,results:A,security:null,unselectable:null},space:`html`,transform:Fn}),Ln=Mn({attributes:{accentHeight:`accent-height`,alignmentBaseline:`alignment-baseline`,arabicForm:`arabic-form`,baselineShift:`baseline-shift`,capHeight:`cap-height`,className:`class`,clipPath:`clip-path`,clipRule:`clip-rule`,colorInterpolation:`color-interpolation`,colorInterpolationFilters:`color-interpolation-filters`,colorProfile:`color-profile`,colorRendering:`color-rendering`,crossOrigin:`crossorigin`,dataType:`datatype`,dominantBaseline:`dominant-baseline`,enableBackground:`enable-background`,fillOpacity:`fill-opacity`,fillRule:`fill-rule`,floodColor:`flood-color`,floodOpacity:`flood-opacity`,fontFamily:`font-family`,fontSize:`font-size`,fontSizeAdjust:`font-size-adjust`,fontStretch:`font-stretch`,fontStyle:`font-style`,fontVariant:`font-variant`,fontWeight:`font-weight`,glyphName:`glyph-name`,glyphOrientationHorizontal:`glyph-orientation-horizontal`,glyphOrientationVertical:`glyph-orientation-vertical`,hrefLang:`hreflang`,horizAdvX:`horiz-adv-x`,horizOriginX:`horiz-origin-x`,horizOriginY:`horiz-origin-y`,imageRendering:`image-rendering`,letterSpacing:`letter-spacing`,lightingColor:`lighting-color`,markerEnd:`marker-end`,markerMid:`marker-mid`,markerStart:`marker-start`,navDown:`nav-down`,navDownLeft:`nav-down-left`,navDownRight:`nav-down-right`,navLeft:`nav-left`,navNext:`nav-next`,navPrev:`nav-prev`,navRight:`nav-right`,navUp:`nav-up`,navUpLeft:`nav-up-left`,navUpRight:`nav-up-right`,onAbort:`onabort`,onActivate:`onactivate`,onAfterPrint:`onafterprint`,onBeforePrint:`onbeforeprint`,onBegin:`onbegin`,onCancel:`oncancel`,onCanPlay:`oncanplay`,onCanPlayThrough:`oncanplaythrough`,onChange:`onchange`,onClick:`onclick`,onClose:`onclose`,onCopy:`oncopy`,onCueChange:`oncuechange`,onCut:`oncut`,onDblClick:`ondblclick`,onDrag:`ondrag`,onDragEnd:`ondragend`,onDragEnter:`ondragenter`,onDragExit:`ondragexit`,onDragLeave:`ondragleave`,onDragOver:`ondragover`,onDragStart:`ondragstart`,onDrop:`ondrop`,onDurationChange:`ondurationchange`,onEmptied:`onemptied`,onEnd:`onend`,onEnded:`onended`,onError:`onerror`,onFocus:`onfocus`,onFocusIn:`onfocusin`,onFocusOut:`onfocusout`,onHashChange:`onhashchange`,onInput:`oninput`,onInvalid:`oninvalid`,onKeyDown:`onkeydown`,onKeyPress:`onkeypress`,onKeyUp:`onkeyup`,onLoad:`onload`,onLoadedData:`onloadeddata`,onLoadedMetadata:`onloadedmetadata`,onLoadStart:`onloadstart`,onMessage:`onmessage`,onMouseDown:`onmousedown`,onMouseEnter:`onmouseenter`,onMouseLeave:`onmouseleave`,onMouseMove:`onmousemove`,onMouseOut:`onmouseout`,onMouseOver:`onmouseover`,onMouseUp:`onmouseup`,onMouseWheel:`onmousewheel`,onOffline:`onoffline`,onOnline:`ononline`,onPageHide:`onpagehide`,onPageShow:`onpageshow`,onPaste:`onpaste`,onPause:`onpause`,onPlay:`onplay`,onPlaying:`onplaying`,onPopState:`onpopstate`,onProgress:`onprogress`,onRateChange:`onratechange`,onRepeat:`onrepeat`,onReset:`onreset`,onResize:`onresize`,onScroll:`onscroll`,onSeeked:`onseeked`,onSeeking:`onseeking`,onSelect:`onselect`,onShow:`onshow`,onStalled:`onstalled`,onStorage:`onstorage`,onSubmit:`onsubmit`,onSuspend:`onsuspend`,onTimeUpdate:`ontimeupdate`,onToggle:`ontoggle`,onUnload:`onunload`,onVolumeChange:`onvolumechange`,onWaiting:`onwaiting`,onZoom:`onzoom`,overlinePosition:`overline-position`,overlineThickness:`overline-thickness`,paintOrder:`paint-order`,panose1:`panose-1`,pointerEvents:`pointer-events`,referrerPolicy:`referrerpolicy`,renderingIntent:`rendering-intent`,shapeRendering:`shape-rendering`,stopColor:`stop-color`,stopOpacity:`stop-opacity`,strikethroughPosition:`strikethrough-position`,strikethroughThickness:`strikethrough-thickness`,strokeDashArray:`stroke-dasharray`,strokeDashOffset:`stroke-dashoffset`,strokeLineCap:`stroke-linecap`,strokeLineJoin:`stroke-linejoin`,strokeMiterLimit:`stroke-miterlimit`,strokeOpacity:`stroke-opacity`,strokeWidth:`stroke-width`,tabIndex:`tabindex`,textAnchor:`text-anchor`,textDecoration:`text-decoration`,textRendering:`text-rendering`,transformOrigin:`transform-origin`,typeOf:`typeof`,underlinePosition:`underline-position`,underlineThickness:`underline-thickness`,unicodeBidi:`unicode-bidi`,unicodeRange:`unicode-range`,unitsPerEm:`units-per-em`,vAlphabetic:`v-alphabetic`,vHanging:`v-hanging`,vIdeographic:`v-ideographic`,vMathematical:`v-mathematical`,vectorEffect:`vector-effect`,vertAdvY:`vert-adv-y`,vertOriginX:`vert-origin-x`,vertOriginY:`vert-origin-y`,wordSpacing:`word-spacing`,writingMode:`writing-mode`,xHeight:`x-height`,playbackOrder:`playbackorder`,timelineBegin:`timelinebegin`},properties:{about:Dn,accentHeight:A,accumulate:null,additive:null,alignmentBaseline:null,alphabetic:A,amplitude:A,arabicForm:null,ascent:A,attributeName:null,attributeType:null,azimuth:A,bandwidth:null,baselineShift:null,baseFrequency:null,baseProfile:null,bbox:null,begin:null,bias:A,by:null,calcMode:null,capHeight:A,className:j,clip:null,clipPath:null,clipPathUnits:null,clipRule:null,color:null,colorInterpolation:null,colorInterpolationFilters:null,colorProfile:null,colorRendering:null,content:null,contentScriptType:null,contentStyleType:null,crossOrigin:null,cursor:null,cx:null,cy:null,d:null,dataType:null,defaultAction:null,descent:A,diffuseConstant:A,direction:null,display:null,dur:null,divisor:A,dominantBaseline:null,download:k,dx:null,dy:null,edgeMode:null,editable:null,elevation:A,enableBackground:null,end:null,event:null,exponent:A,externalResourcesRequired:null,fill:null,fillOpacity:A,fillRule:null,filter:null,filterRes:null,filterUnits:null,floodColor:null,floodOpacity:null,focusable:null,focusHighlight:null,fontFamily:null,fontSize:null,fontSizeAdjust:null,fontStretch:null,fontStyle:null,fontVariant:null,fontWeight:null,format:null,fr:null,from:null,fx:null,fy:null,g1:En,g2:En,glyphName:En,glyphOrientationHorizontal:null,glyphOrientationVertical:null,glyphRef:null,gradientTransform:null,gradientUnits:null,handler:null,hanging:A,hatchContentUnits:null,hatchUnits:null,height:null,href:null,hrefLang:null,horizAdvX:A,horizOriginX:A,horizOriginY:A,id:null,ideographic:A,imageRendering:null,initialVisibility:null,in:null,in2:null,intercept:A,k:A,k1:A,k2:A,k3:A,k4:A,kernelMatrix:Dn,kernelUnitLength:null,keyPoints:null,keySplines:null,keyTimes:null,kerning:null,lang:null,lengthAdjust:null,letterSpacing:null,lightingColor:null,limitingConeAngle:A,local:null,markerEnd:null,markerMid:null,markerStart:null,markerHeight:null,markerUnits:null,markerWidth:null,mask:null,maskContentUnits:null,maskUnits:null,mathematical:null,max:null,media:null,mediaCharacterEncoding:null,mediaContentEncodings:null,mediaSize:A,mediaTime:null,method:null,min:null,mode:null,name:null,navDown:null,navDownLeft:null,navDownRight:null,navLeft:null,navNext:null,navPrev:null,navRight:null,navUp:null,navUpLeft:null,navUpRight:null,numOctaves:null,observer:null,offset:null,onAbort:null,onActivate:null,onAfterPrint:null,onBeforePrint:null,onBegin:null,onCancel:null,onCanPlay:null,onCanPlayThrough:null,onChange:null,onClick:null,onClose:null,onCopy:null,onCueChange:null,onCut:null,onDblClick:null,onDrag:null,onDragEnd:null,onDragEnter:null,onDragExit:null,onDragLeave:null,onDragOver:null,onDragStart:null,onDrop:null,onDurationChange:null,onEmptied:null,onEnd:null,onEnded:null,onError:null,onFocus:null,onFocusIn:null,onFocusOut:null,onHashChange:null,onInput:null,onInvalid:null,onKeyDown:null,onKeyPress:null,onKeyUp:null,onLoad:null,onLoadedData:null,onLoadedMetadata:null,onLoadStart:null,onMessage:null,onMouseDown:null,onMouseEnter:null,onMouseLeave:null,onMouseMove:null,onMouseOut:null,onMouseOver:null,onMouseUp:null,onMouseWheel:null,onOffline:null,onOnline:null,onPageHide:null,onPageShow:null,onPaste:null,onPause:null,onPlay:null,onPlaying:null,onPopState:null,onProgress:null,onRateChange:null,onRepeat:null,onReset:null,onResize:null,onScroll:null,onSeeked:null,onSeeking:null,onSelect:null,onShow:null,onStalled:null,onStorage:null,onSubmit:null,onSuspend:null,onTimeUpdate:null,onToggle:null,onUnload:null,onVolumeChange:null,onWaiting:null,onZoom:null,opacity:null,operator:null,order:null,orient:null,orientation:null,origin:null,overflow:null,overlay:null,overlinePosition:A,overlineThickness:A,paintOrder:null,panose1:null,path:null,pathLength:A,patternContentUnits:null,patternTransform:null,patternUnits:null,phase:null,ping:j,pitch:null,playbackOrder:null,pointerEvents:null,points:null,pointsAtX:A,pointsAtY:A,pointsAtZ:A,preserveAlpha:null,preserveAspectRatio:null,primitiveUnits:null,propagate:null,property:Dn,r:null,radius:null,referrerPolicy:null,refX:null,refY:null,rel:Dn,rev:Dn,renderingIntent:null,repeatCount:null,repeatDur:null,requiredExtensions:Dn,requiredFeatures:Dn,requiredFonts:Dn,requiredFormats:Dn,resource:null,restart:null,result:null,rotate:null,rx:null,ry:null,scale:null,seed:null,shapeRendering:null,side:null,slope:null,snapshotTime:null,specularConstant:A,specularExponent:A,spreadMethod:null,spacing:null,startOffset:null,stdDeviation:null,stemh:null,stemv:null,stitchTiles:null,stopColor:null,stopOpacity:null,strikethroughPosition:A,strikethroughThickness:A,string:null,stroke:null,strokeDashArray:Dn,strokeDashOffset:null,strokeLineCap:null,strokeLineJoin:null,strokeMiterLimit:A,strokeOpacity:A,strokeWidth:null,style:null,surfaceScale:A,syncBehavior:null,syncBehaviorDefault:null,syncMaster:null,syncTolerance:null,syncToleranceDefault:null,systemLanguage:Dn,tabIndex:A,tableValues:null,target:null,targetX:A,targetY:A,textAnchor:null,textDecoration:null,textRendering:null,textLength:null,timelineBegin:null,title:null,transformBehavior:null,type:null,typeOf:Dn,to:null,transform:null,transformOrigin:null,u1:null,u2:null,underlinePosition:A,underlineThickness:A,unicode:null,unicodeBidi:null,unicodeRange:null,unitsPerEm:A,values:null,vAlphabetic:A,vMathematical:A,vectorEffect:null,vHanging:A,vIdeographic:A,version:null,vertAdvY:A,vertOriginX:A,vertOriginY:A,viewBox:null,viewTarget:null,visibility:null,width:null,widths:null,wordSpacing:null,writingMode:null,x:null,x1:null,x2:null,xChannelSelector:null,xHeight:A,y:null,y1:null,y2:null,yChannelSelector:null,z:null,zoomAndPan:null},space:`svg`,transform:Pn}),Rn=Mn({properties:{xLinkActuate:null,xLinkArcRole:null,xLinkHref:null,xLinkRole:null,xLinkShow:null,xLinkTitle:null,xLinkType:null},space:`xlink`,transform(e,t){return`xlink:`+t.slice(5).toLowerCase()}}),zn=Mn({attributes:{xmlnsxlink:`xmlns:xlink`},properties:{xmlnsXLink:null,xmlns:null},space:`xmlns`,transform:Fn}),Bn=Mn({properties:{xmlBase:null,xmlLang:null,xmlSpace:null},space:`xml`,transform(e,t){return`xml:`+t.slice(3).toLowerCase()}}),Vn={classId:`classID`,dataType:`datatype`,itemId:`itemID`,strokeDashArray:`strokeDasharray`,strokeDashOffset:`strokeDashoffset`,strokeLineCap:`strokeLinecap`,strokeLineJoin:`strokeLinejoin`,strokeMiterLimit:`strokeMiterlimit`,typeOf:`typeof`,xLinkActuate:`xlinkActuate`,xLinkArcRole:`xlinkArcrole`,xLinkHref:`xlinkHref`,xLinkRole:`xlinkRole`,xLinkShow:`xlinkShow`,xLinkTitle:`xlinkTitle`,xLinkType:`xlinkType`,xmlnsXLink:`xmlnsXlink`},Hn=/[A-Z]/g,Un=/-[a-z]/g,Wn=/^data[-\w.:]+$/i;function Gn(e,t){let n=bn(t),r=t,i=xn;if(n in e.normal)return e.property[e.normal[n]];if(n.length>4&&n.slice(0,4)===`data`&&Wn.test(t)){if(t.charAt(4)===`-`){let e=t.slice(5).replace(Un,qn);r=`data`+e.charAt(0).toUpperCase()+e.slice(1)}else{let e=t.slice(4);if(!Un.test(e)){let n=e.replace(Hn,Kn);n.charAt(0)!==`-`&&(n=`-`+n),t=`data`+n}}i=An}return new i(r,t)}function Kn(e){return`-`+e.toLowerCase()}function qn(e){return e.charAt(1).toUpperCase()}var Jn=yn([Nn,In,Rn,zn,Bn],`html`),Yn=yn([Nn,Ln,Rn,zn,Bn],`svg`);function Xn(e){let t=String(e||``).trim();return t?t.split(/[ \t\n\r\f]+/g):[]}function Zn(e){return e.join(` `).trim()}var Qn=o(((e,t)=>{var n=/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g,r=/\n/g,i=/^\s*/,a=/^(\*?[-#/*\\\w]+(\[[0-9a-z_-]+\])?)\s*/,o=/^:\s*/,s=/^((?:'(?:\\'|.)*?'|"(?:\\"|.)*?"|\([^)]*?\)|[^};])+)/,c=/^[;\s]*/,l=/^\s+|\s+$/g,u=`
`,d=`/`,f=`*`,p=``,m=`comment`,h=`declaration`;function g(e,t){if(typeof e!=`string`)throw TypeError(`First argument must be a string`);if(!e)return[];t||={};var l=1,g=1;function v(e){var t=e.match(r);t&&(l+=t.length);var n=e.lastIndexOf(u);g=~n?e.length-n:g+e.length}function y(){var e={line:l,column:g};return function(t){return t.position=new b(e),S(),t}}function b(e){this.start=e,this.end={line:l,column:g},this.source=t.source}b.prototype.content=e;function x(n){var r=Error(t.source+`:`+l+`:`+g+`: `+n);if(r.reason=n,r.filename=t.source,r.line=l,r.column=g,r.source=e,!t.silent)throw r}function ee(t){var n=t.exec(e);if(n){var r=n[0];return v(r),e=e.slice(r.length),n}}function S(){ee(i)}function C(e){var t;for(e||=[];t=w();)t!==!1&&e.push(t);return e}function w(){var t=y();if(!(d!=e.charAt(0)||f!=e.charAt(1))){for(var n=2;p!=e.charAt(n)&&(f!=e.charAt(n)||d!=e.charAt(n+1));)++n;if(n+=2,p===e.charAt(n-1))return x(`End of comment missing`);var r=e.slice(2,n-2);return g+=2,v(r),e=e.slice(n),g+=2,t({type:m,comment:r})}}function T(){var e=y(),t=ee(a);if(t){if(w(),!ee(o))return x(`property missing ':'`);var r=ee(s),i=e({type:h,property:_(t[0].replace(n,p)),value:r?_(r[0].replace(n,p)):p});return ee(c),i}}function te(){var e=[];C(e);for(var t;t=T();)t!==!1&&(e.push(t),C(e));return e}return S(),te()}function _(e){return e?e.replace(l,p):p}t.exports=g})),$n=o((e=>{var t=e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(e,`__esModule`,{value:!0}),e.default=r;var n=t(Qn());function r(e,t){let r=null;if(!e||typeof e!=`string`)return r;let i=(0,n.default)(e),a=typeof t==`function`;return i.forEach(e=>{if(e.type!==`declaration`)return;let{property:n,value:i}=e;a?t(n,i,e):i&&(r||={},r[n]=i)}),r}})),er=o((e=>{Object.defineProperty(e,`__esModule`,{value:!0}),e.camelCase=void 0;var t=/^--[a-zA-Z0-9_-]+$/,n=/-([a-z])/g,r=/^[^-]+$/,i=/^-(webkit|moz|ms|o|khtml)-/,a=/^-(ms)-/,o=function(e){return!e||r.test(e)||t.test(e)},s=function(e,t){return t.toUpperCase()},c=function(e,t){return`${t}-`};e.camelCase=function(e,t){return t===void 0&&(t={}),o(e)?e:(e=e.toLowerCase(),e=t.reactCompat?e.replace(a,c):e.replace(i,c),e.replace(n,s))}})),tr=o(((e,t)=>{var n=(e&&e.__importDefault||function(e){return e&&e.__esModule?e:{default:e}})($n()),r=er();function i(e,t){var i={};return!e||typeof e!=`string`||(0,n.default)(e,function(e,n){e&&n&&(i[(0,r.camelCase)(e,t)]=n)}),i}i.default=i,t.exports=i})),nr=ir(`end`),rr=ir(`start`);function ir(e){return t;function t(t){let n=t&&t.position&&t.position[e]||{};if(typeof n.line==`number`&&n.line>0&&typeof n.column==`number`&&n.column>0)return{line:n.line,column:n.column,offset:typeof n.offset==`number`&&n.offset>-1?n.offset:void 0}}}function ar(e){let t=rr(e),n=nr(e);if(t&&n)return{start:t,end:n}}function or(e){return!e||typeof e!=`object`?``:`position`in e||`type`in e?cr(e.position):`start`in e||`end`in e?cr(e):`line`in e||`column`in e?sr(e):``}function sr(e){return lr(e&&e.line)+`:`+lr(e&&e.column)}function cr(e){return sr(e&&e.start)+`-`+sr(e&&e.end)}function lr(e){return e&&typeof e==`number`?e:1}var ur=class extends Error{constructor(e,t,n){super(),typeof t==`string`&&(n=t,t=void 0);let r=``,i={},a=!1;if(t&&(i=`line`in t&&`column`in t||`start`in t&&`end`in t?{place:t}:`type`in t?{ancestors:[t],place:t.position}:{...t}),typeof e==`string`?r=e:!i.cause&&e&&(a=!0,r=e.message,i.cause=e),!i.ruleId&&!i.source&&typeof n==`string`){let e=n.indexOf(`:`);e===-1?i.ruleId=n:(i.source=n.slice(0,e),i.ruleId=n.slice(e+1))}if(!i.place&&i.ancestors&&i.ancestors){let e=i.ancestors[i.ancestors.length-1];e&&(i.place=e.position)}let o=i.place&&`start`in i.place?i.place.start:i.place;this.ancestors=i.ancestors||void 0,this.cause=i.cause||void 0,this.column=o?o.column:void 0,this.fatal=void 0,this.file=``,this.message=r,this.line=o?o.line:void 0,this.name=or(i.place)||`1:1`,this.place=i.place||void 0,this.reason=this.message,this.ruleId=i.ruleId||void 0,this.source=i.source||void 0,this.stack=a&&i.cause&&typeof i.cause.stack==`string`?i.cause.stack:``,this.actual=void 0,this.expected=void 0,this.note=void 0,this.url=void 0}};ur.prototype.file=``,ur.prototype.name=``,ur.prototype.reason=``,ur.prototype.message=``,ur.prototype.stack=``,ur.prototype.column=void 0,ur.prototype.line=void 0,ur.prototype.ancestors=void 0,ur.prototype.cause=void 0,ur.prototype.fatal=void 0,ur.prototype.place=void 0,ur.prototype.ruleId=void 0,ur.prototype.source=void 0;var dr=l(tr(),1),fr={}.hasOwnProperty,pr=new Map,mr=/[A-Z]/g,hr=new Set([`table`,`tbody`,`thead`,`tfoot`,`tr`]),gr=new Set([`td`,`th`]),_r=`https://github.com/syntax-tree/hast-util-to-jsx-runtime`;function vr(e,t){if(!t||t.Fragment===void 0)throw TypeError("Expected `Fragment` in options");let n=t.filePath||void 0,r;if(t.development){if(typeof t.jsxDEV!=`function`)throw TypeError("Expected `jsxDEV` in options when `development: true`");r=kr(n,t.jsxDEV)}else{if(typeof t.jsx!=`function`)throw TypeError("Expected `jsx` in production options");if(typeof t.jsxs!=`function`)throw TypeError("Expected `jsxs` in production options");r=Or(n,t.jsx,t.jsxs)}let i={Fragment:t.Fragment,ancestors:[],components:t.components||{},create:r,elementAttributeNameCase:t.elementAttributeNameCase||`react`,evaluater:t.createEvaluater?t.createEvaluater():void 0,filePath:n,ignoreInvalidStyle:t.ignoreInvalidStyle||!1,passKeys:t.passKeys!==!1,passNode:t.passNode||!1,schema:t.space===`svg`?Yn:Jn,stylePropertyNameCase:t.stylePropertyNameCase||`dom`,tableCellAlignToStyle:t.tableCellAlignToStyle!==!1},a=yr(i,e,void 0);return a&&typeof a!=`string`?a:i.create(e,i.Fragment,{children:a||void 0},void 0)}function yr(e,t,n){if(t.type===`element`)return br(e,t,n);if(t.type===`mdxFlowExpression`||t.type===`mdxTextExpression`)return xr(e,t);if(t.type===`mdxJsxFlowElement`||t.type===`mdxJsxTextElement`)return Cr(e,t,n);if(t.type===`mdxjsEsm`)return Sr(e,t);if(t.type===`root`)return wr(e,t,n);if(t.type===`text`)return Tr(e,t)}function br(e,t,n){let r=e.schema,i=r;t.tagName.toLowerCase()===`svg`&&r.space===`html`&&(i=Yn,e.schema=i),e.ancestors.push(t);let a=Fr(e,t.tagName,!1),o=Ar(e,t),s=Mr(e,t);return hr.has(t.tagName)&&(s=s.filter(function(e){return typeof e==`string`?!gn(e):!0})),Er(e,o,a,t),Dr(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function xr(e,t){if(t.data&&t.data.estree&&e.evaluater){let n=t.data.estree.body[0];return n.type,e.evaluater.evaluateExpression(n.expression)}Ir(e,t.position)}function Sr(e,t){if(t.data&&t.data.estree&&e.evaluater)return e.evaluater.evaluateProgram(t.data.estree);Ir(e,t.position)}function Cr(e,t,n){let r=e.schema,i=r;t.name===`svg`&&r.space===`html`&&(i=Yn,e.schema=i),e.ancestors.push(t);let a=t.name===null?e.Fragment:Fr(e,t.name,!0),o=jr(e,t),s=Mr(e,t);return Er(e,o,a,t),Dr(o,s),e.ancestors.pop(),e.schema=r,e.create(t,a,o,n)}function wr(e,t,n){let r={};return Dr(r,Mr(e,t)),e.create(t,e.Fragment,r,n)}function Tr(e,t){return t.value}function Er(e,t,n,r){typeof n!=`string`&&n!==e.Fragment&&e.passNode&&(t.node=r)}function Dr(e,t){if(t.length>0){let n=t.length>1?t:t[0];n&&(e.children=n)}}function Or(e,t,n){return r;function r(e,r,i,a){let o=Array.isArray(i.children)?n:t;return a?o(r,i,a):o(r,i)}}function kr(e,t){return n;function n(n,r,i,a){let o=Array.isArray(i.children),s=rr(n);return t(r,i,a,o,{columnNumber:s?s.column-1:void 0,fileName:e,lineNumber:s?s.line:void 0},void 0)}}function Ar(e,t){let n={},r,i;for(i in t.properties)if(i!==`children`&&fr.call(t.properties,i)){let a=Nr(e,i,t.properties[i]);if(a){let[i,o]=a;e.tableCellAlignToStyle&&i===`align`&&typeof o==`string`&&gr.has(t.tagName)?r=o:n[i]=o}}if(r){let t=n.style||={};t[e.stylePropertyNameCase===`css`?`text-align`:`textAlign`]=r}return n}function jr(e,t){let n={};for(let r of t.attributes)if(r.type===`mdxJsxExpressionAttribute`)if(r.data&&r.data.estree&&e.evaluater){let t=r.data.estree.body[0];t.type;let i=t.expression;i.type;let a=i.properties[0];a.type,Object.assign(n,e.evaluater.evaluateExpression(a.argument))}else Ir(e,t.position);else{let i=r.name,a;if(r.value&&typeof r.value==`object`)if(r.value.data&&r.value.data.estree&&e.evaluater){let t=r.value.data.estree.body[0];t.type,a=e.evaluater.evaluateExpression(t.expression)}else Ir(e,t.position);else a=r.value===null?!0:r.value;n[i]=a}return n}function Mr(e,t){let n=[],r=-1,i=e.passKeys?new Map:pr;for(;++r<t.children.length;){let a=t.children[r],o;if(e.passKeys){let e=a.type===`element`?a.tagName:a.type===`mdxJsxFlowElement`||a.type===`mdxJsxTextElement`?a.name:void 0;if(e){let t=i.get(e)||0;o=e+`-`+t,i.set(e,t+1)}}let s=yr(e,a,o);s!==void 0&&n.push(s)}return n}function Nr(e,t,n){let r=Gn(e.schema,t);if(!(n==null||typeof n==`number`&&Number.isNaN(n))){if(Array.isArray(n)&&(n=r.commaSeparated?un(n):Zn(n)),r.property===`style`){let t=typeof n==`object`?n:Pr(e,String(n));return e.stylePropertyNameCase===`css`&&(t=Lr(t)),[`style`,t]}return[e.elementAttributeNameCase===`react`&&r.space?Vn[r.property]||r.property:r.attribute,n]}}function Pr(e,t){try{return(0,dr.default)(t,{reactCompat:!0})}catch(t){if(e.ignoreInvalidStyle)return{};let n=t,r=new ur("Cannot parse `style` attribute",{ancestors:e.ancestors,cause:n,ruleId:`style`,source:`hast-util-to-jsx-runtime`});throw r.file=e.filePath||void 0,r.url=_r+`#cannot-parse-style-attribute`,r}}function Fr(e,t,n){let r;if(!n)r={type:`Literal`,value:t};else if(t.includes(`.`)){let e=t.split(`.`),n=-1,i;for(;++n<e.length;){let t=mn(e[n])?{type:`Identifier`,name:e[n]}:{type:`Literal`,value:e[n]};i=i?{type:`MemberExpression`,object:i,property:t,computed:!!(n&&t.type===`Literal`),optional:!1}:t}r=i}else r=mn(t)&&!/^[a-z]/.test(t)?{type:`Identifier`,name:t}:{type:`Literal`,value:t};if(r.type===`Literal`){let t=r.value;return fr.call(e.components,t)?e.components[t]:t}if(e.evaluater)return e.evaluater.evaluateExpression(r);Ir(e)}function Ir(e,t){let n=new ur("Cannot handle MDX estrees without `createEvaluater`",{ancestors:e.ancestors,place:t,ruleId:`mdx-estree`,source:`hast-util-to-jsx-runtime`});throw n.file=e.filePath||void 0,n.url=_r+`#cannot-handle-mdx-estrees-without-createevaluater`,n}function Lr(e){let t={},n;for(n in e)fr.call(e,n)&&(t[Rr(n)]=e[n]);return t}function Rr(e){let t=e.replace(mr,zr);return t.slice(0,3)===`ms-`&&(t=`-`+t),t}function zr(e){return`-`+e.toLowerCase()}var Br={action:[`form`],cite:[`blockquote`,`del`,`ins`,`q`],data:[`object`],formAction:[`button`,`input`],href:[`a`,`area`,`base`,`link`],icon:[`menuitem`],itemId:null,manifest:[`html`],ping:[`a`,`area`],poster:[`video`],src:[`audio`,`embed`,`iframe`,`img`,`input`,`script`,`source`,`track`,`video`]},Vr={};function Hr(e,t){let n=t||Vr;return Ur(e,typeof n.includeImageAlt==`boolean`?n.includeImageAlt:!0,typeof n.includeHtml==`boolean`?n.includeHtml:!0)}function Ur(e,t,n){if(Gr(e)){if(`value`in e)return e.type===`html`&&!n?``:e.value;if(t&&`alt`in e&&e.alt)return e.alt;if(`children`in e)return Wr(e.children,t,n)}return Array.isArray(e)?Wr(e,t,n):``}function Wr(e,t,n){let r=[],i=-1;for(;++i<e.length;)r[i]=Ur(e[i],t,n);return r.join(``)}function Gr(e){return!!(e&&typeof e==`object`)}var Kr=document.createElement(`i`);function qr(e){let t=`&`+e+`;`;Kr.innerHTML=t;let n=Kr.textContent;return n.charCodeAt(n.length-1)===59&&e!==`semi`||n===t?!1:n}function Jr(e,t,n,r){let i=e.length,a=0,o;if(t=t<0?-t>i?0:i+t:t>i?i:t,n=n>0?n:0,r.length<1e4)o=Array.from(r),o.unshift(t,n),e.splice(...o);else for(n&&e.splice(t,n);a<r.length;)o=r.slice(a,a+1e4),o.unshift(t,0),e.splice(...o),a+=1e4,t+=1e4}function Yr(e,t){return e.length>0?(Jr(e,e.length,0,t),e):t}var Xr={}.hasOwnProperty;function Zr(e){let t={},n=-1;for(;++n<e.length;)Qr(t,e[n]);return t}function Qr(e,t){let n;for(n in t){let r=(Xr.call(e,n)?e[n]:void 0)||(e[n]={}),i=t[n],a;if(i)for(a in i){Xr.call(r,a)||(r[a]=[]);let e=i[a];$r(r[a],Array.isArray(e)?e:e?[e]:[])}}}function $r(e,t){let n=-1,r=[];for(;++n<t.length;)(t[n].add===`after`?e:r).push(t[n]);Jr(e,0,0,r)}function ei(e,t){let n=Number.parseInt(e,t);return n<9||n===11||n>13&&n<32||n>126&&n<160||n>55295&&n<57344||n>64975&&n<65008||(n&65535)==65535||(n&65535)==65534||n>1114111?`�`:String.fromCodePoint(n)}function ti(e){return e.replace(/[\t\n\r ]+/g,` `).replace(/^ | $/g,``).toLowerCase().toUpperCase()}var ni=fi(/[A-Za-z]/),ri=fi(/[\dA-Za-z]/),ii=fi(/[#-'*+\--9=?A-Z^-~]/);function ai(e){return e!==null&&(e<32||e===127)}var oi=fi(/\d/),si=fi(/[\dA-Fa-f]/),ci=fi(/[!-/:-@[-`{-~]/);function M(e){return e!==null&&e<-2}function li(e){return e!==null&&(e<0||e===32)}function N(e){return e===-2||e===-1||e===32}var ui=fi(/\p{P}|\p{S}/u),di=fi(/\s/);function fi(e){return t;function t(t){return t!==null&&t>-1&&e.test(String.fromCharCode(t))}}function pi(e){let t=[],n=-1,r=0,i=0;for(;++n<e.length;){let a=e.charCodeAt(n),o=``;if(a===37&&ri(e.charCodeAt(n+1))&&ri(e.charCodeAt(n+2)))i=2;else if(a<128)/[!#$&-;=?-Z_a-z~]/.test(String.fromCharCode(a))||(o=String.fromCharCode(a));else if(a>55295&&a<57344){let t=e.charCodeAt(n+1);a<56320&&t>56319&&t<57344?(o=String.fromCharCode(a,t),i=1):o=`�`}else o=String.fromCharCode(a);o&&=(t.push(e.slice(r,n),encodeURIComponent(o)),r=n+i+1,``),i&&=(n+=i,0)}return t.join(``)+e.slice(r)}function P(e,t,n,r){let i=r?r-1:1/0,a=0;return o;function o(r){return N(r)?(e.enter(n),s(r)):t(r)}function s(r){return N(r)&&a++<i?(e.consume(r),s):(e.exit(n),t(r))}}var mi={tokenize:hi};function hi(e){let t=e.attempt(this.parser.constructs.contentInitial,r,i),n;return t;function r(n){if(n===null){e.consume(n);return}return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),P(e,t,`linePrefix`)}function i(t){return e.enter(`paragraph`),a(t)}function a(t){let r=e.enter(`chunkText`,{contentType:`text`,previous:n});return n&&(n.next=r),n=r,o(t)}function o(t){if(t===null){e.exit(`chunkText`),e.exit(`paragraph`),e.consume(t);return}return M(t)?(e.consume(t),e.exit(`chunkText`),a):(e.consume(t),o)}}var gi={tokenize:vi},_i={tokenize:yi};function vi(e){let t=this,n=[],r=0,i,a,o;return s;function s(i){if(r<n.length){let a=n[r];return t.containerState=a[1],e.attempt(a[0].continuation,c,l)(i)}return l(i)}function c(e){if(r++,t.containerState._closeFlow){t.containerState._closeFlow=void 0,i&&v();let n=t.events.length,a=n,o;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){o=t.events[a][1].end;break}_(r);let s=n;for(;s<t.events.length;)t.events[s][1].end={...o},s++;return Jr(t.events,a+1,0,t.events.slice(n)),t.events.length=s,l(e)}return s(e)}function l(a){if(r===n.length){if(!i)return f(a);if(i.currentConstruct&&i.currentConstruct.concrete)return m(a);t.interrupt=!!(i.currentConstruct&&!i._gfmTableDynamicInterruptHack)}return t.containerState={},e.check(_i,u,d)(a)}function u(e){return i&&v(),_(r),f(e)}function d(e){return t.parser.lazy[t.now().line]=r!==n.length,o=t.now().offset,m(e)}function f(n){return t.containerState={},e.attempt(_i,p,m)(n)}function p(e){return r++,n.push([t.currentConstruct,t.containerState]),f(e)}function m(n){if(n===null){i&&v(),_(0),e.consume(n);return}return i||=t.parser.flow(t.now()),e.enter(`chunkFlow`,{_tokenizer:i,contentType:`flow`,previous:a}),h(n)}function h(n){if(n===null){g(e.exit(`chunkFlow`),!0),_(0),e.consume(n);return}return M(n)?(e.consume(n),g(e.exit(`chunkFlow`)),r=0,t.interrupt=void 0,s):(e.consume(n),h)}function g(e,n){let s=t.sliceStream(e);if(n&&s.push(null),e.previous=a,a&&(a.next=e),a=e,i.defineSkip(e.start),i.write(s),t.parser.lazy[e.start.line]){let e=i.events.length;for(;e--;)if(i.events[e][1].start.offset<o&&(!i.events[e][1].end||i.events[e][1].end.offset>o))return;let n=t.events.length,a=n,s,c;for(;a--;)if(t.events[a][0]===`exit`&&t.events[a][1].type===`chunkFlow`){if(s){c=t.events[a][1].end;break}s=!0}for(_(r),e=n;e<t.events.length;)t.events[e][1].end={...c},e++;Jr(t.events,a+1,0,t.events.slice(n)),t.events.length=e}}function _(r){let i=n.length;for(;i-- >r;){let r=n[i];t.containerState=r[1],r[0].exit.call(t,e)}n.length=r}function v(){i.write([null]),a=void 0,i=void 0,t.containerState._closeFlow=void 0}}function yi(e,t,n){return P(e,e.attempt(this.parser.constructs.document,t,n),`linePrefix`,this.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)}function bi(e){if(e===null||li(e)||di(e))return 1;if(ui(e))return 2}function xi(e,t,n){let r=[],i=-1;for(;++i<e.length;){let a=e[i].resolveAll;a&&!r.includes(a)&&(t=a(t,n),r.push(a))}return t}var Si={name:`attention`,resolveAll:Ci,tokenize:wi};function Ci(e,t){let n=-1,r,i,a,o,s,c,l,u;for(;++n<e.length;)if(e[n][0]===`enter`&&e[n][1].type===`attentionSequence`&&e[n][1]._close){for(r=n;r--;)if(e[r][0]===`exit`&&e[r][1].type===`attentionSequence`&&e[r][1]._open&&t.sliceSerialize(e[r][1]).charCodeAt(0)===t.sliceSerialize(e[n][1]).charCodeAt(0)){if((e[r][1]._close||e[n][1]._open)&&(e[n][1].end.offset-e[n][1].start.offset)%3&&!((e[r][1].end.offset-e[r][1].start.offset+e[n][1].end.offset-e[n][1].start.offset)%3))continue;c=e[r][1].end.offset-e[r][1].start.offset>1&&e[n][1].end.offset-e[n][1].start.offset>1?2:1;let d={...e[r][1].end},f={...e[n][1].start};Ti(d,-c),Ti(f,c),o={type:c>1?`strongSequence`:`emphasisSequence`,start:d,end:{...e[r][1].end}},s={type:c>1?`strongSequence`:`emphasisSequence`,start:{...e[n][1].start},end:f},a={type:c>1?`strongText`:`emphasisText`,start:{...e[r][1].end},end:{...e[n][1].start}},i={type:c>1?`strong`:`emphasis`,start:{...o.start},end:{...s.end}},e[r][1].end={...o.start},e[n][1].start={...s.end},l=[],e[r][1].end.offset-e[r][1].start.offset&&(l=Yr(l,[[`enter`,e[r][1],t],[`exit`,e[r][1],t]])),l=Yr(l,[[`enter`,i,t],[`enter`,o,t],[`exit`,o,t],[`enter`,a,t]]),l=Yr(l,xi(t.parser.constructs.insideSpan.null,e.slice(r+1,n),t)),l=Yr(l,[[`exit`,a,t],[`enter`,s,t],[`exit`,s,t],[`exit`,i,t]]),e[n][1].end.offset-e[n][1].start.offset?(u=2,l=Yr(l,[[`enter`,e[n][1],t],[`exit`,e[n][1],t]])):u=0,Jr(e,r-1,n-r+3,l),n=r+l.length-u-2;break}}for(n=-1;++n<e.length;)e[n][1].type===`attentionSequence`&&(e[n][1].type=`data`);return e}function wi(e,t){let n=this.parser.constructs.attentionMarkers.null,r=this.previous,i=bi(r),a;return o;function o(t){return a=t,e.enter(`attentionSequence`),s(t)}function s(o){if(o===a)return e.consume(o),s;let c=e.exit(`attentionSequence`),l=bi(o),u=!l||l===2&&i||n.includes(o),d=!i||i===2&&l||n.includes(r);return c._open=!!(a===42?u:u&&(i||!d)),c._close=!!(a===42?d:d&&(l||!u)),t(o)}}function Ti(e,t){e.column+=t,e.offset+=t,e._bufferIndex+=t}var Ei={name:`autolink`,tokenize:Di};function Di(e,t,n){let r=0;return i;function i(t){return e.enter(`autolink`),e.enter(`autolinkMarker`),e.consume(t),e.exit(`autolinkMarker`),e.enter(`autolinkProtocol`),a}function a(t){return ni(t)?(e.consume(t),o):t===64?n(t):l(t)}function o(e){return e===43||e===45||e===46||ri(e)?(r=1,s(e)):l(e)}function s(t){return t===58?(e.consume(t),r=0,c):(t===43||t===45||t===46||ri(t))&&r++<32?(e.consume(t),s):(r=0,l(t))}function c(r){return r===62?(e.exit(`autolinkProtocol`),e.enter(`autolinkMarker`),e.consume(r),e.exit(`autolinkMarker`),e.exit(`autolink`),t):r===null||r===32||r===60||ai(r)?n(r):(e.consume(r),c)}function l(t){return t===64?(e.consume(t),u):ii(t)?(e.consume(t),l):n(t)}function u(e){return ri(e)?d(e):n(e)}function d(n){return n===46?(e.consume(n),r=0,u):n===62?(e.exit(`autolinkProtocol`).type=`autolinkEmail`,e.enter(`autolinkMarker`),e.consume(n),e.exit(`autolinkMarker`),e.exit(`autolink`),t):f(n)}function f(t){if((t===45||ri(t))&&r++<63){let n=t===45?f:d;return e.consume(t),n}return n(t)}}var Oi={partial:!0,tokenize:ki};function ki(e,t,n){return r;function r(t){return N(t)?P(e,i,`linePrefix`)(t):i(t)}function i(e){return e===null||M(e)?t(e):n(e)}}var Ai={continuation:{tokenize:Mi},exit:Ni,name:`blockQuote`,tokenize:ji};function ji(e,t,n){let r=this;return i;function i(t){if(t===62){let n=r.containerState;return n.open||=(e.enter(`blockQuote`,{_container:!0}),!0),e.enter(`blockQuotePrefix`),e.enter(`blockQuoteMarker`),e.consume(t),e.exit(`blockQuoteMarker`),a}return n(t)}function a(n){return N(n)?(e.enter(`blockQuotePrefixWhitespace`),e.consume(n),e.exit(`blockQuotePrefixWhitespace`),e.exit(`blockQuotePrefix`),t):(e.exit(`blockQuotePrefix`),t(n))}}function Mi(e,t,n){let r=this;return i;function i(t){return N(t)?P(e,a,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):a(t)}function a(r){return e.attempt(Ai,t,n)(r)}}function Ni(e){e.exit(`blockQuote`)}var Pi={name:`characterEscape`,tokenize:Fi};function Fi(e,t,n){return r;function r(t){return e.enter(`characterEscape`),e.enter(`escapeMarker`),e.consume(t),e.exit(`escapeMarker`),i}function i(r){return ci(r)?(e.enter(`characterEscapeValue`),e.consume(r),e.exit(`characterEscapeValue`),e.exit(`characterEscape`),t):n(r)}}var Ii={name:`characterReference`,tokenize:Li};function Li(e,t,n){let r=this,i=0,a,o;return s;function s(t){return e.enter(`characterReference`),e.enter(`characterReferenceMarker`),e.consume(t),e.exit(`characterReferenceMarker`),c}function c(t){return t===35?(e.enter(`characterReferenceMarkerNumeric`),e.consume(t),e.exit(`characterReferenceMarkerNumeric`),l):(e.enter(`characterReferenceValue`),a=31,o=ri,u(t))}function l(t){return t===88||t===120?(e.enter(`characterReferenceMarkerHexadecimal`),e.consume(t),e.exit(`characterReferenceMarkerHexadecimal`),e.enter(`characterReferenceValue`),a=6,o=si,u):(e.enter(`characterReferenceValue`),a=7,o=oi,u(t))}function u(s){if(s===59&&i){let i=e.exit(`characterReferenceValue`);return o===ri&&!qr(r.sliceSerialize(i))?n(s):(e.enter(`characterReferenceMarker`),e.consume(s),e.exit(`characterReferenceMarker`),e.exit(`characterReference`),t)}return o(s)&&i++<a?(e.consume(s),u):n(s)}}var Ri={partial:!0,tokenize:Bi},F={concrete:!0,name:`codeFenced`,tokenize:zi};function zi(e,t,n){let r=this,i={partial:!0,tokenize:x},a=0,o=0,s;return c;function c(e){return l(e)}function l(t){let n=r.events[r.events.length-1];return a=n&&n[1].type===`linePrefix`?n[2].sliceSerialize(n[1],!0).length:0,s=t,e.enter(`codeFenced`),e.enter(`codeFencedFence`),e.enter(`codeFencedFenceSequence`),u(t)}function u(t){return t===s?(o++,e.consume(t),u):o<3?n(t):(e.exit(`codeFencedFenceSequence`),N(t)?P(e,d,`whitespace`)(t):d(t))}function d(n){return n===null||M(n)?(e.exit(`codeFencedFence`),r.interrupt?t(n):e.check(Ri,h,b)(n)):(e.enter(`codeFencedFenceInfo`),e.enter(`chunkString`,{contentType:`string`}),f(n))}function f(t){return t===null||M(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),d(t)):N(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceInfo`),P(e,p,`whitespace`)(t)):t===96&&t===s?n(t):(e.consume(t),f)}function p(t){return t===null||M(t)?d(t):(e.enter(`codeFencedFenceMeta`),e.enter(`chunkString`,{contentType:`string`}),m(t))}function m(t){return t===null||M(t)?(e.exit(`chunkString`),e.exit(`codeFencedFenceMeta`),d(t)):t===96&&t===s?n(t):(e.consume(t),m)}function h(t){return e.attempt(i,b,g)(t)}function g(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),_}function _(t){return a>0&&N(t)?P(e,v,`linePrefix`,a+1)(t):v(t)}function v(t){return t===null||M(t)?e.check(Ri,h,b)(t):(e.enter(`codeFlowValue`),y(t))}function y(t){return t===null||M(t)?(e.exit(`codeFlowValue`),v(t)):(e.consume(t),y)}function b(n){return e.exit(`codeFenced`),t(n)}function x(e,t,n){let i=0;return a;function a(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c}function c(t){return e.enter(`codeFencedFence`),N(t)?P(e,l,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):l(t)}function l(t){return t===s?(e.enter(`codeFencedFenceSequence`),u(t)):n(t)}function u(t){return t===s?(i++,e.consume(t),u):i>=o?(e.exit(`codeFencedFenceSequence`),N(t)?P(e,d,`whitespace`)(t):d(t)):n(t)}function d(r){return r===null||M(r)?(e.exit(`codeFencedFence`),t(r)):n(r)}}}function Bi(e,t,n){let r=this;return i;function i(t){return t===null?n(t):(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}var Vi={name:`codeIndented`,tokenize:Ui},Hi={partial:!0,tokenize:Wi};function Ui(e,t,n){let r=this;return i;function i(t){return e.enter(`codeIndented`),P(e,a,`linePrefix`,5)(t)}function a(e){let t=r.events[r.events.length-1];return t&&t[1].type===`linePrefix`&&t[2].sliceSerialize(t[1],!0).length>=4?o(e):n(e)}function o(t){return t===null?c(t):M(t)?e.attempt(Hi,o,c)(t):(e.enter(`codeFlowValue`),s(t))}function s(t){return t===null||M(t)?(e.exit(`codeFlowValue`),o(t)):(e.consume(t),s)}function c(n){return e.exit(`codeIndented`),t(n)}}function Wi(e,t,n){let r=this;return i;function i(t){return r.parser.lazy[r.now().line]?n(t):M(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),i):P(e,a,`linePrefix`,5)(t)}function a(e){let a=r.events[r.events.length-1];return a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(e):M(e)?i(e):n(e)}}var Gi={name:`codeText`,previous:qi,resolve:Ki,tokenize:Ji};function Ki(e){let t=e.length-4,n=3,r,i;if((e[n][1].type===`lineEnding`||e[n][1].type===`space`)&&(e[t][1].type===`lineEnding`||e[t][1].type===`space`)){for(r=n;++r<t;)if(e[r][1].type===`codeTextData`){e[n][1].type=`codeTextPadding`,e[t][1].type=`codeTextPadding`,n+=2,t-=2;break}}for(r=n-1,t++;++r<=t;)i===void 0?r!==t&&e[r][1].type!==`lineEnding`&&(i=r):(r===t||e[r][1].type===`lineEnding`)&&(e[i][1].type=`codeTextData`,r!==i+2&&(e[i][1].end=e[r-1][1].end,e.splice(i+2,r-i-2),t-=r-i-2,r=i+2),i=void 0);return e}function qi(e){return e!==96||this.events[this.events.length-1][1].type===`characterEscape`}function Ji(e,t,n){let r=0,i,a;return o;function o(t){return e.enter(`codeText`),e.enter(`codeTextSequence`),s(t)}function s(t){return t===96?(e.consume(t),r++,s):(e.exit(`codeTextSequence`),c(t))}function c(t){return t===null?n(t):t===32?(e.enter(`space`),e.consume(t),e.exit(`space`),c):t===96?(a=e.enter(`codeTextSequence`),i=0,u(t)):M(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),c):(e.enter(`codeTextData`),l(t))}function l(t){return t===null||t===32||t===96||M(t)?(e.exit(`codeTextData`),c(t)):(e.consume(t),l)}function u(n){return n===96?(e.consume(n),i++,u):i===r?(e.exit(`codeTextSequence`),e.exit(`codeText`),t(n)):(a.type=`codeTextData`,l(n))}}var Yi=class{constructor(e){this.left=e?[...e]:[],this.right=[]}get(e){if(e<0||e>=this.left.length+this.right.length)throw RangeError("Cannot access index `"+e+"` in a splice buffer of size `"+(this.left.length+this.right.length)+"`");return e<this.left.length?this.left[e]:this.right[this.right.length-e+this.left.length-1]}get length(){return this.left.length+this.right.length}shift(){return this.setCursor(0),this.right.pop()}slice(e,t){let n=t??1/0;return n<this.left.length?this.left.slice(e,n):e>this.left.length?this.right.slice(this.right.length-n+this.left.length,this.right.length-e+this.left.length).reverse():this.left.slice(e).concat(this.right.slice(this.right.length-n+this.left.length).reverse())}splice(e,t,n){let r=t||0;this.setCursor(Math.trunc(e));let i=this.right.splice(this.right.length-r,1/0);return n&&Xi(this.left,n),i.reverse()}pop(){return this.setCursor(1/0),this.left.pop()}push(e){this.setCursor(1/0),this.left.push(e)}pushMany(e){this.setCursor(1/0),Xi(this.left,e)}unshift(e){this.setCursor(0),this.right.push(e)}unshiftMany(e){this.setCursor(0),Xi(this.right,e.reverse())}setCursor(e){if(!(e===this.left.length||e>this.left.length&&this.right.length===0||e<0&&this.left.length===0))if(e<this.left.length){let t=this.left.splice(e,1/0);Xi(this.right,t.reverse())}else{let t=this.right.splice(this.left.length+this.right.length-e,1/0);Xi(this.left,t.reverse())}}};function Xi(e,t){let n=0;if(t.length<1e4)e.push(...t);else for(;n<t.length;)e.push(...t.slice(n,n+1e4)),n+=1e4}function Zi(e){let t={},n=-1,r,i,a,o,s,c,l,u=new Yi(e);for(;++n<u.length;){for(;n in t;)n=t[n];if(r=u.get(n),n&&r[1].type===`chunkFlow`&&u.get(n-1)[1].type===`listItemPrefix`&&(c=r[1]._tokenizer.events,a=0,a<c.length&&c[a][1].type===`lineEndingBlank`&&(a+=2),a<c.length&&c[a][1].type===`content`))for(;++a<c.length&&c[a][1].type!==`content`;)c[a][1].type===`chunkText`&&(c[a][1]._isInFirstContentOfListItem=!0,a++);if(r[0]===`enter`)r[1].contentType&&(Object.assign(t,Qi(u,n)),n=t[n],l=!0);else if(r[1]._container){for(a=n,i=void 0;a--;)if(o=u.get(a),o[1].type===`lineEnding`||o[1].type===`lineEndingBlank`)o[0]===`enter`&&(i&&(u.get(i)[1].type=`lineEndingBlank`),o[1].type=`lineEnding`,i=a);else if(!(o[1].type===`linePrefix`||o[1].type===`listItemIndent`))break;i&&(r[1].end={...u.get(i)[1].start},s=u.slice(i,n),s.unshift(r),u.splice(i,n-i+1,s))}}return Jr(e,0,1/0,u.slice(0)),!l}function Qi(e,t){let n=e.get(t)[1],r=e.get(t)[2],i=t-1,a=[],o=n._tokenizer;o||(o=r.parser[n.contentType](n.start),n._contentTypeTextTrailing&&(o._contentTypeTextTrailing=!0));let s=o.events,c=[],l={},u,d,f=-1,p=n,m=0,h=0,g=[h];for(;p;){for(;e.get(++i)[1]!==p;);a.push(i),p._tokenizer||(u=r.sliceStream(p),p.next||u.push(null),d&&o.defineSkip(p.start),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=!0),o.write(u),p._isInFirstContentOfListItem&&(o._gfmTasklistFirstContentOfListItem=void 0)),d=p,p=p.next}for(p=n;++f<s.length;)s[f][0]===`exit`&&s[f-1][0]===`enter`&&s[f][1].type===s[f-1][1].type&&s[f][1].start.line!==s[f][1].end.line&&(h=f+1,g.push(h),p._tokenizer=void 0,p.previous=void 0,p=p.next);for(o.events=[],p?(p._tokenizer=void 0,p.previous=void 0):g.pop(),f=g.length;f--;){let t=s.slice(g[f],g[f+1]),n=a.pop();c.push([n,n+t.length-1]),e.splice(n,2,t)}for(c.reverse(),f=-1;++f<c.length;)l[m+c[f][0]]=m+c[f][1],m+=c[f][1]-c[f][0]-1;return l}var $i={resolve:ta,tokenize:na},ea={partial:!0,tokenize:ra};function ta(e){return Zi(e),e}function na(e,t){let n;return r;function r(t){return e.enter(`content`),n=e.enter(`chunkContent`,{contentType:`content`}),i(t)}function i(t){return t===null?a(t):M(t)?e.check(ea,o,a)(t):(e.consume(t),i)}function a(n){return e.exit(`chunkContent`),e.exit(`content`),t(n)}function o(t){return e.consume(t),e.exit(`chunkContent`),n.next=e.enter(`chunkContent`,{contentType:`content`,previous:n}),n=n.next,i}}function ra(e,t,n){let r=this;return i;function i(t){return e.exit(`chunkContent`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),P(e,a,`linePrefix`)}function a(i){if(i===null||M(i))return n(i);let a=r.events[r.events.length-1];return!r.parser.constructs.disable.null.includes(`codeIndented`)&&a&&a[1].type===`linePrefix`&&a[2].sliceSerialize(a[1],!0).length>=4?t(i):e.interrupt(r.parser.constructs.flow,n,t)(i)}}function ia(e,t,n,r,i,a,o,s,c){let l=c||1/0,u=0;return d;function d(t){return t===60?(e.enter(r),e.enter(i),e.enter(a),e.consume(t),e.exit(a),f):t===null||t===32||t===41||ai(t)?n(t):(e.enter(r),e.enter(o),e.enter(s),e.enter(`chunkString`,{contentType:`string`}),h(t))}function f(n){return n===62?(e.enter(a),e.consume(n),e.exit(a),e.exit(i),e.exit(r),t):(e.enter(s),e.enter(`chunkString`,{contentType:`string`}),p(n))}function p(t){return t===62?(e.exit(`chunkString`),e.exit(s),f(t)):t===null||t===60||M(t)?n(t):(e.consume(t),t===92?m:p)}function m(t){return t===60||t===62||t===92?(e.consume(t),p):p(t)}function h(i){return!u&&(i===null||i===41||li(i))?(e.exit(`chunkString`),e.exit(s),e.exit(o),e.exit(r),t(i)):u<l&&i===40?(e.consume(i),u++,h):i===41?(e.consume(i),u--,h):i===null||i===32||i===40||ai(i)?n(i):(e.consume(i),i===92?g:h)}function g(t){return t===40||t===41||t===92?(e.consume(t),h):h(t)}}function aa(e,t,n,r,i,a){let o=this,s=0,c;return l;function l(t){return e.enter(r),e.enter(i),e.consume(t),e.exit(i),e.enter(a),u}function u(l){return s>999||l===null||l===91||l===93&&!c||l===94&&!s&&`_hiddenFootnoteSupport`in o.parser.constructs?n(l):l===93?(e.exit(a),e.enter(i),e.consume(l),e.exit(i),e.exit(r),t):M(l)?(e.enter(`lineEnding`),e.consume(l),e.exit(`lineEnding`),u):(e.enter(`chunkString`,{contentType:`string`}),d(l))}function d(t){return t===null||t===91||t===93||M(t)||s++>999?(e.exit(`chunkString`),u(t)):(e.consume(t),c||=!N(t),t===92?f:d)}function f(t){return t===91||t===92||t===93?(e.consume(t),s++,d):d(t)}}function oa(e,t,n,r,i,a){let o;return s;function s(t){return t===34||t===39||t===40?(e.enter(r),e.enter(i),e.consume(t),e.exit(i),o=t===40?41:t,c):n(t)}function c(n){return n===o?(e.enter(i),e.consume(n),e.exit(i),e.exit(r),t):(e.enter(a),l(n))}function l(t){return t===o?(e.exit(a),c(o)):t===null?n(t):M(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),P(e,l,`linePrefix`)):(e.enter(`chunkString`,{contentType:`string`}),u(t))}function u(t){return t===o||t===null||M(t)?(e.exit(`chunkString`),l(t)):(e.consume(t),t===92?d:u)}function d(t){return t===o||t===92?(e.consume(t),u):u(t)}}function sa(e,t){let n;return r;function r(i){return M(i)?(e.enter(`lineEnding`),e.consume(i),e.exit(`lineEnding`),n=!0,r):N(i)?P(e,r,n?`linePrefix`:`lineSuffix`)(i):t(i)}}var ca={name:`definition`,tokenize:ua},la={partial:!0,tokenize:da};function ua(e,t,n){let r=this,i;return a;function a(t){return e.enter(`definition`),o(t)}function o(t){return aa.call(r,e,s,n,`definitionLabel`,`definitionLabelMarker`,`definitionLabelString`)(t)}function s(t){return i=ti(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)),t===58?(e.enter(`definitionMarker`),e.consume(t),e.exit(`definitionMarker`),c):n(t)}function c(t){return li(t)?sa(e,l)(t):l(t)}function l(t){return ia(e,u,n,`definitionDestination`,`definitionDestinationLiteral`,`definitionDestinationLiteralMarker`,`definitionDestinationRaw`,`definitionDestinationString`)(t)}function u(t){return e.attempt(la,d,d)(t)}function d(t){return N(t)?P(e,f,`whitespace`)(t):f(t)}function f(a){return a===null||M(a)?(e.exit(`definition`),r.parser.defined.push(i),t(a)):n(a)}}function da(e,t,n){return r;function r(t){return li(t)?sa(e,i)(t):n(t)}function i(t){return oa(e,a,n,`definitionTitle`,`definitionTitleMarker`,`definitionTitleString`)(t)}function a(t){return N(t)?P(e,o,`whitespace`)(t):o(t)}function o(e){return e===null||M(e)?t(e):n(e)}}var fa={name:`hardBreakEscape`,tokenize:pa};function pa(e,t,n){return r;function r(t){return e.enter(`hardBreakEscape`),e.consume(t),i}function i(r){return M(r)?(e.exit(`hardBreakEscape`),t(r)):n(r)}}var ma={name:`headingAtx`,resolve:ha,tokenize:ga};function ha(e,t){let n=e.length-2,r=3,i,a;return e[r][1].type===`whitespace`&&(r+=2),n-2>r&&e[n][1].type===`whitespace`&&(n-=2),e[n][1].type===`atxHeadingSequence`&&(r===n-1||n-4>r&&e[n-2][1].type===`whitespace`)&&(n-=r+1===n?2:4),n>r&&(i={type:`atxHeadingText`,start:e[r][1].start,end:e[n][1].end},a={type:`chunkText`,start:e[r][1].start,end:e[n][1].end,contentType:`text`},Jr(e,r,n-r+1,[[`enter`,i,t],[`enter`,a,t],[`exit`,a,t],[`exit`,i,t]])),e}function ga(e,t,n){let r=0;return i;function i(t){return e.enter(`atxHeading`),a(t)}function a(t){return e.enter(`atxHeadingSequence`),o(t)}function o(t){return t===35&&r++<6?(e.consume(t),o):t===null||li(t)?(e.exit(`atxHeadingSequence`),s(t)):n(t)}function s(n){return n===35?(e.enter(`atxHeadingSequence`),c(n)):n===null||M(n)?(e.exit(`atxHeading`),t(n)):N(n)?P(e,s,`whitespace`)(n):(e.enter(`atxHeadingText`),l(n))}function c(t){return t===35?(e.consume(t),c):(e.exit(`atxHeadingSequence`),s(t))}function l(t){return t===null||t===35||li(t)?(e.exit(`atxHeadingText`),s(t)):(e.consume(t),l)}}var _a=`address.article.aside.base.basefont.blockquote.body.caption.center.col.colgroup.dd.details.dialog.dir.div.dl.dt.fieldset.figcaption.figure.footer.form.frame.frameset.h1.h2.h3.h4.h5.h6.head.header.hr.html.iframe.legend.li.link.main.menu.menuitem.nav.noframes.ol.optgroup.option.p.param.search.section.summary.table.tbody.td.tfoot.th.thead.title.tr.track.ul`.split(`.`),va=[`pre`,`script`,`style`,`textarea`],ya={concrete:!0,name:`htmlFlow`,resolveTo:Sa,tokenize:Ca},ba={partial:!0,tokenize:Ta},xa={partial:!0,tokenize:wa};function Sa(e){let t=e.length;for(;t--&&!(e[t][0]===`enter`&&e[t][1].type===`htmlFlow`););return t>1&&e[t-2][1].type===`linePrefix`&&(e[t][1].start=e[t-2][1].start,e[t+1][1].start=e[t-2][1].start,e.splice(t-2,2)),e}function Ca(e,t,n){let r=this,i,a,o,s,c;return l;function l(e){return u(e)}function u(t){return e.enter(`htmlFlow`),e.enter(`htmlFlowData`),e.consume(t),d}function d(s){return s===33?(e.consume(s),f):s===47?(e.consume(s),a=!0,h):s===63?(e.consume(s),i=3,r.interrupt?t:D):ni(s)?(e.consume(s),o=String.fromCharCode(s),g):n(s)}function f(a){return a===45?(e.consume(a),i=2,p):a===91?(e.consume(a),i=5,s=0,m):ni(a)?(e.consume(a),i=4,r.interrupt?t:D):n(a)}function p(i){return i===45?(e.consume(i),r.interrupt?t:D):n(i)}function m(i){return i===`CDATA[`.charCodeAt(s++)?(e.consume(i),s===6?r.interrupt?t:E:m):n(i)}function h(t){return ni(t)?(e.consume(t),o=String.fromCharCode(t),g):n(t)}function g(s){if(s===null||s===47||s===62||li(s)){let c=s===47,l=o.toLowerCase();return!c&&!a&&va.includes(l)?(i=1,r.interrupt?t(s):E(s)):_a.includes(o.toLowerCase())?(i=6,c?(e.consume(s),_):r.interrupt?t(s):E(s)):(i=7,r.interrupt&&!r.parser.lazy[r.now().line]?n(s):a?v(s):y(s))}return s===45||ri(s)?(e.consume(s),o+=String.fromCharCode(s),g):n(s)}function _(i){return i===62?(e.consume(i),r.interrupt?t:E):n(i)}function v(t){return N(t)?(e.consume(t),v):T(t)}function y(t){return t===47?(e.consume(t),T):t===58||t===95||ni(t)?(e.consume(t),b):N(t)?(e.consume(t),y):T(t)}function b(t){return t===45||t===46||t===58||t===95||ri(t)?(e.consume(t),b):x(t)}function x(t){return t===61?(e.consume(t),ee):N(t)?(e.consume(t),x):y(t)}function ee(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),c=t,S):N(t)?(e.consume(t),ee):C(t)}function S(t){return t===c?(e.consume(t),c=null,w):t===null||M(t)?n(t):(e.consume(t),S)}function C(t){return t===null||t===34||t===39||t===47||t===60||t===61||t===62||t===96||li(t)?x(t):(e.consume(t),C)}function w(e){return e===47||e===62||N(e)?y(e):n(e)}function T(t){return t===62?(e.consume(t),te):n(t)}function te(t){return t===null||M(t)?E(t):N(t)?(e.consume(t),te):n(t)}function E(t){return t===45&&i===2?(e.consume(t),ae):t===60&&i===1?(e.consume(t),oe):t===62&&i===4?(e.consume(t),O):t===63&&i===3?(e.consume(t),D):t===93&&i===5?(e.consume(t),ce):M(t)&&(i===6||i===7)?(e.exit(`htmlFlowData`),e.check(ba,le,ne)(t)):t===null||M(t)?(e.exit(`htmlFlowData`),ne(t)):(e.consume(t),E)}function ne(t){return e.check(xa,re,le)(t)}function re(t){return e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),ie}function ie(t){return t===null||M(t)?ne(t):(e.enter(`htmlFlowData`),E(t))}function ae(t){return t===45?(e.consume(t),D):E(t)}function oe(t){return t===47?(e.consume(t),o=``,se):E(t)}function se(t){if(t===62){let n=o.toLowerCase();return va.includes(n)?(e.consume(t),O):E(t)}return ni(t)&&o.length<8?(e.consume(t),o+=String.fromCharCode(t),se):E(t)}function ce(t){return t===93?(e.consume(t),D):E(t)}function D(t){return t===62?(e.consume(t),O):t===45&&i===2?(e.consume(t),D):E(t)}function O(t){return t===null||M(t)?(e.exit(`htmlFlowData`),le(t)):(e.consume(t),O)}function le(n){return e.exit(`htmlFlow`),t(n)}}function wa(e,t,n){let r=this;return i;function i(t){return M(t)?(e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),a):n(t)}function a(e){return r.parser.lazy[r.now().line]?n(e):t(e)}}function Ta(e,t,n){return r;function r(r){return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),e.attempt(Oi,t,n)}}var Ea={name:`htmlText`,tokenize:Da};function Da(e,t,n){let r=this,i,a,o;return s;function s(t){return e.enter(`htmlText`),e.enter(`htmlTextData`),e.consume(t),c}function c(t){return t===33?(e.consume(t),l):t===47?(e.consume(t),x):t===63?(e.consume(t),y):ni(t)?(e.consume(t),C):n(t)}function l(t){return t===45?(e.consume(t),u):t===91?(e.consume(t),a=0,m):ni(t)?(e.consume(t),v):n(t)}function u(t){return t===45?(e.consume(t),p):n(t)}function d(t){return t===null?n(t):t===45?(e.consume(t),f):M(t)?(o=d,oe(t)):(e.consume(t),d)}function f(t){return t===45?(e.consume(t),p):d(t)}function p(e){return e===62?ae(e):e===45?f(e):d(e)}function m(t){return t===`CDATA[`.charCodeAt(a++)?(e.consume(t),a===6?h:m):n(t)}function h(t){return t===null?n(t):t===93?(e.consume(t),g):M(t)?(o=h,oe(t)):(e.consume(t),h)}function g(t){return t===93?(e.consume(t),_):h(t)}function _(t){return t===62?ae(t):t===93?(e.consume(t),_):h(t)}function v(t){return t===null||t===62?ae(t):M(t)?(o=v,oe(t)):(e.consume(t),v)}function y(t){return t===null?n(t):t===63?(e.consume(t),b):M(t)?(o=y,oe(t)):(e.consume(t),y)}function b(e){return e===62?ae(e):y(e)}function x(t){return ni(t)?(e.consume(t),ee):n(t)}function ee(t){return t===45||ri(t)?(e.consume(t),ee):S(t)}function S(t){return M(t)?(o=S,oe(t)):N(t)?(e.consume(t),S):ae(t)}function C(t){return t===45||ri(t)?(e.consume(t),C):t===47||t===62||li(t)?w(t):n(t)}function w(t){return t===47?(e.consume(t),ae):t===58||t===95||ni(t)?(e.consume(t),T):M(t)?(o=w,oe(t)):N(t)?(e.consume(t),w):ae(t)}function T(t){return t===45||t===46||t===58||t===95||ri(t)?(e.consume(t),T):te(t)}function te(t){return t===61?(e.consume(t),E):M(t)?(o=te,oe(t)):N(t)?(e.consume(t),te):w(t)}function E(t){return t===null||t===60||t===61||t===62||t===96?n(t):t===34||t===39?(e.consume(t),i=t,ne):M(t)?(o=E,oe(t)):N(t)?(e.consume(t),E):(e.consume(t),re)}function ne(t){return t===i?(e.consume(t),i=void 0,ie):t===null?n(t):M(t)?(o=ne,oe(t)):(e.consume(t),ne)}function re(t){return t===null||t===34||t===39||t===60||t===61||t===96?n(t):t===47||t===62||li(t)?w(t):(e.consume(t),re)}function ie(e){return e===47||e===62||li(e)?w(e):n(e)}function ae(r){return r===62?(e.consume(r),e.exit(`htmlTextData`),e.exit(`htmlText`),t):n(r)}function oe(t){return e.exit(`htmlTextData`),e.enter(`lineEnding`),e.consume(t),e.exit(`lineEnding`),se}function se(t){return N(t)?P(e,ce,`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(t):ce(t)}function ce(t){return e.enter(`htmlTextData`),o(t)}}var Oa={name:`labelEnd`,resolveAll:Ma,resolveTo:Na,tokenize:Pa},ka={tokenize:Fa},Aa={tokenize:Ia},ja={tokenize:La};function Ma(e){let t=-1,n=[];for(;++t<e.length;){let r=e[t][1];if(n.push(e[t]),r.type===`labelImage`||r.type===`labelLink`||r.type===`labelEnd`){let e=r.type===`labelImage`?4:2;r.type=`data`,t+=e}}return e.length!==n.length&&Jr(e,0,e.length,n),e}function Na(e,t){let n=e.length,r=0,i,a,o,s;for(;n--;)if(i=e[n][1],a){if(i.type===`link`||i.type===`labelLink`&&i._inactive)break;e[n][0]===`enter`&&i.type===`labelLink`&&(i._inactive=!0)}else if(o){if(e[n][0]===`enter`&&(i.type===`labelImage`||i.type===`labelLink`)&&!i._balanced&&(a=n,i.type!==`labelLink`)){r=2;break}}else i.type===`labelEnd`&&(o=n);let c={type:e[a][1].type===`labelLink`?`link`:`image`,start:{...e[a][1].start},end:{...e[e.length-1][1].end}},l={type:`label`,start:{...e[a][1].start},end:{...e[o][1].end}},u={type:`labelText`,start:{...e[a+r+2][1].end},end:{...e[o-2][1].start}};return s=[[`enter`,c,t],[`enter`,l,t]],s=Yr(s,e.slice(a+1,a+r+3)),s=Yr(s,[[`enter`,u,t]]),s=Yr(s,xi(t.parser.constructs.insideSpan.null,e.slice(a+r+4,o-3),t)),s=Yr(s,[[`exit`,u,t],e[o-2],e[o-1],[`exit`,l,t]]),s=Yr(s,e.slice(o+1)),s=Yr(s,[[`exit`,c,t]]),Jr(e,a,e.length,s),e}function Pa(e,t,n){let r=this,i=r.events.length,a,o;for(;i--;)if((r.events[i][1].type===`labelImage`||r.events[i][1].type===`labelLink`)&&!r.events[i][1]._balanced){a=r.events[i][1];break}return s;function s(t){return a?a._inactive?d(t):(o=r.parser.defined.includes(ti(r.sliceSerialize({start:a.end,end:r.now()}))),e.enter(`labelEnd`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelEnd`),c):n(t)}function c(t){return t===40?e.attempt(ka,u,o?u:d)(t):t===91?e.attempt(Aa,u,o?l:d)(t):o?u(t):d(t)}function l(t){return e.attempt(ja,u,d)(t)}function u(e){return t(e)}function d(e){return a._balanced=!0,n(e)}}function Fa(e,t,n){return r;function r(t){return e.enter(`resource`),e.enter(`resourceMarker`),e.consume(t),e.exit(`resourceMarker`),i}function i(t){return li(t)?sa(e,a)(t):a(t)}function a(t){return t===41?u(t):ia(e,o,s,`resourceDestination`,`resourceDestinationLiteral`,`resourceDestinationLiteralMarker`,`resourceDestinationRaw`,`resourceDestinationString`,32)(t)}function o(t){return li(t)?sa(e,c)(t):u(t)}function s(e){return n(e)}function c(t){return t===34||t===39||t===40?oa(e,l,n,`resourceTitle`,`resourceTitleMarker`,`resourceTitleString`)(t):u(t)}function l(t){return li(t)?sa(e,u)(t):u(t)}function u(r){return r===41?(e.enter(`resourceMarker`),e.consume(r),e.exit(`resourceMarker`),e.exit(`resource`),t):n(r)}}function Ia(e,t,n){let r=this;return i;function i(t){return aa.call(r,e,a,o,`reference`,`referenceMarker`,`referenceString`)(t)}function a(e){return r.parser.defined.includes(ti(r.sliceSerialize(r.events[r.events.length-1][1]).slice(1,-1)))?t(e):n(e)}function o(e){return n(e)}}function La(e,t,n){return r;function r(t){return e.enter(`reference`),e.enter(`referenceMarker`),e.consume(t),e.exit(`referenceMarker`),i}function i(r){return r===93?(e.enter(`referenceMarker`),e.consume(r),e.exit(`referenceMarker`),e.exit(`reference`),t):n(r)}}var Ra={name:`labelStartImage`,resolveAll:Oa.resolveAll,tokenize:za};function za(e,t,n){let r=this;return i;function i(t){return e.enter(`labelImage`),e.enter(`labelImageMarker`),e.consume(t),e.exit(`labelImageMarker`),a}function a(t){return t===91?(e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelImage`),o):n(t)}function o(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Ba={name:`labelStartLink`,resolveAll:Oa.resolveAll,tokenize:Va};function Va(e,t,n){let r=this;return i;function i(t){return e.enter(`labelLink`),e.enter(`labelMarker`),e.consume(t),e.exit(`labelMarker`),e.exit(`labelLink`),a}function a(e){return e===94&&`_hiddenFootnoteSupport`in r.parser.constructs?n(e):t(e)}}var Ha={name:`lineEnding`,tokenize:Ua};function Ua(e,t){return n;function n(n){return e.enter(`lineEnding`),e.consume(n),e.exit(`lineEnding`),P(e,t,`linePrefix`)}}var Wa={name:`thematicBreak`,tokenize:Ga};function Ga(e,t,n){let r=0,i;return a;function a(t){return e.enter(`thematicBreak`),o(t)}function o(e){return i=e,s(e)}function s(a){return a===i?(e.enter(`thematicBreakSequence`),c(a)):r>=3&&(a===null||M(a))?(e.exit(`thematicBreak`),t(a)):n(a)}function c(t){return t===i?(e.consume(t),r++,c):(e.exit(`thematicBreakSequence`),N(t)?P(e,s,`whitespace`)(t):s(t))}}var Ka={continuation:{tokenize:Xa},exit:Qa,name:`list`,tokenize:Ya},qa={partial:!0,tokenize:$a},Ja={partial:!0,tokenize:Za};function Ya(e,t,n){let r=this,i=r.events[r.events.length-1],a=i&&i[1].type===`linePrefix`?i[2].sliceSerialize(i[1],!0).length:0,o=0;return s;function s(t){let i=r.containerState.type||(t===42||t===43||t===45?`listUnordered`:`listOrdered`);if(i===`listUnordered`?!r.containerState.marker||t===r.containerState.marker:oi(t)){if(r.containerState.type||(r.containerState.type=i,e.enter(i,{_container:!0})),i===`listUnordered`)return e.enter(`listItemPrefix`),t===42||t===45?e.check(Wa,n,l)(t):l(t);if(!r.interrupt||t===49)return e.enter(`listItemPrefix`),e.enter(`listItemValue`),c(t)}return n(t)}function c(t){return oi(t)&&++o<10?(e.consume(t),c):(!r.interrupt||o<2)&&(r.containerState.marker?t===r.containerState.marker:t===41||t===46)?(e.exit(`listItemValue`),l(t)):n(t)}function l(t){return e.enter(`listItemMarker`),e.consume(t),e.exit(`listItemMarker`),r.containerState.marker=r.containerState.marker||t,e.check(Oi,r.interrupt?n:u,e.attempt(qa,f,d))}function u(e){return r.containerState.initialBlankLine=!0,a++,f(e)}function d(t){return N(t)?(e.enter(`listItemPrefixWhitespace`),e.consume(t),e.exit(`listItemPrefixWhitespace`),f):n(t)}function f(n){return r.containerState.size=a+r.sliceSerialize(e.exit(`listItemPrefix`),!0).length,t(n)}}function Xa(e,t,n){let r=this;return r.containerState._closeFlow=void 0,e.check(Oi,i,a);function i(n){return r.containerState.furtherBlankLines=r.containerState.furtherBlankLines||r.containerState.initialBlankLine,P(e,t,`listItemIndent`,r.containerState.size+1)(n)}function a(n){return r.containerState.furtherBlankLines||!N(n)?(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,o(n)):(r.containerState.furtherBlankLines=void 0,r.containerState.initialBlankLine=void 0,e.attempt(Ja,t,o)(n))}function o(i){return r.containerState._closeFlow=!0,r.interrupt=void 0,P(e,e.attempt(Ka,t,n),`linePrefix`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:4)(i)}}function Za(e,t,n){let r=this;return P(e,i,`listItemIndent`,r.containerState.size+1);function i(e){let i=r.events[r.events.length-1];return i&&i[1].type===`listItemIndent`&&i[2].sliceSerialize(i[1],!0).length===r.containerState.size?t(e):n(e)}}function Qa(e){e.exit(this.containerState.type)}function $a(e,t,n){let r=this;return P(e,i,`listItemPrefixWhitespace`,r.parser.constructs.disable.null.includes(`codeIndented`)?void 0:5);function i(e){let i=r.events[r.events.length-1];return!N(e)&&i&&i[1].type===`listItemPrefixWhitespace`?t(e):n(e)}}var eo={name:`setextUnderline`,resolveTo:to,tokenize:no};function to(e,t){let n=e.length,r,i,a;for(;n--;)if(e[n][0]===`enter`){if(e[n][1].type===`content`){r=n;break}e[n][1].type===`paragraph`&&(i=n)}else e[n][1].type===`content`&&e.splice(n,1),!a&&e[n][1].type===`definition`&&(a=n);let o={type:`setextHeading`,start:{...e[r][1].start},end:{...e[e.length-1][1].end}};return e[i][1].type=`setextHeadingText`,a?(e.splice(i,0,[`enter`,o,t]),e.splice(a+1,0,[`exit`,e[r][1],t]),e[r][1].end={...e[a][1].end}):e[r][1]=o,e.push([`exit`,o,t]),e}function no(e,t,n){let r=this,i;return a;function a(t){let a=r.events.length,s;for(;a--;)if(r.events[a][1].type!==`lineEnding`&&r.events[a][1].type!==`linePrefix`&&r.events[a][1].type!==`content`){s=r.events[a][1].type===`paragraph`;break}return!r.parser.lazy[r.now().line]&&(r.interrupt||s)?(e.enter(`setextHeadingLine`),i=t,o(t)):n(t)}function o(t){return e.enter(`setextHeadingLineSequence`),s(t)}function s(t){return t===i?(e.consume(t),s):(e.exit(`setextHeadingLineSequence`),N(t)?P(e,c,`lineSuffix`)(t):c(t))}function c(r){return r===null||M(r)?(e.exit(`setextHeadingLine`),t(r)):n(r)}}var ro={tokenize:io};function io(e){let t=this,n=e.attempt(Oi,r,e.attempt(this.parser.constructs.flowInitial,i,P(e,e.attempt(this.parser.constructs.flow,i,e.attempt($i,i)),`linePrefix`)));return n;function r(r){if(r===null){e.consume(r);return}return e.enter(`lineEndingBlank`),e.consume(r),e.exit(`lineEndingBlank`),t.currentConstruct=void 0,n}function i(r){if(r===null){e.consume(r);return}return e.enter(`lineEnding`),e.consume(r),e.exit(`lineEnding`),t.currentConstruct=void 0,n}}var ao={resolveAll:lo()},oo=co(`string`),so=co(`text`);function co(e){return{resolveAll:lo(e===`text`?uo:void 0),tokenize:t};function t(t){let n=this,r=this.parser.constructs[e],i=t.attempt(r,a,o);return a;function a(e){return c(e)?i(e):o(e)}function o(e){if(e===null){t.consume(e);return}return t.enter(`data`),t.consume(e),s}function s(e){return c(e)?(t.exit(`data`),i(e)):(t.consume(e),s)}function c(e){if(e===null)return!0;let t=r[e],i=-1;if(t)for(;++i<t.length;){let e=t[i];if(!e.previous||e.previous.call(n,n.previous))return!0}return!1}}}function lo(e){return t;function t(t,n){let r=-1,i;for(;++r<=t.length;)i===void 0?t[r]&&t[r][1].type===`data`&&(i=r,r++):(!t[r]||t[r][1].type!==`data`)&&(r!==i+2&&(t[i][1].end=t[r-1][1].end,t.splice(i+2,r-i-2),r=i+2),i=void 0);return e?e(t,n):t}}function uo(e,t){let n=0;for(;++n<=e.length;)if((n===e.length||e[n][1].type===`lineEnding`)&&e[n-1][1].type===`data`){let r=e[n-1][1],i=t.sliceStream(r),a=i.length,o=-1,s=0,c;for(;a--;){let e=i[a];if(typeof e==`string`){for(o=e.length;e.charCodeAt(o-1)===32;)s++,o--;if(o)break;o=-1}else if(e===-2)c=!0,s++;else if(e!==-1){a++;break}}if(t._contentTypeTextTrailing&&n===e.length&&(s=0),s){let i={type:n===e.length||c||s<2?`lineSuffix`:`hardBreakTrailing`,start:{_bufferIndex:a?o:r.start._bufferIndex+o,_index:r.start._index+a,line:r.end.line,column:r.end.column-s,offset:r.end.offset-s},end:{...r.end}};r.end={...i.start},r.start.offset===r.end.offset?Object.assign(r,i):(e.splice(n,0,[`enter`,i,t],[`exit`,i,t]),n+=2)}n++}return e}var fo=s({attentionMarkers:()=>vo,contentInitial:()=>mo,disable:()=>yo,document:()=>po,flow:()=>go,flowInitial:()=>ho,insideSpan:()=>L,string:()=>_o,text:()=>I}),po={42:Ka,43:Ka,45:Ka,48:Ka,49:Ka,50:Ka,51:Ka,52:Ka,53:Ka,54:Ka,55:Ka,56:Ka,57:Ka,62:Ai},mo={91:ca},ho={[-2]:Vi,[-1]:Vi,32:Vi},go={35:ma,42:Wa,45:[eo,Wa],60:ya,61:eo,95:Wa,96:F,126:F},_o={38:Ii,92:Pi},I={[-5]:Ha,[-4]:Ha,[-3]:Ha,33:Ra,38:Ii,42:Si,60:[Ei,Ea],91:Ba,92:[fa,Pi],93:Oa,95:Si,96:Gi},L={null:[Si,ao]},vo={null:[42,95]},yo={null:[]};function bo(e,t,n){let r={_bufferIndex:-1,_index:0,line:n&&n.line||1,column:n&&n.column||1,offset:n&&n.offset||0},i={},a=[],o=[],s=[],c={attempt:S(x),check:S(ee),consume:v,enter:y,exit:b,interrupt:S(ee,{interrupt:!0})},l={code:null,containerState:{},defineSkip:h,events:[],now:m,parser:e,previous:null,sliceSerialize:f,sliceStream:p,write:d},u=t.tokenize.call(l,c);return t.resolveAll&&a.push(t),l;function d(e){return o=Yr(o,e),g(),o[o.length-1]===null?(C(t,0),l.events=xi(a,l.events,l),l.events):[]}function f(e,t){return So(p(e),t)}function p(e){return xo(o,e)}function m(){let{_bufferIndex:e,_index:t,line:n,column:i,offset:a}=r;return{_bufferIndex:e,_index:t,line:n,column:i,offset:a}}function h(e){i[e.line]=e.column,T()}function g(){let e;for(;r._index<o.length;){let t=o[r._index];if(typeof t==`string`)for(e=r._index,r._bufferIndex<0&&(r._bufferIndex=0);r._index===e&&r._bufferIndex<t.length;)_(t.charCodeAt(r._bufferIndex));else _(t)}}function _(e){u=u(e)}function v(e){M(e)?(r.line++,r.column=1,r.offset+=e===-3?2:1,T()):e!==-1&&(r.column++,r.offset++),r._bufferIndex<0?r._index++:(r._bufferIndex++,r._bufferIndex===o[r._index].length&&(r._bufferIndex=-1,r._index++)),l.previous=e}function y(e,t){let n=t||{};return n.type=e,n.start=m(),l.events.push([`enter`,n,l]),s.push(n),n}function b(e){let t=s.pop();return t.end=m(),l.events.push([`exit`,t,l]),t}function x(e,t){C(e,t.from)}function ee(e,t){t.restore()}function S(e,t){return n;function n(n,r,i){let a,o,s,u;return Array.isArray(n)?f(n):`tokenize`in n?f([n]):d(n);function d(e){return t;function t(t){let n=t!==null&&e[t],r=t!==null&&e.null;return f([...Array.isArray(n)?n:n?[n]:[],...Array.isArray(r)?r:r?[r]:[]])(t)}}function f(e){return a=e,o=0,e.length===0?i:p(e[o])}function p(e){return n;function n(n){return u=w(),s=e,e.partial||(l.currentConstruct=e),e.name&&l.parser.constructs.disable.null.includes(e.name)?h(n):e.tokenize.call(t?Object.assign(Object.create(l),t):l,c,m,h)(n)}}function m(t){return e(s,u),r}function h(e){return u.restore(),++o<a.length?p(a[o]):i}}}function C(e,t){e.resolveAll&&!a.includes(e)&&a.push(e),e.resolve&&Jr(l.events,t,l.events.length-t,e.resolve(l.events.slice(t),l)),e.resolveTo&&(l.events=e.resolveTo(l.events,l))}function w(){let e=m(),t=l.previous,n=l.currentConstruct,i=l.events.length,a=Array.from(s);return{from:i,restore:o};function o(){r=e,l.previous=t,l.currentConstruct=n,l.events.length=i,s=a,T()}}function T(){r.line in i&&r.column<2&&(r.column=i[r.line],r.offset+=i[r.line]-1)}}function xo(e,t){let n=t.start._index,r=t.start._bufferIndex,i=t.end._index,a=t.end._bufferIndex,o;if(n===i)o=[e[n].slice(r,a)];else{if(o=e.slice(n,i),r>-1){let e=o[0];typeof e==`string`?o[0]=e.slice(r):o.shift()}a>0&&o.push(e[i].slice(0,a))}return o}function So(e,t){let n=-1,r=[],i;for(;++n<e.length;){let a=e[n],o;if(typeof a==`string`)o=a;else switch(a){case-5:o=`\r`;break;case-4:o=`
`;break;case-3:o=`\r
`;break;case-2:o=t?` `:`	`;break;case-1:if(!t&&i)continue;o=` `;break;default:o=String.fromCharCode(a)}i=a===-2,r.push(o)}return r.join(``)}function Co(e){let t={constructs:Zr([fo,...(e||{}).extensions||[]]),content:n(mi),defined:[],document:n(gi),flow:n(ro),lazy:{},string:n(oo),text:n(so)};return t;function n(e){return n;function n(n){return bo(t,e,n)}}}function wo(e){for(;!Zi(e););return e}var To=/[\0\t\n\r]/g;function Eo(){let e=1,t=``,n=!0,r;return i;function i(i,a,o){let s=[],c,l,u,d,f;for(i=t+(typeof i==`string`?i.toString():new TextDecoder(a||void 0).decode(i)),u=0,t=``,n&&=(i.charCodeAt(0)===65279&&u++,void 0);u<i.length;){if(To.lastIndex=u,c=To.exec(i),d=c&&c.index!==void 0?c.index:i.length,f=i.charCodeAt(d),!c){t=i.slice(u);break}if(f===10&&u===d&&r)s.push(-3),r=void 0;else switch(r&&=(s.push(-5),void 0),u<d&&(s.push(i.slice(u,d)),e+=d-u),f){case 0:s.push(65533),e++;break;case 9:for(l=Math.ceil(e/4)*4,s.push(-2);e++<l;)s.push(-1);break;case 10:s.push(-4),e=1;break;default:r=!0,e=1}u=d+1}return o&&(r&&s.push(-5),t&&s.push(t),s.push(null)),s}}var Do=/\\([!-/:-@[-`{-~])|&(#(?:\d{1,7}|x[\da-f]{1,6})|[\da-z]{1,31});/gi;function Oo(e){return e.replace(Do,ko)}function ko(e,t,n){if(t)return t;if(n.charCodeAt(0)===35){let e=n.charCodeAt(1),t=e===120||e===88;return ei(n.slice(t?2:1),t?16:10)}return qr(n)||e}var Ao={}.hasOwnProperty;function jo(e,t,n){return t&&typeof t==`object`&&(n=t,t=void 0),Mo(n)(wo(Co(n).document().write(Eo()(e,t,!0))))}function Mo(e){let t={transforms:[],canContainEols:[`emphasis`,`fragment`,`heading`,`paragraph`,`strong`],enter:{autolink:a(Ee),autolinkProtocol:w,autolinkEmail:w,atxHeading:a(Se),blockQuote:a(_e),characterEscape:w,characterReference:w,codeFenced:a(ve),codeFencedFenceInfo:o,codeFencedFenceMeta:o,codeIndented:a(ve,o),codeText:a(ye,o),codeTextData:w,data:w,codeFlowValue:w,definition:a(be),definitionDestinationString:o,definitionLabelString:o,definitionTitleString:o,emphasis:a(xe),hardBreakEscape:a(Ce),hardBreakTrailing:a(Ce),htmlFlow:a(we,o),htmlFlowData:w,htmlText:a(we,o),htmlTextData:w,image:a(Te),label:o,link:a(Ee),listItem:a(Oe),listItemValue:f,listOrdered:a(De,d),listUnordered:a(De),paragraph:a(ke),reference:ue,referenceString:o,resourceDestinationString:o,resourceTitleString:o,setextHeading:a(Se),strong:a(Ae),thematicBreak:a(Me)},exit:{atxHeading:c(),atxHeadingSequence:x,autolink:c(),autolinkEmail:ge,autolinkProtocol:he,blockQuote:c(),characterEscapeValue:T,characterReferenceMarkerHexadecimal:fe,characterReferenceMarkerNumeric:fe,characterReferenceValue:pe,characterReference:me,codeFenced:c(g),codeFencedFence:h,codeFencedFenceInfo:p,codeFencedFenceMeta:m,codeFlowValue:T,codeIndented:c(_),codeText:c(ie),codeTextData:T,data:T,definition:c(),definitionDestinationString:b,definitionLabelString:v,definitionTitleString:y,emphasis:c(),hardBreakEscape:c(E),hardBreakTrailing:c(E),htmlFlow:c(ne),htmlFlowData:T,htmlText:c(re),htmlTextData:T,image:c(oe),label:ce,labelText:se,lineEnding:te,link:c(ae),listItem:c(),listOrdered:c(),listUnordered:c(),paragraph:c(),referenceString:de,resourceDestinationString:D,resourceTitleString:O,resource:le,setextHeading:c(C),setextHeadingLineSequence:S,setextHeadingText:ee,strong:c(),thematicBreak:c()}};Po(t,(e||{}).mdastExtensions||[]);let n={};return r;function r(e){let r={type:`root`,children:[]},a={stack:[r],tokenStack:[],config:t,enter:s,exit:l,buffer:o,resume:u,data:n},c=[],d=-1;for(;++d<e.length;)(e[d][1].type===`listOrdered`||e[d][1].type===`listUnordered`)&&(e[d][0]===`enter`?c.push(d):d=i(e,c.pop(),d));for(d=-1;++d<e.length;){let n=t[e[d][0]];Ao.call(n,e[d][1].type)&&n[e[d][1].type].call(Object.assign({sliceSerialize:e[d][2].sliceSerialize},a),e[d][1])}if(a.tokenStack.length>0){let e=a.tokenStack[a.tokenStack.length-1];(e[1]||Io).call(a,void 0,e[0])}for(r.position={start:No(e.length>0?e[0][1].start:{line:1,column:1,offset:0}),end:No(e.length>0?e[e.length-2][1].end:{line:1,column:1,offset:0})},d=-1;++d<t.transforms.length;)r=t.transforms[d](r)||r;return r}function i(e,t,n){let r=t-1,i=-1,a=!1,o,s,c,l;for(;++r<=n;){let t=e[r];switch(t[1].type){case`listUnordered`:case`listOrdered`:case`blockQuote`:t[0]===`enter`?i++:i--,l=void 0;break;case`lineEndingBlank`:t[0]===`enter`&&(o&&!l&&!i&&!c&&(c=r),l=void 0);break;case`linePrefix`:case`listItemValue`:case`listItemMarker`:case`listItemPrefix`:case`listItemPrefixWhitespace`:break;default:l=void 0}if(!i&&t[0]===`enter`&&t[1].type===`listItemPrefix`||i===-1&&t[0]===`exit`&&(t[1].type===`listUnordered`||t[1].type===`listOrdered`)){if(o){let i=r;for(s=void 0;i--;){let t=e[i];if(t[1].type===`lineEnding`||t[1].type===`lineEndingBlank`){if(t[0]===`exit`)continue;s&&(e[s][1].type=`lineEndingBlank`,a=!0),t[1].type=`lineEnding`,s=i}else if(!(t[1].type===`linePrefix`||t[1].type===`blockQuotePrefix`||t[1].type===`blockQuotePrefixWhitespace`||t[1].type===`blockQuoteMarker`||t[1].type===`listItemIndent`))break}c&&(!s||c<s)&&(o._spread=!0),o.end=Object.assign({},s?e[s][1].start:t[1].end),e.splice(s||r,0,[`exit`,o,t[2]]),r++,n++}if(t[1].type===`listItemPrefix`){let i={type:`listItem`,_spread:!1,start:Object.assign({},t[1].start),end:void 0};o=i,e.splice(r,0,[`enter`,i,t[2]]),r++,n++,c=void 0,l=!0}}}return e[t][1]._spread=a,n}function a(e,t){return n;function n(n){s.call(this,e(n),n),t&&t.call(this,n)}}function o(){this.stack.push({type:`fragment`,children:[]})}function s(e,t,n){this.stack[this.stack.length-1].children.push(e),this.stack.push(e),this.tokenStack.push([t,n||void 0]),e.position={start:No(t.start),end:void 0}}function c(e){return t;function t(t){e&&e.call(this,t),l.call(this,t)}}function l(e,t){let n=this.stack.pop(),r=this.tokenStack.pop();if(r)r[0].type!==e.type&&(t?t.call(this,e,r[0]):(r[1]||Io).call(this,e,r[0]));else throw Error("Cannot close `"+e.type+"` ("+or({start:e.start,end:e.end})+`): it’s not open`);n.position.end=No(e.end)}function u(){return Hr(this.stack.pop())}function d(){this.data.expectingFirstListItemValue=!0}function f(e){if(this.data.expectingFirstListItemValue){let t=this.stack[this.stack.length-2];t.start=Number.parseInt(this.sliceSerialize(e),10),this.data.expectingFirstListItemValue=void 0}}function p(){let e=this.resume(),t=this.stack[this.stack.length-1];t.lang=e}function m(){let e=this.resume(),t=this.stack[this.stack.length-1];t.meta=e}function h(){this.data.flowCodeInside||(this.buffer(),this.data.flowCodeInside=!0)}function g(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/^(\r?\n|\r)|(\r?\n|\r)$/g,``),this.data.flowCodeInside=void 0}function _(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e.replace(/(\r?\n|\r)$/g,``)}function v(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ti(this.sliceSerialize(e)).toLowerCase()}function y(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function b(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function x(e){let t=this.stack[this.stack.length-1];t.depth||=this.sliceSerialize(e).length}function ee(){this.data.setextHeadingSlurpLineEnding=!0}function S(e){let t=this.stack[this.stack.length-1];t.depth=this.sliceSerialize(e).codePointAt(0)===61?1:2}function C(){this.data.setextHeadingSlurpLineEnding=void 0}function w(e){let t=this.stack[this.stack.length-1].children,n=t[t.length-1];(!n||n.type!==`text`)&&(n=je(),n.position={start:No(e.start),end:void 0},t.push(n)),this.stack.push(n)}function T(e){let t=this.stack.pop();t.value+=this.sliceSerialize(e),t.position.end=No(e.end)}function te(e){let n=this.stack[this.stack.length-1];if(this.data.atHardBreak){let t=n.children[n.children.length-1];t.position.end=No(e.end),this.data.atHardBreak=void 0;return}!this.data.setextHeadingSlurpLineEnding&&t.canContainEols.includes(n.type)&&(w.call(this,e),T.call(this,e))}function E(){this.data.atHardBreak=!0}function ne(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function re(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ie(){let e=this.resume(),t=this.stack[this.stack.length-1];t.value=e}function ae(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function oe(){let e=this.stack[this.stack.length-1];if(this.data.inReference){let t=this.data.referenceType||`shortcut`;e.type+=`Reference`,e.referenceType=t,delete e.url,delete e.title}else delete e.identifier,delete e.label;this.data.referenceType=void 0}function se(e){let t=this.sliceSerialize(e),n=this.stack[this.stack.length-2];n.label=Oo(t),n.identifier=ti(t).toLowerCase()}function ce(){let e=this.stack[this.stack.length-1],t=this.resume(),n=this.stack[this.stack.length-1];this.data.inReference=!0,n.type===`link`?n.children=e.children:n.alt=t}function D(){let e=this.resume(),t=this.stack[this.stack.length-1];t.url=e}function O(){let e=this.resume(),t=this.stack[this.stack.length-1];t.title=e}function le(){this.data.inReference=void 0}function ue(){this.data.referenceType=`collapsed`}function de(e){let t=this.resume(),n=this.stack[this.stack.length-1];n.label=t,n.identifier=ti(this.sliceSerialize(e)).toLowerCase(),this.data.referenceType=`full`}function fe(e){this.data.characterReferenceType=e.type}function pe(e){let t=this.sliceSerialize(e),n=this.data.characterReferenceType,r;n?(r=ei(t,n===`characterReferenceMarkerNumeric`?10:16),this.data.characterReferenceType=void 0):r=qr(t);let i=this.stack[this.stack.length-1];i.value+=r}function me(e){let t=this.stack.pop();t.position.end=No(e.end)}function he(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=this.sliceSerialize(e)}function ge(e){T.call(this,e);let t=this.stack[this.stack.length-1];t.url=`mailto:`+this.sliceSerialize(e)}function _e(){return{type:`blockquote`,children:[]}}function ve(){return{type:`code`,lang:null,meta:null,value:``}}function ye(){return{type:`inlineCode`,value:``}}function be(){return{type:`definition`,identifier:``,label:null,title:null,url:``}}function xe(){return{type:`emphasis`,children:[]}}function Se(){return{type:`heading`,depth:0,children:[]}}function Ce(){return{type:`break`}}function we(){return{type:`html`,value:``}}function Te(){return{type:`image`,title:null,url:``,alt:null}}function Ee(){return{type:`link`,title:null,url:``,children:[]}}function De(e){return{type:`list`,ordered:e.type===`listOrdered`,start:null,spread:e._spread,children:[]}}function Oe(e){return{type:`listItem`,spread:e._spread,checked:null,children:[]}}function ke(){return{type:`paragraph`,children:[]}}function Ae(){return{type:`strong`,children:[]}}function je(){return{type:`text`,value:``}}function Me(){return{type:`thematicBreak`}}}function No(e){return{line:e.line,column:e.column,offset:e.offset}}function Po(e,t){let n=-1;for(;++n<t.length;){let r=t[n];Array.isArray(r)?Po(e,r):Fo(e,r)}}function Fo(e,t){let n;for(n in t)if(Ao.call(t,n))switch(n){case`canContainEols`:{let r=t[n];r&&e[n].push(...r);break}case`transforms`:{let r=t[n];r&&e[n].push(...r);break}case`enter`:case`exit`:{let r=t[n];r&&Object.assign(e[n],r);break}}}function Io(e,t){throw e?Error("Cannot close `"+e.type+"` ("+or({start:e.start,end:e.end})+"): a different token (`"+t.type+"`, "+or({start:t.start,end:t.end})+`) is open`):Error("Cannot close document, a token (`"+t.type+"`, "+or({start:t.start,end:t.end})+`) is still open`)}function Lo(e){let t=this;t.parser=n;function n(n){return jo(n,{...t.data(`settings`),...e,extensions:t.data(`micromarkExtensions`)||[],mdastExtensions:t.data(`fromMarkdownExtensions`)||[]})}}function Ro(e,t){let n={type:`element`,tagName:`blockquote`,properties:{},children:e.wrap(e.all(t),!0)};return e.patch(t,n),e.applyData(t,n)}function zo(e,t){let n={type:`element`,tagName:`br`,properties:{},children:[]};return e.patch(t,n),[e.applyData(t,n),{type:`text`,value:`
`}]}function Bo(e,t){let n=t.value?t.value+`
`:``,r={},i=t.lang?t.lang.split(/\s+/):[];i.length>0&&(r.className=[`language-`+i[0]]);let a={type:`element`,tagName:`code`,properties:r,children:[{type:`text`,value:n}]};return t.meta&&(a.data={meta:t.meta}),e.patch(t,a),a=e.applyData(t,a),a={type:`element`,tagName:`pre`,properties:{},children:[a]},e.patch(t,a),a}function Vo(e,t){let n={type:`element`,tagName:`del`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Ho(e,t){let n={type:`element`,tagName:`em`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Uo(e,t){let n=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,r=String(t.identifier).toUpperCase(),i=pi(r.toLowerCase()),a=e.footnoteOrder.indexOf(r),o,s=e.footnoteCounts.get(r);s===void 0?(s=0,e.footnoteOrder.push(r),o=e.footnoteOrder.length):o=a+1,s+=1,e.footnoteCounts.set(r,s);let c={type:`element`,tagName:`a`,properties:{href:`#`+n+`fn-`+i,id:n+`fnref-`+i+(s>1?`-`+s:``),dataFootnoteRef:!0,ariaDescribedBy:[`footnote-label`]},children:[{type:`text`,value:String(o)}]};e.patch(t,c);let l={type:`element`,tagName:`sup`,properties:{},children:[c]};return e.patch(t,l),e.applyData(t,l)}function Wo(e,t){let n={type:`element`,tagName:`h`+t.depth,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function Go(e,t){if(e.options.allowDangerousHtml){let n={type:`raw`,value:t.value};return e.patch(t,n),e.applyData(t,n)}}function Ko(e,t){let n=t.referenceType,r=`]`;if(n===`collapsed`?r+=`[]`:n===`full`&&(r+=`[`+(t.label||t.identifier)+`]`),t.type===`imageReference`)return[{type:`text`,value:`![`+t.alt+r}];let i=e.all(t),a=i[0];a&&a.type===`text`?a.value=`[`+a.value:i.unshift({type:`text`,value:`[`});let o=i[i.length-1];return o&&o.type===`text`?o.value+=r:i.push({type:`text`,value:r}),i}function qo(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ko(e,t);let i={src:pi(r.url||``),alt:t.alt};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`img`,properties:i,children:[]};return e.patch(t,a),e.applyData(t,a)}function Jo(e,t){let n={src:pi(t.url)};t.alt!==null&&t.alt!==void 0&&(n.alt=t.alt),t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`img`,properties:n,children:[]};return e.patch(t,r),e.applyData(t,r)}function Yo(e,t){let n={type:`text`,value:t.value.replace(/\r?\n|\r/g,` `)};e.patch(t,n);let r={type:`element`,tagName:`code`,properties:{},children:[n]};return e.patch(t,r),e.applyData(t,r)}function Xo(e,t){let n=String(t.identifier).toUpperCase(),r=e.definitionById.get(n);if(!r)return Ko(e,t);let i={href:pi(r.url||``)};r.title!==null&&r.title!==void 0&&(i.title=r.title);let a={type:`element`,tagName:`a`,properties:i,children:e.all(t)};return e.patch(t,a),e.applyData(t,a)}function Zo(e,t){let n={href:pi(t.url)};t.title!==null&&t.title!==void 0&&(n.title=t.title);let r={type:`element`,tagName:`a`,properties:n,children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Qo(e,t,n){let r=e.all(t),i=n?$o(n):es(t),a={},o=[];if(typeof t.checked==`boolean`){let e=r[0],n;e&&e.type===`element`&&e.tagName===`p`?n=e:(n={type:`element`,tagName:`p`,properties:{},children:[]},r.unshift(n)),n.children.length>0&&n.children.unshift({type:`text`,value:` `}),n.children.unshift({type:`element`,tagName:`input`,properties:{type:`checkbox`,checked:t.checked,disabled:!0},children:[]}),a.className=[`task-list-item`]}let s=-1;for(;++s<r.length;){let e=r[s];(i||s!==0||e.type!==`element`||e.tagName!==`p`)&&o.push({type:`text`,value:`
`}),e.type===`element`&&e.tagName===`p`&&!i?o.push(...e.children):o.push(e)}let c=r[r.length-1];c&&(i||c.type!==`element`||c.tagName!==`p`)&&o.push({type:`text`,value:`
`});let l={type:`element`,tagName:`li`,properties:a,children:o};return e.patch(t,l),e.applyData(t,l)}function $o(e){let t=!1;if(e.type===`list`){t=e.spread||!1;let n=e.children,r=-1;for(;!t&&++r<n.length;)t=es(n[r])}return t}function es(e){return e.spread??e.children.length>1}function ts(e,t){let n={},r=e.all(t),i=-1;for(typeof t.start==`number`&&t.start!==1&&(n.start=t.start);++i<r.length;){let e=r[i];if(e.type===`element`&&e.tagName===`li`&&e.properties&&Array.isArray(e.properties.className)&&e.properties.className.includes(`task-list-item`)){n.className=[`contains-task-list`];break}}let a={type:`element`,tagName:t.ordered?`ol`:`ul`,properties:n,children:e.wrap(r,!0)};return e.patch(t,a),e.applyData(t,a)}function ns(e,t){let n={type:`element`,tagName:`p`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function rs(e,t){let n={type:`root`,children:e.wrap(e.all(t))};return e.patch(t,n),e.applyData(t,n)}function is(e,t){let n={type:`element`,tagName:`strong`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}function as(e,t){let n=e.all(t),r=n.shift(),i=[];if(r){let n={type:`element`,tagName:`thead`,properties:{},children:e.wrap([r],!0)};e.patch(t.children[0],n),i.push(n)}if(n.length>0){let r={type:`element`,tagName:`tbody`,properties:{},children:e.wrap(n,!0)},a=rr(t.children[1]),o=nr(t.children[t.children.length-1]);a&&o&&(r.position={start:a,end:o}),i.push(r)}let a={type:`element`,tagName:`table`,properties:{},children:e.wrap(i,!0)};return e.patch(t,a),e.applyData(t,a)}function os(e,t,n){let r=n?n.children:void 0,i=(r?r.indexOf(t):1)===0?`th`:`td`,a=n&&n.type===`table`?n.align:void 0,o=a?a.length:t.children.length,s=-1,c=[];for(;++s<o;){let n=t.children[s],r={},o=a?a[s]:void 0;o&&(r.align=o);let l={type:`element`,tagName:i,properties:r,children:[]};n&&(l.children=e.all(n),e.patch(n,l),l=e.applyData(n,l)),c.push(l)}let l={type:`element`,tagName:`tr`,properties:{},children:e.wrap(c,!0)};return e.patch(t,l),e.applyData(t,l)}function ss(e,t){let n={type:`element`,tagName:`td`,properties:{},children:e.all(t)};return e.patch(t,n),e.applyData(t,n)}var cs=9,ls=32;function us(e){let t=String(e),n=/\r?\n|\r/g,r=n.exec(t),i=0,a=[];for(;r;)a.push(ds(t.slice(i,r.index),i>0,!0),r[0]),i=r.index+r[0].length,r=n.exec(t);return a.push(ds(t.slice(i),i>0,!1)),a.join(``)}function ds(e,t,n){let r=0,i=e.length;if(t){let t=e.codePointAt(r);for(;t===cs||t===ls;)r++,t=e.codePointAt(r)}if(n){let t=e.codePointAt(i-1);for(;t===cs||t===ls;)i--,t=e.codePointAt(i-1)}return i>r?e.slice(r,i):``}function fs(e,t){let n={type:`text`,value:us(String(t.value))};return e.patch(t,n),e.applyData(t,n)}function ps(e,t){let n={type:`element`,tagName:`hr`,properties:{},children:[]};return e.patch(t,n),e.applyData(t,n)}var ms={blockquote:Ro,break:zo,code:Bo,delete:Vo,emphasis:Ho,footnoteReference:Uo,heading:Wo,html:Go,imageReference:qo,image:Jo,inlineCode:Yo,linkReference:Xo,link:Zo,listItem:Qo,list:ts,paragraph:ns,root:rs,strong:is,table:as,tableCell:ss,tableRow:os,text:fs,thematicBreak:ps,toml:hs,yaml:hs,definition:hs,footnoteDefinition:hs};function hs(){}var gs=typeof self==`object`?self:globalThis,_s=(e,t)=>{let n=(t,n)=>(e.set(n,t),t),r=i=>{if(e.has(i))return e.get(i);let[a,o]=t[i];switch(a){case 0:case-1:return n(o,i);case 1:{let e=n([],i);for(let t of o)e.push(r(t));return e}case 2:{let e=n({},i);for(let[t,n]of o)e[r(t)]=r(n);return e}case 3:return n(new Date(o),i);case 4:{let{source:e,flags:t}=o;return n(new RegExp(e,t),i)}case 5:{let e=n(new Map,i);for(let[t,n]of o)e.set(r(t),r(n));return e}case 6:{let e=n(new Set,i);for(let t of o)e.add(r(t));return e}case 7:{let{name:e,message:t}=o;return n(new gs[e](t),i)}case 8:return n(BigInt(o),i);case`BigInt`:return n(Object(BigInt(o)),i);case`ArrayBuffer`:return n(new Uint8Array(o).buffer,o);case`DataView`:{let{buffer:e}=new Uint8Array(o);return n(new DataView(e),o)}}return n(new gs[a](o),i)};return r},vs=e=>_s(new Map,e)(0),ys=``,{toString:bs}={},{keys:xs}=Object,Ss=e=>{let t=typeof e;if(t!==`object`||!e)return[0,t];let n=bs.call(e).slice(8,-1);switch(n){case`Array`:return[1,ys];case`Object`:return[2,ys];case`Date`:return[3,ys];case`RegExp`:return[4,ys];case`Map`:return[5,ys];case`Set`:return[6,ys];case`DataView`:return[1,n]}return n.includes(`Array`)?[1,n]:n.includes(`Error`)?[7,n]:[2,n]},Cs=([e,t])=>e===0&&(t===`function`||t===`symbol`),ws=(e,t,n,r)=>{let i=(e,t)=>{let i=r.push(e)-1;return n.set(t,i),i},a=r=>{if(n.has(r))return n.get(r);let[o,s]=Ss(r);switch(o){case 0:{let t=r;switch(s){case`bigint`:o=8,t=r.toString();break;case`function`:case`symbol`:if(e)throw TypeError(`unable to serialize `+s);t=null;break;case`undefined`:return i([-1],r)}return i([o,t],r)}case 1:{if(s){let e=r;return s===`DataView`?e=new Uint8Array(r.buffer):s===`ArrayBuffer`&&(e=new Uint8Array(r)),i([s,[...e]],r)}let e=[],t=i([o,e],r);for(let t of r)e.push(a(t));return t}case 2:{if(s)switch(s){case`BigInt`:return i([s,r.toString()],r);case`Boolean`:case`Number`:case`String`:return i([s,r.valueOf()],r)}if(t&&`toJSON`in r)return a(r.toJSON());let n=[],c=i([o,n],r);for(let t of xs(r))(e||!Cs(Ss(r[t])))&&n.push([a(t),a(r[t])]);return c}case 3:return i([o,r.toISOString()],r);case 4:{let{source:e,flags:t}=r;return i([o,{source:e,flags:t}],r)}case 5:{let t=[],n=i([o,t],r);for(let[n,i]of r)(e||!(Cs(Ss(n))||Cs(Ss(i))))&&t.push([a(n),a(i)]);return n}case 6:{let t=[],n=i([o,t],r);for(let n of r)(e||!Cs(Ss(n)))&&t.push(a(n));return n}}let{message:c}=r;return i([o,{name:s,message:c}],r)};return a},Ts=(e,{json:t,lossy:n}={})=>{let r=[];return ws(!(t||n),!!t,new Map,r)(e),r},Es=typeof structuredClone==`function`?(e,t)=>t&&(`json`in t||`lossy`in t)?vs(Ts(e,t)):structuredClone(e):(e,t)=>vs(Ts(e,t));function Ds(e,t){let n=[{type:`text`,value:`↩`}];return t>1&&n.push({type:`element`,tagName:`sup`,properties:{},children:[{type:`text`,value:String(t)}]}),n}function Os(e,t){return`Back to reference `+(e+1)+(t>1?`-`+t:``)}function ks(e){let t=typeof e.options.clobberPrefix==`string`?e.options.clobberPrefix:`user-content-`,n=e.options.footnoteBackContent||Ds,r=e.options.footnoteBackLabel||Os,i=e.options.footnoteLabel||`Footnotes`,a=e.options.footnoteLabelTagName||`h2`,o=e.options.footnoteLabelProperties||{className:[`sr-only`]},s=[],c=-1;for(;++c<e.footnoteOrder.length;){let i=e.footnoteById.get(e.footnoteOrder[c]);if(!i)continue;let a=e.all(i),o=String(i.identifier).toUpperCase(),l=pi(o.toLowerCase()),u=0,d=[],f=e.footnoteCounts.get(o);for(;f!==void 0&&++u<=f;){d.length>0&&d.push({type:`text`,value:` `});let e=typeof n==`string`?n:n(c,u);typeof e==`string`&&(e={type:`text`,value:e}),d.push({type:`element`,tagName:`a`,properties:{href:`#`+t+`fnref-`+l+(u>1?`-`+u:``),dataFootnoteBackref:``,ariaLabel:typeof r==`string`?r:r(c,u),className:[`data-footnote-backref`]},children:Array.isArray(e)?e:[e]})}let p=a[a.length-1];if(p&&p.type===`element`&&p.tagName===`p`){let e=p.children[p.children.length-1];e&&e.type===`text`?e.value+=` `:p.children.push({type:`text`,value:` `}),p.children.push(...d)}else a.push(...d);let m={type:`element`,tagName:`li`,properties:{id:t+`fn-`+l},children:e.wrap(a,!0)};e.patch(i,m),s.push(m)}if(s.length!==0)return{type:`element`,tagName:`section`,properties:{dataFootnotes:!0,className:[`footnotes`]},children:[{type:`element`,tagName:a,properties:{...Es(o),id:`footnote-label`},children:[{type:`text`,value:i}]},{type:`text`,value:`
`},{type:`element`,tagName:`ol`,properties:{},children:e.wrap(s,!0)},{type:`text`,value:`
`}]}}var As=(function(e){if(e==null)return Fs;if(typeof e==`function`)return Ps(e);if(typeof e==`object`)return Array.isArray(e)?js(e):Ms(e);if(typeof e==`string`)return Ns(e);throw Error(`Expected function, string, or object as test`)});function js(e){let t=[],n=-1;for(;++n<e.length;)t[n]=As(e[n]);return Ps(r);function r(...e){let n=-1;for(;++n<t.length;)if(t[n].apply(this,e))return!0;return!1}}function Ms(e){let t=e;return Ps(n);function n(n){let r=n,i;for(i in e)if(r[i]!==t[i])return!1;return!0}}function Ns(e){return Ps(t);function t(t){return t&&t.type===e}}function Ps(e){return t;function t(t,n,r){return!!(Is(t)&&e.call(this,t,typeof n==`number`?n:void 0,r||void 0))}}function Fs(){return!0}function Is(e){return typeof e==`object`&&!!e&&`type`in e}function Ls(e){return e}var Rs=[];function zs(e,t,n,r){let i;typeof t==`function`&&typeof n!=`function`?(r=n,n=t):i=t;let a=As(i),o=r?-1:1;s(e,void 0,[])();function s(e,i,c){let l=e&&typeof e==`object`?e:{};if(typeof l.type==`string`){let t=typeof l.tagName==`string`?l.tagName:typeof l.name==`string`?l.name:void 0;Object.defineProperty(u,`name`,{value:`node (`+Ls(e.type+(t?`<`+t+`>`:``))+`)`})}return u;function u(){let l=Rs,u,d,f;if((!t||a(e,i,c[c.length-1]||void 0))&&(l=Bs(n(e,c)),l[0]===!1))return l;if(`children`in e&&e.children){let t=e;if(t.children&&l[0]!==`skip`)for(d=(r?t.children.length:-1)+o,f=c.concat(t);d>-1&&d<t.children.length;){let e=t.children[d];if(u=s(e,d,f)(),u[0]===!1)return u;d=typeof u[1]==`number`?u[1]:d+o}}return l}}}function Bs(e){return Array.isArray(e)?e:typeof e==`number`?[!0,e]:e==null?Rs:[e]}function Vs(e,t,n,r){let i,a,o;typeof t==`function`&&typeof n!=`function`?(a=void 0,o=t,i=n):(a=t,o=n,i=r),zs(e,a,s,i);function s(e,t){let n=t[t.length-1],r=n?n.children.indexOf(e):void 0;return o(e,r,n)}}var Hs={}.hasOwnProperty,Us={};function Ws(e,t){let n=t||Us,r=new Map,i=new Map,a={all:s,applyData:Ks,definitionById:r,footnoteById:i,footnoteCounts:new Map,footnoteOrder:[],handlers:{...ms,...n.handlers},one:o,options:n,patch:Gs,wrap:Js};return Vs(e,function(e){if(e.type===`definition`||e.type===`footnoteDefinition`){let t=e.type===`definition`?r:i,n=String(e.identifier).toUpperCase();t.has(n)||t.set(n,e)}}),a;function o(e,t){let n=e.type,r=a.handlers[n];if(Hs.call(a.handlers,n)&&r)return r(a,e,t);if(a.options.passThrough&&a.options.passThrough.includes(n)){if(`children`in e){let{children:t,...n}=e,r=Es(n);return r.children=a.all(e),r}return Es(e)}return(a.options.unknownHandler||qs)(a,e,t)}function s(e){let t=[];if(`children`in e){let n=e.children,r=-1;for(;++r<n.length;){let i=a.one(n[r],e);if(i){if(r&&n[r-1].type===`break`&&(!Array.isArray(i)&&i.type===`text`&&(i.value=Ys(i.value)),!Array.isArray(i)&&i.type===`element`)){let e=i.children[0];e&&e.type===`text`&&(e.value=Ys(e.value))}Array.isArray(i)?t.push(...i):t.push(i)}}}return t}}function Gs(e,t){e.position&&(t.position=ar(e))}function Ks(e,t){let n=t;if(e&&e.data){let t=e.data.hName,r=e.data.hChildren,i=e.data.hProperties;typeof t==`string`&&(n.type===`element`?n.tagName=t:n={type:`element`,tagName:t,properties:{},children:`children`in n?n.children:[n]}),n.type===`element`&&i&&Object.assign(n.properties,Es(i)),`children`in n&&n.children&&r!=null&&(n.children=r)}return n}function qs(e,t){let n=t.data||{},r=`value`in t&&!(Hs.call(n,`hProperties`)||Hs.call(n,`hChildren`))?{type:`text`,value:t.value}:{type:`element`,tagName:`div`,properties:{},children:e.all(t)};return e.patch(t,r),e.applyData(t,r)}function Js(e,t){let n=[],r=-1;for(t&&n.push({type:`text`,value:`
`});++r<e.length;)r&&n.push({type:`text`,value:`
`}),n.push(e[r]);return t&&e.length>0&&n.push({type:`text`,value:`
`}),n}function Ys(e){let t=0,n=e.charCodeAt(t);for(;n===9||n===32;)t++,n=e.charCodeAt(t);return e.slice(t)}function Xs(e,t){let n=Ws(e,t),r=n.one(e,void 0),i=ks(n),a=Array.isArray(r)?{type:`root`,children:r}:r||{type:`root`,children:[]};return i&&(`children`in a,a.children.push({type:`text`,value:`
`},i)),a}function Zs(e,t){return e&&`run`in e?async function(n,r){let i=Xs(n,{file:r,...t});await e.run(i,r)}:function(n,r){return Xs(n,{file:r,...e||t})}}function Qs(e){if(e)throw e}var $s=o(((e,t)=>{var n=Object.prototype.hasOwnProperty,r=Object.prototype.toString,i=Object.defineProperty,a=Object.getOwnPropertyDescriptor,o=function(e){return typeof Array.isArray==`function`?Array.isArray(e):r.call(e)===`[object Array]`},s=function(e){if(!e||r.call(e)!==`[object Object]`)return!1;var t=n.call(e,`constructor`),i=e.constructor&&e.constructor.prototype&&n.call(e.constructor.prototype,`isPrototypeOf`);if(e.constructor&&!t&&!i)return!1;for(var a in e);return a===void 0||n.call(e,a)},c=function(e,t){i&&t.name===`__proto__`?i(e,t.name,{enumerable:!0,configurable:!0,value:t.newValue,writable:!0}):e[t.name]=t.newValue},l=function(e,t){if(t===`__proto__`){if(!n.call(e,t))return;if(a)return a(e,t).value}return e[t]};t.exports=function e(){var t,n,r,i,a,u,d=arguments[0],f=1,p=arguments.length,m=!1;for(typeof d==`boolean`&&(m=d,d=arguments[1]||{},f=2),(d==null||typeof d!=`object`&&typeof d!=`function`)&&(d={});f<p;++f)if(t=arguments[f],t!=null)for(n in t)r=l(d,n),i=l(t,n),d!==i&&(m&&i&&(s(i)||(a=o(i)))?(a?(a=!1,u=r&&o(r)?r:[]):u=r&&s(r)?r:{},c(d,{name:n,newValue:e(m,u,i)})):i!==void 0&&c(d,{name:n,newValue:i}));return d}}));function ec(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return(t===null||t===Object.prototype||Object.getPrototypeOf(t)===null)&&!(Symbol.toStringTag in e)&&!(Symbol.iterator in e)}function tc(){let e=[],t={run:n,use:r};return t;function n(...t){let n=-1,r=t.pop();if(typeof r!=`function`)throw TypeError(`Expected function as last argument, not `+r);i(null,...t);function i(a,...o){let s=e[++n],c=-1;if(a){r(a);return}for(;++c<t.length;)(o[c]===null||o[c]===void 0)&&(o[c]=t[c]);t=o,s?nc(s,i)(...o):r(null,...o)}}function r(n){if(typeof n!=`function`)throw TypeError("Expected `middelware` to be a function, not "+n);return e.push(n),t}}function nc(e,t){let n;return r;function r(...t){let r=e.length>t.length,o;r&&t.push(i);try{o=e.apply(this,t)}catch(e){let t=e;if(r&&n)throw t;return i(t)}r||(o&&o.then&&typeof o.then==`function`?o.then(a,i):o instanceof Error?i(o):a(o))}function i(e,...r){n||(n=!0,t(e,...r))}function a(e){i(null,e)}}var rc={basename:ic,dirname:ac,extname:oc,join:sc,sep:`/`};function ic(e,t){if(t!==void 0&&typeof t!=`string`)throw TypeError(`"ext" argument must be a string`);uc(e);let n=0,r=-1,i=e.length,a;if(t===void 0||t.length===0||t.length>e.length){for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else r<0&&(a=!0,r=i+1);return r<0?``:e.slice(n,r)}if(t===e)return``;let o=-1,s=t.length-1;for(;i--;)if(e.codePointAt(i)===47){if(a){n=i+1;break}}else o<0&&(a=!0,o=i+1),s>-1&&(e.codePointAt(i)===t.codePointAt(s--)?s<0&&(r=i):(s=-1,r=o));return n===r?r=o:r<0&&(r=e.length),e.slice(n,r)}function ac(e){if(uc(e),e.length===0)return`.`;let t=-1,n=e.length,r;for(;--n;)if(e.codePointAt(n)===47){if(r){t=n;break}}else r||=!0;return t<0?e.codePointAt(0)===47?`/`:`.`:t===1&&e.codePointAt(0)===47?`//`:e.slice(0,t)}function oc(e){uc(e);let t=e.length,n=-1,r=0,i=-1,a=0,o;for(;t--;){let s=e.codePointAt(t);if(s===47){if(o){r=t+1;break}continue}n<0&&(o=!0,n=t+1),s===46?i<0?i=t:a!==1&&(a=1):i>-1&&(a=-1)}return i<0||n<0||a===0||a===1&&i===n-1&&i===r+1?``:e.slice(i,n)}function sc(...e){let t=-1,n;for(;++t<e.length;)uc(e[t]),e[t]&&(n=n===void 0?e[t]:n+`/`+e[t]);return n===void 0?`.`:cc(n)}function cc(e){uc(e);let t=e.codePointAt(0)===47,n=lc(e,!t);return n.length===0&&!t&&(n=`.`),n.length>0&&e.codePointAt(e.length-1)===47&&(n+=`/`),t?`/`+n:n}function lc(e,t){let n=``,r=0,i=-1,a=0,o=-1,s,c;for(;++o<=e.length;){if(o<e.length)s=e.codePointAt(o);else if(s===47)break;else s=47;if(s===47){if(!(i===o-1||a===1))if(i!==o-1&&a===2){if(n.length<2||r!==2||n.codePointAt(n.length-1)!==46||n.codePointAt(n.length-2)!==46){if(n.length>2){if(c=n.lastIndexOf(`/`),c!==n.length-1){c<0?(n=``,r=0):(n=n.slice(0,c),r=n.length-1-n.lastIndexOf(`/`)),i=o,a=0;continue}}else if(n.length>0){n=``,r=0,i=o,a=0;continue}}t&&(n=n.length>0?n+`/..`:`..`,r=2)}else n.length>0?n+=`/`+e.slice(i+1,o):n=e.slice(i+1,o),r=o-i-1;i=o,a=0}else s===46&&a>-1?a++:a=-1}return n}function uc(e){if(typeof e!=`string`)throw TypeError(`Path must be a string. Received `+JSON.stringify(e))}var dc={cwd:fc};function fc(){return`/`}function pc(e){return!!(typeof e==`object`&&e&&`href`in e&&e.href&&`protocol`in e&&e.protocol&&e.auth===void 0)}function mc(e){if(typeof e==`string`)e=new URL(e);else if(!pc(e)){let t=TypeError('The "path" argument must be of type string or an instance of URL. Received `'+e+"`");throw t.code=`ERR_INVALID_ARG_TYPE`,t}if(e.protocol!==`file:`){let e=TypeError(`The URL must be of scheme file`);throw e.code=`ERR_INVALID_URL_SCHEME`,e}return hc(e)}function hc(e){if(e.hostname!==``){let e=TypeError(`File URL host must be "localhost" or empty on darwin`);throw e.code=`ERR_INVALID_FILE_URL_HOST`,e}let t=e.pathname,n=-1;for(;++n<t.length;)if(t.codePointAt(n)===37&&t.codePointAt(n+1)===50){let e=t.codePointAt(n+2);if(e===70||e===102){let e=TypeError(`File URL path must not include encoded / characters`);throw e.code=`ERR_INVALID_FILE_URL_PATH`,e}}return decodeURIComponent(t)}var gc=[`history`,`path`,`basename`,`stem`,`extname`,`dirname`],_c=class{constructor(e){let t;t=e?pc(e)?{path:e}:typeof e==`string`||xc(e)?{value:e}:e:{},this.cwd=`cwd`in t?``:dc.cwd(),this.data={},this.history=[],this.messages=[],this.value,this.map,this.result,this.stored;let n=-1;for(;++n<gc.length;){let e=gc[n];e in t&&t[e]!==void 0&&t[e]!==null&&(this[e]=e===`history`?[...t[e]]:t[e])}let r;for(r in t)gc.includes(r)||(this[r]=t[r])}get basename(){return typeof this.path==`string`?rc.basename(this.path):void 0}set basename(e){yc(e,`basename`),vc(e,`basename`),this.path=rc.join(this.dirname||``,e)}get dirname(){return typeof this.path==`string`?rc.dirname(this.path):void 0}set dirname(e){bc(this.basename,`dirname`),this.path=rc.join(e||``,this.basename)}get extname(){return typeof this.path==`string`?rc.extname(this.path):void 0}set extname(e){if(vc(e,`extname`),bc(this.dirname,`extname`),e){if(e.codePointAt(0)!==46)throw Error("`extname` must start with `.`");if(e.includes(`.`,1))throw Error("`extname` cannot contain multiple dots")}this.path=rc.join(this.dirname,this.stem+(e||``))}get path(){return this.history[this.history.length-1]}set path(e){pc(e)&&(e=mc(e)),yc(e,`path`),this.path!==e&&this.history.push(e)}get stem(){return typeof this.path==`string`?rc.basename(this.path,this.extname):void 0}set stem(e){yc(e,`stem`),vc(e,`stem`),this.path=rc.join(this.dirname||``,e+(this.extname||``))}fail(e,t,n){let r=this.message(e,t,n);throw r.fatal=!0,r}info(e,t,n){let r=this.message(e,t,n);return r.fatal=void 0,r}message(e,t,n){let r=new ur(e,t,n);return this.path&&(r.name=this.path+`:`+r.name,r.file=this.path),r.fatal=!1,this.messages.push(r),r}toString(e){return this.value===void 0?``:typeof this.value==`string`?this.value:new TextDecoder(e||void 0).decode(this.value)}};function vc(e,t){if(e&&e.includes(rc.sep))throw Error("`"+t+"` cannot be a path: did not expect `"+rc.sep+"`")}function yc(e,t){if(!e)throw Error("`"+t+"` cannot be empty")}function bc(e,t){if(!e)throw Error("Setting `"+t+"` requires `path` to be set too")}function xc(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var Sc=(function(e){let t=this.constructor.prototype,n=t[e],r=function(){return n.apply(r,arguments)};return Object.setPrototypeOf(r,t),r}),Cc=l($s(),1),wc={}.hasOwnProperty,Tc=new class e extends Sc{constructor(){super(`copy`),this.Compiler=void 0,this.Parser=void 0,this.attachers=[],this.compiler=void 0,this.freezeIndex=-1,this.frozen=void 0,this.namespace={},this.parser=void 0,this.transformers=tc()}copy(){let t=new e,n=-1;for(;++n<this.attachers.length;){let e=this.attachers[n];t.use(...e)}return t.data((0,Cc.default)(!0,{},this.namespace)),t}data(e,t){return typeof e==`string`?arguments.length===2?(Oc(`data`,this.frozen),this.namespace[e]=t,this):wc.call(this.namespace,e)&&this.namespace[e]||void 0:e?(Oc(`data`,this.frozen),this.namespace=e,this):this.namespace}freeze(){if(this.frozen)return this;let e=this;for(;++this.freezeIndex<this.attachers.length;){let[t,...n]=this.attachers[this.freezeIndex];if(n[0]===!1)continue;n[0]===!0&&(n[0]=void 0);let r=t.call(e,...n);typeof r==`function`&&this.transformers.use(r)}return this.frozen=!0,this.freezeIndex=1/0,this}parse(e){this.freeze();let t=jc(e),n=this.parser||this.Parser;return Ec(`parse`,n),n(String(t),t)}process(e,t){let n=this;return this.freeze(),Ec(`process`,this.parser||this.Parser),Dc(`process`,this.compiler||this.Compiler),t?r(void 0,t):new Promise(r);function r(r,i){let a=jc(e),o=n.parse(a);n.run(o,a,function(e,t,r){if(e||!t||!r)return s(e);let i=t,a=n.stringify(i,r);Nc(a)?r.value=a:r.result=a,s(e,r)});function s(e,n){e||!n?i(e):r?r(n):t(void 0,n)}}}processSync(e){let t=!1,n;return this.freeze(),Ec(`processSync`,this.parser||this.Parser),Dc(`processSync`,this.compiler||this.Compiler),this.process(e,r),Ac(`processSync`,`process`,t),n;function r(e,r){t=!0,Qs(e),n=r}}run(e,t,n){kc(e),this.freeze();let r=this.transformers;return!n&&typeof t==`function`&&(n=t,t=void 0),n?i(void 0,n):new Promise(i);function i(i,a){let o=jc(t);r.run(e,o,s);function s(t,r,o){let s=r||e;t?a(t):i?i(s):n(void 0,s,o)}}}runSync(e,t){let n=!1,r;return this.run(e,t,i),Ac(`runSync`,`run`,n),r;function i(e,t){Qs(e),r=t,n=!0}}stringify(e,t){this.freeze();let n=jc(t),r=this.compiler||this.Compiler;return Dc(`stringify`,r),kc(e),r(e,n)}use(e,...t){let n=this.attachers,r=this.namespace;if(Oc(`use`,this.frozen),e!=null)if(typeof e==`function`)s(e,t);else if(typeof e==`object`)Array.isArray(e)?o(e):a(e);else throw TypeError("Expected usable value, not `"+e+"`");return this;function i(e){if(typeof e==`function`)s(e,[]);else if(typeof e==`object`)if(Array.isArray(e)){let[t,...n]=e;s(t,n)}else a(e);else throw TypeError("Expected usable value, not `"+e+"`")}function a(e){if(!(`plugins`in e)&&!(`settings`in e))throw Error("Expected usable value but received an empty preset, which is probably a mistake: presets typically come with `plugins` and sometimes with `settings`, but this has neither");o(e.plugins),e.settings&&(r.settings=(0,Cc.default)(!0,r.settings,e.settings))}function o(e){let t=-1;if(e!=null)if(Array.isArray(e))for(;++t<e.length;){let n=e[t];i(n)}else throw TypeError("Expected a list of plugins, not `"+e+"`")}function s(e,t){let r=-1,i=-1;for(;++r<n.length;)if(n[r][0]===e){i=r;break}if(i===-1)n.push([e,...t]);else if(t.length>0){let[r,...a]=t,o=n[i][1];ec(o)&&ec(r)&&(r=(0,Cc.default)(!0,o,r)),n[i]=[e,r,...a]}}}}().freeze();function Ec(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `parser`")}function Dc(e,t){if(typeof t!=`function`)throw TypeError("Cannot `"+e+"` without `compiler`")}function Oc(e,t){if(t)throw Error("Cannot call `"+e+"` on a frozen processor.\nCreate a new processor first, by calling it: use `processor()` instead of `processor`.")}function kc(e){if(!ec(e)||typeof e.type!=`string`)throw TypeError("Expected node, got `"+e+"`")}function Ac(e,t,n){if(!n)throw Error("`"+e+"` finished async. Use `"+t+"` instead")}function jc(e){return Mc(e)?e:new _c(e)}function Mc(e){return!!(e&&typeof e==`object`&&`message`in e&&`messages`in e)}function Nc(e){return typeof e==`string`||Pc(e)}function Pc(e){return!!(e&&typeof e==`object`&&`byteLength`in e&&`byteOffset`in e)}var Fc=[],Ic={allowDangerousHtml:!0},Lc=/^(https?|ircs?|mailto|xmpp)$/i,Rc=[{from:`astPlugins`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowDangerousHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`allowNode`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowElement`},{from:`allowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`allowedElements`},{from:`className`,id:`remove-classname`},{from:`disallowedTypes`,id:`replace-allownode-allowedtypes-and-disallowedtypes`,to:`disallowedElements`},{from:`escapeHtml`,id:`remove-buggy-html-in-markdown-parser`},{from:`includeElementIndex`,id:`#remove-includeelementindex`},{from:`includeNodeIndex`,id:`change-includenodeindex-to-includeelementindex`},{from:`linkTarget`,id:`remove-linktarget`},{from:`plugins`,id:`change-plugins-to-remarkplugins`,to:`remarkPlugins`},{from:`rawSourcePos`,id:`#remove-rawsourcepos`},{from:`renderers`,id:`change-renderers-to-components`,to:`components`},{from:`source`,id:`change-source-to-children`,to:`children`},{from:`sourcePos`,id:`#remove-sourcepos`},{from:`transformImageUri`,id:`#add-urltransform`,to:`urlTransform`},{from:`transformLinkUri`,id:`#add-urltransform`,to:`urlTransform`}];function zc(e){let t=Bc(e),n=Vc(e);return Hc(t.runSync(t.parse(n),n),e)}function Bc(e){let t=e.rehypePlugins||Fc,n=e.remarkPlugins||Fc,r=e.remarkRehypeOptions?{...e.remarkRehypeOptions,...Ic}:Ic;return Tc().use(Lo).use(n).use(Zs,r).use(t)}function Vc(e){let t=e.children||``,n=new _c;return typeof t==`string`?n.value=t:``+t,n}function Hc(e,t){let n=t.allowedElements,r=t.allowElement,i=t.components,a=t.disallowedElements,o=t.skipHtml,s=t.unwrapDisallowed,c=t.urlTransform||Uc;for(let e of Rc)Object.hasOwn(t,e.from)&&``+e.from+(e.to?"use `"+e.to+"` instead":`remove it`)+e.id;return Vs(e,l),vr(e,{Fragment:b.Fragment,components:i,ignoreInvalidStyle:!0,jsx:b.jsx,jsxs:b.jsxs,passKeys:!0,passNode:!0});function l(e,t,i){if(e.type===`raw`&&i&&typeof t==`number`)return o?i.children.splice(t,1):i.children[t]={type:`text`,value:e.value},t;if(e.type===`element`){let t;for(t in Br)if(Object.hasOwn(Br,t)&&Object.hasOwn(e.properties,t)){let n=e.properties[t],r=Br[t];(r===null||r.includes(e.tagName))&&(e.properties[t]=c(String(n||``),t,e))}}if(e.type===`element`){let o=n?!n.includes(e.tagName):a?a.includes(e.tagName):!1;if(!o&&r&&typeof t==`number`&&(o=!r(e,t,i)),o&&i&&typeof t==`number`)return s&&e.children?i.children.splice(t,1,...e.children):i.children.splice(t,1),t}}}function Uc(e){let t=e.indexOf(`:`),n=e.indexOf(`?`),r=e.indexOf(`#`),i=e.indexOf(`/`);return t===-1||i!==-1&&t>i||n!==-1&&t>n||r!==-1&&t>r||Lc.test(e.slice(0,t))?e:``}var Wc=/[#.]/g;function Gc(e,t){let n=e||``,r={},i=0,a,o;for(;i<n.length;){Wc.lastIndex=i;let e=Wc.exec(n),t=n.slice(i,e?e.index:n.length);t&&(a?a===`#`?r.id=t:Array.isArray(r.className)?r.className.push(t):r.className=[t]:o=t,i+=t.length),e&&(a=e[0],i++)}return{type:`element`,tagName:o||t||`div`,properties:r,children:[]}}function Kc(e,t,n){let r=n?Qc(n):void 0;function i(n,i,...a){let o;if(n==null){o={type:`root`,children:[]};let e=i;a.unshift(e)}else{o=Gc(n,t);let s=o.tagName.toLowerCase(),c=r?r.get(s):void 0;if(o.tagName=c||s,qc(i))a.unshift(i);else for(let[t,n]of Object.entries(i))Jc(e,o.properties,t,n)}for(let e of a)Yc(o.children,e);return o.type===`element`&&o.tagName===`template`&&(o.content={type:`root`,children:o.children},o.children=[]),o}return i}function qc(e){if(typeof e!=`object`||!e||Array.isArray(e))return!0;if(typeof e.type!=`string`)return!1;let t=e,n=Object.keys(e);for(let e of n){let n=t[e];if(n&&typeof n==`object`){if(!Array.isArray(n))return!0;let e=n;for(let t of e)if(typeof t!=`number`&&typeof t!=`string`)return!0}}return!!(`children`in e&&Array.isArray(e.children))}function Jc(e,t,n,r){let i=Gn(e,n),a;if(r!=null){if(typeof r==`number`){if(Number.isNaN(r))return;a=r}else a=typeof r==`boolean`?r:typeof r==`string`?i.spaceSeparated?Xn(r):i.commaSeparated?ln(r):i.commaOrSpaceSeparated?Xn(ln(r).join(` `)):Xc(i,i.property,r):Array.isArray(r)?[...r]:i.property===`style`?Zc(r):String(r);if(Array.isArray(a)){let e=[];for(let t of a)e.push(Xc(i,i.property,t));a=e}i.property===`className`&&Array.isArray(t.className)&&(a=t.className.concat(a)),t[i.property]=a}}function Yc(e,t){if(t!=null)if(typeof t==`number`||typeof t==`string`)e.push({type:`text`,value:String(t)});else if(Array.isArray(t))for(let n of t)Yc(e,n);else if(typeof t==`object`&&`type`in t)t.type===`root`?Yc(e,t.children):e.push(t);else throw Error("Expected node, nodes, or string, got `"+t+"`")}function Xc(e,t,n){if(typeof n==`string`){if(e.number&&n&&!Number.isNaN(Number(n)))return Number(n);if((e.boolean||e.overloadedBoolean)&&(n===``||bn(n)===bn(t)))return!0}return n}function Zc(e){let t=[];for(let[n,r]of Object.entries(e))t.push([n,r].join(`: `));return t.join(`; `)}function Qc(e){let t=new Map;for(let n of e)t.set(n.toLowerCase(),n);return t}var $c=`altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feDropShadow.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.solidColor.textArea.textPath`.split(`.`),el=Kc(Jn,`div`),tl=Kc(Yn,`g`,$c);function nl(e){let t=String(e),n=[];return{toOffset:i,toPoint:r};function r(e){if(typeof e==`number`&&e>-1&&e<=t.length){let r=0;for(;;){let i=n[r];if(i===void 0){let e=rl(t,n[r-1]);i=e===-1?t.length+1:e+1,n[r]=i}if(i>e)return{line:r+1,column:e-(r>0?n[r-1]:0)+1,offset:e};r++}}}function i(e){if(e&&typeof e.line==`number`&&typeof e.column==`number`&&!Number.isNaN(e.line)&&!Number.isNaN(e.column)){for(;n.length<e.line;){let e=n[n.length-1],r=rl(t,e),i=r===-1?t.length+1:r+1;if(e===i)break;n.push(i)}let r=(e.line>1?n[e.line-2]:0)+e.column-1;if(r<n[e.line-1])return r}}}function rl(e,t){let n=e.indexOf(`\r`,t),r=e.indexOf(`
`,t);return r===-1?n:n===-1||n+1===r?r:n<r?n:r}var il={html:`http://www.w3.org/1999/xhtml`,mathml:`http://www.w3.org/1998/Math/MathML`,svg:`http://www.w3.org/2000/svg`,xlink:`http://www.w3.org/1999/xlink`,xml:`http://www.w3.org/XML/1998/namespace`,xmlns:`http://www.w3.org/2000/xmlns/`},al={}.hasOwnProperty,ol=Object.prototype;function sl(e,t){let n=t||{};return cl({file:n.file||void 0,location:!1,schema:n.space===`svg`?Yn:Jn,verbose:n.verbose||!1},e)}function cl(e,t){let n;switch(t.nodeName){case`#comment`:{let r=t;return n={type:`comment`,value:r.data},dl(e,r,n),n}case`#document`:case`#document-fragment`:{let r=t,i=`mode`in r?r.mode===`quirks`||r.mode===`limited-quirks`:!1;if(n={type:`root`,children:ll(e,t.childNodes),data:{quirksMode:i}},e.file&&e.location){let t=String(e.file),r=nl(t),i=r.toPoint(0),a=r.toPoint(t.length);n.position={start:i,end:a}}return n}case`#documentType`:{let r=t;return n={type:`doctype`},dl(e,r,n),n}case`#text`:{let r=t;return n={type:`text`,value:r.value},dl(e,r,n),n}default:return n=ul(e,t),n}}function ll(e,t){let n=-1,r=[];for(;++n<t.length;){let i=cl(e,t[n]);r.push(i)}return r}function ul(e,t){let n=e.schema;e.schema=t.namespaceURI===il.svg?Yn:Jn;let r=-1,i={};for(;++r<t.attrs.length;){let e=t.attrs[r],n=(e.prefix?e.prefix+`:`:``)+e.name;al.call(ol,n)||(i[n]=e.value)}let a=(e.schema.space===`svg`?tl:el)(t.tagName,i,ll(e,t.childNodes));if(dl(e,t,a),a.tagName===`template`){let n=t,r=n.sourceCodeLocation,i=r&&r.startTag&&pl(r.startTag),o=r&&r.endTag&&pl(r.endTag),s=cl(e,n.content);i&&o&&e.file&&(s.position={start:i.end,end:o.start}),a.content=s}return e.schema=n,a}function dl(e,t,n){if(`sourceCodeLocation`in t&&t.sourceCodeLocation&&e.file){let r=fl(e,n,t.sourceCodeLocation);r&&(e.location=!0,n.position=r)}}function fl(e,t,n){let r=pl(n);if(t.type===`element`){let i=t.children[t.children.length-1];if(r&&!n.endTag&&i&&i.position&&i.position.end&&(r.end=Object.assign({},i.position.end)),e.verbose){let r={},i;if(n.attrs)for(i in n.attrs)al.call(n.attrs,i)&&(r[Gn(e.schema,i).property]=pl(n.attrs[i]));n.startTag;let a=pl(n.startTag),o=n.endTag?pl(n.endTag):void 0,s={opening:a};o&&(s.closing=o),s.properties=r,t.data={position:s}}}return r}function pl(e){let t=ml({line:e.startLine,column:e.startCol,offset:e.startOffset}),n=ml({line:e.endLine,column:e.endCol,offset:e.endOffset});return t||n?{start:t,end:n}:void 0}function ml(e){return e.line&&e.column?e:void 0}var hl={}.hasOwnProperty;function gl(e,t){let n=t||{};function r(t,...n){let i=r.invalid,a=r.handlers;if(t&&hl.call(t,e)){let n=String(t[e]);i=hl.call(a,n)?a[n]:r.unknown}if(i)return i.call(this,t,...n)}return r.handlers=n.handlers||{},r.invalid=n.invalid,r.unknown=n.unknown,r}var _l={},vl={}.hasOwnProperty,yl=gl(`type`,{handlers:{root:xl,element:El,text:wl,comment:Tl,doctype:Cl}});function bl(e,t){let n=(t||_l).space;return yl(e,n===`svg`?Yn:Jn)}function xl(e,t){let n={nodeName:`#document`,mode:(e.data||{}).quirksMode?`quirks`:`no-quirks`,childNodes:[]};return n.childNodes=Ol(e.children,n,t),kl(e,n),n}function Sl(e,t){let n={nodeName:`#document-fragment`,childNodes:[]};return n.childNodes=Ol(e.children,n,t),kl(e,n),n}function Cl(e){let t={nodeName:`#documentType`,name:`html`,publicId:``,systemId:``,parentNode:null};return kl(e,t),t}function wl(e){let t={nodeName:`#text`,value:e.value,parentNode:null};return kl(e,t),t}function Tl(e){let t={nodeName:`#comment`,data:e.value,parentNode:null};return kl(e,t),t}function El(e,t){let n=t,r=n;e.type===`element`&&e.tagName.toLowerCase()===`svg`&&n.space===`html`&&(r=Yn);let i=[],a;if(e.properties){for(a in e.properties)if(a!==`children`&&vl.call(e.properties,a)){let t=Dl(r,a,e.properties[a]);t&&i.push(t)}}let o=r.space,s={nodeName:e.tagName,tagName:e.tagName,attrs:i,namespaceURI:il[o],childNodes:[],parentNode:null};return s.childNodes=Ol(e.children,s,r),kl(e,s),e.tagName===`template`&&e.content&&(s.content=Sl(e.content,r)),s}function Dl(e,t,n){let r=Gn(e,t);if(n===!1||n==null||typeof n==`number`&&Number.isNaN(n)||!n&&r.boolean)return;Array.isArray(n)&&(n=r.commaSeparated?un(n):Zn(n));let i={name:r.attribute,value:n===!0?``:String(n)};if(r.space&&r.space!==`html`&&r.space!==`svg`){let e=i.name.indexOf(`:`);e<0?i.prefix=``:(i.name=i.name.slice(e+1),i.prefix=r.attribute.slice(0,e)),i.namespace=il[r.space]}return i}function Ol(e,t,n){let r=-1,i=[];if(e)for(;++r<e.length;){let a=yl(e[r],n);a.parentNode=t,i.push(a)}return i}function kl(e,t){let n=e.position;n&&n.start&&n.end&&(n.start.offset,n.end.offset,t.sourceCodeLocation={startLine:n.start.line,startCol:n.start.column,startOffset:n.start.offset,endLine:n.end.line,endCol:n.end.column,endOffset:n.end.offset})}var Al=[`area`,`base`,`basefont`,`bgsound`,`br`,`col`,`command`,`embed`,`frame`,`hr`,`image`,`img`,`input`,`keygen`,`link`,`meta`,`param`,`source`,`track`,`wbr`],jl=new Set([65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111]),R;(function(e){e[e.EOF=-1]=`EOF`,e[e.NULL=0]=`NULL`,e[e.TABULATION=9]=`TABULATION`,e[e.CARRIAGE_RETURN=13]=`CARRIAGE_RETURN`,e[e.LINE_FEED=10]=`LINE_FEED`,e[e.FORM_FEED=12]=`FORM_FEED`,e[e.SPACE=32]=`SPACE`,e[e.EXCLAMATION_MARK=33]=`EXCLAMATION_MARK`,e[e.QUOTATION_MARK=34]=`QUOTATION_MARK`,e[e.AMPERSAND=38]=`AMPERSAND`,e[e.APOSTROPHE=39]=`APOSTROPHE`,e[e.HYPHEN_MINUS=45]=`HYPHEN_MINUS`,e[e.SOLIDUS=47]=`SOLIDUS`,e[e.DIGIT_0=48]=`DIGIT_0`,e[e.DIGIT_9=57]=`DIGIT_9`,e[e.SEMICOLON=59]=`SEMICOLON`,e[e.LESS_THAN_SIGN=60]=`LESS_THAN_SIGN`,e[e.EQUALS_SIGN=61]=`EQUALS_SIGN`,e[e.GREATER_THAN_SIGN=62]=`GREATER_THAN_SIGN`,e[e.QUESTION_MARK=63]=`QUESTION_MARK`,e[e.LATIN_CAPITAL_A=65]=`LATIN_CAPITAL_A`,e[e.LATIN_CAPITAL_Z=90]=`LATIN_CAPITAL_Z`,e[e.RIGHT_SQUARE_BRACKET=93]=`RIGHT_SQUARE_BRACKET`,e[e.GRAVE_ACCENT=96]=`GRAVE_ACCENT`,e[e.LATIN_SMALL_A=97]=`LATIN_SMALL_A`,e[e.LATIN_SMALL_Z=122]=`LATIN_SMALL_Z`})(R||={});var Ml={DASH_DASH:`--`,CDATA_START:`[CDATA[`,DOCTYPE:`doctype`,SCRIPT:`script`,PUBLIC:`public`,SYSTEM:`system`};function Nl(e){return e>=55296&&e<=57343}function Pl(e){return e>=56320&&e<=57343}function Fl(e,t){return(e-55296)*1024+9216+t}function Il(e){return e!==32&&e!==10&&e!==13&&e!==9&&e!==12&&e>=1&&e<=31||e>=127&&e<=159}function Ll(e){return e>=64976&&e<=65007||jl.has(e)}var z;(function(e){e.controlCharacterInInputStream=`control-character-in-input-stream`,e.noncharacterInInputStream=`noncharacter-in-input-stream`,e.surrogateInInputStream=`surrogate-in-input-stream`,e.nonVoidHtmlElementStartTagWithTrailingSolidus=`non-void-html-element-start-tag-with-trailing-solidus`,e.endTagWithAttributes=`end-tag-with-attributes`,e.endTagWithTrailingSolidus=`end-tag-with-trailing-solidus`,e.unexpectedSolidusInTag=`unexpected-solidus-in-tag`,e.unexpectedNullCharacter=`unexpected-null-character`,e.unexpectedQuestionMarkInsteadOfTagName=`unexpected-question-mark-instead-of-tag-name`,e.invalidFirstCharacterOfTagName=`invalid-first-character-of-tag-name`,e.unexpectedEqualsSignBeforeAttributeName=`unexpected-equals-sign-before-attribute-name`,e.missingEndTagName=`missing-end-tag-name`,e.unexpectedCharacterInAttributeName=`unexpected-character-in-attribute-name`,e.unknownNamedCharacterReference=`unknown-named-character-reference`,e.missingSemicolonAfterCharacterReference=`missing-semicolon-after-character-reference`,e.unexpectedCharacterAfterDoctypeSystemIdentifier=`unexpected-character-after-doctype-system-identifier`,e.unexpectedCharacterInUnquotedAttributeValue=`unexpected-character-in-unquoted-attribute-value`,e.eofBeforeTagName=`eof-before-tag-name`,e.eofInTag=`eof-in-tag`,e.missingAttributeValue=`missing-attribute-value`,e.missingWhitespaceBetweenAttributes=`missing-whitespace-between-attributes`,e.missingWhitespaceAfterDoctypePublicKeyword=`missing-whitespace-after-doctype-public-keyword`,e.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers=`missing-whitespace-between-doctype-public-and-system-identifiers`,e.missingWhitespaceAfterDoctypeSystemKeyword=`missing-whitespace-after-doctype-system-keyword`,e.missingQuoteBeforeDoctypePublicIdentifier=`missing-quote-before-doctype-public-identifier`,e.missingQuoteBeforeDoctypeSystemIdentifier=`missing-quote-before-doctype-system-identifier`,e.missingDoctypePublicIdentifier=`missing-doctype-public-identifier`,e.missingDoctypeSystemIdentifier=`missing-doctype-system-identifier`,e.abruptDoctypePublicIdentifier=`abrupt-doctype-public-identifier`,e.abruptDoctypeSystemIdentifier=`abrupt-doctype-system-identifier`,e.cdataInHtmlContent=`cdata-in-html-content`,e.incorrectlyOpenedComment=`incorrectly-opened-comment`,e.eofInScriptHtmlCommentLikeText=`eof-in-script-html-comment-like-text`,e.eofInDoctype=`eof-in-doctype`,e.nestedComment=`nested-comment`,e.abruptClosingOfEmptyComment=`abrupt-closing-of-empty-comment`,e.eofInComment=`eof-in-comment`,e.incorrectlyClosedComment=`incorrectly-closed-comment`,e.eofInCdata=`eof-in-cdata`,e.absenceOfDigitsInNumericCharacterReference=`absence-of-digits-in-numeric-character-reference`,e.nullCharacterReference=`null-character-reference`,e.surrogateCharacterReference=`surrogate-character-reference`,e.characterReferenceOutsideUnicodeRange=`character-reference-outside-unicode-range`,e.controlCharacterReference=`control-character-reference`,e.noncharacterCharacterReference=`noncharacter-character-reference`,e.missingWhitespaceBeforeDoctypeName=`missing-whitespace-before-doctype-name`,e.missingDoctypeName=`missing-doctype-name`,e.invalidCharacterSequenceAfterDoctypeName=`invalid-character-sequence-after-doctype-name`,e.duplicateAttribute=`duplicate-attribute`,e.nonConformingDoctype=`non-conforming-doctype`,e.missingDoctype=`missing-doctype`,e.misplacedDoctype=`misplaced-doctype`,e.endTagWithoutMatchingOpenElement=`end-tag-without-matching-open-element`,e.closingOfElementWithOpenChildElements=`closing-of-element-with-open-child-elements`,e.disallowedContentInNoscriptInHead=`disallowed-content-in-noscript-in-head`,e.openElementsLeftAfterEof=`open-elements-left-after-eof`,e.abandonedHeadElementChild=`abandoned-head-element-child`,e.misplacedStartTagForHeadElement=`misplaced-start-tag-for-head-element`,e.nestedNoscriptInHead=`nested-noscript-in-head`,e.eofInElementThatCanContainOnlyText=`eof-in-element-that-can-contain-only-text`})(z||={});var Rl=65536,zl=class{constructor(e){this.handler=e,this.html=``,this.pos=-1,this.lastGapPos=-2,this.gapStack=[],this.skipNextNewLine=!1,this.lastChunkWritten=!1,this.endOfChunkHit=!1,this.bufferWaterline=Rl,this.isEol=!1,this.lineStartPos=0,this.droppedBufferSize=0,this.line=1,this.lastErrOffset=-1}get col(){return this.pos-this.lineStartPos+Number(this.lastGapPos!==this.pos)}get offset(){return this.droppedBufferSize+this.pos}getError(e,t){let{line:n,col:r,offset:i}=this,a=r+t,o=i+t;return{code:e,startLine:n,endLine:n,startCol:a,endCol:a,startOffset:o,endOffset:o}}_err(e){this.handler.onParseError&&this.lastErrOffset!==this.offset&&(this.lastErrOffset=this.offset,this.handler.onParseError(this.getError(e,0)))}_addGap(){this.gapStack.push(this.lastGapPos),this.lastGapPos=this.pos}_processSurrogate(e){if(this.pos!==this.html.length-1){let t=this.html.charCodeAt(this.pos+1);if(Pl(t))return this.pos++,this._addGap(),Fl(e,t)}else if(!this.lastChunkWritten)return this.endOfChunkHit=!0,R.EOF;return this._err(z.surrogateInInputStream),e}willDropParsedChunk(){return this.pos>this.bufferWaterline}dropParsedChunk(){this.willDropParsedChunk()&&(this.html=this.html.substring(this.pos),this.lineStartPos-=this.pos,this.droppedBufferSize+=this.pos,this.pos=0,this.lastGapPos=-2,this.gapStack.length=0)}write(e,t){this.html.length>0?this.html+=e:this.html=e,this.endOfChunkHit=!1,this.lastChunkWritten=t}insertHtmlAtCurrentPos(e){this.html=this.html.substring(0,this.pos+1)+e+this.html.substring(this.pos+1),this.endOfChunkHit=!1}startsWith(e,t){if(this.pos+e.length>this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,!1;if(t)return this.html.startsWith(e,this.pos);for(let t=0;t<e.length;t++)if((this.html.charCodeAt(this.pos+t)|32)!==e.charCodeAt(t))return!1;return!0}peek(e){let t=this.pos+e;if(t>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,R.EOF;let n=this.html.charCodeAt(t);return n===R.CARRIAGE_RETURN?R.LINE_FEED:n}advance(){if(this.pos++,this.isEol&&(this.isEol=!1,this.line++,this.lineStartPos=this.pos),this.pos>=this.html.length)return this.endOfChunkHit=!this.lastChunkWritten,R.EOF;let e=this.html.charCodeAt(this.pos);return e===R.CARRIAGE_RETURN?(this.isEol=!0,this.skipNextNewLine=!0,R.LINE_FEED):e===R.LINE_FEED&&(this.isEol=!0,this.skipNextNewLine)?(this.line--,this.skipNextNewLine=!1,this._addGap(),this.advance()):(this.skipNextNewLine=!1,Nl(e)&&(e=this._processSurrogate(e)),this.handler.onParseError===null||e>31&&e<127||e===R.LINE_FEED||e===R.CARRIAGE_RETURN||e>159&&e<64976||this._checkForProblematicCharacters(e),e)}_checkForProblematicCharacters(e){Il(e)?this._err(z.controlCharacterInInputStream):Ll(e)&&this._err(z.noncharacterInInputStream)}retreat(e){for(this.pos-=e;this.pos<this.lastGapPos;)this.lastGapPos=this.gapStack.pop(),this.pos--;this.isEol=!1}},B;(function(e){e[e.CHARACTER=0]=`CHARACTER`,e[e.NULL_CHARACTER=1]=`NULL_CHARACTER`,e[e.WHITESPACE_CHARACTER=2]=`WHITESPACE_CHARACTER`,e[e.START_TAG=3]=`START_TAG`,e[e.END_TAG=4]=`END_TAG`,e[e.COMMENT=5]=`COMMENT`,e[e.DOCTYPE=6]=`DOCTYPE`,e[e.EOF=7]=`EOF`,e[e.HIBERNATION=8]=`HIBERNATION`})(B||={});function Bl(e,t){for(let n=e.attrs.length-1;n>=0;n--)if(e.attrs[n].name===t)return e.attrs[n].value;return null}var Vl=new Uint16Array(`ᵁ<Õıʊҝջאٵ۞ޢߖࠏ੊ઑඡ๭༉༦჊ረዡᐕᒝᓃᓟᔥ\0\0\0\0\0\0ᕫᛍᦍᰒᷝ὾⁠↰⊍⏀⏻⑂⠤⤒ⴈ⹈⿎〖㊺㘹㞬㣾㨨㩱㫠㬮ࠀEMabcfglmnoprstu\\bfms¦³¹ÈÏlig耻Æ䃆P耻&䀦cute耻Á䃁reve;䄂Āiyx}rc耻Â䃂;䐐r;쀀𝔄rave耻À䃀pha;䎑acr;䄀d;橓Āgp¡on;䄄f;쀀𝔸plyFunction;恡ing耻Å䃅Ācs¾Ãr;쀀𝒜ign;扔ilde耻Ã䃃ml耻Ä䃄ЀaceforsuåûþėĜĢħĪĀcrêòkslash;或Ŷöø;櫧ed;挆y;䐑ƀcrtąċĔause;戵noullis;愬a;䎒r;쀀𝔅pf;쀀𝔹eve;䋘còēmpeq;扎܀HOacdefhilorsuōőŖƀƞƢƵƷƺǜȕɳɸɾcy;䐧PY耻©䂩ƀcpyŝŢźute;䄆Ā;iŧŨ拒talDifferentialD;慅leys;愭ȀaeioƉƎƔƘron;䄌dil耻Ç䃇rc;䄈nint;戰ot;䄊ĀdnƧƭilla;䂸terDot;䂷òſi;䎧rcleȀDMPTǇǋǑǖot;抙inus;抖lus;投imes;抗oĀcsǢǸkwiseContourIntegral;戲eCurlyĀDQȃȏoubleQuote;思uote;怙ȀlnpuȞȨɇɕonĀ;eȥȦ户;橴ƀgitȯȶȺruent;扡nt;戯ourIntegral;戮ĀfrɌɎ;愂oduct;成nterClockwiseContourIntegral;戳oss;樯cr;쀀𝒞pĀ;Cʄʅ拓ap;才րDJSZacefiosʠʬʰʴʸˋ˗ˡ˦̳ҍĀ;oŹʥtrahd;椑cy;䐂cy;䐅cy;䐏ƀgrsʿ˄ˇger;怡r;憡hv;櫤Āayː˕ron;䄎;䐔lĀ;t˝˞戇a;䎔r;쀀𝔇Āaf˫̧Ācm˰̢riticalȀADGT̖̜̀̆cute;䂴oŴ̋̍;䋙bleAcute;䋝rave;䁠ilde;䋜ond;拄ferentialD;慆Ѱ̽\0\0\0͔͂\0Ѕf;쀀𝔻ƀ;DE͈͉͍䂨ot;惜qual;扐blèCDLRUVͣͲ΂ϏϢϸontourIntegraìȹoɴ͹\0\0ͻ»͉nArrow;懓Āeo·ΤftƀARTΐΖΡrrow;懐ightArrow;懔eåˊngĀLRΫτeftĀARγιrrow;柸ightArrow;柺ightArrow;柹ightĀATϘϞrrow;懒ee;抨pɁϩ\0\0ϯrrow;懑ownArrow;懕erticalBar;戥ǹABLRTaВЪаўѿͼrrowƀ;BUНОТ憓ar;椓pArrow;懵reve;䌑eft˒к\0ц\0ѐightVector;楐eeVector;楞ectorĀ;Bљњ憽ar;楖ightǔѧ\0ѱeeVector;楟ectorĀ;BѺѻ懁ar;楗eeĀ;A҆҇护rrow;憧ĀctҒҗr;쀀𝒟rok;䄐ࠀNTacdfglmopqstuxҽӀӄӋӞӢӧӮӵԡԯԶՒ՝ՠեG;䅊H耻Ð䃐cute耻É䃉ƀaiyӒӗӜron;䄚rc耻Ê䃊;䐭ot;䄖r;쀀𝔈rave耻È䃈ement;戈ĀapӺӾcr;䄒tyɓԆ\0\0ԒmallSquare;旻erySmallSquare;斫ĀgpԦԪon;䄘f;쀀𝔼silon;䎕uĀaiԼՉlĀ;TՂՃ橵ilde;扂librium;懌Āci՗՚r;愰m;橳a;䎗ml耻Ë䃋Āipժկsts;戃onentialE;慇ʀcfiosօֈ֍ֲ׌y;䐤r;쀀𝔉lledɓ֗\0\0֣mallSquare;旼erySmallSquare;斪Ͱֺ\0ֿ\0\0ׄf;쀀𝔽All;戀riertrf;愱cò׋؀JTabcdfgorstר׬ׯ׺؀ؒؖ؛؝أ٬ٲcy;䐃耻>䀾mmaĀ;d׷׸䎓;䏜reve;䄞ƀeiy؇،ؐdil;䄢rc;䄜;䐓ot;䄠r;쀀𝔊;拙pf;쀀𝔾eater̀EFGLSTصلَٖٛ٦qualĀ;Lؾؿ扥ess;招ullEqual;执reater;檢ess;扷lantEqual;橾ilde;扳cr;쀀𝒢;扫ЀAacfiosuڅڋږڛڞڪھۊRDcy;䐪Āctڐڔek;䋇;䁞irc;䄤r;愌lbertSpace;愋ǰگ\0ڲf;愍izontalLine;攀Āctۃۅòکrok;䄦mpńېۘownHumðįqual;扏܀EJOacdfgmnostuۺ۾܃܇܎ܚܞܡܨ݄ݸދޏޕcy;䐕lig;䄲cy;䐁cute耻Í䃍Āiyܓܘrc耻Î䃎;䐘ot;䄰r;愑rave耻Ì䃌ƀ;apܠܯܿĀcgܴܷr;䄪inaryI;慈lieóϝǴ݉\0ݢĀ;eݍݎ戬Āgrݓݘral;戫section;拂isibleĀCTݬݲomma;恣imes;恢ƀgptݿރވon;䄮f;쀀𝕀a;䎙cr;愐ilde;䄨ǫޚ\0ޞcy;䐆l耻Ï䃏ʀcfosuެ޷޼߂ߐĀiyޱ޵rc;䄴;䐙r;쀀𝔍pf;쀀𝕁ǣ߇\0ߌr;쀀𝒥rcy;䐈kcy;䐄΀HJacfosߤߨ߽߬߱ࠂࠈcy;䐥cy;䐌ppa;䎚Āey߶߻dil;䄶;䐚r;쀀𝔎pf;쀀𝕂cr;쀀𝒦րJTaceflmostࠥࠩࠬࡐࡣ঳সে্਷ੇcy;䐉耻<䀼ʀcmnpr࠷࠼ࡁࡄࡍute;䄹bda;䎛g;柪lacetrf;愒r;憞ƀaeyࡗ࡜ࡡron;䄽dil;䄻;䐛Āfsࡨ॰tԀACDFRTUVarࡾࢩࢱࣦ࣠ࣼयज़ΐ४Ānrࢃ࢏gleBracket;柨rowƀ;BR࢙࢚࢞憐ar;懤ightArrow;懆eiling;挈oǵࢷ\0ࣃbleBracket;柦nǔࣈ\0࣒eeVector;楡ectorĀ;Bࣛࣜ懃ar;楙loor;挊ightĀAV࣯ࣵrrow;憔ector;楎Āerँगeƀ;AVउऊऐ抣rrow;憤ector;楚iangleƀ;BEतथऩ抲ar;槏qual;抴pƀDTVषूौownVector;楑eeVector;楠ectorĀ;Bॖॗ憿ar;楘ectorĀ;B॥०憼ar;楒ightáΜs̀EFGLSTॾঋকঝঢভqualGreater;拚ullEqual;扦reater;扶ess;檡lantEqual;橽ilde;扲r;쀀𝔏Ā;eঽা拘ftarrow;懚idot;䄿ƀnpw৔ਖਛgȀLRlr৞৷ਂਐeftĀAR০৬rrow;柵ightArrow;柷ightArrow;柶eftĀarγਊightáοightáϊf;쀀𝕃erĀLRਢਬeftArrow;憙ightArrow;憘ƀchtਾੀੂòࡌ;憰rok;䅁;扪Ѐacefiosuਗ਼੝੠੷੼અઋ઎p;椅y;䐜Ādl੥੯iumSpace;恟lintrf;愳r;쀀𝔐nusPlus;戓pf;쀀𝕄cò੶;䎜ҀJacefostuણધભીଔଙඑ඗ඞcy;䐊cute;䅃ƀaey઴હાron;䅇dil;䅅;䐝ƀgswે૰଎ativeƀMTV૓૟૨ediumSpace;怋hiĀcn૦૘ë૙eryThiî૙tedĀGL૸ଆreaterGreateòٳessLesóੈLine;䀊r;쀀𝔑ȀBnptଢନଷ଺reak;恠BreakingSpace;䂠f;愕ڀ;CDEGHLNPRSTV୕ୖ୪୼஡௫ఄ౞಄ದ೘ൡඅ櫬Āou୛୤ngruent;扢pCap;扭oubleVerticalBar;戦ƀlqxஃஊ஛ement;戉ualĀ;Tஒஓ扠ilde;쀀≂̸ists;戄reater΀;EFGLSTஶஷ஽௉௓௘௥扯qual;扱ullEqual;쀀≧̸reater;쀀≫̸ess;批lantEqual;쀀⩾̸ilde;扵umpń௲௽ownHump;쀀≎̸qual;쀀≏̸eĀfsఊధtTriangleƀ;BEచఛడ拪ar;쀀⧏̸qual;括s̀;EGLSTవశ఼ౄోౘ扮qual;扰reater;扸ess;쀀≪̸lantEqual;쀀⩽̸ilde;扴estedĀGL౨౹reaterGreater;쀀⪢̸essLess;쀀⪡̸recedesƀ;ESಒಓಛ技qual;쀀⪯̸lantEqual;拠ĀeiಫಹverseElement;戌ghtTriangleƀ;BEೋೌ೒拫ar;쀀⧐̸qual;拭ĀquೝഌuareSuĀbp೨೹setĀ;E೰ೳ쀀⊏̸qual;拢ersetĀ;Eഃആ쀀⊐̸qual;拣ƀbcpഓതൎsetĀ;Eഛഞ쀀⊂⃒qual;抈ceedsȀ;ESTലള഻െ抁qual;쀀⪰̸lantEqual;拡ilde;쀀≿̸ersetĀ;E൘൛쀀⊃⃒qual;抉ildeȀ;EFT൮൯൵ൿ扁qual;扄ullEqual;扇ilde;扉erticalBar;戤cr;쀀𝒩ilde耻Ñ䃑;䎝܀Eacdfgmoprstuvලෂ෉෕ෛ෠෧෼ขภยา฿ไlig;䅒cute耻Ó䃓Āiy෎ීrc耻Ô䃔;䐞blac;䅐r;쀀𝔒rave耻Ò䃒ƀaei෮ෲ෶cr;䅌ga;䎩cron;䎟pf;쀀𝕆enCurlyĀDQฎบoubleQuote;怜uote;怘;橔Āclวฬr;쀀𝒪ash耻Ø䃘iŬื฼de耻Õ䃕es;樷ml耻Ö䃖erĀBP๋๠Āar๐๓r;怾acĀek๚๜;揞et;掴arenthesis;揜Ҁacfhilors๿ງຊຏຒດຝະ໼rtialD;戂y;䐟r;쀀𝔓i;䎦;䎠usMinus;䂱Āipຢອncareplanåڝf;愙Ȁ;eio຺ູ໠໤檻cedesȀ;EST່້໏໚扺qual;檯lantEqual;扼ilde;找me;怳Ādp໩໮uct;戏ortionĀ;aȥ໹l;戝Āci༁༆r;쀀𝒫;䎨ȀUfos༑༖༛༟OT耻"䀢r;쀀𝔔pf;愚cr;쀀𝒬؀BEacefhiorsu༾གྷཇའཱིྦྷྪྭ႖ႩႴႾarr;椐G耻®䂮ƀcnrཎནབute;䅔g;柫rĀ;tཛྷཝ憠l;椖ƀaeyཧཬཱron;䅘dil;䅖;䐠Ā;vླྀཹ愜erseĀEUྂྙĀlq྇ྎement;戋uilibrium;懋pEquilibrium;楯r»ཹo;䎡ghtЀACDFTUVa࿁࿫࿳ဢဨၛႇϘĀnr࿆࿒gleBracket;柩rowƀ;BL࿜࿝࿡憒ar;懥eftArrow;懄eiling;按oǵ࿹\0စbleBracket;柧nǔည\0နeeVector;楝ectorĀ;Bဝသ懂ar;楕loor;挋Āerိ၃eƀ;AVဵံြ抢rrow;憦ector;楛iangleƀ;BEၐၑၕ抳ar;槐qual;抵pƀDTVၣၮၸownVector;楏eeVector;楜ectorĀ;Bႂႃ憾ar;楔ectorĀ;B႑႒懀ar;楓Āpuႛ႞f;愝ndImplies;楰ightarrow;懛ĀchႹႼr;愛;憱leDelayed;槴ڀHOacfhimoqstuფჱჷჽᄙᄞᅑᅖᅡᅧᆵᆻᆿĀCcჩხHcy;䐩y;䐨FTcy;䐬cute;䅚ʀ;aeiyᄈᄉᄎᄓᄗ檼ron;䅠dil;䅞rc;䅜;䐡r;쀀𝔖ortȀDLRUᄪᄴᄾᅉownArrow»ОeftArrow»࢚ightArrow»࿝pArrow;憑gma;䎣allCircle;战pf;쀀𝕊ɲᅭ\0\0ᅰt;戚areȀ;ISUᅻᅼᆉᆯ斡ntersection;抓uĀbpᆏᆞsetĀ;Eᆗᆘ抏qual;抑ersetĀ;Eᆨᆩ抐qual;抒nion;抔cr;쀀𝒮ar;拆ȀbcmpᇈᇛሉላĀ;sᇍᇎ拐etĀ;Eᇍᇕqual;抆ĀchᇠህeedsȀ;ESTᇭᇮᇴᇿ扻qual;檰lantEqual;扽ilde;承Tháྌ;我ƀ;esሒሓሣ拑rsetĀ;Eሜም抃qual;抇et»ሓրHRSacfhiorsሾቄ቉ቕ቞ቱቶኟዂወዑORN耻Þ䃞ADE;愢ĀHc቎ቒcy;䐋y;䐦Ābuቚቜ;䀉;䎤ƀaeyብቪቯron;䅤dil;䅢;䐢r;쀀𝔗Āeiቻ኉ǲኀ\0ኇefore;戴a;䎘Ācn኎ኘkSpace;쀀  Space;怉ldeȀ;EFTካኬኲኼ戼qual;扃ullEqual;扅ilde;扈pf;쀀𝕋ipleDot;惛Āctዖዛr;쀀𝒯rok;䅦ૡዷጎጚጦ\0ጬጱ\0\0\0\0\0ጸጽ፷ᎅ\0᏿ᐄᐊᐐĀcrዻጁute耻Ú䃚rĀ;oጇገ憟cir;楉rǣጓ\0጖y;䐎ve;䅬Āiyጞጣrc耻Û䃛;䐣blac;䅰r;쀀𝔘rave耻Ù䃙acr;䅪Ādiፁ፩erĀBPፈ፝Āarፍፐr;䁟acĀekፗፙ;揟et;掵arenthesis;揝onĀ;P፰፱拃lus;抎Āgp፻፿on;䅲f;쀀𝕌ЀADETadps᎕ᎮᎸᏄϨᏒᏗᏳrrowƀ;BDᅐᎠᎤar;椒ownArrow;懅ownArrow;憕quilibrium;楮eeĀ;AᏋᏌ报rrow;憥ownáϳerĀLRᏞᏨeftArrow;憖ightArrow;憗iĀ;lᏹᏺ䏒on;䎥ing;䅮cr;쀀𝒰ilde;䅨ml耻Ü䃜ҀDbcdefosvᐧᐬᐰᐳᐾᒅᒊᒐᒖash;披ar;櫫y;䐒ashĀ;lᐻᐼ抩;櫦Āerᑃᑅ;拁ƀbtyᑌᑐᑺar;怖Ā;iᑏᑕcalȀBLSTᑡᑥᑪᑴar;戣ine;䁼eparator;杘ilde;所ThinSpace;怊r;쀀𝔙pf;쀀𝕍cr;쀀𝒱dash;抪ʀcefosᒧᒬᒱᒶᒼirc;䅴dge;拀r;쀀𝔚pf;쀀𝕎cr;쀀𝒲Ȁfiosᓋᓐᓒᓘr;쀀𝔛;䎞pf;쀀𝕏cr;쀀𝒳ҀAIUacfosuᓱᓵᓹᓽᔄᔏᔔᔚᔠcy;䐯cy;䐇cy;䐮cute耻Ý䃝Āiyᔉᔍrc;䅶;䐫r;쀀𝔜pf;쀀𝕐cr;쀀𝒴ml;䅸ЀHacdefosᔵᔹᔿᕋᕏᕝᕠᕤcy;䐖cute;䅹Āayᕄᕉron;䅽;䐗ot;䅻ǲᕔ\0ᕛoWidtè૙a;䎖r;愨pf;愤cr;쀀𝒵௡ᖃᖊᖐ\0ᖰᖶᖿ\0\0\0\0ᗆᗛᗫᙟ᙭\0ᚕ᚛ᚲᚹ\0ᚾcute耻á䃡reve;䄃̀;Ediuyᖜᖝᖡᖣᖨᖭ戾;쀀∾̳;房rc耻â䃢te肻´̆;䐰lig耻æ䃦Ā;r²ᖺ;쀀𝔞rave耻à䃠ĀepᗊᗖĀfpᗏᗔsym;愵èᗓha;䎱ĀapᗟcĀclᗤᗧr;䄁g;樿ɤᗰ\0\0ᘊʀ;adsvᗺᗻᗿᘁᘇ戧nd;橕;橜lope;橘;橚΀;elmrszᘘᘙᘛᘞᘿᙏᙙ戠;榤e»ᘙsdĀ;aᘥᘦ戡ѡᘰᘲᘴᘶᘸᘺᘼᘾ;榨;榩;榪;榫;榬;榭;榮;榯tĀ;vᙅᙆ戟bĀ;dᙌᙍ抾;榝Āptᙔᙗh;戢»¹arr;捼Āgpᙣᙧon;䄅f;쀀𝕒΀;Eaeiop዁ᙻᙽᚂᚄᚇᚊ;橰cir;橯;扊d;手s;䀧roxĀ;e዁ᚒñᚃing耻å䃥ƀctyᚡᚦᚨr;쀀𝒶;䀪mpĀ;e዁ᚯñʈilde耻ã䃣ml耻ä䃤Āciᛂᛈoninôɲnt;樑ࠀNabcdefiklnoprsu᛭ᛱᜰ᜼ᝃᝈ᝸᝽០៦ᠹᡐᜍ᤽᥈ᥰot;櫭Ācrᛶ᜞kȀcepsᜀᜅᜍᜓong;扌psilon;䏶rime;怵imĀ;e᜚᜛戽q;拍Ŷᜢᜦee;抽edĀ;gᜬᜭ挅e»ᜭrkĀ;t፜᜷brk;掶Āoyᜁᝁ;䐱quo;怞ʀcmprtᝓ᝛ᝡᝤᝨausĀ;eĊĉptyv;榰séᜌnoõēƀahwᝯ᝱ᝳ;䎲;愶een;扬r;쀀𝔟g΀costuvwឍឝឳេ៕៛៞ƀaiuបពរðݠrc;旯p»፱ƀdptឤឨឭot;樀lus;樁imes;樂ɱឹ\0\0ើcup;樆ar;昅riangleĀdu៍្own;施p;斳plus;樄eåᑄåᒭarow;植ƀako៭ᠦᠵĀcn៲ᠣkƀlst៺֫᠂ozenge;槫riangleȀ;dlr᠒᠓᠘᠝斴own;斾eft;旂ight;斸k;搣Ʊᠫ\0ᠳƲᠯ\0ᠱ;斒;斑4;斓ck;斈ĀeoᠾᡍĀ;qᡃᡆ쀀=⃥uiv;쀀≡⃥t;挐Ȁptwxᡙᡞᡧᡬf;쀀𝕓Ā;tᏋᡣom»Ꮜtie;拈؀DHUVbdhmptuvᢅᢖᢪᢻᣗᣛᣬ᣿ᤅᤊᤐᤡȀLRlrᢎᢐᢒᢔ;敗;敔;敖;敓ʀ;DUduᢡᢢᢤᢦᢨ敐;敦;敩;敤;敧ȀLRlrᢳᢵᢷᢹ;敝;敚;敜;教΀;HLRhlrᣊᣋᣍᣏᣑᣓᣕ救;敬;散;敠;敫;敢;敟ox;槉ȀLRlrᣤᣦᣨᣪ;敕;敒;攐;攌ʀ;DUduڽ᣷᣹᣻᣽;敥;敨;攬;攴inus;抟lus;択imes;抠ȀLRlrᤙᤛᤝ᤟;敛;敘;攘;攔΀;HLRhlrᤰᤱᤳᤵᤷ᤻᤹攂;敪;敡;敞;攼;攤;攜Āevģ᥂bar耻¦䂦Ȁceioᥑᥖᥚᥠr;쀀𝒷mi;恏mĀ;e᜚᜜lƀ;bhᥨᥩᥫ䁜;槅sub;柈Ŭᥴ᥾lĀ;e᥹᥺怢t»᥺pƀ;Eeįᦅᦇ;檮Ā;qۜۛೡᦧ\0᧨ᨑᨕᨲ\0ᨷᩐ\0\0᪴\0\0᫁\0\0ᬡᬮ᭍᭒\0᯽\0ᰌƀcpr᦭ᦲ᧝ute;䄇̀;abcdsᦿᧀᧄ᧊᧕᧙戩nd;橄rcup;橉Āau᧏᧒p;橋p;橇ot;橀;쀀∩︀Āeo᧢᧥t;恁îړȀaeiu᧰᧻ᨁᨅǰ᧵\0᧸s;橍on;䄍dil耻ç䃧rc;䄉psĀ;sᨌᨍ橌m;橐ot;䄋ƀdmnᨛᨠᨦil肻¸ƭptyv;榲t脀¢;eᨭᨮ䂢räƲr;쀀𝔠ƀceiᨽᩀᩍy;䑇ckĀ;mᩇᩈ朓ark»ᩈ;䏇r΀;Ecefms᩟᩠ᩢᩫ᪤᪪᪮旋;槃ƀ;elᩩᩪᩭ䋆q;扗eɡᩴ\0\0᪈rrowĀlr᩼᪁eft;憺ight;憻ʀRSacd᪒᪔᪖᪚᪟»ཇ;擈st;抛irc;抚ash;抝nint;樐id;櫯cir;槂ubsĀ;u᪻᪼晣it»᪼ˬ᫇᫔᫺\0ᬊonĀ;eᫍᫎ䀺Ā;qÇÆɭ᫙\0\0᫢aĀ;t᫞᫟䀬;䁀ƀ;fl᫨᫩᫫戁îᅠeĀmx᫱᫶ent»᫩eóɍǧ᫾\0ᬇĀ;dኻᬂot;橭nôɆƀfryᬐᬔᬗ;쀀𝕔oäɔ脀©;sŕᬝr;愗Āaoᬥᬩrr;憵ss;朗Ācuᬲᬷr;쀀𝒸Ābpᬼ᭄Ā;eᭁᭂ櫏;櫑Ā;eᭉᭊ櫐;櫒dot;拯΀delprvw᭠᭬᭷ᮂᮬᯔ᯹arrĀlr᭨᭪;椸;椵ɰ᭲\0\0᭵r;拞c;拟arrĀ;p᭿ᮀ憶;椽̀;bcdosᮏᮐᮖᮡᮥᮨ截rcap;橈Āauᮛᮞp;橆p;橊ot;抍r;橅;쀀∪︀Ȁalrv᮵ᮿᯞᯣrrĀ;mᮼᮽ憷;椼yƀevwᯇᯔᯘqɰᯎ\0\0ᯒreã᭳uã᭵ee;拎edge;拏en耻¤䂤earrowĀlrᯮ᯳eft»ᮀight»ᮽeäᯝĀciᰁᰇoninôǷnt;戱lcty;挭ঀAHabcdefhijlorstuwz᰸᰻᰿ᱝᱩᱵᲊᲞᲬᲷ᳻᳿ᴍᵻᶑᶫᶻ᷆᷍rò΁ar;楥Ȁglrs᱈ᱍ᱒᱔ger;怠eth;愸òᄳhĀ;vᱚᱛ怐»ऊūᱡᱧarow;椏aã̕Āayᱮᱳron;䄏;䐴ƀ;ao̲ᱼᲄĀgrʿᲁr;懊tseq;橷ƀglmᲑᲔᲘ耻°䂰ta;䎴ptyv;榱ĀirᲣᲨsht;楿;쀀𝔡arĀlrᲳᲵ»ࣜ»သʀaegsv᳂͸᳖᳜᳠mƀ;oș᳊᳔ndĀ;ș᳑uit;晦amma;䏝in;拲ƀ;io᳧᳨᳸䃷de脀÷;o᳧ᳰntimes;拇nø᳷cy;䑒cɯᴆ\0\0ᴊrn;挞op;挍ʀlptuwᴘᴝᴢᵉᵕlar;䀤f;쀀𝕕ʀ;emps̋ᴭᴷᴽᵂqĀ;d͒ᴳot;扑inus;戸lus;戔quare;抡blebarwedgåúnƀadhᄮᵝᵧownarrowóᲃarpoonĀlrᵲᵶefôᲴighôᲶŢᵿᶅkaro÷གɯᶊ\0\0ᶎrn;挟op;挌ƀcotᶘᶣᶦĀryᶝᶡ;쀀𝒹;䑕l;槶rok;䄑Ādrᶰᶴot;拱iĀ;fᶺ᠖斿Āah᷀᷃ròЩaòྦangle;榦Āci᷒ᷕy;䑟grarr;柿ऀDacdefglmnopqrstuxḁḉḙḸոḼṉṡṾấắẽỡἪἷὄ὎὚ĀDoḆᴴoôᲉĀcsḎḔute耻é䃩ter;橮ȀaioyḢḧḱḶron;䄛rĀ;cḭḮ扖耻ê䃪lon;払;䑍ot;䄗ĀDrṁṅot;扒;쀀𝔢ƀ;rsṐṑṗ檚ave耻è䃨Ā;dṜṝ檖ot;檘Ȁ;ilsṪṫṲṴ檙nters;揧;愓Ā;dṹṺ檕ot;檗ƀapsẅẉẗcr;䄓tyƀ;svẒẓẕ戅et»ẓpĀ1;ẝẤĳạả;怄;怅怃ĀgsẪẬ;䅋p;怂ĀgpẴẸon;䄙f;쀀𝕖ƀalsỄỎỒrĀ;sỊị拕l;槣us;橱iƀ;lvỚớở䎵on»ớ;䏵ȀcsuvỪỳἋἣĀioữḱrc»Ḯɩỹ\0\0ỻíՈantĀglἂἆtr»ṝess»Ṻƀaeiἒ἖Ἒls;䀽st;扟vĀ;DȵἠD;橸parsl;槥ĀDaἯἳot;打rr;楱ƀcdiἾὁỸr;愯oô͒ĀahὉὋ;䎷耻ð䃰Āmrὓὗl耻ë䃫o;悬ƀcipὡὤὧl;䀡sôծĀeoὬὴctatioîՙnentialåչৡᾒ\0ᾞ\0ᾡᾧ\0\0ῆῌ\0ΐ\0ῦῪ \0 ⁚llingdotseñṄy;䑄male;晀ƀilrᾭᾳ῁lig;耀ﬃɩᾹ\0\0᾽g;耀ﬀig;耀ﬄ;쀀𝔣lig;耀ﬁlig;쀀fjƀaltῙ῜ῡt;晭ig;耀ﬂns;斱of;䆒ǰ΅\0ῳf;쀀𝕗ĀakֿῷĀ;vῼ´拔;櫙artint;樍Āao‌⁕Ācs‑⁒α‚‰‸⁅⁈\0⁐β•‥‧‪‬\0‮耻½䂽;慓耻¼䂼;慕;慙;慛Ƴ‴\0‶;慔;慖ʴ‾⁁\0\0⁃耻¾䂾;慗;慜5;慘ƶ⁌\0⁎;慚;慝8;慞l;恄wn;挢cr;쀀𝒻ࢀEabcdefgijlnorstv₂₉₟₥₰₴⃰⃵⃺⃿℃ℒℸ̗ℾ⅒↞Ā;lٍ₇;檌ƀcmpₐₕ₝ute;䇵maĀ;dₜ᳚䎳;檆reve;䄟Āiy₪₮rc;䄝;䐳ot;䄡Ȁ;lqsؾق₽⃉ƀ;qsؾٌ⃄lanô٥Ȁ;cdl٥⃒⃥⃕c;檩otĀ;o⃜⃝檀Ā;l⃢⃣檂;檄Ā;e⃪⃭쀀⋛︀s;檔r;쀀𝔤Ā;gٳ؛mel;愷cy;䑓Ȁ;Eajٚℌℎℐ;檒;檥;檤ȀEaesℛℝ℩ℴ;扩pĀ;p℣ℤ檊rox»ℤĀ;q℮ℯ檈Ā;q℮ℛim;拧pf;쀀𝕘Āci⅃ⅆr;愊mƀ;el٫ⅎ⅐;檎;檐茀>;cdlqr׮ⅠⅪⅮⅳⅹĀciⅥⅧ;檧r;橺ot;拗Par;榕uest;橼ʀadelsↄⅪ←ٖ↛ǰ↉\0↎proø₞r;楸qĀlqؿ↖lesó₈ií٫Āen↣↭rtneqq;쀀≩︀Å↪ԀAabcefkosy⇄⇇⇱⇵⇺∘∝∯≨≽ròΠȀilmr⇐⇔⇗⇛rsðᒄf»․ilôکĀdr⇠⇤cy;䑊ƀ;cwࣴ⇫⇯ir;楈;憭ar;意irc;䄥ƀalr∁∎∓rtsĀ;u∉∊晥it»∊lip;怦con;抹r;쀀𝔥sĀew∣∩arow;椥arow;椦ʀamopr∺∾≃≞≣rr;懿tht;戻kĀlr≉≓eftarrow;憩ightarrow;憪f;쀀𝕙bar;怕ƀclt≯≴≸r;쀀𝒽asè⇴rok;䄧Ābp⊂⊇ull;恃hen»ᱛૡ⊣\0⊪\0⊸⋅⋎\0⋕⋳\0\0⋸⌢⍧⍢⍿\0⎆⎪⎴cute耻í䃭ƀ;iyݱ⊰⊵rc耻î䃮;䐸Ācx⊼⊿y;䐵cl耻¡䂡ĀfrΟ⋉;쀀𝔦rave耻ì䃬Ȁ;inoܾ⋝⋩⋮Āin⋢⋦nt;樌t;戭fin;槜ta;愩lig;䄳ƀaop⋾⌚⌝ƀcgt⌅⌈⌗r;䄫ƀelpܟ⌏⌓inåގarôܠh;䄱f;抷ed;䆵ʀ;cfotӴ⌬⌱⌽⍁are;愅inĀ;t⌸⌹戞ie;槝doô⌙ʀ;celpݗ⍌⍐⍛⍡al;抺Āgr⍕⍙eróᕣã⍍arhk;樗rod;樼Ȁcgpt⍯⍲⍶⍻y;䑑on;䄯f;쀀𝕚a;䎹uest耻¿䂿Āci⎊⎏r;쀀𝒾nʀ;EdsvӴ⎛⎝⎡ӳ;拹ot;拵Ā;v⎦⎧拴;拳Ā;iݷ⎮lde;䄩ǫ⎸\0⎼cy;䑖l耻ï䃯̀cfmosu⏌⏗⏜⏡⏧⏵Āiy⏑⏕rc;䄵;䐹r;쀀𝔧ath;䈷pf;쀀𝕛ǣ⏬\0⏱r;쀀𝒿rcy;䑘kcy;䑔Ѐacfghjos␋␖␢␧␭␱␵␻ppaĀ;v␓␔䎺;䏰Āey␛␠dil;䄷;䐺r;쀀𝔨reen;䄸cy;䑅cy;䑜pf;쀀𝕜cr;쀀𝓀஀ABEHabcdefghjlmnoprstuv⑰⒁⒆⒍⒑┎┽╚▀♎♞♥♹♽⚚⚲⛘❝❨➋⟀⠁⠒ƀart⑷⑺⑼rò৆òΕail;椛arr;椎Ā;gঔ⒋;檋ar;楢ॣ⒥\0⒪\0⒱\0\0\0\0\0⒵Ⓔ\0ⓆⓈⓍ\0⓹ute;䄺mptyv;榴raîࡌbda;䎻gƀ;dlࢎⓁⓃ;榑åࢎ;檅uo耻«䂫rЀ;bfhlpst࢙ⓞⓦⓩ⓫⓮⓱⓵Ā;f࢝ⓣs;椟s;椝ë≒p;憫l;椹im;楳l;憢ƀ;ae⓿─┄檫il;椙Ā;s┉┊檭;쀀⪭︀ƀabr┕┙┝rr;椌rk;杲Āak┢┬cĀek┨┪;䁻;䁛Āes┱┳;榋lĀdu┹┻;榏;榍Ȁaeuy╆╋╖╘ron;䄾Ādi═╔il;䄼ìࢰâ┩;䐻Ȁcqrs╣╦╭╽a;椶uoĀ;rนᝆĀdu╲╷har;楧shar;楋h;憲ʀ;fgqs▋▌উ◳◿扤tʀahlrt▘▤▷◂◨rrowĀ;t࢙□aé⓶arpoonĀdu▯▴own»њp»०eftarrows;懇ightƀahs◍◖◞rrowĀ;sࣴࢧarpoonó྘quigarro÷⇰hreetimes;拋ƀ;qs▋ও◺lanôবʀ;cdgsব☊☍☝☨c;檨otĀ;o☔☕橿Ā;r☚☛檁;檃Ā;e☢☥쀀⋚︀s;檓ʀadegs☳☹☽♉♋pproøⓆot;拖qĀgq♃♅ôউgtò⒌ôছiíলƀilr♕࣡♚sht;楼;쀀𝔩Ā;Eজ♣;檑š♩♶rĀdu▲♮Ā;l॥♳;楪lk;斄cy;䑙ʀ;achtੈ⚈⚋⚑⚖rò◁orneòᴈard;楫ri;旺Āio⚟⚤dot;䅀ustĀ;a⚬⚭掰che»⚭ȀEaes⚻⚽⛉⛔;扨pĀ;p⛃⛄檉rox»⛄Ā;q⛎⛏檇Ā;q⛎⚻im;拦Ѐabnoptwz⛩⛴⛷✚✯❁❇❐Ānr⛮⛱g;柬r;懽rëࣁgƀlmr⛿✍✔eftĀar০✇ightá৲apsto;柼ightá৽parrowĀlr✥✩efô⓭ight;憬ƀafl✶✹✽r;榅;쀀𝕝us;樭imes;樴š❋❏st;戗áፎƀ;ef❗❘᠀旊nge»❘arĀ;l❤❥䀨t;榓ʀachmt❳❶❼➅➇ròࢨorneòᶌarĀ;d྘➃;業;怎ri;抿̀achiqt➘➝ੀ➢➮➻quo;怹r;쀀𝓁mƀ;egল➪➬;檍;檏Ābu┪➳oĀ;rฟ➹;怚rok;䅂萀<;cdhilqrࠫ⟒☹⟜⟠⟥⟪⟰Āci⟗⟙;檦r;橹reå◲mes;拉arr;楶uest;橻ĀPi⟵⟹ar;榖ƀ;ef⠀भ᠛旃rĀdu⠇⠍shar;楊har;楦Āen⠗⠡rtneqq;쀀≨︀Å⠞܀Dacdefhilnopsu⡀⡅⢂⢎⢓⢠⢥⢨⣚⣢⣤ઃ⣳⤂Dot;戺Ȁclpr⡎⡒⡣⡽r耻¯䂯Āet⡗⡙;時Ā;e⡞⡟朠se»⡟Ā;sျ⡨toȀ;dluျ⡳⡷⡻owîҌefôएðᏑker;斮Āoy⢇⢌mma;権;䐼ash;怔asuredangle»ᘦr;쀀𝔪o;愧ƀcdn⢯⢴⣉ro耻µ䂵Ȁ;acdᑤ⢽⣀⣄sôᚧir;櫰ot肻·Ƶusƀ;bd⣒ᤃ⣓戒Ā;uᴼ⣘;横ţ⣞⣡p;櫛ò−ðઁĀdp⣩⣮els;抧f;쀀𝕞Āct⣸⣽r;쀀𝓂pos»ᖝƀ;lm⤉⤊⤍䎼timap;抸ఀGLRVabcdefghijlmoprstuvw⥂⥓⥾⦉⦘⧚⧩⨕⨚⩘⩝⪃⪕⪤⪨⬄⬇⭄⭿⮮ⰴⱧⱼ⳩Āgt⥇⥋;쀀⋙̸Ā;v⥐௏쀀≫⃒ƀelt⥚⥲⥶ftĀar⥡⥧rrow;懍ightarrow;懎;쀀⋘̸Ā;v⥻ే쀀≪⃒ightarrow;懏ĀDd⦎⦓ash;抯ash;抮ʀbcnpt⦣⦧⦬⦱⧌la»˞ute;䅄g;쀀∠⃒ʀ;Eiop඄⦼⧀⧅⧈;쀀⩰̸d;쀀≋̸s;䅉roø඄urĀ;a⧓⧔普lĀ;s⧓ସǳ⧟\0⧣p肻\xA0ଷmpĀ;e௹ఀʀaeouy⧴⧾⨃⨐⨓ǰ⧹\0⧻;橃on;䅈dil;䅆ngĀ;dൾ⨊ot;쀀⩭̸p;橂;䐽ash;怓΀;Aadqsxஒ⨩⨭⨻⩁⩅⩐rr;懗rĀhr⨳⨶k;椤Ā;oᏲᏰot;쀀≐̸uiöୣĀei⩊⩎ar;椨í஘istĀ;s஠டr;쀀𝔫ȀEest௅⩦⩹⩼ƀ;qs஼⩭௡ƀ;qs஼௅⩴lanô௢ií௪Ā;rஶ⪁»ஷƀAap⪊⪍⪑rò⥱rr;憮ar;櫲ƀ;svྍ⪜ྌĀ;d⪡⪢拼;拺cy;䑚΀AEadest⪷⪺⪾⫂⫅⫶⫹rò⥦;쀀≦̸rr;憚r;急Ȁ;fqs఻⫎⫣⫯tĀar⫔⫙rro÷⫁ightarro÷⪐ƀ;qs఻⪺⫪lanôౕĀ;sౕ⫴»శiíౝĀ;rవ⫾iĀ;eచథiäඐĀpt⬌⬑f;쀀𝕟膀¬;in⬙⬚⬶䂬nȀ;Edvஉ⬤⬨⬮;쀀⋹̸ot;쀀⋵̸ǡஉ⬳⬵;拷;拶iĀ;vಸ⬼ǡಸ⭁⭃;拾;拽ƀaor⭋⭣⭩rȀ;ast୻⭕⭚⭟lleì୻l;쀀⫽⃥;쀀∂̸lint;樔ƀ;ceಒ⭰⭳uåಥĀ;cಘ⭸Ā;eಒ⭽ñಘȀAait⮈⮋⮝⮧rò⦈rrƀ;cw⮔⮕⮙憛;쀀⤳̸;쀀↝̸ghtarrow»⮕riĀ;eೋೖ΀chimpqu⮽⯍⯙⬄୸⯤⯯Ȁ;cerല⯆ഷ⯉uå൅;쀀𝓃ortɭ⬅\0\0⯖ará⭖mĀ;e൮⯟Ā;q൴൳suĀbp⯫⯭å೸åഋƀbcp⯶ⰑⰙȀ;Ees⯿ⰀഢⰄ抄;쀀⫅̸etĀ;eഛⰋqĀ;qണⰀcĀ;eലⰗñസȀ;EesⰢⰣൟⰧ抅;쀀⫆̸etĀ;e൘ⰮqĀ;qൠⰣȀgilrⰽⰿⱅⱇìௗlde耻ñ䃱çృiangleĀlrⱒⱜeftĀ;eచⱚñదightĀ;eೋⱥñ೗Ā;mⱬⱭ䎽ƀ;esⱴⱵⱹ䀣ro;愖p;怇ҀDHadgilrsⲏⲔⲙⲞⲣⲰⲶⳓⳣash;抭arr;椄p;쀀≍⃒ash;抬ĀetⲨⲬ;쀀≥⃒;쀀>⃒nfin;槞ƀAetⲽⳁⳅrr;椂;쀀≤⃒Ā;rⳊⳍ쀀<⃒ie;쀀⊴⃒ĀAtⳘⳜrr;椃rie;쀀⊵⃒im;쀀∼⃒ƀAan⳰⳴ⴂrr;懖rĀhr⳺⳽k;椣Ā;oᏧᏥear;椧ቓ᪕\0\0\0\0\0\0\0\0\0\0\0\0\0ⴭ\0ⴸⵈⵠⵥ⵲ⶄᬇ\0\0ⶍⶫ\0ⷈⷎ\0ⷜ⸙⸫⸾⹃Ācsⴱ᪗ute耻ó䃳ĀiyⴼⵅrĀ;c᪞ⵂ耻ô䃴;䐾ʀabios᪠ⵒⵗǈⵚlac;䅑v;樸old;榼lig;䅓Ācr⵩⵭ir;榿;쀀𝔬ͯ⵹\0\0⵼\0ⶂn;䋛ave耻ò䃲;槁Ābmⶈ෴ar;榵Ȁacitⶕ⶘ⶥⶨrò᪀Āir⶝ⶠr;榾oss;榻nå๒;槀ƀaeiⶱⶵⶹcr;䅍ga;䏉ƀcdnⷀⷅǍron;䎿;榶pf;쀀𝕠ƀaelⷔ⷗ǒr;榷rp;榹΀;adiosvⷪⷫⷮ⸈⸍⸐⸖戨rò᪆Ȁ;efmⷷⷸ⸂⸅橝rĀ;oⷾⷿ愴f»ⷿ耻ª䂪耻º䂺gof;抶r;橖lope;橗;橛ƀclo⸟⸡⸧ò⸁ash耻ø䃸l;折iŬⸯ⸴de耻õ䃵esĀ;aǛ⸺s;樶ml耻ö䃶bar;挽ૡ⹞\0⹽\0⺀⺝\0⺢⺹\0\0⻋ຜ\0⼓\0\0⼫⾼\0⿈rȀ;astЃ⹧⹲຅脀¶;l⹭⹮䂶leìЃɩ⹸\0\0⹻m;櫳;櫽y;䐿rʀcimpt⺋⺏⺓ᡥ⺗nt;䀥od;䀮il;怰enk;怱r;쀀𝔭ƀimo⺨⺰⺴Ā;v⺭⺮䏆;䏕maô੶ne;明ƀ;tv⺿⻀⻈䏀chfork»´;䏖Āau⻏⻟nĀck⻕⻝kĀ;h⇴⻛;愎ö⇴sҀ;abcdemst⻳⻴ᤈ⻹⻽⼄⼆⼊⼎䀫cir;樣ir;樢Āouᵀ⼂;樥;橲n肻±ຝim;樦wo;樧ƀipu⼙⼠⼥ntint;樕f;쀀𝕡nd耻£䂣Ԁ;Eaceinosu່⼿⽁⽄⽇⾁⾉⾒⽾⾶;檳p;檷uå໙Ā;c໎⽌̀;acens່⽙⽟⽦⽨⽾pproø⽃urlyeñ໙ñ໎ƀaes⽯⽶⽺pprox;檹qq;檵im;拨iíໟmeĀ;s⾈ຮ怲ƀEas⽸⾐⽺ð⽵ƀdfp໬⾙⾯ƀals⾠⾥⾪lar;挮ine;挒urf;挓Ā;t໻⾴ï໻rel;抰Āci⿀⿅r;쀀𝓅;䏈ncsp;怈̀fiopsu⿚⋢⿟⿥⿫⿱r;쀀𝔮pf;쀀𝕢rime;恗cr;쀀𝓆ƀaeo⿸〉〓tĀei⿾々rnionóڰnt;樖stĀ;e【】䀿ñἙô༔઀ABHabcdefhilmnoprstux぀けさすムㄎㄫㅇㅢㅲㆎ㈆㈕㈤㈩㉘㉮㉲㊐㊰㊷ƀartぇおがròႳòϝail;検aròᱥar;楤΀cdenqrtとふへみわゔヌĀeuねぱ;쀀∽̱te;䅕iãᅮmptyv;榳gȀ;del࿑らるろ;榒;榥å࿑uo耻»䂻rր;abcfhlpstw࿜ガクシスゼゾダッデナp;極Ā;f࿠ゴs;椠;椳s;椞ë≝ð✮l;楅im;楴l;憣;憝Āaiパフil;椚oĀ;nホボ戶aló༞ƀabrョリヮrò៥rk;杳ĀakンヽcĀekヹ・;䁽;䁝Āes㄂㄄;榌lĀduㄊㄌ;榎;榐Ȁaeuyㄗㄜㄧㄩron;䅙Ādiㄡㄥil;䅗ì࿲âヺ;䑀Ȁclqsㄴㄷㄽㅄa;椷dhar;楩uoĀ;rȎȍh;憳ƀacgㅎㅟངlȀ;ipsླྀㅘㅛႜnåႻarôྩt;断ƀilrㅩဣㅮsht;楽;쀀𝔯ĀaoㅷㆆrĀduㅽㅿ»ѻĀ;l႑ㆄ;楬Ā;vㆋㆌ䏁;䏱ƀgns㆕ㇹㇼht̀ahlrstㆤㆰ㇂㇘㇤㇮rrowĀ;t࿜ㆭaéトarpoonĀduㆻㆿowîㅾp»႒eftĀah㇊㇐rrowó࿪arpoonóՑightarrows;應quigarro÷ニhreetimes;拌g;䋚ingdotseñἲƀahm㈍㈐㈓rò࿪aòՑ;怏oustĀ;a㈞㈟掱che»㈟mid;櫮Ȁabpt㈲㈽㉀㉒Ānr㈷㈺g;柭r;懾rëဃƀafl㉇㉊㉎r;榆;쀀𝕣us;樮imes;樵Āap㉝㉧rĀ;g㉣㉤䀩t;榔olint;樒arò㇣Ȁachq㉻㊀Ⴜ㊅quo;怺r;쀀𝓇Ābu・㊊oĀ;rȔȓƀhir㊗㊛㊠reåㇸmes;拊iȀ;efl㊪ၙᠡ㊫方tri;槎luhar;楨;愞ൡ㋕㋛㋟㌬㌸㍱\0㍺㎤\0\0㏬㏰\0㐨㑈㑚㒭㒱㓊㓱\0㘖\0\0㘳cute;䅛quï➺Ԁ;Eaceinpsyᇭ㋳㋵㋿㌂㌋㌏㌟㌦㌩;檴ǰ㋺\0㋼;檸on;䅡uåᇾĀ;dᇳ㌇il;䅟rc;䅝ƀEas㌖㌘㌛;檶p;檺im;择olint;樓iíሄ;䑁otƀ;be㌴ᵇ㌵担;橦΀Aacmstx㍆㍊㍗㍛㍞㍣㍭rr;懘rĀhr㍐㍒ë∨Ā;oਸ਼਴t耻§䂧i;䀻war;椩mĀin㍩ðnuóñt;朶rĀ;o㍶⁕쀀𝔰Ȁacoy㎂㎆㎑㎠rp;景Āhy㎋㎏cy;䑉;䑈rtɭ㎙\0\0㎜iäᑤaraì⹯耻­䂭Āgm㎨㎴maƀ;fv㎱㎲㎲䏃;䏂Ѐ;deglnprካ㏅㏉㏎㏖㏞㏡㏦ot;橪Ā;q኱ኰĀ;E㏓㏔檞;檠Ā;E㏛㏜檝;檟e;扆lus;樤arr;楲aròᄽȀaeit㏸㐈㐏㐗Āls㏽㐄lsetmé㍪hp;樳parsl;槤Ādlᑣ㐔e;挣Ā;e㐜㐝檪Ā;s㐢㐣檬;쀀⪬︀ƀflp㐮㐳㑂tcy;䑌Ā;b㐸㐹䀯Ā;a㐾㐿槄r;挿f;쀀𝕤aĀdr㑍ЂesĀ;u㑔㑕晠it»㑕ƀcsu㑠㑹㒟Āau㑥㑯pĀ;sᆈ㑫;쀀⊓︀pĀ;sᆴ㑵;쀀⊔︀uĀbp㑿㒏ƀ;esᆗᆜ㒆etĀ;eᆗ㒍ñᆝƀ;esᆨᆭ㒖etĀ;eᆨ㒝ñᆮƀ;afᅻ㒦ְrť㒫ֱ»ᅼaròᅈȀcemt㒹㒾㓂㓅r;쀀𝓈tmîñiì㐕aræᆾĀar㓎㓕rĀ;f㓔ឿ昆Āan㓚㓭ightĀep㓣㓪psiloîỠhé⺯s»⡒ʀbcmnp㓻㕞ሉ㖋㖎Ҁ;Edemnprs㔎㔏㔑㔕㔞㔣㔬㔱㔶抂;櫅ot;檽Ā;dᇚ㔚ot;櫃ult;櫁ĀEe㔨㔪;櫋;把lus;檿arr;楹ƀeiu㔽㕒㕕tƀ;en㔎㕅㕋qĀ;qᇚ㔏eqĀ;q㔫㔨m;櫇Ābp㕚㕜;櫕;櫓c̀;acensᇭ㕬㕲㕹㕻㌦pproø㋺urlyeñᇾñᇳƀaes㖂㖈㌛pproø㌚qñ㌗g;晪ڀ123;Edehlmnps㖩㖬㖯ሜ㖲㖴㗀㗉㗕㗚㗟㗨㗭耻¹䂹耻²䂲耻³䂳;櫆Āos㖹㖼t;檾ub;櫘Ā;dሢ㗅ot;櫄sĀou㗏㗒l;柉b;櫗arr;楻ult;櫂ĀEe㗤㗦;櫌;抋lus;櫀ƀeiu㗴㘉㘌tƀ;enሜ㗼㘂qĀ;qሢ㖲eqĀ;q㗧㗤m;櫈Ābp㘑㘓;櫔;櫖ƀAan㘜㘠㘭rr;懙rĀhr㘦㘨ë∮Ā;oਫ਩war;椪lig耻ß䃟௡㙑㙝㙠ዎ㙳㙹\0㙾㛂\0\0\0\0\0㛛㜃\0㜉㝬\0\0\0㞇ɲ㙖\0\0㙛get;挖;䏄rë๟ƀaey㙦㙫㙰ron;䅥dil;䅣;䑂lrec;挕r;쀀𝔱Ȁeiko㚆㚝㚵㚼ǲ㚋\0㚑eĀ4fኄኁaƀ;sv㚘㚙㚛䎸ym;䏑Ācn㚢㚲kĀas㚨㚮pproø዁im»ኬsðኞĀas㚺㚮ð዁rn耻þ䃾Ǭ̟㛆⋧es膀×;bd㛏㛐㛘䃗Ā;aᤏ㛕r;樱;樰ƀeps㛡㛣㜀á⩍Ȁ;bcf҆㛬㛰㛴ot;挶ir;櫱Ā;o㛹㛼쀀𝕥rk;櫚á㍢rime;怴ƀaip㜏㜒㝤dåቈ΀adempst㜡㝍㝀㝑㝗㝜㝟ngleʀ;dlqr㜰㜱㜶㝀㝂斵own»ᶻeftĀ;e⠀㜾ñम;扜ightĀ;e㊪㝋ñၚot;旬inus;樺lus;樹b;槍ime;樻ezium;揢ƀcht㝲㝽㞁Āry㝷㝻;쀀𝓉;䑆cy;䑛rok;䅧Āio㞋㞎xô᝷headĀlr㞗㞠eftarro÷ࡏightarrow»ཝऀAHabcdfghlmoprstuw㟐㟓㟗㟤㟰㟼㠎㠜㠣㠴㡑㡝㡫㢩㣌㣒㣪㣶ròϭar;楣Ācr㟜㟢ute耻ú䃺òᅐrǣ㟪\0㟭y;䑞ve;䅭Āiy㟵㟺rc耻û䃻;䑃ƀabh㠃㠆㠋ròᎭlac;䅱aòᏃĀir㠓㠘sht;楾;쀀𝔲rave耻ù䃹š㠧㠱rĀlr㠬㠮»ॗ»ႃlk;斀Āct㠹㡍ɯ㠿\0\0㡊rnĀ;e㡅㡆挜r»㡆op;挏ri;旸Āal㡖㡚cr;䅫肻¨͉Āgp㡢㡦on;䅳f;쀀𝕦̀adhlsuᅋ㡸㡽፲㢑㢠ownáᎳarpoonĀlr㢈㢌efô㠭ighô㠯iƀ;hl㢙㢚㢜䏅»ᏺon»㢚parrows;懈ƀcit㢰㣄㣈ɯ㢶\0\0㣁rnĀ;e㢼㢽挝r»㢽op;挎ng;䅯ri;旹cr;쀀𝓊ƀdir㣙㣝㣢ot;拰lde;䅩iĀ;f㜰㣨»᠓Āam㣯㣲rò㢨l耻ü䃼angle;榧ހABDacdeflnoprsz㤜㤟㤩㤭㦵㦸㦽㧟㧤㧨㧳㧹㧽㨁㨠ròϷarĀ;v㤦㤧櫨;櫩asèϡĀnr㤲㤷grt;榜΀eknprst㓣㥆㥋㥒㥝㥤㦖appá␕othinçẖƀhir㓫⻈㥙opô⾵Ā;hᎷ㥢ïㆍĀiu㥩㥭gmá㎳Ābp㥲㦄setneqĀ;q㥽㦀쀀⊊︀;쀀⫋︀setneqĀ;q㦏㦒쀀⊋︀;쀀⫌︀Āhr㦛㦟etá㚜iangleĀlr㦪㦯eft»थight»ၑy;䐲ash»ံƀelr㧄㧒㧗ƀ;beⷪ㧋㧏ar;抻q;扚lip;拮Ābt㧜ᑨaòᑩr;쀀𝔳tré㦮suĀbp㧯㧱»ജ»൙pf;쀀𝕧roð໻tré㦴Ācu㨆㨋r;쀀𝓋Ābp㨐㨘nĀEe㦀㨖»㥾nĀEe㦒㨞»㦐igzag;榚΀cefoprs㨶㨻㩖㩛㩔㩡㩪irc;䅵Ādi㩀㩑Ābg㩅㩉ar;機eĀ;qᗺ㩏;扙erp;愘r;쀀𝔴pf;쀀𝕨Ā;eᑹ㩦atèᑹcr;쀀𝓌ૣណ㪇\0㪋\0㪐㪛\0\0㪝㪨㪫㪯\0\0㫃㫎\0㫘ៜ៟tré៑r;쀀𝔵ĀAa㪔㪗ròσrò৶;䎾ĀAa㪡㪤ròθrò৫að✓is;拻ƀdptឤ㪵㪾Āfl㪺ឩ;쀀𝕩imåឲĀAa㫇㫊ròώròਁĀcq㫒ីr;쀀𝓍Āpt៖㫜ré។Ѐacefiosu㫰㫽㬈㬌㬑㬕㬛㬡cĀuy㫶㫻te耻ý䃽;䑏Āiy㬂㬆rc;䅷;䑋n耻¥䂥r;쀀𝔶cy;䑗pf;쀀𝕪cr;쀀𝓎Ācm㬦㬩y;䑎l耻ÿ䃿Ԁacdefhiosw㭂㭈㭔㭘㭤㭩㭭㭴㭺㮀cute;䅺Āay㭍㭒ron;䅾;䐷ot;䅼Āet㭝㭡træᕟa;䎶r;쀀𝔷cy;䐶grarr;懝pf;쀀𝕫cr;쀀𝓏Ājn㮅㮇;怍j;怌`.split(``).map(e=>e.charCodeAt(0))),Hl=new Map([[0,65533],[128,8364],[130,8218],[131,402],[132,8222],[133,8230],[134,8224],[135,8225],[136,710],[137,8240],[138,352],[139,8249],[140,338],[142,381],[145,8216],[146,8217],[147,8220],[148,8221],[149,8226],[150,8211],[151,8212],[152,732],[153,8482],[154,353],[155,8250],[156,339],[158,382],[159,376]]);String.fromCodePoint;function Ul(e){return e>=55296&&e<=57343||e>1114111?65533:Hl.get(e)??e}var V;(function(e){e[e.NUM=35]=`NUM`,e[e.SEMI=59]=`SEMI`,e[e.EQUALS=61]=`EQUALS`,e[e.ZERO=48]=`ZERO`,e[e.NINE=57]=`NINE`,e[e.LOWER_A=97]=`LOWER_A`,e[e.LOWER_F=102]=`LOWER_F`,e[e.LOWER_X=120]=`LOWER_X`,e[e.LOWER_Z=122]=`LOWER_Z`,e[e.UPPER_A=65]=`UPPER_A`,e[e.UPPER_F=70]=`UPPER_F`,e[e.UPPER_Z=90]=`UPPER_Z`})(V||={});var Wl=32,H;(function(e){e[e.VALUE_LENGTH=49152]=`VALUE_LENGTH`,e[e.BRANCH_LENGTH=16256]=`BRANCH_LENGTH`,e[e.JUMP_TABLE=127]=`JUMP_TABLE`})(H||={});function U(e){return e>=V.ZERO&&e<=V.NINE}function W(e){return e>=V.UPPER_A&&e<=V.UPPER_F||e>=V.LOWER_A&&e<=V.LOWER_F}function Gl(e){return e>=V.UPPER_A&&e<=V.UPPER_Z||e>=V.LOWER_A&&e<=V.LOWER_Z||U(e)}function Kl(e){return e===V.EQUALS||Gl(e)}var ql;(function(e){e[e.EntityStart=0]=`EntityStart`,e[e.NumericStart=1]=`NumericStart`,e[e.NumericDecimal=2]=`NumericDecimal`,e[e.NumericHex=3]=`NumericHex`,e[e.NamedEntity=4]=`NamedEntity`})(ql||={});var Jl;(function(e){e[e.Legacy=0]=`Legacy`,e[e.Strict=1]=`Strict`,e[e.Attribute=2]=`Attribute`})(Jl||={});var Yl=class{constructor(e,t,n){this.decodeTree=e,this.emitCodePoint=t,this.errors=n,this.state=ql.EntityStart,this.consumed=1,this.result=0,this.treeIndex=0,this.excess=1,this.decodeMode=Jl.Strict}startEntity(e){this.decodeMode=e,this.state=ql.EntityStart,this.result=0,this.treeIndex=0,this.excess=1,this.consumed=1}write(e,t){switch(this.state){case ql.EntityStart:return e.charCodeAt(t)===V.NUM?(this.state=ql.NumericStart,this.consumed+=1,this.stateNumericStart(e,t+1)):(this.state=ql.NamedEntity,this.stateNamedEntity(e,t));case ql.NumericStart:return this.stateNumericStart(e,t);case ql.NumericDecimal:return this.stateNumericDecimal(e,t);case ql.NumericHex:return this.stateNumericHex(e,t);case ql.NamedEntity:return this.stateNamedEntity(e,t)}}stateNumericStart(e,t){return t>=e.length?-1:(e.charCodeAt(t)|Wl)===V.LOWER_X?(this.state=ql.NumericHex,this.consumed+=1,this.stateNumericHex(e,t+1)):(this.state=ql.NumericDecimal,this.stateNumericDecimal(e,t))}addToNumericResult(e,t,n,r){if(t!==n){let i=n-t;this.result=this.result*r**+i+Number.parseInt(e.substr(t,i),r),this.consumed+=i}}stateNumericHex(e,t){let n=t;for(;t<e.length;){let r=e.charCodeAt(t);if(U(r)||W(r))t+=1;else return this.addToNumericResult(e,n,t,16),this.emitNumericEntity(r,3)}return this.addToNumericResult(e,n,t,16),-1}stateNumericDecimal(e,t){let n=t;for(;t<e.length;){let r=e.charCodeAt(t);if(U(r))t+=1;else return this.addToNumericResult(e,n,t,10),this.emitNumericEntity(r,2)}return this.addToNumericResult(e,n,t,10),-1}emitNumericEntity(e,t){var n;if(this.consumed<=t)return(n=this.errors)==null||n.absenceOfDigitsInNumericCharacterReference(this.consumed),0;if(e===V.SEMI)this.consumed+=1;else if(this.decodeMode===Jl.Strict)return 0;return this.emitCodePoint(Ul(this.result),this.consumed),this.errors&&(e!==V.SEMI&&this.errors.missingSemicolonAfterCharacterReference(),this.errors.validateNumericCharacterReference(this.result)),this.consumed}stateNamedEntity(e,t){let{decodeTree:n}=this,r=n[this.treeIndex],i=(r&H.VALUE_LENGTH)>>14;for(;t<e.length;t++,this.excess++){let a=e.charCodeAt(t);if(this.treeIndex=Xl(n,r,this.treeIndex+Math.max(1,i),a),this.treeIndex<0)return this.result===0||this.decodeMode===Jl.Attribute&&(i===0||Kl(a))?0:this.emitNotTerminatedNamedEntity();if(r=n[this.treeIndex],i=(r&H.VALUE_LENGTH)>>14,i!==0){if(a===V.SEMI)return this.emitNamedEntityData(this.treeIndex,i,this.consumed+this.excess);this.decodeMode!==Jl.Strict&&(this.result=this.treeIndex,this.consumed+=this.excess,this.excess=0)}}return-1}emitNotTerminatedNamedEntity(){var e;let{result:t,decodeTree:n}=this,r=(n[t]&H.VALUE_LENGTH)>>14;return this.emitNamedEntityData(t,r,this.consumed),(e=this.errors)==null||e.missingSemicolonAfterCharacterReference(),this.consumed}emitNamedEntityData(e,t,n){let{decodeTree:r}=this;return this.emitCodePoint(t===1?r[e]&~H.VALUE_LENGTH:r[e+1],n),t===3&&this.emitCodePoint(r[e+2],n),n}end(){var e;switch(this.state){case ql.NamedEntity:return this.result!==0&&(this.decodeMode!==Jl.Attribute||this.result===this.treeIndex)?this.emitNotTerminatedNamedEntity():0;case ql.NumericDecimal:return this.emitNumericEntity(0,2);case ql.NumericHex:return this.emitNumericEntity(0,3);case ql.NumericStart:return(e=this.errors)==null||e.absenceOfDigitsInNumericCharacterReference(this.consumed),0;case ql.EntityStart:return 0}}};function Xl(e,t,n,r){let i=(t&H.BRANCH_LENGTH)>>7,a=t&H.JUMP_TABLE;if(i===0)return a!==0&&r===a?n:-1;if(a){let t=r-a;return t<0||t>=i?-1:e[n+t]-1}let o=n,s=o+i-1;for(;o<=s;){let t=o+s>>>1,n=e[t];if(n<r)o=t+1;else if(n>r)s=t-1;else return e[t+i]}return-1}var G;(function(e){e.HTML=`http://www.w3.org/1999/xhtml`,e.MATHML=`http://www.w3.org/1998/Math/MathML`,e.SVG=`http://www.w3.org/2000/svg`,e.XLINK=`http://www.w3.org/1999/xlink`,e.XML=`http://www.w3.org/XML/1998/namespace`,e.XMLNS=`http://www.w3.org/2000/xmlns/`})(G||={});var Zl;(function(e){e.TYPE=`type`,e.ACTION=`action`,e.ENCODING=`encoding`,e.PROMPT=`prompt`,e.NAME=`name`,e.COLOR=`color`,e.FACE=`face`,e.SIZE=`size`})(Zl||={});var Ql;(function(e){e.NO_QUIRKS=`no-quirks`,e.QUIRKS=`quirks`,e.LIMITED_QUIRKS=`limited-quirks`})(Ql||={});var K;(function(e){e.A=`a`,e.ADDRESS=`address`,e.ANNOTATION_XML=`annotation-xml`,e.APPLET=`applet`,e.AREA=`area`,e.ARTICLE=`article`,e.ASIDE=`aside`,e.B=`b`,e.BASE=`base`,e.BASEFONT=`basefont`,e.BGSOUND=`bgsound`,e.BIG=`big`,e.BLOCKQUOTE=`blockquote`,e.BODY=`body`,e.BR=`br`,e.BUTTON=`button`,e.CAPTION=`caption`,e.CENTER=`center`,e.CODE=`code`,e.COL=`col`,e.COLGROUP=`colgroup`,e.DD=`dd`,e.DESC=`desc`,e.DETAILS=`details`,e.DIALOG=`dialog`,e.DIR=`dir`,e.DIV=`div`,e.DL=`dl`,e.DT=`dt`,e.EM=`em`,e.EMBED=`embed`,e.FIELDSET=`fieldset`,e.FIGCAPTION=`figcaption`,e.FIGURE=`figure`,e.FONT=`font`,e.FOOTER=`footer`,e.FOREIGN_OBJECT=`foreignObject`,e.FORM=`form`,e.FRAME=`frame`,e.FRAMESET=`frameset`,e.H1=`h1`,e.H2=`h2`,e.H3=`h3`,e.H4=`h4`,e.H5=`h5`,e.H6=`h6`,e.HEAD=`head`,e.HEADER=`header`,e.HGROUP=`hgroup`,e.HR=`hr`,e.HTML=`html`,e.I=`i`,e.IMG=`img`,e.IMAGE=`image`,e.INPUT=`input`,e.IFRAME=`iframe`,e.KEYGEN=`keygen`,e.LABEL=`label`,e.LI=`li`,e.LINK=`link`,e.LISTING=`listing`,e.MAIN=`main`,e.MALIGNMARK=`malignmark`,e.MARQUEE=`marquee`,e.MATH=`math`,e.MENU=`menu`,e.META=`meta`,e.MGLYPH=`mglyph`,e.MI=`mi`,e.MO=`mo`,e.MN=`mn`,e.MS=`ms`,e.MTEXT=`mtext`,e.NAV=`nav`,e.NOBR=`nobr`,e.NOFRAMES=`noframes`,e.NOEMBED=`noembed`,e.NOSCRIPT=`noscript`,e.OBJECT=`object`,e.OL=`ol`,e.OPTGROUP=`optgroup`,e.OPTION=`option`,e.P=`p`,e.PARAM=`param`,e.PLAINTEXT=`plaintext`,e.PRE=`pre`,e.RB=`rb`,e.RP=`rp`,e.RT=`rt`,e.RTC=`rtc`,e.RUBY=`ruby`,e.S=`s`,e.SCRIPT=`script`,e.SEARCH=`search`,e.SECTION=`section`,e.SELECT=`select`,e.SOURCE=`source`,e.SMALL=`small`,e.SPAN=`span`,e.STRIKE=`strike`,e.STRONG=`strong`,e.STYLE=`style`,e.SUB=`sub`,e.SUMMARY=`summary`,e.SUP=`sup`,e.TABLE=`table`,e.TBODY=`tbody`,e.TEMPLATE=`template`,e.TEXTAREA=`textarea`,e.TFOOT=`tfoot`,e.TD=`td`,e.TH=`th`,e.THEAD=`thead`,e.TITLE=`title`,e.TR=`tr`,e.TRACK=`track`,e.TT=`tt`,e.U=`u`,e.UL=`ul`,e.SVG=`svg`,e.VAR=`var`,e.WBR=`wbr`,e.XMP=`xmp`})(K||={});var q;(function(e){e[e.UNKNOWN=0]=`UNKNOWN`,e[e.A=1]=`A`,e[e.ADDRESS=2]=`ADDRESS`,e[e.ANNOTATION_XML=3]=`ANNOTATION_XML`,e[e.APPLET=4]=`APPLET`,e[e.AREA=5]=`AREA`,e[e.ARTICLE=6]=`ARTICLE`,e[e.ASIDE=7]=`ASIDE`,e[e.B=8]=`B`,e[e.BASE=9]=`BASE`,e[e.BASEFONT=10]=`BASEFONT`,e[e.BGSOUND=11]=`BGSOUND`,e[e.BIG=12]=`BIG`,e[e.BLOCKQUOTE=13]=`BLOCKQUOTE`,e[e.BODY=14]=`BODY`,e[e.BR=15]=`BR`,e[e.BUTTON=16]=`BUTTON`,e[e.CAPTION=17]=`CAPTION`,e[e.CENTER=18]=`CENTER`,e[e.CODE=19]=`CODE`,e[e.COL=20]=`COL`,e[e.COLGROUP=21]=`COLGROUP`,e[e.DD=22]=`DD`,e[e.DESC=23]=`DESC`,e[e.DETAILS=24]=`DETAILS`,e[e.DIALOG=25]=`DIALOG`,e[e.DIR=26]=`DIR`,e[e.DIV=27]=`DIV`,e[e.DL=28]=`DL`,e[e.DT=29]=`DT`,e[e.EM=30]=`EM`,e[e.EMBED=31]=`EMBED`,e[e.FIELDSET=32]=`FIELDSET`,e[e.FIGCAPTION=33]=`FIGCAPTION`,e[e.FIGURE=34]=`FIGURE`,e[e.FONT=35]=`FONT`,e[e.FOOTER=36]=`FOOTER`,e[e.FOREIGN_OBJECT=37]=`FOREIGN_OBJECT`,e[e.FORM=38]=`FORM`,e[e.FRAME=39]=`FRAME`,e[e.FRAMESET=40]=`FRAMESET`,e[e.H1=41]=`H1`,e[e.H2=42]=`H2`,e[e.H3=43]=`H3`,e[e.H4=44]=`H4`,e[e.H5=45]=`H5`,e[e.H6=46]=`H6`,e[e.HEAD=47]=`HEAD`,e[e.HEADER=48]=`HEADER`,e[e.HGROUP=49]=`HGROUP`,e[e.HR=50]=`HR`,e[e.HTML=51]=`HTML`,e[e.I=52]=`I`,e[e.IMG=53]=`IMG`,e[e.IMAGE=54]=`IMAGE`,e[e.INPUT=55]=`INPUT`,e[e.IFRAME=56]=`IFRAME`,e[e.KEYGEN=57]=`KEYGEN`,e[e.LABEL=58]=`LABEL`,e[e.LI=59]=`LI`,e[e.LINK=60]=`LINK`,e[e.LISTING=61]=`LISTING`,e[e.MAIN=62]=`MAIN`,e[e.MALIGNMARK=63]=`MALIGNMARK`,e[e.MARQUEE=64]=`MARQUEE`,e[e.MATH=65]=`MATH`,e[e.MENU=66]=`MENU`,e[e.META=67]=`META`,e[e.MGLYPH=68]=`MGLYPH`,e[e.MI=69]=`MI`,e[e.MO=70]=`MO`,e[e.MN=71]=`MN`,e[e.MS=72]=`MS`,e[e.MTEXT=73]=`MTEXT`,e[e.NAV=74]=`NAV`,e[e.NOBR=75]=`NOBR`,e[e.NOFRAMES=76]=`NOFRAMES`,e[e.NOEMBED=77]=`NOEMBED`,e[e.NOSCRIPT=78]=`NOSCRIPT`,e[e.OBJECT=79]=`OBJECT`,e[e.OL=80]=`OL`,e[e.OPTGROUP=81]=`OPTGROUP`,e[e.OPTION=82]=`OPTION`,e[e.P=83]=`P`,e[e.PARAM=84]=`PARAM`,e[e.PLAINTEXT=85]=`PLAINTEXT`,e[e.PRE=86]=`PRE`,e[e.RB=87]=`RB`,e[e.RP=88]=`RP`,e[e.RT=89]=`RT`,e[e.RTC=90]=`RTC`,e[e.RUBY=91]=`RUBY`,e[e.S=92]=`S`,e[e.SCRIPT=93]=`SCRIPT`,e[e.SEARCH=94]=`SEARCH`,e[e.SECTION=95]=`SECTION`,e[e.SELECT=96]=`SELECT`,e[e.SOURCE=97]=`SOURCE`,e[e.SMALL=98]=`SMALL`,e[e.SPAN=99]=`SPAN`,e[e.STRIKE=100]=`STRIKE`,e[e.STRONG=101]=`STRONG`,e[e.STYLE=102]=`STYLE`,e[e.SUB=103]=`SUB`,e[e.SUMMARY=104]=`SUMMARY`,e[e.SUP=105]=`SUP`,e[e.TABLE=106]=`TABLE`,e[e.TBODY=107]=`TBODY`,e[e.TEMPLATE=108]=`TEMPLATE`,e[e.TEXTAREA=109]=`TEXTAREA`,e[e.TFOOT=110]=`TFOOT`,e[e.TD=111]=`TD`,e[e.TH=112]=`TH`,e[e.THEAD=113]=`THEAD`,e[e.TITLE=114]=`TITLE`,e[e.TR=115]=`TR`,e[e.TRACK=116]=`TRACK`,e[e.TT=117]=`TT`,e[e.U=118]=`U`,e[e.UL=119]=`UL`,e[e.SVG=120]=`SVG`,e[e.VAR=121]=`VAR`,e[e.WBR=122]=`WBR`,e[e.XMP=123]=`XMP`})(q||={});var $l=new Map([[K.A,q.A],[K.ADDRESS,q.ADDRESS],[K.ANNOTATION_XML,q.ANNOTATION_XML],[K.APPLET,q.APPLET],[K.AREA,q.AREA],[K.ARTICLE,q.ARTICLE],[K.ASIDE,q.ASIDE],[K.B,q.B],[K.BASE,q.BASE],[K.BASEFONT,q.BASEFONT],[K.BGSOUND,q.BGSOUND],[K.BIG,q.BIG],[K.BLOCKQUOTE,q.BLOCKQUOTE],[K.BODY,q.BODY],[K.BR,q.BR],[K.BUTTON,q.BUTTON],[K.CAPTION,q.CAPTION],[K.CENTER,q.CENTER],[K.CODE,q.CODE],[K.COL,q.COL],[K.COLGROUP,q.COLGROUP],[K.DD,q.DD],[K.DESC,q.DESC],[K.DETAILS,q.DETAILS],[K.DIALOG,q.DIALOG],[K.DIR,q.DIR],[K.DIV,q.DIV],[K.DL,q.DL],[K.DT,q.DT],[K.EM,q.EM],[K.EMBED,q.EMBED],[K.FIELDSET,q.FIELDSET],[K.FIGCAPTION,q.FIGCAPTION],[K.FIGURE,q.FIGURE],[K.FONT,q.FONT],[K.FOOTER,q.FOOTER],[K.FOREIGN_OBJECT,q.FOREIGN_OBJECT],[K.FORM,q.FORM],[K.FRAME,q.FRAME],[K.FRAMESET,q.FRAMESET],[K.H1,q.H1],[K.H2,q.H2],[K.H3,q.H3],[K.H4,q.H4],[K.H5,q.H5],[K.H6,q.H6],[K.HEAD,q.HEAD],[K.HEADER,q.HEADER],[K.HGROUP,q.HGROUP],[K.HR,q.HR],[K.HTML,q.HTML],[K.I,q.I],[K.IMG,q.IMG],[K.IMAGE,q.IMAGE],[K.INPUT,q.INPUT],[K.IFRAME,q.IFRAME],[K.KEYGEN,q.KEYGEN],[K.LABEL,q.LABEL],[K.LI,q.LI],[K.LINK,q.LINK],[K.LISTING,q.LISTING],[K.MAIN,q.MAIN],[K.MALIGNMARK,q.MALIGNMARK],[K.MARQUEE,q.MARQUEE],[K.MATH,q.MATH],[K.MENU,q.MENU],[K.META,q.META],[K.MGLYPH,q.MGLYPH],[K.MI,q.MI],[K.MO,q.MO],[K.MN,q.MN],[K.MS,q.MS],[K.MTEXT,q.MTEXT],[K.NAV,q.NAV],[K.NOBR,q.NOBR],[K.NOFRAMES,q.NOFRAMES],[K.NOEMBED,q.NOEMBED],[K.NOSCRIPT,q.NOSCRIPT],[K.OBJECT,q.OBJECT],[K.OL,q.OL],[K.OPTGROUP,q.OPTGROUP],[K.OPTION,q.OPTION],[K.P,q.P],[K.PARAM,q.PARAM],[K.PLAINTEXT,q.PLAINTEXT],[K.PRE,q.PRE],[K.RB,q.RB],[K.RP,q.RP],[K.RT,q.RT],[K.RTC,q.RTC],[K.RUBY,q.RUBY],[K.S,q.S],[K.SCRIPT,q.SCRIPT],[K.SEARCH,q.SEARCH],[K.SECTION,q.SECTION],[K.SELECT,q.SELECT],[K.SOURCE,q.SOURCE],[K.SMALL,q.SMALL],[K.SPAN,q.SPAN],[K.STRIKE,q.STRIKE],[K.STRONG,q.STRONG],[K.STYLE,q.STYLE],[K.SUB,q.SUB],[K.SUMMARY,q.SUMMARY],[K.SUP,q.SUP],[K.TABLE,q.TABLE],[K.TBODY,q.TBODY],[K.TEMPLATE,q.TEMPLATE],[K.TEXTAREA,q.TEXTAREA],[K.TFOOT,q.TFOOT],[K.TD,q.TD],[K.TH,q.TH],[K.THEAD,q.THEAD],[K.TITLE,q.TITLE],[K.TR,q.TR],[K.TRACK,q.TRACK],[K.TT,q.TT],[K.U,q.U],[K.UL,q.UL],[K.SVG,q.SVG],[K.VAR,q.VAR],[K.WBR,q.WBR],[K.XMP,q.XMP]]);function eu(e){return $l.get(e)??q.UNKNOWN}var J=q,tu={[G.HTML]:new Set([J.ADDRESS,J.APPLET,J.AREA,J.ARTICLE,J.ASIDE,J.BASE,J.BASEFONT,J.BGSOUND,J.BLOCKQUOTE,J.BODY,J.BR,J.BUTTON,J.CAPTION,J.CENTER,J.COL,J.COLGROUP,J.DD,J.DETAILS,J.DIR,J.DIV,J.DL,J.DT,J.EMBED,J.FIELDSET,J.FIGCAPTION,J.FIGURE,J.FOOTER,J.FORM,J.FRAME,J.FRAMESET,J.H1,J.H2,J.H3,J.H4,J.H5,J.H6,J.HEAD,J.HEADER,J.HGROUP,J.HR,J.HTML,J.IFRAME,J.IMG,J.INPUT,J.LI,J.LINK,J.LISTING,J.MAIN,J.MARQUEE,J.MENU,J.META,J.NAV,J.NOEMBED,J.NOFRAMES,J.NOSCRIPT,J.OBJECT,J.OL,J.P,J.PARAM,J.PLAINTEXT,J.PRE,J.SCRIPT,J.SECTION,J.SELECT,J.SOURCE,J.STYLE,J.SUMMARY,J.TABLE,J.TBODY,J.TD,J.TEMPLATE,J.TEXTAREA,J.TFOOT,J.TH,J.THEAD,J.TITLE,J.TR,J.TRACK,J.UL,J.WBR,J.XMP]),[G.MATHML]:new Set([J.MI,J.MO,J.MN,J.MS,J.MTEXT,J.ANNOTATION_XML]),[G.SVG]:new Set([J.TITLE,J.FOREIGN_OBJECT,J.DESC]),[G.XLINK]:new Set,[G.XML]:new Set,[G.XMLNS]:new Set},nu=new Set([J.H1,J.H2,J.H3,J.H4,J.H5,J.H6]);new Set([K.STYLE,K.SCRIPT,K.XMP,K.IFRAME,K.NOEMBED,K.NOFRAMES,K.PLAINTEXT]);var Y;(function(e){e[e.DATA=0]=`DATA`,e[e.RCDATA=1]=`RCDATA`,e[e.RAWTEXT=2]=`RAWTEXT`,e[e.SCRIPT_DATA=3]=`SCRIPT_DATA`,e[e.PLAINTEXT=4]=`PLAINTEXT`,e[e.TAG_OPEN=5]=`TAG_OPEN`,e[e.END_TAG_OPEN=6]=`END_TAG_OPEN`,e[e.TAG_NAME=7]=`TAG_NAME`,e[e.RCDATA_LESS_THAN_SIGN=8]=`RCDATA_LESS_THAN_SIGN`,e[e.RCDATA_END_TAG_OPEN=9]=`RCDATA_END_TAG_OPEN`,e[e.RCDATA_END_TAG_NAME=10]=`RCDATA_END_TAG_NAME`,e[e.RAWTEXT_LESS_THAN_SIGN=11]=`RAWTEXT_LESS_THAN_SIGN`,e[e.RAWTEXT_END_TAG_OPEN=12]=`RAWTEXT_END_TAG_OPEN`,e[e.RAWTEXT_END_TAG_NAME=13]=`RAWTEXT_END_TAG_NAME`,e[e.SCRIPT_DATA_LESS_THAN_SIGN=14]=`SCRIPT_DATA_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_END_TAG_OPEN=15]=`SCRIPT_DATA_END_TAG_OPEN`,e[e.SCRIPT_DATA_END_TAG_NAME=16]=`SCRIPT_DATA_END_TAG_NAME`,e[e.SCRIPT_DATA_ESCAPE_START=17]=`SCRIPT_DATA_ESCAPE_START`,e[e.SCRIPT_DATA_ESCAPE_START_DASH=18]=`SCRIPT_DATA_ESCAPE_START_DASH`,e[e.SCRIPT_DATA_ESCAPED=19]=`SCRIPT_DATA_ESCAPED`,e[e.SCRIPT_DATA_ESCAPED_DASH=20]=`SCRIPT_DATA_ESCAPED_DASH`,e[e.SCRIPT_DATA_ESCAPED_DASH_DASH=21]=`SCRIPT_DATA_ESCAPED_DASH_DASH`,e[e.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN=22]=`SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_ESCAPED_END_TAG_OPEN=23]=`SCRIPT_DATA_ESCAPED_END_TAG_OPEN`,e[e.SCRIPT_DATA_ESCAPED_END_TAG_NAME=24]=`SCRIPT_DATA_ESCAPED_END_TAG_NAME`,e[e.SCRIPT_DATA_DOUBLE_ESCAPE_START=25]=`SCRIPT_DATA_DOUBLE_ESCAPE_START`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED=26]=`SCRIPT_DATA_DOUBLE_ESCAPED`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH=27]=`SCRIPT_DATA_DOUBLE_ESCAPED_DASH`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH=28]=`SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH`,e[e.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN=29]=`SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN`,e[e.SCRIPT_DATA_DOUBLE_ESCAPE_END=30]=`SCRIPT_DATA_DOUBLE_ESCAPE_END`,e[e.BEFORE_ATTRIBUTE_NAME=31]=`BEFORE_ATTRIBUTE_NAME`,e[e.ATTRIBUTE_NAME=32]=`ATTRIBUTE_NAME`,e[e.AFTER_ATTRIBUTE_NAME=33]=`AFTER_ATTRIBUTE_NAME`,e[e.BEFORE_ATTRIBUTE_VALUE=34]=`BEFORE_ATTRIBUTE_VALUE`,e[e.ATTRIBUTE_VALUE_DOUBLE_QUOTED=35]=`ATTRIBUTE_VALUE_DOUBLE_QUOTED`,e[e.ATTRIBUTE_VALUE_SINGLE_QUOTED=36]=`ATTRIBUTE_VALUE_SINGLE_QUOTED`,e[e.ATTRIBUTE_VALUE_UNQUOTED=37]=`ATTRIBUTE_VALUE_UNQUOTED`,e[e.AFTER_ATTRIBUTE_VALUE_QUOTED=38]=`AFTER_ATTRIBUTE_VALUE_QUOTED`,e[e.SELF_CLOSING_START_TAG=39]=`SELF_CLOSING_START_TAG`,e[e.BOGUS_COMMENT=40]=`BOGUS_COMMENT`,e[e.MARKUP_DECLARATION_OPEN=41]=`MARKUP_DECLARATION_OPEN`,e[e.COMMENT_START=42]=`COMMENT_START`,e[e.COMMENT_START_DASH=43]=`COMMENT_START_DASH`,e[e.COMMENT=44]=`COMMENT`,e[e.COMMENT_LESS_THAN_SIGN=45]=`COMMENT_LESS_THAN_SIGN`,e[e.COMMENT_LESS_THAN_SIGN_BANG=46]=`COMMENT_LESS_THAN_SIGN_BANG`,e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH=47]=`COMMENT_LESS_THAN_SIGN_BANG_DASH`,e[e.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH=48]=`COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH`,e[e.COMMENT_END_DASH=49]=`COMMENT_END_DASH`,e[e.COMMENT_END=50]=`COMMENT_END`,e[e.COMMENT_END_BANG=51]=`COMMENT_END_BANG`,e[e.DOCTYPE=52]=`DOCTYPE`,e[e.BEFORE_DOCTYPE_NAME=53]=`BEFORE_DOCTYPE_NAME`,e[e.DOCTYPE_NAME=54]=`DOCTYPE_NAME`,e[e.AFTER_DOCTYPE_NAME=55]=`AFTER_DOCTYPE_NAME`,e[e.AFTER_DOCTYPE_PUBLIC_KEYWORD=56]=`AFTER_DOCTYPE_PUBLIC_KEYWORD`,e[e.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER=57]=`BEFORE_DOCTYPE_PUBLIC_IDENTIFIER`,e[e.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED=58]=`DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED`,e[e.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED=59]=`DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED`,e[e.AFTER_DOCTYPE_PUBLIC_IDENTIFIER=60]=`AFTER_DOCTYPE_PUBLIC_IDENTIFIER`,e[e.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS=61]=`BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS`,e[e.AFTER_DOCTYPE_SYSTEM_KEYWORD=62]=`AFTER_DOCTYPE_SYSTEM_KEYWORD`,e[e.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER=63]=`BEFORE_DOCTYPE_SYSTEM_IDENTIFIER`,e[e.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED=64]=`DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED`,e[e.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED=65]=`DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED`,e[e.AFTER_DOCTYPE_SYSTEM_IDENTIFIER=66]=`AFTER_DOCTYPE_SYSTEM_IDENTIFIER`,e[e.BOGUS_DOCTYPE=67]=`BOGUS_DOCTYPE`,e[e.CDATA_SECTION=68]=`CDATA_SECTION`,e[e.CDATA_SECTION_BRACKET=69]=`CDATA_SECTION_BRACKET`,e[e.CDATA_SECTION_END=70]=`CDATA_SECTION_END`,e[e.CHARACTER_REFERENCE=71]=`CHARACTER_REFERENCE`,e[e.AMBIGUOUS_AMPERSAND=72]=`AMBIGUOUS_AMPERSAND`})(Y||={});var ru={DATA:Y.DATA,RCDATA:Y.RCDATA,RAWTEXT:Y.RAWTEXT,SCRIPT_DATA:Y.SCRIPT_DATA,PLAINTEXT:Y.PLAINTEXT,CDATA_SECTION:Y.CDATA_SECTION};function iu(e){return e>=R.DIGIT_0&&e<=R.DIGIT_9}function au(e){return e>=R.LATIN_CAPITAL_A&&e<=R.LATIN_CAPITAL_Z}function ou(e){return e>=R.LATIN_SMALL_A&&e<=R.LATIN_SMALL_Z}function su(e){return ou(e)||au(e)}function cu(e){return su(e)||iu(e)}function lu(e){return e+32}function uu(e){return e===R.SPACE||e===R.LINE_FEED||e===R.TABULATION||e===R.FORM_FEED}function du(e){return uu(e)||e===R.SOLIDUS||e===R.GREATER_THAN_SIGN}function fu(e){return e===R.NULL?z.nullCharacterReference:e>1114111?z.characterReferenceOutsideUnicodeRange:Nl(e)?z.surrogateCharacterReference:Ll(e)?z.noncharacterCharacterReference:Il(e)||e===R.CARRIAGE_RETURN?z.controlCharacterReference:null}var pu=class{constructor(e,t){this.options=e,this.handler=t,this.paused=!1,this.inLoop=!1,this.inForeignNode=!1,this.lastStartTagName=``,this.active=!1,this.state=Y.DATA,this.returnState=Y.DATA,this.entityStartPos=0,this.consumedAfterSnapshot=-1,this.currentCharacterToken=null,this.currentToken=null,this.currentAttr={name:``,value:``},this.preprocessor=new zl(t),this.currentLocation=this.getCurrentLocation(-1),this.entityDecoder=new Yl(Vl,(e,t)=>{this.preprocessor.pos=this.entityStartPos+t-1,this._flushCodePointConsumedAsCharacterReference(e)},t.onParseError?{missingSemicolonAfterCharacterReference:()=>{this._err(z.missingSemicolonAfterCharacterReference,1)},absenceOfDigitsInNumericCharacterReference:e=>{this._err(z.absenceOfDigitsInNumericCharacterReference,this.entityStartPos-this.preprocessor.pos+e)},validateNumericCharacterReference:e=>{let t=fu(e);t&&this._err(t,1)}}:void 0)}_err(e,t=0){var n,r;(r=(n=this.handler).onParseError)==null||r.call(n,this.preprocessor.getError(e,t))}getCurrentLocation(e){return this.options.sourceCodeLocationInfo?{startLine:this.preprocessor.line,startCol:this.preprocessor.col-e,startOffset:this.preprocessor.offset-e,endLine:-1,endCol:-1,endOffset:-1}:null}_runParsingLoop(){if(!this.inLoop){for(this.inLoop=!0;this.active&&!this.paused;){this.consumedAfterSnapshot=0;let e=this._consume();this._ensureHibernation()||this._callState(e)}this.inLoop=!1}}pause(){this.paused=!0}resume(e){if(!this.paused)throw Error(`Parser was already resumed`);this.paused=!1,!this.inLoop&&(this._runParsingLoop(),this.paused||e?.())}write(e,t,n){this.active=!0,this.preprocessor.write(e,t),this._runParsingLoop(),this.paused||n?.()}insertHtmlAtCurrentPos(e){this.active=!0,this.preprocessor.insertHtmlAtCurrentPos(e),this._runParsingLoop()}_ensureHibernation(){return this.preprocessor.endOfChunkHit?(this.preprocessor.retreat(this.consumedAfterSnapshot),this.consumedAfterSnapshot=0,this.active=!1,!0):!1}_consume(){return this.consumedAfterSnapshot++,this.preprocessor.advance()}_advanceBy(e){this.consumedAfterSnapshot+=e;for(let t=0;t<e;t++)this.preprocessor.advance()}_consumeSequenceIfMatch(e,t){return this.preprocessor.startsWith(e,t)?(this._advanceBy(e.length-1),!0):!1}_createStartTagToken(){this.currentToken={type:B.START_TAG,tagName:``,tagID:q.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(1)}}_createEndTagToken(){this.currentToken={type:B.END_TAG,tagName:``,tagID:q.UNKNOWN,selfClosing:!1,ackSelfClosing:!1,attrs:[],location:this.getCurrentLocation(2)}}_createCommentToken(e){this.currentToken={type:B.COMMENT,data:``,location:this.getCurrentLocation(e)}}_createDoctypeToken(e){this.currentToken={type:B.DOCTYPE,name:e,forceQuirks:!1,publicId:null,systemId:null,location:this.currentLocation}}_createCharacterToken(e,t){this.currentCharacterToken={type:e,chars:t,location:this.currentLocation}}_createAttr(e){this.currentAttr={name:e,value:``},this.currentLocation=this.getCurrentLocation(0)}_leaveAttrName(){var e;let t=this.currentToken;if(Bl(t,this.currentAttr.name)===null){if(t.attrs.push(this.currentAttr),t.location&&this.currentLocation){let n=(e=t.location).attrs??(e.attrs=Object.create(null));n[this.currentAttr.name]=this.currentLocation,this._leaveAttrValue()}}else this._err(z.duplicateAttribute)}_leaveAttrValue(){this.currentLocation&&(this.currentLocation.endLine=this.preprocessor.line,this.currentLocation.endCol=this.preprocessor.col,this.currentLocation.endOffset=this.preprocessor.offset)}prepareToken(e){this._emitCurrentCharacterToken(e.location),this.currentToken=null,e.location&&(e.location.endLine=this.preprocessor.line,e.location.endCol=this.preprocessor.col+1,e.location.endOffset=this.preprocessor.offset+1),this.currentLocation=this.getCurrentLocation(-1)}emitCurrentTagToken(){let e=this.currentToken;this.prepareToken(e),e.tagID=eu(e.tagName),e.type===B.START_TAG?(this.lastStartTagName=e.tagName,this.handler.onStartTag(e)):(e.attrs.length>0&&this._err(z.endTagWithAttributes),e.selfClosing&&this._err(z.endTagWithTrailingSolidus),this.handler.onEndTag(e)),this.preprocessor.dropParsedChunk()}emitCurrentComment(e){this.prepareToken(e),this.handler.onComment(e),this.preprocessor.dropParsedChunk()}emitCurrentDoctype(e){this.prepareToken(e),this.handler.onDoctype(e),this.preprocessor.dropParsedChunk()}_emitCurrentCharacterToken(e){if(this.currentCharacterToken){switch(e&&this.currentCharacterToken.location&&(this.currentCharacterToken.location.endLine=e.startLine,this.currentCharacterToken.location.endCol=e.startCol,this.currentCharacterToken.location.endOffset=e.startOffset),this.currentCharacterToken.type){case B.CHARACTER:this.handler.onCharacter(this.currentCharacterToken);break;case B.NULL_CHARACTER:this.handler.onNullCharacter(this.currentCharacterToken);break;case B.WHITESPACE_CHARACTER:this.handler.onWhitespaceCharacter(this.currentCharacterToken);break}this.currentCharacterToken=null}}_emitEOFToken(){let e=this.getCurrentLocation(0);e&&(e.endLine=e.startLine,e.endCol=e.startCol,e.endOffset=e.startOffset),this._emitCurrentCharacterToken(e),this.handler.onEof({type:B.EOF,location:e}),this.active=!1}_appendCharToCurrentCharacterToken(e,t){if(this.currentCharacterToken)if(this.currentCharacterToken.type===e){this.currentCharacterToken.chars+=t;return}else this.currentLocation=this.getCurrentLocation(0),this._emitCurrentCharacterToken(this.currentLocation),this.preprocessor.dropParsedChunk();this._createCharacterToken(e,t)}_emitCodePoint(e){let t=uu(e)?B.WHITESPACE_CHARACTER:e===R.NULL?B.NULL_CHARACTER:B.CHARACTER;this._appendCharToCurrentCharacterToken(t,String.fromCodePoint(e))}_emitChars(e){this._appendCharToCurrentCharacterToken(B.CHARACTER,e)}_startCharacterReference(){this.returnState=this.state,this.state=Y.CHARACTER_REFERENCE,this.entityStartPos=this.preprocessor.pos,this.entityDecoder.startEntity(this._isCharacterReferenceInAttribute()?Jl.Attribute:Jl.Legacy)}_isCharacterReferenceInAttribute(){return this.returnState===Y.ATTRIBUTE_VALUE_DOUBLE_QUOTED||this.returnState===Y.ATTRIBUTE_VALUE_SINGLE_QUOTED||this.returnState===Y.ATTRIBUTE_VALUE_UNQUOTED}_flushCodePointConsumedAsCharacterReference(e){this._isCharacterReferenceInAttribute()?this.currentAttr.value+=String.fromCodePoint(e):this._emitCodePoint(e)}_callState(e){switch(this.state){case Y.DATA:this._stateData(e);break;case Y.RCDATA:this._stateRcdata(e);break;case Y.RAWTEXT:this._stateRawtext(e);break;case Y.SCRIPT_DATA:this._stateScriptData(e);break;case Y.PLAINTEXT:this._statePlaintext(e);break;case Y.TAG_OPEN:this._stateTagOpen(e);break;case Y.END_TAG_OPEN:this._stateEndTagOpen(e);break;case Y.TAG_NAME:this._stateTagName(e);break;case Y.RCDATA_LESS_THAN_SIGN:this._stateRcdataLessThanSign(e);break;case Y.RCDATA_END_TAG_OPEN:this._stateRcdataEndTagOpen(e);break;case Y.RCDATA_END_TAG_NAME:this._stateRcdataEndTagName(e);break;case Y.RAWTEXT_LESS_THAN_SIGN:this._stateRawtextLessThanSign(e);break;case Y.RAWTEXT_END_TAG_OPEN:this._stateRawtextEndTagOpen(e);break;case Y.RAWTEXT_END_TAG_NAME:this._stateRawtextEndTagName(e);break;case Y.SCRIPT_DATA_LESS_THAN_SIGN:this._stateScriptDataLessThanSign(e);break;case Y.SCRIPT_DATA_END_TAG_OPEN:this._stateScriptDataEndTagOpen(e);break;case Y.SCRIPT_DATA_END_TAG_NAME:this._stateScriptDataEndTagName(e);break;case Y.SCRIPT_DATA_ESCAPE_START:this._stateScriptDataEscapeStart(e);break;case Y.SCRIPT_DATA_ESCAPE_START_DASH:this._stateScriptDataEscapeStartDash(e);break;case Y.SCRIPT_DATA_ESCAPED:this._stateScriptDataEscaped(e);break;case Y.SCRIPT_DATA_ESCAPED_DASH:this._stateScriptDataEscapedDash(e);break;case Y.SCRIPT_DATA_ESCAPED_DASH_DASH:this._stateScriptDataEscapedDashDash(e);break;case Y.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataEscapedLessThanSign(e);break;case Y.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:this._stateScriptDataEscapedEndTagOpen(e);break;case Y.SCRIPT_DATA_ESCAPED_END_TAG_NAME:this._stateScriptDataEscapedEndTagName(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPE_START:this._stateScriptDataDoubleEscapeStart(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPED:this._stateScriptDataDoubleEscaped(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPED_DASH:this._stateScriptDataDoubleEscapedDash(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH:this._stateScriptDataDoubleEscapedDashDash(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN:this._stateScriptDataDoubleEscapedLessThanSign(e);break;case Y.SCRIPT_DATA_DOUBLE_ESCAPE_END:this._stateScriptDataDoubleEscapeEnd(e);break;case Y.BEFORE_ATTRIBUTE_NAME:this._stateBeforeAttributeName(e);break;case Y.ATTRIBUTE_NAME:this._stateAttributeName(e);break;case Y.AFTER_ATTRIBUTE_NAME:this._stateAfterAttributeName(e);break;case Y.BEFORE_ATTRIBUTE_VALUE:this._stateBeforeAttributeValue(e);break;case Y.ATTRIBUTE_VALUE_DOUBLE_QUOTED:this._stateAttributeValueDoubleQuoted(e);break;case Y.ATTRIBUTE_VALUE_SINGLE_QUOTED:this._stateAttributeValueSingleQuoted(e);break;case Y.ATTRIBUTE_VALUE_UNQUOTED:this._stateAttributeValueUnquoted(e);break;case Y.AFTER_ATTRIBUTE_VALUE_QUOTED:this._stateAfterAttributeValueQuoted(e);break;case Y.SELF_CLOSING_START_TAG:this._stateSelfClosingStartTag(e);break;case Y.BOGUS_COMMENT:this._stateBogusComment(e);break;case Y.MARKUP_DECLARATION_OPEN:this._stateMarkupDeclarationOpen(e);break;case Y.COMMENT_START:this._stateCommentStart(e);break;case Y.COMMENT_START_DASH:this._stateCommentStartDash(e);break;case Y.COMMENT:this._stateComment(e);break;case Y.COMMENT_LESS_THAN_SIGN:this._stateCommentLessThanSign(e);break;case Y.COMMENT_LESS_THAN_SIGN_BANG:this._stateCommentLessThanSignBang(e);break;case Y.COMMENT_LESS_THAN_SIGN_BANG_DASH:this._stateCommentLessThanSignBangDash(e);break;case Y.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:this._stateCommentLessThanSignBangDashDash(e);break;case Y.COMMENT_END_DASH:this._stateCommentEndDash(e);break;case Y.COMMENT_END:this._stateCommentEnd(e);break;case Y.COMMENT_END_BANG:this._stateCommentEndBang(e);break;case Y.DOCTYPE:this._stateDoctype(e);break;case Y.BEFORE_DOCTYPE_NAME:this._stateBeforeDoctypeName(e);break;case Y.DOCTYPE_NAME:this._stateDoctypeName(e);break;case Y.AFTER_DOCTYPE_NAME:this._stateAfterDoctypeName(e);break;case Y.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._stateAfterDoctypePublicKeyword(e);break;case Y.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER:this._stateBeforeDoctypePublicIdentifier(e);break;case Y.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypePublicIdentifierDoubleQuoted(e);break;case Y.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypePublicIdentifierSingleQuoted(e);break;case Y.AFTER_DOCTYPE_PUBLIC_IDENTIFIER:this._stateAfterDoctypePublicIdentifier(e);break;case Y.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS:this._stateBetweenDoctypePublicAndSystemIdentifiers(e);break;case Y.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._stateAfterDoctypeSystemKeyword(e);break;case Y.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER:this._stateBeforeDoctypeSystemIdentifier(e);break;case Y.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED:this._stateDoctypeSystemIdentifierDoubleQuoted(e);break;case Y.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED:this._stateDoctypeSystemIdentifierSingleQuoted(e);break;case Y.AFTER_DOCTYPE_SYSTEM_IDENTIFIER:this._stateAfterDoctypeSystemIdentifier(e);break;case Y.BOGUS_DOCTYPE:this._stateBogusDoctype(e);break;case Y.CDATA_SECTION:this._stateCdataSection(e);break;case Y.CDATA_SECTION_BRACKET:this._stateCdataSectionBracket(e);break;case Y.CDATA_SECTION_END:this._stateCdataSectionEnd(e);break;case Y.CHARACTER_REFERENCE:this._stateCharacterReference();break;case Y.AMBIGUOUS_AMPERSAND:this._stateAmbiguousAmpersand(e);break;default:throw Error(`Unknown state`)}}_stateData(e){switch(e){case R.LESS_THAN_SIGN:this.state=Y.TAG_OPEN;break;case R.AMPERSAND:this._startCharacterReference();break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitCodePoint(e);break;case R.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateRcdata(e){switch(e){case R.AMPERSAND:this._startCharacterReference();break;case R.LESS_THAN_SIGN:this.state=Y.RCDATA_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateRawtext(e){switch(e){case R.LESS_THAN_SIGN:this.state=Y.RAWTEXT_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptData(e){switch(e){case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_statePlaintext(e){switch(e){case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateTagOpen(e){if(su(e))this._createStartTagToken(),this.state=Y.TAG_NAME,this._stateTagName(e);else switch(e){case R.EXCLAMATION_MARK:this.state=Y.MARKUP_DECLARATION_OPEN;break;case R.SOLIDUS:this.state=Y.END_TAG_OPEN;break;case R.QUESTION_MARK:this._err(z.unexpectedQuestionMarkInsteadOfTagName),this._createCommentToken(1),this.state=Y.BOGUS_COMMENT,this._stateBogusComment(e);break;case R.EOF:this._err(z.eofBeforeTagName),this._emitChars(`<`),this._emitEOFToken();break;default:this._err(z.invalidFirstCharacterOfTagName),this._emitChars(`<`),this.state=Y.DATA,this._stateData(e)}}_stateEndTagOpen(e){if(su(e))this._createEndTagToken(),this.state=Y.TAG_NAME,this._stateTagName(e);else switch(e){case R.GREATER_THAN_SIGN:this._err(z.missingEndTagName),this.state=Y.DATA;break;case R.EOF:this._err(z.eofBeforeTagName),this._emitChars(`</`),this._emitEOFToken();break;default:this._err(z.invalidFirstCharacterOfTagName),this._createCommentToken(2),this.state=Y.BOGUS_COMMENT,this._stateBogusComment(e)}}_stateTagName(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.BEFORE_ATTRIBUTE_NAME;break;case R.SOLIDUS:this.state=Y.SELF_CLOSING_START_TAG;break;case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentTagToken();break;case R.NULL:this._err(z.unexpectedNullCharacter),t.tagName+=`�`;break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:t.tagName+=String.fromCodePoint(au(e)?lu(e):e)}}_stateRcdataLessThanSign(e){e===R.SOLIDUS?this.state=Y.RCDATA_END_TAG_OPEN:(this._emitChars(`<`),this.state=Y.RCDATA,this._stateRcdata(e))}_stateRcdataEndTagOpen(e){su(e)?(this.state=Y.RCDATA_END_TAG_NAME,this._stateRcdataEndTagName(e)):(this._emitChars(`</`),this.state=Y.RCDATA,this._stateRcdata(e))}handleSpecialEndTag(e){if(!this.preprocessor.startsWith(this.lastStartTagName,!1))return!this._ensureHibernation();this._createEndTagToken();let t=this.currentToken;switch(t.tagName=this.lastStartTagName,this.preprocessor.peek(this.lastStartTagName.length)){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:return this._advanceBy(this.lastStartTagName.length),this.state=Y.BEFORE_ATTRIBUTE_NAME,!1;case R.SOLIDUS:return this._advanceBy(this.lastStartTagName.length),this.state=Y.SELF_CLOSING_START_TAG,!1;case R.GREATER_THAN_SIGN:return this._advanceBy(this.lastStartTagName.length),this.emitCurrentTagToken(),this.state=Y.DATA,!1;default:return!this._ensureHibernation()}}_stateRcdataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Y.RCDATA,this._stateRcdata(e))}_stateRawtextLessThanSign(e){e===R.SOLIDUS?this.state=Y.RAWTEXT_END_TAG_OPEN:(this._emitChars(`<`),this.state=Y.RAWTEXT,this._stateRawtext(e))}_stateRawtextEndTagOpen(e){su(e)?(this.state=Y.RAWTEXT_END_TAG_NAME,this._stateRawtextEndTagName(e)):(this._emitChars(`</`),this.state=Y.RAWTEXT,this._stateRawtext(e))}_stateRawtextEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Y.RAWTEXT,this._stateRawtext(e))}_stateScriptDataLessThanSign(e){switch(e){case R.SOLIDUS:this.state=Y.SCRIPT_DATA_END_TAG_OPEN;break;case R.EXCLAMATION_MARK:this.state=Y.SCRIPT_DATA_ESCAPE_START,this._emitChars(`<!`);break;default:this._emitChars(`<`),this.state=Y.SCRIPT_DATA,this._stateScriptData(e)}}_stateScriptDataEndTagOpen(e){su(e)?(this.state=Y.SCRIPT_DATA_END_TAG_NAME,this._stateScriptDataEndTagName(e)):(this._emitChars(`</`),this.state=Y.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Y.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscapeStart(e){e===R.HYPHEN_MINUS?(this.state=Y.SCRIPT_DATA_ESCAPE_START_DASH,this._emitChars(`-`)):(this.state=Y.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscapeStartDash(e){e===R.HYPHEN_MINUS?(this.state=Y.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars(`-`)):(this.state=Y.SCRIPT_DATA,this._stateScriptData(e))}_stateScriptDataEscaped(e){switch(e){case R.HYPHEN_MINUS:this.state=Y.SCRIPT_DATA_ESCAPED_DASH,this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptDataEscapedDash(e){switch(e){case R.HYPHEN_MINUS:this.state=Y.SCRIPT_DATA_ESCAPED_DASH_DASH,this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),this.state=Y.SCRIPT_DATA_ESCAPED,this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Y.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataEscapedDashDash(e){switch(e){case R.HYPHEN_MINUS:this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_ESCAPED_LESS_THAN_SIGN;break;case R.GREATER_THAN_SIGN:this.state=Y.SCRIPT_DATA,this._emitChars(`>`);break;case R.NULL:this._err(z.unexpectedNullCharacter),this.state=Y.SCRIPT_DATA_ESCAPED,this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Y.SCRIPT_DATA_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataEscapedLessThanSign(e){e===R.SOLIDUS?this.state=Y.SCRIPT_DATA_ESCAPED_END_TAG_OPEN:su(e)?(this._emitChars(`<`),this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPE_START,this._stateScriptDataDoubleEscapeStart(e)):(this._emitChars(`<`),this.state=Y.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataEscapedEndTagOpen(e){su(e)?(this.state=Y.SCRIPT_DATA_ESCAPED_END_TAG_NAME,this._stateScriptDataEscapedEndTagName(e)):(this._emitChars(`</`),this.state=Y.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataEscapedEndTagName(e){this.handleSpecialEndTag(e)&&(this._emitChars(`</`),this.state=Y.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataDoubleEscapeStart(e){if(this.preprocessor.startsWith(Ml.SCRIPT,!1)&&du(this.preprocessor.peek(Ml.SCRIPT.length))){this._emitCodePoint(e);for(let e=0;e<Ml.SCRIPT.length;e++)this._emitCodePoint(this._consume());this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED}else this._ensureHibernation()||(this.state=Y.SCRIPT_DATA_ESCAPED,this._stateScriptDataEscaped(e))}_stateScriptDataDoubleEscaped(e){switch(e){case R.HYPHEN_MINUS:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED_DASH,this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case R.NULL:this._err(z.unexpectedNullCharacter),this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedDash(e){switch(e){case R.HYPHEN_MINUS:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED_DASH_DASH,this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case R.NULL:this._err(z.unexpectedNullCharacter),this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedDashDash(e){switch(e){case R.HYPHEN_MINUS:this._emitChars(`-`);break;case R.LESS_THAN_SIGN:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED_LESS_THAN_SIGN,this._emitChars(`<`);break;case R.GREATER_THAN_SIGN:this.state=Y.SCRIPT_DATA,this._emitChars(`>`);break;case R.NULL:this._err(z.unexpectedNullCharacter),this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitChars(`�`);break;case R.EOF:this._err(z.eofInScriptHtmlCommentLikeText),this._emitEOFToken();break;default:this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._emitCodePoint(e)}}_stateScriptDataDoubleEscapedLessThanSign(e){e===R.SOLIDUS?(this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPE_END,this._emitChars(`/`)):(this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e))}_stateScriptDataDoubleEscapeEnd(e){if(this.preprocessor.startsWith(Ml.SCRIPT,!1)&&du(this.preprocessor.peek(Ml.SCRIPT.length))){this._emitCodePoint(e);for(let e=0;e<Ml.SCRIPT.length;e++)this._emitCodePoint(this._consume());this.state=Y.SCRIPT_DATA_ESCAPED}else this._ensureHibernation()||(this.state=Y.SCRIPT_DATA_DOUBLE_ESCAPED,this._stateScriptDataDoubleEscaped(e))}_stateBeforeAttributeName(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.SOLIDUS:case R.GREATER_THAN_SIGN:case R.EOF:this.state=Y.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case R.EQUALS_SIGN:this._err(z.unexpectedEqualsSignBeforeAttributeName),this._createAttr(`=`),this.state=Y.ATTRIBUTE_NAME;break;default:this._createAttr(``),this.state=Y.ATTRIBUTE_NAME,this._stateAttributeName(e)}}_stateAttributeName(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:case R.SOLIDUS:case R.GREATER_THAN_SIGN:case R.EOF:this._leaveAttrName(),this.state=Y.AFTER_ATTRIBUTE_NAME,this._stateAfterAttributeName(e);break;case R.EQUALS_SIGN:this._leaveAttrName(),this.state=Y.BEFORE_ATTRIBUTE_VALUE;break;case R.QUOTATION_MARK:case R.APOSTROPHE:case R.LESS_THAN_SIGN:this._err(z.unexpectedCharacterInAttributeName),this.currentAttr.name+=String.fromCodePoint(e);break;case R.NULL:this._err(z.unexpectedNullCharacter),this.currentAttr.name+=`�`;break;default:this.currentAttr.name+=String.fromCodePoint(au(e)?lu(e):e)}}_stateAfterAttributeName(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.SOLIDUS:this.state=Y.SELF_CLOSING_START_TAG;break;case R.EQUALS_SIGN:this.state=Y.BEFORE_ATTRIBUTE_VALUE;break;case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentTagToken();break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this._createAttr(``),this.state=Y.ATTRIBUTE_NAME,this._stateAttributeName(e)}}_stateBeforeAttributeValue(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.QUOTATION_MARK:this.state=Y.ATTRIBUTE_VALUE_DOUBLE_QUOTED;break;case R.APOSTROPHE:this.state=Y.ATTRIBUTE_VALUE_SINGLE_QUOTED;break;case R.GREATER_THAN_SIGN:this._err(z.missingAttributeValue),this.state=Y.DATA,this.emitCurrentTagToken();break;default:this.state=Y.ATTRIBUTE_VALUE_UNQUOTED,this._stateAttributeValueUnquoted(e)}}_stateAttributeValueDoubleQuoted(e){switch(e){case R.QUOTATION_MARK:this.state=Y.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case R.AMPERSAND:this._startCharacterReference();break;case R.NULL:this._err(z.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAttributeValueSingleQuoted(e){switch(e){case R.APOSTROPHE:this.state=Y.AFTER_ATTRIBUTE_VALUE_QUOTED;break;case R.AMPERSAND:this._startCharacterReference();break;case R.NULL:this._err(z.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAttributeValueUnquoted(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this._leaveAttrValue(),this.state=Y.BEFORE_ATTRIBUTE_NAME;break;case R.AMPERSAND:this._startCharacterReference();break;case R.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=Y.DATA,this.emitCurrentTagToken();break;case R.NULL:this._err(z.unexpectedNullCharacter),this.currentAttr.value+=`�`;break;case R.QUOTATION_MARK:case R.APOSTROPHE:case R.LESS_THAN_SIGN:case R.EQUALS_SIGN:case R.GRAVE_ACCENT:this._err(z.unexpectedCharacterInUnquotedAttributeValue),this.currentAttr.value+=String.fromCodePoint(e);break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this.currentAttr.value+=String.fromCodePoint(e)}}_stateAfterAttributeValueQuoted(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this._leaveAttrValue(),this.state=Y.BEFORE_ATTRIBUTE_NAME;break;case R.SOLIDUS:this._leaveAttrValue(),this.state=Y.SELF_CLOSING_START_TAG;break;case R.GREATER_THAN_SIGN:this._leaveAttrValue(),this.state=Y.DATA,this.emitCurrentTagToken();break;case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this._err(z.missingWhitespaceBetweenAttributes),this.state=Y.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e)}}_stateSelfClosingStartTag(e){switch(e){case R.GREATER_THAN_SIGN:{let e=this.currentToken;e.selfClosing=!0,this.state=Y.DATA,this.emitCurrentTagToken();break}case R.EOF:this._err(z.eofInTag),this._emitEOFToken();break;default:this._err(z.unexpectedSolidusInTag),this.state=Y.BEFORE_ATTRIBUTE_NAME,this._stateBeforeAttributeName(e)}}_stateBogusComment(e){let t=this.currentToken;switch(e){case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentComment(t);break;case R.EOF:this.emitCurrentComment(t),this._emitEOFToken();break;case R.NULL:this._err(z.unexpectedNullCharacter),t.data+=`�`;break;default:t.data+=String.fromCodePoint(e)}}_stateMarkupDeclarationOpen(e){this._consumeSequenceIfMatch(Ml.DASH_DASH,!0)?(this._createCommentToken(Ml.DASH_DASH.length+1),this.state=Y.COMMENT_START):this._consumeSequenceIfMatch(Ml.DOCTYPE,!1)?(this.currentLocation=this.getCurrentLocation(Ml.DOCTYPE.length+1),this.state=Y.DOCTYPE):this._consumeSequenceIfMatch(Ml.CDATA_START,!0)?this.inForeignNode?this.state=Y.CDATA_SECTION:(this._err(z.cdataInHtmlContent),this._createCommentToken(Ml.CDATA_START.length+1),this.currentToken.data=`[CDATA[`,this.state=Y.BOGUS_COMMENT):this._ensureHibernation()||(this._err(z.incorrectlyOpenedComment),this._createCommentToken(2),this.state=Y.BOGUS_COMMENT,this._stateBogusComment(e))}_stateCommentStart(e){switch(e){case R.HYPHEN_MINUS:this.state=Y.COMMENT_START_DASH;break;case R.GREATER_THAN_SIGN:{this._err(z.abruptClosingOfEmptyComment),this.state=Y.DATA;let e=this.currentToken;this.emitCurrentComment(e);break}default:this.state=Y.COMMENT,this._stateComment(e)}}_stateCommentStartDash(e){let t=this.currentToken;switch(e){case R.HYPHEN_MINUS:this.state=Y.COMMENT_END;break;case R.GREATER_THAN_SIGN:this._err(z.abruptClosingOfEmptyComment),this.state=Y.DATA,this.emitCurrentComment(t);break;case R.EOF:this._err(z.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`-`,this.state=Y.COMMENT,this._stateComment(e)}}_stateComment(e){let t=this.currentToken;switch(e){case R.HYPHEN_MINUS:this.state=Y.COMMENT_END_DASH;break;case R.LESS_THAN_SIGN:t.data+=`<`,this.state=Y.COMMENT_LESS_THAN_SIGN;break;case R.NULL:this._err(z.unexpectedNullCharacter),t.data+=`�`;break;case R.EOF:this._err(z.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=String.fromCodePoint(e)}}_stateCommentLessThanSign(e){let t=this.currentToken;switch(e){case R.EXCLAMATION_MARK:t.data+=`!`,this.state=Y.COMMENT_LESS_THAN_SIGN_BANG;break;case R.LESS_THAN_SIGN:t.data+=`<`;break;default:this.state=Y.COMMENT,this._stateComment(e)}}_stateCommentLessThanSignBang(e){e===R.HYPHEN_MINUS?this.state=Y.COMMENT_LESS_THAN_SIGN_BANG_DASH:(this.state=Y.COMMENT,this._stateComment(e))}_stateCommentLessThanSignBangDash(e){e===R.HYPHEN_MINUS?this.state=Y.COMMENT_LESS_THAN_SIGN_BANG_DASH_DASH:(this.state=Y.COMMENT_END_DASH,this._stateCommentEndDash(e))}_stateCommentLessThanSignBangDashDash(e){e!==R.GREATER_THAN_SIGN&&e!==R.EOF&&this._err(z.nestedComment),this.state=Y.COMMENT_END,this._stateCommentEnd(e)}_stateCommentEndDash(e){let t=this.currentToken;switch(e){case R.HYPHEN_MINUS:this.state=Y.COMMENT_END;break;case R.EOF:this._err(z.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`-`,this.state=Y.COMMENT,this._stateComment(e)}}_stateCommentEnd(e){let t=this.currentToken;switch(e){case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentComment(t);break;case R.EXCLAMATION_MARK:this.state=Y.COMMENT_END_BANG;break;case R.HYPHEN_MINUS:t.data+=`-`;break;case R.EOF:this._err(z.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`--`,this.state=Y.COMMENT,this._stateComment(e)}}_stateCommentEndBang(e){let t=this.currentToken;switch(e){case R.HYPHEN_MINUS:t.data+=`--!`,this.state=Y.COMMENT_END_DASH;break;case R.GREATER_THAN_SIGN:this._err(z.incorrectlyClosedComment),this.state=Y.DATA,this.emitCurrentComment(t);break;case R.EOF:this._err(z.eofInComment),this.emitCurrentComment(t),this._emitEOFToken();break;default:t.data+=`--!`,this.state=Y.COMMENT,this._stateComment(e)}}_stateDoctype(e){switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.BEFORE_DOCTYPE_NAME;break;case R.GREATER_THAN_SIGN:this.state=Y.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e);break;case R.EOF:{this._err(z.eofInDoctype),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._err(z.missingWhitespaceBeforeDoctypeName),this.state=Y.BEFORE_DOCTYPE_NAME,this._stateBeforeDoctypeName(e)}}_stateBeforeDoctypeName(e){if(au(e))this._createDoctypeToken(String.fromCharCode(lu(e))),this.state=Y.DOCTYPE_NAME;else switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.NULL:this._err(z.unexpectedNullCharacter),this._createDoctypeToken(`�`),this.state=Y.DOCTYPE_NAME;break;case R.GREATER_THAN_SIGN:{this._err(z.missingDoctypeName),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this.state=Y.DATA;break}case R.EOF:{this._err(z.eofInDoctype),this._createDoctypeToken(null);let e=this.currentToken;e.forceQuirks=!0,this.emitCurrentDoctype(e),this._emitEOFToken();break}default:this._createDoctypeToken(String.fromCodePoint(e)),this.state=Y.DOCTYPE_NAME}}_stateDoctypeName(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.AFTER_DOCTYPE_NAME;break;case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.NULL:this._err(z.unexpectedNullCharacter),t.name+=`�`;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.name+=String.fromCodePoint(au(e)?lu(e):e)}}_stateAfterDoctypeName(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._consumeSequenceIfMatch(Ml.PUBLIC,!1)?this.state=Y.AFTER_DOCTYPE_PUBLIC_KEYWORD:this._consumeSequenceIfMatch(Ml.SYSTEM,!1)?this.state=Y.AFTER_DOCTYPE_SYSTEM_KEYWORD:this._ensureHibernation()||(this._err(z.invalidCharacterSequenceAfterDoctypeName),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e))}}_stateAfterDoctypePublicKeyword(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.BEFORE_DOCTYPE_PUBLIC_IDENTIFIER;break;case R.QUOTATION_MARK:this._err(z.missingWhitespaceAfterDoctypePublicKeyword),t.publicId=``,this.state=Y.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:this._err(z.missingWhitespaceAfterDoctypePublicKeyword),t.publicId=``,this.state=Y.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case R.GREATER_THAN_SIGN:this._err(z.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBeforeDoctypePublicIdentifier(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.QUOTATION_MARK:t.publicId=``,this.state=Y.DOCTYPE_PUBLIC_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:t.publicId=``,this.state=Y.DOCTYPE_PUBLIC_IDENTIFIER_SINGLE_QUOTED;break;case R.GREATER_THAN_SIGN:this._err(z.missingDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypePublicIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateDoctypePublicIdentifierDoubleQuoted(e){let t=this.currentToken;switch(e){case R.QUOTATION_MARK:this.state=Y.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case R.NULL:this._err(z.unexpectedNullCharacter),t.publicId+=`�`;break;case R.GREATER_THAN_SIGN:this._err(z.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e)}}_stateDoctypePublicIdentifierSingleQuoted(e){let t=this.currentToken;switch(e){case R.APOSTROPHE:this.state=Y.AFTER_DOCTYPE_PUBLIC_IDENTIFIER;break;case R.NULL:this._err(z.unexpectedNullCharacter),t.publicId+=`�`;break;case R.GREATER_THAN_SIGN:this._err(z.abruptDoctypePublicIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.publicId+=String.fromCodePoint(e)}}_stateAfterDoctypePublicIdentifier(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.BETWEEN_DOCTYPE_PUBLIC_AND_SYSTEM_IDENTIFIERS;break;case R.GREATER_THAN_SIGN:this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.QUOTATION_MARK:this._err(z.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:this._err(z.missingWhitespaceBetweenDoctypePublicAndSystemIdentifiers),t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBetweenDoctypePublicAndSystemIdentifiers(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.QUOTATION_MARK:t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateAfterDoctypeSystemKeyword(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:this.state=Y.BEFORE_DOCTYPE_SYSTEM_IDENTIFIER;break;case R.QUOTATION_MARK:this._err(z.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:this._err(z.missingWhitespaceAfterDoctypeSystemKeyword),t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case R.GREATER_THAN_SIGN:this._err(z.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBeforeDoctypeSystemIdentifier(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.QUOTATION_MARK:t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_DOUBLE_QUOTED;break;case R.APOSTROPHE:t.systemId=``,this.state=Y.DOCTYPE_SYSTEM_IDENTIFIER_SINGLE_QUOTED;break;case R.GREATER_THAN_SIGN:this._err(z.missingDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.DATA,this.emitCurrentDoctype(t);break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.missingQuoteBeforeDoctypeSystemIdentifier),t.forceQuirks=!0,this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateDoctypeSystemIdentifierDoubleQuoted(e){let t=this.currentToken;switch(e){case R.QUOTATION_MARK:this.state=Y.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case R.NULL:this._err(z.unexpectedNullCharacter),t.systemId+=`�`;break;case R.GREATER_THAN_SIGN:this._err(z.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e)}}_stateDoctypeSystemIdentifierSingleQuoted(e){let t=this.currentToken;switch(e){case R.APOSTROPHE:this.state=Y.AFTER_DOCTYPE_SYSTEM_IDENTIFIER;break;case R.NULL:this._err(z.unexpectedNullCharacter),t.systemId+=`�`;break;case R.GREATER_THAN_SIGN:this._err(z.abruptDoctypeSystemIdentifier),t.forceQuirks=!0,this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:t.systemId+=String.fromCodePoint(e)}}_stateAfterDoctypeSystemIdentifier(e){let t=this.currentToken;switch(e){case R.SPACE:case R.LINE_FEED:case R.TABULATION:case R.FORM_FEED:break;case R.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.EOF:this._err(z.eofInDoctype),t.forceQuirks=!0,this.emitCurrentDoctype(t),this._emitEOFToken();break;default:this._err(z.unexpectedCharacterAfterDoctypeSystemIdentifier),this.state=Y.BOGUS_DOCTYPE,this._stateBogusDoctype(e)}}_stateBogusDoctype(e){let t=this.currentToken;switch(e){case R.GREATER_THAN_SIGN:this.emitCurrentDoctype(t),this.state=Y.DATA;break;case R.NULL:this._err(z.unexpectedNullCharacter);break;case R.EOF:this.emitCurrentDoctype(t),this._emitEOFToken();break;default:}}_stateCdataSection(e){switch(e){case R.RIGHT_SQUARE_BRACKET:this.state=Y.CDATA_SECTION_BRACKET;break;case R.EOF:this._err(z.eofInCdata),this._emitEOFToken();break;default:this._emitCodePoint(e)}}_stateCdataSectionBracket(e){e===R.RIGHT_SQUARE_BRACKET?this.state=Y.CDATA_SECTION_END:(this._emitChars(`]`),this.state=Y.CDATA_SECTION,this._stateCdataSection(e))}_stateCdataSectionEnd(e){switch(e){case R.GREATER_THAN_SIGN:this.state=Y.DATA;break;case R.RIGHT_SQUARE_BRACKET:this._emitChars(`]`);break;default:this._emitChars(`]]`),this.state=Y.CDATA_SECTION,this._stateCdataSection(e)}}_stateCharacterReference(){let e=this.entityDecoder.write(this.preprocessor.html,this.preprocessor.pos);if(e<0)if(this.preprocessor.lastChunkWritten)e=this.entityDecoder.end();else{this.active=!1,this.preprocessor.pos=this.preprocessor.html.length-1,this.consumedAfterSnapshot=0,this.preprocessor.endOfChunkHit=!0;return}e===0?(this.preprocessor.pos=this.entityStartPos,this._flushCodePointConsumedAsCharacterReference(R.AMPERSAND),this.state=!this._isCharacterReferenceInAttribute()&&cu(this.preprocessor.peek(1))?Y.AMBIGUOUS_AMPERSAND:this.returnState):this.state=this.returnState}_stateAmbiguousAmpersand(e){cu(e)?this._flushCodePointConsumedAsCharacterReference(e):(e===R.SEMICOLON&&this._err(z.unknownNamedCharacterReference),this.state=this.returnState,this._callState(e))}},mu=new Set([q.DD,q.DT,q.LI,q.OPTGROUP,q.OPTION,q.P,q.RB,q.RP,q.RT,q.RTC]),hu=new Set([...mu,q.CAPTION,q.COLGROUP,q.TBODY,q.TD,q.TFOOT,q.TH,q.THEAD,q.TR]),gu=new Set([q.APPLET,q.CAPTION,q.HTML,q.MARQUEE,q.OBJECT,q.TABLE,q.TD,q.TEMPLATE,q.TH]),_u=new Set([...gu,q.OL,q.UL]),vu=new Set([...gu,q.BUTTON]),yu=new Set([q.ANNOTATION_XML,q.MI,q.MN,q.MO,q.MS,q.MTEXT]),bu=new Set([q.DESC,q.FOREIGN_OBJECT,q.TITLE]),xu=new Set([q.TR,q.TEMPLATE,q.HTML]),Su=new Set([q.TBODY,q.TFOOT,q.THEAD,q.TEMPLATE,q.HTML]),Cu=new Set([q.TABLE,q.TEMPLATE,q.HTML]),wu=new Set([q.TD,q.TH]),Tu=class{get currentTmplContentOrNode(){return this._isInTemplate()?this.treeAdapter.getTemplateContent(this.current):this.current}constructor(e,t,n){this.treeAdapter=t,this.handler=n,this.items=[],this.tagIDs=[],this.stackTop=-1,this.tmplCount=0,this.currentTagId=q.UNKNOWN,this.current=e}_indexOf(e){return this.items.lastIndexOf(e,this.stackTop)}_isInTemplate(){return this.currentTagId===q.TEMPLATE&&this.treeAdapter.getNamespaceURI(this.current)===G.HTML}_updateCurrentElement(){this.current=this.items[this.stackTop],this.currentTagId=this.tagIDs[this.stackTop]}push(e,t){this.stackTop++,this.items[this.stackTop]=e,this.current=e,this.tagIDs[this.stackTop]=t,this.currentTagId=t,this._isInTemplate()&&this.tmplCount++,this.handler.onItemPush(e,t,!0)}pop(){let e=this.current;this.tmplCount>0&&this._isInTemplate()&&this.tmplCount--,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!0)}replace(e,t){let n=this._indexOf(e);this.items[n]=t,n===this.stackTop&&(this.current=t)}insertAfter(e,t,n){let r=this._indexOf(e)+1;this.items.splice(r,0,t),this.tagIDs.splice(r,0,n),this.stackTop++,r===this.stackTop&&this._updateCurrentElement(),this.current&&this.currentTagId!==void 0&&this.handler.onItemPush(this.current,this.currentTagId,r===this.stackTop)}popUntilTagNamePopped(e){let t=this.stackTop+1;do t=this.tagIDs.lastIndexOf(e,t-1);while(t>0&&this.treeAdapter.getNamespaceURI(this.items[t])!==G.HTML);this.shortenToLength(Math.max(t,0))}shortenToLength(e){for(;this.stackTop>=e;){let t=this.current;this.tmplCount>0&&this._isInTemplate()&&--this.tmplCount,this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(t,this.stackTop<e)}}popUntilElementPopped(e){let t=this._indexOf(e);this.shortenToLength(Math.max(t,0))}popUntilPopped(e,t){let n=this._indexOfTagNames(e,t);this.shortenToLength(Math.max(n,0))}popUntilNumberedHeaderPopped(){this.popUntilPopped(nu,G.HTML)}popUntilTableCellPopped(){this.popUntilPopped(wu,G.HTML)}popAllUpToHtmlElement(){this.tmplCount=0,this.shortenToLength(1)}_indexOfTagNames(e,t){for(let n=this.stackTop;n>=0;n--)if(e.has(this.tagIDs[n])&&this.treeAdapter.getNamespaceURI(this.items[n])===t)return n;return-1}clearBackTo(e,t){let n=this._indexOfTagNames(e,t);this.shortenToLength(n+1)}clearBackToTableContext(){this.clearBackTo(Cu,G.HTML)}clearBackToTableBodyContext(){this.clearBackTo(Su,G.HTML)}clearBackToTableRowContext(){this.clearBackTo(xu,G.HTML)}remove(e){let t=this._indexOf(e);t>=0&&(t===this.stackTop?this.pop():(this.items.splice(t,1),this.tagIDs.splice(t,1),this.stackTop--,this._updateCurrentElement(),this.handler.onItemPop(e,!1)))}tryPeekProperlyNestedBodyElement(){return this.stackTop>=1&&this.tagIDs[1]===q.BODY?this.items[1]:null}contains(e){return this._indexOf(e)>-1}getCommonAncestor(e){let t=this._indexOf(e)-1;return t>=0?this.items[t]:null}isRootHtmlElementCurrent(){return this.stackTop===0&&this.tagIDs[0]===q.HTML}hasInDynamicScope(e,t){for(let n=this.stackTop;n>=0;n--){let r=this.tagIDs[n];switch(this.treeAdapter.getNamespaceURI(this.items[n])){case G.HTML:if(r===e)return!0;if(t.has(r))return!1;break;case G.SVG:if(bu.has(r))return!1;break;case G.MATHML:if(yu.has(r))return!1;break}}return!0}hasInScope(e){return this.hasInDynamicScope(e,gu)}hasInListItemScope(e){return this.hasInDynamicScope(e,_u)}hasInButtonScope(e){return this.hasInDynamicScope(e,vu)}hasNumberedHeaderInScope(){for(let e=this.stackTop;e>=0;e--){let t=this.tagIDs[e];switch(this.treeAdapter.getNamespaceURI(this.items[e])){case G.HTML:if(nu.has(t))return!0;if(gu.has(t))return!1;break;case G.SVG:if(bu.has(t))return!1;break;case G.MATHML:if(yu.has(t))return!1;break}}return!0}hasInTableScope(e){for(let t=this.stackTop;t>=0;t--)if(this.treeAdapter.getNamespaceURI(this.items[t])===G.HTML)switch(this.tagIDs[t]){case e:return!0;case q.TABLE:case q.HTML:return!1}return!0}hasTableBodyContextInTableScope(){for(let e=this.stackTop;e>=0;e--)if(this.treeAdapter.getNamespaceURI(this.items[e])===G.HTML)switch(this.tagIDs[e]){case q.TBODY:case q.THEAD:case q.TFOOT:return!0;case q.TABLE:case q.HTML:return!1}return!0}hasInSelectScope(e){for(let t=this.stackTop;t>=0;t--)if(this.treeAdapter.getNamespaceURI(this.items[t])===G.HTML)switch(this.tagIDs[t]){case e:return!0;case q.OPTION:case q.OPTGROUP:break;default:return!1}return!0}generateImpliedEndTags(){for(;this.currentTagId!==void 0&&mu.has(this.currentTagId);)this.pop()}generateImpliedEndTagsThoroughly(){for(;this.currentTagId!==void 0&&hu.has(this.currentTagId);)this.pop()}generateImpliedEndTagsWithExclusion(e){for(;this.currentTagId!==void 0&&this.currentTagId!==e&&hu.has(this.currentTagId);)this.pop()}},Eu=3,Du;(function(e){e[e.Marker=0]=`Marker`,e[e.Element=1]=`Element`})(Du||={});var Ou={type:Du.Marker},ku=class{constructor(e){this.treeAdapter=e,this.entries=[],this.bookmark=null}_getNoahArkConditionCandidates(e,t){let n=[],r=t.length,i=this.treeAdapter.getTagName(e),a=this.treeAdapter.getNamespaceURI(e);for(let e=0;e<this.entries.length;e++){let t=this.entries[e];if(t.type===Du.Marker)break;let{element:o}=t;if(this.treeAdapter.getTagName(o)===i&&this.treeAdapter.getNamespaceURI(o)===a){let t=this.treeAdapter.getAttrList(o);t.length===r&&n.push({idx:e,attrs:t})}}return n}_ensureNoahArkCondition(e){if(this.entries.length<Eu)return;let t=this.treeAdapter.getAttrList(e),n=this._getNoahArkConditionCandidates(e,t);if(n.length<Eu)return;let r=new Map(t.map(e=>[e.name,e.value])),i=0;for(let e=0;e<n.length;e++){let t=n[e];t.attrs.every(e=>r.get(e.name)===e.value)&&(i+=1,i>=Eu&&this.entries.splice(t.idx,1))}}insertMarker(){this.entries.unshift(Ou)}pushElement(e,t){this._ensureNoahArkCondition(e),this.entries.unshift({type:Du.Element,element:e,token:t})}insertElementAfterBookmark(e,t){let n=this.entries.indexOf(this.bookmark);this.entries.splice(n,0,{type:Du.Element,element:e,token:t})}removeEntry(e){let t=this.entries.indexOf(e);t!==-1&&this.entries.splice(t,1)}clearToLastMarker(){let e=this.entries.indexOf(Ou);e===-1?this.entries.length=0:this.entries.splice(0,e+1)}getElementEntryInScopeWithTagName(e){let t=this.entries.find(t=>t.type===Du.Marker||this.treeAdapter.getTagName(t.element)===e);return t&&t.type===Du.Element?t:null}getElementEntry(e){return this.entries.find(t=>t.type===Du.Element&&t.element===e)}},Au={createDocument(){return{nodeName:`#document`,mode:Ql.NO_QUIRKS,childNodes:[]}},createDocumentFragment(){return{nodeName:`#document-fragment`,childNodes:[]}},createElement(e,t,n){return{nodeName:e,tagName:e,attrs:n,namespaceURI:t,childNodes:[],parentNode:null}},createCommentNode(e){return{nodeName:`#comment`,data:e,parentNode:null}},createTextNode(e){return{nodeName:`#text`,value:e,parentNode:null}},appendChild(e,t){e.childNodes.push(t),t.parentNode=e},insertBefore(e,t,n){let r=e.childNodes.indexOf(n);e.childNodes.splice(r,0,t),t.parentNode=e},setTemplateContent(e,t){e.content=t},getTemplateContent(e){return e.content},setDocumentType(e,t,n,r){let i=e.childNodes.find(e=>e.nodeName===`#documentType`);if(i)i.name=t,i.publicId=n,i.systemId=r;else{let i={nodeName:`#documentType`,name:t,publicId:n,systemId:r,parentNode:null};Au.appendChild(e,i)}},setDocumentMode(e,t){e.mode=t},getDocumentMode(e){return e.mode},detachNode(e){if(e.parentNode){let t=e.parentNode.childNodes.indexOf(e);e.parentNode.childNodes.splice(t,1),e.parentNode=null}},insertText(e,t){if(e.childNodes.length>0){let n=e.childNodes[e.childNodes.length-1];if(Au.isTextNode(n)){n.value+=t;return}}Au.appendChild(e,Au.createTextNode(t))},insertTextBefore(e,t,n){let r=e.childNodes[e.childNodes.indexOf(n)-1];r&&Au.isTextNode(r)?r.value+=t:Au.insertBefore(e,Au.createTextNode(t),n)},adoptAttributes(e,t){let n=new Set(e.attrs.map(e=>e.name));for(let r=0;r<t.length;r++)n.has(t[r].name)||e.attrs.push(t[r])},getFirstChild(e){return e.childNodes[0]},getChildNodes(e){return e.childNodes},getParentNode(e){return e.parentNode},getAttrList(e){return e.attrs},getTagName(e){return e.tagName},getNamespaceURI(e){return e.namespaceURI},getTextNodeContent(e){return e.value},getCommentNodeContent(e){return e.data},getDocumentTypeNodeName(e){return e.name},getDocumentTypeNodePublicId(e){return e.publicId},getDocumentTypeNodeSystemId(e){return e.systemId},isTextNode(e){return e.nodeName===`#text`},isCommentNode(e){return e.nodeName===`#comment`},isDocumentTypeNode(e){return e.nodeName===`#documentType`},isElementNode(e){return Object.prototype.hasOwnProperty.call(e,`tagName`)},setNodeSourceCodeLocation(e,t){e.sourceCodeLocation=t},getNodeSourceCodeLocation(e){return e.sourceCodeLocation},updateNodeSourceCodeLocation(e,t){e.sourceCodeLocation={...e.sourceCodeLocation,...t}}},ju=`html`,Mu=`about:legacy-compat`,Nu=`http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd`,Pu=`+//silmaril//dtd html pro v0r11 19970101//,-//as//dtd html 3.0 aswedit + extensions//,-//advasoft ltd//dtd html 3.0 aswedit + extensions//,-//ietf//dtd html 2.0 level 1//,-//ietf//dtd html 2.0 level 2//,-//ietf//dtd html 2.0 strict level 1//,-//ietf//dtd html 2.0 strict level 2//,-//ietf//dtd html 2.0 strict//,-//ietf//dtd html 2.0//,-//ietf//dtd html 2.1e//,-//ietf//dtd html 3.0//,-//ietf//dtd html 3.2 final//,-//ietf//dtd html 3.2//,-//ietf//dtd html 3//,-//ietf//dtd html level 0//,-//ietf//dtd html level 1//,-//ietf//dtd html level 2//,-//ietf//dtd html level 3//,-//ietf//dtd html strict level 0//,-//ietf//dtd html strict level 1//,-//ietf//dtd html strict level 2//,-//ietf//dtd html strict level 3//,-//ietf//dtd html strict//,-//ietf//dtd html//,-//metrius//dtd metrius presentational//,-//microsoft//dtd internet explorer 2.0 html strict//,-//microsoft//dtd internet explorer 2.0 html//,-//microsoft//dtd internet explorer 2.0 tables//,-//microsoft//dtd internet explorer 3.0 html strict//,-//microsoft//dtd internet explorer 3.0 html//,-//microsoft//dtd internet explorer 3.0 tables//,-//netscape comm. corp.//dtd html//,-//netscape comm. corp.//dtd strict html//,-//o'reilly and associates//dtd html 2.0//,-//o'reilly and associates//dtd html extended 1.0//,-//o'reilly and associates//dtd html extended relaxed 1.0//,-//sq//dtd html 2.0 hotmetal + extensions//,-//softquad software//dtd hotmetal pro 6.0::19990601::extensions to html 4.0//,-//softquad//dtd hotmetal pro 4.0::19971010::extensions to html 4.0//,-//spyglass//dtd html 2.0 extended//,-//sun microsystems corp.//dtd hotjava html//,-//sun microsystems corp.//dtd hotjava strict html//,-//w3c//dtd html 3 1995-03-24//,-//w3c//dtd html 3.2 draft//,-//w3c//dtd html 3.2 final//,-//w3c//dtd html 3.2//,-//w3c//dtd html 3.2s draft//,-//w3c//dtd html 4.0 frameset//,-//w3c//dtd html 4.0 transitional//,-//w3c//dtd html experimental 19960712//,-//w3c//dtd html experimental 970421//,-//w3c//dtd w3 html//,-//w3o//dtd w3 html 3.0//,-//webtechs//dtd mozilla html 2.0//,-//webtechs//dtd mozilla html//`.split(`,`),Fu=[...Pu,`-//w3c//dtd html 4.01 frameset//`,`-//w3c//dtd html 4.01 transitional//`],Iu=new Set([`-//w3o//dtd w3 html strict 3.0//en//`,`-/w3c/dtd html 4.0 transitional/en`,`html`]),Lu=[`-//w3c//dtd xhtml 1.0 frameset//`,`-//w3c//dtd xhtml 1.0 transitional//`],Ru=[...Lu,`-//w3c//dtd html 4.01 frameset//`,`-//w3c//dtd html 4.01 transitional//`];function zu(e,t){return t.some(t=>e.startsWith(t))}function Bu(e){return e.name===ju&&e.publicId===null&&(e.systemId===null||e.systemId===Mu)}function Vu(e){if(e.name!==ju)return Ql.QUIRKS;let{systemId:t}=e;if(t&&t.toLowerCase()===Nu)return Ql.QUIRKS;let{publicId:n}=e;if(n!==null){if(n=n.toLowerCase(),Iu.has(n))return Ql.QUIRKS;let e=t===null?Fu:Pu;if(zu(n,e))return Ql.QUIRKS;if(e=t===null?Lu:Ru,zu(n,e))return Ql.LIMITED_QUIRKS}return Ql.NO_QUIRKS}var Hu={TEXT_HTML:`text/html`,APPLICATION_XML:`application/xhtml+xml`},Uu=`definitionurl`,Wu=`definitionURL`,Gu=new Map(`attributeName.attributeType.baseFrequency.baseProfile.calcMode.clipPathUnits.diffuseConstant.edgeMode.filterUnits.glyphRef.gradientTransform.gradientUnits.kernelMatrix.kernelUnitLength.keyPoints.keySplines.keyTimes.lengthAdjust.limitingConeAngle.markerHeight.markerUnits.markerWidth.maskContentUnits.maskUnits.numOctaves.pathLength.patternContentUnits.patternTransform.patternUnits.pointsAtX.pointsAtY.pointsAtZ.preserveAlpha.preserveAspectRatio.primitiveUnits.refX.refY.repeatCount.repeatDur.requiredExtensions.requiredFeatures.specularConstant.specularExponent.spreadMethod.startOffset.stdDeviation.stitchTiles.surfaceScale.systemLanguage.tableValues.targetX.targetY.textLength.viewBox.viewTarget.xChannelSelector.yChannelSelector.zoomAndPan`.split(`.`).map(e=>[e.toLowerCase(),e])),X=new Map([[`xlink:actuate`,{prefix:`xlink`,name:`actuate`,namespace:G.XLINK}],[`xlink:arcrole`,{prefix:`xlink`,name:`arcrole`,namespace:G.XLINK}],[`xlink:href`,{prefix:`xlink`,name:`href`,namespace:G.XLINK}],[`xlink:role`,{prefix:`xlink`,name:`role`,namespace:G.XLINK}],[`xlink:show`,{prefix:`xlink`,name:`show`,namespace:G.XLINK}],[`xlink:title`,{prefix:`xlink`,name:`title`,namespace:G.XLINK}],[`xlink:type`,{prefix:`xlink`,name:`type`,namespace:G.XLINK}],[`xml:lang`,{prefix:`xml`,name:`lang`,namespace:G.XML}],[`xml:space`,{prefix:`xml`,name:`space`,namespace:G.XML}],[`xmlns`,{prefix:``,name:`xmlns`,namespace:G.XMLNS}],[`xmlns:xlink`,{prefix:`xmlns`,name:`xlink`,namespace:G.XMLNS}]]),Ku=new Map(`altGlyph.altGlyphDef.altGlyphItem.animateColor.animateMotion.animateTransform.clipPath.feBlend.feColorMatrix.feComponentTransfer.feComposite.feConvolveMatrix.feDiffuseLighting.feDisplacementMap.feDistantLight.feFlood.feFuncA.feFuncB.feFuncG.feFuncR.feGaussianBlur.feImage.feMerge.feMergeNode.feMorphology.feOffset.fePointLight.feSpecularLighting.feSpotLight.feTile.feTurbulence.foreignObject.glyphRef.linearGradient.radialGradient.textPath`.split(`.`).map(e=>[e.toLowerCase(),e])),qu=new Set([q.B,q.BIG,q.BLOCKQUOTE,q.BODY,q.BR,q.CENTER,q.CODE,q.DD,q.DIV,q.DL,q.DT,q.EM,q.EMBED,q.H1,q.H2,q.H3,q.H4,q.H5,q.H6,q.HEAD,q.HR,q.I,q.IMG,q.LI,q.LISTING,q.MENU,q.META,q.NOBR,q.OL,q.P,q.PRE,q.RUBY,q.S,q.SMALL,q.SPAN,q.STRONG,q.STRIKE,q.SUB,q.SUP,q.TABLE,q.TT,q.U,q.UL,q.VAR]);function Ju(e){let t=e.tagID;return t===q.FONT&&e.attrs.some(({name:e})=>e===Zl.COLOR||e===Zl.SIZE||e===Zl.FACE)||qu.has(t)}function Yu(e){for(let t=0;t<e.attrs.length;t++)if(e.attrs[t].name===Uu){e.attrs[t].name=Wu;break}}function Xu(e){for(let t=0;t<e.attrs.length;t++){let n=Gu.get(e.attrs[t].name);n!=null&&(e.attrs[t].name=n)}}function Zu(e){for(let t=0;t<e.attrs.length;t++){let n=X.get(e.attrs[t].name);n&&(e.attrs[t].prefix=n.prefix,e.attrs[t].name=n.name,e.attrs[t].namespace=n.namespace)}}function Qu(e){let t=Ku.get(e.tagName);t!=null&&(e.tagName=t,e.tagID=eu(e.tagName))}function $u(e,t){return t===G.MATHML&&(e===q.MI||e===q.MO||e===q.MN||e===q.MS||e===q.MTEXT)}function ed(e,t,n){if(t===G.MATHML&&e===q.ANNOTATION_XML){for(let e=0;e<n.length;e++)if(n[e].name===Zl.ENCODING){let t=n[e].value.toLowerCase();return t===Hu.TEXT_HTML||t===Hu.APPLICATION_XML}}return t===G.SVG&&(e===q.FOREIGN_OBJECT||e===q.DESC||e===q.TITLE)}function td(e,t,n,r){return(!r||r===G.HTML)&&ed(e,t,n)||(!r||r===G.MATHML)&&$u(e,t)}var nd=`hidden`,rd=8,id=3,Z;(function(e){e[e.INITIAL=0]=`INITIAL`,e[e.BEFORE_HTML=1]=`BEFORE_HTML`,e[e.BEFORE_HEAD=2]=`BEFORE_HEAD`,e[e.IN_HEAD=3]=`IN_HEAD`,e[e.IN_HEAD_NO_SCRIPT=4]=`IN_HEAD_NO_SCRIPT`,e[e.AFTER_HEAD=5]=`AFTER_HEAD`,e[e.IN_BODY=6]=`IN_BODY`,e[e.TEXT=7]=`TEXT`,e[e.IN_TABLE=8]=`IN_TABLE`,e[e.IN_TABLE_TEXT=9]=`IN_TABLE_TEXT`,e[e.IN_CAPTION=10]=`IN_CAPTION`,e[e.IN_COLUMN_GROUP=11]=`IN_COLUMN_GROUP`,e[e.IN_TABLE_BODY=12]=`IN_TABLE_BODY`,e[e.IN_ROW=13]=`IN_ROW`,e[e.IN_CELL=14]=`IN_CELL`,e[e.IN_SELECT=15]=`IN_SELECT`,e[e.IN_SELECT_IN_TABLE=16]=`IN_SELECT_IN_TABLE`,e[e.IN_TEMPLATE=17]=`IN_TEMPLATE`,e[e.AFTER_BODY=18]=`AFTER_BODY`,e[e.IN_FRAMESET=19]=`IN_FRAMESET`,e[e.AFTER_FRAMESET=20]=`AFTER_FRAMESET`,e[e.AFTER_AFTER_BODY=21]=`AFTER_AFTER_BODY`,e[e.AFTER_AFTER_FRAMESET=22]=`AFTER_AFTER_FRAMESET`})(Z||={});var ad={startLine:-1,startCol:-1,startOffset:-1,endLine:-1,endCol:-1,endOffset:-1},od=new Set([q.TABLE,q.TBODY,q.TFOOT,q.THEAD,q.TR]),sd={scriptingEnabled:!0,sourceCodeLocationInfo:!1,treeAdapter:Au,onParseError:null},cd=class{constructor(e,t,n=null,r=null){this.fragmentContext=n,this.scriptHandler=r,this.currentToken=null,this.stopped=!1,this.insertionMode=Z.INITIAL,this.originalInsertionMode=Z.INITIAL,this.headElement=null,this.formElement=null,this.currentNotInHTML=!1,this.tmplInsertionModeStack=[],this.pendingCharacterTokens=[],this.hasNonWhitespacePendingCharacterToken=!1,this.framesetOk=!0,this.skipNextNewLine=!1,this.fosterParentingEnabled=!1,this.options={...sd,...e},this.treeAdapter=this.options.treeAdapter,this.onParseError=this.options.onParseError,this.onParseError&&(this.options.sourceCodeLocationInfo=!0),this.document=t??this.treeAdapter.createDocument(),this.tokenizer=new pu(this.options,this),this.activeFormattingElements=new ku(this.treeAdapter),this.fragmentContextID=n?eu(this.treeAdapter.getTagName(n)):q.UNKNOWN,this._setContextModes(n??this.document,this.fragmentContextID),this.openElements=new Tu(this.document,this.treeAdapter,this)}static parse(e,t){let n=new this(t);return n.tokenizer.write(e,!0),n.document}static getFragmentParser(e,t){let n={...sd,...t};e??=n.treeAdapter.createElement(K.TEMPLATE,G.HTML,[]);let r=n.treeAdapter.createElement(`documentmock`,G.HTML,[]),i=new this(n,r,e);return i.fragmentContextID===q.TEMPLATE&&i.tmplInsertionModeStack.unshift(Z.IN_TEMPLATE),i._initTokenizerForFragmentParsing(),i._insertFakeRootElement(),i._resetInsertionMode(),i._findFormInFragmentContext(),i}getFragment(){let e=this.treeAdapter.getFirstChild(this.document),t=this.treeAdapter.createDocumentFragment();return this._adoptNodes(e,t),t}_err(e,t,n){if(!this.onParseError)return;let r=e.location??ad,i={code:t,startLine:r.startLine,startCol:r.startCol,startOffset:r.startOffset,endLine:n?r.startLine:r.endLine,endCol:n?r.startCol:r.endCol,endOffset:n?r.startOffset:r.endOffset};this.onParseError(i)}onItemPush(e,t,n){var r,i;(i=(r=this.treeAdapter).onItemPush)==null||i.call(r,e),n&&this.openElements.stackTop>0&&this._setContextModes(e,t)}onItemPop(e,t){var n,r;if(this.options.sourceCodeLocationInfo&&this._setEndLocation(e,this.currentToken),(r=(n=this.treeAdapter).onItemPop)==null||r.call(n,e,this.openElements.current),t){let e,t;this.openElements.stackTop===0&&this.fragmentContext?(e=this.fragmentContext,t=this.fragmentContextID):{current:e,currentTagId:t}=this.openElements,this._setContextModes(e,t)}}_setContextModes(e,t){let n=e===this.document||e&&this.treeAdapter.getNamespaceURI(e)===G.HTML;this.currentNotInHTML=!n,this.tokenizer.inForeignNode=!n&&e!==void 0&&t!==void 0&&!this._isIntegrationPoint(t,e)}_switchToTextParsing(e,t){this._insertElement(e,G.HTML),this.tokenizer.state=t,this.originalInsertionMode=this.insertionMode,this.insertionMode=Z.TEXT}switchToPlaintextParsing(){this.insertionMode=Z.TEXT,this.originalInsertionMode=Z.IN_BODY,this.tokenizer.state=ru.PLAINTEXT}_getAdjustedCurrentElement(){return this.openElements.stackTop===0&&this.fragmentContext?this.fragmentContext:this.openElements.current}_findFormInFragmentContext(){let e=this.fragmentContext;for(;e;){if(this.treeAdapter.getTagName(e)===K.FORM){this.formElement=e;break}e=this.treeAdapter.getParentNode(e)}}_initTokenizerForFragmentParsing(){if(!(!this.fragmentContext||this.treeAdapter.getNamespaceURI(this.fragmentContext)!==G.HTML))switch(this.fragmentContextID){case q.TITLE:case q.TEXTAREA:this.tokenizer.state=ru.RCDATA;break;case q.STYLE:case q.XMP:case q.IFRAME:case q.NOEMBED:case q.NOFRAMES:case q.NOSCRIPT:this.tokenizer.state=ru.RAWTEXT;break;case q.SCRIPT:this.tokenizer.state=ru.SCRIPT_DATA;break;case q.PLAINTEXT:this.tokenizer.state=ru.PLAINTEXT;break;default:}}_setDocumentType(e){let t=e.name||``,n=e.publicId||``,r=e.systemId||``;if(this.treeAdapter.setDocumentType(this.document,t,n,r),e.location){let t=this.treeAdapter.getChildNodes(this.document).find(e=>this.treeAdapter.isDocumentTypeNode(e));t&&this.treeAdapter.setNodeSourceCodeLocation(t,e.location)}}_attachElementToTree(e,t){if(this.options.sourceCodeLocationInfo){let n=t&&{...t,startTag:t};this.treeAdapter.setNodeSourceCodeLocation(e,n)}if(this._shouldFosterParentOnInsertion())this._fosterParentElement(e);else{let t=this.openElements.currentTmplContentOrNode;this.treeAdapter.appendChild(t??this.document,e)}}_appendElement(e,t){let n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n,e.location)}_insertElement(e,t){let n=this.treeAdapter.createElement(e.tagName,t,e.attrs);this._attachElementToTree(n,e.location),this.openElements.push(n,e.tagID)}_insertFakeElement(e,t){let n=this.treeAdapter.createElement(e,G.HTML,[]);this._attachElementToTree(n,null),this.openElements.push(n,t)}_insertTemplate(e){let t=this.treeAdapter.createElement(e.tagName,G.HTML,e.attrs),n=this.treeAdapter.createDocumentFragment();this.treeAdapter.setTemplateContent(t,n),this._attachElementToTree(t,e.location),this.openElements.push(t,e.tagID),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,null)}_insertFakeRootElement(){let e=this.treeAdapter.createElement(K.HTML,G.HTML,[]);this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(e,null),this.treeAdapter.appendChild(this.openElements.current,e),this.openElements.push(e,q.HTML)}_appendCommentNode(e,t){let n=this.treeAdapter.createCommentNode(e.data);this.treeAdapter.appendChild(t,n),this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(n,e.location)}_insertCharacters(e){let t,n;if(this._shouldFosterParentOnInsertion()?({parent:t,beforeElement:n}=this._findFosterParentingLocation(),n?this.treeAdapter.insertTextBefore(t,e.chars,n):this.treeAdapter.insertText(t,e.chars)):(t=this.openElements.currentTmplContentOrNode,this.treeAdapter.insertText(t,e.chars)),!e.location)return;let r=this.treeAdapter.getChildNodes(t),i=r[(n?r.lastIndexOf(n):r.length)-1];if(this.treeAdapter.getNodeSourceCodeLocation(i)){let{endLine:t,endCol:n,endOffset:r}=e.location;this.treeAdapter.updateNodeSourceCodeLocation(i,{endLine:t,endCol:n,endOffset:r})}else this.options.sourceCodeLocationInfo&&this.treeAdapter.setNodeSourceCodeLocation(i,e.location)}_adoptNodes(e,t){for(let n=this.treeAdapter.getFirstChild(e);n;n=this.treeAdapter.getFirstChild(e))this.treeAdapter.detachNode(n),this.treeAdapter.appendChild(t,n)}_setEndLocation(e,t){if(this.treeAdapter.getNodeSourceCodeLocation(e)&&t.location){let n=t.location,r=this.treeAdapter.getTagName(e),i=t.type===B.END_TAG&&r===t.tagName?{endTag:{...n},endLine:n.endLine,endCol:n.endCol,endOffset:n.endOffset}:{endLine:n.startLine,endCol:n.startCol,endOffset:n.startOffset};this.treeAdapter.updateNodeSourceCodeLocation(e,i)}}shouldProcessStartTagTokenInForeignContent(e){if(!this.currentNotInHTML)return!1;let t,n;return this.openElements.stackTop===0&&this.fragmentContext?(t=this.fragmentContext,n=this.fragmentContextID):{current:t,currentTagId:n}=this.openElements,e.tagID===q.SVG&&this.treeAdapter.getTagName(t)===K.ANNOTATION_XML&&this.treeAdapter.getNamespaceURI(t)===G.MATHML?!1:this.tokenizer.inForeignNode||(e.tagID===q.MGLYPH||e.tagID===q.MALIGNMARK)&&n!==void 0&&!this._isIntegrationPoint(n,t,G.HTML)}_processToken(e){switch(e.type){case B.CHARACTER:this.onCharacter(e);break;case B.NULL_CHARACTER:this.onNullCharacter(e);break;case B.COMMENT:this.onComment(e);break;case B.DOCTYPE:this.onDoctype(e);break;case B.START_TAG:this._processStartTag(e);break;case B.END_TAG:this.onEndTag(e);break;case B.EOF:this.onEof(e);break;case B.WHITESPACE_CHARACTER:this.onWhitespaceCharacter(e);break}}_isIntegrationPoint(e,t,n){return td(e,this.treeAdapter.getNamespaceURI(t),this.treeAdapter.getAttrList(t),n)}_reconstructActiveFormattingElements(){let e=this.activeFormattingElements.entries.length;if(e){let t=this.activeFormattingElements.entries.findIndex(e=>e.type===Du.Marker||this.openElements.contains(e.element)),n=t===-1?e-1:t-1;for(let e=n;e>=0;e--){let t=this.activeFormattingElements.entries[e];this._insertElement(t.token,this.treeAdapter.getNamespaceURI(t.element)),t.element=this.openElements.current}}}_closeTableCell(){this.openElements.generateImpliedEndTags(),this.openElements.popUntilTableCellPopped(),this.activeFormattingElements.clearToLastMarker(),this.insertionMode=Z.IN_ROW}_closePElement(){this.openElements.generateImpliedEndTagsWithExclusion(q.P),this.openElements.popUntilTagNamePopped(q.P)}_resetInsertionMode(){for(let e=this.openElements.stackTop;e>=0;e--)switch(e===0&&this.fragmentContext?this.fragmentContextID:this.openElements.tagIDs[e]){case q.TR:this.insertionMode=Z.IN_ROW;return;case q.TBODY:case q.THEAD:case q.TFOOT:this.insertionMode=Z.IN_TABLE_BODY;return;case q.CAPTION:this.insertionMode=Z.IN_CAPTION;return;case q.COLGROUP:this.insertionMode=Z.IN_COLUMN_GROUP;return;case q.TABLE:this.insertionMode=Z.IN_TABLE;return;case q.BODY:this.insertionMode=Z.IN_BODY;return;case q.FRAMESET:this.insertionMode=Z.IN_FRAMESET;return;case q.SELECT:this._resetInsertionModeForSelect(e);return;case q.TEMPLATE:this.insertionMode=this.tmplInsertionModeStack[0];return;case q.HTML:this.insertionMode=this.headElement?Z.AFTER_HEAD:Z.BEFORE_HEAD;return;case q.TD:case q.TH:if(e>0){this.insertionMode=Z.IN_CELL;return}break;case q.HEAD:if(e>0){this.insertionMode=Z.IN_HEAD;return}break}this.insertionMode=Z.IN_BODY}_resetInsertionModeForSelect(e){if(e>0)for(let t=e-1;t>0;t--){let e=this.openElements.tagIDs[t];if(e===q.TEMPLATE)break;if(e===q.TABLE){this.insertionMode=Z.IN_SELECT_IN_TABLE;return}}this.insertionMode=Z.IN_SELECT}_isElementCausesFosterParenting(e){return od.has(e)}_shouldFosterParentOnInsertion(){return this.fosterParentingEnabled&&this.openElements.currentTagId!==void 0&&this._isElementCausesFosterParenting(this.openElements.currentTagId)}_findFosterParentingLocation(){for(let e=this.openElements.stackTop;e>=0;e--){let t=this.openElements.items[e];switch(this.openElements.tagIDs[e]){case q.TEMPLATE:if(this.treeAdapter.getNamespaceURI(t)===G.HTML)return{parent:this.treeAdapter.getTemplateContent(t),beforeElement:null};break;case q.TABLE:{let n=this.treeAdapter.getParentNode(t);return n?{parent:n,beforeElement:t}:{parent:this.openElements.items[e-1],beforeElement:null}}default:}}return{parent:this.openElements.items[0],beforeElement:null}}_fosterParentElement(e){let t=this._findFosterParentingLocation();t.beforeElement?this.treeAdapter.insertBefore(t.parent,e,t.beforeElement):this.treeAdapter.appendChild(t.parent,e)}_isSpecialElement(e,t){return tu[this.treeAdapter.getNamespaceURI(e)].has(t)}onCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){Tp(this,e);return}switch(this.insertionMode){case Z.INITIAL:bd(this,e);break;case Z.BEFORE_HTML:Cd(this,e);break;case Z.BEFORE_HEAD:Ed(this,e);break;case Z.IN_HEAD:Ad(this,e);break;case Z.IN_HEAD_NO_SCRIPT:$(this,e);break;case Z.AFTER_HEAD:Fd(this,e);break;case Z.IN_BODY:case Z.IN_CAPTION:case Z.IN_CELL:case Z.IN_TEMPLATE:Rd(this,e);break;case Z.TEXT:case Z.IN_SELECT:case Z.IN_SELECT_IN_TABLE:this._insertCharacters(e);break;case Z.IN_TABLE:case Z.IN_TABLE_BODY:case Z.IN_ROW:Pf(this,e);break;case Z.IN_TABLE_TEXT:qf(this,e);break;case Z.IN_COLUMN_GROUP:ep(this,e);break;case Z.AFTER_BODY:gp(this,e);break;case Z.AFTER_AFTER_BODY:Sp(this,e);break;default:}}onNullCharacter(e){if(this.skipNextNewLine=!1,this.tokenizer.inForeignNode){wp(this,e);return}switch(this.insertionMode){case Z.INITIAL:bd(this,e);break;case Z.BEFORE_HTML:Cd(this,e);break;case Z.BEFORE_HEAD:Ed(this,e);break;case Z.IN_HEAD:Ad(this,e);break;case Z.IN_HEAD_NO_SCRIPT:$(this,e);break;case Z.AFTER_HEAD:Fd(this,e);break;case Z.TEXT:this._insertCharacters(e);break;case Z.IN_TABLE:case Z.IN_TABLE_BODY:case Z.IN_ROW:Pf(this,e);break;case Z.IN_COLUMN_GROUP:ep(this,e);break;case Z.AFTER_BODY:gp(this,e);break;case Z.AFTER_AFTER_BODY:Sp(this,e);break;default:}}onComment(e){if(this.skipNextNewLine=!1,this.currentNotInHTML){gd(this,e);return}switch(this.insertionMode){case Z.INITIAL:case Z.BEFORE_HTML:case Z.BEFORE_HEAD:case Z.IN_HEAD:case Z.IN_HEAD_NO_SCRIPT:case Z.AFTER_HEAD:case Z.IN_BODY:case Z.IN_TABLE:case Z.IN_CAPTION:case Z.IN_COLUMN_GROUP:case Z.IN_TABLE_BODY:case Z.IN_ROW:case Z.IN_CELL:case Z.IN_SELECT:case Z.IN_SELECT_IN_TABLE:case Z.IN_TEMPLATE:case Z.IN_FRAMESET:case Z.AFTER_FRAMESET:gd(this,e);break;case Z.IN_TABLE_TEXT:Jf(this,e);break;case Z.AFTER_BODY:_d(this,e);break;case Z.AFTER_AFTER_BODY:case Z.AFTER_AFTER_FRAMESET:vd(this,e);break;default:}}onDoctype(e){switch(this.skipNextNewLine=!1,this.insertionMode){case Z.INITIAL:Q(this,e);break;case Z.BEFORE_HEAD:case Z.IN_HEAD:case Z.IN_HEAD_NO_SCRIPT:case Z.AFTER_HEAD:this._err(e,z.misplacedDoctype);break;case Z.IN_TABLE_TEXT:Jf(this,e);break;default:}}onStartTag(e){this.skipNextNewLine=!1,this.currentToken=e,this._processStartTag(e),e.selfClosing&&!e.ackSelfClosing&&this._err(e,z.nonVoidHtmlElementStartTagWithTrailingSolidus)}_processStartTag(e){this.shouldProcessStartTagTokenInForeignContent(e)?Dp(this,e):this._startTagOutsideForeignContent(e)}_startTagOutsideForeignContent(e){switch(this.insertionMode){case Z.INITIAL:bd(this,e);break;case Z.BEFORE_HTML:xd(this,e);break;case Z.BEFORE_HEAD:wd(this,e);break;case Z.IN_HEAD:Dd(this,e);break;case Z.IN_HEAD_NO_SCRIPT:jd(this,e);break;case Z.AFTER_HEAD:Nd(this,e);break;case Z.IN_BODY:vf(this,e);break;case Z.IN_TABLE:Uf(this,e);break;case Z.IN_TABLE_TEXT:Jf(this,e);break;case Z.IN_CAPTION:Xf(this,e);break;case Z.IN_COLUMN_GROUP:Qf(this,e);break;case Z.IN_TABLE_BODY:tp(this,e);break;case Z.IN_ROW:rp(this,e);break;case Z.IN_CELL:ap(this,e);break;case Z.IN_SELECT:sp(this,e);break;case Z.IN_SELECT_IN_TABLE:lp(this,e);break;case Z.IN_TEMPLATE:dp(this,e);break;case Z.AFTER_BODY:mp(this,e);break;case Z.IN_FRAMESET:_p(this,e);break;case Z.AFTER_FRAMESET:yp(this,e);break;case Z.AFTER_AFTER_BODY:xp(this,e);break;case Z.AFTER_AFTER_FRAMESET:Cp(this,e);break;default:}}onEndTag(e){this.skipNextNewLine=!1,this.currentToken=e,this.currentNotInHTML?Op(this,e):this._endTagOutsideForeignContent(e)}_endTagOutsideForeignContent(e){switch(this.insertionMode){case Z.INITIAL:bd(this,e);break;case Z.BEFORE_HTML:Sd(this,e);break;case Z.BEFORE_HEAD:Td(this,e);break;case Z.IN_HEAD:Od(this,e);break;case Z.IN_HEAD_NO_SCRIPT:Md(this,e);break;case Z.AFTER_HEAD:Pd(this,e);break;case Z.IN_BODY:Af(this,e);break;case Z.TEXT:Mf(this,e);break;case Z.IN_TABLE:Wf(this,e);break;case Z.IN_TABLE_TEXT:Jf(this,e);break;case Z.IN_CAPTION:Zf(this,e);break;case Z.IN_COLUMN_GROUP:$f(this,e);break;case Z.IN_TABLE_BODY:np(this,e);break;case Z.IN_ROW:ip(this,e);break;case Z.IN_CELL:op(this,e);break;case Z.IN_SELECT:cp(this,e);break;case Z.IN_SELECT_IN_TABLE:up(this,e);break;case Z.IN_TEMPLATE:fp(this,e);break;case Z.AFTER_BODY:hp(this,e);break;case Z.IN_FRAMESET:vp(this,e);break;case Z.AFTER_FRAMESET:bp(this,e);break;case Z.AFTER_AFTER_BODY:Sp(this,e);break;default:}}onEof(e){switch(this.insertionMode){case Z.INITIAL:bd(this,e);break;case Z.BEFORE_HTML:Cd(this,e);break;case Z.BEFORE_HEAD:Ed(this,e);break;case Z.IN_HEAD:Ad(this,e);break;case Z.IN_HEAD_NO_SCRIPT:$(this,e);break;case Z.AFTER_HEAD:Fd(this,e);break;case Z.IN_BODY:case Z.IN_TABLE:case Z.IN_CAPTION:case Z.IN_COLUMN_GROUP:case Z.IN_TABLE_BODY:case Z.IN_ROW:case Z.IN_CELL:case Z.IN_SELECT:case Z.IN_SELECT_IN_TABLE:jf(this,e);break;case Z.TEXT:Nf(this,e);break;case Z.IN_TABLE_TEXT:Jf(this,e);break;case Z.IN_TEMPLATE:pp(this,e);break;case Z.AFTER_BODY:case Z.IN_FRAMESET:case Z.AFTER_FRAMESET:case Z.AFTER_AFTER_BODY:case Z.AFTER_AFTER_FRAMESET:yd(this,e);break;default:}}onWhitespaceCharacter(e){if(this.skipNextNewLine&&(this.skipNextNewLine=!1,e.chars.charCodeAt(0)===R.LINE_FEED)){if(e.chars.length===1)return;e.chars=e.chars.substr(1)}if(this.tokenizer.inForeignNode){this._insertCharacters(e);return}switch(this.insertionMode){case Z.IN_HEAD:case Z.IN_HEAD_NO_SCRIPT:case Z.AFTER_HEAD:case Z.TEXT:case Z.IN_COLUMN_GROUP:case Z.IN_SELECT:case Z.IN_SELECT_IN_TABLE:case Z.IN_FRAMESET:case Z.AFTER_FRAMESET:this._insertCharacters(e);break;case Z.IN_BODY:case Z.IN_CAPTION:case Z.IN_CELL:case Z.IN_TEMPLATE:case Z.AFTER_BODY:case Z.AFTER_AFTER_BODY:case Z.AFTER_AFTER_FRAMESET:Ld(this,e);break;case Z.IN_TABLE:case Z.IN_TABLE_BODY:case Z.IN_ROW:Pf(this,e);break;case Z.IN_TABLE_TEXT:Kf(this,e);break;default:}}};function ld(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(t.tagName);return n?e.openElements.contains(n.element)?e.openElements.hasInScope(t.tagID)||(n=null):(e.activeFormattingElements.removeEntry(n),n=null):kf(e,t),n}function ud(e,t){let n=null,r=e.openElements.stackTop;for(;r>=0;r--){let i=e.openElements.items[r];if(i===t.element)break;e._isSpecialElement(i,e.openElements.tagIDs[r])&&(n=i)}return n||(e.openElements.shortenToLength(Math.max(r,0)),e.activeFormattingElements.removeEntry(t)),n}function dd(e,t,n){let r=t,i=e.openElements.getCommonAncestor(t);for(let a=0,o=i;o!==n;a++,o=i){i=e.openElements.getCommonAncestor(o);let n=e.activeFormattingElements.getElementEntry(o),s=n&&a>=id;!n||s?(s&&e.activeFormattingElements.removeEntry(n),e.openElements.remove(o)):(o=fd(e,n),r===t&&(e.activeFormattingElements.bookmark=n),e.treeAdapter.detachNode(r),e.treeAdapter.appendChild(o,r),r=o)}return r}function fd(e,t){let n=e.treeAdapter.getNamespaceURI(t.element),r=e.treeAdapter.createElement(t.token.tagName,n,t.token.attrs);return e.openElements.replace(t.element,r),t.element=r,r}function pd(e,t,n){let r=eu(e.treeAdapter.getTagName(t));if(e._isElementCausesFosterParenting(r))e._fosterParentElement(n);else{let i=e.treeAdapter.getNamespaceURI(t);r===q.TEMPLATE&&i===G.HTML&&(t=e.treeAdapter.getTemplateContent(t)),e.treeAdapter.appendChild(t,n)}}function md(e,t,n){let r=e.treeAdapter.getNamespaceURI(n.element),{token:i}=n,a=e.treeAdapter.createElement(i.tagName,r,i.attrs);e._adoptNodes(t,a),e.treeAdapter.appendChild(t,a),e.activeFormattingElements.insertElementAfterBookmark(a,i),e.activeFormattingElements.removeEntry(n),e.openElements.remove(n.element),e.openElements.insertAfter(t,a,i.tagID)}function hd(e,t){for(let n=0;n<rd;n++){let n=ld(e,t);if(!n)break;let r=ud(e,n);if(!r)break;e.activeFormattingElements.bookmark=n;let i=dd(e,r,n.element),a=e.openElements.getCommonAncestor(n.element);e.treeAdapter.detachNode(i),a&&pd(e,a,i),md(e,r,n)}}function gd(e,t){e._appendCommentNode(t,e.openElements.currentTmplContentOrNode)}function _d(e,t){e._appendCommentNode(t,e.openElements.items[0])}function vd(e,t){e._appendCommentNode(t,e.document)}function yd(e,t){if(e.stopped=!0,t.location){let n=e.fragmentContext?0:2;for(let r=e.openElements.stackTop;r>=n;r--)e._setEndLocation(e.openElements.items[r],t);if(!e.fragmentContext&&e.openElements.stackTop>=0){let n=e.openElements.items[0],r=e.treeAdapter.getNodeSourceCodeLocation(n);if(r&&!r.endTag&&(e._setEndLocation(n,t),e.openElements.stackTop>=1)){let n=e.openElements.items[1],r=e.treeAdapter.getNodeSourceCodeLocation(n);r&&!r.endTag&&e._setEndLocation(n,t)}}}}function Q(e,t){e._setDocumentType(t);let n=t.forceQuirks?Ql.QUIRKS:Vu(t);Bu(t)||e._err(t,z.nonConformingDoctype),e.treeAdapter.setDocumentMode(e.document,n),e.insertionMode=Z.BEFORE_HTML}function bd(e,t){e._err(t,z.missingDoctype,!0),e.treeAdapter.setDocumentMode(e.document,Ql.QUIRKS),e.insertionMode=Z.BEFORE_HTML,e._processToken(t)}function xd(e,t){t.tagID===q.HTML?(e._insertElement(t,G.HTML),e.insertionMode=Z.BEFORE_HEAD):Cd(e,t)}function Sd(e,t){let n=t.tagID;(n===q.HTML||n===q.HEAD||n===q.BODY||n===q.BR)&&Cd(e,t)}function Cd(e,t){e._insertFakeRootElement(),e.insertionMode=Z.BEFORE_HEAD,e._processToken(t)}function wd(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.HEAD:e._insertElement(t,G.HTML),e.headElement=e.openElements.current,e.insertionMode=Z.IN_HEAD;break;default:Ed(e,t)}}function Td(e,t){let n=t.tagID;n===q.HEAD||n===q.BODY||n===q.HTML||n===q.BR?Ed(e,t):e._err(t,z.endTagWithoutMatchingOpenElement)}function Ed(e,t){e._insertFakeElement(K.HEAD,q.HEAD),e.headElement=e.openElements.current,e.insertionMode=Z.IN_HEAD,e._processToken(t)}function Dd(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.BASE:case q.BASEFONT:case q.BGSOUND:case q.LINK:case q.META:e._appendElement(t,G.HTML),t.ackSelfClosing=!0;break;case q.TITLE:e._switchToTextParsing(t,ru.RCDATA);break;case q.NOSCRIPT:e.options.scriptingEnabled?e._switchToTextParsing(t,ru.RAWTEXT):(e._insertElement(t,G.HTML),e.insertionMode=Z.IN_HEAD_NO_SCRIPT);break;case q.NOFRAMES:case q.STYLE:e._switchToTextParsing(t,ru.RAWTEXT);break;case q.SCRIPT:e._switchToTextParsing(t,ru.SCRIPT_DATA);break;case q.TEMPLATE:e._insertTemplate(t),e.activeFormattingElements.insertMarker(),e.framesetOk=!1,e.insertionMode=Z.IN_TEMPLATE,e.tmplInsertionModeStack.unshift(Z.IN_TEMPLATE);break;case q.HEAD:e._err(t,z.misplacedStartTagForHeadElement);break;default:Ad(e,t)}}function Od(e,t){switch(t.tagID){case q.HEAD:e.openElements.pop(),e.insertionMode=Z.AFTER_HEAD;break;case q.BODY:case q.BR:case q.HTML:Ad(e,t);break;case q.TEMPLATE:kd(e,t);break;default:e._err(t,z.endTagWithoutMatchingOpenElement)}}function kd(e,t){e.openElements.tmplCount>0?(e.openElements.generateImpliedEndTagsThoroughly(),e.openElements.currentTagId!==q.TEMPLATE&&e._err(t,z.closingOfElementWithOpenChildElements),e.openElements.popUntilTagNamePopped(q.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode()):e._err(t,z.endTagWithoutMatchingOpenElement)}function Ad(e,t){e.openElements.pop(),e.insertionMode=Z.AFTER_HEAD,e._processToken(t)}function jd(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.BASEFONT:case q.BGSOUND:case q.HEAD:case q.LINK:case q.META:case q.NOFRAMES:case q.STYLE:Dd(e,t);break;case q.NOSCRIPT:e._err(t,z.nestedNoscriptInHead);break;default:$(e,t)}}function Md(e,t){switch(t.tagID){case q.NOSCRIPT:e.openElements.pop(),e.insertionMode=Z.IN_HEAD;break;case q.BR:$(e,t);break;default:e._err(t,z.endTagWithoutMatchingOpenElement)}}function $(e,t){let n=t.type===B.EOF?z.openElementsLeftAfterEof:z.disallowedContentInNoscriptInHead;e._err(t,n),e.openElements.pop(),e.insertionMode=Z.IN_HEAD,e._processToken(t)}function Nd(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.BODY:e._insertElement(t,G.HTML),e.framesetOk=!1,e.insertionMode=Z.IN_BODY;break;case q.FRAMESET:e._insertElement(t,G.HTML),e.insertionMode=Z.IN_FRAMESET;break;case q.BASE:case q.BASEFONT:case q.BGSOUND:case q.LINK:case q.META:case q.NOFRAMES:case q.SCRIPT:case q.STYLE:case q.TEMPLATE:case q.TITLE:e._err(t,z.abandonedHeadElementChild),e.openElements.push(e.headElement,q.HEAD),Dd(e,t),e.openElements.remove(e.headElement);break;case q.HEAD:e._err(t,z.misplacedStartTagForHeadElement);break;default:Fd(e,t)}}function Pd(e,t){switch(t.tagID){case q.BODY:case q.HTML:case q.BR:Fd(e,t);break;case q.TEMPLATE:kd(e,t);break;default:e._err(t,z.endTagWithoutMatchingOpenElement)}}function Fd(e,t){e._insertFakeElement(K.BODY,q.BODY),e.insertionMode=Z.IN_BODY,Id(e,t)}function Id(e,t){switch(t.type){case B.CHARACTER:Rd(e,t);break;case B.WHITESPACE_CHARACTER:Ld(e,t);break;case B.COMMENT:gd(e,t);break;case B.START_TAG:vf(e,t);break;case B.END_TAG:Af(e,t);break;case B.EOF:jf(e,t);break;default:}}function Ld(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t)}function Rd(e,t){e._reconstructActiveFormattingElements(),e._insertCharacters(t),e.framesetOk=!1}function zd(e,t){e.openElements.tmplCount===0&&e.treeAdapter.adoptAttributes(e.openElements.items[0],t.attrs)}function Bd(e,t){let n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e.openElements.tmplCount===0&&(e.framesetOk=!1,e.treeAdapter.adoptAttributes(n,t.attrs))}function Vd(e,t){let n=e.openElements.tryPeekProperlyNestedBodyElement();e.framesetOk&&n&&(e.treeAdapter.detachNode(n),e.openElements.popAllUpToHtmlElement(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_FRAMESET)}function Hd(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML)}function Ud(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e.openElements.currentTagId!==void 0&&nu.has(e.openElements.currentTagId)&&e.openElements.pop(),e._insertElement(t,G.HTML)}function Wd(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML),e.skipNextNewLine=!0,e.framesetOk=!1}function Gd(e,t){let n=e.openElements.tmplCount>0;(!e.formElement||n)&&(e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML),n||(e.formElement=e.openElements.current))}function Kd(e,t){e.framesetOk=!1;let n=t.tagID;for(let t=e.openElements.stackTop;t>=0;t--){let r=e.openElements.tagIDs[t];if(n===q.LI&&r===q.LI||(n===q.DD||n===q.DT)&&(r===q.DD||r===q.DT)){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.popUntilTagNamePopped(r);break}if(r!==q.ADDRESS&&r!==q.DIV&&r!==q.P&&e._isSpecialElement(e.openElements.items[t],r))break}e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML)}function qd(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML),e.tokenizer.state=ru.PLAINTEXT}function Jd(e,t){e.openElements.hasInScope(q.BUTTON)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(q.BUTTON)),e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML),e.framesetOk=!1}function Yd(e,t){let n=e.activeFormattingElements.getElementEntryInScopeWithTagName(K.A);n&&(hd(e,t),e.openElements.remove(n.element),e.activeFormattingElements.removeEntry(n)),e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function Xd(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function Zd(e,t){e._reconstructActiveFormattingElements(),e.openElements.hasInScope(q.NOBR)&&(hd(e,t),e._reconstructActiveFormattingElements()),e._insertElement(t,G.HTML),e.activeFormattingElements.pushElement(e.openElements.current,t)}function Qd(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML),e.activeFormattingElements.insertMarker(),e.framesetOk=!1}function $d(e,t){e.treeAdapter.getDocumentMode(e.document)!==Ql.QUIRKS&&e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._insertElement(t,G.HTML),e.framesetOk=!1,e.insertionMode=Z.IN_TABLE}function ef(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,G.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function tf(e){let t=Bl(e,Zl.TYPE);return t!=null&&t.toLowerCase()===nd}function nf(e,t){e._reconstructActiveFormattingElements(),e._appendElement(t,G.HTML),tf(t)||(e.framesetOk=!1),t.ackSelfClosing=!0}function rf(e,t){e._appendElement(t,G.HTML),t.ackSelfClosing=!0}function af(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._appendElement(t,G.HTML),e.framesetOk=!1,t.ackSelfClosing=!0}function of(e,t){t.tagName=K.IMG,t.tagID=q.IMG,ef(e,t)}function sf(e,t){e._insertElement(t,G.HTML),e.skipNextNewLine=!0,e.tokenizer.state=ru.RCDATA,e.originalInsertionMode=e.insertionMode,e.framesetOk=!1,e.insertionMode=Z.TEXT}function cf(e,t){e.openElements.hasInButtonScope(q.P)&&e._closePElement(),e._reconstructActiveFormattingElements(),e.framesetOk=!1,e._switchToTextParsing(t,ru.RAWTEXT)}function lf(e,t){e.framesetOk=!1,e._switchToTextParsing(t,ru.RAWTEXT)}function uf(e,t){e._switchToTextParsing(t,ru.RAWTEXT)}function df(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML),e.framesetOk=!1,e.insertionMode=e.insertionMode===Z.IN_TABLE||e.insertionMode===Z.IN_CAPTION||e.insertionMode===Z.IN_TABLE_BODY||e.insertionMode===Z.IN_ROW||e.insertionMode===Z.IN_CELL?Z.IN_SELECT_IN_TABLE:Z.IN_SELECT}function ff(e,t){e.openElements.currentTagId===q.OPTION&&e.openElements.pop(),e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML)}function pf(e,t){e.openElements.hasInScope(q.RUBY)&&e.openElements.generateImpliedEndTags(),e._insertElement(t,G.HTML)}function mf(e,t){e.openElements.hasInScope(q.RUBY)&&e.openElements.generateImpliedEndTagsWithExclusion(q.RTC),e._insertElement(t,G.HTML)}function hf(e,t){e._reconstructActiveFormattingElements(),Yu(t),Zu(t),t.selfClosing?e._appendElement(t,G.MATHML):e._insertElement(t,G.MATHML),t.ackSelfClosing=!0}function gf(e,t){e._reconstructActiveFormattingElements(),Xu(t),Zu(t),t.selfClosing?e._appendElement(t,G.SVG):e._insertElement(t,G.SVG),t.ackSelfClosing=!0}function _f(e,t){e._reconstructActiveFormattingElements(),e._insertElement(t,G.HTML)}function vf(e,t){switch(t.tagID){case q.I:case q.S:case q.B:case q.U:case q.EM:case q.TT:case q.BIG:case q.CODE:case q.FONT:case q.SMALL:case q.STRIKE:case q.STRONG:Xd(e,t);break;case q.A:Yd(e,t);break;case q.H1:case q.H2:case q.H3:case q.H4:case q.H5:case q.H6:Ud(e,t);break;case q.P:case q.DL:case q.OL:case q.UL:case q.DIV:case q.DIR:case q.NAV:case q.MAIN:case q.MENU:case q.ASIDE:case q.CENTER:case q.FIGURE:case q.FOOTER:case q.HEADER:case q.HGROUP:case q.DIALOG:case q.DETAILS:case q.ADDRESS:case q.ARTICLE:case q.SEARCH:case q.SECTION:case q.SUMMARY:case q.FIELDSET:case q.BLOCKQUOTE:case q.FIGCAPTION:Hd(e,t);break;case q.LI:case q.DD:case q.DT:Kd(e,t);break;case q.BR:case q.IMG:case q.WBR:case q.AREA:case q.EMBED:case q.KEYGEN:ef(e,t);break;case q.HR:af(e,t);break;case q.RB:case q.RTC:pf(e,t);break;case q.RT:case q.RP:mf(e,t);break;case q.PRE:case q.LISTING:Wd(e,t);break;case q.XMP:cf(e,t);break;case q.SVG:gf(e,t);break;case q.HTML:zd(e,t);break;case q.BASE:case q.LINK:case q.META:case q.STYLE:case q.TITLE:case q.SCRIPT:case q.BGSOUND:case q.BASEFONT:case q.TEMPLATE:Dd(e,t);break;case q.BODY:Bd(e,t);break;case q.FORM:Gd(e,t);break;case q.NOBR:Zd(e,t);break;case q.MATH:hf(e,t);break;case q.TABLE:$d(e,t);break;case q.INPUT:nf(e,t);break;case q.PARAM:case q.TRACK:case q.SOURCE:rf(e,t);break;case q.IMAGE:of(e,t);break;case q.BUTTON:Jd(e,t);break;case q.APPLET:case q.OBJECT:case q.MARQUEE:Qd(e,t);break;case q.IFRAME:lf(e,t);break;case q.SELECT:df(e,t);break;case q.OPTION:case q.OPTGROUP:ff(e,t);break;case q.NOEMBED:case q.NOFRAMES:uf(e,t);break;case q.FRAMESET:Vd(e,t);break;case q.TEXTAREA:sf(e,t);break;case q.NOSCRIPT:e.options.scriptingEnabled?uf(e,t):_f(e,t);break;case q.PLAINTEXT:qd(e,t);break;case q.COL:case q.TH:case q.TD:case q.TR:case q.HEAD:case q.FRAME:case q.TBODY:case q.TFOOT:case q.THEAD:case q.CAPTION:case q.COLGROUP:break;default:_f(e,t)}}function yf(e,t){if(e.openElements.hasInScope(q.BODY)&&(e.insertionMode=Z.AFTER_BODY,e.options.sourceCodeLocationInfo)){let n=e.openElements.tryPeekProperlyNestedBodyElement();n&&e._setEndLocation(n,t)}}function bf(e,t){e.openElements.hasInScope(q.BODY)&&(e.insertionMode=Z.AFTER_BODY,hp(e,t))}function xf(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n))}function Sf(e){let t=e.openElements.tmplCount>0,{formElement:n}=e;t||(e.formElement=null),(n||t)&&e.openElements.hasInScope(q.FORM)&&(e.openElements.generateImpliedEndTags(),t?e.openElements.popUntilTagNamePopped(q.FORM):n&&e.openElements.remove(n))}function Cf(e){e.openElements.hasInButtonScope(q.P)||e._insertFakeElement(K.P,q.P),e._closePElement()}function wf(e){e.openElements.hasInListItemScope(q.LI)&&(e.openElements.generateImpliedEndTagsWithExclusion(q.LI),e.openElements.popUntilTagNamePopped(q.LI))}function Tf(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTagsWithExclusion(n),e.openElements.popUntilTagNamePopped(n))}function Ef(e){e.openElements.hasNumberedHeaderInScope()&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilNumberedHeaderPopped())}function Df(e,t){let n=t.tagID;e.openElements.hasInScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker())}function Of(e){e._reconstructActiveFormattingElements(),e._insertFakeElement(K.BR,q.BR),e.openElements.pop(),e.framesetOk=!1}function kf(e,t){let n=t.tagName,r=t.tagID;for(let t=e.openElements.stackTop;t>0;t--){let i=e.openElements.items[t],a=e.openElements.tagIDs[t];if(r===a&&(r!==q.UNKNOWN||e.treeAdapter.getTagName(i)===n)){e.openElements.generateImpliedEndTagsWithExclusion(r),e.openElements.stackTop>=t&&e.openElements.shortenToLength(t);break}if(e._isSpecialElement(i,a))break}}function Af(e,t){switch(t.tagID){case q.A:case q.B:case q.I:case q.S:case q.U:case q.EM:case q.TT:case q.BIG:case q.CODE:case q.FONT:case q.NOBR:case q.SMALL:case q.STRIKE:case q.STRONG:hd(e,t);break;case q.P:Cf(e);break;case q.DL:case q.UL:case q.OL:case q.DIR:case q.DIV:case q.NAV:case q.PRE:case q.MAIN:case q.MENU:case q.ASIDE:case q.BUTTON:case q.CENTER:case q.FIGURE:case q.FOOTER:case q.HEADER:case q.HGROUP:case q.DIALOG:case q.ADDRESS:case q.ARTICLE:case q.DETAILS:case q.SEARCH:case q.SECTION:case q.SUMMARY:case q.LISTING:case q.FIELDSET:case q.BLOCKQUOTE:case q.FIGCAPTION:xf(e,t);break;case q.LI:wf(e);break;case q.DD:case q.DT:Tf(e,t);break;case q.H1:case q.H2:case q.H3:case q.H4:case q.H5:case q.H6:Ef(e);break;case q.BR:Of(e);break;case q.BODY:yf(e,t);break;case q.HTML:bf(e,t);break;case q.FORM:Sf(e);break;case q.APPLET:case q.OBJECT:case q.MARQUEE:Df(e,t);break;case q.TEMPLATE:kd(e,t);break;default:kf(e,t)}}function jf(e,t){e.tmplInsertionModeStack.length>0?pp(e,t):yd(e,t)}function Mf(e,t){var n;t.tagID===q.SCRIPT&&((n=e.scriptHandler)==null||n.call(e,e.openElements.current)),e.openElements.pop(),e.insertionMode=e.originalInsertionMode}function Nf(e,t){e._err(t,z.eofInElementThatCanContainOnlyText),e.openElements.pop(),e.insertionMode=e.originalInsertionMode,e.onEof(t)}function Pf(e,t){if(e.openElements.currentTagId!==void 0&&od.has(e.openElements.currentTagId))switch(e.pendingCharacterTokens.length=0,e.hasNonWhitespacePendingCharacterToken=!1,e.originalInsertionMode=e.insertionMode,e.insertionMode=Z.IN_TABLE_TEXT,t.type){case B.CHARACTER:qf(e,t);break;case B.WHITESPACE_CHARACTER:Kf(e,t);break}else Gf(e,t)}function Ff(e,t){e.openElements.clearBackToTableContext(),e.activeFormattingElements.insertMarker(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_CAPTION}function If(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_COLUMN_GROUP}function Lf(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(K.COLGROUP,q.COLGROUP),e.insertionMode=Z.IN_COLUMN_GROUP,Qf(e,t)}function Rf(e,t){e.openElements.clearBackToTableContext(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_TABLE_BODY}function zf(e,t){e.openElements.clearBackToTableContext(),e._insertFakeElement(K.TBODY,q.TBODY),e.insertionMode=Z.IN_TABLE_BODY,tp(e,t)}function Bf(e,t){e.openElements.hasInTableScope(q.TABLE)&&(e.openElements.popUntilTagNamePopped(q.TABLE),e._resetInsertionMode(),e._processStartTag(t))}function Vf(e,t){tf(t)?e._appendElement(t,G.HTML):Gf(e,t),t.ackSelfClosing=!0}function Hf(e,t){!e.formElement&&e.openElements.tmplCount===0&&(e._insertElement(t,G.HTML),e.formElement=e.openElements.current,e.openElements.pop())}function Uf(e,t){switch(t.tagID){case q.TD:case q.TH:case q.TR:zf(e,t);break;case q.STYLE:case q.SCRIPT:case q.TEMPLATE:Dd(e,t);break;case q.COL:Lf(e,t);break;case q.FORM:Hf(e,t);break;case q.TABLE:Bf(e,t);break;case q.TBODY:case q.TFOOT:case q.THEAD:Rf(e,t);break;case q.INPUT:Vf(e,t);break;case q.CAPTION:Ff(e,t);break;case q.COLGROUP:If(e,t);break;default:Gf(e,t)}}function Wf(e,t){switch(t.tagID){case q.TABLE:e.openElements.hasInTableScope(q.TABLE)&&(e.openElements.popUntilTagNamePopped(q.TABLE),e._resetInsertionMode());break;case q.TEMPLATE:kd(e,t);break;case q.BODY:case q.CAPTION:case q.COL:case q.COLGROUP:case q.HTML:case q.TBODY:case q.TD:case q.TFOOT:case q.TH:case q.THEAD:case q.TR:break;default:Gf(e,t)}}function Gf(e,t){let n=e.fosterParentingEnabled;e.fosterParentingEnabled=!0,Id(e,t),e.fosterParentingEnabled=n}function Kf(e,t){e.pendingCharacterTokens.push(t)}function qf(e,t){e.pendingCharacterTokens.push(t),e.hasNonWhitespacePendingCharacterToken=!0}function Jf(e,t){let n=0;if(e.hasNonWhitespacePendingCharacterToken)for(;n<e.pendingCharacterTokens.length;n++)Gf(e,e.pendingCharacterTokens[n]);else for(;n<e.pendingCharacterTokens.length;n++)e._insertCharacters(e.pendingCharacterTokens[n]);e.insertionMode=e.originalInsertionMode,e._processToken(t)}var Yf=new Set([q.CAPTION,q.COL,q.COLGROUP,q.TBODY,q.TD,q.TFOOT,q.TH,q.THEAD,q.TR]);function Xf(e,t){let n=t.tagID;Yf.has(n)?e.openElements.hasInTableScope(q.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(q.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Z.IN_TABLE,Uf(e,t)):vf(e,t)}function Zf(e,t){let n=t.tagID;switch(n){case q.CAPTION:case q.TABLE:e.openElements.hasInTableScope(q.CAPTION)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(q.CAPTION),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Z.IN_TABLE,n===q.TABLE&&Wf(e,t));break;case q.BODY:case q.COL:case q.COLGROUP:case q.HTML:case q.TBODY:case q.TD:case q.TFOOT:case q.TH:case q.THEAD:case q.TR:break;default:Af(e,t)}}function Qf(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.COL:e._appendElement(t,G.HTML),t.ackSelfClosing=!0;break;case q.TEMPLATE:Dd(e,t);break;default:ep(e,t)}}function $f(e,t){switch(t.tagID){case q.COLGROUP:e.openElements.currentTagId===q.COLGROUP&&(e.openElements.pop(),e.insertionMode=Z.IN_TABLE);break;case q.TEMPLATE:kd(e,t);break;case q.COL:break;default:ep(e,t)}}function ep(e,t){e.openElements.currentTagId===q.COLGROUP&&(e.openElements.pop(),e.insertionMode=Z.IN_TABLE,e._processToken(t))}function tp(e,t){switch(t.tagID){case q.TR:e.openElements.clearBackToTableBodyContext(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_ROW;break;case q.TH:case q.TD:e.openElements.clearBackToTableBodyContext(),e._insertFakeElement(K.TR,q.TR),e.insertionMode=Z.IN_ROW,rp(e,t);break;case q.CAPTION:case q.COL:case q.COLGROUP:case q.TBODY:case q.TFOOT:case q.THEAD:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE,Uf(e,t));break;default:Uf(e,t)}}function np(e,t){let n=t.tagID;switch(t.tagID){case q.TBODY:case q.TFOOT:case q.THEAD:e.openElements.hasInTableScope(n)&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE);break;case q.TABLE:e.openElements.hasTableBodyContextInTableScope()&&(e.openElements.clearBackToTableBodyContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE,Wf(e,t));break;case q.BODY:case q.CAPTION:case q.COL:case q.COLGROUP:case q.HTML:case q.TD:case q.TH:case q.TR:break;default:Wf(e,t)}}function rp(e,t){switch(t.tagID){case q.TH:case q.TD:e.openElements.clearBackToTableRowContext(),e._insertElement(t,G.HTML),e.insertionMode=Z.IN_CELL,e.activeFormattingElements.insertMarker();break;case q.CAPTION:case q.COL:case q.COLGROUP:case q.TBODY:case q.TFOOT:case q.THEAD:case q.TR:e.openElements.hasInTableScope(q.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE_BODY,tp(e,t));break;default:Uf(e,t)}}function ip(e,t){switch(t.tagID){case q.TR:e.openElements.hasInTableScope(q.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE_BODY);break;case q.TABLE:e.openElements.hasInTableScope(q.TR)&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE_BODY,np(e,t));break;case q.TBODY:case q.TFOOT:case q.THEAD:(e.openElements.hasInTableScope(t.tagID)||e.openElements.hasInTableScope(q.TR))&&(e.openElements.clearBackToTableRowContext(),e.openElements.pop(),e.insertionMode=Z.IN_TABLE_BODY,np(e,t));break;case q.BODY:case q.CAPTION:case q.COL:case q.COLGROUP:case q.HTML:case q.TD:case q.TH:break;default:Wf(e,t)}}function ap(e,t){let n=t.tagID;Yf.has(n)?(e.openElements.hasInTableScope(q.TD)||e.openElements.hasInTableScope(q.TH))&&(e._closeTableCell(),rp(e,t)):vf(e,t)}function op(e,t){let n=t.tagID;switch(n){case q.TD:case q.TH:e.openElements.hasInTableScope(n)&&(e.openElements.generateImpliedEndTags(),e.openElements.popUntilTagNamePopped(n),e.activeFormattingElements.clearToLastMarker(),e.insertionMode=Z.IN_ROW);break;case q.TABLE:case q.TBODY:case q.TFOOT:case q.THEAD:case q.TR:e.openElements.hasInTableScope(n)&&(e._closeTableCell(),ip(e,t));break;case q.BODY:case q.CAPTION:case q.COL:case q.COLGROUP:case q.HTML:break;default:Af(e,t)}}function sp(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.OPTION:e.openElements.currentTagId===q.OPTION&&e.openElements.pop(),e._insertElement(t,G.HTML);break;case q.OPTGROUP:e.openElements.currentTagId===q.OPTION&&e.openElements.pop(),e.openElements.currentTagId===q.OPTGROUP&&e.openElements.pop(),e._insertElement(t,G.HTML);break;case q.HR:e.openElements.currentTagId===q.OPTION&&e.openElements.pop(),e.openElements.currentTagId===q.OPTGROUP&&e.openElements.pop(),e._appendElement(t,G.HTML),t.ackSelfClosing=!0;break;case q.INPUT:case q.KEYGEN:case q.TEXTAREA:case q.SELECT:e.openElements.hasInSelectScope(q.SELECT)&&(e.openElements.popUntilTagNamePopped(q.SELECT),e._resetInsertionMode(),t.tagID!==q.SELECT&&e._processStartTag(t));break;case q.SCRIPT:case q.TEMPLATE:Dd(e,t);break;default:}}function cp(e,t){switch(t.tagID){case q.OPTGROUP:e.openElements.stackTop>0&&e.openElements.currentTagId===q.OPTION&&e.openElements.tagIDs[e.openElements.stackTop-1]===q.OPTGROUP&&e.openElements.pop(),e.openElements.currentTagId===q.OPTGROUP&&e.openElements.pop();break;case q.OPTION:e.openElements.currentTagId===q.OPTION&&e.openElements.pop();break;case q.SELECT:e.openElements.hasInSelectScope(q.SELECT)&&(e.openElements.popUntilTagNamePopped(q.SELECT),e._resetInsertionMode());break;case q.TEMPLATE:kd(e,t);break;default:}}function lp(e,t){let n=t.tagID;n===q.CAPTION||n===q.TABLE||n===q.TBODY||n===q.TFOOT||n===q.THEAD||n===q.TR||n===q.TD||n===q.TH?(e.openElements.popUntilTagNamePopped(q.SELECT),e._resetInsertionMode(),e._processStartTag(t)):sp(e,t)}function up(e,t){let n=t.tagID;n===q.CAPTION||n===q.TABLE||n===q.TBODY||n===q.TFOOT||n===q.THEAD||n===q.TR||n===q.TD||n===q.TH?e.openElements.hasInTableScope(n)&&(e.openElements.popUntilTagNamePopped(q.SELECT),e._resetInsertionMode(),e.onEndTag(t)):cp(e,t)}function dp(e,t){switch(t.tagID){case q.BASE:case q.BASEFONT:case q.BGSOUND:case q.LINK:case q.META:case q.NOFRAMES:case q.SCRIPT:case q.STYLE:case q.TEMPLATE:case q.TITLE:Dd(e,t);break;case q.CAPTION:case q.COLGROUP:case q.TBODY:case q.TFOOT:case q.THEAD:e.tmplInsertionModeStack[0]=Z.IN_TABLE,e.insertionMode=Z.IN_TABLE,Uf(e,t);break;case q.COL:e.tmplInsertionModeStack[0]=Z.IN_COLUMN_GROUP,e.insertionMode=Z.IN_COLUMN_GROUP,Qf(e,t);break;case q.TR:e.tmplInsertionModeStack[0]=Z.IN_TABLE_BODY,e.insertionMode=Z.IN_TABLE_BODY,tp(e,t);break;case q.TD:case q.TH:e.tmplInsertionModeStack[0]=Z.IN_ROW,e.insertionMode=Z.IN_ROW,rp(e,t);break;default:e.tmplInsertionModeStack[0]=Z.IN_BODY,e.insertionMode=Z.IN_BODY,vf(e,t)}}function fp(e,t){t.tagID===q.TEMPLATE&&kd(e,t)}function pp(e,t){e.openElements.tmplCount>0?(e.openElements.popUntilTagNamePopped(q.TEMPLATE),e.activeFormattingElements.clearToLastMarker(),e.tmplInsertionModeStack.shift(),e._resetInsertionMode(),e.onEof(t)):yd(e,t)}function mp(e,t){t.tagID===q.HTML?vf(e,t):gp(e,t)}function hp(e,t){if(t.tagID===q.HTML){if(e.fragmentContext||(e.insertionMode=Z.AFTER_AFTER_BODY),e.options.sourceCodeLocationInfo&&e.openElements.tagIDs[0]===q.HTML){e._setEndLocation(e.openElements.items[0],t);let n=e.openElements.items[1];n&&!e.treeAdapter.getNodeSourceCodeLocation(n)?.endTag&&e._setEndLocation(n,t)}}else gp(e,t)}function gp(e,t){e.insertionMode=Z.IN_BODY,Id(e,t)}function _p(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.FRAMESET:e._insertElement(t,G.HTML);break;case q.FRAME:e._appendElement(t,G.HTML),t.ackSelfClosing=!0;break;case q.NOFRAMES:Dd(e,t);break;default:}}function vp(e,t){t.tagID===q.FRAMESET&&!e.openElements.isRootHtmlElementCurrent()&&(e.openElements.pop(),!e.fragmentContext&&e.openElements.currentTagId!==q.FRAMESET&&(e.insertionMode=Z.AFTER_FRAMESET))}function yp(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.NOFRAMES:Dd(e,t);break;default:}}function bp(e,t){t.tagID===q.HTML&&(e.insertionMode=Z.AFTER_AFTER_FRAMESET)}function xp(e,t){t.tagID===q.HTML?vf(e,t):Sp(e,t)}function Sp(e,t){e.insertionMode=Z.IN_BODY,Id(e,t)}function Cp(e,t){switch(t.tagID){case q.HTML:vf(e,t);break;case q.NOFRAMES:Dd(e,t);break;default:}}function wp(e,t){t.chars=`�`,e._insertCharacters(t)}function Tp(e,t){e._insertCharacters(t),e.framesetOk=!1}function Ep(e){for(;e.treeAdapter.getNamespaceURI(e.openElements.current)!==G.HTML&&e.openElements.currentTagId!==void 0&&!e._isIntegrationPoint(e.openElements.currentTagId,e.openElements.current);)e.openElements.pop()}function Dp(e,t){if(Ju(t))Ep(e),e._startTagOutsideForeignContent(t);else{let n=e._getAdjustedCurrentElement(),r=e.treeAdapter.getNamespaceURI(n);r===G.MATHML?Yu(t):r===G.SVG&&(Qu(t),Xu(t)),Zu(t),t.selfClosing?e._appendElement(t,r):e._insertElement(t,r),t.ackSelfClosing=!0}}function Op(e,t){if(t.tagID===q.P||t.tagID===q.BR){Ep(e),e._endTagOutsideForeignContent(t);return}for(let n=e.openElements.stackTop;n>0;n--){let r=e.openElements.items[n];if(e.treeAdapter.getNamespaceURI(r)===G.HTML){e._endTagOutsideForeignContent(t);break}let i=e.treeAdapter.getTagName(r);if(i.toLowerCase()===t.tagName){t.tagName=i,e.openElements.shortenToLength(n);break}}}new Set([K.AREA,K.BASE,K.BASEFONT,K.BGSOUND,K.BR,K.COL,K.EMBED,K.FRAME,K.HR,K.IMG,K.INPUT,K.KEYGEN,K.LINK,K.META,K.PARAM,K.SOURCE,K.TRACK,K.WBR]);var kp=/<(\/?)(iframe|noembed|noframes|plaintext|script|style|textarea|title|xmp)(?=[\t\n\f\r />])/gi,Ap=new Set([`mdxFlowExpression`,`mdxJsxFlowElement`,`mdxJsxTextElement`,`mdxTextExpression`,`mdxjsEsm`]),jp={sourceCodeLocationInfo:!0,scriptingEnabled:!1};function Mp(e,t){let n=Kp(e),r=gl(`type`,{handlers:{root:Pp,element:Fp,text:Ip,comment:zp,doctype:Lp,raw:Bp},unknown:Vp}),i={parser:n?new cd(jp):cd.getFragmentParser(void 0,jp),handle(e){r(e,i)},stitches:!1,options:t||{}};r(e,i),Hp(i,rr());let a=sl(n?i.parser.document:i.parser.getFragment(),{file:i.options.file});return i.stitches&&Vs(a,`comment`,function(e,t,n){let r=e;if(r.value.stitch&&n&&t!==void 0){let e=n.children;return e[t]=r.value.stitch,t}}),a.type===`root`&&a.children.length===1&&a.children[0].type===e.type?a.children[0]:a}function Np(e,t){let n=-1;if(e)for(;++n<e.length;)t.handle(e[n])}function Pp(e,t){Np(e.children,t)}function Fp(e,t){Wp(e,t),Np(e.children,t),Gp(e,t)}function Ip(e,t){t.parser.tokenizer.state>4&&(t.parser.tokenizer.state=0);let n={type:B.CHARACTER,chars:e.value,location:qp(e)};Hp(t,rr(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Lp(e,t){let n={type:B.DOCTYPE,name:`html`,forceQuirks:!1,publicId:``,systemId:``,location:qp(e)};Hp(t,rr(e)),t.parser.currentToken=n,t.parser._processToken(t.parser.currentToken)}function Rp(e,t){t.stitches=!0;let n=Jp(e);`children`in e&&`children`in n&&(n.children=Mp({type:`root`,children:e.children},t.options).children),zp({type:`comment`,value:{stitch:n}},t)}function zp(e,t){let n=e.value,r={type:B.COMMENT,data:n,location:qp(e)};Hp(t,rr(e)),t.parser.currentToken=r,t.parser._processToken(t.parser.currentToken)}function Bp(e,t){if(t.parser.tokenizer.preprocessor.html=``,t.parser.tokenizer.preprocessor.pos=-1,t.parser.tokenizer.preprocessor.lastGapPos=-2,t.parser.tokenizer.preprocessor.gapStack=[],t.parser.tokenizer.preprocessor.skipNextNewLine=!1,t.parser.tokenizer.preprocessor.lastChunkWritten=!1,t.parser.tokenizer.preprocessor.endOfChunkHit=!1,t.parser.tokenizer.preprocessor.isEol=!1,Up(t,rr(e)),t.parser.tokenizer.write(t.options.tagfilter?e.value.replace(kp,`&lt;$1$2`):e.value,!1),t.parser.tokenizer._runParsingLoop(),t.parser.tokenizer.state===72||t.parser.tokenizer.state===78){t.parser.tokenizer.preprocessor.lastChunkWritten=!0;let e=t.parser.tokenizer._consume();t.parser.tokenizer._callState(e)}}function Vp(e,t){let n=e;if(t.options.passThrough&&t.options.passThrough.includes(n.type))Rp(n,t);else{let e=``;throw Ap.has(n.type)&&(e=". It looks like you are using MDX nodes with `hast-util-raw` (or `rehype-raw`). If you use this because you are using remark or rehype plugins that inject `'html'` nodes, then please raise an issue with that plugin, as its a bad and slow idea. If you use this because you are using markdown syntax, then you have to configure this utility (or plugin) to pass through these nodes (see `passThrough` in docs), but you can also migrate to use the MDX syntax"),Error("Cannot compile `"+n.type+"` node"+e)}}function Hp(e,t){Up(e,t);let n=e.parser.tokenizer.currentCharacterToken;n&&n.location&&(n.location.endLine=e.parser.tokenizer.preprocessor.line,n.location.endCol=e.parser.tokenizer.preprocessor.col+1,n.location.endOffset=e.parser.tokenizer.preprocessor.offset+1,e.parser.currentToken=n,e.parser._processToken(e.parser.currentToken)),e.parser.tokenizer.paused=!1,e.parser.tokenizer.inLoop=!1,e.parser.tokenizer.active=!1,e.parser.tokenizer.returnState=ru.DATA,e.parser.tokenizer.charRefCode=-1,e.parser.tokenizer.consumedAfterSnapshot=-1,e.parser.tokenizer.currentLocation=null,e.parser.tokenizer.currentCharacterToken=null,e.parser.tokenizer.currentToken=null,e.parser.tokenizer.currentAttr={name:``,value:``}}function Up(e,t){if(t&&t.offset!==void 0){let n={startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:-1,endCol:-1,endOffset:-1};e.parser.tokenizer.preprocessor.lineStartPos=-t.column+1,e.parser.tokenizer.preprocessor.droppedBufferSize=t.offset,e.parser.tokenizer.preprocessor.line=t.line,e.parser.tokenizer.currentLocation=n}}function Wp(e,t){let n=e.tagName.toLowerCase();if(t.parser.tokenizer.state===ru.PLAINTEXT)return;Hp(t,rr(e));let r=t.parser.openElements.current,i=`namespaceURI`in r?r.namespaceURI:il.html;i===il.html&&n===`svg`&&(i=il.svg);let a=bl({...e,children:[]},{space:i===il.svg?`svg`:`html`}),o={type:B.START_TAG,tagName:n,tagID:eu(n),selfClosing:!1,ackSelfClosing:!1,attrs:`attrs`in a?a.attrs:[],location:qp(e)};t.parser.currentToken=o,t.parser._processToken(t.parser.currentToken),t.parser.tokenizer.lastStartTagName=n}function Gp(e,t){let n=e.tagName.toLowerCase();if(!t.parser.tokenizer.inForeignNode&&Al.includes(n)||t.parser.tokenizer.state===ru.PLAINTEXT)return;Hp(t,nr(e));let r={type:B.END_TAG,tagName:n,tagID:eu(n),selfClosing:!1,ackSelfClosing:!1,attrs:[],location:qp(e)};t.parser.currentToken=r,t.parser._processToken(t.parser.currentToken),n===t.parser.tokenizer.lastStartTagName&&(t.parser.tokenizer.state===ru.RCDATA||t.parser.tokenizer.state===ru.RAWTEXT||t.parser.tokenizer.state===ru.SCRIPT_DATA)&&(t.parser.tokenizer.state=ru.DATA)}function Kp(e){let t=e.type===`root`?e.children[0]:e;return!!(t&&(t.type===`doctype`||t.type===`element`&&t.tagName.toLowerCase()===`html`))}function qp(e){let t=rr(e)||{line:void 0,column:void 0,offset:void 0},n=nr(e)||{line:void 0,column:void 0,offset:void 0};return{startLine:t.line,startCol:t.column,startOffset:t.offset,endLine:n.line,endCol:n.column,endOffset:n.offset}}function Jp(e){return`children`in e?Es({...e,children:[]}):Es(e)}function Yp(e){return function(t,n){return Mp(t,{...e,file:n})}}var Xp={h1:({children:e})=>(0,b.jsx)(`h1`,{children:e}),h2:({children:e})=>(0,b.jsx)(`h2`,{children:e}),h3:({children:e})=>(0,b.jsx)(`h3`,{children:e}),p:({children:e})=>(0,b.jsx)(`p`,{children:e}),ul:({children:e})=>(0,b.jsx)(`ul`,{children:e}),ol:({children:e})=>(0,b.jsx)(`ol`,{children:e}),li:({children:e})=>(0,b.jsx)(`li`,{children:e}),code:({children:e})=>(0,b.jsx)(`code`,{children:e}),pre:({children:e})=>(0,b.jsx)(`pre`,{children:e}),blockquote:({children:e})=>(0,b.jsx)(`blockquote`,{children:e}),strong:({children:e})=>(0,b.jsx)(`strong`,{children:e}),em:({children:e})=>(0,b.jsx)(`em`,{children:e}),a:({children:e,href:t})=>(0,b.jsx)(`a`,{href:t,children:e}),img:({src:e,alt:t})=>(0,b.jsx)(`img`,{src:e,alt:t||``}),hr:()=>(0,b.jsx)(`hr`,{})},Zp={welcome:{id:`welcome`,title:`Welcome`,icon:`👋`,component:on,defaultSize:{width:700,height:420},centered:!0},notepad:{id:`notepad`,title:`Notepad`,icon:`📝`,component:sn,defaultSize:{width:450,height:350},centered:!0},fileExplorer:{id:`fileExplorer`,title:`Documents`,icon:`📄`,component:cn,defaultSize:{width:600,height:350},centered:!1},fileViewer:{id:`fileViewer`,title:`File Viewer`,icon:`📄`,component:({file:e})=>{let[t,n]=(0,v.useState)(`preview`),{t:r}=rn();return e?(0,b.jsxs)(`div`,{className:`fileviewer-container`,children:[(0,b.jsxs)(`menu`,{role:`tablist`,children:[(0,b.jsx)(`li`,{role:`tab`,"aria-selected":t===`preview`,children:(0,b.jsx)(`a`,{href:`#`,onClick:e=>{e.preventDefault(),n(`preview`)},children:r(`preview`)})}),(0,b.jsx)(`li`,{role:`tab`,"aria-selected":t===`source`,children:(0,b.jsx)(`a`,{href:`#`,onClick:e=>{e.preventDefault(),n(`source`)},children:r(`source`)})})]}),(0,b.jsx)(`div`,{className:`window`,role:`tabpanel`,style:{flex:1,display:`flex`,flexDirection:`column`,margin:`0`,border:`none`,boxShadow:`none`,overflow:`hidden`},children:(0,b.jsx)(`div`,{className:`window-body`,style:{flex:1,display:`flex`,flexDirection:`column`,margin:`0`,padding:`4px`,background:`#c0c0c0`,overflow:`hidden`},children:t===`preview`?(0,b.jsx)(`div`,{className:`fileviewer-markdown sunken-panel`,style:{flex:1,overflow:`auto`,background:`#fff`,padding:`10px`},children:(0,b.jsx)(zc,{components:Xp,rehypePlugins:[Yp],children:e.content})}):(0,b.jsx)(`div`,{className:`sunken-panel`,style:{flex:1,overflow:`auto`,background:`#fff`},children:(0,b.jsx)(`pre`,{className:`fileviewer-source`,style:{margin:0,padding:`10px`,border:`none`,overflow:`visible`,width:`max-content`,minWidth:`100%`},children:e.rawContent||e.content})})})})]}):(0,b.jsx)(`div`,{className:`fileviewer-empty`,children:`No hay archivo seleccionado`})},defaultSize:{width:1e3,height:800},centered:!0,singleInstance:!1},search:{id:`search`,title:`Search Files`,icon:`🔍`,component:()=>{let{getAllFiles:e,getRawFileContent:t}=tn(),{openApp:n}=ce(),[r,i]=(0,v.useState)(``),{t:a}=rn(),o=e(),s=r.trim()?o.filter(e=>{let t=r.toLowerCase(),n=e.name.toLowerCase().includes(t),i=e.content.toLowerCase().includes(t);return n||i}):[],c=e=>{let r=t(e.name,e.folder);n(`fileViewer`,{file:{name:e.name.replace(`.md`,``),content:r,folder:e.folder,date:e.date},windowKey:`${e.folder}/${e.name}`,title:e.name.replace(`.md`,``)})};return(0,b.jsxs)(`div`,{className:`search-container`,children:[(0,b.jsx)(`div`,{className:`search-input-area`,children:(0,b.jsxs)(`div`,{className:`field-row search-input-row`,children:[(0,b.jsxs)(`label`,{children:[a(`search`),`:`]}),(0,b.jsx)(`input`,{type:`text`,value:r,onChange:e=>i(e.target.value),placeholder:a(`searchPlaceholder`)})]})}),(0,b.jsx)(`div`,{style:{flex:1,display:`flex`,flexDirection:`column`,padding:`4px`,background:`#c0c0c0`,overflow:`hidden`},children:(0,b.jsx)(`div`,{className:`sunken-panel search-results`,style:{flex:1,overflow:`auto`,background:`#fff`,margin:0},children:r.trim()===``?(0,b.jsx)(`div`,{className:`search-empty`,children:a(`typeToSearch`)}):s.length===0?(0,b.jsxs)(`div`,{className:`search-empty`,children:[a(`noFilesFound`),` "`,r,`"`]}):(0,b.jsxs)(`table`,{className:`interactive`,style:{width:`100%`,borderCollapse:`collapse`,border:`none`,minWidth:`100%`,overflow:`visible`},children:[(0,b.jsx)(`thead`,{style:{position:`sticky`,top:0,zIndex:1,background:`#c0c0c0`},children:(0,b.jsxs)(`tr`,{children:[(0,b.jsx)(`th`,{style:{textAlign:`left`},children:a(`name`)}),(0,b.jsx)(`th`,{style:{textAlign:`left`},children:a(`location`)}),(0,b.jsx)(`th`,{style:{textAlign:`left`},children:a(`type`)})]})}),(0,b.jsx)(`tbody`,{children:s.map((e,t)=>{let n=e.name.toLowerCase().includes(r.toLowerCase());return(0,b.jsxs)(`tr`,{onClick:()=>c(e),style:{cursor:`pointer`},children:[(0,b.jsxs)(`td`,{children:[`📄 `,e.name]}),(0,b.jsx)(`td`,{children:e.folder}),(0,b.jsx)(`td`,{children:a(n?`title`:`content`)})]},t)})})]})})}),(0,b.jsxs)(`div`,{className:`status-bar`,children:[(0,b.jsx)(`p`,{className:`status-bar-field`,children:r.trim()===``?a(`noSearch`):`${s.length} ${a(`results`)}`}),(0,b.jsx)(`p`,{className:`status-bar-field`,children:a(`ready`)})]})]})},defaultSize:{width:500,height:350},centered:!1},settings:{id:`settings`,title:`Settings`,icon:`⚙️`,component:()=>{let{language:e,changeLanguage:t}=ae(),n=w()?.onClose,{t:r}=rn(),[i,a]=(0,v.useState)(e);return(0,b.jsxs)(`div`,{className:`settings-container`,children:[(0,b.jsxs)(`div`,{className:`settings-content`,children:[(0,b.jsxs)(`div`,{className:`settings-language-row`,children:[(0,b.jsxs)(`label`,{className:`settings-language-label`,children:[r(`language`),`:`]}),(0,b.jsx)(`div`,{className:`field-row`,children:(0,b.jsxs)(`select`,{className:`settings-language-select`,value:i,onChange:e=>a(e.target.value),children:[(0,b.jsx)(`option`,{value:`en`,children:`English`}),(0,b.jsx)(`option`,{value:`es`,children:`Español`})]})})]}),(0,b.jsx)(`div`,{className:`settings-info`,children:i===`es`?`El idioma seleccionado afectará toda la interfaz de usuario.`:`The selected language will affect the entire user interface.`})]}),(0,b.jsxs)(`div`,{className:`settings-footer`,children:[(0,b.jsx)(`button`,{className:`settings-button`,onClick:()=>{t(i),n?.()},children:r(`apply`)}),(0,b.jsx)(`button`,{className:`settings-button`,onClick:()=>{n?.()},children:r(`cancel`)})]})]})},defaultSize:{width:350,height:250},centered:!0}},Qp=e=>Zp[e]||null,$p=({onClose:e,onOpenApp:t})=>{let[n,r]=(0,v.useState)(null),{t:i}=rn(),a=e=>{r(n===e?null:e)};return(0,b.jsxs)(`div`,{className:`start-menu`,onClick:e=>e.stopPropagation(),children:[(0,b.jsx)(`div`,{className:`start-menu-sidebar`,children:(0,b.jsx)(`span`,{children:`Desktop`})}),(0,b.jsxs)(`div`,{className:`start-menu-items`,children:[(0,b.jsxs)(`div`,{className:`menu-item-with-submenu`,children:[(0,b.jsxs)(`button`,{onClick:()=>a(`programs`),children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:`🗃️`}),i(`programs`),(0,b.jsx)(`span`,{style:{marginLeft:`auto`},children:`▶`})]}),n===`programs`&&(0,b.jsx)(`div`,{className:`submenu`,children:(0,b.jsxs)(`button`,{onClick:()=>{t(`notepad`),e()},children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:Zp.notepad.icon}),Zp.notepad.title]})})]}),(0,b.jsxs)(`button`,{onClick:()=>{t(`search`),e()},children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:`🔍`}),i(`find`)]}),(0,b.jsxs)(`button`,{onClick:()=>{t(`fileExplorer`),e()},children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:Zp.fileExplorer.icon}),i(`documents`)]}),(0,b.jsx)(`div`,{className:`start-menu-divider`}),(0,b.jsxs)(`button`,{onClick:()=>{t(`settings`),e()},children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:`⚙️`}),i(`settings`)]}),(0,b.jsxs)(`button`,{onClick:()=>{t(`welcome`),e()},children:[(0,b.jsx)(`span`,{className:`icon`,style:{marginRight:`8px`},children:Zp.welcome.icon}),Zp.welcome.title]}),(0,b.jsx)(`button`,{disabled:!0,children:i(`help`)}),(0,b.jsxs)(`button`,{disabled:!0,children:[i(`run`),`...`]}),(0,b.jsx)(`div`,{className:`start-menu-divider`}),(0,b.jsxs)(`button`,{disabled:!0,children:[i(`shutDown`),`...`]})]})]})},em=[{id:`myComputer`,icon:`💻`,label:`My Computer`},{id:`recycleBin`,icon:`🗑️`,label:`Recycle Bin`},{id:`myDocuments`,icon:`📁`,label:`My Documents`}],tm=()=>{let{openApp:e}=ce(),t=t=>{t===`myDocuments`&&e(`fileExplorer`)};return(0,b.jsx)(`div`,{className:`desktop-icons`,children:em.map(e=>(0,b.jsxs)(`div`,{className:`desktop-icon`,onClick:()=>t(e.id),children:[(0,b.jsx)(`div`,{className:`desktop-icon-image`,children:e.icon}),(0,b.jsx)(`span`,{className:`desktop-icon-label`,children:e.label})]},e.id))})},nm=(e,t)=>{let{findFileByUrl:n}=tn();(0,v.useEffect)(()=>{let e=decodeURIComponent(window.location.pathname.slice(1));if(e){let r=e.split(`/`);if(r.length>=2){let e=r[0],i=r[1],a=n(e,i);if(a){let e=a.name.replace(`.md`,``);t(`fileViewer`,{file:{name:e,content:a.content,rawContent:a.rawContent,folder:a.folder,date:a.date},windowKey:`${a.folder}/${a.name}`,title:e})}}}},[]),(0,v.useEffect)(()=>{!e.some(e=>e.appId===`fileViewer`&&!e.isMinimized)&&window.location.pathname!==`/`&&window.history.pushState({},``,`/`)},[e])},rm=()=>{let{windows:e,activeWindowId:t,handleWindowFocus:n,handleMinimize:r,handleRestore:i,handleClose:a,handleMaximize:o,handleWindowMove:s,openApp:c}=ce(),{isOpen:l,toggle:u,close:d}=te();return nm(e,c),(0,b.jsxs)(`div`,{className:`desktop`,style:{width:`100vw`,height:`100vh`,background:`#008080`,overflow:`hidden`,position:`relative`},children:[(0,b.jsx)(ne,{windows:e,activeWindowId:t,onWindowClick:n,onRestore:i,isStartOpen:l,onStartClick:e=>{e.stopPropagation(),u()}}),(0,b.jsx)(tm,{}),l&&(0,b.jsx)($p,{onClose:d,onOpenApp:c}),e.map(e=>(0,b.jsx)(T,{id:e.id,title:e.title,isActive:t===e.id&&!e.isMinimized,isMinimized:e.isMinimized,centered:e.centered,initialPosition:e.initialPosition,initialSize:e.initialSize,zIndex:e.zIndex,isMaximized:e.isMaximized,currentPosition:e.currentPosition,onFocus:n,onMinimize:r,onMaximize:o,onClose:a,onMove:s,children:e.content},e.id))]})},im=({error:e,onReset:t})=>{let n=e?.message||`An unknown error occurred`,r=e?.stack||``,[i,a]=(0,v.useState)(!1),o=(0,v.useRef)({x:0,y:0,posX:0,posY:0}),s=e=>{e.target.closest(`.title-bar`)&&(a(!0),o.current={x:e.clientX,y:e.clientY,posX:0,posY:0})},c=e=>{if(i){let t=e.clientX-o.current.x,n=document.querySelector(`.error-window`);n&&(n.style.left=`calc(50% + ${t}px)`,n.style.top=`50%`,n.style.transform=`translate(-50%, -50%)`)}},l=()=>{a(!1)};return(0,b.jsx)(`div`,{className:`error-window`,style:{width:`400px`,position:`absolute`,left:`50%`,top:`50%`,transform:`translate(-50%, -50%)`,zIndex:1e4,cursor:i?`move`:`default`},onMouseDown:s,onMouseMove:c,onMouseUp:l,onMouseLeave:l,children:(0,b.jsxs)(`div`,{className:`window`,children:[(0,b.jsxs)(`div`,{className:`title-bar`,children:[(0,b.jsx)(`div`,{className:`title-bar-text`,children:`Error`}),(0,b.jsx)(`div`,{className:`title-bar-controls`,children:(0,b.jsx)(`button`,{"aria-label":`Close`,onClick:t})})]}),(0,b.jsxs)(`div`,{className:`window-body`,style:{textAlign:`center`,padding:`20px`},children:[(0,b.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,gap:`10px`,marginBottom:`15px`},children:[(0,b.jsx)(`span`,{style:{fontSize:`32px`},children:`⚠️`}),(0,b.jsx)(`span`,{style:{fontWeight:`bold`},children:`Application Error`})]}),(0,b.jsx)(`p`,{style:{marginBottom:`15px`},children:n}),(0,b.jsxs)(`details`,{style:{textAlign:`left`,fontSize:`11px`},children:[(0,b.jsx)(`summary`,{children:`Technical Details`}),(0,b.jsx)(`pre`,{style:{background:`#c0c0c0`,padding:`10px`,overflow:`auto`,maxHeight:`150px`,border:`2px inset #fff`},children:r})]})]})]})})},am=class extends v.Component{constructor(e){super(e),this.state={hasError:!1,error:null}}static getDerivedStateFromError(e){return{hasError:!0,error:e}}componentDidCatch(e,t){console.error(`ErrorBoundary caught an error:`,e,t)}render(){return this.state.hasError?this.props.fallback||(0,b.jsx)(im,{error:this.state.error,onReset:()=>this.setState({hasError:!1,error:null})}):this.props.children}},om=()=>localStorage.getItem(an.SHOW_WELCOME)===`false`?[]:[{appId:`welcome`,id:`welcome-`+Date.now(),title:`Welcome`,isMinimized:!1,isActive:!0,isMaximized:!1,currentPosition:null,initialPosition:{x:0,y:0},initialSize:Zp.welcome.defaultSize,centered:Zp.welcome.centered,zIndex:10,content:(0,b.jsx)(Zp.welcome.component,{})}];function sm(){return(0,b.jsx)(am,{children:(0,b.jsx)(ie,{children:(0,b.jsx)(se,{initialWindows:om(),children:(0,b.jsx)(rm,{})})})})}(0,_.createRoot)(document.getElementById(`root`)).render((0,b.jsx)(v.StrictMode,{children:(0,b.jsx)(sm,{})}));