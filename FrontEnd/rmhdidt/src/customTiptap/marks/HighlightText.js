import { Mark } from 'tiptap';
import { toggleMark } from 'tiptap-commands';
import { colors } from '../colorsList';

export default class HighlightText extends Mark {
  get name() {
    return 'highlight_text';
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
          default: 'white'
        }
      },
      parseDOM: [
        {
          tag: 'span[data-text-highlight]',
          getAttrs: dom => ({
            color: dom.getAttribute('data-text-highlight')
          })
        }
      ],
      toDOM: node => [
        'span',
        {
          'data-text-highlight': node.attrs.color
        },
        0
      ]
    };
  }

  commands({ type }) {
    return attrs => toggleMark(type, attrs);
  }
}
