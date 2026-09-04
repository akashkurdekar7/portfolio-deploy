import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PARA1 =
  "Your data is taken by companies and used to train the next wave of AI models and build the world's top products and services. Yet it often happens without any earnings being distributed back to you.".split(
    ' ',
  );

const PARA2 =
  "It's time for a change. With real ownership, every contribution you make gets tracked, valued, and paid back to you automatically, turning your data into an asset instead of an invisible input for someone else's product.".split(
    ' ',
  );

const ALL_WORDS = [...PARA1, ...PARA2];
const HIGHLIGHT_INDEX = ALL_WORDS.findIndex((w) => w.replace(/[^a-zA-Z]/g, '').toLowerCase() === 'distributed');
const SCROLL_DISTANCE_PER_WORD = 40;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

// each word's turn is split into a hold phase (pure box, no text) and a
// crossfade phase (box fades out while text fades in)
const BOX_HOLD = 0.3;

const Word = ({ word, index, progress }: { word: string; index: number; progress: number }) => {
  const activeIndex = Math.floor(progress);
  const isPast = index < activeIndex;
  const isActive = index === activeIndex;
  const isHighlight = index === HIGHLIGHT_INDEX;
  const fraction = progress - activeIndex;

  let textOpacity = 0;
  let boxOpacity = 0;

  if (isPast) {
    textOpacity = 1;
  } else if (isActive) {
    textOpacity = clamp01((fraction - BOX_HOLD) / (1 - BOX_HOLD));
    boxOpacity = 1 - clamp01(fraction / BOX_HOLD);
  } else {
    // not yet reached: sits as a box, same as an active word's hold phase,
    // fading gently the further out it is
    const distance = index - activeIndex;
    boxOpacity = Math.max(0.06, 0.5 - (distance - 1) * 0.025);
  }

  return (
    <span className="relative inline-block">
      <span
        className={`transition-opacity duration-150 ease-out ${isHighlight && (isPast || isActive) ? 'text-orange' : 'text-white'}`}
        style={{ opacity: textOpacity }}
      >
        {word}
      </span>
      {boxOpacity > 0 && (
        <span
          className="absolute -inset-1 rounded-md bg-white/20"
          style={{ opacity: boxOpacity }}
        />
      )}
    </span>
  );
};

const TextRevealDemo = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${ALL_WORDS.length * SCROLL_DISTANCE_PER_WORD}`,
        pin: true,
        onUpdate: (self) => {
          setProgress(self.progress * ALL_WORDS.length);
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <p className="font-space size16 text-white/40">scroll to reveal ↓</p>
      </div>

      <section ref={sectionRef} className="flex min-h-screen w-full items-center justify-center bg-black px-6">
        <div className="w-full max-w-3xl">
          <p className="flex flex-wrap gap-x-2 gap-y-1 font-sans text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">
            {PARA1.map((word, i) => (
              <Word key={i} word={word} index={i} progress={progress} />
            ))}
          </p>

          <p className="mt-10 flex flex-wrap gap-x-2 gap-y-1 font-sans text-3xl font-extrabold leading-[1.15] tracking-tight md:text-4xl">
            {PARA2.map((word, i) => (
              <Word key={i} word={word} index={PARA1.length + i} progress={progress} />
            ))}
          </p>
        </div>
      </section>

      <div className="h-screen w-full bg-black" />
    </>
  );
};

export default TextRevealDemo;
