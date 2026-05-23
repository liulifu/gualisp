@echo off
setlocal

if "%BUN_EXE%"=="" set "BUN_EXE=bun"

"%BUN_EXE%" "%~dp0bin\gua.mjs" %*
