"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  captureTouch,
  INTEREST_KEY,
  readTouch,
} from "@/lib/attribution";
import {
  COFFEE_KEY,
  coffees,
  isCoffeeId,
  type CoffeeId,
} from "@/lib/coffees";
import {
  formatBelarusPhone,
  normalizeBelarusPhone,
  phoneHint,
  type Interest,
} from "@/lib/phone";

const interests: { value: Interest; label: string }[] = [
  { value: "subscription", label: "Подписка" },
  { value: "once", label: "Разовый заказ" },
  { value: "question", label: "Вопрос" },
];

type Field = "name" | "phone" | "interest";

function isInterest(value: string | null): value is Interest {
  return value === "subscription" || value === "once" || value === "question";
}

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState<Interest | "">("");
  const [coffee, setCoffee] = useState<CoffeeId | "">("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [formError, setFormError] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "duplicate">(
    "idle",
  );

  useEffect(() => {
    captureTouch();

    const applyCoffee = (value: string | null) => {
      if (isCoffeeId(value)) setCoffee(value);
    };

    const onInterest = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      if (isInterest(detail)) setInterest(detail);
      applyCoffee(sessionStorage.getItem(COFFEE_KEY));
    };

    const onCoffee = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail;
      applyCoffee(detail);
    };

    window.addEventListener("kvarta-interest", onInterest);
    window.addEventListener("kvarta-coffee", onCoffee);

    const stored = sessionStorage.getItem(INTEREST_KEY);
    const storedCoffee = sessionStorage.getItem(COFFEE_KEY);
    const timer = window.setTimeout(() => {
      if (isInterest(stored)) setInterest(stored);
      if (isCoffeeId(storedCoffee)) setCoffee(storedCoffee);
    }, 0);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("kvarta-interest", onInterest);
      window.removeEventListener("kvarta-coffee", onCoffee);
    };
  }, []);

  function applyPhoneFormat() {
    const normalized = normalizeBelarusPhone(phone);
    if (normalized) setPhone(formatBelarusPhone(normalized));
  }

  function validate() {
    const next: Partial<Record<Field, string>> = {};
    if (name.trim().length < 2) next.name = "Напишите, как к вам обращаться";
    if (!normalizeBelarusPhone(phone)) next.phone = phoneHint;
    if (!interest) next.interest = "Выберите, что вас интересует";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setFormError("");

    if (nextErrors.name) {
      document.getElementById("name")?.focus();
      return;
    }
    if (nextErrors.phone) {
      document.getElementById("phone")?.focus();
      return;
    }
    if (nextErrors.interest) return;
    if (!interest) return;

    const normalized = normalizeBelarusPhone(phone);
    if (!normalized) return;

    setStatus("sending");

    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: normalized,
          interest,
          coffee: coffees.find((item) => item.id === coffee)?.name ?? "",
          comment: comment.trim(),
          attribution: readTouch(),
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        message?: string;
        duplicate?: boolean;
      } | null;

      if (!response.ok) {
        setStatus("idle");
        setFormError(
          data?.message ??
            "Не получилось отправить. Проверьте интернет и нажмите ещё раз.",
        );
        return;
      }

      setStatus(data?.duplicate ? "duplicate" : "sent");
    } catch {
      setStatus("idle");
      setFormError(
        "Не получилось отправить. Проверьте интернет и нажмите ещё раз.",
      );
    }
  }

  if (status === "sent" || status === "duplicate") {
    return (
      <p className="form-status" role="status">
        {status === "duplicate"
          ? "Заявка с этого номера уже есть, менеджер перезвонит."
          : "Заявка ушла. Менеджер перезвонит."}
      </p>
    );
  }

  return (
    <form className="lead-form" onSubmit={onSubmit} noValidate>
      <div className="form-row">
        <label className="field">
          <span>Имя</span>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={errors.name ? "name-error" : undefined}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((current) => ({ ...current, name: undefined }));
            }}
          />
          {errors.name ? (
            <p className="field-error" id="name-error">
              {errors.name}
            </p>
          ) : null}
        </label>
        <label className="field">
          <span>Телефон</span>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="+375 29 123 45 67"
            value={phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            onChange={(event) => {
              setPhone(event.target.value);
              setErrors((current) => ({ ...current, phone: undefined }));
            }}
            onBlur={applyPhoneFormat}
          />
          {errors.phone ? (
            <p className="field-error" id="phone-error">
              {errors.phone}
            </p>
          ) : null}
        </label>
      </div>
      <fieldset className="choices">
        <legend>Что интересует</legend>
        {interests.map((item) => (
          <label key={item.value}>
            <input
              type="radio"
              name="interest"
              value={item.value}
              checked={interest === item.value}
              onChange={() => {
                setInterest(item.value);
                setErrors((current) => ({ ...current, interest: undefined }));
              }}
            />
            {item.label}
          </label>
        ))}
        {errors.interest ? (
          <p className="field-error" id="interest-error">
            {errors.interest}
          </p>
        ) : null}
      </fieldset>
      <fieldset className="choices">
        <legend>Какое зерно</legend>
        {coffees.map((item) => (
          <label key={item.id}>
            <input
              type="radio"
              name="coffee"
              value={item.id}
              checked={coffee === item.id}
              onChange={() => {
                setCoffee(item.id);
                sessionStorage.setItem(COFFEE_KEY, item.id);
              }}
            />
            {item.name}
          </label>
        ))}
      </fieldset>
      <label className="field">
        <span>Комментарий</span>
        <textarea
          name="comment"
          rows={3}
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </label>
      {formError ? (
        <p className="form-status" role="alert">
          {formError}
        </p>
      ) : null}
      <div className="section-action">
        <button className="order-button" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Секунду" : "Отправить"}
        </button>
      </div>
    </form>
  );
}
