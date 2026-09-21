#!/bin/bash
cd "$(dirname "$0")"
echo "เปิดเว็บติวที่ http://localhost:8232  (ปิดหน้าต่างนี้เพื่อหยุด)"
( sleep 1; open "http://localhost:8232" ) &
python3 -m http.server 8232
