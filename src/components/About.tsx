import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DEFAULT_EMOJI = '👋';

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const emojiInnerRef = useRef<HTMLSpanElement>(null);
  const quickX = useRef<gsap.QuickToFunc | null>(null);
  const quickY = useRef<gsap.QuickToFunc | null>(null);

  const [activeEmoji, setActiveEmoji] = useState(DEFAULT_EMOJI);
  const [isHovering, setIsHovering] = useState(false);

  // MOUSE-TRAILING EMOJI
  useEffect(() => {
    if (!emojiRef.current || window.matchMedia('(hover: none)').matches) return;

    quickX.current = gsap.quickTo(emojiRef.current, 'x', { duration: 0.5, ease: 'power3.out' });
    quickY.current = gsap.quickTo(emojiRef.current, 'y', { duration: 0.5, ease: 'power3.out' });

    const idleFloat = gsap.to(emojiInnerRef.current, {
      y: -12,
      rotate: 10,
      duration: 1.3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });

    const section = sectionRef.current;
    if (!section) return;

    let lastX = 0;

    const handleMove = (event: MouseEvent) => {
      const dx = event.clientX - lastX;
      lastX = event.clientX;

      quickX.current?.(event.clientX);
      quickY.current?.(event.clientY);

      gsap.to(emojiInnerRef.current, {
        rotate: gsap.utils.clamp(-30, 30, dx * 2),
        duration: 0.4,
        ease: 'power3.out',
      });

      if (watermarkRef.current) {
        const x = event.clientX / window.innerWidth - 0.5;
        const y = event.clientY / window.innerHeight - 0.5;

        gsap.to(watermarkRef.current, {
          x: x * 30,
          y: y * 30,
          duration: 1.4,
          ease: 'power3.out',
          overwrite: true,
        });
      }
    };

    const handleEnter = () => setIsHovering(true);
    const handleLeave = () => {
      setIsHovering(false);
      setActiveEmoji(DEFAULT_EMOJI);
    };

    section.addEventListener('mousemove', handleMove);
    section.addEventListener('mouseenter', handleEnter);
    section.addEventListener('mouseleave', handleLeave);

    return () => {
      section.removeEventListener('mousemove', handleMove);
      section.removeEventListener('mouseenter', handleEnter);
      section.removeEventListener('mouseleave', handleLeave);
      idleFloat.kill();
    };
  }, []);

  // SCROLL REVEAL
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-line', {
        yPercent: 110,
        opacity: 0,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      gsap.from('.about-fade', {
        opacity: 0,
        y: 24,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 55%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative overflow-hidden bg-black text-white md:cursor-none">
      {/* TOP WAVE */}
      <svg className="absolute -top-px left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0,40 C120,5 220,75 360,38 C500,0 590,70 720,35 C850,0 950,75 1080,38 C1200,5 1320,65 1440,30 L1440,0 L0,0 Z"
          fill="#f7f6f2"
        />
      </svg>

      {/* MOUSE-FOLLOW EMOJI */}
      <div
        ref={emojiRef}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-50 -translate-x-1/2 -translate-y-1/2 text-5xl transition-opacity duration-300 lg:text-6xl ${
          isHovering ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <span ref={emojiInnerRef} className="block">
          {activeEmoji}
        </span>
      </div>

      {/* WATERMARK */}
      <div
        ref={watermarkRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 select-none font-chunko text-orange opacity-[0.07] leading-none text-[42vw] lg:text-[26vw]"
      >
        01
      </div>

      <div className="relative z-10 mx-5 flex min-h-dvh flex-col justify-center py-28 md:mx-20 md:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8">
          {/* LABEL */}
          <div className="about-fade lg:col-span-2">
            <span className="font-space size12 uppercase text-grey">01 / About</span>
          </div>

          {/* MAIN CONTENT */}
          <div className="lg:col-span-8 lg:col-start-4">
            <h2 className="flex flex-col font-instrument size90 leading-[0.92]">
              <span className="overflow-hidden">
                <span className="about-line inline-block">I turn</span>
              </span>

              <span className="overflow-hidden">
                <span className="about-line inline-block">
                  <span className="font-italic text-blue md:cursor-none" onMouseEnter={() => setActiveEmoji('💡')}>
                    ideas
                  </span>{' '}
                  into
                </span>
              </span>

              <span className="overflow-hidden">
                <span className="about-line inline-block">
                  <span className="md:cursor-none" onMouseEnter={() => setActiveEmoji('💻')}>
                    digital
                  </span>{' '}
                  <span className="font-italic text-orange md:cursor-none" onMouseEnter={() => setActiveEmoji('✨')}>
                    experiences.
                  </span>
                </span>
              </span>
            </h2>

            <div className="about-fade mt-10 max-w-2xl">
              <p className="font-space size16 leading-6 text-grey">
                I'm a software engineer who enjoys working where technology, design, and interaction meet. I build
                digital products with a focus on thoughtful interfaces, clean implementation, and the details that make
                an experience feel intentional.
              </p>

              <p className="mt-6 font-space size16 leading-6 text-grey">
                From websites and dashboards to larger web applications, I like taking an idea from its first visual
                direction all the way to a polished, functional experience.
              </p>
            </div>

            {/* TAGS */}
            <div className="about-fade mt-10 flex flex-wrap gap-3">
              <span className="rounded-full bg-orange px-4 py-1.5 font-space size12 uppercase text-black">
                Software Engineer
              </span>
              <span className="rounded-full bg-blue px-4 py-1.5 font-space size12 uppercase text-white">
                Frontend / Full Stack
              </span>
              <span className="rounded-full border border-white px-4 py-1.5 font-space size12 uppercase text-white">
                Design &amp; Development
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM WAVE */}
      <svg className="absolute -bottom-px left-0 z-10 h-10 w-full" viewBox="0 0 1440 80" preserveAspectRatio="none">
        <path
          d="M0,45 C130,75 220,5 360,42 C500,78 590,10 720,45 C850,80 950,5 1080,42 C1200,75 1320,15 1440,48 L1440,80 L0,80 Z"
          fill="#f7f6f2"
        />
      </svg>
    </section>
  );
};

export default About;
