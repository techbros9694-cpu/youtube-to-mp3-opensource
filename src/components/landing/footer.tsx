import { AudioLines } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function Footer() {
  return (
    <footer className="relative mt-10 border-t border-glass-border">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-[oklch(0.55_0.25_15)]">
              <AudioLines className="h-4 w-4 text-brand-foreground" />
            </span>
            <span className="text-sm font-semibold tracking-tight">Voxdrop</span>
          </div>
          <p className="mt-3 max-w-md text-sm text-muted-foreground">
            A premium, minimal interface for previewing video metadata and preparing audio conversion workflows. created by two Dev bro's Piyush X Pritam Enjoy!
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Support:{" "}
            <a href="mailto:techbros9694@gmail.com" className="text-foreground hover:text-brand transition-colors font-medium">
              techbros9694@gmail.com
            </a>
          </p>
        </div>

        <div className="flex items-center gap-2 md:justify-end">
          <ThemeToggle />
        </div>
      </div>
      <div className="border-t border-glass-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row">
          <div>© {new Date().getFullYear()} Voxdrop. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#about" className="hover:text-foreground font-medium text-brand">
              About Us
            </a>
            <a href="#privacy" className="hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#terms" className="hover:text-foreground">
              Terms of Service
            </a>
            <a
              href="https://github.com/techbros9694-cpu"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground font-medium"
            >
              TechBros GitHub
            </a>
            <a
              href="https://github.com/techbros9694-cpu/youtube-to-mp3-opensource"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub Codebase
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
