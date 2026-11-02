// Bundled demo photos (Pexels License, credited in LICENSES.md). Juice It and
// the Photos panel pick from these by keyword when no Pexels API key is set.

export interface Photo { src: string; topic: string; w: number; h: number; focus?: { x: number; y: number } }

const P = (file: string, w: number, h: number, focus?: { x: number; y: number }): Photo => ({ src: `/photos/${file}.jpg`, topic: file.split("-")[0], w, h, focus });

export const PHOTOS: Photo[] = [
  P("bake-11803470", 600, 900), P("bake-18101274", 600, 900), P("bake-8482916", 900, 599),
  P("chai-18413481", 900, 600), P("chai-33210272", 600, 900), P("chai-34324342", 675, 900), P("chai-37186989", 615, 900),
  P("crowd-28457979", 900, 600), P("crowd-4218027", 900, 600),
  P("diwali-10182772", 900, 601), P("diwali-34473414", 675, 900), P("diwali-8887279", 900, 600),
  P("gym-16996376", 600, 900), P("gym-2652236", 600, 900), P("gym-7743320", 600, 900),
  P("launch-18015296", 900, 600), P("launch-7327336", 900, 600),
  P("party-18310611", 600, 900), P("party-32333371", 900, 600),
  P("podcast-31213674", 900, 600), P("podcast-7383469", 900, 600),
  P("portrait-27665348", 600, 900, { x: 0.5, y: 0.3 }), P("portrait-34921744", 600, 900, { x: 0.5, y: 0.3 }), P("portrait-3979997", 600, 900, { x: 0.5, y: 0.35 }),
  P("wedding-10454182", 600, 900, { x: 0.5, y: 0.3 }), P("wedding-29368877", 600, 900, { x: 0.5, y: 0.3 }), P("wedding-36354615", 600, 900),
  P("work-12662877", 600, 900), P("work-6893890", 600, 900),
];

const KEYWORDS: Record<string, string[]> = {
  bake: ["bake", "cake", "cupcake", "bakery", "dessert", "sweet", "cookie", "brownie", "food", "sale"],
  chai: ["chai", "tea", "tapri", "cafe", "coffee", "stall", "dhaba", "breakfast", "snack"],
  crowd: ["fest", "festival", "concert", "party", "gig", "music", "college", "event", "night", "dj", "rave", "show"],
  diwali: ["diwali", "deepavali", "diya", "festive", "festival", "puja", "lights", "sale", "dhanteras"],
  gym: ["gym", "fitness", "workout", "batch", "yoga", "run", "training", "sport", "health"],
  launch: ["launch", "startup", "rocket", "app", "product", "release", "ship", "beta", "saas"],
  party: ["birthday", "bday", "party", "celebration", "cake", "anniversary"],
  podcast: ["podcast", "episode", "mic", "talk", "show", "radio", "interview", "live"],
  portrait: ["hiring", "team", "me", "profile", "portfolio", "meet", "speaker", "model", "fashion"],
  wedding: ["wedding", "shaadi", "save the date", "engagement", "mehndi", "sangeet", "marriage", "bride"],
  work: ["hiring", "designer", "job", "work", "office", "intern", "freelance", "career", "webinar", "course"],
};

/** Best-matching topic for a line of text, or null. */
export function topicFor(text: string): string | null {
  const t = text.toLowerCase();
  let best: string | null = null, score = 0;
  for (const [topic, words] of Object.entries(KEYWORDS)) {
    const s = words.reduce((a, w) => a + (t.includes(w) ? w.length : 0), 0);
    if (s > score) { score = s; best = topic; }
  }
  return best;
}

/** The n-th photo for a text (cycles through matching topic, falls back to portraits + crowds). */
export function photoFor(text: string, n = 0): Photo {
  const topic = topicFor(text);
  const pool = PHOTOS.filter((p) => p.topic === topic);
  const list = pool.length ? pool : PHOTOS.filter((p) => p.topic === "portrait" || p.topic === "crowd");
  return list[((n % list.length) + list.length) % list.length];
}

export function searchPhotos(q: string): Photo[] {
  const topic = topicFor(q);
  if (!q.trim()) return PHOTOS;
  return topic ? PHOTOS.filter((p) => p.topic === topic) : PHOTOS.filter((p) => p.topic.includes(q.trim().toLowerCase()));
}
