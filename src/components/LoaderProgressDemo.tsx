import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const HEADING = "portfolio";
const STUCK_AT = 1;
const STUCK_HOLD = 0.6;
const GHOSTS = [-2, -1, 1, 2];

const LoaderProgressDemo = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const headingWrapRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const progressLabelRef = useRef<HTMLSpanElement>(null);
  const progressState = useRef({ val: 0 }).current;
  const runRef = useRef<() => void>(() => {});

  const setProgress = (val: number) => {
    const pct = Math.round(val);
    if (progressFillRef.current) progressFillRef.current.style.width = `${pct}%`;
    if (progressLabelRef.current) progressLabelRef.current.textContent = `${pct}%`;
  };

  useLayoutEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ghosts = rootRef.current ? Array.from(rootRef.current.querySelectorAll<HTMLElement>(".loader-heading-ghost")) : [];
    const mainHeadingEl = rootRef.current?.querySelector<HTMLElement>(".loader-heading-main");
    const headingFontSize = mainHeadingEl ? parseFloat(window.getComputedStyle(mainHeadingEl).fontSize) : 100;
    const ghostOffsetUnit = headingFontSize * 0.27;

    let stuckTween: gsap.core.Tween | undefined;
    let progressTween: gsap.core.Tween | undefined;
    let stuckCall: gsap.core.Tween | undefined;
    let dismissCall: gsap.core.Tween | undefined;

    const finish = () => {
      gsap.to(progressState, {
        val: 100,
        duration: 0.45,
        ease: "power2.out",
        onUpdate: () => setProgress(progressState.val),
        onComplete: () => {
          gsap.to(rootRef.current, {
            y: "100vh",
            rotate: 0,
            duration: reducedMotion ? 0.5 : 0.7,
            ease: reducedMotion ? "power1.inOut" : "power3.in",
          });
        },
      });
    };

    // Rebuilds the whole cycle from scratch so Replay can retrigger it any
    // number of times without leftover tween state bleeding into the next run.
    const run = () => {
      stuckCall?.kill();
      stuckTween?.kill();
      progressTween?.kill();
      dismissCall?.kill();

      progressState.val = 0;
      setProgress(0);
      gsap.set(rootRef.current, { y: 0, rotate: 0, transformOrigin: "50% 50%" });
      gsap.set(ghosts, { y: 0, opacity: 0 });
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

      stuckCall = gsap.delayedCall(STUCK_AT, () => {
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

        stuckTween = gsap.to(rootRef.current, {
          y: "25vh",
          rotate: reducedMotion ? 0 : -2.4,
          duration: reducedMotion ? 0.6 : 1.6,
          ease: reducedMotion ? "power2.out" : "back.out(1.4)",
          onComplete: () => {
            dismissCall = gsap.delayedCall(STUCK_HOLD, finish);
          },
        });
      });
    };

    runRef.current = run;
    run();

    return () => {
      stuckCall?.kill();
      stuckTween?.kill();
      progressTween?.kill();
      dismissCall?.kill();
      gsap.killTweensOf(rootRef.current);
    };
  }, []);

  const replay = () => runRef.current();

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div ref={rootRef} className="loader-overlay min-h-dvh absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
        <div className="loader-progress-track">
          <div ref={progressFillRef} className="loader-progress-fill" />
        </div>
        <span ref={progressLabelRef} className="loader-progress-label font-bricolage">
          0%
        </span>

        <div className="loader-stage flex flex-col items-center gap-7">
          <div ref={headingWrapRef} className="loader-heading-wrap" aria-hidden="true">
            {GHOSTS.map((dir) => (
              <div key={dir} data-dir={dir} className="loader-heading loader-heading-ghost font-bricolage-semibold">
                {HEADING}
              </div>
            ))}
            <div className="loader-heading loader-heading-main font-bricolage-semibold">
              {HEADING}
              <span className="loader-subname font-scribble">Kurdekar</span>
            </div>
          </div>
        </div>
      </div>

      <div className="font-bricolage text-grey fixed inset-x-0 bottom-8 z-[110] flex items-center justify-center gap-4 text-sm">
        <button
          type="button"
          onClick={replay}
          className="rounded-full border border-black/15 bg-white px-4 py-2 transition hover:border-black/40"
        >
          Replay
        </button>
        <a href="?" className="rounded-full bg-white px-2 underline underline-offset-2 hover:text-black">
          Back to site
        </a>
      </div>
    </div>
  );
};

export default LoaderProgressDemo;
