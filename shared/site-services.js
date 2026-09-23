/* Feedback ในหน้า TutorHub (ส่งผ่าน Formspree) */
(function(){
  const ENDPOINT='https://formspree.io/f/xljdndqa';
  const subject=()=>new URLSearchParams(location.search).get('s')||'';
  // สไตล์ของ .tutor-feedback / .feedback-dialog / ปุ่ม .btn อยู่ใน shared/style.css แล้ว (ธีมเดียวกับทั้งเว็บ)

  function addFeedback(){
    const box=document.createElement('aside');
    box.className='tutor-feedback';
    box.innerHTML='<button class="btn main" id="feedbackOpen" type="button">💬 ส่ง Feedback</button>';
    document.body.appendChild(box);

    const dialog=document.createElement('dialog');
    dialog.className='feedback-dialog';
    dialog.innerHTML=`<form id="feedbackForm" method="dialog">
      <div class="feedback-head"><div><b>ส่ง Feedback ให้ TutorHub</b><p>แจ้งจุดที่ผิด สิ่งที่อ่านยาก หรือฟีเจอร์ที่อยากได้จากหน้านี้ได้เลย</p></div><button class="feedback-close" type="submit" value="cancel" formnovalidate aria-label="ปิด">×</button></div>
      <div class="feedback-fields">
        <label>ประเภท<select name="category" required><option value="เนื้อหาผิด">เนื้อหาผิด / ควรแก้ไข</option><option value="อ่านยาก">อ่านยาก / อยากได้คำอธิบายเพิ่ม</option><option value="เว็บมีปัญหา">เว็บมีปัญหา</option><option value="ข้อเสนอแนะ">ข้อเสนอแนะอื่น</option></select></label>
        <label>ความคิดเห็น<textarea name="message" rows="5" maxlength="2000" required placeholder="บอกหัวข้อหรือจุดที่อยากให้แก้ พร้อมรายละเอียดที่ช่วยตรวจสอบ"></textarea></label>
        <label>หน้านี้มีประโยชน์แค่ไหน<select name="usefulness"><option value="">ไม่ระบุ</option><option value="5">5 · มากที่สุด</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1 · น้อยที่สุด</option></select></label>
        <input type="hidden" name="_subject" value="TutorHub feedback">
        <p class="feedback-privacy">ส่งเฉพาะข้อความ ประเภท คะแนน วิชา และ URL หน้านี้ โดยไม่ขอชื่อหรืออีเมล</p>
      </div>
      <div class="feedback-status" id="feedbackStatus" role="status"></div>
      <div class="feedback-actions" id="feedbackActions"><button class="btn" type="submit" value="cancel" formnovalidate>ยกเลิก</button><button class="btn main" id="feedbackSend" type="submit">ส่งความคิดเห็น</button></div>
    </form>`;
    document.body.appendChild(dialog);

    const form=dialog.querySelector('#feedbackForm');
    const status=dialog.querySelector('#feedbackStatus');
    const send=dialog.querySelector('#feedbackSend');
    const fields=dialog.querySelector('.feedback-fields');
    const actions=dialog.querySelector('#feedbackActions');
    const sendLabel=send.textContent;

    function resetUI(){
      status.innerHTML='';
      fields.hidden=false;
      actions.hidden=false;
      send.disabled=false;
      send.textContent=sendLabel;
    }

    document.getElementById('feedbackOpen').onclick=()=>{
      resetUI();
      dialog.showModal();
      window.tutorTrack?.('feedback_open',{subject:subject()});
    };

    // คลิกพื้นหลัง (backdrop) นอกกล่อง = ปิดโมดัล
    dialog.addEventListener('click',e=>{
      if(e.target===dialog) dialog.close();
    });

    // เมื่อโมดัลปิดหลังส่งสำเร็จ ให้ล้างฟอร์มไว้รอรอบถัดไป
    dialog.addEventListener('close',()=>{
      if(dialog.dataset.sent==='1'){
        dialog.dataset.sent='';
        form.reset();
        resetUI();
      }
    });

    form.onsubmit=async e=>{
      // ปุ่ม "ยกเลิก" และ "×" ใช้ value="cancel" — ปล่อยให้ <dialog method="dialog">
      // ปิดโมดัลด้วยพฤติกรรมมาตรฐานของเบราว์เซอร์ ไม่ต้อง preventDefault
      if(e.submitter && e.submitter.id!=='feedbackSend') return;

      e.preventDefault();
      send.disabled=true;send.textContent='กำลังส่ง…';status.innerHTML='';

      const data=new FormData(form);
      data.set('page_url',location.href);
      const s=subject();
      if(s) data.set('subject',s); else data.delete('subject');

      try{
        const res=await fetch(ENDPOINT,{method:'POST',headers:{'Accept':'application/json'},body:data});
        if(!res.ok) throw new Error('formspree status '+res.status);
        window.tutorTrack?.('feedback_sent',{subject:s||'none',feedback_type:data.get('category'),rating:data.get('usefulness')||'none'});
        fields.hidden=true;
        actions.hidden=true;
        status.innerHTML='<strong>ส่ง Feedback แล้ว ขอบคุณครับ 🙏</strong>';
        dialog.dataset.sent='1';
        setTimeout(()=>dialog.close(),2000);
      }catch(err){
        status.innerHTML='<b>ส่งไม่สำเร็จ:</b> กรุณาตรวจอินเทอร์เน็ตแล้วลองส่งอีกครั้ง';
      }finally{
        send.disabled=false;send.textContent=sendLabel;
      }
    };
  }

  window.tutorTrack=function(name,params){if(window.gtag) gtag('event',name,params||{})};

  addFeedback();
})();
