const $=id=>document.getElementById(id);
const tabs=[...document.querySelectorAll('[data-tab]')];
function go(t){tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.tab===t));document.querySelectorAll('.panel').forEach(p=>p.classList.toggle('on',p.id===t));
  if(t==='va')loadVA(curVA);if(t==='p3')renderBFS();if(t==='p2'&&AF.length)renderAnim();scrollTo(0,0);try{history.replaceState(null,'','#'+t)}catch(e){}}
tabs.forEach(b=>b.onclick=()=>go(b.dataset.tab));
document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));
const fmt=v=>Number(v).toLocaleString('en-US');
function css(v){return getComputedStyle(document.documentElement).getPropertyValue(v).trim()}
/* ---------- PART 1 scenarios ---------- */
const SC=[
 {t:'ฟาร์มไก่ลำพูน (หนังสือหน้า 10–13)',q:'ไก่ 1,000 ตัว ประตูโรงเรือนผุ สัตว์เข้าทำร้ายไก่ได้ มีคนเสนอให้ย้ายไก่ทั้งหมดไปลำปาง ต้องตรวจว่าไม่มีตัวหายและหาตัวป่วยได้ทันที',
  a:`<b>ความหมาย:</b> ต้องให้ไก่ปลอดภัยจากสัตว์ร้าย · สิ่งที่เห็น: ประตูเป็นรู · กลไก: สัตว์เข้าถึงไก่ · เป้าหมาย: ไก่ปลอดภัย
<pre class="code">Input : C = {c1,…,c1000} โดย ci = (รหัส, สถานะสุขภาพ, กรง) · ความจุกรง · จำนวนรถ
Output: ไก่ครบ 1,000 ตัวถึงปลายทาง + บัญชีตำแหน่งทุกตัว
Constraints: ประตูโหลดทางเดียว ผ่านได้ทีละคน · กรงจุจำกัด · ปลายทางยังไม่ยืนยันความปลอดภัย
Edge cases : รหัสซ้ำ · ไก่ป่วย · กรงเต็มพอดี · รถเสีย
Expected   : ไม่มีตัวหาย · ค้นตัวป่วยได้ทันที</pre>
<b>3E:</b> ย้ายได้ตามทฤษฎี · แต่ไม่แก้สาเหตุ (ประตูพัง) และปลายทางยังไม่ปลอดภัย · แพงกว่าซ่อมประตูมาก → <b>ย้ายปัญหา</b> · ยกเว้นโรงเรือนเสี่ยงถล่ม`},
 {t:'โรงพยาบาล ลดเวลารอ (หน้า 14)',q:'ผู้ป่วยรอตรวจนาน มีคนเสนอให้ย้ายผู้ป่วยไปโรงพยาบาลจังหวัดอื่น',
  a:`<pre class="code">Input : ผู้ป่วย P = {p1,…,pn} โดย pi = (เวลามาถึง, ความเร่งด่วน) · หมอ/ช่องบริการ k
Output: ลำดับการเรียกตรวจที่เวลารอรวมน้อยที่สุด
Constraints: หมอ 1 คนตรวจทีละคน · เคสฉุกเฉินต้องได้ก่อน
Edge cases : ไม่มีผู้ป่วย · ผู้ป่วยมากกว่าที่ตรวจได้ในวัน · เร่งด่วนเท่ากันหมด</pre>
โครงสร้าง: คิว (หรือคิวตามความสำคัญ) · ย้ายผู้ป่วย = ทำได้ แต่ไม่ตรงจุดและไม่คุ้มเท่าจัดคิวใหม่ → <b>ย้ายปัญหา</b>`},
 {t:'น้ำท่วมถนน (หน้า 14)',q:'ต้องพาคนจากบ้านไปศูนย์พักพิง ถนนบางเส้นสั้นแต่น้ำลึก',
  a:`<pre class="code">Input : กราฟ G = (V, E) จุด = สถานที่ เส้น = ถนน น้ำหนัก = ระดับน้ำ/เวลาเดินทาง, จุดเริ่ม s, ปลายทาง t
Output: เส้นทาง s → t ที่ใช้เวลาน้อย/ปลอดภัยที่สุด
Edge cases: ไม่มีทางไปถึง (ถูกน้ำตัดขาด) · s = t</pre>
<b>ไม่ควรใช้ BFS</b> เพราะ BFS หาทางที่ผ่านเส้นน้อยที่สุด ถือว่าทุกถนนต้นทุนเท่ากัน แต่ถนนสั้นอาจผ่านน้ำลึก ต้องเก็บระดับน้ำ/เวลาในข้อมูลและใช้วิธีแบบมีน้ำหนัก`},
 {t:'เว็บไซต์ล่ม (หน้า 14)',q:'เว็บลงทะเบียนล่มทุกเปิดเทอม มีคนเสนอให้เพิ่มเซิร์ฟเวอร์ 2 เท่า',
  a:`<pre class="code">Input : สถานะและเวลาตอบสนองของแต่ละส่วนในระบบ (เว็บ ฐานข้อมูล บริการภายนอก)
Output: จุดที่เป็นสาเหตุของการล่ม</pre>
3E: เพิ่มเครื่องรับโหลดได้มากขึ้นตามทฤษฎี · ถ้าคอขวดอยู่ที่ฐานข้อมูลหรือบริการภายนอก เพิ่มเครื่องไม่ช่วย · ยังไม่เทียบกับการแก้ฐานข้อมูลหรือจัดคิวผู้ใช้ · ต้องหาคอขวดจริงก่อนจึงรู้ว่าแก้สาเหตุหรือไม่`},
 {t:'ศูนย์แจกถุงยังชีพ (ชุด C ข้อ 1)',q:'ศูนย์แจกถุงยังชีพช่วงน้ำท่วม ผู้สูงอายุ/ผู้ป่วยต้องได้ก่อน ถุงมีวันละ ~500 ถุง ครอบครัวละ 1 ถุง มีโต๊ะแจก 3 โต๊ะ',
  a:`<pre class="code">Input : P = {p1,…,pn} โดย pi = (รหัสครอบครัว, เวลามาถึง, กลุ่มเปราะบาง) · ถุงคงเหลือ B ≤ 500 · โต๊ะ k = 3
Output: ลำดับการเรียกรับ L และรายการที่รับแล้ว R โดย |R| ≤ B
Constraints: 1 ครอบครัว 1 ถุง · ถุงไม่เกิน B · โต๊ะละครั้งละ 1 คน
Edge cases : ไม่มีคนรอ · คนมากกว่าถุง · ครอบครัวเดียวกันมาหลายคน · ทุกคนเปราะบาง</pre>
คิว (FIFO) แยกคิวเปราะบาง/ทั่วไป · เซตแฮชของรหัสที่รับแล้ว ตรวจซ้ำ Θ(1) เฉลี่ย · ย้ายศูนย์ไปอำเภออื่น = ย้ายปัญหา`}
];
$('scen').innerHTML=SC.map(s=>`<div class="sheet"><h3>${s.t}</h3><p>${s.q}</p><details><summary>ดูตัวอย่างคำตอบ</summary>${s.a}</details></div>`).join('');

/* ---------- ANIMATED MERGE SORT ---------- */
let AF=[],ai=0,aTimer=null,aIds=[];
function buildAnim(arr){
  stopAnim();AF=[];const n=arr.length;const top=arr.map((v,i)=>i),bot=Array(n).fill(null),val=arr.slice();let cmp=0;
  const seg=(lo,hi)=>top.slice(lo,hi).map(id=>val[id]).join(', ');
  const push=(msg,cls)=>AF.push({top:top.slice(),bot:bot.slice(),cls:cls||{},msg,cmp});
  const rangeCls=(lo,mid,hi,extra)=>{const c={};for(let s=0;s<n;s++){const id=top[s];if(id===null)continue;c[id]=(s>=lo&&s<mid)?'left':(s>=mid&&s<hi)?'right':'dim'}return Object.assign(c,extra||{})};
  push(`เริ่มต้น: [${arr.join(', ')}] ยังไม่เรียง`);
  function ms(lo,hi){
    if(hi-lo<=1){return}
    const mid=lo+Math.floor((hi-lo)/2);
    push(`แบ่ง [${seg(lo,hi)}] เป็นส่วนซ้าย [${seg(lo,mid)}] และส่วนขวา [${seg(mid,hi)}]`,rangeCls(lo,mid,hi));
    ms(lo,mid);ms(mid,hi);merge(lo,mid,hi);
  }
  function merge(lo,mid,hi){
    const L=top.slice(lo,mid),R=top.slice(mid,hi);let i=0,j=0,k=lo;const placed={};
    const cl=()=>{const c=rangeCls(lo,mid,hi);Object.keys(placed).forEach(id=>c[id]='placed');return c};
    push(`รวมส่วนซ้าย [${L.map(id=>val[id]).join(', ')}] กับส่วนขวา [${R.map(id=>val[id]).join(', ')}] ที่เรียงแล้วทั้งคู่`,cl());
    const move=(id)=>{top[top.indexOf(id)]=null;bot[k++]=id;placed[id]=1};
    while(i<L.length&&j<R.length){
      const a=L[i],b=R[j];cmp++;const c=cl();c[a]='cmp';c[b]='cmp';
      const takeLeft=val[a]<=val[b];
      push(`เทียบตัวแรกของแต่ละส่วน: ${val[a]} กับ ${val[b]} → ${takeLeft?`${val[a]} น้อยกว่าหรือเท่ากัน หยิบจากซ้าย`:`${val[b]} น้อยกว่า หยิบจากขวา`}`,c);
      if(takeLeft){move(a);i++}else{move(b);j++}
      push(`วาง ${val[takeLeft?a:b]} ต่อท้ายผลลัพธ์`,cl());
    }
    const rest=L.slice(i).concat(R.slice(j));
    if(rest.length){rest.forEach(move);push(`ส่วน${i<L.length?'ขวา':'ซ้าย'}หมดแล้ว → ต่อที่เหลือ [${rest.map(id=>val[id]).join(', ')}] ท้ายผลลัพธ์ทั้งหมด`,cl())}
    for(let s=lo;s<hi;s++){top[s]=bot[s];bot[s]=null}
    const c={};for(let s=0;s<n;s++){const id=top[s];if(id!==null)c[id]=(s>=lo&&s<hi)?'sorted':'dim'}
    push(`รวมเสร็จ: [${seg(lo,hi)}] เรียงแล้ว`,c);
  }
  ms(0,n);
  const c={};top.forEach(id=>c[id]='sorted');push(`เรียงเสร็จ [${seg(0,n)}] · เปรียบเทียบรวม ${cmp} ครั้ง (ไม่เกิน n log₂n ≈ ${Math.round(n*Math.log2(n))})`,c);
  const box=$('anim');box.innerHTML='<span class="lab" style="top:0">แถวบน: ข้อมูลปัจจุบัน</span><span class="lab" style="top:168px">แถวล่าง: ผลลัพธ์ที่กำลังรวม</span>';
  aIds=arr.map((v,i)=>{const d=document.createElement('div');d.className='bar2';d.innerHTML=`<span>${v}</span>`;box.appendChild(d);return d});
  ai=0;renderAnim();
}
function renderAnim(){
  const f=AF[ai],box=$('anim'),W=box.clientWidth,n=aIds.length,slot=W/n,bw=Math.max(12,slot*0.72),mx=Math.max(...AF[0].top.map((id,i)=>Number(aIds[i].textContent)),1);
  aIds.forEach((d,id)=>{
    let s=f.top.indexOf(id),row='top';if(s<0){s=f.bot.indexOf(id);row='bot'}
    const v=Number(d.textContent),h=18+v/mx*110;
    d.style.width=bw+'px';d.style.height=h+'px';
    d.style.transform=`translate(${s*slot+(slot-bw)/2}px,${row==='top'?-165:0}px)`;
    d.className='bar2 '+(f.cls[id]||'');
  });
  $('aMsg').textContent=f.msg;
  $('aStat').textContent=`ขั้นที่ ${ai+1} จาก ${AF.length} · เปรียบเทียบแล้ว ${f.cmp} ครั้ง`;
  $('aPrev').disabled=ai===0;$('aNext').disabled=ai===AF.length-1;
}
function stopAnim(){if(aTimer){clearInterval(aTimer);aTimer=null}if($('aPlay'))$('aPlay').textContent='เล่น'}
function playAnim(){if(aTimer){stopAnim();return}if(ai>=AF.length-1)ai=0;$('aPlay').textContent='หยุด';
  const tick=()=>{if(ai<AF.length-1){ai++;renderAnim()}else stopAnim()};aTimer=setInterval(tick,1750-Number($('aSpeed').value))}
$('aPlay').onclick=playAnim;
$('aNext').onclick=()=>{stopAnim();if(ai<AF.length-1){ai++;renderAnim()}};
$('aPrev').onclick=()=>{stopAnim();if(ai>0){ai--;renderAnim()}};
$('aEnd').onclick=()=>{stopAnim();ai=AF.length-1;renderAnim()};
$('aSpeed').oninput=()=>{if(aTimer){stopAnim();playAnim()}};
addEventListener('resize',()=>{if(AF.length)renderAnim()});

/* ---------- GRAPH (PART 3) ---------- */
const PRE={
 book:{name:'กราฟหนังสือหน้า 26 (ตัวอย่างเต็ม: จุดเสี่ยงจากประตูชำรุด)',dir:false,E:['AB','AC','BD','BE','CE','DF','EF'],
   pos:{A:[50,165],B:[160,75],C:[160,255],D:[290,75],E:[290,255],F:[400,165]},desc:'รูปเดียวกับหนังสือหน้า 26 และสไลด์ไล่ BFS หน้า 7–8 · มีวงวน A–B–E–C–A จึงเป็นกราฟปิด'},
 slide:{name:'กราฟสไลด์หน้า 3 (โรงเรือน A–F / Task 5)',dir:false,E:['AB','BC','AD','BD','BE','BF','CE','CF','DE','EF'],
   pos:{A:[80,85],B:[220,85],C:[360,85],D:[80,245],E:[220,245],F:[360,245]},desc:'จัดตำแหน่งตามสไลด์หน้า 3 "จากโลกกายภาพสู่แบบจำลองเชิงตรรกะ" · มีวงวนหลายวง'},
 tree:{name:'ต้นไม้ (กราฟเปิด)',dir:false,E:['AB','AC','BD','BE','CF'],
   pos:{A:[220,45],B:[120,150],C:[320,150],D:[60,270],E:[180,270],F:[320,270]},desc:'เชื่อมต่อกันและไม่มีวงวน 6 จุดจึงมี 5 เส้น (n − 1) · ลองกดเพิ่มเส้น D–E ในเมทริกซ์ แล้วดูว่าชนิดกลายเป็นกราฟปิด'},
 dag:{name:'DAG จากโน้ตหน้า 26 (มีทิศ ไม่มีวงวน)',dir:true,E:['AB','AC','BD','CD'],
   pos:{A:[90,80],B:[340,80],C:[90,250],D:[340,250]},desc:'เริ่มที่จุดหนึ่งและจบที่จุดหนึ่ง ใช้กับ workflow / compiler · เมทริกซ์ไม่สมมาตร เพราะ A→B ไม่ได้แปลว่า B→A'},
 coffee:{name:'กราฟสั่งกาแฟ (Task 5 ส่วนที่ 2, มีทิศ)',dir:true,E:['AB','AC','AD','BE','BF','CE','CF','DE','DF','EJ','FG','FH','FI','GK','HL','IM'],
   pos:{A:[220,28],B:[90,95],C:[220,95],D:[350,95],E:[150,168],F:[290,168],J:[60,240],G:[200,240],H:[290,240],I:[380,240],K:[200,305],L:[290,305],M:[380,305]},
   desc:'A = Coffee · B/C/D = Hot/Cold/Warm · E/F = ไม่ใส่นม/ใส่นม · G/H/I = นมน้อย/ปานกลาง/มาก · J–M = ชื่อเครื่องดื่ม (ตามภาพ BFS-Coffee-MATRIX)'},
 shelter:{name:'ชุด C ส่วน 3: จุดรวมพล S → ศูนย์พักพิง T',dir:false,E:['SA','SB','AC','BC','BD','CE','DE','ET'],
   pos:{S:[40,165],A:[140,80],B:[140,250],C:[260,80],D:[260,250],E:[345,165],T:[415,165]},desc:'ใช้ฝึกข้อ 3.2–3.4 ของชุด C'},
 exam:{name:'ชุด A ข้อ 36 (P–T)',dir:false,E:['PQ','PR','QS','RS','RT','ST'],
   pos:{P:[60,165],Q:[190,80],R:[190,250],S:[330,80],T:[330,250]},desc:'ใช้ฝึกข้อ 36 ของชุด A'},
 seven:{name:'แนว 1 ในไฟล์เก็ง (A–G)',dir:false,E:['AB','AC','BD','CD','CE','DF','EF','FG'],
   pos:{A:[40,165],B:[140,80],C:[140,250],D:[260,80],E:[260,250],F:[350,165],G:[415,165]},desc:'ใช้ฝึกแนว 1 ของไฟล์เก็งข้อสอบ'},
 comp:{name:'กราฟแยกส่วน (นับส่วนประกอบเชื่อมโยง)',dir:false,E:['PQ','QR','ST','TU','SU','VW'],
   pos:{P:[50,85],Q:[150,85],R:[250,85],S:[70,265],T:[210,265],U:[140,180],V:[320,205],W:[410,205]},desc:'BFS จาก P ไปถึงแค่ P, Q, R · ต้องเริ่มใหม่ที่ S และ V รวม 3 ส่วน'}
};
let G={key:'book',V:[],M:[],dir:false,pos:{}},steps=[],si=0,li=0,focus={row:-1,hits:[]};
$('preset').innerHTML=Object.entries(PRE).map(([k,p])=>`<option value="${k}">${p.name}</option>`).join('');
function loadPre(k){const p=PRE[k];const V=Object.keys(p.pos);G={key:k,V,dir:p.dir,pos:p.pos,M:V.map(()=>V.map(()=>0))};
  p.E.forEach(e=>{const i=V.indexOf(e[0]),j=V.indexOf(e[1]);G.M[i][j]=1;if(!p.dir)G.M[j][i]=1});
  $('start').innerHTML=V.map(v=>`<option>${v}</option>`).join('');$('pdesc').textContent=p.desc;rebuild()}
function rebuild(){computeBFS();si=0;li=0;focus={row:-1,hits:[]};renderFacts();renderList();renderBFS()}
const nb=i=>G.V.map((_,j)=>j).filter(j=>G.M[i][j]);
function edgeList(){const e=[],n=G.V.length;for(let i=0;i<n;i++)for(let j=0;j<n;j++)if(G.M[i][j]&&(G.dir||j>i))e.push([i,j]);return e}
function classify(){const n=G.V.length,E=edgeList().length;
  if(G.dir){const col=Array(n).fill(0);let cyc=false;const dfs=u=>{col[u]=1;for(const v of nb(u)){if(col[v]===1)cyc=true;else if(col[v]===0)dfs(v)}col[u]=2};for(let i=0;i<n;i++)if(!col[i])dfs(i);
    return cyc?'กราฟมีทิศทาง และมีวงวน':'กราฟมีทิศทาง ไม่มีวงวน (DAG)'}
  const p=[...Array(n).keys()],f=x=>p[x]===x?x:(p[x]=f(p[x]));edgeList().forEach(([a,b])=>p[f(a)]=f(b));const comps=new Set(p.map((_,i)=>f(i))).size;
  const cyc=E>n-comps;
  if(cyc)return `กราฟปิด (มีวงวน)${comps>1?` · แยก ${comps} ส่วน`:''}`;
  return comps===1?`กราฟเปิด / ต้นไม้ (${n} จุด ${E} เส้น = n − 1)`:`ป่า (ต้นไม้ ${comps} ต้น)`}
function renderMatrix(){const V=G.V;let h='<tr><th></th>'+V.map(v=>`<th>${v}</th>`).join('')+`<th>${G.dir?'ออก':'deg'}</th></tr>`;
  V.forEach((r,i)=>{h+=`<tr class="${i===focus.row?'scan':''}"><th>${r}</th>`;V.forEach((c,j)=>{const cls=[i===j?'diag':'',G.M[i][j]?'one':'',(i===focus.row&&focus.hits.includes(j))?'hit':''].join(' ');
    h+=i===j?`<td class="${cls}">0</td>`:`<td class="${cls}"><button aria-label="${r} ไป ${c} เท่ากับ ${G.M[i][j]}" data-i="${i}" data-j="${j}">${G.M[i][j]}</button></td>`});
    h+=`<th>${G.M[i].reduce((a,b)=>a+b,0)}</th></tr>`});
  if(G.dir)h+='<tr><th>เข้า</th>'+V.map((_,j)=>`<th>${G.M.reduce((a,r)=>a+r[j],0)}</th>`).join('')+'<th></th></tr>';
  $('mx').innerHTML=h;$('mx').querySelectorAll('button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i,j=+b.dataset.j;G.M[i][j]=1-G.M[i][j];if(!G.dir)G.M[j][i]=G.M[i][j];rebuild()});
  $('mxhint').textContent=G.dir?'กราฟมีทิศ: แถว = จุดต้นทาง คอลัมน์ = จุดปลายทาง · กดช่องเปลี่ยนเฉพาะลูกศรทิศนั้น · ผลรวมแถว = ดีกรีขาออก ผลรวมคอลัมน์ = ดีกรีขาเข้า':'กราฟไม่มีทิศ: กดช่องแล้วช่องคู่กันเปลี่ยนตาม (ต้องสมมาตร) · แนวทแยงเป็น 0 เพราะไม่มีลูป · ผลรวมแถว = ดีกรี'}
function renderFacts(){const n=G.V.length,E=edgeList().length,deg=G.M.map(r=>r.reduce((a,b)=>a+b,0)),s=deg.reduce((a,b)=>a+b,0);
  $('kind').textContent=classify();
  $('facts').innerHTML=G.dir?
   `<div class="fact"><b>|V| = ${n}</b><small>จุดยอด</small></div><div class="fact"><b>|E| = ${E}</b><small>จำนวนช่องที่เป็น 1 (ลูกศร)</small></div><div class="fact"><b>Σออก = ${s}</b><small>= |E| ✔ (ลูกศรนับครั้งเดียว)</small></div><div class="fact"><b>${n*n} vs ${n+E}</b><small>พื้นที่ Matrix V² vs List V+E</small></div>`:
   `<div class="fact"><b>|V| = ${n}</b><small>จุดยอด</small></div><div class="fact"><b>|E| = ${E}</b><small>นับเฉพาะเหนือแนวทแยง</small></div><div class="fact"><b>Σdeg = ${s}</b><small>${s===2*E?'= 2|E| ✔':'≠ 2|E|'}</small></div><div class="fact"><b>${n*n} vs ${n+2*E}</b><small>พื้นที่ Matrix V² vs List V+2E</small></div>`}
function renderList(){const V=G.V,n=V.length;
  $('alhow').textContent=G.dir?'อ่านแถวของแต่ละจุดจากซ้ายไปขวา ช่องที่เป็น 1 คือจุดที่ลูกศรชี้ไป เขียนต่อกันเป็นโหนดแล้วปิดท้ายด้วย ∅ (null) ลูกศร u→v อยู่เฉพาะในรายการของ u จึงมีโหนดรวม E ตัว':'อ่านแถวของแต่ละจุดจากซ้ายไปขวา ช่องที่เป็น 1 คือเพื่อนบ้าน เขียนต่อกันเป็นโหนดแล้วปิดท้ายด้วย ∅ (null) เส้น A–B ไม่มีทิศ จึงอยู่ทั้งในรายการของ A และของ B มีโหนดรวม 2E ตัว';
  $('alv').innerHTML=V.map((v,i)=>{const ns=nb(i);return `<div class="alrow ${i<li?'on':''} ${i===li-1?'cur':''}"><span class="alhead">${v}</span>${ns.map(j=>`<span class="alarrow"></span><span class="alnode">${V[j]}</span>`).join('')}<span class="alarrow"></span><span class="alnull">∅</span></div>`}).join('');
  if(li===0)$('lMsg').textContent='กด "แปลงแถวถัดไป" เพื่อเริ่มจากแถวแรกของเมทริกซ์';
  else{const i=li-1,ns=nb(i);$('lMsg').innerHTML=`แถว <b>${V[i]}</b>: ${ns.length?`ช่องที่เป็น 1 อยู่ที่คอลัมน์ ${ns.map(j=>V[j]).join(', ')}`:'ไม่มีช่องที่เป็น 1'} → รายการของ ${V[i]} คือ <b class="mono">${[V[i],...ns.map(j=>V[j]),'∅'].join(' → ')}</b>`+(li===n?` · ครบ ${n} แถว ได้โหนดรวม ${G.M.flat().reduce((a,b)=>a+b,0)} ตัว`:'')}
  $('lPrev').disabled=li===0;$('lNext').disabled=li===n}
$('lNext').onclick=()=>{if(li<G.V.length){li++;const i=li-1;focus={row:i,hits:nb(i)};renderList();renderMatrix()}};
$('lPrev').onclick=()=>{if(li>0){li--;focus=li?{row:li-1,hits:nb(li-1)}:{row:-1,hits:[]};renderList();renderMatrix()}};
$('lAll').onclick=()=>{li=G.V.length;focus={row:-1,hits:[]};renderList();renderMatrix()};
function computeBFS(){const V=G.V,s=Math.max(0,V.indexOf($('start').value)),st=V.map(()=>'u'),d=V.map(()=>null),par=V.map(()=>null);st[s]='d';d[s]=0;let q=[s],mc=0,lc=0;
  steps=[{type:'init',q:[...q],st:[...st],d:[...d],par:[...par],mc,lc}];
  while(q.length){const u=q.shift(),found=[],seen=[],hits=[];mc+=V.length;const prev=st.slice();
    for(const v of nb(u)){hits.push(v);lc++;if(st[v]==='u'){st[v]='d';d[v]=d[u]+1;par[v]=u;q.push(v);found.push(v)}else if(prev[v]==='d')seen.push(v)}
    st[u]='e';steps.push({type:'deq',u,found,seen,hits,q:[...q],st:[...st],d:[...d],par:[...par],mc,lc})}}
const CIRC='①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯';
function renderGraph(s){const V=G.V,P=V.map(v=>G.pos[v]),r=V.length>9?16:20,col={u:css('--undiscovered'),d:css('--discovered'),e:css('--explored')};let g='';
  edgeList().forEach(([i,j])=>{const tree=(s.par[j]===i&&s.st[j]!=='u')||(!G.dir&&s.par[i]===j&&s.st[i]!=='u');
    const [x1,y1]=P[i],[x2,y2]=P[j],L=Math.hypot(x2-x1,y2-y1)||1,ux=(x2-x1)/L,uy=(y2-y1)/L;
    const sx=x1+ux*r,sy=y1+uy*r,ex=x2-ux*(r+(G.dir?3:0)),ey=y2-uy*(r+(G.dir?3:0));
    g+=`<line x1="${sx}" y1="${sy}" x2="${ex}" y2="${ey}" stroke="${tree?css('--ink'):css('--graphite')}" stroke-width="${tree?3.2:1.6}" style="color:${tree?css('--ink'):css('--graphite')}" ${G.dir?'marker-end="url(#ar)"':''}/>`});
  V.forEach((v,i)=>{const cur=s.type==='deq'&&s.u===i,[x,y]=P[i];
    g+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${col[s.st[i]]}" stroke="${cur?css('--focus'):css('--ink')}" stroke-width="${cur?4:1.8}"/><text x="${x}" y="${y+5}" text-anchor="middle" font-size="${r>16?15:13}" font-weight="600" fill="#1B2A4A">${v}</text>`;
    if(s.d[i]!==null)g+=`<text x="${x}" y="${y-r-5}" text-anchor="middle" font-size="11" font-weight="600" fill="${css('--graphite')}" paint-order="stroke" stroke="${css('--paper')}" stroke-width="3">d=${s.d[i]}</text>`});
  $('gg').innerHTML=g}
function renderBFS(){if(!steps.length)return;const V=G.V,s=steps[si];renderGraph(s);
  if(s.type==='deq')focus={row:s.u,hits:s.hits};else if(si===0&&li===0)focus={row:-1,hits:[]};
  renderMatrix();
  $('queue').innerHTML=s.q.length?s.q.map(i=>`<span>${V[i]}</span>`).join(''):'<em>ว่าง</em>';
  $('cost').innerHTML=`<div class="fact"><b>${s.mc}</b><small>ช่องที่ Matrix ต้องตรวจ (ทั้งแถว V ช่อง ต่อการนำออก 1 ครั้ง)</small></div><div class="fact"><b>${s.lc}</b><small>โหนดที่ List ต้องตรวจ (เฉพาะเพื่อนบ้านจริง)</small></div>`;
  let h='<tr><th>ขั้น</th><th>นำออกจาก Q</th><th>พบใหม่</th><th>Q หลังทำงาน</th><th>Output</th><th>d</th><th>parent</th></tr>';
  for(let k=0;k<=si;k++){const x=steps[k];if(x.type==='init'){const a=x.q[0];h+=`<tr class="${k===si?'now':''}"><td>เริ่ม</td><td>–</td><td>${V[a]}</td><td class="mono">[${V[a]}]</td><td>–</td><td>d[${V[a]}]=0</td><td>–</td></tr>`;continue}
    const f=x.found.map(i=>V[i]).join(', ')||'–',note=x.seen.length?` (${x.seen.map(i=>V[i]).join(', ')} พบแล้ว)`:'';
    h+=`<tr class="${k===si?'now':''}"><td>${CIRC[k-1]||k}</td><td>${V[x.u]}</td><td>${f}${note}</td><td class="mono">${x.q.length?'['+x.q.map(i=>V[i]).join(', ')+']':'ว่าง'}</td><td>${V[x.u]}</td><td>${x.found.map(i=>`d[${V[i]}]=${x.d[i]}`).join(', ')}</td><td>${x.found.map(i=>`${V[i]}←${V[x.u]}`).join(', ')}</td></tr>`}
  $('btrace').innerHTML=h;const L=steps[steps.length-1];
  if(si===steps.length-1){const order=steps.slice(1).map(x=>V[x.u]),un=V.filter((v,i)=>L.d[i]===null),lv={};L.d.forEach((x,i)=>{if(x!==null)(lv[x]=lv[x]||[]).push(V[i])});
    let far=steps[0].q[0];L.d.forEach((x,i)=>{if(x!==null&&x>L.d[far])far=i});let path=[far],p=far;while(L.par[p]!==null){p=L.par[p];path.push(p)}
    $('bsum').innerHTML=`ลำดับ BFS: <b class="mono">${order.join(' → ')}</b> · ระดับ: ${Object.keys(lv).map(k=>`ระดับ ${k} {${lv[k].join(', ')}}`).join(' ')} · ย้อน parent ไปจุดที่ไกลที่สุด ${V[far]}: <b class="mono">${path.reverse().map(i=>V[i]).join('–')}</b> (${L.d[far]} เส้น)`+(un.length?` · <span class="bad">เข้าถึงไม่ได้: ${un.join(', ')}</span> ${G.dir?'(กราฟมีทิศ เดินตามลูกศรเท่านั้น)':'→ เริ่ม BFS ใหม่จากจุดที่ยังไม่พบเพื่อนับส่วนประกอบเชื่อมโยง'}`:'')}
  else $('bsum').textContent='กด "ขั้นถัดไป" เพื่อนำหัวคิวออก แล้วสแกนแถวของมันในเมทริกซ์ (แถวที่ไฮไลต์)';
  const Lh=s.type==='init'?[3,4,5]:[7,8,9,10,11,12],code=[' 1  FOR i ← 1 TO n',' 2      visited[i] ← 0',' 3  Q ← Queue ว่าง',' 4  visited[s] ← 1 ; d[s] ← 0',' 5  ใส่ s เข้า Q',' 6  WHILE Q ไม่ว่าง',' 7      u ← DEQUEUE(Q)',' 8      OUTPUT u',' 9      FOR v ← 1 TO n                (ถ้าใช้ List: FOR v ในรายการของ u)','10          IF A[u][v] = 1 AND visited[v] = 0','11              visited[v] ← 1 ; d[v] ← d[u] + 1 ; parent[v] ← u','12              ใส่ v เข้า Q'];
  $('bcode').innerHTML=code.map((c,i)=>Lh.includes(i+1)?`<span class="hl">${c}</span>`:c).join('\n')+`\n\nMatrix: นำออกไม่เกิน V ครั้ง × สแกนแถว V ช่อง = Θ(V²)   ·   List: ตรวจรวม ${G.dir?'E':'2E'} โหนด = Θ(V + E)`;
  $('bPrev').disabled=si===0;$('bNext').disabled=si===steps.length-1}
$('preset').onchange=e=>loadPre(e.target.value);$('start').onchange=()=>{computeBFS();si=0;renderBFS()};
$('bNext').onclick=()=>{if(si<steps.length-1){si++;renderBFS()}};$('bPrev').onclick=()=>{if(si>0){si--;renderBFS()}};
$('bAll').onclick=()=>{si=steps.length-1;renderBFS()};$('bReset').onclick=()=>{si=0;focus={row:-1,hits:[]};renderBFS()};
function gcalc(){const v=Math.max(1,+$('gV').value||1),dd=Math.max(0,+$('gD').value||0),E=Math.round(v*dd/2),mx=v*v,li2=v+2*E,pick=mx<=li2*1.25?'เมทริกซ์ประชิด (กราฟหนาแน่น ถาม u–v ได้ Θ(1) และพื้นที่ไม่ต่างกันมาก)':'รายการประชิด (กราฟเบาบาง)';
  $('gOut').innerHTML=`<div class="scroll"><table class="t"><tr><th></th><th>เมทริกซ์ประชิด</th><th>รายการประชิด</th></tr><tr><td>จำนวนเส้น E = V × เฉลี่ย ÷ 2</td><td colspan="2">${fmt(E)} เส้น (ถนน 1 สายนับที่ทั้ง 2 ปลาย จึงหาร 2)</td></tr><tr><td>พื้นที่</td><td>V² = ${fmt(mx)}</td><td>V + 2E = ${fmt(li2)}</td></tr><tr><td>ไล่ BFS ทั้งกราฟ (จำนวนช่อง/โหนดที่ตรวจ)</td><td>Θ(V²) ≈ ${fmt(mx)}</td><td>Θ(V + E) ≈ V + 2E = ${fmt(li2)}</td></tr><tr><td>ถามว่า u กับ v เชื่อมกันไหม</td><td>Θ(1)</td><td>ต้องไล่รายการ ≈ ${dd} ตัว</td></tr></table></div><p><b>เลือก${pick}</b> · พื้นที่ต่างกันราว ${fmt(Math.round(mx/li2))} เท่า</p>`}
['gV','gD'].forEach(id=>$(id).oninput=gcalc);

/* ---------- PROF SLIDE SUMMARY ---------- */
const SG=[[1,'ปก: อัลกอริทึมสำหรับกราฟ I — การแทนกราฟ · BFS · DFS · การเข้าถึง · เส้นทางสั้นที่สุดแบบไม่มีน้ำหนัก','',''],
 [2,'ผลลัพธ์การเรียนรู้ 3 ขั้น: Model (แทนความสัมพันธ์เป็นกราฟ เลือกรายการหรือเมทริกซ์ประชิด) → Trace (ไล่ BFS ด้วยมือก่อนเขียนซูโดโค้ด) → Solve (หาเส้นทางสั้นที่สุดในกราฟไม่มีน้ำหนัก)','in','ส่วน 3 ทั้งหมด'],
 [3,'จากโลกกายภาพสู่แบบจำลองเชิงตรรกะ: ห้อง = จุดยอด ทางเชื่อม/เชือก = เส้นเชื่อม · "กราฟไม่ได้เป็นเพียงรูปวงกลมและเส้น แต่เป็นแบบจำลองความสัมพันธ์ การเลือกว่าอะไรคือจุดยอดและอะไรคือเส้นเชื่อม เป็นการตัดสินใจที่กำหนดคำตอบ"','in','ส่วน 3 เลือก "กราฟสไลด์หน้า 3"'],
 [4,'3 สถานะของการเดินสำรวจ: ยังไม่พบ (อยู่นอกขอบเขต) · พบแล้ว (อยู่ในคิว/สแต็กแต่ยังไม่ตรวจเส้นของมัน) · สำรวจแล้ว (ตรวจเส้นครบ ถอดออกจากหน่วยความจำ)','in','สีของจุดในส่วน 3 ข้อ 4'],
 [5,'การแทนกราฟ: รายการประชิด Θ(V+E) เหมาะกับกราฟเบาบาง ประหยัดพื้นที่ · เมทริกซ์ประชิด Θ(V²) ต้องตรวจทุกช่อง เหมาะกับกราฟหนาแน่น เช็กการเชื่อมต่อได้ทันที · การเลือกขึ้นกับความหนาแน่นของความสัมพันธ์','in','ส่วน 3 ข้อ 1, 3, 5'],
 [6,'BFS ขยายเป็นวงทีละชั้น d = 0, 1, 2, 3 · กลไกคือคิว (เข้าก่อนออกก่อน) · รับประกันเส้นทางที่มีจำนวนเส้นน้อยที่สุดในกราฟที่ทุกเส้นมีต้นทุนเท่ากัน','in','ส่วน 3 ข้อ 4'],
 [7,'ไล่ BFS จุดเสี่ยงจากประตูชำรุด ตอนที่ 1: รอบ 0 ใส่ A (d[A]=0) · รอบ 1 นำ A ออก เพิ่ม B, C (d=1)','in','ส่วน 3 เลือก "กราฟหนังสือหน้า 26" เริ่ม A'],
 [8,'ตอนที่ 2: รอบ 2 นำ B ออก เพิ่ม D, E (d=2) · รอบ 3 นำ C ออก ไม่เพิ่ม (E พบแล้ว) · รอบ 4–5 นำ D, E ออก เพิ่ม F ครั้งเดียว (d[F]=3)','in','ส่วน 3 กด "ขั้นถัดไป"'],
 [9,'DFS การค้นตามแนวลึก ใช้กองซ้อน (สแต็ก) ย้อนกลับเมื่อไปต่อไม่ได้ บันทึกเวลาเริ่มพบและสำรวจเสร็จ','out','ยังไม่สอน'],
 [10,'เปรียบเทียบพฤติกรรม: BFS กระจายเป็นวงหาทางสั้นที่สุด · DFS ดิ่งลึกหาโครงสร้างและการพึ่งพา','in','ใช้เฉพาะฝั่ง BFS'],
 [11,'จับคู่ปัญหาโลกจริง: ส่วนประกอบเชื่อมโยง (เริ่มค้นใหม่จากจุดที่ยังไม่พบ) · กราฟสองส่วน (BFS ระบายสองสี) · เก็บหน้าเว็บ (BFS + เซตกันวนซ้ำ) · ส่วนการตรวจวงวน ลำดับก่อนหลัง จุดตัดขาด ใช้ DFS','in','ส่วน 3 เลือก "กราฟแยกส่วน"'],
 [12,'โครงสร้างการตัดสินใจ: เส้นมีทิศหรือน้ำหนักไหม → กราฟเบาบางหรือหนาแน่น (รายการ/เมทริกซ์) → เป้าหมายคือการเข้าถึง/ทางสั้นสุดแบบไม่มีน้ำหนัก (BFS) หรือลำดับก่อนหลัง/วงวน/โครงสร้าง (DFS)','in','ใช้เป็นโครงตอบส่วน 3'],
 [13,'ข้อควรระวังการประมวลผลแบบขนาน: แบ่งงานให้ p ตัวไม่ได้ Θ((V+E)/p) เสมอ เพราะต้องจัดการขอบเขตที่กำลังสำรวจ งานที่ต้องรอกัน การพบจุดซ้ำ และการแย่งกันเขียนพร้อมกัน','in','A4 ด้านหลัง'],
 [14,'คำถามท้ายคาบ: หมู่บ้าน 10,000 แห่ง ถนนเฉลี่ย 3 สาย ใช้รายการหรือเมทริกซ์ อธิบายด้วยบิกโอและตรวจด้วย 3E','in','ส่วน 3 ข้อ 5'],
 [15,'สรุป: (1) กราฟคือความสัมพันธ์ การเลือกจุด/เส้นกำหนดคำตอบ (2) เบาบางใช้รายการ หนาแน่นใช้เมทริกซ์ (3) BFS ใช้คิวหาทางสั้นสุด (4) ต้องไล่ด้วยมือได้ก่อนเขียนซูโดโค้ด','in','']];
const SCK=[[1,'ปก: ก้าวแรกสู่การคิดแบบอัลกอริทึม — ภารกิจขนย้ายไก่ 1,000 ตัว','',''],
 [2,'กายวิภาคของโจทย์เชิงคำนวณ: Input (วัตถุดิบ) → พฤติกรรมที่คาดหวัง → Output (คำตอบสุดท้าย) · Constraints (ขอบเขตระบบ ข้อมูลใหญ่สุด ติดลบได้ไหม) · Edge cases (กรณีที่ทำให้พัง ไม่มีข้อมูล ค่าเป็นศูนย์ทั้งหมด)','in','ส่วน 1'],
 [3,'การไล่เรียงลำดับความคิด (Tracing) พิสูจน์ตรรกะก่อนเขียนโค้ด: หาค่ามากสุดของ [3, 7, 2, 9, 5] ตัวแปรเปลี่ยน 3 → 7 → 7 → 9 → 9 · ข้อจำกัด: มีอย่างน้อย 1 ตัว · กรณีขอบเขต: มีตัวเดียว ติดลบทั้งหมด ซ้ำกันทั้งหมด','in','ส่วน 1 + A4'],
 [4,'กราฟบิกโอ: O(1) คงที่ · O(log n) ข้อมูลเพิ่มเท่าตัวเวลาเพิ่มนิดเดียว (เช่น Binary Search) · O(n) ไล่ทีละตัว · O(n²) ลูปซ้อน พุ่งสูง ไม่เหมาะกับข้อมูลมหาศาล','in','ส่วน 4'],
 [5,'แบ่งแยกและเอาชนะ = กลไกการเรียกซ้ำ: Divide (ส่งปัญหาให้หน่วยย่อย) · Conquer (กรณีฐาน แถวหน้าสุดที่รู้คำตอบ) · Combine (ส่งคำตอบย้อนกลับพร้อมบวก 1) · หัวใจคือกรณีฐานที่ทำให้หยุดเรียกตัวเอง','in','ส่วน 2'],
 [6,'การแทนข้อมูล 5 แบบ: เซต (มีหรือไม่มี) · กราฟ (ความสัมพันธ์) · เมทริกซ์ (พื้นที่/พิกัด) · พจนานุกรม (คุณลักษณะ) · จำนวนเต็ม (ปริมาณ)','in','ส่วน 1'],
 [7,'แผนภารกิจ 5 จุดตรวจจากลำพูนไปลำปาง (ภาพรวมทั้งเทอม)','out','อ่านผ่าน ๆ'],
 [8,'Stage 1: สัปดาห์ 3 Merge Sort เรียงไก่ตามน้ำหนัก แบ่งครึ่งแล้วผสานกลับ O(n log n) · สัปดาห์ 4–5 Dijkstra หาเส้นทางที่ใช้เวลาน้อยที่สุด','in','เฉพาะ Merge Sort (Dijkstra ไม่ออก)'],
 [9,'Stage 2: สัปดาห์ 6 State-Space Search · สัปดาห์ 7–8 Dynamic Programming (Knapsack)','out','หลังกลางภาค'],
 [10,'Stage 3: สัปดาห์ 9 Greedy · สัปดาห์ 10 String Matching','out','หลังกลางภาค'],
 [11,'สัปดาห์ 11 NP-Complete · สัปดาห์ 12 Approximation','out','หลังกลางภาค'],
 [12,'สัปดาห์ 13 Randomized Algorithm (สุ่มตรวจ K ตัว)','out','หลังกลางภาค'],
 [13,'ตารางสรุปทั้งเทอม: เฉพาะแถวจัดเรียงน้ำหนัก Merge Sort O(n log n) ที่ออกสอบ','in','ส่วน 2']];
const slideRow=([n,t,tag,where])=>`<div class="sl"><span class="n">${n}</span><span>${t}${where?`<br><small class="hint">ดูตัวอย่าง: ${where}</small>`:''}</span><span class="tag ${tag}">${tag==='in'?'ออกสอบ':tag==='out'?'ไม่ออก':'—'}</span></div>`;
$('sg').innerHTML=SG.map(slideRow).join('');$('sc').innerHTML=SCK.map(slideRow).join('');
/* ---------- MERGE SORT ---------- */
let mSteps=[],mi=0,mSorted=[];
const parseList=s=>s.split(/[,\s]+/).filter(Boolean).map(Number).filter(x=>!isNaN(x)).slice(0,16);
function buildMerge(arr){
  const levels=[];mSteps=[];let inv=0;
  (function divide(a,d){(levels[d]=levels[d]||[]).push(a);if(a.length<=1)return;const m=Math.floor(a.length/2);divide(a.slice(0,m),d+1);divide(a.slice(m),d+1)})(arr,0);
  function sort(a,d){if(a.length<=1)return a;const m=Math.floor(a.length/2),L=sort(a.slice(0,m),d+1),R=sort(a.slice(m),d+1),out=[],cmp=[];let i=0,j=0;
    while(i<L.length&&j<R.length){if(L[i]<=R[j]){cmp.push(`${L[i]} vs ${R[j]} → หยิบ ${L[i]} (ซ้าย)`);out.push(L[i++])}else{cmp.push(`${L[i]} vs ${R[j]} → หยิบ ${R[j]} (ขวา) · ซ้ายเหลือ ${L.length-i} ตัว`);inv+=L.length-i;out.push(R[j++])}}
    const rest=L.slice(i).concat(R.slice(j));if(rest.length)cmp.push(`อีกส่วนหมด → ต่อที่เหลือ ${rest.join(', ')}`);out.push(...rest);
    mSteps.push({d,L,R,out,cmp,n:cmp.filter(c=>c.includes(' vs ')).length});return out}
  mSorted=sort(arr,0);mSteps.inv=inv;
  $('msDivide').innerHTML='<p class="hint">ขั้นแบ่งจนเหลือตัวเดียว (กรณีฐาน)</p>'+levels.map((lv,d)=>`<div class="lvl"><span class="lvlname">ระดับ ${d}</span>${lv.map(a=>`<div class="chunk">${a.map(x=>`<span>${x}</span>`).join('')}</div>`).join('')}</div>`).join('');
  mi=0;renderMerge();bsRun();
}
function renderMerge(){
  const by={};mSteps.slice(0,mi).forEach((s,k)=>{(by[s.d]=by[s.d]||[]).push({...s,last:k===mi-1})});
  const ds=Object.keys(by).map(Number).sort((a,b)=>b-a);
  $('msMerge').innerHTML='<p class="hint">ขั้นรวม</p>'+(ds.length?ds.map(d=>`<div class="lvl"><span class="lvlname">รวมกลับสู่ระดับ ${d} · เทียบ ${by[d].reduce((a,s)=>a+s.n,0)} ครั้ง</span>${by[d].map(s=>`<div class="chunk ${s.last?'new':''}">${s.out.map(x=>`<span>${x}</span>`).join('')}</div>`).join('')}</div>`).join(''):'<p class="hint">กด "รวมคู่ถัดไป"</p>');
  const c=mSteps[mi-1];$('msLog').innerHTML=c?`<li><b>รวม [${c.L.join(', ')}] กับ [${c.R.join(', ')}]</b></li>`+c.cmp.map(x=>`<li>${x}</li>`).join(''):'';
  const done=mi===mSteps.length,tot=mSteps.reduce((a,s)=>a+s.n,0),n=mSorted.length;
  $('msSum').innerHTML=done?`ผลลัพธ์ <b class="mono">[${mSorted.join(', ')}]</b> · เปรียบเทียบรวม <b>${tot}</b> ครั้ง (≤ n log₂n ≈ ${Math.round(n*Math.log2(n)||0)}) · คู่สลับลำดับ ${mSteps.inv} คู่ · Θ(n log n)`:`รวมแล้ว ${mi} จาก ${mSteps.length} ครั้ง`;
  $('msPrev').disabled=mi===0;$('msNext').disabled=done;
}
document.querySelectorAll('[data-ms]').forEach(b=>b.onclick=()=>{$('msin').value=b.dataset.ms;buildMerge(parseList(b.dataset.ms))});
$('msGo').onclick=()=>buildMerge(parseList($('msin').value));
$('msNext').onclick=()=>{if(mi<mSteps.length){mi++;renderMerge()}};$('msPrev').onclick=()=>{if(mi>0){mi--;renderMerge()}};$('msAll').onclick=()=>{mi=mSteps.length;renderMerge()};
function bsRun(){const L=mSorted,t=Number($('bsT').value);let lo=1,hi=L.length,r=0,found=false,h='<tr><th>รอบ</th><th>low</th><th>high</th><th>mid</th><th>L[mid]</th><th>ตัดสินใจ</th></tr>';
  while(lo<=hi){r++;const mid=Math.floor((lo+hi)/2),v=L[mid-1];
    if(v===t){h+=`<tr><td>${r}</td><td>${lo}</td><td>${hi}</td><td>${mid}</td><td>${v}</td><td class="ok">พบ ตำแหน่ง ${mid}</td></tr>`;found=true;break}
    if(v<t){h+=`<tr><td>${r}</td><td>${lo}</td><td>${hi}</td><td>${mid}</td><td>${v}</td><td>${v} &lt; ${t} → low = ${mid+1}</td></tr>`;lo=mid+1}
    else{h+=`<tr><td>${r}</td><td>${lo}</td><td>${hi}</td><td>${mid}</td><td>${v}</td><td>${v} &gt; ${t} → high = ${mid-1}</td></tr>`;hi=mid-1}}
  if(!found)h+=`<tr><td>–</td><td>${lo}</td><td>${hi}</td><td colspan="3" class="bad">low &gt; high → หยุด "ไม่พบ"</td></tr>`;
  $('bsTable').innerHTML=h;$('bsSum').textContent=`รายการ [${L.join(', ')}] · ตรวจ ${r} ครั้ง ≤ ⌈log₂${L.length}⌉ + 1 = ${Math.ceil(Math.log2(L.length))+1} · ต้องเรียงก่อน`;}
$('bsGo').onclick=bsRun;
buildMerge(parseList($('msin').value));

/* ---------- KARATSUBA ANIMATION ---------- */
let kNodes=[],kEvents=[],ki=0,kTimer=null;const dg=x=>String(x).length;
function kara(x,y,dep,label,parent=null){
  const id=kNodes.length,n=dg(x),m=dg(y),node={id,parent,dep,label,x,y,n,m,children:[]};kNodes.push(node);
  kEvents.push({kind:'enter',id});node.enterAt=kEvents.length-1;
  if(n===1||m===1){node.base=true;node.M=x*y;kEvents.push({kind:'base',id});node.doneAt=kEvents.length-1;return node.M}
  node.k=Math.ceil(Math.max(n,m)/2);node.pow=10**node.k;
  node.a=Math.floor(x/node.pow);node.b=x%node.pow;node.c=Math.floor(y/node.pow);node.d=y%node.pow;
  const before=kNodes.length;node.P=kara(node.a,node.c,dep+1,'P',id);node.children.push(before);kEvents.push({kind:'P',id});
  const beforeQ=kNodes.length;node.Q=kara(node.b,node.d,dep+1,'Q',id);node.children.push(beforeQ);kEvents.push({kind:'Q',id});
  const beforeR=kNodes.length;node.R=kara(node.a+node.b,node.c+node.d,dep+1,'R',id);node.children.push(beforeR);kEvents.push({kind:'R',id});
  node.S=node.R-node.P-node.Q;node.M=node.P*node.pow*node.pow+node.S*node.pow+node.Q;
  kEvents.push({kind:'combine',id});node.doneAt=kEvents.length-1;return node.M;
}
function stopK(){if(kTimer){clearInterval(kTimer);kTimer=null}$('kPlay').textContent='เล่น'}
function runK(){stopK();const x=parseInt($('kx').value,10),y=parseInt($('ky').value,10);
  if(!(x>=0&&y>=0)||dg(x)>6||dg(y)>6){$('ksum').innerHTML='<span class="bad">ใส่จำนวนเต็มไม่ติดลบ ไม่เกิน 6 หลัก</span>';return}
  kNodes=[];kEvents=[];kara(x,y,0,'เริ่ม');ki=0;renderK()}
function kStage(kind){return kind==='enter'?0:kind==='P'?1:kind==='Q'?2:kind==='R'?3:kind==='combine'?4:4}
function splitText(r){const w=2*r.k,sx=String(r.x).padStart(w,'0'),sy=String(r.y).padStart(w,'0');return `${sx.slice(0,-r.k)}|${sx.slice(-r.k)} และ ${sy.slice(0,-r.k)}|${sy.slice(-r.k)}`}
function eventCopy(e,r){
  if(e.kind==='enter')return r.base?{title:`เปิด K(${r.x}, ${r.y})`,why:'มีอย่างน้อยหนึ่งจำนวนเป็นเลขหลักเดียว จึงหยุดแบ่งได้'}:{title:`ผ่า K(${r.x}, ${r.y})`,why:`ใช้ k = ⌈max(${r.n}, ${r.m})/2⌉ = ${r.k} และใช้ k เดียวกันกับทั้งสองจำนวน`};
  if(e.kind==='base')return{title:'ถึงกรณีฐานแล้ว',why:`คูณตรง ๆ: ${r.x} × ${r.y} = ${fmt(r.M)} แล้วส่งค่านี้กลับไปหาการเรียกแม่`};
  if(e.kind==='P')return{title:`ได้ P = ac = ${fmt(r.P)}`,why:`P บอกส่วนหน้า×ส่วนหน้า ตอนนี้กลับมาที่ K(${r.x}, ${r.y}) เพื่อหา Q ต่อ`};
  if(e.kind==='Q')return{title:`ได้ Q = bd = ${fmt(r.Q)}`,why:'Q บอกส่วนหลัง×ส่วนหลัง เหลือการคูณครั้งที่สาม R'};
  if(e.kind==='R')return{title:`ได้ R = (a+b)(c+d) = ${fmt(r.R)}`,why:`ลบ P และ Q ออกจาก R เพื่อหา S = ad+bc`};
  return{title:`ประกอบกลับได้ M = ${fmt(r.M)}`,why:'วาง P ไว้ส่วนหน้า เลื่อน S ไป k หลัก แล้วเติม Q ส่วนท้าย'};
}
function calcCopy(e,r){
  if(r.base)return `<div class="kbig">${r.x} × ${r.y} = <b>${fmt(r.M)}</b></div><p class="hint">กรณีฐาน: ถ้า n = 1 หรือ m = 1 ให้ return X×Y</p>`;
  const vals=`a=${r.a}, b=${r.b}, c=${r.c}, d=${r.d}`;
  if(e.kind==='enter')return `<div class="kbig">${splitText(r)}</div><div class="kformula">${vals}<br>P = K(${r.a}, ${r.c})<br>Q = K(${r.b}, ${r.d})<br>R = K(${r.a+r.b}, ${r.c+r.d})</div>`;
  if(e.kind==='P')return `<div class="kformula">${vals}<br><b>P = ${fmt(r.P)}</b><br>Q = ? &nbsp; R = ? &nbsp; S = ?</div>`;
  if(e.kind==='Q')return `<div class="kformula">${vals}<br>P = ${fmt(r.P)} &nbsp; <b>Q = ${fmt(r.Q)}</b><br>R = ? &nbsp; S = ?</div>`;
  if(e.kind==='R')return `<div class="kformula">P = ${fmt(r.P)} &nbsp; Q = ${fmt(r.Q)} &nbsp; <b>R = ${fmt(r.R)}</b><br>S = ${fmt(r.R)} − ${fmt(r.P)} − ${fmt(r.Q)} = <b>${fmt(r.S)}</b></div>`;
  return `<div class="kformula">M = P×10<sup>2k</sup> + S×10<sup>k</sup> + Q<br>= ${fmt(r.P)}×10<sup>${2*r.k}</sup> + ${fmt(r.S)}×10<sup>${r.k}</sup> + ${fmt(r.Q)}<br>= <b>${fmt(r.M)}</b></div>`;
}
function renderK(){
  const e=kEvents[ki],r=kNodes[e.id],stage=kStage(e.kind),labels=['1 ผ่า / กรณีฐาน','2 หา P','3 หา Q','4 หา R และ S','5 ประกอบ M'];
  $('kSteps').innerHTML=labels.map((x,i)=>`<div class="kstep ${i===stage?'on':i<stage?'done':''}">${x}</div>`).join('');
  const copy=eventCopy(e,r);$('kMsg').innerHTML=`<div class="kbig">${copy.title}</div><p>${copy.why}</p><p class="hint">การเรียก: ${r.label} · ระดับ ${r.dep}</p>`;$('kCalc').innerHTML=calcCopy(e,r);
  const maxD=Math.max(...kNodes.map(n=>n.dep));let tree='';
  for(let d=0;d<=maxD;d++){const ns=kNodes.filter(n=>n.dep===d&&n.enterAt<=ki);if(!ns.length)continue;tree+=`<div class="klevel">${ns.map(n=>{const done=n.doneAt<=ki,active=n.id===r.id;return `<div class="knode seen ${done?'done':''} ${active?'active':''}"><b>${n.label}: K(${n.x},${n.y})</b><small>${done?'คืน '+fmt(n.M):active?'กำลังทำ':'รอผล'}</small></div>`}).join('')}</div>`}$('kTree').innerHTML=tree;
  let h='<tr><th>การเรียก</th><th>n, m → k</th><th>a, b | c, d</th><th>P, Q, R</th><th>S = R − P − Q</th><th>M</th></tr>';
  kNodes.filter(n=>n.enterAt<=ki).forEach(n=>{const done=n.doneAt<=ki,nm=`<span class="mono">${'&nbsp;'.repeat(n.dep*4)}${n.label}: K(${n.x}, ${n.y})</span>`;
    if(n.base){h+=`<tr class="${n.id===r.id?'now':''}"><td>${nm}</td><td>${n.n}, ${n.m}</td><td colspan="3">กรณีฐาน → ${n.x} × ${n.y}</td><td><b>${fmt(n.M)}</b></td></tr>`;return}
    h+=`<tr class="${n.id===r.id?'now':''}"><td>${nm}</td><td>${n.n}, ${n.m} → k=${n.k}</td><td>${n.a}, ${n.b} | ${n.c}, ${n.d}</td>${done?`<td>${fmt(n.P)}, ${fmt(n.Q)}, ${fmt(n.R)}</td><td>${fmt(n.S)}</td><td><b>${fmt(n.M)}</b></td>`:'<td colspan="3" class="hint">กำลังคำนวณ…</td>'}</tr>`});$('ktable').innerHTML=h;
  const root=kNodes[0],done=ki===kEvents.length-1;$('ksum').innerHTML=done?`${root.x} × ${root.y} = <b>${fmt(root.M)}</b> <span class="ok">✔ ตรงกับคูณธรรมดา</span> · จำสูตร M = P×10<sup>2k</sup> + S×10<sup>k</sup> + Q`:`ขั้นที่ ${ki+1} จาก ${kEvents.length} · ผลสุดท้ายจะปรากฏเมื่อค่าจากลูกไหลกลับถึงราก`;
  $('kPrev').disabled=ki<=0;$('kNext').disabled=done;if(done)stopK();
}
function nextK(){if(ki<kEvents.length-1){ki++;renderK()}}
document.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const [x,y]=b.dataset.k.split(',');$('kx').value=x;$('ky').value=y;runK()});
$('kGo').onclick=runK;$('kNext').onclick=()=>{stopK();nextK()};$('kPrev').onclick=()=>{stopK();if(ki>0){ki--;renderK()}};$('kAll').onclick=()=>{stopK();ki=kEvents.length-1;renderK()};
$('kPlay').onclick=()=>{if(kTimer){stopK();return}if(ki===kEvents.length-1)ki=0;$('kPlay').textContent='หยุด';kTimer=setInterval(nextK,Math.max(200,2000-Number($('kSpeed').value)))};runK();

/* ---------- PART 4 ---------- */
function tstr(ops,sp){const s=ops/sp;if(s<1e-3)return'< 1 มิลลิวินาที';if(s<1)return(s*1000).toFixed(1)+' มิลลิวินาที';if(s<120)return s.toFixed(2)+' วินาที';if(s<7200)return(s/60).toFixed(1)+' นาที';if(s<172800)return(s/3600).toFixed(1)+' ชั่วโมง';return(s/86400).toFixed(1)+' วัน'}
function sci(x){if(x<1e5)return fmt(Math.round(x));const e=Math.floor(Math.log10(x));return(x/10**e).toFixed(1)+'×10^'+e}
function bars(rows,sp){const mx=Math.max(...rows.map(r=>Math.log10(r.v+1))),mn=Math.min(...rows.map(r=>r.v));
  return '<div class="bars">'+rows.map(r=>`<div class="bar ${r.v===mn?'best':''}"><span>${r.name}<br><small class="hint">${r.o}</small></span><i style="width:${Math.max(3,Math.log10(r.v+1)/mx*100)}%"></i><span class="mono">${sci(r.v)}<br><small class="hint">${tstr(r.v,sp)}</small></span></div>`).join('')+'</div><p class="hint">ความยาวแท่งเป็นสเกล log · สีเขียว = น้อยที่สุด</p>'}
function calc4(){const n=Math.max(1,+$('n4').value||1),k=Math.max(1,+$('k4').value||1),sp=Math.max(1,+$('s4').value||1),lg=Math.log2(n)||0,lgc=Math.ceil(lg)+1;
  $('outA').innerHTML=bars([{name:'เทียบทุกคู่',o:'n(n−1)/2 = Θ(n²) · พื้นที่ Θ(1)',v:n*(n-1)/2},{name:'เรียงแล้วดูคู่ติดกัน',o:'Θ(n log n) · ได้บัญชีเรียงไว้ใช้ต่อ',v:n*lg+n},{name:'เซตแฮช',o:'Θ(n) คาดหวัง · พื้นที่ Θ(n)',v:n}],sp);
  const lin=k*n,srt=n*lg+k*lgc,cross=Math.ceil(n*lg/Math.max(1,n-lgc));
  $('outB').innerHTML=bars([{name:'ค้นทีละรายการทุกครั้ง',o:'k × n',v:lin},{name:'เรียงครั้งเดียว + Binary search',o:'n log n + k(⌈log n⌉+1)',v:srt},{name:'สร้างดัชนีแฮช + ค้น',o:'n + k (เฉลี่ย) · พื้นที่ Θ(n)',v:n+k}],sp)+
    `<p><b>จุดเปลี่ยนระหว่าง 2 วิธีแรก ≈ k = ${fmt(cross)} ครั้ง</b> (≈ log₂n) · ตอนนี้ k = ${fmt(k)} → ${lin<srt?'ค้นทีละรายการคุ้มกว่า ไม่ต้องเรียง':'เรียงก่อนคุ้มกว่า'}</p>`;
  const fs=[['O(1)',x=>1],['O(log n)',x=>Math.log2(x)],['O(n)',x=>x],['O(n log n)',x=>x*Math.log2(x)],['O(n²)',x=>x*x],['O(2ⁿ)',x=>2**x]];
  let h=`<tr><th>Big-O</th><th>n = ${fmt(n)}</th><th>n × 2</th><th>n × 10</th><th>เวลาที่ n</th></tr>`;
  fs.forEach(([nm,f])=>{const a=f(n),b=f(2*n),c=f(10*n),r=(x)=>isFinite(x)&&isFinite(a)&&a>0?(nm==='O(log n)'?'+'+(x-a).toFixed(1):'×'+(x/a<1e6?(+(x/a).toFixed(1)).toLocaleString('en-US'):sci(x/a))):'ระเบิด';
    h+=`<tr><td>${nm}</td><td class="mono">${isFinite(a)?sci(a):'มหาศาล'}</td><td>${nm==='O(1)'?'เท่าเดิม':r(b)}</td><td>${nm==='O(1)'?'เท่าเดิม':r(c)}</td><td>${isFinite(a)?tstr(a,sp):'ไม่มีวันเสร็จ'}</td></tr>`});
  $('growth').innerHTML=h}
['n4','k4','s4'].forEach(id=>$(id).oninput=calc4);calc4();

/* ---------- VISUALGO ---------- */
const VA=[{u:'https://visualgo.net/en/sorting',h:'เลือก <b>MER</b> (Merge Sort) ที่แถบด้านบน → กด Create ใส่ตัวเลขเอง เช่น 180,95,240,60,130,75,150,70 → กด Sort แล้วลดความเร็ว เทียบกับเครื่องมือส่วน 2'},
 {u:'https://visualgo.net/en/graphds',h:'วาดกราฟเอง แล้วสลับแท็บ <b>Adjacency Matrix</b> กับ <b>Adjacency List</b> เพื่อดูว่ากราฟเดียวกันเก็บต่างกันอย่างไร (ส่วน 3 "หนึ่งปัญหา สองโครงสร้าง") · เลือกแบบไม่มีทิศและไม่มีน้ำหนัก'},
 {u:'https://visualgo.net/en/dfsbfs',h:'เลือกกราฟตัวอย่างหรือวาดเอง → กด <b>BFS</b> ใส่จุดเริ่ม → ดูคิวและระดับ · <b>ข้าม DFS</b> (ยังไม่ออกสอบ) · VisuAlgo ใช้ Adjacency List ลำดับเพื่อนบ้านอาจต่างจากการสแกนเมทริกซ์ซ้าย→ขวา'}];
let curVA=0;function loadVA(i){curVA=i;document.querySelectorAll('[data-va]').forEach(b=>b.classList.toggle('main',+b.dataset.va===i));$('vaHow').innerHTML=VA[i].h;$('vaOpen').href=VA[i].u;if($('vaFrame').src!==VA[i].u)$('vaFrame').src=VA[i].u}
document.querySelectorAll('[data-va]').forEach(b=>b.onclick=()=>loadVA(+b.dataset.va));

/* ---------- SET C ---------- */
const C=[
 ['ส่วน 1 · จากงานจริงสู่ Input และ Output (22 คะแนน)','<b>สถานการณ์:</b> เทศบาลลำปางตั้งศูนย์แจกถุงยังชีพช่วงน้ำท่วม ผู้สูงอายุหรือผู้ป่วยต้องได้ก่อน ถุงมีวันละประมาณ 500 ถุง ครอบครัวละ 1 ถุง มีโต๊ะแจก 3 โต๊ะ',
  [['1.1 (4) อธิบายเป็นภาษาธรรมดาว่าปัญหาคืออะไร แยก สิ่งที่เห็น / กลไก / เป้าหมาย','สิ่งที่เห็น: คนรอนานและวุ่นวาย · กลไก: ไม่มีลำดับเรียกที่ชัดเจน ถุงจำกัด คนเปราะบางต้องได้ก่อน · เป้าหมาย: ทุกครอบครัวที่มีสิทธิ์ได้ถุงอย่างเป็นธรรม ไม่ซ้ำ คนเปราะบางได้ก่อน'],
   ['1.2 (8) เขียน Input และ Output ด้วยสัญลักษณ์ พร้อม Constraints และ Edge cases อย่างน้อย 3 ข้อ','ดูตัวอย่างคำตอบ "ศูนย์แจกถุงยังชีพ" ในแท็บส่วน 1'],
   ['1.3 (4) เลือกโครงสร้างสำหรับ (ก) ลำดับการเรียกรับ (ข) ตรวจว่าครอบครัวนี้รับไปแล้วหรือยัง','(ก) คิว FIFO หรือแยก 2 คิว เปราะบาง/ทั่วไป · (ข) เซตแฮชของรหัสครอบครัว ตรวจได้ Θ(1) เฉลี่ย'],
   ['1.4 (6) "ย้ายศูนย์ไปอำเภอข้างเคียงที่น้ำไม่ท่วม" วิจารณ์ด้วย 3E','ทำได้: ย้ายได้จริง · ได้ผล: คนที่ติดน้ำไปไม่ได้ ไม่ตรงจุด · คุ้ม: ค่าขนส่งและเวลาสูงกว่าจัดคิวใหม่ · เป็นการย้ายปัญหา เพราะสาเหตุคือการจัดลำดับ ไม่ใช่สถานที่']]],
 ['ส่วน 2 · แบ่งแยกและเอาชนะ (28 คะแนน)','<b>สถานการณ์:</b> ชั่งน้ำหนักรถขนไก่ 8 คัน [52, 38, 71, 45, 60, 33, 49, 58] ต้องเรียงจากเบาไปหนัก และต้องคูณเลขหลายหลักเพื่อคิดมูลค่า',
  [['2.1 (3) อธิบายว่าแบ่งแยกและเอาชนะช่วยงานนี้อย่างไร กรณีฐานคืออะไร','แบ่งรถเป็นกองเล็กจนเหลือคันเดียว (กรณีฐาน: 1 คันถือว่าเรียงแล้ว) แล้วรวมกองที่เรียงแล้วทีละคู่ การรวมง่ายเพราะดูแค่ตัวหน้าสุด'],
   ['2.2 (8) ไล่ Merge Sort ทุกระดับ นับการเปรียบเทียบ','[38,52][45,71][33,60][49,58] เทียบ 4 → [38,45,52,71][33,49,58,60] เทียบ 6 → [33,38,45,49,52,58,60,71] เทียบ 7 · รวม 17 (เช็กในแท็บส่วน 2 ปุ่ม "ชุด C รถ 8 คัน")'],
   ['2.3 (5) เขียนขั้นตอน Merge เป็นข้อความ ห้ามวาดรูป','ดูกล่อง "Merge Sort แบบเขียนเป็นข้อความ" ในแท็บส่วน 2 (ขั้นที่ 3)'],
   ['2.4 (3) Binary Search หาคันหนัก 50','mid4=49 < 50 → low5 · mid6=58 > 50 → high5 · mid5=52 > 50 → high4 · low > high → ไม่พบ'],
   ['2.5 (7) ไล่ KARATSUBA(123, 45)','n=3 m=2 k=2 · a=1 b=23 c=0 d=45 · P=0 · Q=K(23,45)=1,035 · R=K(24,45)=1,080 · S=45 · M=45×100+1,035=5,535'],
   ['2.6 (2) recurrence ของ Merge Sort และ Karatsuba','Merge: T(n)=2T(n/2)+Θ(n)=Θ(n log n) · Karatsuba: T(n)=3T(n/2)+Θ(n)=Θ(n^1.585)']]],
 ['ส่วน 3 · ปัญหาเส้นทางหนึ่งปัญหา สองโครงสร้าง (24 คะแนน)','<b>สถานการณ์:</b> หน่วยกู้ภัยพาชาวบ้านจากจุดรวมพล S ไปศูนย์พักพิง T ถนนที่ผ่านได้อยู่ในเมทริกซ์ (เลือกตัวอย่าง "ชุด C" ในแท็บส่วน 3) ทุกช่วงถนนใช้เวลาใกล้เคียงกัน',
  [['3.1 (2) ต้องหาอะไร ทำไม "ทุกช่วงใช้เวลาใกล้เคียงกัน" สำคัญ','หาเส้นทางที่ผ่านช่วงถนนน้อยที่สุด เพราะทุกช่วงพอ ๆ กัน ผ่านน้อยช่วง = เร็วสุด จึงใช้ BFS ได้ ถ้าบางช่วงช้ากว่าต้องใช้วิธีแบบมีน้ำหนัก'],
   ['3.2 (4) วาดกราฟ นับ |E| ตรวจ degree','|E| = 8 · degree S2 A2 B3 C3 D2 E3 T1 = 16 = 2×8'],
   ['3.3 (3) เขียน Adjacency List','S→A→B · A→S→C · B→S→C→D · C→A→B→E · D→B→E · E→C→D→T · T→E'],
   ['3.4 (8) ไล่ BFS จาก S และหาเส้นทาง S → T','ลำดับ S A B C D E T · d[T]=4 · ย้อน parent: S–A–C–E–T (เช็กด้วยเครื่องมือส่วน 3)'],
   ['3.5 (7) เทียบ Matrix กับ List สำหรับกราฟนี้ และทั้งจังหวัด 10,000 จุด ถนนเฉลี่ย 3','กราฟนี้ 49 vs 23 ต่างกันน้อย ใช้แบบไหนก็ได้ · ทั้งจังหวัด 10⁸ vs 4×10⁴ → List + 3E (ใช้เครื่องคำนวณด้านล่างแท็บส่วน 3)']]],
 ['ส่วน 4 · ใช้อัตราการเติบโตเลือกวิธี (26 คะแนน)','<b>สถานการณ์:</b> สหกรณ์มีทะเบียนไก่ 1,000,000 ตัว สมมติเครื่องทำได้ 10⁸ ครั้งต่อวินาที',
  [['4.1 (3) อัตราการเติบโตช่วยตัดสินใจอย่างไร','บอกว่าข้อมูลเพิ่มแล้วงานเพิ่มเร็วแค่ไหน วิธีที่ดูพอกันตอนข้อมูลน้อย อาจต่างกันเป็นชั่วโมงเมื่อข้อมูลเป็นล้าน จึงต้องแทนตัวเลขจริง'],
   ['4.2 (8) ตรวจรหัสซ้ำ 3 วิธี แทนตัวเลข เลือก','n² ≈ 5×10¹¹ ≈ 83 นาที · n log n ≈ 2×10⁷ ≈ 0.2 วิ · แฮช 10⁶ ≈ 0.01 วิ (พื้นที่ Θ(n)) · เลือกแฮชถ้าหน่วยความจำพอ เลือกเรียงถ้าต้องใช้บัญชีเรียงต่อ (ดูแท็บส่วน 4)'],
   ['4.3 (8) ค้น k ครั้ง ที่ k = 1, 10, 1,000','k=1: 10⁶ < 2×10⁷ ไม่ต้องเรียง · k=10: 10⁷ < 2×10⁷ · k=1,000: 10⁹ ≫ 2×10⁷ เรียงก่อน · จุดเปลี่ยน k ≈ 20 ≈ log₂n'],
   ['4.4 (4) f(n) = 4n² + 300n + 50','O(n²) ตัดตัวคูณและพจน์เล็ก · มีจุด c บนแกน n ที่ตั้งแต่นั้น g(n) อยู่เหนือ f(n)'],
   ['4.5 (3) T₁=80, p=8, T₈=16','Sp=5 · Ep=0.625 · W=128 > 80 มีงานส่วนเกิน · ไม่แสดงเวลาประสานงาน ประตูทางเดียว ค่าจ้าง']]]];
$('setc').innerHTML=C.map(([t,s,qs])=>`<div class="sheet"><h3>${t}</h3><p>${s}</p>${qs.map(([q,a])=>`<details><summary>${q}</summary>${a}</details>`).join('')}</div>`).join('');

/* ---------- INIT ---------- */
function useData(s){const a=parseList(s);if(a.length<2){$('aMsg').textContent='ใส่ตัวเลขอย่างน้อย 2 ตัว';return}buildMerge(a);buildAnim(a)}
document.querySelectorAll('[data-ms]').forEach(b=>b.onclick=()=>{$('msin').value=b.dataset.ms;useData(b.dataset.ms)});
$('msGo').onclick=()=>useData($('msin').value);
useData($('msin').value);
loadPre('book');gcalc();
matchMedia('(prefers-color-scheme: dark)').addEventListener('change',()=>renderBFS());
const h0=location.hash.slice(1);if(h0&&document.getElementById(h0))go(h0);
