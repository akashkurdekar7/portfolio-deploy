import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Quote = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);

  useLayoutEffect(() => {
    if (!quoteRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current,
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: quoteRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="h-screen flex items-center justify-center">
      <div className="mx-auto flex items-center justify-center flex-col">
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
