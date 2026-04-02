"use client";

import type { FC } from "react";
import { Icon } from "../../atoms";
import { ContentBlock } from "../../organisms";
import { SbBlokData, storyblokEditable } from "@storyblok/react";

export interface RTCTableProps extends SbBlokData {
  _type?: string;
  _key?: string;
  headers?: {
    _key: string;
    text?: string;
    alignment?: "left" | "center";
  }[];
  rows?: {
    _key: string;
    cells?: {
      _key: string;
      content?: any;
    }[];
  }[];
};

const renderCell = (content: any) => {
  if (!content) {
    return <div className="h-0.5 w-4 bg-(--text-headings) mx-auto" />;
  }

  if (typeof content === "string") {
    const v = content.trim().toLowerCase();

    if (!v || v === "-" || v === "—") {
      return <div className="h-0.5 w-4 bg-(--text-headings) mx-auto" />;
    }

    if (["yes", "true", "check"].includes(v)) {
      return (
        <Icon
          icon="check-circle-filled"
          size={24}
          className="mx-auto text-(--text-headings)"
        />
      );
    }

   
    if (["no", "false", "indeterminate", "partial"].includes(v)) {
      return (
        <div className="relative w-6 h-6 mx-auto">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-0.5 bg-(--text-headings)" />
        </div>
      );
    }

    return content;
  }


  return <ContentBlock blok={content} />;
};

export const RTCTable: FC<RTCTableProps> = ({ headers, rows  , ...blok}) => {
  if (!headers?.length || !rows?.length) return null;

  return (
    <div {...storyblokEditable(blok)} className="w-full overflow-x-auto border border-(--stroke-primary) rounded-sm max-w-360 mx-auto">
      <table className="w-full border-collapse min-w-160">
        <thead className="bg-(--surface-secondary-background)">
          <tr>
            {headers.map((header) => (
              <th
                key={header._key}
                className={`
                  py-(--gaps-18-16-16)
                  px-(--gaps-16-12-12)
                  text-md
                  font-medium
                  text-(--text-headings)
                  max-w-[256px]
                  min-w-28.5
                  ${header.alignment === "left" ? "text-left" : "text-center"}
                `}
              >
                {header.text}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr
              key={row._key}
              className={`
                border-t border-(--stroke-primary)
                ${rowIndex % 2 === 0 ? "bg-(--surface-table-cell)/60" : ""}
              `}
            >
              {row.cells?.map((cell) => (
                <td
                  key={`cell-${row._key}-${cell._key}`}
                  className="
                    py-(--gaps-18-16-16)
                    px-(--gaps-16-12-12)
                    text-md
                    text-(--text-headings)
                    max-w-[256px]
                    min-w-28.5
                  "
                >
                  {renderCell(cell.content)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};