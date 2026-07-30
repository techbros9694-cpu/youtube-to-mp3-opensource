import React from "react";
import { motion } from "framer-motion";
import { Play, Download, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useConverter } from "@/hooks/use-converter";

// Extract YouTube video ID from any standard or shortened URL
function extractYoutubeVideoId(url: string): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = cleanUrl.match(regExp);
  if (match && match[1] && match[1].length === 11) {
    return match[1];
  }
  if (cleanUrl.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
    return cleanUrl;
  }
  return null;
}

export function PreviewCard() {
  const { metadata, status, url } = useConverter();
  const videoId = url ? extractYoutubeVideoId(url) : null;

  if (!metadata) {
    // Render a skeleton preview card if no metadata loaded yet
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6 opacity-60"
      >
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_1.2fr] md:items-center">
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-glass-border bg-surface-2 animate-pulse flex items-center justify-center">
            <Play className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <div>
            <div className="h-4 w-20 bg-surface-2 rounded mb-3 animate-pulse" />
            <div className="h-6 w-3/4 bg-surface-2 rounded mb-4 animate-pulse" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-surface-2 rounded-xl animate-pulse" />
              <div className="h-10 bg-surface-2 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_1.2fr] md:items-center">
        {/* Embed YouTube Player / Thumbnail */}
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-glass-border group bg-black">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              title={metadata.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : (
            <>
              <img
                src={metadata.thumbnail}
                alt={metadata.title}
                referrerPolicy="no-referrer"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-white/10 backdrop-blur-xl ring-1 ring-white/20 transition-transform hover:scale-105">
                  <Play className="h-6 w-6 translate-x-0.5 fill-white text-white" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Meta */}
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2">
            <Badge className="border-0 bg-[oklch(0.55_0.18_150/0.15)] text-[oklch(0.85_0.18_150)]">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-[oklch(0.75_0.2_150)] animate-pulse" />
              {status === "ready" ? "Ready to Download" : "Processing"}
            </Badge>
            <span className="text-xs text-muted-foreground">Video details loaded</span>
          </div>

          <h3 className="truncate-2-lines text-xl font-semibold tracking-tight text-foreground sm:text-2xl" title={metadata.title}>
            {metadata.title}
          </h3>

          {/* Action button */}
          <div className="mt-6 flex flex-col gap-2">
            <a
              href={`/api/download-file?url=${encodeURIComponent(metadata.downloadUrl)}&youtubeUrl=${encodeURIComponent(url)}&name=${encodeURIComponent(metadata.title)}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-sm font-medium text-brand-foreground shadow-[0_10px_30px_-10px_oklch(0.68_0.22_25/0.7)] hover:brightness-110 transition-all sm:text-base"
            >
              <Download className="h-5 w-5" />
              <span>Download MP3 Audio</span>
              <ExternalLink className="h-4 w-4 opacity-60" />
            </a>
            <p className="text-center text-xs text-muted-foreground/80 mt-1">
              High-speed direct MP3 conversion processed securely via server-side API.
            </p>
          </div>

        </div>
      </div>
    </motion.div>
  );
}


