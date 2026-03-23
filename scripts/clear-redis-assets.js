#!/usr/bin/env node

// Clear asset keys from Redis
const fs = require('fs');
const path = require('path');
const { Redis } = require('@upstash/redis');

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=[""']?(.+?)[""']?\s*$/);
    if (match) process.env[match[1].trim()] = match[2];
  });
}

async function clearAssets() {
  console.log('🧹 Clearing asset keys from Redis...\n');
  
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  
  const keys = [
    'site:preview',
    'site:landing', 
    'site:logos:clients',
    'site:logos:partners',
    'site:logos:f28',
    'site:logos:social'
  ];
  
  for (const key of keys) {
    try {
      await redis.del(key);
      console.log(`✓ Cleared ${key}`);
    } catch (error) {
      console.log(`✗ Failed to clear ${key}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Asset keys cleared. Ready for re-migration.');
}

clearAssets().catch(console.error);
