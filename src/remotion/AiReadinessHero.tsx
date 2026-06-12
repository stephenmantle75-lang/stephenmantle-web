import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const CREAM = '#FAF8F5'
const CANVAS = '#1E1E1E'
const PANEL = 'rgba(250, 248, 245, 0.08)'
const PANEL_STRONG = 'rgba(250, 248, 245, 0.14)'
const TEAL = '#2A7D6E'
const ORANGE = '#F26522'
const MUTED = 'rgba(250, 248, 245, 0.62)'
const LINE = 'rgba(42, 125, 110, 0.76)'

const workCards = [
  { label: 'Inbox', sub: 'enquiries, quotes, follow-ups', x: 82, y: 248 },
  { label: 'Bookings', sub: 'calendar, reminders, no-shows', x: 502, y: 214 },
  { label: 'Spreadsheets', sub: 'invoices, suppliers, jobs done', x: 898, y: 258 },
  { label: 'Content', sub: 'ideas, drafts, publishing', x: 180, y: 462 },
  { label: 'Notes', sub: 'decisions, context, tasks', x: 802, y: 452 },
]

const diagnostics = [
  { label: 'Workflow', value: 82 },
  { label: 'Data', value: 68 },
  { label: 'Trust', value: 74 },
  { label: 'Urgency', value: 80 },
]

const systemCards = [
  { label: 'Inbox triage', x: 104, y: 220 },
  { label: 'Booking reminders', x: 470, y: 202 },
  { label: 'Dashboard view', x: 836, y: 220 },
  { label: 'Content pipeline', x: 470, y: 480 },
]

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

function sceneProgress(frame: number, start: number, end: number) {
  return clamp((frame - start) / (end - start))
}

function fade(frame: number, start: number, end: number) {
  return interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })
}

function ease(value: number) {
  return Easing.bezier(0.22, 1, 0.36, 1)(clamp(value))
}

export const AiReadinessHero = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()
  const intro = spring({ frame, fps, config: { damping: 22, stiffness: 105 } })
  const settle = sceneProgress(frame, 390, 540)
  const final = sceneProgress(frame, 690, 820)

  return (
    <AbsoluteFill
      style={{
        background: CANVAS,
        color: CREAM,
        fontFamily: 'Manrope, ui-sans-serif, system-ui, sans-serif',
        overflow: 'hidden',
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 18% 18%, rgba(242,101,34,0.20), transparent 24%), radial-gradient(circle at 82% 72%, rgba(42,125,110,0.34), transparent 28%), linear-gradient(145deg, rgba(255,255,255,0.04), transparent 45%)',
        }}
      />
      <Noise />

      <div
        style={{
          position: 'absolute',
          inset: 34,
          borderRadius: 28,
          border: '1px solid rgba(250,248,245,0.10)',
          overflow: 'hidden',
          transform: `scale(${0.98 + intro * 0.02})`,
          opacity: intro,
        }}
      >
        <Timeline frame={frame} />
        <ScatteredWork frame={frame} />
        <TangledLines frame={frame} />
        <DiagnosticPanel frame={frame} />
        <ConnectedSystem frame={frame} settle={settle} />
        <OutcomePanel frame={frame} />
        <FinalCta frame={frame} final={final} />
      </div>
    </AbsoluteFill>
  )
}

const Noise = () => (
  <AbsoluteFill
    style={{
      opacity: 0.16,
      backgroundImage:
        'radial-gradient(circle at 1px 1px, rgba(250,248,245,0.25) 1px, transparent 0)',
      backgroundSize: '18px 18px',
      mixBlendMode: 'overlay',
    }}
  />
)

const Timeline = ({ frame }: { frame: number }) => {
  const progress = interpolate(frame, [0, 840], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 42,
          top: 34,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: 12,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: MUTED,
        }}
      >
        <span style={{ width: 28, height: 1, background: TEAL }} />
        Stephen Mantle / AI readiness
      </div>
      <div
        style={{
          position: 'absolute',
          left: 42,
          right: 42,
          bottom: 32,
          height: 2,
          background: 'rgba(250,248,245,0.12)',
        }}
      >
        <div
          style={{
            width: `${progress * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, ${TEAL}, ${ORANGE})`,
          }}
        />
      </div>
    </>
  )
}

const Headline = ({
  children,
  opacity,
  y = 0,
  size = 52,
}: {
  children: string
  opacity: number
  y?: number
  size?: number
}) => (
  <div
    style={{
      position: 'absolute',
      left: 58,
      top: 86 + y,
      width: 690,
      fontFamily: '"Fraunces", Georgia, serif',
      fontSize: size,
      lineHeight: 1.04,
      letterSpacing: '-0.045em',
      opacity,
      transform: `translateY(${(1 - opacity) * 22}px)`,
    }}
  >
    {children}
  </div>
)

const ScatteredWork = ({ frame }: { frame: number }) => {
  const opacity = fade(frame, 0, 250)
  const questionOpacity = fade(frame, 0, 142)
  const warningOpacity = fade(frame, 118, 270)
  const drift = ease(sceneProgress(frame, 120, 240))

  return (
    <>
      <Headline opacity={questionOpacity}>Are you ready for AI?</Headline>
      <Headline opacity={warningOpacity} y={2} size={43}>
        AI does not fix messy operations. It speeds them up.
      </Headline>
      {workCards.map((card, index) => {
        const enter = ease(sceneProgress(frame, 18 + index * 8, 62 + index * 8))
        const dx = (index % 2 === 0 ? -1 : 1) * drift * (34 + index * 8)
        const dy = (index % 2 === 0 ? 1 : -1) * drift * (18 + index * 6)

        return (
          <div
            key={card.label}
            style={{
              position: 'absolute',
              left: card.x + dx,
              top: card.y + dy,
              width: 270,
              padding: '24px 26px',
              borderRadius: 18,
              border: '1.4px solid rgba(250,248,245,0.72)',
              background: PANEL,
              opacity: opacity * enter,
              transform: `scale(${0.94 + enter * 0.06})`,
            }}
          >
            <div style={{ fontSize: 25, fontWeight: 600 }}>{card.label}</div>
            <div style={{ marginTop: 12, fontSize: 15, color: MUTED }}>{card.sub}</div>
          </div>
        )
      })}
    </>
  )
}

const TangledLines = ({ frame }: { frame: number }) => {
  const opacity = fade(frame, 90, 285)
  const draw = ease(sceneProgress(frame, 118, 210))

  return (
    <svg
      viewBox="0 0 1280 720"
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
      }}
    >
      {[
        'M235 246 C420 320 536 215 644 340 C762 480 914 255 1050 276',
        'M330 500 C490 350 560 520 706 392 C844 275 882 445 980 474',
        'M630 214 C550 320 690 420 604 520',
      ].map((d, index) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={index === 1 ? ORANGE : LINE}
          strokeWidth="2"
          strokeDasharray="8 12"
          strokeDashoffset={(1 - draw) * 460}
        />
      ))}
    </svg>
  )
}

const DiagnosticPanel = ({ frame }: { frame: number }) => {
  const opacity = fade(frame, 240, 430)
  const panel = ease(sceneProgress(frame, 250, 318))
  const fill = ease(sceneProgress(frame, 284, 382))

  return (
    <Sequence from={230}>
      <div
        style={{
          position: 'absolute',
          right: 92,
          top: 126,
          width: 448,
          padding: 30,
          borderRadius: 24,
          background: 'rgba(250,248,245,0.94)',
          color: '#111827',
          boxShadow: '0 28px 90px rgba(0,0,0,0.32)',
          opacity,
          transform: `translateY(${(1 - panel) * 26}px) scale(${0.96 + panel * 0.04})`,
        }}
      >
        <div style={{ fontSize: 12, letterSpacing: '0.24em', textTransform: 'uppercase', color: '#6b7280' }}>
          AI Readiness Diagnostic
        </div>
        <div
          style={{
            marginTop: 14,
            fontFamily: '"Fraunces", Georgia, serif',
            fontSize: 34,
            lineHeight: 1.04,
            letterSpacing: '-0.04em',
          }}
        >
          AI needs operating clarity.
        </div>
        <div style={{ display: 'grid', gap: 16, marginTop: 28 }}>
          {diagnostics.map((item, index) => (
            <div key={item.label}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: 13,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: '#374151',
                }}
              >
                <span>{item.label}</span>
                <span>{Math.round(item.value * fill)}</span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 8,
                  borderRadius: 999,
                  background: '#e5e7eb',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${item.value * fill}%`,
                    height: '100%',
                    borderRadius: 999,
                    background: index === 1 ? TEAL : ORANGE,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sequence>
  )
}

const ConnectedSystem = ({ frame, settle }: { frame: number; settle: number }) => {
  const opacity = fade(frame, 390, 690)
  const draw = ease(sceneProgress(frame, 410, 520))
  const cardIn = ease(sceneProgress(frame, 390, 472))

  return (
    <>
      <Headline opacity={fade(frame, 392, 566)} y={0} size={44}>
        Then automation can remove the admin.
      </Headline>
      <svg
        viewBox="0 0 1280 720"
        style={{
          position: 'absolute',
          inset: 0,
          opacity,
        }}
      >
        <defs>
          <marker id="ai-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 L10 5 L0 10 Z" fill={TEAL} />
          </marker>
        </defs>
        {systemCards.map((card) => (
          <path
            key={card.label}
            d={`M${card.x + 140} ${card.y + 60} L640 352`}
            stroke={LINE}
            strokeWidth="2.2"
            fill="none"
            markerEnd="url(#ai-arrow)"
            strokeDasharray="480"
            strokeDashoffset={(1 - draw) * 480}
          />
        ))}
      </svg>
      {systemCards.map((card, index) => (
        <div
          key={card.label}
          style={{
            position: 'absolute',
            left: card.x,
            top: card.y,
            width: 280,
            padding: '22px 24px',
            borderRadius: 18,
            border: '1px solid rgba(250,248,245,0.46)',
            background: PANEL,
            opacity: opacity * cardIn,
            transform: `translateY(${(1 - cardIn) * 20}px)`,
          }}
        >
          <div style={{ color: index === 2 ? ORANGE : TEAL, fontSize: 13, fontWeight: 700 }}>0{index + 1}</div>
          <div style={{ marginTop: 10, fontSize: 22, fontWeight: 600 }}>{card.label}</div>
        </div>
      ))}
      <div
        style={{
          position: 'absolute',
          left: 462,
          top: 336,
          width: 356,
          padding: '30px 28px',
          borderRadius: 22,
          background: TEAL,
          boxShadow: `0 0 ${34 + settle * 28}px rgba(42,125,110,0.38)`,
          opacity,
          transform: `scale(${0.94 + ease(sceneProgress(frame, 450, 520)) * 0.06})`,
        }}
      >
        <div style={{ fontSize: 27, fontWeight: 700 }}>One system</div>
        <div style={{ marginTop: 12, fontSize: 16, color: 'rgba(250,248,245,0.86)', lineHeight: 1.45 }}>
          Inbox, bookings, spreadsheets and content working from the same operating picture.
        </div>
      </div>
    </>
  )
}

const OutcomePanel = ({ frame }: { frame: number }) => {
  const opacity = fade(frame, 540, 735)
  const leak = ease(sceneProgress(frame, 575, 665))

  return (
    <>
      <Headline opacity={fade(frame, 548, 704)} y={6} size={46}>
        Hours back. Fewer dropped balls. Clearer decisions.
      </Headline>
      <div
        style={{
          position: 'absolute',
          left: 300,
          top: 252,
          width: 680,
          padding: 34,
          borderRadius: 26,
          background: 'rgba(250,248,245,0.94)',
          color: '#111827',
          opacity,
          boxShadow: '0 28px 100px rgba(0,0,0,0.34)',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 18 }}>
          {['Admin saved', 'Lead leaks closed', 'Next action clear'].map((label, index) => (
            <div key={label} style={{ borderRadius: 18, background: '#f3f4f6', padding: 20 }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: index === 1 ? ORANGE : TEAL }}>
                {['6h', `${Math.round(leak * 7)}/7`, 'Now'][index]}
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: '#4b5563' }}>{label}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

const FinalCta = ({ frame, final }: { frame: number; final: number }) => {
  const opacity = fade(frame, 690, 840)
  const title = fade(frame, 700, 840)

  return (
    <>
      <Headline opacity={title} y={2} size={50}>
        Start with the AI Readiness Check.
      </Headline>
      <div
        style={{
          position: 'absolute',
          left: 58,
          top: 300,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 18,
          padding: '18px 24px 18px 28px',
          borderRadius: 999,
          background: ORANGE,
          color: 'white',
          fontSize: 20,
          fontWeight: 700,
          opacity,
          transform: `translateY(${(1 - final) * 24}px)`,
          boxShadow: '0 20px 70px rgba(242,101,34,0.28)',
        }}
      >
        Run the diagnostic
        <span
          style={{
            width: 38,
            height: 38,
            borderRadius: 999,
            background: CREAM,
            color: ORANGE,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          →
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 62,
          bottom: 68,
          width: 410,
          color: MUTED,
          fontSize: 18,
          lineHeight: 1.55,
          opacity,
        }}
      >
        Find the first workflow worth fixing before adding another tool.
      </div>
    </>
  )
}
