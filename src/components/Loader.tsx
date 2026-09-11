import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  /** Called once the loader has fully slid away and the site is revealed. */
  onComplete?: () => void;
  /** Called the moment the loader settles in its stuck, mid-screen position. */
  onStuck?: () => void;
  /** Called right before the loader slides fully away (dismiss click). */
  onDismiss?: () => void;
}

const HEADING = "portfolio";
const STUCK_AT = 1;
const GHOSTS = [-2, -1, 1, 2];
const DUST_COLS = 16;
const DUST_ROWS = 10;

/** Shatters `root` into a burst of fading motes in place of a plain fade/slide, then calls onDone. */
const disintegrate = (root: HTMLElement, onDone: () => void) => {
  const rect = root.getBoundingClientRect();
  const cellW = rect.width / DUST_COLS;
  const cellH = rect.height / DUST_ROWS;

  const container = document.createElement("div");
  container.className = "loader-dust";
  document.body.appendChild(container);

  const motes: HTMLSpanElement[] = [];
  for (let r = 0; r < DUST_ROWS; r++) {
    for (let c = 0; c < DUST_COLS; c++) {
      const mote = document.createElement("span");
      mote.className = "loader-dust-mote";
      const size = gsap.utils.random(4, 10);
      mote.style.width = `${size}px`;
      mote.style.height = `${size}px`;
      mote.style.left = `${rect.left + c * cellW + gsap.utils.random(-4, cellW - 4)}px`;
      mote.style.top = `${rect.top + r * cellH + gsap.utils.random(-4, cellH - 4)}px`;
      mote.style.background = Math.random() < 0.12 ? "var(--black)" : "var(--white)";
      container.appendChild(mote);
      motes.push(mote);
    }
  }

  gsap.set(root, { opacity: 0 });

  gsap.to(motes, {
    x: () => gsap.utils.random(-55, 55),
    y: () => gsap.utils.random(-150, -10),
    rotate: () => gsap.utils.random(-45, 45),
    scale: () => gsap.utils.random(0.4, 1.4),
    opacity: 0,
    duration: () => gsap.utils.random(0.7, 1.25),
    ease: "power1.out",
    stagger: { from: "random", amount: 0.45 },
    onComplete: () => {
      container.remove();
      onDone();
    },
  });
};

const Loader = ({ onComplete, onStuck, onDismiss }: LoaderProps) => {
  const [hidden, setHidden] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const scribbleRefs = useRef<HTMLDivElement[]>([]);
  const arrowPathRefs = useRef<SVGPathElement[]>([]);
  const onStuckRef = useRef(onStuck);
  const progressState = useRef({ val: 0 }).current;

  const setProgress = (val: number) => {
    const pct = Math.round(val);
    if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
    if (progressLabelRef.current) progressLabelRef.current.textContent = `${pct}%`;
  };

  useEffect(() => {
    onStuckRef.current = onStuck;
  });

  useEffect(() => {
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
    const ghosts = rootRef.current ? Array.from(rootRef.current.querySelectorAll<HTMLElement>(".loader-heading-ghost")) : [];
    const mainHeadingEl = rootRef.current?.querySelector<HTMLElement>(".loader-heading-main");
    const headingFontSize = mainHeadingEl ? parseFloat(window.getComputedStyle(mainHeadingEl).fontSize) : 100;
    const ghostOffsetUnit = headingFontSize * 0.27;

    let stuckTween: gsap.core.Tween | undefined;
    let progressTween: gsap.core.Tween | undefined;

    const ctx = gsap.context(() => {
      gsap.set([headingWrapRef.current, progressLabelRef.current], { opacity: 0, y: 14 });

      gsap.to([headingWrapRef.current, progressLabelRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });

      progressTween = gsap.to(progressState, {
        val: 50,
        duration: STUCK_AT,
        delay: 0.3,
        ease: "power1.inOut",
        onUpdate: () => setProgress(progressState.val),
      });

      const stuckCall = gsap.delayedCall(STUCK_AT, () => {
        let blurTriggered = false;

        if (ghosts.length) {
          const ghostOpacity = (_i: number, target: HTMLElement) => (Math.abs(Number(target.dataset.dir)) === 1 ? 0.35 : 0.15);

          if (reducedMotion) {
            gsap.set(ghosts, {
              y: (_i, target) => Number(target.dataset.dir) * ghostOffsetUnit,
              opacity: ghostOpacity,
            });
          } else {
            gsap.to(ghosts, {
              y: (_i, target) => Number(target.dataset.dir) * ghostOffsetUnit,
              opacity: ghostOpacity,
              duration: 0.5,
              ease: "power2.out",
              stagger: 0.04,
              force3D: true,
            });
          }
        }

        gsap.set(rootRef.current, { transformOrigin: "50% 50%" });

        stuckTween = gsap.to(rootRef.current, {
          y: "25vh",
          rotate: reducedMotion ? 0 : -2.4,
          duration: reducedMotion ? 0.6 : 1.6,
          ease: reducedMotion ? "power2.out" : "back.out(1.4)",
          onUpdate: function () {
            if (!blurTriggered && this.progress() >= 0.5) {
              blurTriggered = true;
              onStuckRef.current?.();
            }
          },
          onComplete: () => {
            setShowRetry(true);
          },
        });
      });

      return () => {
        stuckCall.kill();
        stuckTween?.kill();
        progressTween?.kill();
      };
    }, rootRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    if (!showRetry) return;

    if (btnRef.current) {
      gsap.fromTo(btnRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform" });
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    gsap.set(scribbleRefs.current, { opacity: 1, y: 0 });

    // Safari can report a stale/zero length if getTotalLength() runs in the
    // same frame the <path> is mounted, so defer the measurement one frame.
    const raf = requestAnimationFrame(() => {
      arrowPathRefs.current.forEach((path, i) => {
        if (!path) return;
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, { strokeDashoffset: 0, duration: 0.7, delay: 0.2 + i * 0.15, ease: "power2.out" });
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [showRetry]);

  const handleRetry = () => {
    onDismiss?.();

    gsap.to(scribbleRefs.current, { opacity: 0, duration: 0.1, ease: "power1.out", overwrite: true });

    if (btnRef.current) {
      gsap.to(btnRef.current, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" });
    }

    gsap.to(progressState, {
      val: 100,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => setProgress(progressState.val),
      onComplete: () => {
        const finish = () => {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
          window.__lenis?.start();
          setHidden(true);
          onComplete?.();
        };

        const root = rootRef.current;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (!root || reducedMotion) {
          gsap.to(root, { opacity: 0, duration: 0.4, ease: "power1.out", onComplete: finish });
          return;
        }

        disintegrate(root, finish);
      },
    });
  };

  if (hidden) return null;

  return (
    <>
      {showRetry && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-[110] flex justify-center">
          <div className="relative">
            <button ref={btnRef} type="button" onClick={handleRetry} className="loader-retry-btn font-space pointer-events-auto">
              click me
            </button>

            <div
              ref={(el) => {
                if (el) scribbleRefs.current[2] = el;
              }}
              className="loader-scribble loader-scribble-hint"
              aria-hidden="true"
            >
              <svg viewBox="0 0 90 60" className="loader-scribble-svg" aria-hidden="true">
                <path
                  ref={(el) => {
                    if (el) arrowPathRefs.current[2] = el;
                  }}
                  d="M76,50 C58,26 40,10 16,6 M16,6 L28,10 M16,6 L18,18"
                  fill="none"
                  stroke="var(--blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="font-scribble">did it get stuck?</span>
            </div>
          </div>
        </div>
      )}

      <div
        ref={rootRef}
        className="loader-overlay min-h-dvh fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="loader-progress-track">
          <div ref={progressFillRef} className="loader-progress-fill" />
        </div>
        <span ref={progressLabelRef} className="loader-progress-label font-space">
          0%
        </span>

        <div className="loader-stage flex flex-col items-center gap-7">
          <div ref={headingWrapRef} className="loader-heading-wrap" aria-hidden="true">
            {GHOSTS.map((dir) => (
              <div key={dir} data-dir={dir} className="loader-heading loader-heading-ghost font-chunko">
                {HEADING}
              </div>
            ))}
            <div className="loader-heading loader-heading-main font-chunko">
              {HEADING}
              <span className="loader-subname font-scribble">Kurdekar</span>
            </div>

            {showRetry && (
              <>
                <div
                  ref={(el) => {
                    if (el) scribbleRefs.current[0] = el;
                  }}
                  className="loader-scribble loader-scribble-left"
                  aria-hidden="true"
                >
                  <span className="font-scribble">loading...</span>
                  <svg viewBox="0 0 90 60" className="loader-scribble-svg" aria-hidden="true">
                    <path
                      ref={(el) => {
                        if (el) arrowPathRefs.current[0] = el;
                      }}
                      d="M14,10 C34,14 54,30 68,50 M68,50 L54,44 M68,50 L74,34"
                      fill="none"
                      stroke="var(--black)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            )}
          </div>
          <span className="sr-only">Loading akash kurdekar portfolio</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
