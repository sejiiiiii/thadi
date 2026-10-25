@echo off
title Thadi - Personal Bulking App
cd /d "%~dp0"
set PATH=C:\Users\USER\AppData\Local\nodejs;%PATH%
echo Starting Thadi Application...
npm run dev
pause
