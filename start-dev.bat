@echo off
echo Starting JumpTube Development Environment...
echo.

echo Starting Backend (FastAPI)...
start "Backend" cmd /k "cd Backend && python main.py"

echo Waiting 3 seconds for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend (Vite)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8000
echo Frontend: http://localhost:8080
echo.
echo Press any key to exit...
pause > nul
