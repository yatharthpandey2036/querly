// AI-track capstones. Kids BUILD a small AI app using easy build-steps
// (choices + arranging) — no code. Each step adds a feature to a live preview.

export interface AiBuildStep {
  id: string;
  title: string; // the feature to build
  brief: string;
  kind: "choice" | "order";
  options?: { label: string; correct: boolean }[]; // choice
  items?: string[]; // order (correct order)
  hint: string;
  explain: string;
  preview: string; // line added to the "app" when this step is done
  xp: number;
}

export interface AiProject {
  id: string;
  unitId: string;
  title: string;
  appName: string;
  tagline: string;
  scenario: string;
  aiIdea: string;
  steps: AiBuildStep[];
  ship: string;
  /** "unit" = end-of-unit capstone (default); "life" = optional daily-life project. */
  kind?: "unit" | "life";
  /** For life projects: why it's useful in everyday life. */
  why?: string;
}

export const AI_PROJECTS: AiProject[] = [
  {
    id: "ap1",
    unitId: "au1",
    title: "Spam Catcher",
    appName: "SPAM CATCHER",
    tagline: "Build an AI that sorts spam from real email",
    scenario: "Build an app that catches spam. You'll teach it with examples, then let it guess — just like a real AI.",
    aiIdea: "Remember: AI learns from examples first, then makes guesses. Build it in that order.",
    steps: [
      {
        id: "ap1s1",
        title: "Choose the training data",
        brief: "What should you feed your spam catcher so it can learn?",
        kind: "choice",
        options: [
          { label: "Many emails already labelled 'spam' or 'not spam'", correct: true },
          { label: "Just one email", correct: false },
          { label: "Photos of cats", correct: false },
        ],
        hint: "AI needs lots of labelled examples to learn from.",
        explain: "Labelled examples teach the AI what spam looks like. That's its training data.",
        preview: "✓ Trained on 500 labelled emails",
        xp: 35,
      },
      {
        id: "ap1s2",
        title: "Set up the pipeline",
        brief: "Put the app's steps in the right order.",
        kind: "order",
        items: ["Collect labelled emails", "Train the AI", "Show it a new email", "It guesses: spam or not"],
        hint: "Learn first (collect + train), then guess on new emails.",
        explain: "Collect → train → show new → guess. That's how every AI app runs.",
        preview: "✓ Learn-then-guess pipeline ready",
        xp: 35,
      },
      {
        id: "ap1s3",
        title: "Fix a mistake",
        brief: "Your app called a REAL email 'spam'. What's the best fix?",
        kind: "choice",
        options: [
          { label: "Add more varied examples and retrain", correct: true },
          { label: "Delete the whole app", correct: false },
          { label: "Ignore it and hope", correct: false },
        ],
        hint: "Better, more varied data makes better guesses.",
        explain: "More varied examples teach the AI its mistake. Retraining makes it smarter.",
        preview: "✓ Retrained — far fewer mistakes",
        xp: 40,
      },
    ],
    ship: "You shipped Spam Catcher — an AI that learned from examples to sort your inbox. 🚀",
  },
  {
    id: "ap2",
    unitId: "au2",
    title: "Photo Sorter",
    appName: "PHOTO SORTER",
    tagline: "Build a fair cat-vs-dog photo classifier",
    scenario: "Build an app that sorts photos into cats and dogs — and keep it fair with good data.",
    aiIdea: "Think about data quality and bias: fair, varied examples make a fair app.",
    steps: [
      {
        id: "ap2s1",
        title: "Choose good training data",
        brief: "Which data will make the best photo sorter?",
        kind: "choice",
        options: [
          { label: "Many clear, labelled cat AND dog photos", correct: true },
          { label: "Blurry, unlabelled blobs", correct: false },
          { label: "Only cat photos", correct: false },
        ],
        hint: "Clean, labelled, and covers both cats and dogs.",
        explain: "Clear, labelled, balanced photos of both animals = great training data.",
        preview: "✓ Balanced photo set loaded",
        xp: 35,
      },
      {
        id: "ap2s2",
        title: "Avoid bias",
        brief: "You only added husky photos for 'dog'. What's the risk?",
        kind: "choice",
        options: [
          { label: "It may miss other dog breeds — that's bias", correct: true },
          { label: "No risk at all", correct: false },
          { label: "It just runs faster", correct: false },
        ],
        hint: "One breed isn't every dog. Narrow data = bias.",
        explain: "Only huskies means other dogs get missed. Add many breeds to stay fair.",
        preview: "✓ Added many dog breeds",
        xp: 40,
      },
      {
        id: "ap2s3",
        title: "How it decides",
        brief: "Order the steps the sorter takes for a new photo.",
        kind: "order",
        items: ["Look at the new photo", "Check learned patterns", "Find the best match", "Label it cat or dog"],
        hint: "Look, compare to patterns, match, then label.",
        explain: "It compares the new photo to patterns it learned, then picks the best label.",
        preview: "✓ Sorter logic ready",
        xp: 35,
      },
    ],
    ship: "You shipped Photo Sorter — a fair, pattern-smart image classifier. 🚀",
  },
  {
    id: "ap3",
    unitId: "au3",
    title: "Homework Helper",
    appName: "HOMEWORK HELPER",
    tagline: "Build an AI study buddy with great prompts",
    scenario: "Build an AI helper that explains school topics — powered entirely by the prompts you write.",
    aiIdea: "Great prompts are clear and specific. Build each feature by writing a good prompt.",
    steps: [
      {
        id: "ap3s1",
        title: "Write the main prompt",
        brief: "Arrange the pieces into the app's main 'explain' prompt.",
        kind: "order",
        items: ["Explain", "this topic", "to a student", "in simple words"],
        hint: "Action first, then the thing, then who for, then the style.",
        explain: "'Explain this topic to a student in simple words' — clear and specific!",
        preview: "✓ Explain feature: clear + kid-friendly",
        xp: 35,
      },
      {
        id: "ap3s2",
        title: "Add a summary button",
        brief: "Pick the better default prompt for the summary feature.",
        kind: "choice",
        options: [
          { label: "Summarise this in 3 clear bullet points", correct: true },
          { label: "summarise", correct: false },
        ],
        hint: "Specific beats vague — say how many and what format.",
        explain: "A specific prompt (3 clear bullets) gives a neat, useful summary every time.",
        preview: "✓ Summary feature added",
        xp: 35,
      },
      {
        id: "ap3s3",
        title: "Kid-friendly mode",
        brief: "How do you make answers easy for younger kids?",
        kind: "choice",
        options: [
          { label: "Add 'in simple words for a 10-year-old'", correct: true },
          { label: "TYPE IN ALL CAPS", correct: false },
          { label: "Add random words", correct: false },
        ],
        hint: "Tell the AI the style and who it's for.",
        explain: "Style hints like 'for a 10-year-old' shape the answer to fit the reader.",
        preview: "✓ Kid-friendly mode on",
        xp: 40,
      },
    ],
    ship: "You shipped Homework Helper — an AI study buddy you built with prompts. 🚀",
  },

  // ---------- Daily-life projects (short, optional, no pressure) ----------
  {
    id: "life-ai-scam",
    unitId: "life",
    kind: "life",
    title: "Scam Message Spotter",
    appName: "SCAM SPOTTER",
    tagline: "Spot online tricks before they trick you",
    why: "Recognise scam messages and protect your money and data — a skill you need today.",
    scenario: "Scammers use patterns to fool people. Learn the patterns and you'll never fall for them.",
    aiIdea: "AI learns scam patterns from examples — and so can you.",
    steps: [
      {
        id: "las1",
        title: "Spot the scam",
        brief: "Which message is most likely a SCAM?",
        kind: "choice",
        options: [
          { label: "You WON ₹50,000! Click this link and enter your bank PIN", correct: true },
          { label: "Mom: dinner's ready in 10 minutes", correct: false },
          { label: "Reminder: homework due tomorrow", correct: false },
        ],
        hint: "Scams push you to act fast and ask for money or secrets.",
        explain: "Surprise prizes + urgent links + asking for your PIN = classic scam signs.",
        preview: "✓ Learned the scam red flags",
        xp: 35,
      },
      {
        id: "las2",
        title: "Protect your secrets",
        brief: "A message asks for your OTP or password. What do you do?",
        kind: "choice",
        options: [
          { label: "Never share it — real apps never ask for it", correct: true },
          { label: "Send it fast so nothing bad happens", correct: false },
          { label: "Reply with your bank PIN too", correct: false },
        ],
        hint: "Your OTP and password are secrets — nobody legit needs them.",
        explain: "Never share OTPs or passwords. Real services will never ask you for them.",
        preview: "✓ Safety rule locked in",
        xp: 40,
      },
    ],
    ship: "You built a scam radar — you'll spot the tricks before they trick you. 🛡️",
  },
  {
    id: "life-ai-study",
    unitId: "life",
    kind: "life",
    title: "Study Buddy Prompts",
    appName: "STUDY BUDDY",
    tagline: "Make AI explain and quiz you",
    why: "Use AI to revise smarter — simple explanations and instant quizzes, without the overwhelm.",
    scenario: "Build prompts that turn any AI into your personal study helper.",
    aiIdea: "Clear + specific prompts get answers you can actually use.",
    steps: [
      {
        id: "lax1",
        title: "The 'explain simply' prompt",
        brief: "Arrange the pieces into a great study prompt.",
        kind: "order",
        items: ["Explain", "the water cycle", "to a class 8 student", "in 4 simple points"],
        hint: "Action → topic → who it's for → the style.",
        explain: "Clear and specific = an explanation you'll actually understand.",
        preview: "✓ Explain-simply feature",
        xp: 35,
      },
      {
        id: "lax2",
        title: "The 'quiz me' button",
        brief: "Pick the better prompt to make a quick self-quiz.",
        kind: "choice",
        options: [
          { label: "Make 5 easy quiz questions on this chapter, with answers", correct: true },
          { label: "quiz", correct: false },
        ],
        hint: "Say how many, on what, and to include answers.",
        explain: "A specific prompt gives a neat, ready-to-use quiz every time.",
        preview: "✓ Quiz-me feature",
        xp: 35,
      },
    ],
    ship: "You built a study buddy — AI that explains and quizzes you. 📚",
  },
  {
    id: "life-ai-feed",
    unitId: "life",
    kind: "life",
    title: "Why Is My Feed Like This?",
    appName: "FEED CONTROL",
    tagline: "Understand and steer your recommendations",
    why: "Know why your video feed shows what it shows — and take back control of your attention.",
    scenario: "Ever feel like your feed shows the same stuff on repeat? Let's figure out why.",
    aiIdea: "Recommenders learn from your clicks — your choices are their data.",
    steps: [
      {
        id: "laf1",
        title: "Spot the loop",
        brief: "Your app only ever shows one kind of video. Why?",
        kind: "choice",
        options: [
          { label: "It learned from what you clicked — a feedback loop", correct: true },
          { label: "It's just broken", correct: false },
          { label: "Pure random luck", correct: false },
        ],
        hint: "AI copies your past behaviour.",
        explain: "Recommenders show more of what you clicked before — which can narrow your feed.",
        preview: "✓ Spotted the pattern",
        xp: 35,
      },
      {
        id: "laf2",
        title: "Take control",
        brief: "To see more variety, what actually works?",
        kind: "choice",
        options: [
          { label: "Search and watch varied topics on purpose", correct: true },
          { label: "Nothing — it's fixed forever", correct: false },
          { label: "Delete the app forever", correct: false },
        ],
        hint: "You teach it with every choice you make.",
        explain: "Your choices are its training data — vary them and your feed opens up.",
        preview: "✓ Balanced feed",
        xp: 35,
      },
    ],
    ship: "You cracked how feeds work — now you steer the algorithm, not the other way round. 🎛️",
  },
  {
    id: "life-ai-photos",
    unitId: "life",
    kind: "life",
    title: "Gallery Auto-Sorter",
    appName: "PHOTO SORTER",
    tagline: "How your phone sorts your photos",
    why: "See the AI quietly working in your photo gallery every day.",
    scenario: "Your phone can auto-sort photos into albums. Let's build the idea behind it.",
    aiIdea: "Good, labelled examples make a good sorter.",
    steps: [
      {
        id: "lap1",
        title: "Feed it examples",
        brief: "To auto-sort your gallery into 'food' and 'selfies', the AI needs…",
        kind: "choice",
        options: [
          { label: "Example photos of each, clearly labelled", correct: true },
          { label: "One blurry photo", correct: false },
          { label: "Nothing at all", correct: false },
        ],
        hint: "AI learns from labelled examples.",
        explain: "Labelled photos of each category are its training data.",
        preview: "✓ Training set ready",
        xp: 35,
      },
      {
        id: "lap2",
        title: "Sort a new photo",
        brief: "Order the steps the sorter takes for a brand-new photo.",
        kind: "order",
        items: ["Look at the new photo", "Check the learned patterns", "Pick the best-matching label", "Drop it in that album"],
        hint: "Look, compare, match, then place it.",
        explain: "It matches the new photo to learned patterns, then files it in the right album.",
        preview: "✓ Auto-sort ready",
        xp: 35,
      },
    ],
    ship: "You built a photo auto-sorter — the magic behind your gallery albums. 🖼️",
  },
];

export function getAiProject(id: string): AiProject | undefined {
  return AI_PROJECTS.find((p) => p.id === id);
}
export function aiProjectForUnit(unitId: string): AiProject | undefined {
  return AI_PROJECTS.find((p) => p.unitId === unitId && p.kind !== "life");
}

export const LIFE_AI_PROJECTS = AI_PROJECTS.filter((p) => p.kind === "life");
