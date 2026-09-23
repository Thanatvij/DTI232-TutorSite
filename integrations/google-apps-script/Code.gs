/* วางไฟล์นี้ใน Apps Script ที่ผูกกับ Google Sheet แล้ว Deploy เป็น Web app
   Execute as: Me · Who has access: Anyone */
const SHEET_NAME = 'Feedback';
function doPost(e) {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = book.getSheetByName(SHEET_NAME) || book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['เวลา', 'วิชา', 'แท็บ', 'ประเภท', 'คะแนน', 'ความคิดเห็น', 'หน้าเว็บ']);
    sheet.setFrozenRows(1);
  }
  const p = (e && e.parameter) || {};
  sheet.appendRow([new Date(), clean_(p.subject,80), clean_(p.section,80), clean_(p.type,80), clean_(p.rating,10), clean_(p.message,2000), clean_(p.page,500)]);
  return ContentService.createTextOutput('ok');
}
function clean_(value, limit) {
  const text = String(value || '').slice(0, limit);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
