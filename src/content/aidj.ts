// Data for the "AI DJ" Studio project. The AI recommends songs by mood +
// rating — which is really a SQL query the student then learns to write.
export interface DjSong {
  id: number;
  title: string;
  artist: string;
  mood: string;
  popularity: number;
  rating: number;
}

export const MOODS = [
  { key: "Energetic", icon: "🎸" },
  { key: "Study", icon: "📚" },
  { key: "Chill", icon: "🌙" },
  { key: "Party", icon: "🎉" },
];

export const DJ_SONGS: DjSong[] = [
  { id: 1, title: "Ignite", artist: "Volt", mood: "Energetic", popularity: 88, rating: 8.7 },
  { id: 2, title: "Turbo", artist: "Pulse", mood: "Energetic", popularity: 95, rating: 9.0 },
  { id: 3, title: "Redline", artist: "Nova Kids", mood: "Energetic", popularity: 72, rating: 8.1 },
  { id: 4, title: "Full Throttle", artist: "Volt", mood: "Energetic", popularity: 60, rating: 7.5 },
  { id: 5, title: "Focus Flow", artist: "Lo-Fi Cat", mood: "Study", popularity: 80, rating: 8.5 },
  { id: 6, title: "Deep Work", artist: "Mono", mood: "Study", popularity: 70, rating: 8.2 },
  { id: 7, title: "Rain Desk", artist: "Lo-Fi Cat", mood: "Study", popularity: 66, rating: 7.9 },
  { id: 8, title: "Quiet Hours", artist: "Mono", mood: "Study", popularity: 55, rating: 7.6 },
  { id: 9, title: "Moonlit", artist: "Haze", mood: "Chill", popularity: 78, rating: 8.4 },
  { id: 10, title: "Driftwood", artist: "Sona", mood: "Chill", popularity: 71, rating: 8.0 },
  { id: 11, title: "Slow Tide", artist: "Haze", mood: "Chill", popularity: 64, rating: 7.8 },
  { id: 12, title: "Amber", artist: "Sona", mood: "Chill", popularity: 58, rating: 7.7 },
  { id: 13, title: "Confetti", artist: "DJ Mango", mood: "Party", popularity: 91, rating: 8.8 },
  { id: 14, title: "Night Fuel", artist: "DJ Mango", mood: "Party", popularity: 84, rating: 8.6 },
  { id: 15, title: "Bounce", artist: "Kite", mood: "Party", popularity: 76, rating: 8.3 },
  { id: 16, title: "Glow Up", artist: "Kite", mood: "Party", popularity: 68, rating: 7.9 },
];

// Same data as a SQLite dataset, so the student can run real queries on it.
export function djDatasetSql(): string {
  const rows = DJ_SONGS.map(
    (s) => `(${s.id},'${s.title}','${s.artist}','${s.mood}',${s.popularity},${s.rating})`,
  ).join(",\n ");
  return `CREATE TABLE songs (id INTEGER, title TEXT, artist TEXT, mood TEXT, popularity INTEGER, rating REAL);\nINSERT INTO songs VALUES\n ${rows};`;
}
