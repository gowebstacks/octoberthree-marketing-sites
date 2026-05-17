import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Form } from "../../organisms/form";
import {
  ContentBlock,
  ContentBlockBlok,
  HubspotFormComponent,
} from "../../organisms";
import { twMerge } from "tailwind-merge";
import { StoryblokAsset } from "../../../lib";
import { InputField } from "../../molecules";
import { Heading, HeadingProps } from "../../atoms/heading";

export interface FormBlockProps extends SbBlokData {
  content?: ContentBlockBlok[];
  pattern?: "square";
  image?: StoryblokAsset;
  hubspotFormId: string;
  heading?: HeadingProps[];
}

export const FormBlock: FC<FormBlockProps> = ({
  content,
  pattern = "square",
  image,
  hubspotFormId,
  heading,
  ...blok
}) => {
  const hubspotformID = ((blok as any).blok?.hubspotFormId.replace(
    /^hsForm_/,
    ""
  ) || hubspotFormId) as string;

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        "max-w-360 w-full relative mx-auto  flex flex-col lg:flex-row gap-(--gaps-48-40-40)  rounded-md ",
        content?.length && "bg-(--surface-accent-background) section-padding-md"
      )}
    >
      {pattern === "square" && (
        <div className="pattern-grid pattern-white opacity-10"></div>
      )}
      {content?.length ? (
        <div className="flex-1">
          <ContentBlock blok={{ ...content[0], mode: "dark" }} />
        </div>
      ) : null}

      <div className="flex-1">
        {/* <Form  /> */}
        <HubspotFormComponent
        heading={heading}
          formId={hubspotformID || "cbd47751-5c13-44c2-8dd1-3290840fe8b8"}
        />
      </div>
    </div>
  );
};
