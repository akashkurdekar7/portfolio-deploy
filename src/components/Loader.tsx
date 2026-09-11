import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  /** Called once the loader has fully slid away and the site is revealed. */
  onComplete?: () => void;
  /** Called the moment the loader settles in its stuck, mid-screen position. */
  onStuck?: () => void;
  /** Called right before the loader slides fully away (auto-dismiss). */
  onDismiss?: () => void;
}

const WORD = "PORTFOLIO";
const BALL_SIZE = window.innerWidth <= 991 ? 12 : 24;
const BOUNCE_HEIGHT = 110;
const HOP_DURATION = 0.34;
const HOP_PAUSE = 0.06;
const SETTLE_HOLD = 0.4;

const Loader = ({ onComplete, onStuck, onDismiss }: LoaderProps) => {
  const [hidden, setHidden] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const onStuckRef = useRef(onStuck);
  const onDismissRef = useRef(onDismiss);
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onStuckRef.current = onStuck;
    onDismissRef.current = onDismiss;
    onCompleteRef.current = onComplete;
  });

  useLayoutEffect(() => {
    const container = containerRef.current;
    const row = rowRef.current;
    const ball = ballRef.current;
    if (!container || !row || !ball) return;

    let cancelled = false;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();

    const unlockScroll = () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      window.__lenis?.start();
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const reveal = () => {
      setHidden(true);
      onCompleteRef.current?.();
    };

    const dismiss = () => {
      onDismissRef.current?.();
      unlockScroll();
    };

    const build = () => {
      if (cancelled) return;
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];
      if (!letters.length) return;

      if (reducedMotion) {
        gsap.set(letters, { scale: 1 });
        gsap.set(ball, { autoAlpha: 0 });

        const tl = gsap.timeline();
        timelineRef.current = tl;
        tl.call(() => onStuckRef.current?.());
        tl.to({}, { duration: SETTLE_HOLD + 0.6 });
        tl.call(dismiss);
        tl.to(container, { y: "-100vh", duration: 0.5, ease: "power1.inOut", onComplete: reveal });
        return;
      }

      const rowRect = row.getBoundingClientRect();
      const xs = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return r.left - rowRect.left + r.width / 2 - BALL_SIZE / 2;
      });
      const landYs = letters.map((el) => {
        const r = el.getBoundingClientRect();
        return r.top - rowRect.top - BALL_SIZE * 0.65;
      });
      const entryY = landYs[0] - BOUNCE_HEIGHT * 1.4;

      // A landed ball squashes flat and springs back; the letter beneath it
      // gets stamped down to nothing then pops back up once the ball has
      // moved on, like a whack-a-mole hit rather than a permanent erase.
      const impact = (i: number) => {
        gsap.to(ball, {
          scaleX: 1.55,
          scaleY: 0.5,
          duration: 0.07,
          ease: "power1.out",
          onComplete: () => gsap.to(ball, { scaleX: 1, scaleY: 1, duration: 0.22, ease: "elastic.out(1,0.45)" }),
        });

        gsap.to(letters[i], {
          scaleY: 0,
          duration: 0.28,
          ease: "back.in(1.8)",
          onComplete: () => gsap.to(letters[i], { scale: 1, duration: 0.45, ease: "elastic.out(1,0.5)" }),
        });
      };

      const tl = gsap.timeline();
      timelineRef.current = tl;

      tl.set(letters, { scale: 1, transformOrigin: "50% 100%" }, 0);
      tl.set(ball, { x: xs[0], y: entryY, scaleX: 1, scaleY: 1 }, 0);
      tl.set(container, { y: 0 }, 0);

      tl.to(ball, { y: landYs[0], duration: HOP_DURATION * 0.7, ease: "power2.in", onComplete: () => impact(0) }, 0);

      let cursor = HOP_DURATION * 0.7 + HOP_PAUSE;
      let lastLandTime = cursor;
      for (let i = 1; i < letters.length; i++) {
        const upDur = HOP_DURATION * 0.42;
        const downDur = HOP_DURATION * 0.58;
        const peakY = landYs[i] - BOUNCE_HEIGHT;

        tl.to(ball, { x: xs[i], duration: HOP_DURATION, ease: "none" }, cursor);
        tl.to(ball, { y: peakY, duration: upDur, ease: "power2.out" }, cursor);
        tl.to(ball, { y: landYs[i], duration: downDur, ease: "power2.in", onComplete: () => impact(i) }, cursor + upDur);

        lastLandTime = cursor + upDur + downDur;
        cursor += HOP_DURATION + HOP_PAUSE;
      }

      tl.call(() => onStuckRef.current?.(), [], lastLandTime);

      // Once the last letter is stamped flat, hold for a beat, dismiss, then
      // slide the whole loader up and away.
      tl.call(dismiss, [], lastLandTime + SETTLE_HOLD);
      tl.to(container, { y: "-100vh", duration: 0.7, ease: "power3.in", onComplete: reveal }, lastLandTime + SETTLE_HOLD);
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => requestAnimationFrame(build));
    } else {
      requestAnimationFrame(build);
    }

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
      unlockScroll();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={containerRef}
      className="loader-overlay min-h-dvh fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
    >
      <div ref={rowRef} className="font-bricolage-semibold relative inline-flex size90 leading-none uppercase">
        <div
          ref={ballRef}
          className="absolute top-0 left-0 rounded-full bg-orange [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          style={{ width: BALL_SIZE, height: BALL_SIZE }}
        />
        {WORD.split("").map((char, i) => (
          <span
            key={i}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block will-change-transform [transform:translateZ(0)] [-webkit-transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
          >
            {char}
          </span>
        ))}
      </div>
      <span className="sr-only">Loading akash kurdekar portfolio</span>
    </div>
  );
};

export default Loader;
