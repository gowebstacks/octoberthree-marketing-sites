
import { PortableText } from '@repo/ui'
import '@repo/storyblok'

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto py-20">
      <PortableText
        content={{
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: {
                level: 2,
              },
              content: [
                {
                  type: 'text',
                  text: 'Portable Text Heading',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'This is a sample paragraph rendered from Storyblok rich text.',
                },
              ],
            },
            {
              type: 'blok',
              attrs: {
                id: 'd3c02ed5-97ab-4db6-8b76-6106c8c05581',
                body: [
                  {
                    _uid: 'i-a6a9ac14-eeee-45a9-bf9b-5d4764944971',
                    component: 'ctaBar',
                    buttons: [
                      {
                        _uid: '8ee0a64e-9e61-443a-935c-ace29edca01a',
                        label: 'test button',
                        component: 'button',
                        linkType: 'internal',
                        openInNewTab: false,
                        url: {
                          cached_url: 'test',
                        },
                      },
                    ],
                  },
                ],
              },
            },
            {
              type: 'heading',
              attrs: {
                level: 2,
              },
              content: [
                {
                  type: 'text',
                  text: 'Second Heading',
                },
              ],
            },
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: 'Second section content.',
                },
              ],
            },
          ],
        }}
        enableToc
      />
    </div>
  )
}

