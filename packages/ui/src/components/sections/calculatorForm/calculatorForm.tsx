'use client';

import { SbBlokData, storyblokEditable } from "@storyblok/react";

import { SimpleCalculator } from "./simpleCalculator";
import { SliderCalculator } from "./sliderCalculator";


export interface CalculatorFormBlok extends SbBlokData {
  _uid: string;
  component: "calculatorForm";
  variant: "simple" | "slider";
}
export interface CalculatorFormProps {
  blok: CalculatorFormBlok;
}

export const CalculatorForm = ({ blok }:CalculatorFormProps) => {
  return (
    <div {...storyblokEditable(blok)}>
      {blok.variant === "simple" ? (
        <SimpleCalculator blok={blok} />
      ) : (
        <SliderCalculator blok={blok} />
      )}
    </div>
  );
};