import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const SCRAMBLE_CHARS = "abcdefghijklmnopqrstuvwxyz0123456789";

export interface ScrambleTarget {
  ref: RefObject<HTMLElement | null>;
  text: string;
}

export interface ScrambleGroup {
  trigger: RefObject<HTMLElement | null>;
  targets: ScrambleTarget[];
  start?: string;
  stagger?: number;
  duration?: number;
  speed?: number;
  // Extra delay (seconds) before the first target starts. Use this when the
  // targets sit inside their own opacity/entrance animation sharing the same
  // trigger — without it, the scramble can play out largely while still
  // invisible/mid-fade, so it never reads as a visible effect.
  delay?: number;
}

// Scrambles each target's text through random characters before resolving to
// the real string, once its group's trigger scrolls into view. Mirrors the
// reveal already used for project titles (ProjectCard) and the résumé's
// "View full screen" hover, applied here to section headings/eyebrows.
export const useScrambleReveal = (groups: ScrambleGroup[]) => {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      groups.forEach(({ trigger, targets, start = "top 80%", stagger = 0.15, duration = 1, speed = 0.35, delay = 0 }) => {
        if (!trigger.current) return;

        const tl = gsap.timeline({
          scrollTrigger: { trigger: trigger.current, start, once: true },
        });

        targets.forEach(({ ref, text }, index) => {
          if (!ref.current || !text) return;
          tl.to(
            ref.current,
            {
              duration,
              ease: "none",
              scrambleText: { text, chars: SCRAMBLE_CHARS, revealDelay: 0.15, speed, tweenLength: false },
            },
            delay + index * stagger,
          );
        });
      });
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
