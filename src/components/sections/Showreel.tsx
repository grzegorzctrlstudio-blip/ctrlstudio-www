"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "motion/react";
import type { Homepage } from "@/lib/types";

const ShowreelText3D = dynamic(
  () => import("@/components/effects/ShowreelText3D").then((m) => m.ShowreelText3D),
  { ssr: false },
);

/**
 * Showreel (pinned stage): CONTENT · TECHNOLOGY · SPACE as real 3D extruded
 * chrome text, then a large 16:9 Vimeo window that scales up with scroll. The
 * iframe stays pointer-events-none (so the scroll-pin isn't trapped); audio is
 * driven through Vimeo's postMessage API by a persistent custom mute button.
 */
export function Showreel({ data }: { data: Homepage["showreel"] }) {
  const ref = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const radius = useTransform(scrollYProgress, [0, 0.2], [22, 12]);
  const topOpacity = useTransform(scrollYProgress, [0, 0.06], [0, 1]);

  // audio via Vimeo postMessage API (no SDK dependency)
  const [muted, setMuted] = useState(true);
  const post = (method: string, value: unknown) => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method, value }),
      "https://player.vimeo.com",
    );
  };
  const onIframeLoad = () => {
    window.setTimeout(() => post("setVolume", 0.5), 400);
  };
  const toggleMute = () => {
    setMuted((m) => {
      const next = !m;
      post("setMuted", next);
      if (!next) post("setVolume", 0.5);
      return next;
    });
  };

  const vimeoSrc = data.vimeoId
    ? `https://player.vimeo.com/video/${data.vimeoId}?autoplay=1&loop=1&muted=1&controls=0&dnt=1&title=0&byline=0&portrait=0`
    : undefined;

  return (
    <section ref={ref} id="showreel" className="relative h-[200vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center gap-5 overflow-hidden px-4 sm:gap-7">
        {/* CONTENT · TECHNOLOGY · SPACE — real 3D extruded chrome text */}
        <motion.div style={{ opacity: topOpacity }} className="flex w-full justify-center">
          <ShowreelText3D />
        </motion.div>

        {/* the big 16:9 window — scales up with scroll */}
        <motion.div
          style={{ scale, borderRadius: radius }}
          className="relative aspect-video max-h-[68svh] w-full max-w-[1600px] shrink-0 overflow-hidden border border-line-strong bg-black shadow-[0_60px_160px_-40px_rgba(107,121,255,0.55)]"
        >
          {vimeoSrc ? (
            <>
              <iframe
                ref={iframeRef}
                src={vimeoSrc}
                onLoad={onIframeLoad}
                title={data.title}
                allow="autoplay; fullscreen; picture-in-picture"
                className="pointer-events-none absolute inset-0 h-full w-full"
                style={{ border: 0 }}
              />
              <button
                type="button"
                onClick={toggleMute}
                aria-label={muted ? "Włącz dźwięk" : "Wycisz"}
                className="pointer-events-auto absolute bottom-4 right-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-line-strong bg-bg/70 text-ink backdrop-blur transition-colors hover:bg-bg-elevated"
              >
                {muted ? <MutedIcon /> : <SoundIcon />}
              </button>
            </>
          ) : (
            <video
              src={data.src}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>
      </div>
    </section>
  );
}

function MutedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function SoundIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}
