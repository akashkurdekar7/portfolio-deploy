import { useEffect, useRef } from "react";
import gsap from "gsap";
import { FaPlay } from "react-icons/fa";

export type Reel = {
  id: number;
  title: string;
  category: string;
  year: string;
  video: string;
  instagram: string;
};

type ReelCardProps = {
  reel: Reel;
  isFinePointer: boolean;
  reducedMotion: boolean;
  className?: string;
};

const ReelCard = ({ reel, isFinePointer, reducedMotion, className = "" }: ReelCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const watchRef = useRef<HTMLDivElement>(null);

  const rotateXTo = useRef<gsap.QuickToFunc | null>(null);
  const rotateYTo = useRef<gsap.QuickToFunc | null>(null);
  const scaleTo = useRef<gsap.QuickToFunc | null>(null);
  const watchXTo = useRef<gsap.QuickToFunc | null>(null);
  const watchYTo = useRef<gsap.QuickToFunc | null>(null);

  useEffect(() => {
    if (!isFinePointer || reducedMotion || !cardRef.current) return;

    rotateXTo.current = gsap.quickTo(cardRef.current, "rotationX", { duration: 0.6, ease: "power3.out" });
    rotateYTo.current = gsap.quickTo(cardRef.current, "rotationY", { duration: 0.6, ease: "power3.out" });
    scaleTo.current = gsap.quickTo(cardRef.current, "scale", { duration: 0.6, ease: "power3.out" });

    if (watchRef.current) {
      gsap.set(watchRef.current, { xPercent: -50, yPercent: -50 });
      watchXTo.current = gsap.quickTo(watchRef.current, "x", { duration: 0.45, ease: "power3.out" });
      watchYTo.current = gsap.quickTo(watchRef.current, "y", { duration: 0.45, ease: "power3.out" });
    }
  }, [isFinePointer, reducedMotion]);

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFinePointer || reducedMotion || !cardRef.current) return;

    const bounds = cardRef.current.getBoundingClientRect();
    const px = (event.clientX - bounds.left) / bounds.width - 0.5;
    const py = (event.clientY - bounds.top) / bounds.height - 0.5;

    rotateXTo.current?.(py * -10);
    rotateYTo.current?.(px * 10);
    scaleTo.current?.(1.04);

    watchXTo.current?.(event.clientX - bounds.left);
    watchYTo.current?.(event.clientY - bounds.top);
  };

  const handleEnter = () => {
    if (!isFinePointer || reducedMotion) return;
    gsap.to(watchRef.current, { opacity: 1, scale: 1, duration: 0.3, ease: "power3.out" });
  };

  const handleLeave = () => {
    rotateXTo.current?.(0);
    rotateYTo.current?.(0);
    scaleTo.current?.(1);
    gsap.to(watchRef.current, { opacity: 0, scale: 0.6, duration: 0.25, ease: "power2.out" });
  };

  return (
    <div style={{ perspective: "800px" }} className={`h-full w-full ${className}`}>
      <a
        ref={cardRef}
        href={reel.instagram}
        target="_blank"
        rel="noreferrer"
        onMouseMove={handleMove}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="group relative block h-full w-full overflow-hidden bg-black"
      >
        <video src={reel.video} autoPlay muted loop playsInline className="h-full w-full object-cover" />

        {/* META */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/15 to-transparent px-4 pb-4 pt-12">
          <h3 className="font-instrument text-xl leading-none text-white">{reel.title}</h3>
          <p className="mt-1.5 font-space size12 uppercase text-white/70">{reel.category}</p>
        </div>

        {/* NUMBER */}
        <span className="absolute right-3 top-3 z-10 font-space size12 text-white">0{reel.id}</span>

        {/* MAGNETIC WATCH CURSOR */}
        <div
          ref={watchRef}
          className="pointer-events-none absolute left-0 top-0 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-orange opacity-0 md:flex"
        >
          <FaPlay className="ml-0.5 text-white" size={12} />
        </div>
      </a>
    </div>
  );
};

export default ReelCard;
