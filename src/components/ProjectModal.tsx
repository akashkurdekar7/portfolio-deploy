import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { HiX } from "react-icons/hi";
import type { Project } from "./ProjectCard";
import { stripEmphasisMarkup } from "../utils/emphasisText";

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

// Portalled to <body> so it escapes App.tsx's loader wrapper — a `filter`/
// `scale` on that ancestor would otherwise become the containing block for
// this `fixed` overlay and break it. Mirrors the dialog pattern in Resume.tsx.
const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!project) return;

    lastFocusedRef.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    window.__lenis?.stop();
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.__lenis?.start();
      window.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  if (!project) return null;

  const images = project.images && project.images.length > 0 ? project.images : [`https://picsum.photos/900/700?random=1`];
  const marqueeImages = images.length > 1 ? [...images, ...images] : images;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} details`}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-3 sm:p-4 md:p-8"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-[20px] border-4 border-black bg-white shadow-md sm:max-h-[88vh] sm:rounded-[24px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="relative h-40 w-full overflow-hidden bg-black/5 sm:h-52 md:h-64">
          {images.length > 1 ? (
            <div
              className="project-modal-marquee flex h-full"
              style={{ width: `${marqueeImages.length * 100}%`, animationDuration: `${images.length * 5}s` }}
            >
              {marqueeImages.map((src, i) => (
                <img
                  key={`${src}-${i}`}
                  src={src}
                  alt={i < images.length ? `${project.title} — ${project.type} project screenshot ${i + 1} of ${images.length}` : ""}
                  aria-hidden={i >= images.length}
                  loading="lazy"
                  style={{ width: `${100 / marqueeImages.length}%` }}
                  className="h-full shrink-0 object-cover"
                />
              ))}
            </div>
          ) : (
            <img src={images[0]} alt={`${project.title} — ${project.type} project screenshot`} className="h-full w-full object-cover" />
          )}

          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="absolute top-3 right-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-black bg-white/40 backdrop-blur-[1px] transition-colors duration-300 hover:bg-black hover:text-white"
          >
            <HiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain" data-lenis-prevent>
          <div className=" px-3 pb-2 pt-4 sm:px-7 sm:pt-6 sm:pb-6">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-instrument size28 capitalize">{project.title}</h3>
              <span className="shrink-0 rounded-full border bg-white px-3 py-1 font-bricolage-semibold size12 text-blue border-black/20">
                {project.year}
              </span>
            </div>
            <p className="mt-1 font-bricolage-semibold size16 uppercase text-grey">{project.type}</p>

            <div className="lg:my-4 my-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border px-3 py-1 font-bricolage size12 uppercase border-black/20 text-orange">
                {project.company}
              </span>
              <span className="rounded-full px-3 py-1 font-bricolage size12 uppercase bg-black text-white">{project.contribution}</span>
            </div>

            <div className="flex flex-col items-start">
              <p className=" font-bricolage-semibold size16 uppercase text-grey">Overview</p>
              <p className=" font-bricolage size14 leading-6 text-justify text-black">{stripEmphasisMarkup(project.description)}</p>
            </div>
            <div className="lg:my-4 my-2  flex flex-col items-start">
              <p className="font-bricolage-semibold size16 uppercase text-grey">What I did</p>
              <p className=" font-bricolage size14 leading-6 text-justify text-black">{stripEmphasisMarkup(project.role)}</p>
            </div>
            {project.tools && project.tools.length > 0 && <p className=" font-bricolage-semibold size16 uppercase text-grey">Tools</p>}
          </div>

          {project.tools && project.tools.length > 0 && (
            <>
              <div className="lg:mb-4 mb-2 overflow-hidden">
                <div
                  className="project-modal-marquee flex w-max gap-2"
                  style={{ animationDuration: `${Math.max(project.tools.length * 2, 8)}s` }}
                >
                  {[...project.tools, ...project.tools].map((tool, i) => (
                    <span
                      key={`${tool}-${i}`}
                      className="shrink-0 rounded-full border px-3 py-1 font-bricolage size12 border-black/20 text-black"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default ProjectModal;
