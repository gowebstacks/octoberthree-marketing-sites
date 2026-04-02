"use client";

import { useState, type FC, FormEvent } from "react";
import { storyblokEditable } from "@storyblok/react";
import type { SbBlokData } from "@storyblok/react";
import { Button } from "../../atoms";
import { twMerge } from "tailwind-merge";
import type { ButtonProps } from "../../atoms/button";
import { InputField, Toast } from "../../molecules";

export interface CTABarProps extends SbBlokData {
  buttons?: ButtonProps[];
  className?: string;
  type?: "button" | "subscribe";
  placeholder?: string;
}

const CTABar: FC<CTABarProps> = ({ buttons, className = "", ...blok }) => {
  const actualBlok = (blok as any)?.blok || blok;
  const items = buttons || actualBlok?.buttons;
  const type = actualBlok?.type ?? "button";
  const placeholder = actualBlok?.placeholder ?? "companyemail@company.com";
  const portalId = actualBlok?.portalId;
  const formId = actualBlok?.formId;

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!portalId || !formId) {
  setError("Form configuration missing");
  return;
}
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, portalId, formId }),
      });

      if (!res.ok) throw new Error("Failed");

      setSuccess(true);
      setEmail("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-component="cta-bar"
      {...storyblokEditable(actualBlok)}
      className={twMerge("flex sm:flex-row! flex-col gap-3 mt-6 lg:mt-8 w-fit", className)}
    >
      {type === "subscribe" ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 md:flex-row w-full"
        >
          <div className="flex flex-col gap-2 w-full">
            <InputField
              type="email"
              value={email}
              onChange={(e: any) => {
                setEmail(e.target.value);
                setSuccess(false);
                setError(null);
              }}
              placeholder={placeholder}
              className="rounded h-10 lg:h-12.5"
              required
            />

            {success && (
              <Toast title="Subscribed successfully" actionLabel="Done" position="top-right"/>
            )}
            {error && <Toast title={error} actionLabel="" />}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Subscribe"}
          </Button>
        </form>
      ) : (
        items?.map((item: ButtonProps) => {
          const { _uid, ...buttonProps } = item as any;
          return (
            <Button
              key={_uid || JSON.stringify(buttonProps)}
              {...buttonProps}
            />
          );
        })
      )}
    </div>
  );
};

export default CTABar;
