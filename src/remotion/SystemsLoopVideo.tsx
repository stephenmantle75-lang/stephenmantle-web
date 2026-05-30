import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

const BG = '#f4f3ef'
const SURFACE = 'rgba(255,255,255,0.88)'
const SURFACE_SOFT = 'rgba(255,255,255,0.58)'
const BORDER = 'rgba(17,24,39,0.08)'
const TEXT = '#111827'
const MUTED = '#6b7280'
const ORANGE = '#f26522'
const ORANGE_SOFT = 'rgba(242,101,34,0.15)'
const SHADOW = '0 20px 70px rgba(17,24,39,0.08)'

const queueItems = [
  'New enquiry received',
  'Proposal sent',
  'Client onboarding',
  'Inbox triaged',
]

const workflowSteps = [
  'Capture',
  'Route',
  'Follow up',
  'Report',
]

const insightLabels = ['Visibility', 'Response', 'Clarity']

function loop(frame: number, length: number) {
  return (frame % length) / length
}

function pulse(value: number, min: number, max: number) {
  return min + ((Math.sin(value * Math.PI * 2) + 1) / 2) * (max - min)
}

export const SystemsLoopVideo = () => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const intro = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110 },
  })

  const cycle = loop(frame, 360)
  const queueCycle = loop(frame, 120)
  const flowCycle = loop(frame + 24, 180)
  const glowX = interpolate(
    cycle,
    [0, 0.5, 1],
    [180, 920, 180],
    { easing: Easing.inOut(Easing.cubic) },
  )
  const scanIndex = Math.floor(loop(frame, 240) * workflowSteps.length)
  const chartBias = pulse(flowCycle, 0.35, 1)

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: TEXT,
      }}
    >
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(circle at 18% 22%, rgba(242,101,34,0.10), transparent 28%), radial-gradient(circle at 82% 18%, rgba(255,255,255,0.85), transparent 32%), linear-gradient(180deg, #f6f5f1 0%, #efede7 100%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 40,
          borderRadius: 34,
          background: 'rgba(255,255,255,0.45)',
          boxShadow: SHADOW,
          border: `1px solid ${BORDER}`,
          overflow: 'hidden',
          transform: `scale(${0.94 + intro * 0.06})`,
          opacity: intro,
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -100,
            left: glowX - 220,
            width: 440,
            height: 440,
            borderRadius: 999,
            background: 'radial-gradient(circle, rgba(242,101,34,0.16), rgba(242,101,34,0) 72%)',
            filter: 'blur(18px)',
          }}
        />

        <Header />

        <div
          style={{
            position: 'absolute',
            left: 42,
            right: 42,
            top: 132,
            display: 'grid',
            gridTemplateColumns: '1.05fr 1.2fr 0.95fr',
            gap: 24,
          }}
        >
          <QueueCard queueCycle={queueCycle} />
          <WorkflowCard scanIndex={scanIndex} frame={frame} fps={fps} />
          <InsightCard chartBias={chartBias} />
        </div>

        <FlowLines flowCycle={flowCycle} />

        <LogPanel cycle={cycle} />
      </div>
    </AbsoluteFill>
  )
}

const Header = () => (
  <div
    style={{
      position: 'absolute',
      top: 30,
      left: 34,
      right: 34,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 999,
          background: TEXT,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: '-0.03em',
        }}
      >
        SM
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: MUTED,
          }}
        >
          Stephen Mantle
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 28,
            lineHeight: 1.02,
            fontWeight: 600,
            letterSpacing: '-0.05em',
            maxWidth: 400,
          }}
        >
          Clearer workflows. Less admin.
        </div>
      </div>
    </div>

    <div style={{ display: 'flex', gap: 10 }}>
      {['Capture', 'Route', 'Visibility'].map((item, index) => (
        <div
          key={item}
          style={{
            borderRadius: 999,
            padding: '11px 16px',
            background: index === 1 ? TEXT : SURFACE_SOFT,
            color: index === 1 ? 'white' : TEXT,
            fontSize: 13,
            fontWeight: 500,
            border: `1px solid ${index === 1 ? 'rgba(17,24,39,0.15)' : BORDER}`,
          }}
        >
          {item}
        </div>
      ))}
    </div>
  </div>
)

const QueueCard = ({ queueCycle }: { queueCycle: number }) => (
  <Panel title="Incoming work" subtitle="Requests arrive cleanly">
    <div style={{ display: 'grid', gap: 12 }}>
      {queueItems.map((item, index) => {
        const local = (queueCycle + index * 0.15) % 1
        const offset = interpolate(local, [0, 1], [0, -14])
        const active = local > 0.54 && local < 0.78

        return (
          <div
            key={item}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '14px 16px',
              borderRadius: 18,
              background: active ? ORANGE_SOFT : 'rgba(255,255,255,0.72)',
              border: `1px solid ${active ? 'rgba(242,101,34,0.22)' : BORDER}`,
              transform: `translateY(${offset}px)`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  background: active ? ORANGE : '#d1d5db',
                }}
              />
              <span style={{ fontSize: 15, color: TEXT }}>{item}</span>
            </div>
            <span
              style={{
                fontSize: 12,
                color: active ? ORANGE : MUTED,
                fontWeight: 600,
              }}
            >
              {active ? 'Routing' : 'Queued'}
            </span>
          </div>
        )
      })}
    </div>
  </Panel>
)

const WorkflowCard = ({
  scanIndex,
  frame,
  fps,
}: {
  scanIndex: number
  frame: number
  fps: number
}) => {
  const barPulse = spring({
    frame: frame % 90,
    fps,
    config: { damping: 14, stiffness: 90 },
  })

  return (
    <Panel title="Workflow system" subtitle="From manual chase to usable flow">
      <div style={{ display: 'grid', gap: 12 }}>
        {workflowSteps.map((step, index) => {
          const active = index === scanIndex
          return (
            <div
              key={step}
              style={{
                position: 'relative',
                overflow: 'hidden',
                padding: '16px 18px',
                borderRadius: 18,
                border: `1px solid ${active ? 'rgba(242,101,34,0.24)' : BORDER}`,
                background: active ? 'rgba(255,255,255,0.96)' : 'rgba(255,255,255,0.72)',
              }}
            >
              {active ? (
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(90deg, rgba(242,101,34,0.00), rgba(242,101,34,0.10), rgba(242,101,34,0.00))',
                    transform: `translateX(${interpolate(barPulse, [0, 1], [-220, 260])}px)`,
                  }}
                />
              ) : null}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 999,
                      background: active ? ORANGE : 'rgba(17,24,39,0.08)',
                      color: active ? 'white' : TEXT,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {index + 1}
                  </div>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>{step}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: active ? ORANGE : MUTED,
                    fontWeight: 600,
                  }}
                >
                  {active ? 'Active' : 'Ready'}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Panel>
  )
}

const InsightCard = ({ chartBias }: { chartBias: number }) => (
  <Panel title="Visibility layer" subtitle="Faster decisions">
    <div style={{ display: 'grid', gap: 16 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 10,
        }}
      >
        {insightLabels.map((label, index) => (
          <div
            key={label}
            style={{
              borderRadius: 16,
              padding: '14px 12px',
              background: 'rgba(255,255,255,0.78)',
              border: `1px solid ${BORDER}`,
            }}
          >
            <div
              style={{
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: MUTED,
              }}
            >
              {label}
            </div>
            <div
              style={{
                marginTop: 10,
                fontSize: 23,
                fontWeight: 600,
                letterSpacing: '-0.04em',
                color: TEXT,
              }}
            >
              {Math.round((68 + index * 9) * chartBias)}%
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          borderRadius: 18,
          background: 'rgba(255,255,255,0.76)',
          border: `1px solid ${BORDER}`,
          padding: '16px 18px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'end', gap: 12, height: 108 }}>
          {[0.46, 0.62, 0.78, 0.66, 0.9].map((value, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                height: `${value * 100 * chartBias}%`,
                borderRadius: 999,
                background:
                  index === 4
                    ? `linear-gradient(180deg, ${ORANGE}, rgba(242,101,34,0.35))`
                    : 'linear-gradient(180deg, rgba(17,24,39,0.18), rgba(17,24,39,0.06))',
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 13,
            color: MUTED,
          }}
        >
          Reporting surfaces the right exceptions earlier.
        </div>
      </div>
    </div>
  </Panel>
)

const FlowLines = ({ flowCycle }: { flowCycle: number }) => {
  const dotA = interpolate(flowCycle, [0, 1], [320, 620])
  const dotB = interpolate((flowCycle + 0.3) % 1, [0, 1], [720, 1015])

  return (
    <svg
      width="1280"
      height="960"
      viewBox="0 0 1280 960"
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
    >
      <path
        d="M 380 368 C 455 368, 505 368, 578 368"
        fill="none"
        stroke="rgba(17,24,39,0.14)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M 780 368 C 842 368, 904 368, 980 368"
        fill="none"
        stroke="rgba(17,24,39,0.14)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx={dotA} cy="368" r="8" fill={ORANGE} />
      <circle cx={dotB} cy="368" r="8" fill={ORANGE} />
    </svg>
  )
}

const LogPanel = ({ cycle }: { cycle: number }) => (
  <div
    style={{
      position: 'absolute',
      left: 42,
      right: 42,
      bottom: 42,
      borderRadius: 24,
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      boxShadow: SHADOW,
      padding: '18px 22px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            textTransform: 'uppercase',
            letterSpacing: '0.18em',
            color: MUTED,
          }}
        >
          Event log
        </div>
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            gap: 12,
          }}
        >
          {[
            'Enquiry captured',
            'Inbox routed',
            'Follow-up triggered',
            'Dashboard updated',
          ].map((item, index) => {
            const active = Math.floor(cycle * 4) === index
            return (
              <div
                key={item}
                style={{
                  borderRadius: 999,
                  padding: '10px 14px',
                  fontSize: 13,
                  background: active ? ORANGE_SOFT : 'rgba(255,255,255,0.62)',
                  color: active ? ORANGE : TEXT,
                  border: `1px solid ${active ? 'rgba(242,101,34,0.22)' : BORDER}`,
                }}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: MUTED,
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 999,
            background: ORANGE,
            display: 'inline-block',
          }}
        />
        Systems people actually use
      </div>
    </div>
  </div>
)

const Panel = ({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) => (
  <div
    style={{
      borderRadius: 24,
      background: SURFACE,
      border: `1px solid ${BORDER}`,
      boxShadow: SHADOW,
      padding: 22,
    }}
  >
    <div
      style={{
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: '0.18em',
        color: MUTED,
      }}
    >
      {title}
    </div>
    <div
      style={{
        marginTop: 8,
        marginBottom: 18,
        fontSize: 20,
        lineHeight: 1.15,
        fontWeight: 600,
        letterSpacing: '-0.04em',
      }}
    >
      {subtitle}
    </div>
    {children}
  </div>
)
