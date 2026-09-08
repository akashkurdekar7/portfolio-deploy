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
const STUCK_AT = 5;
const GHOSTS = [-2, -1, 1, 2];

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

        if (!reducedMotion && ghosts.length) {
          gsap.to(ghosts, {
            y: (_i, target) => Number(target.dataset.dir) * 45,
            opacity: (_i, target) => (Math.abs(Number(target.dataset.dir)) === 1 ? 0.35 : 0.15),
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.04,
          });
        }

        stuckTween = gsap.to(rootRef.current, {
          y: "25vh",
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

    scribbleRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.2 + i * 0.15, ease: "power2.out" });
    });

    arrowPathRefs.current.forEach((path, i) => {
      if (!path) return;
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, { strokeDashoffset: 0, duration: 0.7, delay: 0.4 + i * 0.15, ease: "power2.out" });
    });
  }, [showRetry]);

  const handleRetry = () => {
    onDismiss?.();

    if (btnRef.current) {
      gsap.to(btnRef.current, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" });
    }

    gsap.to(progressState, {
      val: 100,
      duration: 0.45,
      ease: "power2.out",
      onUpdate: () => setProgress(progressState.val),
      onComplete: () => {
        gsap.to(rootRef.current, {
          y: "160vh",
          scaleX: 0.55,
          duration: 1.1,
          ease: "power2.in",
          onComplete: () => {
            document.documentElement.style.overflow = "";
            document.body.style.overflow = "";
            window.__lenis?.start();
            setHidden(true);
            onComplete?.();
          },
        });
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
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <span className="font-italic">did it get stuck?</span>
            </div>
          </div>
        </div>
      )}

      <div
        ref={rootRef}
        className="loader-overlay h-screen fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
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
              <span className="loader-subname font-italic">kurdekar</span>
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
                  <span className="font-italic">loading... allegedly</span>
                  <svg viewBox="0 0 90 60" className="loader-scribble-svg" aria-hidden="true">
                    <path
                      ref={(el) => {
                        if (el) arrowPathRefs.current[0] = el;
                      }}
                      d="M14,10 C34,14 54,30 68,50 M68,50 L54,44 M68,50 L74,34"
                      fill="none"
                      stroke="var(--black)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </div>

                <div
                  ref={(el) => {
                    if (el) scribbleRefs.current[1] = el;
                  }}
                  className="loader-scribble loader-scribble-right"
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 90 60" className="loader-scribble-svg" aria-hidden="true">
                    <path
                      ref={(el) => {
                        if (el) arrowPathRefs.current[1] = el;
                      }}
                      d="M76,10 C56,14 38,28 26,46 M26,46 L38,42 M26,46 L22,32"
                      fill="none"
                      stroke="var(--orange)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                  <span className="font-italic">hey, that's me</span>
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
