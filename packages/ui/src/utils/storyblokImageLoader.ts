export const storyblokLoader = ({ src, width, quality }: { src: string; width: number; quality?: number }) => {
  if (!src) return ''
  return `${src}/m/${width}x0/filters:quality(${quality || 75})`
}