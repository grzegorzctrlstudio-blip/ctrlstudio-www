"use client";

import { useState } from "react";

interface VimeoEmbedProps {
  id: string;
  label?: string;
  /** Optional local fallback poster if the Vimeo thumbnail fails to load. */
  poster?: string;
}

/**
 * Click-to-play Vimeo facade: shows the video's thumbnail + a play button and
 * only loads the (heavy) Vimeo player iframe on demand — keeps the homepage
 * light while giving a premium poster state.
 */
export function VimeoEmbed({ id, label, poster }: VimeoEmbedProps) {
  const [playing, setPlaying] = useState(false);

  const src = `https://player.vimeo.com/video/${id}?autoplay=1&title=0&byline=0&portrait=0&dnt=1`;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-bg-raised">
      {playing ? (
        <iframe
          src={src}
          title={label || "Vimeo"}
          className="absolute inset-0 h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          data-cursor
          aria-label="Odtwórz showreel"
          className="group absolute inset-0 block"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://vumbnail.com/${id}.jpg`}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-500 group-hover:opacity-95"
            onError={(e) => {
              if (poster) e.currentTarget.src = poster;
            }}
          />
          <span className="absolute inset-0 bg-gradient-to-t from-bg/70 via-bg/20 to-bg/30" />
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-line-strong bg-bg/40 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-accent">
            <svg
              viewBox="0 0 24 24"
              className="ml-1 h-7 w-7 fill-ink"
              aria-hidden
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="absolute bottom-5 left-6 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-dim">
            Odtwórz showreel
          </span>
        </button>
      )}
    </div>
  );
}
