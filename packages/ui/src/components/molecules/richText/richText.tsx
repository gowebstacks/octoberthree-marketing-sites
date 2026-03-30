"use client";

import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { generateSlug } from "../../../utils/slugs";
import { RichTextContent } from "../../../types/storyblok";
import { StoryblokComponent } from "@storyblok/react";


export interface RichTextProps {
  doc?: any;
  className?: string;
  enableToc?: boolean;
}

export const RichText: FC<RichTextProps> = ({ doc, className, enableToc }) => {
  if (!doc?.content) return null;

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === "blok") {
      return (
        <div key={`blok-${index}`} className="my-4">
          {node.attrs?.body?.map((blok: any) => (
            <StoryblokComponent blok={blok} key={blok._uid} />
          ))}
        </div>
      );
    }
    if (node.type === "paragraph") {
      const text =
        node.content?.map((child: any) => child.text || "").join("") || "";
      return <p key={`paragraph-${index}`}>{text}</p>;
    }

    if (node.type === "heading") {
      const level = Number(node.attrs?.level || 2);
      const text =
        node.content?.map((child: any) => child.text || "").join("") || "";

      const slug = `toc-${generateSlug(text)}`;

      const headingClasses: Record<number, string> = {
        1: "text-display-4xl",
        2: "text-display-3xl",
        3: "text-display-2xl",
        4: "text-display-xl",
        5: "text-display-xl",
        6: "text-display-xl",
      };
      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

      return React.createElement(
        Tag,
        {
          key: `heading-${index}`,
          id: enableToc && level === 2 ? slug : undefined,
          className: headingClasses[level],
        },
        text
      );
    }

    if (node.type === "bullet_list") {
      return (
        <ul key={`ul-${index}`}>
          {node.content?.map((item: any, i: number) => renderNode(item, i))}
        </ul>
      );
    }

    if (node.type === "ordered_list") {
      return (
        <ol key={`ol-${index}`}>
          {node.content?.map((item: any, i: number) => renderNode(item, i))}
        </ol>
      );
    }

    if (node.type === "list_item") {
      return (
        <li key={`li-${index}`}>
          {node.content?.map((child: any, i: number) => renderNode(child, i))}
        </li>
      );
    }

    return null;
  };

  return (
    <div
      className={twMerge(
        `
        text-(--text-body-dark)!
        text-lg
        [&_p:not(:last-child)]:mb-4
        [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-3 [&_h4]:mb-3
        [&_ul]:mb-4 [&_ol]:mb-4
        [&_li]:mb-1.5
        [&_li_p]:mb-0!

        [&_ul]:list-disc
        [&_ul]:pl-5

        [&_ol]:list-decimal
        [&_ol]:pl-5

        [&_ul_ul]:list-circle
        [&_ol_ol]:list-decimal

        [&_strong]:font-semibold
        [&_em]:italic
        [&_u]:underline
        `,
        className
      )}
    >
      {doc.content.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
};
