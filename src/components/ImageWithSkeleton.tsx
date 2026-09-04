import { forwardRef, type ImgHTMLAttributes } from 'react';
import { useImageLoaded } from '../hooks/useImageLoaded';

type ImageWithSkeletonProps = ImgHTMLAttributes<HTMLImageElement> & {
  wrapperClassName?: string;
  skeletonClassName?: string;
};

const ImageWithSkeleton = forwardRef<HTMLImageElement, ImageWithSkeletonProps>(
  ({ wrapperClassName = '', skeletonClassName = 'skeleton-shimmer', className = '', src, alt = '', ...imgProps }, ref) => {
    const loaded = useImageLoaded(src);

    return (
      <div className={`relative overflow-hidden ${wrapperClassName}`}>
        {!loaded && <div className={`absolute inset-0 ${skeletonClassName}`} aria-hidden="true" />}

        <img
          ref={ref}
          src={src}
          alt={alt}
          {...imgProps}
          className={`${className} transition-opacity duration-500 ease-out ${loaded ? 'opacity-100' : 'opacity-0'}`}
        />
      </div>
    );
  },
);

ImageWithSkeleton.displayName = 'ImageWithSkeleton';

export default ImageWithSkeleton;
