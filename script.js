const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const nav=$("#nav"), menuBtn=$(".menu-btn");
menuBtn.addEventListener("click",()=>{nav.style.display=nav.style.display==="flex"?"none":"flex"});
$$("nav a").forEach(a=>a.addEventListener("click",()=>{if(innerWidth<951)nav.style.display="none"}));
const themeBtn=$("#themeBtn");
const saved=localStorage.getItem("theme");
if(saved==="light")document.body.classList.add("light");
function updateTheme(){themeBtn.textContent=document.body.classList.contains("light")?"☀":"☾"}
updateTheme();
themeBtn.onclick=()=>{document.body.classList.toggle("light");localStorage.setItem("theme",document.body.classList.contains("light")?"light":"dark");updateTheme()};

$$(".filter").forEach(btn=>btn.onclick=()=>{
  $$(".filter").forEach(x=>x.classList.remove("active"));btn.classList.add("active");
  const f=btn.dataset.filter;
  $$(".photo-card").forEach(c=>c.style.display=(f==="all"||c.classList.contains(f))?"flex":"none");
});

const searchPanel=$("#searchPanel"), searchBtn=$("#searchBtn"), searchInput=$("#searchInput"), results=$("#searchResults");
searchBtn.onclick=()=>{searchPanel.classList.toggle("open"); if(searchPanel.classList.contains("open"))searchInput.focus()};
searchInput.addEventListener("input",()=>{
 const q=searchInput.value.trim().toLowerCase(); results.innerHTML="";
 if(!q)return;
 $$("main section").forEach(s=>{
   const text=s.innerText.toLowerCase();
   if(text.includes(q)){const title=s.querySelector("h2,h1")?.innerText||s.id;
     const d=document.createElement("div");d.className="search-result";d.textContent=title+" · #"+s.id;
     d.onclick=()=>{s.scrollIntoView({behavior:"smooth"});searchPanel.classList.remove("open")};results.appendChild(d)}
 });
 if(!results.children.length)results.innerHTML='<div class="search-result">No results found.</div>';
});
document.addEventListener("click",e=>{if(!searchPanel.contains(e.target)&&e.target!==searchBtn)searchPanel.classList.remove("open")});
document.querySelectorAll(".bucket input").forEach((input,i)=>{
 const key="bucket-"+i; input.checked=localStorage.getItem(key)==="1";
 input.addEventListener("change",()=>localStorage.setItem(key,input.checked?"1":"0"));
});
$("#year").textContent=new Date().getFullYear();
