"use client";

import { INTEREST_KEY } from "@/lib/attribution";

type OrderInterest = "once" | "subscription";

export function OrderLink({ interest }: { interest?: OrderInterest }) {
  return (
    <a
      className="order-button"
      href="#order"
      onClick={(event) => {
        if (interest) {
          sessionStorage.setItem(INTEREST_KEY, interest);
          window.dispatchEvent(
            new CustomEvent("kvarta-interest", { detail: interest }),
          );
        }

        const form = document.getElementById("order");
        const name = document.getElementById("name");
        if (!form || !name) return;

        event.preventDefault();
        const reduce = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        form.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
        name.focus({ preventScroll: true });
      }}
    >
      Заказать
    </a>
  );
}
