import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ReelCard, { type Reel } from './ReelCard';
import welcome from '../assets/reels/glp.gif';

gsap.registerPlugin(ScrollTrigger);

const reels: Reel[] = [
  {
    id: 1,
    title: 'Creative Reel',
    category: 'Video / Motion',
    year: '2026',
    image: 'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg',
    instagram: 'https://www.instagram.com/reel/DYhoTT-vtzj/',
  },
  {
    id: 2,
    title: 'Design Process',
    category: 'Design',
    year: '2026',
    image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    instagram: 'https://www.instagram.com/reel/DcBweV1yihE/',
  },
  {
    id: 3,
    title: 'hey.',
    category: 'MADE FOR THE FEED',
    year: '2026',
    image: welcome,
    instagram: 'https://www.instagram.com/reel/DbYR1vJN9V8/',
  },
  {
    id: 4,
    title: 'Development',
    category: 'Frontend',
    year: '2026',
    image: 'https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg',
    instagram: 'https://www.instagram.com/reel/DZR7sG8S1Za/',
  },
  {
    id: 5,
    title: 'Motion Experiment',
    category: 'Motion',
    year: '2026',
    image: 'https://images.pexels.com/photos/713149/pexels-photo-713149.jpeg',
    instagram: 'https://www.instagram.com/reel/C7S-XkoSJBh/',
  },
  {
    id: 6,
    title: 'Behind the Scenes',
    category: 'Process',
    year: '2026',
    image: 'https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg',
    instagram: 'https://www.instagram.com/reel/DCpKq1syHAJ/',
  },
  {
    id: 7,
    title: 'Creative Direction',
    category: 'Creative',
    year: '2026',
    image: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg',
    instagram: 'https://www.instagram.com/reel/DYe4wF2o5Wc/',
  },
  {
    id: 8,
    title: 'Visual Experiment',
    category: 'Motion',
    year: '2026',
    image: 'https://images.pexels.com/photos/713312/pexels-photo-713312.jpeg',
    instagram: 'https://www.instagram.com/reel/DVkaxM8Eqkj/',
  },
  {
    id: 9,
    title: 'Digital Experience',
    category: 'Creative Development',
    year: '2026',
    image: 'https://images.pexels.com/photos/3861963/pexels-photo-3861963.jpeg',
    instagram: 'https://www.instagram.com/reel/DBOtvtUo_MG/',
  },
  {
    id: 10,
    title: 'Creative Work',
    category: 'Video / Motion',
    year: '2026',
    image: 'https://images.pexels.com/photos/242236/pexels-photo-242236.jpeg',
    instagram: 'https://www.instagram.com/reel/C8ffta0yF__/',
  },
];

const Reels = () => {
  const sectionRef = useRef<HTMLElement>(null);

  const isFinePointer = typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useLayoutEffect(() => {
    if (!sectionRef.current || reducedMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.reel-reveal');

      gsap.fromTo(
        cards,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        },
      );
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, [reducedMotion]);

  return (
    <section
      id="reels"
      ref={sectionRef}
      className="
        relative
        mx-5
        min-h-screen
        overflow-hidden
        py-16
        md:mx-20
        lg:py-24
      "
    >
      <div className="relative z-10">
        {/* HEADER */}
        <header className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="font-space-bold size12 uppercase tracking-[0.15em] text-grey">
              Short form • Motion • Experiments
            </p>

            <h2 className="mt-5 font-instrument size90 leading-[0.85]">
              Things that
              <br />
              <span className="font-italic text-orange">move.</span>
            </h2>
          </div>

          <div className="lg:col-span-4 lg:pb-2">
            <p className="max-w-xl font-space size16 leading-6 text-grey">
              A collection of short-form videos, motion experiments, and visual ideas I've created outside of my
              development work.
            </p>
          </div>
        </header>

        {/* META */}
        <div className="mt-10 flex items-center justify-between border-y border-black/10 py-3">
          <span className="font-space size12 uppercase text-grey">Selected reels</span>

          <span className="font-space size12 uppercase text-grey">
            {String(reels.length).padStart(2, '0')} pieces · 2026
          </span>
        </div>

        {/* GRID */}
        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-8
            md:grid-cols-2
            lg:grid-cols-12
            lg:gap-8
          "
        >
          {reels.map((reel, index) => (
            <div
              key={reel.id}
              className={`
                reel-reveal
                aspect-video
                lg:aspect-auto
                ${index % 3 === 0 ? 'lg:col-span-7' : 'lg:col-span-5'}
              `}
            >
              <ReelCard
                reel={reel}
                isFinePointer={isFinePointer}
                reducedMotion={reducedMotion}
                className="h-full w-full"
              />
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="mt-16 flex items-center justify-between border-t border-black/10 pt-4">
          <span className="font-space size12 uppercase text-grey">More on Instagram</span>

          <a
            href="https://www.instagram.com/unlikeakash_"
            target="_blank"
            rel="noreferrer"
            className="font-space size12 uppercase transition-opacity hover:opacity-50"
          >
            @unlikeakash_
          </a>
        </div>
      </div>
    </section>
  );
};

export default Reels;
