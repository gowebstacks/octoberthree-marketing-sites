"use client";

import React, { type FC } from "react";
import { twMerge } from "tailwind-merge";
import { generateSlug } from "../../../utils/slugs";
import { StoryblokComponent, storyblokEditable } from "@storyblok/react";
import { getLinkHref } from "../../../utils/getLinkHref";

export interface RichTextProps {
  doc?: any;
  className?: string;
  enableToc?: boolean;
  blok?: any;
}

export const RichText: FC<RichTextProps> = ({
  doc,
  className,
  enableToc,
  blok,
}) => {
  if (!doc?.content) return null;

  const renderText = (node: any, index: number): React.ReactNode => {
    let element: React.ReactNode = node.text;

    if (node.marks) {
      node.marks.forEach((mark: any) => {
        if (mark.type === "link") {
          console.log("this i slink", mark.attrs);
          const {
            href = "#",
            anchor,
            target = "_self",
            custom = {},
          } = mark.attrs || {};
          const resolvedHref =
            mark.attrs?.linktype === "email"
              ? `mailto:${href}`
              : getLinkHref(href);

          const finalHref = `${resolvedHref}${anchor ? `#${anchor}` : ""}`;

          element = (
            <a
              href={finalHref}
              target={target}
              rel={
                custom.rel ||
                (target === "_blank" ? "noopener noreferrer" : undefined)
              }
              className="text-link underline text-(--text-link-active)"
              {...custom}
            >
              {element}
            </a>
          );
        }

        if (mark.type === "bold") {
          element = <strong>{element}</strong>;
        }

        if (mark.type === "italic") {
          element = <em>{element}</em>;
        }

        if (mark.type === "underline") {
          element = <u>{element}</u>;
        }
        if (mark.type === "subscript") {
          element = <sub>{element}</sub>;
        }

        if (mark.type === "superscript") {
          element = <sup>{element}</sup>;
        }
      });
    }

    return <React.Fragment key={index}>{element}</React.Fragment>;
  };

  const renderInline = (content: any[]) =>
    content?.map((child: any, i: number) => {
      if (child.type === "text") return renderText(child, i);
      if (child.type === "hard_break") {
        return <br key={`br-${i} `} />;
      }
      return null;
    });

  const renderNode = (node: any, index: number): React.ReactNode => {
    if (node.type === "blok") {
      return (
        <div key={`blok-${index}`} className="mt-6 not-last:mb-6">
          {node.attrs?.body?.map((blok: any) => (
            <StoryblokComponent blok={blok} key={blok._uid} />
          ))}
        </div>
      );
    }

    if (node.type === "paragraph") {
      const alignment =
        node.attrs?.textAlign === "center"
          ? "text-center"
          : node.attrs?.textAlign === "right"
            ? "text-right"
            : node.attrs?.textAlign === "left"
              ? "text-left"
              : "";
      return (
        <p key={`paragraph-${index}`} className={alignment}>
          {renderInline(node.content)}
        </p>
      );
    }

    if (node.type === "heading") {
      const level = Number(node.attrs?.level || 2);
      const text =
        node.content?.map((child: any) => child.text || "").join("") || "";
      const slug = `toc-${generateSlug(text)}`;

      const headingClasses: Record<number, string> = {
        1: "text-(--text-headings) text-display-4xl",
        2: "text-(--text-headings) text-display-3xl",
        3: "text-(--text-headings) text-display-2xl",
        4: "text-(--text-headings) text-display-xl",
        5: "text-(--text-headings) text-display-xl",
        6: "text-(--text-headings) text-display-xl",
      };

      const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;

      return React.createElement(
        Tag,
        {
          key: `heading-${index}`,
          id: enableToc && level === 2 ? slug : undefined,
          className: headingClasses[level],
        },
        renderInline(node.content)
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

    if (node.type === "blockquote") {
      return (
        <blockquote
          key={`blockquote-${index}`}
          style={{ backgroundColor: "#efe9e3" }}
          className="rounded-sm p-8 [&_p]:mb-0"
        >
          <p className="text-(--text-headings-dark) text-rich-blockquote leading-relaxed">
            “
            {node.content?.flatMap((child: any) =>
              child.content?.map((c: any, i: number) =>
                c.type === "text" ? renderText(c, i) : renderNode(c, i)
              )
            )}
            ”
          </p>
        </blockquote>
      );
    }

    return null;
  };

  return (
    <div
      {...(blok ? storyblokEditable(blok) : {})}
      className={twMerge(
        `
        text-(--text-body-dark)!
        text-rich-body
        [&_p:not(:last-child)]:mb-6
        [&_p:has(sub,sup)]:mb-2!
        [&_h1]:mb-3 [&_h2]:mb-3 [&_h3]:mb-3 [&_h4]:mb-3
        [&_ul]:mb-4 [&_ol]:mb-6
        [&_li]:mb-4
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
                [&>div]:flex [&>div]:flex-col [&>div]:gap-6

        `,
        className
      )}
    >
      {doc.content.map((node: any, index: number) => renderNode(node, index))}
    </div>
  );
};
