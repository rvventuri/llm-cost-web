export type BlogArticle = {
  slug: string
  title: string
  description: string
  publishedAt: string
  readingTimeMinutes: number
  keywords: string[]
  heroTag: string
  sections: {
    heading: string
    body: string[]
  }[]
}

export const blogArticles: BlogArticle[] = [
  {
    slug: 'what-is-llm-finops-and-why-it-matters',
    title: 'What Is LLM FinOps and Why It Matters',
    description:
      'Understand the foundations of FinOps for LLMs and why real-time cost visibility is critical as AI usage explodes across your product.',
    publishedAt: '2026-01-20',
    readingTimeMinutes: 7,
    heroTag: 'LLM FinOps fundamentals',
    keywords: [
      'LLM FinOps',
      'LLM cost management',
      'AI cost visibility',
      'FinOps for AI',
      'LLM Cost Radar',
    ],
    sections: [
      {
        heading: 'From cloud FinOps to LLM FinOps',
        body: [
          'Traditional FinOps helped teams control cloud spend as infrastructure moved from on‑prem to the public cloud. LLMs are creating a similar wave of hidden costs, but this time at the application layer, inside features that ship every week.',
          'Every new feature that calls an LLM — chat, summarization, embeddings, document analysis — generates token usage and cost. Without visibility, it is almost impossible to answer simple questions like “how much does this feature cost per month?” or “which customer segment is burning most of our AI budget?”.',
          'The problem is that these costs are usually scattered across different services and teams. Product teams add new prompts, backend engineers add retries and fallbacks, growth teams spin up experiments — and the only place where all of that converges is your monthly invoice.',
          'LLM FinOps brings the same discipline that we now expect for cloud infrastructure to the world of AI features: measure, allocate, optimize and continuously improve. Instead of relying on gut feeling or spreadsheets, you create a feedback loop based on real usage and cost data.',
        ],
      },
      {
        heading: 'Why token-based billing is so hard to reason about',
        body: [
          'LLM providers bill in tokens, not requests. Different models have different input/output prices, prompt caching behavior and context window limits. The same feature can have very different unit economics depending on which model and parameters you choose.',
          'On top of that, prompts are not static. Teams tweak prompts to improve quality, increase context or add guardrails. Each of those changes can dramatically increase token usage without anyone noticing until the bill arrives.',
          'If you only look at your provider invoice at the end of the month, you miss all the context: which endpoint generated the spend, which tags or tenants are responsible, and which experiments silently increased your baseline. You see the “what” (total cost) but not the “why”.',
          'This is why LLM FinOps always starts with better instrumentation. You need structured events that capture not only tokensIn and tokensOut, but also provider, model, feature and tags for every call. Once you have that, cost suddenly becomes explainable and actionable.',
        ],
      },
      {
        heading: 'The FinOps feedback loop for LLMs',
        body: [
          'LLM FinOps is the practice of instrumenting your LLM usage, turning raw events into cost insights, and using those insights to drive product and engineering decisions.',
          'In practice, this means tracking provider, model, tokensIn, tokensOut, feature and tags on every call, sending those events to a cost analytics layer like LLM Cost Radar and then monitoring dashboards, budgets and alerts that reflect how your product really works.',
          'Once you have this feedback loop in place, you can start asking much better questions. Which feature has the highest cost per active user? Which model is driving most of our spend? Which experiments are safe to scale and which ones need guardrails?',
          'Good LLM FinOps does not slow teams down. Instead, it gives product and engineering enough data to make decisions with confidence — for example, when it is worth upgrading a specific flow to a more expensive model because it unlocks a premium plan or improves conversion.',
        ],
      },
      {
        heading: 'Where LLM Cost Radar fits in',
        body: [
          'LLM Cost Radar gives you real-time cost visibility by feature, model, provider and environment. Instead of parsing CSV invoices and writing ad‑hoc scripts, you plug in a single HTTP endpoint and get dashboards that your product, data and finance teams can actually use.',
          'Because LLM Cost Radar focuses specifically on LLM usage, you do not need to build and maintain a custom cost analytics stack. We handle pricing updates, aggregation and normalization for you so that every event you send is immediately translated into understandable dollar impact.',
          'This is the missing FinOps layer for AI products: simple enough for developers to adopt in minutes, but powerful enough to drive high‑stakes cost decisions. It gives you a shared view across engineering, product and finance, anchored in the same language: real LLM usage and cost.',
        ],
      },
    ],
  },
  {
    slug: 'how-to-measure-llm-costs-per-feature-and-endpoint',
    title: 'How to Measure LLM Costs per Feature and Endpoint',
    description:
      'Learn how to break down LLM costs per feature, endpoint and tag so you can see exactly where your AI budget is going.',
    publishedAt: '2026-01-21',
    readingTimeMinutes: 8,
    heroTag: 'Cost per feature & endpoint',
    keywords: [
      'LLM feature cost',
      'endpoint cost tracking',
      'LLM cost per request',
      'AI feature unit economics',
      'LLM Cost Radar',
    ],
    sections: [
      {
        heading: 'Why “total OpenAI spend” is not enough',
        body: [
          'Most teams start with a single number: total monthly spend per provider. That helps you avoid surprises, but it does not tell you which features are profitable, which ones are too expensive, or where to optimize.',
          'To make real decisions, you need to slice LLM usage by feature and endpoint. Only then can you compare cost against revenue, activation and retention metrics and see the true unit economics of each flow.',
          'Without this breakdown, you are effectively subsidizing expensive features without knowing it. A “power feature” used by a small percentage of users may be eating a large portion of your LLM budget, while a simpler but high‑impact flow remains under‑invested.',
          'Total spend is a useful health metric, but only feature‑level and endpoint‑level views will tell you what to change in your product or architecture.',
        ],
      },
      {
        heading: 'Instrumentation: adding feature and tags',
        body: [
          'The simplest pattern is to add two fields to every tracked call: feature and tags. The feature is a short string that maps to a product capability such as "chat-support", "auto-summary" or "document-search".',
          'Tags let you segment further: environment, customer tier, region, or experiment flag. For example, ["production", "pro-plan", "ab-test-b"]. Over time, these tags become your primary dimensions for slicing cost.',
          'A good rule of thumb is to avoid over‑engineering tags at the beginning. Start with a small, meaningful set such as environment, plan, and feature family. You can always add more detail later, and LLM Cost Radar will keep aggregating your events consistently.',
        ],
      },
      {
        heading: 'Sending structured events to LLM Cost Radar',
        body: [
          'Once you extract tokensIn, tokensOut, provider and model from your LLM response, send them to LLM Cost Radar using the /track-llm endpoint together with your feature and tags.',
          'From there, dashboards will automatically show cost per feature, per endpoint and per tag, with rankings that make hotspots obvious. You do not need to join logs or data warehouse tables by hand — the correlation is built into your events.',
          'This approach works across providers and models. Whether you are using OpenAI, Anthropic or any other LLM vendor, you send the same event schema and LLM Cost Radar normalizes the cost for you.',
        ],
      },
      {
        heading: 'Turning cost visibility into product decisions',
        body: [
          'With per-feature cost data, you can decide which flows justify premium models and which ones can be downgraded to cheaper variants.',
          'You can also identify expensive power users or tenants and feed that insight back into your pricing, rate limiting and customer success playbooks. For example, a handful of enterprise tenants may justify a separate plan with higher limits or dedicated capacity.',
          'Over time, this visibility lets you build a roadmap that is grounded in both customer value and cost. Instead of arguing about opinions, you can prioritize the work that improves margins for the features your users love the most.',
        ],
      },
    ],
  },
  {
    slug: 'designing-llm-budgets-and-alerts-that-actually-work',
    title: 'Designing LLM Budgets and Alerts That Actually Work',
    description:
      'Practical patterns for setting up LLM budgets and alerts so you catch cost issues early without drowning your team in noise.',
    publishedAt: '2026-01-22',
    readingTimeMinutes: 9,
    heroTag: 'Budgets & alerts',
    keywords: [
      'LLM budgets',
      'LLM alerts',
      'AI cost monitoring',
      'FinOps alerts',
      'LLM Cost Radar budgets',
    ],
    sections: [
      {
        heading: 'The problem with monthly invoice surprises',
        body: [
          'By the time you see a spike on your cloud or LLM invoice, it is already too late. The spend has happened, and the context is gone.',
          'Budgets and alerts bring that signal much closer to real time, but they only work if they are designed around how your product actually uses LLMs and how your teams work day‑to‑day.',
          'A generic “you spent more this month” email is not very helpful. What you really want is an alert that says: “Production chat‑support for Pro plan customers is trending 40% above budget for this month.” That is specific enough to trigger action.',
        ],
      },
      {
        heading: 'Choosing the right budget dimensions',
        body: [
          'Instead of a single global budget, define budgets around the dimensions that matter to your business: production vs. staging, premium vs. free users, or mission‑critical vs. experimental features.',
          'In LLM Cost Radar, you can attach filters to each budget — for example, a budget that only includes events with tag "production" and feature "chat-support". This lets you protect critical paths without blocking experimentation elsewhere.',
          'Many teams start with a small set of budgets: one for overall production, one for internal tools, and one for risky experiments. As your usage matures, you can split those budgets further by region, customer tier or model family.',
        ],
      },
      {
        heading: 'Alert thresholds that balance signal and noise',
        body: [
          'A good starting point is to alert at 50%, 80% and 100% of your monthly budget for a given segment. Earlier thresholds give product and data teams time to react before costs get out of control.',
          'Over time, you can tune thresholds based on seasonality and expected growth, or create more granular budgets for particularly expensive models or high‑risk experiments.',
          'The key is to keep ownership clear. Every budget should have an owner who knows what to do when an alert fires: roll back a feature flag, change the default model, or temporarily tighten rate limits for a specific tag.',
        ],
      },
      {
        heading: 'Closing the loop with product and finance',
        body: [
          'Budgets and alerts are only useful if they trigger clear actions: rolling back a risky experiment, changing the default model, or revisiting pricing for a specific plan.',
          'By centralizing LLM cost visibility in LLM Cost Radar, you give product, engineering and finance a shared source of truth and a common language to discuss tradeoffs. Instead of debating abstract “AI costs”, you are all looking at the same per‑feature and per‑model charts.',
          'This shared understanding is what turns budgets and alerts from noisy notifications into a real FinOps practice that improves margins and keeps your AI roadmap sustainable.',
        ],
      },
    ],
  },
  {
    slug: 'comparing-llm-models-by-cost-and-quality',
    title: 'Comparing LLM Models by Cost and Quality',
    description:
      'How to compare LLM models not just by quality but by effective cost per feature, using real production data instead of theoretical pricing tables.',
    publishedAt: '2026-01-23',
    readingTimeMinutes: 10,
    heroTag: 'Model cost vs. quality',
    keywords: [
      'compare LLM models',
      'LLM pricing',
      'model cost per feature',
      'AI model selection',
      'LLM Cost Radar analytics',
    ],
    sections: [
      {
        heading: 'The limits of provider pricing tables',
        body: [
          'Provider pricing tables are a useful starting point, but they describe price per million tokens, not price per successful user action in your product.',
          'Two models with similar list prices can have very different effective cost once you factor in prompt length, retries, and downstream usage patterns. A “cheaper” model on paper can easily become the expensive one in real usage.',
          'For example, if a more capable model reduces the number of retries or follow‑up questions in a support flow, the net number of tokens (and therefore dollars) per resolved ticket may actually be lower, even if the per‑token price is higher.',
        ],
      },
      {
        heading: 'Measuring real cost per feature in production',
        body: [
          'To compare models fairly, run them in production behind feature flags or A/B tests, and tag every event with the chosen model and experiment identifier.',
          'LLM Cost Radar will aggregate cost per feature, per model and per tag so you can see which combination delivers the best cost‑to‑quality ratio for your specific use cases.',
          'Over time, you will build a library of real‑world benchmarks: for this feature, in this environment, with this type of user, model A is 30% cheaper at the same or better quality than model B. That is far more actionable than a static pricing page.',
        ],
      },
      {
        heading: 'Looking beyond raw dollar cost',
        body: [
          'Sometimes a more expensive model can be cheaper at the feature level if it reduces retries, improves conversion, or unlocks higher‑value use cases.',
          'The goal of LLM FinOps is not to minimize spend at all costs, but to allocate it where it drives the most business value. You want to invest LLM capacity where it improves activation, retention, revenue or user satisfaction — and trim it where it is mostly cosmetic.',
          'Having both cost and product metrics in the same conversation is what allows you to make those tradeoffs consciously, instead of reacting defensively to every invoice.',
        ],
      },
      {
        heading: 'Using LLM Cost Radar as your experimentation lens',
        body: [
          'Because LLM Cost Radar exposes cost by feature, model and tag, it becomes a natural lens for model experimentation: every new candidate model shows up with its own cost curve.',
          'You can combine these insights with your existing product analytics stack to make informed decisions about which models to standardize on for each flow. When cost and quality data move together, experimentation becomes much less risky.',
          'Instead of running ad‑hoc scripts after each experiment, you can rely on LLM Cost Radar to keep a continuous record of model performance and economics in your real product.',
        ],
      },
    ],
  },
  {
    slug: 'getting-started-with-llm-cost-radar-in-5-minutes',
    title: 'Getting Started With LLM Cost Radar in 5 Minutes',
    description:
      'A step-by-step guide to instrumenting your LLM usage and sending events to LLM Cost Radar using a single HTTP endpoint.',
    publishedAt: '2026-01-24',
    readingTimeMinutes: 6,
    heroTag: '5‑minute setup',
    keywords: [
      'LLM Cost Radar setup',
      'track LLM usage',
      'LLM HTTP endpoint',
      'LLM FinOps quickstart',
      'LLM cost tracking guide',
    ],
    sections: [
      {
        heading: 'Step 1 — Create your account and API key',
        body: [
          'Sign up for LLM Cost Radar and generate an API key from the “API Keys” section in the dashboard. Keep this key safe — it will be used to authenticate your tracking calls.',
          'You can create multiple keys per environment or application, and revoke them at any time without touching your LLM provider credentials.',
          'At this stage, you are not changing anything about how your application calls LLM providers. You are simply adding an independent, secure key that you will use to report usage events to LLM Cost Radar.',
        ],
      },
      {
        heading: 'Step 2 — Extract usage from your LLM provider',
        body: [
          'Most modern LLM SDKs return a usage object on each response, including tokensIn and tokensOut. Read those fields directly from the response instead of trying to count tokens yourself.',
          'If your provider does not expose usage yet, you can start by sending approximate token counts and refine later once detailed metrics become available. Even rough numbers are better than flying completely blind.',
          'Make sure you also capture the provider and model name. These fields are critical to understand which models are actually responsible for your spend and how that evolves over time.',
        ],
      },
      {
        heading: 'Step 3 — Send events to the /track-llm endpoint',
        body: [
          'For each call, send provider, model, tokensIn, tokensOut, feature and tags to the /track-llm endpoint using a simple HTTP POST request.',
          'You can use cURL, any HTTP client, or workflow tools like n8n. The only requirement is that you include your LLM Cost Radar API key in the x-api-key header so we can authenticate and attribute events to the right account.',
          'In most stacks, you can start by adding a small helper function or middleware that wraps your existing LLM calls and sends an event after each successful response. This keeps your codebase clean and your tracking consistent.',
        ],
      },
      {
        heading: 'Step 4 — Explore your dashboard',
        body: [
          'Within minutes, you will see your first events in the LLM Cost Radar dashboard: total cost, trends over time and rankings by feature, model, provider and tag.',
          'From there, you can create budgets, configure alerts and start using LLM cost data as a first‑class input in your roadmap and architecture decisions. Instead of guessing how a new feature might affect your bill, you can watch its real impact from day one.',
          'The most important step is to share these dashboards with the rest of your team. When everyone can see the cost of their changes, LLM FinOps becomes a natural part of how you design, build and ship AI‑powered experiences.',
        ],
      },
    ],
  },
]

