import { motion } from "framer-motion";
import { Zap, LayoutDashboard, Waves } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Fast Metadata Detection",
    description:
      "Preview titles, channels, durations, and thumbnails in an instant with a lightweight parser.",
  },
  {
    icon: LayoutDashboard,
    title: "Modern Responsive Interface",
    description:
      "A refined workspace built with attention to detail — from motion to spacing to typography.",
  },
  {
    icon: Waves,
    title: "Clean Audio Workflow",
    description:
      "A streamlined path from paste to preview, designed to plug into any conversion backend.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4">
        <SectionIntro
          eyebrow="Features"
          title="Built for the details"
          subtitle="Every interaction is tuned. Every surface is considered."
        />

        <div className="mt-12 grid gap-4 sm:gap-5 md:grid-cols-3">
          {features.map((f, i) => (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-glass-border bg-surface-1/70 p-6 backdrop-blur-xl"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -inset-24 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40"
                style={{
                  background:
                    "radial-gradient(circle at 30% 20%, oklch(0.68 0.22 25 / 0.6), transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-surface-2 to-surface-3 ring-1 ring-glass-border">
                  <f.icon className="h-5 w-5 text-brand" />
                </div>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SectionIntro({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs uppercase tracking-wider text-muted-foreground">
        {eyebrow}
      </div>
      <h2 className="text-gradient mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-base text-muted-foreground">{subtitle}</p>
    </div>
  );
}
