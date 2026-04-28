'use client';

import { useState, useEffect } from "react";
import { Icon } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";

import {
  calcData as prevData,
} from "../../data/cb-calc/2024_data";

import {
  calcData as currentData,
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
  const [age, setAge] = useState(50);
  const [compensation, setCompensation] = useState(150000);
  const [years, setYears] = useState(5);
  const [year, setYear] = useState("2025");
  const [result, setResult] = useState(0);

  const [ageInput, setAgeInput] = useState("50");
  const [compInput, setCompInput] = useState("150000");
  const [yearsInput, setYearsInput] = useState("5");

  const selectedData = year === "2024" ? prevData : currentData;

  const getResult = () => {
    return selectedData.find((x: any) => {
      const comp = Number(String(x.compensation).replace(/,/g, ""));
      return Number(x.age) === age && comp === compensation && Number(x.yos) === years;
    });
  };

  useEffect(() => {
    const resultVal = getResult();
    if (!resultVal) {
      setResult(0);
      return;
    }
    const credit = Number(String(resultVal.credit).replace(/,/g, ""));
    setResult(credit);
  }, [age, compensation, years, year]);

  const clampAge = (value: number) => Math.min(70, Math.max(21, value));
  const clampComp = (value: number) => Math.min(350000, Math.max(10000, value));
  const clampYears = (value: number) => Math.min(10, Math.max(1, value));

  const handleAgeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setAgeInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setAge(num);
    }
  };
  const handleAgeBlur = () => {
    let num = parseInt(ageInput, 10);
    if (isNaN(num)) num = age;
    num = clampAge(num);
    setAge(num);
    setAgeInput(num.toString());
  };
  const handleAgeSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setAge(val);
    setAgeInput(val.toString());
  };

  const handleCompInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setCompInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setCompensation(num);
    }
  };
  const handleCompBlur = () => {
    let num = parseInt(compInput, 10);
    if (isNaN(num)) num = compensation;
    num = clampComp(num);
    setCompensation(num);
    setCompInput(num.toString());
  };
  const handleCompSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCompensation(val);
    setCompInput(val.toString());
  };

  const handleYearsInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setYearsInput(raw);
    const num = parseInt(raw, 10);
    if (!isNaN(num)) {
      setYears(num);
    }
  };
  const handleYearsBlur = () => {
    let num = parseInt(yearsInput, 10);
    if (isNaN(num)) num = years;
    num = clampYears(num);
    setYears(num);
    setYearsInput(num.toString());
  };
  const handleYearsSlider = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setYears(val);
    setYearsInput(val.toString());
  };

  return (
    <div
      {...storyblokEditable(blok)}
      className="bg-[#EFE9E3] max-w-187.5 border border-(--stroke-card) rounded-sm  mx-auto py-(--scale-24) px-(--padding-24-18-18)"
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
            <Icon icon="chevron-down" className="h-5 w-5 text-(--icon-primary)" />
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
            min={21}
            max={70}
            value={age}
            onChange={handleAgeSlider}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((age - 21) / (70 - 21)) * 100}%`,
            }}
          />
          <input
            type="text"
            value={ageInput}
            onChange={handleAgeInputChange}
            onBlur={handleAgeBlur}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-20 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center shadow-sm focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>
        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>21</span>
          <span>70+</span>
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          COMPENSATION
        </label>
        <div className="relative">
          <input
            type="range"
            min={10000}
            max={350000}
            step={1000}
            value={compensation}
            onChange={handleCompSlider}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((compensation - 10000) / (350000 - 10000)) * 100}%`,
            }}
          />
          <input
            type="text"
            value={compInput}
            onChange={handleCompInputChange}
            onBlur={handleCompBlur}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-32 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center shadow-sm focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>
        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>$10,000</span>
          <span>$350,000+</span>
        </div>
      </div>

      <div className="mb-8 relative">
        <label className="text-mono-sm font-medium mb-2 block text-(--text-headings)">
          YEAR OF SERVICE AT CURRENT EMPLOYER (THROUGH 2025)
        </label>
        <div className="relative">
          <input
            type="range"
            min={1}
            max={10}
            value={years}
            onChange={handleYearsSlider}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((years - 1) / (10 - 1)) * 100}%`,
            }}
          />
          <input
            type="text"
            value={yearsInput}
            onChange={handleYearsInputChange}
            onBlur={handleYearsBlur}
            className="no-spinner absolute left-1/2 -translate-x-1/2 top-10 z-10 w-20 border border-(--surface-accent-background) bg-white px-2 py-1 rounded text-sm text-center  focus:outline-none focus:ring-1 focus:ring-(--stroke-primary)"
          />
        </div>
        <div className="flex justify-between mt-6 text-sm text-(--color-neutral-700---body)">
          <span>1</span>
          <span>10+</span>
        </div>
      </div>

      <div className="border-t border-(--stroke-card) my-8" />

      <div>
        <p className="text-md mb-4 text-(--text-headings)">
          Your {year} annual Cash Balance contribution could be as high as:
        </p>
        <p className="text-display-2xl text-(--text-link)">
          ${result.toLocaleString()}
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