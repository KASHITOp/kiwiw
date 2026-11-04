import type { UserPhoto } from "../juice/photo";
import { StickerDrawer, MagicTools } from "../landing/V3Sections";
import "../landing/landing.css";
import Hero from "../landing/Hero";
import Marquee from "../landing/Marquee";
import DnaWall from "../landing/DnaWall";
import JuiceBurst from "../landing/JuiceBurst";
import { useState } from "react";
import { Ticker, Playground, RoastDemo } from "../landing/Sections";
import About from "../landing/About";
import Footer, { ZigRule } from "../landing/Footer";
import Toaster from "../personality/Toaster";
import { toast } from "../personality/bus";
import { squeezeKiwis, useKonami } from "../personality/useKonami";

const onKonami = () => { squeezeKiwis(); toast("↑↑↓↓←→←→BA. Kiwi squeezed. No refunds."); };

export default function Landing() {
  useKonami(onKonami);
  const [juice, setJuice] = useState<{ text: string; nonce: number; photo?: UserPhoto }>({ text: "", nonce: 0 });
  return (
    <div className="land">
      <div className="grain" aria-hidden="true" />
      <Hero onJuice={(text, photo) => setJuice((j) => ({ text, photo, nonce: j.nonce + 1 }))} />
      <JuiceBurst text={juice.text} nonce={juice.nonce} photo={juice.photo} />
      <Ticker />
      <DnaWall />
      <ZigRule />
      <Playground />
      <ZigRule />
      <StickerDrawer />
      <ZigRule />
      <Marquee />
      <ZigRule />
      <MagicTools />
      <ZigRule />
      <RoastDemo />
      <ZigRule />
      <About />
      <Footer />
      <Toaster />
    </div>
  );
}
