import { createSign } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const SHEET_ID = "1qEQI52HxoSsjbL_exUppC2GjF8LKTsTk4o99LlkpA_o";
const SHEET_NAME = "Лист1";
const SCOPE = "https://www.googleapis.com/auth/spreadsheets";

export const SHEET_HEADERS = [
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
] as const;

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

type ValueRange = {
  values?: string[][];
};

let tokenCache: { token: string; exp: number } | null = null;

function loadAccount(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    ? process.env.GOOGLE_SERVICE_ACCOUNT_JSON
    : readFileSync(
        path.join(process.cwd(), "secrets", "google-service-account.json"),
        "utf8",
      );
  const parsed = JSON.parse(raw) as Partial<ServiceAccount>;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("В ключе сервисного аккаунта нет почты или закрытого ключа.");
  }
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key,
  };
}

function base64url(value: string) {
  return Buffer.from(value).toString("base64url");
}

async function accessToken() {
  const now = Math.floor(Date.now() / 1000);
  if (tokenCache && tokenCache.exp > now + 60) return tokenCache.token;

  const account = loadAccount();
  const header = base64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64url(
    JSON.stringify({
      iss: account.client_email,
      scope: SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${payload}`;
  const sign = createSign("RSA-SHA256");
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

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google не выдал доступ к таблице.");
  }

  tokenCache = { token: data.access_token, exp: now + 3600 };
  return data.access_token;
}

function rangeUrl(range: string, suffix = "") {
  return `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}${suffix}`;
}

async function sheetsFetch(url: string, init?: RequestInit) {
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

export async function readLeadRows() {
  const response = await sheetsFetch(rangeUrl(`${SHEET_NAME}!A:M`));
  const data = (await response.json()) as ValueRange;
  return data.values ?? [];
}

export async function ensureSheetHeaders() {
  const rows = await readLeadRows();
  const header = rows[0] ?? [];
  const same = SHEET_HEADERS.every((title, index) => header[index] === title);
  if (same && header.length >= SHEET_HEADERS.length) return rows;

  await sheetsFetch(
    rangeUrl(
      `${SHEET_NAME}!A1:M1`,
      "?valueInputOption=RAW",
    ),
    {
      method: "PUT",
      body: JSON.stringify({
        range: `${SHEET_NAME}!A1:M1`,
        majorDimension: "ROWS",
        values: [Array.from(SHEET_HEADERS)],
      }),
    },
  );

  return readLeadRows();
}

export async function appendLeadRow(row: string[]) {
  await sheetsFetch(
    rangeUrl(
      `${SHEET_NAME}!A:M`,
      ":append?valueInputOption=RAW&insertDataOption=INSERT_ROWS",
    ),
    {
      method: "POST",
      body: JSON.stringify({ values: [row] }),
    },
  );
}
