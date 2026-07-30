import { motion } from "framer-motion";
import { 
  Users, 
  Sparkles, 
  Target, 
  Github, 
  Code2, 
  ExternalLink, 
  Check, 
  Zap, 
  ShieldCheck, 
  Heart,
  Compass,
  AudioLines,
  Globe
} from "lucide-react";
import { AmbientBackground } from "./ambient-background";

export function AboutUs() {
  return (
    <section className="relative w-full min-h-screen pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Full-width Ambient Background */}
      <AmbientBackground />

      <div className="relative mx-auto max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="space-y-12"
        >
        {/* Header Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-brand font-medium backdrop-blur-xl">
            <Users className="h-3.5 w-3.5" />
            <span>Created by 2 Bro's</span>
          </div>
          <h1 className="text-gradient text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            About Voxdrop
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Crafted with passion by Piyush and Pritam — developers and founders committed to building fast, ad-free, and elegant web utilities.
          </p>
        </div>

        {/* Hero Card - Who We Are */}
        <div className="rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3 ring-1 ring-glass-border">
              <Sparkles className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">Who We Are</h2>
              <p className="text-xs text-muted-foreground">Creative persons building modern software</p>
            </div>
          </div>

          <p className="text-base leading-relaxed text-muted-foreground">
            We are <strong className="text-foreground font-medium">Piyush</strong> and <strong className="text-foreground font-medium">Pritam</strong>, two creative brothers who love designing clean, high-performance web applications. We believe technology should serve people without clutter, dark patterns, or intrusive ads. Voxdrop was born out of our shared creative spirit to deliver a refined, distraction-free media conversion experience.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
            <div className="rounded-2xl border border-glass-border bg-surface-1/70 p-4 text-center backdrop-blur-md">
              <Heart className="mx-auto h-5 w-5 text-brand mb-1.5" />
              <div className="text-sm font-semibold text-foreground">100% Free</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">No Ads or Paywalls</div>
            </div>
            <div className="rounded-2xl border border-glass-border bg-surface-1/70 p-4 text-center backdrop-blur-md">
              <Zap className="mx-auto h-5 w-5 text-brand mb-1.5" />
              <div className="text-sm font-semibold text-foreground">Instant</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Fast Stream Proxy</div>
            </div>
            <div className="rounded-2xl border border-glass-border bg-surface-1/70 p-4 text-center backdrop-blur-md">
              <ShieldCheck className="mx-auto h-5 w-5 text-brand mb-1.5" />
              <div className="text-sm font-semibold text-foreground">Private</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Zero Data Logs</div>
            </div>
            <div className="rounded-2xl border border-glass-border bg-surface-1/70 p-4 text-center backdrop-blur-md">
              <Code2 className="mx-auto h-5 w-5 text-brand mb-1.5" />
              <div className="text-sm font-semibold text-foreground">Open Source</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">Codebase Available</div>
            </div>
          </div>
        </div>

        {/* Our Vision Section */}
        <div className="space-y-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-foreground">
              <Target className="h-3.5 w-3.5 text-brand" />
              <span>Our Vision</span>
            </div>
            <h2 className="text-2xl font-semibold text-foreground">What Was Our Vision?</h2>
            <p className="text-sm text-muted-foreground">The core principles behind building Voxdrop.</p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg space-y-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 ring-1 ring-glass-border text-brand">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">Pure, Uncorrupted Web</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Most online converters are bloated with fake buttons and malware traps. Our vision was to create a clean, honest, and completely safe tool you can trust.
              </p>
            </div>

            <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg space-y-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 ring-1 ring-glass-border text-brand">
                <AudioLines className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">Thoughtful Engineering</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                We designed Voxdrop to feel modern — featuring audio wave previews, metadata parsers, custom bitrate options, and smooth glassmorphism motion.
              </p>
            </div>

            <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg space-y-3">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 ring-1 ring-glass-border text-brand">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-foreground text-base">Zero-Knowledge Security</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your media choices remain strictly private. Voxdrop processes media streams on-the-fly without keeping logs, track cookies, or server archives.
              </p>
            </div>
          </div>
        </div>

        {/* Creators Profiles Section */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-foreground">The Creators</h2>
            <p className="text-sm text-muted-foreground">Connect with us on GitHub and inspect our work.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Piyush Profile */}
            <div className="group rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl transition-all hover:border-brand/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-rose-600 font-bold text-white shadow-md">
                    P
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Piyush</h3>
                    <p className="text-xs text-brand font-medium">Developer & Founder</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground border border-glass-border">
                  @Pcreates97
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Focused on backend architecture, API resilience, high-speed streaming pipelines, and crafting stable web services.
              </p>

              <div className="mt-6 pt-4 border-t border-glass-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">GitHub Profile</span>
                <a
                  href="https://github.com/Pcreates97"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Visit GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>

            {/* Pritam Profile */}
            <div className="group rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl transition-all hover:border-brand/30">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand to-amber-600 font-bold text-white shadow-md">
                    P
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Pritam</h3>
                    <p className="text-xs text-brand font-medium">Developer & Founder</p>
                  </div>
                </div>
                <span className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground border border-glass-border">
                  @pritam3606
                </span>
              </div>

              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                Specializes in frontend motion, user experience, glassmorphic layout design, and fluid interactive components.
              </p>

              <div className="mt-6 pt-4 border-t border-glass-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">GitHub Profile</span>
                <a
                  href="https://github.com/pritam3606"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-105"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>Visit GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-70" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* AI Playground ARC Organization Box */}
        <div className="rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8 space-y-6">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-medium text-brand">
                <Code2 className="h-4 w-4" />
                <span>Open Source Organization</span>
              </div>
              <h3 className="text-2xl font-bold text-foreground">AI Playground ARC</h3>
              
              <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
                <p>
                  AI Playground ARC is an open-source software organization dedicated to building modern, high-quality, and community-driven applications.
                </p>
                <p>
                  We focus on creating innovative tools, web applications, AI-powered products, and developer resources that are clean, reliable, and accessible to everyone.
                </p>
                <p>
                  Our mission is to encourage collaboration, continuous learning, and the development of impactful open-source projects.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap sm:flex-col items-stretch gap-3 shrink-0">
              <a
                href="https://github.com/ai-playground-arc-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-xs font-semibold text-brand-foreground shadow-sm transition-all hover:brightness-110 active:scale-95"
              >
                <Globe className="h-4 w-4" />
                <span>Visit Organization</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>

              <a
                href="https://github.com/ai-playground-arc-1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-glass-border bg-surface-1 px-5 py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-surface-2"
              >
                <Github className="h-4 w-4" />
                <span>View GitHub</span>
                <ExternalLink className="h-3 w-3 opacity-70" />
              </a>
            </div>
          </div>

          {/* Organization Badges */}
          <div className="pt-4 border-t border-glass-border flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-foreground border border-glass-border">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Open Source
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-foreground border border-glass-border">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Community Driven
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-foreground border border-glass-border">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Modern Development
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3.5 py-1.5 text-xs font-medium text-foreground border border-glass-border">
              <Check className="h-3.5 w-3.5 text-emerald-500" />
              Built with Collaboration
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
  );
}
