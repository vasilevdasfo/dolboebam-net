# VDAI Mediator Telegram bot

Вебхук уже лежит в `api/telegram-webhook.js`.

Чтобы включить живой Telegram-бот:

- создать отдельного бота в BotFather;
- добавить в Vercel env `TELEGRAM_BOT_TOKEN`;
- добавить в Vercel env `DIMA_CHAT_ID`;
- поставить webhook:

```bash
curl "https://api.telegram.org/bot$TELEGRAM_BOT_TOKEN/setWebhook?url=https://dolboebam.net/api/telegram-webhook"
```

Не используем личный `DEMI_BOT_TOKEN`, чтобы не ломать действующий inbox/voice-бот Дмитрия.
