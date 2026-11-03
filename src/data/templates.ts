import type { Template } from "../types";
import { blockCapitals } from "./tpl/blockCapitals";
import { sundayIssue } from "./tpl/sundayIssue";
import { cutPaste } from "./tpl/cutPaste";
import { bombay } from "./tpl/bombay";
import { quietMoney } from "./tpl/quietMoney";
import { brainrot } from "./tpl/brainrot";
import heroes from "./tpl/heroes.json";

// 20 Style DNA heroes (STYLE_DNA.md), built with real font metrics by
// src/dna/heroes.ts and frozen to JSON (scripts/dump-heroes.mjs), plus the 8
// strongest originals from the first six directions. The other 16 originals
// were retired: next to the heroes they looked flat (REVIEW.md).
const HEROES = heroes as unknown as Template[];

const KEEP = ["bc-rave", "si-longread", "cp-gig", "bt-fest", "bt-chai", "qm-investor", "br-clickbait", "si-resume"];
const ALL_OLD = [blockCapitals, sundayIssue, cutPaste, bombay, quietMoney, brainrot].flat();
const CLASSICS = KEEP.map((id) => ALL_OLD.find((t) => t.id === id)!).map((t) => ({ ...t, tags: [...(t.tags ?? []), ...(t.id === "si-resume" ? ["resume"] : [])] }));

// heroes first, alternating poster / other format so neighbours differ
const posters = HEROES.filter((t) => t.format === "Poster");
const others = HEROES.filter((t) => t.format !== "Poster");
export const TEMPLATES: Template[] = [...posters.flatMap((p, i) => [p, others[i]].filter(Boolean)), ...CLASSICS];

export const STYLE_SETS = { blockCapitals, sundayIssue, cutPaste, bombay, quietMoney, brainrot };
export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
