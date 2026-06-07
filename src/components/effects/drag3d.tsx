"use client";

import { useEffect, useRef, type MutableRefObject } from "react";
import { useThree } from "@react-three/fiber";

/** Shared "grab to spin" drag-orbit (drag with inertia) for R3F canvases. */
export type DragState = {
  dragging: boolean;
  rx: number;
  ry: number;
  vrx: number;
  vry: number;
  lx: number;
  ly: number;
};
export type DragRef = MutableRefObject<DragState>;

export function useDrag(): DragRef {
  return useRef<DragState>({
    dragging: false,
    rx: 0,
    ry: 0,
    vrx: 0,
    vry: 0,
    lx: 0,
    ly: 0,
  });
}

/** Attach pointer handlers to the canvas so it can be grabbed + spun. */
export function DragControls({ drag }: { drag: DragRef }) {
  const { gl } = useThree();
  useEffect(() => {
    const el = gl.domElement;
    el.style.touchAction = "pan-y"; // vertical swipe still scrolls the page
    el.style.cursor = "grab";
    const down = (e: PointerEvent) => {
      drag.current.dragging = true;
      drag.current.lx = e.clientX;
      drag.current.ly = e.clientY;
      drag.current.vrx = 0;
      drag.current.vry = 0;
      el.style.cursor = "grabbing";
    };
    const move = (e: PointerEvent) => {
      if (!drag.current.dragging) return;
      const dx = e.clientX - drag.current.lx;
      const dy = e.clientY - drag.current.ly;
      drag.current.lx = e.clientX;
      drag.current.ly = e.clientY;
      drag.current.ry += dx * 0.009;
      drag.current.rx += dy * 0.009;
      drag.current.vry = dx * 0.009;
      drag.current.vrx = dy * 0.009;
    };
    const up = () => {
      drag.current.dragging = false;
      el.style.cursor = "grab";
    };
    el.addEventListener("pointerdown", down);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [gl, drag]);
  return null;
}

/**
 * Advance inertia, then ease BOTH axes back to the home orientation. So after a
 * fling the element spins on, then always settles back to its starting pose.
 */
export function stepDrag(drag: DragRef) {
  const d = drag.current;
  if (!d.dragging) {
    d.rx += d.vrx;
    d.ry += d.vry;
    d.vrx *= 0.94;
    d.vry *= 0.94;
    d.rx *= 0.94; // return tilt to home
    d.ry *= 0.94; // return spin to home
  }
  d.rx = Math.max(-1.4, Math.min(1.4, d.rx));
}
