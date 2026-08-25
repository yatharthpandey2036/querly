// Query Race question pool — quick basic recall, mixing SQL + AI.
export interface RaceQ {
  q: string;
  options: string[];
  answer: number; // index of correct option
}

export const RACE_QUESTIONS: RaceQ[] = [
  { q: "Which keyword picks columns?", options: ["SELECT", "WHERE", "ORDER BY"], answer: 0 },
  { q: "Which keyword filters rows?", options: ["FROM", "WHERE", "LIMIT"], answer: 1 },
  { q: "Highest first — which do you add?", options: ["ASC", "DESC", "TOP"], answer: 1 },
  { q: "* means…", options: ["all columns", "first row", "nothing"], answer: 0 },
  { q: "Keep only the top 3 rows?", options: ["LIMIT 3", "TOP 3", "ONLY 3"], answer: 0 },
  { q: "Both conditions true?", options: ["OR", "AND", "NOT"], answer: 1 },
  { q: "'R%' matches titles that…", options: ["end with R", "start with R", "contain r"], answer: 1 },
  { q: "Text values go in…", options: ["\"double quotes\"", "'single quotes'", "no quotes"], answer: 1 },
  { q: "AI learns from…", options: ["examples (data)", "magic", "nothing"], answer: 0 },
  { q: "AI mainly…", options: ["never errs", "finds patterns & guesses", "reads minds"], answer: 1 },
  { q: "Bad data gives…", options: ["good guesses", "bad guesses", "no change"], answer: 1 },
  { q: "A prompt is…", options: ["the AI's chip", "your instruction to AI", "a password"], answer: 1 },
  { q: "A good prompt is…", options: ["clear & specific", "vague", "all caps"], answer: 0 },
  { q: "Unfair, one-sided data causes…", options: ["bias", "speed", "nothing"], answer: 0 },
  { q: "IN ('a','b') checks…", options: ["a pattern", "a list", "a number"], answer: 1 },
  { q: "Which sorts rows?", options: ["ORDER BY", "SELECT", "AND"], answer: 0 },
];
