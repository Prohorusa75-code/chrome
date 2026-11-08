import { Booking } from "@/components/sections/Booking";
import { Brands } from "@/components/sections/Brands";
import { Calculator } from "@/components/sections/Calculator";
import { Contacts } from "@/components/sections/Contacts";
import { Footer } from "@/components/sections/Footer";
import { Guarantee } from "@/components/sections/Guarantee";
import { Header } from "@/components/sections/Header";
import { Hero } from "@/components/sections/Hero";
import { Prices } from "@/components/sections/Prices";
import { Reviews } from "@/components/sections/Reviews";
import { Services } from "@/components/sections/Services";
import { Stats } from "@/components/sections/Stats";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Calculator />
        <Prices />
        <Brands />
        <Booking />
        <Reviews />
        <Guarantee />
        <Contacts />
      </main>
      <Footer />
    </>
  );
}
