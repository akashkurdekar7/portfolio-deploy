import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const SmoothScroll = () => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });

    window.__lenis = lenis;

    // Drive Lenis from GSAP's own ticker instead of a separate rAF loop —
    // two independent requestAnimationFrame loops (Lenis's + GSAP's, which
    // ScrollTrigger's scrub/pin math also runs on) can fire slightly out of
    // step each frame, and that's what reads as stutter on pinned/scrubbed
    // ScrollTriggers. This is Lenis/GSAP's own recommended integration.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Without this, ScrollTrigger only recalculates on native "scroll"
    // events, which lag a frame behind Lenis's interpolated position.
    // On a pinned + scrubbed timeline (the mobile project stack) that lag
    // is exactly what reads as the cards shaking/vibrating while scrolling.
    lenis.on('scroll', ScrollTrigger.update);

    // ScrollTrigger only auto-refreshes once, on the initial window "load"
    // event. Several images in the page (e.g. the Work section image) use
    // loading="lazy" with no reserved height, so they only load once
    // scrolled near the viewport — well after that initial refresh — and
    // snap to their real height, shifting every trigger below them out of
    // position for the rest of the session (most visible on the last
    // section, Quote, and on connections/browsers where the image loads
    // later relative to scroll). "load" doesn't bubble, so this listens in
    // the capture phase.
    //
    // The Article marquee's ~240 repeated icon <img>s are excluded: they
    // have a fixed height (Tailwind h-5/h-10) so loading them never shifts
    // page layout, but the browser starts prefetching the near ones while
    // the user is still scrolled well above Article — including mid-pin in
    // the mobile Projects stack (see ProjectsStack.tsx). Refreshing
    // ScrollTrigger while that pin is engaged momentarily re-measures/
    // re-pins it, which read as the page freezing/stuttering right around
    // Projects/Article/Work.
    let refreshTimeout: ReturnType<typeof setTimeout>;
    const onLazyLoad = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target?.tagName !== 'IMG' || target.closest('.marquee')) return;
      clearTimeout(refreshTimeout);
      refreshTimeout = setTimeout(() => ScrollTrigger.refresh(), 100);
    };
    document.addEventListener('load', onLazyLoad, true);

    return () => {
      document.removeEventListener('load', onLazyLoad, true);
      clearTimeout(refreshTimeout);
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
};

export default SmoothScroll;
