import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

type TelegramConfig = {
  botToken: string;
  chatId: string;
};

function loadConfig(): TelegramConfig | null {
  if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
    return {
      botToken: process.env.TELEGRAM_BOT_TOKEN,
      chatId: process.env.TELEGRAM_CHAT_ID,
    };
  }

  const file = path.join(process.cwd(), "secrets", "telegram.json");
  if (!existsSync(file)) return null;

  const parsed = JSON.parse(readFileSync(file, "utf8")) as {
    botToken?: unknown;
    chatId?: unknown;
  };
  if (typeof parsed.botToken !== "string" || !parsed.botToken) return null;
  if (typeof parsed.chatId !== "string" && typeof parsed.chatId !== "number") {
    return null;
  }
  return { botToken: parsed.botToken, chatId: String(parsed.chatId) };
}

export async function sendTelegram(text: string) {
  const config = loadConfig();
  if (!config) return;

  const response = await fetch(
    `https://api.telegram.org/bot${config.botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: config.chatId,
        text,
        link_preview_options: { is_disabled: true },
      }),
      signal: AbortSignal.timeout(5000),
    },
  );

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Telegram ответил ${response.status}: ${detail.slice(0, 200)}`);
  }
}
