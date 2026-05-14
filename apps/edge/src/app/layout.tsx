import type { Metadata } from "next";
import "@repo/ui/styles.css";
import "./globals.css";
import { getGlobalLayoutData, StoryblokBridge } from "@repo/storyblok";
import { FooterNavigation, HeaderNavigation } from "@repo/ui";
import Script from "next/script";
import { Lato } from "next/font/google";
import { GoogleTagManager } from "@next/third-parties/google";

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "O3 Edge",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { header, footer } = await getGlobalLayoutData(
    "edge/globals/header-navigation",
    "edge/globals/edge-footer"
  );
  return (
    <html lang="en">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID!} />
      <body className={`${lato.className}`}>
        {/* Clym cookie */}
        <Script
          src="https://widget.clym-sdk.net/blocking.js"
          strategy="lazyOnload"
        />
        <Script id="clym-script" strategy="lazyOnload">
          {`
            (function(d,s,i,w,o){
              var js,cjs=d.getElementsByTagName(s)[0];
              if(d.getElementById(i))return;
              js=d.createElement('script');
              js.id=i;
              js.src='https://widget.clym-sdk.net/clym.js';
              js.onload=function(){Clym&&Clym.load(i,w,o);};
              cjs.parentNode.insertBefore(js, cjs);
            }(document,'script','clym-privacy','908324a4ad61452bad3e379ckciyaa2r',{}));
          `}
        </Script>

        <StoryblokBridge>
          <HeaderNavigation headerNavigation={header} />
          <main className="grow">{children}</main>
          <FooterNavigation footerNavigation={footer} />
        </StoryblokBridge>
      </body>
    </html>
  );
}
