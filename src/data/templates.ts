import type { Template } from "../types";
import { blockCapitals } from "./tpl/blockCapitals";
import { sundayIssue } from "./tpl/sundayIssue";
import { cutPaste } from "./tpl/cutPaste";
import { bombay } from "./tpl/bombay";
import { quietMoney } from "./tpl/quietMoney";
import { brainrot } from "./tpl/brainrot";

// 24 original templates: 4 per style direction (REFERENCES.md). Each is plain
// data authored with src/data/tpl/dsl.ts, so adding more needs no code changes.
export const STYLE_SETS = { blockCapitals, sundayIssue, cutPaste, bombay, quietMoney, brainrot };

// Interleave the directions so neighbouring tiles never share a style.
const sets = Object.values(STYLE_SETS);
export const TEMPLATES: Template[] = Array.from({ length: 4 }, (_, i) => sets.map((s) => s[i])).flat();

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
