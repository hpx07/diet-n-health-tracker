@echo off
echo ========================================
echo Checking for Errors in Logcat
echo ========================================
echo.
echo Press Ctrl+C to stop
echo.
adb logcat *:E | findstr /i "diet tracker error exception fatal"
