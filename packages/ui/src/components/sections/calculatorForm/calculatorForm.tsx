"use client";

import { useState, useEffect } from "react";
import { InputField } from "../../molecules";
import { Icon } from "../../atoms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";

export interface CalculatorFormBlok extends SbBlokData {
  _uid: string;
  component: "calculatorForm";
  variant: "simple" | "slider";
}
export interface CalculatorFormProps {
  blok: CalculatorFormBlok;
}

import {
  calcData as prevData,
  dataRanges as prevDataRanges,
} from "../../data/cb-calc/2024_data";
import {
  calcData as currentData,
  dataRanges as currentDataRanges,
} from "../../data/cb-calc/2025_data";

import prtCalcData from "../../data/prt-calc/prtCalc_data_2025.json";
import { RTCTable } from "../../modules";

const formatCurrency = (num: any) => {
  if (num === undefined || num === null) return "";
  const x = typeof num === "string" ? parseInt(num.replace(/,/g, "")) : num;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumSignificantDigits: 1,
  }).format(x);
};

const resultToTableRows = (result: any, selectedPlan: any) => {
  const headers = [
    { _key: "h1", text: "Metric", alignment: "left" as const },
    { _key: "h2", text: "Value", alignment: "left" as const },
  ];

  const rows: any[] = [];
  const addRow = (key: string, label: string, value: any) => {
    if (value !== undefined && value !== null && value !== "") {
      rows.push({
        _key: `row_${key}`,
        _uid: `${key}_${Date.now()}_${Math.random()}`,
        cells: [
          { _key: `c1_${key}`, _uid: `c1_${key}_${Math.random()}`, content: label },
          { _key: `c2_${key}`, _uid: `c2_${key}_${Math.random()}`, content: value },
        ],
      });
    }
  };

  addRow("ein", "EIN", selectedPlan?.EIN ?? result?.EIN);
  addRow("pn", "Plan Number", selectedPlan?.PN ?? result?.PN);
  addRow("plan", "Plan Name", result?.Plan);
  addRow("sponsor", "Sponsor", result?.sponsor);

  if (result?.standard_msg_only || result?.standard_and_special_msg) {
    addRow("headcount_reduction", "Headcount Reduction", result?.headcount_reduction);
    addRow("percent_reduction", "Percent Reduction", result?.percent_reduction);
    addRow("settlement_cost", "Reduction in Liabilities", formatCurrency(result?.settlement_cost));
    addRow("settlement_percent_of_assets", "% of Plan Assets", result?.settlement_percent_of_assets);
    addRow("annual_savings", "Expected Annual Savings", formatCurrency(result?.annual_savings));
  }

  if (result?.special_msg_only || result?.standard_and_special_msg) {
    addRow("estimated_PBGC_funding_percent", "Est. PBGC Funding %", result?.estimated_PBGC_funding_percent_2023);
    addRow("plan_termination_note", "Plan Termination Candidate", "Yes – see details below");
  }

  return { headers, rows };
};

export const CalculatorForm = ({ blok }: CalculatorFormProps) => {
  var [age, setAge] = useState(50);
  var [compensation, setCompensation] = useState(150000);
  var [years, setYears] = useState(5);
  var [year, setYear] = useState("2025");
  const [result, setResult] = useState(0);

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

  const [ein, setEin] = useState("");
  const [planNumber, setPlanNumber] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [foundPlans, setFoundPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [showPlanList, setShowPlanList] = useState(false);
  const [calculationResult, setCalculationResult] = useState<any>(null);
  const [allPlansForSponsor, setAllPlansForSponsor] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const findPlans = () => {
    if (!sponsor.trim()) return;
    const filtered = prtCalcData.filter((plan: any) =>
      plan.sponsor
        .toLowerCase()
        .replace(/\W+/g, " ")
        .includes(sponsor.toLowerCase().replace(/\W+/g, " "))
    );
    setFoundPlans(filtered);
    setShowPlanList(true);
    setSelectedPlan(null);
    setCalculationResult(null);
    setShowResults(false);
  };

  const selectPlan = (plan: any) => {
    setSelectedPlan(plan);
    setEin(plan.EIN?.toString() || "");
    setPlanNumber(plan.PN?.toString() || "");
    setShowPlanList(false);
  };

  const runCalculation = () => {
    if (!ein || !planNumber) return;
    const cleanEin = ein.replace(/\D/g, "");
    const matched = prtCalcData.find(
      (plan: any) => plan.EIN == cleanEin && plan.PN == planNumber
    );
    setCalculationResult(matched || null);
    if (matched) {
      const allForEin = prtCalcData.filter((plan: any) => plan.EIN == cleanEin);
      setAllPlansForSponsor(allForEin);
    } else {
      setAllPlansForSponsor([]);
    }
    setShowResults(true);
  };

  if (blok.variant === "simple") {
    const tableData = calculationResult ? resultToTableRows(calculationResult, selectedPlan) : null;

    return (
      <div {...storyblokEditable(blok)} className="bg-[#EFE9E3] border border-(--stroke-card) rounded-sm max-w-187.5 mx-auto py-(--scale-24) px-(--padding-24-18-18)">
        <div className="mb-4">
          <InputField
            label="EIN"
            value={ein}
            onChange={(e) => {
              setEin(e.target.value);
              setSelectedPlan(null);
            }}
            placeholder="Enter EIN"
          />
        </div>

        <div className="mb-4">
          <InputField
            label="PLAN NUMBER"
            value={planNumber}
            onChange={(e) => {
              setPlanNumber(e.target.value);
              setSelectedPlan(null);
            }}
            placeholder="Enter plan number"
          />
        </div>

        <p className="text-mono-sm font-medium tracking-wide mb-4">
          OR FIND PLANS BY SPONSOR
        </p>

        <div className="mb-8">
          <label className="text-rich-image-caption text-(--text-body-dark)">
            Sponsor Name
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
            <button
              onClick={findPlans}
              className="text-xs w-[84px] h-8 px-2 rounded-xs bg-(--surface-search-button) text-white"
            >
              Find Plan
            </button>
          </div>
        </div>

        {showPlanList && (
          <div className="mb-6">
            {foundPlans.length === 0 ? (
              <div className="text-red-600 text-sm">
                The Sponsor you are looking for does not have a DB Plan with any anticipated savings.
              </div>
            ) : (
              <div>
                <div className="font-medium text-sm mb-2">
                  Found {foundPlans.length} Plans for this Sponsor:
                </div>
                <div className="overflow-x-auto border border-(--stroke-primary) rounded-sm">
                  <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Ein</th>
                        <th className="px-3 py-2 text-left font-medium">Plan Number</th>
                        <th className="px-3 py-2 text-left font-medium">Sponsor</th>
                        <th className="px-3 py-2 text-left font-medium">Plan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {foundPlans.map((plan, idx) => (
                        <tr
                          key={idx}
                          onClick={() => selectPlan(plan)}
                          className={`cursor-pointer border-t border-(--stroke-primary) ${
                            selectedPlan?.EIN === plan.EIN && selectedPlan?.PN === plan.PN
                              ? "bg-orange-100"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-3 py-2">{plan.EIN}</td>
                          <td className="px-3 py-2">{plan.PN}</td>
                          <td className="px-3 py-2">{plan.sponsor}</td>
                          <td className="px-3 py-2">{plan.plan}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={runCalculation}
          className="bg-orange-600 text-white px-6 py-3 rounded-md"
        >
          Calculate
        </button>

        {showResults && (
          <div className="mt-8">
            {!calculationResult ? (
              <div className="text-red-600 text-center">No Plan Found.</div>
            ) : (
              <>
                {tableData && <RTCTable blok={{ headers: tableData.headers, rows: tableData.rows }} />}

             

                {allPlansForSponsor.length > 1 && (
                  <div className="mt-6 border-t pt-4">
                    <div className="font-bold mb-2">All details for this sponsor:</div>
                    <div className="space-y-2">
                      {allPlansForSponsor.map((plan, idx) => (
                        <div
                          key={idx}
                          className={`p-2 rounded ${
                            plan.EIN == calculationResult.EIN && plan.PN == calculationResult.PN
                              ? "bg-orange-100"
                              : "bg-gray-50"
                          }`}
                        >
                          <div>Plan: {plan.Plan}</div>
                          <div>Plan Number: {plan.PN}</div>
                          <div>
                            Projected annual savings up to{" "}
                            <span className="font-bold">{formatCurrency(plan.annual_savings)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
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
              left: `${((compensation - 10000) / 380000) * 100}%`,
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
              left: `${((years - 1) / 10) * 100}%`,
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
      `}</style>
    </div>
  );
};