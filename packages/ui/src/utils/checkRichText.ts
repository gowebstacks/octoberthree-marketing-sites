import { RichTextContent } from "../types/storyblok"

export function isRichTextEmpty(doc?: RichTextContent): boolean {
  if (!doc || !doc.content || doc.content.length === 0) return true

  return doc.content.every(block =>
    !block.content || block.content.every(node => !node.text?.trim())
  )
}