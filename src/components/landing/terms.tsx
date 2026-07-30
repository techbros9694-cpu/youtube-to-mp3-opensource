import { motion } from "framer-motion";
import { Scale, BookOpen, AlertCircle, RefreshCw } from "lucide-react";
import { AmbientBackground } from "./ambient-background";

export function TermsOfService() {
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
            <Scale className="h-3.5 w-3.5" />
            <span>Terms of Service</span>
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Last Updated: July 11, 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="rounded-3xl border border-glass-border bg-glass p-6 backdrop-blur-xl sm:p-8">
          <p className="text-base leading-relaxed text-muted-foreground">
            Welcome to <strong className="text-foreground font-medium">Voxdrop</strong>. By accessing or using our website, tools, or web application, you agree to comply with and be bound by the following Terms of Service. Please read these terms carefully before utilizing our transient converter pipeline. If you do not agree to these terms, you are not authorized to use this site.
          </p>
        </div>

        {/* Key Tenets (Grid) */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <BookOpen className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Personal & Fair Use</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Voxdrop is strictly provided for private, non-commercial, and personal educational exploration of media formats.
            </p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <AlertCircle className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">IP Responsibility</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You must verify you have the legal right or copyright owner permission to download or convert any video.
            </p>
          </div>

          <div className="rounded-2xl border border-glass-border bg-glass p-6 backdrop-blur-lg">
            <RefreshCw className="h-8 w-8 text-brand mb-4" />
            <h3 className="font-semibold text-foreground mb-2">As-Is Warranty</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The service is provided without warranty of any kind, subject to transient server changes and API availability.
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">1. Eligibility and Scope of Use</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are granted a non-exclusive, non-transferable, revocable license to access and use Voxdrop solely for personal, non-commercial, and educational purposes. You agree not to use this service for commercial distribution, monetization, or any illegal purposes. You must comply with all applicable local, national, and international laws when using Voxdrop.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">2. Intellectual Property Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              Voxdrop acts as a technology service provider and media format converter tool. Voxdrop <strong className="text-foreground font-medium">does not host, archive, or distribute</strong> any copyrighted audio, video, or image material on its servers.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Users are entirely and exclusively responsible for ensuring that they have the required legal rights, licenses, or explicit permissions from original content creators or copyright holders prior to processing or converting any URL input. Voxdrop does not condone, facilitate, or promote unauthorized copying or downloading of copyrighted material.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">3. Limitation of Liability & "As Is" Warranty</h2>
            <p className="text-muted-foreground leading-relaxed">
              Voxdrop is provided to you <strong className="text-foreground font-medium">"as is" and "as available,"</strong> without any warranties or representations of any kind, either express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              We do not warrant that the service will be continuous, error-free, uninterrupted, or fully compatible with all operating environments or browser configurations. Under no circumstances shall Voxdrop, its creators, operators, or contributors be held liable for any direct, indirect, incidental, special, exemplary, or consequential damages resulting from user misuse, service downtime, api alterations, or data transfers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">4. Acceptable Use Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree not to attempt to disrupt, overload, scrape, or probe Voxdrop's infrastructure or API gateways. Any automated query submissions or bulk processing requests that overload our server pipelines will result in your client session and access privileges being automatically blocked or rate-limited.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">5. Modifications of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              Voxdrop reserves the right to modify, amend, or replace these Terms of Service at any time without prior individual notice. Any changes will be reflected directly on this page with an updated "Last Updated" date. Continued use of Voxdrop following any modifications constitutes your formal acceptance of the revised Terms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">6. Contact Information</h2>
            <p className="text-muted-foreground leading-relaxed">
              For any legal inquiries, support requests, or general feedback, please contact us directly via email at <a href="mailto:techbros9694@gmail.com" className="text-brand hover:underline font-medium">techbros9694@gmail.com</a>.
            </p>
          </section>
        </div>
      </motion.div>
    </div>
  </section>
  );
}
