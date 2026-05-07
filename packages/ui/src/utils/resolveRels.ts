export type StoryblokRel = {
  uuid: string;
  content: any;
};


export const buildRelMap = (rels: StoryblokRel[] = []) => {
  return Object.fromEntries(
    rels.map((rel) => [rel.uuid, rel.content])
  );
};


export const resolveRel = <T = any>(
  value: string | T | undefined,
  relMap: Record<string, any>
): T | null => {
  if (!value) return null;

  if (typeof value === "string") {
    return relMap[value] ?? null;
  }

  return value;
};

