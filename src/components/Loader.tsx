import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface LoaderProps {
  /** Called once the loader has fully slid away and the site is revealed. */
  onComplete?: () => void;
  /** Called the moment the loader settles in its stuck, mid-screen position. */
  onStuck?: () => void;
  /** Called right before the loader slides fully away (auto-dismiss). */
  onDismiss?: () => void;
}

const HEADING = "portfolio";
const STUCK_AT = 1;
const STUCK_HOLD = 0.6;
const GHOSTS = [-2, -1, 1, 2];

const Loader = ({ onComplete, onStuck, onDismiss }: LoaderProps) => {
  const [hidden, setHidden] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const onStuckRef = useRef(onStuck);
  const onDismissRef = useRef(onDismiss);
  const onCompleteRef = useRef(onComplete);
  const progressState = useRef({ val: 0 }).current;

  const setProgress = (val: number) => {
    const pct = Math.round(val);
    if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
    if (progressLabelRef.current) progressLabelRef.current.textContent = `${pct}%`;
  };

  useEffect(() => {
    onStuckRef.current = onStuck;
    onDismissRef.current = onDismiss;
    onCompleteRef.current = onComplete;
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
    let dismissCall: gsap.core.Tween | undefined;

    // Auto-advances the loader out once it has sat "stuck" for a beat — no
    // user interaction required.
    const finish = () => {
      onDismissRef.current?.();

      // Unlock scroll the instant dismissal starts instead of waiting on the
      // progress-bar/slide-up animation chain below — that chain can take
      // well over a second, and the site behind the loader visually unblurs
      // almost immediately (see App.tsx's onDismiss), so leaving scroll
      // locked until animations finish reads as a stuck page.
      unlockScroll();

      gsap.to(progressState, {
        val: 100,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: () => setProgress(progressState.val),
        onComplete: () => {
          const reveal = () => {
            setHidden(true);
            onCompleteRef.current?.();
          };

          gsap.to(rootRef.current, {
            y: "100vh",
            rotate: 0,
            duration: reducedMotion ? 0.5 : 0.7,
            ease: reducedMotion ? "power1.inOut" : "power3.in",
            onComplete: reveal,
          });
        },
      });
    };

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
            dismissCall = gsap.delayedCall(STUCK_HOLD, finish);
          },
        });
      });

      return () => {
        stuckCall.kill();
        stuckTween?.kill();
        progressTween?.kill();
        dismissCall?.kill();
      };
    }, rootRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  if (hidden) return null;

  return (
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
        </div>
        <span className="sr-only">Loading akash kurdekar portfolio</span>
      </div>
    </div>
  );
};

export default Loader;
