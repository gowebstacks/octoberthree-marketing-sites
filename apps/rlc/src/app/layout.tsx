import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@repo/ui/styles.css";
import "./globals.css";
import {
  getGlobalLayoutData,
  StoryblokBridge,
} from "@repo/storyblok";
import { FooterNavigation, HeaderNavigation } from "@repo/ui";

import { Lato } from 'next/font/google'

const lato = Lato({
  subsets: ['latin'],
  weight: ['100','300','400','700','900'],
})


export const metadata: Metadata = {
  title: "Retirement Learning Center",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { header, footer } = await getGlobalLayoutData("rlc/globals/header-navigation", "rlc/globals/rlc-footer");
  return (
    <html lang="en">
      <body className={`${lato.className}`}>
   
        <StoryblokBridge>
          <HeaderNavigation headerNavigation={header} />
          <main className="grow">{children}</main>
          <FooterNavigation footerNavigation={footer} />
        </StoryblokBridge>
      </body>
    </html>
  );
}
