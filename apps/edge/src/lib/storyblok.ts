'use client'
import { useEffect } from "react";

declare global {
  interface Window {
    storyblok?: any;
  }
}

export default function StoryblokInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = () => {
      if (window.StoryblokBridge) {
        window.storyblok = new window.StoryblokBridge();
      } else {
        console.log("StoryblokBridge not found");
      }
    };

    setTimeout(init, 100);
  }, []);

  return null;
}


