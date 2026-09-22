/* ตัวแสดงผลหน้าวิชา: อ่าน ?s=<id> → โหลด data/<id>.js → แสดง 4 แท็บ */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const id=(new URLSearchParams(location.search).get('s')||'').toLowerCase().replace(/[^a-z0-9_-]/g,'');
const store={get(k,d){try{return JSON.parse(localStorage.getItem(`tutor:${id}:${k}`))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(`tutor:${id}:${k}`,JSON.stringify(v))}catch(e){}}};
const TABS=['overview','study','practice','predict'];
let S=null;

function empty(what){return `<div class="empty-state"><p><b>ยังไม่มี${what}ที่ยืนยันแล้ว</b></p><p>ส่วนนี้จะเพิ่มได้ทันทีเมื่อมีเอกสารหรือประกาศจากผู้สอน</p></div>`}
function stats(){const d=S||{},el=$('pstats');if(!el)return;const r=store.get('read',[]),a=store.get('ans',{});
  el.innerHTML=`<span class="stat">ติวเนื้อหา <b>${r.filter(x=>(d.study||[]).some(s=>s.id===x)).length}/${(d.study||[]).length}</b> หัวข้อ</span><span class="stat">แบบฝึกหัด <b>${Object.keys(a).filter(x=>(d.practice||[]).some(q=>q.id===x)).length}/${(d.practice||[]).length}</b> ข้อ</span><span class="stat">เก็งข้อสอบ <b>${(d.predict||[]).length}</b> แนว</span>`}
function go(t){if(!TABS.includes(t))t='overview';if(t==='overview')stats();
  document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id===t));
  try{history.replaceState(null,'',`?s=${id}#${t}`)}catch(e){}}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{go(b.dataset.tab);scrollTo(0,0)});
addEventListener('hashchange',()=>go((location.hash||'#overview').slice(1)));

window.registerSubject=function(data){S=data;render()};

function render(){
  const d=S||{},ex=d.exam||{};
  document.title=`${d.code||id.toUpperCase()} · ห้องติวสอบ`;
  $('code').textContent=d.code||id.toUpperCase();

  /* ---------- OVERVIEW ---------- */
  const rows=[['วันเวลาสอบ',ex.when],['สถานที่',ex.where],['เวลาทำข้อสอบ',ex.duration],['เอาอะไรเข้าห้องได้',ex.allowed],['กติกาอื่น',ex.rules]].filter(r=>r[1]);
  const parts=ex.parts||[];
  $('overview').innerHTML=`<h1>${esc(d.code||id.toUpperCase())}</h1><p class="lead">${d.name?esc(d.name):'ยังไม่ได้ใส่ชื่อวิชา'}</p>
    ${ex.iso?`<div class="sheet"><h3>นับถอยหลังถึงเวลาสอบ</h3><div class="count" id="cd"></div></div>`:''}
    <div class="sheet"><h3>ข้อมูลการสอบ</h3>${rows.length?`<div class="scroll"><table class="t">${rows.map(r=>`<tr><th style="width:30%">${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</table></div>`:empty('ข้อมูลการสอบ')}</div>
    <div class="sheet"><h3>รูปแบบข้อสอบ / แนวทบทวน</h3>${parts.length?`<div class="scroll"><table class="t"><tr><th>ส่วน</th><th>จำนวนหรือรายละเอียด</th></tr>${parts.map(p=>`<tr><td>${esc(p.name)}</td><td>${esc(p.detail??p.points??'')}</td></tr>`).join('')}</table></div>`:empty('รูปแบบข้อสอบ')}</div>
    <div class="sheet"><h3>ความคืบหน้า</h3><div class="stats" id="pstats"></div></div>`;
  if(ex.iso){const tick=()=>{const ms=new Date(ex.iso)-new Date();const el=$('cd');if(!el)return;
    if(isNaN(ms)){el.textContent='รูปแบบวันเวลาไม่ถูกต้อง';return}
    if(ms<=0){el.textContent='ถึงเวลาสอบแล้ว';return}
    const dd=Math.floor(ms/864e5),hh=Math.floor(ms/36e5)%24,mm=Math.floor(ms/6e4)%60;el.textContent=`${dd} วัน ${hh} ชั่วโมง ${mm} นาที`};tick();setInterval(tick,30000)}

  /* ---------- STUDY ---------- */
  const st=d.study||[];
  if(!st.length)$('study').innerHTML=`<h2>ติวเนื้อหา</h2>${empty('เนื้อหาติว')}`;
  else{
    const read=new Set(store.get('read',[]));
    $('study').innerHTML=`<h2>ติวเนื้อหา</h2><p class="lead">เลือกอ่านสรุปก่อนสอบ หรือเปิดเนื้อหาเต็มของแต่ละบทเมื่ออยากเข้าใจรายละเอียดและตัวอย่าง</p><div class="sheet study-tools"><b>โหมดการอ่านทุกบท</b><div class="row"><button class="btn main" data-all-view="summary">สรุปทั้งหมด</button><button class="btn" data-all-view="full">เนื้อหาเต็มทั้งหมด</button></div></div><div class="study"><nav class="toc" aria-label="หัวข้อ"><div class="hint" id="prog"></div><div class="bar"><i id="pbar"></i></div>${st.map(s=>`<a href="#sec-${esc(s.id)}" data-id="${esc(s.id)}" class="${read.has(s.id)?'done':''}">${esc(s.title)}</a>`).join('')}</nav>
      <div>${st.map(s=>`<article class="sheet sec" id="sec-${esc(s.id)}">${s.topic?`<div class="topic">${esc(s.topic)}</div>`:''}<h3>${esc(s.title)}</h3><div class="read-modes" role="group" aria-label="เลือกระดับเนื้อหา"><button class="btn main" data-view="summary" data-sec="${esc(s.id)}">สรุปก่อนสอบ</button><button class="btn" data-view="full" data-sec="${esc(s.id)}">เนื้อหาเต็ม</button></div><div class="reading-note" data-note="${esc(s.id)}">กำลังแสดงสรุปฉบับอ่านเร็ว</div><div data-study-body="${esc(s.id)}">${s.summaryHtml||`<div class="key"><b>สรุปบท:</b> ${esc(s.summary||s.title)}</div><p>กด <b>เนื้อหาเต็ม</b> เพื่ออ่านคำอธิบาย ตาราง และตัวอย่างของบทนี้</p>`}</div>
        <div class="row"><label><input type="checkbox" data-read="${esc(s.id)}" ${read.has(s.id)?'checked':''}> อ่านแล้ว</label></div></article>`).join('')}</div></div>`;
    const upd=()=>{const r=new Set(store.get('read',[]));const n=st.filter(s=>r.has(s.id)).length;$('prog').textContent=`อ่านแล้ว ${n}/${st.length}`;$('pbar').style.width=(n/st.length*100)+'%';
      document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('done',r.has(a.dataset.id)))};
    document.querySelectorAll('[data-read]').forEach(c=>c.onchange=()=>{const r=new Set(store.get('read',[]));c.checked?r.add(c.dataset.read):r.delete(c.dataset.read);store.set('read',[...r]);upd()});
    document.querySelectorAll('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('sec-'+a.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'})});
    const setView=(sid,mode)=>{const item=st.find(s=>s.id===sid),body=document.querySelector(`[data-study-body="${sid}"]`),note=document.querySelector(`[data-note="${sid}"]`);if(!item||!body)return;
      body.innerHTML=mode==='full'?(item.html||''):(item.summaryHtml||`<div class="key"><b>สรุปบท:</b> ${esc(item.summary||item.title)}</div>`);
      note.textContent=mode==='full'?'กำลังแสดงเนื้อหาเต็มจากเอกสารประกอบการสอน':'กำลังแสดงสรุปฉบับอ่านเร็ว';
      document.querySelectorAll(`[data-sec="${sid}"]`).forEach(b=>b.classList.toggle('main',b.dataset.view===mode));
    };
    document.querySelectorAll('[data-view][data-sec]').forEach(b=>b.onclick=()=>setView(b.dataset.sec,b.dataset.view));
    document.querySelectorAll('[data-all-view]').forEach(b=>b.onclick=()=>{st.forEach(s=>setView(s.id,b.dataset.allView));document.querySelectorAll('[data-all-view]').forEach(x=>x.classList.toggle('main',x===b))});
    upd();
  }

  /* ---------- PRACTICE ---------- */
  const pr=d.practice||[];
  if(!pr.length)$('practice').innerHTML=`<h2>แบบฝึกหัด</h2>${empty('แบบฝึกหัด')}`;
  else{
    const topics=[...new Set(pr.map(q=>q.topic).filter(Boolean))];
    $('practice').innerHTML=`<h2>แบบฝึกหัด</h2><div class="sheet row" style="justify-content:space-between">
      <div class="row">${topics.length?`<label>หัวข้อ <select id="ft"><option value="">ทั้งหมด</option>${topics.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label>`:''}
      <button class="btn" id="shuf">สลับลำดับข้อ</button><button class="btn" id="rst">ล้างคำตอบ</button></div><div class="stats"><span class="stat">ถูก <b id="sc">0</b> จาก <b id="sn">0</b> ข้อปรนัยที่ตอบ</span></div></div><div id="qs"></div>`;
    let order=pr.map((_,i)=>i);
    const draw=()=>{const ans=store.get('ans',{}),ft=$('ft')?.value||'';
      $('qs').innerHTML=order.map(i=>pr[i]).filter(q=>!ft||q.topic===ft).map((q,k)=>{const a=ans[q.id];
        if(q.type==='mcq'){return `<div class="q"><div class="hint">${esc(q.topic||'')}</div><div class="qtext">${k+1}. ${esc(q.q)}</div>${(q.choices||[]).map((c,ci)=>{
          const cls=a===undefined?'':(ci===q.answer?'right':(ci===a?'wrong':''));return `<button class="choice ${cls}" data-q="${esc(q.id)}" data-c="${ci}" ${a!==undefined?'disabled':''}>${'กขคงจฉ'[ci]||ci+1}. ${esc(c)}</button>`}).join('')}
          ${a!==undefined?`<div class="explain"><b class="${a===q.answer?'':'hint'}">${a===q.answer?'ถูกต้อง':'ยังไม่ถูก คำตอบคือ '+('กขคงจฉ'[q.answer]||q.answer+1)}</b>${q.explain?' — '+esc(q.explain):''}</div>`:''}</div>`}
        return `<div class="q"><div class="hint">${esc(q.topic||'')}</div><div class="qtext">${k+1}. ${esc(q.q)}</div><details data-w="${esc(q.id)}" ${a?'open':''}><summary>เขียนคำตอบบนกระดาษก่อน แล้วกดดูแนวคำตอบ</summary><div>${q.answer||''}</div></details></div>`}).join('')||empty('ข้อในหัวข้อนี้');
      const mc=pr.filter(q=>q.type==='mcq'&&ans[q.id]!==undefined);$('sc').textContent=mc.filter(q=>ans[q.id]===q.answer).length;$('sn').textContent=mc.length;
      document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const s=store.get('ans',{});s[b.dataset.q]=+b.dataset.c;store.set('ans',s);draw()});
      document.querySelectorAll('[data-w]').forEach(x=>x.ontoggle=()=>{if(x.open){const s=store.get('ans',{});s[x.dataset.w]='seen';store.set('ans',s)}})};
    $('ft')&&($('ft').onchange=draw);
    $('shuf').onclick=()=>{order.sort(()=>Math.random()-.5);draw()};
    $('rst').onclick=()=>{if(confirm('ล้างคำตอบทั้งหมดของวิชานี้?')){store.set('ans',{});draw()}};
    draw();
  }

  /* ---------- PREDICT ---------- */
  const pd=d.predict||[];
  const guide=d.examGuide||[];
  const L={high:['high','โอกาสสูง'],mid:['mid','ปานกลาง'],low:['low','พอมี']};
  const guideHtml=guide.length?`<section class="sheet"><div class="topic">หลักฐานตรงจากผู้สอน</div><h3>แนวทบทวนจากไฟล์อาจารย์</h3><p>เรียงตามตอนในเอกสารที่ได้รับ ใช้ตรวจว่าทำโจทย์รูปแบบที่อาจารย์เน้นได้หรือยัง ส่วนนี้แยกจากแบบฝึกหัดรายบทอย่างชัดเจน</p><div class="stats"><span class="stat"><b>${guide.length}</b> รายการ</span><span class="stat"><b>${new Set(guide.map(q=>q.topic)).size}</b> ตอน</span></div></section>`+
    guide.map((q,i)=>`<div class="q teacher-guide"><div class="hint">${esc(q.topic||'แนวจากอาจารย์')}</div><div class="qtext">${i+1}. ${esc(q.q)}</div>${q.type==='mcq'?`<ol class="guide-choices" type="ก">${(q.choices||[]).map(c=>`<li>${esc(c)}</li>`).join('')}</ol>`:''}<details><summary>ดูคำตอบและเหตุผล</summary><div>${q.type==='mcq'?`<b>คำตอบ: ${'กขคงจฉ'[q.answer]||q.answer+1}. ${esc((q.choices||[])[q.answer]||'')}</b>${q.explain?`<p>${esc(q.explain)}</p>`:''}`:(q.answer||'')}</div></details></div>`).join(''):'';
  const analysisHtml=pd.length?`<h3 class="analysis-title">วิเคราะห์หัวข้อที่ควรเน้นเพิ่ม</h3><p class="lead">ส่วนนี้เป็นการวิเคราะห์จากความถี่และรูปแบบในแนวอาจารย์ ใช้จัดลำดับการอ่าน ไม่ใช่ข้อสอบจริง</p><div class="scroll sheet"><table class="t"><tr><th>หัวข้อ</th><th>โอกาส</th><th>หลักฐาน</th></tr>${pd.map(p=>`<tr><td>${esc(p.topic)}</td><td><span class="chip ${(L[p.level]||L.low)[0]}">${(L[p.level]||L.low)[1]}</span></td><td>${esc(p.evidence)}</td></tr>`).join('')}</table></div>`+
    pd.filter(p=>p.sample).map(p=>`<div class="q"><div class="hint">${esc(p.topic)}</div><div class="qtext">${esc(p.sample)}</div>${p.answer?`<details><summary>แนวคำตอบ</summary><div>${p.answer}</div></details>`:''}</div>`).join(''):'';
  $('predict').innerHTML=`<h2>เก็งข้อสอบ</h2>${guideHtml}${analysisHtml||(!guide.length?empty('การเก็งข้อสอบ'):'')}`;

  go((location.hash||'#overview').slice(1));
}

if(!id){document.querySelector('main').innerHTML=`<div class="empty-state"><p><b>ไม่ได้เลือกวิชา</b></p><a class="btn main" href="index.html">กลับไปเลือกวิชา</a></div>`;return}
const sc=document.createElement('script');sc.src=`data/${id}.js`;
sc.onerror=()=>{document.querySelector('main').innerHTML=`<div class="empty-state"><p><b>ไม่พบไฟล์ data/${esc(id)}.js</b></p><a class="btn main" href="index.html">กลับไปเลือกวิชา</a></div>`};
document.body.appendChild(sc);
})();
