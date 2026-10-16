import { appendLeadRow, ensureSheetHeaders } from "./google-sheet";
import { normalizeBelarusPhone, type Interest } from "./phone";
import { sendTelegram } from "./telegram";

const WINDOW_MS = 10 * 60 * 1000;

const interestLabel: Record<Interest, string> = {
  subscription: "Подписка",
  once: "Разовый заказ",
  question: "Вопрос",
};

const failMessage =
  "Не получилось отправить. Проверьте интернет и нажмите ещё раз.";

function isInterest(value: unknown): value is Interest {
  return value === "subscription" || value === "once" || value === "question";
}

function clip(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function minskStamp(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Minsk",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "00";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

function parseStamp(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(
    value.trim(),
  );
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  return Date.parse(`${year}-${month}-${day}T${hour}:${minute}:${second}+03:00`);
}

function recentDuplicate(rows: string[][], phone: string, now: number) {
  for (const row of rows.slice(1)) {
    const savedPhone = normalizeBelarusPhone(row[2] ?? "");
    if (savedPhone !== phone) continue;
    const savedAt = parseStamp(row[0] ?? "");
    if (savedAt !== null && now - savedAt < WINDOW_MS) return true;
  }
  return false;
}

export async function handleLead(request: Request) {
  let body: {
    name?: unknown;
    phone?: unknown;
    interest?: unknown;
    coffee?: unknown;
    comment?: unknown;
    attribution?: {
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
      utmContent?: string;
      yclid?: string;
      page?: string;
      referrer?: string;
    };
  };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return Response.json({ message: failMessage }, { status: 400 });
  }

  const name = clip(body.name, 80);
  const phone = normalizeBelarusPhone(clip(body.phone, 40));
  const coffee = clip(body.coffee, 80);
  const comment = clip(body.comment, 1000);
  const touch = body.attribution ?? {};

  if (name.length < 2) {
    return Response.json(
      { message: "Напишите, как к вам обращаться" },
      { status: 400 },
    );
  }
  if (!phone) {
    return Response.json(
      { message: "Нужен номер Беларуси, например +375 29 123 45 67" },
      { status: 400 },
    );
  }
  if (!isInterest(body.interest)) {
    return Response.json(
      { message: "Выберите, что вас интересует" },
      { status: 400 },
    );
  }

  const stamp = minskStamp();
  const interest = interestLabel[body.interest];
  const source = clip(touch.utmSource, 200);
  const campaign = clip(touch.utmCampaign, 200);
  const page = clip(touch.page, 500);

  try {
    const rows = await ensureSheetHeaders();
    if (recentDuplicate(rows, phone, Date.now())) {
      return Response.json({ duplicate: true });
    }

    await appendLeadRow([
      stamp,
      name,
      phone,
      interest,
      coffee,
      comment,
      source,
      clip(touch.utmMedium, 200),
      campaign,
      clip(touch.utmContent, 200),
      page,
      clip(touch.referrer, 500),
      clip(touch.yclid, 200),
    ]);
  } catch (error) {
    console.error(
      "Не удалось записать заявку:",
      error instanceof Error ? error.message : "неизвестная ошибка",
    );
    return Response.json({ message: failMessage }, { status: 502 });
  }

  const lines = [
    "Новая заявка",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    `Интерес: ${interest}`,
    coffee && `Зерно: ${coffee}`,
    comment && `Комментарий: ${comment}`,
    source && `Источник: ${source}${campaign ? `, ${campaign}` : ""}`,
    page && `Страница: ${page}`,
    `Когда: ${stamp}`,
  ];

  try {
    await sendTelegram(lines.filter(Boolean).join("\n"));
  } catch (error) {
    console.error(
      "Заявка в таблице, но в Telegram не ушла:",
      error instanceof Error ? error.message : "неизвестная ошибка",
    );
  }

  return Response.json({ ok: true });
}
