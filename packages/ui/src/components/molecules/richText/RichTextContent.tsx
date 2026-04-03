import { RichText, RichTextProps } from "./richText";

export const RichTextContent = ({ content }: { content: RichTextProps }) => {
  if (!content) return null;

  return (
    <div className="max-w-360 mx-auto">
      <div className="max-w-200">
        <RichText {...content} />
      </div>
    </div>
  );
};
