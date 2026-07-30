import { motion } from "framer-motion";
import { Check, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useConverter } from "@/hooks/use-converter";

export function ProgressSection() {
  const { status, progress, error, reset } = useConverter();

  if (status === "idle") {
    return null;
  }

  if (status === "error") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6 border-destructive/30 bg-destructive/5"
      >
        <div className="flex items-start gap-4">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive">
            <AlertCircle className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] uppercase tracking-wider text-destructive font-semibold">
              Conversion Failed
            </div>
            <div className="mt-1 text-sm text-foreground/90 font-medium">
              {typeof error === "object" && error !== null
                ? ((error as any).message || (error as any).error || JSON.stringify(error))
                : (error || "An error occurred during the conversion request. Please check the URL or try again later.")}
            </div>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2 text-xs font-medium text-foreground border border-glass-border hover:bg-surface-3 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Try Another URL</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  const steps = [
    { 
      key: "prep", 
      label: "Preparing", 
      status: status === "preparing" ? "active" : "done" as const
    },
    { 
      key: "analyze", 
      label: "Analyzing URL", 
      status: status === "preparing" ? "pending" : status === "analyzing" ? "active" : "done" as const
    },
    { 
      key: "meta", 
      label: "Fetching Metadata", 
      status: (status === "preparing" || status === "analyzing") ? "pending" : status === "fetching" ? "active" : "done" as const
    },
    { 
      key: "ready", 
      label: "Ready", 
      status: status === "ready" ? "done" as const : "pending" as const
    },
  ];

  const getStatusText = () => {
    switch (status) {
      case "preparing":
        return "Initializing workflow…";
      case "analyzing":
        return "Analyzing YouTube link…";
      case "fetching":
        return "Requesting audio conversion from RapidAPI…";
      case "ready":
        return "Conversion complete!";
      default:
        return "Processing…";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-5 sm:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            Conversion Progress
          </div>
          <div className="mt-1 text-base font-medium text-foreground">
            {getStatusText()}
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-glass-border bg-surface-1 px-3 py-1.5 text-xs text-muted-foreground">
          {status !== "ready" && <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />}
          <span>{progress}% complete</span>
        </div>
      </div>

      {/* progress bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface-2">
        <motion.div
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.68 0.22 25), oklch(0.6 0.25 285))",
            boxShadow: "0 0 20px oklch(0.68 0.22 25 / 0.6)",
          }}
        />
      </div>

      {/* status chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {steps.map((s) => (
          <div
            key={s.key}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
              s.status === "done"
                ? "border-[oklch(0.5_0.15_150/0.4)] bg-[oklch(0.5_0.15_150/0.12)] text-[oklch(0.85_0.18_150)]"
                : s.status === "active"
                ? "border-brand/40 bg-brand/10 text-foreground"
                : "border-glass-border bg-surface-1 text-muted-foreground"
            }`}
          >
            {s.status === "done" ? (
              <Check className="h-3.5 w-3.5" />
            ) : s.status === "active" ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
            )}
            {s.label}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

