// Zero-dependency dev server for the starter template.
//
//   node examples/starter/server.mjs
//
// Serves the repo (so the demo page can load the built widget) and answers
// Rasa REST channel requests with canned replies for every message type, so
// you can design against real-looking conversations without a Rasa server.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const PORT = Number(process.env.PORT) || 5005;
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.otf': 'font/otf',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
};

const card = n => `http://localhost:${PORT}/examples/starter/assets/card-${n}.svg`;

const replies = {
  quick: id => [
    {
      recipient_id: id,
      text: 'Happy to help. What are you looking for?',
      buttons: [
        { title: 'Pricing', payload: '/pricing' },
        { title: 'Talk to support', payload: '/support' },
        { title: 'Read the docs', payload: '/docs' },
      ],
    },
  ],
  carousel: id => [
    {
      recipient_id: id,
      custom: {
        type: 'carousel',
        elements: [
          { image_url: card(1), text: 'Starter plan\nFor small teams', link: 'https://rasa.com' },
          { image_url: card(2), text: 'Growth plan\nFor scaling support', link: 'https://rasa.com' },
          { image_url: card(3), text: 'Enterprise\nSecurity and SLAs', link: 'https://rasa.com' },
        ],
      },
    },
  ],
  accordion: id => [
    {
      recipient_id: id,
      custom: {
        type: 'accordion',
        elements: [
          { title: 'How do I reset my password?', text: 'Open **Settings**, choose *Security*, then select "Reset password".' },
          { title: 'Where can I see my invoices?', text: 'Invoices live under Billing. You can download each one as a PDF.' },
          { title: 'How do I contact a human?', text: 'Type "agent" and we will connect you during business hours.' },
        ],
      },
    },
  ],
  image: id => [{ recipient_id: id, text: 'Here is your order summary.' }, { recipient_id: id, image: card(1) }],
  file: id => [
    {
      recipient_id: id,
      custom: {
        type: 'file_download',
        text: 'Your invoice is ready.',
        file_url: `http://localhost:${PORT}/examples/starter/README.md`,
        file_name: 'invoice-2026-09.pdf',
      },
    },
  ],
  long: id => [
    {
      recipient_id: id,
      text: 'Here is a longer answer so you can check wrapping, line height and **bold** or *italic* text.\n\nSecond paragraph with a [link](https://rasa.com) and a very-long-unbroken-token-supercalifragilisticexpialidocious-to-test-overflow.',
    },
  ],
};

const respond = (message, id) => {
  const text = String(message || '').toLowerCase();
  const key = Object.keys(replies).find(k => text.includes(k));
  if (key) return replies[key](id);
  if (text.startsWith('/')) return [{ recipient_id: id, text: `You picked ${message}. Try "carousel", "accordion", "image", "file" or "long".` }];
  return [
    { recipient_id: id, text: 'Thanks for your message.' },
    { recipient_id: id, text: 'Try typing "quick", "carousel", "accordion", "image", "file" or "long" to see each message type.' },
  ];
};

createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  if (req.method === 'OPTIONS') return res.writeHead(204).end();

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (req.method === 'POST' && url.pathname === '/webhooks/rest/webhook') {
    let body = '';
    for await (const chunk of req) body += chunk;
    let payload = {};
    try {
      payload = JSON.parse(body);
    } catch {
      // ignore malformed bodies
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify(respond(payload.message, payload.sender)));
  }

  let path = decodeURIComponent(url.pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(ROOT, path));
  if (!file.startsWith(ROOT)) return res.writeHead(403).end();
  try {
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(data);
  } catch {
    res.writeHead(404).end('Not found');
  }
}).listen(PORT, () => {
  console.log(`Starter running at http://localhost:${PORT}/examples/starter/`);
  console.log('Build the widget first: npm run build');
});
