export const storyblokLoader = ({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) => {
  if (!src.includes('a.storyblok.com')) {
    return src
  }

  return `${src}/m/${width}x0/filters:quality(${quality || 75})`
}