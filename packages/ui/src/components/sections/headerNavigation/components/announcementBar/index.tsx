import { FC } from "react";
import { Button, Icon, Link } from "../../../../atoms";
import { getLinkHref } from "../../../../../utils/getLinkHref";
import { RichText } from "../../../../molecules/richText/richText";
import { RichTextContent } from "../../../../../types/storyblok";
import { isRichTextEmpty } from "../../../../../utils/checkRichText";

export interface AnnouncementProps {
  announcement?: RichTextContent;
  announcementLink?: any;
}

export const AnnouncementBar: FC<AnnouncementProps> = ({
  announcement,
  announcementLink,
}) => {
  if (isRichTextEmpty(announcement)) return null

  return (
    <div className="w-full bg-(--surface-accent-background) text-(--text-headings) border-b border-(--stroke-primary)">
      <div className="flex justify-between items-center px-8 py-2   max-w-360  mx-auto">
       <div className="flex gap-2 text-sm flex-col lg:flex-row">
         <Icon icon="announcement-02" size={16} />
          <RichText doc={announcement}/>

        {announcementLink && (
          <Link
            href={getLinkHref(announcementLink)}
            className="cursor-pointer"
          >
          
              <div className="flex items-center gap-(--scale-8) lg:ml-6">
                <p>Learn more</p>
                <Icon icon="arrow-right" size={16} />
              </div>
          
          </Link>
        )}
       </div>
       <div className="gap-6 sm:flex hidden">
        <Icon size={20} icon="globe-03"/>
        <Icon size={20} icon="search-md"/>
       </div>
      </div>
    </div>
  );
};
