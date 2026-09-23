/* ตัวแสดงผลหน้าวิชา: อ่าน ?s=<id> → โหลด data/<id>.js → แสดง 4 แท็บ */
(function(){
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const id=(new URLSearchParams(location.search).get('s')||'').toLowerCase().replace(/[^a-z0-9_-]/g,'');
const store={get(k,d){try{return JSON.parse(localStorage.getItem(`tutor:${id}:${k}`))??d}catch(e){return d}},set(k,v){try{localStorage.setItem(`tutor:${id}:${k}`,JSON.stringify(v))}catch(e){}}};
const TABS=['overview','study','practice','vocab'];
let S=null;

function empty(what){return `<div class="empty-state"><p><b>ยังไม่มี${what}ที่ยืนยันแล้ว</b></p><p>ส่วนนี้จะเพิ่มได้ทันทีเมื่อมีเอกสารหรือประกาศจากผู้สอน</p></div>`}
function stats(){const d=S||{},el=$('pstats');if(!el)return;const r=store.get('read',[]),a=store.get('ans',{});
  el.innerHTML=`<span class="stat">ติวเนื้อหา <b>${r.filter(x=>(d.study||[]).some(s=>s.id===x)).length}/${(d.study||[]).length}</b> หัวข้อ</span><span class="stat">แบบฝึกหัด <b>${Object.keys(a).filter(x=>(d.practice||[]).some(q=>q.id===x)).length}/${(d.practice||[]).length}</b> ข้อ</span><span class="stat">คำศัพท์ <b>${(d.terms||[]).reduce((n,g)=>n+(g.items||[]).length,0)}</b> คำ</span>`}
function go(t){if(!TABS.includes(t))t='overview';if(t==='overview')stats();
  document.querySelectorAll('[data-tab]').forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));
  document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id===t));
  try{history.replaceState(null,'',`?s=${id}#${t}`)}catch(e){}
  window.tutorTrack?.('tab_view',{subject:id,tab:t});}
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
    <div class="sheet"><h3>ข้อมูลการสอบ</h3>${rows.length?`<div class="scroll"><table class="t">${rows.map(r=>`<tr><th style="width:30%">${r[0]}</th><td>${esc(r[1])}</td></tr>`).join('')}</table></div>`:empty('ข้อมูลการสอบ')}${d.reviewPdf?`<p><a class="btn memory-review" href="${esc(d.reviewPdf)}" target="_blank" rel="noopener">📑 สไลด์ทบทวนความจำ</a></p>`:''}</div>
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
    const modes=store.get('mode',{});
    const hasSplit=s=>s.quick&&s.full; // section supports the quick/full toggle
    const modeOf=s=>hasSplit(s)?(modes[s.id]==='full'?'full':'quick'):null;
    const bodyOf=s=>hasSplit(s)?(modeOf(s)==='full'?s.full:s.quick):(s.full||s.html||s.quick||'');
    const printBody=(s,mode)=>mode==='full'?(s.full||s.html||s.quick||''):mode==='quick'?(s.quick||s.full||s.html||''):bodyOf(s);
    const safeName=value=>String(value||'TutorHub').replace(/[\/:*?"<>|]+/g,'-').replace(/\s+/g,'-');
    const printStudy=(sections,mode,scope)=>{
      let root=document.getElementById('printRoot');
      if(!root){root=document.createElement('div');root.id='printRoot';document.body.appendChild(root)}
      const modeLabel=mode==='full'?'เนื้อหาเต็ม':mode==='quick'?'สรุปก่อนสอบ':(sections.length===1&&modeOf(sections[0])==='full'?'เนื้อหาเต็ม':'สรุปก่อนสอบ');
      root.innerHTML=`<header class="print-head"><div class="print-code">${esc(d.code||id.toUpperCase())}</div><h1>${esc(d.name||'')}</h1><p>${esc(scope)} · ${modeLabel}</p></header><main>${sections.map((s,i)=>`<article class="print-section"><div class="topic">${esc(s.topic||'')}</div><h2>${esc(s.title)}</h2>${printBody(s,mode)}</article>`).join('')}</main><footer class="print-page-number" aria-hidden="true"></footer>`;
      const oldTitle=document.title;
      document.title=safeName(`${d.code||id}-${scope}-${modeLabel}`);
      document.body.classList.add('printing');
      let cleaned=false;
      const cleanup=()=>{if(cleaned)return;cleaned=true;document.body.classList.remove('printing');document.title=oldTitle;root.replaceChildren()};
      addEventListener('afterprint',cleanup,{once:true});
      window.tutorTrack?.('study_pdf',{subject:id,scope:sections.length===1?'chapter':'all',mode:mode||modeOf(sections[0])||'content'});
      requestAnimationFrame(()=>requestAnimationFrame(()=>{window.print();setTimeout(cleanup,1500)}));
    };
    const toggleBtns=s=>`<div class="row modetog" data-modetog="${esc(s.id)}">
        ${hasSplit(s)?`<button class="btn modebtn ${modeOf(s)==='quick'?'on':''}" data-setmode="${esc(s.id)}" data-val="quick">สรุปก่อนสอบ</button><button class="btn modebtn ${modeOf(s)==='full'?'on':''}" data-setmode="${esc(s.id)}" data-val="full">เนื้อหาเต็ม</button>`:''}
        <button class="btn pdfbtn" data-printchapter="${esc(s.id)}">ดาวน์โหลด PDF</button>
      </div>`;
    $('study').innerHTML=`<h2>ติวเนื้อหา</h2>
      <div class="sheet row" style="justify-content:space-between;align-items:center">
        <b>โหมดการอ่านทุกบท</b>
        <div><div class="row"><button class="btn" id="modeAllQuick">สรุปทั้งหมด</button><button class="btn" id="modeAllFull">เนื้อหาเต็มทั้งหมด</button></div>
        <div class="row"><button class="btn pdfbtn" id="downloadAllQuick">ดาวน์โหลดสรุปทั้งเล่ม (PDF)</button><button class="btn pdfbtn" id="downloadAllFull">ดาวน์โหลดเนื้อหาเต็มทั้งเล่ม (PDF)</button></div></div>
      </div>
      <div class="study"><nav class="toc" aria-label="หัวข้อ"><div class="hint" id="prog"></div><div class="bar"><i id="pbar"></i></div>${st.map(s=>`<a href="#sec-${esc(s.id)}" data-id="${esc(s.id)}" class="${read.has(s.id)?'done':''}">${esc(s.title)}</a>`).join('')}</nav>
      <div>${st.map(s=>`<article class="sheet sec" id="sec-${esc(s.id)}">${s.topic?`<div class="topic">${esc(s.topic)}</div>`:''}<h3>${esc(s.title)}</h3>${toggleBtns(s)}
        ${hasSplit(s)?`<p class="hint" data-modehint="${esc(s.id)}">${modeOf(s)==='quick'?'กำลังแสดงสรุปฉบับอ่านเร็ว':'กำลังแสดงเนื้อหาเต็ม'}</p>`:''}
        <div data-body="${esc(s.id)}">${bodyOf(s)}</div>
        <div class="row"><label><input type="checkbox" data-read="${esc(s.id)}" ${read.has(s.id)?'checked':''}> อ่านแล้ว</label></div></article>`).join('')}</div></div>`;
    const upd=()=>{const r=new Set(store.get('read',[]));const n=st.filter(s=>r.has(s.id)).length;$('prog').textContent=`อ่านแล้ว ${n}/${st.length}`;$('pbar').style.width=(n/st.length*100)+'%';
      document.querySelectorAll('.toc a').forEach(a=>a.classList.toggle('done',r.has(a.dataset.id)))};
    document.querySelectorAll('[data-read]').forEach(c=>c.onchange=()=>{const r=new Set(store.get('read',[]));c.checked?r.add(c.dataset.read):r.delete(c.dataset.read);store.set('read',[...r]);upd()});
    document.querySelectorAll('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();document.getElementById('sec-'+a.dataset.id)?.scrollIntoView({behavior:'smooth',block:'start'})});
    const applyMode=(sid,val)=>{const m=store.get('mode',{});m[sid]=val;store.set('mode',m);modes[sid]=val;
      const s=st.find(x=>x.id===sid);if(!s)return;
      document.querySelector(`[data-body="${sid}"]`).innerHTML=val==='full'?s.full:s.quick;
      const hint=document.querySelector(`[data-modehint="${sid}"]`);if(hint)hint.textContent=val==='quick'?'กำลังแสดงสรุปฉบับอ่านเร็ว':'กำลังแสดงเนื้อหาเต็ม';
      document.querySelectorAll(`[data-setmode="${sid}"]`).forEach(b=>b.classList.toggle('on',b.dataset.val===val))};
    document.querySelectorAll('[data-setmode]').forEach(b=>b.onclick=()=>{applyMode(b.dataset.setmode,b.dataset.val);window.tutorTrack?.('study_mode',{subject:id,chapter:b.dataset.setmode,mode:b.dataset.val})});
    $('modeAllQuick').onclick=()=>st.forEach(s=>hasSplit(s)&&applyMode(s.id,'quick'));
    $('modeAllFull').onclick=()=>st.forEach(s=>hasSplit(s)&&applyMode(s.id,'full'));
    document.querySelectorAll('[data-printchapter]').forEach(b=>b.onclick=()=>{const section=st.find(s=>s.id===b.dataset.printchapter);if(section)printStudy([section],null,section.title)});
    $('downloadAllQuick').onclick=()=>printStudy(st,'quick','ทุกบท');
    $('downloadAllFull').onclick=()=>printStudy(st,'full','ทุกบท');
    upd();
  }

  /* ---------- PRACTICE ---------- */
  const pr=d.practice||[];
  if(!pr.length)$('practice').innerHTML=`<h2>แบบฝึกหัด</h2>${empty('แบบฝึกหัด')}`;
  else{
    const SRC={official:['official','📋 แนวข้อสอบอาจารย์'],mock:['mock','🧪 เก็งข้อสอบ (วิเคราะห์)']};
    const sources=[...new Set(pr.map(q=>q.source||'mock'))];
    const srcLabel=s=>(SRC[s]||['mock',s])[1];
    $('practice').innerHTML=`<h2>แบบฝึกหัด</h2><p class="lead">ทำไปด้วย ติวไปด้วย — ตอบแล้วเฉลยพร้อมคำอธิบายทันที</p><div class="sheet row" style="justify-content:space-between">
      <div class="row">${sources.length>1?`<label>แหล่งข้อสอบ <select id="fs"><option value="">ทั้งหมด</option>${sources.map(s=>`<option value="${esc(s)}">${srcLabel(s)}</option>`).join('')}</select></label>`:''}
      <label>หัวข้อ <select id="ft"></select></label>
      <button class="btn" id="shuf">สลับลำดับข้อ</button><button class="btn" id="rst">ล้างคำตอบ</button></div><div class="stats"><span class="stat">ถูก <b id="sc">0</b> จาก <b id="sn">0</b> ข้อปรนัยที่ตอบ</span></div></div><div id="qs"></div>`;
    let order=pr.map((_,i)=>i);
    const rebuildTopics=()=>{const fs=$('fs')?.value||'';
      const scoped=pr.filter(q=>!fs||(q.source||'mock')===fs);
      const topics=[...new Set(scoped.map(q=>q.topic).filter(Boolean))];
      const ftEl=$('ft'),keep=ftEl.value;
      ftEl.innerHTML=`<option value="">ทั้งหมด</option>${topics.map(t=>`<option>${esc(t)}</option>`).join('')}`;
      ftEl.value=topics.includes(keep)?keep:'';};
    const draw=()=>{const ans=store.get('ans',{}),ft=$('ft')?.value||'',fs=$('fs')?.value||'';
      $('qs').innerHTML=order.map(i=>pr[i]).filter(q=>(!fs||(q.source||'mock')===fs)&&(!ft||q.topic===ft)).map((q,k)=>{const a=ans[q.id];
        const srcChip=sources.length>1?`<span class="chip ${(q.source||'mock')==='official'?'ready':'mid'}" style="margin-left:6px">${srcLabel(q.source||'mock')}</span>`:'';
        if(q.type==='mcq'){return `<div class="q"><div class="hint">${esc(q.topic||'')}${srcChip}</div><div class="qtext">${k+1}. ${esc(q.q)}</div>${(q.choices||[]).map((c,ci)=>{
          const cls=a===undefined?'':(ci===q.answer?'right':(ci===a?'wrong':''));return `<button class="choice ${cls}" data-q="${esc(q.id)}" data-c="${ci}" ${a!==undefined?'disabled':''}>${'กขคงจฉ'[ci]||ci+1}. ${esc(c)}</button>`}).join('')}
          ${a!==undefined?`<div class="explain"><b class="${a===q.answer?'':'hint'}">${a===q.answer?'✔ ถูกต้อง':'✘ ยังไม่ถูก คำตอบคือ '+('กขคงจฉ'[q.answer]||q.answer+1)}</b>${q.explain?' — '+esc(q.explain):''}</div>`:''}</div>`}
        return `<div class="q"><div class="hint">${esc(q.topic||'')}${srcChip}</div><div class="qtext">${k+1}. ${esc(q.q)}</div><details data-w="${esc(q.id)}" ${a?'open':''}><summary>เขียนคำตอบบนกระดาษก่อน แล้วกดดูแนวคำตอบพร้อมคำอธิบาย</summary><div>${q.answer||''}</div></details></div>`}).join('')||empty('ข้อในหัวข้อนี้');
      const mc=pr.filter(q=>(!fs||(q.source||'mock')===fs)&&q.type==='mcq'&&ans[q.id]!==undefined);$('sc').textContent=mc.filter(q=>ans[q.id]===q.answer).length;$('sn').textContent=mc.length;
      document.querySelectorAll('.choice').forEach(b=>b.onclick=()=>{const q=pr.find(x=>x.id===b.dataset.q),picked=+b.dataset.c,s=store.get('ans',{});s[b.dataset.q]=picked;store.set('ans',s);window.tutorTrack?.('practice_answer',{subject:id,question_id:b.dataset.q,correct:q?picked===q.answer:false,source:q?.source||'mock'});draw()});
      document.querySelectorAll('[data-w]').forEach(x=>x.ontoggle=()=>{if(x.open){const s=store.get('ans',{});s[x.dataset.w]='seen';store.set('ans',s)}})};
    rebuildTopics();
    $('ft').onchange=draw;
    $('fs')&&($('fs').onchange=()=>{rebuildTopics();draw()});
    $('shuf').onclick=()=>{order.sort(()=>Math.random()-.5);draw()};
    $('rst').onclick=()=>{if(confirm('ล้างคำตอบทั้งหมดของวิชานี้?')){store.set('ans',{});draw()}};
    draw();
  }

  /* ---------- VOCAB ---------- */
  const tg=d.terms||[];
  if(!tg.length)$('vocab').innerHTML=`<h2>คำศัพท์</h2>${empty('คำศัพท์ที่รวบรวมไว้')}`;
  else{
    const vtopics=tg.map(g=>g.topic);
    const totalAll=tg.reduce((n,g)=>n+g.items.length,0),totalImp=tg.reduce((n,g)=>n+g.items.filter(it=>it.important).length,0);
    $('vocab').innerHTML=`<h2>คำศัพท์</h2><p class="lead">รวมคำศัพท์ที่ต้องรู้ แยกทีละบท พร้อมคำอธิบาย/คำจำกัดความ ทั้งไทย–อังกฤษ</p>
      <div class="sheet row"><label>บท <select id="vt"><option value="">ทั้งหมด</option>${vtopics.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label>
      <label>ค้นหา <input type="search" id="vq" placeholder="พิมพ์คำที่ต้องการค้นหา…" style="font:inherit;padding:5px 10px;border:1.5px solid var(--ink);border-radius:8px;background:var(--paper);color:var(--ink)"></label>
      <label class="row" style="margin:0"><input type="checkbox" id="vimp"> เฉพาะคำสำคัญ (<b id="vimpn">${totalImp}</b>/${totalAll})</label></div>
      <div id="vlist"></div>`;
    const drawVocab=()=>{const vt=$('vt').value,q=($('vq').value||'').trim().toLowerCase(),impOnly=$('vimp').checked;
      $('vlist').innerHTML=tg.filter(g=>!vt||g.topic===vt).map(g=>{
        const items=g.items.filter(it=>(!impOnly||it.important)&&(!q||it.term.toLowerCase().includes(q)||it.def.toLowerCase().includes(q)));
        if(!items.length)return '';
        return `<div class="sheet"><h3>${esc(g.topic)}</h3><div class="scroll"><table class="t"><tr><th style="width:32%">คำศัพท์</th><th>คำอธิบาย/คำจำกัดความ</th></tr>${items.map(it=>`<tr><td><b>${esc(it.term)}</b>${it.important?' <span class="chip ready" style="font-size:.7rem">สำคัญ</span>':''}</td><td>${esc(it.def)}</td></tr>`).join('')}</table></div></div>`}).join('')||empty('คำที่ตรงกับการค้นหา')};
    $('vt').onchange=drawVocab;$('vq').oninput=drawVocab;$('vimp').onchange=drawVocab;
    drawVocab();
  }

  go((location.hash||'#overview').slice(1));
}

if(!id){const m=document.querySelector('main');if(m)m.innerHTML=`<div class="empty-state"><p><b>ไม่ได้เลือกวิชา</b></p><a class="btn main" href="index.html">กลับไปเลือกวิชา</a></div>`;return}
const sc=document.createElement('script');sc.src=`data/${id}.js`;
sc.onerror=()=>{document.querySelector('main').innerHTML=`<div class="empty-state"><p><b>ไม่พบไฟล์ data/${esc(id)}.js</b></p><a class="btn main" href="index.html">กลับไปเลือกวิชา</a></div>`};
document.body.appendChild(sc);
})();
