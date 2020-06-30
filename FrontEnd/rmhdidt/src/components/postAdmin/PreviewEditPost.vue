<template>
  <div id="preview-edit-post">
    <div id="preview-menu" class="flex-row">
      <form @submit.prevent class="flex-row">
        <div style="padding: 0 0.25rem;">Resize:</div>
        <label for="DisplaySizeX">X:</label>
        <input
          type="number"
          id="DisplaySizeX"
          min="100"
          max="1920"
          step="10"
          v-model="previewDisplay.xSize"
        />
        <div style="padding: 0.3rem; font-size: 0.75rem;">x</div>
        <label for="DisplaySizeY">Y:</label>
        <input
          type="number"
          id="DisplaySizeY"
          min="100"
          max="1080"
          step="10"
          v-model="previewDisplay.ySize"
        />
        <div style="padding: 0 0.75rem;">Scale:</div>
        <label for="DisplayScale" style="display: none;">Scale</label>
        <input
          type="range"
          id="DisplayScale"
          min="0.25"
          max="2.0"
          step="0.05"
          v-model="previewDisplay.scale"
        />
        <div class="scale-display">x{{ previewDisplay.scale }}</div>
      </form>
      <button class="close-preview-btn" @click="closePreview">
        Close Preview
      </button>
    </div>
    <div
      id="preview-container"
      class="flex-row"
      :data-width="displayXSize"
      :data-height="displayYSize"
    >
      <div
        id="preview-display"
        class="line-numbers"
        ref="preview_display"
        v-html="htmlCache"
        :style="
          'width: ' +
            displayXSize +
            'px; height: ' +
            displayYSize +
            'px; zoom: ' +
            previewDisplay.scale +
            ';'
        "
      ></div>
    </div>
  </div>
</template>

<script>
  import Prism from "prismjs";

  export default {
    props: {
      htmlCache: String
    },
    data() {
      return {
        previewDisplay: {
          xSize: 1440,
          ySize: 900,
          scale: 0.5
        }
      };
    },
    computed: {
      displayXSize() {
        if (this.previewDisplay.xSize < 100) return 100;
        if (this.previewDisplay.xSize > 1920) return 1920;
        return this.previewDisplay.xSize;
      },
      displayYSize() {
        if (this.previewDisplay.ySize < 100) return 100;
        if (this.previewDisplay.ySize > 1080) return 1080;
        return this.previewDisplay.ySize;
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.$refs.preview_display.querySelectorAll("code").forEach(block => {
          let blockLanguage;
          if (block.parentNode.nodeName === "PRE") {
            blockLanguage = block.parentNode.getAttribute("data-code-language");
            if (blockLanguage === "none") {
              block.parentNode.setAttribute("data-code-language", "");
            }
          } else if (block.getAttribute("data-code-language")) {
            blockLanguage = block.getAttribute("data-code-language");
            if (blockLanguage === "none") {
              block.setAttribute("data-code-language", "");
            }
          } else {
            blockLanguage = "none";
          }
          block.classList.add(
            "match-braces",
            "rainbow-braces",
            "language-" + blockLanguage
          );
        });
        setTimeout(() => {
          Prism.highlightAll();
        }, 0);
      });
    },
    methods: {
      closePreview() {
        this.$emit("closePreview");
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  $preview-menu-height: 2rem;

  #preview-edit-post {
    position: relative;
    height: 100%;
    overflow: hidden;

    .flex-column {
      display: flex;
      flex-direction: column;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
    }

    #preview-container {
      position: absolute;
      top: $preview-menu-height;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: map-get($colors, grey-text);
      justify-content: space-around;
      align-content: space-around;
      overflow: auto;

      &::after {
        content: attr(data-width) " x " attr(data-height) "px";
        position: absolute;
        bottom: 0;
        right: 0;
        padding: 0.1rem;
        font-size: 0.75rem;
      }
    }

    #preview-menu {
      position: relative;
      z-index: 10;
      padding: 0 0.25rem;
      background-color: map-get($colors, main);
      height: $preview-menu-height;
      border-bottom: 1px solid map-get($colors, default-text);

      label {
        padding: 0 0.25rem;
        color: map-get($colors, secondary-text);
      }

      input[type="number"] {
        padding: 2px;
        width: 4rem;
        color: map-get($colors, default-text);
        border: 1px solid map-get($colors, secondary-text);

        &:focus {
          outline: none;
        }
      }

      input[type="range"] {
        width: 5rem;

        &:focus {
          outline: none;
        }
      }

      .scale-display {
        padding: 0 0.1rem;
        padding-bottom: 0.2rem;
        font-size: 0.75rem;
        color: map-get($colors, secondary-text);
      }
    }

    #preview-display {
      position: absolute;
      padding: 0.5rem 4rem;
      background-color: map-get($colors, main);
      color: map-get($colors, default-text);
      border: 3px solid map-get($colors, default-border);
      overflow-y: scroll;
      overflow-x: hidden;

      a,
      a:visited,
      a:active {
        position: relative;
        color: map-get($colors, secondary-text);

        &:hover::before {
          content: "Link: " attr(href);
          z-index: 30;
          position: absolute;
          bottom: calc(100% + 5px);
          padding: 0.25rem 0.5rem;
          transform: translateX(+50%);
          white-space: nowrap;
          background-color: map-get($colors, main);
          border: 1px solid map-get($colors, secondary-text);
          border-radius: 5px;
        }

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
        border-radius: 8px;
        margin: 2rem;
        overflow-x: auto;

        &::after {
          content: attr(data-code-language);
          position: absolute;
          top: 0;
          right: 0;
          color: map-get($colors, main);
          font-size: 0.8rem;
          padding: 0.25rem 0.6rem;
          font-family: "Sansita";
          letter-spacing: 0.05rem;
        }
      }

      code[data-code-language] {
        padding: 0.25rem;
        margin: 0 0.1rem;
      }
    }

    .close-preview-btn {
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
  }
</style>