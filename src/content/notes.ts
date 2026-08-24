// Short, kid-friendly revision notes per lesson. Very simple language.
// Rendered on /lesson/[id]/notes and downloadable (print-to-PDF or .txt).

export interface LessonNotes {
  summary: string; // one simple line
  points: string[]; // key ideas
  syntax?: { pattern: string; means: string }[]; // code -> plain meaning
  example?: { sql: string; does: string };
  remember: string; // one-liner to memorise
}

export const LESSON_NOTES: Record<string, LessonNotes> = {
  u1l1: {
    summary: "A table is a grid that holds data.",
    points: [
      "Every table has columns and rows.",
      "A column is a kind of info (like name or score). Columns sit at the top.",
      "A row is one entry (like one song). Each row is one line.",
    ],
    remember: "Columns = across the top. Rows = one line each.",
  },
  u1l2: {
    summary: "SELECT means 'show me'. FROM says which table to look in.",
    points: [
      "SELECT picks the column you want.",
      "FROM tells it which table to use.",
      "Use a comma to grab more than one column.",
    ],
    syntax: [
      { pattern: "SELECT title FROM songs", means: "show me the title column" },
      { pattern: "SELECT title, artist FROM songs", means: "show me two columns" },
    ],
    example: { sql: "SELECT name FROM students;", does: "shows every student's name" },
    remember: "Shape: SELECT <column> FROM <table>.",
  },
  u1l3: {
    summary: "The star * means 'all the columns'.",
    points: ["* is short for every column.", "No WHERE means every row comes too."],
    syntax: [{ pattern: "SELECT * FROM songs", means: "the whole table" }],
    example: { sql: "SELECT * FROM movies;", does: "shows the entire movies table" },
    remember: "* = everything.",
  },
  u2l1: {
    summary: "ORDER BY sorts your rows.",
    points: [
      "ORDER BY puts rows in order by a column.",
      "Add DESC for biggest first (high to low).",
      "Without DESC it goes smallest first (low to high).",
    ],
    syntax: [
      { pattern: "ORDER BY score DESC", means: "highest score on top" },
      { pattern: "ORDER BY name", means: "A to Z" },
    ],
    example: { sql: "SELECT name, score FROM students ORDER BY score DESC;", does: "a leaderboard, top score first" },
    remember: "DESC = high to low. No DESC = low to high.",
  },
  u2l2: {
    summary: "LIMIT keeps only the first few rows.",
    points: ["LIMIT 3 shows just 3 rows.", "Sort first, then LIMIT, to get the top few."],
    syntax: [{ pattern: "ORDER BY score DESC LIMIT 3", means: "the top 3 scores" }],
    example: { sql: "SELECT name FROM students ORDER BY score DESC LIMIT 1;", does: "the single top student" },
    remember: "Top-N = ORDER BY … DESC + LIMIT N.",
  },
  u3l1: {
    summary: "WHERE keeps only the rows you want.",
    points: [
      "WHERE checks a condition. True rows stay, the rest go.",
      "Compare with >  <  >=  <=  =.",
      "> means more than. >= means 'or equal to' as well.",
    ],
    syntax: [
      { pattern: "WHERE score > 90", means: "only scores above 90" },
      { pattern: "WHERE city = 'Delhi'", means: "only Delhi (text in quotes)" },
    ],
    example: { sql: "SELECT name FROM students WHERE score >= 90;", does: "students who scored 90 or more" },
    remember: "Text values go in 'single quotes'.",
  },
  u3l2: {
    summary: "AND and OR join two conditions.",
    points: ["AND = both must be true.", "OR = at least one is true."],
    syntax: [
      { pattern: "WHERE class = 10 AND score > 80", means: "class 10 AND did well" },
      { pattern: "WHERE city = 'Delhi' OR city = 'Pune'", means: "in either city" },
    ],
    example: { sql: "SELECT name FROM students WHERE city='Delhi' OR city='Pune';", does: "students from Delhi or Pune" },
    remember: "AND = stricter (both). OR = wider (either).",
  },
  u3l3: {
    summary: "LIKE matches text patterns. IN checks a short list.",
    points: [
      "LIKE looks at text patterns.",
      "% is a wildcard — it means 'anything'.",
      "'R%' means starts with R.",
      "IN ('a','b') means the value is in that list.",
    ],
    syntax: [
      { pattern: "WHERE title LIKE 'R%'", means: "titles starting with R" },
      { pattern: "WHERE genre IN ('sci-fi','drama')", means: "either genre" },
    ],
    example: { sql: "SELECT title FROM movies WHERE title LIKE 'R%';", does: "movies whose name starts with R" },
    remember: "% = anything. IN = a shortlist.",
  },
};

export function getNotes(id: string): LessonNotes | undefined {
  return LESSON_NOTES[id];
}
