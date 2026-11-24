/* Video cards + modal player. Data lives in VIDEOS (js/data.js).
   Nothing from YouTube is requested until a page with videos is opened (thumbnail),
   and the player iframe is only created when a student clicks a card. */
(function(){
var last=null,modal=null;
function t(o){return o&&(o[typeof LANG!=="undefined"?LANG:"ar"]||o.ar)||""}
function lbl(k){var ar=(typeof LANG!=="undefined"?LANG:"ar")==="ar";return{video:ar?"فيديو • YouTube":"Video • YouTube",play:ar?"تشغيل":"Play",close:ar?"إغلاق":"Close",yt:ar?"فتح في YouTube":"Open on YouTube"}[k]}
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]})}
var PLAY='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>';
var YT='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.3 5 12 5 12 5s-6.3 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2C2 8.74 2 12 2 12s0 3.26.4 4.8a2.5 2.5 0 0 0 1.76 1.77C5.7 19 12 19 12 19s6.3 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77C22 15.26 22 12 22 12s0-3.26-.4-4.8zM10 15V9l5.2 3z"/></svg>';
function card(v){var ti=esc(t(v.title)),h=esc(t(v.heading||v.title)),d=t(v.desc);
return '<article class="vcard"><h3><span aria-hidden="true">📖</span> '+h+'</h3>'+(d?'<p>'+esc(d)+'</p>':'')+
'<button type="button" class="vrow" data-vid="'+esc(v.id)+'" data-vt="'+ti+'" aria-label="'+lbl("play")+': '+ti+'">'+
'<span class="vthumb"><img loading="lazy" decoding="async" width="480" height="360" alt="" src="https://i.ytimg.com/vi/'+esc(v.id)+'/hqdefault.jpg"><span class="vplay">'+PLAY+'</span></span>'+
'<span class="vmeta"><b>'+ti+'</b><small>'+YT+'<span>'+lbl("video")+'</span></small></span></button></article>'}
function render(){if(typeof VIDEOS==="undefined")return;document.querySelectorAll("[data-videos]").forEach(function(el){var list=VIDEOS[el.getAttribute("data-videos")]||[];el.innerHTML=list.map(card).join("");el.hidden=!list.length})}
function build(){modal=document.createElement("div");modal.id="vm";modal.className="vm";modal.hidden=true;modal.setAttribute("role","dialog");modal.setAttribute("aria-modal","true");
modal.innerHTML='<div class="vbox"><div class="vtop"><b id="vmT"></b><button type="button" class="vx" aria-label=""><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div><div class="vframe"></div><a class="vyt" target="_blank" rel="noopener"></a></div>';
document.body.appendChild(modal);
modal.addEventListener("click",function(e){if(e.target===modal||e.target.closest(".vx"))close()})}
function open(id,title,opener){if(!modal)build();last=opener||null;
var fr=modal.querySelector(".vframe");fr.innerHTML='<iframe src="https://www.youtube-nocookie.com/embed/'+encodeURIComponent(id)+'?rel=0&modestbranding=1&playsinline=1&autoplay=0" title="'+esc(title)+'" loading="eager" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowfullscreen></iframe>';
modal.querySelector("#vmT").textContent=title;var x=modal.querySelector(".vx");x.setAttribute("aria-label",lbl("close"));modal.setAttribute("aria-label",title);
var a=modal.querySelector(".vyt");a.href="https://www.youtube.com/watch?v="+encodeURIComponent(id);a.textContent=lbl("yt");
modal.hidden=false;document.documentElement.classList.add("vlock");x.focus()}
function close(){if(!modal||modal.hidden)return;modal.hidden=true;modal.querySelector(".vframe").innerHTML="";document.documentElement.classList.remove("vlock");if(last&&last.focus)last.focus()}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".vrow");if(b)open(b.getAttribute("data-vid"),b.getAttribute("data-vt"),b)});
document.addEventListener("keydown",function(e){if(!modal||modal.hidden)return;if(e.key==="Escape")close();else if(e.key==="Tab"){var f=modal.querySelectorAll("button,a[href]");if(!f.length)return;var a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&document.activeElement===z){e.preventDefault();a.focus()}}});
["btnAr","btnEn"].forEach(function(id){var b=document.getElementById(id);b&&b.addEventListener("click",function(){setTimeout(function(){render();if(modal&&!modal.hidden){modal.querySelector(".vx").setAttribute("aria-label",lbl("close"));modal.querySelector(".vyt").textContent=lbl("yt")}},0)})});
document.addEventListener("error",function(e){var i=e.target;if(i&&i.tagName==="IMG"&&i.closest&&i.closest(".vthumb"))i.style.display="none"},true);
render();
})();
