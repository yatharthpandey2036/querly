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
];

export function getAiProject(id: string): AiProject | undefined {
  return AI_PROJECTS.find((p) => p.id === id);
}
export function aiProjectForUnit(unitId: string): AiProject | undefined {
  return AI_PROJECTS.find((p) => p.unitId === unitId);
}
