import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaArrowRight, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
import { HiX } from "react-icons/hi";
import HighlightCircle from "./HighlightCircle";
import resumePdf from "../assets/resume/Akash_Kurdekar_Full_Stack_Engineer.pdf?url";

gsap.registerPlugin(ScrollTrigger);

const RESUME_PATH = resumePdf;
const RESUME_FILENAME = "Akash_Kurdekar_Full_Stack_Engineer.pdf";

const Resume = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const arrowPathRef = useRef<SVGPathElement>(null);
  const [pdfAvailable, setPdfAvailable] = useState<boolean | null>(null);
  const [canPreviewInline, setCanPreviewInline] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // A missing public/resume.pdf falls through to the SPA's own index.html on
  // most dev servers/hosts, which an <object type="application/pdf"> happily
  // renders as a nested page instead of failing — so check the real response
  // before ever pointing the embed at it. Deferred until the section is
  // about to scroll into view so this fetch doesn't compete with the
  // initial page load's critical requests (Resume mounts eagerly with the
  // rest of the page, well above the fold's worth of scrolling away).
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    let cancelled = false;

    const checkPdf = () => {
      fetch(RESUME_PATH, { method: "HEAD" })
        .then((res) => {
          if (cancelled) return;
          setPdfAvailable(res.ok && (res.headers.get("content-type") || "").includes("pdf"));
        })
        .catch(() => {
          if (!cancelled) setPdfAvailable(false);
        });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          checkPdf();
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // Android Chrome (and most mobile browsers) has no built-in PDF plugin for
  // <object>/<embed> — it only renders a PDF when navigating to it directly.
  // Embedding it anyway just shows a blank/broken plugin placeholder, so
  // detect real inline-preview support and open the file directly instead.
  useEffect(() => {
    const nav = navigator as Navigator & { pdfViewerEnabled?: boolean };
    if (typeof nav.pdfViewerEnabled === "boolean") {
      setCanPreviewInline(nav.pdfViewerEnabled);
      return;
    }
    setCanPreviewInline(!/Android|iPhone|iPad|iPod/i.test(navigator.userAgent));
  }, []);

  const canShowInlinePreview = pdfAvailable === true && canPreviewInline;

  const handleOpenPreview = () => {
    if (canPreviewInline) {
      lastFocusedRef.current = document.activeElement as HTMLElement;
      setModalOpen(true);
    } else {
      window.open(RESUME_PATH, "_blank", "noopener,noreferrer");
    }
  };

  // Lock background scroll, move focus into the dialog, allow Escape to
  // close, and return focus to whichever button opened it — without this a
  // keyboard/screen-reader user's focus is left behind on a now-hidden
  // trigger instead of following the dialog that just took over the screen.
  useEffect(() => {
    if (!modalOpen) return;

    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      lastFocusedRef.current?.focus();
    };
  }, [modalOpen]);

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".resume-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        },
      );

      if (arrowPathRef.current) {
        const length = arrowPathRef.current.getTotalLength();

        gsap.set(arrowPathRef.current, { strokeDasharray: length, strokeDashoffset: length });

        gsap.to(arrowPathRef.current, {
          strokeDashoffset: 0,
          duration: 1,
          ease: "power2.out",
          delay: 0.4,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="resume"
      ref={sectionRef}
      className="relative mx-5 min-h-screen py-16 lg:flex lg:min-h-screen lg:items-center lg:py-24 md:mx-20"
    >
      <div className="relative w-full grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-8">
        {/* LEFT — HEADER */}
        <div className="resume-reveal lg:col-span-3">
          <h2 className="mt-4 lg:mt-8 max-w-md font-chunko size64 leading-[0.95]">
            Grab my
            <br />
            <HighlightCircle color="var(--orange)">
              <span className="font-italic text-orange">résumé.</span>
            </HighlightCircle>
          </h2>

          {/* SCRIBBLE UNDERLINE */}
          <svg viewBox="0 0 160 20" className="mt-4 h-4 w-32 overflow-visible" aria-hidden="true">
            <path
              d="M2,10 C30,2 50,16 78,8 C100,2 120,14 140,7"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          <p className="mt-6 max-w-xs font-space size14 leading-6 text-grey lg:text-justify">
            Everything you've just read, on one page — roles, stack, and the shape of the work.
          </p>
        </div>

        {/* CENTER — PDF PREVIEW CARD */}
        <div className="resume-reveal relative flex justify-center lg:col-span-6">
          {/* SCRIBBLE NOTE */}
          <div className="pointer-events-none absolute -top-12 left-12 z-20 hidden -rotate-3 lg:block">
            <span className="font-scribble size18 text-blue">have a look!!</span>
            <svg viewBox="0 0 120 70" className="mt-1 h-12 w-24 overflow-visible" aria-hidden="true">
              <path
                ref={arrowPathRef}
                d="M8,10 C42,4 70,32 88,50 M88,50 L72,44 M88,50 L94,32"
                fill="none"
                stroke="var(--blue)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={handleOpenPreview}
            aria-label="Open full resume preview"
            className="group relative block w-full overflow-hidden rounded-2xl border-4 border-black bg-white text-left shadow-md lg:w-auto lg:h-[72vh] lg:aspect-[3/4]"
          >
            <div className="aspect-[3/4] w-full overflow-hidden md:aspect-[16/10] lg:h-full lg:w-full lg:aspect-auto">
              {canShowInlinePreview ? (
                <object
                  data={`${RESUME_PATH}#toolbar=0&navpanes=0&view=FitH`}
                  type="application/pdf"
                  className="pointer-events-none h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-white p-8 text-center font-space size14 leading-6 text-grey">
                  <p>
                    {pdfAvailable === null
                      ? "Loading preview…"
                      : pdfAvailable
                        ? "Tap to view the résumé."
                        : "Preview isn't available right now."}
                  </p>
                </div>
              )}
            </div>

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-500 group-hover:bg-black/40">
              <span className="link-circle flex scale-90 items-center justify-center rounded-full border-[3px] border-black bg-white opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-100 group-hover:opacity-100">
                <FaArrowRight
                  size={20}
                  className="-rotate-45 text-orange transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-0"
                />
              </span>
            </div>
          </button>
        </div>

        {/* RIGHT — INFO + DOWNLOAD */}
        <div className="resume-reveal lg:col-span-3">
          <h3 className="font-instrument size44 leading-[1.2]">Akash Kurdekar</h3>
          <h4 className="mt-1 font-space size14 uppercase text-orange">Computer Science Engineer</h4>
          <p className="mt-4 max-w-xs font-space size14 leading-6 text-grey">
            React, TypeScript, and the occasional over-engineered scroll animation — the full breakdown lives in the PDF.
          </p>

          {/* SCRIBBLE DOTS */}
          <svg viewBox="0 0 60 14" className="mt-4 h-3 w-14 overflow-visible" aria-hidden="true">
            <circle cx="4" cy="7" r="3" fill="var(--blue)" />
            <circle cx="20" cy="7" r="3" fill="var(--orange)" />
            <circle cx="36" cy="7" r="3" fill="var(--blue)" />
          </svg>

          <div className="mt-6 flex flex-wrap items-center gap-5">
            <a
              href={RESUME_PATH}
              download={RESUME_FILENAME}
              className="group/btn flex items-center gap-3 rounded-md border border-black bg-white px-5 py-3 shadow-[0_4px_0_0_#fff,0_4px_0_1px_rgba(0,0,0,1)] transition-all duration-200 ease-out [transform-style:preserve-3d] hover:translate-y-1 hover:[transform:translateY(0.25rem)_translateZ(-4px)] hover:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)] active:[transform:translateY(0.25rem)_translateZ(-6px)] active:shadow-[0_1px_0_0_#fff,0_1px_0_1px_rgba(0,0,0,1)]"
            >
              <FaDownload className="text-orange" />
              <span className="font-space size14 uppercase">Download PDF</span>
            </a>

            <button
              type="button"
              onClick={handleOpenPreview}
              className="font-space size14 uppercase text-grey underline decoration-dotted underline-offset-4 transition-colors duration-300 hover:text-black"
            >
              View full screen
            </button>
          </div>
        </div>
      </div>

      {/* FULLSCREEN PREVIEW MODAL — portalled to <body> so it escapes the loader's
          blurred wrapper in App.tsx; a `filter` on that ancestor would otherwise
          become the containing block for this `fixed` overlay and break it. */}
      {modalOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Résumé preview"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 md:p-10"
            onClick={() => setModalOpen(false)}
          >
            <div
              className="relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border-4 border-black bg-white shadow-md"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b-2 border-black px-4 py-3 md:px-6">
                <span className="font-space size12 uppercase text-grey">Resume</span>

                <div className="flex items-center gap-4">
                  <a
                    href={RESUME_PATH}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 font-space size12 uppercase text-grey underline decoration-dotted underline-offset-4 transition-colors duration-300 hover:text-black"
                  >
                    <FaExternalLinkAlt size={12} />
                    Open in new tab
                  </a>

                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={() => setModalOpen(false)}
                    aria-label="Close résumé preview"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-black transition-colors duration-300 hover:bg-black hover:text-white"
                  >
                    <HiX size={20} />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 overflow-hidden bg-white">
                {canShowInlinePreview ? (
                  <object data={RESUME_PATH} type="application/pdf" className="h-full w-full">
                    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center font-space size14 leading-6 text-grey">
                      <p>Your browser can't preview PDFs inline.</p>
                      <a
                        href={RESUME_PATH}
                        download={RESUME_FILENAME}
                        className="flex items-center gap-2 rounded-md border border-black bg-white px-5 py-3 text-black shadow-[0_4px_0_0_#fff,0_4px_0_1px_rgba(0,0,0,1)]"
                      >
                        <FaDownload className="text-orange" />
                        <span className="uppercase">Download PDF</span>
                      </a>
                    </div>
                  </object>
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center font-space size14 leading-6 text-grey">
                    <p>
                      {pdfAvailable === null
                        ? "Loading preview…"
                        : pdfAvailable
                          ? "Your browser can't preview PDFs inline."
                          : "Preview isn't available right now."}
                    </p>
                    {pdfAvailable && (
                      <a
                        href={RESUME_PATH}
                        download={RESUME_FILENAME}
                        className="flex items-center gap-2 rounded-md border border-black bg-white px-5 py-3 text-black shadow-[0_4px_0_0_#fff,0_4px_0_1px_rgba(0,0,0,1)]"
                      >
                        <FaDownload className="text-orange" />
                        <span className="uppercase">Download PDF</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default Resume;
