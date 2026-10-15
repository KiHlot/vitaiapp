"use client";

import { INTEREST_KEY } from "@/lib/attribution";
import { scrollOrderFormIntoView } from "@/lib/scroll-order-form";
import type { ReactNode } from "react";

type OrderInterest = "once" | "subscription";

export function OrderLink({
  interest,
  label = "Заказать",
}: {
  interest?: OrderInterest;
  label?: ReactNode;
}) {
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

        const name = document.getElementById("name");
        if (!name) return;

        event.preventDefault();
        scrollOrderFormIntoView();
        name.focus({ preventScroll: true });
      }}
    >
      <span className="order-button-label">{label}</span>
    </a>
  );
}
