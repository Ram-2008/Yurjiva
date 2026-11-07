export const sections = [
  ["Home", "home"],
  ["About", "about"],
  ["Services", "services"],
  ["Products", "products"],
  ["Our Work", "work"],
  ["Contact", "contact"],
] as const;
export const services = [
  [
    "Artificial Intelligence & Generative AI",
    "Bring intelligent search, generation, and reasoning into everyday workflows.",
    "We map the use case, select a model, and evaluate outputs against real examples.",
  ],
  [
    "Website & Web Application Development",
    "Fast, accessible web experiences built around the people who use them.",
    "From public websites to signed-in dashboards, we design the interface, API, and data model together.",
  ],
  [
    "Mobile Application Development",
    "Purpose-built mobile experiences for life away from the desk.",
    "We plan touch interactions, device capabilities, and release workflows around your users.",
  ],
  [
    "Custom Software Development",
    "Software shaped around the way your business operates.",
    "We translate complex operating processes into maintainable applications and integrations.",
  ],
  [
    "AI Automation & Intelligent AI Agents",
    "Connect tools and automate repeatable work with clear human oversight.",
    "We define triggers, permissions, approval points, and recovery paths for each workflow.",
  ],
  [
    "SaaS Product Development",
    "Build subscription-ready software from an early idea to a working product.",
    "We plan tenant isolation, onboarding, billing integration, and operational visibility.",
  ],
  [
    "AI Voice Agents & Virtual Assistants",
    "Natural voice interfaces for conversations, support, and task completion.",
    "We design conversational flows, handoffs, and spoken responses for your domain.",
  ],
  [
    "UI/UX Design & Digital Product Design",
    "Clear interfaces grounded in research, prototyping, and thoughtful interaction.",
    "We explore user journeys, test prototypes, and create reusable design systems.",
  ],
];
export const products = [
  {
    name: "GodownIQ",
    category: "SUPPLIER INTELLIGENCE",
    status: "Live",
    description:
      "A supplier memory workspace that connects purchase history, inventory, and past incidents to help teams make informed buying decisions.",
    url: "https://godown-iq.vercel.app/",
    stack: "Supabase · Hindsight · Gemini",
  },
];
export const work = [
  {
    name: "Student Verse",
    kind: "Learning platform",
    url: "https://student-verse-fawn.vercel.app/",
    summary:
      "A student portal demo that brings courses, coding practice, and tasks into one learning experience.",
    stack: "Vercel deployment",
    mark: "SV",
  },
  {
    name: "Swiss Beauty Parlour",
    kind: "Business website",
    url: "https://swiss-beauty-parlour.vercel.app/",
    summary:
      "A responsive beauty business website with a signed-in dashboard and an account recovery flow.",
    stack: "Supabase · Vercel",
    mark: "Swiss",
  },
  {
    name: "SupportDesk AI",
    kind: "Customer support automation",
    summary: "Helps support teams sort customer messages, spot urgent requests and draft replies using AI.",
    stack: "React · Node.js · AI/ML",
    mark: "SD",
  },
  {
    name: "SwasthCall",
    kind: "Healthcare voice assistant",
    summary: "AI voice reminders help elderly patients take their medication in multiple languages and alert caregivers when needed.",
    stack: "Vapi · Twilio · Supabase",
    mark: "SC",
  },
];
export const socials = [
  ["Instagram", process.env.NEXT_PUBLIC_INSTAGRAM_URL],
  ["LinkedIn", process.env.NEXT_PUBLIC_LINKEDIN_URL],
  ["X", process.env.NEXT_PUBLIC_X_URL],
  ["GitHub", process.env.NEXT_PUBLIC_GITHUB_URL],
].filter(
  (item): item is [string, string] => !!item[1] && /^https:\/\//.test(item[1]),
);
