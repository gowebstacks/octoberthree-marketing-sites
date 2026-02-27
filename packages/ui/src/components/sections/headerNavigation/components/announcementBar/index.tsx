import { FC } from "react";
import { Button, Icon, Link } from "../../../../atoms";
import { getLinkHref } from "../../../../../utils/getLinkHref";

export interface AnnouncementProps {
  announcement?: string;
  announcementLink?: any;
}

export const AnnouncementBar: FC<AnnouncementProps> = ({
  announcement,
  announcementLink,
}) => {
  if (!announcement) return null;

  return (
    <div className="w-full bg-(--surface-accent-background) text-(--text-headings) border-b border-(--stroke-primary)">
      <div className="flex justify-between items-center px-8 py-2   max-w-(--widths-1440-834-375)  mx-auto">
       <div className="flex gap-2 text-sm flex-col lg:flex-row">
         <Icon icon="announcement-02" size={16} />
         <p>{announcement}</p>


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
