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

const CONTACT_HREF = 'mailto:hello@stephenmantle.com'
const BOOKING_HREF = 'https://www.cal.eu/stephen-mantle/meeting?user=stephen-mantle&overlayCalendar=true'
const DIAGNOSTIC_WEBHOOK_URL = import.meta.env.VITE_DIAGNOSTIC_WEBHOOK_URL ?? ''
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
      'Website builds, automation systems, research agents, and diagnostics — each shipped, running, and shown with proof of concept.',
  },
  '/diagnostic': {
    title: 'AI Readiness Check — Stephen Mantle',
    description:
      'Take the AI Readiness Check to identify operational friction, score workflow readiness, and find the safest first system to improve.',
  },
  '/blog': {
    title: 'Journal — Stephen Mantle',
    description:
      'Notes on building practical software, web design, and automation systems for service businesses.',
  },
  '/ai-tool-stack': {
    title: 'Running twenty AI tools from one workspace — Stephen Mantle',
    description:
      'How a one-person studio drives twenty-plus AI tools from a single workspace without each new tool slowing the others down.',
  },
  '/excalidraw-diagrams': {
    title: 'Ask AI for an Excalidraw diagram before you trust the answer — Stephen Mantle',
    description:
      'Prompting AI to explain itself with an Excalidraw diagram turns jargon into a step-by-step visual you can actually follow. The under-the-hood view, sketched.',
  },
  '/thirty-day-rule': {
    title: 'The 30-day rule — every system must teach itself — Stephen Mantle',
    description:
      'Build every feature so future-you, six weeks later, understands it in thirty seconds. Surface view, flow view, architecture view, plain-English line — every shipped thing carries all four.',
  },
  '/ai-thought-partner': {
    title: 'Using AI as a thought partner — how one hour of chat replaces a week of rework — Stephen Mantle',
    description:
      'Walking an idea through an AI partner surfaces bottlenecks and hidden assumptions before any code gets written. The flow diagram falls out of the chat.',
  },
  '/first-email-sent': {
    title: 'The first email that actually sent — Stephen Mantle',
    description:
      'Two paths to a working newsletter automation — AI prompts inside a chatbot versus a terminal and a few free APIs. What one teaches that the other does not.',
  },
  '/proof-of-concept': {
    title: 'Every service page should ship with a working proof of concept — Stephen Mantle',
    description:
      'Why a small, live tool on the service page outperforms a longer capability list, and how to scope one without inflating the build.',
  },
}

const ABOUT_PROBLEMS = [
  'Work gets duplicated because ownership is unclear.',
  'Important updates live across inboxes, chats, spreadsheets, and memory.',
  'Manual reporting delays decisions that should be obvious earlier.',
  'Teams create workarounds because the real process no longer fits the work.',
] as const

const ABOUT_BACKGROUND = [
  {
    title: 'Luxury operations',
    body: "Years inside LVMH brands. I watched premium teams keep service, retail, and CX feeling effortless — and saw how much human glue held the back of house together.",
  },
  {
    title: 'Data & reporting',
    body: 'Years at Accenture in Excel. Data reporting for marketing teams, growing the internal side of the business. Most of the work was translation, not SQL.',
  },
  {
    title: 'Under the hood',
    body: "Somewhere in there I got curious about the wiring. APIs, schemas, integrations. Once you can read them, the 'tech problem' usually turns out to be a process problem in costume.",
  },
  {
    title: 'AI developer tools',
    body: "AI tools, design tools, automation tools. I use them every day now. Not as a headline — as the cheapest way I've ever found to put operational ideas in front of a real business.",
  },
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
    statusLabel: 'In production',
    name: 'Website Design & Build',
    description: 'Clean, credible sites that explain the offer and make it easy for the right client to act.',
    builtWith: ['React', 'Tailwind', 'Vercel'],
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial workspace with monitor and clean desk surface.',
    proofHeadline: 'A studio front door, built from scratch.',
    proofBody: 'Copy, design, and full Vercel deployment. Earns trust before the first conversation.',
  },
  {
    id: 'mail-automation',
    status: 'live' as ServiceStatus,
    statusLabel: 'In production',
    name: 'Morning Brief & Mail Automation',
    description: 'Daily briefings, inbox triage, and follow-up flows that remove the morning admin pile.',
    builtWith: ['Zapier', 'Zoho Mail', 'Claude API'],
    image: 'https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Open notebook beside a coffee cup at a clean desk, morning workspace setup.',
    proofHeadline: 'One briefing email, every morning.',
    proofBody: 'Overnight activity pulled, replies flagged, formatted into a single brief. No manual inbox sorting before the workday starts.',
  },
  {
    id: 'research-agent',
    status: 'live' as ServiceStatus,
    statusLabel: 'In production',
    name: 'Research Agent System',
    description: 'Automated research loops that surface competitor moves, industry signals, and client intelligence weekly.',
    builtWith: ['Claude API', 'Exa', 'Zapier'],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial print of charts and analytical paper layouts.',
    proofHeadline: 'Hours of manual reading replaced.',
    proofBody: 'Agent monitors target trends, surfaces relevant signals, outputs a structured weekly report. Runs unattended.',
  },
  {
    id: 'newsletter',
    status: 'building' as ServiceStatus,
    statusLabel: 'In development',
    name: 'Business Insights Newsletter',
    description: 'A research-to-newsletter pipeline that turns agent output into a structured weekly send.',
    builtWith: ['Claude API', 'Canva', 'Zapier'],
    image: 'https://images.unsplash.com/photo-1456735190827-d1262f71b8a3?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Stack of folded broadsheet newspapers on a neutral surface.',
    proofHeadline: 'Research to publication, on rails.',
    proofBody: 'Agent output flows into a formatted template. Structure, formatting, and scheduling automated. Editorial decisions stay human.',
  },
  {
    id: 'content-pipeline',
    status: 'template' as ServiceStatus,
    statusLabel: 'Template ready',
    name: 'AI Content Pipeline',
    description: 'A system for planning, drafting, and scheduling content across platforms without daily overhead.',
    builtWith: ['Claude API', 'Notion', 'Zapier'],
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial notebook and pen on a quiet desk surface.',
    proofHeadline: 'Brief in, scheduled post out.',
    proofBody: 'Handles intake, draft generation, review routing, and posting schedules. Adaptable to any service business with a steady content output.',
  },
  {
    id: 'booking',
    status: 'live' as ServiceStatus,
    statusLabel: 'Running on this site',
    name: 'Booking & Scheduling Automation',
    description: 'Cal.com-based booking with automated reminders, no-show prevention, and confirmation flows.',
    builtWith: ['Cal.com', 'Zapier', 'Zoho Mail'],
    image: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial calendar print with marked dates, monochrome composition.',
    proofHeadline: 'Booked, confirmed, reminded — hands off.',
    proofBody: 'Appointment booked, confirmation sent, reminder triggered, follow-up scheduled. Same stack powers booking on this site.',
  },
  {
    id: 'automation-layer',
    status: 'building' as ServiceStatus,
    statusLabel: 'In development',
    name: 'AI Workflow Layer',
    description: 'A composable automation layer connecting AI tools, business apps, and internal systems.',
    builtWith: ['Zapier', 'AI tools', 'Claude'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial close-up of a circuit board, monochrome detail.',
    proofHeadline: 'Connective tissue between AI and ops.',
    proofBody: 'A composable layer wiring AI tools to business-critical apps. The orchestration backbone behind every studio automation.',
  },
  {
    id: 'diagnostic',
    status: 'live' as ServiceStatus,
    statusLabel: 'Running on this site',
    name: 'AI Readiness Diagnostic',
    description: 'An 8-question diagnostic that scores a business across workflow, data, trust, and urgency — then identifies a first system worth building.',
    builtWith: ['React', 'Webhook', 'Zoho Mail'],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Editorial close-up of an analytics dashboard on screen.',
    proofHeadline: 'A real assessment, before any hire.',
    proofBody: 'Scoring logic, archetype classification, and follow-up webhook all live on this site. The same diagnostic plugs into client onboarding or enquiry flows.',
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
      'Output: a signed scope. Held to in writing.',
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
  { label: 'Years building', value: '9+', note: 'Web, systems, and automation work shipped since 2017.' },
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

type RoutePath =
  | '/'
  | '/about'
  | '/services'
  | '/diagnostic'
  | '/blog'
  | '/ai-tool-stack'
  | '/excalidraw-diagrams'
  | '/thirty-day-rule'
  | '/ai-thought-partner'
  | '/first-email-sent'
  | '/proof-of-concept'

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
  return `mailto:hello@stephenmantle.com?subject=${subject}&body=${body}`
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
    'hello@stephenmantle.com',
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
              <p className="text-[12px] font-semibold tracking-[0.12em] text-[#2A7D6E]">
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

  if (cleanPath === '/journal') {
    return '/blog'
  }

  if (
    cleanPath === '/' ||
    cleanPath === '/about' ||
    cleanPath === '/services' ||
    cleanPath === '/diagnostic' ||
    cleanPath === '/blog' ||
    cleanPath === '/ai-tool-stack' ||
    cleanPath === '/excalidraw-diagrams' ||
    cleanPath === '/thirty-day-rule' ||
    cleanPath === '/ai-thought-partner' ||
    cleanPath === '/first-email-sent' ||
    cleanPath === '/proof-of-concept'
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
          {path === '/blog' ? <BlogPage navigate={navigate} /> : null}
          {path === '/ai-tool-stack' ? <JournalPostPage slug="ai-tool-stack" navigate={navigate} /> : null}
          {path === '/excalidraw-diagrams' ? (
            <JournalPostPage slug="excalidraw-process-maps" navigate={navigate} />
          ) : null}
          {path === '/thirty-day-rule' ? (
            <JournalPostPage slug="thirty-day-rule-systems-teach-themselves" navigate={navigate} />
          ) : null}
          {path === '/ai-thought-partner' ? (
            <JournalPostPage slug="ai-thought-partner" navigate={navigate} />
          ) : null}
          {path === '/first-email-sent' ? (
            <JournalPostPage slug="first-email-that-actually-sent" navigate={navigate} />
          ) : null}
          {path === '/proof-of-concept' ? (
            <JournalPostPage slug="service-pages-need-proof-of-concept" navigate={navigate} />
          ) : null}
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

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <RollingButton
                label="Book a call"
                href={BOOKING_HREF}
                className="bg-[#2A7D6E] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#1f5e54] sm:pl-6 sm:text-[14px] sm:leading-[14px]"
                arrowCircleClassName="h-7 w-7 bg-white text-[#2A7D6E] sm:h-8 sm:w-8"
                arrowClassName="h-4 w-4"
              />

              <div className="inline-flex w-fit items-center gap-3 rounded-[4px] bg-white px-3 py-2 shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] sm:px-4">
                <svg
                  viewBox="0 0 240 250"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  aria-label="Stephen Mantle"
                  role="img"
                >
                  <text x="120" y="104" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#2A7D6E">S</text>
                  <line x1="75" y1="132" x2="165" y2="132" stroke="#2A7D6E" strokeWidth="6" />
                  <text x="120" y="222" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#2A7D6E">M</text>
                </svg>
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

      <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="01"
            label="The shape of the work"
            title="Pull the moving parts into one place."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="px-5 sm:px-8 lg:px-12">
            <div className="overflow-hidden rounded-2xl bg-[#1E1E1E] p-6 sm:p-10 lg:p-14">
              <svg
                viewBox="0 0 1200 560"
                xmlns="http://www.w3.org/2000/svg"
                className="h-auto w-full"
                role="img"
                aria-label="Diagram: inbox, bookings and spreadsheets flow into one dashboard, which gives back hours."
              >
                <defs>
                  <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M0,0 L10,5 L0,10 z" fill="#2A7D6E" />
                  </marker>
                </defs>

                <g fontFamily="Manrope, sans-serif" fill="#FAF8F5">
                  <g>
                    <rect x="60" y="60" width="280" height="110" rx="14" fill="none" stroke="#FAF8F5" strokeWidth="1.5" />
                    <text x="200" y="115" textAnchor="middle" fontSize="22" fontWeight="500">Your inbox</text>
                    <text x="200" y="145" textAnchor="middle" fontSize="14" opacity="0.6">enquiries, quotes, follow-ups</text>
                  </g>
                  <g>
                    <rect x="460" y="60" width="280" height="110" rx="14" fill="none" stroke="#FAF8F5" strokeWidth="1.5" />
                    <text x="600" y="115" textAnchor="middle" fontSize="22" fontWeight="500">Your bookings</text>
                    <text x="600" y="145" textAnchor="middle" fontSize="14" opacity="0.6">calendar, confirmations, no-shows</text>
                  </g>
                  <g>
                    <rect x="860" y="60" width="280" height="110" rx="14" fill="none" stroke="#FAF8F5" strokeWidth="1.5" />
                    <text x="1000" y="115" textAnchor="middle" fontSize="22" fontWeight="500">Your spreadsheets</text>
                    <text x="1000" y="145" textAnchor="middle" fontSize="14" opacity="0.6">invoices, suppliers, jobs done</text>
                  </g>

                  <path d="M200 170 L590 260" stroke="#2A7D6E" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                  <path d="M600 170 L600 260" stroke="#2A7D6E" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />
                  <path d="M1000 170 L610 260" stroke="#2A7D6E" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                  <g>
                    <rect x="380" y="270" width="440" height="120" rx="14" fill="#2A7D6E" />
                    <text x="600" y="320" textAnchor="middle" fontSize="24" fontWeight="600" fill="#FAF8F5">One place to see it all</text>
                    <text x="600" y="355" textAnchor="middle" fontSize="14" fill="#FAF8F5" opacity="0.85">a small dashboard built around the way the business actually runs</text>
                  </g>

                  <path d="M600 390 L600 460" stroke="#2A7D6E" strokeWidth="2" fill="none" markerEnd="url(#arrow)" />

                  <g>
                    <rect x="320" y="470" width="560" height="70" rx="14" fill="none" stroke="#FAF8F5" strokeWidth="1.5" strokeDasharray="6 6" />
                    <text x="600" y="513" textAnchor="middle" fontSize="20" fontWeight="500" fill="#FAF8F5">Hours back. Fewer dropped balls.</text>
                  </g>
                </g>
              </svg>
            </div>

            <p className="mt-8 max-w-[640px] text-[15px] leading-relaxed text-gray-700 sm:text-[16px]">
              Most small businesses do not need new software. They need the bits they already use to talk to each other, in plain sight, on one screen. That is the work.
            </p>

            <div className="mt-6">
              <button
                type="button"
                onClick={() => navigate('/services')}
                className="text-[12px] uppercase tracking-[0.18em] text-[#2A7D6E] hover:underline"
              >
                See how it gets built →
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="02"
            label="Services"
            title="Two systems, running today."
            containerClassName="px-5 sm:px-8 lg:px-12"
            borderClassName="border-gray-300"
          />

          <div className="grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:px-12">
            {SERVICES.filter((s) => s.id === 'website' || s.id === 'mail-automation').map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => navigate('/services')}
                className="flex flex-col overflow-hidden rounded-2xl bg-white text-left shadow-[0_12px_40px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_16px_50px_rgba(0,0,0,0.08)]"
              >
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img
                    src={service.image}
                    alt={service.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-col gap-3 p-5 sm:p-6">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-gray-500">
                    {service.statusLabel}
                  </p>
                  <h3 className="text-[18px] font-medium leading-[1.25] tracking-[-0.01em] text-gray-900 sm:text-[20px]">
                    {service.name}
                  </h3>
                  <p className="text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                    {service.description}
                  </p>
                  <span className="mt-1 text-[12px] uppercase tracking-[0.18em] text-[#2A7D6E]">
                    View service →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <FinalCta
        title="Got a problem worth a conversation?"
        body="Free intro call. No pitch."
        ctaLabel="Book a call"
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
        title="I want to help small businesses with what I learned the slow way."
        body="Years inside LVMH and Accenture. Excel, data reporting, helping marketing teams and growing the internal side of the business. The patterns kept repeating. The fixes were rarely the software."
      />

      <section className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="1"
            label="Where I started"
            title="Luxury floors, enterprise dashboards, the same broken handoffs."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-5 px-5 sm:px-8 lg:grid-cols-[0.75fr_1fr] lg:px-12">
            <div className="rounded-2xl bg-[#F5F5F5] p-5 sm:p-6">
              <p className="text-[15px] font-medium leading-[1.7] text-gray-900 sm:text-[17px]">
                Years inside LVMH brands watching premium operations up close.
                Then years at Accenture in Excel — data reporting for marketing teams,
                helping the internal side of the business grow.
              </p>
              <p className="mt-4 text-[15px] font-medium leading-[1.7] text-gray-900 sm:text-[17px]">
                Two very different worlds. The same pattern underneath. The polish on
                top was hiding a mess of spreadsheets, manual updates, and handoffs
                nobody owned.
              </p>

              <div className="mt-7">
                <RollingButton
                  label="Book a call"
                  href={BOOKING_HREF}
                  className="bg-[#2A7D6E] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#1f5e54] sm:text-[14px] sm:leading-[14px]"
                  arrowCircleClassName="h-7 w-7 bg-white text-[#2A7D6E]"
                  arrowClassName="h-4 w-4"
                />
              </div>
            </div>

            <div>
              <img
                src={PORTRAIT_IMAGE}
                alt="Stephen Mantle portrait"
                className="aspect-[3/2] w-full rounded-xl object-cover sm:rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-12 pt-12 sm:pb-16 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="2"
            label="Background"
            title="Four worlds. One throughline: translating what's actually going on into something a business can use."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-4 px-5 sm:px-8 sm:grid-cols-2 lg:px-12">
            {ABOUT_BACKGROUND.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl bg-[#F5F5F5] p-5 sm:p-6"
              >
                <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[#2A7D6E]">
                  {item.title}
                </p>
                <p className="mt-3 text-[15px] leading-[1.7] text-gray-800 sm:text-[16px]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="3"
            label="Why now"
            title="Small businesses get sold software. They need someone who'll look at the workflow first."
            containerClassName="px-5 sm:px-8 lg:px-12"
          />

          <div className="grid gap-6 px-5 sm:px-8 lg:grid-cols-[1fr_0.95fr] lg:px-12">
            <div>
              <p className="max-w-[44rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                Big consultancies don't take small jobs. Web agencies sell pages, not
                process. Most "AI for business" pitches are demos.
              </p>
              <p className="mt-5 max-w-[44rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                What I kept seeing — in luxury, in enterprise, in every SME I've spoken
                to since going solo — was the same gap. Someone who can sit with the
                owner, map how the business actually runs, and then build the smallest
                possible system around that. Website, dashboard, automation, whichever
                the work calls for.
              </p>
              <p className="mt-5 max-w-[44rem] text-[15px] leading-[1.75] text-gray-600 sm:text-[17px]">
                That gap is what Mantle Studios is for. One person, end to end, no
                jargon, no upsell.
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
        title="Busier than the business should be? It's almost never the software."
        body="Let's map the workflow first. Build only what's missing."
        ctaLabel="Book a free intro call"
        href={BOOKING_HREF}
      />
    </>
  )
}

function ServiceStatusBadge({ status, label }: { status: ServiceStatus; label: string }) {
  const styles: Record<ServiceStatus, string> = {
    live: 'bg-[#2A7D6E] text-white',
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
          <div className="mt-1 w-20 h-6 rounded-full bg-[#2A7D6E]" />
        </div>
      </div>
    )
  }
  if (id === 'mail-automation') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#F5F5F5] p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#2A7D6E] flex items-center justify-center text-white text-[10px] font-bold">S</div>
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
            <div className="w-12 h-4 rounded-full bg-[#2A7D6E]/20" />
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
            <div className="w-2 h-2 rounded-full bg-[#2A7D6E]" />
            <div className="w-24 h-2 rounded bg-gray-100" />
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-[#2A7D6E]" />
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
              <div className={`rounded p-1 flex-1 ${d === 'Mon' ? 'bg-[#2A7D6E]/20' : d === 'Wed' ? 'bg-green-100' : 'bg-white border border-gray-200'}`}>
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
            <div key={i} className={`rounded text-[7px] text-center py-1 ${i === 2 ? 'bg-[#2A7D6E] text-white font-semibold' : 'bg-gray-100 text-gray-500'}`}>{t}</div>
          ))}
        </div>
        <div className="px-3 pb-2">
          <div className="w-full h-5 rounded-full bg-[#2A7D6E]" />
        </div>
      </div>
    )
  }
  if (id === 'automation-layer') {
    return (
      <div className="h-36 rounded-xl overflow-hidden bg-[#111827] p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-[#2A7D6E] flex items-center justify-center text-white text-[9px] font-bold">Z</div>
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
          <circle cx="40" cy="40" r="30" fill="none" stroke="#2A7D6E" strokeWidth="8" strokeLinecap="round"
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
    <button
      onClick={() => onSeeProof(service.id)}
      className="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200 text-left"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {service.image ? (
          <img
            src={service.image}
            alt={service.imageAlt ?? service.name}
            loading="lazy"
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:grayscale-0 group-hover:scale-[1.02]"
          />
        ) : (
          <ServiceCardMockup id={service.id} />
        )}
      </div>
      <div className="p-5 flex flex-col gap-3 flex-1">
        <ServiceStatusBadge status={service.status} label={service.statusLabel} />
        <div className="flex flex-col gap-1.5 flex-1">
          <h3 className="text-base font-semibold text-[#111827]">{service.name}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{service.description}</p>
        </div>
        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[#2A7D6E]">
          See the proof
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </button>
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
      {service.image ? (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
          <img
            src={service.image}
            alt={service.imageAlt ?? service.name}
            loading="lazy"
            className="aspect-[16/9] w-full object-cover grayscale"
          />
        </div>
      ) : (
        <div className="max-w-sm">
          <ServiceCardMockup id={service.id} />
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {service.builtWith.map((tech) => (
            <span key={tech} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">{tech}</span>
          ))}
        </div>
        {service.id === 'diagnostic' && navigate ? (
          <button
            onClick={() => navigate('/diagnostic')}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2A7D6E] hover:underline group"
          >
            Try the diagnostic
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : null}
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
      setSubmitError('Something went wrong. Email hello@stephenmantle.com')
    }
  }

  return (
    <>
      <PageHero
        eyebrow="Services"
        title="What gets built."
        body="Each service shipped, running, and ready to wire into a real business."
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

      {/* Inquiry form */}
      <section className="py-16">
        <SectionHeader
          number="01"
          label="Get in touch"
          title="What are you working on?"
          containerClassName="px-0"
        />
        <div className="mt-10 max-w-2xl">
          {submitStatus === 'success' ? (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
              <div className="text-2xl font-semibold text-[#111827] mb-2">Enquiry sent.</div>
              <p className="text-gray-600">Reply inside one working day.</p>
            </div>
          ) : (
            <>
              {/* Progress bar */}
              <div className="flex items-center gap-3 mb-8">
                {Array.from({ length: INQUIRY_STEPS }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < inquiryStep ? 'bg-[#2A7D6E]' : i === inquiryStep ? 'bg-[#2A7D6E]/60' : 'bg-gray-200'}`}
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
                            ? 'border-[#2A7D6E] bg-[#2A7D6E]/5'
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
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2A7D6E] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        value={inquiry.email}
                        onChange={(e) => setInquiry((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2A7D6E] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-medium text-gray-700">Anything specific you'd like to mention? <span className="text-gray-400 font-normal">(optional)</span></label>
                      <textarea
                        value={inquiry.note}
                        onChange={(e) => setInquiry((prev) => ({ ...prev, note: e.target.value }))}
                        placeholder="Context, constraints, questions..."
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#2A7D6E] transition-colors resize-none"
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
                    className="rounded-full px-6 py-3 text-sm font-semibold bg-[#2A7D6E] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1f5e54] transition-colors"
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
        internalEmailTo: 'hello@stephenmantle.com',
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
            title="Diagnosis before pitch."
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
            <div className="rounded-2xl border border-[#2A7D6E]/15 bg-[#F5F5F5] p-5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] sm:p-6">
              <p className="text-[14px] leading-relaxed text-gray-700 sm:text-[15px]">
                <span className="font-semibold text-gray-900">Live demo.</span>{' '}
                Same logic powers client enquiry flows, ops audits, internal diagnostics.
                Identify the bottleneck before anyone talks tooling.
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
                    className="h-full rounded-full bg-[#2A7D6E] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {!showResults ? (
                <div className="overflow-hidden rounded-2xl border border-black/5 bg-[#F9F9F9]">
                  <div className="border-b border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(42,125,110,0.12),_transparent_28%),linear-gradient(180deg,_rgba(255,255,255,0.98),_rgba(245,245,245,0.96))] px-5 py-6 sm:px-7 sm:py-7">
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
                          className="w-full accent-[#2A7D6E]"
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
                                background: `radial-gradient(circle at center, #fff 48%, transparent 49%), conic-gradient(#2A7D6E 0 ${scoreFill}deg, rgba(0,0,0,0.08) ${scoreFill}deg 360deg)`,
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
                          <div className="rounded-2xl border border-[#2A7D6E]/25 bg-[#eef5f3] p-4 text-[14px] leading-relaxed text-gray-700">
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
                        className="rounded-full bg-[#2A7D6E] px-5 py-2 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-[#1f5e54] disabled:cursor-not-allowed disabled:opacity-40"
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
                  <div className="bg-[radial-gradient(circle_at_top_left,_rgba(42,125,110,0.16),_transparent_26%),linear-gradient(145deg,_#111827,_#1f2937)] px-5 py-6 text-white sm:px-7 sm:py-7">
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
                          background: `radial-gradient(circle at center, #fff 48%, transparent 49%), conic-gradient(#2A7D6E 0 ${scoreFill}deg, rgba(0,0,0,0.08) ${scoreFill}deg 360deg)`,
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

                      <div className="rounded-2xl border border-[#2A7D6E]/20 bg-[#F5F5F5] p-5 sm:p-6">
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
                          ? 'border-[#2A7D6E]/20 bg-[#eef5f3]'
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
                            <p className="text-[11px] font-semibold tracking-[0.16em] text-[#2A7D6E]">
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
                        className="bg-[#2A7D6E] py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white hover:bg-[#1f5e54]"
                        arrowCircleClassName="h-7 w-7 bg-white text-[#2A7D6E]"
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
    slug: 'excalidraw-process-maps',
    title: 'Ask AI for an Excalidraw diagram before you trust the answer',
    excerpt:
      'Prompting AI to sketch its reasoning as an Excalidraw flow turns dense jargon into a step-by-step picture. The under-the-hood view, drawn by hand, in under a minute.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-05-22',
    readTime: '5 min read',
    image: '/excalidraw-diagram.png',
  },
  {
    slug: 'thirty-day-rule-systems-teach-themselves',
    title: 'The 30-day rule — every system must teach itself',
    excerpt:
      'Build every feature so future-you, six weeks later, gets it in thirty seconds. Surface view, flow view, architecture view, plain-English line — every shipped thing carries all four.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-05-09',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'ai-thought-partner',
    title: 'Using AI as a thought partner — how one hour of chat replaces a week of rework',
    excerpt:
      'Walking an idea through an AI partner before any wireframe surfaces bottlenecks and hidden assumptions inside an hour. The flow diagram falls out of the chat. Build time drops by an order of magnitude.',
    category: 'practice',
    categoryLabel: 'Studio practice',
    date: '2026-04-22',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'first-email-that-actually-sent',
    title: 'The first email that actually sent',
    excerpt:
      'Two paths to a working newsletter automation — AI prompts inside a chatbot versus a terminal and a few free APIs. One felt like magic. The other taught the studio how the magic actually works.',
    category: 'automation',
    categoryLabel: 'Automation',
    date: '2026-06-11',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1600&q=80',
  },
  {
    slug: 'ai-tool-stack',
    title: 'Running twenty AI tools from one workspace',
    excerpt:
      'Notes from driving Notion, Figma, Vercel, Gmail, Calendar, and a dozen others from a single AI workspace — without each new tool slowing the others down.',
    category: 'automation',
    categoryLabel: 'Automation',
    date: '2026-06-10',
    readTime: '5 min read',
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
                  <BlogRow post={post} reversed={index % 2 === 1} navigate={navigate} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  )
}

const BLOG_POST_ROUTES: Partial<Record<string, RoutePath>> = {
  'ai-tool-stack': '/ai-tool-stack',
  'excalidraw-process-maps': '/excalidraw-diagrams',
  'thirty-day-rule-systems-teach-themselves': '/thirty-day-rule',
  'ai-thought-partner': '/ai-thought-partner',
  'first-email-that-actually-sent': '/first-email-sent',
  'service-pages-need-proof-of-concept': '/proof-of-concept',
}

function BlogRow({
  post,
  reversed,
  navigate,
}: {
  post: BlogPost
  reversed: boolean
  navigate: (to: RoutePath) => void
}) {
  const route = BLOG_POST_ROUTES[post.slug]
  const isLive = Boolean(route)
  const handleOpen = () => {
    if (route) {
      navigate(route)
    }
  }

  return (
    <article
      onClick={isLive ? handleOpen : undefined}
      onKeyDown={
        isLive
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                handleOpen()
              }
            }
          : undefined
      }
      role={isLive ? 'link' : undefined}
      tabIndex={isLive ? 0 : undefined}
      className={`group grid grid-cols-1 gap-8 border-b border-gray-100 pb-12 md:grid-cols-12 md:gap-12 ${
        reversed ? 'md:[&>*:first-child]:order-2' : ''
      } ${isLive ? 'cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--teal)]' : ''}`}
    >
      <div className="md:col-span-5">
        <div className="relative overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="block w-full transition duration-700 group-hover:scale-[1.03]"
          />
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
        <span
          className={`mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.22em] ${
            isLive ? 'text-[var(--ink)]' : 'text-gray-400'
          }`}
        >
          <span className={`inline-block h-px w-6 ${isLive ? 'bg-[var(--ember)]' : 'bg-gray-300'}`} />
          {isLive ? 'Read the post' : 'Coming soon'}
          {isLive ? <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.6} /> : null}
        </span>
      </div>
    </article>
  )
}

type JournalPostContent = {
  eyebrow: string
  heroImage: string
  heroAlt: string
  heroCaption: string
  sidebarOneLine: string
  sidebarStats: { label: string; value: string }[]
  sections: { heading: string; body: string[] }[]
  numberedListHeading: string
  numberedList: { label: string; body: string }[]
  closingHeading: string
  closingBody: string[]
}

const JOURNAL_POSTS: Record<string, JournalPostContent> = {
  'ai-tool-stack': {
    eyebrow: 'Studio note · Automation',
    heroImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Cable patch panel — many connections, one routing surface',
    heroCaption: 'Many lines in. One workspace.',
    sidebarOneLine:
      'Tools stop being a tax when the workspace stops carrying everything it owns at once.',
    sidebarStats: [
      { label: 'Reply time', value: '5s → <1s' },
      { label: 'Running cost', value: '−70%' },
      { label: 'Tools wired in', value: '20 → 30' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'Twenty-plus AI tools all driven from one workspace. Notion for docs, Figma for design, Vercel for deploys, Gmail and Calendar for inbox and scheduling, Slack for chat, Stripe for invoicing, Canva for visuals, HubSpot for client records, plus a handful of research and writing helpers.',
          'All connected by default. All loaded at the start of every conversation. The number kept climbing as new client work demanded new tools.',
        ],
      },
      {
        heading: 'Where it broke',
        body: [
          'First sign was speed. Five seconds before any reply where it used to be one.',
          'Second sign was focus. A two-line request dragged in tools for video editing, database work, and PDF parsing — none of which had anything to do with the task at hand.',
          'Third sign was cost. The running bill tripled in a month with no extra output to show for it.',
        ],
      },
      {
        heading: 'Cut nothing, calm everything',
        body: [
          'The first instinct is to start removing tools. That instinct is wrong. Every tool earns its place on a specific job. Removing Stripe protects the chat experience on a Monday and breaks invoice reconciliation on a Friday.',
          'The bottleneck was never the number of tools. It was the assumption that every tool needed to be awake at the start of every turn.',
        ],
      },
      {
        heading: 'The pattern that fixed it',
        body: [
          'Three moves changed the shape of the workspace.',
          'One — keep tools asleep until needed. Show the workspace what tools exist, not how each one works. Load the full instructions only when a tool is genuinely called on.',
          'Two — group by job. Sales tools together. Operations tools together. Marketing tools together. Wake the group that matches the work; keep the others quiet.',
          'Three — keep credentials in one place. Logins and keys live in a single secure file outside any project. Nothing leaks into shared work. Rotating a password is one edit.',
        ],
      },
      {
        heading: 'The result',
        body: [
          'Reply time dropped from five seconds to under one.',
          'Running cost per conversation fell roughly seventy percent.',
          'New tools wire in without slowing anything already connected. The stack grew from twenty to thirty in a quarter without a single regression in response speed.',
        ],
      },
      {
        heading: 'Why it matters for a business',
        body: [
          'Most small operators hit the same wall around their tenth tool. Stripe plus HubSpot plus Calendar plus Slack plus Asana plus Drive, plus whatever the team adopts next. Load it all, hope for the best — that works at five tools and falls apart at fifteen.',
          'The pattern transfers directly.',
        ],
      },
    ],
    numberedListHeading: 'Four moves for a small operator',
    numberedList: [
      {
        label: 'Inventory first',
        body: 'List every tool actually used in the last thirty days. Cut anything below the threshold of real use.',
      },
      {
        label: 'Group by job',
        body: 'Sales tools together. Operations tools together. Marketing tools together. Switch contexts deliberately; do not blend them.',
      },
      {
        label: 'Load on demand',
        body: 'Connect the tool, but keep the heavy parts asleep until a workflow asks for them. The wallet pays for active work, not idle capability.',
      },
      {
        label: 'Centralise logins',
        body: 'One source of truth for every credential. One process to rotate. One file to audit. Shared docs reference the tool name, never the password itself.',
      },
    ],
    closingHeading: 'What changed in the studio',
    closingBody: [
      'The studio runs more AI tools now than it did six months ago. The workspace feels lighter. New tools get added on a Tuesday afternoon and are in real use by Wednesday. Cost is predictable. Speed is consistent.',
      'Tooling stops being a tax when the workspace stops carrying everything it owns at once.',
    ],
  },
  'excalidraw-process-maps': {
    eyebrow: 'Studio practice · Visual thinking',
    heroImage: '/excalidraw-diagram.png',
    heroAlt: 'Excalidraw process diagram — hand-drawn boxes and arrows mapping the flow step by step',
    heroCaption: 'Ask the AI to draw it. Read the picture before trusting the answer.',
    sidebarOneLine: 'Prompt the AI for an Excalidraw flow. Jargon turns into a step-by-step picture.',
    sidebarStats: [
      { label: 'Time to understand', value: '−80%' },
      { label: 'Jargon words decoded', value: '0 → 12' },
      { label: 'Diagram per feature', value: '1' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'AI answers in paragraphs. Paragraphs hide the steps. Paragraphs hide the wiring.',
          'Asking for an Excalidraw-style diagram flips the answer from prose into a hand-drawn flow. Inputs, decisions, side effects — all visible at once.',
        ],
      },
      {
        heading: 'The prompt',
        body: [
          'Same shape every time. "Draw this as an Excalidraw flow. Inputs at the top, outputs at the bottom, one box per step. Label every arrow. Mark side effects with a dashed line."',
          'The diagram comes back as plain text the AI can render, copy into Excalidraw, or sketch in a few seconds. No proprietary tool. No design skill needed.',
        ],
      },
      {
        heading: 'What it does to jargon',
        body: [
          'A term like "retrieval-augmented generation" stays opaque in a paragraph. The same term in a diagram becomes three boxes: question in, lookup, answer out.',
          'Every label on the diagram is a piece of jargon translated into a verb or a noun the eye can hold. The diagram is the glossary.',
        ],
      },
      {
        heading: 'Under the hood, visible',
        body: [
          'The diagram shows where the AI is guessing and where it is reading. Where the data enters. Where the model decides. Where the answer leaves.',
          'Once the flow is on screen, the next question writes itself — which step is wrong, which step is missing, which step costs money.',
        ],
      },
      {
        heading: 'Why hand-drawn',
        body: [
          'Excalidraw looks rough on purpose. Rough means "this is a sketch, argue with it" instead of "this is final, accept it".',
          'A polished diagram invites passive reading. A hand-drawn diagram invites editing — by the human, by the next AI prompt, by the next version of the feature.',
        ],
      },
    ],
    numberedListHeading: 'Four rules for asking AI to draw the process',
    numberedList: [
      {
        label: 'One diagram per question',
        body: 'Ask for a single flow per concept. If two flows are needed, the concept has not been split yet.',
      },
      {
        label: 'Shape, not syntax',
        body: 'Boxes for steps. Arrows for direction. Dashed lines for side effects. No code, no acronyms left undefined.',
      },
      {
        label: 'Label every arrow',
        body: 'An unlabelled arrow hides the work. The label is where the jargon gets translated into plain English.',
      },
      {
        label: 'Sketch first, polish never',
        body: 'Keep the Excalidraw look. Rough beats final, because rough invites the next correction.',
      },
    ],
    closingHeading: 'What changed in the studio',
    closingBody: [
      'Every AI feature now ships with an Excalidraw flow next to the code. Clients read the picture, not the paragraph. New tools get understood in one glance instead of one afternoon.',
      'The diagram is not a sketch about the work. The diagram is the work, drawn first.',
    ],
  },
  'thirty-day-rule-systems-teach-themselves': {
    eyebrow: 'Studio practice · Documentation',
    heroImage: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'A workbench of notes and sketches mapping out a system',
    heroCaption: 'Future-you is a stranger. Build for the stranger.',
    sidebarOneLine: 'Future-you is a stranger to current-you. Ship for the stranger.',
    sidebarStats: [
      { label: 'Re-grok time', value: '30s' },
      { label: 'Views per feature', value: '4' },
      { label: 'Memory half-life', value: '~30 days' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'Every studio system gets revisited. Some after a week. Some after six months. Memory of why it works that way decays fast.',
          'The 30-day rule: assume future-you forgets how this feature works inside a month. Design it now for that future stranger.',
        ],
      },
      {
        heading: 'Why thirty days',
        body: [
          'A month is the rough half-life of "I just built this." Beyond it, the wiring reads as foreign. Variable names that felt obvious turn into puzzle pieces.',
          'Documentation written for current-you is wasted. Documentation written for the stranger is the only kind that survives.',
        ],
      },
      {
        heading: 'The four views',
        body: [
          'Every shipped feature carries surface, flow, architecture, and a plain-English line. Skip one and the feature stops teaching itself.',
          'Four views is the floor, not the ceiling. The point is that none of them are optional.',
        ],
      },
      {
        heading: 'What each view does',
        body: [
          'Surface view: a screenshot of where the feature lives in the product. What the user sees. Where the click lands.',
          'Flow view: a diagram of inputs to outputs. Trigger on the left, result on the right. Drawn, not described.',
          'Architecture view: which files, which services, which keys, which routes. A map of the wiring.',
          'Plain-English line: one paragraph a non-developer could read. No jargon, no framework names, no acronyms.',
        ],
      },
      {
        heading: 'What it costs to skip',
        body: [
          'Skipping the four views means re-onboarding to your own code every revisit. A two-minute fix becomes a forty-minute archaeology dig.',
          'Worse for contractors and collaborators. They see only the code. The why is locked in a head that has already forgotten.',
        ],
      },
      {
        heading: 'What it pays back',
        body: [
          'Future-you opens the file, reads the four views, ships the fix in minutes.',
          'A contractor joining for a single task gets onboarded by the file itself.',
          'A client asking "what does this do?" gets the plain-English line, not a meeting.',
        ],
      },
    ],
    numberedListHeading: 'Four views, every shipped feature',
    numberedList: [
      {
        label: 'Surface view first',
        body: 'Screenshot the live feature where it lives. No abstract mockup. No reconstruction. The actual pixels the user sees on the actual screen.',
      },
      {
        label: 'Flow view next',
        body: 'A diagram, not a paragraph. Inputs on the left, outputs on the right. Hand-drawn or Excalidraw — anything that shows the steps as shapes.',
      },
      {
        label: 'Architecture map',
        body: 'Name the files, services, keys, and routes. Where the wiring lives. A future stranger should find the moving parts inside thirty seconds.',
      },
      {
        label: 'Plain-English line',
        body: 'One paragraph a thirteen-year-old could follow. What it does. Why it exists. What goes in. What comes out. No framework names.',
      },
    ],
    closingHeading: 'What changed in the studio',
    closingBody: [
      'Every dashboard tile, every skill, every command now ships with the four views. Re-onboarding cost dropped from forty minutes to thirty seconds.',
      'Features stopped being knowledge that lives in one head. They became artefacts that teach themselves on every read.',
    ],
  },
  'ai-thought-partner': {
    eyebrow: 'Studio practice · Working with AI',
    heroImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'Sticky notes and arrows mapping a process flow on a wall',
    heroCaption: 'A flow diagram falls out of a one-hour chat.',
    sidebarOneLine: 'One hour of pre-build chat replaces a week of mid-build rework.',
    sidebarStats: [
      { label: 'Pre-build chat', value: '~1 hour' },
      { label: 'Rework avoided', value: '~1 week per project' },
      { label: 'Productivity multiplier', value: '10x' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'An idea lands. Old habit was to open Figma, sketch screens, start building. Momentum felt productive.',
          'Three days in, an assumption no one had questioned would surface. The build would unwind. The week would reset.',
        ],
      },
      {
        heading: 'What changed',
        body: [
          'Now nothing gets built until the idea has been walked through a chat with an AI partner first.',
          'Goal in plain language. Inputs. Outputs. Edge cases. Who touches it. What happens when it fails.',
          'The AI does not agree. It questions every assumption, points at gaps in the logic, asks what was deliberately left out.',
        ],
      },
      {
        heading: 'What surfaces',
        body: [
          'Bottlenecks become visible in twenty minutes that would have taken three days of building to hit.',
          'Hidden assumptions get named. The thing that was "obvious" turns out to be a choice — one of several — and the choice gets made consciously.',
          'A process-flow diagram falls out of the conversation. By the end of the chat, the build is already half-designed.',
        ],
      },
      {
        heading: 'Why this is ten times faster',
        body: [
          'A week of building to discover a bad assumption costs a week. A one-hour chat to discover the same assumption costs an hour.',
          'The chat is the cheap end of the build. Mistakes made in conversation are free. Mistakes made in code are not.',
        ],
      },
      {
        heading: 'What the AI is not',
        body: [
          'Not the decision-maker. Not the designer. Not the strategist.',
          'The AI is a partner that asks the question the room has stopped asking. Its value is in the friction, not the agreement.',
        ],
      },
    ],
    numberedListHeading: 'Four moves for using AI as a thought partner',
    numberedList: [
      {
        label: 'State the goal in plain language',
        body: 'No jargon, no framework names. If the goal cannot survive plain language, it is not ready to build.',
      },
      {
        label: 'Force step-by-step reasoning',
        body: 'Ask the AI to walk the flow forward, one step at a time. The gaps appear in the seams between steps.',
      },
      {
        label: 'Ask "what could break this?"',
        body: 'The most useful prompt. The AI surfaces the failure modes that confirmation bias has been hiding.',
      },
      {
        label: 'Save the flow diagram before any code',
        body: 'The output of the chat is a process-flow diagram. That diagram is the spec. Coding starts from it, not before it.',
      },
    ],
    closingHeading: 'What changed in the studio',
    closingBody: [
      'Build time dropped by an order of magnitude. The same week now ships what used to take a month.',
      'Confidence going into a build is higher because the bad versions of the idea were already killed in conversation.',
    ],
  },
  'first-email-that-actually-sent': {
    eyebrow: 'Automation · Build log',
    heroImage: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'A terminal window open on a laptop, mid-script',
    heroCaption: 'Slower path. Louder lesson.',
    sidebarOneLine: 'Two paths to the same inbox. One felt like magic. The other taught the studio how the magic actually works.',
    sidebarStats: [
      { label: 'Time to first send', value: '6 days' },
      { label: 'Monthly cost', value: '$14' },
      { label: 'First recipients', value: '1 — myself' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'The studio wanted its own mail. Welcome sequences. A newsletter that readers actually open. Nothing rented from Mailchimp or Substack — something the studio owned end to end.',
          'Two paths sat open. Path one: stay inside a chatbot, ask for the wiring, paste config files, hope. Path two: open a terminal, read the docs, glue free APIs together with a small script.',
        ],
      },
      {
        heading: 'Path one — the prompt route',
        body: [
          'Faster start. Cleaner output. The chatbot named the variables, generated the YAML, even wrote a polite README.',
          'Seventy percent of the build landed in an afternoon. The last thirty percent stayed stuck. Errors came back as suggestions the chatbot had not seen before — and the patch-and-pray loop took longer than reading the docs would have.',
        ],
      },
      {
        heading: 'Path two — the terminal route',
        body: [
          'Slower. A Postmark trial. A cron job. A shell script that read a markdown file and sent it. Fourteen dollars a month. Every error message read in full.',
          'Painful for the first three days. Worth it on the fourth — the moment a misfire surfaced a typo in the env file instead of a black-box failure.',
        ],
      },
      {
        heading: 'The moment it landed',
        body: [
          'The first test mail arrived in the inbox on day six. Subject line spelled wrong. Footer link broken. Body copy rendered cleanly.',
          'Hard to overstate the feeling. A piece of software built by hand sat in an inbox addressed by name. The studio owned the pipe end to end. Cheap, ugly, working.',
        ],
      },
      {
        heading: 'What the prompts taught',
        body: [
          'Speed. Scaffolding. Naming things well. The prompt route was the fastest way from blank page to working draft.',
          'For greenfield wiring with no prior knowledge, prompts beat docs-reading every time. The first version exists in minutes, not hours.',
        ],
      },
      {
        heading: 'What the terminal taught',
        body: [
          'Failure modes. Environment variables. What a queue actually is. Why retries matter. What a bounced email costs in sender reputation.',
          'The terminal route forced understanding of every line. The prompt route quietly skipped the parts that did not break — until they broke later, in production, with no chatbot in the loop.',
        ],
      },
    ],
    numberedListHeading: 'Four things the terminal route gave that the prompt route did not',
    numberedList: [
      {
        label: 'A real error message',
        body: 'An exit code. A stack trace. A line number. Something to grep — not something to paraphrase back to a chatbot and hope.',
      },
      {
        label: 'A repeatable run',
        body: 'The same command, the same output, every time. No drift between sessions. No chatbot reinventing the script halfway through a conversation.',
      },
      {
        label: 'A bill that made sense',
        body: 'Postmark pricing per thousand. A cron job at zero. The studio could see exactly where each dollar of automation went — and where it was being wasted.',
      },
      {
        label: 'A system explainable in one sentence',
        body: 'Markdown file in. Postmark API out. Cron triggers the send. Three pieces. Future-Stephen reads it once and gets it in thirty seconds — the 30-day rule applied to automations.',
      },
    ],
    closingHeading: 'What the studio uses now',
    closingBody: [
      'Hybrid. Prompts to scaffold the first draft of a new automation. Terminal to verify, debug, and ship. Both required. Neither sufficient alone.',
      'Every new automation now starts the same way: ask the chatbot to draft, run it in a terminal, break it on purpose, fix what breaks, and only then trust it with a real send.',
      'The first email that actually sent was the cheapest tuition the studio has paid.',
    ],
  },
  'service-pages-need-proof-of-concept': {
    eyebrow: 'Web design · Conversion',
    heroImage: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1600&q=80',
    heroAlt: 'A small interactive tool rendered on a laptop screen',
    heroCaption: 'A bullet list explains. A live tool demonstrates.',
    sidebarOneLine: 'A bullet list explains. A live tool demonstrates.',
    sidebarStats: [
      { label: 'Time on page', value: '+2.1x' },
      { label: 'Form completes', value: '+64%' },
      { label: 'Build time per POC', value: '~6 hours' },
    ],
    sections: [
      {
        heading: 'The setup',
        body: [
          'A service page lists what a studio can do. Discovery. Strategy. Design. Build. Iteration.',
          'Every service business has the same bullet list. The reader does not learn anything from it.',
        ],
      },
      {
        heading: 'Where the bullet list breaks',
        body: [
          'A list is a claim. A claim is only useful if the reader already trusts the source.',
          'Most visitors arrive without trust. They arrived from a search, a referral, or a piece of content. The bullet list reads as advertising. They scroll past it.',
        ],
      },
      {
        heading: 'The proof-of-concept rule',
        body: [
          'Every service page carries one live tool that demonstrates the capability the page describes.',
          'A strategy page hosts a small framework the visitor can use right now. A design page hosts a real interactive demo of an interaction pattern. A build page hosts a live diagnostic tool that returns a useful answer in under a minute.',
        ],
      },
      {
        heading: 'What makes the tool work',
        body: [
          'It has to return value before the visitor commits to anything. No email gate. No signup. No "results sent to your inbox."',
          'The studio capability is on display while the tool runs. The reader sees the work, not a description of the work.',
        ],
      },
      {
        heading: 'What the tool is not',
        body: [
          'Not a calculator that returns a generic number. Not a quiz that profiles the buyer. Not a chatbot routing to a sales rep.',
          'A real proof of concept solves a small slice of the problem the visitor came in with. The slice has to be honest — small enough to give away, useful enough to be remembered.',
        ],
      },
    ],
    numberedListHeading: 'Four moves for the page',
    numberedList: [
      {
        label: 'One tool per service',
        body: 'Each service page hosts one POC, not three. More tools dilute attention; one tool gets remembered.',
      },
      {
        label: 'No gate, no friction',
        body: 'The tool runs the moment the page loads or the moment the visitor clicks once. Any extra step kills the proof.',
      },
      {
        label: 'Scope it to six hours',
        body: 'A POC that takes a week to build will not be maintained. A six-hour POC stays useful and gets refreshed without resentment.',
      },
      {
        label: 'Show the working',
        body: 'After the tool runs, a short note explains how the answer was reached. Transparency converts; magic does not.',
      },
    ],
    closingHeading: 'What changed in the studio',
    closingBody: [
      'Service pages stopped reading like brochures. Visitors arrive, run the tool, and either book a call already convinced or leave with something useful in hand.',
      'A page that proves the capability outperforms a page that lists it — every time.',
    ],
  },
}

function JournalPostPage({ slug, navigate }: { slug: string; navigate: (to: RoutePath) => void }) {
  const post = BLOG_POSTS.find((entry) => entry.slug === slug)
  const content = JOURNAL_POSTS[slug]

  if (!post || !content) {
    return null
  }

  return (
    <>
      <section className="grain-overlay relative bg-[#EFEFEF] pb-14 pt-10 sm:pb-16 lg:pb-24 lg:pt-14">
        <div className="mx-auto max-w-[1080px] px-5 sm:px-8 lg:px-12">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-600 transition hover:text-[var(--ink)]"
          >
            <span aria-hidden className="inline-block h-px w-6 bg-gray-400" />
            Back to journal
          </button>
          <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-700">
            <span className="inline-block h-px w-8 bg-[var(--teal)]" />
            <span>{content.eyebrow}</span>
          </div>
          <h1 className="mt-6 max-w-[920px] font-display text-[clamp(2rem,5.4vw,3.6rem)] font-medium leading-[1.06] tracking-editorial text-gray-900">
            {post.title}.
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
            <span>{formatBlogDate(post.date)}</span>
            <span aria-hidden className="h-px w-6 bg-gray-300" />
            <span>{post.readTime}</span>
            <span aria-hidden className="h-px w-6 bg-gray-300" />
            <span>Stephen Mantle</span>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1080px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <figure className="mb-12 sm:mb-16">
            <div className="overflow-hidden rounded-3xl bg-gray-100">
              <img
                src={content.heroImage}
                alt={content.heroAlt}
                className="block w-full"
                loading="lazy"
              />
            </div>
            <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
              {content.heroCaption}
            </figcaption>
          </figure>

          <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
            <aside className="md:col-span-4 md:pt-2">
              <div className="sticky top-24 rounded-2xl border border-gray-200 bg-[#FAF8F5] p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  In one line
                </p>
                <p className="mt-4 font-display text-xl leading-snug tracking-editorial text-[var(--ink)]">
                  {content.sidebarOneLine}
                </p>
                <dl className="mt-6 space-y-3 font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
                  {content.sidebarStats.map((stat) => (
                    <div key={stat.label} className="flex justify-between gap-4">
                      <dt>{stat.label}</dt>
                      <dd className="text-[var(--ink)]">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>

            <article className="md:col-span-8">
              <div className="space-y-12">
                {content.sections.map((section) => (
                  <section key={section.heading}>
                    <h2 className="font-display text-2xl leading-tight tracking-editorial text-[var(--ink)] sm:text-3xl">
                      {section.heading}
                    </h2>
                    <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-gray-700 sm:text-[16px]">
                      {section.body.map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))}
                    </div>
                  </section>
                ))}

                <section>
                  <h2 className="font-display text-2xl leading-tight tracking-editorial text-[var(--ink)] sm:text-3xl">
                    {content.numberedListHeading}
                  </h2>
                  <ol className="mt-6 space-y-5">
                    {content.numberedList.map((step, index) => (
                      <li
                        key={step.label}
                        className="grid grid-cols-[auto_1fr] gap-5 rounded-2xl border border-gray-200 bg-white p-5"
                      >
                        <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-gray-500">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div>
                          <p className="font-display text-lg tracking-editorial text-[var(--ink)]">
                            {step.label}
                          </p>
                          <p className="mt-2 text-[14px] leading-[1.7] text-gray-600 sm:text-[15px]">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>

                <section>
                  <h2 className="font-display text-2xl leading-tight tracking-editorial text-[var(--ink)] sm:text-3xl">
                    {content.closingHeading}
                  </h2>
                  <div className="mt-5 space-y-4 text-[15px] leading-[1.75] text-gray-700 sm:text-[16px]">
                    {content.closingBody.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </section>
              </div>
            </article>
          </div>
        </div>
      </section>
    </>
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
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <svg viewBox="0 0 240 250" className="h-7 w-7" aria-label="Stephen Mantle" role="img">
                  <text x="120" y="104" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#1E1E1E">S</text>
                  <line x1="75" y1="132" x2="165" y2="132" stroke="#2A7D6E" strokeWidth="6" />
                  <text x="120" y="222" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#1E1E1E">M</text>
                </svg>
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2A7D6E] sm:h-10 sm:w-10">
            <svg viewBox="0 0 240 250" className="h-6 w-6 sm:h-7 sm:w-7" aria-label="Stephen Mantle" role="img">
              <text x="120" y="104" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#FAFAF8">S</text>
              <line x1="75" y1="132" x2="165" y2="132" stroke="#FAFAF8" strokeWidth="6" />
              <text x="120" y="222" fontSize="118" textAnchor="middle" fontFamily="'Libre Baskerville', serif" fill="#FAFAF8">M</text>
            </svg>
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
          className="h-full rounded-full bg-[#2A7D6E] transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]"
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
