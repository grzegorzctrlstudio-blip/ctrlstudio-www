"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import { motion } from "motion/react";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc?: string;
  posterSrc?: string;
  /** Vimeo id — rendered as an autoplaying background-mode player as the media. */
  vimeoId?: string;
  /** Optional background image; if omitted a dark gradient is used. */
  bgImageSrc?: string;
  /** Skip the built-in aurora backdrop (e.g. when a 3D logo sits behind). */
  transparentBg?: boolean;
  title?: string;
  /** Three words that spread apart symmetrically as the media expands. */
  taglineWords?: [string, string, string];
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  onProgress?: (progress: number) => void;
  children?: ReactNode;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  vimeoId,
  bgImageSrc,
  transparentBg,
  title,
  taglineWords,
  date,
  scrollToExpand,
  textBlend,
  onExpandedChange,
  onProgress,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = clamp01(scrollProgress + scrollDelta);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = clamp01(scrollProgress + scrollDelta);
        setScrollProgress(newProgress);
        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => setTouchStartY(0);
    const handleScroll = (): void => {
      if (!mediaFullyExpanded) window.scrollTo(0, 0);
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll as EventListener);
    window.addEventListener("touchstart", handleTouchStart as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("touchmove", handleTouchMove as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("touchend", handleTouchEnd as EventListener);
    return () => {
      window.removeEventListener("wheel", handleWheel as unknown as EventListener);
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener("touchstart", handleTouchStart as unknown as EventListener);
      window.removeEventListener("touchmove", handleTouchMove as unknown as EventListener);
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = () => setIsMobileState(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    onExpandedChange?.(mediaFullyExpanded);
  }, [mediaFullyExpanded, onExpandedChange]);

  useEffect(() => {
    onProgress?.(scrollProgress);
  }, [scrollProgress, onProgress]);

  const mediaWidth = 300 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);
  const tagSpread = scrollProgress * (isMobileState ? 32 : 22);

  const mediaOpacity = clamp01(scrollProgress * 1.6);
  const taglineOpacity = clamp01((scrollProgress - 0.04) / 0.4);
  const hintOpacity = clamp01(1 - scrollProgress / 0.25);

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";

  const mediaInner = vimeoId ? (
    <div
      className="relative h-full w-full overflow-hidden rounded-xl"
      style={{ opacity: mediaOpacity }}
    >
      <iframe
        src={`https://player.vimeo.com/video/${vimeoId}?background=1&autoplay=1&muted=1&loop=1&dnt=1`}
        title="Showreel"
        allow="autoplay; fullscreen; picture-in-picture"
        className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2"
        style={{ border: 0 }}
      />
    </div>
  ) : mediaType === "video" ? (
    <div
      className="pointer-events-none relative h-full w-full"
      style={{ opacity: mediaOpacity }}
    >
      <video
        src={mediaSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="h-full w-full rounded-xl object-cover"
        controls={false}
        disablePictureInPicture
      />
      <motion.div
        className="absolute inset-0 rounded-xl bg-black/30"
        animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
      />
    </div>
  ) : (
    <div className="relative h-full w-full">
      <Image
        src={mediaSrc || ""}
        alt={title || "Media"}
        width={1280}
        height={720}
        className="h-full w-full rounded-xl object-cover"
      />
      <motion.div
        className="absolute inset-0 rounded-xl bg-black/50"
        animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
      />
    </div>
  );

  return (
    <div ref={sectionRef} className="overflow-x-hidden">
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-start">
        <div className="relative flex min-h-[100dvh] w-full flex-col items-center">
          {!transparentBg && (
            <motion.div
              className="absolute inset-0 z-0 h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 - scrollProgress }}
              transition={{ duration: 0.1 }}
            >
              <div
                className="bg-aurora-hero h-screen w-screen"
                style={
                  bgImageSrc
                    ? {
                        backgroundImage: `url(${bgImageSrc})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
          )}

          <div className="container relative z-10 mx-auto flex flex-col items-center justify-start">
            <div className="relative flex h-[100dvh] w-full flex-col items-center justify-center">
              <div
                className="absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 rounded-2xl transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "85vh",
                  boxShadow: vimeoId
                    ? `0 0 ${60 * mediaOpacity}px rgba(107,121,255,${0.25 * mediaOpacity})`
                    : "0px 0px 50px rgba(0,0,0,0.3)",
                }}
              >
                {mediaInner}

                {date && (
                  <div
                    className="relative z-10 mt-4 flex flex-col items-center text-center transition-none"
                    style={{ opacity: hintOpacity }}
                  >
                    <p
                      className="text-2xl text-accent-ink"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {date}
                    </p>
                  </div>
                )}
              </div>

              <div
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-4 text-center transition-none ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
              >
                {taglineWords ? (
                  <div
                    className="flex items-center justify-center gap-2 md:gap-5"
                    style={{ opacity: taglineOpacity }}
                  >
                    <span
                      className="font-display text-2xl font-bold uppercase tracking-tight text-gradient transition-none sm:text-4xl md:text-6xl"
                      style={{ transform: `translateX(-${tagSpread}vw)` }}
                    >
                      {taglineWords[0]}
                    </span>
                    <span className="font-display text-2xl font-bold uppercase tracking-tight text-gradient transition-none sm:text-4xl md:text-6xl">
                      {taglineWords[1]}
                    </span>
                    <span
                      className="font-display text-2xl font-bold uppercase tracking-tight text-gradient transition-none sm:text-4xl md:text-6xl"
                      style={{ transform: `translateX(${tagSpread}vw)` }}
                    >
                      {taglineWords[2]}
                    </span>
                  </div>
                ) : (
                  <>
                    <motion.div
                      className="font-display text-4xl font-bold uppercase tracking-tight text-ink transition-none md:text-5xl lg:text-6xl"
                      style={{ transform: `translateX(-${textTranslateX}vw)` }}
                    >
                      {firstWord}
                    </motion.div>
                    <motion.div
                      className="font-display text-4xl font-bold uppercase tracking-tight text-ink transition-none md:text-5xl lg:text-6xl"
                      style={{ transform: `translateX(${textTranslateX}vw)` }}
                    >
                      {restOfTitle}
                    </motion.div>
                  </>
                )}
              </div>

              {scrollToExpand && (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-10 flex justify-center"
                  style={{ opacity: hintOpacity }}
                >
                  <p className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-dim">
                    {scrollToExpand} ↓
                  </p>
                </div>
              )}
            </div>

            <motion.section
              className="flex w-full flex-col px-8 py-10 md:px-16 lg:py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
