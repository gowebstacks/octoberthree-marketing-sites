"use client";

import { useEffect, useId, useRef } from "react";
import Script from "next/script";

// TS support
declare global {
  interface Window {
    hbspt?: any;
  }
}

function HubspotForm() {
  const id = useId();
  const targetId = `hubspot-form-${id}`;
  const loaded = useRef(false);

  const createForm = () => {
    if (window.hbspt && !loaded.current) {
      window.hbspt.forms.create({
        portalId: "245668740",
        formId: "b7f9859b-eb32-4479-bd92-91ae962050bb",
        region: "na1", // legacy usually na1
        target: `#${targetId}`,
      });
      loaded.current = true;
    }
  };

  useEffect(() => {
    createForm();
  }, []);

  return (
    <>
      <Script
        src="https://js.hsforms.net/forms/v2.js"
        strategy="afterInteractive"
        onLoad={createForm}
      />
      <div id={targetId} />
    </>
  );
}

export default function Page() {
  return (
    <div className="min-h-screen  flex items-center justify-center p-10">
      <div className="w-full max-w-xl">
        <h1 className="text-white text-3xl mb-6">Request a Demo</h1>
        <HubspotForm />
        
      </div>
    </div>
  );
}