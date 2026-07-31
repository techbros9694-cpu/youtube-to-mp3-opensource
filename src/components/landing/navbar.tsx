import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioLines, Menu, X, Zap, Sparkles, HelpCircle, Users, FileText, Shield } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { label: "Features", href: "#features", icon: Zap },
  { label: "How It Works", href: "#how", icon: Sparkles },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
  { label: "About Us", href: "#about", icon: Users },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    if (href.startsWith("#")) {
      const targetId = href.substring(1);
      if (targetId === "top" || targetId === "") {
        window.location.hash = "";
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        window.location.hash = href;
      }
    }
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed inset-x-0 top-3 sm:top-4 z-50 flex justify-center px-3 sm:px-4"
    >
      <div className="relative w-full max-w-5xl">
        <nav
          className={`flex w-full items-center justify-between gap-2 sm:gap-4 rounded-full border border-glass-border px-3.5 py-2 transition-all duration-300 ${
            scrolled || mobileMenuOpen
              ? "bg-glass shadow-[0_10px_40px_-12px_oklch(0_0_0/0.5)] backdrop-blur-2xl"
              : "bg-glass/60 backdrop-blur-xl"
          }`}
          style={{ backdropFilter: "blur(24px) saturate(160%)" }}
        >
          {/* Brand Logo */}
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              handleNavClick("#top");
            }}
            className="flex items-center gap-2 pl-1 group"
          >
            <span className="relative grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-[oklch(0.55_0.25_15)] shadow-[0_6px_20px_-6px_oklch(0.68_0.22_25/0.7)] transition-transform group-hover:scale-105">
              <AudioLines className="h-4 w-4 text-brand-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">Voxdrop</span>
          </a>

          {/* Desktop Nav Links */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(l.href);
                  }}
                  className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground font-medium"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Actions & Mobile Trigger */}
          <div className="flex items-center gap-1.5 pr-0.5">
            <ThemeToggle />

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-glass-border bg-surface-1/80 text-foreground transition-colors hover:bg-surface-2 md:hidden active:scale-95 cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4 text-brand" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-3xl border border-glass-border bg-glass p-4 shadow-2xl backdrop-blur-2xl md:hidden"
              style={{ backdropFilter: "blur(28px) saturate(180%)" }}
            >
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Navigation Pages
                </div>
                {links.map((l) => {
                  const Icon = l.icon;
                  return (
                    <a
                      key={l.href}
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(l.href);
                      }}
                      className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-surface-2 active:bg-surface-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-2/80 ring-1 ring-glass-border text-brand">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span>{l.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* Extra Mobile Links */}
              <div className="mt-3 border-t border-glass-border pt-3 space-y-1">
                <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80">
                  Legal & Info
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <a
                    href="#privacy"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#privacy");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-1/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-surface-2"
                  >
                    <Shield className="h-3.5 w-3.5 text-brand" />
                    <span>Privacy</span>
                  </a>
                  <a
                    href="#terms"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick("#terms");
                    }}
                    className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-1/50 px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-surface-2"
                  >
                    <FileText className="h-3.5 w-3.5 text-brand" />
                    <span>Terms</span>
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
