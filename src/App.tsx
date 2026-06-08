import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clock,
  Instagram,
  Linkedin,
  Link as LinkIcon,
  Menu,
  Twitter,
  X,
} from 'lucide-react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'

const CONTACT_HREF = 'mailto:mantsai@zohomail.eu'
const BOOKING_HREF = 'https://mantaai.zohobookings.eu/#/254973000000048054'
const DIAGNOSTIC_WEBHOOK_URL = import.meta.env.VITE_DIAGNOSTIC_WEBHOOK_URL ?? ''
const HOME_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=1600&q=80'
const PORTRAIT_IMAGE = '/stephen.png'

const LINKTREE_HREF = 'https://linktr.ee/stephenmantle'
const SOCIAL_LINKS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/stephenmantle/', Icon: Linkedin },
  { label: 'Instagram', href: 'https://instagram.com/mantle_studios', Icon: Instagram },
  { label: 'X / Twitter', href: 'https://x.com/stephenmantle', Icon: Twitter },
  { label: 'All links', href: LINKTREE_HREF, Icon: LinkIcon },
] as const

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Work', to: '/portfolio' },
  { label: 'Journal', to: '/blog' },
] as const

const ROUTE_META: Record<
  RoutePath,
  {
    title: string
    description: string
  }
> = {
  '/': {
    title: 'Stephen Mantle — Web Design & Automations',
    description:
      'Stephen Mantle builds websites, workflow systems, and practical automations for service businesses that need clearer operations and better follow-through.',
  },
  '/about': {
    title: 'About — Stephen Mantle',
    description:
      'Operational thinking, workflow clarity, and practical AI implementation for businesses that need systems people actually use.',
  },
  '/services': {
    title: 'Services — Stephen Mantle',
    description:
      'Every service listed here is live at Mantle Studios. Website builds, automation systems, research agents, and diagnostics — with proof of concept for each.',
  },
  '/diagnostic': {
    title: 'AI Readiness Check — Stephen Mantle',
    description:
      'Take the AI Readiness Check to identify operational friction, score workflow readiness, and find the safest first system to improve.',
  },
  '/portfolio': {
    title: 'Work — Stephen Mantle',
    description:
      'Selected work: websites, operational systems, and automations built for service businesses that needed clearer systems and a stronger online presence.',
  },
  '/blog': {
    title: 'Journal — Stephen Mantle',
    description:
      'Notes on building practical software, web design, and automation systems for service businesses.',
  },
}

const HOME_PROOF = [
  {
    title: 'Operational systems',
    body: 'Dashboards, reporting layers, workflow logic, and AI-assisted admin built around real business friction.',
  },
  {
    title: 'Business websites',
    body: 'Clear, credible sites for service businesses that need to explain the offer properly and turn attention into contact.',
  },
] as const

const ABOUT_PROBLEMS = [
  'Work gets duplicated because ownership is unclear.',
  'Important updates live across inboxes, chats, spreadsheets, and memory.',
  'Manual reporting delays decisions that should be obvious earlier.',
  'Teams create workarounds because the real process no longer fits the work.',
] as const

const QUIZ_STAGES = [
  { key: 'profile', label: 'Profile' },
  { key: 'workflow', label: 'Workflow' },
  { key: 'trust', label: 'Trust' },
  { key: 'result', label: 'Result' },
] as const

const QUIZ_PERSONAS = [
  {
    value: 'sme',
    title: 'SME / service business',
    body: 'Trades, agencies, hospitality, local operators, and owner-led teams.',
  },
  {
    value: 'clinic_manager',
    title: 'Clinic / practice manager',
    body: 'You run patient flow, staff coordination, admin, and daily operations.',
  },
  {
    value: 'doctor',
    title: 'Doctor / clinician',
    body: 'You care most about safe boundaries, admin relief, and time back for care.',
  },
  {
    value: 'professional',
    title: 'Other professional business',
    body: 'Accountancy, legal, consulting, property, finance, and specialist firms.',
  },
] as const

const QUIZ_BOTTLENECKS = [
  {
    value: 'missed_calls',
    title: 'Missed calls',
    body: 'Someone is busy, the call is missed, and the lead cools.',
  },
  {
    value: 'inbox_overload',
    title: 'Inbox overload',
    body: 'Messages pile up faster than anyone can triage them.',
  },
  {
    value: 'slow_followup',
    title: 'Slow follow-up',
    body: 'Quotes, reminders, confirmations, and nudges happen too late.',
  },
  {
    value: 'documentation',
    title: 'Documentation drag',
    body: 'Notes, summaries, updates, and admin spill into the evening.',
  },
  {
    value: 'billing',
    title: 'Billing / admin',
    body: 'Payment follow-up, forms, and repetitive office steps eat hours.',
  },
  {
    value: 'reputation',
    title: 'Reviews / reputation',
    body: 'Good service is not consistently turning into visible proof.',
  },
  {
    value: 'reporting',
    title: 'Reporting',
    body: 'Weekly summaries keep pulling senior people into routine work.',
  },
  {
    value: 'scheduling',
    title: 'Scheduling / no-shows',
    body: 'Time is lost to avoidable reschedules, gaps, and chasing.',
  },
] as const

const QUIZ_CONSEQUENCES = [
  { value: 'revenue', label: 'Lost revenue' },
  { value: 'stress', label: 'Staff stress' },
  { value: 'experience', label: 'Client frustration' },
  { value: 'cashflow', label: 'Slow cashflow' },
  { value: 'risk', label: 'Compliance risk' },
  { value: 'all', label: 'All of the above' },
] as const

const QUIZ_STACK_OPTIONS = [
  'email',
  'calendar',
  'phone',
  'crm',
  'ehr',
  'billing software',
  'whatsapp / sms',
  'spreadsheets',
  'nothing joined up',
] as const

const QUIZ_TRUST_OPTIONS = [
  {
    value: 'draft',
    title: 'Draft only',
    body: 'AI prepares work, but a human always finishes it.',
  },
  {
    value: 'prepare',
    title: 'Prepare then ask me',
    body: 'AI organises the work and asks for a final go-ahead.',
  },
  {
    value: 'approval',
    title: 'Routine actions with approval rules',
    body: 'AI handles routine tasks inside clear boundaries.',
  },
  {
    value: 'auto',
    title: 'Fully automate simple tasks',
    body: 'If it is repetitive and low-risk, let it run.',
  },
] as const

const QUIZ_HUMAN_OPTIONS = [
  'clinical judgement',
  'complaints',
  'pricing exceptions',
  'sensitive messages',
  'payment disputes',
  'hiring / firing decisions',
] as const

const QUIZ_QUESTIONS = [
  {
    kicker: 'Question 1 of 8',
    title: 'Which best describes your business today?',
    copy: 'Start with identity, not software. This shapes the language for everything that follows.',
    stage: 'profile',
  },
  {
    kicker: 'Question 2 of 8',
    title: 'Where does work slip through the cracks most often?',
    copy: 'Pick the one that costs you the most in a normal week.',
    stage: 'workflow',
  },
  {
    kicker: 'Question 3 of 8',
    title: 'How often does this problem hit in a normal week?',
    copy: 'This weights urgency without forcing you to overthink it.',
    stage: 'workflow',
  },
  {
    kicker: 'Question 4 of 8',
    title: 'What happens when this goes wrong?',
    copy: 'This turns a daily irritation into a commercial consequence.',
    stage: 'workflow',
  },
  {
    kicker: 'Question 5 of 8',
    title: 'What systems are already part of your day?',
    copy: 'This measures integration readiness and shapes the first build.',
    stage: 'workflow',
  },
  {
    kicker: 'Question 6 of 8',
    title: 'How far would you trust AI today?',
    copy: 'This separates curiosity from real operational readiness.',
    stage: 'trust',
  },
  {
    kicker: 'Question 7 of 8',
    title: 'What must stay human, no matter what?',
    copy: 'This is where the right boundaries get defined up front.',
    stage: 'trust',
  },
  {
    kicker: 'Question 8 of 8',
    title: 'If one annoying task disappeared by Monday, what would you choose?',
    copy: 'Use your own words. This is what personalises the diagnosis.',
    stage: 'result',
  },
  {
    kicker: 'Almost there',
    title: 'Your score is ready.',
    copy: 'Enter your name and email to unlock the result and pass it into the follow-up flow.',
    stage: 'result',
  },
] as const

const DIAGNOSTIC_SERVICES = [
  {
    label: 'Diagnostic Sprint',
    title: 'Find the real blockage first',
    body: 'Map the revenue leak, score the operational friction, and identify the first workflow that should change.',
  },
  {
    label: 'Implementation',
    title: 'Build the first working system',
    body: 'Turn the diagnosis into a live workflow with clear boundaries, visibility, and practical handoffs.',
  },
  {
    label: 'Refinement',
    title: 'Tighten what people actually use',
    body: 'Review adoption, fix weak points, and extend the system only where it creates real operational gain.',
  },
] as const

const COMMON_PROBLEMS = [
  {
    id: 'enquiries',
    number: '01',
    title: 'Enquiries arrive when you\'re unavailable.',
    body: 'Someone visits at 10pm looking for a quote. No reply comes. They move on. You never knew they were there.',
  },
  {
    id: 'quotes',
    number: '02',
    title: 'Quotes that go cold after one email.',
    body: 'You sent the proposal. They went quiet. Most conversions happen on the second or third follow-up — which never gets sent.',
  },
  {
    id: 'invoices',
    number: '03',
    title: 'Invoices you shouldn\'t have to chase.',
    body: 'The work is done. The invoice sits unpaid. Chasing is uncomfortable, easy to postpone, and ultimately your problem.',
  },
  {
    id: 'admin',
    number: '04',
    title: 'Admin that spills into the evening.',
    body: 'Notes, summaries, updates, follow-ups. Repetitive work that accumulates every day and never quite gets finished.',
  },
  {
    id: 'visibility',
    number: '05',
    title: 'No visibility without opening five apps.',
    body: 'What\'s open, pending, and overdue? The information exists somewhere. Just never in one place at the right time.',
  },
  {
    id: 'website',
    number: '06',
    title: 'A website that doesn\'t work while you\'re not watching.',
    body: 'It lists your services. It has a phone number. But it doesn\'t capture leads, answer questions, or follow up on its own.',
  },
] as const

type ServiceStatus = 'live' | 'template' | 'building'

const SERVICES = [
  {
    id: 'website',
    status: 'live' as ServiceStatus,
    statusLabel: 'Live at Mantle Studios',
    name: 'Website Design & Build',
    description: 'Clean, credible sites that explain the offer clearly and make it easy for the right client to act.',
    builtWith: ['React', 'Tailwind', 'Vercel'],
    proofHeadline: 'The Mantle Studios site is the proof.',
    proofBody: 'mantle-studios.com was built from scratch — copy, design, and full Vercel deployment. The commercial front door for Mantle Studios, built to earn trust with clients before the first conversation.',
  },
  {
    id: 'mail-automation',
    status: 'live' as ServiceStatus,
    statusLabel: 'Live at Mantle Studios',
    name: 'Morning Brief & Mail Automation',
    description: 'Automated daily briefings, inbox triage, and follow-up flows that remove the morning admin pile.',
    builtWith: ['Zapier', 'Zoho Mail', 'Claude API'],
    proofHeadline: 'Mantle Studios runs a daily brief every morning.',
    proofBody: 'The pipeline pulls overnight activity, flags anything that needs a reply, and formats it into a single briefing email. No manual inbox sorting before the workday starts.',
  },
  {
    id: 'research-agent',
    status: 'live' as ServiceStatus,
    statusLabel: 'Live at Mantle Studios',
    name: 'Research Agent System',
    description: 'Automated research loops that surface competitor moves, industry signals, and client intelligence weekly.',
    builtWith: ['Claude API', 'Exa', 'Zapier'],
    proofHeadline: 'Mantle Studios runs a research loop weekly.',
    proofBody: 'The agent monitors target industry trends, surfaces relevant signals, and outputs a structured report. Hours of manual reading replaced by a system that runs unattended.',
  },
  {
    id: 'newsletter',
    status: 'building' as ServiceStatus,
    statusLabel: 'In Development',
    name: 'Business Insights Newsletter',
    description: 'A research-to-newsletter pipeline that turns agent output into a structured weekly send.',
    builtWith: ['Claude API', 'Canva', 'Zapier'],
    proofHeadline: 'The Mantle Studios Weekly Brief is in build.',
    proofBody: 'Research agent output feeds directly into a formatted newsletter template. The pipeline handles structure, formatting, and scheduling — editorial decisions stay human.',
  },
  {
    id: 'content-pipeline',
    status: 'template' as ServiceStatus,
    statusLabel: 'Template Available',
    name: 'AI Content Pipeline',
    description: 'A system for planning, drafting, and scheduling content across platforms without daily overhead.',
    builtWith: ['Claude API', 'Notion', 'Zapier'],
    proofHeadline: 'Built and templated for digital agencies.',
    proofBody: 'Handles brief intake, draft generation, review routing, and posting schedules. Ready to adapt for any service business with a consistent content output requirement.',
  },
  {
    id: 'booking',
    status: 'template' as ServiceStatus,
    statusLabel: 'Template Available',
    name: 'Booking & Scheduling Automation',
    description: 'Cal.com-based booking with automated reminders, no-show prevention, and confirmation flows.',
    builtWith: ['Cal.com', 'Zapier', 'Zoho Mail'],
    proofHeadline: 'Running on this site.',
    proofBody: 'The booking system on stephenmantle.com uses the same stack. Appointment confirmed, reminder sent, follow-up triggered — without manual intervention.',
  },
  {
    id: 'zapier-mcp',
    status: 'building' as ServiceStatus,
    statusLabel: 'In Development',
    name: 'Zapier & MCP Workflow Layer',
    description: 'A composable automation layer connecting AI tools, business apps, and internal systems.',
    builtWith: ['Zapier', 'MCP', 'Claude API'],
    proofHeadline: 'The antiagento layer powers Mantle Studios operations.',
    proofBody: 'Every automation at Mantle Studios runs through a Zapier and MCP orchestration layer. This is the connective tissue between AI tools and business-critical apps.',
  },
  {
    id: 'diagnostic',
    status: 'live' as ServiceStatus,
    statusLabel: 'Live Demo',
    name: 'AI Readiness Diagnostic',
    description: 'An 8-question diagnostic that scores a business across workflow, data, trust, and urgency — then identifies a first system worth building.',
    builtWith: ['React', 'Webhook', 'Zoho Mail'],
    proofHeadline: 'The full working diagnostic is on this site.',
    proofBody: 'This is not a concept. The scoring logic, archetype classification, and follow-up webhook are live. The same diagnostic can sit inside a client onboarding or enquiry flow.',
  },
] as const

const APPROACH_STEPS = [
  {
    number: '01',
    label: 'Brief',
    title: 'Establish what you actually need.',
    bullets: [
      '30-minute call plus a short async questionnaire.',
      'Map what exists, what is in the way, what success looks like.',
      'Output: a one-page summary you sign off before any scope work.',
    ],
  },
  {
    number: '02',
    label: 'Scope',
    title: 'Fixed price, fixed deliverables, written down.',
    bullets: [
      'Scope document with exact deliverables, timeline, and dependencies.',
      'No hourly billing. No surprise change orders mid-build.',
      'Output: a signed scope you can hold me to.',
    ],
  },
  {
    number: '03',
    label: 'Build',
    title: 'Working drafts every week.',
    bullets: [
      'You see real progress weekly, not a big reveal at the end.',
      'Redirect early — nothing in the build is precious.',
      'Output: a working site or system you have already used.',
    ],
  },
  {
    number: '04',
    label: 'Handover',
    title: 'Live, documented, and yours to run.',
    bullets: [
      'Site or system goes live with a clean handover doc.',
      'Walkthrough on what to change yourself versus what to send back.',
      '30 days of post-launch support included by default.',
    ],
  },
] as const

const SERVICES_STATS = [
  { label: 'Years building', value: '8+', note: 'Web, systems, and automation work shipped since 2017.' },
  { label: 'Live systems', value: '6+', note: 'Studio sites, internal tools, and automations currently in production.' },
  { label: 'On-time launches', value: '100%', note: 'Every engagement landed on the agreed launch window.' },
  { label: 'Avg response', value: '<24h', note: 'First reply on every new enquiry inside one working day.' },
] as const

const INQUIRY_PROJECT_TYPES = [
  { value: 'new_build', title: 'New build', body: 'Starting from scratch — website, system, or automation.' },
  { value: 'improve', title: 'Existing system', body: 'Something exists but needs improvement or extension.' },
  { value: 'automation_first', title: 'Automation first', body: 'The site is fine — the workflow behind it needs fixing.' },
  { value: 'exploring', title: 'Just exploring', body: 'No specific brief yet — seeing what is possible.' },
] as const

const INQUIRY_TIMELINES = [
  { value: 'asap', label: 'ASAP' },
  { value: '1_3m', label: '1–3 months' },
  { value: '3_6m', label: '3–6 months' },
  { value: 'exploring', label: 'Just exploring' },
] as const

const INQUIRY_BUDGETS = [
  { value: 'under_1k', label: '< €1,000' },
  { value: '1k_5k', label: '€1k–€5k' },
  { value: '5k_15k', label: '€5k–€15k' },
  { value: 'open', label: 'Open budget' },
] as const

type RoutePath = '/' | '/about' | '/services' | '/diagnostic' | '/portfolio' | '/blog'

type QuizAnswers = {
  persona: string
  bottleneck: string
  frequency: number
  consequence: string
  stack: string[]
  trust: string
  human: string[]
  mondayTask: string
  gateName: string
  gateEmail: string
}

type LeadSubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

type InquiryAnswers = {
  services: string[]
  projectType: string
  timeline: string
  budget: string
  name: string
  email: string
  note: string
}
type InquirySubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
const createInitialInquiryAnswers = (): InquiryAnswers => ({
  services: [],
  projectType: '',
  timeline: '',
  budget: '',
  name: '',
  email: '',
  note: '',
})

type QuizScores = {
  workflow: number
  data: number
  trust: number
  urgency: number
  creative: number
  overall: number
}

type QuizRecommendation = {
  archetype: {
    title: string
    sub: string
  }
  touchFirst: string
  keepHuman: string
  gain: string
  next: string
  mirrored: string
}

type RollingButtonProps = {
  label: string
  href?: string
  onClick?: () => void
  className: string
  arrowCircleClassName: string
  arrowClassName: string
  textClassName?: string
}

const createInitialQuizAnswers = (): QuizAnswers => ({
  persona: '',
  bottleneck: '',
  frequency: 2,
  consequence: '',
  stack: [],
  trust: '',
  human: [],
  mondayTask: '',
  gateName: '',
  gateEmail: '',
})

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value))
}

function isValidEmail(value: string) {
  return /\S+@\S+\.\S+/.test(value)
}

function computeQuizScores(answers: QuizAnswers): QuizScores {
  const hasKnownBottleneck = QUIZ_BOTTLENECKS.some((item) => item.value === answers.bottleneck)
  const workflowBase = hasKnownBottleneck ? 62 : 45
  const nothingJoinedUp = answers.stack.includes('nothing joined up')
  const workflow = clamp(
    workflowBase + answers.frequency * 6 + (nothingJoinedUp ? -12 : 8),
    22,
    92,
  )
  const data = clamp(answers.stack.length * 9 - (nothingJoinedUp ? 14 : 0), 18, 90)
  const trustMap: Record<string, number> = {
    draft: 38,
    prepare: 56,
    approval: 74,
    auto: 86,
  }
  const trust = clamp(
    (trustMap[answers.trust] ?? 40) - (answers.human.length > 3 ? 6 : 0),
    24,
    92,
  )
  const urgencyMap: Record<string, number> = {
    revenue: 82,
    stress: 64,
    experience: 71,
    cashflow: 79,
    risk: 74,
    all: 88,
  }
  const urgency = clamp(
    (urgencyMap[answers.consequence] ?? 62) + answers.frequency * 3,
    28,
    94,
  )
  const creative = computeCreativeAngle(answers)
  const overall = Math.round((workflow + data + trust + urgency) / 4)

  return { workflow, data, trust, urgency, creative, overall }
}

function computeCreativeAngle(answers: QuizAnswers) {
  const task = answers.mondayTask.toLowerCase()

  if (
    task.includes('write') ||
    task.includes('content') ||
    task.includes('follow-up') ||
    task.includes('summar')
  ) {
    return 72
  }

  if (
    task.includes('patient') ||
    task.includes('inbox') ||
    task.includes('call') ||
    task.includes('confirm')
  ) {
    return 58
  }

  return 49
}

function classifyQuizArchetype(answers: QuizAnswers, scores: QuizScores) {
  const healthcare = answers.persona === 'doctor' || answers.persona === 'clinic_manager'

  if (healthcare) {
    if (scores.trust >= 68 && scores.urgency >= 65) {
      return {
        title: 'Safety-Led Adopter',
        sub: 'You want AI to remove admin drag, but only inside strong human oversight.',
      }
    }

    return {
      title: 'Capacity Under Pressure',
      sub: 'You need relief from operational and documentation burden, not more AI theory.',
    }
  }

  if (
    scores.urgency >= 78 &&
    ['missed_calls', 'slow_followup', 'reputation'].includes(answers.bottleneck)
  ) {
    return {
      title: 'Growth-Leaking Operator',
      sub: 'Demand already exists, but the workflow around it is still porous.',
    }
  }

  if (scores.trust >= 70 && scores.data >= 50) {
    return {
      title: 'Ready to Implement',
      sub: 'You have enough trust and system structure to move quickly into a real build.',
    }
  }

  return {
    title: 'Control-First Operator',
    sub: 'Interested in AI, but only when approvals, visibility, and handoff points are explicit.',
  }
}

function mirrorQuizLanguage(answers: QuizAnswers) {
  const task = answers.mondayTask.toLowerCase()
  const trustPosture =
    answers.trust === 'draft' || answers.trust === 'prepare'
      ? 'with a human still making the final call'
      : 'inside clear approval rules rather than vague autonomy'

  if (task.includes('call')) {
    return `You described a front-door problem: leads are trying to reach you but the system depends on someone being free at exactly the right moment. That is usually where AI should start, ${trustPosture}.`
  }

  if (task.includes('inbox') || task.includes('email') || task.includes('message')) {
    return `You described a queue problem: too much signal buried inside one inbox, with work waiting for someone to notice it. A strong fit for AI triage and follow-up, ${trustPosture}.`
  }

  if (task.includes('patient') || task.includes('note') || task.includes('document')) {
    return 'You described an administrative burden problem. The safest first move is workflow support that reduces drag without taking judgement away from the human team.'
  }

  return `You described a workflow that still depends too much on memory, chasing, and someone remembering to pick it back up. That is usually the right moment to introduce AI ${trustPosture}.`
}

function getQuizRecommendation(
  answers: QuizAnswers,
  scores: QuizScores,
): QuizRecommendation {
  const archetype = classifyQuizArchetype(answers, scores)
  const healthcare = answers.persona === 'doctor' || answers.persona === 'clinic_manager'
  let touchFirst = 'Routine follow-up and triage.'
  let keepHuman = 'Sensitive exceptions and nuanced decisions.'
  let gain = 'Less admin drag and faster response time.'
  let next = 'A diagnostic sprint focused on one workflow.'

  if (answers.bottleneck === 'missed_calls') {
    touchFirst = 'Missed-call capture, routing, and same-day follow-up.'
    gain = 'Fewer lost enquiries and less dependence on someone answering live.'
    next = 'A front-desk automation pilot with escalation rules.'
  } else if (answers.bottleneck === 'inbox_overload') {
    touchFirst = 'Inbox triage, tagging, and draft response preparation.'
    gain = 'Faster response time and fewer buried requests.'
    next = 'A control-first workflow review around inbox and handoffs.'
  } else if (answers.bottleneck === 'documentation') {
    touchFirst = healthcare
      ? 'Documentation support, summarisation, and admin preparation.'
      : 'Summary drafting and repetitive admin synthesis.'
    gain = 'Time back from repetitive note and summary work.'
    next = 'A safe pilot focused on admin relief, not risky autonomy.'
  } else if (answers.bottleneck === 'reputation') {
    touchFirst = 'Review request flow and draft response triage.'
    gain = 'Stronger recent proof and quicker reputation upkeep.'
    next = 'A local growth diagnostic tied to reviews and follow-up.'
  } else if (answers.bottleneck === 'scheduling') {
    touchFirst = 'Appointment reminders, confirmations, and no-show prevention.'
    gain = 'Less friction in the calendar and fewer gaps caused by chasing.'
    next = 'A scheduling workflow pilot with human override paths.'
  }

  if (answers.human.includes('clinical judgement')) {
    keepHuman = 'Clinical judgement, sensitive messaging, and final care decisions.'
  } else if (answers.human.includes('complaints')) {
    keepHuman = 'Complaints, edge cases, and emotionally sensitive responses.'
  } else if (answers.human.includes('pricing exceptions')) {
    keepHuman = 'Pricing exceptions, negotiation, and unusual commercial cases.'
  }

  return {
    archetype,
    touchFirst,
    keepHuman,
    gain,
    next,
    mirrored: mirrorQuizLanguage(answers),
  }
}

function buildDiagnosticEmailHref(answers: QuizAnswers, scores: QuizScores, rec: QuizRecommendation) {
  const lines = [
    'Stephen,',
    '',
    'I completed the AI Readiness Check on your site.',
    '',
    `Archetype: ${rec.archetype.title}`,
    `Readiness score: ${scores.overall}`,
    `Main bottleneck: ${answers.bottleneck.replace(/_/g, ' ')}`,
    `Best next step: ${rec.next}`,
    '',
    `Monday task: ${answers.mondayTask}`,
  ]

  const subject = encodeURIComponent(`AI Readiness Check — ${rec.archetype.title}`)
  const body = encodeURIComponent(lines.join('\n'))
  return `mailto:mantsai@zohomail.eu?subject=${subject}&body=${body}`
}

function formatChoiceLabel(value: string) {
  return value.replace(/_/g, ' ')
}

function buildVisitorEmailSubject() {
  return 'Your AI Readiness Check result'
}

function buildVisitorEmailBody(
  answers: QuizAnswers,
  scores: QuizScores,
  rec: QuizRecommendation,
  submissionId: string,
) {
  return [
    `Hi ${answers.gateName.trim()},`,
    '',
    'Thanks for completing the AI Readiness Check.',
    '',
    'Your result:',
    `Archetype: ${rec.archetype.title}`,
    `Readiness score: ${scores.overall}`,
    `Main bottleneck: ${formatChoiceLabel(answers.bottleneck)}`,
    `Best next step: ${rec.next}`,
    '',
    'What AI should touch first:',
    rec.touchFirst,
    '',
    'What should stay human:',
    rec.keepHuman,
    '',
    'Biggest gain:',
    rec.gain,
    '',
    'Your note:',
    answers.mondayTask,
    '',
    `Reference: ${submissionId}`,
    '',
    'If you want to discuss the result, book a call here:',
    buildBookingHref(answers),
    '',
    'Stephen Mantle',
    'mantsai@zohomail.eu',
  ].join('\n')
}

function buildInternalEmailSubject(rec: QuizRecommendation) {
  return `New AI readiness lead: ${rec.archetype.title}`
}

function buildInternalEmailBody(
  answers: QuizAnswers,
  scores: QuizScores,
  rec: QuizRecommendation,
  submissionId: string,
) {
  return [
    'New diagnostic submission received.',
    '',
    `Reference: ${submissionId}`,
    `Name: ${answers.gateName.trim()}`,
    `Email: ${answers.gateEmail.trim()}`,
    `Archetype: ${rec.archetype.title}`,
    `Readiness score: ${scores.overall}`,
    '',
    `Persona: ${formatChoiceLabel(answers.persona)}`,
    `Bottleneck: ${formatChoiceLabel(answers.bottleneck)}`,
    `Frequency: ${answers.frequency}`,
    `Consequence: ${formatChoiceLabel(answers.consequence)}`,
    `Trust: ${formatChoiceLabel(answers.trust)}`,
    '',
    `Stack: ${answers.stack.join(', ')}`,
    '',
    `Keep human: ${answers.human.join(', ')}`,
    '',
    'Monday task:',
    answers.mondayTask,
    '',
    'Best next step:',
    rec.next,
  ].join('\n')
}

// Zoho Calendar slot booking does not support URL prefill params (unlike Calendly)
function buildBookingHref(_answers: QuizAnswers) {
  return BOOKING_HREF
}

function useInViewOnce(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    if (isInView || !ref.current) {
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries

        if (entry?.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      options,
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [isInView, options])

  return { ref, isInView }
}

function PullUpHeadingLine({
  text,
  className,
  isVisible,
  lineIndex,
}: {
  text: string
  className: string
  isVisible: boolean
  lineIndex: number
}) {
  const words = text.split(' ')

  return (
    <div className={`flex flex-wrap ${className}`}>
      {words.map((word, index) => (
        <span
          key={`${text}-${word}-${index}`}
          className="mr-[0.32em] inline-block will-change-transform"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0px)' : 'translateY(22px)',
            transitionProperty: 'transform, opacity',
            transitionDuration: '720ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            transitionDelay: `${lineIndex * 120 + index * 45}ms`,
          }}
        >
          {word}
        </span>
      ))}
    </div>
  )
}

function CommonProblemsSection() {
  const { ref, isInView } = useInViewOnce({ rootMargin: '-80px 0px' })

  return (
    <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div ref={ref} className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[640px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
            Common problems
          </p>
          <h2 className="mt-4 text-[clamp(1.5rem,4vw,2.6rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
            Six problems worth fixing before anything else.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-gray-500 sm:text-[15px]">
            These are the most common operational gaps in service businesses. Each one costs time, money, or both — usually without anyone tracking the total.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {COMMON_PROBLEMS.map((problem, i) => (
            <article
              key={problem.id}
              className="rounded-2xl border border-gray-100 bg-[#F8F8F7] p-5 sm:p-6"
              style={{
                opacity: isInView ? 1 : 0,
                transform: isInView ? 'translateY(0px)' : 'translateY(20px)',
                transitionProperty: 'transform, opacity',
                transitionDuration: '600ms',
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                transitionDelay: `${i * 80}ms`,
              }}
            >
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#F26522]">
                {problem.number}
              </p>
              <h3 className="mt-3 text-[15px] font-semibold leading-[1.3] text-gray-900 sm:text-[16px]">
                {problem.title}
              </h3>
              <p className="mt-2 text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">
                {problem.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function normalizePath(pathname: string): RoutePath {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'

  if (cleanPath === '/pricing') {
    return '/services'
  }

  if (cleanPath === '/work') {
    return '/portfolio'
  }

  if (cleanPath === '/journal') {
    return '/blog'
  }

  if (
    cleanPath === '/' ||
    cleanPath === '/about' ||
    cleanPath === '/services' ||
    cleanPath === '/diagnostic' ||
    cleanPath === '/portfolio' ||
    cleanPath === '/blog'
  ) {
    return cleanPath
  }

  return '/'
}

function setDocumentMeta(selector: string, attribute: 'name' | 'property', value: string, content: string) {
  let element = document.head.querySelector<HTMLMetaElement>(selector)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, value)
    document.head.appendChild(element)
  }

  element.setAttribute('content', content)
}

function setCanonicalUrl(url: string) {
  let element = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', url)
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dublinTime, setDublinTime] = useState('')
  const [path, setPath] = useState<RoutePath>(() => {
    if (typeof window === 'undefined') {
      return '/'
    }

    return normalizePath(window.location.pathname)
  })

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Dublin',
    })

    const updateTime = () => {
      setDublinTime(formatter.format(new Date()))
    }

    updateTime()

    const intervalId = window.setInterval(updateTime, 1000)
    return () => window.clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setPath(normalizePath(window.location.pathname))
      setMenuOpen(false)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    const meta = ROUTE_META[path]
    const canonicalUrl = `${window.location.origin}${path}`

    document.title = meta.title
    setDocumentMeta('meta[name="description"]', 'name', 'description', meta.description)
    setDocumentMeta('meta[property="og:title"]', 'property', 'og:title', meta.title)
    setDocumentMeta('meta[property="og:description"]', 'property', 'og:description', meta.description)
    setDocumentMeta('meta[property="og:type"]', 'property', 'og:type', 'website')
    setDocumentMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setDocumentMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setDocumentMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title)
    setDocumentMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description)
    setCanonicalUrl(canonicalUrl)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [path])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) {
      return undefined
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [menuOpen])

  const navigate = (to: RoutePath) => {
    if (to === path) {
      setMenuOpen(false)
      return
    }

    window.history.pushState({}, '', to)
    setPath(to)
    setMenuOpen(false)
  }

  return (
    <main className="bg-white text-gray-900">
      {path === '/' ? (
        <HomePage
          dublinTime={dublinTime}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navigate={navigate}
          path={path}
        />
      ) : (
        <InnerPageShell
          dublinTime={dublinTime}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navigate={navigate}
          path={path}
        >
          {path === '/about' ? <AboutPage /> : null}
          {path === '/services' ? <ServicesPage navigate={navigate} /> : null}
          {path === '/diagnostic' ? <DiagnosticPage /> : null}
          {path === '/portfolio' ? <PortfolioPage navigate={navigate} /> : null}
          {path === '/blog' ? <BlogPage navigate={navigate} /> : null}
        </InnerPageShell>
      )}
    </main>
  )
}

function HomePage({
  dublinTime,
  menuOpen,
  setMenuOpen,
  navigate,
  path,
}: SharedShellProps) {
  return (
    <>
      <section className="relative flex min-h-screen flex-col overflow-hidden bg-[#EFEFEF]">
        <ShaderLayer />

        <div className="relative z-20 p-2 sm:p-3">
          <div className="mx-auto max-w-[1440px]">
            <SiteNav
              dublinTime={dublinTime}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              navigate={navigate}
              path={path}
            />
          </div>
        </div>

        <MobileMenu
          dublinTime={dublinTime}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navigate={navigate}
        />

        <div className="flex-1" />

        <div className="relative z-20">
          <div className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
            <p className="mb-5 text-[13px] leading-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px] sm:leading-[14px]">
              Stephen Mantle
            </p>

            <h1 className="max-w-[1180px] text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
              Web design and operational systems
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              for businesses that need
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              clearer workflows and less admin.
            </h1>

            <p className="mt-6 max-w-[44rem] text-[15px] leading-[1.65] text-gray-700 sm:mt-8 sm:text-[17px]">
              Every system I sell is already running live on my own business first. Fixed price. Fixed scope. Written down before you sign.
            </p>

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <RollingButton
                label="Start a project"
                href={BOOKING_HREF}
                className="bg-[#F26522] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#e05a1a] sm:pl-6 sm:text-[14px] sm:leading-[14px]"
                arrowCircleClassName="h-7 w-7 bg-white text-[#F26522] sm:h-8 sm:w-8"
                arrowClassName="h-4 w-4"
              />

              <div className="inline-flex w-fit items-center gap-3 rounded-[4px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:px-4">
                <img
                  src="/sm-logo.png"
                  alt="Stephen Mantle logo"
                  className="h-5 w-5 rounded-sm object-cover sm:h-6 sm:w-6"
                />
                <span className="text-[13px] font-medium leading-[13px] text-gray-900 sm:text-[14px] sm:leading-[14px]">
                  Systems First
                </span>
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] leading-[10px] text-white sm:px-2 sm:text-[11px] sm:leading-[11px]">
                  Dublin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CommonProblemsSection />

      <section id="approach" className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="01"
            label="Approach"
            title="How a build actually goes."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />
          <div className="grid grid-cols-1 gap-5 px-5 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:px-12">
            {APPROACH_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-400"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-[13px] font-medium tabular-nums text-[#F26522]">
                    {step.number}
                  </span>
                  <span className="text-[13px] uppercase tracking-wide text-gray-500">
                    {step.label}
                  </span>
                </div>
                <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-gray-900">
                  {step.title}
                </h3>
                <ul className="mt-1 flex flex-col gap-2 text-[14px] leading-relaxed text-gray-600">
                  {step.bullets.map((b) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="02"
            label="Selected solutions"
            title="Admin days are over, let automations free you up and chase revenue leaks in your business."
            containerClassName="px-5 sm:px-8 lg:px-12"
            borderClassName="border-gray-300"
          />

          <div className="grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-7 lg:px-12">
            <article className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-6">
              <div className="overflow-hidden rounded-2xl bg-[#11131d]">
                <video
                  src="/stephen-mantle-loop.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="aspect-[329/246] h-full w-full object-cover"
                />
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
                Morning briefs, inbox workflows, internal dashboards, and unattended
                operations designed to reduce manual work and improve visibility.
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Automation Systems
              </h3>
            </article>

            <article className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:p-6">
              <div className="relative overflow-hidden rounded-2xl bg-[#e9e3d8] p-5 sm:p-6">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,101,34,0.22),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,236,228,0.94))]" />
                <div className="relative rounded-[22px] bg-white/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-5">
                  <div className="mb-4 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#F26522]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                    <span className="h-2.5 w-2.5 rounded-full bg-gray-300" />
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    Stephen Mantle
                  </p>
                  <h4 className="mt-3 max-w-[12ch] text-[clamp(1.35rem,3vw,2.2rem)] font-medium leading-[1.02] tracking-[-0.03em] text-gray-900">
                    Look clear. Build trust. Get contacted.
                  </h4>
                </div>
              </div>
              <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
                Clean, credible websites for service businesses that need to explain the
                offer properly and make it easier for the right client to act.
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Websites for Service Businesses
              </h3>
            </article>
          </div>

          <div className="mt-10 grid gap-4 px-5 sm:px-8 md:grid-cols-2 lg:px-12">
            {HOME_PROOF.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6"
              >
                <p className="text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                  {item.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-12 pt-12 sm:px-8 sm:pb-16 sm:pt-16 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 rounded-2xl border border-black/5 bg-[#1E1E1E] px-6 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
            <div className="max-w-[44rem]">
              <p className="text-[12px] uppercase tracking-[0.22em] text-white/60">
                Proven on my own business
              </p>
              <p className="mt-3 text-[18px] font-medium leading-[1.25] tracking-[-0.02em] sm:text-[22px]">
                Every system you'd buy is already running live at Mantle Studios.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-white/70 sm:text-[15px]">
                No concepts, no decks. See the inbox triage, the briefs, the dashboards in production before you commit.
              </p>
            </div>
            <RollingButton
              label="See it live"
              href="https://mantle-studios.com"
              className="w-fit bg-white py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-gray-900"
              arrowCircleClassName="h-7 w-7 bg-[#F26522] text-white"
              arrowClassName="h-4 w-4"
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-5 pb-12 sm:px-8 sm:pb-16 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-5 rounded-2xl border border-gray-200 bg-[#FAF8F5] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8 sm:py-10">
            <div className="max-w-[44rem]">
              <p className="text-[12px] uppercase tracking-[0.22em] text-gray-500">
                Not sure where to start
              </p>
              <p className="mt-3 text-[18px] font-medium leading-[1.25] tracking-[-0.02em] text-gray-900 sm:text-[22px]">
                Take the 2-minute diagnostic.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                Five questions. You'll see which of the three solution paths fits, with a fixed-price range, before any call.
              </p>
            </div>
            <RollingButton
              label="Start the diagnostic"
              href="/diagnostic"
              className="w-fit bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white"
              arrowCircleClassName="h-7 w-7 bg-white text-gray-900"
              arrowClassName="h-4 w-4"
            />
          </div>
        </div>
      </section>

      <FinalCta
        title="Describe the friction. I'll quote a fixed price against a written scope."
        body="No hourly billing. No retainers. If the scope changes, the price changes — on paper, before any work moves."
        ctaLabel="Book a free intro call"
        href={BOOKING_HREF}
      />

      <SiteFooter navigate={navigate} />
    </>
  )
}

function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="I look at businesses the same way I look at broken systems."
        body="When teams are chasing updates, duplicating work, or managing key steps in inboxes and spreadsheets, the problem is rarely just the tool. It is usually ownership, workflow, visibility, and decision-making."
      />

      <section className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="1"
            label="Positioning"
            title="Operational thinking, AI implementation, and websites built around how a business actually works."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-[0.75fr_1fr] lg:px-12">
            <div className="rounded-2xl bg-[#F5F5F5] p-5 sm:p-6">
              <p className="text-[15px] font-medium leading-[1.7] text-gray-900 sm:text-[17px]">
                I come from years across luxury brands and tech operations. That means I
                do not start with tools. I start with the point where a business is
                leaking time, duplicating work, or delaying decisions, then build the
                cleaner system around it.
              </p>

              <div className="mt-7">
                <RollingButton
                  label="Book a call"
                  href={BOOKING_HREF}
                  className="bg-[#F26522] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#e05a1a] sm:text-[14px] sm:leading-[14px]"
                  arrowCircleClassName="h-7 w-7 bg-white text-[#F26522]"
                  arrowClassName="h-4 w-4"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
              <img
                src={PORTRAIT_IMAGE}
                alt="Stephen Mantle portrait"
                className="aspect-[438/346] w-full rounded-xl object-cover sm:rounded-2xl"
              />
              <img
                src={HOME_ABOUT_IMAGE}
                alt="Stephen Mantle workspace"
                className="aspect-[900/600] w-full rounded-xl object-cover sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="2"
            label="The real problem"
            title="Most operational problems do not start as technical problems."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:px-12">
            <div>
              <p className="max-w-[44rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                They start when different parts of the business are working from
                different assumptions. One team thinks a task is owned. Another thinks it
                is shared. Information lives in too many places. Reporting is slow.
                Requests get duplicated. People build workarounds because the real
                process no longer fits the work.
              </p>
              <p className="mt-5 max-w-[44rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                That is when a business starts paying twice: once in time, and again in
                missed visibility, delayed decisions, and avoidable friction.
              </p>
            </div>

            <div className="grid gap-4">
              {ABOUT_PROBLEMS.map((problem) => (
                <div
                  key={problem}
                  className="rounded-2xl bg-[#F5F5F5] p-5 text-[14px] leading-relaxed text-gray-700 sm:p-6 sm:text-[15px]"
                >
                  {problem}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        title="If your business feels busier than it should, the system is usually the issue."
        body="I can help identify where the friction is, what should be fixed first, and what should only be automated after the workflow is clear."
        ctaLabel="Book a free intro call"
        href={BOOKING_HREF}
      />
    </>
  )
}

function ServiceStatusBadge({ status, label }: { status: ServiceStatus; label: string }) {
  const styles: Record<ServiceStatus, string> = {
    live: 'bg-[#F26522] text-white',
    template: 'bg-gray-200 text-gray-700',
    building: 'bg-[#111827] text-white/80',
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${styles[status]}`}>
      {status === 'live' && <span className="text-white">⚡</span>}
      {label}
    </span>
  )
}

function ServiceCardMockup({ id }: { id: string }) {
  if (id === 'website') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#111827] flex flex-col">
        <div className="flex items-center gap-1.5 px-3 pt-3 pb-2">
          <div className="w-2 h-2 rounded-full bg-red-400 opacity-70" />
          <div className="w-2 h-2 rounded-full bg-yellow-400 opacity-70" />
          <div className="w-2 h-2 rounded-full bg-green-400 opacity-70" />
        </div>
        <div className="flex-1 px-4 pb-3 flex flex-col justify-center gap-2">
          <div className="w-28 h-3 rounded bg-white/20" />
          <div className="w-40 h-5 rounded bg-white/30" />
          <div className="w-32 h-2 rounded bg-white/15" />
          <div className="mt-1 w-20 h-6 rounded-full bg-[#F26522]" />
        </div>
      </div>
    )
  }
  if (id === 'mail-automation') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#F5F5F5] p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#F26522] flex items-center justify-center text-white text-[10px] font-bold">S</div>
          <div className="flex-1">
            <div className="w-24 h-2.5 rounded bg-gray-300" />
            <div className="w-16 h-2 rounded bg-gray-200 mt-1" />
          </div>
        </div>
        <div className="flex-1 bg-white rounded-lg p-2.5 flex flex-col gap-1.5 shadow-sm">
          <div className="text-[9px] font-bold text-gray-700 tracking-widest uppercase">Morning Brief</div>
          <div className="w-full h-2 rounded bg-gray-100" />
          <div className="w-4/5 h-2 rounded bg-gray-100" />
          <div className="w-3/5 h-2 rounded bg-gray-100" />
          <div className="flex gap-1 mt-1">
            <div className="w-12 h-4 rounded-full bg-[#F26522]/20" />
            <div className="w-10 h-4 rounded-full bg-gray-200" />
          </div>
        </div>
      </div>
    )
  }
  if (id === 'research-agent') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#111827] p-3 font-mono flex flex-col gap-1.5">
        <div className="text-[9px] text-green-400">$ research-agent --run weekly</div>
        <div className="text-[9px] text-white/40">→ fetching signals...</div>
        <div className="text-[9px] text-white/40">→ 14 sources indexed</div>
        <div className="text-[9px] text-green-300">→ 3 signals flagged</div>
        <div className="flex-1 mt-1 bg-white/5 rounded p-2">
          <div className="text-[8px] text-white/70 leading-relaxed">Competitor launched new pricing page · Beauty sector newsletter trend · 2 inbound leads from organic search</div>
        </div>
      </div>
    )
  }
  if (id === 'newsletter') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-white border border-gray-200 flex flex-col">
        <div className="bg-[#111827] px-3 py-2 flex items-center justify-between">
          <div className="text-[9px] text-white/60 font-medium">Mantle Studios Weekly Brief</div>
          <div className="w-12 h-3 rounded bg-white/20" />
        </div>
        <div className="flex-1 p-3 flex flex-col gap-1.5">
          <div className="w-32 h-3 rounded bg-gray-200" />
          <div className="w-full h-2 rounded bg-gray-100" />
          <div className="w-4/5 h-2 rounded bg-gray-100" />
          <div className="border-t border-gray-100 pt-1.5 mt-1 flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F26522]" />
            <div className="w-24 h-2 rounded bg-gray-100" />
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#F26522]" />
            <div className="w-20 h-2 rounded bg-gray-100" />
          </div>
        </div>
      </div>
    )
  }
  if (id === 'content-pipeline') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#F5F5F5] p-3 flex flex-col gap-2">
        <div className="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">Content Calendar</div>
        <div className="flex-1 grid grid-cols-4 gap-1">
          {['Mon', 'Tue', 'Wed', 'Thu'].map((d) => (
            <div key={d} className="flex flex-col gap-1">
              <div className="text-[8px] text-gray-400 text-center">{d}</div>
              <div className={`rounded p-1 flex-1 ${d === 'Mon' ? 'bg-[#F26522]/20' : d === 'Wed' ? 'bg-green-100' : 'bg-white border border-gray-200'}`}>
                <div className="w-full h-1.5 rounded bg-gray-300/60 mb-1" />
                <div className="w-3/4 h-1.5 rounded bg-gray-300/40" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  if (id === 'booking') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-white border border-gray-200 flex flex-col">
        <div className="px-3 pt-2 pb-1 border-b border-gray-100">
          <div className="text-[9px] font-semibold text-gray-700">Book a call</div>
          <div className="text-[8px] text-gray-400">30 min · Zoom</div>
        </div>
        <div className="flex-1 p-2 grid grid-cols-4 gap-1">
          {['9am', '10am', '11am', '2pm', '3pm', '4pm', '9am', '10am'].map((t, i) => (
            <div key={i} className={`rounded text-[7px] text-center py-1 ${i === 2 ? 'bg-[#F26522] text-white font-semibold' : 'bg-gray-100 text-gray-500'}`}>{t}</div>
          ))}
        </div>
        <div className="px-3 pb-2">
          <div className="w-full h-5 rounded-full bg-[#F26522]" />
        </div>
      </div>
    )
  }
  if (id === 'zapier-mcp') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#111827] p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#F26522] flex items-center justify-center text-white text-[9px] font-bold">Z</div>
          <div className="w-3 h-px bg-white/30 flex-1" />
          <div className="w-6 h-6 rounded bg-white/10 flex items-center justify-center text-white/60 text-[9px] font-bold">M</div>
          <div className="w-3 h-px bg-white/30 flex-1" />
          <div className="w-6 h-6 rounded bg-purple-500/50 flex items-center justify-center text-white text-[9px] font-bold">AI</div>
        </div>
        <div className="flex-1 flex flex-col gap-1.5">
          {['Lead created → brief AI', 'Mail received → triage', 'Report ready → send'].map((t) => (
            <div key={t} className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <div className="text-[8px] text-white/60">{t}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  // diagnostic
  return (
    <div className="h-36 rounded-xl overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
          <circle cx="40" cy="40" r="30" fill="none" stroke="#E5E7EB" strokeWidth="8" />
          <circle cx="40" cy="40" r="30" fill="none" stroke="#F26522" strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${Math.round(0.72 * 188.5)} ${188.5}`} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-[#111827]">72</span>
          <span className="text-[8px] text-gray-500">/ 100</span>
        </div>
      </div>
    </div>
  )
}

function ServiceCard({
  service,
  onSeeProof,
}: {
  service: typeof SERVICES[number]
  onSeeProof: (id: string) => void
}) {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-5 pb-3 flex flex-col gap-3 flex-1">
        <ServiceStatusBadge status={service.status} label={service.statusLabel} />
        <ServiceCardMockup id={service.id} />
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-base font-semibold text-[#111827]">{service.name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
        </div>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={() => onSeeProof(service.id)}
          className="text-sm font-medium text-[#F26522] hover:underline flex items-center gap-1 group"
        >
          See how I use this at Mantle Studios
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  )
}

function ServiceProofBlock({
  service,
  index,
  navigate,
}: {
  service: typeof SERVICES[number]
  index: number
  navigate?: (to: RoutePath) => void
}) {
  return (
    <div className="flex flex-col gap-6 py-12 border-t border-gray-100" id={`proof-${service.id}`}>
      <div className="flex flex-col gap-2 max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold tracking-widest text-gray-400 uppercase">
            Service {String(index + 1).padStart(2, '0')} — {service.name}
          </span>
          <ServiceStatusBadge status={service.status} label={service.statusLabel} />
        </div>
        <h3 className="text-2xl font-semibold text-[#111827] leading-snug">{service.proofHeadline}</h3>
        <p className="text-base text-gray-600 leading-relaxed">{service.proofBody}</p>
      </div>
      <div className="max-w-sm">
        <ServiceCardMockup id={service.id} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {service.builtWith.map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{tech}</span>
          ))}
        </div>
        {service.id === 'diagnostic' && navigate ? (
          <button
            onClick={() => navigate('/diagnostic')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#F26522] hover:underline group"
          >
            Try the live diagnostic
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <span className="text-sm font-medium text-[#111827]">
            I can build this for your business →
          </span>
        )}
      </div>
    </div>
  )
}

function ServicesPage({ navigate }: { navigate: (to: RoutePath) => void }) {
  const [inquiryStep, setInquiryStep] = useState(0)
  const [inquiry, setInquiry] = useState<InquiryAnswers>(() => createInitialInquiryAnswers())
  const [submitStatus, setSubmitStatus] = useState<InquirySubmitStatus>('idle')
  const [submitError, setSubmitError] = useState('')
  const INQUIRY_STEPS = 4

  const scrollToProof = (id: string) => {
    const el = document.getElementById(`proof-${id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const toggleService = (id: string) => {
    setInquiry((prev) => ({
      ...prev,
      services: prev.services.includes(id)
        ? prev.services.filter((s) => s !== id)
        : [...prev.services, id],
    }))
  }

  const canAdvance = (() => {
    if (inquiryStep === 0) return inquiry.services.length > 0
    if (inquiryStep === 1) return inquiry.projectType.length > 0
    if (inquiryStep === 2) return inquiry.timeline.length > 0
    if (inquiryStep === 3) return inquiry.name.trim().length > 0 && isValidEmail(inquiry.email)
    return false
  })()

  const submitInquiry = async () => {
    if (submitStatus === 'submitting') return
    setSubmitStatus('submitting')
    setSubmitError('')

    const submissionId = `INQ-${Date.now().toString(36).toUpperCase()}`
    const payload = {
      source: 'stephenmantle-services-inquiry',
      submissionId,
      ...inquiry,
      services: inquiry.services.join(', '),
      submittedAt: new Date().toISOString(),
    }

    try {
      if (!DIAGNOSTIC_WEBHOOK_URL) {
        await new Promise((r) => setTimeout(r, 800))
        setSubmitStatus('success')
        return
      }
      const res = await fetch(DIAGNOSTIC_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
      setSubmitError('Something went wrong. Drop me an email at mantsai@zohomail.eu')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What I actually build."
        body="Every service listed here is live at Mantle Studios. These are not concepts — each one has a proof of concept you can see."
      />

      {/* Services card grid */}
      <section className="py-12">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSeeProof={scrollToProof}
            />
          ))}
        </div>
      </section>

      {/* Approach — 4-step build process */}
      <section id="approach" className="py-16">
        <SectionHeader
          number="01"
          label="Approach"
          title="How a build actually goes."
          containerClassName="px-0"
        />
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
          {APPROACH_STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-gray-400"
            >
              <div className="flex items-baseline gap-3">
                <span className="text-[13px] font-medium tabular-nums text-[#F26522]">
                  {step.number}
                </span>
                <span className="text-[13px] uppercase tracking-wide text-gray-500">
                  {step.label}
                </span>
              </div>
              <h3 className="text-[20px] font-medium leading-[1.2] tracking-[-0.01em] text-gray-900">
                {step.title}
              </h3>
              <ul className="mt-1 flex flex-col gap-2 text-[14px] leading-relaxed text-gray-600">
                {step.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-2 inline-block h-1 w-1 flex-shrink-0 rounded-full bg-gray-400" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Proof of concept blocks */}
      <section className="py-4">
        <SectionHeader
          number="02"
          label="Proof of concept"
          title="Live at Mantle Studios."
          containerClassName="px-0"
        />
        <div className="mt-4">
          {SERVICES.map((service, i) => (
            <ServiceProofBlock
              key={service.id}
              service={service}
              index={i}
              navigate={navigate}
            />
          ))}
        </div>
      </section>

      {/* Track record — kobba-style stats strip */}
      <section className="py-16">
        <SectionHeader
          number="03"
          label="Track record"
          title="The receipts."
          containerClassName="px-0"
        />
        <div className="mt-2 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-gray-200 md:grid-cols-4">
          {SERVICES_STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-3 bg-white p-6 sm:p-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
                {stat.label}
              </span>
              <span className="font-display text-[clamp(2.2rem,4vw,3.4rem)] font-medium leading-none tracking-editorial text-[var(--ink)]">
                {stat.value}
              </span>
              <span className="text-[13px] leading-[1.6] text-gray-600">
                {stat.note}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Selected work — kobba-style portfolio thumbnail row */}
      <section className="py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeader
            number="04"
            label="Selected work"
            title="A few recent builds."
            containerClassName="px-0"
          />
          <button
            type="button"
            onClick={() => navigate('/portfolio')}
            className="inline-flex w-fit items-center gap-2 self-start font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--ink)] transition-colors hover:text-[var(--ember)] sm:self-auto"
          >
            View all work
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.7} />
          </button>
        </div>
        <div className="mt-2 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PORTFOLIO_PROJECTS.slice(0, 3).map((project) => (
            <button
              key={project.slug}
              type="button"
              onClick={() => navigate('/portfolio')}
              className="group flex flex-col gap-4 text-left"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>
              <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-gray-500">
                <span>{project.client}</span>
                <span aria-hidden>·</span>
                <span>{project.year}</span>
              </div>
              <h3 className="font-display text-[20px] leading-[1.2] tracking-editorial text-[var(--ink)] transition-colors group-hover:text-[var(--ember)]">
                {project.title}
              </h3>
            </button>
          ))}
        </div>
      </section>

      {/* Inquiry form */}
      <section className="py-16">
        <SectionHeader
          number="05"
          label="Get in touch"
          title="Tell me what you're working on."
          containerClassName="px-0"
        />
        <div className="mt-10 max-w-2xl">
          {submitStatus === 'success' ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="text-2xl font-semibold text-[#111827] mb-2">Enquiry sent.</div>
              <p className="text-gray-600">I'll come back to you within one working day.</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-8">
                {Array.from({ length: INQUIRY_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < inquiryStep ? 'bg-[#F26522]' : i === inquiryStep ? 'bg-[#F26522]/60' : 'bg-gray-200'}`}
                  />
                ))}
                <span className="text-xs text-gray-400 tabular-nums whitespace-nowrap">{inquiryStep} / {INQUIRY_STEPS}</span>
              </div>

              {/* Step 0: service chips */}
              {inquiryStep === 0 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold text-[#111827]">What are you interested in?</h3>
                  <div className="flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => toggleService(s.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                          inquiry.services.includes(s.id)
                            ? 'bg-[#111827] text-white border-[#111827]'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1: project type */}
              {inquiryStep === 1 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold text-[#111827]">What best describes the project?</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {INQUIRY_PROJECT_TYPES.map((pt) => (
                      <button
                        key={pt.value}
                        onClick={() => setInquiry((prev) => ({ ...prev, projectType: pt.value }))}
                        className={`text-left rounded-xl border p-4 transition-all duration-150 ${
                          inquiry.projectType === pt.value
                            ? 'border-[#F26522] bg-[#F26522]/5'
                            : 'border-gray-200 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="font-semibold text-[#111827] mb-1">{pt.title}</div>
                        <div className="text-sm text-gray-500">{pt.body}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: timeline + budget */}
              {inquiryStep === 2 && (
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-[#111827]">Timeline</h3>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_TIMELINES.map((t) => (
                        <button
                          key={t.value}
                          onClick={() => setInquiry((prev) => ({ ...prev, timeline: t.value }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                            inquiry.timeline === t.value
                              ? 'bg-[#111827] text-white border-[#111827]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="text-sm font-semibold text-gray-600">Budget <span className="font-normal text-gray-400">(optional)</span></h3>
                    <div className="flex flex-wrap gap-2">
                      {INQUIRY_BUDGETS.map((b) => (
                        <button
                          key={b.value}
                          onClick={() => setInquiry((prev) => ({ ...prev, budget: b.value }))}
                          className={`px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 ${
                            inquiry.budget === b.value
                              ? 'bg-[#111827] text-white border-[#111827]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: contact details */}
              {inquiryStep === 3 && (
                <div className="flex flex-col gap-5">
                  <h3 className="text-lg font-semibold text-[#111827]">Your details</h3>
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        value={inquiry.name}
                        onChange={(e) => setInquiry((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F26522] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={inquiry.email}
                        onChange={(e) => setInquiry((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F26522] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Anything specific you'd like to mention? <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea
                        value={inquiry.note}
                        onChange={(e) => setInquiry((prev) => ({ ...prev, note: e.target.value }))}
                        placeholder="Context, constraints, questions..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#F26522] transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                {inquiryStep > 0 ? (
                  <button
                    onClick={() => setInquiryStep((s) => s - 1)}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    ← Back
                  </button>
                ) : <div />}
                {inquiryStep < INQUIRY_STEPS - 1 ? (
                  <RollingButton
                    label="Continue"
                    onClick={canAdvance ? () => setInquiryStep((s) => s + 1) : undefined}
                    className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${canAdvance ? 'bg-[#111827] text-white hover:bg-[#1f2937]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                    arrowCircleClassName="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
                    arrowClassName="w-3 h-3 text-white"
                  />
                ) : (
                  <button
                    onClick={canAdvance && submitStatus !== 'submitting' ? submitInquiry : undefined}
                    disabled={!canAdvance || submitStatus === 'submitting'}
                    className="rounded-full px-6 py-3 text-sm font-semibold bg-[#F26522] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#d4571d] transition-colors"
                  >
                    {submitStatus === 'submitting' ? 'Sending…' : 'Send enquiry'}
                  </button>
                )}
              </div>
              {submitError && <p className="mt-3 text-sm text-red-600">{submitError}</p>}
            </>
          )}
        </div>
      </section>

      <FinalCta
        title="Ready to build something real?"
        body="Book a 30-minute call and we'll map the first system worth building."
        ctaLabel="Book a call"
        href={BOOKING_HREF}
      />
    </>
  )
}

function DiagnosticPage() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswers>(() => createInitialQuizAnswers())
  const [showResults, setShowResults] = useState(false)
  const [leadSubmitStatus, setLeadSubmitStatus] = useState<LeadSubmitStatus>('idle')
  const [leadSubmitError, setLeadSubmitError] = useState('')
  const [latestSubmissionId, setLatestSubmissionId] = useState('')

  const question = QUIZ_QUESTIONS[step]
  const scores = computeQuizScores(answers)
  const recommendation = getQuizRecommendation(answers, scores)
  const scoreFill = Math.round((scores.overall / 100) * 360)
  const diagnosticEmailHref = buildDiagnosticEmailHref(answers, scores, recommendation)
  const bookingHref = buildBookingHref(answers)
  const activeStage = showResults ? 'result' : question.stage
  const progress = showResults ? 100 : (((step + 1) / QUIZ_QUESTIONS.length) * 100)
  const isSubmittingLead = leadSubmitStatus === 'submitting'
  const leadSubmitSucceeded = leadSubmitStatus === 'success'
  const manualFallbackLabel = leadSubmitSucceeded
    ? 'Email Stephen directly'
    : 'Send result manually'

  const canContinue = (() => {
    switch (step) {
      case 0:
        return answers.persona.length > 0
      case 1:
        return answers.bottleneck.length > 0
      case 2:
        return true
      case 3:
        return answers.consequence.length > 0
      case 4:
        return answers.stack.length > 0
      case 5:
        return answers.trust.length > 0
      case 6:
        return answers.human.length > 0
      case 7:
        return answers.mondayTask.trim().length > 8
      case 8:
        return answers.gateName.trim().length > 0 && isValidEmail(answers.gateEmail.trim())
      default:
        return false
    }
  })()

  const toggleStackOption = (value: string) => {
    setAnswers((current) => ({
      ...current,
      stack: current.stack.includes(value)
        ? current.stack.filter((item) => item !== value)
        : [...current.stack, value],
    }))
  }

  const toggleHumanOption = (value: string) => {
    setAnswers((current) => ({
      ...current,
      human: current.human.includes(value)
        ? current.human.filter((item) => item !== value)
        : [...current.human, value],
    }))
  }

  const goBack = () => {
    if (showResults) {
      setShowResults(false)
      setStep(QUIZ_QUESTIONS.length - 1)
      return
    }

    setStep((current) => Math.max(0, current - 1))
  }

  const submitLead = async () => {
    const submissionId = `diag-${Date.now().toString(36)}`
    setLeadSubmitError('')
    setLatestSubmissionId(submissionId)

    if (!DIAGNOSTIC_WEBHOOK_URL) {
      setLeadSubmitStatus('success')
      return true
    }

    try {
      const visitorSubject = buildVisitorEmailSubject()
      const visitorBody = buildVisitorEmailBody(answers, scores, recommendation, submissionId)
      const internalSubject = buildInternalEmailSubject(recommendation)
      const internalBody = buildInternalEmailBody(answers, scores, recommendation, submissionId)

      const payload = new URLSearchParams({
        submissionId,
        submittedAt: new Date().toISOString(),
        source: 'stephenmantle-web',
        page: '/services',
        name: answers.gateName.trim(),
        gateName: answers.gateName.trim(),
        email: answers.gateEmail.trim(),
        gateEmail: answers.gateEmail.trim(),
        persona: answers.persona,
        bottleneck: answers.bottleneck,
        frequency: String(answers.frequency),
        consequence: answers.consequence,
        stackText: answers.stack.join(', '),
        trust: answers.trust,
        keepHumanText: recommendation.keepHuman,
        humanText: answers.human.join(', '),
        mondayTask: answers.mondayTask,
        workflowScore: String(scores.workflow),
        dataScore: String(scores.data),
        trustScore: String(scores.trust),
        urgencyScore: String(scores.urgency),
        creativeScore: String(scores.creative),
        overallScore: String(scores.overall),
        archetype: recommendation.archetype.title,
        archetypeSummary: recommendation.archetype.sub,
        touchFirst: recommendation.touchFirst,
        keepHuman: recommendation.keepHuman,
        gain: recommendation.gain,
        next: recommendation.next,
        mirrored: recommendation.mirrored,
        bookingUrl: buildBookingHref(answers),
        businessMailUrl: buildDiagnosticEmailHref(answers, scores, recommendation),
        visitorEmailTo: answers.gateEmail.trim(),
        visitorEmailSubject: visitorSubject,
        visitorEmailBody: visitorBody,
        internalEmailTo: 'mantsai@zohomail.eu',
        internalEmailSubject: internalSubject,
        internalEmailBody: internalBody,
        rawPayload: JSON.stringify({
          submissionId,
          answers,
          scores,
          recommendation,
        }),
      })

      const response = await fetch(DIAGNOSTIC_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: payload,
      })

      if (response.type !== 'opaque' && !response.ok) {
        throw new Error(`Webhook returned ${response.status}`)
      }

      setLeadSubmitStatus('success')
      return true
    } catch (error) {
      console.error(error)
      setLeadSubmitStatus('error')
      setLeadSubmitError(
        'The result could not be submitted automatically yet. The booking link still works, and the business-mail fallback is available below.',
      )
      return false
    }
  }

  const goNext = async () => {
    if (!canContinue) {
      return
    }

    if (step === QUIZ_QUESTIONS.length - 1) {
      setLeadSubmitStatus('submitting')
      await submitLead()
      setShowResults(true)
      return
    }

    setLeadSubmitError('')
    setStep((current) => current + 1)
  }

  const restartDiagnostic = () => {
    setAnswers(createInitialQuizAnswers())
    setStep(0)
    setShowResults(false)
    setLeadSubmitError('')
    setLeadSubmitStatus('idle')
    setLatestSubmissionId('')
  }

  return (
    <>
      <PageHero
        eyebrow="AI Readiness Check"
        title="Find out where your business is leaking time, visibility, or revenue before you automate anything."
        body="Eight questions. One practical diagnosis. Then, if it makes sense, a clear first system to fix."
      />

      <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="1"
            label="How this works"
            title="This is the main CTA because diagnosis should come before a pitch."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
            <div className="rounded-2xl bg-[#F5F5F5] p-5 sm:p-6">
              <p className="text-[15px] font-medium leading-[1.7] text-gray-900 sm:text-[17px]">
                Most businesses do not need more AI explanation. They need clarity on
                where work is leaking, what should stay human, and which workflow is
                worth fixing first.
              </p>
              <p className="mt-5 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                This diagnostic takes that seriously. It scores readiness across workflow,
                data, trust, urgency, and practical fit, then points to the first
                implementation worth making.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {[
                ['01', 'Complete 8 questions', 'Takes a few minutes. No jargon.'],
                ['02', 'See your score', 'Across five operational dimensions.'],
                ['03', 'Read the diagnosis', 'A concrete first step, not generic AI advice.'],
                ['04', 'Decide if help is needed', 'Use the result as the basis for a real conversation.'],
              ].map(([number, title, body]) => (
                <div key={title} className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                  <p className="text-[11px] font-semibold tracking-[0.16em] text-gray-500">
                    {number}
                  </p>
                  <h3 className="mt-4 text-[16px] font-semibold leading-[1.2] text-gray-900">
                    {title}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-gray-600">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 pt-8 sm:px-8 lg:px-12">
            <div className="rounded-2xl border border-[#F26522]/15 bg-[#F5F5F5] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                <span className="font-semibold text-gray-900">This page is the demo.</span>{' '}
                The same logic can sit behind a client enquiry flow, operations audit, or
                internal diagnostic. The point is to identify the real bottleneck before
                anyone starts talking about tooling.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="2"
            label="Live diagnostic"
            title="AI readiness that reads like a diagnosis, not a form."
            containerClassName="px-5 sm:px-8 lg:px-12"
            borderClassName="border-gray-300"
          />

          <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-[360px_1fr] lg:px-12">
            <aside className="rounded-2xl bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6 lg:sticky lg:top-24 lg:h-fit">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Why it works
                </p>
                <h3 className="mt-5 text-[22px] font-medium leading-[1.1] tracking-[-0.03em] text-gray-900 sm:text-[26px]">
                  You identify your own bottleneck before any solution is proposed.
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                  The result is practical on purpose: a score, an archetype, and one
                  clear first step that fits the way your business actually runs.
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  ['What you get', 'A score, an archetype, and one concrete next move.'],
                  ['What it avoids', 'Generic AI advice without operational context.'],
                  ['What it measures', 'Workflow, data, trust, urgency, and practical fit.'],
                  ['After the quiz', 'Use the result to decide whether a real system is worth building.'],
                ].map(([title, body]) => (
                  <div key={title} className="rounded-2xl bg-[#F5F5F5] p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                      {title}
                    </p>
                    <p className="mt-2 text-[14px] leading-relaxed text-gray-700">{body}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-gray-900 p-5 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                  Example result
                </p>
                <h4 className="mt-4 text-[24px] font-medium leading-[1.08] tracking-[-0.03em]">
                  Control-First Operator
                </h4>
                <p className="mt-3 text-[14px] leading-relaxed text-white/70">
                  Interested in AI, but only when approvals, visibility, and handoff
                  points are explicit from day one.
                </p>
                <div className="mt-6 space-y-4">
                  <ScoreBar label="Workflow" value={67} tone="light" />
                  <ScoreBar label="Data" value={48} tone="light" />
                  <ScoreBar label="Trust" value={82} tone="light" />
                  <ScoreBar label="Urgency" value={74} tone="light" />
                </div>
              </div>
            </aside>

            <div className="rounded-2xl bg-white p-4 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-5">
              <div className="flex flex-col gap-4 border-b border-black/5 px-1 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                  {QUIZ_STAGES.map((stage) => (
                    <span
                      key={stage.key}
                      className={`rounded-full border px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 ${
                        activeStage === stage.key
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 bg-white text-gray-500'
                      }`}
                    >
                      {stage.label}
                    </span>
                  ))}
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 sm:w-[160px]">
                  <div
                    className="h-full rounded-full bg-[#F26522] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {!showResults ? (
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#F9F9F9]">
                  <div className="border-b border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(242,101,34,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(245,245,245,0.96))] px-5 py-6 sm:px-7 sm:py-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                      {question.kicker}
                    </p>
                    <h3 className="mt-4 max-w-[16ch] text-[clamp(1.65rem,3vw,2.35rem)] font-medium leading-[1.06] tracking-[-0.03em] text-gray-900">
                      {question.title}
                    </h3>
                    <p className="mt-3 max-w-[48rem] text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                      {question.copy}
                    </p>
                  </div>

                  <div className="px-5 py-6 sm:px-7 sm:py-7">
                    {step === 0 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {QUIZ_PERSONAS.map((item, index) => (
                          <DiagnosticAnswerCard
                            key={item.value}
                            badge={String(index + 1)}
                            title={item.title}
                            body={item.body}
                            selected={answers.persona === item.value}
                            onClick={() =>
                              setAnswers((current) => ({ ...current, persona: item.value }))
                            }
                          />
                        ))}
                      </div>
                    ) : null}

                    {step === 1 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {QUIZ_BOTTLENECKS.map((item) => (
                          <DiagnosticAnswerCard
                            key={item.value}
                            title={item.title}
                            body={item.body}
                            selected={answers.bottleneck === item.value}
                            onClick={() =>
                              setAnswers((current) => ({
                                ...current,
                                bottleneck: item.value,
                              }))
                            }
                          />
                        ))}
                      </div>
                    ) : null}

                    {step === 2 ? (
                      <div className="rounded-2xl border border-black/5 bg-white p-5 sm:p-6">
                        <input
                          type="range"
                          min={1}
                          max={4}
                          value={answers.frequency}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              frequency: Number(event.target.value),
                            }))
                          }
                          className="w-full accent-[#F26522]"
                        />
                        <div className="mt-4 grid grid-cols-4 gap-2 text-[12px] text-gray-500">
                          <span>Rarely</span>
                          <span>1–2 times</span>
                          <span>Most days</span>
                          <span className="text-right">Every day</span>
                        </div>
                      </div>
                    ) : null}

                    {step === 3 ? (
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {QUIZ_CONSEQUENCES.map((item) => (
                          <button
                            key={item.value}
                            type="button"
                            onClick={() =>
                              setAnswers((current) => ({
                                ...current,
                                consequence: item.value,
                              }))
                            }
                            className={`rounded-2xl border px-4 py-4 text-left text-[14px] font-medium transition-colors duration-300 ${
                              answers.consequence === item.value
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-400'
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {step === 4 ? (
                      <div className="flex flex-wrap gap-3">
                        {QUIZ_STACK_OPTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleStackOption(item)}
                            className={`rounded-full border px-4 py-2 text-[14px] transition-colors duration-300 ${
                              answers.stack.includes(item)
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {step === 5 ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        {QUIZ_TRUST_OPTIONS.map((item, index) => (
                          <DiagnosticAnswerCard
                            key={item.value}
                            badge={String(index + 1)}
                            title={item.title}
                            body={item.body}
                            selected={answers.trust === item.value}
                            onClick={() =>
                              setAnswers((current) => ({ ...current, trust: item.value }))
                            }
                          />
                        ))}
                      </div>
                    ) : null}

                    {step === 6 ? (
                      <div className="flex flex-wrap gap-3">
                        {QUIZ_HUMAN_OPTIONS.map((item) => (
                          <button
                            key={item}
                            type="button"
                            onClick={() => toggleHumanOption(item)}
                            className={`rounded-full border px-4 py-2 text-[14px] transition-colors duration-300 ${
                              answers.human.includes(item)
                                ? 'border-gray-900 bg-gray-900 text-white'
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-400'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {step === 7 ? (
                      <div>
                        <textarea
                          value={answers.mondayTask}
                          onChange={(event) =>
                            setAnswers((current) => ({
                              ...current,
                              mondayTask: event.target.value,
                            }))
                          }
                          placeholder="Example: Chasing enquiries that went cold, sorting the inbox at 9pm, rewriting the same follow-up email, or pulling weekly figures together every Monday morning."
                          className="min-h-[170px] w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-[15px] leading-relaxed text-gray-900 outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-gray-900"
                        />
                        <p className="mt-3 text-[13px] leading-relaxed text-gray-500">
                          Write naturally, not formally. Your words shape the diagnosis.
                        </p>
                      </div>
                    ) : null}

                    {step === 8 ? (
                      <div className="space-y-5">
                        <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6">
                          <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                            <div
                              className="flex h-28 w-28 items-center justify-center rounded-full"
                              style={{
                                background: `radial-gradient(circle at center, #fff 48%, transparent 49%), conic-gradient(#F26522 0 ${scoreFill}deg, rgba(0,0,0,0.08) ${scoreFill}deg 360deg)`,
                              }}
                            >
                              <div className="text-center">
                                <p className="text-[28px] font-medium leading-none tracking-[-0.03em] text-gray-900">
                                  {scores.overall}
                                </p>
                                <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                                  readiness
                                </p>
                              </div>
                            </div>

                            <div className="max-w-[34rem]">
                              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                                Result preview
                              </p>
                              <h4 className="mt-3 text-[24px] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
                                {recommendation.archetype.title}
                              </h4>
                              <p className="mt-3 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                                {recommendation.mirrored}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="grid gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Your name
                            </span>
                            <input
                              type="text"
                              value={answers.gateName}
                              onChange={(event) =>
                                setAnswers((current) => ({
                                  ...current,
                                  gateName: event.target.value,
                                }))
                              }
                              placeholder="Your name"
                              className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-gray-900"
                            />
                          </label>

                          <label className="grid gap-2">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Your email
                            </span>
                            <input
                              type="email"
                              value={answers.gateEmail}
                              onChange={(event) =>
                                setAnswers((current) => ({
                                  ...current,
                                  gateEmail: event.target.value,
                                }))
                              }
                              placeholder="you@company.com"
                              className="h-12 rounded-2xl border border-gray-200 bg-white px-4 text-[15px] text-gray-900 outline-none transition-colors duration-300 placeholder:text-gray-400 focus:border-gray-900"
                            />
                          </label>
                        </div>

                        <div className="rounded-2xl border border-black/5 bg-[#F5F5F5] p-4">
                          <p className="text-[14px] leading-relaxed text-gray-700">
                            This step lets the result feed a real follow-up flow. With
                            the webhook connected, the score can be pushed into your
                            automation stack and used to trigger email delivery or
                            internal notifications.
                          </p>
                        </div>

                        {leadSubmitError ? (
                          <div className="rounded-2xl border border-[#F26522]/25 bg-[#fff4ee] p-4 text-[14px] leading-relaxed text-gray-700">
                            {leadSubmitError}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="mt-8 flex items-center justify-between gap-4">
                      <button
                        type="button"
                        onClick={goBack}
                        disabled={step === 0}
                        className="rounded-full border border-gray-200 bg-white px-5 py-2 text-[14px] font-medium text-gray-600 transition-colors duration-300 hover:border-gray-400 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        Back
                      </button>

                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!canContinue || isSubmittingLead}
                        className="rounded-full bg-[#F26522] px-5 py-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#e05a1a] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isSubmittingLead
                          ? 'Submitting...'
                          : step === QUIZ_QUESTIONS.length - 1
                            ? 'Open my result'
                            : 'Continue'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#F9F9F9]">
                  <div className="bg-[radial-gradient(circle_at_top_left,_rgba(242,101,34,0.16),_transparent_26%),linear-gradient(145deg,_#111827,_#1f2937)] px-5 py-6 text-white sm:px-7 sm:py-7">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                      Personalised result
                    </p>
                    <h3 className="mt-4 text-[clamp(1.9rem,3vw,2.6rem)] font-medium leading-[1.04] tracking-[-0.03em]">
                      {recommendation.archetype.title}
                    </h3>
                    <p className="mt-3 max-w-[52rem] text-[14px] leading-relaxed text-white/75 sm:text-[15px]">
                      {recommendation.mirrored}
                    </p>
                  </div>

                  <div className="grid gap-4 px-5 py-6 sm:px-7 lg:grid-cols-[220px_1fr]">
                    <div className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
                      <div
                        className="mx-auto flex h-36 w-36 items-center justify-center rounded-full"
                        style={{
                          background: `radial-gradient(circle at center, #fff 48%, transparent 49%), conic-gradient(#F26522 0 ${scoreFill}deg, rgba(0,0,0,0.08) ${scoreFill}deg 360deg)`,
                        }}
                      >
                        <div>
                          <p className="text-[34px] font-medium leading-none tracking-[-0.03em] text-gray-900">
                            {scores.overall}
                          </p>
                          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                            readiness
                          </p>
                        </div>
                      </div>
                      <p className="mt-5 text-[18px] font-semibold text-gray-900">
                        {recommendation.archetype.title}
                      </p>
                      <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
                        {recommendation.archetype.sub}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              AI should touch first
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                              {recommendation.touchFirst}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Keep human-first
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                              {recommendation.keepHuman}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Biggest gain
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                              {recommendation.gain}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                              Best next step
                            </p>
                            <p className="mt-2 text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                              {recommendation.next}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-black/5 bg-white p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <ScoreBar label="Workflow" value={scores.workflow} />
                          <ScoreBar label="Data" value={scores.data} />
                          <ScoreBar label="Trust" value={scores.trust} />
                          <ScoreBar label="Urgency" value={scores.urgency} />
                        </div>
                      </div>

                      <div className="rounded-2xl border border-[#F26522]/20 bg-[#F5F5F5] p-5 sm:p-6">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                          What this suggests operationally
                        </p>
                        <p className="mt-3 text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                          {recommendation.mirrored}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-black/5 px-5 py-6 sm:px-7">
                    <div
                      className={`rounded-2xl border p-5 sm:p-6 ${
                        leadSubmitSucceeded
                          ? 'border-[#F26522]/20 bg-[#fff7f2]'
                          : 'border-gray-200 bg-white'
                      }`}
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                        Delivery status
                      </p>
                      <p className="mt-3 text-[15px] leading-relaxed text-gray-800">
                        {leadSubmitSucceeded
                          ? `A copy of this result has been sent to ${answers.gateEmail.trim()}, and the same diagnostic has been forwarded to Stephen.`
                          : 'Use the buttons below to book a call or send the result manually if you want to continue the conversation.'}
                      </p>
                      {latestSubmissionId ? (
                        <p className="mt-3 text-[12px] font-medium tracking-[0.08em] text-gray-500">
                          Ref: {latestSubmissionId}
                        </p>
                      ) : null}
                    </div>

                    <div className="rounded-2xl bg-gray-900 p-5 text-white sm:p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55">
                        What just happened
                      </p>
                      <div className="mt-5 grid gap-4 md:grid-cols-4">
                        {[
                          ['Answers scored', 'Across workflow, data, trust, urgency, and practical fit.'],
                          ['Archetype classified', 'The score was translated into an operational profile.'],
                          ['First workflow identified', 'The result points to the safest or most valuable starting point.'],
                          ['Next action clarified', 'You now know whether this is worth discussing further.'],
                        ].map(([title, body], index) => (
                          <div key={title} className="border-l border-white/10 pl-4 first:border-l-0 first:pl-0 md:first:border-l md:first:pl-4">
                            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#F26522]">
                              0{index + 1}
                            </p>
                            <p className="mt-3 text-[15px] font-medium text-white">{title}</p>
                            <p className="mt-2 text-[13px] leading-relaxed text-white/65">
                              {body}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
                      <RollingButton
                        label="Book a call"
                        href={bookingHref}
                        className="bg-[#F26522] py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white hover:bg-[#e05a1a]"
                        arrowCircleClassName="h-7 w-7 bg-white text-[#F26522]"
                        arrowClassName="h-4 w-4"
                      />
                      <RollingButton
                        label={manualFallbackLabel}
                        href={diagnosticEmailHref}
                        className="border border-gray-200 bg-white py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-gray-900 hover:border-gray-400"
                        arrowCircleClassName="h-7 w-7 bg-gray-900 text-white"
                        arrowClassName="h-4 w-4"
                      />
                      <button
                        type="button"
                        onClick={restartDiagnostic}
                        className="rounded-full border border-gray-200 bg-white px-5 py-2 text-[13px] font-medium text-gray-600 transition-colors duration-300 hover:border-gray-400 hover:text-gray-900"
                      >
                        Start again
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="3"
            label="After the score"
            title="If the diagnosis is accurate, this is usually the work that follows."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-3 lg:px-12">
            {DIAGNOSTIC_SERVICES.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-black/5 bg-[#F5F5F5] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
                  {service.label}
                </p>
                <h3 className="mt-5 text-[18px] font-semibold leading-[1.2] text-gray-900 sm:text-[20px]">
                  {service.title}
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                  {service.body}
                </p>
              </div>
            ))}
          </div>

          <div className="px-5 pt-10 sm:px-8 lg:px-12">
            <div className="rounded-2xl bg-[#F5F5F5] p-5 sm:p-6">
              <p className="text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                What this tends to remove
              </p>
              <p className="mt-3 max-w-[56rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                Manual chasing, repeated admin, unclear next steps, buried messages,
                slow follow-up, and too much dependence on memory. The tools matter
                less than whether the system is clearer and easier to run.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        title="If the result feels accurate, that is enough to start a real conversation."
        body="You do not need a polished brief. A clear bottleneck, a score, and a practical first step is already a better starting point than most discovery calls."
        ctaLabel="Book a free intro call"
        href={BOOKING_HREF}
      />
    </>
  )
}

const PORTFOLIO_FILTERS = [
  { value: 'all', label: 'All work' },
  { value: 'web', label: 'Web design' },
  { value: 'systems', label: 'Operational systems' },
  { value: 'automation', label: 'Automation' },
  { value: 'brand', label: 'Brand' },
] as const

type PortfolioCategory = (typeof PORTFOLIO_FILTERS)[number]['value']

type PortfolioProject = {
  slug: string
  title: string
  client: string
  year: string
  categories: PortfolioCategory[]
  summary: string
  image: string
  outcome: string
}

const PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    slug: 'mantle-studios-site',
    title: 'Mantle Studios — studio site',
    client: 'Mantle Studios',
    year: '2026',
    categories: ['web', 'brand'],
    summary:
      'Editorial marketing site for the studio itself — built to demonstrate the same engineering and design standards client work runs against.',
    image: 'https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Live at mantle-studios.com. Studio’s primary inbound channel.',
  },
  {
    slug: 'stephenmantle-com',
    title: 'stephenmantle.com — founder proof site',
    client: 'Stephen Mantle',
    year: '2026',
    categories: ['web', 'brand'],
    summary:
      'The site you are reading now. Editorial home for systems work, automation case notes, and direct contact with the operator behind Mantle Studios.',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Anchors trust for studio prospects researching who is behind the work.',
  },
  {
    slug: 'ops-dashboard',
    title: 'Ops Dashboard — studio operations view',
    client: 'Studio internal',
    year: '2025',
    categories: ['systems'],
    summary:
      'Single-pane dashboard pulling studio billing, content pipeline status, and prospect routing into one daily review screen.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Replaced four-tab spreadsheet review with one daily glance.',
  },
  {
    slug: 'content-pipeline',
    title: 'Content pipeline — weekly carousel automation',
    client: 'Studio internal',
    year: '2025',
    categories: ['automation'],
    summary:
      'HTML → Playwright → PNG rendering pipeline that turns a single weekly content brief into a finished social carousel.',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Weekly carousels ship in roughly eight minutes vs ninety minutes manual layout.',
  },
  {
    slug: 'newsletter-system',
    title: 'Studio newsletter system',
    client: 'Studio internal',
    year: '2025',
    categories: ['automation', 'brand'],
    summary:
      'Canva-driven, brief-first publishing flow. Page one runs an editorial note, page two carries the in-progress work, and the issue ships every Sunday.',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Newsletter ships weekly on autopilot from one Monday brief document.',
  },
  {
    slug: 'strategic-intel-engine',
    title: 'Strategic intel engine',
    client: 'Studio internal',
    year: '2026',
    categories: ['systems', 'automation'],
    summary:
      'Daily competitive-signal scraper that summarises landing-page and positioning changes across the service-business benchmarks Mantle Studios tracks.',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80',
    outcome: 'Surfaces positioning shifts across tracked competitors in under five minutes.',
  },
] as const

const PORTFOLIO_PAGE_SIZE = 4

const BLOG_FILTERS = [
  { value: 'all', label: 'All posts' },
  { value: 'web', label: 'Web design' },
  { value: 'systems', label: 'Operations' },
  { value: 'automation', label: 'Automation' },
  { value: 'practice', label: 'Studio practice' },
] as const

type BlogCategory = (typeof BLOG_FILTERS)[number]['value']

type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: BlogCategory
  categoryLabel: string
  date: string
  readTime: string
  image: string
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'self-documenting-features-with-mermaid',
    title: 'Every feature should ship with its own Mermaid diagram',
    excerpt:
      'After rebuilding the same dashboard twice in six months, I now embed a flow diagram next to the code. It is the only way I trust next-month-me to understand what was actually built.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-05-22',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'newsletter-page-one-page-two',
    title: 'Why the studio newsletter has a page one and a page two',
    excerpt:
      'Editorial up top, work-in-progress below. The split is what stopped the weekly note becoming a content channel and turned it back into a studio update.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-05-09',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'builder-or-challenger',
    title: 'Builder or Challenger — a two-word decision frame for solo studios',
    excerpt:
      'When a client floats an idea, the first move is asking which mode they want from you. It changes whether you ship the thing or pressure-test the premise first.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-04-22',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1518621012420-8ab10887ce0c?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'fraunces-manrope-for-service-businesses',
    title: 'Fraunces and Manrope — a working type pair for service-business sites',
    excerpt:
      'Service businesses do not need display-typography flair. They need a serif that reads as confident and a sans that disappears under the message. This is the pair I default to and why.',
    category: 'web',
    categoryLabel: 'Web design',
    date: '2026-04-04',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'mcp-routing-for-solo-operators',
    title: 'Routing twenty MCP servers as a one-person studio',
    excerpt:
      'Notes from wiring Notion, Figma, Vercel, Supabase, and a dozen others into a single agent surface — without each new connector slowing the rest of the stack down.',
    category: 'automation',
    categoryLabel: 'Automation',
    date: '2026-03-19',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'service-pages-need-proof-of-concept',
    title: 'Every service page should ship with a working proof of concept',
    excerpt:
      'A bullet list of capabilities convinces nobody. A small live tool that demonstrates the capability convinces visitors before they ever reach a contact form.',
    category: 'web',
    categoryLabel: 'Web design',
    date: '2026-03-02',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
  },
]

function formatBlogDate(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function PortfolioPage({ navigate }: { navigate: (to: RoutePath) => void }) {
  const [filter, setFilter] = useState<PortfolioCategory>('all')
  const [visible, setVisible] = useState(PORTFOLIO_PAGE_SIZE)

  const filtered =
    filter === 'all'
      ? PORTFOLIO_PROJECTS
      : PORTFOLIO_PROJECTS.filter((project) => project.categories.includes(filter))

  const shown = filtered.slice(0, visible)
  const hasMore = filtered.length > shown.length

  return (
    <>
      <PageHero
        eyebrow="Selected work"
        title="A small body of work for service businesses that needed clearer systems."
        body="Every project listed below is a real build — site, system, or automation — shipped for a paying client or for the studio itself."
      />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--teal)]">
              <span className="mr-2 inline-block h-px w-6 bg-[var(--teal)]" />
              Filter
            </span>
            <h2 className="mt-4 font-display text-2xl tracking-editorial text-[var(--ink)] md:text-3xl">
              Browse by what the project was built to solve.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {PORTFOLIO_FILTERS.map((option) => {
              const active = option.value === filter
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFilter(option.value)
                    setVisible(PORTFOLIO_PAGE_SIZE)
                  }}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${
                    active
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          {shown.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">
                Nothing here yet
              </p>
              <p className="mt-3 font-display text-2xl tracking-editorial text-[var(--ink)]">
                No projects under this filter right now.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {shown.map((project, index) => (
                <PortfolioCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          )}

          {hasMore ? (
            <div className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((prev) => prev + PORTFOLIO_PAGE_SIZE)}
                className="inline-flex items-center gap-3 rounded-full border border-[var(--ink)] px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[var(--ink)] transition hover:bg-[var(--ink)] hover:text-white"
              >
                Load more work
                <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
              </button>
            </div>
          ) : null}
        </div>
      </section>

      <FinalCta
        title="If a project here looks like the shape of yours, that's a good reason to talk."
        body="Send a brief description of where the friction sits today. I will reply within two working days with whether it sounds like something I can help with."
        ctaLabel="Start a project"
        href={CONTACT_HREF}
      />
    </>
  )
}

function PortfolioCard({
  project,
  index,
}: {
  project: PortfolioProject
  index: number
}) {
  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-3xl bg-gray-100">
        <div className="aspect-[4/3] w-full">
          <img
            src={project.image}
            alt={project.title}
            loading={index < 2 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
          />
        </div>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {project.categories.map((cat) => {
            const meta = PORTFOLIO_FILTERS.find((opt) => opt.value === cat)
            if (!meta) {
              return null
            }
            return (
              <span
                key={cat}
                className="rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--ink)] backdrop-blur"
              >
                {meta.label}
              </span>
            )
          })}
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
          <span>{project.client}</span>
          <span aria-hidden className="h-px w-6 bg-gray-300" />
          <span>{project.year}</span>
        </div>
        <h3 className="font-display text-2xl tracking-editorial text-[var(--ink)] md:text-3xl">
          {project.title}
        </h3>
        <p className="text-base leading-relaxed text-gray-600">{project.summary}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ember)]">
          Outcome — <span className="text-gray-700 normal-case tracking-normal">{project.outcome}</span>
        </p>
        <span className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[var(--ink)]">
          <span className="inline-block h-px w-6 bg-[var(--ember)]" />
          Read the case
        </span>
      </div>
    </article>
  )
}

type BlogSortKey = 'date_desc' | 'date_asc' | 'title_asc'

function BlogPage({ navigate }: { navigate: (to: RoutePath) => void }) {
  const [filter, setFilter] = useState<BlogCategory>('all')
  const [sort, setSort] = useState<BlogSortKey>('date_desc')

  const filtered = filter === 'all' ? BLOG_POSTS : BLOG_POSTS.filter((post) => post.category === filter)

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title_asc') {
      return a.title.localeCompare(b.title)
    }
    const aTime = new Date(a.date).getTime()
    const bTime = new Date(b.date).getTime()
    if (sort === 'date_asc') {
      return aTime - bTime
    }
    return bTime - aTime
  })

  return (
    <>
      <PageHero
        eyebrow="Latest from the studio"
        title="Notes on building practical software for service businesses."
        body="Working posts about web design, operational systems, and automation — written from inside live projects, not theoretical advice."
      />

      <section className="border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2">
            {BLOG_FILTERS.map((option) => {
              const active = option.value === filter
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition ${
                    active
                      ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
          <label className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as BlogSortKey)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            >
              <option value="date_desc">Date · newest</option>
              <option value="date_asc">Date · oldest</option>
              <option value="title_asc">Title · A–Z</option>
            </select>
          </label>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          {sorted.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-gray-200 px-6 py-24 text-center">
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-gray-500">
                Empty for now
              </p>
              <p className="mt-3 font-display text-2xl tracking-editorial text-[var(--ink)]">
                No posts in this category yet.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-12">
              {sorted.map((post, index) => (
                <li key={post.slug}>
                  <BlogRow post={post} reversed={index % 2 === 1} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <FinalCta
        title="Have a question that would make a better post than a reply?"
        body="Send it across. If it is the kind of thing other operators wrestle with, it will probably end up here — credited or anonymised, your call."
        ctaLabel="Email the studio"
        href={CONTACT_HREF}
      />
    </>
  )
}

function BlogRow({ post, reversed }: { post: BlogPost; reversed: boolean }) {
  return (
    <article
      className={`group grid grid-cols-1 gap-8 border-b border-gray-100 pb-12 md:grid-cols-12 md:gap-12 ${
        reversed ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <div className="md:col-span-5">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <div className="aspect-[5/4] w-full">
            <img
              src={post.image}
              alt={post.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            />
          </div>
          <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--ink)] backdrop-blur">
            {post.categoryLabel}
          </span>
        </div>
      </div>
      <div className="md:col-span-7 md:pt-4">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
          <span>{formatBlogDate(post.date)}</span>
          <span aria-hidden className="h-px w-6 bg-gray-300" />
          <span>{post.readTime}</span>
        </div>
        <h3 className="mt-4 font-display text-3xl leading-tight tracking-editorial text-[var(--ink)] md:text-4xl">
          {post.title}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600">{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] text-[var(--ink)]">
          <span className="inline-block h-px w-6 bg-[var(--ember)]" />
          Read the post
          <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} />
        </span>
      </div>
    </article>
  )
}

type SharedShellProps = {
  dublinTime: string
  menuOpen: boolean
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>
  navigate: (to: RoutePath) => void
  path: RoutePath
}

function InnerPageShell({
  dublinTime,
  menuOpen,
  setMenuOpen,
  navigate,
  path,
  children,
}: SharedShellProps & { children: React.ReactNode }) {
  return (
    <>
      <section className="relative overflow-hidden bg-[#EFEFEF] pb-8">
        <ShaderLayer />
        <div className="relative z-20 p-2 sm:p-3">
          <div className="mx-auto max-w-[1440px]">
            <SiteNav
              dublinTime={dublinTime}
              menuOpen={menuOpen}
              setMenuOpen={setMenuOpen}
              navigate={navigate}
              path={path}
            />
          </div>
        </div>
        <MobileMenu
          dublinTime={dublinTime}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
          navigate={navigate}
        />
      </section>
      {children}
      <SiteFooter navigate={navigate} />
    </>
  )
}

function ShaderLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10">
      <Shader className="h-full w-full" colorSpace="srgb" disableTelemetry>
        <FilmGrain strength={0.05}>
          <FlutedGlass
            aberration={0.61}
            angle={31}
            frequency={8}
            highlight={0.12}
            highlightSoftness={0}
            lightAngle={-90}
            refraction={4}
            shape="rounded"
            softness={1}
            speed={0.15}
          >
            <Swirl colorA="#ffffff" colorB="#f0f0f0" detail={1.7} />
            <ChromaFlow
              baseColor="#ffffff"
              downColor="#ff5f03"
              leftColor="#ff5f03"
              momentum={13}
              radius={3.5}
              rightColor="#ff5f03"
              upColor="#ff5f03"
            />
          </FlutedGlass>
        </FilmGrain>
      </Shader>
    </div>
  )
}

function SiteFooter({ navigate }: { navigate: (to: RoutePath) => void }) {
  const year = new Date().getFullYear()
  return (
    <footer className="bg-[#1E1E1E] px-5 pb-10 pt-16 text-[#FAF8F5] sm:px-8 sm:pb-12 sm:pt-20 lg:px-12 lg:pt-24">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-12 border-b border-white/10 pb-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[11px] font-bold tracking-tight text-[#1E1E1E]">
                SM
              </div>
              <p className="font-serif text-[20px] leading-none tracking-[-0.01em]">Stephen Mantle</p>
            </div>
            <p className="mt-5 max-w-[28rem] text-[14px] leading-[1.65] text-white/60">
              Web design and operational systems for businesses that need clearer workflows and less admin. Based in Dublin.
            </p>
            <a
              href={LINKTREE_HREF}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-[13px] leading-[13px] text-white/80 transition-colors hover:border-white/60 hover:text-white"
            >
              <LinkIcon size={14} strokeWidth={1.8} />
              <span>All links · Linktree</span>
            </a>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/40">Pages</p>
            <ul className="mt-5 flex flex-col gap-3 text-[14px] text-white/75">
              {NAV_LINKS.map((link) => (
                <li key={link.to}>
                  <a
                    href={link.to}
                    onClick={(event) => {
                      event.preventDefault()
                      navigate(link.to)
                    }}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="/diagnostic"
                  onClick={(event) => {
                    event.preventDefault()
                    navigate('/diagnostic')
                  }}
                  className="transition-colors hover:text-white"
                >
                  AI Readiness Check
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[12px] uppercase tracking-[0.18em] text-white/40">Connect</p>
            <ul className="mt-5 flex flex-col gap-3 text-[14px] text-white/75">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-3 transition-colors hover:text-white"
                  >
                    <Icon size={16} strokeWidth={1.7} />
                    <span>{label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={CONTACT_HREF}
                  className="inline-flex items-center gap-3 transition-colors hover:text-white"
                >
                  <span>{CONTACT_HREF.replace('mailto:', '')}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} Stephen Mantle. Built in Dublin.</p>
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <a
                key={`mark-${label}`}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="rounded-full border border-white/15 p-2 transition-colors hover:border-white/60 hover:text-white"
              >
                <Icon size={14} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

function SiteNav({
  dublinTime,
  menuOpen,
  setMenuOpen,
  navigate,
  path,
}: SharedShellProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-full bg-white p-[5px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-4 pl-1 sm:gap-6">
        <a
          href="/"
          className="flex items-center gap-3"
          onClick={(event) => {
            event.preventDefault()
            navigate('/')
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 sm:h-10 sm:w-10">
            <span className="text-[10px] font-bold leading-none tracking-tight text-white sm:text-[11px]">
              SM
            </span>
          </div>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(event) => {
                event.preventDefault()
                navigate(link.to)
              }}
              className={`text-[14px] transition-colors duration-300 ${
                path === link.to ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <div className="hidden items-center gap-4 md:flex">
        <p className="hidden text-[13px] leading-[13px] text-gray-600 lg:block">
          Practical systems for service businesses
        </p>

        <div className="flex items-center gap-2 text-[13px] leading-[13px] text-gray-600">
          <Clock size={14} strokeWidth={1.8} />
          <span>{dublinTime} in Dublin</span>
        </div>

        <RollingButton
          label="Book a free intro call"
          href={BOOKING_HREF}
          className="bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white"
          arrowCircleClassName="h-6 w-6 bg-white text-gray-900"
          arrowClassName="h-3.5 w-3.5"
        />
      </div>

      <button
        type="button"
        className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-[13px] font-medium leading-[13px] text-white md:hidden"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span>{menuOpen ? 'Close' : 'Menu'}</span>
        {menuOpen ? <X size={16} strokeWidth={2.1} /> : <Menu size={16} strokeWidth={2.1} />}
      </button>
    </div>
  )
}

function MobileMenu({
  dublinTime,
  menuOpen,
  setMenuOpen,
  navigate,
}: Omit<SharedShellProps, 'path'>) {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] md:hidden ${
        menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <button
        type="button"
        aria-label="Close menu"
        className="absolute inset-0 bg-black/60"
        onClick={() => setMenuOpen(false)}
      />

      <div
        id="mobile-menu"
        className={`absolute inset-x-0 bottom-0 mx-3 mb-3 rounded-2xl bg-white px-5 pb-5 pt-4 transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          menuOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-gray-200 px-3 py-1.5 text-[13px] leading-[13px] text-gray-600">
          <Clock size={14} strokeWidth={1.8} />
          <span>{dublinTime} in Dublin</span>
        </div>

        <div className="flex flex-col gap-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.to}
              href={link.to}
              onClick={(event) => {
                event.preventDefault()
                navigate(link.to)
              }}
              className="text-left text-[28px] font-medium leading-[32px] text-gray-900"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-8">
          <RollingButton
            label="Start a project"
            href={BOOKING_HREF}
            className="w-full justify-between bg-gray-900 px-5 py-2 text-[14px] font-medium leading-[14px] text-white"
            arrowCircleClassName="h-8 w-8 bg-white text-gray-900"
            arrowClassName="h-4 w-4"
            textClassName="items-start"
          />
        </div>

        <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={`mobile-${label}`}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              className="rounded-full border border-gray-200 p-2 text-gray-600 transition-colors hover:border-gray-900 hover:text-gray-900"
            >
              <Icon size={16} strokeWidth={1.7} />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string
  title: string
  body: string
}) {
  return (
    <section className="grain-overlay relative bg-[#EFEFEF] pb-14 pt-10 sm:pb-16 lg:pb-24 lg:pt-14">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-700">
          <span className="inline-block h-px w-8 bg-[var(--teal)]" />
          <span>{eyebrow}</span>
        </div>
        <h1 className="mt-6 max-w-[1080px] font-display text-[clamp(2rem,6.4vw,4.4rem)] font-medium leading-[1.04] tracking-editorial text-gray-900">
          {title}
        </h1>
        <p className="mt-7 max-w-[52rem] text-[15px] leading-[1.75] text-gray-700 sm:text-[18px]">
          {body}
        </p>
      </div>
    </section>
  )
}

function SectionHeader({
  number,
  label,
  title,
  containerClassName,
  borderClassName = 'border-gray-200',
}: {
  number: string
  label: string
  title: string
  containerClassName: string
  borderClassName?: string
}) {
  return (
    <>
      <div className={`mb-6 flex items-center gap-3 ${containerClassName} sm:mb-8`}>
        <NumberBadge number={number} />
        <SectionPill label={label} borderClassName={borderClassName} />
      </div>
      <div className={`${containerClassName}`}>
        <h2 className="mb-12 max-w-[1020px] font-display text-[clamp(1.6rem,4.2vw,3.4rem)] font-medium leading-[1.08] tracking-editorial text-gray-900 sm:mb-16 lg:mb-20">
          {title}
        </h2>
      </div>
    </>
  )
}

function FinalCta({
  title,
  body,
  ctaLabel,
  href,
}: {
  title: string
  body: string
  ctaLabel: string
  href: string
}) {
  return (
    <section className="bg-white px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-16 lg:px-12 lg:pb-24 lg:pt-20">
      <div className="mx-auto max-w-[1440px]">
        <div className="grain-overlay relative overflow-hidden rounded-3xl bg-[#1E1E1E] px-6 py-10 text-[#FAF8F5] shadow-[0_24px_80px_rgba(0,0,0,0.18)] sm:px-10 sm:py-12 lg:px-14 lg:py-14">
          <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-[var(--teal)] opacity-30 blur-3xl" aria-hidden />
          <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-[var(--ember)] opacity-20 blur-3xl" aria-hidden />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-[42rem]">
              <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
                <span className="inline-block h-px w-8 bg-[var(--ember)]" />
                <span>Next step</span>
              </div>
              <h2 className="mt-5 font-display text-[clamp(1.8rem,3.6vw,2.6rem)] font-medium leading-[1.1] tracking-editorial text-white">
                {title}
              </h2>
              <p className="mt-4 text-[14px] leading-[1.7] text-white/65 sm:text-[15px]">
                {body}
              </p>
            </div>

            <RollingButton
              label={ctaLabel}
              href={href}
              className="w-fit bg-[#FAF8F5] py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-[#1E1E1E]"
              arrowCircleClassName="h-7 w-7 bg-[#1E1E1E] text-[#FAF8F5]"
              arrowClassName="h-4 w-4"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function DiagnosticAnswerCard({
  title,
  body,
  selected,
  onClick,
  badge,
}: {
  title: string
  body: string
  selected: boolean
  onClick: () => void
  badge?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
        selected
          ? 'border-gray-900 bg-gray-900 text-white'
          : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-[16px] font-semibold leading-[1.2]">{title}</h4>
        {badge ? (
          <span
            className={`flex h-6 min-w-[24px] items-center justify-center rounded-full px-1.5 text-[11px] font-semibold ${
              selected ? 'bg-white text-gray-900' : 'bg-[#F5F5F5] text-gray-500'
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <p
        className={`mt-3 text-[14px] leading-relaxed ${
          selected ? 'text-white/75' : 'text-gray-600'
        }`}
      >
        {body}
      </p>
    </button>
  )
}

function ScoreBar({
  label,
  value,
  tone = 'dark',
}: {
  label: string
  value: number
  tone?: 'dark' | 'light'
}) {
  const mutedText = tone === 'light' ? 'text-white/65' : 'text-gray-500'
  const trackColor = tone === 'light' ? 'bg-white/15' : 'bg-gray-200'
  const valueColor = tone === 'light' ? 'text-white' : 'text-gray-900'

  return (
    <div>
      <div className={`mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.16em] ${mutedText}`}>
        <span>{label}</span>
        <span className={valueColor}>{value}</span>
      </div>
      <div className={`h-2 overflow-hidden rounded-full ${trackColor}`}>
        <div
          className="h-full rounded-full bg-[#F26522] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function RollingButton({
  label,
  href,
  onClick,
  className,
  arrowCircleClassName,
  arrowClassName,
  textClassName,
}: RollingButtonProps) {
  const content = (
    <>
      <span className={`flex h-[20px] overflow-hidden ${textClassName ?? ''}`}>
        <span className="flex min-h-[40px] flex-col transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-translate-y-1/2">
          <span className="leading-[20px]">{label}</span>
          <span className="leading-[20px]">{label}</span>
        </span>
      </span>
      <span
        className={`flex items-center justify-center rounded-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 ${arrowCircleClassName}`}
      >
        <ArrowRight className={arrowClassName} />
      </span>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={`group inline-flex items-center gap-3 rounded-full font-medium transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group inline-flex items-center gap-3 rounded-full font-medium transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}
    >
      {content}
    </button>
  )
}

function NumberBadge({ number }: { number: string }) {
  return (
    <span className="inline-flex items-center font-mono text-[11px] tabular-nums uppercase tracking-[0.18em] text-[var(--teal)]">
      <span className="mr-2 inline-block h-px w-6 bg-[var(--teal)]" />
      {number}
    </span>
  )
}

function SectionPill({
  label,
  borderClassName = 'border-gray-200',
}: {
  label: string
  borderClassName?: string
}) {
  return (
    <span
      className={`rounded-full border px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-gray-900 sm:px-4 sm:py-1.5 sm:text-[12px] ${borderClassName}`}
    >
      {label}
    </span>
  )
}

export default App
