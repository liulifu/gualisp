@echo off
setlocal

set "BUN_EXE=D:\Githubresource\yueke\bun\normal\bun-windows-x64\bun.exe"
if not exist "%BUN_EXE%" set "BUN_EXE=bun"

"%BUN_EXE%" run build:web
if errorlevel 1 exit /b %errorlevel%

"%BUN_EXE%" src/server.ts
