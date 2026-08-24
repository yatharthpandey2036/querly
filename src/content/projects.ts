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
];

export function getProject(id: string): CapstoneProject | undefined {
  return PROJECTS.find((p) => p.id === id);
}

export function projectForUnit(unitId: string): CapstoneProject | undefined {
  return PROJECTS.find((p) => p.unitId === unitId);
}

export const ALL_PROJECT_IDS = PROJECTS.map((p) => p.id);
