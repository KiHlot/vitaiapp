import { CoffeePrice } from "@/components/coffee-price";
import { OrderLink } from "@/components/order-link";
import { coffees } from "@/lib/coffees";

export function Coffee() {
  return (
    <section className="section" id="coffee">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Четыре позиции</p>
          <h2>Зерно</h2>
        </div>
        <div className="coffees">
          {coffees.map((coffee) => (
            <article className="coffee" key={coffee.id}>
              <p className="kicker">{coffee.origin}</p>
              <h3>{coffee.name}</h3>
              <p>{coffee.note}</p>
              <CoffeePrice id={coffee.id} name={coffee.name} price={coffee.price} />
            </article>
          ))}
        </div>
        <div className="section-action">
          <OrderLink interest="once" />
        </div>
      </div>
    </section>
  );
}
