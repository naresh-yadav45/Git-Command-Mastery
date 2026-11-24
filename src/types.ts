export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type Kind = 'porcelain' | 'plumbing' | 'hook' | 'ancillary';

export interface Flag { flag: string; purpose: string; when: string; example: string }
export interface ErrorItem { msg: string; reason: string; fix: string; prevent: string }
export interface Link { title: string; url: string }

export interface Cmd {
  slug: string;
  name: string;
  categories: number[];
  difficulty: Difficulty;
  kind: Kind;
  since: string;
  common: boolean;
  summary: string;
  why: string;
  avoid: string;
  syntax: string[];
  flags: Flag[];
  working: { wd: string; index: string; repo: string; remote: string };
  basic: { cmd: string; explain: string };
  real: { scenario: string; cmds: string[] };
  output: { text: string; note: string };
  errors: ErrorItem[];
  related: { slug: string; diff: string }[];
  docs: string;
  book: Link[];
  warning?: string;
  keywords: string;
}

export interface Category { id: number; name: string; blurb: string; difficulty: Difficulty }
