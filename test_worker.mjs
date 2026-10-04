import assert from 'node:assert/strict';
import { handleFeedback } from '../worker.js';

const originalFetch = globalThis.fetch;
const calls = [];
globalThis.fetch = async (url, init) => {
  calls.push({ url, init });
  return new Response(JSON.stringify({ ok: true, result: { message_id: 1 } }), { status: 200, headers: { 'content-type': 'application/json' } });
};

const env = {
  TELEGRAM_BOT_TOKEN: 'TEST_TOKEN',
  TELEGRAM_CHAT_ID: '123456',
  ALLOWED_ORIGIN: 'https://example.github.io'
};

try {
  const textFd = new FormData();
  textFd.append('rating', '5');
  textFd.append('feedback', 'great');
  textFd.append('attach_photo', '0');
  const textReq = new Request('https://worker.test/', {
    method: 'POST',
    headers: { Origin: env.ALLOWED_ORIGIN },
    body: textFd
  });
  const textRes = await handleFeedback(textReq, env);
  assert.equal(textRes.status, 200);
  const textJson = await textRes.json();
  assert.equal(textJson.code, 'sent');
  assert.match(calls[0].url, /sendMessage$/);

  const photoFd = new FormData();
  photoFd.append('rating', '4');
  photoFd.append('feedback', 'cute');
  photoFd.append('attach_photo', '1');
  photoFd.append('photo', new Blob(['jpeg-bytes'], { type: 'image/jpeg' }), 'bunny-pic.jpg');
  const photoReq = new Request('https://worker.test/', {
    method: 'POST',
    headers: { Origin: env.ALLOWED_ORIGIN },
    body: photoFd
  });
  const photoRes = await handleFeedback(photoReq, env);
  assert.equal(photoRes.status, 200);
  const photoJson = await photoRes.json();
  assert.equal(photoJson.code, 'sent');
  assert.match(calls[1].url, /sendPhoto$/);

  const badReq = new Request('https://worker.test/', {
    method: 'POST',
    headers: { Origin: 'https://not-allowed.example' },
    body: textFd
  });
  const badRes = await handleFeedback(badReq, env);
  assert.equal(badRes.status, 403);

  const healthReq = new Request('https://worker.test/', { method: 'GET' });
  const healthRes = await handleFeedback(healthReq, env);
  assert.equal(healthRes.status, 200);
  const healthJson = await healthRes.json();
  assert.equal(healthJson.code, 'health');
  assert.equal(healthJson.configured, true);

  console.log('worker tests passed: sendMessage, sendPhoto, CORS rejection, health');
} finally {
  globalThis.fetch = originalFetch;
}
