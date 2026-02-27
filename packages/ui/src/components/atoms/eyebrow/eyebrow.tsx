import { storyblokEditable, SbBlokData } from "@storyblok/react";
import type { FC } from "react";
import { twMerge } from "tailwind-merge";


export interface EyebrowBlockProps extends SbBlokData {
  eyebrow: string;
  elementType?: "h6" | "div" | 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  className?:string
}

export const Eyebrow: FC<EyebrowBlockProps> = ({
  eyebrow,
  elementType = "h6",
  className='',
  ...blok
}) => {
  const Component = elementType || "h6";
  return (
    <span
      {...storyblokEditable(blok)}
      className={
       twMerge(
         "text-mono-xs font-medium text-(--text-eyebrow) uppercase",
         className
       )}
    >
      <Component>{eyebrow}</Component>
    </span>
  );
};
