@echo off
setlocal

set "BUN_EXE=D:\Githubresource\yueke\bun\normal\bun-windows-x64\bun.exe"
if not exist "%BUN_EXE%" set "BUN_EXE=bun"

"%BUN_EXE%" "%~dp0bin\gua.mjs" %*
