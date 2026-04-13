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

export interface FormBlockProps extends SbBlokData {
  content?: ContentBlockBlok[];
  pattern?: "square";
  image?: StoryblokAsset;
  hubspotFormId: string;
}

export const FormBlock: FC<FormBlockProps> = ({
  content,
  pattern = "square",
  image,
  hubspotFormId,
  ...blok
}) => {

  return (
    <div
      {...storyblokEditable(blok)}
      className={twMerge(
        "max-w-360 relative mx-auto  flex flex-col lg:flex-row gap-(--gaps-48-40-40)  rounded-md ",
        content?.length && "bg-(--surface-accent-background) section-padding-md"
      )}
    >
      {pattern === "square" && (
        <div className="pattern-grid pattern-white opacity-10"></div>
      )}
     <div className="flex-1">
       {content?.length ? (
        <ContentBlock blok={{ ...content[0], mode: "dark" }} />
      ) : null}
     </div>

      {/* {content?.length ? (
        <div
          className={twMerge(
            pattern === "square" ? "order-2 lg:order-1" : "",
            "flex-1"
          )}
        >
          {content[0] && (
            <ContentBlock blok={{ ...content[0], mode: "dark" }} />
          )}{" "}
        </div>
      ) : null}

       */}

      <div className="flex-1">
        {/* <Form  /> */}
        <HubspotFormComponent
      
          formId={hubspotFormId}
        />
      </div>
    </div>
  );
};
