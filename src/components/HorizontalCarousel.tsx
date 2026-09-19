import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalCarouselProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  autoScroll?: boolean;
  autoScrollSpeed?: number; // ms interval
  scrollAmount?: number;
  className?: string;
  showControls?: boolean;
  ariaLabel?: string;
}

export const HorizontalCarousel: React.FC<HorizontalCarouselProps> = ({
  children,
  title,
  subtitle,
  autoScroll = false,
  autoScrollSpeed = 3500,
  scrollAmount,
  className = '',
  showControls = true,
  ariaLabel = 'Content carousel',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  const checkScrollBoundaries = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    // Account for potential rounding differences
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    checkScrollBoundaries();
    window.addEventListener('resize', checkScrollBoundaries);
    el.addEventListener('scroll', checkScrollBoundaries, { passive: true });

    return () => {
      window.removeEventListener('resize', checkScrollBoundaries);
      el.removeEventListener('scroll', checkScrollBoundaries);
    };
  }, [checkScrollBoundaries, children]);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoScroll) return;
    // Check user preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (isHovered || isInteracting || isDragging) return;

    const interval = setInterval(() => {
      if (!containerRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      const step = scrollAmount || clientWidth * 0.75;

      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        // Loop back gently
        containerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        containerRef.current.scrollBy({ left: step, behavior: 'smooth' });
      }
    }, autoScrollSpeed);

    return () => clearInterval(interval);
  }, [autoScroll, autoScrollSpeed, isHovered, isInteracting, isDragging, scrollAmount]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const step = scrollAmount || container.clientWidth * 0.75;
    const target = direction === 'left' ? -step : step;

    container.scrollBy({
      left: target,
      behavior: 'smooth',
    });

    setIsInteracting(true);
    setTimeout(() => setIsInteracting(false), 2000);
  };

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleScroll('right');
    }
  };

  // Mouse Drag to Scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setIsInteracting(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeftState(containerRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    containerRef.current.scrollLeft = scrollLeftState - walk;
  };

  const handleMouseUpOrLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      setTimeout(() => setIsInteracting(false), 2000);
    }
  };

  return (
    <div
      className={`relative w-full ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        handleMouseUpOrLeave();
      }}
      role="region"
      aria-label={ariaLabel}
    >
      {(title || showControls) && (
        <div className="flex items-end justify-between mb-6 px-1">
          <div>
            {title && (
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="mt-1.5 text-sm sm:text-base text-slate-500 max-w-2xl">
                {subtitle}
              </p>
            )}
          </div>

          {showControls && (
            <div className="flex items-center space-x-2 shrink-0 ml-4">
              <button
                type="button"
                onClick={() => handleScroll('left')}
                disabled={!canScrollLeft}
                aria-label="Scroll left"
                className={`p-2.5 rounded-full border border-slate-200 bg-white shadow-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  !canScrollLeft
                    ? 'opacity-35 cursor-not-allowed text-slate-300'
                    : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll('right')}
                disabled={!canScrollRight}
                aria-label="Scroll right"
                className={`p-2.5 rounded-full border border-slate-200 bg-white shadow-xs transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  !canScrollRight
                    ? 'opacity-35 cursor-not-allowed text-slate-300'
                    : 'text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 active:scale-95 cursor-pointer'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* The scrollable container */}
      <div
        ref={containerRef}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        className={`flex overflow-x-auto no-scrollbar scroll-smooth gap-5 pb-4 pt-1 px-1 cursor-grab select-none focus:outline-hidden focus:ring-1 focus:ring-indigo-300/40 rounded-xl ${
          isDragging ? 'cursor-grabbing select-none' : ''
        }`}
        style={{
          scrollSnapType: isDragging ? 'none' : 'x mandatory',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {children}
      </div>
    </div>
  );
};
