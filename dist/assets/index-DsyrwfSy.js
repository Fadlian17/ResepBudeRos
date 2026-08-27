(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))a(t);new MutationObserver(t=>{for(const i of t)if(i.type==="childList")for(const d of i.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&a(d)}).observe(document,{childList:!0,subtree:!0});function s(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?i.credentials="include":t.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function a(t){if(t.ep)return;t.ep=!0;const i=s(t);fetch(t.href,i)}})();const B=[{id:"sayur-asem",title:"Ibu's Sayur Asem",description:"A refreshing sweet and sour vegetable soup from West Java.",category:"Soups",md:"src/content/sayur-asem.md",scan:"public/scans/reseppart1.pdf",metadata:{dateScanned:"Oct 12, 2023",originalYear:"Jakarta 1990",location:"East Jakarta, Jakarta",format:"Hardbound Notebook"}},{id:"ayam-kecap",title:"Ayam Kecap",description:"Sweet soy sauce chicken dish.",category:"Main Dishes",md:"src/content/ayam-kecap.md",scan:"public/scans/ayam-kecap.pdf",metadata:{dateScanned:"Oct 12, 2023",originalYear:"Circa 1985",location:"East Jakarta, Jakarta",format:"Hardbound Notebook"}},{id:"soto-ayam",title:"Soto Ayam Kampung",description:"Traditional chicken soup.",category:"Soups",md:"src/content/soto-ayam.md",scan:"public/scans/soto.jpeg",metadata:{dateScanned:"Oct 12, 2023",originalYear:"Jakarta 1990",location:"East Jakarta, Jakarta",format:"Hardbound Notebook"}},{id:"sup-buntut",title:"Sup Buntut",description:"Oxtail soup.",category:"Soups",md:"src/content/sup-buntut.md",scan:"public/scans/reseppart1.pdf",metadata:{dateScanned:"Oct 12, 2023",originalYear:"Jakarta 1990",location:"East Jakarta, Jakarta",format:"Hardbound Notebook"}}],R=[{id:"family-1",title:"Family Moment",src:"public/gallery/family-1.svg",caption:"A warm day in the kitchen with grandma."},{id:"family-2",title:"Grandma's Kitchen",src:"public/gallery/family-2.svg",caption:"Dinner table stories and recipes."},{id:"family-3",title:"Holiday Memories",src:"public/gallery/family-3.svg",caption:"Moments we save in our hearts."}],l={view:"recipes",activeRecipeId:"sayur-asem",searchQuery:"",galleryPage:1,galleryPerPage:6,pdfViewers:{}};function Y(e,n=""){const s=(n||"").trim().toLowerCase();return s?e.filter(a=>a.id.toLowerCase().includes(s)||a.title.toLowerCase().includes(s)||(a.description||"").toLowerCase().includes(s)||(a.category||"").toLowerCase().includes(s)):e}function P(e){try{return e.replace(/^public\/(gallery|scans)\//,"public/$1/thumbs/").replace(/\.[^.]+$/,".webp")}catch{return e}}function W(){return new Promise((e,n)=>{const s=indexedDB.open("resep-cache",1);s.onupgradeneeded=a=>{const t=a.target.result;t.objectStoreNames.contains("pdf-thumbs")||t.createObjectStore("pdf-thumbs"),t.objectStoreNames.contains("pdf-pages")||t.createObjectStore("pdf-pages")},s.onsuccess=a=>e(a.target.result),s.onerror=a=>n(a.target.error)})}async function z(e,n){try{const s=await W();return await new Promise((a,t)=>{const o=s.transaction(e,"readonly").objectStore(e).get(n);o.onsuccess=()=>a(o.result),o.onerror=()=>t(o.error)})}catch{return null}}async function _(e,n,s){try{const a=await W();return await new Promise((t,i)=>{const r=a.transaction(e,"readwrite").objectStore(e).put(s,n);r.onsuccess=()=>t(!0),r.onerror=()=>i(r.error)})}catch{return!1}}let A=null,D=null;function U(e){A=e}function Q(e){D=e}function Z(e){document.querySelectorAll("[data-view]").forEach(n=>{const s=n.getAttribute("data-view")===e;n.classList.toggle("bg-primary/10",s),n.classList.toggle("text-primary",s),n.classList.toggle("text-slate-600",!s),n.classList.toggle("font-bold",s)})}function M(){const e=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");e.classList.add("-translate-x-full"),n.classList.add("hidden")}function ee(){const e=document.getElementById("sidebar"),n=document.getElementById("sidebar-overlay");e.classList.remove("-translate-x-full"),n.classList.remove("hidden")}function V(e){const n=document.getElementById("categories");n.innerHTML="";const s={};e.forEach(a=>{s[a.category]||(s[a.category]=[]),s[a.category].push(a)}),Object.keys(s).forEach(a=>{const t=document.createElement("div"),i=a==="Soups"?"restaurant":a==="Main Dishes"?"skillet":"icecream",d=s[a].some(o=>o.id===l.activeRecipeId);t.innerHTML=`
      <div class="flex items-center gap-2 px-3 py-1 mb-1">
        <span class="material-symbols-outlined text-${d?"primary":"slate-400"} text-sm">${i}</span>
        <span class="text-${d?"slate-900":"slate-600"} font-bold text-sm">${a}</span>
      </div>
      <div class="ml-6 space-y-1">
        ${s[a].map(o=>`
            <a class="block px-3 py-2 rounded-lg ${o.id===l.activeRecipeId?"bg-primary/10 text-primary font-bold border-l-4 border-primary":"text-slate-600 hover:text-primary transition-colors"} text-sm font-medium recipe-link" href="#" data-recipe="${o.id}">${o.title}</a>
          `).join("")}
      </div>
    `,n.appendChild(t)}),document.querySelectorAll(".recipe-link").forEach(a=>{a.addEventListener("click",t=>{t.preventDefault();const i=t.target.getAttribute("data-recipe");D&&D("recipes"),A&&A(i),window.innerWidth<768&&M()})})}async function te(e,n){try{if(!window.pdfjsLib)return;pdfjsLib&&pdfjsLib.GlobalWorkerOptions&&(pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js");const s=document.getElementById(`pdf-canvas-${e}`),a=document.getElementById(`pdf-thumbs-${e}`),t=document.getElementById(`pdf-page-info-${e}`),i=document.getElementById(`pdf-prev-${e}`),d=document.getElementById(`pdf-next-${e}`),o=document.getElementById(`pdf-zoom-in-${e}`),r=document.getElementById(`pdf-zoom-out-${e}`);if(!s)return;const u=s.getContext("2d"),L=await pdfjsLib.getDocument(n).promise,g={pdfDoc:L,currentPage:1,scale:1.2};l.pdfViewers=l.pdfViewers||{},l.pdfViewers[e]=g;const v=async h=>{const m=`${e}-page-${h}-scale-${g.scale}`,f=await z("pdf-pages",m);if(f){await new Promise(y=>{const b=new Image;b.onload=()=>{s.width=b.naturalWidth,s.height=b.naturalHeight,u.clearRect(0,0,s.width,s.height),u.drawImage(b,0,0),y()},b.onerror=()=>y(),b.src=f}),g.currentPage=h,t&&(t.textContent=`Page ${g.currentPage} / ${L.numPages}`);return}const I=await L.getPage(h),w=I.getViewport({scale:g.scale});s.width=Math.floor(w.width),s.height=Math.floor(w.height),s.style.width=`${Math.floor(w.width)}px`,s.style.height=`${Math.floor(w.height)}px`;const p={canvasContext:u,viewport:w};await I.render(p).promise;try{const y=s.toDataURL("image/webp",.9);_("pdf-pages",m,y).catch(()=>{})}catch{}g.currentPage=h,t&&(t.textContent=`Page ${g.currentPage} / ${L.numPages}`)};if(await v(1),i==null||i.addEventListener("click",async()=>{g.currentPage>1&&await v(g.currentPage-1)}),d==null||d.addEventListener("click",async()=>{g.currentPage<L.numPages&&await v(g.currentPage+1)}),o==null||o.addEventListener("click",async()=>{g.scale=Math.min(3,g.scale+.25),await v(g.currentPage)}),r==null||r.addEventListener("click",async()=>{g.scale=Math.max(.5,g.scale-.25),await v(g.currentPage)}),a){a.innerHTML="";const h=document.createElement("div");h.className="w-full flex items-center justify-center p-6",h.innerHTML='<svg class="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.2" stroke-width="4"></circle><path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path></svg>',a.appendChild(h);for(let m=1;m<=L.numPages;m++)try{const f=`${e}-thumb-${m}`,I=await z("pdf-thumbs",f);if(I){const x=document.createElement("img");x.src=I,x.className="rounded border p-1 bg-white flex-none",x.style.height="64px",x.style.display="block",x.addEventListener("click",async()=>{await v(m)}),a.appendChild(x);continue}const w=await L.getPage(m),p=w.getViewport({scale:.18}),y=document.createElement("canvas");y.width=Math.floor(p.width),y.height=Math.floor(p.height);const b=y.getContext("2d");await w.render({canvasContext:b,viewport:p}).promise;const $=y.toDataURL("image/webp",.75);_("pdf-thumbs",f,$).catch(()=>{});const c=document.createElement("img");c.src=$,c.className="rounded border p-1 bg-white flex-none",c.style.height="64px",c.addEventListener("click",async()=>{await v(m)}),a.appendChild(c)}catch(f){console.warn("thumb render failed",f)}h&&h.parentNode&&h.parentNode.removeChild(h)}}catch(s){console.error("PDF viewer init failed",s)}}function ae(e){return`
    <div>
      <h3 class="flex items-center gap-2 text-slate-900 font-bold text-xl mb-6 pb-2 border-b border-primary/20">
        <span class="material-symbols-outlined text-primary">shopping_basket</span>
        Ingredients
      </h3>
      <ul class="space-y-3 text-slate-700">
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>100g melinjo (seeds and leaves)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>1 sweet corn, cut into rounds</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>50g raw peanuts</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>1 chayote, peeled and cubed</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>5-6 long beans, cut into 3cm lengths</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>3 large tamarind pods (asam jawa)</span>
        </li>
        <li class="flex items-start gap-3">
          <span class="text-primary mt-1">•</span>
          <span>Salt and palm sugar to taste</span>
        </li>
      </ul>
    </div>
    <div>
      <h3 class="flex items-center gap-2 text-slate-900 font-bold text-xl mb-6 pb-2 border-b border-primary/20">
        <span class="material-symbols-outlined text-primary">description</span>
        Instructions
      </h3>
      <ol class="space-y-6 text-slate-700">
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</span>
          <p class="pt-1">Boil 1.5 liters of water in a large pot. Add the peanuts, melinjo seeds, and corn. Cook until they begin to soften.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</span>
          <p class="pt-1">Stir in the spice paste (bumbu halus) and lemongrass. Simmer for 10 minutes to let the flavors meld.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</span>
          <p class="pt-1">Add the chayote and long beans. Cook until the vegetables are tender but still have a slight bite.</p>
        </li>
        <li class="flex gap-4">
          <span class="flex-none w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</span>
          <p class="pt-1">Finally, add the tamarind water, palm sugar, and salt. Taste and adjust. It should be perfectly balanced between sour, sweet, and salty.</p>
        </li>
      </ol>
    </div>
    <div class="mt-8 bg-white/50 border-2 border-dashed border-primary/20 p-8 rounded-xl relative overflow-hidden">
      <span class="material-symbols-outlined absolute -top-4 -right-4 text-8xl text-primary/5 rotate-12">format_quote</span>
      <h4 class="text-primary font-bold text-sm uppercase tracking-widest mb-3">Chef's Note</h4>
      <p class="text-slate-800 font-serif text-2xl italic leading-relaxed">
        "Ibu always said: Don't forget the extra tamarind for freshness. It's the secret to a bright morning soup."
      </p>
    </div>
  `}function ne(e){const n=document.createElement("div");return n.innerHTML=`
    <div class="scanned-page-shadow rounded-sm transition-transform duration-500 group-hover:rotate-1">
      <div class="aspect-[3/4] w-full bg-[#fdfaf5] border border-black/5 p-8 flex flex-col overflow-hidden relative">
        <div class="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/parchment.png')]"></div>
        <div class="absolute inset-0 opacity-10 bg-gradient-to-br from-yellow-900/20 to-transparent"></div>
        <div class="mb-4">
          <div class="h-8 w-48 bg-slate-900/10 rounded-sm mb-2 opacity-50"></div>
          <div class="h-4 w-32 bg-slate-900/5 rounded-sm opacity-50"></div>
        </div>
        <div class="space-y-4">
          <div class="flex items-center gap-2">
            <div class="h-2 w-full bg-slate-900/5 rounded-full opacity-50"></div>
          </div>
          <div class="space-y-2 pl-4">
            <div class="h-2 w-3/4 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-4/5 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-2/3 bg-slate-900/5 rounded-full opacity-30"></div>
          </div>
          <div class="h-2 w-full bg-slate-900/5 rounded-full opacity-50"></div>
          <div class="space-y-2 pl-4">
            <div class="h-2 w-5/6 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-3/4 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-4/5 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-2/3 bg-slate-900/5 rounded-full opacity-30"></div>
            <div class="h-2 w-5/6 bg-slate-900/5 rounded-full opacity-30"></div>
          </div>
        </div>
        ${e.scan.endsWith(".pdf")?`<div id="pdf-viewer-${e.id}" class="absolute inset-0 w-full h-full bg-white flex flex-col">
              <div class="flex-1 overflow-hidden flex items-center justify-center bg-slate-100" style="min-height:0;">
                <canvas id="pdf-canvas-${e.id}" class="max-w-full max-h-full"></canvas>
              </div>
              <div id="pdf-controls-${e.id}" class="w-full p-2 bg-white border-t border-primary/10 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <button id="pdf-prev-${e.id}" class="px-3 py-1 rounded bg-white border">Prev</button>
                  <button id="pdf-next-${e.id}" class="px-3 py-1 rounded bg-white border">Next</button>
                  <span id="pdf-page-info-${e.id}" class="text-sm text-slate-600 ml-2"></span>
                </div>
                <div class="flex items-center gap-2">
                  <button id="pdf-zoom-out-${e.id}" class="px-2 py-1 rounded bg-white border">-</button>
                  <button id="pdf-zoom-in-${e.id}" class="px-2 py-1 rounded bg-white border">+</button>
                </div>
              </div>
            </div>
            <div id="pdf-thumbs-${e.id}" class="absolute bottom-0 left-0 right-0 flex gap-2 overflow-x-auto p-2 bg-white/80"></div>`:(()=>{const s=P(e.scan);return`<img class="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" src="/${s}" srcset="/${s} 400w, /${e.scan} 1200w" sizes="(max-width:640px) 90vw, 400px" alt="Scanned handwritten recipe" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${e.scan}'; this.removeAttribute('srcset');" />`})()}
      </div>
    </div>
    <div class="mt-8 text-center px-4">
      <p class="text-slate-500 text-sm italic font-medium">Page 42 of Ibu's Red Notebook (c. ${e.metadata.originalYear})</p>
      <div class="mt-4 flex justify-center gap-4">
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">zoom_in</span>
        </button>
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">download</span>
        </button>
        <button class="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:text-primary transition-colors">
          <span class="material-symbols-outlined">print</span>
        </button>
      </div>
    </div>
  `,n}function se(e){const n=document.createElement("div");return n.innerHTML=`
    <div class="flex justify-between">
      <span class="font-bold">Date Scanned:</span>
      <span>${e.metadata.dateScanned}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Original Year:</span>
      <span>${e.metadata.originalYear}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Location:</span>
      <span>${e.metadata.location}</span>
    </div>
    <div class="flex justify-between">
      <span class="font-bold">Format:</span>
      <span>${e.metadata.format}</span>
    </div>
  `,n}function K(e){const n=B.find(i=>i.id===e);if(!n)return;l.activeRecipeId=e,document.getElementById("current-recipe").textContent=n.title,document.getElementById("recipe-title").textContent=n.title,document.getElementById("recipe-description").textContent=n.description;const s=document.getElementById("recipe-content");s.innerHTML=ae();const a=document.getElementById("scan-container");a.innerHTML="",a.appendChild(ne(n)),n.scan&&n.scan.toLowerCase().endsWith(".pdf")&&window.pdfjsLib&&te(n.id,`/${n.scan}`);const t=document.getElementById("metadata");t.innerHTML="",t.appendChild(se(n)),l.view==="recipes"&&V(Y(B,l.searchQuery))}function O(e){const n=document.getElementById("lightbox-overlay"),s=document.getElementById("lightbox-content");l._previouslyFocusedElement=document.activeElement,s.innerHTML=e,n.classList.remove("hidden"),n.classList.add("open"),n.setAttribute("aria-hidden","false"),setTimeout(()=>{const a=n.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');(a&&a.length?a[0]:n).focus()},10),l._modalKeyHandler=a=>{if(a.key==="Escape"){a.preventDefault(),k();return}if(a.key==="ArrowLeft"){const t=document.getElementById("lightbox-prev");t&&!t.disabled&&t.click();return}if(a.key==="ArrowRight"){const t=document.getElementById("lightbox-next");t&&!t.disabled&&t.click();return}if(a.key==="Tab"){const t=Array.from(n.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])')).filter(d=>d.offsetParent!==null);if(!t.length){a.preventDefault();return}const i=t.indexOf(document.activeElement);a.shiftKey&&i===0?(t[t.length-1].focus(),a.preventDefault()):!a.shiftKey&&i===t.length-1&&(t[0].focus(),a.preventDefault())}},document.addEventListener("keydown",l._modalKeyHandler)}function k(){const e=document.getElementById("lightbox-overlay");e.classList.add("hidden"),e.classList.remove("open"),e.setAttribute("aria-hidden","true");const n=document.getElementById("lightbox-content");n.innerHTML="",l._modalKeyHandler&&(document.removeEventListener("keydown",l._modalKeyHandler),l._modalKeyHandler=null);try{l._previouslyFocusedElement&&typeof l._previouslyFocusedElement.focus=="function"&&l._previouslyFocusedElement.focus()}catch{}l._previouslyFocusedElement=null}function ie(e,n=0){l.galleryItems=e,l.lightboxIndex=n;function s(){var u,E,L,g,v,h;const a=l.galleryItems[l.lightboxIndex],t=l.lightboxIndex===0,i=l.lightboxIndex===l.galleryItems.length-1,d=`
      <div class="relative bg-white rounded-xl overflow-hidden shadow-lg">
        <div class="flex items-center justify-between p-4 border-b border-primary/10">
          <div>
            <h3 class="font-bold text-lg text-slate-900">${a.title}</h3>
            <p class="text-slate-600 text-sm">${a.caption}</p>
          </div>
          <div class="flex items-center gap-2">
            <button id="lightbox-prev" class="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50" ${t?"disabled":""} aria-label="Previous">
              <span class="material-symbols-outlined">chevron_left</span>
            </button>
            <button id="lightbox-next" class="p-2 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50" ${i?"disabled":""} aria-label="Next">
              <span class="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </div>
        <div class="p-4">
          <div class="aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden relative" id="lightbox-media-wrap">
            <div id="lightbox-toolbar" class="absolute top-3 right-3 z-20 flex items-center gap-2">
              <button id="lightbox-zoom-out" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Zoom out">-</button>
              <button id="lightbox-zoom-fit" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Fit">⤢</button>
              <button id="lightbox-zoom-in" class="p-2 rounded-md bg-white/90 shadow-sm" aria-label="Zoom in">+</button>
            </div>
            <div id="lightbox-media" class="w-full h-full flex items-center justify-center bg-slate-100">
              ${a.src.endsWith(".pdf")?`<embed src="/${a.src}" type="application/pdf" class="w-full h-full object-cover" />`:(()=>{const m=P(a.src);return`<img id="lightbox-img" src="/${m}" srcset="/${m} 800w, /${a.src} 1600w" sizes="(max-width:640px) 90vw, 1200px" alt="${a.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${a.src}'; this.removeAttribute('srcset');" class="max-w-full max-h-full object-contain touch-manipulation" style="transform-origin:center center;"/>`})()}
            </div>
          </div>
        </div>
        <div class="p-4 border-t border-primary/10 text-left">
          <div id="lightbox-caption" class="text-slate-700 text-sm">${a.caption}</div>
        </div>
        <div class="p-4 border-t border-primary/10 text-right">
          <button id="lightbox-close-btn" class="px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90">Close</button>
        </div>
      </div>
    `;O(d),(u=document.getElementById("lightbox-prev"))==null||u.addEventListener("click",()=>{l.lightboxIndex>0&&(l.lightboxIndex-=1,s())}),(E=document.getElementById("lightbox-next"))==null||E.addEventListener("click",()=>{l.lightboxIndex<l.galleryItems.length-1&&(l.lightboxIndex+=1,s())}),(L=document.getElementById("lightbox-close-btn"))==null||L.addEventListener("click",k);const o=m=>{if(m<0||m>=l.galleryItems.length)return;const f=l.galleryItems[m].src;if(!f||f.endsWith(".pdf"))return;const I=new Image;I.src=`/${l.galleryItems[m].src}`};o(l.lightboxIndex-1),o(l.lightboxIndex+1);const r=document.getElementById("lightbox-img");if(r){r.dataset.scale="1",r.dataset.translateX="0",r.dataset.translateY="0";const m=()=>{const c=parseFloat(r.dataset.scale||"1"),x=parseFloat(r.dataset.translateX||"0"),C=parseFloat(r.dataset.translateY||"0");r.style.transform=`translate(${x}px, ${C}px) scale(${c})`};r.addEventListener("wheel",c=>{c.preventDefault();const x=c.deltaY>0?-.1:.1;let C=parseFloat(r.dataset.scale||"1");C=Math.min(4,Math.max(.5,C+x)),r.dataset.scale=C.toString(),m()},{passive:!1}),(g=document.getElementById("lightbox-zoom-in"))==null||g.addEventListener("click",()=>{let c=parseFloat(r.dataset.scale||"1");c=Math.min(4,c+.25),r.dataset.scale=c,m()}),(v=document.getElementById("lightbox-zoom-out"))==null||v.addEventListener("click",()=>{let c=parseFloat(r.dataset.scale||"1");c=Math.max(.5,c-.25),r.dataset.scale=c,m()}),(h=document.getElementById("lightbox-zoom-fit"))==null||h.addEventListener("click",()=>{r.dataset.scale="1",r.dataset.translateX="0",r.dataset.translateY="0",m()});let f=!1,I=0,w=0,p=0,y=0;r.addEventListener("pointerdown",c=>{r.setPointerCapture(c.pointerId),f=!0,I=c.clientX,w=c.clientY,p=parseFloat(r.dataset.translateX||"0"),y=parseFloat(r.dataset.translateY||"0")}),r.addEventListener("pointermove",c=>{if(!f)return;const x=c.clientX-I,C=c.clientY-w;r.dataset.translateX=(p+x).toString(),r.dataset.translateY=(y+C).toString(),m()}),r.addEventListener("pointerup",c=>{r.releasePointerCapture(c.pointerId),f=!1}),r.addEventListener("pointercancel",()=>{f=!1});const b=new Map;let $=null;r.addEventListener("pointerdown",c=>{b.set(c.pointerId,c)}),r.addEventListener("pointerup",c=>{b.delete(c.pointerId),$=null}),r.addEventListener("pointercancel",c=>{b.delete(c.pointerId),$=null}),r.addEventListener("pointermove",c=>{if(b.has(c.pointerId)&&(b.set(c.pointerId,c),b.size===2)){const x=Array.from(b.values()),C=x[0].clientX-x[1].clientX,X=x[0].clientY-x[1].clientY,F=Math.hypot(C,X);if($!=null){const G=(F-$)/200;let N=parseFloat(r.dataset.scale||"1");N=Math.min(4,Math.max(.5,N+G)),r.dataset.scale=N.toString(),m()}$=F}})}}s()}function H(e=""){document.getElementById("current-recipe").textContent="Family Gallery",document.getElementById("recipe-title").textContent="Family Gallery",document.getElementById("recipe-description").textContent="A curated collection of family moments and memories.";const n=e.trim()?R.filter(o=>o.title.toLowerCase().includes(e.toLowerCase())||o.caption.toLowerCase().includes(e.toLowerCase())):R,s=Math.max(1,Math.ceil(n.length/l.galleryPerPage));l.galleryPage=Math.min(l.galleryPage,s);const a=(l.galleryPage-1)*l.galleryPerPage,t=n.slice(a,a+l.galleryPerPage),i=document.getElementById("recipe-content");i.innerHTML="";const d=document.createElement("div");if(d.className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6",t.forEach((o,r)=>{const u=document.createElement("div");u.className="rounded-xl overflow-hidden bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-shadow cursor-pointer";const E=P(o.src);u.innerHTML=`
      <img src="/${E}" srcset="/${E} 400w, /${o.src} 1200w" sizes="(max-width: 640px) 90vw, 400px" alt="${o.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${o.src}'; this.removeAttribute('srcset');" class="w-full h-40 object-cover" />
      <div class="p-4">
        <h3 class="font-bold text-lg text-slate-900">${o.title}</h3>
        <p class="text-slate-700 text-sm mt-2">${o.caption}</p>
      </div>
    `,u.addEventListener("click",()=>{ie(n,a+r)}),d.appendChild(u)}),!n.length){const o=document.createElement("p");o.className="text-slate-500 italic",o.textContent="No gallery items match your search.",i.appendChild(o);return}if(i.appendChild(d),s>1){const o=document.createElement("div");o.className="flex items-center justify-center gap-3 mt-8";const r=document.createElement("button");r.className="px-3 py-2 rounded-lg bg-white border border-primary/20 text-sm font-medium hover:bg-primary/10",r.disabled=l.galleryPage===1,r.textContent="Prev",r.addEventListener("click",()=>{l.galleryPage>1&&(l.galleryPage-=1,H(e))});const u=document.createElement("button");u.className="px-3 py-2 rounded-lg bg-white border border-primary/20 text-sm font-medium hover:bg-primary/10",u.disabled=l.galleryPage===s,u.textContent="Next",u.addEventListener("click",()=>{l.galleryPage<s&&(l.galleryPage+=1,H(e))});const E=document.createElement("span");E.className="text-sm text-slate-600",E.textContent=`Page ${l.galleryPage} of ${s}`,o.appendChild(r),o.appendChild(E),o.appendChild(u),i.appendChild(o)}}function re(e){var s,a;const n=`
    <div class="relative bg-white rounded-xl overflow-hidden shadow-lg">
      <div class="flex items-center justify-between p-4 border-b border-primary/10">
        <div>
          <h3 class="font-bold text-lg text-slate-900">${e.title}</h3>
          <p class="text-slate-600 text-sm">${e.description}</p>
        </div>
        <button id="lightbox-close-btn" class="px-4 py-2 rounded-full bg-primary text-white shadow-sm hover:bg-primary/90">Close</button>
      </div>
      <div class="p-4">
        <div class="aspect-[16/9] w-full bg-slate-100 rounded-lg overflow-hidden mb-4">
          ${e.scan.endsWith(".pdf")?`<embed src="/${e.scan}" type="application/pdf" class="w-full h-full object-cover" />`:(()=>{const t=P(e.scan);return`<img src="/${t}" srcset="/${t} 800w, /${e.scan} 1600w" sizes="(max-width:640px) 90vw, 800px" alt="${e.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${e.scan}'; this.removeAttribute('srcset');" class="w-full h-full object-cover" />`})()}
        </div>
        <div class="flex flex-col gap-2">
          <button id="ocr-run" class="px-4 py-2 rounded-lg bg-primary text-white shadow-sm hover:bg-primary/90">Extract text (OCR)</button>
          <textarea id="ocr-output" class="w-full h-40 p-3 border border-primary/20 rounded-lg bg-slate-50 text-sm text-slate-700" readonly placeholder="OCR results will appear here..."></textarea>
        </div>
      </div>
    </div>
  `;O(n),(s=document.getElementById("lightbox-close-btn"))==null||s.addEventListener("click",k),(a=document.getElementById("ocr-run"))==null||a.addEventListener("click",async()=>{const t=document.getElementById("ocr-output"),i=`/${e.scan}`;if(e.scan.endsWith(".pdf")){t.value="OCR is not available for PDF previews. Convert a page to an image or place a text file at `/public/ocr/${recipe.id}.txt`.";return}if(!window.Tesseract){t.value="Tesseract is not loaded. Please ensure tesseract.js is included in the page to use OCR.";return}t.value="Recognizing text… This can take 10–30 seconds for a scanned page.";try{const d=await Tesseract.recognize(i,"eng",{logger:o=>{o.status==="recognizing text"&&(t.value=`Recognizing text… ${Math.round(o.progress*100)}%`)}});t.value=d.data.text.trim()||"No text recognized (try a clearer scan or provide a pre-extracted text file at /ocr/${recipe.id}.txt)."}catch(d){console.error(d),t.value="OCR failed. You can provide a pre-extracted text file at `/public/ocr/${recipe.id}.txt`."}})}function oe(e=""){document.getElementById("current-recipe").textContent="Handwritten Notes",document.getElementById("recipe-title").textContent="Handwritten Notes",document.getElementById("recipe-description").textContent="Browse the original recipes as scanned pages.";const n=e.trim()?B.filter(t=>t.title.toLowerCase().includes(e.toLowerCase())||t.id.toLowerCase().includes(e.toLowerCase())):B,s=document.getElementById("recipe-content");s.innerHTML="";const a=document.createElement("div");if(a.className="flex gap-6 overflow-x-auto py-4 px-1 snap-x snap-mandatory",n.forEach(t=>{const i=document.createElement("div");i.className="min-w-[260px] flex-shrink-0 snap-start rounded-xl overflow-hidden bg-white/80 shadow-sm border border-primary/10 hover:shadow-md transition-shadow cursor-pointer",i.innerHTML=`
      <div class="relative h-40 bg-slate-100">
        ${t.scan.endsWith(".pdf")?`<embed src="/${t.scan}" type="application/pdf" class="w-full h-full object-cover" />`:(()=>{const d=P(t.scan);return`<img src="/${d}" srcset="/${d} 400w, /${t.scan} 1200w" sizes="(max-width:640px) 90vw, 400px" alt="Scan ${t.title}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='/${t.scan}'; this.removeAttribute('srcset');" class="w-full h-full object-cover" />`})()}
        <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900/70 to-transparent px-3 py-2">
          <p class="text-sm text-white font-semibold">${t.title}</p>
        </div>
      </div>
      <div class="p-4">
        <p class="text-slate-700 text-sm mb-3">${t.description}</p>
        <button class="w-full px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90">Open notes</button>
      </div>
    `,i.addEventListener("click",()=>re(t)),a.appendChild(i)}),!n.length){const t=document.createElement("p");t.className="text-slate-500 italic",t.textContent="No notes match your search.",s.appendChild(t);return}s.appendChild(a)}function T(e,n,s=null,a=!1){const t={},i=sessionStorage.getItem("admin_token");i&&(t.Authorization=`Bearer ${i}`);const d={method:e,headers:t};return s&&(a?d.body=s:(t["Content-Type"]="application/json",d.body=JSON.stringify(s))),fetch(n,d).then(async o=>{const r=await o.text();try{const u=r?JSON.parse(r):null;if(!o.ok)throw u||{error:"request failed"};return u}catch(u){if(o.ok)return r;throw u}})}function q(e){var s,a;O(`
    <div class="p-6 bg-white rounded-xl">
      <h3 class="font-bold text-lg mb-3">Admin verification</h3>
      <p class="text-sm text-slate-600 mb-4">Enter admin code to continue.</p>
      <input id="admin-code-input" type="password" class="w-full p-2 border rounded mb-4" placeholder="Admin code" />
      <div class="flex gap-2 justify-end">
        <button id="admin-verify-cancel" class="px-4 py-2 rounded bg-white border">Cancel</button>
        <button id="admin-verify-submit" class="px-4 py-2 rounded bg-primary text-white">Verify</button>
      </div>
    </div>
  `),(s=document.getElementById("admin-verify-cancel"))==null||s.addEventListener("click",k),(a=document.getElementById("admin-verify-submit"))==null||a.addEventListener("click",async()=>{const t=document.getElementById("admin-code-input").value;if(!t)return alert("Please enter admin code");try{const i=await fetch("/admin/verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:t})}),d=await i.json();if(!i.ok)throw d;sessionStorage.setItem("admin_token",d.token),k(),typeof e=="function"&&e()}catch{alert("Verification failed")}})}function le(){document.getElementById("current-recipe").textContent="Admin",document.getElementById("recipe-title").textContent="Admin Panel",document.getElementById("recipe-description").textContent="Manage recipes: create, edit, delete.",j()}async function j(){const e=document.getElementById("recipe-content");e.innerHTML="";const n=document.createElement("div");n.className="flex items-center justify-between mb-4",n.innerHTML='<h3 class="font-bold">Recipes</h3>';const s=document.createElement("button");s.className="px-4 py-2 rounded bg-primary text-white",s.textContent="Create Recipe",s.addEventListener("click",()=>J(null)),n.appendChild(s),e.appendChild(n);let a;try{a=await T("GET","/api/recipes")}catch{e.appendChild(document.createTextNode("Failed to load recipes"));return}const t=document.createElement("div");t.className="grid grid-cols-1 md:grid-cols-2 gap-4",a.forEach(i=>{const d=document.createElement("div");d.className="p-4 bg-white rounded-lg border flex items-center gap-4",d.innerHTML=`
      <div class="w-24 h-20 bg-slate-100 flex items-center justify-center overflow-hidden rounded">${i.scanThumb?`<img src="/${i.scanThumb}" class="w-full h-full object-cover" />`:'<span class="text-xs text-slate-500">No image</span>'}</div>
      <div class="flex-1">
        <div class="font-bold">${i.title}</div>
        <div class="text-sm text-slate-600">${i.category||""}</div>
      </div>
      <div class="flex flex-col gap-2">
        <button class="px-3 py-1 rounded bg-white border edit-btn" data-id="${i.id}">Edit</button>
        <button class="px-3 py-1 rounded bg-red-600 text-white delete-btn" data-id="${i.id}">Delete</button>
      </div>
    `,t.appendChild(d)}),e.appendChild(t),e.querySelectorAll(".edit-btn").forEach(i=>i.addEventListener("click",async d=>{const o=d.target.getAttribute("data-id");try{const r=await T("GET",`/api/recipes/${o}`);J(r)}catch{alert("Failed to load recipe")}})),e.querySelectorAll(".delete-btn").forEach(i=>i.addEventListener("click",async d=>{const o=d.target.getAttribute("data-id");if(!confirm("Delete this recipe?"))return;const r=sessionStorage.getItem("admin_token"),u=async()=>{try{await T("DELETE",`/api/recipes/${o}`),alert("Deleted"),j()}catch{alert("Delete failed")}};r?u():q(u)}))}function J(e=null){const n=!!e,s=document.getElementById("recipe-content");s.innerHTML="";const a=document.createElement("form");a.className="grid grid-cols-1 md:grid-cols-2 gap-4",a.innerHTML=`
    <div>
      <label class="block mb-2">Title <input id="admin-title" class="w-full p-2 border rounded" value="${n?e.title.replace(/"/g,"&quot;"):""}" /></label>
      <label class="block mb-2">Category <input id="admin-category" class="w-full p-2 border rounded" value="${n&&e.category||""}" /></label>
      <label class="block mb-2">Scan file <input id="admin-scan" type="file" accept=".pdf,image/*" class="w-full p-2" /></label>
      <label class="block mb-2">Markdown content <textarea id="admin-md" class="w-full p-2 border rounded" rows="8">${n&&e.md||""}</textarea></label>
    </div>
    <div>
      <label class="block mb-2">Description <textarea id="admin-description" class="w-full p-2 border rounded" rows="4">${n&&e.description||""}</textarea></label>
      <label class="block mb-2">Metadata (JSON) <textarea id="admin-metadata" class="w-full p-2 border rounded" rows="4">${n?JSON.stringify(e.metadata||{}):"{}"}</textarea></label>
      <div class="flex gap-2 mt-4">
        <button type="submit" class="px-4 py-2 rounded bg-primary text-white">${n?"Update":"Create"}</button>
        <button type="button" id="admin-cancel" class="px-4 py-2 rounded bg-white border">Cancel</button>
      </div>
    </div>
  `,s.appendChild(a),document.getElementById("admin-cancel").addEventListener("click",()=>j()),a.addEventListener("submit",async t=>{t.preventDefault();const i=document.getElementById("admin-title").value.trim(),d="admin-form-error";let o=document.getElementById(d);if(o||(o=document.createElement("div"),o.id=d,o.className="text-sm text-red-600 mb-2",a.prepend(o)),o.textContent="",!i||i.length<3){o.textContent="Title is required (min 3 chars)";return}const r=document.getElementById("admin-category").value.trim(),u=document.getElementById("admin-description").value.trim(),E=document.getElementById("admin-md").value;let L={};try{L=JSON.parse(document.getElementById("admin-metadata").value||"{}")}catch{o.textContent="Invalid metadata JSON";return}const g=document.getElementById("admin-scan"),v=new FormData;if(v.append("title",i),v.append("category",r),v.append("description",u),v.append("md",E),v.append("metadata",JSON.stringify(L)),g.files&&g.files[0]){const p=g.files[0];if(!["application/pdf","image/png","image/jpeg","image/webp"].includes(p.type)){o.textContent="Invalid file type";return}if(p.size>50*1024*1024){o.textContent="File too large (max 50MB)";return}v.append("scan",p)}let h=document.getElementById("admin-upload-preview");h||(h=document.createElement("div"),h.id="admin-upload-preview",h.className="mt-3 mb-2",a.appendChild(h));let m=document.getElementById("admin-upload-progress");m||(m=document.createElement("div"),m.id="admin-upload-progress",m.className="w-full bg-slate-100 rounded overflow-hidden mt-2 hidden",m.innerHTML='<div id="admin-upload-bar" class="h-2 bg-primary" style="width:0%"></div>',a.appendChild(m));let f=document.getElementById("admin-server-response");if(f||(f=document.createElement("pre"),f.id="admin-server-response",f.className="mt-3 text-sm bg-white p-2 rounded border text-slate-700",a.appendChild(f)),f.textContent="",g.files&&g.files[0]){const p=g.files[0];if(p.type.startsWith("image/")){const y=new FileReader;y.onload=b=>{h.innerHTML=`<img src="${b.target.result}" class="max-w-full max-h-48 rounded border" />`},y.readAsDataURL(p)}else h.innerHTML=`<div class="text-sm text-slate-600">Selected file: ${p.name}</div>`}else h.innerHTML="";const I=sessionStorage.getItem("admin_token"),w=()=>{const p=new XMLHttpRequest,y=n?`/api/recipes/${e.id}`:"/api/recipes";p.open(n?"PUT":"POST",y),sessionStorage.getItem("admin_token")&&p.setRequestHeader("Authorization",`Bearer ${sessionStorage.getItem("admin_token")}`),m.classList.remove("hidden"),p.upload.onprogress=b=>{if(b.lengthComputable){const $=Math.round(b.loaded/b.total*100);document.getElementById("admin-upload-bar").style.width=`${$}%`}},p.onload=()=>{m.classList.add("hidden");try{const b=JSON.parse(p.responseText||"{}");f.textContent=JSON.stringify(b,null,2),p.status>=200&&p.status<300&&(alert(n?"Updated":"Created"),j())}catch{f.textContent=p.responseText,alert("Server responded")}},p.onerror=()=>{m.classList.add("hidden"),f.textContent="Network error"},p.send(v)};I?w():q(w)})}function S(e){l.view=e,Z(e);const n=document.getElementById("categories"),s=document.getElementById("scan-panel");e==="recipes"?(n.classList.remove("hidden"),s.classList.remove("hidden"),V(Y(B,l.searchQuery)),K(l.activeRecipeId)):(n.classList.add("hidden"),s.classList.add("hidden"),e==="gallery"?H(l.searchQuery):e==="notes"?oe(l.searchQuery):e==="admin"&&le())}function de(){U(K),Q(S),document.getElementById("search-input").addEventListener("input",i=>{l.searchQuery=i.target.value,S(l.view)});const n=document.getElementById("sidebar-toggle"),s=document.getElementById("sidebar-overlay"),a=document.getElementById("lightbox-overlay"),t=document.getElementById("lightbox-close");n.addEventListener("click",()=>{document.getElementById("sidebar").classList.contains("-translate-x-full")?ee():M()}),s.addEventListener("click",M),a&&a.addEventListener("click",i=>{i.target===a&&k()}),t&&t.addEventListener("click",k),document.querySelectorAll("[data-view]").forEach(i=>{i.addEventListener("click",()=>{const d=i.getAttribute("data-view");S(d),window.innerWidth<768&&M()})}),S("recipes")}window.addEventListener("DOMContentLoaded",de);
