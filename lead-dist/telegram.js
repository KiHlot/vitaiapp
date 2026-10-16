"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTelegram = sendTelegram;
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
function loadConfig() {
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID) {
        return {
            botToken: process.env.TELEGRAM_BOT_TOKEN,
            chatId: process.env.TELEGRAM_CHAT_ID,
        };
    }
    const file = node_path_1.default.join(process.cwd(), "secrets", "telegram.json");
    if (!(0, node_fs_1.existsSync)(file))
        return null;
    const parsed = JSON.parse((0, node_fs_1.readFileSync)(file, "utf8"));
    if (typeof parsed.botToken !== "string" || !parsed.botToken)
        return null;
    if (typeof parsed.chatId !== "string" && typeof parsed.chatId !== "number") {
        return null;
    }
    return { botToken: parsed.botToken, chatId: String(parsed.chatId) };
}
async function sendTelegram(text) {
    const config = loadConfig();
    if (!config)
        return;
    const response = await fetch(`https://api.telegram.org/bot${config.botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: config.chatId,
            text,
            link_preview_options: { is_disabled: true },
        }),
        signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Telegram ответил ${response.status}: ${detail.slice(0, 200)}`);
    }
}
