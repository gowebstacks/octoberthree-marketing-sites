import type { FC } from "react";
import { storyblokEditable, type SbBlokData } from "@storyblok/react";

import { RichText } from "../../molecules/richText/richText";
import TableOfContents from "../../organisms/tableOfContents";

export interface PortableTextProps extends SbBlokData {
  component?: "portableText";
  body?: any;
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
    .map((block: any, index: number) => {
      const text = block.content.map((n: any) => n.text || "").join("").trim();

      return {
        key: `toc-${index}`,
        title: text,
      };
    });
};

export const PortableText: FC<{ blok: PortableTextProps }> = ({ blok }) => {
  if (!blok?.body) return null;
    const tocItems = generateTocItems(blok.body);
  const hasToc = tocItems.length > 0;

  return (
    <section {...storyblokEditable(blok)} className="px-4 sm:px-6 lg:px-16">
      <div className="relative flex flex-col lg:flex-row gap-12">
       {
        hasToc &&
         <aside className="lg:w-[320px] shrink-0">
          <div className="sticky top-4">
            <TableOfContents
              article={{ body: blok.body }}
              label="Table of contents"
            />
          </div>
        </aside>
       }

        <div className="flex-1 min-w-0">
          <RichText
            doc={blok.body}
            enableToc
            className="prose prose-lg dark:prose-invert"
          />
        </div>
      </div>
    </section>
  );
};
