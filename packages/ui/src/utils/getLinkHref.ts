export const getLinkHref = (link: any) => {
  if (!link) return "#";

  if (link.linkType === "external" && link.externalUrl || link.linktype === 'url' && link.url) {
    return link.externalUrl || link.url;
  }

  if (link.linkType === "internal" && link.internalLink?.cached_url || link.linktype === 'story' && link.cached_url) {
    const slug =
      link.internalLink?.cached_url ||
      link.cached_url
    return `/${slug }`;
  }

  return "#";
};