"use client";

import { useId, useRef } from "react";
import Script from "next/script";
import { twMerge } from "tailwind-merge";

declare global {
  interface Window {
    hbspt?: any;
  }
}

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

  const createForm = () => {
    if (!window.hbspt || loaded.current) return;

    const container = document.getElementById(targetId);
    if (container) {
      container.innerHTML = ""; 
    }

    window.hbspt.forms.create({
      portalId,
      formId,
      target: `#${targetId}`,

      onFormReady: () => {
        onReady?.();
      },
    });

    loaded.current = true;
  };

  return (
    <div className={
        twMerge(
            className,
            
        )
    }>
      <Script
        src="https://js.hsforms.net/forms/v2.js"
        strategy="afterInteractive"
        onLoad={createForm}
      />
      <div id={targetId} />
    </div>
  );
}