import { RichText, RichTextProps } from "./richText";

export const RichTextContent = ({ content }: { content: RichTextProps }) => {
  if (!content) return null;

  return (
    <div className="max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
   <div className="max-w-200">
      <RichText {...content} />
    </div>
    </div>
 
  );
};