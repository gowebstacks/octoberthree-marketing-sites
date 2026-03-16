"use client";

import * as Popover from "@radix-ui/react-popover";

export function DropdownSelect({ children }: { children: React.ReactNode }) {
  return (
    <Popover.Portal>
      <Popover.Content
        sideOffset={6}
        align="start"
        className="
          z-50
          w-(--radix-popover-trigger-width)
          max-w-(--radix-popover-trigger-width)
          flex
          flex-col
          gap-1
          border
          py-2.5
          px-3
          shadow-md
          bg-(--surface-card)
          border-(--stroke-secondary)
          max-h-50
          overflow-x-scroll
        "
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
}