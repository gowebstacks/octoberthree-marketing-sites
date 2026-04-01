"use client";
import {
  Section,
  ImageBlock,
  isListingDocument,
  StatisticsPanel,
  HeadingBlock,
  IconCardDeck,
  ImageCardDeck,
  Switchback,
  AwardsBlade,
  Accordion,
  Hero,
  ContentBlock,
  TestimonialSlider,
  TestimonialSliderBlok,
  ConversionPanel,
  ConversionPanelProps,
  ResourceCardDeck,
  FormBlock,
  LeadershipCardDeck,
  MetricsBlock,
  ResourceCarousel,
  ResourceBentoCard,
  ResourceBentoCardDeck,
  VideoBlock,
  PortableText,
  RTCTable,
  RTCTableProps,
  AuthorCard,
  AuthorCardProps,
  CalculatorForm,
} from "@repo/ui";
import type { SbBlokData } from "@storyblok/react/rsc";
import type { FC } from "react";
import { useOptimistic } from "react";
import { HeadingBlockSectionProps } from "../../../ui/dist/components/sections/headingBlock/headingBlock";

interface componentGeneratorProps {
  sections?: SbBlokData[] | null;
  documentId: string;
  documentType: string;
  rels?: any; // Storyblok resolved relations
}

export const getComponent = (component: SbBlokData, rels?: any) => {
  switch (component.component) {
    case "sectionLayout":
      // For sectionLayout, render its nested content directly
      // The Section wrapper is handled by the ComponentGenerator loop
      if (component.section && Array.isArray(component.section)) {
        return (
          <div key={component._uid}>
            {component.section.map((nestedComponent: SbBlokData) =>
              getComponent(nestedComponent, rels)
            )}
          </div>
        );
      }
      return null;

    case "headingBlock":
      return (
        <HeadingBlock
          key={component._uid}
          {...(component as HeadingBlockSectionProps)}
        />
      );
    case "formBlock":
      return <FormBlock key={component._uid} {...component} />;
    case "hero":
      return <Hero key={component._uid} blok={component} />;
    case "testimonialSlider":
      return (
        <TestimonialSlider
          key={component._uid}
          blok={component as TestimonialSliderBlok}
          rels={rels}
        />
      );
    case "conversionPanel":
      return (
        <ConversionPanel
          key={component._uid}
          blok={component as ConversionPanelProps}
        />
      );

    case "switchback":
      return <Switchback key={component._uid} blok={component} />;
    case "resourceCardDeck":
      return (
        <ResourceCardDeck key={component._uid} {...component} rels={rels} />
      );

    case "iconCardDeck":
      return (
        <IconCardDeck
          key={component._uid}
          {...component}
          component="iconCardDeck"
        />
      );

    case "imageCardDeck":
      return (
        <ImageCardDeck
          key={component._uid}
          {...component}
          component="imageCardDeck"
          rels={rels}
        />
      );
    case "leadershipCardDeck":
      console.log(component, "rels in leadership card deck");
      return (
        <LeadershipCardDeck
          key={component._uid}
          {...component}
          component="leadershipCardDeck"
          rels={rels}
        />
      );
    case "metricsBlock":
      return (
        <MetricsBlock
          key={component._uid}
          {...component}
          component="metricsBlock"
          rels={rels}
        />
      );
    case "resourceCarousel":
      return (
        <ResourceCarousel
          key={component._uid}
          {...component}
          component="resourceCarousel"
          rels={rels}
        />
      );
    case "resourceBentoCardDeck":
      return (
        <ResourceBentoCardDeck
          key={component._uid}
          {...component}
          component="resourceBentoCardDeck"
          rels={rels}
        />
      );

    case "awardsBlade":
      return (
        <AwardsBlade
          key={component._uid}
          {...component}
          component="awardsBlade"
        />
      );

    case "accordion":
      return (
        <Accordion key={component._uid} {...component} component="accordion" />
      );

    case "imageBlock":
      return (
        <ImageBlock
          key={component._uid}
          {...component}
          component="imageBlock"
        />
      );
    case "videoBlock":
      return <VideoBlock key={component._uid} blok={component} />;

    case "statisticsPanel":
      return (
        <StatisticsPanel
          key={component._uid}
          {...component}
          component="statisticsPanel"
        />
      );
    case "portableText":
      return <PortableText key={component._uid} blok={component as any} />;
    case "table":
      return (
        <RTCTable key={component._uid} {...(component as RTCTableProps)} />
      );

    case "calculatorForm":
      return <CalculatorForm key={component._uid} blok={component} />;

    // Add more Storyblok components as you refactor them
    default:
      console.warn(
        `Storyblok component not yet refactored: ${component.component}`
      );
      return (
        <div
          key={component._uid}
          className="p-6 border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg"
        >
          <p className="text-gray-700 font-semibold mb-2">
            Component: {component.component}
          </p>
          <p className="text-gray-500 text-sm">
            This component needs to be refactored for Storyblok
          </p>
          <details className="mt-2">
            <summary className="text-xs text-gray-400 cursor-pointer">
              View data
            </summary>
            <pre className="text-xs text-gray-600 mt-2 overflow-auto">
              {JSON.stringify(component, null, 2)}
            </pre>
          </details>
        </div>
      );
  }
};

// Helper function to get section props based on section type
const getSectionProps = (section: SbBlokData) => {
  const baseProps = {
    theme: (section.theme as any) || "light",
    responsivePadding: (section.responsivePadding as any) || {
      default: {
        top: parseInt(String(section.paddingTopDefault || "48")),
        bottom: parseInt(String(section.paddingBottomDefault || "48")),
      },
      sm: {
        top: parseInt(String(section.paddingTopSm || "48")),
        bottom: parseInt(String(section.paddingBottomSm || "48")),
      },
      md: {
        top: parseInt(String(section.paddingTopMd || "64")),
        bottom: parseInt(String(section.paddingBottomMd || "64")),
      },
      lg: {
        top: parseInt(String(section.paddingTopLg || "80")),
        bottom: parseInt(String(section.paddingBottomLg || "80")),
      },
      xl: {
        top: parseInt(String(section.paddingTopXl || "96")),
        bottom: parseInt(String(section.paddingBottomXl || "96")),
      },
      xxl: {
        top: parseInt(String(section.paddingTopXxl || "96")),
        bottom: parseInt(String(section.paddingBottomXxl || "96")),
      },
    },
    backgroundImage: section.backgroundImage as any,
    minHeight: section.minHeight as any,
  };

  // Handle sections with background gradients
  if (section.bgGradient && section.bgGradient !== "none") {
    return {
      ...baseProps,
      bgGradient: section.bgGradient as any,
      // Only use inverse gradient for textRevealBlock
      inverseGradient: section.component === "textRevealBlock",
    };
  }

  return baseProps;
};

export const ComponentGenerator: FC<componentGeneratorProps> = ({
  sections,
  documentId,
  documentType,
  rels,
}) => {
  // Keep sections responsive to reorders via Presentation tool
  const [optimisticSections] = useOptimistic<SbBlokData[] | undefined, any>(
    sections ?? undefined,
    (current, action) => {
      if (!action || action.id !== documentId) return current;
      if (action.document?.sections)
        return action.document.sections as SbBlokData[];
      return current;
    }
  );

  // Check if this is a listing document - sections are never first on listing pages
  const skipFirstSectionSpacing = isListingDocument(documentType);

  return (
    <div>
      {(optimisticSections ?? []).map((section, index, arr) => {
        const sectionProps = getSectionProps(section);

        const prevSection = index > 0 ? arr[index - 1] : null;
        const nextSection = index < arr.length - 1 ? arr[index + 1] : null;

        return (
          <Section
            key={section._uid}
            {...sectionProps}
            isFirstSection={!skipFirstSectionSpacing && index === 0}
            sectionType={
              Array.isArray(section.section) && section.section.length > 0
                ? (section.section[0] as SbBlokData).component
                : section.component
            }
            prevTheme={prevSection?.theme as any}
            nextTheme={nextSection?.theme as any}
            id={section.htmlId as string}
          >
            {getComponent(section, rels)}
          </Section>
        );
      })}
    </div>
  );
};
