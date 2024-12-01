@echo off
REM Start the server with CORS enabled in the background
start /B http-server --cors

REM Loop to check if the server is up before trying to open the page
set "serverUp="
for /L %%i in (1,1,10) do (
    >nul 2>&1 (
        powershell -command "(Invoke-WebRequest -Uri http://127.0.0.1:8080 -UseBasicParsing).StatusCode" || set "serverUp="
        if not errorlevel 1 set "serverUp=1"
    )
    if defined serverUp goto :OPENPAGE
    timeout /t 1 >nul
)

:OPENPAGE
REM Define the URL
set "url=http://127.0.0.1:8080/index.html"

REM Try to open in Google Chrome first
REM Adjust the path if Chrome is installed in a different location
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    "C:\Program Files\Google\Chrome\Application\chrome.exe" %url%
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" %url%
) else (
    REM If Chrome is not found, open in Microsoft Edge
    start msedge %url%
)