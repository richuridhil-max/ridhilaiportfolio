@echo off
title Ridhil Portfolio - Replace Photo
powershell -ExecutionPolicy Bypass -File "%~dp0replace-photo.ps1" -ImagePath "%~1"
pause
