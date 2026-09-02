import { useEffect, useRef, useState } from 'react';
import { HiMenuAlt3, HiX } from 'react-icons/hi';
import gsap from 'gsap';

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

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scrolling when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // GSAP mobile menu animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(menuRef.current, {
        yPercent: -100,
        opacity: 0,
        scale: 0.98,
      });

      gsap.set(menuLinksRef.current, {
        y: 80,
        opacity: 0,
      });

      gsap.set(availabilityRef.current, {
        y: 30,
        opacity: 0,
      });

      menuTimeline.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: 'power4.out',
        },
      });

      menuTimeline.current
        .to(menuRef.current, {
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
        })
        .to(
          menuLinksRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power4.out',
          },
          '-=0.45',
        )
        .to(
          availabilityRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
          },
          '-=0.35',
        );
    });

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
        ${scrolled ? ' backdrop-blur-sm shadow-md' : ' shadow-none'}`}
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
              <a href="#work" className="link-rollover">
                <span className="link-rollover-inner">
                  <span className="font-italic link-rollover-text">Work</span>

                  <span className="font-instrument link-rollover-text text-orange" aria-hidden="true">
                    Work
                  </span>
                </span>

                <span className="link-rollover-line bg-orange" />
              </a>
            </li>
            <li className="flex items-center">
              <a href="#projects" className="link-rollover">
                <span className="link-rollover-inner">
                  <span className="font-italic link-rollover-text">Projects</span>

                  <span className="font-instrument link-rollover-text text-blue" aria-hidden="true">
                    Projects
                  </span>
                </span>

                <span className="link-rollover-line bg-blue" />
              </a>
            </li>
            <li className="flex items-center">
              <a href="#projects" className="link-rollover">
                <span className="link-rollover-inner">
                  <span className="font-italic link-rollover-text">Resume</span>

                  <span className="font-instrument link-rollover-text text-orange" aria-hidden="true">
                    Resume
                  </span>
                </span>

                <span className="link-rollover-line bg-orange" />
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
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <HiX size={21} /> : <HiMenuAlt3 size={21} />}
          </button>
        </nav>
      </header>

      {/* MOBILE FULLSCREEN MENU */}
      <div ref={menuRef} className="fixed inset-0 z-40 flex items-center justify-center bg-white md:hidden">
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
