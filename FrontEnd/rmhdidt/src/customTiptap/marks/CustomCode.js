import { Mark } from 'tiptap';
import { toggleMark } from 'tiptap-commands';
import { languages } from '../languagesList';

export default class Code extends Mark {
  get name() {
    return 'code';
  }

  get defaultOptions() {
    return {
      languages
    };
  }

  get schema() {
    return {
      attrs: {
        language: {
          default: 'none'
        }
      },
      inclusive: false,
      excludes: '_',
      parseDOM: [
        {
          tag: 'code[data-code-language]',
          getAttrs: dom => ({
            language: dom.getAttribute('data-code-language')
          })
        }
      ],
      toDOM: node => [
        'code',
        {
          'data-code-language': node.attrs.language
        },
        0
      ]
    };
  }

  commands({ type }) {
    return attrs => toggleMark(type, attrs);
  }
}
