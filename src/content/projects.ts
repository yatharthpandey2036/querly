// End-of-unit capstone projects. Each kid BUILDS a small gamified product by
// writing real queries (the skills from that unit) — with Bit (AI) as co-builder.
// Every mission is one "feature" of the app; finishing them all ships the product.

export interface ProjectMission {
  id: string;
  title: string; // the feature to build
  brief: string; // plain-language description
  solutionSql: string;
  hint: string;
  xp: number;
}

export interface CapstoneProject {
  id: string;
  unitId: string;
  title: string;
  tagline: string;
  scenario: string; // the case study
  aiIdea: string; // how to use AI as a co-builder
  datasetSql: string;
  tables: string[];
  missions: ProjectMission[];
  ship: string; // shown when it's finished
  /** "unit" = end-of-unit capstone (default); "life" = optional daily-life project. */
  kind?: "unit" | "life";
  /** For life projects: why it's useful in everyday life. */
  why?: string;
}

const SONGS = `
CREATE TABLE songs (id INTEGER, title TEXT, artist TEXT, plays INTEGER, mins REAL);
INSERT INTO songs VALUES
 (1,'Midnight Drive','Neon Vale',24000,3.4),
 (2,'Paper Planes','Kite',9800,2.9),
 (3,'Gravity','Neon Vale',54000,4.1),
 (4,'Sunburn','Kite',3200,3.0),
 (5,'Echoes','Lo-Fi Cat',72000,2.5),
 (6,'Focus','Lo-Fi Cat',15000,5.2);
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

export const PROJECTS: CapstoneProject[] = [
  {
    id: "p1",
    unitId: "u1",
    title: "Playlist App",
    tagline: "Build a music app's screens with SELECT",
    scenario:
      "You're building a music app called Beat. The app needs a few screens, and each screen is powered by one query. Build them one by one!",
    aiIdea: "Stuck on a screen? Ask Bit — describe the screen in your own words and Bit will point you to the query.",
    datasetSql: SONGS,
    tables: ["songs"],
    missions: [
      {
        id: "p1m1",
        title: "The song list screen",
        brief: "The home screen shows the name of every song. Write a query that lists all song titles.",
        solutionSql: "SELECT title FROM songs;",
        hint: "SELECT the title column FROM songs.",
        xp: 30,
      },
      {
        id: "p1m2",
        title: "The 'now playing' screen",
        brief: "This screen shows each song's title and its artist. Grab both columns.",
        solutionSql: "SELECT title, artist FROM songs;",
        hint: "List two columns with a comma: SELECT title, artist FROM songs.",
        xp: 30,
      },
      {
        id: "p1m3",
        title: "The full library screen",
        brief: "Power users want to see everything — all columns for every song.",
        solutionSql: "SELECT * FROM songs;",
        hint: "Use the star: SELECT * FROM songs.",
        xp: 40,
      },
    ],
    ship: "You shipped Beat — a working music app, powered entirely by your queries. 🚀",
  },
  {
    id: "p2",
    unitId: "u2",
    title: "Top Charts",
    tagline: "Build a music charts feature with ORDER BY + LIMIT",
    scenario:
      "Beat is adding a Charts page — the songs everyone is playing. You'll rank songs by plays and pick the winners.",
    aiIdea: "Ask Bit how a leaderboard is built — it'll nudge you toward ORDER BY and LIMIT.",
    datasetSql: SONGS,
    tables: ["songs"],
    missions: [
      {
        id: "p2m1",
        title: "Rank every song",
        brief: "Show each song's title and plays, most-played first.",
        solutionSql: "SELECT title, plays FROM songs ORDER BY plays DESC;",
        hint: "ORDER BY plays DESC puts the biggest number on top.",
        xp: 30,
      },
      {
        id: "p2m2",
        title: "Top 3 chart",
        brief: "The headline of the Charts page: only the top 3 songs by plays.",
        solutionSql: "SELECT title, plays FROM songs ORDER BY plays DESC LIMIT 3;",
        hint: "Sort by plays DESC, then LIMIT 3.",
        xp: 40,
      },
      {
        id: "p2m3",
        title: "Hidden gem",
        brief: "A fun feature: show the single LEAST-played song.",
        solutionSql: "SELECT title, plays FROM songs ORDER BY plays LIMIT 1;",
        hint: "Least first is ascending — ORDER BY plays (no DESC), then LIMIT 1.",
        xp: 40,
      },
    ],
    ship: "You shipped the Charts page — top hits, hidden gems, and a live leaderboard. 🚀",
  },
  {
    id: "p3",
    unitId: "u3",
    title: "Movie Night Picker",
    tagline: "Build a recommender with WHERE, AND/OR, LIKE and IN",
    scenario:
      "It's movie night! Build a picker app that helps people find exactly the film they want by filtering a movie library.",
    aiIdea: "Describe the filter you want in plain English to Bit — it'll help you turn it into a WHERE clause.",
    datasetSql: MOVIES,
    tables: ["movies"],
    missions: [
      {
        id: "p3m1",
        title: "Sci-fi shelf",
        brief: "Show the titles of all sci-fi movies.",
        solutionSql: "SELECT title FROM movies WHERE genre = 'sci-fi';",
        hint: "WHERE genre = 'sci-fi' — text goes in single quotes.",
        xp: 30,
      },
      {
        id: "p3m2",
        title: "Top picks",
        brief: "Only the GOOD sci-fi: sci-fi movies rated above 7.5.",
        solutionSql: "SELECT title FROM movies WHERE genre = 'sci-fi' AND rating > 7.5;",
        hint: "Both must be true — join the two conditions with AND.",
        xp: 40,
      },
      {
        id: "p3m3",
        title: "Search bar",
        brief: "Add a search: show movies whose title starts with the letter 'N'.",
        solutionSql: "SELECT title FROM movies WHERE title LIKE 'N%';",
        hint: "'N%' means 'starts with N'. The % is a wildcard.",
        xp: 40,
      },
      {
        id: "p3m4",
        title: "Genre filter",
        brief: "Let people pick more than one genre — show sci-fi OR drama using IN.",
        solutionSql: "SELECT title FROM movies WHERE genre IN ('sci-fi','drama');",
        hint: "IN takes a list in brackets: IN ('sci-fi','drama').",
        xp: 50,
      },
    ],
    ship: "You shipped Movie Night Picker — a real recommender that filters films on demand. 🚀",
  },

  // ---------- Daily-life projects (short, optional, no pressure) ----------
  {
    id: "life-sql-money",
    unitId: "life",
    kind: "life",
    title: "Pocket Money Tracker",
    tagline: "See where your money actually goes",
    why: "Track your own pocket money and spot where it disappears — a skill you'll use for life.",
    scenario: "Here's a week of your spending. Let's find out where the money really went.",
    aiIdea: "Ask Bit if you're unsure which keyword sorts or filters.",
    datasetSql: `
CREATE TABLE expenses (id INTEGER, item TEXT, category TEXT, amount INTEGER, day TEXT);
INSERT INTO expenses VALUES
 (1,'Samosa','food',20,'Mon'),
 (2,'Bus pass','travel',150,'Mon'),
 (3,'Comic book','fun',120,'Tue'),
 (4,'Mobile recharge','phone',199,'Wed'),
 (5,'Ice cream','food',40,'Thu'),
 (6,'Movie ticket','fun',180,'Sat'),
 (7,'Pen set','study',60,'Fri');`,
    tables: ["expenses"],
    missions: [
      {
        id: "lsm1",
        title: "Where did the money go?",
        brief: "Show every item and its amount, biggest spend first.",
        solutionSql: "SELECT item, amount FROM expenses ORDER BY amount DESC;",
        hint: "ORDER BY amount DESC puts the biggest number on top.",
        xp: 30,
      },
      {
        id: "lsm2",
        title: "The big spends",
        brief: "Show only the items that cost more than 100.",
        solutionSql: "SELECT item, amount FROM expenses WHERE amount > 100;",
        hint: "WHERE amount > 100 keeps the pricey ones.",
        xp: 30,
      },
    ],
    ship: "Nice — you can now read your own spending like a pro. 💰",
  },
  {
    id: "life-sql-watch",
    unitId: "life",
    kind: "life",
    title: "My Watchlist",
    tagline: "Pick what to watch in seconds",
    why: "Filter and sort a watchlist instead of scrolling forever — the same idea behind Netflix and YouTube.",
    scenario: "Your watchlist is a mess. Let's turn it into a quick 'what should I watch' tool.",
    aiIdea: "Text values go in 'single quotes' — Bit can remind you.",
    datasetSql: `
CREATE TABLE shows (id INTEGER, title TEXT, genre TEXT, rating REAL, mins INTEGER);
INSERT INTO shows VALUES
 (1,'Space Camp','sci-fi',8.2,95),
 (2,'Laugh Track','comedy',7.5,25),
 (3,'Mystery Manor','thriller',8.8,110),
 (4,'Goof Troop','comedy',6.9,22),
 (5,'Red Planet','sci-fi',7.1,130),
 (6,'Quick Laughs','comedy',8.0,20);`,
    tables: ["shows"],
    missions: [
      {
        id: "lsw1",
        title: "Comedy night",
        brief: "Show the titles of all comedy shows.",
        solutionSql: "SELECT title FROM shows WHERE genre = 'comedy';",
        hint: "WHERE genre = 'comedy' — remember the quotes.",
        xp: 30,
      },
      {
        id: "lsw2",
        title: "Best first",
        brief: "Show title and rating, highest rating on top.",
        solutionSql: "SELECT title, rating FROM shows ORDER BY rating DESC;",
        hint: "ORDER BY rating DESC.",
        xp: 30,
      },
    ],
    ship: "You built your own smart watchlist. Movie night sorted! 🍿",
  },
  {
    id: "life-sql-cricket",
    unitId: "life",
    kind: "life",
    title: "Cricket Scoreboard",
    tagline: "Turn a messy scoreboard into stats",
    why: "Make instant sense of any scoreboard — sports data is everywhere.",
    scenario: "The gully-cricket scoreboard is chaos. Let's pull out the real stats.",
    aiIdea: "Two conditions at once? That's AND. Ask Bit if stuck.",
    datasetSql: `
CREATE TABLE players (id INTEGER, name TEXT, runs INTEGER, wickets INTEGER, team TEXT);
INSERT INTO players VALUES
 (1,'Ishan',54,0,'Reds'),
 (2,'Aditya',12,3,'Blues'),
 (3,'Rohan',38,2,'Reds'),
 (4,'Kabir',5,1,'Blues'),
 (5,'Vivaan',61,0,'Blues'),
 (6,'Arjun',33,2,'Reds');`,
    tables: ["players"],
    missions: [
      {
        id: "lsc1",
        title: "Top 3 batters",
        brief: "Show name and runs — the top 3 run-scorers.",
        solutionSql: "SELECT name, runs FROM players ORDER BY runs DESC LIMIT 3;",
        hint: "ORDER BY runs DESC, then LIMIT 3.",
        xp: 35,
      },
      {
        id: "lsc2",
        title: "All-rounders",
        brief: "Find players with more than 30 runs AND more than 1 wicket.",
        solutionSql: "SELECT name FROM players WHERE runs > 30 AND wickets > 1;",
        hint: "Join the two conditions with AND.",
        xp: 35,
      },
    ],
    ship: "You turned a messy scoreboard into clear stats. 🏏",
  },
  {
    id: "life-sql-study",
    unitId: "life",
    kind: "life",
    title: "Study Planner",
    tagline: "Know which subject needs your time",
    why: "Plan revision around real data — where you're behind and what's coming up. Study smarter, not harder.",
    scenario: "Exams are near. Let's find out where to spend your study time.",
    aiIdea: "Compare two columns with < just like two numbers.",
    datasetSql: `
CREATE TABLE subjects (id INTEGER, name TEXT, done_hours INTEGER, target_hours INTEGER, exam_soon INTEGER);
INSERT INTO subjects VALUES
 (1,'Maths',3,8,1),
 (2,'Science',5,6,1),
 (3,'History',2,4,0),
 (4,'English',4,4,0),
 (5,'Geography',1,5,1);`,
    tables: ["subjects"],
    missions: [
      {
        id: "lss1",
        title: "Falling behind",
        brief: "Show subjects where you've done fewer hours than the target.",
        solutionSql: "SELECT name FROM subjects WHERE done_hours < target_hours;",
        hint: "WHERE done_hours < target_hours.",
        xp: 30,
      },
      {
        id: "lss2",
        title: "Exam focus",
        brief: "Show subjects that have an exam soon (exam_soon = 1).",
        solutionSql: "SELECT name FROM subjects WHERE exam_soon = 1;",
        hint: "WHERE exam_soon = 1.",
        xp: 30,
      },
    ],
    ship: "You built a study planner that tells you exactly where to focus. 📚",
  },
];

export function getProject(id: string): CapstoneProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function projectForUnit(unitId: string): CapstoneProject | undefined {
  return PROJECTS.find((p) => p.unitId === unitId && p.kind !== "life");
}

export const LIFE_SQL_PROJECTS = PROJECTS.filter((p) => p.kind === "life");
export const ALL_PROJECT_IDS = PROJECTS.map((p) => p.id);
