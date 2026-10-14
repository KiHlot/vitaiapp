"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#freshness", label: "Обжарщики" },
  { href: "#coffee", label: "Ассортимент" },
  { href: "#subscription", label: "Подписка" },
  { href: "#order", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <header className="topbar">
        <div className="wrap topbar-inner">
          <a className="logo" href="#home" onClick={() => setOpen(false)}>
            Кварта
          </a>
          <button
            className="menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            onClick={() => setOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
      {open ? (
        <nav id="site-menu" className="menu">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </>
  );
}
