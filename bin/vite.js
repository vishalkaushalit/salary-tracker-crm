#!/usr/bin/env node
const { spawnSync } = require('child_process');
const path = require('path');

console.log('🚀 [Vercel Vite Runner] Starting frontend build...');
const rootDir = path.resolve(__dirname, '..');
const frontendDir = path.join(rootDir, 'frontend');

// 1. Install frontend dependencies
console.log('📦 Installing frontend dependencies...');
const installRes = spawnSync('npm', ['install', '--legacy-peer-deps'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

if (installRes.status !== 0) {
  console.error('❌ Frontend install failed');
  process.exit(installRes.status || 1);
}

// 2. Run Vite build in frontend
console.log('⚡ Running vite build...');
const buildRes = spawnSync('npm', ['run', 'build'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true
});

if (buildRes.status !== 0) {
  console.error('❌ Vite build failed');
  process.exit(buildRes.status || 1);
}

// 3. Mirror frontend/dist to root dist
const fs = require('fs');
const srcDist = path.join(frontendDir, 'dist');
const targetDist = path.join(rootDir, 'dist');

try {
  if (fs.existsSync(srcDist)) {
    fs.cpSync(srcDist, targetDist, { recursive: true });
    console.log('✅ Dist mirrored to root /dist');
  }
} catch (err) {
  console.warn('⚠️ Dist copy warning:', err.message);
}

console.log('🎉 [Vercel Vite Runner] Build completed successfully!');
process.exit(0);
