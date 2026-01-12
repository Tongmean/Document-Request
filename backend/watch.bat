@echo off
:loop
nodemon --expose-gc server.js
if %ERRORLEVEL% EQU 0 (
    echo App exited normally. Not restarting.
    exit /b 0
)
echo App crashed with exit code %ERRORLEVEL%. Restarting in 3 seconds...
timeout /t 3
goto loop
