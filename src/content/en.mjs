// English copy, taken from ESPECIFICACAO.md. In titles, the part inside [ ] is shown in grey.

export default {
  lang: "en",
  ogLocale: "en_US",
  paths: { home: "/en/", privacy: "/en/privacy/" },
  meta: {
    title: "Vozzi by Heryzon — virtual voice assistant for phone support",
    description:
      "Vozzi answers your company's calls 24 hours a day, handles the repetitive requests and hands the rest to your team with a summary of the call.",
  },
  a11y: {
    mainNav: "Main",
    footerNav: "Footer",
    skipLink: "Skip to content",
    menuOpen: "Menu",
    menuClose: "Close menu",
    languages: { pt: "Português", en: "English" },
  },
  nav: {
    links: [
      ["desafios", "Challenges"],
      ["como-funciona", "How it works"],
      ["ouca", "Hear Bruno"],
      ["piloto", "Pilot"],
      ["investidores", "Investors"],
    ],
    cta: "Join the pilot",
  },
  hero: {
    eyebrow: "VOZZI · BY HERYZON",
    title: "Fewer menus, shorter queues. [More calls resolved.]",
    subtitle:
      "Vozzi is a virtual voice assistant that answers your company's phone calls, 24 hours a day. It understands what callers need, handles the repetitive requests and hands the rest to your team with a summary of the call.",
    primary: "Join the pilot",
    secondary: "Hear Bruno",
    note: "Pilot program with your first validation free of charge.",
  },
  panel: {
    header: "Bruno · virtual assistant",
    badge: "VOICE DEMO",
    caption: "Hear how Bruno introduces himself.",
  },
  marquee: ["ANSWERS 24/7", "UNDERSTANDS SPEECH", "ANSWERS QUESTIONS", "BOOKS", "RESCHEDULES", "CANCELS", "TRIAGES", "HANDS OFF WITH CONTEXT"],
  challenges: {
    eyebrow: "CHALLENGES",
    title: "When the phone becomes a bottleneck, [everyone loses.]",
    items: [
      ["Callers", "Navigate confusing menus, wait on hold and repeat the same information to more than one person."],
      ["Operations", "Spend team time on repeated questions, struggle to scale and miss calls at peak times and after hours."],
      ["Management", "Has little visibility into why people call and receives transfers with no context."],
    ],
  },
  how: {
    eyebrow: "HOW IT WORKS",
    title: "The caller talks. [Bruno takes it from there.]",
    steps: [
      ["Answers", "Picks up right away, at any hour, with no keypad menu."],
      ["Understands", "Callers explain in their own words, and Bruno identifies why they're calling."],
      ["Checks", "Looks up the answer in the documents and rules your company has approved."],
      ["Resolves", "Answers the question, books, reschedules or cancels during the call itself."],
      ["Hands off", "Anything that needs a person goes to your team with a ready summary. Nobody has to repeat themselves."],
    ],
    flow: {
      label:
        "Flowchart: the customer calls; Bruno triages the call; checks the company's knowledge base; handles questions, requests and scheduling on the call, or hands cases outside the rules to a human agent with a summary; everything is logged automatically.",
      cliente: ["Customer calls", "and says what they need"],
      triagem: ["Triage", "Bruno understands the reason"],
      resolveGroup: "RESOLVED ON THE CALL",
      kb: ["Knowledge base", "your company's documents and rules"],
      resolve: [
        ["Questions", "answered right away"],
        ["Requests", "handled by voice"],
        ["Scheduling", "books, reschedules and cancels"],
      ],
      outsideGroup: "OUTSIDE THE RULES",
      humano: ["Human agent", "gets the call with the summary ready"],
      registro: ["Automatic log", "reason, what was done and the summary"],
    },
  },
  does: {
    eyebrow: "WHAT IT DOES",
    title: "Clear about what it does. [And what it doesn't.]",
    columns: [
      ["Handles on the call", ["Common questions (hours, locations, documents, procedures)", "Bookings", "Rescheduling", "Cancellations", "Call triage"]],
      ["Hands off to a person", ["Serious complaints", "Negotiations", "Sensitive situations", "Any request without an approved rule"]],
      ["Not yet", ["Outbound calls", "Sales", "WhatsApp support"]],
    ],
  },
  helps: {
    eyebrow: "WHERE IT HELPS",
    title: "Built for the calls [that keep coming.]",
    items: [
      ["After hours", "Nights, weekends and holidays, every call gets answered."],
      ["At peak times", "When everyone calls at once, nobody waits in line."],
      ["Repeated questions", "The same right answer every time, without tying up your team."],
      ["Scheduling", "Books, reschedules and cancels without going through an agent."],
    ],
  },
  hear: {
    eyebrow: "HEAR BRUNO",
    title: "Every company gets [its own assistant.]",
    text: "Bruno is our demo. In your operation, the assistant can have its own name, voice and brand tone.",
    playerTitle: "Meet Bruno",
    playerSubtitle: "DEMO · 24 S",
    caption: "A sample of the voice and speaking style that could represent your company on the phone.",
  },
  control: {
    eyebrow: "CONTROL",
    title: "Your company decides [what the assistant says.]",
    items: [
      ["Approved rules", "Bruno only answers and acts on the rules and documents your company has approved. Without a rule, it doesn't improvise."],
      ["A person always within reach", "Anything outside the rules goes to your team, with a summary of the call."],
      ["Everything logged", "Every call produces a record of the reason, what was done and a summary."],
      ["Transparency", "The assistant introduces itself as a virtual assistant. Nobody is misled."],
    ],
  },
  pilot: {
    eyebrow: "PILOT PROGRAM",
    title: "Be one of the first companies [to try Vozzi.]",
    text: "We're selecting our first companies to try Vozzi in practice. Your first validation is free: together we pick one type of call, such as scheduling or common questions, and the assistant handles those calls in your operation. If you'd like to validate other types of calls afterwards, we'll agree on the terms with you before we start.",
    steps: [
      "You send us a message through the form",
      "We talk about how your company handles calls",
      "Together we pick the first type of call to validate",
      "The assistant handles those calls, at no cost to you",
    ],
    note: "Further validations: terms agreed in advance, no surprises.",
    cta: "Join the pilot",
  },
  investors: {
    eyebrow: "INVESTORS",
    title: "Vozzi is Heryzon's [first product.]",
    text: "We're building a voice customer service platform that adapts to different markets. If you invest at an early stage, we'd like to talk.",
    cta: "Talk about investing",
  },
  faq: {
    eyebrow: "FAQ",
    title: "Before we talk.",
    items: [
      ["Do callers know they're talking to a virtual assistant?", "Yes. Bruno introduces itself as a virtual assistant right at the start."],
      ["What if Bruno doesn't know the answer?", "It doesn't make things up. It transfers the call to your team, with a summary of the conversation so far."],
      ["Does it work after hours?", "Yes. The assistant answers 24 hours a day, every day."],
      ["How does it connect to my systems?", "We build the integration with your company during the pilot, based on the tools your operation already uses."],
      ["Does it work on WhatsApp?", "Not yet. Today Vozzi handles phone calls."],
      ["How much does it cost?", "The first pilot validation is free. Further validations have terms agreed with you before we start, with no surprises."],
    ],
  },
  contact: {
    eyebrow: "CONTACT",
    title: "Let's talk.",
    text: "Tell us briefly about your case. We'll get back to you soon.",
    fields: {
      name: "Name",
      email: "Email",
      company: "Company",
      industry: "Industry",
      volume: "Incoming calls per month",
      message: "Message (optional)",
    },
    topic: {
      legend: "What would you like to talk about?",
      options: [
        ["piloto", "Pilot"],
        ["investimento", "Investor"],
      ],
      // Read by screen readers when the choice changes the form fields.
      announce: {
        piloto: "Pilot fields: name, email, company, industry, calls per month and message.",
        investimento: "Investor fields: name, email and message.",
      },
    },
    volumeOptions: [
      ["ate-1000", "Up to 1,000"],
      ["1000-5000", "1,000–5,000"],
      ["5000-20000", "5,000–20,000"],
      ["mais-20000", "Over 20,000"],
      ["nao-sei", "Not sure"],
    ],
    submit: "Send",
    consent: ["By sending, you agree to the use of your data as described in our ", "Privacy policy", "."],
    success: "We got your message. We'll be in touch soon.",
    error: "We couldn't send your message. Please try again shortly.",
  },
  footer: {
    privacy: "Privacy policy",
    contact: "Contact",
    other: "Other matters:",
    rights: "© 2026 Heryzon. All rights reserved.",
  },
  privacyPage: {
    title: "Privacy Policy · Heryzon",
    description: "This policy explains how Heryzon handles the personal data of people who visit heryzon.com.br and get in touch with us.",
  },
};
