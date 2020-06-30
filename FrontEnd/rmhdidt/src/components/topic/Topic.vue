<template>
  <div id="topic-container">
    <div class="flex-column">
      <div class="flex-row topic-heading">
        <div
          @click="$router.push({ name: 'display', params: { id: tile._id } })"
        >
          <img
            :src="tile.tileImage"
            class="category-logo"
            :title="tile.title"
          />
        </div>
        <span class="breadcrumb-btn">></span>
        <h1>
          {{ topic.title }}
        </h1>
      </div>
      <div id="chapters-container">
        Select a Chapter:
        <div class="chapter-cell">
          <div v-for="post in topic.posts" :key="post._id" class="flex-column">
            <router-link
              :to="{ name: 'post', params: { id: post._id } }"
              class="chapter-box flex-row"
              tag="div"
            >
              {{ post.title }}
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    mounted() {
      this.$store.dispatch("loadTopic", this.$route.params.id);
    },
    computed: {
      topic() {
        return this.$store.getters.topicData;
      },
      tile() {
        return this.$store.getters.singleTile;
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  #topic-container {
    color: map-get($colors, default-text);

    .flex-column {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .topic-heading {
      width: 80%;
      justify-content: flex-start;

      .category-logo {
        width: 4rem;
        border-radius: 6px;
        margin: 0.5rem;
        cursor: pointer;

        &::selection {
          background-color: transparent;
        }
      }

      .breadcrumb-btn {
        color: map-get($colors, secondary-text);
        margin: 0 0.25rem;
        padding-bottom: 1rem;
        font-size: 4rem;
        cursor: pointer;
      }

      h1 {
        padding-bottom: 0.25rem;
        font-size: 2.5rem;
      }
    }

    #chapters-container {
      margin-top: 0.5rem;
      width: 75%;

      .chapter-cell {
        margin-top: 1rem;
      }

      .chapter-box {
        width: 100%;
        margin: 0.5rem;
        padding: 0.5rem;
        border: 2px solid map-get($colors, secondary-text);
        border-radius: 5px;
        box-shadow: 3px 3px 5px map-get($colors, default-border);
        font-size: 2.5rem;
        cursor: pointer;
      }
    }
  }
</style>