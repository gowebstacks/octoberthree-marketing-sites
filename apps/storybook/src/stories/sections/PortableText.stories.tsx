import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PortableText } from '@repo/ui'

const meta: Meta<typeof PortableText> = {
  title: 'Sections/PortableText',
  component: PortableText,
  tags:['autodocs']
};

export default meta;

type Story = StoryObj<typeof PortableText>;

// export const Default: Story = {
//   args: {
//     body: {
//       type: 'doc',
//       content: [
//         {
//           type: 'heading',
//           attrs: {
//             level: 2,
//           },
//           content: [
//             {
//               type: 'text',
//               text: 'Portable Text Heading',
//             },
//           ],
//         },
//         {
//           type: 'paragraph',
//           content: [
//             {
//               type: 'text',
//               text: 'This is a sample paragraph rendered from Storyblok rich text.',
//             },
//           ],
//         },
//         {
//       type: 'blok',
//       attrs: {
//         id: 'd3c02ed5-97ab-4db6-8b76-6106c8c05581',
//         body: [
//           {
//             _uid: 'i-a6a9ac14-eeee-45a9-bf9b-5d4764944971',
//             component: 'ctaBar',
//             buttons: [
//               {
//                 _uid: '8ee0a64e-9e61-443a-935c-ace29edca01a',
//                 label: 'test button',
//                 component: 'button',
//                 linkType: 'internal',
//                 openInNewTab: false,
//                 url: {
//                   id: 'dd22a1c6-3f20-4f8a-af7e-a7eb646b2bfd',
//                   url: '',
//                   linktype: 'story',
//                   fieldtype: 'multilink',
//                   cached_url: 'octoberthree-main/test',
//                 },
//               },
//             ],
//           },
//         ],
//       },
//     },
//         {
//           type: 'bullet_list',
//           content: [
//             {
//               type: 'list_item',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [
//                     {
//                       type: 'text',
//                       text: 'First item',
//                     },
//                   ],
//                 },
//               ],
//             },
//             {
//               type: 'list_item',
//               content: [
//                 {
//                   type: 'paragraph',
//                   content: [
//                     {
//                       type: 'text',
//                       text: 'Second item',
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   },
// };