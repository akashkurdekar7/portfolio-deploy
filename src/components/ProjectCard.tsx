import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

const IMAGE_INTERVAL_MS = 1500;

export type Project = {
  images?: string[];
  title: string;
  type: string;
  year: string | number;
  description: string;
  role: string;
  company: string;
  contribution: string;
  tools?: string[];
  linkType?: "live" | "github";
  url?: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
  variant?: "default" | "center";
  scrambleTitle?: boolean;
  revealImage?: boolean;
  className?: string;
  onImageMouseEnter?: () => void;
  onImageMouseLeave?: () => void;
  onImageMouseMove?: (event: React.MouseEvent) => void;
  onSelect?: () => void;
};

const ProjectCard = ({
  project,
  index,
  variant = "default",
  scrambleTitle = true,
  revealImage = true,
  className,
  onImageMouseEnter,
  onImageMouseLeave,
  onImageMouseMove,
  onSelect,
}: ProjectCardProps) => {
  const fallbackImage = `https://picsum.photos/900/700?random=${index + 1}`;
  const images = project.images && project.images.length > 0 ? project.images : [fallbackImage];

  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    if (images.length < 2) return;

    const id = setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, IMAGE_INTERVAL_MS);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, project.title]);

  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    if (!titleRef.current || !scrambleTitle) return;

    const ctx = gsap.context(() => {
      gsap.to(titleRef.current, {
        duration: 1.2,
        ease: "none",
        scrambleText: {
          text: project.title,
          chars: "abcdefghijklmnopqrstuvwxyz0123456789",
          revealDelay: 0.2,
          speed: 0.35,
          tweenLength: false,
        },
        scrollTrigger: {
          trigger: titleRef.current,
          start: "center center",
          once: true,
        },
      });
    });

    return () => ctx.revert();
  }, [project.title, scrambleTitle]);

  const imageWrapRef = useRef<HTMLDivElement>(null);
  const imageElRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Scroll-linked parallax: the image sits zoomed in and scales back down to
  // 1 as the card travels through the viewport, matching the Work section's
  // scrubbed image effect instead of a one-off entrance reveal.
  useLayoutEffect(() => {
    if (!revealImage) return;
    const imgs = imageElRefs.current.filter((el): el is HTMLImageElement => el !== null);
    if (imgs.length === 0) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgs,
        { scale: 1.15 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: imageWrapRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [revealImage]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!onSelect) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect();
    }
  };

  return (
    <div
      className={`group cursor-pointer bg-[#fff] border-6 border-white rounded-[24px] transition-transform duration-300 ease-out ${onSelect ? "hover:-translate-y-1" : ""} ${className ?? "mx-auto h-auto w-full lg:w-[420px]"}`}
      onClick={onSelect}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
      onKeyDown={onSelect ? handleKeyDown : undefined}
      aria-haspopup={onSelect ? "dialog" : undefined}
    >
      <div
        ref={imageWrapRef}
        className="relative mx-auto aspect-[450/350] w-full overflow-hidden rounded-2xl [transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
        onMouseEnter={onImageMouseEnter}
        onMouseLeave={onImageMouseLeave}
        onMouseMove={onImageMouseMove}
      >
        {images.map((src, i) => (
          <img
            key={src}
            ref={(el) => {
              imageElRefs.current[i] = el;
            }}
            src={src}
            loading="lazy"
            alt={`${project.title} — ${project.type} project screenshot ${i + 1} of ${images.length}`}
            aria-hidden={i !== activeImage}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
              i === activeImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      {/* INFO */}
      <div className=" flex flex-col items-start  justify-between  px-3 py-4">
        <div className="flex justify-between items-center w-full">
          <h3 ref={titleRef} className="font-instrument size28 capitalize">
            {project.title}
          </h3>

          <span className="rounded-full border bg-white px-3 py-1 font-space size12 text-grey">{project.year}</span>
        </div>
        <p className="mt-1 mb-2 font-space size12 uppercase text-grey">{project.type}</p>

        {variant !== "center" ? (
          <div className=" flex flex-wrap items-center gap-2">
            <p className=" font-space size12 leading-5 text-justify text-grey  lg:w-[80%]">{project.description}</p>
            <span className="rounded-full border px-3 py-1 font-space size12 uppercase border-black/20 text-grey">{project.company}</span>

            <span className="rounded-full px-3 py-1 font-space size12 uppercase bg-black text-white">{project.contribution}</span>
          </div>
        ) : (
          <div className="mt-0 flex flex-wrap items-center gap-2">
            <p className=" font-space size12 leading-5 text-justify xl:hidden text-grey">{project.description}</p>
            <span className="rounded-full border px-3 py-1 font-space size12 uppercase border-black/20 text-grey">{project.company}</span>

            <span className="rounded-full px-3 py-1 font-space size12 uppercase bg-black text-white">{project.contribution}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
