// ---------------------------------------------------------------------------
// Querly curriculum — basic -> medium, puzzle-first AND game-first, gamified.
// Each lesson opens with a ~45s animated character explainer (Bit), then a mix
// of interactive games (tap-to-filter, drag-to-sort, match-up) and puzzles.
// Every SQL challenge runs against a real in-browser SQLite dataset.
// ---------------------------------------------------------------------------

export type ChallengeType =
  | "build"
  | "free"
  | "fixbug"
  | "predict"
  | "choice"
  // interactive games:
  | "tap" // tap the rows that match a condition
  | "order" // put cards in the right order
  | "match"; // match cards to their meaning

export interface Challenge {
  id: string;
  type: ChallengeType;
  prompt: string;
  story?: string;
  starterSql?: string;
  tokens?: string[];
  /** Canonical correct SQL (SQL challenges only). */
  solutionSql?: string;
  options?: { label: string; correct: boolean }[];
  // --- game payloads ---
  rows?: { label: string; match: boolean }[]; // tap
  items?: string[]; // order (stored in CORRECT order)
  pairs?: { left: string; right: string }[]; // match
  hint: string;
  explain: string;
  xp: number;
}

/** One beat of the animated explainer. */
export interface ExplainerScene {
  text: string;
  /** Which canned animation to show (SQL stage: rows/columns/filter/sort; AI stage: data/learn/think/guess). */
  anim?: "talk" | "rows" | "columns" | "star" | "filter" | "sort" | "data" | "learn" | "think" | "guess";
}
export interface Explainer {
  scenes: ExplainerScene[];
  /** Which visual world the animated stage should use. Defaults to "sql". */
  theme?: "sql" | "ai";
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  concept: string;
  explainer?: Explainer;
  /** SQL lessons only. AI lessons have no dataset. */
  datasetSql?: string;
  tables?: string[];
  challenges: Challenge[];
}

export interface Unit {
  id: string;
  index: number;
  title: string;
  blurb: string;
  color: string;
  lessons: Lesson[];
}

// --- Shared datasets ------------------------------------------------------

const PLAYLIST = `
CREATE TABLE songs (id INTEGER, title TEXT, artist TEXT, plays INTEGER, mins REAL);
INSERT INTO songs VALUES
 (1,'Midnight Drive','Neon Vale',24000,3.4),
 (2,'Paper Planes','Kite',9800,2.9),
 (3,'Gravity','Neon Vale',54000,4.1),
 (4,'Sunburn','Kite',3200,3.0),
 (5,'Echoes','Lo-Fi Cat',72000,2.5),
 (6,'Focus','Lo-Fi Cat',15000,5.2);
`;

const STUDENTS = `
CREATE TABLE students (id INTEGER, name TEXT, class INTEGER, score INTEGER, city TEXT);
INSERT INTO students VALUES
 (1,'Aarav',10,92,'Delhi'),
 (2,'Diya',10,68,'Mumbai'),
 (3,'Kabir',11,88,'Delhi'),
 (4,'Meera',11,95,'Pune'),
 (5,'Rohan',10,74,'Mumbai'),
 (6,'Sara',12,81,'Delhi'),
 (7,'Vihaan',12,59,'Pune');
`;

const MOVIES = `
CREATE TABLE movies (id INTEGER, title TEXT, genre TEXT, year INTEGER, rating REAL);
INSERT INTO movies VALUES
 (1,'Rocket Boys','sci-fi',2022,8.6),
 (2,'The Last Match','sports',2019,7.4),
 (3,'Neon Nights','sci-fi',2023,6.9),
 (4,'Crown Road','drama',2021,8.1),
 (5,'Pixel Heart','sci-fi',2020,7.8),
 (6,'Homecoming','drama',2018,6.2);
`;

// --- Curriculum -----------------------------------------------------------

export const CURRICULUM: Unit[] = [
  {
    id: "u1",
    index: 1,
    title: "Meet your data",
    blurb: "Tables, rows and columns.",
    color: "#cbe94b",
    lessons: [
      {
        id: "u1l1",
        unitId: "u1",
        title: "Rows & columns",
        subtitle: "A table is just a grid",
        concept: "Data lives in tables. Columns are the fields; rows are the entries.",
        explainer: {
          scenes: [
            { text: "Hi! I'm Bit. Let's meet a table.", anim: "talk" },
            { text: "A table is just a grid — like a list on your phone.", anim: "rows" },
            { text: "The words at the top are columns. They're the KIND of info.", anim: "columns" },
            { text: "Each line under them is a row — one whole item.", anim: "rows" },
            { text: "That's it. A table = columns + rows. Let's play!", anim: "star" },
          ],
        },
        datasetSql: PLAYLIST,
        tables: ["songs"],
        challenges: [
          {
            id: "u1l1g1",
            type: "match",
            prompt: "Match each word to what it means. Tap one, then its partner.",
            pairs: [
              { left: "table", right: "the whole grid of data" },
              { left: "column", right: "a field, like 'score'" },
              { left: "row", right: "one entry, like one song" },
            ],
            hint: "A column is at the top; a row is one line underneath.",
            explain: "Columns are the kinds of info; rows are the individual records. That's every table, ever.",
            xp: 20,
          },
          {
            id: "u1l1c2",
            type: "choice",
            prompt: "How many ROWS of songs are in this playlist?",
            solutionSql: "SELECT COUNT(*) FROM songs;",
            options: [
              { label: "6", correct: true },
              { label: "5", correct: false },
              { label: "72000", correct: false },
            ],
            hint: "Count the entries in the table — one row per song.",
            explain: "6 songs, so 6 rows. Each row is one complete record.",
            xp: 10,
          },
          {
            id: "u1l1c3",
            type: "build",
            prompt: "Build a query that shows the title of every song.",
            tokens: ["SELECT", "title", "FROM", "songs"],
            solutionSql: "SELECT title FROM songs;",
            hint: "The shape is always: SELECT <column> FROM <table>.",
            explain: "SELECT picks the column, FROM names the table. You just wrote real SQL!",
            xp: 15,
          },
        ],
      },
      {
        id: "u1l2",
        unitId: "u1",
        title: "Your first SELECT",
        subtitle: "Grab the columns you want",
        concept: "SELECT asks a table for data. List the column(s), then say the table with FROM.",
        explainer: {
          scenes: [
            { text: "SELECT means 'show me'.", anim: "talk" },
            { text: "Tell it which column you want.", anim: "columns" },
            { text: "SELECT title → show me the titles.", anim: "columns" },
            { text: "FROM tells it which table to look in.", anim: "rows" },
            { text: "SELECT title FROM songs. Easy!", anim: "star" },
          ],
        },
        datasetSql: PLAYLIST,
        tables: ["songs"],
        challenges: [
          {
            id: "u1l2c1",
            type: "build",
            prompt: "Show the title and the artist of every song.",
            tokens: ["SELECT", "title,", "artist", "FROM", "songs"],
            solutionSql: "SELECT title, artist FROM songs;",
            hint: "Separate two columns with a comma: SELECT a, b FROM table.",
            explain: "Commas let you grab several columns at once.",
            xp: 15,
          },
          {
            id: "u1l2c2",
            type: "free",
            prompt: "Now you: show just the artist column for every song.",
            starterSql: "SELECT ____ FROM songs;",
            solutionSql: "SELECT artist FROM songs;",
            hint: "Replace the blank with the column name: artist.",
            explain: "Typing SQL from scratch is the real skill — nailed it.",
            xp: 20,
          },
        ],
      },
      {
        id: "u1l3",
        unitId: "u1",
        title: "Select everything",
        subtitle: "The magic star",
        concept: "Use * (star) to mean 'all columns'. No filter means all rows too.",
        explainer: {
          scenes: [
            { text: "Want everything? Use a star: *", anim: "talk" },
            { text: "* means 'all the columns'.", anim: "columns" },
            { text: "SELECT * FROM songs = the whole table.", anim: "star" },
            { text: "No filter means all rows come too.", anim: "rows" },
            { text: "One line, whole table. Magic.", anim: "star" },
          ],
        },
        datasetSql: PLAYLIST,
        tables: ["songs"],
        challenges: [
          {
            id: "u1l3c1",
            type: "predict",
            prompt: "What will `SELECT * FROM songs;` give you?",
            solutionSql: "SELECT * FROM songs;",
            options: [
              { label: "Every column of every song", correct: true },
              { label: "Only the title column", correct: false },
              { label: "Just the first row", correct: false },
            ],
            hint: "The star * means 'all columns'. No WHERE means all rows.",
            explain: "* returns all columns; with no filter, all rows. The full table.",
            xp: 15,
          },
          {
            id: "u1l3c2",
            type: "free",
            prompt: "Write a query that returns the whole songs table.",
            starterSql: "",
            solutionSql: "SELECT * FROM songs;",
            hint: "Use the star: SELECT * FROM songs;",
            explain: "A whole table in 3 words. That's the power of SQL.",
            xp: 20,
          },
        ],
      },
    ],
  },
  {
    id: "u2",
    index: 2,
    title: "SELECT like a pro",
    blurb: "Sort results and keep the top few.",
    color: "#cbe94b",
    lessons: [
      {
        id: "u2l1",
        unitId: "u2",
        title: "Sort it out",
        subtitle: "ORDER BY",
        concept: "ORDER BY sorts your rows. Add DESC for high-to-low (great for leaderboards).",
        explainer: {
          scenes: [
            { text: "Let's sort some rows.", anim: "talk" },
            { text: "ORDER BY puts rows in order.", anim: "sort" },
            { text: "Add DESC for biggest first.", anim: "sort" },
            { text: "Perfect for leaderboards — top score on top.", anim: "sort" },
            { text: "Sorted! Let's try it.", anim: "star" },
          ],
        },
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u2l1g1",
            type: "order",
            prompt: "Leaderboard time! Put these scores in order — highest on top.",
            items: ["Meera — 95", "Aarav — 92", "Kabir — 88", "Sara — 81", "Rohan — 74"],
            hint: "Highest first means descending order (like ORDER BY score DESC).",
            explain: "That's exactly what ORDER BY score DESC does — biggest number to the top.",
            xp: 25,
          },
          {
            id: "u2l1c1",
            type: "build",
            prompt: "List names and scores, highest score first.",
            tokens: ["SELECT", "name,", "score", "FROM", "students", "ORDER BY", "score", "DESC"],
            solutionSql: "SELECT name, score FROM students ORDER BY score DESC;",
            hint: "ORDER BY <column> DESC sorts from biggest to smallest.",
            explain: "DESC = descending = high to low. Exactly how a leaderboard works.",
            xp: 20,
          },
        ],
      },
      {
        id: "u2l2",
        unitId: "u2",
        title: "Just the top few",
        subtitle: "LIMIT",
        concept: "LIMIT keeps only the first N rows. Sort first, then LIMIT to get 'the top 3'.",
        explainer: {
          scenes: [
            { text: "Only want the top few?", anim: "talk" },
            { text: "LIMIT keeps just the first rows.", anim: "rows" },
            { text: "LIMIT 3 = only 3 rows.", anim: "rows" },
            { text: "Sort first, then LIMIT = top 3.", anim: "sort" },
            { text: "Top-N, done. Let's go!", anim: "star" },
          ],
        },
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u2l2c1",
            type: "build",
            prompt: "Show the TOP 3 students by score.",
            tokens: ["SELECT", "name,", "score", "FROM", "students", "ORDER BY", "score", "DESC", "LIMIT", "3"],
            solutionSql: "SELECT name, score FROM students ORDER BY score DESC LIMIT 3;",
            hint: "Sort with ORDER BY score DESC, then cut with LIMIT 3.",
            explain: "ORDER BY + LIMIT is the classic 'top-N' combo. You'll use it a lot.",
            xp: 25,
          },
          {
            id: "u2l2c2",
            type: "free",
            prompt: "Write a query for the single LOWEST-scoring student's name and score.",
            starterSql: "SELECT name, score FROM students ORDER BY ____ LIMIT 1;",
            solutionSql: "SELECT name, score FROM students ORDER BY score LIMIT 1;",
            hint: "Lowest first is ascending — ORDER BY score (no DESC), then LIMIT 1.",
            explain: "Without DESC, sorting goes low-to-high, so LIMIT 1 grabs the smallest.",
            xp: 25,
          },
        ],
      },
    ],
  },
  {
    id: "u3",
    index: 3,
    title: "Ask sharper questions",
    blurb: "WHERE, AND/OR, LIKE and IN.",
    color: "#cbe94b",
    lessons: [
      {
        id: "u3l1",
        unitId: "u3",
        title: "The WHERE filter",
        subtitle: "Keep only rows you care about",
        concept: "WHERE keeps only rows where a condition is true. Compare with >, <, >=, <=, =.",
        explainer: {
          scenes: [
            { text: "Now let's filter data.", anim: "talk" },
            { text: "WHERE keeps only the rows you want.", anim: "filter" },
            { text: "Like: WHERE score > 90.", anim: "filter" },
            { text: "Rows that fail just disappear.", anim: "filter" },
            { text: "Keep what matters. Play time!", anim: "star" },
          ],
        },
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u3l1g1",
            type: "tap",
            prompt: "Tap every student who scored MORE than 90. (Then hit Catch!)",
            rows: [
              { label: "Aarav — 92", match: true },
              { label: "Diya — 68", match: false },
              { label: "Kabir — 88", match: false },
              { label: "Meera — 95", match: true },
              { label: "Rohan — 74", match: false },
              { label: "Sara — 81", match: false },
              { label: "Vihaan — 59", match: false },
            ],
            hint: "More than 90 means strictly above 90 — so 90 itself doesn't count.",
            explain: "You just did WHERE score > 90 by hand — only Aarav (92) and Meera (95) pass.",
            xp: 25,
          },
          {
            id: "u3l1c1",
            type: "build",
            prompt: "Show the names of students who scored more than 90.",
            tokens: ["SELECT", "name", "FROM", "students", "WHERE", "score", ">", "90"],
            solutionSql: "SELECT name FROM students WHERE score > 90;",
            hint: "WHERE <column> > <number> keeps rows above that number.",
            explain: "WHERE score > 90 keeps Aarav and Meera. Everyone else is filtered out.",
            xp: 20,
          },
          {
            id: "u3l1c2",
            type: "fixbug",
            prompt: "This should show 90-and-above scorers, but it shows the LOW ones. Fix it.",
            story: "Data detective: the honour-roll list came out upside down!",
            starterSql: "SELECT name, score FROM students WHERE score < 90;",
            solutionSql: "SELECT name, score FROM students WHERE score >= 90;",
            hint: "The arrow points the wrong way. '90 and above' means greater-than-or-equal.",
            explain: "'< 90' is below 90. Flip it to '>= 90' for 90 and above. One symbol, big change.",
            xp: 25,
          },
        ],
      },
      {
        id: "u3l2",
        unitId: "u3",
        title: "AND / OR",
        subtitle: "Combine conditions",
        concept: "AND needs both conditions true. OR needs at least one.",
        explainer: {
          scenes: [
            { text: "Two rules at once?", anim: "talk" },
            { text: "AND = both must be true.", anim: "filter" },
            { text: "OR = at least one is true.", anim: "filter" },
            { text: "Mix them to ask exact questions.", anim: "filter" },
            { text: "Sharp questions. Let's try!", anim: "star" },
          ],
        },
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u3l2g1",
            type: "tap",
            prompt: "Tap everyone who lives in Delhi OR Pune. (Then hit Catch!)",
            rows: [
              { label: "Aarav — Delhi", match: true },
              { label: "Diya — Mumbai", match: false },
              { label: "Kabir — Delhi", match: true },
              { label: "Meera — Pune", match: true },
              { label: "Rohan — Mumbai", match: false },
              { label: "Sara — Delhi", match: true },
              { label: "Vihaan — Pune", match: true },
            ],
            hint: "OR means a row counts if EITHER city matches. Only Mumbai is left out.",
            explain: "That's WHERE city = 'Delhi' OR city = 'Pune' — five rows pass, two don't.",
            xp: 25,
          },
          {
            id: "u3l2c1",
            type: "build",
            prompt: "Find class-10 students who scored above 80.",
            tokens: ["SELECT", "name", "FROM", "students", "WHERE", "class", "=", "10", "AND", "score", ">", "80"],
            solutionSql: "SELECT name FROM students WHERE class = 10 AND score > 80;",
            hint: "Both conditions must hold, so join them with AND.",
            explain: "AND means both are true — class 10 AND score over 80. Only Aarav qualifies.",
            xp: 25,
          },
          {
            id: "u3l2c2",
            type: "free",
            prompt: "Show names of students who live in Delhi OR Pune.",
            starterSql: "SELECT name FROM students WHERE city = 'Delhi' ____ city = 'Pune';",
            solutionSql: "SELECT name FROM students WHERE city = 'Delhi' OR city = 'Pune';",
            hint: "Either city counts, so use OR. Text goes in 'single quotes'.",
            explain: "OR keeps a row if at least one side is true. Text needs single quotes.",
            xp: 25,
          },
        ],
      },
      {
        id: "u3l3",
        unitId: "u3",
        title: "LIKE & IN",
        subtitle: "Patterns and shortlists",
        concept: "LIKE matches text patterns with % as a wildcard. IN checks a value against a list.",
        explainer: {
          scenes: [
            { text: "Matching text? Use LIKE.", anim: "talk" },
            { text: "'R%' means starts with R.", anim: "filter" },
            { text: "% is a wildcard — 'anything'.", anim: "filter" },
            { text: "IN checks a short list: IN ('a','b').", anim: "columns" },
            { text: "Patterns and lists. Let's play!", anim: "star" },
          ],
        },
        datasetSql: MOVIES,
        tables: ["movies"],
        challenges: [
          {
            id: "u3l3g1",
            type: "match",
            prompt: "Match each pattern to what it does. Tap one, then its partner.",
            pairs: [
              { left: "LIKE 'R%'", right: "starts with R" },
              { left: "%", right: "any characters" },
              { left: "IN ('a','b')", right: "is in this list" },
            ],
            hint: "% is the wildcard; IN checks membership in a list.",
            explain: "LIKE + % match text patterns; IN is a tidy shortcut for many ORs.",
            xp: 20,
          },
          {
            id: "u3l3c1",
            type: "build",
            prompt: "Find movies whose title starts with the letter 'R'.",
            tokens: ["SELECT", "title", "FROM", "movies", "WHERE", "title", "LIKE", "'R%'"],
            solutionSql: "SELECT title FROM movies WHERE title LIKE 'R%';",
            hint: "'R%' means 'R followed by anything'. The % is a wildcard.",
            explain: "LIKE 'R%' matches any title starting with R — here, 'Rocket Boys'.",
            xp: 25,
          },
          {
            id: "u3l3c2",
            type: "free",
            prompt: "Show titles of movies in the 'sci-fi' or 'drama' genre — use IN.",
            starterSql: "SELECT title FROM movies WHERE genre IN (____);",
            solutionSql: "SELECT title FROM movies WHERE genre IN ('sci-fi','drama');",
            hint: "IN takes a comma-separated list in brackets: IN ('sci-fi','drama').",
            explain: "IN is a clean shortcut for several OR checks on the same column.",
            xp: 30,
          },
        ],
      },
    ],
  },
];

// --- Helpers --------------------------------------------------------------

export const ALL_LESSONS: Lesson[] = CURRICULUM.flatMap((u) => u.lessons);

export function getLesson(id: string): Lesson | undefined {
  return ALL_LESSONS.find((l) => l.id === id);
}

export function getUnit(id: string): Unit | undefined {
  return CURRICULUM.find((u) => u.id === id);
}

export function lessonOrder(): string[] {
  return ALL_LESSONS.map((l) => l.id);
}

export function nextLessonId(id: string): string | null {
  const order = lessonOrder();
  const i = order.indexOf(id);
  if (i === -1 || i === order.length - 1) return null;
  return order[i + 1];
}
