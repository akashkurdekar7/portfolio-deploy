import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

import AnimeGreeter from "./AnimeGreeter";
import Crowd from "./Crowd";
import RollingText from "./RollingText";
import sheet from "../assets/open-peeps-sheet.png";
import { useScrambleReveal } from "../utils/useScrambleReveal";

const DESKTOP_QUERY = "(min-width: 992px)";

const Footer = () => {
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const headingLine1Ref = useRef<HTMLSpanElement>(null);
  const headingLine2Ref = useRef<HTMLSpanElement>(null);
  const headingLine3Ref = useRef<HTMLSpanElement>(null);
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== "undefined" && window.matchMedia(DESKTOP_QUERY).matches);

  useScrambleReveal([
    {
      trigger: footerRef,
      start: "top 80%",
      targets: [
        { ref: eyebrowRef, text: "thoughts • work • life" },
        { ref: headingLine1Ref, text: "let's get to the" },
        { ref: headingLine2Ref, text: "awkward" },
        { ref: headingLine3Ref, text: "part." },
      ],
    },
  ]);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);

    mql.addEventListener("change", handleChange);

    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const links = [
    {
      name: "linkedin",
      icon: <FaLinkedin />,
      link: "https://www.linkedin.com/in/akashkurdekar/",
    },
    {
      name: "Instagram",
      icon: <FaInstagram />,
      link: "https://www.instagram.com/unlikeakash_",
    },
    {
      name: "G-mail",
      icon: <FaEnvelope />,
      link: "mailto:akashkurdekar39@gmail.com",
    },
    {
      name: "Github",
      icon: <FaGithub />,
      link: "https://github.com/akashkurdekar7",
    },
  ];

  return (
    <footer ref={footerRef} className="bg-black relative z-60 min-h-dvh lg:min-h-screen px-6 md:px-20  pt-5 lg:pt-25 ">
      <svg className="absolute -top-[4%] left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="
          M0,45
          C130,75 220,5 360,42
          C500,78 590,10 720,45
          C850,80 950,5 1080,42
          C1200,75 1320,15 1440,48
          L1440,80
          L0,80
          Z
        "
          fill="#111111"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {isDesktop ? (
          <Crowd src={sheet} rows={15} cols={7} className="h-full w-full" />
        ) : (
          <AnimeGreeter className="h-full w-full" belowRef={navRef} />
        )}
      </div>
      {/* Heading */}
      <div className="relative z-20 pt-8 md:pt-0 md:flex  w-full items-start justify-between">
        <div className="">
          <span ref={eyebrowRef} className="font-bricolage size16 uppercase tracking-[0.15em] text-white">
            thoughts • work • life
          </span>
          <h2 className=" font-bricolage-semibold leading-9 lg:leading-18 size90 capitalize text-white  ">
            <span ref={headingLine1Ref}>let's get to the</span>
            <br />
            <span ref={headingLine2Ref} className="font-italic text-white/50  tracking-normal">
              awkward
            </span>
            {" "}
            <span ref={headingLine3Ref} className="font-bricolage-semibold">
              part.
            </span>
          </h2>
        </div>
        {/* Social Links */}
        <nav ref={navRef} aria-label="Social links" className="mt-8 md:mt-12">
          <ul className="border-t border-white/15">
            {links.map((item, i) => (
              <li key={item.name} className="border-b border-white/15">
                <a
                  href={item.link}
                  target={item.name === "G-mail" ? undefined : "_blank"}
                  rel={item.name === "G-mail" ? undefined : "noreferrer"}
                  className="group/link relative flex items-center justify-between gap-30 py-2 "
                >
                  <span className="flex items-center gap-4 md:gap-7">
                    <span className="flex w-8 shrink-0 font-bricolage-semibold size56 text-white/40">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex w-8 shrink-0 items-center justify-center text-2xl text-white/50 transition-colors duration-300 group-hover/link:text-orange md:w-12 md:text-4xl">
                      {item.icon}
                    </span>
                    <span className="link-cube-wrap relative inline-block [perspective:300px]">
                      <span className="link-cube-inner relative block transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d] group-hover/link:[transform:rotateX(-90deg)]">
                        <span className="link-cube-face block font-bricolage size28 uppercase tracking-wide text-white [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateX(0deg)_translateZ(0.55em)]">
                          {item.name}
                        </span>
                        <span
                          aria-hidden="true"
                          className="link-cube-face absolute inset-0 block font-bricolage size28 uppercase tracking-wide text-orange [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateX(90deg)_translateZ(0.55em)]"
                        >
                          {item.name}
                        </span>
                      </span>
                    </span>
                  </span>

                  <span className="text-white/40 transition-all duration-500 ease-out group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-hover/link:text-orange">
                    <FaArrowUpRightFromSquare className="text-xl md:text-3xl" />
                  </span>

                  <span className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-right scale-x-0 bg-orange transition-transform duration-500 ease-out group-hover/link:origin-left group-hover/link:scale-x-100" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Bottom Info */}
      <div
        className="
    absolute bottom-4 left-1/2 z-20
    flex w-full -translate-x-1/2
    flex-col items-center gap-2
    px-6
    text-white
    lg:flex-row lg:items-end lg:justify-between lg:px-20
  "
      >
        {/* LOCATION */}
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
      px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 cursor-pointer">
            <span>Based in</span>

            <RollingText primary="Karnataka" primaryClassName="font-instrument" secondary="India" secondaryClassName="font-italic" />
          </div>
        </div>

        {/* NAME */}
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
     px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 capitalize cursor-pointer">
            <RollingText
              primary="Akash Kurdekar"
              primaryClassName="text-center font-instrument"
              secondary="Let's talk"
              secondaryClassName="text-center font-italic"
            />
          </div>
        </div>

        {/* OPPORTUNITIES */}
        <div
          className="
      rounded-full
      border border-white/15
      bg-black/10
      px-4 lg:py-2 py-1
      backdrop-blur-md
      backdrop-saturate-150
      shadow-[0_4px_20px_rgba(0,0,0,0.08)]
    "
        >
          <div className="group flex items-baseline gap-1 font-instrument size16 cursor-pointer">
            <span>Looking for</span>

            <RollingText primary="Opportunities" primaryClassName="font-instrument" secondary="Work" secondaryClassName="font-italic" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
