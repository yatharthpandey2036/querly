import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  date,
  primaryKey,
  unique,
} from "drizzle-orm/pg-core";

// Roles used across the RBAC layer.
export type Role =
  | "student"
  | "parent"
  | "teacher"
  | "school_admin"
  | "author"
  | "super_admin";

export type ConsentStatus = "not_required" | "pending" | "granted";
export type Plan = "free" | "premium" | "family";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  role: text("role").$type<Role>().notNull().default("student"),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  age: integer("age"),
  // For students under 18: consent lifecycle + the parent we invited.
  consentStatus: text("consent_status").$type<ConsentStatus>().notNull().default("not_required"),
  parentEmail: text("parent_email"),
  // Subscription: free (learn AI+SQL) vs premium/family (leagues, friends, race).
  plan: text("plan").$type<Plan>().notNull().default("free"),
  planSince: timestamp("plan_since", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Friends (one row per direction, so we insert both when two users connect).
export const friendships = pgTable(
  "friendships",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    friendUserId: uuid("friend_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqPair: unique().on(t.userId, t.friendUserId),
  }),
);

// Query Race results — the sprint leaderboard.
export const raceScores = pgTable("race_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// Parent <-> student links (a parent may monitor several children).
export const parentLinks = pgTable(
  "parent_links",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    parentUserId: uuid("parent_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    studentUserId: uuid("student_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    uniqPair: unique().on(t.parentUserId, t.studentUserId),
  }),
);

// Gamification state — one row per learner.
export const userStats = pgTable("user_stats", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  xp: integer("xp").notNull().default(0),
  gems: integer("gems").notNull().default(0),
  hearts: integer("hearts").notNull().default(5),
  streakCount: integer("streak_count").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastActiveDate: date("last_active_date"),
});

// One row per lesson a learner has completed.
export const progress = pgTable(
  "progress",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id").notNull(),
    stars: integer("stars").notNull().default(1),
    xpEarned: integer("xp_earned").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.lessonId] }),
  }),
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type Progress = typeof progress.$inferSelect;
