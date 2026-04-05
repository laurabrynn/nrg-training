export interface ModuleTask {
  text: string;
  duration?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GmModule {
  day: number;
  id: string;
  title: string;
  focus: string;
  tasks: ModuleTask[];
  quiz: QuizQuestion[];
}

export const gmModules: GmModule[] = [
  {
    day: 1,
    id: "gm-day-1",
    title: "General & Paperwork",
    focus: "Welcome & Onboarding — get set up with systems and understand your role",
    tasks: [
      { text: "Complete onboarding into Inova & fill out tax forms", duration: "20 min" },
      { text: "Read employee manual & turn in acknowledgment page", duration: "30 min" },
      { text: "Receive training binder & notebook" },
      { text: "Set up system logins: email, Inova, MarginEdge, 7Shifts, Toast", duration: "15 min" },
      { text: "Team introductions, including NRG HQ" },
      { text: "Review training schedule & confirm all meetings" },
      { text: "Review GM Responsibilities & Accountabilities" },
      { text: "Intro to Trello: Playbook + Property Board" },
      { text: "Homework: Read Steps of Service / Hospitality Guide" },
    ],
    quiz: [
      {
        question: "Which system is used for payroll, onboarding, and HR management at NRG?",
        options: ["Toast", "7Shifts", "Inova", "MarginEdge"],
        correctIndex: 2,
        explanation: "Inova is NRG's HR and payroll platform. You'll use it for onboarding new hires, managing clock-ins, and running payroll reports.",
      },
      {
        question: "What is the scheduling and labor management system used across NRG properties?",
        options: ["Trello", "7Shifts", "Toast", "MarginEdge"],
        correctIndex: 1,
        explanation: "7Shifts is NRG's scheduling platform. You'll use it to build schedules, manage shift swaps, and communicate with your team.",
      },
      {
        question: "After reading the employee manual, what must you turn in?",
        options: ["A quiz score", "An acknowledgment page", "A signed offer letter", "A training checklist"],
        correctIndex: 1,
        explanation: "The acknowledgment page confirms you've read and understood the employee manual. It's a required part of onboarding.",
      },
      {
        question: "What tool is used to manage property-level tasks, playbooks, and ongoing projects?",
        options: ["Google Drive", "Trello", "Slack", "MarginEdge"],
        correctIndex: 1,
        explanation: "Trello is NRG's project management tool. Your property board will become your daily hub for tracking tasks, checklists, and leadership priorities.",
      },
    ],
  },
  {
    day: 2,
    id: "gm-day-2",
    title: "Stage",
    focus: "Hospitality, floor management, service standards — apply them in real-time",
    tasks: [
      { text: "Stage until close" },
      { text: "Observe floor management, guest interactions, and service standards" },
      { text: "Practical Toast training: comps vs. voids, coursing vs. firing" },
      { text: "Complete Nightly Log" },
      { text: "End of Day Recap with Director of Operations" },
    ],
    quiz: [
      {
        question: "In Toast, what is the difference between a comp and a void?",
        options: [
          "They are the same thing",
          "A comp removes an item before it's sent to the kitchen; a void applies a discount after",
          "A void removes an item before it's made; a comp discounts or removes an item after it's been made",
          "A comp applies to drinks; a void applies to food",
        ],
        correctIndex: 2,
        explanation: "A void removes an item before it's prepared — no cost to the house. A comp discounts or removes an item after the fact, which does have a cost and requires manager authorization.",
      },
      {
        question: "What is the purpose of the Nightly Log?",
        options: [
          "To track inventory usage",
          "To document shift observations, incidents, and notable guest interactions",
          "To record staff clock-in times",
          "To submit payroll",
        ],
        correctIndex: 1,
        explanation: "The Nightly Log is your written record of each shift — it captures what happened, any issues, guest feedback, and notes for the next manager on duty.",
      },
      {
        question: "In Toast, what does 'firing' a course mean?",
        options: [
          "Canceling a table's order",
          "Sending a course to the kitchen to begin preparation",
          "Removing a menu item from service",
          "Closing out a check",
        ],
        correctIndex: 1,
        explanation: "Firing a course sends the signal to the kitchen to start preparing that round of food. Coursing and firing are critical tools for controlling the pace of a guest's meal.",
      },
    ],
  },
  {
    day: 3,
    id: "gm-day-3",
    title: "Accounting",
    focus: "Daily financials, cash handling, and payroll basics",
    tasks: [
      { text: "Stage for Brunch" },
      { text: "Accounting overview & practical training", duration: "1 hr" },
      { text: "Cash handling & reconciliation" },
      { text: "Bank drops" },
      { text: "Payroll basics: clock-ins/outs, job codes, deadlines" },
    ],
    quiz: [
      {
        question: "What is cash reconciliation?",
        options: [
          "Counting tips at the end of the night",
          "Verifying that cash on hand matches what the POS reports were taken in",
          "Submitting the weekly payroll report",
          "Logging comps and voids in Toast",
        ],
        correctIndex: 1,
        explanation: "Cash reconciliation means matching your physical cash drawer against Toast's sales reports. Any discrepancy needs to be documented and investigated.",
      },
      {
        question: "What is a bank drop?",
        options: [
          "Transferring funds between NRG properties",
          "Depositing cash into the safe or bank to reduce cash-on-hand risk",
          "Running a daily report in MarginEdge",
          "Logging a cash tip adjustment",
        ],
        correctIndex: 1,
        explanation: "A bank drop is the process of moving excess cash from the drawer into the safe or bank deposit. It's a key security practice to minimize cash exposure during a shift.",
      },
      {
        question: "Why do job codes matter in payroll?",
        options: [
          "They determine which section a server works",
          "They track hours by role so labor costs are assigned to the right department",
          "They are used to set menu prices in Toast",
          "They control which employees can access the POS",
        ],
        correctIndex: 1,
        explanation: "Job codes tie each clock-in to a specific role (server, bartender, host, etc.), which lets NRG track labor costs accurately by position and department.",
      },
    ],
  },
  {
    day: 4,
    id: "gm-day-4",
    title: "Beverage",
    focus: "Build working knowledge of the beverage program and ordering process",
    tasks: [
      { text: "Run drinks, observe bars — learn beer, wine, liquor, and back bar" },
      { text: "Beverage program training with Beverage Director / bar manager", duration: "2 hr" },
      { text: "Beverage ordering & inventory walkthrough" },
      { text: "Introduction to beer program: keg changes, 86 lists, etc." },
    ],
    quiz: [
      {
        question: "Who leads the NRG beverage program?",
        options: ["Michael Babin", "Ethan McKee", "Greg Engert", "Clare Parker"],
        correctIndex: 2,
        explanation: "Greg Engert is NRG's Partner and Beverage Director. He oversees the cocktail, beer, wine, and spirits programs across all properties.",
      },
      {
        question: "What does it mean when an item is '86'd'?",
        options: [
          "It has been added as a new menu item",
          "It is a daily special",
          "It is no longer available — out of stock or removed from service",
          "It requires manager approval to order",
        ],
        correctIndex: 2,
        explanation: "86 means the item is unavailable — either you've run out or it's been pulled from service. Keeping your 86 list current and communicating it to staff is a key management responsibility.",
      },
      {
        question: "What is the primary purpose of a beverage inventory walkthrough?",
        options: [
          "To taste-test new products",
          "To understand par levels, what needs ordering, and what's on hand",
          "To train bar staff on new cocktails",
          "To update menu prices in Toast",
        ],
        correctIndex: 1,
        explanation: "Inventory walkthroughs establish your baseline — what you have, what your pars are, and what needs to be ordered. This feeds directly into your ordering and cost control.",
      },
    ],
  },
  {
    day: 5,
    id: "gm-day-5",
    title: "HR & Training",
    focus: "Hiring, scheduling, and coaching team members",
    tasks: [
      { text: "NRG Manual Review — salary and hourly benefits" },
      { text: "Health Insurance & 401k program overview" },
      { text: "Interviewing and recruiting basics (confirm Indeed access)" },
      { text: "Inova Training — onboarding, reporting, management tasks", duration: "25 min" },
      { text: "Coaching, progressive discipline, and terminations" },
      { text: "HR Trello Overview" },
      { text: "Walkthrough of Flash Report" },
      { text: "Stage — Closing Shift" },
    ],
    quiz: [
      {
        question: "What is progressive discipline?",
        options: [
          "A system for giving raises based on performance",
          "A structured approach to addressing employee issues through escalating steps before termination",
          "A training program for high-performing staff",
          "A method for scheduling based on seniority",
        ],
        correctIndex: 1,
        explanation: "Progressive discipline is a documented, step-by-step process — typically verbal warning, written warning, final warning, then termination. It protects both the employee and NRG legally, and gives staff a clear path to improve.",
      },
      {
        question: "What does the Flash Report show?",
        options: [
          "A summary of the week's marketing performance",
          "Daily sales, labor costs, and key financial metrics for the property",
          "Staff schedule for the upcoming week",
          "Inventory levels and ordering needs",
        ],
        correctIndex: 1,
        explanation: "The Flash Report is your daily financial snapshot — sales, labor %, covers, average check, and other KPIs. Reviewing it every day keeps you connected to your property's financial health.",
      },
      {
        question: "Who is NRG's HR Director?",
        options: ["Rachel Corrigan", "Clare Parker", "Níamh O'Donovan", "Stephanie Babin"],
        correctIndex: 1,
        explanation: "Clare Parker is NRG's HR Director. She's your resource for complex HR situations, compliance questions, and anything requiring escalation beyond the property level.",
      },
    ],
  },
  {
    day: 6,
    id: "gm-day-6",
    title: "Facilities",
    focus: "Facility standards, vendor protocols, and inspection readiness",
    tasks: [
      { text: "Facility walkthrough" },
      { text: "R&M forms & communication process", duration: "45 min" },
      { text: "Health inspection protocol" },
      { text: "Pest control procedures" },
    ],
    quiz: [
      {
        question: "What does R&M stand for?",
        options: ["Revenue & Marketing", "Repair & Maintenance", "Reservations & Management", "Resources & Materials"],
        correctIndex: 1,
        explanation: "R&M stands for Repair & Maintenance. Submitting R&M requests properly and following up on them is one of a GM's core operational responsibilities.",
      },
      {
        question: "If a health inspector arrives during service, what is the first thing you should do?",
        options: [
          "Ask them to come back at a less busy time",
          "Immediately call the corporate office",
          "Greet them professionally, ask for their credentials, and begin the walkthrough calmly",
          "Pause all service until the inspection is complete",
        ],
        correctIndex: 2,
        explanation: "Always greet inspectors professionally and cooperatively. Panicking or delaying raises red flags. Know your property's protocols and walk through confidently — your preparation determines the outcome.",
      },
      {
        question: "Why is pest control documentation important for a GM?",
        options: [
          "It's required for marketing purposes",
          "It demonstrates proactive compliance and is critical evidence during health inspections",
          "It's only needed when a pest issue is reported by a guest",
          "It's managed entirely by the facilities team — GMs don't need to track it",
        ],
        correctIndex: 1,
        explanation: "Health inspectors will ask for your pest control logs. Consistent, documented service visits show the property is proactively managing the issue — a gap in records can result in violations even if there's no active problem.",
      },
    ],
  },
  {
    day: 7,
    id: "gm-day-7",
    title: "Menus",
    focus: "Confidently update menus, troubleshoot Toast, and communicate changes",
    tasks: [
      { text: "Brunch Shift" },
      { text: "Menu updating & Toast programming", duration: "1.5 hr" },
      { text: "3PD menu/hour updating" },
      { text: "Troubleshooting Toast + reporting" },
      { text: "Menu editing in Illustrator / Adobe Cloud" },
      { text: "Website updates" },
    ],
    quiz: [
      {
        question: "What does 3PD stand for in the context of menu management?",
        options: ["Third-Party Delivery", "Three-Part Display", "Toast POS Dashboard", "Third-Party Data"],
        correctIndex: 0,
        explanation: "3PD stands for Third-Party Delivery — platforms like DoorDash, Uber Eats, and Grubhub. Keeping 3PD menus updated (items, prices, hours) is a critical GM responsibility to avoid guest complaints and order errors.",
      },
      {
        question: "What tool is used to edit printed menu files at NRG?",
        options: ["Google Docs", "Microsoft Word", "Adobe Illustrator / Adobe Cloud", "Canva"],
        correctIndex: 2,
        explanation: "NRG uses Adobe Illustrator for menu design files. As a GM you'll need to make edits for price changes, 86s, and seasonal updates — knowing your way around the file saves time and keeps quality consistent.",
      },
      {
        question: "When a menu item price changes, where does it need to be updated?",
        options: [
          "Only in Toast",
          "Only on the printed menu",
          "In Toast, on 3PD platforms, the website, and printed menus",
          "Only in Toast and on the website",
        ],
        correctIndex: 2,
        explanation: "Price changes need to be reflected everywhere simultaneously — Toast (POS), third-party delivery platforms, the website, and any printed materials. A missed update creates guest-facing inconsistency and potential revenue loss.",
      },
    ],
  },
  {
    day: 8,
    id: "gm-day-8",
    title: "Marketing & Programming",
    focus: "Manage marketing channels and support event sales",
    tasks: [
      { text: "MarComm Submission Form training" },
      { text: "Social media best practices" },
      { text: "Yelp/Google review response protocols" },
      { text: "Website updates & event listings" },
      { text: "Private Dining: Tripleseat 101" },
      { text: "Event procedures: Toast ghost employees, spaces & minimums, 90-day lookout" },
    ],
    quiz: [
      {
        question: "What is Tripleseat used for?",
        options: [
          "Scheduling staff for private events",
          "Managing private dining inquiries, contracts, and event logistics",
          "Running marketing campaigns on social media",
          "Tracking inventory for events",
        ],
        correctIndex: 1,
        explanation: "Tripleseat is NRG's private dining and events CRM. All private dining leads, proposals, contracts, and BEOs flow through Tripleseat — knowing it well directly impacts your event revenue.",
      },
      {
        question: "What is the MarComm Submission Form used for?",
        options: [
          "Submitting payroll for marketing staff",
          "Requesting marketing and communications support from the NRG creative team",
          "Tracking social media analytics",
          "Submitting guest complaints to corporate",
        ],
        correctIndex: 1,
        explanation: "The MarComm Submission Form is how you request support from NRG's Marketing & Creative team — for events, promotions, social content, and more. Using it correctly ensures your requests are prioritized and delivered on time.",
      },
      {
        question: "What is the '90-day lookout' in the context of private dining?",
        options: [
          "A 90-day cancellation policy for large events",
          "A rolling view of upcoming events and private dining leads over the next 90 days",
          "A monthly review of event profitability",
          "The minimum booking window for private events",
        ],
        correctIndex: 1,
        explanation: "The 90-day lookout keeps you proactive about upcoming event business — you should always know what's on the books 3 months out so you can staff, prep, and communicate appropriately.",
      },
    ],
  },
  {
    day: 9,
    id: "gm-day-9",
    title: "Systems Review",
    focus: "Solidify knowledge across all systems and confirm readiness",
    tasks: [
      { text: "Payroll Training — submit payroll with Rachel C" },
      { text: "Tiphaus training: rules, pulling reports, daily binder printout" },
      { text: "MarginEdge training: coding, approving invoices" },
      { text: "Inventory & vendor deadlines" },
      { text: "Training review: miscellaneous systems catch-up" },
      { text: "Dinner Shift" },
    ],
    quiz: [
      {
        question: "What is Tiphaus used for?",
        options: [
          "Processing credit card payments",
          "Managing tip pooling rules, calculations, and distribution reporting",
          "Tracking inventory levels",
          "Submitting vendor invoices",
        ],
        correctIndex: 1,
        explanation: "Tiphaus automates tip pool calculations based on your property's rules. The daily binder printout gives you a record of tip distribution — critical for both staff trust and compliance.",
      },
      {
        question: "What does MarginEdge help a GM manage?",
        options: [
          "Staff scheduling and labor",
          "Invoice coding, food cost tracking, and accounts payable",
          "Guest reservations and waitlists",
          "Social media and marketing",
        ],
        correctIndex: 1,
        explanation: "MarginEdge is NRG's invoice and food cost management platform. You'll use it to code and approve vendor invoices, track food cost in real time, and manage your AP workflow.",
      },
      {
        question: "Why are vendor deadlines important to track as a GM?",
        options: [
          "Missing them has no real consequence",
          "Vendors only deliver on specific days — missing order windows means running out of product",
          "Vendors charge extra fees for late orders, which impacts marketing budgets",
          "Vendor deadlines are managed by the corporate purchasing team",
        ],
        correctIndex: 1,
        explanation: "Most vendors have fixed order and delivery windows. Missing a deadline means you may run out of key items before the next delivery — that directly impacts your menu, your guests, and your revenue.",
      },
    ],
  },
  {
    day: 10,
    id: "gm-day-10",
    title: "Leadership Essentials",
    focus: "Develop leadership style and practice managing staff in real-time",
    tasks: [
      { text: "Leadership training: communication, morale, team protection, giving/receiving credit" },
      { text: "Professional standards: uniforms, shift meals/drinks" },
      { text: "Create staff list with training priorities" },
      { text: "Daily GM Schedule Review & Adjustments" },
      { text: "Trello recap — personalize your property board" },
      { text: "Review Flash Report" },
    ],
    quiz: [
      {
        question: "What does 'spread credit, take blame' mean as a leadership principle?",
        options: [
          "Always let your team know when they make mistakes",
          "When things go well, recognize your team publicly; when things go wrong, own it as the leader",
          "Split tips evenly among all staff regardless of role",
          "Document both successes and failures in the Nightly Log",
        ],
        correctIndex: 1,
        explanation: "Great managers shield their team from blame and amplify their wins. This builds trust, loyalty, and a culture where people feel safe taking initiative. The opposite — taking credit and deflecting blame — destroys teams fast.",
      },
      {
        question: "What is the primary purpose of the Daily GM Schedule Review?",
        options: [
          "To plan what you'll eat for your shift meal",
          "To assess staffing needs, anticipate challenges, and set the tone before service begins",
          "To review the prior night's Nightly Log",
          "To submit the day's payroll adjustments",
        ],
        correctIndex: 1,
        explanation: "The Daily Schedule Review is how you get ahead of your shift — checking covers, staffing levels, large parties, and any known issues before they become problems. Preparation is the difference between managing and reacting.",
      },
      {
        question: "Why is managing staff morale a core GM responsibility?",
        options: [
          "It's not — morale is HR's responsibility",
          "High morale directly correlates with better guest experiences, lower turnover, and stronger team performance",
          "It only matters during slow periods",
          "It's important only for tipped employees",
        ],
        correctIndex: 1,
        explanation: "Your team's energy sets the tone for every guest interaction. A GM who actively protects morale — acknowledging effort, addressing issues quickly, creating a positive environment — sees it reflected in reviews, retention, and sales.",
      },
    ],
  },
];

export function getModule(day: number): GmModule | undefined {
  return gmModules.find((m) => m.day === day);
}
