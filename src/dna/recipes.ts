// Style DNA (STYLE_DNA.md) as data, plus the no-API copy remixer.
// Every headline here is original. Hinglish allowed, real brands/people never.
import type { Idea } from "../juice/parse";
import { topicFor } from "../data/photos";

export type RecipeKey =
  | "nazar" | "tapri" | "stadium" | "brutal" | "swiss"
  | "trippy" | "neo" | "pixel" | "sticker" | "glossy";

export interface Recipe { key: RecipeKey; name: string; vibe: string; jokes: string[] }

export const RECIPES: Record<RecipeKey, Recipe> = {
  nazar: { key: "nazar", name: "Nazar Battu", vibe: "DESI POP", jokes: ["Pre-protected from bad vibes and nosy aunties.", "Nimbu-mirchi included. Results not guaranteed."] },
  tapri: { key: "tapri", name: "Tapri Print", vibe: "TRUCK ART", jokes: ["Painted by the same uncle who did the truck.", "Horn OK please. Poster OK also."] },
  stadium: { key: "stadium", name: "Stadium Halftone", vibe: "SPORTS", jokes: ["Pre-match hype for a non-sport.", "Stats are made up. Energy is real."] },
  brutal: { key: "brutal", name: "Brutal Grid", vibe: "BRUTALIST", jokes: ["Numbered, gridded, slightly aggressive.", "A memo that went to the gym."] },
  swiss: { key: "swiss", name: "Swiss Drop", vibe: "SWISS", jokes: ["40% negative space. 100% attitude.", "A tiny man is doing his best."] },
  trippy: { key: "trippy", name: "Trippy Window", vibe: "PSYCHEDELIC", jokes: ["Your laptop believes in you.", "Error 404: chill not found."] },
  neo: { key: "neo", name: "Neo Brutal Pop", vibe: "NEO-BRUTAL", jokes: ["App notification, but for real life.", "Thick outlines, thicker confidence."] },
  pixel: { key: "pixel", name: "8-Bit Flex", vibe: "8-BIT", jokes: ["Achievement unlocked: posting this.", "Press start to attend."] },
  sticker: { key: "sticker", name: "Sticker Bomb", vibe: "STREETWEAR", jokes: ["Limited drop. Unlimited stickers.", "No refunds on vibes."] },
  glossy: { key: "glossy", name: "Glossy Bloom", vibe: "GLOSSY", jokes: ["Soft launch, hard flex.", "Shiny enough to see your future in."] },
};

/** First batch order: the six that show the range best, then the rest. */
export const RECIPE_ORDER: RecipeKey[] = ["stadium", "nazar", "trippy", "sticker", "glossy", "tapri", "brutal", "swiss", "neo", "pixel"];

type Topic = "bake" | "chai" | "crowd" | "diwali" | "gym" | "launch" | "party" | "podcast" | "work" | "wedding" | "other";

interface Bank { loud: string[]; hi: string[]; hing: string[]; soft: string[]; noun: string; detail: string }

const BANKS: Record<Exclude<Topic, "other">, Bank> = {
  bake: { loud: ["BAKED. NOT HALF-BAKED.", "CRUMBS WILL FALL", "SUGAR RUSH HOUR", "WE KNEAD YOU"], hi: ["आटा, शक्कर, सब्र", "मीठा खाओ", "गरम गरम"], hing: ["Diet kal se, cake aaj se", "Mummy ne bola tha, ek hi lena", "Calories don't count today"], soft: ["Fresh out the oven", "Sweet things, slowly", "Warm from the tray"], noun: "CAKE", detail: "COME HUNGRY · LEAVE STICKY" },
  chai: { loud: ["CUTTING CHAI CLUB", "STEEP DECISIONS", "TEA-RIFIC NEWS", "SIP HAPPENS"], hi: ["चाय पे चर्चा", "एक कटिंग और", "अदरक वाली"], hing: ["Chai peelo, gossip free", "Ek cutting, do log, teen ghante", "Biscuit dip allowed"], soft: ["Steeped in slow mornings", "Brewed with patience", "One more cup"], noun: "CHAI", detail: "CUTTING · ADRAK · ELAICHI" },
  crowd: { loud: ["VIBES: MANDATORY", "NO SLEEP TILL MONDAY", "LOUDER THAN THE PRINCIPAL", "BUNK EVERYTHING ELSE"], hi: ["धूम मचा दो", "पूरा कॉलेज आएगा", "नाचो जी भर के"], hing: ["Fest hai, padhai baad mein", "Bunk mat karna, yeh wala", "Attendance lagegi, dance pe"], soft: ["One night only", "Bring your loudest friend", "See you in the crowd"], noun: "FEST", detail: "MUSIC · FOOD · BAD DECISIONS" },
  diwali: { loud: ["LIGHTS ON. PRICES OFF.", "DHAMAKA DISCOUNTS", "BIG BANG SALE", "CRACKING DEALS"], hi: ["धमाकेदार सेल", "शुभ दीपावली", "रोशनी वाली सेल"], hing: ["Diye jalao, cart bharo", "Mummy approved discounts", "Saal bhar ka shopping, ek din mein"], soft: ["Glow, but make it festive", "Light up the house", "A festive little sale"], noun: "DIYA", detail: "FESTIVE PRICES · LIMITED STOCK" },
  gym: { loud: ["NEW BATCH. NO EXCUSES.", "LIFT OR DIE (POLITELY)", "LEG DAY IS COMING", "SWEAT IS JUST GLITTER"], hi: ["दम लगा के", "पसीना बहाओ", "फिट है तो हिट है"], hing: ["Kal se pakka, aaj se shuru", "Biceps ke liye, bhai", "Protein shake on the house (not really)"], soft: ["Stronger, slowly", "Your first rep starts here", "Show up for you"], noun: "GAINS", detail: "6AM · 7PM · NO EXCUSES BATCH" },
  launch: { loud: ["WE'RE LIVE (FINALLY)", "SHIP IT. SHIP IT GOOD.", "OUT OF BETA", "IT WORKS ON PROD"], hi: ["शुरुआत हो गई", "नया है यह", "धमाकेदार लॉन्च"], hing: ["Bahut code likha, ab dekho", "Startup hai, sapna bada hai", "Investors, please notice"], soft: ["Something new is here", "Version 1.0 of a big idea", "Made with too much coffee"], noun: "FOUNDER", detail: "LIVE NOW · LINK IN BIO" },
  party: { loud: ["CAKE FIRST, QUESTIONS LATER", "BIRTHDAY, BUT LOUDER", "ANOTHER LAP AROUND THE SUN", "WISH HARDER"], hi: ["पार्टी तो बनती है", "जन्मदिन मुबारक", "केक कटेगा"], hing: ["Party toh banti hai", "Gift nahi, aana zaroori", "Dance floor pe milte hain"], soft: ["Another year, another cake", "Make a wish", "Come celebrate"], noun: "BIRTHDAY", detail: "CAKE · MUSIC · CHAOS" },
  podcast: { loud: ["MIC CHECK. BRAIN CHECK.", "HOT TAKES, WARM MICS", "WE SAID IT", "UNFILTERED, MOSTLY"], hi: ["बातें, बस बातें", "सुनो तो सही", "गपशप लाइव"], hing: ["Baatein kam, bakwaas zyada", "Headphones lagao, sun lo", "Episode lamba hai, chai bana lo"], soft: ["Long talks, good company", "Press play, stay a while", "A conversation, recorded"], noun: "MIC", detail: "NEW EPISODE · EVERYWHERE YOU LISTEN" },
  work: { loud: ["WE'RE HIRING. YES, YOU.", "NO NINJAS. JUST HUMANS.", "DESIGNERS WANTED", "YOUR DESK IS READY"], hi: ["हमें आपकी ज़रूरत है", "नौकरी हाज़िर है", "आ जाओ टीम में"], hing: ["CV bhejo, chai pilayenge", "Kaam acha, log ache", "Notice period? Hum wait karenge"], soft: ["Join a kind team", "Come make good things", "A seat at the table"], noun: "HIRE", detail: "REMOTE OK · DM TO APPLY" },
  wedding: { loud: ["TWO HEARTS. ONE BUFFET.", "SAVE THE DATE", "SHAADI SEASON IS OPEN", "THEY SAID YES"], hi: ["शुभ विवाह", "शादी में ज़रूर आना", "दो दिल, एक दावत"], hing: ["Mummy ne bola hai, aana hai", "Shaadi mein zaroor aana", "Sangeet pe naachna compulsory"], soft: ["Together, at last", "Save the date", "Forever starts here"], noun: "SHAADI", detail: "SANGEET · SHAADI · DAWAT" },
};

const MANIFESTOS = ["nobody cares unless you show up.", "win or die. (mostly win.)", "legends arrive early.", "no subs. no excuses.", "play like your mum is watching."];

const title = (s: string) => s.toLowerCase().replace(/(^|\s)\S/g, (m) => m.toUpperCase());
const short = (s: string, n = 4) => s.split(/\s+/).slice(0, n).join(" ");

export function topicOf(text: string): Topic {
  const t = topicFor(text);
  if (!t) return "other";
  if (t === "portrait") return "work";
  return t as Topic;
}

function bankFor(topic: Topic, idea: Idea): Bank {
  if (topic !== "other") return BANKS[topic];
  const H = short(idea.headline.toUpperCase(), 3);
  return {
    loud: [`${H}. BE THERE.`, `${H} OR NOTHING`, `${H}!!!`, `IT'S ${H} TIME`],
    hi: ["धमाका होगा", "ज़रूर आना", "बड़ी खबर"],
    hing: [`${title(H)} hai, aana padega`, "Aa jao, maza aayega", "Sab log aa rahe hain"],
    soft: [title(H), `An evening of ${title(H).toLowerCase()}`, "You're invited"],
    noun: H.split(" ")[0], detail: "DETAILS IN THE DM",
  };
}

export interface Copy {
  head: string;
  sub: string;
  kicker: string;
  cta: string;
  manifesto: string;
  /** "SATURDAY · 10AM" or a topic line */
  when: string;
  where: string;
  /** Plain-title headline, for small labels */
  plain: string;
  noun: string;
  topic: Topic;
  /** Episode / batch / percentage, when the line has a number worth shouting */
  number?: string;
}

/** Copy for one recipe; `angle` rotates the pun so re-juice never repeats a line. */
export function writeCopy(recipe: RecipeKey, idea: Idea, angle: number): Copy {
  const topic = topicOf(idea.raw);
  const b = bankFor(topic, idea);
  const pick = <T,>(a: T[], k = 0) => a[(angle + k) % a.length];
  const H = short(idea.headline.toUpperCase(), 4);
  const num = idea.raw.match(/(?:episode|ep|batch|no\.?|#)\s*(\d+)/i)?.[1] ?? idea.price?.match(/\d+/)?.[0];
  const base = {
    manifesto: pick(MANIFESTOS),
    when: idea.when || b.detail,
    where: idea.place?.toUpperCase() ?? "",
    plain: title(idea.headline),
    noun: b.noun,
    topic,
    number: num,
    cta: idea.price ?? "",
  };
  switch (recipe) {
    case "nazar": return { ...base, kicker: pick(["NO", "NO BAD VIBES", "NO BURI NAZAR"]), head: pick(b.hi), sub: pick(b.hing), cta: idea.price ?? pick(["AA JAO", "FREE ENTRY", "SAB AAO"]) };
    case "tapri": return { ...base, kicker: pick(["विशेष सूचना", "ताज़ा खबर", "सुनिए सुनिए"]), head: pick(b.hi, 1), sub: pick(b.loud), cta: idea.price ? `RATE: ${idea.price}` : pick(["HORN OK PLEASE", "SABKE LIYE", "FULL PAISA VASOOL"]) };
    case "stadium": return { ...base, kicker: pick(["SEASON 01", "MATCHDAY", "THE FINAL"]), head: pick(b.loud), sub: H };
    case "brutal": return { ...base, kicker: pick(["NOTICE NO. 01", "MEMO / URGENT", "BULLETIN"]), head: pick(b.loud, 1), sub: pick(b.soft) };
    case "swiss": return { ...base, kicker: pick(["EDITION 01", "SERIES 02", "NO. 07"]), head: H, sub: pick(b.soft) };
    case "trippy": return { ...base, kicker: pick(["main_character.exe", "vibes.exe", "invite.exe"]), head: pick(["I AM THE MAIN CHARACTER", `${b.noun} IS MY PERSONALITY`, "MANIFESTING THIS", `I CHOOSE ${b.noun}`]), sub: pick(b.soft) };
    case "neo": return { ...base, kicker: pick(["1 new event", "You've been invited", "Reminder"]), head: pick([title(H), ...b.soft]), sub: pick(b.hing), cta: pick(["TAP TO ATTEND", "I'M IN", "COUNT ME IN"]) };
    case "pixel": return { ...base, kicker: pick(["LEVEL 01", "STAGE 02", "WORLD 1-1"]), head: pick([`LEVEL UP: ${b.noun}`, `PLAYER 1: ${b.noun}`, `${b.noun} UNLOCKED`]), sub: pick(["PRESS START", "INSERT COIN", "CONTINUE? YES"]) };
    case "sticker": return { ...base, kicker: pick(["LIMITED DROP", "NEW DROP", "COLLAB"]), head: pick(b.loud, 2), sub: pick(b.hing, 1), cta: idea.price ?? pick(["NO REFUNDS ON VIBES", "SOLD OUT SOON", "GOOD MOOD ONLY"]) };
    case "glossy": {
      // glossy wants two or three words, never a phrase cut in half
      const heads = [title(short(H, 3)), ...b.soft.filter((x) => x.split(/\s+/).length <= 3)];
      const head = pick(heads);
      const subs = b.soft.filter((x) => x.toLowerCase() !== head.toLowerCase());
      return { ...base, kicker: pick(["SOFT LAUNCH", "FRESH", "NEW"]), head, sub: pick(subs.length ? subs : b.hing) };
    }
  }
}
