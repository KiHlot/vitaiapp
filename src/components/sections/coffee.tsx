import { CoffeeCard } from "@/components/coffee-card";
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
            <CoffeeCard key={coffee.id} {...coffee} />
          ))}
        </div>
      </div>
    </section>
  );
}
