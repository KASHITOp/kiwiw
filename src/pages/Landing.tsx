import "../landing/landing.css";
import Hero from "../landing/Hero";
import Marquee from "../landing/Marquee";
import MagicRows from "../landing/MagicRows";
import Footer, { ZigRule } from "../landing/Footer";
import Toaster from "../personality/Toaster";
import { toast } from "../personality/bus";
import { squeezeKiwis, useKonami } from "../personality/useKonami";

const onKonami = () => { squeezeKiwis(); toast("↑↑↓↓←→←→BA. Kiwi squeezed. No refunds."); };

export default function Landing() {
  useKonami(onKonami);
  return (
    <div className="land">
      <div className="grain" aria-hidden="true" />
      <Hero />
      <ZigRule />
      <Marquee />
      <ZigRule />
      <MagicRows />
      <Footer />
      <Toaster />
    </div>
  );
}
