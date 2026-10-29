@echo off
title Diet Coke Interactive Experience Server
echo ========================================================
echo   DIET COKE PREMIUM INTERACTIVE WEBSITE & ADMIN CMS
echo ========================================================
echo Starting server at http://127.0.0.1:8000 ...
echo Public Promotional Experience: http://127.0.0.1:8000/
echo Brand Admin Dashboard:       http://127.0.0.1:8000/admin
echo Admin default credentials:    admin / dietcoke2026!
echo ========================================================
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000
pause
