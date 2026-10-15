"use client";

import { Ruble } from "@/components/ruble";
import { INTEREST_KEY } from "@/lib/attribution";
import { COFFEE_KEY, type CoffeeId } from "@/lib/coffees";
import { scrollOrderFormIntoView } from "@/lib/scroll-order-form";

export function CoffeeCard({
  id,
  origin,
  name,
  note,
  price,
}: {
  id: CoffeeId;
  origin: string;
  name: string;
  note: string;
  price: string;
}) {
  return (
    <a
      className="coffee"
      href="#order"
      aria-label={`Выбрать ${name}, ${price} белорусских рублей`}
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
      <p className="kicker">{origin}</p>
      <h3>{name}</h3>
      <p>{note}</p>
      <span className="price">
        <span className="price-amount">
          {price}
          <Ruble />
        </span>
      </span>
      <span className="coffee-pick">Выбрать</span>
    </a>
  );
}
