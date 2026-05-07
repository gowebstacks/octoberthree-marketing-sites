"use client";
import { useState } from "react";
import { Checkbox, Icon, Button } from "../../atoms";

export interface DrawerAccordion {
  id: string;
  title: string;
  options: string[];
}

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  accordions: DrawerAccordion[];
  onApply: (selected: Record<string, string[]>) => void;
  onReset?: () => void;
  className?: string;
}

export function Drawer({
  isOpen,
  onClose,
  accordions,
  onApply,
  onReset,
  className = "",
}: DrawerProps) {
  const [openAccordion, setOpenAccordion] = useState<string | null>(
    accordions[0]?.id || null
  );
  const [selected, setSelected] = useState<Record<string, Set<string>>>({});

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const toggleOption = (accordionId: string, option: string) => {
    setSelected((prev) => {
      const newSet = new Set(prev[accordionId] || []);
      newSet.has(option) ? newSet.delete(option) : newSet.add(option);
      return { ...prev, [accordionId]: newSet };
    });
  };

  const handleApply = () => {
    const result: Record<string, string[]> = {};
    Object.entries(selected).forEach(([key, value]) => {
      result[key] = Array.from(value);
    });
    onApply(result);
  };

  const handleReset = () => {
    setSelected({});
    onReset?.();
  };

  const hasSelection = Object.values(selected).some((set) => set.size > 0);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-10 rounded-t-3xl bg-(--surface-background) border border-(--stroke-primary) top-0 h-full w-full bg-surface flex flex-col ${className}`}
    >
      <div className="flex-1 md:px-[64px] px-4 py-6 overflow-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 bg-(--surface-secondary-button) rounded py-(--padding-8-6-6) px-(--padding-16-8-8)">
            <Icon strokeWidth={3} icon="filter-lines" className="md:h-6 md:w-6 h-3.75 w-3.75" />
            <h2 className="text-(length:--text-jumper-text-class-text-sm) font-normal text-(text-secondary-button)">
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            className="hover:cursor-pointer rounded-full"
          >
            <Icon icon="x" className="w-6 h-6" color="var(--icon-primary)" strokeWidth={1.5} />
          </button>
        </div>

        {accordions.map((item, idx) => {
          const isOpen = openAccordion === item.id;
          const selectedCount = selected[item.id]?.size || 0;

          return (
            <div
              key={item.id}
              className={`bg-surface-card ${idx !== 0 && "border-t border-t-(--stroke-card)"}`}
            >
              <button
                onClick={() => toggleAccordion(item.id)}
                className="w-full py-4 flex items-center justify-between hover:bg-surface-hover"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium text-(length:--text-jumper-text-class-text-sm) text-(text-heading)">
                    {item.title}
                  </span>
                  {selectedCount > 0 && (
                    <span className="text-(--icon-button) h-6 w-6 grid place-items-center bg-(--surface-button) text-(length:--text-jumper-text-class-text-2xs) rounded-full">
                      {selectedCount}
                    </span>
                  )}
                </div>
                <Icon
                  icon={isOpen ? "chevron-up" : "chevron-down"}
                  className="w-5 h-5"
                  color="var(--icon-primary)"
                />
              </button>

              {isOpen && (
                <div className="flex flex-col gap-2 mb-4 max-h-125 overflow-y-auto">
                  {item.options.map((option) => (
                    <Checkbox
                      key={option}
                      label={option}
                      checked={selected[item.id]?.has(option) || false}
                      onChange={() => toggleOption(item.id, option)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="md:px-[64px] px-4 py-6 flex items-center gap-3">
        <Button
          tone="secondary"
          mode="filled"
          onClick={handleReset}
          className="flex-1"
          disabled={!hasSelection}
        >
          Reset
        </Button>

        <Button
          tone="primary"
          onClick={handleApply}
          disabled={!hasSelection}
          className="flex-1"
          iconColor="var(--icon-primary)"
        >
          Done
        </Button>
      </div>
    </div>
  );
}
