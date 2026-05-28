import { useEffect, useState } from 'react'
import { ArrowRight, Clock, Menu, X } from 'lucide-react'
import { ChromaFlow, FilmGrain, FlutedGlass, Shader, Swirl } from 'shaders/react'

const CONTACT_HREF = 'mailto:mantsai@zohomail.eu'

const NAV_LINKS = [
  { label: 'Websites', href: '#websites' },
  { label: 'Automations', href: '#automations' },
  { label: 'About', href: '#studio' },
  { label: 'Connect', href: '#connect' },
] as const

const SMALL_IMAGE = '/stephen.png'
const LARGE_IMAGE = '/max-andrey--8-2YWKt8Ag-unsplash.jpg'

type RollingButtonProps = {
  label: string
  href: string
  className: string
  arrowCircleClassName: string
  arrowClassName: string
  textClassName?: string
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dublinTime, setDublinTime] = useState('')

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

  return (
    <main className="bg-white text-gray-900">
      <section
        id="hero"
        className="relative flex min-h-screen flex-col overflow-hidden bg-[#EFEFEF]"
      >
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

        <div className="relative z-20 p-2 sm:p-3">
          <div className="mx-auto max-w-[1440px]">
            <div className="flex items-center justify-between gap-4 rounded-full bg-white p-[5px] shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-4 pl-1 sm:gap-6">
                <a href="#hero" className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-900 sm:h-10 sm:w-10">
                    <span className="text-[10px] font-bold leading-none tracking-tight text-white sm:text-[11px]">
                      SM
                    </span>
                  </div>
                </a>

                <nav className="hidden items-center gap-6 md:flex">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-[14px] text-gray-900 transition-colors duration-300 hover:text-gray-500"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="hidden items-center gap-4 md:flex">
                <p className="hidden text-[13px] leading-[13px] text-gray-600 lg:block">
                  Taking on web design + automation projects
                </p>

                <div className="flex items-center gap-2 text-[13px] leading-[13px] text-gray-600">
                  <Clock size={14} strokeWidth={1.8} />
                  <span>{dublinTime} in Dublin</span>
                </div>

                <RollingButton
                  label="Book a free intro call"
                  href={CONTACT_HREF}
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
          </div>
        </div>

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
                  key={link.label}
                  href={link.href}
                  className="text-[28px] font-medium leading-[32px] text-gray-900"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="mt-8">
              <RollingButton
                label="Start a project"
                href={CONTACT_HREF}
                className="w-full justify-between bg-gray-900 px-5 py-2 text-[14px] font-medium leading-[14px] text-white"
                arrowCircleClassName="h-8 w-8 bg-white text-gray-900"
                arrowClassName="h-4 w-4"
                textClassName="items-start"
              />
            </div>
          </div>
        </div>

        <div className="flex-1" />

        <div className="relative z-20">
          <div className="mx-auto max-w-[1440px] px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
            <p className="mb-5 text-[13px] leading-[13px] tracking-wide text-gray-900 sm:mb-8 sm:text-[14px] sm:leading-[14px]">
              Stephen Mantle
            </p>

            <h1 className="max-w-[1180px] text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:text-[clamp(2.5rem,5vw,4.2rem)]">
              Web design and automations
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              for businesses that need
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              real solutions, not more admin.
            </h1>

            <div className="mt-8 flex flex-col items-start gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <RollingButton
                label="Start a project"
                href={CONTACT_HREF}
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
                  Solutions First
                </span>
                <span className="rounded bg-gray-900 px-1.5 py-0.5 text-[10px] leading-[10px] text-white sm:px-2 sm:text-[11px] sm:leading-[11px]">
                  Dublin
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="studio"
        className="overflow-hidden bg-white pb-12 pt-16 sm:pb-16 sm:pt-20 lg:pb-24 lg:pt-32"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
            <NumberBadge number="1" />
            <SectionPill label="Why this version of me" />
          </div>

          <div className="px-5 sm:px-8 lg:px-12">
            <h2 className="mb-12 max-w-[1020px] text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 sm:mb-16 lg:mb-28">
              Solutions-first websites, automations
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              and operating systems for businesses
              <br className="hidden sm:block" />
              <span className="sm:hidden"> </span>
              that want things to work properly.
            </h2>
          </div>

          <div className="lg:hidden">
            <div className="px-5 sm:px-8 lg:px-12">
              <p className="max-w-[42rem] text-[15px] font-medium leading-[1.6] text-gray-900 sm:text-[17px]">
                I came from years across luxury brands and tech operations, so I naturally
                look for where a business is leaking time, trust or clarity. Now I build
                clean websites and practical automations with the same angle every time:
                solve the friction, then make it look sharp.
              </p>

              <div className="mt-6">
                <RollingButton
                  label="See what I build"
                  href="#projects"
                  className="bg-[#F26522] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#e05a1a] sm:pl-6 sm:text-[14px] sm:leading-[14px]"
                  arrowCircleClassName="h-7 w-7 bg-white text-[#F26522] sm:h-8 sm:w-8"
                  arrowClassName="h-4 w-4"
                />
              </div>
            </div>

            <div className="mt-10 flex flex-col gap-4 px-5 sm:flex-row sm:gap-5 sm:px-8 lg:px-12">
              <img
                src={SMALL_IMAGE}
                alt="Stephen Mantle portrait"
                className="aspect-[438/346] w-full rounded-xl object-cover sm:w-[45%] sm:rounded-2xl"
              />
              <img
                src={LARGE_IMAGE}
                alt="Stephen Mantle systems concept artwork"
                className="aspect-[900/600] w-full rounded-xl object-cover sm:w-[55%] sm:rounded-2xl"
              />
            </div>
          </div>

          <div className="hidden grid-cols-[26%_1fr_48%] items-end gap-6 px-5 sm:px-8 lg:grid xl:gap-8 lg:px-12">
            <div className="self-end">
              <img
                src={SMALL_IMAGE}
                alt="Stephen Mantle portrait"
                className="aspect-[438/346] w-full rounded-2xl object-cover"
              />
            </div>

            <div className="flex self-start justify-end">
              <div className="max-w-none">
                <p className="whitespace-nowrap text-[16px] font-medium leading-[1.65] text-gray-900 xl:text-[18px]">
                  Luxury brands and tech ops taught me
                  <br />
                  where friction hides in a business.
                  <br />
                  Now I build the cleaner solution.
                </p>

                <div className="mt-7">
                  <RollingButton
                    label="See what I build"
                    href="#projects"
                    className="bg-[#F26522] py-2 pl-5 pr-2 text-[13px] leading-[13px] text-white hover:bg-[#e05a1a] sm:pl-6 sm:text-[14px] sm:leading-[14px]"
                    arrowCircleClassName="h-8 w-8 bg-white text-[#F26522]"
                    arrowClassName="h-4 w-4"
                  />
                </div>
              </div>
            </div>

            <div className="self-end">
              <img
                src={LARGE_IMAGE}
                alt="Stephen Mantle systems concept artwork"
                className="aspect-[3/2] w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section
        id="projects"
        className="bg-[#F5F5F5] pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-28 lg:pt-28"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-6 flex items-center gap-3 px-5 sm:mb-8 sm:px-8 lg:px-12">
            <NumberBadge number="2" />
            <SectionPill label="Selected solutions" borderClassName="border-gray-300" />
          </div>

          <div className="px-5 sm:px-8 lg:px-12">
            <h2 className="mb-10 text-[clamp(1.75rem,7vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 sm:mb-14 sm:text-[clamp(2.5rem,5vw,4.2rem)] lg:mb-16">
              What I&apos;m building
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 px-5 sm:gap-6 sm:px-8 md:grid-cols-2 lg:gap-7 lg:px-12">
            <article id="automations">
              <div className="group relative aspect-[329/246] cursor-pointer overflow-hidden rounded-2xl bg-[#11131d]">
                <video
                  src="/visor-promo.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                <div className="absolute bottom-4 left-4">
                  <div className="flex h-9 w-9 items-center overflow-hidden rounded-full bg-white transition-all duration-300 ease-in-out group-hover:w-[144px]">
                    <span className="pl-4 text-[13px] font-medium text-gray-900 opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                      See systems
                    </span>
                    <span className="ml-auto flex h-9 w-9 items-center justify-center text-gray-900">
                      <ManualLinkIcon />
                    </span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
                Morning briefs, inbox workflows, internal dashboards and AI-assisted
                operations designed to reduce manual work and keep things moving.
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Automation Systems
              </h3>
            </article>

            <article id="websites">
              <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-[#e9e3d8]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,101,34,0.22),_transparent_34%),linear-gradient(180deg,_rgba(255,255,255,0.92),_rgba(241,236,228,0.94))]" />

                <div className="relative flex h-full flex-col justify-between p-5 sm:p-6">
                  <div className="rounded-[22px] bg-white/90 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] sm:p-5">
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

                    <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] font-medium text-gray-600 sm:text-[12px]">
                      <span className="rounded-full bg-[#f5f5f5] px-3 py-2 text-center">
                        Home
                      </span>
                      <span className="rounded-full bg-[#f5f5f5] px-3 py-2 text-center">
                        Services
                      </span>
                      <span className="rounded-full bg-[#f5f5f5] px-3 py-2 text-center">
                        Contact
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <div className="flex h-9 w-9 items-center overflow-hidden rounded-full bg-gray-900 transition-all duration-300 ease-in-out group-hover:w-[156px]">
                      <span className="pl-4 text-[13px] font-medium text-white opacity-0 transition-opacity delay-100 duration-300 group-hover:opacity-100">
                        View websites
                      </span>
                      <span className="ml-auto flex h-9 w-9 items-center justify-center text-white">
                        <ArrowRight className="h-3.5 w-3.5 -rotate-45 transition-transform duration-300 ease-in-out group-hover:rotate-0" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-[13px] leading-relaxed text-gray-600 sm:text-[14px]">
                Clean, professional websites for sole traders and small businesses that
                need to look credible online and make it easy for people to get in touch.
              </p>
              <h3 className="mt-1 text-[14px] font-semibold text-gray-900 sm:text-[15px]">
                Web Design for Small Business
              </h3>
            </article>
          </div>

          <div
            id="connect"
            className="px-5 pt-12 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16"
          >
            <div className="flex flex-col gap-4 rounded-2xl border border-black/5 bg-white px-5 py-5 shadow-[0_12px_40px_rgba(0,0,0,0.05)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="max-w-[46rem] text-[14px] leading-relaxed text-gray-600 sm:text-[15px]">
                Need a site, a smarter workflow, or both? I&apos;ll tell you the best next
                step honestly, whether that&apos;s a fresh build, a rebuild, an automation,
                or nothing at all.
              </p>

              <RollingButton
                label="Email Stephen"
                href={CONTACT_HREF}
                className="w-fit bg-gray-900 py-2 pl-5 pr-2 text-[13px] font-medium leading-[13px] text-white"
                arrowCircleClassName="h-7 w-7 bg-white text-gray-900"
                arrowClassName="h-4 w-4"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function RollingButton({
  label,
  href,
  className,
  arrowCircleClassName,
  arrowClassName,
  textClassName,
}: RollingButtonProps) {
  return (
    <a
      href={href}
      className={`group inline-flex items-center gap-3 rounded-full font-medium transition-colors duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${className}`}
    >
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
    </a>
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

function ManualLinkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[14px] w-[14px] -rotate-45 transition-transform duration-300 ease-in-out group-hover:rotate-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

export default App
