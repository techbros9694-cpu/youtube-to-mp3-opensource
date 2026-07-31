import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link2, Sparkles, ArrowRight, Loader2 } from "lucide-react";
import { useConverter } from "@/hooks/use-converter";

export function URLInput() {
  const [focused, setFocused] = useState(false);
  const { startConversion, status } = useConverter();
  const [value, setValue] = useState("");

  const isPending = status === "preparing" || status === "analyzing" || status === "fetching";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !isPending) {
      startConversion(value.trim());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-3xl"
    >
      {/* animated glow ring */}
      <div
        aria-hidden
        className={`absolute -inset-px rounded-[26px] transition-opacity duration-500 ${
          focused ? "opacity-100" : "opacity-40"
        }`}
        style={{
          background:
              "conic-gradient(from 180deg at 50% 50%, oklch(0.68 0.22 25 / 0.6), oklch(0.6 0.25 285 / 0.5), oklch(0.6 0.22 240 / 0.5), oklch(0.68 0.22 25 / 0.6))",
          filter: "blur(14px)",
        }}
      />
      <form
        onSubmit={handleSubmit}
        className="relative flex items-center gap-2 rounded-[22px] border border-glass-border bg-surface-1/80 p-2 pl-4 shadow-elegant backdrop-blur-xl"
        style={{ boxShadow: "var(--shadow-elegant)" }}
      >
        <Link2 className="h-5 w-5 shrink-0 text-muted-foreground" />
        <input
          type="url"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Paste YouTube URL here..."
          aria-label="Video URL"
          disabled={isPending}
          required
          className="min-w-0 flex-1 bg-transparent px-1 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground/70 sm:text-lg disabled:opacity-75"
        />
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={isPending}
          className="group inline-flex shrink-0 items-center gap-2 rounded-2xl bg-brand px-4 py-3 text-sm font-medium text-brand-foreground shadow-[0_10px_30px_-10px_oklch(0.68_0.22_25/0.7)] transition-all hover:shadow-[0_16px_40px_-12px_oklch(0.68_0.22_25/0.8)] sm:px-5 sm:text-base disabled:opacity-50 disabled:pointer-events-none"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          <span>{isPending ? "Processing..." : "Convert"}</span>
          {!isPending && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />}
        </motion.button>
      </form>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Paste a valid YouTube link · MP3 format · High fidelity audio output
      </p>
    </motion.div>
  );
}

