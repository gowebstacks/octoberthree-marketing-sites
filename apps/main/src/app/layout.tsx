import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@repo/ui/styles.css";
import "./globals.css";
import { getGlobalLayoutData, getLatestGlobalNavigation, storyblokApi, StoryblokBridge } from "@repo/storyblok";
import { FooterNavigation, HeaderNavigation, Layout } from "@repo/ui";
import Script from "next/script";
import StoryblokInit from "../lib/storyblok";

import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100','300','400','700','900'],
})


export const metadata: Metadata = {
  title: "OctoberThree",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { header, footer } = await getGlobalLayoutData("octoberthree-main/globals/header-navigation","octoberthree-main/globals/o3-footer" );
  return (
    <html lang="en">
      <body className={`${lato.className}`}>
         <Script
          src="https://app.storyblok.com/f/storyblok-v2-latest.js"
          strategy="afterInteractive"
        />
          <StoryblokInit/>

        <StoryblokBridge>
          <HeaderNavigation headerNavigation={header} />
          <main className="grow">{children}</main>
          <FooterNavigation  footerNavigation={footer}/>
        </StoryblokBridge>
      </body>
    </html>
  );
}
