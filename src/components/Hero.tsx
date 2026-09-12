import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import profile from "../assets/profile.webp";
import profile700 from "../assets/profile-700w.webp";
import clouds from "../assets/clouds.webp";
import gsap from "gsap";
import type Lenis from "lenis";

interface HeroProps {
  /** Whether the loader has finished and the hero image may reveal. */
  revealed: boolean;
}

const Hero = ({ revealed }: HeroProps) => {
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
      icon: <IoMailOutline />,
      link: "mailto:akashkurdekar39@gmail.com",
    },
    {
      name: "Github",
      icon: <FaGithub />,
      link: "https://github.com/akashkurdekar7",
    },
  ];
  const cloudRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroImageWrapRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLImageElement>(null);
  const heroLineRefs = useRef<(HTMLElement | null)[]>([]);
  const connectInnerRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // Which side each cloud (in cloudRefs order: top-right, middle-left,
  // middle-right, profile/top-left, bottom-right) flies in from — 1 = from
  // the right, -1 = from the left — so it matches which edge it already
  // sits nearest to.
  const cloudEntryDirections = [1, -1, 1, -1, 1];
  const CLOUD_OFFSCREEN_OFFSET = 260;

  // Keep the hero image clipped shut (and zoomed in), the clouds pushed
  // off-screen, and the text/socials slid down out of their overflow-hidden
  // masks until `revealed` flips true below, so each has something to
  // animate in from instead of sitting fully visible, already animated,
  // behind the loader the whole time — mirrors the header's pre-reveal
  // y/opacity set in Header.tsx.
  useLayoutEffect(() => {
    const wrap = heroImageWrapRef.current;
    const img = heroImageRef.current;
    if (!wrap || !img) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.set(wrap, { clipPath: "inset(0% 100% 0% 0% round 20px)" });
    gsap.set(img, { scale: 1.2 });

    cloudRefs.current.forEach((cloud, index) => {
      if (!cloud) return;
      gsap.set(cloud, { x: cloudEntryDirections[index] * CLOUD_OFFSCREEN_OFFSET, opacity: 0 });
    });

    gsap.set([...heroLineRefs.current, connectInnerRef.current], { yPercent: 100 });
  }, []);

  // Wipe the hero image open, fly the clouds in from their nearest edge,
  // and slide the text/socials up out of their overflow-hidden masks, once
  // the loader has finished and the hero may animate into view.
  useLayoutEffect(() => {
    if (!revealed) return;

    const wrap = heroImageWrapRef.current;
    const img = heroImageRef.current;
    if (!wrap || !img) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(wrap, { clipPath: "inset(0% 0% 0% 0% round 20px)" });
      gsap.set(img, { scale: 1 });
      cloudRefs.current.forEach((cloud) => {
        if (!cloud) return;
        gsap.set(cloud, { x: 0, opacity: 1 });
      });
      gsap.set([...heroLineRefs.current, connectInnerRef.current], { yPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: 0.2 });
      tl.to(wrap, { clipPath: "inset(0% 0% 0% 0% round 20px)", duration: 1.2, ease: "power4.inOut" });
      tl.to(img, { scale: 1, duration: 1.4, ease: "power3.out" }, 0.15);

      tl.to(
        cloudRefs.current.filter((cloud): cloud is HTMLDivElement => cloud !== null),
        { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", stagger: 0.12 },
        0.25,
      );

      tl.to(
        heroLineRefs.current.filter((line): line is HTMLElement => line !== null),
        { yPercent: 0, duration: 0.8, ease: "power4.out", stagger: 0.15 },
        0.5,
      );

      tl.to(connectInnerRef.current, { yPercent: 0, duration: 0.8, ease: "power4.out" }, 0.9);
    });

    return () => ctx.revert();
  }, [revealed]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const mouseStrengths = [40, 25, 30, 20, 50];
    // How far (px, max ~10) each cloud drifts once the user has scrolled one
    // full viewport height. Sign controls direction (left/right, up/down).
    const scrollStrengthsX = [-10, 8, -9, 7, -10];
    const scrollStrengthsY = [6, -7, 5, -6, 8];

    const mouse = { x: 0, y: 0 };
    let scrollProgress = 0;

    const applyTransforms = () => {
      cloudRefs.current.forEach((cloud, index) => {
        if (!cloud) return;

        gsap.to(cloud, {
          x: mouse.x * mouseStrengths[index] + scrollStrengthsX[index] * scrollProgress,
          y: mouse.y * mouseStrengths[index] + scrollStrengthsY[index] * scrollProgress,
          duration: 0.9,
          ease: "power3.out",
          overwrite: true,
        });
      });
    };

    // Only enable mouse parallax on devices that actually have a mouse
    // (touch devices don't send meaningful mousemove events).
    const hasMouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const handleMouseMove = (event: MouseEvent) => {
      if (!hasMouse) return;
      mouse.x = event.clientX / window.innerWidth - 0.5;
      mouse.y = event.clientY / window.innerHeight - 0.5;
      applyTransforms();
    };

    // Drive the scroll side of the parallax off Lenis's own scroll value
    // (set on window by SmoothScroll) so it stays perfectly in sync with the
    // smoothed scroll instead of the raw, un-smoothed native scroll event.
    const lenis = window.__lenis;

    const handleLenisScroll = (instance: Lenis) => {
      scrollProgress = Math.min(instance.scroll / window.innerHeight, 1);
      applyTransforms();
    };

    const handleNativeScroll = () => {
      scrollProgress = Math.min(window.scrollY / window.innerHeight, 1);
      applyTransforms();
    };

    window.addEventListener("mousemove", handleMouseMove);

    if (lenis) {
      lenis.on("scroll", handleLenisScroll);
    } else {
      window.addEventListener("scroll", handleNativeScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (lenis) {
        lenis.off("scroll", handleLenisScroll);
      } else {
        window.removeEventListener("scroll", handleNativeScroll);
      }
    };
  }, []);
  const SparkleStar = ({ className = "" }: { className?: string }) => (
    <svg viewBox="0 0 78 78" fill="none" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M34.7508 2.95859C35.8135 -0.988131 41.4131 -0.988144 42.4757 2.95858L48.6211 25.7829C48.9918 27.1595 50.0671 28.2348 51.4436 28.6054L74.268 34.7508C78.2147 35.8135 78.2147 41.4131 74.268 42.4757L51.4436 48.6211C50.0671 48.9918 48.9918 50.0671 48.6211 51.4436L42.4757 74.268C41.4131 78.2147 35.8135 78.2147 34.7508 74.268L28.6054 51.4436C28.2348 50.0671 27.1595 48.9918 25.7829 48.6211L2.95859 42.4757C-0.988131 41.4131 -0.988144 35.8135 2.95858 34.7508L25.7829 28.6054C27.1595 28.2348 28.2348 27.1595 28.6054 25.7829L34.7508 2.95859Z"
      />
    </svg>
  );

  // Pyramid of sparkles stacked in the image's bottom-left corner — one row
  // of 1 star at top, growing to a row of 5 at the bottom.
  const sparkleRows = [1, 2, 3, 4, 5];
  return (
    <section className="relative flex min-h-dvh items-center justify-center lg:mx-20 mx-6">
      <div className="flex flex-col items-center gap-10 relative z-30">
        <div ref={heroImageWrapRef} className="hero-image overflow-hidden relative h-80 w-full md:w-170 rounded-[20px] border-6">
          <img
            ref={heroImageRef}
            src={profile}
            srcSet={`${profile700} 700w, ${profile} 2208w`}
            sizes="(min-width: 768px) 680px, calc(100vw - 48px)"
            alt="Akash Kurdekar — software engineer, project lead, and designer"
            className="h-full w-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
            loading="eager"
            fetchPriority="high"
            width={2208}
            height={1242}
          />

          <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-1 lg:bottom-5 lg:left-5">
            {sparkleRows.map((count, rowIndex) => (
              <div key={rowIndex} className="flex gap-1">
                {Array.from({ length: count }).map((_, starIndex) => (
                  <SparkleStar key={starIndex} className="h-3 w-3 shrink-0 text-orange lg:h-3.5 lg:w-3.5" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* HERO CONTENT */}
        <div className="flex flex-col items-center justify-center">
          <div className="overflow-hidden">
            <h1
              ref={(el) => {
                heroLineRefs.current[0] = el;
              }}
              className="size56 font-instrument leading-none capitalize"
            >
              akash <span className="text-blue font-italic">kurdekar</span>
            </h1>
          </div>

          <div className="lg:my-5 my-2 overflow-hidden">
            <ul
              ref={(el) => {
                heroLineRefs.current[1] = el;
              }}
              className="flex flex-wrap gap-x-2 font-bricolage-semibold size14 uppercase"
            >
              <li>software engineer</li>
              <li>•</li>
              <li>Full stack developer</li>
              <li>•</li>
              <li>Project Delivery</li>
              <li>•</li>
              <li>designer</li>
            </ul>
          </div>

          <div className="w-full overflow-hidden">
            <p
              ref={(el) => {
                heroLineRefs.current[2] = el;
              }}
              className="w-full lg:max-w-lg text-center size18 lg:leading-6 font-bricolage text-grey"
            >
              Curious about a lot of things, always learning, and never quite interested in doing just one thing.
            </p>
          </div>
        </div>
      </div>

      {/* SOCIALS */}
      <div className="group absolute bottom-4 z-30 left-0 overflow-hidden">
        <div ref={connectInnerRef} className="flex items-start gap-1 flex-col">
          <h3 className="font-bricolage-semibold size16 uppercase mb-0">let's connect</h3>

          <div className={`h-px ${isScrolled ? "w-full" : "w-[22%]"} group-hover:w-full transition-all duration-1000 bg-orange`} />

          <ul className="flex items-center gap-4 w-full justify-between">
            {links.map((item) => (
              <li key={item.name} className="cursor-pointer transition hover:-translate-y-[.5px]">
                <a
                  href={item.link}
                  target={item.link.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.link.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={item.name}
                >
                  {React.cloneElement(item.icon, { size: 18 })}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* TOP RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[0] = el;
        }}
        className="absolute top-0 lg:-top-12 -right-10 lg:-right-8 z-20 cloud-parallax"
      >
        <img
          src={clouds}
          alt=""
          aria-hidden="true"
          className=" h-20 lg:h-auto w-full object-cover"
          loading="lazy"
          title="Cloud"
          width={276}
          height={176}
        />
      </div>

      {/* MIDDLE LEFT */}
      <div
        ref={(el) => {
          cloudRefs.current[1] = el;
        }}
        className="absolute top-[88%] lg:top-[60%] left-[-10%] z-20 -translate-x-1/2 cloud-parallax -translate-y-1/2 "
      >
        <img
          src={clouds}
          alt=""
          aria-hidden="true"
          className=" h-10 lg:h-auto w-full object-cover"
          loading="lazy"
          title="Cloud"
          width={276}
          height={176}
        />
      </div>

      {/* MIDDLE RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[2] = el;
        }}
        className="absolute top-[65%] lg:top-[60%] right-0 lg:right-[30%] z-20 -translate-y-1/2 cloud-parallax"
      >
        <img
          src={clouds}
          alt=""
          aria-hidden="true"
          className=" h-auto w-20 lg:w-30 object-cover"
          loading="lazy"
          title="Cloud"
          width={276}
          height={176}
        />
      </div>

      {/* PROFILE */}
      <div
        ref={(el) => {
          cloudRefs.current[3] = el;
        }}
        className="absolute top-[15%] lg:top-[15%] -left-15 lg:left-[20%] z-20 -translate-y-1/2 cloud-parallax"
      >
        <img
          src={clouds}
          alt=""
          aria-hidden="true"
          className=" h-20 lg:h-auto w-full object-cover"
          loading="lazy"
          title="Cloud"
          width={276}
          height={176}
        />
      </div>

      {/* BOTTOM RIGHT */}
      <div
        ref={(el) => {
          cloudRefs.current[4] = el;
        }}
        className="absolute -right-5 lg:-right-20 -bottom-10 lg:-bottom-40 z-20 w-[40%] lg:w-[25%] cloud-parallax "
      >
        <img
          src={clouds}
          alt=""
          aria-hidden="true"
          className=" h-auto w-full object-cover"
          loading="lazy"
          title="Cloud"
          width={276}
          height={176}
        />

        <div
          className={`absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-bricolage-semibold size14 uppercase hero-side-content transition-opacity duration-700  w-max`}
        >
          DOWN YOU GO
        </div>
      </div>
    </section>
  );
};

export default Hero;
