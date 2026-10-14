import Image from "next/image";
import { OrderLink } from "@/components/order-link";

export function Hero() {
  return (
    <section className="hero" id="home">
      <div className="wrap hero-frame">
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
              <p className="hero-sub">Свежая обжарка кофе</p>
            </div>
            <OrderLink />
          </div>
          <p className="hero-note">
            Перезвоним и оформим, оплаты на сайте нет
          </p>
        </div>
        <p className="hero-address">ул. Короля, 9</p>
      </div>
    </section>
  );
}
