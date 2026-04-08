import { FC } from "react";
import { Button, CarouselButton, Icon } from "../../atoms";

export interface SliderControlsProps {
  currentIndex: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo?: (index: number) => void;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  mode?: "dark" | "light";
  alignment?: "center";
}

export const SliderControls: FC<SliderControlsProps> = ({
  currentIndex,
  totalSlides,
  onPrevious,
  onNext,
  onGoTo,
  showDots = true,
  showArrows = false,
  className = "",
  mode = "light",
  alignment,
}) => {
  if (totalSlides <= 1) return null;

  const isCenter = alignment === "center";

  return (
   <div className={`w-full flex items-center ${className}`}>
  {alignment === "center" ? (
    <>
      <div className="flex-1 flex justify-start">
        {showArrows && (
          <CarouselButton
            direction="left"
            onClick={onPrevious}
            disabled={currentIndex === 0}
          />
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        {showDots &&
          Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => onGoTo?.(i)}
              className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                i === currentIndex
                  ? `w-22  ${mode === "dark" ? "bg-(--color-base-white)" : "bg-(--color-neutral-700)"}`
                  : `w-22 opacity-50 ${mode === "dark" ? "bg-(--color-base-white)" : "bg-(--color-neutral-700)"}`
              }`}
            />
          ))}
      </div>

      <div className="flex-1 flex justify-end">
        {showArrows && (
          <CarouselButton
            direction="right"
            onClick={onNext}
            disabled={currentIndex === totalSlides - 1}
          />
        )}
      </div>
    </>
  ) : (
    <>
      {showDots && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => onGoTo?.(i)}
              className={`h-1.5 rounded-sm transition-all cursor-pointer ${
                i === currentIndex
                  ? `w-22 ${mode === "dark" ? "bg-(--color-base-white)" : "bg-(--color-neutral-700)"}`
                  : `w-22 opacity-50 ${mode === "dark" ? "bg-(--color-base-white)" : "bg-(--color-neutral-700)"}`
              }`}
            />
          ))}
        </div>
      )}

      {showArrows && (
        <div className="flex items-center gap-3 ml-auto">
          <CarouselButton
            direction="left"
            onClick={onPrevious}
            disabled={currentIndex === 0}
          />
          <CarouselButton
            direction="right"
            onClick={onNext}
            disabled={currentIndex === totalSlides - 1}
          />
        </div>
      )}
    </>
  )}
</div>
  );
};

export default SliderControls;