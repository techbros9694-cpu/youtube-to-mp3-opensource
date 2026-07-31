import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { PreviewCard } from "@/components/landing/preview-card";
import { ProgressSection } from "@/components/landing/progress-section";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ConverterProvider, useConverter } from "@/hooks/use-converter";
import { PrivacyPolicy } from "@/components/landing/privacy";
import { TermsOfService } from "@/components/landing/terms";
import { AboutUs } from "@/components/landing/about";
import { BackToTop } from "@/components/back-to-top";
import { useState, useEffect } from "react";

function AppContent() {
  const { status } = useConverter();
  const [view, setView] = useState<"home" | "privacy" | "terms" | "about">("home");

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === "#privacy") {
        setView("privacy");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#terms") {
        setView("terms");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else if (hash === "#about") {
        setView("about");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setView("home");
        if (hash && hash !== "#" && hash !== "#top") {
          setTimeout(() => {
            const targetId = hash.replace("#", "");
            const elem = document.getElementById(targetId);
            if (elem) {
              elem.scrollIntoView({ behavior: "smooth" });
            }
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main className="relative w-full min-h-screen">
        {view === "privacy" && <PrivacyPolicy />}
        {view === "terms" && <TermsOfService />}
        {view === "about" && <AboutUs />}
        {view === "home" && (
          <>
            <Hero />
            
            <AnimatePresence>
              {status !== "idle" && (
                <motion.section 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="relative -mt-6 sm:-mt-10 mb-12"
                >
                  <div className="mx-auto max-w-5xl space-y-4 px-4 sm:space-y-6">
                    <ProgressSection />
                    <PreviewCard />
                  </div>
                </motion.section>
              )}
            </AnimatePresence>

            <Features />
            <HowItWorks />
            <FAQ />
          </>
        )}
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ConverterProvider>
        <AppContent />
      </ConverterProvider>
    </ThemeProvider>
  );
}


