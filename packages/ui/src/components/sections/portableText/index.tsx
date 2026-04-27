'use client'
import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";

import { RichText } from "../../molecules/richText/richText";
import TableOfContents from "../../organisms/tableOfContents";
import { ConversionPanel, ConversionPanelProps } from "../conversionPanel";
import { Subscribe } from "../../modules";
import { twMerge } from "tailwind-merge";
import { usePathname } from "next/navigation";

export interface PortableTextProps extends SbBlokData {
  component?: "portableText";
  body?: any;
  hubspotId?: string;
}


const generateTocItems = (body: any) => {
  const blocks = body?.content || [];
  return blocks
    .filter(
      (block: any) =>
        block.type === "heading" &&
        block.attrs?.level === 2 &&
        block.content?.length
    )
    .map((block: any, index: number) => ({
      key: `toc-${index}`,
      title: block.content
        .map((n: any) => n.text || "")
        .join("")
        .trim(),
    }));
};

const extractAuthorAndForm = (body: any) => {
  if (!body?.content)
    return {
      hasPair: false,
      authorCard: null,
      formBlock: null,
      filteredContent: body,
    };

  let hasAuthorCard = false;
  let hasFormBlock = false;
  let authorCardData = null;
  let formBlockData = null;

  const filteredContent = {
    ...body,
    content: body.content.map((item: any) => {
      if (item.type === "blok" && item.attrs?.body) {
        const filteredBlocks = item.attrs.body.filter((block: any) => {
          if (block.component === "authorCard") {
            hasAuthorCard = true;
            authorCardData = block;
            return false;
          }
          if (block.component === "formBlock") {
            hasFormBlock = true;
            formBlockData = block;
            return false;
          }
          return true;
        });

        if (hasAuthorCard && hasFormBlock) {
          return {
            ...item,
            attrs: { ...item.attrs, body: filteredBlocks },
          };
        }
      }
      return item;
    }),
  };

  return {
    hasPair: hasAuthorCard && hasFormBlock,
    authorCard: authorCardData,
    formBlock: formBlockData,
    filteredContent,
  };
};

const renderSideBySide = (authorCard: any, formBlock: any) => (
  <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex  flex-col lg:flex-row gap-8 justify-between ">
      <div>
        <RichText
          doc={{
            content: [
              {
                type: "blok" as any,
                attrs: { body: [authorCard] },
              },
            ],
          }}
          className="prose prose-lg max-w-none"
        />
      </div>
      <div className="lg:w-94.5">
        <RichText
          doc={{
            content: [
              {
                type: "blok" as any,
                attrs: { body: [formBlock] },
              },
            ],
          }}
          className="prose prose-lg max-w-none"
        />
      </div>
    </div>
  </div>
);

const renderDefault = (blok: any, body: any, hasToc: boolean, showSubscribe?: boolean) => {
  const subscribeBlock = body?.content
    ?.filter((item: any) => item.type === "blok")
    ?.flatMap((item: any) => item.attrs?.body || [])
    ?.find((b: any) => b.component === "subscribe");

  const cleanedBody = {
    ...body,
    content: body.content.map((item: any) => {
      if (item.type === "blok") {
        return {
          ...item,
          attrs: {
            ...item.attrs,
            body: item.attrs.body.filter(
              (b: any) => b.component !== "subscribe"
            ),
          },
        };
      }
      return item;
    }),
  };

  return (
    <div
      {...storyblokEditable(blok)}
      className="px-4 sm:px-6 lg:px-16 max-w-360 mx-auto"
    >
      <div className={
        twMerge(
          'relative flex flex-col lg:flex-row lg:gap-12',
          hasToc ? 'gap-12' :''
        )
      }>
     
          <aside className="lg:w-[320px] shrink-0">
            <div className="sticky top-4 flex flex-col gap-10">
              {
                hasToc && (
                  <TableOfContents article={{ body }} label="Table of contents" />
                )
              }

             {
              showSubscribe &&
               <div className="hidden lg:block">

                <Subscribe
                  {...storyblokEditable(subscribeBlock)}
                  blok={{ ...subscribeBlock, size: "sm", rtc: false }}
                />
              </div>
             }
            </div>
          </aside>
      
        <div className="flex-1 min-w-0">
          <RichText
            doc={body}
            enableToc
            className="prose prose-lg dark:prose-invert"
          />

{
  showSubscribe &&
            <div className="lg:hidden">
            <Subscribe
              {...storyblokEditable(subscribeBlock)}
              blok={{ ...subscribeBlock, size: "md", rtc: false }}
            />
          </div>
}
        </div>
      </div>
    </div>
  );
};

export const PortableText: FC<{ blok: PortableTextProps }> = ({ blok }) => {
  const pathname = usePathname();

const allowedPaths = ["/resources", "/insights", "/articles"];

const showSubscribe = allowedPaths.some((path) =>
  pathname.startsWith(path)
);
  if (!blok?.body) return null;

  const { hasPair, authorCard, formBlock, filteredContent } =
    extractAuthorAndForm(blok.body);
  const hasToc = generateTocItems(blok.body).length > 1;

  if (hasPair && authorCard && formBlock) {
    return (
      <>
        {renderSideBySide(authorCard, formBlock)}
        {renderDefault(blok, filteredContent, hasToc)}
      </>
    );
  }

  return renderDefault(blok, blok.body, hasToc, showSubscribe);
};
