import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { FaPlay } from 'react-icons/fa';

export type Reel = {
  id: number;
  title: string;
  category: string;
  year: string;
  image: string;
  instagram: string;
};

type ReelCardProps = {
  reel: Reel;
  isFinePointer: boolean;
  reducedMotion: boolean;
  className?: string;
};

const ReelCard = ({ reel, isFinePointer, reducedMotion, className = '' }: ReelCardProps) => {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const watchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isFinePointer || reducedMotion || !watchRef.current) return;

    gsap.set(watchRef.current, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.5,
      opacity: 0,
    });

    return () => {
      gsap.killTweensOf(watchRef.current);
    };
  }, [isFinePointer, reducedMotion]);

  const handleMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isFinePointer || reducedMotion) return;

    const card = cardRef.current;
    const watch = watchRef.current;

    if (!card || !watch) return;

    const bounds = card.getBoundingClientRect();

    gsap.to(watch, {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
      duration: 0.35,
      ease: 'power3.out',
      overwrite: true,
    });
  };

  const handleEnter = () => {
    if (reducedMotion) return;

    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.04,
        duration: 0.7,
        ease: 'power3.out',
        overwrite: true,
      });
    }

    if (watchRef.current && isFinePointer) {
      gsap.to(watchRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
        overwrite: true,
      });
    }
  };

  const handleLeave = () => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: 'power3.out',
        overwrite: true,
      });
    }

    if (watchRef.current) {
      gsap.to(watchRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        overwrite: true,
      });
    }
  };

  return (
    <div className={`h-full w-full ${className}`}>
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
        <img
          ref={imageRef}
          src={reel.image}
          alt={reel.title}
          title={reel.title}
          loading="lazy"
          decoding="async"
          className="block h-full w-full object-cover will-change-transform"
        />

        {/* IMAGE OVERLAY */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-500 group-hover:bg-black/10" />

        {/* META */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/15 to-transparent px-4 pb-4 pt-16">
          <h3 className="font-instrument text-xl leading-none text-white">{reel.title}</h3>

          <p className="mt-1.5 font-space size12 uppercase text-white/70">{reel.category}</p>
        </div>

        {/* NUMBER */}
        <span className="pointer-events-none absolute right-3 top-3 z-10 font-space size12 text-white">
          {String(reel.id).padStart(2, '0')}
        </span>

        {/* WATCH CURSOR */}
        {isFinePointer && (
          <div
            ref={watchRef}
            className="pointer-events-none absolute left-0 top-0 z-20 hidden h-11 w-11 items-center justify-center rounded-full bg-orange md:flex"
          >
            <FaPlay className="ml-0.5 text-white" size={11} />
          </div>
        )}
      </a>
    </div>
  );
};

export default ReelCard;
