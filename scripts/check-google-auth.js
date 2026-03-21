#!/usr/bin/env node

/**
 * Google OAuth Configuration Checker
 * Run this script to verify your Google OAuth setup
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Checking Google OAuth Configuration...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env file not found!');
  console.log('   Create a .env file in the project root');
  process.exit(1);
}

// Read .env file
const envContent = fs.readFileSync(envPath, 'utf8');
const lines = envContent.split('\n');

// Parse environment variables
const env = {};
lines.forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    env[key] = valueParts.join('=');
  }
});

// Check Google Client ID
const clientId = env.REACT_APP_GOOGLE_CLIENT_ID;

if (!clientId) {
  console.log('❌ REACT_APP_GOOGLE_CLIENT_ID not found in .env');
  console.log('   Add this line to your .env file:');
  console.log('   REACT_APP_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com');
  process.exit(1);
}

if (clientId === 'your-google-client-id.apps.googleusercontent.com') {
  console.log('⚠️  Google Client ID is still the placeholder value');
  console.log('   Follow these steps:');
  console.log('   1. Go to https://console.cloud.google.com/');
  console.log('   2. Create a new project or select existing one');
  console.log('   3. Go to APIs & Services > Credentials');
  console.log('   4. Create OAuth 2.0 Client ID');
  console.log('   5. Copy the Client ID and update .env file');
  console.log('\n   See GOOGLE_LOGIN_SETUP.md for detailed instructions');
  process.exit(1);
}

// Validate Client ID format
if (!clientId.endsWith('.apps.googleusercontent.com')) {
  console.log('⚠️  Client ID format looks incorrect');
  console.log('   Expected format: 123456789-abc123.apps.googleusercontent.com');
  console.log('   Your value: ' + clientId);
  console.log('\n   Make sure you copied the Client ID correctly from Google Cloud Console');
}

// Check if Client ID looks valid
const clientIdPattern = /^[0-9]+-[a-z0-9]+\.apps\.googleusercontent\.com$/;
if (clientIdPattern.test(clientId)) {
  console.log('✅ Google Client ID format is valid');
  console.log('   Client ID: ' + clientId.substring(0, 20) + '...');
} else {
  console.log('⚠️  Client ID format might be incorrect');
  console.log('   Expected: numbers-letters.apps.googleusercontent.com');
  console.log('   Got: ' + clientId);
}

// Check package.json for required dependency
const packageJsonPath = path.join(__dirname, '..', 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const hasOAuthPackage = packageJson.dependencies && packageJson.dependencies['@react-oauth/google'];
  
  if (hasOAuthPackage) {
    console.log('✅ @react-oauth/google package is installed');
  } else {
    console.log('❌ @react-oauth/google package not found');
    console.log('   Run: npm install @react-oauth/google');
    process.exit(1);
  }
}

// Final instructions
console.log('\n📋 Next Steps:');
console.log('   1. Make sure you configured OAuth consent screen in Google Cloud Console');
console.log('   2. Add authorized JavaScript origins: http://localhost:3000');
console.log('   3. Add authorized redirect URIs: http://localhost:3000');
console.log('   4. Restart your development server: npm start');
console.log('   5. Test the login at http://localhost:3000');
console.log('\n   For detailed setup instructions, see: GOOGLE_LOGIN_SETUP.md\n');

process.exit(0);
