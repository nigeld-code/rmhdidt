import { Mark } from 'tiptap';
import { toggleMark } from 'tiptap-commands';
import { colors } from '../colorsList';

export default class ColorText extends Mark {
  get name() {
    return 'color_text';
  }

  get defaultOptions() {
    return {
      colors
    };
  }

  get schema() {
    return {
      attrs: {
        color: {
          default: 'black'
        }
      },
      parseDOM: [
        {
          tag: 'span[data-text-color]',
          getAttrs: dom => ({
            color: dom.getAttribute('data-text-color')
          })
        }
      ],
      toDOM: node => [
        'span',
        {
          'data-text-color': node.attrs.color
        },
        0
      ]
    };
  }

  commands({ type }) {
    return attrs => toggleMark(type, attrs);
  }
}
