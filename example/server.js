const express = require('express');
const { requestLogger } = require('../dist/index');

const app = express();
app.use(express.json());

// --- Example 1: Zero config - just works with essentials ---
app.use(requestLogger());

// --- Example 2: Add IP, user agent, route pattern, and handler name ---
// app.use(requestLogger({
//   fields: ['method', 'url', 'route', 'handler', 'status', 'duration',
//            'timestamp', 'ip', 'userAgent'],
// }));

// --- Example 3: Full debug mode - log everything (with safe redaction) ---
// app.use(requestLogger({
//   fields: ['method', 'url', 'route', 'handler', 'status', 'duration',
//            'timestamp', 'ip', 'userAgent', 'headers', 'body',
//            'query', 'params', 'contentLength', 'requestId'],
//   format: 'json',
//   transports: ['console', 'file'],
//   filePath: 'logs/debug.log',
// }));

// --- Example 4: Production - JSON + file, skip health checks ---
// app.use(requestLogger({
//   fields: ['method', 'url', 'status', 'duration', 'timestamp', 'ip', 'requestId'],
//   format: 'json',
//   transports: ['file'],
//   filePath: 'logs/production.log',
//   skip: (req) => req.url === '/health',
// }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/users', function listUsers(req, res) {
  res.json([{ name: 'Alice' }, { name: 'Bob' }]);
});

app.post('/users', function createUser(req, res) {
  res.status(201).json({ created: true, data: req.body });
});

app.get('/error', function triggerError(req, res) {
  res.status(500).send('Something broke!');
});

app.listen(3000, () => {
  console.log('Test server running on http://localhost:3000');
});
