export const coffees = [
  {
    id: "yirgacheffe",
    origin: "Эфиопия",
    name: "Иргачеффе",
    note: "Цветочный, бергамот, светлая обжарка. 250\u00a0г",
    price: "32",
  },
  {
    id: "huila",
    origin: "Колумбия",
    name: "Уила",
    note: "Карамель и красное яблоко. 250\u00a0г",
    price: "29",
  },
  {
    id: "cerrado",
    origin: "Бразилия",
    name: "Серрадо",
    note: "Орех, шоколад, под эспрессо. 250\u00a0г",
    price: "26",
  },
  {
    id: "drip",
    origin: "Дрип",
    name: "Ассорти",
    note: "Десять пакетов, разное зерно.",
    price: "18",
  },
] as const;

export type CoffeeId = (typeof coffees)[number]["id"];

export const COFFEE_KEY = "kvarta-coffee";

export function isCoffeeId(value: string | null): value is CoffeeId {
  return coffees.some((coffee) => coffee.id === value);
}
