export type Interest = "subscription" | "once" | "question";

const NATIONAL_LENGTH = 9;

export function normalizeBelarusPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  let national = "";

  if (digits.startsWith("375") && digits.length === 12) {
    national = digits.slice(3);
  } else if (digits.startsWith("80") && digits.length === 11) {
    national = digits.slice(2);
  } else if (digits.startsWith("0") && digits.length === 10) {
    national = digits.slice(1);
  } else if (digits.length === NATIONAL_LENGTH) {
    national = digits;
  } else {
    return null;
  }

  if (!/^[1-9]\d{8}$/.test(national)) return null;
  return `+375${national}`;
}

export function formatBelarusPhone(e164: string): string {
  const national = e164.slice(4);
  return `+375 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5, 7)} ${national.slice(7)}`;
}

export const phoneHint =
  "Нужен номер Беларуси, например +375 29 123 45 67";
