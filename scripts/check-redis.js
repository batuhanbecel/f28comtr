#!/usr/bin/env node

// Check what's stored in Redis
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

async function checkRedis() {
  console.log('🔍 Checking Redis contents...\n');
  
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
      const value = await redis.get(key);
      console.log(`${key}:`);
      if (value) {
        if (Array.isArray(value)) {
          console.log(`  ${value.length} items`);
          value.slice(0, 3).forEach((item, i) => {
            console.log(`    [${i}] ${item}`);
          });
          if (value.length > 3) {
            console.log(`    ... and ${value.length - 3} more`);
          }
        } else {
          console.log(`  ${typeof value}: ${JSON.stringify(value).substring(0, 100)}...`);
        }
      } else {
        console.log('  (empty)');
      }
      console.log('');
    } catch (error) {
      console.log(`  ERROR: ${error.message}\n`);
    }
  }
}

checkRedis().catch(console.error);
