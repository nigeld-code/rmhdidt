<template>
  <div id="display">
    <header ref="header">
      <div
        class="header-container"
        :style="'border: 8px solid' + data.rightWallColor + ';'"
      >
        <img
          :src="data.tileImage"
          :style="
            'box-shadow: 0 4px 8px 0 ' +
              data.rightWallColor +
              ', 0 6px 20px 0 ' +
              data.leftWallColor +
              ';'
          "
        />
        <h1>{{ data.title }}</h1>
        <img
          :src="data.tileImage"
          :style="
            'box-shadow: 0 4px 8px 0 ' +
              data.rightWallColor +
              ', 0 6px 20px 0 ' +
              data.leftWallColor +
              ';'
          "
        />
      </div>
    </header>
    <div>
      History / Favorites
    </div>
    <div id="topics">
      Topics:
      <div v-for="topic in topicsForTileData" :key="topic._id" class="shelf">
        <div class="topic-link">
          <router-link
            :to="{
              name: 'topic',
              params: { id: topic._id }
            }"
            tag="div"
            >{{ topic.title }}</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$store.dispatch("loadSingleTile", this.$route.params.id);
    },
    computed: {
      data() {
        return this.$store.getters.singleTile;
      },
      topicsForTileData() {
        return this.$store.getters.topicsForTileData;
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  #display {
    header {
      width: 60%;
      padding: 1rem;
      margin: auto;
      color: map-get($colors, default-text);

      .header-container {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-content: center;
        justify-content: space-between;
        border-radius: 16px;

        @media (max-width: $dropdown-min-width) {
          border-width: 3px !important;
        }

        @media (max-width: $minimum-min-width) {
          border-width: 2px !important;
        }
      }

      h1 {
        background-color: map-get($colors, main);
        font-size: 2rem;

        @media (max-width: $dropdown-min-width) {
          font-size: 1.2rem;
        }

        @media (max-width: $minimum-min-width) {
          font-size: 1rem;
        }
      }

      img {
        height: 4rem;
        margin: 0.75rem;
        border-radius: 8px;
        
        &::selection {
          background-color: transparent;
        }

        @media (max-width: $dropdown-min-width) {
          height: 2.5rem;
          margin: 0.25rem;
        }

        @media (max-width: $minimum-min-width) {
          height: 2rem;
        }
      }
    }

    #topics {
      margin: auto;
      width: 75%;

      .topic-link {
        margin: 1rem;
        padding: 0.5rem;
        border: 2px solid map-get($colors, secondary-text);
        border-radius: 5px;
        font-size: 2.5rem;
        text-align: center;
        cursor: pointer;
      }
    }
  }
</style>