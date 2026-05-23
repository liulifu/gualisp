@echo off
setlocal

if "%BUN_EXE%"=="" set "BUN_EXE=bun"

"%BUN_EXE%" run build:web
if errorlevel 1 exit /b %errorlevel%

"%BUN_EXE%" src/server.ts
