import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Form } from "../../organisms/form";
import { ContentBlock, ContentBlockBlok } from "../../organisms";
import { twMerge } from "tailwind-merge";

interface FormBlockProps extends SbBlokData {
  content?: ContentBlockBlok[];
  pattern?: "square";
}

export const FormBlock: FC<FormBlockProps> = ({
  content,
  pattern = 'square',
  ...blok
}) => {
  return (
    <div
      {...storyblokEditable(blok)}
      className={
        twMerge(
          "max-w-360 relative mx-auto flex flex-col-reverse lg:flex-row-reverse gap-(--gaps-48-40-40)  rounded-md ",
          content?.length && "bg-(--surface-accent-background) section-padding-md",
        )
      }
    >
      {content?.length ? (
        <div className={twMerge(
          pattern === "square" ? "order-2 lg:order-1" : "",
          'flex-1'
        )}>
          {content[0] && (
            <ContentBlock blok={{ ...content[0], mode: "dark" }} />
          )}{" "}
        </div>
      ) : null}


      {pattern === "square" && (
        <div className="pattern-grid pattern-white opacity-20"></div>
      )}
      <div>
        <Form />
      </div>
    </div>
  );
};

// import type { FC } from "react";
// import { storyblokEditable, SbBlokData } from "@storyblok/react";
// import { Form } from "../../organisms/form";
// import { ContentBlock, ContentBlockBlok } from "../../organisms";

// interface FormBlockProps extends SbBlokData {
//   content?: ContentBlockBlok[];
// }

// export const FormBlock: FC<FormBlockProps> = ({ ...blok }) => {
//   console.log(blok, "form block here")
//   return (
//     <div
//       {...storyblokEditable(blok)}
//       className="max-w-360 w-full mx-auto flex flex-col  gap-(--gaps-48-40-40)  rounded-md "
//     >
//       {blok.content?.length ? (
//         <div>{blok.content[0] && <ContentBlock blok={blok.content[0]} />}</div>
//       ) : null}
//       <div>
//         <Form />
//       </div>
//     </div>
//   );
// };
