import { Fragment, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HighlightCircle from "./HighlightCircle";
import aboutProfile from "../assets/about/about-image.webp";
import aboutImg7808 from "../assets/about/IMG_7808.webp";
import aboutImg7816 from "../assets/about/IMG_7816.webp";
import aboutImg7832 from "../assets/about/IMG_7832.webp";
import aboutImg8613 from "../assets/about/IMG_8613.webp";
import aboutImg8714 from "../assets/about/IMG_8714.webp";
import aboutImg8820 from "../assets/about/IMG_8820.webp";
import aboutImg8830 from "../assets/about/IMG_8830.webp";
import aboutImg9806 from "../assets/about/IMG_9806.webp";
import aboutImg9900 from "../assets/about/IMG_9900.webp";
import aboutImg9950 from "../assets/about/IMG_9950.webp";
import aboutImg9978 from "../assets/about/IMG_9978.webp";
import aboutImg9991 from "../assets/about/IMG_9991.webp";

gsap.registerPlugin(ScrollTrigger);

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

const SparkleStar = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 78 78" fill="none" className={className} aria-hidden="true">
    <path
      fill="currentColor"
      d="M34.7508 2.95859C35.8135 -0.988131 41.4131 -0.988144 42.4757 2.95858L48.6211 25.7829C48.9918 27.1595 50.0671 28.2348 51.4436 28.6054L74.268 34.7508C78.2147 35.8135 78.2147 41.4131 74.268 42.4757L51.4436 48.6211C50.0671 48.9918 48.9918 50.0671 48.6211 51.4436L42.4757 74.268C41.4131 78.2147 35.8135 78.2147 34.7508 74.268L28.6054 51.4436C28.2348 50.0671 27.1595 48.9918 25.7829 48.6211L2.95859 42.4757C-0.988131 41.4131 -0.988144 35.8135 2.95858 34.7508L25.7829 28.6054C27.1595 28.2348 28.2348 27.1595 28.6054 25.7829L34.7508 2.95859Z"
    />
  </svg>
);

const reelItems = [
  { src: aboutImg7808, name: "Backpack Buddy" },
  { src: aboutImg7816, name: "Golden Hour" },
  { src: aboutImg7832, name: "Temple Skies" },
  { src: aboutImg8613, name: "Rainy drive" },
  { src: aboutImg8714, name: "Cafe hangover" },
  { src: aboutImg8820, name: "coffee vibes" },
  { src: aboutImg8830, name: "morning mug" },
  { src: aboutImg9806, name: "misty valley" },
  { src: aboutImg9900, name: "night glow" },
  { src: aboutImg9950, name: "through the leaves" },
  { src: aboutImg9978, name: "blue hour" },
  { src: aboutImg9991, name: "local boats" },
];
const buildWavePath = (count: number) => {
  const segment = 260;
  let d = "M0,50";
  for (let i = 1; i <= count; i++) {
    const x = i * segment;
    const midX = x - segment / 2;
    const y = i % 2 === 0 ? 82 : 18;
    d += ` Q${midX},${y} ${x},50`;
  }
  return d;
};
// Split into words up front so each one can carry its own emphasis color
// (technical/descriptive words in black, connective words + the closing
// joke in grey) and animate in individually as the paragraph scrolls by.
const TAGLINE_WORDS: { text: string; grey?: boolean }[] = [
  { text: "I’m", grey: true },
  { text: "a", grey: true },
  { text: "software" },
  { text: "engineer" },
  { text: "who", grey: true },
  { text: "likes", grey: true },
  { text: "turning" },
  { text: "messy" },
  { text: "ideas" },
  { text: "into", grey: true },
  { text: "thoughtful" },
  { text: "digital" },
  { text: "experiences." },
  { text: "I", grey: true },
  { text: "build" },
  { text: "fast," },
  { text: "scalable" },
  { text: "web" },
  { text: "products," },
  { text: "obsess" },
  { text: "over", grey: true },
  { text: "the", grey: true },
  { text: "details," },
  { text: "and", grey: true },
  { text: "occasionally", grey: true },
  { text: "spend", grey: true },
  { text: "far", grey: true },
  { text: "too", grey: true },
  { text: "long", grey: true },
  { text: "moving", grey: true },
  { text: "a", grey: true },
  { text: "button", grey: true },
  { text: "2px.", grey: true },
];
const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const waveRef = useRef<SVGPathElement>(null);
  const traitsRef = useRef<HTMLDivElement>(null);
  const traitsPinRef = useRef<HTMLDivElement>(null);
  const trackTweenRef = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    const wave = waveRef.current;
    if (!pin || !track) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    pin.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      // Extra half-viewport of travel on both ends so the first and last
      // thumbnails' centers can actually pass through the viewport's
      // center too (otherwise they start/stop already past it and their
      // reveal never triggers).
      const getHorizontalDistance = () => {
        const base = Math.max(track.scrollWidth - pin.offsetWidth, 0);
        return base > 0 ? base + pin.offsetWidth / 2 : 0;
      };
      // Scroll distance tracks the actual horizontal travel 1:1 — capping
      // it at a fixed viewport multiple (as this used to) starts truncating
      // the scroll budget once the track is wider than that cap, which
      // makes the pan cover more horizontal ground per pixel scrolled and
      // rushes the photos past instead of scrubbing at a steady pace.
      const getScrollDistance = () => getHorizontalDistance();

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top 30%",
          end: () => `+=${getScrollDistance()}`,
          scrub: true,
          pin: true,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // This pin's spacer height is dynamic (getScrollDistance depends on
          // measured widths), and everything below it in the document — the
          // headline, "Human"'s HighlightCircle, the tagline — needs that
          // final spacer size to already be resolved before ITS OWN position
          // is calculated on refresh. Without a priority, ScrollTrigger
          // processes triggers in creation order, so those get measured
          // against this pin's *previous* spacer size, landing them short by
          // however much this pin's distance is — refreshing again doesn't
          // fix it since each pass reproduces the same stale-then-fresh
          // ordering. A positive refreshPriority makes this one resolve
          // first on every refresh.
          refreshPriority: 1,
        },
      });

      tl.to(track, { x: () => -getHorizontalDistance(), ease: "none", duration: 1 }, 0);

      if (wave) {
        const length = wave.getTotalLength();
        gsap.set(wave, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(wave, { strokeDashoffset: 0, ease: "none", duration: 1 }, 0);
      }

      trackTweenRef.current = tl;
    }, pin);

    return () => {
      ctx.revert();
      trackTweenRef.current = null;
    };
  }, []);

  // PHOTO REVEAL — each reel thumbnail's photo, number, and name wipe/slide
  // in together as it crosses the horizontal center of the viewport while
  // the track scrolls past it.
  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".reel-item");
      items.forEach((item) => {
        const photo = item.querySelector<HTMLElement>(".reel-photo-clip");
        const lines = item.querySelectorAll<HTMLElement>(".reel-text-line");

        if (photo) gsap.set(photo, { clipPath: "inset(0% 0 100% 0)" });
        gsap.set(lines, { yPercent: -110 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: item,
            containerAnimation: trackTweenRef.current ?? undefined,
            start: "center center",
            toggleActions: "play none none reverse",
          },
        });

        tl.to(lines, { yPercent: 0, duration: 0.6, ease: "power3.out", stagger: 0.05 }, 0);
        if (photo) tl.to(photo, { clipPath: "inset(0% 0 0% 0)", duration: 0.8, ease: "power3.out" }, 0);
      });
    }, pin);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const path = underlineRef.current;
    if (!path) return;

    const ctx = gsap.context(() => {
      const length = path.getTotalLength();
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: path,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-headline-line", {
        yPercent: 110,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 55%", toggleActions: "play reverse play reverse" },
      });

      gsap.from(".about-fade-up", {
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: sectionRef.current, start: "top 45%", toggleActions: "play reverse play reverse" },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // TRAITS LIST — timed to the reel's own scroll, not its own position: it
  // slides up and pins in place (fixed on screen) once the reel is two
  //-thirds scrolled through, stays pinned while the rest of the reel and
  // the unpin go by, then fades out as the "Akash Kurdekar" headline
  // arrives so the headline gets full visual focus. Same choreography on
  // both breakpoints; only pinSpacing differs (mobile is still in normal
  // document flow, so unpinning without reserving its space would jump the
  // headline up and back down — desktop is already an absolute overlay, so
  // there's no flow space to preserve).
  useLayoutEffect(() => {
    const el = traitsRef.current;
    const traitsPin = traitsPinRef.current;
    const pin = pinRef.current;
    if (!el || !traitsPin || !pin) return;
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const mm = gsap.matchMedia();

    // Desktop: timed to the reel's own scroll, not its own position — slide
    // up once the reel is two-thirds through, lock in place on screen while
    // the rest of the reel (and its unpin) go by, then fade out as the
    // headline arrives. "Lock in place" is done with a plain CSS class
    // (position: fixed, see .traits-pinned) rather than GSAP's `pin`
    // mechanic: this element's resting spot is `top: 50%` of the *section*,
    // and the section's height is still being resolved across several
    // ScrollTrigger refresh passes while the reel above it settles — a GSAP
    // pin captures that "natural" position at refresh time and re-captures
    // it (inconsistently) on every subsequent refresh, so it visibly jumps
    // around. Toggling straight to `position: fixed` is anchored to the
    // viewport instead, so it's stable no matter how the section's own
    // height is still shifting underneath it.
    mm.add("(min-width: 1024px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          // Derived only from the reel's own already-resolved trigger
          // numbers, never a live DOM measurement of something further
          // down (like the headline) — during ScrollTrigger.refresh(),
          // every pin-spacer is temporarily reverted to measure natural
          // layout before being reapplied, so a start/end callback that
          // measures the headline directly would see the reel's spacer-
          // less, pre-refresh height and compute a collapsed, wrong range.
          start: () => {
            const reelTrigger = trackTweenRef.current?.scrollTrigger;
            return reelTrigger ? reelTrigger.start + (reelTrigger.end - reelTrigger.start) * (2 / 3) : "top 80%";
          },
          end: () => {
            const reelTrigger = trackTweenRef.current?.scrollTrigger;
            const reelEnd = reelTrigger ? reelTrigger.end : window.innerHeight * 2;
            // The headline sits a small, fairly fixed padding/margin gap
            // past where the reel unpins — scaling that gap off the
            // viewport height (rather than a hardcoded px offset) keeps it
            // roughly in proportion across breakpoints.
            return reelEnd + window.innerHeight * 0.4;
          },
          scrub: true,
          toggleClass: { targets: traitsPin, className: "traits-pinned" },
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(el, { y: 160, opacity: 0 }, { y: 0, opacity: 1, duration: 0.2, ease: "power2.out" }, 0);
      tl.to(el, { opacity: 0, duration: 0.15, ease: "power1.in" }, 0.85);

      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    // Mobile: no pin — it's in normal document flow here, and locking it to
    // the viewport would either jump the headline below it (no reserved
    // space once fixed) or need a hand-built placeholder spacer to avoid
    // that. Simpler to just slide it up once and let it scroll normally.
    mm.add("(max-width: 1023px)", () => {
      const tween = gsap.fromTo(
        el,
        { y: 160, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reverse" },
        },
      );

      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    return () => mm.revert();
  }, []);

  // PROFILE STARS — the two sparkles flanking the profile photo spin once
  // when that row first scrolls into view.
  useLayoutEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const ctx = gsap.context(() => {
      gsap.to(".about-profile-star", {
        rotate: 360,
        duration: 0.9,
        ease: "power2.inOut",
        stagger: 0.1,
        scrollTrigger: {
          trigger: ".about-profile-row",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // TAGLINE WORD REVEAL — each word's opacity ramps up to 1 in sequence,
  // scrubbed directly to scroll position as the paragraph passes by.
  useLayoutEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;

    const ctx = gsap.context(() => {
      gsap.set(".about-word", { opacity: 0 });
      gsap.to(".about-word", {
        opacity: 1,
        ease: "none",
        stagger: 0.05,
        scrollTrigger: {
          trigger: ".about-tagline",
          start: "top 85%",
          end: "bottom 60%",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="relative  text-black">
      {/* PINNED REEL SCROLLER */}
      <div ref={pinRef} className="relative overflow-x-auto  py-10 lg:py-14">
        <div ref={trackRef} className="relative flex w-max items-end px-6 lg:px-16">
          {/* leading buffer so photo 01 also has to scroll into the
              viewport's center instead of already sitting past it */}
          <div aria-hidden="true" className="w-[50vw] shrink-0" />

          <div className="relative flex items-end gap-16 lg:gap-28">
            {reelItems.map((item, index) => (
              <div key={index} className="reel-item relative flex w-35 flex-col items-start lg:w-50">
                <span className="block overflow-hidden font-bricolage size12">
                  <span className="reel-text-line inline-block">0{index + 1}</span>
                </span>
                <div className="reel-photo-clip mt-2 aspect-square w-full overflow-hidden rounded-md border border-black/10 bg-black/5">
                  <img src={item.src} alt={item.name} className="h-full w-full object-cover" width={240} height={240} />
                </div>
                <span className="mt-2 mx-auto block overflow-hidden font-scribble size18 text-blue">
                  <span className="reel-text-line inline-block p-2 capitalize">{item.name}</span>
                </span>
              </div>
            ))}

            <svg
              className="pointer-events-none absolute left-0 top-[58%] -z-[1] h-16 w-full"
              viewBox={`0 0 ${reelItems.length * 260} 100`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                ref={waveRef}
                d={buildWavePath(reelItems.length)}
                fill="none"
                stroke="rgba(17,17,17,0.25)"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>

      <div ref={traitsPinRef} className="relative  mt-25 lg:absolute lg:top-1/2 lg:right-5 lg:-translate-y-1/2">
        <div ref={traitsRef}>
          <ul className="about-fade-up pl-5 list-disc  flex flex-col flex-wrap items-start justify-center  font-bricolage-semibold text-grey size12 uppercase lg:mt-6">
            {["over thinker", "self obsessed", "serial procrastinator", "coffee dependent", "professional daydreamer"].map((item) => (
              <li key={item}> {item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* HEADLINE */}
      <div className="relative z-10 mx-5 py-8 text-center md:mx-20 lg:py-18">
        <h2 className="font-bricolage-semibold uppercase leading-[0.95] size90">
          <span className="block overflow-hidden">
            <span className="about-headline-line inline-block">Akash</span>
          </span>
          <span className="mt-1 block overflow-hidden pb-[0.22em] lg:mt-2">
            <span className="about-headline-line inline-block">
              <span className="relative inline-block">
                Kur
                <svg
                  className="pointer-events-none absolute left-0 top-full h-[0.18em] w-full overflow-visible"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path
                    ref={underlineRef}
                    d="M2,10 C25,2 50,18 75,7 C85,3 92,9 98,8"
                    fill="none"
                    stroke="var(--blue)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              </span>
              dekar
            </span>
          </span>
        </h2>

        <div className="about-fade-up about-profile-row mt-6 flex items-center justify-center gap-4 lg:mt-10 lg:gap-6">
          <div className="line h-px w-full bg-black " />
          <SparkleStar className="about-profile-star h-4 w-4 shrink-0 text-black lg:h-5 lg:w-5" />
          <span aria-hidden="true" className="font-bricolage-semibold size90 leading-none">
            {"{"}
          </span>
          <div className="h-40 w-40 shrink-0 overflow-hidden  border-3 border-black ">
            <img src={aboutProfile} alt="Akash Kurdekar" className="h-full w-full object-cover" />
          </div>
          <span aria-hidden="true" className="font-bricolage-semibold size90 leading-none">
            {"}"}
          </span>
          <SparkleStar className="about-profile-star h-4 w-4 shrink-0 text-black lg:h-5 lg:w-5" />
          <div className="line h-px w-full bg-black " />
        </div>

        <p className="about-fade-up mt-4 font-italic size64 leading-none lg:mt-6">Confused</p>

        <p className="about-fade-up mt-2 font-bricolage-semibold uppercase size64 leading-none">
          <HighlightCircle>Human</HighlightCircle>
        </p>
      </div>

      <div className="about-fade-up  mx-5 pb-20 md:mx-20 lg:pb-28">
        <div className="mx-auto relative flex max-w-4xl items-center justify-center gap-1 lg:items-start lg:gap-3">
          <SparkleStar className="absolute -left-2 -top-5 lg:-top-20 h-6 w-6 -rotate-12 text-blue lg:-left-20 lg:h-30 lg:w-30" />
          <p className="about-tagline max-w-2xl text-center font-bricolage size20 leading-8 lg:mt-2">
            {TAGLINE_WORDS.map((word, index) => (
              <Fragment key={index}>
                <span className={`about-word inline-block ${word.grey ? "text-grey" : "text-black"}`}>{word.text}</span>{" "}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
