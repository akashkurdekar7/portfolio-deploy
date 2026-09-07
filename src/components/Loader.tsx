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

const HEADING = "akash kurdekar";
const FALL_AT = 3;
const STUCK_AT = 5;
const BLUR_DELAY = 0.5;

const Loader = ({ onComplete, onStuck, onDismiss }: LoaderProps) => {
  const [hidden, setHidden] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const onStuckRef = useRef(onStuck);

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
    const letters = headingRef.current
      ? Array.from(headingRef.current.querySelectorAll<HTMLSpanElement>(".loader-letter"))
      : [];

    let blurDelayCall: gsap.core.Tween | undefined;

    const ctx = gsap.context(() => {
      gsap.set([headingRef.current, trackRef.current], { opacity: 0, y: 14 });

      gsap.to([headingRef.current, trackRef.current], {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.1,
      });

      const fallCall = gsap.delayedCall(FALL_AT, () => {
        if (reducedMotion) {
          gsap.to(headingRef.current, { opacity: 0, y: 24, duration: 0.5, ease: "power2.in" });
          return;
        }
        gsap.to(letters, {
          y: () => 90 + Math.random() * 70,
          x: () => (Math.random() - 0.5) * 50,
          rotate: () => (Math.random() - 0.5) * 160,
          opacity: 0,
          duration: 0.9,
          ease: "power2.in",
          stagger: { each: 0.045, from: "random" },
        });
      });

      const stuckCall = gsap.delayedCall(STUCK_AT, () => {
        gsap.to(rootRef.current, {
          y: "25vh",
          duration: reducedMotion ? 0.6 : 1.6,
          ease: reducedMotion ? "power2.out" : "back.out(1.4)",
          onComplete: () => {
            setShowRetry(true);
            blurDelayCall = gsap.delayedCall(BLUR_DELAY, () => onStuckRef.current?.());
          },
        });
      });

      return () => {
        fallCall.kill();
        stuckCall.kill();
        blurDelayCall?.kill();
      };
    }, rootRef);

    return () => {
      ctx.revert();
      unlockScroll();
    };
  }, []);

  useEffect(() => {
    if (showRetry && btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out", clearProps: "transform" },
      );
    }
  }, [showRetry]);

  const handleRetry = () => {
    onDismiss?.();

    if (btnRef.current) {
      gsap.to(btnRef.current, { opacity: 0, y: -10, duration: 0.25, ease: "power2.in" });
    }

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
  };

  if (hidden) return null;

  return (
    <>
      {showRetry && (
        <div className="pointer-events-none fixed inset-x-0 top-6 z-[110] flex justify-center">
          <button
            ref={btnRef}
            type="button"
            onClick={handleRetry}
            className="loader-retry-btn font-space pointer-events-auto"
          >
            Sorry, network issue
          </button>
        </div>
      )}

      <div
        ref={rootRef}
        className="loader-overlay fixed inset-0 z-[100] flex flex-col items-center justify-start overflow-hidden pt-[16vh]"
      >
        <div className="loader-stage flex flex-col items-center gap-7">
          <div ref={headingRef} className="loader-heading font-space" aria-hidden="true">
            {HEADING.split("").map((ch, i) => (
              <span key={i} className="loader-letter">
                {ch === " " ? " " : ch}
              </span>
            ))}
          </div>
          <span className="sr-only">Loading akash kurdekar portfolio</span>

          <div ref={trackRef} className="loader-track">
            <div className="loader-fill" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Loader;
