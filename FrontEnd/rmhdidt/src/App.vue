<template>
  <div id="app">
    <app-header />
    <transition name="router-transition" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script>
  import Header from "./components/header/Header.vue";
  export default {
    components: {
      "app-header": Header
    }
  };
</script>

<style lang="scss">
  @import "./styles/_variables";
  @import url("https://fonts.googleapis.com/css?family=Sansita:400,700&display=swap");

  @font-face {
    font-family: "rmhdidt";
    src: url("./styles/fonts/rmhdidt.eot?w2xxvt");
    src: url("./styles/fonts/rmhdidt.eot?w2xxvt#iefix")
        format("embedded-opentype"),
      url("./styles/fonts/rmhdidt.ttf?w2xxvt") format("truetype"),
      url("./styles/fonts/rmhdidt.woff?w2xxvt") format("woff"),
      url("./styles/fonts/rmhdidt.svg?w2xxvt#rmhdidt") format("svg");
    font-weight: normal;
    font-style: normal;
    font-display: block;
  }

  [class^="nld-"],
  [class*=" nld-"] {
    /* use !important to prevent issues with browser extensions that change fonts */
    font-family: "rmhdidt" !important;
    font-style: normal;
    font-weight: normal;
    font-variant: normal;
    text-transform: none;
    line-height: 1;

    /* Better Font Rendering =========== */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  .nld-horizontal-rule::before {
    content: "\e900";
  }

  .nld-drop-down::before {
    content: "\e901";
  }

  .nld-unordered-list::before {
    content: "\e902";
  }

  .nld-ordered-list::before {
    content: "\e903";
  }

  .nld-link::before {
    content: "\e904";
  }

  .nld-clear::before {
    content: "\e905";
  }

  .nld-subscript::before {
    content: "\e906";
  }

  .nld-superscript::before {
    content: "\e907";
  }

  .nld-code-snippet::before {
    content: "\e908";
  }

  .nld-code::before {
    content: "\e909";
  }

  .nld-strike::before {
    content: "\e90a";
  }

  .nld-underline::before {
    content: "\e90b";
  }

  .nld-italic::before {
    content: "\e912";
  }

  .nld-bold::before {
    content: "\e911";
  }

  .nld-redo::before {
    content: "\e910";
  }

  .nld-undo::before {
    content: "\e90f";
  }

  .nld-DiamondList::before {
    content: "\e914";
  }

  .nld-DiamondGrid::before {
    content: "\e915";
  }

  .nld-DropdownDownArrow::before {
    content: "\e90c";
  }

  .nld-DropdownUpArrow::before {
    content: "\e913";
  }

  .nld-UpArrow::before {
    content: "\e90d";
  }

  .nld-DownArrow::before {
    content: "\e90e";
  }

  * {
    box-sizing: border-box;
  }

  img::selection {
    background-color: transparent;
  }

  body {
    background-color: map-get($colors, main);
    padding: 0;
    margin: 0;
    font-family: "Sansita";
  }

  @media (min-width: $content-min-width) {
    #app {
      width: $content-min-width;
      margin: auto;
    }
  }

  .router-transition-enter {
    opacity: 0;
  }

  .router-transition-enter-active,
  .router-transition-leave-active {
    transition: opacity $default-router-animation-duration ease-in;
  }

  .router-transition-leave-to {
    opacity: 0;
  }
</style>
