"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phoneHint = void 0;
exports.normalizeBelarusPhone = normalizeBelarusPhone;
exports.formatBelarusPhone = formatBelarusPhone;
const NATIONAL_LENGTH = 9;
function normalizeBelarusPhone(input) {
    const digits = input.replace(/\D/g, "");
    let national = "";
    if (digits.startsWith("375") && digits.length === 12) {
        national = digits.slice(3);
    }
    else if (digits.startsWith("80") && digits.length === 11) {
        national = digits.slice(2);
    }
    else if (digits.startsWith("0") && digits.length === 10) {
        national = digits.slice(1);
    }
    else if (digits.length === NATIONAL_LENGTH) {
        national = digits;
    }
    else {
        return null;
    }
    if (!/^[1-9]\d{8}$/.test(national))
        return null;
    return `+375${national}`;
}
function formatBelarusPhone(e164) {
    const national = e164.slice(4);
    return `+375 ${national.slice(0, 2)} ${national.slice(2, 5)} ${national.slice(5, 7)} ${national.slice(7)}`;
}
exports.phoneHint = "Нужен номер Беларуси, например +375 29 123 45 67";
