import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Form } from "../../organisms/form";
import { ContentBlock, ContentBlockBlok } from "../../organisms";

interface FormBlockBlok extends SbBlokData {
  content?: ContentBlockBlok[];
}

interface FormBlockProps {
  blok: FormBlockBlok;
}

export const FormBlock: FC<FormBlockProps> = ({ blok }) => {
  console.log(blok, "form block here");

  return (
    <div
      {...storyblokEditable(blok)}
      className="max-w-360 w-full mx-auto flex flex-col gap-(--gaps-48-40-40) rounded-md"
    >
      {blok.content?.length ? (
        <div>
          <ContentBlock blok={blok.content[0]} />
        </div>
      ) : null}

      <div>
        <Form />
      </div>
    </div>
  );
};