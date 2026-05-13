@echo off
REM DevPulse Universal CLI
set DEV_HOME=C:\Users\aksha\Downloads\DevPulse_Complete_Codebase
set TASK_GEN=%DEV_HOME%\scripts\task_generator.py

if "%1"=="" goto :status
if "%1"=="watch" goto :watch
if "%1"=="discover" goto :discover
if "%1"=="list" goto :list
if "%1"=="scan" goto :scan
if "%1"=="status" goto :status
if "%1"=="help" goto :help
goto :status

:watch
python "%TASK_GEN%" --watch "%2"
goto :end

:discover
python "%TASK_GEN%" --discover
goto :end

:list
python "%TASK_GEN%" --list
goto :end

:scan
if "%2"=="" (python "%TASK_GEN%" --once) else (python "%TASK_GEN%" --path "%2" --once)
goto :end

:status
echo DevPulse — AI Runtime Governance Platform
echo ==========================================
python "%TASK_GEN%" --list 2>nul || echo No projects monitored. Run: devpulse watch ^<path^>
echo.
echo Commands: devpulse [watch^|discover^|list^|scan^|status^|help]
goto :end

:help
echo DevPulse — AI Runtime Governance Platform
echo ==========================================
echo   devpulse watch ^<path^>       Add a project to monitor
echo   devpulse discover             Auto-find all git repos on your machine
echo   devpulse list                 Show all monitored projects
echo   devpulse scan [path]          Discover tasks in all/specific project
echo   devpulse status               Show current status
echo   devpulse help                 Show this help
goto :end

:end
