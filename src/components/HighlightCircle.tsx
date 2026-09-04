import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HighlightCircleProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

const HighlightCircle = ({ children, className = "", color }: HighlightCircleProps) => {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const path = pathRef.current;
    if (!wrap || !path) return;

    const ctx = gsap.context(() => {
      const length = path.getTotalLength();

      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: wrap,
          start: "center center",
          toggleActions: "play none none reverse",
        },
      });
    }, wrap);

    return () => ctx.revert();
  }, []);

  const style = color ? ({ "--highlight-color": color } as CSSProperties) : undefined;

  return (
    <span ref={wrapRef} className={`highlight-circle ${className}`} style={style}>
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="highlight-circle-svg" aria-hidden="true">
        <path
          ref={pathRef}
          className="highlight-circle-stroke"
          d="
            M76,9
            C36,12 6,29 7,54
            C8,80 42,97 90,97
            C136,97 178,82 192,57
            C204,35 193,13 160,6
            C132,0 102,1 82,7
            C90,3 100,-3 112,-8
          "
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <span className="highlight-circle-text">{children}</span>
    </span>
  );
};

export default HighlightCircle;
