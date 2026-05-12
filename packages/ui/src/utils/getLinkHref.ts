const DOMAIN_MAP: any = {
  "octoberthree-main": "https://october3-main-webstacks.vercel.app",
  rlc: "https://rlc-webstacks.vercel.app",
  edge: "https://o3-edge-webstacks.vercel.app",
};

export const getLinkHref = (link: any) => {
  if (!link) return "#";

  if (
    (link.linkType === "external" && link.externalUrl) ||
    (link.linktype === "url" && link.url)
  ) {
    return link.externalUrl || link.url;
  }

  if (
    (link.linkType === "internal" && link.internalLink?.cached_url) ||
    (link.linktype === "story" && (link.cached_url || link.href))
  ) {
    const slug = link.internalLink?.cached_url || link.cached_url || link.href;

    const [site, ...rest] = slug.split("/");
    const base = DOMAIN_MAP[site] || "";
    const cleanSlug = rest.join("/").replace(/^\/+|\/+$/g, "");

    const currentSite = process.env.NEXT_PUBLIC_SITE;
    if (site === currentSite) {
      return `/${cleanSlug}/`;
    }

    return base ? `${base}/${cleanSlug}/` : `/${slug}/`;
  }
  if (typeof link === "string") {
    return link;
  }

  return "#";
};
