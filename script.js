const $=id=>document.getElementById(id);
const KEY="rojnamcha_entries";
let entries=JSON.parse(localStorage.getItem(KEY)||"[]");
$("date").value=new Date().toISOString().slice(0,10);

function save(){localStorage.setItem(KEY,JSON.stringify(entries));render();}
function render(){
  const q=$("search").value.trim().toLowerCase();
  const list=entries.filter(e=>(e.title+" "+e.note+" "+e.date).toLowerCase().includes(q))
    .sort((a,b)=>b.date.localeCompare(a.date)||b.created-a.created);
  $("entries").innerHTML=list.length?list.map(e=>`
    <article class="entry">
      <div class="entry-top"><div><div class="entry-title">${esc(e.title)}</div><div class="date">${e.date}</div></div>
      <button class="delete" onclick="removeEntry('${e.id}')">हटाएँ</button></div>
      ${e.note?`<div class="note">${esc(e.note)}</div>`:""}
      ${e.amount!==""?`<div class="amount">₹ ${Number(e.amount).toLocaleString("en-IN")}</div>`:""}
    </article>`).join(""):"<p class='date'>अभी कोई एंट्री नहीं है।</p>";
}
function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[m]));}
$("entryForm").addEventListener("submit",e=>{
  e.preventDefault();
  entries.push({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:$("date").value,title:$("title").value,note:$("note").value,amount:$("amount").value,created:Date.now()});
  save(); e.target.reset(); $("date").value=new Date().toISOString().slice(0,10);
});
$("search").addEventListener("input",render);
$("clearBtn").addEventListener("click",()=>{if(confirm("सभी एंट्री हटानी हैं?")){entries=[];save();}});
function removeEntry(id){entries=entries.filter(e=>e.id!==id);save();}
render();
