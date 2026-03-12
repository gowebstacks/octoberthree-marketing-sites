import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Form } from "../../organisms/form";
import { ContentBlock, ContentBlockBlok } from "../../organisms";

interface FormBlockProps extends SbBlokData {
  content?: ContentBlockBlok[];
}

export const FormBlock: FC<FormBlockProps> = ({ content, ...blok }) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className="max-w-(--widths-1440-834-375) mx-auto grid grid-cols-1 lg:grid-cols-2 gap-(--gaps-48-40-40) section-padding-md rounded-md bg-(--surface-secondary-background)"
    >
      <div>{content?.[0] && <ContentBlock blok={content[0]} />}</div>

      <div>
        <Form />
      </div>
    </div>
  );
};
