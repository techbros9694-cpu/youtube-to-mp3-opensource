import { motion } from "framer-motion";
import { Shield, EyeOff, ServerCrash, Cpu } from "lucide-react";
import { AmbientBackground } from "./ambient-background";

export function PrivacyPolicy() {
  return (
    <section className="relative w-full min-h-screen pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden">
      {/* Full-width Ambient Background */}
      <AmbientBackground />

      <div className="relative mx-auto max-w-4xl px-4">

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-12"
      >
        {/* Header Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-glass-border bg-glass px-3 py-1 text-xs text-brand">
            <Shield className="h-3.5 w-3.5" />
            <span>Privacy Policy</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: July 11, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            At <strong className="text-foreground font-medium">Voxdrop</strong>, we take your privacy extremely seriously. We believe that your digital footprints are your own. This Privacy Policy details how we process data when you use our services. Our services are fully aligned with a strict, privacy-first philosophy, ensuring that you can process and enjoy media converter tools with absolute peace of mind.
          </p>
        </div>

        {/* Core Pillars (Grid) */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <EyeOff className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Personal Data Logs</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We never collect, request, or store your personal identity information, IP address, device location, or request logs.
            </p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <ServerCrash className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Zero File Storage</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We operate purely as a transient media proxy. No converted audio or video files are cached, stored, or archived on our servers.
            </p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <Cpu className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Secure API Proxies</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Media processing is securely brokered through upstream APIs with maximum SSL encryption, never exposing source tokens.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Data Minimization & No-Logs Commitment</h2>
            <p className="text-muted-foreground leading-relaxed">
              Voxdrop operates on a strict zero-knowledge infrastructure. We do not require any registration, account creation, or login. Because of this, we do not have databases storing names, email addresses, payment information, or passwords. Your usage of Voxdrop remains fully anonymous.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Transient Media Processing & Proxy</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you submit a conversion request, Voxdrop acts strictly as a real-time, transient pipeline. The media files generated during conversion are streamed directly to your browser device. Our servers do not retain a footprint of these files, nor do we build catalogs of converted media. Once your download starts or completes, any transient memory buffers allocated to process your stream are immediately garbage-collected and permanently destroyed.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Processing via Third-Party APIs</h2>
            <p className="text-muted-foreground leading-relaxed">
              To fulfill the media conversion requests, the YouTube URLs you input are securely transmitted to our backend. These URLs are proxied directly to secure third-party integration APIs (including RapidAPI structures and upstream media conversion services) strictly to process and convert the requested file into playable streams. These third parties do not receive any user-identifying markers or personal details from Voxdrop.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Cookies and Web Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We do not use tracking cookies or behavioral profile engines. We may utilize simple, local state storage (such as your browser's local storage) solely to preserve UI preferences, such as your selected dark/light visual theme, to deliver a seamless user experience upon returning.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Contact and Communications</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or wish to contact our support team, please reach out directly via email at <a href="mailto:techbros9694@gmail.com" className="text-brand hover:underline font-medium">techbros9694@gmail.com</a>. Your correspondence is used strictly to resolve your query and is never shared, rented, or sold to third-party marketing services.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  </section>
  );
}
