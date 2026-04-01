"use client";

import { useState } from "react";
import { InputField } from "../../molecules";
import { Icon } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";
export interface CalculatorFormBlok extends SbBlokData{
  _uid: string;
  component: "calculatorForm";
  variant: "simple" | "slider";
}
export interface CalculatorFormProps {
  blok: CalculatorFormBlok;
}

export const CalculatorForm = ({ blok }: CalculatorFormProps) => {
  var [age, setAge] = useState(50);
  var [compensation, setCompensation] = useState(150000);
  var [years, setYears] = useState(5);
  var [year, setYear] = useState("2025");

  var result = (age * 10 + years * 100 + compensation * 0.05).toFixed(2);

  var [ein, setEin] = useState("");
  var [plan, setPlan] = useState("");
  var [sponsor, setSponsor] = useState("");

  if (blok.variant === "simple") {
    return (
      <div {...storyblokEditable(blok)} className="bg-[#EFE9E3] border border-(--stroke-card) rounded-sm max-w-187.5 mx-auto py-(--scale-24) px-(--padding-24-18-18)">
        <div className="mb-4">
          <InputField
            label="EIN"
            value={ein}
            onChange={(e) => setEin(e.target.value)}
            placeholder="placeholder"
          />
        </div>

        <div className="mb-4">
          <InputField
            label="PLAN NUMBER"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            placeholder="placeholder"
          />
        </div>

        <p className="text-mono-sm font-medium tracking-wide mb-4">
          OR FIND PLANS BY SPONSOR
        </p>

        <div className="mb-8">
          <label className="text-rich-image-caption text-(--text-body-dark)">
            Sponser Name
          </label>
          <div className="flex mt-2 items-center gap-1 border border-(--stroke-primary) rounded-md bg-white w-full px-1.5 py-1">
            <Icon
              size={16}
              color="var(--icon-primary-dark)"
              icon="search-lg"
              className="shrink-0"
            />

            <input
              value={sponsor}
              onChange={(e) => setSponsor(e.target.value)}
              type="text"
              placeholder="type your question"
              className="outline-none text-sm w-full bg-transparent h-8"
            />

            <button className="text-xs h-8 px-2 rounded-xs bg-(--surface-search-button) text-white">
              Find Plan
            </button>
          </div>
        </div>

        <button className="bg-orange-600 text-white px-6 py-3 rounded-md">
          Calculate
        </button>
      </div>
    );
  }

  return (
    <div {...storyblokEditable(blok)} className="bg-[#EFE9E3] max-w-187.5 border border-(--stroke-card) rounded-sm max-w-4xl mx-auto py-(--scale-24) px-(--padding-24-18-18)">
     
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
            onChange={(e) => setAge(Number(e.target.value))}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((age - 21) / (70 - 21)) * 100}%`,
            }}
          />

          <div
            className="absolute top-10 -translate-x-1/2"
            style={{
              left: `${((age - 21) / (70 - 16)) * 100}%`,
            }}
          >
            <span className="border border-(--stroke-secondary) px-3 py-1 rounded bg-(--surface-input) text-sm whitespace-nowrap">
              {age}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-6 text-sm">
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
            onChange={(e) => setCompensation(Number(e.target.value))}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((compensation - 10000) / (350000 - 10000)) * 100}%`,
            }}
          />

          <div
            className="absolute top-10 -translate-x-1/2"
            style={{
              left: `${((compensation - 10000) / (380000 )) * 100}%`,
            }}
          >
            <span className="border border-(--stroke-secondary) px-3 py-1 rounded bg-(--surface-input) text-sm whitespace-nowrap">
              ${compensation.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-6 text-sm">
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
            onChange={(e) => setYears(Number(e.target.value))}
            className="slider w-full"
            style={{
              ["--value" as any]: `${((years - 1) / (10 - 1)) * 100}%`,
            }}
          />

          <div
            className="absolute top-10 -translate-x-1/2"
            style={{
              left: `${((years - 1) / (10 )) * 100}%`,
            }}
          >
            <span className="border border-(--stroke-secondary) px-3 py-1 rounded bg-(--surface-input) text-sm whitespace-nowrap">
              {years}
            </span>
          </div>
        </div>

        <div className="flex justify-between mt-6 text-sm">
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
          ${Number(result).toLocaleString()}
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
      `}</style>

    </div>
  );
};