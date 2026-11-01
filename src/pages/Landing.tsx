import "../landing/landing.css";
import Hero from "../landing/Hero";
import Marquee from "../landing/Marquee";
import MagicRows from "../landing/MagicRows";
import Footer, { ZigRule } from "../landing/Footer";

export default function Landing() {
  return (
    <div className="land">
      <div className="grain" aria-hidden="true" />
      <Hero />
      <ZigRule />
      <Marquee />
      <ZigRule />
      <MagicRows />
      <Footer />
    </div>
  );
}
