export type Attribution = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  utmTerm: string;
  yclid: string;
  page: string;
  referrer: string;
};

const TOUCH_KEY = "kvarta-touch";
export const INTEREST_KEY = "kvarta-interest";

export function captureTouch() {
  if (sessionStorage.getItem(TOUCH_KEY)) return;

  const params = new URLSearchParams(window.location.search);
  const touch: Attribution = {
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
    utmTerm: params.get("utm_term") ?? "",
    yclid: params.get("yclid") ?? "",
    page: window.location.href,
    referrer: document.referrer,
  };

  sessionStorage.setItem(TOUCH_KEY, JSON.stringify(touch));
}

export function readTouch(): Attribution {
  const raw = sessionStorage.getItem(TOUCH_KEY);
  if (!raw) {
    captureTouch();
  }

  const stored = sessionStorage.getItem(TOUCH_KEY);
  if (!stored) {
    return {
      utmSource: "",
      utmMedium: "",
      utmCampaign: "",
      utmContent: "",
      utmTerm: "",
      yclid: "",
      page: window.location.href,
      referrer: document.referrer,
    };
  }

  return JSON.parse(stored) as Attribution;
}
