import React, { useState } from 'react';
import { Sparkles, Tag } from 'lucide-react';

interface FashionImageProps {
  src: string;
  alt: string;
  className?: string;
  brand?: string;
  category?: string;
  aspectRatio?: 'square' | '4/3' | '3/4';
}

export const FashionImage: React.FC<FashionImageProps> = ({
  src,
  alt,
  className = '',
  brand,
  category,
  aspectRatio = '4/3'
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === '3/4'
      ? 'aspect-3/4'
      : 'aspect-4/3';

  if (hasError || !src) {
    return (
      <div
        className={`w-full ${aspectClass} bg-gradient-to-br from-stone-100 via-stone-200 to-stone-300 relative flex flex-col items-center justify-center p-6 text-stone-600 border border-stone-200/80 overflow-hidden ${className}`}
      >
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#444_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center mb-3 shadow-xs border border-stone-300/60">
          <Tag className="w-5 h-5 text-stone-700" />
        </div>
        {brand && (
          <p className="text-xs font-bold uppercase tracking-wider text-stone-900 text-center mb-1">
            {brand}
          </p>
        )}
        <p className="text-xs text-stone-500 text-center line-clamp-1 max-w-[85%]">
          {alt || category || 'Curated Pre-Loved Piece'}
        </p>
      </div>
    );
  }

  return (
    <div className={`relative w-full overflow-hidden bg-stone-100 ${aspectClass} ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-100 animate-pulse flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-stone-300" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
};
