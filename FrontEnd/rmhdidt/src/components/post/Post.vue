<template>
  <div id="post">
    <div
      v-html="postData.content"
      ref="html_ref"
      id="post-container"
      class="line-numbers"
    ></div>
  </div>
</template>

<script>
  import Prism from "prismjs";
  export default {
    data() {
      return {};
    },
    computed: {
      postData() {
        return this.$store.getters.post;
      }
    },
    mounted() {
      this.$store.dispatch("loadPost", this.$route.params.id);
    },
    watch: {
      postData() {
        this.$nextTick(() => {
          this.$refs.html_ref.querySelectorAll("code").forEach(block => {
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
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  #post {
    color: map-get($colors, default-text);
    @import "../../styles/post-colors";

    #post-container {
      padding: 0.5rem 5rem;

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
        margin: 1rem 4rem;
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
  }
</style>