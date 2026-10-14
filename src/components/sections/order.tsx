import { LeadForm } from "@/components/lead-form";
import { Ruble } from "@/components/ruble";

export function Order() {
  return (
    <section className="section" id="order">
      <div className="wrap">
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
            <dd>
              <span className="keep">пн–пт 8:00–20:00,</span>{" "}
              <span className="keep">сб–вс 10:00–18:00</span>
            </dd>
          </div>
          <div className="fact-row">
            <dt>Доставка</dt>
            <dd>
              По Минску в пятницу. От 50&nbsp;<Ruble /> бесплатно. Если заказ меньше,
              стоимость скажет менеджер.
            </dd>
          </div>
        </dl>
        <div className="lead-panel">
          <p className="lead-panel-kicker">Имя и телефон, менеджер перезвонит</p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
