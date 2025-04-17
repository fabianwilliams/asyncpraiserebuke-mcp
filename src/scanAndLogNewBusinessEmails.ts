import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const payloadsPath = path.resolve('./test/businessesToScan.json');

const payload = JSON.parse(fs.readFileSync(payloadsPath, 'utf-8'));

if (!Array.isArray(payload?.websiteUrls)) {
  console.error('❌ Invalid input: websiteUrls must be an array');
  process.exit(1);
}

const inputJson = JSON.stringify({ websiteUrls: payload.websiteUrls });

console.log('📡 Invoking ClicknContact to discover business emails...');

const result = spawnSync('npx', ['-y', '@fabianwilliams/clickncontact'], {
  input: inputJson,
  encoding: 'utf-8',
  shell: true // Required to properly resolve `npx`
});

if (result.error) {
  console.error('❌ Error invoking ClicknContact:', result.error);
  process.exit(1);
}

if (result.stderr) {
  console.warn('⚠️ Warnings:', result.stderr);
}

try {
  const toolOutput = JSON.parse(result.stdout);
  console.log('✅ Tool Output:', JSON.stringify(toolOutput, null, 2));
} catch (e) {
  console.error('❌ Failed to parse tool output:', e);
  console.error('Raw Output:', result.stdout);
  process.exit(1);
}
