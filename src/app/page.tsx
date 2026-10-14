import { Header } from "@/components/header";
import { About } from "@/components/sections/about";
import { Coffee } from "@/components/sections/coffee";
import { Delivery } from "@/components/sections/delivery";
import { Hero } from "@/components/sections/hero";
import { Order } from "@/components/sections/order";
import { Subscription } from "@/components/sections/subscription";

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
        <Hero />
        <About />
        <Coffee />
        <Delivery />
        <Subscription />
        <Order />
      </main>
      <footer className="wrap colophon">Фото: Unsplash</footer>
    </>
  );
}
