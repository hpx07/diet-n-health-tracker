@echo off
echo ========================================
echo Diet-N-Health Tracker - APK Builder
echo ========================================
echo.

echo Step 1: Building React app...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b %errorlevel%
)
echo ✓ Build complete!
echo.

echo Step 2: Syncing with Android...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ERROR: Sync failed!
    pause
    exit /b %errorlevel%
)
echo ✓ Sync complete!
echo.

echo Step 3: Opening Android Studio...
call npx cap open android
echo.

echo ========================================
echo Next Steps in Android Studio:
echo 1. Wait for Gradle sync to complete
echo 2. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
echo 3. Wait for build to complete
echo 4. Click 'locate' to find your APK
echo ========================================
echo.
pause
