"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Attribution, SliderControls } from "../../molecules";
import { Badge, Eyebrow, Heading } from "../../atoms";
import { HeadingBlok } from "../../atoms/heading";
import { twMerge } from "tailwind-merge";
import { buildRelMap, resolveRel } from "../../../utils";

const AUTOPLAY_INTERVAL_MS = 5000;
const RESUME_DELAY_MS = 5000;
const DRAG_FRICTION = 0.65;
const VELOCITY_THRESHOLD = 0.15;
const SWIPE_TRIGGER_PERCENT = 0.18;

export interface TestimonialBlok extends SbBlokData {
  quote?: string;
  title?: string;
  jobTitle?: string;
  companyName?: string;
  component: "testimonial";
}

export interface TestimonialSlideBlok extends SbBlokData {
  testimonial?: string;
  component: "testimonialSlide";
}

export interface TestimonialSliderBlok extends SbBlokData {
  eyebrow?: any[];
  heading?: HeadingBlok[];
  testimonials: (TestimonialBlok | TestimonialSlideBlok)[];
  mode: "light" | "dark";
  autoplay?: boolean;
  autoplaySpeed?: number;
}

interface TestimonialSliderProps {
  blok: TestimonialSliderBlok;
  rels?: any[];
}

export function TestimonialSlider({ blok, rels = [] }: TestimonialSliderProps) {
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement | null>(null);
  const autoplayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const resumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  const dragStartX = useRef(0);
  const dragStartTime = useRef(0);
  const lastDragX = useRef(0);
  const lastDragTime = useRef(0);
  const dragVelocity = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);
  const isAnimatingMomentum = useRef(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false);
  const autoplaySpeed =
    blok?.autoplaySpeed != null
      ? blok.autoplaySpeed * 1000
      : AUTOPLAY_INTERVAL_MS;

  const mode = blok.mode || "dark";

  const relMap = useMemo(() => buildRelMap(rels), [rels]);

  const resolvedTestimonials = useMemo(() => {
    return blok.testimonials
      .map((item) => {
        if (item.component === "testimonial") return item;
        if (item.component === "testimonialSlide" && item.testimonial) {
          const resolved = resolveRel<any>(item.testimonial, relMap);
          if (resolved?.component === "testimonial") {
            return resolved as TestimonialBlok;
          }
        }
        return null;
      })
      .filter((item): item is TestimonialBlok => item !== null);
  }, [blok.testimonials, relMap]);

  const total = resolvedTestimonials.length;
  const getIndex = useCallback((i: number) => (i + total) % total, [total]);

  const prevIndex = getIndex(currentIndex - 1);
  const nextIndex = getIndex(currentIndex + 1);

  const stopAutoplay = useCallback(() => {
    if (autoplayIntervalRef.current) {
      clearInterval(autoplayIntervalRef.current);
      autoplayIntervalRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (!blok.autoplay || total <= 1 || isAutoplayPaused) return;
    stopAutoplay();
    autoplayIntervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => getIndex(prev + 1));
    }, autoplaySpeed);
  }, [blok.autoplay, total, isAutoplayPaused, stopAutoplay, getIndex]);

  const pauseAutoplay = useCallback(() => {
    if (!blok.autoplay) return;
    setIsAutoplayPaused(true);
    stopAutoplay();
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
  }, [blok.autoplay, stopAutoplay]);

  const scheduleAutoplayResume = useCallback(() => {
    if (!blok.autoplay || total <= 1) return;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoplayPaused(false);
      resumeTimeoutRef.current = null;
    }, RESUME_DELAY_MS);
  }, [blok.autoplay, total]);

  useEffect(() => {
    if (blok.autoplay && total > 1 && !isAutoplayPaused) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => {
      stopAutoplay();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [blok.autoplay, total, isAutoplayPaused, startAutoplay, stopAutoplay]);

  useEffect(() => {
    const el = activeCardRef.current;
    if (!el) return;

    let timeoutId: NodeJS.Timeout;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setActiveHeight(Math.ceil(entry.contentRect.height));
        }, 16);
      }
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, [currentIndex]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const commitSlideChange = useCallback(
    (direction: "next" | "prev") => {
      setCurrentIndex((prev) =>
        direction === "next" ? getIndex(prev + 1) : getIndex(prev - 1)
      );
      setDragOffset(0);
    },
    [getIndex]
  );

  const animateMomentum = useCallback(() => {
    if (!isAnimatingMomentum.current) return;

    const velocity = dragVelocity.current;
    const absVelocity = Math.abs(velocity);
    if (absVelocity < VELOCITY_THRESHOLD) {
      setDragOffset(0);
      isAnimatingMomentum.current = false;
      return;
    }

    const newOffset = dragOffset + velocity * 16;
    const cardWidth = activeCardRef.current?.offsetWidth || 600;
    const maxOffset = cardWidth * 0.25;

    if (Math.abs(newOffset) > maxOffset) {
      if (newOffset > maxOffset) commitSlideChange("prev");
      else if (newOffset < -maxOffset) commitSlideChange("next");
      else {
        setDragOffset(0);
        isAnimatingMomentum.current = false;
      }
    } else {
      setDragOffset(newOffset);
      dragVelocity.current *= 0.92;
      rafIdRef.current = requestAnimationFrame(animateMomentum);
    }
  }, [dragOffset, commitSlideChange]);

  const stopMomentum = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    isAnimatingMomentum.current = false;
  }, []);

  const handleStart = useCallback(
    (x: number) => {
      stopMomentum();
      isDragging.current = true;
      dragStartX.current = x;
      dragStartTime.current = performance.now();
      lastDragX.current = x;
      lastDragTime.current = dragStartTime.current;
      dragVelocity.current = 0;
      pauseAutoplay();
      scheduleAutoplayResume();
    },
    [pauseAutoplay, scheduleAutoplayResume, stopMomentum]
  );

  const handleMove = useCallback(
    (x: number) => {
      if (!isDragging.current) return;

      const now = performance.now();
      const deltaX = x - lastDragX.current;
      const deltaTime = Math.max(1, now - lastDragTime.current);
      const instantaneousVelocity = deltaX / deltaTime;

      dragVelocity.current =
        dragVelocity.current * 0.6 + instantaneousVelocity * 0.4;

      lastDragX.current = x;
      lastDragTime.current = now;

      let diff = x - dragStartX.current;
      const cardWidth = activeCardRef.current?.offsetWidth || 600;
      const maxDrag = cardWidth * 0.3;

      diff = diff * DRAG_FRICTION;
      diff = Math.max(-maxDrag, Math.min(maxDrag, diff));
      setDragOffset(diff);

      const elapsed = now - dragStartTime.current;
      const totalDiff = x - dragStartX.current;
      const avgVelocity = Math.abs(totalDiff / elapsed);
      const triggerPx = cardWidth * SWIPE_TRIGGER_PERCENT;

      if (
        elapsed < 200 &&
        avgVelocity > 0.8 &&
        Math.abs(totalDiff) > triggerPx
      ) {
        if (totalDiff > 0) commitSlideChange("prev");
        else commitSlideChange("next");
        handleEnd();
      }
    },
    [commitSlideChange]
  );

  const handleEnd = useCallback(() => {
    if (!isDragging.current) return;

    isDragging.current = false;
    const cardWidth = activeCardRef.current?.offsetWidth || 600;
    const absOffset = Math.abs(dragOffset);
    const triggerPx = cardWidth * SWIPE_TRIGGER_PERCENT;

    if (absOffset > triggerPx) {
      if (dragOffset > 0) commitSlideChange("prev");
      else commitSlideChange("next");
    } else if (Math.abs(dragVelocity.current) > VELOCITY_THRESHOLD) {
      if (dragVelocity.current > 0) commitSlideChange("prev");
      else if (dragVelocity.current < 0) commitSlideChange("next");
      else setDragOffset(0);
    } else {
      setDragOffset(0);
    }

    dragVelocity.current = 0;
  }, [dragOffset, commitSlideChange]);

  const handleNext = useCallback(() => {
    pauseAutoplay();
    scheduleAutoplayResume();
    setCurrentIndex(nextIndex);
  }, [pauseAutoplay, scheduleAutoplayResume, nextIndex]);

  const handlePrevious = useCallback(() => {
    pauseAutoplay();
    scheduleAutoplayResume();
    setCurrentIndex(prevIndex);
  }, [pauseAutoplay, scheduleAutoplayResume, prevIndex]);

  const handleGoTo = useCallback(
    (index: number) => {
      pauseAutoplay();
      scheduleAutoplayResume();
      setCurrentIndex(index);
    },
    [pauseAutoplay, scheduleAutoplayResume]
  );

  const desktopSlides = useMemo(() => {
    return resolvedTestimonials.map((testimonial, index) => {
      const isActive = index === currentIndex;
      const isPrev = index === prevIndex;
      const isNext = index === nextIndex;

      let stateClasses = "";
      if (isActive) {
        stateClasses = "z-30 scale-100 opacity-100 translate-x-0";
      } else if (isPrev) {
        stateClasses =
          "z-20 scale-90 opacity-0 md:opacity-100 lg:-translate-x-28 md:-translate-x-20 -translate-x-24";
      } else if (isNext) {
        stateClasses =
          "z-20 scale-90 opacity-0 md:opacity-100 lg:translate-x-28 md:translate-x-20 translate-x-24";
      } else {
        stateClasses = "z-10 scale-75 opacity-0 pointer-events-none";
      }

      const dynamicHeight =
        !isActive && activeHeight
          ? { height: `calc(${activeHeight}px - 56px)` }
          : undefined;

      const transformStyle = isActive
        ? {
            transform: `translate3d(${dragOffset}px, 0, 0)`,
            transition:
              isDragging.current || isAnimatingMomentum.current
                ? "none"
                : "transform 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
          }
        : undefined;

      return (
        <div
          key={`${testimonial._uid}-${index}`}
          {...storyblokEditable(testimonial)}
          className={twMerge(
            "absolute will-change-transform backface-hidden transition-all duration-700 ease-out cursor-pointer",
            stateClasses
          )}
          style={transformStyle}
          onDragStart={(e) => e.preventDefault()}
          onClick={() => {
            if (isNext) handleNext();
            if (isPrev) handlePrevious();
          }}
        >
          <div
            ref={isActive ? activeCardRef : null}
            style={dynamicHeight}
            className={twMerge(
              "relative bg-white rounded-md shadow-xl border-b-10 mx-auto overflow-hidden",
              "w-full max-w-175.5 lg:max-w-264.25",
              isActive
                ? "border-(--stroke-testimonial-1)"
                : isPrev
                  ? "border-(--stroke-testimonial-3)"
                  : isNext
                    ? "border-(--stroke-testimonial-2)"
                    : "border-transparent"
            )}
          >
            <div
              className={twMerge(
                "py-(--scale-24) px-(--scale-16) sm:px-14 sm:py-18 md:py-18 md:px-14 transition-opacity duration-700 ease-out select-none",
                isActive ? "opacity-100" : "opacity-0"
              )}
            >
              <Heading size="4xl">
                <blockquote>“{testimonial.quote}”</blockquote>
              </Heading>
              {(testimonial.companyName || testimonial.jobTitle) && (
                <div className="mt-10 border-t border-(--color-neutral-700---body) pt-6">
                  <div className="flex flex-col items-start gap-1">
                    {testimonial.companyName && (
                      <div className="font-normal text-[16px] leading-6 lg:text-[18px] lg:leading-7 text-(--text-headings)">
                        {testimonial.companyName}
                      </div>
                    )}
                    {testimonial.jobTitle && (
                      <div className="[&_span]:text-[12px] [&_span]:leading-4.5 lg:[&_span]:text-[14px] lg:[&_span]:leading-6">
                        <Badge label={testimonial.jobTitle} variant={"navy"} />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    });
  }, [
    resolvedTestimonials,
    currentIndex,
    prevIndex,
    nextIndex,
    activeHeight,
    dragOffset,
    handleNext,
    handlePrevious,
  ]);

  if (resolvedTestimonials.length === 0) return null;

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        "relative max-w-360 mx-auto rounded-lg overflow-hidden px-(--scale-16) py-(--scale-48) sm:px-(--scale-48) sm:py-(--scale-72) lg:p-24",
        mode === "dark"
          ? "bg-(--surface-accent-background)"
          : "bg-(--color-cream-200)"
      )}
    >
      <div
        className={twMerge(
          "pattern-grid pattern-white",
          mode === "dark" ? "opacity-5" : "opacity-15"
        )}
      />

      <div className="relative mx-auto max-w-7xl md:w-[90%]! lg:w-full flex flex-col items-center">
        <div className="text-center">
          {blok.eyebrow?.[0] && (
            <Eyebrow
              {...blok.eyebrow[0]}
              className={twMerge(
                "text-center",
                mode === "dark" && "text-white"
              )}
            />
          )}
          {blok.heading?.[0] && (
            <Heading
              blok={blok.heading[0]}
              className={twMerge(
                "mt-4 mb-12 lg:mb-18 max-w-200 mx-auto",
                mode === "dark" && "text-white"
              )}
            />
          )}
        </div>

        <div
          ref={sliderContainerRef}
          className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none touch-pan-y"
          style={{
            height: activeHeight || "auto",
            transition: "height 0.5s cubic-bezier(0.2, 0.9, 0.4, 1.1)",
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => {
            e.preventDefault();
            handleStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            e.preventDefault();
            handleMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleEnd}
        >
          {desktopSlides}
        </div>
      </div>

      <div className="w-[95%] mx-auto mt-12">
        <SliderControls
          className="flex justify-center"
          currentIndex={currentIndex}
          totalSlides={total}
          mode={mode}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onGoTo={handleGoTo}
          showArrows={isMobile}
          alignment="center"
        />
      </div>
    </div>
  );
}
