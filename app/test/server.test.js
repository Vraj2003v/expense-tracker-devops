const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('../server');

function request(server, method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      { hostname: '127.0.0.1', port: server.address().port, path, method,
        headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {} },
      res => {
        let chunks = '';
        res.on('data', c => (chunks += c));
        res.on('end', () => resolve({ status: res.statusCode, body: chunks ? JSON.parse(chunks) : null }));
      }
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

test('healthz returns ok', async () => {
  const server = app.listen(0);
  const res = await request(server, 'GET', '/healthz');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.body.status, 'ok');
  server.close();
});

test('can create and fetch an expense', async () => {
  const server = app.listen(0);
  const created = await request(server, 'POST', '/api/expenses', { title: 'Coffee', amount: 4.5 });
  assert.strictEqual(created.status, 201);
  const fetched = await request(server, 'GET', `/api/expenses/${created.body.id}`);
  assert.strictEqual(fetched.body.title, 'Coffee');
  server.close();
});
