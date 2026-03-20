import { FC } from 'react';
import { Button, Icon } from '../../atoms';

export interface SliderControlsProps {
  currentIndex: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoTo?: (index: number) => void;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
  mode? : 'dark' | 'light'
}

export const SliderControls: FC<SliderControlsProps> = ({
  currentIndex,
  totalSlides,
  onPrevious,
  onNext,
  onGoTo,
  showDots = true,
  showArrows = false,
  className = '',
  mode = 'light'
}) => {
  if (totalSlides <= 1) return null;

  return (
    <div className={`w-full flex items-center justify-between ${className}`}>
      {/* Progress Indicators */}
      {showDots && (
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === currentIndex}
              onClick={() => onGoTo?.(i)}
              className={`h-1.5 rounded-sm transition-all ${
                i === currentIndex 
                  ? `w-16 lg:w-56 ${mode === 'dark'? 'bg-(--color-base-white)' : 'bg-(--color-neutral-700---body)' }`
                  : `w-16 opacity-50 ${mode === 'dark'? 'bg-(--color-base-white)' : 'bg-(--color-neutral-700---body)'}`
              }`}
            />
          ))}
        </div>
      )}

      {/* Navigation Arrows */}
      {showArrows && (
        <div className="flex items-center gap-3 ml-auto">
          <Button
            type="button"
            onClick={onPrevious}
            aria-label="Previous slide"
            mode="filled"
            tone="secondary"
            size="sm"
            leadingIcon="arrow-left"
            className="w-10! h-10! min-w-10! px-0!"
          />
          <Button
            type="button"
            onClick={onNext}
            aria-label="Next slide"
            mode="filled"
            tone="primary"
            size="sm"
            trailingIcon="arrow-right"
            className="w-10! h-10! min-w-10! px-0!"
          />
        </div>
      )}
    </div>
  );
};

export default SliderControls;
