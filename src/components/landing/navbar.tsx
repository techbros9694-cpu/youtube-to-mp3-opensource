import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AudioLines } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "FAQ", href: "#faq" },
  { label: "About Us", href: "#about" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav
        className={`flex w-full max-w-5xl items-center justify-between gap-4 rounded-full border border-glass-border px-3 py-2 transition-all duration-300 ${
          scrolled
            ? "bg-glass shadow-[0_10px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-2xl"
            : "bg-glass/60 backdrop-blur-xl"
        }`}
        style={{ backdropFilter: "blur(24px) saturate(160%)" }}
      >
        <a href="#top" className="flex items-center gap-2 pl-2">
          <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-[oklch(0.55_0.25_15)] shadow-[0_6px_20px_-6px_oklch(0.68_0.22_25/0.7)]">
            <AudioLines className="h-4 w-4 text-brand-foreground" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Voxdrop</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1 pr-1">
          <ThemeToggle />
        </div>
      </nav>
    </motion.header>
  );
}
