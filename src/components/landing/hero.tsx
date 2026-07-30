import { motion } from "framer-motion";
import { AmbientBackground } from "./ambient-background";
import { URLInput } from "./url-input";

export function Hero() {
  return (
    <section id="top" className="relative pt-32 pb-16 sm:pt-40 sm:pb-24">
      <AmbientBackground />
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-muted-foreground backdrop-blur-xl"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_2px_rgba(16,185,129,0.7)]" />
          Now with instant metadata previews
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.6 }}
          className="text-gradient text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl"
        >
          Convert Video to Audio<br className="hidden sm:block" /> in Seconds
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mt-5 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg"
        >
          Paste a supported video link to preview metadata and prepare an audio
          conversion workflow.
        </motion.p>

        <div className="mt-10">
          <URLInput />
        </div>
      </div>
    </section>
  );
}
