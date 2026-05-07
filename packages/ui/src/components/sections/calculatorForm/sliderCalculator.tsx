"use client";

import { useState, useEffect } from "react";
import { Icon } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";

import {
  calcData as prevData,
  dataRanges as prevDataRanges,
} from "../../data/cb-calc/2024_data";

import {
  calcData as currentData,
  dataRanges as currentDataRanges,
} from "../../data/cb-calc/2025_data";

export interface CalculatorFormBlok extends SbBlokData {
  _uid: string;
  component: "calculatorForm";
  variant: "simple" | "slider";
}

export interface CalculatorFormProps {
  blok: CalculatorFormBlok;
}

export const SliderCalculator = ({ blok }: CalculatorFormProps) => {
  const [ageValue, setAgeValue] = useState<any>(50);
  const [compValue, setCompValue] = useState<any>(40000);
  const [yosValue, setYosValue] = useState<any>(0);
  const [result, setResult] = useState<any>(0);

  const [year, setYear] = useState("2025");

  const data = year === "2024" ? prevData : currentData;

  const dataRanges = year === "2024" ? prevDataRanges : currentDataRanges;

  useEffect(() => {
    let resultVal = getResult();

    if (resultVal !== undefined) {
      if (resultVal.credit.indexOf(",") > -1) {
        resultVal.credit = resultVal.credit.replace(",", "");
      }

      setResult(resultVal.credit);
    }
  }, [[ageValue, compValue, yosValue]]);

  const getResult = () => {
    return data.find((x: any) => {
      let comp = x.compensation;

      if (comp.indexOf(",") > -1) {
        comp = comp.replace(",", "");
      }

      return (
        x.age == ageValue && parseInt(comp) == compValue && x.yos == yosValue
      );
    });
  };

  let currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const sliderCompValue =
    Number(compValue) >= 340000
      ? Math.round(Number(compValue) / 5000) * 5000
      : Math.round(Number(compValue) / 10000) * 10000;
  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-[#EFE9E3] max-w-187.5 border border-(--stroke-card) rounded-sm mx-auto py-(--scale-24) px-(--padding-24-18-18)"
    >
      <h2 className="text-display-xl mb-4">Cash Balance Calculator</h2>

      <div className="mb-6">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          YEAR
        </label>

        <div className="relative">
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full border border-(--stroke-secondary) bg-(--surface-input) px-(--padding-12-8-8) py-(--padding-8-6-6) text-sm appearance-none pr-10"
          >
            <option value="2025">2025</option>

            <option value="2024">2024</option>
          </select>

          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <Icon
              icon="chevron-down"
              className="h-5 w-5 text-(--icon-primary)"
            />
          </span>
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          AGE
        </label>

        <div className="relative">
          <input
            type="range"
            min={dataRanges.age.min}
            max={dataRanges.age.max}
            step="1"
            value={ageValue}
            onChange={(e) => setAgeValue(e.target.value)}
            className="slider w-full"
            style={{
              ["--value" as any]: `${
                ((Number(ageValue) - Number(dataRanges.age.min)) /
                  (Number(dataRanges.age.max) - Number(dataRanges.age.min))) *
                100
              }%`,
            }}
          />

          <input
            type="text"
            value={ageValue}
            onChange={(e) => setAgeValue(e.target.value)}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-20 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center shadow-sm focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>

        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>{dataRanges.age.min}</span>

          <span>{dataRanges.age.max}+</span>
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          COMPENSATION
        </label>

        <div className="relative">
          <input
            type="range"
            min={dataRanges.comp.min}
            max={dataRanges.comp.max}
            step={
              compValue === "340000" || compValue === "345000"
                ? "5000"
                : dataRanges.comp.step
            }
            value={sliderCompValue}
            onChange={(e) => setCompValue(e.target.value)}
            className="slider w-full"
            style={{
              ["--value" as any]: `${
                ((sliderCompValue - Number(dataRanges.comp.min)) /
                  (Number(dataRanges.comp.max) - Number(dataRanges.comp.min))) *
                100
              }%`,
            }}
          />
          <input
            type="text"
            value={compValue}
            onChange={(e) => setCompValue(e.target.value)}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-32 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center shadow-sm focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>

        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>{currencyFormatter.format(Number(dataRanges.comp.min))}</span>

          <span>{currencyFormatter.format(Number(dataRanges.comp.max))}+</span>
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          YEAR OF SERVICE AT CURRENT EMPLOYER (THROUGH {year})
        </label>

        <div className="relative">
          <input
            type="range"
            min={dataRanges.yos.min}
            max={dataRanges.yos.max}
            step="1"
            value={yosValue}
            onChange={(e) => setYosValue(e.target.value)}
            className="slider w-full"
            style={{
              ["--value" as any]: `${
                ((Number(yosValue) - Number(dataRanges.yos.min)) /
                  (Number(dataRanges.yos.max) - Number(dataRanges.yos.min))) *
                100
              }%`,
            }}
          />

          <input
            type="text"
            value={yosValue}
            onChange={(e) => setYosValue(e.target.value)}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-20 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>

        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>{dataRanges.yos.min}</span>

          <span>{dataRanges.yos.max}+</span>
        </div>
      </div>

      <div className="border-t border-(--stroke-card) my-8" />

      <div>
        <p className="text-md mb-4 text-(--text-headings)">
          Your {year} annual Cash Balance contribution could be as high as:
        </p>

        <p className="text-display-2xl text-(--text-link)">
          {currencyFormatter.format(result)}
        </p>
      </div>

      <style>{`
        .slider {
          -webkit-appearance: none;
          width: 100%;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(
            to right,
            var(--surface-accent-background) 0%,
            var(--surface-accent-background) var(--value, 50%),
            #d1d5db var(--value, 50%),
            #d1d5db 100%
          );
          outline: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 999px;
          background: white;
          border: 3px solid var(--surface-accent-background);
          cursor: pointer;
          margin-top: -3px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 999px;
          background: white;
          border: 3px solid var(--surface-accent-background);
          cursor: pointer;
        }

        .no-spinner::-webkit-inner-spin-button,
        .no-spinner::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }

        .no-spinner {
          -moz-appearance: textfield;
          appearance: textfield;
        }
      `}</style>
    </div>
  );
};
