// Juice It, step 1: turn a boring line into parts.
// "bake sale saturday 10am at the old hall" →
//   { headline: "Bake Sale", day: "Saturday", time: "10AM", place: "The Old Hall" }

export interface Idea {
  raw: string;
  headline: string;
  day?: string;
  date?: string;
  time?: string;
  place?: string;
  price?: string;
  /** "SATURDAY · 10AM" style line, or "" */
  when: string;
}

const DAYS: Record<string, string> = {
  mon: "Monday", monday: "Monday", tue: "Tuesday", tues: "Tuesday", tuesday: "Tuesday",
  wed: "Wednesday", wednesday: "Wednesday", thu: "Thursday", thur: "Thursday", thurs: "Thursday", thursday: "Thursday",
  fri: "Friday", friday: "Friday", sat: "Saturday", saturday: "Saturday", sun: "Sunday", sunday: "Sunday",
  today: "Today", tonight: "Tonight", tomorrow: "Tomorrow", weekend: "This Weekend",
};
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const FILLER = new Set(["on", "at", "this", "next", "from", "the", "a", "an", "for", "is", "in", "@", "-", "–", "—", "&", "and"]);

const title = (s: string) => s.replace(/\S+/g, (w) => (w.length <= 2 && /^(of|to|in|on|at|by|&)$/i.test(w) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)));

export function parseIdea(input: string): Idea {
  const raw = input.trim().replace(/\s+/g, " ");
  let rest = ` ${raw} `;
  const take = (re: RegExp) => {
    const m = rest.match(re);
    if (m) rest = rest.replace(m[0], " ");
    return m;
  };

  let time: string | undefined;
  const t = take(/\s(\d{1,2})(?::(\d{2}))?\s?(am|pm)(?=[\s,.!])/i) ?? take(/\s(\d{1,2}):(\d{2})(?=[\s,.!])/);
  if (t) time = `${t[1]}${t[2] && t[2] !== "00" ? ":" + t[2] : ""}${t[3] ? t[3].toUpperCase() : ""}`;

  let price: string | undefined;
  const p = take(/\s(\d{1,3})\s?%\s?off(?=[\s,.!])/i) ?? take(/\s(₹|rs\.?\s?|inr\s?|\$)\s?(\d[\d,]*)(?=[\s,.!])/i) ?? take(/\s(free)(?=[\s,.!])/i);
  if (p) price = /off/i.test(p[0]) ? `${p[1]}% OFF` : /free/i.test(p[0]) ? "FREE" : `${/\$/.test(p[1]) ? "$" : "₹"}${p[2]}`;

  let date: string | undefined;
  const monthAlt = MONTHS.join("|");
  const d = take(new RegExp(`\\s(\\d{1,2})(?:st|nd|rd|th)?\\s(${monthAlt})[a-z]*(?=[\\s,.!])`, "i"))
    ?? take(new RegExp(`\\s(${monthAlt})[a-z]*\\s(\\d{1,2})(?:st|nd|rd|th)?(?=[\\s,.!])`, "i"))
    ?? take(/\s(\d{1,2})\/(\d{1,2})(?=[\s,.!])/);
  if (d) {
    if (/\//.test(d[0])) date = `${d[1]}/${d[2]}`;
    else {
      const num = /^\d/.test(d[1]) ? d[1] : d[2];
      const mon = /^\d/.test(d[1]) ? d[2] : d[1];
      date = `${num} ${mon.slice(0, 3).toUpperCase()}`;
    }
  }

  let day: string | undefined;
  const dayRe = new RegExp(`\\s(?:this\\s|next\\s)?(${Object.keys(DAYS).sort((a, b) => b.length - a.length).join("|")})(?=[\\s,.!])`, "i");
  const dy = take(dayRe);
  if (dy) day = DAYS[dy[1].toLowerCase()];

  let place: string | undefined;
  const pl = take(/\s(?:at|@)\s([^,.!]+?)(?=\s*(?:[,.!]|$))/i);
  if (pl) {
    const cleaned = pl[1].trim().replace(/^the\s/i, "The ");
    if (cleaned && cleaned.split(" ").length <= 6) place = title(cleaned);
    else rest += ` ${pl[1]} `;
  }

  const words = rest.replace(/[,.!]+/g, " ").split(" ").filter(Boolean);
  while (words.length && FILLER.has(words[words.length - 1].toLowerCase())) words.pop();
  while (words.length && FILLER.has(words[0].toLowerCase())) words.shift();
  const headline = title(words.join(" ")) || "Big News";

  const when = [day, date, time].filter(Boolean).join(" · ").toUpperCase();
  return { raw, headline, day, date, time, place, price, when };
}

/** Stable small hash so the same input always juices the same way. */
export function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return Math.abs(h);
}
