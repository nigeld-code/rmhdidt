<template>
  <div id="post-edit">
    <div id="menu-bar" class="flex-row">
      <editor-menu-bar :editor="editor" v-slot="{ commands, isActive }">
        <div class="editor-menu-container flex-row">
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('blockTextType', true)"
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="toggleObj.blockTextType = !toggleObj.blockTextType"
          >
            <button
              :class="{ 'is-active': toggleObj.blockTextType }"
              class="flex-row"
            >
              <span v-if="isActive.paragraph()">Paragraph</span>
              <span v-else-if="isActive.heading({ level: 1 })">Heading 1</span>
              <span v-else-if="isActive.heading({ level: 2 })">Heading 2</span>
              <span v-else-if="isActive.heading({ level: 3 })">Heading 3</span>
              <span v-else>Paragraph</span>
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.blockTextType"
              class="text-editor-dropdown  flex-column"
            >
              <button
                class="dropdown-selection-btn"
                :class="{ 'is-active': isActive.paragraph() }"
                @click="commands.paragraph"
              >
                Paragraph
              </button>
              <button
                class="dropdown-selection-btn"
                :class="{ 'is-active': isActive.heading({ level: 1 }) }"
                @click="commands.heading({ level: 1 })"
              >
                Heading 1
              </button>
              <button
                class="dropdown-selection-btn"
                :class="{ 'is-active': isActive.heading({ level: 2 }) }"
                @click="commands.heading({ level: 2 })"
              >
                Heading 2
              </button>
              <button
                class="dropdown-selection-btn"
                :class="{ 'is-active': isActive.heading({ level: 3 }) }"
                @click="commands.heading({ level: 3 })"
              >
                Heading 3
              </button>
            </div>
          </div>
          <div
            class="dropdown-field"
            @mouseenter="
              toggleTextEditorDropdowns('typographicalEmphasis', true)
            "
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="
              toggleObj.typographicalEmphasis = !toggleObj.typographicalEmphasis
            "
          >
            <button
              :class="{ 'is-active': toggleObj.typographicalEmphasis }"
              class="flex-row"
            >
              <i class="nld-bold post-edit-button"></i>
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.typographicalEmphasis"
              class="text-editor-dropdown flex-column"
            >
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.bold() }"
                @click="commands.bold"
              >
                <i class="nld-bold post-edit-button"></i> Bold
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.underline() }"
                @click="commands.underline"
              >
                <i class="nld-underline post-edit-button"></i> Underline
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.italic() }"
                @click="commands.italic"
              >
                <i class="nld-italic post-edit-button"></i> Italic
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.strike() }"
                @click="commands.strike"
              >
                <i class="nld-strike post-edit-button"></i> Strike
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.subscript() }"
                @click="commands.subscript"
              >
                <i class="nld-subscript post-edit-button"></i> Subscript
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                :class="{ 'is-active': isActive.superscript() }"
                @click="commands.superscript"
              >
                <i class="nld-superscript post-edit-button"></i> Superscript
              </button>
              <button
                class="flex-row dropdown-selection-btn"
                @click="
                  clearTypographicalEmphasis(isActive, commands, [
                    'bold',
                    'underline',
                    'italic',
                    'strike',
                    'subscript',
                    'superscript'
                  ])
                "
              >
                <i class="nld-clear post-edit-button"></i> Clear Formatting
              </button>
            </div>
          </div>
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('textColor', true)"
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="toggleObj.textColor = !toggleObj.textColor"
          >
            <button class="dropdown-top-btn flex-row">
              Text Color
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.textColor"
              class="text-editor-dropdown  flex-column"
            >
              <button
                class="flex-row dropdown-selection-btn"
                v-for="color in colors"
                :key="color"
                @click="
                  editorChangeColor(
                    isActive,
                    commands,
                    'color_text',
                    color,
                    'black'
                  )
                "
              >
                <div
                  :data-text-highlight="color"
                  class="color-selector-icons"
                ></div>
                <div>{{ color }}</div>
              </button>
            </div>
          </div>
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('highlightText', true)"
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="toggleObj.highlightText = !toggleObj.highlightText"
          >
            <button class="dropdown-top-btn flex-row">
              Highlight
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.highlightText"
              class="text-editor-dropdown  flex-column"
            >
              <button
                class="flex-row dropdown-selection-btn"
                v-for="color in colors"
                :key="color"
                @click="
                  editorChangeColor(
                    isActive,
                    commands,
                    'highlight_text',
                    color,
                    'white'
                  )
                "
              >
                <div
                  :data-text-highlight="color"
                  class="color-selector-icons"
                ></div>
                {{ color }}
              </button>
            </div>
          </div>
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('codeInline', true)"
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="toggleObj.codeInline = !toggleObj.codeInline"
          >
            <button class="dropdown-top-btn flex-row">
              Code
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.codeInline"
              class="text-editor-dropdown  flex-column"
            >
              <button
                class="flex-row dropdown-selection-btn"
                v-for="language in languages"
                :key="language"
                @click="editorChangeCode(isActive, commands, 'code', language)"
              >
                {{ language }}
              </button>
            </div>
          </div>
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('codeBlock', true)"
            @mouseleave="toggleTextEditorDropdowns('closeAll', false)"
            @click="toggleObj.codeBlock = !toggleObj.codeBlock"
          >
            <button class="dropdown-top-btn flex-row">
              Code Block
              <i class="nld-drop-down"></i>
            </button>
            <div
              v-if="toggleObj.codeBlock"
              class="text-editor-dropdown flex-column"
            >
              <button
                class="flex-row dropdown-selection-btn"
                v-for="language in languages"
                :key="language"
                @click="
                  editorChangeCode(isActive, commands, 'code_block', language)
                "
              >
                {{ language }}
              </button>
            </div>
          </div>
          <button
            class="flex-row"
            :class="{ 'is-active': links.linkMode }"
            @click="toggleLinkMode()"
          >
            <div>Links</div>
            <i class="nld-link"></i>
          </button>
          <div
            class="dropdown-field"
            @mouseenter="toggleTextEditorDropdowns('newTable', true)"
            @mouseleave="
              () => {
                toggleTextEditorDropdowns('closeAll', false);
                newTableSize();
              }
            "
            @click="toggleObj.newTable = !toggleObj.newTable"
          >
            <button
              class="dropdown-top-btn flex-row"
              :class="{ 'is-active': toggleObj.newTable || isActive.table() }"
            >
              Table
            </button>
            <div
              v-if="!isActive.table() && toggleObj.newTable"
              class="text-editor-dropdown flex-column"
            >
              <div class="table-size-label">
                Size: {{ tableSize.columns }} x {{ tableSize.rows }}
              </div>
              <div class="flex-column table-grid" v-for="row in 6" :key="row">
                <div class="flex-row">
                  <div
                    class="table-grid-cell"
                    :class="{
                      'is-selected':
                        tableSize.columns >= column && tableSize.rows >= row
                    }"
                    v-for="column in 6"
                    :key="column"
                    @click="
                      commands.createTable({
                        rowsCount: row,
                        colsCount: column,
                        withHeaderRow: false
                      })
                    "
                    @mouseenter="newTableSize(column, row)"
                  ></div>
                </div>
              </div>
            </div>
            <div
              v-if="isActive.table()"
              class="text-editor-dropdown table-menu flex-row"
            >
              <div class="flex-column table-menu__column">
                <span class="table-menu__title">Column:</span>
                <div class="flex-row">
                  <button
                    class="table-menu__button"
                    @click="commands.addColumnBefore"
                  >
                    Add before
                  </button>
                  <button
                    class="table-menu__button"
                    @click="commands.addColumnAfter"
                  >
                    Add after
                  </button>
                </div>
                <button
                  class="table-menu__button"
                  @click="commands.deleteColumn"
                >
                  Delete
                </button>
              </div>
              <div class="flex-column  table-menu__column">
                <span class="table-menu__title">Row:</span>
                <div class="flex-row">
                  <button
                    class="table-menu__button"
                    @click="commands.addRowBefore"
                  >
                    Add before
                  </button>
                  <button
                    class="table-menu__button"
                    @click="commands.addRowAfter"
                  >
                    Add after
                  </button>
                </div>
                <button class="table-menu__button" @click="commands.deleteRow">
                  Delete
                </button>
              </div>
              <div class="flex-column">
                <button
                  class="table-menu__button"
                  @click="commands.toggleCellMerge"
                >
                  Toggle Merge
                </button>
                <button
                  class="table-menu__button"
                  @click="commands.deleteTable"
                >
                  Delete Table
                </button>
              </div>
            </div>
          </div>
          <button
            :class="{ 'is-active': isActive.bullet_list() }"
            @click="commands.bullet_list"
          >
            <i class="nld-unordered-list post-edit-button"></i>
          </button>
          <button
            :class="{ 'is-active': isActive.ordered_list() }"
            @click="commands.ordered_list()"
          >
            <i class="nld-ordered-list post-edit-button"></i>
          </button>
          <button @click="commands.horizontal_rule">
            <i class="nld-horizontal-rule post-edit-button"></i>
          </button>
          <button @click="commands.undo">
            <i class="nld-undo post-edit-button"></i>
          </button>
          <button @click="commands.redo">
            <i class="nld-redo post-edit-button"></i>
          </button>
        </div>
      </editor-menu-bar>
      <button id="preview-button" @click="loadAndDisplayPreview">
        Preview
      </button>
    </div>
    <editor-menu-bubble
      v-if="links.linkMode && selectionSize > 0"
      class="menububble"
      :editor="editor"
      @hide="hideLinkMenu()"
      v-slot="{ commands, isActive, getMarkAttrs, menu }"
    >
      <div
        class="menububble"
        :class="
          ({ 'is-active': menu.isActive },
          { hide: menu.left === 0 || menu.bottom === 0 })
        "
        :style="`left: ${menu.left}px; bottom: ${menu.bottom}px;`"
      >
        <form
          class="menububble_form"
          v-if="links.linkMenuIsActive"
          @submit.prevent="setLinkUrl(commands.link, linkUrl)"
        >
          <input
            type="text"
            class="menububble_form__input"
            v-model="links.linkUrl"
            placeholder="https://"
            ref="linkInput"
            @keydown.esc="hideLinkMenu"
          />
          <button
            class="menububble_form__button"
            @click="setLinkUrl(commands.link, links.linkUrl)"
            type="button"
          >
            Submit
          </button>
        </form>
        <div v-else class="menububble__menu flex-row">
          <button
            class="menububble__button flex-row"
            @click="showLinkMenu(getMarkAttrs('link'))"
          >
            <span>{{ isActive.link() ? "Update" : "Add" }}</span>
            <i class="nld-link"></i>
          </button>
          <button
            class="menububble__button flex-row"
            @click="commands.link"
            v-if="isActive.link()"
          >
            <span>Remove</span>
            <i class="nld-link"></i>
          </button>
        </div>
      </div>
    </editor-menu-bubble>
    <editor-content class="editor-input-container" :editor="editor" />
    <div id="preview-edit-post-div" v-if="showPreview">
      <preview-edit-post
        :html-cache="this.htmlForPreview"
        @closePreview="closeAndClearPreview"
      />
    </div>
  </div>
</template>

<script>
  import PreviewEditPost from "./PreviewEditPost.vue";
  import { Editor, EditorContent, EditorMenuBar, EditorMenuBubble } from "tiptap";
  import {
    Blockquote,
    Bold,
    BulletList,
    HardBreak,
    Heading,
    History,
    HorizontalRule,
    Italic,
    Link,
    ListItem,
    OrderedList,
    Table,
    TableHeader,
    TableCell,
    TableRow,
    Strike,
    Underline
  } from "tiptap-extensions";
  import {
    Subscript,
    Superscript,
    CustomCode,
    CustomCodeBlock,
    ColorText,
    HighlightText
  } from "../../customTiptap";
  import { languages } from "../../customTiptap/languagesList";
  import { colors } from "../../customTiptap/colorsList";

  export default {
    components: {
      "editor-menu-bar": EditorMenuBar,
      "editor-content": EditorContent,
      "editor-menu-bubble": EditorMenuBubble,
      "preview-edit-post": PreviewEditPost
    },
    data() {
      return {
        editor: new Editor({
          extensions: [
            new Blockquote(),
            new Bold(),
            new BulletList(),
            new CustomCode({
              languages
            }),
            new CustomCodeBlock({
              languages
            }),
            new HardBreak(),
            new Heading({ levels: [1, 2, 3] }),
            new History(),
            new HorizontalRule(),
            new Italic(),
            new Link(),
            new ListItem(),
            new OrderedList(),
            new Table({
              resizable: false
            }),
            new TableHeader(),
            new TableCell(),
            new TableRow(),
            new Strike(),
            new Underline(),
            new Subscript(),
            new Superscript(),
            new ColorText({ colors }),
            new HighlightText({ colors })
          ],
          content: null,
          onUpdate: ({ getHTML }) => {
            this.$store.dispatch("cacheEditPost", getHTML());
          }
        }),
        showPreview: false,
        htmlForPreview: "Hello",
        colors,
        languages,
        links: {
          linkMode: false,
          linkUrl: null,
          linkMenuIsActive: false
        },
        tableSize: {
          columns: 0,
          rows: 0
        },
        toggleObj: {
          blockTextType: false,
          typographicalEmphasis: false,
          textColor: false,
          highlightText: false,
          codeInline: false,
          codeBlock: false,
          newTable: false
        }
      };
    },
    props: {
      postId: String
    },
    computed: {
      postData() {
        return this.$store.getters.post;
      },
      selectionSize() {
        return this.editor.selection.to - this.editor.selection.from;
      }
    },
    watch: {
      postData() {
        if (this.postData._id.toString() === this.postId) {
          this.editor.setContent(this.postData.content);
        } else {
          this.editor.destroy();
          console.log("Error: Failed to load in Chapter for edit");
        }
      }
    },
    beforeDestroy() {
      this.$store.dispatch("cacheEditPost", null);
      this.editor.destroy();
    },
    methods: {
      loadAndDisplayPreview() {
        this.showPreview = true;
        this.htmlForPreview = this.editor.getHTML();
      },
      closeAndClearPreview() {
        this.showPreview = false;
        this.htmlForPreview = "";
      },
      clearTypographicalEmphasis(isActive, commands, fields = []) {
        fields.forEach(field => {
          if (isActive[field]()) {
            commands[field]();
          }
        });
      },
      editorChangeColor(
        isActive,
        commands,
        colorType,
        color,
        defaultColor = "black"
      ) {
        if (isActive[colorType]() && color !== defaultColor) {
          commands[colorType]();
        }
        commands[colorType]({ color });
      },
      editorChangeCode(isActive, commands, codeType, language) {
        if (isActive[codeType]()) {
          commands[codeType]();
        }
        if (language !== "none") {
          commands[codeType]({ language });
        }
      },
      toggleLinkMode() {
        this.links.linkMode = !this.links.linkMode;
        this.links.linkMenuIsActive = false;
      },
      showLinkMenu(attrs) {
        this.links.linkUrl = attrs.href;
        this.links.linkMenuIsActive = true;
        this.$nextTick(() => {
          this.$refs.linkInput.focus();
        });
      },
      hideLinkMenu() {
        this.links.linkUrl = null;
        this.links.linkMenuIsActive = false;
      },
      setLinkUrl(command, url) {
        command({ href: url });
        this.hideLinkMenu();
      },
      newTableSize(column = 0, row = 0) {
        this.tableSize.columns = column;
        this.tableSize.rows = row;
      },
      toggleTextEditorDropdowns(targetToggle, state) {
        for (let key in this.toggleObj) {
          if (key === targetToggle) {
            this.toggleObj[key] = state;
          } else {
            this.toggleObj[key] = false;
          }
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  $editor-menu-height: 2rem;

  #post-edit {
    @import "../../styles/post-colors";
    position: relative;
    height: 100%;
    background-color: map-get($colors, main);
    color: map-get($colors, default-text);
    overflow: hidden;

    .flex-row {
      display: flex;
      flex-direction: row;
    }

    .flex-column {
      display: flex;
      flex-direction: column;
    }

    .hide {
      opacity: 0;
      height: 0;
      width: 0;
    }

    #menu-bar {
      height: $editor-menu-height;
      border-bottom: 1px solid map-get($colors, default-text);
    }

    .editor-menu-container {
      height: 100%;
      button {
        height: 100%;
        padding: 0.2rem;
        background-color: map-get($colors, main);
        color: map-get($colors, default-text);
        border: none;

        &.is-active,
        &:hover {
          background-color: map-get($colors, grey-text);
        }

        &:focus {
          outline: none;
        }

        .post-edit-button {
          font-size: 1.5rem;
        }
      }

      .dropdown-field {
        position: relative;
        height: 100%;

        .is-active {
          background-color: map-get($colors, grey-text);
        }

        .dropdown-top-btn {
          cursor: pointer;
        }

        .text-editor-dropdown {
          z-index: 10;
          position: absolute;
          top: 100%;
          left: 0;
          padding: 0.1rem;
          background-color: map-get($colors, main);
          border: 1px solid map-get($colors, default-text);
        }

        .dropdown-selection-btn {
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          padding-left: 0.25rem;
        }

        .color-selector-icons {
          height: 1rem;
          width: 1rem;
          margin-right: 0.5rem;
          border: 1px solid map-get($colors, default-text);
        }
      }

      .table-menu {
        .table-menu__column {
          padding: 0.25rem;
          margin: 0.2rem;
          border: 1px dashed map-get($colors, secondary-text);
          white-space: nowrap;
        }

        .table-menu__title {
          font-size: 0.75rem;
          margin-bottom: 0.2rem;
        }

        .table-menu__button {
          margin: 0.1rem;
          border: 1px solid map-get($colors, secondary-text);
          border-radius: 5px;
        }
      }

      .table-size-label {
        padding: 0.1rem 0.25rem;
      }

      .table-grid {
        margin: 0.1rem;

        .table-grid-cell {
          height: 20px;
          width: 20px;
          margin: 0 1px;
          border: 1px solid map-get($colors, deafult-text);
          cursor: pointer;
        }

        .is-selected {
          background-color: map-get($colors, secondary-text);
        }
      }
    }

    .menububble {
      position: absolute;
      z-index: 20;

      .menububble__menu {
        white-space: nowrap;
      }

      .menububble__button {
        margin: 0.2rem 0.1rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid map-get($colors, secondary-text);
        border-radius: 5px;
        background-color: map-get($colors, main);
        color: map-get($colors, default-text);
        font-family: "Sansita";
        cursor: pointer;
      }

      .menububble_form {
        padding: 0 0.25rem;
        background-color: map-get($colors, main);
        color: map-get($colors, default-text);
        border: 1px solid map-get($colors, secondary-text);
        border-radius: 5px;

        .menububble_form__input {
          margin: 0 0.25rem;
          padding: 0.1rem 0;
          height: 1.75rem;
          background-color: transparent;
          border: none;
          outline: none;
        }

        .menububble_form__button {
          margin: 0.2rem 0.1rem;
          padding: 0.25rem 0.5rem;
          border: none;
          background-color: map-get($colors, main);
          color: map-get($colors, secondary-text);
          font-family: "Sansita";
          font-size: 1rem;
          text-decoration: underline;
          cursor: pointer;
        }
      }
    }

    .editor-input-container {
      position: absolute;
      top: $editor-menu-height;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.5rem 2rem;
      overflow-x: hidden;
      overflow-y: scroll;

      .ProseMirror {
        *::selection {
          color: map-get($colors, secondary);
          background-color: map-get($colors, secondary-text);
        }
      }

      .ProseMirror-focused {
        outline: none;
      }

      a,
      a:visited,
      a:active {
        position: relative;
        color: map-get($colors, secondary-text);

        &::after {
          content: "\e904";
          font-family: "rmhdidt";
          font-style: normal;
          font-weight: normal;
          font-variant: normal;
          text-transform: none;
          line-height: 1;
          font-size: 0.8rem;
        }
      }

      hr {
        width: 85%;
        border: 3px solid map-get($colors, secondary-text);
        border-radius: 5px;
      }

      table {
        border-collapse: collapse;
        border: 1px solid map-get($colors, default-text);
      }

      th,
      td {
        border: 1px solid map-get($colors, default-text);
        padding: 0.25rem 0.5rem;
        vertical-align: top;
        text-align: left;
      }

      pre[data-code-language] {
        position: relative;
        background-color: #23241f;
        color: #f8f8f2;
        padding: 0.5rem;
        border-radius: 5px;
        overflow-x: auto;

        &::after {
          content: attr(data-code-language);
          position: absolute;
          top: 0;
          right: 0;
          color: map-get($colors, main);
          font-size: 0.6rem;
          padding: 0.25rem 0.4rem;
          font-family: "Sansita";
          letter-spacing: 0.05rem;
        }
      }

      code[data-code-language] {
        position: relative;
        background-color: #23241f;
        color: #f8f8f2;
        padding: 0.5rem 0.25rem;
        border-radius: 5px;

        &::after {
          content: attr(data-code-language);
          position: absolute;
          right: 5px;
          top: 100%;
          background-color: map-get($colors, grey-text);
          color: map-get($colors, default-text);
          font-size: 0.55rem;
          padding: 0 0.1rem;
        }
      }
    }

    #preview-button {
      padding: 0 0.5rem;
      padding-bottom: 0.1rem;
      background-color: map-get($colors, main);
      color: map-get($colors, secondary-text);
      border: none;
      font-family: "Sansita";
      font-size: 1rem;
      cursor: pointer;

      &:focus {
        outline: none;
      }
    }

    #preview-edit-post-div {
      position: absolute;
      z-index: 30;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>