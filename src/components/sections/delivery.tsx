import Image from "next/image";
import { Ruble } from "@/components/ruble";

export function Delivery() {
  return (
    <section className="band" aria-labelledby="route-title">
      <div className="band-photo">
        <Image
          src="/photos/roast.webp"
          alt="Портафильтры с зерном, помолом и готовым эспрессо"
          fill
          sizes="100vw"
        />
      </div>
      <div className="band-shade" />
      <div className="wrap band-inner">
        <p className="kicker">Четверг и пятница</p>
        <h2 id="route-title">Жарим и привозим</h2>
        <p className="band-lead">
          В четверг выходит партия, в пятницу везём её по Минску.
        </p>
        <ul className="band-numbers">
          <li>
            <strong>5 кг</strong>
            <span>одна партия</span>
          </li>
          <li>
            <strong>самовывоз</strong>
            <span>
              на Короля,&nbsp;9
            </span>
          </li>
          <li>
            <strong>
              от 50 <Ruble />
            </strong>
            <span>доставка бесплатно</span>
          </li>
          <li>
            <strong>пятница</strong>
            <span>развоз по Минску</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
