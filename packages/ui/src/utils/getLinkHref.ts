export const getLinkHref = (link: any) => {
  if (!link) return "#";

  if (link.linkType === "external" && link.externalUrl) {
    return link.externalUrl;
  }

  if (link.linkType === "internal" && link.internalLink?.cached_url) {
    return `/${link.internalLink.cached_url}`;
  }

  return "#";
};