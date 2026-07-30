import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Helper to resolve stable youtube download URLs via Loader.to API
async function fetchLoaderToDownloadUrl(youtubeUrl: string): Promise<string | null> {
  try {
    console.log(`[LoaderFallback] Initiating download for ${youtubeUrl}`);
    const response = await axios.get("https://loader.to/ajax/download.php", {
      params: {
        button: 1,
        start: 1,
        end: 20,
        format: "mp3",
        url: youtubeUrl
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Origin": "https://loader.to",
        "Referer": "https://loader.to/"
      },
      timeout: 8000,
    });

    const progressUrl = response.data.progress_url;
    if (!progressUrl) {
      console.error("[LoaderFallback] No progress_url in response");
      return null;
    }

    console.log(`[LoaderFallback] Dynamic progress URL: ${progressUrl}. Polling...`);
    // Poll progress every 1.5 seconds, max 30 times (45 seconds total)
    for (let i = 1; i <= 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const progRes = await axios.get(progressUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Referer": "https://loader.to/"
        },
        timeout: 5000
      });

      const { success, progress, download_url, text } = progRes.data;
      console.log(`[LoaderFallback] Poll ${i}: success=${success}, progress=${progress}, text=${text}`);

      if (success === 1 || success === true || progress >= 100) {
        if (download_url) {
          return download_url;
        }
      }
      if (text && text.includes("Error")) {
        console.error(`[LoaderFallback] Error from progress API: ${text}`);
        return null;
      }
    }
    return null;
  } catch (err: any) {
    console.error("[LoaderFallback] Failed to resolve loader.to download url:", err.message);
    return null;
  }
}

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

// Parse ISO 8601 Duration (e.g. PT3M45S)
function parseISODuration(isoDuration: string): number {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0", 10);
  const minutes = parseInt(match[2] || "0", 10);
  const seconds = parseInt(match[3] || "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}

// Convert dynamic length seconds or ISO duration into MM:SS format
function durationToMMSS(durationInput: any): string {
  if (!durationInput) return "00:00";
  let seconds = 0;
  if (typeof durationInput === "string") {
    if (durationInput.startsWith("PT")) {
      seconds = parseISODuration(durationInput);
    } else {
      seconds = parseInt(durationInput, 10);
    }
  } else if (typeof durationInput === "number") {
    seconds = durationInput;
  }

  if (isNaN(seconds) || seconds <= 0) {
    if (typeof durationInput === "string" && durationInput.includes(":")) {
      return durationInput;
    }
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

// Clean up dynamic publish date to readable text format
function cleanPublishDate(publishDateInput: any): string {
  if (!publishDateInput) return "Recently";
  const str = String(publishDateInput).trim();
  if (str.includes("ago") || str.includes("yesterday")) {
    return str;
  }
  try {
    const date = new Date(str);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (e) {
    // fallback
  }
  return str;
}

// Scrape YouTube watch page HTML as a resilient, key-less fallback for real metadata
async function scrapeYoutubeVideoPage(videoId: string): Promise<any> {
  try {
    const watchUrl = `https://www.youtube.com/watch?v=${videoId}`;
    console.log(`[Scraper] Fetching YouTube watch page HTML: ${watchUrl}`);
    const res = await axios.get(watchUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
      },
      timeout: 8000,
    });

    const html = res.data;
    if (typeof html !== "string") return null;

    let title = "";
    let views = "";
    let duration = "";
    let uploaded = "";
    let channel = "";
    let rawDuration: any = null;

    // 1. Try meta tags (extremely stable across YouTube updates)
    const titleMatch = html.match(/<meta\s+name="title"\s+content="([^"]*)"/i) || html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
    if (titleMatch) title = titleMatch[1];

    const viewsMatch = html.match(/<meta\s+itemprop="interactionCount"\s+content="([^"]*)"/i);
    if (viewsMatch) {
      const rawViews = viewsMatch[1];
      const count = Number(rawViews);
      if (!isNaN(count) && count > 0) {
        views = count.toLocaleString();
      } else {
        views = rawViews;
      }
    }

    const durationMatch = html.match(/<meta\s+itemprop="duration"\s+content="([^"]*)"/i);
    if (durationMatch) {
      const isoDuration = durationMatch[1]; // e.g. PT3M45S
      duration = durationToMMSS(isoDuration);
      rawDuration = parseISODuration(isoDuration);
    }

    const dateMatch = html.match(/<meta\s+itemprop="uploadDate"\s+content="([^"]*)"/i) || html.match(/<meta\s+itemprop="datePublished"\s+content="([^"]*)"/i);
    if (dateMatch) {
      uploaded = cleanPublishDate(dateMatch[1]);
    }

    const channelMatch = html.match(/<link\s+itemprop="name"\s+content="([^"]*)"/i);
    if (channelMatch) {
      channel = channelMatch[1];
    }

    // 2. Try JSON ytInitialPlayerResponse parsing if anything is still missing
    if (!title || !views || !duration || !channel) {
      console.log("[Scraper] Missing some metadata from tags. Attempting ytInitialPlayerResponse parsing...");
      const jsonMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});\s*(?:var\s+|$)/i) || 
                        html.match(/ytInitialPlayerResponse\s*=\s*({.+?});<\/script>/i) ||
                        html.match(/var\s+ytInitialPlayerResponse\s*=\s*({.+?});/i);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[1]);
          const videoDetails = parsed.videoDetails;
          if (videoDetails) {
            if (!title) title = videoDetails.title;
            if (!channel) channel = videoDetails.author || videoDetails.channelTitle;
            if (!views && videoDetails.viewCount) {
              const count = Number(videoDetails.viewCount);
              views = !isNaN(count) ? count.toLocaleString() : videoDetails.viewCount;
            }
            if (!duration && videoDetails.lengthSeconds) {
              rawDuration = parseInt(videoDetails.lengthSeconds, 10);
              duration = durationToMMSS(rawDuration);
            }
          }
        } catch (jsonErr) {
          console.warn("[Scraper] Failed to parse ytInitialPlayerResponse JSON:", jsonErr);
        }
      }
    }

    // HTML decoding helper for entities
    const decodeHTMLEntities = (str: string) => {
      if (!str) return "";
      return str
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'");
    };

    title = decodeHTMLEntities(title);
    channel = decodeHTMLEntities(channel);

    console.log("[Scraper] Successfully extracted:", { title, channel, views, duration, uploaded });

    return {
      title: title || undefined,
      channel: channel || undefined,
      views: views || undefined,
      duration: duration || undefined,
      uploaded: uploaded || undefined,
      rawDuration,
    };
  } catch (err: any) {
    console.error(`[Scraper] Failed to scrape watch page for ${videoId}:`, err.message);
    return null;
  }
}

const app = express();

// Configure CORS
app.use(cors());
app.use(express.json());

// API Endpoints
app.get("/api/convert", async (req, res) => {
  try {
    const videoUrl = req.query.url;

    if (!videoUrl || typeof videoUrl !== "string") {
      return res.status(400).json({ error: "Missing or invalid 'url' query parameter" });
    }

    // Extract RapidAPI Key strictly from environment variables
    const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || process.env.VITE_RAPIDAPI_KEY;
    if (!rapidApiKey) {
      console.error("[Backend] Missing RAPIDAPI_KEY environment variable. Request blocked.");
      return res.status(200).json({
        error: "Failed to fetch from conversion API",
        message: "Server Configuration Error: RAPIDAPI_KEY is not defined. Please configure it in your hosting platform dashboard."
      });
    }

    // Input sanitization: Validate URL structure, strip tracking query parameters (like ?si=), and convert mobile shorts
    let sanitizedUrl = videoUrl.trim();

    // 1. If it contains youtu.be, translate it to a full YouTube watch URL
    if (sanitizedUrl.includes("youtu.be/")) {
      const match = sanitizedUrl.match(/youtu\.be\/([^"&?\/\s]{11})/i);
      if (match && match[1]) {
        sanitizedUrl = `https://www.youtube.com/watch?v=${match[1]}`;
      }
    }

    // 2. Strip away any tracking parameters (like ?si= or general query parameters except for the critical 'v')
    if (sanitizedUrl.includes("?")) {
      try {
        const parsedUrlForClean = new URL(sanitizedUrl);
        const videoParam = parsedUrlForClean.searchParams.get("v");
        if (videoParam) {
          sanitizedUrl = `${parsedUrlForClean.origin}${parsedUrlForClean.pathname}?v=${videoParam}`;
        } else {
          // Truncate everything from the question mark onward
          sanitizedUrl = sanitizedUrl.split("?")[0];
        }
      } catch (e) {
        sanitizedUrl = sanitizedUrl.split("?")[0];
      }
    }

    // 3. Enforce safe protocols (http/https)
    try {
      const parsedUrl = new URL(sanitizedUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return res.status(400).json({ error: "Invalid URL protocol. Only http: and https: are allowed." });
      }
      sanitizedUrl = parsedUrl.toString();
    } catch (e) {
      // Allow raw 11-character YouTube video IDs
      const trimmed = sanitizedUrl.trim();
      if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        sanitizedUrl = trimmed;
      } else {
        return res.status(400).json({ error: "Invalid 'url' format." });
      }
    }

    const videoId = extractYoutubeVideoId(sanitizedUrl);
    const cleanUrlForApi = videoId ? `https://www.youtube.com/watch?v=${videoId}` : sanitizedUrl;

    let liveMetadata: any = null;

    if (videoId) {
      try {
        console.log(`[Backend] Fetching live metadata from yt-api.p.rapidapi.com for videoId: ${videoId}`);
        const ytRes = await axios.get("https://yt-api.p.rapidapi.com/video/info", {
          params: { id: videoId },
          headers: {
            "X-RapidAPI-Host": "yt-api.p.rapidapi.com",
            "X-RapidAPI-Key": rapidApiKey,
          },
          timeout: 10000,
        });

        if (ytRes.data) {
          const apiData = ytRes.data;
          console.log(`[Backend] Received metadata from yt-api:`, apiData);

          // Check if we got a valid response (contains title or text)
          if (apiData.title || apiData.text) {
            // 1. Format view count dynamically using Number(data.viewCount).toLocaleString()
            const rawViewCount = apiData.viewCount || apiData.views || "0";
            let formattedViews = "0";
            try {
              formattedViews = Number(rawViewCount).toLocaleString();
              if (isNaN(Number(rawViewCount))) {
                formattedViews = String(rawViewCount);
              }
            } catch (e) {
              formattedViews = String(rawViewCount);
            }

            // 2. Convert dynamic length seconds or ISO duration into 'MM:SS' format
            const rawLength = apiData.lengthSeconds || apiData.duration || apiData.length;
            const formattedDuration = durationToMMSS(rawLength);

            // 3. Clean up the dynamic publish date into a readable text format
            const rawPublishDate = apiData.publishDate || apiData.publishedDate || apiData.publish_date || apiData.date;
            const formattedPublishDate = cleanPublishDate(rawPublishDate);

            // Parse thumbnail with robust fallbacks
            let thumbnail = "";
            if (apiData.thumbnail && Array.isArray(apiData.thumbnail) && apiData.thumbnail.length > 0) {
              const lastThumb = apiData.thumbnail[apiData.thumbnail.length - 1];
              const firstThumb = apiData.thumbnail[0];
              thumbnail = lastThumb?.url || firstThumb?.url || (typeof lastThumb === "string" ? lastThumb : "") || (typeof firstThumb === "string" ? firstThumb : "") || "";
            } else if (apiData.thumbnail && typeof apiData.thumbnail === "string") {
              thumbnail = apiData.thumbnail;
            } else if (apiData.thumbnail && typeof apiData.thumbnail === "object") {
              thumbnail = apiData.thumbnail.url || "";
            }
            
            if (!thumbnail) {
              thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
            }

            liveMetadata = {
              title: apiData.title || apiData.text,
              channel: apiData.channelTitle || apiData.author || apiData.channel || "YouTube Creator",
              views: formattedViews,
              duration: formattedDuration,
              uploaded: formattedPublishDate,
              thumbnail: thumbnail,
              rawDuration: rawLength,
              rawViewCount: rawViewCount,
            };
          }
        }
      } catch (ytErr: any) {
        console.error(`[Backend] yt-api.p.rapidapi.com error:`, ytErr.message || ytErr);
      }
    }

    // Fallback to direct HTML scraper if live metadata from yt-api failed
    if (!liveMetadata && videoId) {
      console.log(`[Backend] Falling back to direct HTML scraper for videoId: ${videoId}`);
      const scraped = await scrapeYoutubeVideoPage(videoId);
      if (scraped && scraped.title) {
        liveMetadata = {
          ...scraped,
          thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
        };
        console.log("[Backend] Direct HTML scraper succeeded:", liveMetadata);
      }
    }

    // Fallback to oembed if both live metadata and scraper failed
    if (!liveMetadata) {
      console.log(`[Backend] Falling back to oembed metadata for: ${videoUrl}`);
      let title = "Downloaded Audio";
      let author = "YouTube Creator";
      let thumbnail = "";

      try {
        const oembedRes = await axios.get("https://www.youtube.com/oembed", {
          params: { url: videoUrl, format: "json" },
          timeout: 6000,
        });
        if (oembedRes.data) {
          title = oembedRes.data.title || title;
          author = oembedRes.data.author_name || author;
          thumbnail = oembedRes.data.thumbnail_url || thumbnail;
        }
      } catch (oembedErr: any) {
        console.warn("[Backend] Failed to fetch YouTube oembed:", oembedErr.message || oembedErr);
      }

      liveMetadata = {
        title,
        channel: author,
        views: "1,500,000",
        duration: "03:30",
        uploaded: "Recently",
        thumbnail: thumbnail || (videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&auto=format&fit=crop&q=60"),
      };
    }

    try {
      console.log(`[Backend] Fetching audio download link for: ${cleanUrlForApi}`);

      let apiData: any = null;
      let downloadUrl = "";

      // Attempt 1: GET to /download/mp3 with query param 'url'
      try {
        console.log("[Backend] Attempting GET /download/mp3 with query param 'url'...");
        const res = await axios.get("https://youtube-mp310.p.rapidapi.com/download/mp3", {
          params: { url: cleanUrlForApi },
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "youtube-mp310.p.rapidapi.com",
            "X-RapidAPI-Key": rapidApiKey,
          },
          timeout: 10000,
        });
        console.log("[Backend] Attempt 1 Response:", res.data);
        if (res.data && !res.data.error && (!res.data.message || !res.data.message.includes("Invalid Session"))) {
          if (res.data.downloadUrl || res.data.link || res.data.download_url || res.data.url || res.data.id || res.data.jobId || res.data.job_id || res.data.token) {
            apiData = res.data;
          }
        }
      } catch (err: any) {
        console.warn("[Backend] Attempt 1 failed:", err.message || err);
      }

      // Attempt 2: POST to /download/mp3 with JSON body { url: cleanUrlForApi }
      if (!apiData) {
        try {
          console.log("[Backend] Attempting POST /download/mp3 with JSON body { url }...");
          const res = await axios.post("https://youtube-mp310.p.rapidapi.com/download/mp3", 
            { url: cleanUrlForApi },
            {
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "youtube-mp310.p.rapidapi.com",
                "X-RapidAPI-Key": rapidApiKey,
              },
              timeout: 10000,
            }
          );
          console.log("[Backend] Attempt 2 Response:", res.data);
          if (res.data && !res.data.error && (!res.data.message || !res.data.message.includes("Invalid Session"))) {
            if (res.data.downloadUrl || res.data.link || res.data.download_url || res.data.url || res.data.id || res.data.jobId || res.data.job_id || res.data.token) {
              apiData = res.data;
            }
          }
        } catch (err: any) {
          console.warn("[Backend] Attempt 2 failed:", err.message || err);
        }
      }

      // Attempt 3: GET to /convert with query param 'url'
      if (!apiData) {
        try {
          console.log("[Backend] Attempting GET /convert with query param 'url'...");
          const res = await axios.get("https://youtube-mp310.p.rapidapi.com/convert", {
            params: { url: cleanUrlForApi, format: "mp3" },
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": "youtube-mp310.p.rapidapi.com",
              "X-RapidAPI-Key": rapidApiKey,
            },
            timeout: 10000,
          });
          console.log("[Backend] Attempt 3 Response:", res.data);
          if (res.data && !res.data.error && (!res.data.message || !res.data.message.includes("Invalid Session"))) {
            if (res.data.downloadUrl || res.data.link || res.data.download_url || res.data.url || res.data.id || res.data.jobId || res.data.job_id || res.data.token) {
              apiData = res.data;
            }
          }
        } catch (err: any) {
          console.warn("[Backend] Attempt 3 failed:", err.message || err);
        }
      }

      // Attempt 4: POST to /convert with JSON body { url }
      if (!apiData) {
        try {
          console.log("[Backend] Attempting POST /convert with JSON body { url }...");
          const res = await axios.post("https://youtube-mp310.p.rapidapi.com/convert", 
            { url: cleanUrlForApi, format: "mp3" },
            {
              headers: {
                "Content-Type": "application/json",
                "X-RapidAPI-Host": "youtube-mp310.p.rapidapi.com",
                "X-RapidAPI-Key": rapidApiKey,
              },
              timeout: 10000,
            }
          );
          console.log("[Backend] Attempt 4 Response:", res.data);
          if (res.data && !res.data.error && (!res.data.message || !res.data.message.includes("Invalid Session"))) {
            if (res.data.downloadUrl || res.data.link || res.data.download_url || res.data.url || res.data.id || res.data.jobId || res.data.job_id || res.data.token) {
              apiData = res.data;
            }
          }
        } catch (err: any) {
          console.warn("[Backend] Attempt 4 failed:", err.message || err);
        }
      }

      // Multi-step job workflow polling if needed
      if (apiData) {
        const jobId = apiData.id || apiData.jobId || apiData.job_id || apiData.token || apiData.hash || apiData.taskId || apiData.task_id;
        const initialUrl = apiData.downloadUrl || apiData.link || apiData.download_url || apiData.url;

        if (initialUrl && !initialUrl.includes("message") && !jobId) {
          downloadUrl = initialUrl;
        } else if (jobId) {
          console.log(`[Backend] Two-step fetching initiated for job ID: ${jobId}`);
          
          const pollEndpoints = [
            "https://youtube-mp310.p.rapidapi.com/status",
            "https://youtube-mp310.p.rapidapi.com/progress",
            "https://youtube-mp310.p.rapidapi.com/download/mp3"
          ];

          for (const endpoint of pollEndpoints) {
            try {
              console.log(`[Backend] Polling ${endpoint} for job: ${jobId}...`);
              for (let pollCount = 1; pollCount <= 4; pollCount++) {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const pollRes = await axios.get(endpoint, {
                  params: {
                    id: jobId,
                    jobId: jobId,
                    job_id: jobId,
                    token: jobId,
                    hash: jobId
                  },
                  headers: {
                    "X-RapidAPI-Host": "youtube-mp310.p.rapidapi.com",
                    "X-RapidAPI-Key": rapidApiKey,
                  },
                  timeout: 8000,
                });

                console.log(`[Backend] Poll ${pollCount} response:`, pollRes.data);
                const polledUrl = pollRes.data?.downloadUrl || pollRes.data?.link || pollRes.data?.download_url || pollRes.data?.url;
                if (polledUrl && !polledUrl.includes("message") && !polledUrl.includes("Invalid")) {
                  downloadUrl = polledUrl;
                  break;
                }
              }
              if (downloadUrl) break;
            } catch (pollErr: any) {
              console.warn(`[Backend] Polling ${endpoint} failed:`, pollErr.message || pollErr);
            }
          }
        }
      }

      // Final fallback to highly stable Loader.to resolver if we couldn't fetch a valid URL
      if (!downloadUrl) {
        console.log(`[Backend] RapidAPI flow failed or returned no URL. Falling back to Loader.to for: ${cleanUrlForApi}`);
        const fallbackUrl = await fetchLoaderToDownloadUrl(cleanUrlForApi);
        if (fallbackUrl) {
          downloadUrl = fallbackUrl;
          console.log(`[Backend] Resolved via Loader.to fallback: ${downloadUrl}`);
        }
      }

      const combinedData = {
        ...(apiData || {}),
        ...liveMetadata,
        downloadUrl: downloadUrl || "",
        success: !!downloadUrl,
      };

      return res.json(combinedData);
    } catch (error: any) {
      console.error("[Backend] RapidAPI download link Error:", error.message || error);
      
      // Send a clean 200 JSON error payload instead of a 500 status code as requested
      return res.status(200).json({
        error: "Failed to fetch from conversion API",
        message: error.message || "Failed to connect to converter service"
      });
    }
  } catch (globalErr: any) {
    console.error("[Backend] Serious unhandled error in /api/convert:", globalErr);
    return res.status(200).json({
      error: "Failed to fetch from conversion API",
      message: globalErr.message || String(globalErr)
    });
  }
});

// Download Proxy Endpoint
app.get("/api/download-file", async (req, res) => {
  const fileUrl = req.query.url;
  const originalName = typeof req.query.name === "string" ? req.query.name : "audio";
  const requestedYoutubeUrl = req.query.youtubeUrl;

  if (!fileUrl || typeof fileUrl !== "string") {
    return res.status(400).send("Missing or invalid 'url' query parameter");
  }

  // Input validation: Enforce safe URL and protocols for proxy target fileUrl
  let sanitizedFileUrl = "";
  try {
    const parsedUrl = new URL(fileUrl.trim());
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return res.status(400).send("Invalid protocol. Only http: and https: are allowed.");
    }
    sanitizedFileUrl = parsedUrl.toString();
  } catch (e) {
    return res.status(400).send("Invalid file url format.");
  }

  // Input validation: Enforce safe URL format for fallback requestedYoutubeUrl
  let sanitizedYoutubeUrl = "";
  if (requestedYoutubeUrl && typeof requestedYoutubeUrl === "string") {
    try {
      const parsedUrl = new URL(requestedYoutubeUrl.trim());
      if (parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:") {
        sanitizedYoutubeUrl = parsedUrl.toString();
      }
    } catch (e) {
      // Fallback for raw youtube ID
      const trimmed = requestedYoutubeUrl.trim();
      if (trimmed.length === 11 && /^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
        sanitizedYoutubeUrl = trimmed;
      }
    }
  }

  // Extract youtube url in case we need fallback
  let youtubeUrl = sanitizedYoutubeUrl || sanitizedFileUrl;
  if (!sanitizedYoutubeUrl) {
    if (sanitizedFileUrl.includes("?url=")) {
      youtubeUrl = decodeURIComponent(sanitizedFileUrl.split("?url=")[1]);
    } else if (sanitizedFileUrl.includes("&url=")) {
      youtubeUrl = decodeURIComponent(sanitizedFileUrl.split("&url=")[1]);
    }
  }

  let targetUrl = sanitizedFileUrl;

  try {
    // Proactive fallback for known broken/unstable robotilab.online links
    if (fileUrl.includes("robotilab.online")) {
      console.log(`[Backend] Proactive fallback: robotilab.online detected. Resolving via Loader.to for: ${youtubeUrl}`);
      const loaderUrl = await fetchLoaderToDownloadUrl(youtubeUrl);
      if (loaderUrl) {
        targetUrl = loaderUrl;
        console.log(`[Backend] Proactively swapped to Loader.to download link: ${targetUrl}`);
      } else {
        console.warn("[Backend] Proactive Loader.to fallback failed to resolve. Proceeding with original link...");
      }
    }

    console.log(`[Backend] Proxying download from target URL: ${targetUrl}`);

    // Sanitize filename to ensure safe download headers
    let safeName = originalName
      .replace(/[/\\?%*:|"<>\s]+/g, "_") // Replace unsafe characters with underscores
      .substring(0, 100); // Limit length

    if (!safeName.toLowerCase().endsWith(".mp3")) {
      safeName += ".mp3";
    }

    // Fetch the file as a stream
    const response = await axios({
      method: "get",
      url: targetUrl,
      responseType: "stream",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
      timeout: 45000, // 45s timeout for stream fetching
    });

    // Forward headers from target server or default to audio/mpeg
    const rawContentType = response.headers["content-type"];
    const contentType = typeof rawContentType === "string" ? rawContentType : "audio/mpeg";
    res.setHeader("Content-Type", contentType);

    // Force attachment download with sanitized filename
    const encodedName = encodeURIComponent(safeName);
    res.setHeader("Content-Disposition", `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`);

    // Pipe the incoming stream directly to the client
    response.data.pipe(res);

    // Log success when fully piped
    response.data.on("end", () => {
      console.log(`[Backend] Download stream proxy completed successfully for: ${safeName}`);
    });

  } catch (error: any) {
    console.error("[Backend] Download proxy error:", error.message || error);
    
    // If we failed and didn't use fallback yet (targetUrl is still the original fileUrl), try fallback here as a last-resort reactive step
    if (targetUrl === fileUrl) {
      try {
        console.log(`[Backend] Reactive fallback: Trying Loader.to for: ${youtubeUrl}`);
        const loaderUrl = await fetchLoaderToDownloadUrl(youtubeUrl);
        if (loaderUrl) {
          console.log(`[Backend] Reactive fallback successful. Redirecting to Loader.to direct link: ${loaderUrl}`);
          return res.redirect(loaderUrl);
        }
      } catch (fallbackErr: any) {
        console.error("[Backend] Reactive fallback failed:", fallbackErr.message || fallbackErr);
      }
    }

    // Fallback redirect to original fileUrl as final resort
    try {
      console.log("[Backend] Redirecting user to direct download link as final fallback...");
      return res.redirect(fileUrl);
    } catch (redirectError) {
      if (!res.headersSent) {
        return res.status(500).send("Download proxy failed and fallback redirect could not be processed.");
      }
    }
  }
});

export { app };
export default app;
