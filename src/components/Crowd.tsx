import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface Stage {
  width: number;
  height: number;
}

type SpriteRect = [number, number, number, number];

class Peep {
  image: HTMLImageElement;
  rect: SpriteRect;
  width: number;
  height: number;
  drawArgs: [HTMLImageElement, number, number, number, number, number, number, number, number];

  x = 0;
  y = 0;
  anchorY = 0;
  scaleX = 1;
  scale = 1;
  walk: gsap.core.Timeline | null = null;

  constructor({ image, rect }: { image: HTMLImageElement; rect: SpriteRect }) {
    this.image = image;
    this.rect = rect;
    this.width = rect[2];
    this.height = rect[3];

    this.drawArgs = [image, ...rect, 0, 0, rect[2], rect[3]];
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.scale(this.scaleX * this.scale, this.scale);

    ctx.drawImage(...this.drawArgs);

    ctx.restore();
  }
}

const randomRange = (min: number, max: number) => min + Math.random() * (max - min);

const randomIndex = (array: unknown[]) => Math.floor(Math.random() * array.length);

const removeFromArray = <T,>(array: T[], index: number): T => array.splice(index, 1)[0];

const removeRandomFromArray = <T,>(array: T[]): T => removeFromArray(array, randomIndex(array));

const getRandomFromArray = <T,>(array: T[]): T => array[randomIndex(array)];

const resetPeep = ({ stage, peep }: { stage: Stage; peep: Peep }) => {
  peep.scale = stage.width < 991 ? 0.8 : 1;

  const direction = Math.random() > 0.5 ? 1 : -1;

  const offsetY = 100 - 250 * gsap.parseEase('power2.in')(Math.random());

  const startY = stage.height - peep.height + offsetY;

  let startX: number;
  let endX: number;

  if (direction === 1) {
    startX = -peep.width;
    endX = stage.width;
    peep.scaleX = 1;
  } else {
    startX = stage.width + peep.width;
    endX = 0;
    peep.scaleX = -1;
  }

  peep.x = startX;
  peep.y = startY;
  peep.anchorY = startY;

  return {
    startX,
    startY,
    endX,
  };
};

const normalWalk = ({
  peep,
  props,
}: {
  peep: Peep;
  props: {
    startX: number;
    startY: number;
    endX: number;
  };
}) => {
  const { startY, endX } = props;

  const xDuration = randomRange(8, 14);
  const yDuration = 0.25;

  const timeline = gsap.timeline();

  timeline.timeScale(randomRange(0.7, 1.3));

  timeline.to(
    peep,
    {
      duration: xDuration,
      x: endX,
      ease: 'none',
    },
    0,
  );

  timeline.to(
    peep,
    {
      duration: yDuration,
      repeat: Math.floor(xDuration / yDuration),
      yoyo: true,
      y: startY - 10,
      ease: 'sine.inOut',
    },
    0,
  );

  return timeline;
};

const walks = [normalWalk];

interface CrowdProps {
  src: string;
  rows?: number;
  cols?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Crowd({ src, rows = 15, cols = 7, className, style }: CrowdProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    setLoaded(false);

    const stage: Stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    let disposed = false;
    let tickerFn: (() => void) | null = null;

    const createPeeps = (image: HTMLImageElement) => {
      const width = image.naturalWidth;
      const height = image.naturalHeight;

      const cellWidth = width / rows;
      const cellHeight = height / cols;

      const total = rows * cols;

      for (let i = 0; i < total; i++) {
        const column = i % rows;
        const row = Math.floor(i / rows);

        allPeeps.push(
          new Peep({
            image,
            rect: [column * cellWidth, row * cellHeight, cellWidth, cellHeight],
          }),
        );
      }
    };

    const removePeepFromCrowd = (peep: Peep) => {
      const index = crowd.indexOf(peep);

      if (index !== -1) {
        crowd.splice(index, 1);
      }

      availablePeeps.push(peep);
    };

    const addPeepToCrowd = () => {
      if (!availablePeeps.length) {
        return null;
      }

      const peep = removeRandomFromArray(availablePeeps);

      const props = resetPeep({
        stage,
        peep,
      });

      const walk = getRandomFromArray(walks)({
        peep,
        props,
      });

      walk.eventCallback('onComplete', () => {
        if (disposed) return;

        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);

      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        const peep = addPeepToCrowd();

        peep?.walk?.progress(Math.random());
      }
    };

    const resize = () => {
      stage.width = canvas.clientWidth;

      stage.height = canvas.clientHeight;

      if (stage.width === 0 || stage.height === 0) {
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = stage.width * dpr;

      canvas.height = stage.height * dpr;

      crowd.forEach((peep) => {
        peep.walk?.kill();
      });

      crowd.length = 0;

      availablePeeps.length = 0;

      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const render = () => {
      if (disposed) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.save();

      ctx.scale(dpr, dpr);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const image = new Image();

    image.onload = () => {
      if (disposed) return;

      createPeeps(image);

      resize();

      tickerFn = render;

      gsap.ticker.add(tickerFn);

      window.addEventListener('resize', resize);

      setLoaded(true);
    };

    image.src = src;

    return () => {
      disposed = true;

      window.removeEventListener('resize', resize);

      if (tickerFn) {
        gsap.ticker.remove(tickerFn);
      }

      allPeeps.forEach((peep) => {
        peep.walk?.kill();
      });
    };
  }, [src, rows, cols]);

  return (
    <div className={`relative ${className ?? ''}`} style={style}>
      {!loaded && <div className="absolute inset-0 skeleton-shimmer--dark" aria-hidden="true" />}

      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
