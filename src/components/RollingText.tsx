import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type RollingTextProps = {
  primary: string;
  secondary: string;
  primaryClassName?: string;
  secondaryClassName?: string;
};

const RollingText = ({ primary, secondary, primaryClassName = "", secondaryClassName = "" }: RollingTextProps) => {
  const primaryRef = useRef<HTMLSpanElement>(null);
  const secondaryRef = useRef<HTMLSpanElement>(null);
  const [vars, setVars] = useState<Record<string, string>>({});

  useLayoutEffect(() => {
    const primaryEl = primaryRef.current;
    const secondaryEl = secondaryRef.current;
    if (!primaryEl || !secondaryEl) return;

    // .link-rollover-inner is a flex column with align-items: flex-start, so
    // each span always renders at its own natural content width regardless
    // of the fixed pixel width this component sets on the ancestor below —
    // a one-off scrollWidth read (keyed only to the primary/secondary text)
    // goes stale the moment that natural width changes for any other reason
    // (the custom font swapping in after load, the .size16 991px breakpoint,
    // browser zoom), and the stale, too-narrow width then clips the text via
    // the ancestor's overflow: hidden. Observing each span directly keeps
    // the measurement correct through all of that.
    const observer = new ResizeObserver((entries) => {
      setVars((prev) => {
        const next = { ...prev };
        for (const entry of entries) {
          const width = Math.ceil(entry.contentRect.width);
          if (entry.target === primaryEl) next["--w-primary"] = `${width}px`;
          if (entry.target === secondaryEl) next["--w-secondary"] = `${width}px`;
        }
        return next;
      });
    });

    observer.observe(primaryEl);
    observer.observe(secondaryEl);

    return () => observer.disconnect();
  }, [primary, secondary]);

  return (
    <div className="link-rollover" style={vars as CSSProperties}>
      <div className="link-rollover-inner">
        <span ref={primaryRef} className={`link-rollover-text ${primaryClassName}`}>
          {primary}
        </span>
        <span ref={secondaryRef} aria-hidden="true" className={`link-rollover-text ${secondaryClassName}`}>
          {secondary}
        </span>
      </div>
    </div>
  );
};

export default RollingText;
