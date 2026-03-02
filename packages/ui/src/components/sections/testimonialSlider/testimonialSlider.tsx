"use client";

import { useRef, useState } from "react";
import Slider from "react-slick";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Attribution, SliderControls } from "../../molecules";
import { Eyebrow, EyebrowBlockProps, Heading } from "../../atoms";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { TestimonialBlok } from "../../modules";

 export interface TestimonialSliderBlok extends SbBlokData {
  eyebrow?: EyebrowBlockProps[];
  heading?: string;
   testimonials: TestimonialBlok[];

}

interface TestimonialSliderProps {
  blok: TestimonialSliderBlok;
}


export function TestimonialSlider({ blok }: TestimonialSliderProps) {
  const desktopSliderRef = useRef<Slider | null>(null);
  const mobileSliderRef = useRef<Slider | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const total = blok.testimonials.length;

  const desktopSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    adaptiveHeight: true,
    centerMode: true,
    centerPadding: "180px",
    beforeChange: (_: number, next: number) => setCurrentIndex(next),
  };

  const mobileSettings = {
    arrows: false,
    dots: false,
    infinite: true,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: true,
    adaptiveHeight: true,
    beforeChange: (_: number, next: number) => setCurrentIndex(next),
  };


  return (
    <section
      {...storyblokEditable(blok)}
      className="relative w-full section-padding-xl bg-(--surface-background) lg:bg-(--surface-accent-background) rounded-lg overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url(/squarePattern/WhitePattern.svg)",
          backgroundRepeat: "repeat",
          backgroundSize: "auto",
        }}
      />

      <div className="relative mx-auto max-w-7xl w-full flex flex-col items-center gap-12">
        <div className="text-center hidden lg:block">
          {blok.eyebrow?.[0] && (
            <Eyebrow
            {...storyblokEditable}
              {...blok.eyebrow[0]}
              className="text-(--text-headings-light)! text-center"
            />
          )}

          {blok.heading && (
            <Heading
            {...storyblokEditable}
              as="h2"
              size="4xl"
              className="text-(--text-headings-light)! mt-4 max-w-200 mx-auto"
            >
              <span {...storyblokEditable}>
                {blok.heading}
              </span>
            </Heading>
          )}
        </div>

        <div className="relative w-full hidden lg:block">
          <Slider ref={desktopSliderRef} {...desktopSettings}>
            {blok.testimonials.map((testimonial, index) => {
              const isActive = index === currentIndex;
              const isPrev = index === (currentIndex - 1 + total) % total;
              const isNext = index === (currentIndex + 1) % total;

              const transform = isActive
                ? "translate3d(0,0,0) scale(1)"
                : isPrev
                  ? "translate3d(742px,0,0) scale(0.9)"
                  : isNext
                    ? "translate3d(-742px,0,0) scale(0.9)"
                    : "translate3d(0,0,0) scale(0.9)";

              const zIndex = isActive ? 100 : isNext ? 0 : 1;

              return (
                <div {...storyblokEditable} key={testimonial._uid} className="px-4">
                  <div
                    className="relative will-change-transform transition-transform duration-500 ease-out"
                    style={{ transform, zIndex }}
                  >
                    <div
                      className={`relative bg-white px-14 py-18 md:px-16 md:py-16 rounded-md shadow-xl overflow-hidden border-b-10 ${
                        isActive
                          ? "border-(--stroke-testimonial-1)"
                          : "border-(--stroke-testimonial-3)"
                      }`}
                    >
                      {testimonial.brandLogo?.filename && (
                        <div className="mb-8">
                          {/* <img
                            src={testimonial.brandLogo.filename}
                            alt={testimonial.brandLogo.alt || ""}
                            className="h-8 object-contain"
                          /> */}
                          Logo placeholder
                        </div>
                      )}

                      <Heading {...storyblokEditable} size="4xl">
                        <blockquote>“{testimonial.quote}”</blockquote>
                      </Heading>

                      <div className="mt-10 border-t border-(--stroke-primary) pt-6">
                        <p {...storyblokEditable} className="text-(--text-headings) text-md">
                          {testimonial.author?.name} at{" "}
                          {testimonial.author?.role?.label}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </Slider>
        </div>

        <div className="relative w-full lg:hidden">
          {blok.eyebrow?.[0] && (
            <Eyebrow {...blok.eyebrow[0]} className="mb-4 block" />
          )}

          <Slider ref={mobileSliderRef} {...mobileSettings}>
            {blok.testimonials.map((testimonial) => (
              <div key={testimonial._uid} className="">
                <div>
                  <Heading size="4xl" className="leading-relaxed mb-6">
                    <blockquote>“{testimonial.quote}”</blockquote>
                  </Heading>

                  <Attribution
                    name={testimonial.author?.name}
                    role={{
                      label: testimonial.author?.role?.label || "",
                      variant: "orange",
                    }}
                    avatarSrc={testimonial.brandLogo?.filename}
                    rounded={true}
                  />
                </div>
              </div>
            ))}
          </Slider>
        </div>

        <SliderControls
          className="flex justify-center"
          currentIndex={currentIndex}
          totalSlides={total}
          mode="dark"
          onNext={() => {
            desktopSliderRef.current?.slickNext();
            mobileSliderRef.current?.slickNext();
          }}
          onPrevious={() => {
            desktopSliderRef.current?.slickPrev();
            mobileSliderRef.current?.slickPrev();
          }}
          onGoTo={(index) => {
            desktopSliderRef.current?.slickGoTo(index);
            mobileSliderRef.current?.slickGoTo(index);
          }}
        />
      </div>
    </section>
  );
}
