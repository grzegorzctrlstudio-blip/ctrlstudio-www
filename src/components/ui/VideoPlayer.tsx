"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
}

/**
 * Cinematic, accessible video block: lazy source (only loaded when scrolled
 * near), play/pause, mute, fullscreen, poster fallback. Degrades gracefully
 * if the file is missing (keeps the poster + a subtle "wkrótce" note).
 */
export function VideoPlayer({
  src,
  poster,
  label = "Showreel",
  className,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v || !src) return;
    if (v.paused) {
      v.play()
        .then(() => setPlaying(true))
        .catch(() => setErrored(true));
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  };

  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else el.requestFullscreen?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-bg-raised",
        className,
      )}
    >
      {/* poster underlay (always present) */}
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={poster ? { backgroundImage: `url(${poster})` } : undefined}
      />

      {inView && src && !errored && (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={poster}
          muted={muted}
          loop
          playsInline
          preload="none"
          aria-label={label}
          onError={() => setErrored(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* gradient + controls */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

      {/* center play button */}
      {!playing && (
        <button
          type="button"
          onClick={togglePlay}
          data-cursor
          aria-label={`Odtwórz ${label}`}
          className="absolute inset-0 z-10 grid place-items-center"
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-full border border-white/30 bg-black/30 backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
            <PlayIcon />
          </span>
        </button>
      )}

      {/* bottom control bar */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-between gap-4 p-4 sm:p-5">
        <span className="font-mono text-xs uppercase tracking-[0.28em] text-white/80">
          {label}
          {errored && <span className="ml-2 text-white/40">— wkrótce</span>}
        </span>
        <div className="flex items-center gap-2">
          <ControlButton
            label={playing ? "Pauza" : "Odtwórz"}
            onClick={togglePlay}
          >
            {playing ? <PauseIcon /> : <PlayIconSm />}
          </ControlButton>
          <ControlButton
            label={muted ? "Włącz dźwięk" : "Wycisz"}
            onClick={toggleMute}
          >
            {muted ? <MutedIcon /> : <SoundIcon />}
          </ControlButton>
          <ControlButton label="Pełny ekran" onClick={toggleFullscreen}>
            <ExpandIcon />
          </ControlButton>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      data-cursor
      className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-black/30 text-white/90 backdrop-blur-md transition-colors hover:border-white/40 hover:text-white"
    >
      {children}
    </button>
  );
}

/* — minimal inline icons (no icon dependency) — */
const PlayIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-white">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PlayIconSm = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
const SoundIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
  </svg>
);
const MutedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 9v6h4l5 5V4L7 9H3zm18 0-1.4-1.4L17 10.2 14.4 7.6 13 9l2.6 2.6L13 14.2l1.4 1.4 2.6-2.6 2.6 2.6L21 14.2 18.4 11.6z" />
  </svg>
);
const ExpandIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
  </svg>
);
