import { Node } from 'tiptap';
import { toggleBlockType } from 'tiptap-commands';
import { languages } from '../languagesList';

export default class CodeBlock extends Node {
  get name() {
    return 'code_block';
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
      content: 'text*',
      marks: '',
      group: 'block',
      code: true,
      defining: true,
      draggable: false,
      parseDOM: [
        {
          tag: 'pre[data-code-language]',
          getAttrs: dom => ({
            language: dom.getAttribute('data-code-language')
          }),
          preserveWhitespace: 'full'
        }
      ],
      toDOM: node => [
        'pre',
        {
          'data-code-language': node.attrs.language
        },
        ['code', 0]
      ]
    };
  }

  commands({ type, schema }) {
    return attrs => toggleBlockType(type, schema.nodes.paragraph, attrs);
  }
}
