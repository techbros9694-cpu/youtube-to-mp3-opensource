import React, { createContext, useContext, useState } from "react";
import axios from "axios";

export interface VideoMetadata {
  title: string;
  duration: string; // formatted e.g. "03:45"
  downloadUrl: string;
  thumbnail: string;
  channel: string;
  views: string;
  uploaded: string;
  size: string; // e.g. "8.4 MB"
  quality: string; // e.g. "320 kbps"
}

export type ConverterStatus = "idle" | "preparing" | "analyzing" | "fetching" | "ready" | "error";

interface ConverterContextType {
  url: string;
  status: ConverterStatus;
  progress: number;
  metadata: VideoMetadata | null;
  error: string | null;
  setUrl: (url: string) => void;
  startConversion: (url: string) => Promise<void>;
  reset: () => void;
}

const ConverterContext = createContext<ConverterContextType | undefined>(undefined);

export function ConverterProvider({ children }: { children: React.ReactNode }) {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ConverterStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [metadata, setMetadata] = useState<VideoMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  const simulateProgress = (target: number, duration: number): Promise<void> => {
    return new Promise((resolve) => {
      let start: number | null = null;
      const step = (timestamp: number) => {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const currentProgress = Math.min((elapsed / duration) * target, target);
        setProgress(Math.round(currentProgress));
        if (elapsed < duration) {
          window.requestAnimationFrame(step);
        } else {
          resolve();
        }
      };
      window.requestAnimationFrame(step);
    });
  };

  const startConversion = async (targetUrl: string) => {
    if (!targetUrl) return;
    setUrl(targetUrl);
    setError(null);
    setMetadata(null);
    
    try {
      // 1. Preparing
      setStatus("preparing");
      setProgress(5);
      await new Promise(r => setTimeout(r, 800));

      // 2. Analyzing
      setStatus("analyzing");
      await simulateProgress(40, 1000);

      // 3. Fetching Metadata
      setStatus("fetching");
      await simulateProgress(75, 1200);

      // Make actual API call to our local backend endpoint
      console.log("[Frontend] Calling backend API /api/convert for:", targetUrl);
      const response = await axios.get(`/api/convert`, {
        params: { url: targetUrl },
      });

      const data = response.data;
      console.log("[Frontend] Received response from backend API:", data);

      if (data && data.error) {
        throw new Error(typeof data.error === "string" ? data.error : (data.message || "Failed to fetch from conversion API"));
      }

      // Normalize fields from RapidAPI and our OEmbed helper
      const title = data.title || data.text || "Downloaded Audio";
      
      // Use duration returned from backend, or format rawDuration
      const durationStr = data.duration || "03:30";

      // Estimate audio size (e.g., at 320kbps, ~2.4MB per minute)
      let minutes = 3.5;
      const rawDuration = data.rawDuration || data.lengthSeconds || data.length;
      if (typeof rawDuration === "number") {
        minutes = rawDuration / 60;
      } else {
        const parts = durationStr.split(":");
        if (parts.length === 2) {
          minutes = parseInt(parts[0], 10) + parseInt(parts[1], 10) / 60;
        } else if (parts.length === 3) {
          minutes = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + parseInt(parts[2], 10) / 60;
        }
      }
      const estimatedSize = `${(minutes * 2.4).toFixed(1)} MB`;

      // Find the download URL (supporting downloadUrl, link, download_url, etc.)
      const downloadUrl = data.downloadUrl || data.link || data.download_url || data.url || "";
      if (!downloadUrl) {
        throw new Error("No download link was returned from the API.");
      }

      // Thumbnail check
      const videoIdMatch = targetUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
      const videoId = videoIdMatch ? videoIdMatch[1] : null;
      const thumbnail = data.thumbnail || data.image || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60");

      const channel = data.channel || data.author || data.channelTitle || "YouTube Creator";
      const views = data.views || "1,500,000";
      const uploaded = data.uploaded || data.date || "Recently";

      setMetadata({
        title,
        duration: durationStr,
        downloadUrl,
        thumbnail,
        channel,
        views,
        uploaded,
        size: estimatedSize,
        quality: "320 kbps",
      });

      // 4. Ready
      setProgress(100);
      setStatus("ready");
    } catch (err: any) {
      console.error("[Frontend] Conversion error:", err);
      
      let errorMessage = "An error occurred during conversion.";
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === "string") {
          errorMessage = data;
        } else if (data.error) {
          if (typeof data.error === "string") {
            errorMessage = data.error;
          } else if (typeof data.error === "object" && data.error !== null) {
            errorMessage = data.error.message || data.error.error || JSON.stringify(data.error);
          }
        } else if (data.message) {
          errorMessage = typeof data.message === "string" ? data.message : JSON.stringify(data.message);
        } else {
          errorMessage = JSON.stringify(data);
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setStatus("error");
    }
  };

  const reset = () => {
    setUrl("");
    setStatus("idle");
    setProgress(0);
    setMetadata(null);
    setError(null);
  };

  return (
    <ConverterContext.Provider
      value={{
        url,
        status,
        progress,
        metadata,
        error,
        setUrl,
        startConversion,
        reset,
      }}
    >
      {children}
    </ConverterContext.Provider>
  );
}

export function useConverter() {
  const context = useContext(ConverterContext);
  if (context === undefined) {
    throw new Error("useConverter must be used within a ConverterProvider");
  }
  return context;
}
