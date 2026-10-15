import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found">
      <h1 className="not-found-code">404</h1>
      <p className="not-found-title">Такой страницы нет</p>
      <Link className="not-found-home" href="/">
        На главную
      </Link>
    </main>
  );
}
