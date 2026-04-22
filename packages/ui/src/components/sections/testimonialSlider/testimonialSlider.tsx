"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Attribution, SliderControls } from "../../molecules";
import { Badge, Eyebrow, Heading } from "../../atoms";
import { HeadingBlok } from "../../atoms/heading";
import { twMerge } from "tailwind-merge";
import { buildRelMap, resolveRel } from "../../../utils";

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
}

interface TestimonialSliderProps {
  blok: TestimonialSliderBlok;
  rels?: any[];
}

export function TestimonialSlider({ blok, rels = [] }: TestimonialSliderProps) {
  const activeCardRef = useRef<HTMLDivElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const dragStartX = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const isDragging = useRef(false);

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

  useEffect(() => {
    const el = activeCardRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setActiveHeight(Math.ceil(entry.contentRect.height));
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [currentIndex]);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(media.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const handleStart = (x: number) => {
    isDragging.current = true;
    dragStartX.current = x;
  };

  // 🔥 UPDATED: infinite continuous drag
  const handleMove = (x: number) => {
    if (!isDragging.current) return;

    const cardWidth = activeCardRef.current?.offsetWidth || 600;
    const maxDrag = cardWidth * 0.2;

    let diff = x - dragStartX.current;

    diff = diff * 0.6;
    diff = Math.max(-maxDrag, Math.min(maxDrag, diff));

    const trigger = cardWidth * 0.15;

    // 👉 swipe left → next
    if (diff <= -trigger) {
      setCurrentIndex((prev) => getIndex(prev + 1));
      dragStartX.current = x;
      setDragOffset(0);
      return;
    }

    // 👉 swipe right → prev
    if (diff >= trigger) {
      setCurrentIndex((prev) => getIndex(prev - 1));
      dragStartX.current = x;
      setDragOffset(0);
      return;
    }

    setDragOffset(diff);
  };

  const handleEnd = () => {
    if (!isDragging.current) return;

    setDragOffset(0);
    isDragging.current = false;
  };

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
          "z-20 scale-90 opacity-0 md:opacity-100 lg:-translate-x-28  md:-translate-x-20 -translate-x-24";
      } else if (isNext) {
        stateClasses =
          "z-20 scale-90 opacity-0 md:opacity-100 lg:translate-x-28 md:translate-x-20 translate-x-24";
      } else {
        stateClasses = "z-10 scale-75 opacity-0";
      }

      const dynamicHeight =
        !isActive && activeHeight
          ? { height: `calc(${activeHeight}px - 56px)` }
          : undefined;

      return (
        <div
          key={`${testimonial._uid} ${index}`}
          {...storyblokEditable(testimonial)}
          className={twMerge(
            "absolute transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer",
            stateClasses
          )}
          style={
            isActive
              ? {
                  transform: `translateX(${dragOffset}px)`,
                  transition: isDragging.current
                    ? "none"
                    : "transform 1s cubic-bezier(0.16,1,0.3,1)",
                }
              : undefined
          }
          onDragStart={(e) => e.preventDefault()}
          onClick={() => {
            if (isNext) setCurrentIndex(nextIndex);
            if (isPrev) setCurrentIndex(prevIndex);
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
                "py-(--scale-24) px-(--scale-16) sm:px-14 sm:py-18 md:py-18 md:px-14 transition-opacity duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none",
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
          className="relative w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          style={{
            height: activeHeight || "auto",
            transition: "height 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
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
          onNext={() => setCurrentIndex(nextIndex)}
          onPrevious={() => setCurrentIndex(prevIndex)}
          onGoTo={(index) => setCurrentIndex(index)}
          showArrows={isMobile}
          alignment="center"
        />
      </div>
    </div>
  );
}
