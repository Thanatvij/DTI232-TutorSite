@echo off
cd /d "%~dp0"
echo เปิดเว็บติวที่ http://localhost:8232  (ปิดหน้าต่างนี้เพื่อหยุด)
start "" http://localhost:8232
python -m http.server 8232
