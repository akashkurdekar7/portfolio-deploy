import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Quote = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useLayoutEffect(() => {
    if (!quoteRef.current || !sectionRef.current || !wrapperRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current,
        {
          scale: 0.1,
          opacity: 0,
        },
        {
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            // Trigger off the wrapper, not quoteRef itself — quoteRef is the
            // element being scaled, and gsap.fromTo renders the scale:0.1
            // "from" state immediately on creation, before ScrollTrigger
            // measures the trigger position. Using it as its own trigger
            // means "top 80%" gets measured against the shrunk element.
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "center center",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        },
      );

      ScrollTrigger.refresh();
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  return (
    <section ref={sectionRef} className=" min-h-dvh flex items-center justify-center">
      <div ref={wrapperRef} className="mx-auto flex items-center justify-center flex-col">
        <blockquote ref={quoteRef} className="mt-0">
          <h3 className="size56 font-italic   text-black ">“Fear cuts deeper than swords.”</h3>

          <div className=" size12 font-space  text-black/50 text-end tracking-tight">
            — George R. R. Martin
            <span className="mx-2 text-neutral-300">/</span>
            <cite className=" not-italic">A Game of Thrones</cite>
          </div>
        </blockquote>
      </div>
    </section>
  );
};

export default Quote;
