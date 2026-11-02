// Juice It, step 2: built-in witty copy per style direction (no API key needed).
// All lines are original. Picks are seeded by the input, so the same idea
// juices the same way, and "Re-juice" rotates through the variations.
import type { Idea } from "./parse";

export type StyleKey = "block" | "sunday" | "zine" | "filmi" | "calm" | "brainrot";

export interface JuiceCopy {
  kicker: string;
  headline: string;
  sub: string;
  cta: string;
  extra: string;
}

const pick = <T,>(arr: T[], seed: number, salt = 0) => arr[(seed + salt * 7) % arr.length];
const low = (s: string) => s.toLowerCase();

export function writeCopy(style: StyleKey, idea: Idea, seed: number): JuiceCopy {
  const h = idea.headline;
  switch (style) {
    case "block":
      return {
        kicker: pick(["KIWIW PRESENTS", "PUBLIC NOTICE", "ATTENTION PLEASE", "OFFICIAL BUSINESS"], seed),
        headline: h,
        sub: pick(["BE THERE OR BE ELSEWHERE.", "LOUDER THAN THE GROUP CHAT.", "NO EXCUSES. ONE ADDRESS.", "MISSING IT IS A CHOICE."], seed, 1),
        cta: idea.price ?? pick(["GO.", "YES.", "NOW."], seed, 2),
        extra: idea.place?.toUpperCase() ?? "ADDRESS ON REQUEST",
      };
    case "sunday":
      return {
        kicker: `THE SUNDAY ISSUE · NO. ${String((seed % 40) + 2).padStart(2, "0")}`,
        headline: h,
        sub: pick(["a love story.", "in three acts.", "briefly considered.", "reconsidered.", "an appreciation."], seed),
        cta: pick(["RSVP, kindly", "Do come.", "Save the date."], seed, 1),
        extra: pick(["4 MIN READ · YOU WILL SKIM IT", "WORDS BY US · PHOTOS BY NOBODY", "A LONG READ, SHORT VERSION"], seed, 2),
      };
    case "zine":
      return {
        kicker: "",
        headline: h,
        sub: pick(["bring friends. or snacks. ideally both.", "it's gonna be a whole thing", "no dress code, only vibes", "tell your mum. tell everyone."], seed),
        cta: idea.price ?? pick(["FREE*", "YES!!", "GO GO"], seed, 1),
        extra: pick(["*mostly", "*probably", "*ask nicely"], seed, 2),
      };
    case "filmi":
      return {
        kicker: pick(["धूम मचा दो", "आ जाओ यार", "मज़ा आएगा", "पूरा परिवार आए"], seed),
        headline: h,
        sub: idea.place ? `${idea.place} · Sab aa jao` : pick(["Sab aa jao, koi bahana nahi", "Ek din, ek shaam, full dhamaal"], seed, 1),
        cta: idea.price ?? "FREE ENTRY",
        extra: pick(["Pehle aao, pehle paao.", "Mummy ko bhi le aana.", "Chai pe milte hain.", "Housefull hone se pehle aao."], seed, 2),
      };
    case "calm":
      return {
        kicker: pick(["AN INVITATION", "BY APPOINTMENT", "LIMITED · CONSIDERED", "NO. 04"], seed),
        headline: h,
        sub: pick([`An unhurried ${low(h)}.`, "Quietly, and on time.", "Considered. Limited. Calm.", "Nothing loud. Just good."], seed, 1),
        cta: pick(["Reserve quietly", "By invitation", "Kindly attend"], seed, 2),
        extra: idea.time?.replace(/[^0-9:]/g, "").split(":")[0] || String((seed % 9) + 1).padStart(2, "0"),
      };
    case "brainrot":
      return {
        kicker: pick(["when the", "pov: the", "nobody:  the"], seed),
        headline: h,
        sub: pick([`no thoughts, only ${low(h)}`, "this is your sign. literally. this one.", "be there or be mid", `${low(h)} supremacy, respectfully`], seed, 1),
        cta: pick(["NEW", "W", "LIVE"], seed, 2),
        extra: pick(["is actually happening", "slaps, apparently", "is the main character", "and we're not ok"], seed, 3),
      };
  }
}

export const STYLE_META: Record<StyleKey, { name: string; vibe: string }> = {
  calm: { name: "Quiet Money", vibe: "CALM" },
  sunday: { name: "The Sunday Issue", vibe: "FANCY" },
  block: { name: "Block Capitals", vibe: "LOUD" },
  filmi: { name: "Bombay Talkies", vibe: "FILMI" },
  zine: { name: "Cut & Paste Club", vibe: "ZINE" },
  brainrot: { name: "Brainrot Broadcast", vibe: "UNHINGED" },
};

/** Corporate → Unhinged order (REFERENCES.md "The Vibe axis"). */
export const STYLE_ORDER: StyleKey[] = ["calm", "sunday", "block", "filmi", "zine", "brainrot"];
