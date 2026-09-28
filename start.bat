@echo off
echo Starting Ridhil Portfolio Local Server...
powershell -ExecutionPolicy Bypass -File "%~dp0serve.ps1" -Port 3001
pause
