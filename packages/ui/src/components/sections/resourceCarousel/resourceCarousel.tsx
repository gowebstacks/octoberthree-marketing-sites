"use client";
import { useRef, useState, useEffect, type FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";
import {
  ContentBlock,
  ContentBlockBlok,
  ResourceCard,
  ResourceCardProps,
} from "../../organisms";
import { CarouselButton } from "../../atoms";
import { SliderControls } from "../../molecules";

export interface ResourceCarouselBlok extends SbBlokData {
  content?: ContentBlockBlok[];
  cards?: ResourceCardProps[];
  htmlId?: string;
}

export const ResourceCarousel: FC<ResourceCarouselBlok> = ({
  content,
  cards = [],
  htmlId,
  ...blok
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startScrollLeft: 0,
    hasMoved: false,
  });
  const preventClickRef = useRef(false);

  const updateScrollState = () => {
    if (!trackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = trackRef.current;

    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);

    const cardWidth =
      trackRef.current.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 1;
    const maxScrollLeft = scrollWidth - clientWidth;

    const index = maxScrollLeft > 0
      ? Math.round((scrollLeft / maxScrollLeft) * (cards.length - 1))
      : 0;

    setCurrentSlide(index);
  };

  const scrollByCard = (direction: "left" | "right") => {
    if (!trackRef.current) return;
    const cardWidth =
      trackRef.current.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 0;

    trackRef.current.scrollBy({
      left: direction === "left" ? -cardWidth : cardWidth,
      behavior: "smooth",
    });
  };

  const handleGoTo = (index: number) => {
    if (!trackRef.current) return;
    const cardWidth =
      trackRef.current.querySelector<HTMLElement>("[data-card]")?.offsetWidth || 0;

    trackRef.current.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const onDragStart = (clientX: number) => {
      dragRef.current = {
        isDragging: true,
        startX: clientX,
        startScrollLeft: track.scrollLeft,
        hasMoved: false,
      };
      track.style.cursor = "grabbing";
      track.style.userSelect = "none";
      track.style.scrollBehavior = "auto";
      track.style.scrollSnapType = "none";
    };

    const onDragMove = (clientX: number) => {
      const { startX, startScrollLeft, isDragging } = dragRef.current;
      if (!isDragging) return;

      const delta = clientX - startX;
      if (Math.abs(delta) > 5) {
        dragRef.current.hasMoved = true;
        preventClickRef.current = true; 
      }

      track.scrollLeft = startScrollLeft - delta;
    };

    const onDragEnd = () => {
      const wasDragging = dragRef.current.isDragging;
      const hadMoved = dragRef.current.hasMoved;
      const trackEl = trackRef.current;

      dragRef.current = {
        isDragging: false,
        startX: 0,
        startScrollLeft: 0,
        hasMoved: false,
      };

      if (trackEl) {
        trackEl.style.cursor = "grab";
        trackEl.style.userSelect = "";
        trackEl.style.scrollBehavior = "smooth";
        trackEl.style.scrollSnapType = "x mandatory";
      }

      if (wasDragging && hadMoved) {
        setTimeout(updateScrollState, 50);
        setTimeout(() => {
          preventClickRef.current = false;
        }, 100);
      } else {
        preventClickRef.current = false;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, [role='button']")) return;
      onDragStart(e.pageX);
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => onDragMove(e.pageX);
    const handleMouseUp = onDragEnd;

    // Prevent click navigation if user dragged
    const handleClickCapture = (e: MouseEvent) => {
      if (preventClickRef.current) {
        e.stopPropagation();
        e.preventDefault();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button, [role='button']")) return;
      onDragStart(e.touches[0].pageX);
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => onDragMove(e.touches[0].pageX);
    const handleTouchEnd = onDragEnd;

    track.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("click", handleClickCapture, true);

    track.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      track.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("click", handleClickCapture, true);
      track.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [cards.length]);

  return (
    <div
      {...storyblokEditable(blok)}
      id={htmlId}
      className="mx-auto grid max-w-360 grid-cols-1 gap-y-(--gaps-56-48-48) gap-x-(--gaps-56-48-48) lg:grid-cols-2"
    >
      {content?.length ? (
        <div className="flex flex-col gap-8">
          {content.map((nestedBlok) => (
            <ContentBlock key={nestedBlok._uid} blok={nestedBlok} />
          ))}
        </div>
      ) : null}

      <div className="relative flex flex-col">
        <div
          ref={trackRef}
          className="
            flex gap-x-(--gaps-16-12-12)
            overflow-x-auto pb-4
            [-ms-overflow-style:none]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            cursor-grab active:cursor-grabbing
          "
          style={{
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
          }}
        >
          {cards.map((resource) => (
            <div key={resource._id} data-card className="snap-start shrink-0">
              <ResourceCard {...resource} carousel={true} />
            </div>
          ))}
        </div>

        {!!cards.length && (
          <div className="mt-6 flex justify-between gap-3">
            <div className="mt-4">
              <SliderControls
                currentIndex={currentSlide}
                totalSlides={cards.length}
                onPrevious={() => scrollByCard("left")}
                onNext={() => scrollByCard("right")}
                onGoTo={handleGoTo}
                showDots={true}
                showArrows={false}
              />
            </div>
            <div className="flex justify-end gap-3">
              <CarouselButton
                direction="left"
                disabled={!canScrollLeft}
                onClick={() => scrollByCard("left")}
              />
              <CarouselButton
                direction="right"
                disabled={!canScrollRight}
                onClick={() => scrollByCard("right")}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};