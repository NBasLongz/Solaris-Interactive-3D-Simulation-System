@echo off
echo ============================================
echo   He Mat Troi 3D - Local Server
echo   Truy cap: http://localhost:8000
echo   Nhan Ctrl+C de dung
echo ============================================
cd /d "%~dp0"
python -m http.server 8000
pause
