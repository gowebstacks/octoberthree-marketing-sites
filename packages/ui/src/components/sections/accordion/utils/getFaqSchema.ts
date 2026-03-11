import { AccordionItem } from "../../../organisms/accordion/accordion";


export const getFaqSchema = (accordionItems: AccordionItem[], schemaName?: string | null) => {
  const Accordion = accordionItems.map(item => ({
    '@type': 'Question',
    name: item?.label || '',
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.body ,
    },
  }));

  return {
    name: schemaName || 'Frequently Asked Questions',
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: Accordion,
  };
};
