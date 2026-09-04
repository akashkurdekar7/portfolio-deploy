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
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      const primaryWidth = primaryRef.current?.scrollWidth ?? 0;
      const secondaryWidth = secondaryRef.current?.scrollWidth ?? 0;
      setVars({
        "--w-primary": `${primaryWidth}px`,
        "--w-secondary": `${secondaryWidth}px`,
      });
    };

    measure();
    document.fonts?.ready.then(measure);

    return () => {
      cancelled = true;
    };
  }, [primary, secondary]);

  return (
    <div className="link-rollover" style={vars as CSSProperties}>
      <div className="link-rollover-inner">
        <span ref={primaryRef} className={`link-rollover-text ${primaryClassName}`}>
          {primary}
        </span>
        <span ref={secondaryRef} className={`link-rollover-text ${secondaryClassName}`}>
          {secondary}
        </span>
      </div>
    </div>
  );
};

export default RollingText;
