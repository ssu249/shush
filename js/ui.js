(function(){
"use strict";
var $=function(s,r){return(r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
/* header: transparent over hero, dark glass on scroll */
var hd=$("header"),mn=$("main");
function hdr(){var pg=$(".page:not([hidden])"),has=!!(pg&&pg.querySelector(".hero,.page-hero"));document.body.setAttribute("data-hero",has?"1":"0");hd.classList.toggle("glass",scrollY>24||!has)}
addEventListener("scroll",hdr,{passive:true});addEventListener("hashchange",hdr);
new MutationObserver(hdr).observe(mn,{attributes:true,attributeFilter:["hidden"],subtree:true});hdr();
/* shimmer placeholders: mark images once loaded */
document.addEventListener("load",function(e){if(e.target.tagName==="IMG")e.target.classList.add("ld")},true);
document.addEventListener("error",function(e){if(e.target.tagName==="IMG")e.target.classList.add("ld")},true);
var q=false;function mark(){q=false;$$("img:not(.ld)").forEach(function(i){if(i.complete&&i.naturalWidth)i.classList.add("ld")})}
new MutationObserver(function(){if(!q){q=true;requestAnimationFrame(mark)}}).observe(mn,{childList:true,subtree:true});mark();
/* lightbox: pinch-zoom, double-tap, pan, swipe */
var lb=document.createElement("div");lb.id="lb";lb.hidden=true;lb.setAttribute("role","dialog");lb.setAttribute("aria-modal","true");
lb.innerHTML='<div class="lb-top"><button class="lb-x" type="button" aria-label="Close">\u2715</button><span class="lb-n"></span></div><div class="lb-stage"><img alt="" draggable="false"></div><button class="lb-p" type="button" aria-label="Previous">\u2039</button><button class="lb-nx" type="button" aria-label="Next">\u203A</button>';
document.body.appendChild(lb);
var stage=$(".lb-stage",lb),im=$("img",lb),num=$(".lb-n",lb),set=[],ix=0,sc=1,tx=0,ty=0,ptr={},d0=0,s0=1,sx=0,sy=0,st0=0,moved=false,lastTap=0;
function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
function fit(){var mx=Math.max(0,(im.clientWidth*sc-stage.clientWidth)/2),my=Math.max(0,(im.clientHeight*sc-stage.clientHeight)/2);tx=clamp(tx,-mx,mx);ty=clamp(ty,-my,my)}
function ap(){fit();im.style.transform="translate("+tx+"px,"+ty+"px) scale("+sc+")"}
function go(i){if(i<0||i>=set.length)return;ix=i;sc=1;tx=ty=0;im.src=set[i].currentSrc||set[i].src;im.alt=set[i].alt||"";ap();num.textContent=(i+1)+" / "+set.length}
function open(list,i){set=list;lb.hidden=false;document.documentElement.classList.add("lbopen");go(i);$(".lb-x",lb).focus()}
function close(){lb.hidden=true;document.documentElement.classList.remove("lbopen");im.removeAttribute("src")}
function zoomAt(ns,cx,cy){var r=stage.getBoundingClientRect(),px=cx-(r.left+r.width/2),py=cy-(r.top+r.height/2);tx=px-(px-tx)*ns/sc;ty=py-(py-ty)*ns/sc;sc=ns;ap()}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest(".mview img,.faqimgs img");if(!t||e.target.closest("a"))return;var box=t.closest(".mview,.faqimgs"),list=$$("img",box);open(list,list.indexOf(t))});
$(".lb-x",lb).addEventListener("click",close);$(".lb-p",lb).addEventListener("click",function(){go(ix-1)});$(".lb-nx",lb).addEventListener("click",function(){go(ix+1)});
addEventListener("keydown",function(e){if(lb.hidden)return;if(e.key==="Escape")close();else if(e.key==="ArrowRight")go(ix+1);else if(e.key==="ArrowLeft")go(ix-1)});
function dist(){var k=Object.keys(ptr);if(k.length<2)return 0;var a=ptr[k[0]],b=ptr[k[1]];return Math.hypot(a.x-b.x,a.y-b.y)}
stage.addEventListener("pointerdown",function(e){stage.setPointerCapture(e.pointerId);ptr[e.pointerId]={x:e.clientX,y:e.clientY};moved=false;if(Object.keys(ptr).length===2){d0=dist();s0=sc}else{sx=e.clientX;sy=e.clientY;st0=Date.now()}});
stage.addEventListener("pointermove",function(e){var p=ptr[e.pointerId];if(!p)return;var dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
 if(Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)>6)moved=true;
 if(Object.keys(ptr).length===2&&d0){sc=clamp(s0*dist()/d0,1,5);ap()}else if(sc>1){tx+=dx;ty+=dy;ap()}});
function up(e){var p=ptr[e.pointerId];delete ptr[e.pointerId];if(!p)return;if(Object.keys(ptr).length===1){d0=0;return}if(Object.keys(ptr).length)return;
 var dx=e.clientX-sx,dy=e.clientY-sy;
 if(!moved){var n=Date.now();if(n-lastTap<300){if(sc>1){sc=1;tx=ty=0;ap()}else zoomAt(2.5,e.clientX,e.clientY);lastTap=0}else{lastTap=n;if(e.target===stage&&sc===1)close()}return}
 if(sc===1&&Date.now()-st0<700&&Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)go(dx<0?ix+1:ix-1)}
stage.addEventListener("pointerup",up);stage.addEventListener("pointercancel",up);
stage.addEventListener("wheel",function(e){e.preventDefault();var ns=clamp(sc*Math.exp(-e.deltaY*.0015),1,5);if(ns===1){sc=1;tx=ty=0;ap()}else zoomAt(ns,e.clientX,e.clientY)},{passive:false});
/* keyboard: Enter / Space activates nav cards (they are role=button divs) */
document.addEventListener("keydown",function(e){if(e.key!=="Enter"&&e.key!==" ")return;var t=e.target;if(t&&t.matches&&t.matches(".navcard[data-go]")){e.preventDefault();t.click()}});
})();

/* WhatsApp group share buttons */
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-share]");if(!b)return;e.preventDefault();var g=CONFIG.groups[+b.dataset.share];if(!g)return;var nm=tx(g),url=g.link,text=T[LANG]["grp.msg"].replace("{n}",nm);if(navigator.share){navigator.share({title:nm,text:text,url:url}).catch(function(){})}else{window.open("https://wa.me/?text="+encodeURIComponent(text+"\n"+url),"_blank","noopener")}});

/* dark / light theme toggle (preference kept in localStorage; falls back to the system setting) */
(function(){var root=document.documentElement,btn=document.getElementById("themeBtn");if(!btn)return;
function dark(){return root.getAttribute("data-theme")==="dark"}
function label(){var ar=(typeof LANG!=="undefined"?LANG:"ar")==="ar",t=dark()?(ar?"الوضع الفاتح":"Light mode"):(ar?"الوضع الداكن":"Dark mode");btn.setAttribute("aria-label",t);btn.title=t;btn.setAttribute("aria-pressed",dark())}
function apply(d,save){if(d)root.setAttribute("data-theme","dark");else root.removeAttribute("data-theme");label();if(save){try{localStorage.setItem("ssu-theme",d?"dark":"light")}catch(e){}}}
btn.addEventListener("click",function(){root.classList.add("tswitch");apply(!dark(),true);setTimeout(function(){root.classList.remove("tswitch")},450)});
["btnAr","btnEn"].forEach(function(id){var b=document.getElementById(id);b&&b.addEventListener("click",function(){setTimeout(label,0)})});
try{var mq=matchMedia("(prefers-color-scheme: dark)"),f=function(e){var s=null;try{s=localStorage.getItem("ssu-theme")}catch(x){}if(!s)apply(e.matches,false)};mq.addEventListener?mq.addEventListener("change",f):mq.addListener&&mq.addListener(f)}catch(e){}
label();
})();
