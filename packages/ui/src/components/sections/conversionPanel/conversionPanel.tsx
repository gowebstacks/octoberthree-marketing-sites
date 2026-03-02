import type { FC } from "react";
import { storyblokEditable, SbBlokData } from "@storyblok/react";
import { Heading, Button } from "../../atoms";
import { RichText } from "../../molecules/richText/richText";
import { ButtonProps } from "../../atoms/button";
import { CTABarProps } from "../../modules/ctaBar";

export interface ConversionPanelProps extends SbBlokData {
  heading: string;
  description?: any;
  cta?: CTABarProps[];
}

export const ConversionPanel: FC<ConversionPanelProps> = ({
  heading,
  description,
  cta,
  ...blok 
}) => {
  const slicedcta = cta?.[0].buttons?.slice(0, 2);

  return (
    <section
      {...storyblokEditable(blok)}
      className="w-full bg-(--surface-background) section-padding-xl"
    >
      <div className="w-full mx-auto max-w-7xl rounded-md flex bg-(--surface-secondary-background) flex-col md:items-center text-center section-padding-xl-top-bottom md:px-12 px-4">
        <Heading
          as="h2"
          headingSize="6xl"
          fontFamily="display"
          className="mb-4 font-normal"
          heading={heading}
        ></Heading>

        {description && (
          <div className="max-w-2xl mb-8 text-(--text-body-dark)">
            <RichText doc={description} />
          </div>
        )}

        {slicedcta && slicedcta.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-4">
            {slicedcta.map((button, index) => (
              <Button
                key={button._uid}
                href={button.href}
                target={button.target}
                mode={button.mode || "filled"}
                tone={button.tone ?? (index === 0 ? "primary" : "secondary")}
              >
                {button.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
