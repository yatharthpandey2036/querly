// ---------------------------------------------------------------------------
// Querly curriculum — basic -> medium, puzzle-first, gamified.
// Every challenge runs against a real in-browser SQLite dataset (see /lib/sqlEngine).
// Difficulty stays in the "everyday useful" band: SELECT, columns, WHERE, AND/OR, LIKE, IN.
// ---------------------------------------------------------------------------

export type ChallengeType = "build" | "free" | "fixbug" | "predict" | "choice";

export interface Challenge {
  id: string;
  type: ChallengeType;
  /** The task, written for a teenager. */
  prompt: string;
  /** Optional story wrapper for flavour. */
  story?: string;
  /** Pre-filled SQL for fixbug / scaffold for free. */
  starterSql?: string;
  /** Draggable tokens for `build` challenges. */
  tokens?: string[];
  /** Canonical correct SQL — used to compute the expected result set. */
  solutionSql: string;
  /** Options for `predict` / `choice` challenges. */
  options?: { label: string; correct: boolean }[];
  /** Curated hint (never the answer) — also the AI tutor's fallback. */
  hint: string;
  /** The "why", revealed after a correct answer. */
  explain: string;
  xp: number;
}

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  subtitle: string;
  /** Short teaching shown before the challenges. */
  concept: string;
  /** CREATE + INSERT statements that build this lesson's sandbox. */
  datasetSql: string;
  /** Tables to show in the "your data" preview. */
  tables: string[];
  challenges: Challenge[];
}

export interface Unit {
  id: string;
  index: number;
  title: string;
  blurb: string;
  /** Accent hex used on the skill tree node. */
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
    blurb: "Tables, rows and columns — using things you already know.",
    color: "#0CA678",
    lessons: [
      {
        id: "u1l1",
        unitId: "u1",
        title: "Rows & columns",
        subtitle: "A table is just a neat grid",
        concept:
          "Data lives in tables. Every table is a grid: columns are the fields (like 'title' or 'plays'), and rows are the individual entries (one song each).",
        datasetSql: PLAYLIST,
        tables: ["songs"],
        challenges: [
          {
            id: "u1l1c1",
            type: "choice",
            prompt: "In the songs table, which of these is a COLUMN?",
            solutionSql: "SELECT artist FROM songs LIMIT 1;",
            options: [
              { label: "plays", correct: true },
              { label: "Gravity", correct: false },
              { label: "72000", correct: false },
            ],
            hint: "A column is a field name at the top of the grid. A row is one entry underneath it.",
            explain:
              "'plays' is a column (a field every song has). 'Gravity' and 72000 are values sitting inside rows.",
            xp: 10,
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
            hint: "Count the entries in the preview table — one row per song.",
            explain: "There are 6 songs, so 6 rows. Each row is one complete record.",
            xp: 10,
          },
          {
            id: "u1l1c3",
            type: "build",
            prompt: "Build a query that shows the title of every song.",
            tokens: ["SELECT", "title", "FROM", "songs"],
            solutionSql: "SELECT title FROM songs;",
            hint: "The shape is always: SELECT <column> FROM <table>.",
            explain:
              "SELECT picks the column you want, FROM names the table. You just wrote real SQL!",
            xp: 15,
          },
        ],
      },
      {
        id: "u1l2",
        unitId: "u1",
        title: "Your first SELECT",
        subtitle: "Grab exactly the columns you want",
        concept:
          "SELECT is how you ask a table for data. List the column(s) you want, then say which table with FROM.",
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
            explain: "Commas let you grab several columns at once. Order of columns is up to you.",
            xp: 15,
          },
          {
            id: "u1l2c2",
            type: "free",
            prompt: "Now write it yourself: show just the artist column for every song.",
            starterSql: "SELECT ____ FROM songs;",
            solutionSql: "SELECT artist FROM songs;",
            hint: "Replace the blank with the column name you want: artist.",
            explain: "Typing SQL from scratch is the real skill — and you nailed it.",
            xp: 20,
          },
        ],
      },
      {
        id: "u1l3",
        unitId: "u1",
        title: "Select everything",
        subtitle: "The magic star",
        concept:
          "Sometimes you want every column. Instead of listing them all, use * (star) — it means 'all columns'.",
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
            hint: "The star * is shorthand for 'all columns'. No WHERE means all rows too.",
            explain: "* returns all columns, and with no filter, all rows. The full table.",
            xp: 15,
          },
          {
            id: "u1l3c2",
            type: "free",
            prompt: "Write a query that returns the whole songs table.",
            starterSql: "",
            solutionSql: "SELECT * FROM songs;",
            hint: "Use the star: SELECT * FROM songs;",
            explain: "You just dumped an entire table with 3 words. That's the power of SQL.",
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
    blurb: "Rename columns, sort results, keep only the top few.",
    color: "#0CA678",
    lessons: [
      {
        id: "u2l1",
        unitId: "u2",
        title: "Sort it out",
        subtitle: "ORDER BY",
        concept:
          "ORDER BY sorts your results. Add DESC for high-to-low (great for leaderboards), or leave it off for low-to-high.",
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u2l1c1",
            type: "build",
            prompt: "List student names and scores, highest score first.",
            tokens: ["SELECT", "name,", "score", "FROM", "students", "ORDER BY", "score", "DESC"],
            solutionSql: "SELECT name, score FROM students ORDER BY score DESC;",
            hint: "ORDER BY <column> DESC sorts from biggest to smallest.",
            explain: "DESC = descending = high to low. This is exactly how a leaderboard works.",
            xp: 20,
          },
          {
            id: "u2l1c2",
            type: "predict",
            prompt: "Who appears FIRST in `SELECT name FROM students ORDER BY score DESC;`?",
            solutionSql: "SELECT name FROM students ORDER BY score DESC LIMIT 1;",
            options: [
              { label: "Meera (95)", correct: true },
              { label: "Vihaan (59)", correct: false },
              { label: "Aarav (92)", correct: false },
            ],
            hint: "DESC puts the highest score at the top. Find the biggest score.",
            explain: "Meera has the top score (95), so she sorts to the very top with DESC.",
            xp: 15,
          },
        ],
      },
      {
        id: "u2l2",
        unitId: "u2",
        title: "Just the top few",
        subtitle: "LIMIT",
        concept:
          "LIMIT keeps only the first N rows. Combine it with ORDER BY to answer 'the top 3' style questions.",
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u2l2c1",
            type: "build",
            prompt: "Show the TOP 3 students by score.",
            tokens: ["SELECT", "name,", "score", "FROM", "students", "ORDER BY", "score", "DESC", "LIMIT", "3"],
            solutionSql: "SELECT name, score FROM students ORDER BY score DESC LIMIT 3;",
            hint: "Sort with ORDER BY score DESC, then cut the list with LIMIT 3.",
            explain: "ORDER BY + LIMIT is the classic 'top-N' combo. You'll use it constantly.",
            xp: 25,
          },
          {
            id: "u2l2c2",
            type: "free",
            prompt: "Write a query for the single LOWEST-scoring student's name and score.",
            starterSql: "SELECT name, score FROM students ORDER BY ____ LIMIT 1;",
            solutionSql: "SELECT name, score FROM students ORDER BY score LIMIT 1;",
            hint: "Lowest first means ascending — that's ORDER BY score (no DESC), then LIMIT 1.",
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
    blurb: "WHERE, AND/OR, LIKE and IN — filter to exactly what you mean.",
    color: "#0CA678",
    lessons: [
      {
        id: "u3l1",
        unitId: "u3",
        title: "The WHERE filter",
        subtitle: "Keep only the rows you care about",
        concept:
          "WHERE filters rows by a condition. Only rows where the condition is TRUE come back. Use >, <, >=, <=, = to compare.",
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u3l1c1",
            type: "build",
            prompt: "Show the names of students who scored more than 90.",
            tokens: ["SELECT", "name", "FROM", "students", "WHERE", "score", ">", "90"],
            solutionSql: "SELECT name FROM students WHERE score > 90;",
            hint: "WHERE <column> > <number> keeps only rows above that number.",
            explain: "WHERE score > 90 keeps Aarav (92) and Meera (95). Everyone else is filtered out.",
            xp: 20,
          },
          {
            id: "u3l1c2",
            type: "fixbug",
            prompt: "This should show 90-and-above scorers, but it's showing the LOW scorers. Fix it.",
            story: "Data detective: the honour-roll list came out upside down!",
            starterSql: "SELECT name, score FROM students WHERE score < 90;",
            solutionSql: "SELECT name, score FROM students WHERE score >= 90;",
            hint: "The arrow is pointing the wrong way. '90 and above' means greater-than-or-equal.",
            explain: "'< 90' means below 90. Flipping it to '>= 90' gives 90 and above. One symbol, big difference.",
            xp: 25,
          },
        ],
      },
      {
        id: "u3l2",
        unitId: "u3",
        title: "AND / OR",
        subtitle: "Combine conditions",
        concept:
          "AND requires both conditions to be true. OR needs just one. This is how you ask precise, real-world questions.",
        datasetSql: STUDENTS,
        tables: ["students"],
        challenges: [
          {
            id: "u3l2c1",
            type: "build",
            prompt: "Find class-10 students who scored above 80.",
            tokens: ["SELECT", "name", "FROM", "students", "WHERE", "class", "=", "10", "AND", "score", ">", "80"],
            solutionSql: "SELECT name FROM students WHERE class = 10 AND score > 80;",
            hint: "Two conditions must BOTH hold, so join them with AND.",
            explain: "AND means both must be true — class is 10 AND score beats 80. Only Aarav qualifies.",
            xp: 25,
          },
          {
            id: "u3l2c2",
            type: "free",
            prompt: "Show names of students who live in Delhi OR Pune.",
            starterSql: "SELECT name FROM students WHERE city = 'Delhi' ____ city = 'Pune';",
            solutionSql: "SELECT name FROM students WHERE city = 'Delhi' OR city = 'Pune';",
            hint: "Either city counts, so use OR between the two conditions. Text goes in 'single quotes'.",
            explain: "OR keeps a row if at least one side is true. Note text values need single quotes.",
            xp: 25,
          },
        ],
      },
      {
        id: "u3l3",
        unitId: "u3",
        title: "LIKE & IN",
        subtitle: "Patterns and shortlists",
        concept:
          "LIKE matches text patterns with % as a wildcard. IN checks if a value is in a list — cleaner than lots of ORs.",
        datasetSql: MOVIES,
        tables: ["movies"],
        challenges: [
          {
            id: "u3l3c1",
            type: "build",
            prompt: "Find movies whose title starts with the letter 'R'.",
            tokens: ["SELECT", "title", "FROM", "movies", "WHERE", "title", "LIKE", "'R%'"],
            solutionSql: "SELECT title FROM movies WHERE title LIKE 'R%';",
            hint: "'R%' means 'R followed by anything'. The % is a wildcard for the rest.",
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
            explain: "IN is a tidy shortcut for several OR checks on the same column. Much cleaner.",
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

/** The next lesson id after a given one, or null if it's the last. */
export function nextLessonId(id: string): string | null {
  const order = lessonOrder();
  const i = order.indexOf(id);
  if (i === -1 || i === order.length - 1) return null;
  return order[i + 1];
}
