"use client";

import { useId, useRef, useState } from "react";
import Script from "next/script";
import { twMerge } from "tailwind-merge";
import { Icon } from "../../atoms";

declare global {
  interface Window {
    hbspt?: any;
  }
}

type FormStatus = "idle" | "loading" | "submitting" | "success" | "error";

export type HubspotFormProps = {
  portalId?: string;
  formId: string;
  className?: string;
  onReady?: () => void;
};

export function HubspotFormComponent({
  portalId = "4293115",
  formId,
  className,
  onReady,
}: HubspotFormProps) {
  const id = useId();
  const targetId = `hubspot-form-${id}`;
  const loaded = useRef(false);

  const [status, setStatus] = useState<FormStatus>("loading");

  const createForm = () => {
    if (!window.hbspt || loaded.current) return;

    const container = document.getElementById(targetId);
    if (container) container.innerHTML = "";

    window.hbspt.forms.create({
      portalId,
      formId,
      target: `#${targetId}`,

      onFormReady: () => {
        setStatus("idle");
        onReady?.();

        const form = document.querySelector(`#${targetId} form`);
        if (form) {
          form.addEventListener("submit", () => {
            setStatus("submitting");

            setTimeout(() => {
              setStatus((prev) => (prev === "submitting" ? "error" : prev));
            }, 5000);
          });
        }
      },

      onFormSubmitted: () => {
        setStatus("success");

        setTimeout(() => {
          setStatus("idle");
        }, 3000);
      },
    });

    loaded.current = true;
  };

  return (
    <div className={twMerge(className, "hubspot-form relative z-1")}>
      <Script
        src="https://js.hsforms.net/forms/v2.js"
        strategy="afterInteractive"
        onLoad={createForm}
      />

      {formId ? (
        <>
          {status === "loading" && (
            <div className="flex items-center justify-center py-10 text-sm text-(--text-body)">
              Loading form...
            </div>
          )}

          <div
            id={targetId}
            className={twMerge(
              status === "loading" && "hidden",
              status === "submitting" && "pointer-events-none opacity-60"
            )}
          />

          {status === "submitting" && (
            <div className="absolute rounded-sm z-100 inset-0 bg-(--surface-secondary-background)  flex flex-col items-center justify-center gap-3">
              <img
                src="/loading.svg"
                alt="Loading"
                className="h-10 w-10 animate-spin [animation-duration:2s]"
              />
              <p className="text-mono-lg text-(--text-headings) z-100 relative">
                SUBMITTING...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="absolute rounded-sm z-100 inset-0 bg-(--surface-success) flex flex-col items-center justify-center gap-3">
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

          {status === "error" && (
            <div className="mt-2 text-sm text-(--text-error)">
              We couldn’t submit your request. Please check the form and try
              again.
            </div>
          )}
        </>
      ) : (
        "Hubspot Form ID missing"
      )}
    </div>
  );
}
