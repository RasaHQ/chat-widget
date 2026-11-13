# Chat widget starter

A copy-and-customize starting point. It includes a demo host page with a live
customization panel, a brand stylesheet, and a mock Rasa server that returns every
message type, so you can design the widget without a running bot.

## Run it

```bash
npm install
npm run build
node examples/starter/server.mjs
```

Open http://localhost:5005/examples/starter/. Open the chat and try `quick`, `carousel`,
`accordion`, `image`, `file` or `long`. Set `PORT` to use another port.

## Make it yours

1. Copy this folder into your project.
2. Point the `<script>` and `<link>` tags in `index.html` at the published package:

   ```html
   <script type="module" src="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwidget/rasa-chatwidget.esm.js"></script>
   <link rel="stylesheet" href="https://unpkg.com/@rasahq/chat-widget-ui/dist/rasa-chatwidget/rasa-chatwidget.css" />
   ```

3. Set `server-url` to your Rasa server.
4. Edit `brand.css`, or pick values in the panel and copy the embed code it generates.

## Themes

Set `theme` on the element. Every theme derives bubbles, header, inputs and buttons from a few
brand colors.

| Value | Look |
| --- | --- |
| `light` | Default. Uses `--color-primary` and `--color-secondary` from your CSS. |
| `dark` | Charcoal surface, soft blue accent. |
| `auto` | `light` or `dark`, following the visitor's OS setting. |
| `midnight` | Deep indigo surface with a violet gradient header. |
| `ocean` | Teal gradient header on a light surface. |
| `forest` | Green accent on a light surface. |
| `sunset` | Orange to rose gradient header on a warm surface. |
| `mono` | Black and white. |

To change the brand color of a non-light theme, set it on the element:

```css
rasa-chatbot-widget {
  --color-primary: #e8590c;
}
```

To add your own theme, copy an entry in the `$themes` map in
`packages/ui/src/rasa-chatbot-widget/rasa-chatbot-widget.scss`, give it a name, and add the name
to `WidgetTheme` in `packages/ui/src/utils/widget-theme.ts`.

## Layout and utility props

| Attribute | Default | What it does |
| --- | --- | --- |
| `theme` | `light` | Color theme, see above. |
| `position` | `bottom-right` | `bottom-right` or `bottom-left`. |
| `launcher-label` | none | Text next to the launcher icon. Icon-only when empty. |
| `widget-subtitle` | none | Line under the title. Shows connection status when empty. |
| `connected-text`, `disconnected-text` | `Online`, `Connecting…` | Status wording. |
| `welcome-message` | none | Intro text at the top of an empty conversation. |
| `suggested-prompts` | none | Chips that send a message on tap, hidden after the first user message. Accepts a JSON array or comma separated text. |
| `hide-close-button` | `false` | Removes the close button from the header. |
| `toggle-full-screen` | `false` | Adds a full screen button. |
| `bot-icon`, `widget-icon` | none | Custom avatar and launcher image. |

The full prop and event list is in [`packages/ui/src/rasa-chatbot-widget/readme.md`](../../packages/ui/src/rasa-chatbot-widget/readme.md).

## Tokens

All tokens are CSS custom properties. `brand.css` lists the common ones.

- **Color**: `--color-primary`, `--color-secondary`, `--color-secondary-opposite`, `--color-danger`, plus
  granular tokens such as `--message-user-background-color` and `--header-background-color`
  (a gradient is fine).
- **Shape**: `--radius-messenger`, `--radius-bubble`, `--radius-bubble-tail`, `--radius-control`, `--radius-launcher`.
- **Size**: `--launcher-size`, `--messenger-width`, `--messenger-height`, `--widget-offset-x`, `--widget-offset-y`,
  `--avatar-size`, `--message-gap`.
- **Elevation and motion**: `--shadow-messenger`, `--shadow-launcher`, `--shadow-bubble`, `--motion-duration`.

Animations respect `prefers-reduced-motion`.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Demo host page and live customization panel. |
| `brand.css` | Your brand tokens. |
| `server.mjs` | Static server plus mock Rasa REST endpoint. |
| `assets/` | Placeholder images used by the mock replies. |
