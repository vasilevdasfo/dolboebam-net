const TELEGRAM_API = "https://api.telegram.org/bot";

function clean(value) {
  return String(value || "").trim().slice(0, 3500);
}

async function sendMessage(token, chatId, text) {
  const response = await fetch(`${TELEGRAM_API}${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true
    })
  });
  return response.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(200).json({ ok: true, service: "dolboebam-mediator-bot" });
    return;
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerChatId = process.env.DIMA_CHAT_ID;
  if (!token || !ownerChatId) {
    res.status(200).json({ ok: true, configured: false });
    return;
  }

  const update = req.body || {};
  const message = update.message || update.edited_message;
  if (!message || !message.chat) {
    res.status(200).json({ ok: true });
    return;
  }

  const chatId = message.chat.id;
  const text = clean(message.text);
  const name = clean([message.from?.first_name, message.from?.username && `@${message.from.username}`].filter(Boolean).join(" "));

  if (text.startsWith("/start")) {
    await sendMessage(token, chatId, [
      "VDAI Mediator.",
      "",
      "Опишите ситуацию: кто участвует, что обещали, где конфликт, какой результат нужен.",
      "Я помогу собрать это в нейтральный текст, правила взаимодействия или запрос к медиатору."
    ].join("\n"));
    res.status(200).json({ ok: true });
    return;
  }

  await sendMessage(token, ownerChatId, [
    "Новый запрос VDAI Mediator",
    "",
    `От: ${name || chatId}`,
    `Chat ID: ${chatId}`,
    "",
    text || "[без текста]"
  ].join("\n"));

  await sendMessage(token, chatId, [
    "Принял ситуацию.",
    "",
    "Следующий шаг: отделю факты от эмоций и соберу нейтральный вариант ответа/правил. Если есть документы, суммы, сроки или скрины, пришлите следующим сообщением."
  ].join("\n"));

  res.status(200).json({ ok: true });
}
