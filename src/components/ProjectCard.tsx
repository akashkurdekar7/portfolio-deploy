import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

// How long each image in a project's gallery stays on screen before
// crossfading to the next one.
const IMAGE_INTERVAL_MS = 3500;

export type Project = {
  // Gallery of screenshots for this project. When there's more than one,
  // the card automatically crossfades between them.
  images?: string[];
  title: string;
  type: string;
  year: string | number;
  description: string;
  role: string;
  company: string;
  contribution: string;
  // Drives the desktop cursor-follow label ("Live" vs "GitHub"). Defaults to "live".
  linkType?: "live" | "github";
  url?: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
  variant?: "default" | "center";
  scrambleTitle?: boolean;
  className?: string;
  // True when the page background behind this card is black (see Projects.tsx)
  // — flips text/borders to stay legible against it.
  dark?: boolean;
  // Scopes the desktop cursor-follow label (see ProjectsDesktop) to just the
  // image, rather than the whole card including the text block below it.
  onImageMouseEnter?: () => void;
  onImageMouseLeave?: () => void;
  onImageMouseMove?: (event: React.MouseEvent) => void;
};

const ProjectCard = ({
  project,
  index,
  variant = "default",
  scrambleTitle = true,
  className,
  dark = false,
  onImageMouseEnter,
  onImageMouseLeave,
  onImageMouseMove,
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

  const companyBorderClass = dark ? "border-white/25 text-white/70" : "border-black/20 text-grey";
  const contributionClass = dark ? "bg-white text-black" : "bg-black text-white";
  const typeTextClass = dark ? "text-white/60" : "text-grey";
  const descriptionTextClass = dark ? "text-white/70" : "text-grey";

  return (
    <div className={`group cursor-pointer ${className ?? "mx-auto h-auto w-full lg:w-[420px]"}`}>
      <div
        className="relative mx-auto aspect-[450/350] w-full overflow-hidden rounded-2xl [transform:translateZ(0)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
        onMouseEnter={onImageMouseEnter}
        onMouseLeave={onImageMouseLeave}
        onMouseMove={onImageMouseMove}
      >
        {images.map((src, i) => (
          <img
            key={src}
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
      <div className="mt-2 flex flex-col items-start  justify-between lg:mt-4">
        <div className="flex justify-between items-center w-full">
          <h3 ref={titleRef} className={`font-instrument size28 capitalize ${dark ? "text-white" : ""}`}>
            {project.title}
          </h3>

          <span className="rounded-full border bg-white px-3 py-1 font-space size12 text-grey">{project.year}</span>
        </div>
        <p className={`mt-1 mb-2 font-space size12 uppercase ${typeTextClass}`}>{project.type}</p>

        {variant !== "center" ? (
          <div className=" flex flex-wrap items-center gap-2">
            <p className={` font-space size12 leading-5 text-justify ${descriptionTextClass}`}>{project.description}</p>
            <span className={`rounded-full border px-3 py-1 font-space size12 uppercase ${companyBorderClass}`}>{project.company}</span>

            <span className={`rounded-full px-3 py-1 font-space size12 uppercase ${contributionClass}`}>{project.contribution}</span>
          </div>
        ) : (
          <div className="mt-0 flex flex-wrap items-center gap-2">
            <p className={` font-space size12 leading-5 text-justify xl:hidden ${descriptionTextClass}`}>{project.description}</p>
            <span className={`rounded-full border px-3 py-1 font-space size12 uppercase ${companyBorderClass}`}>{project.company}</span>

            <span className={`rounded-full px-3 py-1 font-space size12 uppercase ${contributionClass}`}>{project.contribution}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
