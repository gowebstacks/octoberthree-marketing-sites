type SearchParams = { [key: string]: string | string[] | undefined };

export function isStoryblokEditor(searchParams?: SearchParams) {
  const qp = searchParams || {};
  const getParam = (k: string): string | undefined => {
    const v = qp[k];
    return Array.isArray(v) ? v[0] : v;
  };

  const version = (getParam("version") || "").toLowerCase();
  const hasSbKey = Object.keys(qp).some((k) =>
    k.toLowerCase().includes("storyblok")
  );
  const hasPreviewKey = ["_storyblok", "storyblok", "sb", "preview"].some(
    (k) => !!getParam(k)
  );

  return hasSbKey || hasPreviewKey || version === "draft";}
