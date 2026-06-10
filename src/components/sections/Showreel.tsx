"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

const ShowreelText3D = dynamic(
  () => import("@/components/effects/ShowreelText3D").then((m) => m.ShowreelText3D),
  { ssr: false },
);

/**
 * Showreel (pinned stage), choreographed one-after-another over a long scroll:
 *   1. CONTENT · TECHNOLOGY · SPACE (3D chrome) sweeps slowly left → right and
 *      clears BEFORE the window takes over (no overlap).
 *   2. The 16:9 Vimeo window slides up + scales to fill the screen.
 *   3. It holds, then shrinks back as the next section scrolls in.
 * Playback is gated to visibility: the video only plays while the stage is on
 * screen and pauses (freeing audio) when you scroll away — ready to resume on
 * return. Audio never starts on page load; it rides Vimeo's postMessage API and
 * only turns on when the user presses the (large, labelled) sound button.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // 1) text sweeps slowly across and clears
  // CONTENT · TECHNOLOGY · SPACE + the window come in TOGETHER, zooming out from
  // the centre right after the hero; the window then holds full and zooms back out.
  const textScale = useTransform(scrollYProgress, [0, 0.18], [0.6, 1]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.08, 0.22, 0.32], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.18, 0.78, 0.92], [0.35, 1, 1, 0.42]);
  const winOpacity = useTransform(scrollYProgress, [0, 0.12, 0.82, 0.9], [0, 1, 1, 0]);
  const radius = useTransform(scrollYProgress, [0, 0.18], [30, 0]);

  // play only while the stage is on screen; pause (freeing audio) otherwise
  const [active, setActive] = useState(false);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => setActive(e.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const win = iframeRef.current?.contentWindow;
    if (!win) return;
    win.postMessage(
      JSON.stringify({ method: active ? "play" : "pause" }),
      "https://player.vimeo.com",
    );
  }, [active]);

  // audio stays off until the user presses the button
  const [muted, setMuted] = useState(true);
  const post = (method: string, value?: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, value }),
      "https://player.vimeo.com",
    );
  };
  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      post("setMuted", next);
      if (!next) post("setVolume", 0.6);
      return next;
    });
  };

  // no `autoplay` → it won't start on page load; we drive play/pause by visibility
  const vimeoSrc = data.vimeoId
    ? `https://player.vimeo.com/video/${data.vimeoId}?autoplay=1&loop=1&muted=1&controls=0&dnt=1&title=0&byline=0&portrait=0`
    : undefined;

  return (
    <section ref={ref} id="showreel" className="relative h-[300vh]">
      <div
        ref={stageRef}
        className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden"
      >
        {/* 2/3) the big window — fills the screen at peak */}
        <motion.div
          style={{ scale, opacity: winOpacity, borderRadius: radius }}
          className="absolute inset-0 overflow-hidden border border-line-strong/50 bg-black shadow-[0_60px_160px_-40px_rgba(107,121,255,0.55)]"
        >
          {vimeoSrc ? (
            <>
              <iframe
                ref={iframeRef}
                src={vimeoSrc}
                title={data.title}
                allow="autoplay; fullscreen; picture-in-picture"
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  border: 0,
                  background: "#000",
                  width: "max(100vw, 177.78svh)",
                  height: "max(100svh, 56.25vw)",
                }}
              />
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
                className="pointer-events-auto absolute bottom-5 right-5 z-10 flex items-center gap-2.5 rounded-full border border-line-strong bg-bg/75 py-2.5 pl-3.5 pr-4 text-ink shadow-lg backdrop-blur transition-colors hover:bg-bg-elevated"
              >
                {muted ? <MutedIcon /> : <SoundIcon />}
                <span className="text-sm font-medium">
                  {muted ? "Włącz dźwięk" : "Wycisz"}
                </span>
              </button>
            </>
          ) : (
            <video
              src={data.src}
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>

        {/* 1) CONTENT · TECHNOLOGY · SPACE — sweeps left → right, clears first */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-screen -translate-x-1/2 -translate-y-1/2">
          <motion.div style={{ scale: textScale, opacity: textOpacity }}>
            <ShowreelText3D />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function MutedIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
