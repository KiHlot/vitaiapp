import { OrderLink } from "@/components/order-link";
import { address, navLinks, phone, phoneHref } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap site-footer-inner">
        <p className="footer-address">{address}</p>
        <a className="footer-phone" href={phoneHref}>
          {phone}
        </a>
        <OrderLink />
        <nav className="footer-nav" aria-label="Разделы">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
        <p className="footer-copy">© 2026 Кварта. Фото: Unsplash</p>
      </div>
    </footer>
  );
}
