"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Attribution, SliderControls } from "../../molecules";
import { Eyebrow, EyebrowBlockProps, Heading } from "../../atoms";
import { TestimonialBlok } from "../../modules";
import { HeadingBlok } from "../../atoms/heading";
import { twMerge } from "tailwind-merge";
import { getAllTestimonials } from "../../../lib";

export interface TestimonialSliderBlok extends SbBlokData {
  eyebrow?: EyebrowBlockProps[];
  heading?: HeadingBlok[];
  testimonials: TestimonialBlok[];
}

interface TestimonialSliderProps {
  blok: TestimonialSliderBlok;
  rels?: any[];
}

export function TestimonialSlider({ blok, rels = [] }: TestimonialSliderProps) {
  const activeCardRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeHeight, setActiveHeight] = useState(0);

  const relMap = useMemo(() => {
    return Object.fromEntries(
      (rels || []).map((rel: any) => [rel.uuid, rel.content])
    );
  }, [rels]);

  const resolvePerson = (person: any) => {
    if (!person) return null;
    if (typeof person === "string") return relMap[person];
    return person;
  };

  const total = blok.testimonials.length;
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

  const offset = 56;

  const desktopSlides = useMemo(() => {
    return blok.testimonials.map((testimonial, index) => {
      const person = resolvePerson(testimonial.person);
      const isActive = index === currentIndex;
      const isPrev = index === prevIndex;
      const isNext = index === nextIndex;

      let stateClasses = "";
      if (isActive) {
        stateClasses = "z-30 scale-100 opacity-100 translate-x-0";
      } else if (isPrev) {
        stateClasses =
          "z-20 scale-90 opacity-0 md:opacity-70 lg:-translate-x-28 md:-translate-x-20 -translate-x-24";
      } else if (isNext) {
        stateClasses =
          "z-20 scale-90 opacity-0 md:opacity-70 lg:translate-x-28 md:translate-x-20 translate-x-24";
      } else {
        stateClasses = "z-10 scale-75 opacity-0";
      }

      const dynamicHeight =
        !isActive && activeHeight
          ? { height: `calc(${activeHeight}px - ${offset}px)` }
          : undefined;

      const contentProps = {
        quote: testimonial.quote,
        name: person?.firstName + " " + (person?.lastName || ""),
        role: person?.role,
        variant: person?.variant,
        displayName: person?.name || "",
        displayTitle: person?.title || "",
      };

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
              "w-full max-w-151.5 lg:max-w-264.25",
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
                "py-(--scale-24) px-(--scale-16) sm:px-14 sm:py-18 md:px-16 md:py-16 transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-0"
              )}
            >
              <Heading size="4xl">
                <blockquote>“{contentProps.quote}”</blockquote>
              </Heading>

              <div className="mt-10 border-t pt-6">
                <p className="text-(--text-headings) text-md">
                  {contentProps.displayName} {contentProps.displayTitle}
                </p>
              </div>

             {
              person &&
               <Attribution
                name={contentProps.name}
                role={contentProps.role}
                variant={contentProps.variant}
              />
             }
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
    relMap,
  ]);

  useEffect(() => {
    const func = async () => {
      const test = await getAllTestimonials();
      console.log(test, "all test with rels");
    };
    func();
  }, []);

  return (
    <div
      {...storyblokEditable(blok)}
      className="relative max-w-360 mx-auto bg-(--surface-accent-background) rounded-lg overflow-hidden px-(--scale-16) py-(--scale-48) sm:px-(--scale-48) sm:py-(--scale-72) lg:p-23"
    >
               <div className="pattern-grid pattern-white opacity-5" />

      <div className="relative mx-auto max-w-7xl md:w-[90%]! lg:w-full  flex flex-col items-center gap-12">
        <div className="text-center">
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

        <div
          className="relative w-full flex items-center justify-center "
          style={{ height: activeHeight || "auto" }}
        >
          {desktopSlides}
        </div>

        <div className="w-full max-w-300 mx-auto mt-12">
          <SliderControls
            className="flex justify-center"
            currentIndex={currentIndex}
            totalSlides={total}
            mode="dark"
            onNext={() => setCurrentIndex(nextIndex)}
            onPrevious={() => setCurrentIndex(prevIndex)}
            onGoTo={(index) => setCurrentIndex(index)}
          />
        </div>
      </div>
    </div>
  );
}
