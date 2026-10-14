import { OrderLink } from "@/components/order-link";
import { Ruble } from "@/components/ruble";

export function Subscription() {
  return (
    <section className="section" id="subscription">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Раз в месяц</p>
          <h2>Подписка</h2>
        </div>
        <div className="subscription">
          <p>
            Подписку можно заказать: каждый месяц привозим две пачки по 250&nbsp;г,
            доставка уже в цене. Сорта от месяца к месяцу можно менять — менеджер
            спросит об этом, когда перезвонит.
          </p>
          <p className="price-line">
            54 <small><Ruble /> / мес</small>
          </p>
        </div>
        <div className="section-action">
          <OrderLink interest="subscription" />
        </div>
      </div>
    </section>
  );
}
