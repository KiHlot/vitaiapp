"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SHEET_HEADERS = void 0;
exports.readLeadRows = readLeadRows;
exports.ensureSheetHeaders = ensureSheetHeaders;
exports.appendLeadRow = appendLeadRow;
const node_crypto_1 = require("node:crypto");
const node_fs_1 = require("node:fs");
const node_path_1 = __importDefault(require("node:path"));
const SHEET_ID = "1qEQI52HxoSsjbL_exUppC2GjF8LKTsTk4o99LlkpA_o";
const SHEET_NAME = "Лист1";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
exports.SHEET_HEADERS = [
    "Когда",
    "Имя",
    "Телефон",
    "Интерес",
    "Зерно",
    "Комментарий",
    "Источник",
    "Канал",
    "Кампания",
    "Объявление",
    "Страница",
    "Откуда пришёл",
    "yclid",
];
let tokenCache = null;
function loadAccount() {
    const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
        ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON
        : (0, node_fs_1.readFileSync)(node_path_1.default.join(process.cwd(), "secrets", "google-service-account.json"), "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) {
        throw new Error("В ключе сервисного аккаунта нет почты или закрытого ключа.");
    }
    return {
        client_email: parsed.client_email,
        private_key: parsed.private_key,
    };
}
function base64url(value) {
    return Buffer.from(value).toString("base64url");
}
async function accessToken() {
    const now = Math.floor(Date.now() / 1000);
    if (tokenCache && tokenCache.exp > now + 60)
        return tokenCache.token;
    const account = loadAccount();
    const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
    const payload = base64url(JSON.stringify({
        iss: account.client_email,
        scope: SCOPE,
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
    }));
    const unsigned = `${header}.${payload}`;
    const sign = (0, node_crypto_1.createSign)("RSA-SHA256");
    sign.update(unsigned);
    const assertion = `${unsigned}.${sign.sign(account.private_key, "base64url")}`;
    const response = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion,
        }),
    });
    if (!response.ok) {
        throw new Error(`Google не принял ключ (${response.status}).`);
    }
    const data = (await response.json());
    if (!data.access_token) {
        throw new Error("Google не выдал доступ к таблице.");
    }
    tokenCache = { token: data.access_token, exp: now + 3600 };
    return data.access_token;
}
function rangeUrl(range, suffix = "") {
    return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}${suffix}`;
}
async function sheetsFetch(url, init) {
    const token = await accessToken();
    const response = await fetch(url, {
        ...init,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });
    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Таблица ответила ${response.status}: ${detail.slice(0, 300)}`);
    }
    return response;
}
async function readLeadRows() {
    const response = await sheetsFetch(rangeUrl(`${SHEET_NAME}!A:M`));
    const data = (await response.json());
    return data.values ?? [];
}
async function ensureSheetHeaders() {
    const rows = await readLeadRows();
    const header = rows[0] ?? [];
    const same = exports.SHEET_HEADERS.every((title, index) => header[index] === title);
    if (same && header.length >= exports.SHEET_HEADERS.length)
        return rows;
    await sheetsFetch(rangeUrl(`${SHEET_NAME}!A1:M1`, "?valueInputOption=RAW"), {
        method: "PUT",
        body: JSON.stringify({
            range: `${SHEET_NAME}!A1:M1`,
            majorDimension: "ROWS",
            values: [Array.from(exports.SHEET_HEADERS)],
        }),
    });
    return readLeadRows();
}
async function appendLeadRow(row) {
    await sheetsFetch(rangeUrl(`${SHEET_NAME}!A:M`, ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS"), {
        method: "POST",
        body: JSON.stringify({ values: [row] }),
    });
}
