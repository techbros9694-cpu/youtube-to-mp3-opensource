import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionIntro } from "./features";

const faqs = [
  {
    q: "What links are supported?",
    a: "Most major video platforms with public metadata endpoints are supported. Paste a link and we'll validate it in the analyzer.",
  },
  {
    q: "How fast is analysis?",
    a: "Metadata typically resolves in well under a second. The interface is designed to feel instant, with progressive states while data streams in.",
  },
  {
    q: "Can I view metadata before processing?",
    a: "Yes — the preview card, thumbnail, and details are always shown before any conversion step is prepared.",
  },
  {
    q: "What audio formats are available?",
    a: "The workflow is designed around MP3 and AAC by default, with room for lossless formats depending on the conversion backend you plug in.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-4">
        <SectionIntro
          eyebrow="FAQ"
          title="Questions, answered"
          subtitle="Everything you need to know before getting started."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="glass-panel mt-10 overflow-hidden rounded-3xl px-2 sm:px-4"
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-glass-border last:border-0"
              >
                <AccordionTrigger className="px-3 py-5 text-left text-base font-medium hover:no-underline sm:px-4 sm:text-lg">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-5 text-sm leading-relaxed text-muted-foreground sm:px-4 sm:text-base">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
