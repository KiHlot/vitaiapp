import Image from "next/image";
import { Header } from "@/components/header";
import { LeadForm } from "@/components/lead-form";
import { OrderLink } from "@/components/order-link";

const coffees = [
  {
    origin: "Эфиопия",
    name: "Иргачеффе",
    note: "Цветочный, бергамот, светлая обжарка. 250 г",
    price: "32",
  },
  {
    origin: "Колумбия",
    name: "Уила",
    note: "Карамель и красное яблоко. 250 г",
    price: "29",
  },
  {
    origin: "Бразилия",
    name: "Серрадо",
    note: "Орех, шоколад, под эспрессо. 250 г",
    price: "26",
  },
  {
    origin: "Дрип",
    name: "Ассорти",
    note: "Десять пакетов, разное зерно.",
    price: "18",
  },
];

const facts = [
  ["С какого года", "2019"],
  ["Партия", "5 кг"],
  ["Обжарка", "каждый четверг"],
  ["Развоз", "по пятницам, по Минску"],
  ["Самовывоз", "ул. Короля, 9"],
  ["Часы", "пн–пт 8:00–20:00, сб–вс 10:00–18:00"],
];

export default function Home() {
  return (
    <>
      <a className="skip" href="#order">
        К заявке
      </a>
      <div className="guides" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <Header />
      <main>
        <section className="hero" id="home">
          <div className="hero-stage">
            <div className="hero-ring">
              <div className="hero-photo">
                <Image
                  src="/photos/beans.jpg"
                  alt="Обжаренные кофейные зёрна"
                  fill
                  priority
                  sizes="620px"
                />
                <div className="hero-shade" />
              </div>
              <div className="hero-copy">
                <p className="hero-kicker">Минск</p>
                <h1>Кварта</h1>
                <p className="hero-sub">Зерно на 1–3 день</p>
              </div>
              <OrderLink />
            </div>
            <p className="hero-note">
              Перезвоним и оформим, оплаты на сайте нет
            </p>
          </div>
          <p className="hero-address">ул. Короля, 9</p>
        </section>

        <section className="section" id="freshness">
          <div className="section-head">
            <p className="kicker">Кто обжаривает</p>
            <h2>Аня и Дмитрий</h2>
          </div>
          <p className="prose">
            Раньше стояли за стойкой. С 2019 года жарят сами, партиями по 5 кг.
            В четверг зерно выходит из ростера, в пятницу его развозят по
            Минску. Пачка доезжает на первый, второй или третий день после
            обжарки — ради этого мастерская и существует.
          </p>
          <dl className="fact-list">
            {facts.map(([label, value]) => (
              <div className="fact-row" key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="big-stat">
            <strong>1–3</strong>
            <span>дня после обжарки</span>
          </p>
        </section>

        <section className="section" id="coffee">
          <div className="section-head">
            <p className="kicker">Четыре позиции</p>
            <h2>Зерно</h2>
          </div>
          <div className="coffees">
            {coffees.map((coffee) => (
              <article className="coffee" key={coffee.name}>
                <p className="kicker">{coffee.origin}</p>
                <h3>{coffee.name}</h3>
                <p>{coffee.note}</p>
                <p className="price">
                  {coffee.price}
                  <small>BYN</small>
                </p>
              </article>
            ))}
          </div>
          <div className="section-action">
            <OrderLink interest="once" />
          </div>
        </section>

        <section className="band" aria-labelledby="route-title">
          <div className="band-photo">
            <Image
              src="/photos/roast.jpg"
              alt="Портафильтры с зерном, помолом и готовым эспрессо"
              fill
              sizes="100vw"
            />
          </div>
          <div className="band-shade" />
          <div className="band-inner">
            <p className="kicker">С четверга до пятницы</p>
            <h2 id="route-title">Как это едет</h2>
            <ul className="band-numbers">
              <li>
                <strong>5 кг</strong>
                <span>партия</span>
              </li>
              <li>
                <strong>2019</strong>
                <span>жарим</span>
              </li>
              <li>
                <strong>пятница</strong>
                <span>по Минску</span>
              </li>
              <li>
                <strong>50 BYN</strong>
                <span>доставка бесплатно</span>
              </li>
            </ul>
          </div>
        </section>

        <section className="section" id="subscription">
          <div className="section-head">
            <p className="kicker">Раз в месяц</p>
            <h2>Подписка</h2>
          </div>
          <div className="subscription">
            <p>
              Две пачки по 250 г. Привозим сами, доставка уже в цене. Сорта
              можно менять от месяца к месяцу — менеджер спросит, когда
              перезвонит.
            </p>
            <p className="price-line">
              54 <small>BYN / мес</small>
            </p>
          </div>
          <div className="section-action">
            <OrderLink interest="subscription" />
          </div>
        </section>

        <section className="section" id="order">
          <div className="section-head">
            <p className="kicker">Короля, 9</p>
            <h2>Заявка</h2>
          </div>
          <dl className="fact-list">
            <div className="fact-row">
              <dt>Адрес</dt>
              <dd>Минск, ул. Короля, 9. Самовывоз.</dd>
            </div>
            <div className="fact-row">
              <dt>Часы</dt>
              <dd>пн–пт 8:00–20:00, сб–вс 10:00–18:00</dd>
            </div>
            <div className="fact-row">
              <dt>Доставка</dt>
              <dd>
                По Минску в пятницу. От 50 BYN бесплатно. Если заказ меньше,
                стоимость скажет менеджер.
              </dd>
            </div>
          </dl>
          <LeadForm />
        </section>
      </main>
      <footer className="colophon">Фото: Unsplash</footer>
    </>
  );
}
