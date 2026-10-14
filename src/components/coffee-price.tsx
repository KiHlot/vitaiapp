"use client";

import { Ruble } from "@/components/ruble";
import { INTEREST_KEY } from "@/lib/attribution";
import { COFFEE_KEY, type CoffeeId } from "@/lib/coffees";
import { scrollOrderFormIntoView } from "@/lib/scroll-order-form";

export function CoffeePrice({
  id,
  name,
  price,
}: {
  id: CoffeeId;
  name: string;
  price: string;
}) {
  return (
    <a
      className="price"
      href="#order"
      aria-label={`Заказать ${name}, ${price} белорусских рублей`}
      onClick={(event) => {
        sessionStorage.setItem(COFFEE_KEY, id);
        sessionStorage.setItem(INTEREST_KEY, "once");
        window.dispatchEvent(new CustomEvent("kvarta-coffee", { detail: id }));
        window.dispatchEvent(
          new CustomEvent("kvarta-interest", { detail: "once" }),
        );

        const field = document.getElementById("name");
        if (!field) return;

        event.preventDefault();
        scrollOrderFormIntoView();
        field.focus({ preventScroll: true });
      }}
    >
      <span className="price-amount">
        {price}
        <Ruble />
      </span>
    </a>
  );
}
