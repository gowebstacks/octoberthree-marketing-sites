"use client";

import {
  StoryblokComponent,
  storyblokEditable,
  useStoryblokState,
} from "@storyblok/react";
import { StoryblokProvider } from "../providers/storyblok-provider";
import { ComponentGenerator } from "../utils";

interface StoryblokBridgeProps {
  children?: React.ReactNode;
  story?: any;
}

export function StoryblokBridge({ children, story }: StoryblokBridgeProps) {
  return (
    <StoryblokProvider>
      {story ? <VisualEditorContent story={story} /> : children}
    </StoryblokProvider>
  );
}

function VisualEditorContent({ story }: { story: any }) {
  // Enable live updates while editing in the Visual Editor
  const liveStory = useStoryblokState(story);
  const s = (liveStory as any) || story;
  const content = s?.content || {};
  const sections = content.sections || [];
  const rels = s?.rels || story?.rels;
  return (
    <div {...storyblokEditable(content)}>
      {Array.isArray(sections) && sections.length > 0 ? (
        <ComponentGenerator
          sections={sections}
          documentId={String(s?.id ?? "")}
          documentType={content.component}
          rels={rels}
          tags={content.tags}
          topics={content.topics}
        />
      ) : (
        <StoryblokComponent blok={content} />
      )}
    </div>
  );
}
