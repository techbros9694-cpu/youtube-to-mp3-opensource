import { motion } from "framer-motion";
import { ClipboardPaste, ScanSearch, AudioLines, ArrowRight, ArrowDown } from "lucide-react";
import { SectionIntro } from "./features";

const steps = [
  {
    n: "01",
    icon: ClipboardPaste,
    title: "Paste URL",
    description: "Drop any supported video link into the hero input.",
  },
  {
    n: "02",
    icon: ScanSearch,
    title: "Analyze Metadata",
    description: "We fetch title, channel, duration and thumbnail instantly.",
  },
  {
    n: "03",
    icon: AudioLines,
    title: "Prepare Audio",
    description: "Choose format and quality — ready for the conversion stage.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionIntro
          eyebrow="How it works"
          title="From link to audio in three steps"
          subtitle="A simple, considered flow — no clutter, no surprises."
        />

        <div className="mt-14 flex flex-col items-stretch justify-center gap-6 md:flex-row md:items-center">
          {steps.map((s, i) => (
            <div key={s.n} className="flex flex-col items-center gap-6 md:flex-row md:gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.55 }}
                className="glass-panel relative flex w-full max-w-xs flex-col items-center rounded-3xl p-6 text-center md:w-64"
              >
                <div className="relative mb-4">
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-xl"
                    style={{
                      background:
                        "radial-gradient(circle, oklch(0.68 0.22 25 / 0.5), transparent 70%)",
                    }}
                  />
                  <div className="relative grid h-14 w-14 place-items-center rounded-full border border-glass-border bg-surface-2">
                    <s.icon className="h-5 w-5 text-brand" />
                  </div>
                </div>
                <div className="text-[11px] font-mono tracking-widest text-muted-foreground">
                  STEP {s.n}
                </div>
                <div className="mt-1 text-lg font-semibold text-foreground">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
              </motion.div>

              {i < steps.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.6 }}
                  className="flex items-center justify-center text-muted-foreground/60"
                  aria-hidden
                >
                  <ArrowDown className="h-5 w-5 md:hidden" />
                  <ArrowRight className="hidden h-5 w-5 md:block" />
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
