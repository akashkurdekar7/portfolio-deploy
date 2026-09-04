import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import gsap from "gsap";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuLinksRef = useRef<(HTMLLIElement | null)[]>([]);
  const availabilityRef = useRef<HTMLDivElement>(null);
  const menuTimeline = useRef<gsap.core.Timeline | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // GSAP mobile menu animation
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuRef.current, {
        yPercent: -100,
        autoAlpha: 0,
        scale: 0.98,
      });

      gsap.set(menuLinksRef.current, {
        y: 80,
        autoAlpha: 0,
      });

      gsap.set(availabilityRef.current, {
        y: 30,
        autoAlpha: 0,
      });

      menuTimeline.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power4.out",
        },
      });

      menuTimeline.current
        .to(menuRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          scale: 1,
          duration: 0.7,
        })
        .to(
          menuLinksRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.6,
            stagger: 0.08,
          },
          "-=0.35",
        )
        .to(
          availabilityRef.current,
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
          },
          "-=0.25",
        );
    }, menuRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!menuTimeline.current) return;

    if (menuOpen) {
      menuTimeline.current.play();
    } else {
      menuTimeline.current.reverse();
    }
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header
        className={`fixed inset-x-0 top-0 z-50 px-6 md:px-20 py-3 transition-all duration-700 ease-out
        ${scrolled ? " backdrop-blur-sm shadow-md" : " shadow-none"}`}
      >
        <nav
          ref={navRef}
          className="
    relative mx-auto flex items-center justify-between
  "
        >
          {/* LOGO */}
          <div className="">
            <a href="/" className="z-20 font-chunko text-3xl uppercase transition-all duration-500">
              ak
            </a>
          </div>

          {/* DESKTOP NAV */}
          <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 text-lg md:flex">
            <li className="flex items-center">
              <a href="#work" className="group relative inline-block h-[1.4em] overflow-hidden leading-[1.4em]">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-[1.4em]">
                  <span className="h-[1.4em] whitespace-nowrap font-italic">Work</span>

                  <span className="h-[1.4em] whitespace-nowrap font-instrument text-orange" aria-hidden="true">
                    Work
                  </span>
                </span>

                <span className="absolute bottom-0 left-0 h-[2px] w-full origin-right scale-x-0 bg-orange transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
            <li className="flex items-center">
              <a href="#work" className="group relative inline-block h-[1.4em] overflow-hidden leading-[1.4em]">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-[1.4em]">
                  <span className="h-[1.4em] whitespace-nowrap font-italic">projects</span>

                  <span className="h-[1.4em] whitespace-nowrap font-instrument text-blue capitalize" aria-hidden="true">
                    projects
                  </span>
                </span>

                <span className="absolute bottom-0 left-0 h-[2px] w-full origin-right scale-x-0 bg-orange transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
            <li className="flex items-center">
              <a href="#work" className="group relative inline-block h-[1.4em] overflow-hidden leading-[1.4em]">
                <span className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(.76,0,.24,1)] group-hover:-translate-y-[1.4em]">
                  <span className="h-[1.4em] whitespace-nowrap font-italic">Resume</span>

                  <span className="h-[1.4em] whitespace-nowrap font-instrument text-orange capitalize" aria-hidden="true">
                    Resume
                  </span>
                </span>

                <span className="absolute bottom-0 left-0 h-[2px] w-full origin-right scale-x-0 bg-orange transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </a>
            </li>
          </ul>

          {/* DESKTOP AVAILABILITY */}
          <div className="ml-auto group hidden items-center gap-2 rounded-lg border border-black px-4 py-2 md:flex">
            <span className="relative flex h-2.5 w-2.5 items-center justify-center">
              <span className="absolute h-2.5 w-2.5 rounded-full border border-black transition-colors duration-300 group-hover:bg-[#ff5c00]" />
            </span>

            <span className="font-space text-xs uppercase">available for work</span>
          </div>

          {/* MOBILE BURGER */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="relative z-[60] flex h-10 w-10 cursor-grab items-center justify-center rounded-full border border-black md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <HiX size={21} /> : <HiMenuAlt3 size={21} />}
          </button>
        </nav>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div
        ref={menuRef}
        className="
    fixed inset-0 z-40
    flex items-center justify-center
    bg-white
    md:hidden
  "
      >
        <nav>
          <ul className="flex flex-col items-center gap-6 font-instrument text-6xl">
            <li
              ref={(el) => {
                menuLinksRef.current[0] = el;
              }}
            >
              <a href="#work" onClick={closeMenu} className="transition-colors duration-300 hover:text-orange">
                Work
              </a>
            </li>

            <li
              ref={(el) => {
                menuLinksRef.current[1] = el;
              }}
            >
              <a href="#projects" onClick={closeMenu} className="transition-colors duration-300 hover:text-orange">
                Projects
              </a>
            </li>

            <li
              ref={(el) => {
                menuLinksRef.current[2] = el;
              }}
            >
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                onClick={closeMenu}
                className="transition-colors duration-300 hover:text-orange"
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>

        {/* Bottom availability */}
        <div ref={availabilityRef} className="absolute bottom-6 flex size12 items-center gap-2 font-space uppercase">
          Available for work
        </div>
      </div>
    </>
  );
};

export default Header;
