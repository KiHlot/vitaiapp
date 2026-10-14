import type { ReactNode } from "react";

const hours = (
  <>
    <span className="keep">пн–пт 8:00–20:00,</span>{" "}
    <span className="keep">сб–вс 10:00–18:00</span>
  </>
);

const facts: { label: string; value: ReactNode }[] = [
  { label: "С какого года", value: "2019" },
  { label: "Партия", value: "5 кг" },
  { label: "Обжарка", value: "каждый четверг" },
  { label: "Развоз", value: "по пятницам, по Минску" },
  { label: "Самовывоз", value: "ул. Короля, 9" },
  { label: "Часы", value: hours },
];

export function About() {
  return (
    <section className="section" id="freshness">
      <div className="wrap">
        <div className="section-head">
          <p className="kicker">Кто обжаривает</p>
          <h2>Аня и Дмитрий</h2>
        </div>
        <p className="prose">
          Раньше стояли за стойкой. С 2019 года жарят сами, партиями по 5&nbsp;кг. В
          четверг зерно выходит из ростера, в пятницу его развозят по Минску.
          Когда пачка доезжает до вас, зерно обжарено вчера, позавчера или три
          дня назад. На полке оно не лежит.
        </p>
        <dl className="fact-list">
          {facts.map((fact) => (
            <div className="fact-row" key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
        <p className="big-stat">
          <strong>1–3</strong>
          <span>
            дня зерну,
            <br />
            когда оно у вас
          </span>
        </p>
      </div>
    </section>
  );
}
