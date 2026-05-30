import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  Check,
  Clock,
  Menu,
  X,
} from 'lucide-react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'

const CONTACT_HREF = 'mailto:mantsai@zohomail.eu'
const BOOKING_HREF = 'https://mantaai.zohobookings.eu/#/254973000000048054'
const DIAGNOSTIC_WEBHOOK_URL = import.meta.env.VITE_DIAGNOSTIC_WEBHOOK_URL ?? ''
const HOME_ABOUT_IMAGE = '/max-andrey--8-2YWKt8Ag-unsplash.jpg'
const PORTRAIT_IMAGE = '/stephen.png'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
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
    title: 'AI Readiness Check — Stephen Mantle',
    description:
      'Take the AI Readiness Check to identify operational friction, score workflow readiness, and find the safest first system to improve.',
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

const CREATIVE_WORKFLOW_CARDS = [
  {
    id: 'storyboard',
    number: '01',
    title: 'Project Storyboard.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85',
    items: [
      'Map concepts, assets, and delivery steps in one working layer.',
      'Clarify team handoffs before production starts moving.',
      'Keep approvals, notes, and dependencies attached to the project.',
      'Reduce back-and-forth without flattening the creative process.',
    ],
  },
  {
    id: 'critiques',
    number: '02',
    title: 'Smart Critiques.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85',
    items: [
      'Use AI analysis to surface friction, inconsistencies, and missed opportunities.',
      'Turn creative notes into cleaner next actions instead of long feedback loops.',
      'Connect the critique layer to the tools already used to ship the work.',
    ],
  },
  {
    id: 'capsule',
    number: '03',
    title: 'Immersion Capsule.',
    icon: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85',
    items: [
      'Silence low-value notifications during focused work windows.',
      'Layer in ambient cues and soundscapes that support deep execution.',
      'Sync schedules and routines so vision time does not get fragmented.',
    ],
  },
] as const

type RoutePath = '/' | '/about' | '/services'

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

function CreativeWorkflowCard({
  number,
  title,
  icon,
  items,
  isVisible,
  delayIndex,
  onLearnMore,
}: {
  number: string
  title: string
  icon: string
  items: readonly string[]
  isVisible: boolean
  delayIndex: number
  onLearnMore: () => void
}) {
  return (
    <article
      className="flex h-full flex-col rounded-[28px] border border-black/5 bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.05)] sm:p-6"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(18px)',
        transitionProperty: 'transform, opacity',
        transitionDuration: '820ms',
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
        transitionDelay: `${delayIndex * 150}ms`,
      }}
    >
      <img
        src={icon}
        alt=""
        className="h-10 w-10 rounded-xl object-cover sm:h-12 sm:w-12"
      />

      <div className="mt-6">
        <p className="text-[12px] font-semibold tracking-[0.14em] text-gray-400">{number}</p>
        <h3 className="mt-3 text-[20px] font-medium leading-[1.1] tracking-[-0.03em] text-gray-900">
          {title}
        </h3>
      </div>

      <div className="mt-6 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#F26522]" />
            <p className="text-[13px] leading-relaxed text-gray-500 sm:text-[14px]">{item}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <button
          type="button"
          onClick={onLearnMore}
          className="inline-flex items-center gap-2 text-[13px] font-medium text-gray-900 transition-colors duration-300 hover:text-[#F26522]"
        >
          <span>Learn more</span>
          <ArrowRight className="h-4 w-4 -rotate-45 text-[#F26522]" />
        </button>
      </div>
    </article>
  )
}

function CreativeWorkflowSection({
  navigate,
}: {
  navigate: (to: RoutePath) => void
}) {
  const { ref, isInView } = useInViewOnce({ rootMargin: '-100px 0px' })

  return (
    <section className="relative overflow-hidden bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
      <div className="pointer-events-none absolute inset-0 opacity-[0.15]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_rgba(17,24,39,0.22)_1px,_transparent_0)] [background-size:16px_16px]" />
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,_rgba(242,101,34,0.12),_transparent_60%)]" />

      <div ref={ref} className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[880px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-500">
            Creative operations
          </p>
          <div className="mt-5 text-xl font-normal sm:text-2xl md:text-3xl lg:text-4xl">
            <PullUpHeadingLine
              text="Studio-grade workflows for visionary creators."
              className="text-gray-900"
              isVisible={isInView}
              lineIndex={0}
            />
            <PullUpHeadingLine
              text="Built for pure vision. Powered by art."
              className="mt-2 text-gray-500"
              isVisible={isInView}
              lineIndex={1}
            />
          </div>
        </div>

        <div className="mt-10 grid gap-3 sm:gap-2 md:grid-cols-2 md:gap-1 lg:h-[480px] lg:grid-cols-4">
          <article
            className="relative overflow-hidden rounded-[28px] border border-black/5 bg-[#111827] shadow-[0_18px_40px_rgba(0,0,0,0.08)]"
            style={{
              opacity: isInView ? 1 : 0,
              transform: isInView ? 'scale(1) translateY(0px)' : 'scale(0.95) translateY(18px)',
              transitionProperty: 'transform, opacity',
              transitionDuration: '820ms',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transitionDelay: '0ms',
            }}
          >
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,15,23,0.08),rgba(10,15,23,0.7))]" />
            <div className="relative flex h-full items-end p-6 sm:p-7">
              <p className="max-w-[11rem] text-[24px] font-medium leading-[1.04] tracking-[-0.03em] text-[#E1E0CC]">
                Your creative canvas.
              </p>
            </div>
          </article>

          {CREATIVE_WORKFLOW_CARDS.map((card, index) => (
            <CreativeWorkflowCard
              key={card.id}
              number={card.number}
              title={card.title}
              icon={card.icon}
              items={card.items}
              isVisible={isInView}
              delayIndex={index + 1}
              onLearnMore={() => navigate('/services')}
            />
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

  if (
    cleanPath === '/' ||
    cleanPath === '/about' ||
    cleanPath === '/services'
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
          {path === '/services' ? <ServicesPage /> : null}
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

      <CreativeWorkflowSection navigate={navigate} />

      <section className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28">
        <div className="mx-auto max-w-[1440px]">
          <SectionHeader
            number="1"
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

      <FinalCta
        title="If something in the business keeps dragging, that is where the work should start."
        body="You do not need a full specification to begin. If you can describe the friction, that is enough."
        ctaLabel="Book a free intro call"
        href={BOOKING_HREF}
      />
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

function ServicesPage() {
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
    <section className="bg-[#EFEFEF] pb-14 pt-8 sm:pb-16 lg:pb-20">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <p className="text-[13px] leading-[13px] tracking-wide text-gray-900 sm:text-[14px] sm:leading-[14px]">
          {eyebrow}
        </p>
        <h1 className="mt-6 max-w-[1080px] text-[clamp(1.9rem,6vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900">
          {title}
        </h1>
        <p className="mt-6 max-w-[52rem] text-[15px] leading-[1.75] text-gray-700 sm:text-[18px]">
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
        <h2 className="mb-12 max-w-[1020px] text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 sm:mb-16 lg:mb-20">
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
        <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-[#F5F5F5] px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="max-w-[50rem]">
            <p className="text-[18px] font-medium leading-[1.2] tracking-[-0.02em] text-gray-900 sm:text-[22px]">
              {title}
            </p>
            <p className="mt-3 text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
              {body}
            </p>
          </div>

          <RollingButton
            label={ctaLabel}
            href={href}
            className="w-fit bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white"
            arrowCircleClassName="h-7 w-7 bg-white text-gray-900"
            arrowClassName="h-4 w-4"
          />
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
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-[11px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]">
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
      className={`rounded-full border px-3 py-1 text-[12px] font-medium text-gray-900 sm:px-4 sm:py-1.5 sm:text-[13px] ${borderClassName}`}
    >
      {label}
    </span>
  )
}

export default App
