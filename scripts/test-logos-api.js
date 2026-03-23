#!/usr/bin/env node

// Test the logos API
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=[""']?(.+?)[""']?\s*$/);
    if (match) process.env[match[1].trim()] = match[2];
  });
}

async function testLogosAPI() {
  console.log('🧪 Testing logos API...\n');
  
  try {
    // Test the API endpoint directly
    const response = await fetch('https://www.f28.com.tr/api/admin/logos', {
      headers: {
        'Cookie': 'admin-token=test' // This will fail auth but we can see the structure
      }
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testLogosAPI().catch(console.error);
