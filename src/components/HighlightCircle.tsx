import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HighlightCircleProps {
  children: ReactNode;
  className?: string;
  color?: string;
}

// The hand-drawn path lives in a 200x100 (2:1) viewBox. Deriving the overlay's
// height from the wrapper's own box would tie the circle's shape to whatever
// line-height the surrounding heading happens to use (e.g. "leading-[0.9]" on
// the featured card vs "leading-[1.2]" on the grid cards), flattening it for
// no visual reason. Font-size stays constant across those contexts, so the
// height is derived from it instead; the multiplier is calibrated off the
// existing (correct-looking) proportions of the shorter highlighted words.
const CIRCLE_HEIGHT_PER_FONT_SIZE = 1.88;
const CIRCLE_WIDTH_OVERSHOOT = 1.2;

const HighlightCircle = ({ children, className = "", color }: HighlightCircleProps) => {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!wrap || !svg || !path) return;

    const updateBox = () => {
      const fontSize = parseFloat(getComputedStyle(wrap).fontSize);
      const width = wrap.offsetWidth * CIRCLE_WIDTH_OVERSHOOT;
      const height = fontSize * CIRCLE_HEIGHT_PER_FONT_SIZE;

      svg.style.width = `${width}px`;
      svg.style.height = `${height}px`;
      svg.style.left = `${-(width - wrap.offsetWidth) / 2}px`;
      svg.style.top = `${(wrap.offsetHeight - height) / 2}px`;
    };

    updateBox();

    const resizeObserver = new ResizeObserver(updateBox);
    resizeObserver.observe(wrap);

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

    return () => {
      resizeObserver.disconnect();
      ctx.revert();
    };
  }, []);

  const style = color ? ({ "--highlight-color": color } as CSSProperties) : undefined;

  return (
    <span ref={wrapRef} className={`highlight-circle ${className}`} style={style}>
      <svg ref={svgRef} viewBox="0 0 200 100" preserveAspectRatio="none" className="highlight-circle-svg" aria-hidden="true">
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
