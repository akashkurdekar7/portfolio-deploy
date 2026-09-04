import { useEffect, useState } from 'react';

export function useImageLoaded(src?: string) {
  const [loaded, setLoaded] = useState(false);
  const [trackedSrc, setTrackedSrc] = useState(src);

  if (src !== trackedSrc) {
    setTrackedSrc(src);
    setLoaded(false);
  }

  useEffect(() => {
    if (!src) return;

    const image = new Image();
    image.src = src;

    const handleDone = () => setLoaded(true);

    if (image.complete) {
      // Defer so the state update happens in a microtask callback rather
      // than synchronously inside the effect body.
      queueMicrotask(handleDone);
    } else {
      image.addEventListener('load', handleDone);
      image.addEventListener('error', handleDone);
    }

    return () => {
      image.removeEventListener('load', handleDone);
      image.removeEventListener('error', handleDone);
    };
  }, [src]);

  return loaded;
}
