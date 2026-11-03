// Bundled demo photos (Pexels License, credited in LICENSES.md), tagged by
// topic. Juice It and the Photos panel pick from these by keyword when no
// Pexels API key is set. No photos of children.

export interface Photo { src: string; topic: string; w: number; h: number; focus?: { x: number; y: number } }

const RAW: [string, number, number][] = [
  ["abstract-12732215", 900, 506],
  ["abstract-30486228", 506, 900],
  ["abstract-30925664", 900, 600],
  ["abstract-33386712", 600, 900],
  ["abstract-34802062", 601, 900],
  ["abstract-4046868", 600, 900],
  ["abstract-6985132", 900, 600],
  ["abstract-7135007", 900, 600],
  ["bake-11803470", 600, 900],
  ["bake-18101274", 600, 900],
  ["bake-8482916", 900, 599],
  ["cake-15211704", 600, 900],
  ["cake-16000541", 900, 634],
  ["cake-23384637", 900, 594],
  ["cake-25956380", 900, 567],
  ["cake-9543834", 900, 600],
  ["chai-18413481", 900, 600],
  ["chai-33210272", 600, 900],
  ["chai-34324342", 675, 900],
  ["chai-37186989", 615, 900],
  ["city-27786486", 720, 900],
  ["city-37352236", 900, 514],
  ["city-5414582", 900, 777],
  ["city-5414586", 900, 815],
  ["city-8182150", 900, 600],
  ["city-9194751", 548, 900],
  ["crowd-28457979", 900, 600],
  ["crowd-4218027", 900, 600],
  ["diwali-10182772", 900, 601],
  ["diwali-34400019", 675, 900],
  ["diwali-34400035", 675, 900],
  ["diwali-34400039", 900, 675],
  ["diwali-34473414", 675, 900],
  ["diwali-37791040", 900, 676],
  ["diwali-8887279", 900, 600],
  ["fest-11511275", 900, 600],
  ["fest-11517280", 675, 900],
  ["fest-11537125", 675, 900],
  ["fest-36425051", 678, 900],
  ["fest-3899269", 900, 622],
  ["food-13612713", 900, 600],
  ["food-28074076", 600, 900],
  ["food-36236282", 678, 900],
  ["food-36388454", 900, 507],
  ["food-36854500", 675, 900],
  ["food-37180955", 900, 600],
  ["food-958547", 900, 506],
  ["gym-16996376", 600, 900],
  ["gym-2261483", 900, 600],
  ["gym-2652236", 600, 900],
  ["gym-27853651", 506, 900],
  ["gym-32798746", 600, 900],
  ["gym-3838705", 900, 600],
  ["gym-4853262", 900, 600],
  ["gym-7743320", 600, 900],
  ["laptop-11206424", 675, 900],
  ["laptop-19935029", 506, 900],
  ["laptop-265144", 900, 601],
  ["laptop-7437087", 600, 900],
  ["laptop-8052620", 900, 600],
  ["launch-18015296", 900, 600],
  ["launch-7327336", 900, 600],
  ["music-11865671", 600, 900],
  ["music-26804072", 600, 900],
  ["music-27508913", 900, 601],
  ["music-40623998", 900, 767],
  ["music-7715347", 900, 600],
  ["office-1181738", 900, 600],
  ["office-12903168", 600, 900],
  ["office-5945799", 600, 900],
  ["office-6326260", 900, 600],
  ["office-7693692", 900, 600],
  ["office-8117476", 600, 900],
  ["party-32333371", 900, 600],
  ["podcast-164755", 900, 600],
  ["podcast-210927", 900, 600],
  ["podcast-2876659", 900, 506],
  ["podcast-31213674", 900, 600],
  ["podcast-4889280", 506, 900],
  ["podcast-7243780", 900, 600],
  ["podcast-7383469", 900, 600],
  ["portrait-27665348", 600, 900],
  ["portrait-34921744", 600, 900],
  ["portrait-3979997", 600, 900],
  ["startup-10375945", 900, 600],
  ["startup-5324900", 600, 900],
  ["startup-7414009", 600, 900],
  ["startup-7964146", 900, 600],
  ["startup-9301752", 600, 900],
  ["wedding-10454182", 600, 900],
  ["wedding-29368877", 600, 900],
  ["wedding-36354615", 600, 900],
  ["work-12662877", 600, 900],
  ["work-6893890", 600, 900],
];

const FACES: Record<string, { x: number; y: number }> = {
  "portrait-27665348": { x: 0.5, y: 0.3 }, "portrait-34921744": { x: 0.5, y: 0.3 }, "portrait-3979997": { x: 0.5, y: 0.35 },
  "wedding-10454182": { x: 0.5, y: 0.3 }, "wedding-29368877": { x: 0.5, y: 0.3 }, "fest-11517280": { x: 0.5, y: 0.3 },
};

export const PHOTOS: Photo[] = RAW.map(([f, w, h]) => ({ src: `/photos/${f}.jpg`, topic: f.split("-")[0], w, h, focus: FACES[f] }));

/** Keyword → photo topic. Longest matches win, so "birthday cake" beats "cake". */
const KEYWORDS: Record<string, string[]> = {
  bake: ["bake", "bakery", "cupcake", "brownie", "cookie", "pastry", "dessert"],
  cake: ["cake", "birthday", "bday", "anniversary", "candles"],
  chai: ["chai", "tea", "tapri", "cutting", "kadak"],
  food: ["food", "biryani", "thali", "dinner", "lunch", "brunch", "restaurant", "street food", "dhaba", "chaat", "menu", "cafe", "cook"],
  crowd: ["party", "rave", "club", "night out", "dj", "event"],
  fest: ["fest", "festival", "holi", "college", "mela", "carnival", "utsav"],
  music: ["music", "gig", "concert", "band", "guitar", "open mic", "jam", "song", "album", "singer"],
  diwali: ["diwali", "deepavali", "diya", "rangoli", "dhanteras", "lights", "festive"],
  gym: ["gym", "fitness", "workout", "batch", "yoga", "run", "marathon", "training", "sport", "lift"],
  launch: ["launch", "rocket", "release", "ship", "beta", "live now"],
  startup: ["startup", "founder", "pitch", "investor", "saas", "hackathon", "product"],
  party: ["party", "celebration", "celebrate", "balloons"],
  podcast: ["podcast", "episode", "mic", "radio", "interview", "talk show", "listen", "studio"],
  office: ["hiring", "team", "office", "meeting", "job", "career", "intern", "corporate", "offsite"],
  laptop: ["designer", "developer", "freelance", "laptop", "remote", "webinar", "course", "work", "coding", "workshop"],
  portrait: ["me", "profile", "portfolio", "speaker", "model", "fashion", "meet", "creator"],
  wedding: ["wedding", "shaadi", "save the date", "engagement", "mehndi", "sangeet", "marriage", "bride", "nikah"],
  city: ["city", "mumbai", "delhi", "bangalore", "bengaluru", "travel", "trip", "tour", "night walk", "skyline"],
  abstract: ["sale", "offer", "discount", "drop", "art", "exhibition", "newsletter", "announcement"],
};

/** Best-matching topic for a line of text, or null. */
export function topicFor(text: string): string | null {
  const t = ` ${text.toLowerCase()} `;
  let best: string | null = null, score = 0;
  for (const [topic, words] of Object.entries(KEYWORDS)) {
    const s = words.reduce((a, w) => a + (new RegExp(`[^a-z]${w}`).test(t) ? w.length : 0), 0);
    if (s > score) { score = s; best = topic; }
  }
  return best;
}

/** The n-th photo for a text. No match → abstract textures, never an irrelevant photo. */
export function photoFor(text: string, n = 0): Photo {
  const topic = topicFor(text) ?? "abstract";
  const pool = PHOTOS.filter((p) => p.topic === topic);
  const list = pool.length ? pool : PHOTOS.filter((p) => p.topic === "abstract");
  return list[((n % list.length) + list.length) % list.length];
}

export function searchPhotos(q: string): Photo[] {
  if (!q.trim()) return PHOTOS;
  const topic = topicFor(q);
  return topic ? PHOTOS.filter((p) => p.topic === topic) : PHOTOS.filter((p) => p.topic.includes(q.trim().toLowerCase()));
}
