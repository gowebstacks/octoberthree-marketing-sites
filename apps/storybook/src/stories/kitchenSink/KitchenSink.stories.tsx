import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as BackgroundGradientStories from "../utilities/Background.stories";
import * as BlurStories from "../utilities/Blurs.stories";
import * as FocusRingStories from "../utilities/FocusRing.stories";
import * as ShadowStories from "../utilities/Shadows.stories";
import * as PatternStories from "../utilities/SquarePatterns.stories";
import * as AttributionStories from "../molecules/Attribution.stories";
import * as DropdownStories from "../molecules/Dropdown.stories";
import * as AccordionItemStories from "../organisms/Accordion.stories";
import * as BlogPaginationStories from "../molecules/pagination/blog-pagination/BlogPagination.stories";
import * as ResourceBentoCardStories from "../organisms/cards/ResourceBentoCard.stories";
import * as IconTextCardStories from "../molecules/cards/IconTextCard.stories";
import * as ImageTextCardStories from "../molecules/cards/ImageTextCard.stories";
import * as ContentBlockStories from "../organisms/ContentBlock.stories";
import * as SearchFiltersStories from "../organisms/SearchFilter.stories";
import * as VideoStories from "../modules/Video.stories";
import * as ImageStories from "../modules/Image.stories";
import * as CTABarStories from "../modules/CtaBar.stories";
import * as TestimonialStories from "../modules/Testimonial.stories";
import * as NestedCardsStories from "../modules/NestedCards.stories";

import {
  AccordionItem,
  Attribution,
  Avatar,
  Badge,
  Blanket,
  BlogPagination,
  Breadcrumbs,
  Button,
  Checkbox,
  ContentBlock,
  CTABar,
  Drawer,
  Dropdown,
  Eyebrow,
  IconTextCard,
  ImageTextCard,
  ImageWithDesc,
  InputField,
  Lists,
  NestedCards,
  Radio,
  ResourceBentoCard,
  ResourceCard,
  SearchFilters,
  Switch,
  TestimonialItem,
  Toast,
  Tooltip,
  Video,
} from "@repo/ui";
import { useState } from "react";

const meta: Meta = {
  title: "Kitchen Sink",
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj;

const PreviewBox = ({
  children,
  height = 320,
  className = "",
}: {
  children: React.ReactNode;
  height?: number;
  className?: string;
}) => (
  <div
    className={`relative overflow-hidden rounded-xl border border-gray-200 ${className}`}
    style={{ height }}
  >
    {children}
  </div>
);

const StoryBlock = ({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
}) => (
  <div id={id} className="space-y-3">
    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
      {label}
    </p>
    {children}
  </div>
);

export const Default: Story = {
  render: function Render() {
    const [openMenu, setOpenMenu] = useState(false);
    const [theme, setTheme] = useState<"o3" | "rlc">("o3");

    const jumpTo = (id: string) => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      setOpenMenu(false);
    };

    return (
      <div
        key={theme}
        className={`mx-auto max-w-7xl space-y-10 p-6 ${
          theme === "rlc" ? "rlc" : "o3"
        }`}
      >
        <div className="sticky top-4 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white/90 p-4 shadow-sm backdrop-blur">
          <div className="relative">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200 hover:text-black"
            >
              Jump to : Sections
            </button>

            {openMenu && (
              <div className="absolute left-0 top-12 min-w-[240px] rounded-xl border border-gray-200 bg-white shadow-lg">
                {[
                  ["utilities", "Utilities"],
                  ["atoms", "Atoms"],
                  ["molecules", "Molecules"],
                  ["organisms", "Organisms"],
                  ["modules", "Modules"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => jumpTo(id)}
                    className="block w-full px-4 py-3 text-left text-sm hover:bg-gray-50 hover:cursor-pointer text-black"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setTheme("o3")}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                theme === "o3"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              O3
            </button>

            <button
              onClick={() => setTheme("rlc")}
              className={`rounded-full px-3 py-2 text-sm font-medium ${
                theme === "rlc"
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              RLC
            </button>
          </div>
        </div>

        <section
          id="utilities"
          className="space-y-10 rounded-2xl border border-gray-200 p-6"
          style={{ background: "var(--surface-secondary-background)" }}
        >
          <h2 className="text-lg font-semibold text-black">Utilities</h2>

          <div className="flex gap-8">
            <div className="flex-2">
              <StoryBlock id="background" label="Background Gradient">
                <PreviewBox height={6600}>
                  {BackgroundGradientStories.Default.render?.(
                    BackgroundGradientStories.Default.args ?? {},
                    {} as any
                  )}
                </PreviewBox>
              </StoryBlock>
            </div>

            <div className="flex-1 flex flex-col gap-8">
              <StoryBlock id="blurs" label="Blurs">
                <PreviewBox height={720}>
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "url(https://picsum.photos/1200/600)",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                  <div className="relative z-10 flex h-full items-center justify-center">
                    {BlurStories.AllBlurs.render?.(
                      BlurStories.AllBlurs.args ?? {},
                      {} as any
                    )}
                  </div>
                </PreviewBox>
              </StoryBlock>
              <StoryBlock id="focus" label="Focus Rings">
                <div className="flex flex-col gap-4">
                  {FocusRingStories.PrimaryFocus.render?.(
                    FocusRingStories.PrimaryFocus.args ?? {},
                    {} as any
                  )}
                  {FocusRingStories.ErrorFocus.render?.(
                    FocusRingStories.ErrorFocus.args ?? {},
                    {} as any
                  )}
                </div>
              </StoryBlock>

              <StoryBlock id="grid-patterns" label="Grid Patterns">
                <div className="flex flex-col gap-8">
                  <PreviewBox height={220} className="bg-black">
                    {PatternStories.WhitePattern.render?.(
                      PatternStories.WhitePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.YellowPattern.render?.(
                      PatternStories.YellowPattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.CyanPattern.render?.(
                      PatternStories.CyanPattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.OrangePattern.render?.(
                      PatternStories.OrangePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.BluePattern.render?.(
                      PatternStories.BluePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220} className="bg-black">
                    {PatternStories.TriangleWhitePattern.render?.(
                      PatternStories.TriangleWhitePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.TriangleYellowPattern.render?.(
                      PatternStories.TriangleYellowPattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.TriangleCyanPattern.render?.(
                      PatternStories.TriangleCyanPattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.TriangleOrangePattern.render?.(
                      PatternStories.TriangleOrangePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>

                  <PreviewBox height={220}>
                    {PatternStories.TriangleBluePattern.render?.(
                      PatternStories.TriangleBluePattern.args ?? {},
                      {} as any
                    )}
                  </PreviewBox>
                </div>
              </StoryBlock>
            </div>
          </div>

          <StoryBlock id="shadows" label="Shadows">
            {ShadowStories.AllShadows.render?.(
              ShadowStories.AllShadows.args ?? {},
              {} as any
            )}
          </StoryBlock>

          {/* <StoryBlock id="grid-patterns" label="Grid Patterns">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              <PreviewBox height={220} className="bg-black">
                {PatternStories.WhitePattern.render?.(
                  PatternStories.WhitePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.YellowPattern.render?.(
                  PatternStories.YellowPattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.CyanPattern.render?.(
                  PatternStories.CyanPattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.OrangePattern.render?.(
                  PatternStories.OrangePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.BluePattern.render?.(
                  PatternStories.BluePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220} className="bg-black">
                {PatternStories.TriangleWhitePattern.render?.(
                  PatternStories.TriangleWhitePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.TriangleYellowPattern.render?.(
                  PatternStories.TriangleYellowPattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.TriangleCyanPattern.render?.(
                  PatternStories.TriangleCyanPattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.TriangleOrangePattern.render?.(
                  PatternStories.TriangleOrangePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>

              <PreviewBox height={220}>
                {PatternStories.TriangleBluePattern.render?.(
                  PatternStories.TriangleBluePattern.args ?? {},
                  {} as any
                )}
              </PreviewBox>
            </div>
          </StoryBlock> */}
        </section>

        <section
          id="atoms"
          className="space-y-10 rounded-2xl border border-gray-200 p-6"
          style={{ background: "var(--surface-secondary-background)" }}
        >
          <h2 className="text-lg font-semibold text-black">Atoms</h2>

          <StoryBlock id="avatar" label="Avatar">
            <div className="flex flex-wrap items-center gap-6">
              <Avatar
                src="https://img.freepik.com/free-photo/romantic-girl-wears-hat-white-t-shirt-smiling-nature-adorable-fair-haired-woman-enjoying-walk-park_197531-10452.jpg?semt=ais_wordcount_boost&w=740&q=80"
                alt="Savanah Leonardo"
              />
            </div>
          </StoryBlock>
          <StoryBlock id="eyebrow" label="Eyebrow">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Default", props: { eyebrow: "Section label" } },
                { name: "As h6", props: { eyebrow: "Overview", as: "h6" } },
                { name: "As span", props: { eyebrow: "Metadata", as: "span" } },
                { name: "As div", props: { eyebrow: "Category", as: "div" } },
              ].map(({ name, props }) => (
                <div key={name} className="space-y-2">
                  <p className="text-xs text-gray-500">{name}</p>
                  <Eyebrow {...props} />
                </div>
              ))}
            </div>
          </StoryBlock>

          <StoryBlock id="badge" label="Badge">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["navy", "Navy"],
                ["cyan", "Cyan"],
                ["yellow", "Yellow"],
                ["teal", "Teal"],
                ["orange", "Orange"],
              ].map(([variant, name]) => (
                <div key={variant} className="space-y-2">
                  <p className="text-xs text-gray-500">{name}</p>
                  <Badge label="CMO" variant={variant as any} />
                </div>
              ))}
            </div>
          </StoryBlock>
          <StoryBlock id="radio" label="Radio">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Dot Default", props: { type: "dot" } },
                { name: "Dot Checked", props: { type: "dot", checked: true } },
                {
                  name: "Dot Disabled",
                  props: { type: "dot", disabled: true },
                },
                {
                  name: "Dot Disabled Checked",
                  props: { type: "dot", disabled: true, checked: true },
                },
                { name: "Check Default", props: { type: "check" } },
                {
                  name: "Check Checked",
                  props: { type: "check", checked: true },
                },
                {
                  name: "Check Disabled",
                  props: { type: "check", disabled: true },
                },
                {
                  name: "Check Disabled Checked",
                  props: { type: "check", disabled: true, checked: true },
                },
              ].map(({ name, props }) => (
                <div key={name} className="space-y-2">
                  <p className="text-xs text-gray-500">{name}</p>
                  <Radio label="Remember me" {...(props as any)} />
                </div>
              ))}
            </div>
          </StoryBlock>
          <StoryBlock id="switch" label="Switch">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { name: "Default", props: {} },
                { name: "Checked", props: { checked: true } },
                { name: "Disabled", props: { disabled: true } },
                {
                  name: "Disabled Checked",
                  props: { checked: true, disabled: true },
                },
              ].map(({ name, props }) => (
                <div key={name} className="space-y-2">
                  <p className="text-xs text-gray-500">{name}</p>
                  <Switch {...props} />
                </div>
              ))}
            </div>
          </StoryBlock>

          <StoryBlock id="checkbox" label="Checkbox">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Default", props: {} },
                { label: "Checked", props: { checked: true } },
                { label: "Disabled", props: { disabled: true } },
                {
                  label: "Disabled Checked",
                  props: { disabled: true, checked: true },
                },
                { label: "Error", props: { error: true } },
                {
                  label: "Error Checked",
                  props: { error: true, checked: true },
                },
                { label: "Indeterminate", props: { indeterminate: true } },
              ].map(({ label, props }) => (
                <div key={label} className="space-y-2">
                  <p className="text-xs text-gray-500">{label}</p>
                  <Checkbox label="Remember me" {...props} />
                </div>
              ))}
            </div>
          </StoryBlock>
          <StoryBlock id="buttons-filled" label="Buttons · Filled">
            <div className="flex flex-wrap gap-4">
              <Button mode="filled" tone="primary" label="Primary Filled" />
              <Button mode="filled" tone="secondary" label="Secondary Filled" />
              <Button
                mode="filled"
                tone="primary"
                label="Primary Disabled"
                disabled
              />
              <Button
                mode="filled"
                tone="secondary"
                label="Secondary Disabled"
                disabled
              />
            </div>
          </StoryBlock>

          <StoryBlock id="buttons-icons" label="Buttons · Icons">
            <div className="flex flex-wrap gap-4">
              <Button
                mode="filled"
                tone="primary"
                label="Leading Icon"
                leadingIcon="check"
              />
              <Button
                mode="filled"
                tone="primary"
                label="Trailing Icon"
                trailingIcon="arrow-right"
              />
            </div>
          </StoryBlock>

          <StoryBlock id="buttons-link" label="Buttons · Link">
            <div className="flex flex-wrap gap-4">
              <Button mode="link" tone="primary" label="Link Button" />
              <Button
                mode="link"
                tone="primary"
                label="Trailing Icon"
                trailingIcon="arrow-right"
              />
            </div>
          </StoryBlock>

          <StoryBlock id="buttons-fullwidth" label="Buttons · Full Width">
            <div>
              <Button
                mode="filled"
                tone="primary"
                label="Full Width Button"
                fullWidth
              />
            </div>
          </StoryBlock>

          <StoryBlock id="buttons-dark" label="Buttons · Dark Background">
            <PreviewBox
              height={180}
              className="flex items-center justify-center bg-black gap-4"
            >
              <Button
                mode="nav"
                tone="primary"
                label="Nav Button"
                background="dark"
              />
              <Button
                mode="link"
                tone="primary"
                label="Link Dark"
                background="dark"
              />
            </PreviewBox>
          </StoryBlock>
          <StoryBlock id="lists" label="Lists">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Bullet List</p>
                <Lists
                  as="ul"
                  items={[
                    "Fast setup",
                    "Accessible by default",
                    "Design-token driven",
                  ]}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Numbered List</p>
                <Lists
                  as="ol"
                  items={["Install dependencies", "Configure tokens", "Deploy"]}
                />
              </div>
            </div>
          </StoryBlock>

          <StoryBlock id="blanket" label="Blanket">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Default Overlay</p>
              <PreviewBox height={260} className="">
                <Blanket></Blanket>
              </PreviewBox>
            </div>
          </StoryBlock>
        </section>

        <section
          id="molecules"
          className="space-y-10 rounded-2xl border border-gray-200 p-6"
          style={{ background: "var(--surface-secondary-background)" }}
        >
          <h2 className="text-lg font-semibold text-black">Molecules</h2>

          <StoryBlock id="attribution" label="Attribution">
            <div className="flex flex-wrap gap-6">
              {AttributionStories.Default.render?.(
                AttributionStories.Default.args ?? {},
                {} as any
              ) ?? <Attribution {...AttributionStories.Default.args} />}
            </div>
          </StoryBlock>
          <StoryBlock id="tooltip" label="Tooltip">
            <div className="flex flex-wrap gap-6">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Default</p>
                <Tooltip
                  label="This is a tooltip"
                  supportingText="Tooltips are used to describe or identify an element."
                >
                  <button className="rounded-md border px-3 py-1 text-sm">
                    Hover me
                  </button>
                </Tooltip>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Right Side</p>
                <Tooltip label="Appears on the right" side="right">
                  <button className="rounded-md border px-3 py-1 text-sm">
                    Hover me
                  </button>
                </Tooltip>
              </div>
            </div>
          </StoryBlock>
          <StoryBlock id="toast" label="Toast">
            <div className="rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-600">
                Toast uses fixed positioning and is better reviewed in its
                dedicated story.
              </p>
              <a
                href="/?path=/story/molecules-toast--default"
                target="_blank"
                className="mt-2 inline-block text-sm font-medium text-blue-600"
              >
                Open Toast Story
              </a>
            </div>
          </StoryBlock>
          <StoryBlock id="breadcrumbs" label="Breadcrumbs">
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Default</p>
                <Breadcrumbs
                  breadcrumbItems={[
                    { label: "Library", link: "/library" },
                    { label: "Data", link: "/library/data" },
                  ]}
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Back Variant</p>
                <Breadcrumbs
                  variant="back"
                  breadcrumbItems={[
                    { label: "Settings", link: "/settings" },
                    { label: "Security", link: "/settings/security" },
                  ]}
                />
              </div>
            </div>
          </StoryBlock>
          <StoryBlock id="input-field" label="Input Field">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Placeholder</p>
                <InputField
                  label="EMAIL"
                  placeholder="placeholder@placeholder.com"
                  hint="This is a hint text to help user."
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Filled</p>
                <InputField
                  label="EMAIL"
                  value="placeholder@placeholder.com"
                  hint="This is a hint text to help user."
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Error</p>
                <InputField
                  label="EMAIL"
                  placeholder="placeholder@placeholder.com"
                  error="This is a hint text to help user."
                />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Textarea</p>
                <InputField
                  label="DESCRIPTION"
                  placeholder="Enter description"
                  variant="textarea"
                  rows={4}
                  hint="Max 500 characters"
                />
              </div>
            </div>
          </StoryBlock>
          <StoryBlock id="dropdown" label="Dropdown">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Single Select</p>
                <Dropdown {...(DropdownStories.SingleSelect.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Disabled</p>
                <Dropdown {...(DropdownStories.Disabled.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Error</p>
                <Dropdown {...(DropdownStories.ErrorPlaceholder.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Multi Select</p>
                <Dropdown
                  {...(DropdownStories.MultiSelect.args as any)}
                  value={["blog", "news"]}
                />
              </div>
            </div>
            <StoryBlock id="blog-pagination" label="Blog Pagination">
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Default</p>
                  <BlogPagination
                    {...(BlogPaginationStories.Default.args as any)}
                    onPageChange={() => {}}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">First Page</p>
                  <BlogPagination
                    {...(BlogPaginationStories.FirstPage.args as any)}
                    onPageChange={() => {}}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Last Page</p>
                  <BlogPagination
                    {...(BlogPaginationStories.LastPage.args as any)}
                    onPageChange={() => {}}
                  />
                </div>
              </div>
            </StoryBlock>
          </StoryBlock>

          <StoryBlock id="drawer" label="Drawer">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4 space-y-2">
                <p className="text-xs text-gray-500">Default</p>
                <p className="text-sm text-gray-600">
                  Drawer is an overlay component and is best reviewed in its
                  dedicated story.
                </p>
                <a
                  href="/?path=/story/molecules-drawer--default"
                  target="_blank"
                  className="inline-block text-sm font-medium text-blue-600"
                >
                  Open Default Story
                </a>
              </div>
            </div>
          </StoryBlock>
        </section>

        <section
          id="organisms"
          className="space-y-10 rounded-2xl border border-gray-200 p-6"
          style={{ background: "var(--surface-secondary-background)" }}
        >
          <h2 className="text-lg font-semibold text-black">Organisms</h2>

          <StoryBlock id="accordion" label="Accordion Item">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Default</p>

              <AccordionItem {...(AccordionItemStories.Default.args as any)} />
            </div>
          </StoryBlock>
          <StoryBlock id="resource-bento-card" label="Resource Bento Card">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Small</p>
                <ResourceBentoCard
                  {...(ResourceBentoCardStories.Small.args as any)}
                />
              </div>

              <div className="flex gap-8">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Medium</p>
                  <ResourceBentoCard
                    {...(ResourceBentoCardStories.Medium.args as any)}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Large</p>
                  <ResourceBentoCard
                    {...(ResourceBentoCardStories.Large.args as any)}
                  />
                </div>
              </div>
            </div>
          </StoryBlock>

          <StoryBlock id="icon-text-card" label="Icon Text Card">
            <div className="space-y-8 flex gap-4">
              <div className="space-y-2 flex-1">
                <p className="text-xs text-gray-500">Icon & Heading Only</p>
                <IconTextCard
                  {...(IconTextCardStories.WithIconOnly.args as any)}
                />
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs text-gray-500">With Body</p>
                <IconTextCard {...(IconTextCardStories.WithBody.args as any)} />
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs text-gray-500">With Button</p>
                <IconTextCard
                  {...(IconTextCardStories.WithButton.args as any)}
                />
              </div>
            </div>
          </StoryBlock>

          <StoryBlock id="image-text-card" label="Image Text Card">
            <div className="space-y-8 flex gap-8">
              <div className="space-y-2 flex-2">
                <p className="text-xs text-gray-500">Default</p>
                <ImageTextCard
                  {...(ImageTextCardStories.WithoutLink.args as any)}
                />
              </div>

              <div className="space-y-2 flex-1">
                <p className="text-xs text-gray-500">Collapsed</p>
                <ImageTextCard
                  {...(ImageTextCardStories.Collapsed.args as any)}
                />
              </div>
            </div>
          </StoryBlock>

          <StoryBlock id="content-block" label="Content Block">
            <div className="space-y-10">
              <div className="flex gap-8">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Stacked</p>
                  <div className="bg-white px-6 py-10">
                    <ContentBlock
                      {...(ContentBlockStories.Stacked.args as any)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Leading</p>
                  <div className="bg-white px-6 py-10">
                    <ContentBlock
                      {...(ContentBlockStories.Leading.args as any)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Split</p>
                <div className="bg-white px-6 py-10">
                  <ContentBlock {...(ContentBlockStories.Split.args as any)} />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Dark</p>
                <div className="bg-black px-6 py-10">
                  <ContentBlock {...(ContentBlockStories.Dark.args as any)} />
                </div>
              </div>
            </div>
          </StoryBlock>
          <StoryBlock id="search-filters" label="Search Filters">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Default</p>

                <SearchFilters
                  {...(SearchFiltersStories.Default.args as any)}
                  searchValue=""
                  onSearchChange={() => {}}
                  selects={(
                    SearchFiltersStories.Default.args?.selects || []
                  ).map((s: any) => ({
                    ...s,
                    value: "",
                    onChange: () => {},
                  }))}
                />

                <p className="text-xs text-gray-500">
                  State is not managed here. View full interaction in{" "}
                  <a
                    href="/?path=/story/organisms-searchfilters--default"
                    target="_blank"
                    className="text-blue-600 underline"
                  >
                    SearchFilters story
                  </a>
                  .
                </p>
              </div>
            </div>
          </StoryBlock>
        </section>

        <section
          id="modules"
          className="space-y-10 rounded-2xl border border-gray-200 p-6"
          style={{ background: "var(--surface-secondary-background)" }}
        >
          <h2 className="text-lg font-semibold text-black">Modules</h2>
          <StoryBlock id="video" label="Video">
            <div className="space-y-10 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">YouTube</p>
                <Video {...(VideoStories.YouTube.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Wistia</p>
                <Video {...(VideoStories.Wistia.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">Self Hosted</p>
                <Video {...(VideoStories.SelfHosted.args as any)} />
              </div>

              <div className="space-y-2">
                <p className="text-xs text-gray-500">AutoPlay</p>
                <Video {...(VideoStories.AutoPlayYouTube.args as any)} />
              </div>
            </div>
          </StoryBlock>
          <div className="flex gap-8">
            <div className="flex-2">
              <StoryBlock id="image-with-description" label="Image">
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">Default</p>

                  <ImageWithDesc {...(ImageStories.Default.args as any)} />
                </div>
              </StoryBlock>
            </div>

            <div className="flex flex-1 flex-col gap-8">
              <StoryBlock id="cta-bar" label="CTA Bar">
                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Basic</p>
                    <CTABar {...(CTABarStories.Basic.args as any)} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Subscribe</p>
                    <CTABar {...(CTABarStories.Subscribe.args as any)} />
                  </div>
                </div>
              </StoryBlock>
            </div>
          </div>
          <StoryBlock id="testimonial" label="Testimonial">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-xs text-gray-500">Card</p>
                <TestimonialItem {...(TestimonialStories.Card.args as any)} />
              </div>
            </div>
          </StoryBlock>

          <StoryBlock id="nested-cards" label="Nested Cards">
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Default</p>

              <NestedCards {...(NestedCardsStories.Default.args as any)} />
            </div>
          </StoryBlock>
        </section>
      </div>
    );
  },
};
