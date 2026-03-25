"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import Slider from "react-slick";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Attribution, SliderControls } from "../../molecules";
import { Eyebrow, EyebrowBlockProps, Heading } from "../../atoms";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TestimonialBlok } from "../../modules";
import { HeadingBlok } from "../../atoms/heading";
import { twMerge } from "tailwind-merge";

export interface TestimonialSliderBlok extends SbBlokData {
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingBlok[];
  testimonials: TestimonialBlok[];
}

interface TestimonialSliderProps {
  blok: TestimonialSliderBlok;
}

export function TestimonialSlider({ blok }: TestimonialSliderProps) {
  const mobileSliderRef = useRef<Slider | null>(null);
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);

  const total = blok.testimonials.length;
  const getIndex = useCallback((i: number) => (i + total) % total, [total]);

  const prevIndex = getIndex(currentIndex - 1);
  const nextIndex = getIndex(currentIndex + 1);

  const mobileSettings = useMemo(
    () => ({
      arrows: false,
      dots: false,
      infinite: true,
      speed: 400,
      slidesToShow: 1,
      slidesToScroll: 1,
      swipe: true,
      adaptiveHeight: true,
      beforeChange: (_: number, next: number) => setCurrentIndex(next),
    }),
    []
  );

  useEffect(() => {
    const el = activeCardRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) setActiveHeight(entry.contentRect.height);
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [currentIndex]);

  const offset = 56;

  const desktopSlides = useMemo(() => {
    return blok.testimonials.map((testimonial, index) => {
      const isActive = index === currentIndex;
      const isPrev = index === prevIndex;
      const isNext = index === nextIndex;

      let stateClasses = "";
      if (isActive) {
        stateClasses = "z-30 scale-100 opacity-100 translate-x-0";
      } else if (isPrev) {
        stateClasses = "z-20 scale-90 opacity-70 -translate-x-32";
      } else if (isNext) {
        stateClasses = "z-20 scale-90 opacity-70 translate-x-32";
      } else {
        stateClasses = "z-10 scale-75 opacity-0";
      }

      const dynamicHeight =
        !isActive && activeHeight
          ? { height: `calc(${activeHeight}px - ${offset}px)` }
          : undefined;

      return (
        <div
          key={testimonial._uid}
          {...storyblokEditable(testimonial)}
          className={twMerge(
            "absolute transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] cursor-pointer",
            stateClasses
          )}
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
              "w-full max-w-[606px] lg:max-w-[1057px]",
              isActive
                ? "border-(--stroke-testimonial-1)"
                : isPrev
                ? "border-(--stroke-testimonial-3)"
                : isNext
                ? "border-(--stroke-testimonial-2)"
                : "border-transparent"
            )}
          >
            {/* FIXED: Use visibility + opacity instead of pointer-events-none + opacity */}
            <div
              className={twMerge(
                "px-14 py-18 md:px-16 md:py-16 transition-opacity duration-300",
                isActive 
                  ? "opacity-100 visible" 
                  : "opacity-0 invisible"
              )}
            >
              <Heading size="4xl">
                <blockquote>“{testimonial.quote}”</blockquote>
              </Heading>

              <div className="mt-10 border-t pt-6">
                <p className="text-(--text-headings) text-md">
                  {testimonial.author?.name}{" "}
                  {testimonial.author?.role?.label}
                </p>
              </div>

              <Attribution
                name={testimonial.author?.name}
                role={testimonial.author?.role}
              />
            </div>
          </div>
        </div>
      );
    });
  }, [
    blok.testimonials,
    currentIndex,
    prevIndex,
    nextIndex,
    activeHeight,
    offset,
  ]);

  const mobileSlides = useMemo(() => {
    return blok.testimonials.map((testimonial) => (
      <div key={testimonial._uid}>
        <Heading size="4xl" className="mb-6">
          <blockquote>“{testimonial.quote}”</blockquote>
        </Heading>
        <Attribution
          name={testimonial.author?.name}
          role={{
            label: testimonial.author?.role?.label || "",
            variant: "orange",
          }}
          rounded
        />
      </div>
    ));
  }, [blok.testimonials]);

  return (
    <div
      {...storyblokEditable(blok)}
      className="relative section-padding-xl-top-bottom max-w-360 mx-auto lg:bg-(--surface-accent-background) rounded-lg overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url(/squarePattern/WhitePattern.svg)" }}
      />

      <div className="relative mx-auto max-w-7xl w-full flex flex-col items-center gap-12">
        <div className="text-center hidden lg:block">
          {blok.eyebrow?.[0] && (
            <Eyebrow
              {...blok.eyebrow[0]}
              className="text-(--text-headings-light)! text-center"
            />
          )}
          {blok.heading?.[0] && (
            <Heading
              blok={blok.heading[0]}
              className="text-(--text-headings-light)! mt-4 mb-18 max-w-200 mx-auto"
            />
          )}
        </div>

        <div className="relative w-full hidden lg:flex items-center justify-center h-[520px]">
          {desktopSlides}
        </div>

        <div className="relative w-full lg:hidden">
          {blok.eyebrow?.[0] && (
            <Eyebrow {...blok.eyebrow[0]} className="mb-4" />
          )}
          <Slider ref={mobileSliderRef} {...mobileSettings}>
            {mobileSlides}
          </Slider>
        </div>

        <div className="w-full max-w-[1200px] mx-auto mt-12">
          <SliderControls
            className="flex justify-center"
            currentIndex={currentIndex}
            totalSlides={total}
            mode="dark"
            onNext={() => {
              setCurrentIndex(nextIndex);
              mobileSliderRef.current?.slickNext();
            }}
            onPrevious={() => {
              setCurrentIndex(prevIndex);
              mobileSliderRef.current?.slickPrev();
            }}
            onGoTo={(index) => {
              setCurrentIndex(index);
              mobileSliderRef.current?.slickGoTo(index);
            }}
          />
        </div>
      </div>
    </div>
  );
}