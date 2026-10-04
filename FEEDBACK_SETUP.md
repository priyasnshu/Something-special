# Feedback + bunny photo setup

The browser code must NOT contain the Telegram bot token. The browser posts the feedback and optional bunny JPEG to the Worker, and the Worker sends it to Telegram with `sendMessage` / `sendPhoto`.

## 1. Pick the public site URL

Example:

`https://yourname.github.io`

Use that exact origin for `ALLOWED_ORIGIN` (no trailing slash and no page path).

## 2. Deploy the Worker

From this folder:

```bash
npx wrangler login
npx wrangler deploy
```

Then set the secrets/variables:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_CHAT_ID
```

Set `ALLOWED_ORIGIN` in the Worker settings to your exact public site origin.

## 3. Get the Telegram chat ID

Open your bot in Telegram and send it `/start`. For a private feedback inbox, use the chat ID of the Telegram account that should receive the feedback. Do not put the bot token in the webpage.

## 4. Connect the webpage

Open `feedback-config.js` and set:

```js
window.FEEDBACK_ENDPOINT = "https://YOUR-WORKER-NAME.workers.dev/";
```

Do not add the bot token here.

## 5. Quick checks

Open the Worker URL in a browser. It should return JSON containing `"code":"health"`.

Then open the page, take a bunny photo, keep `Send my bunny pic with it` checked, write feedback/rating, and press Send. The Worker should receive multipart form data and send the text plus the JPEG to Telegram.

### Why the old version failed

The old frontend defaulted to `/api/feedback`, but a normal GitHub Pages/static site does not run `worker.js` at that path. It therefore had no backend to receive the form or the photo. The Worker also requires a Telegram bot token, a Telegram chat ID, and an allowed site origin. Those are server configuration, not browser code.

The photo checkbox is now explicitly transmitted as `attach_photo=1`, and the Worker verifies the uploaded JPEG/PNG before calling `sendPhoto`.

## Security

The bot token that was pasted into the chat is a credential. Regenerate it with BotFather after setup and keep the replacement token only as a Worker secret. Never commit it to GitHub or put it in `feedback-config.js`.
