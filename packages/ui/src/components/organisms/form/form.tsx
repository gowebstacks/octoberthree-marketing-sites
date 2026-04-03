"use client";

import { useState } from "react";
import { InputField } from "../../molecules";
import { Button, Checkbox, Icon } from "../../atoms";

type FormStatus = "idle" | "loading" | "success";

export function Form() {
  const [status, setStatus] = useState<FormStatus>("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");

    const form = e.currentTarget;
    const data = new FormData(form);

    const values: Record<string, string | string[]> = {};

    data.forEach((value, key) => {
      if (key in values) {
        values[key] = Array.isArray(values[key])
          ? [...values[key], value as string]
          : [values[key] as string, value as string];
      } else {
        values[key] = value as string;
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
  };

 return (
  <>
    {status === "idle" && (
      <div className="z-10 relative bg-(--color-cream-100) rounded-sm p-(--padding-24-18-18) ">
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="YOUR NAME"
            name="yourName"
            required
            placeholder="Enter your name"
          />

          <InputField
            label="YOUR EMAIL"
            name="yourEmail"
            type="email"
            required
            placeholder="Enter your email"
          />

          <InputField
            label="COMPANY EMAIL"
            name="companyEmail"
            type="email"
            required
            placeholder="Enter your company email"
          />

          <InputField
            label="EMAIL"
            name="email"
            type="email"
            placeholder="Enter email"
          />

          <InputField
            label="DESCRIPTION"
            name="description"
            variant="textarea"
            placeholder="Enter description"
            hint="This is a hint text to help user"
          />

          <div className="space-y-3">
            <label className="block text-sm font-medium text-(--text-headings)">
              HOW DID YOU HEAR ABOUT US?
            </label>

            <div className="grid grid-cols-2 gap-4">
              {["Google", "LinkedIn", "Instagram", "X", "Email", "Other"].map(
                (option) => (
                  <Checkbox
                    key={option}
                    name="hearAbout"
                    value={option}
                    label={option}
                  />
                )
              )}
            </div>
          </div>

          <Button type="submit" size="sm" label="Submit" fullWidth />

          <div className="flex gap-2 items-center">
            <Checkbox name="terms" />
            <p className="text-(--text-link) text-mono-xs">
              By submitting, you're opting into marketing & agreeing to our
              Terms of Service and Privacy Policy.
            </p>
          </div>
        </form>
      </div>
    )}

    {status === "loading" && (
      <div className="min-h-105 flex flex-col items-center justify-center gap-3">
        <img
          src="loading.svg"
          alt="Loading"
          className="h-10 w-10 animate-spin [animation-duration:2s]"
        />
        <p className="text-mono-lg text-(--text-headings)">LOADING...</p>
      </div>
    )}

    {status === "success" && (
      <div className="min-h-105 flex flex-col items-center justify-center gap-3 ">
        <Icon
          icon="check-verified-02"
          strokeWidth={0.1}
          className="h-17.5 w-17.5 text-(--icon-success)"
        />
        <p className="text-mono-lg font-medium text-(--text-success)">
          SUBMITTED
        </p>
      </div>
    )}
  </>
);
}