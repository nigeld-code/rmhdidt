<template>
  <div id="content">
    <header>
      Manage your topics and chapters!
    </header>
    <div class="form-element">
      <div
        @mouseenter="toggleManager('categorySelectToggle', true)"
        @mouseleave="toggleManager('categorySelectToggle', false)"
      >
        <div
          class="category-select-container flex-row"
          :class="{ 'select-container-hover': toggleObj.categorySelectToggle }"
          @click="
            toggleManager(
              'categorySelectToggle',
              !toggleObj.categorySelectToggle
            )
          "
        >
          <div class="flex-row">
            <img
              v-if="categorySelect.image"
              :src="categorySelect.image"
              class="category-select-image"
            />
            <div
              v-if="!categorySelect.image"
              class="category-select-image category-select-image-blank"
            ></div>
            <div class="category-select-text">{{ categorySelect.title }}</div>
          </div>
          <i
            class="dropdown-arrow"
            :class="{
              'nld-DropdownDownArrow': !toggleObj.categorySelectToggle,
              'nld-DropdownUpArrow': toggleObj.categorySelectToggle
            }"
          ></i>
        </div>
        <transition name="selector-transition">
          <div v-if="toggleObj.categorySelectToggle" id="categorySelection">
            <div
              v-for="tile in tiles"
              :key="tile.id"
              class="tile-container"
              @click="categorySelection(tile)"
            >
              <img :src="tile.tileImage" class="category-select-image" />
              <div class="category-select-text">{{ tile.title }}</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div
      v-if="formInput.tileId"
      class="form-element"
      style="position: relative;"
    >
      <div
        @mouseenter="toggleManager('topicSelectToggle', true)"
        @mouseleave="toggleManager('topicSelectToggle', false)"
      >
        <div
          class="topic-select-container flex-row"
          :class="{ 'select-container-hover': toggleObj.topicSelectToggle }"
          @click="
            toggleManager('topicSelectToggle', !toggleObj.topicSelectToggle)
          "
        >
          <div class="topic-select-text flex-row">{{ topicSelect.title }}</div>
          <i
            class="dropdown-arrow"
            :class="{
              'nld-DropdownDownArrow': !toggleObj.topicSelectToggle,
              'nld-DropdownUpArrow': toggleObj.topicSelectToggle
            }"
          ></i>
        </div>
        <transition name="selector-transition">
          <div v-if="toggleObj.topicSelectToggle" id="topicSelection">
            <div v-for="topic in topicsForTileData" :key="topic.id">
              <div v-if="topic.author._id === user.userId">
                <transition name="topic-edit-title-transition">
                  <div
                    v-if="topic.editTitleToggle"
                    class="topic-edit-input-container flex-row"
                  >
                    <div>
                      <input
                        type="text"
                        class="topic-edit-title-input form-text-input-small"
                        v-model="formInput.editTopicTitleInput"
                      />
                    </div>
                    <div
                      v-if="formInput.editTopicTitleInput === topic.title"
                      @click="topic.editTitleToggle = false"
                      class="topic-edit-title-btn topic-edit-title-btn-alt"
                    >
                      close
                    </div>
                    <div
                      v-else
                      @click="
                        editTopicTitleSubmit(
                          topic._id,
                          formInput.tileId,
                          topic.title,
                          formInput.editTopicTitleInput
                        )
                      "
                      class="topic-edit-title-btn topic-edit-title-btn-alt"
                    >
                      change
                    </div>
                  </div>
                </transition>
                <div class="topic-container flex-row">
                  <div class="topic-select-cell flex-row">
                    <div
                      @click="topicSelection(topic)"
                      class="topic-select-text flex-row"
                    >
                      {{ topic.title }}
                    </div>
                  </div>
                  <div
                    @click="editTopicTitleBtn(topic)"
                    class="topic-edit-title-btn"
                  >
                    edit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <button
        class="form-btn"
        @click="toggleManager('newTopicPopupToggle', true)"
      >
        New Topic
      </button>
      <transition name="new-topic-popup-transition">
        <div v-if="toggleObj.newTopicPopupToggle" class="new-topic-popup">
          <div
            class="flex-row"
            style="align-items: center; justify-content: center;"
          >
            <input
              class="form-text-input"
              type="text"
              v-model="formInput.newTopicTitle"
              placeholder="Insert new topic..."
            />
            <button class="form-btn-reverse small-btn" @click="newTopic">
              Create
            </button>
            <button
              class="form-btn-reverse small-btn"
              @click="toggleManager('newTopicPopupToggle', false)"
            >
              Close
            </button>
          </div>
        </div>
      </transition>
    </div>
    <div v-if="formInput.tileId" class="form-element no-padding">
      <div class="posts-dashboard-container" style="text-align: center;">
        <div
          v-if="topicData.posts && topicData.posts.length === 0"
          class="posts-dashboard-cell flex-row"
        >
          <div></div>
          <div>This topic has no chapters ... yet!</div>
          <div @click="deleteThisTopic" class="dashboard-cell-btn">
            Remove Topic
          </div>
        </div>
        <div v-for="post in topicData.posts" :key="post.id">
          <div
            class="posts-dashboard-cell flex-row"
            v-if="post.author._id === user.userId"
          >
            <div class="flex-row dashboard-order-group">
              <div>{{ post.order }}.</div>
              <div class="flex-row">
                <i
                  v-if="post.order !== 1"
                  class="nld-UpArrow dashboard-icon"
                  @click="incrementOrder(post, true)"
                ></i>
                <i
                  v-if="post.order === 1"
                  class="nld-UpArrow dashboard-icon-dummy"
                ></i>
                <i
                  v-if="post.order !== topicData.posts.length"
                  class="nld-DownArrow dashboard-icon"
                  @click="incrementOrder(post, false)"
                ></i>
                <i
                  v-if="post.order === topicData.posts.length"
                  class="nld-DownArrow dashboard-icon-dummy"
                ></i>
              </div>
            </div>
            <div>
              {{ post.title }}
            </div>
            <div class="flex-row">
              <div @click="openPostEditModel(post)" class="dashboard-cell-btn">
                Edit
              </div>
              <div @click="deleteThisPost(post._id)" class="dashboard-cell-btn">
                Delete
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="formInput.topicId"
      class="form-element"
      style="position: relative"
    >
      <transition name="new-chapter-popup-transition">
        <div v-if="toggleObj.newChapterPopupToggle" class="new-chapter-popup">
          <div
            class="flex-row"
            style="align-items: center; justify-content: center;"
          >
            <input
              class="form-text-input"
              type="text"
              v-model="formInput.newChapterTitle"
              placeholder="Insert new chapter..."
            />
            <button class="form-btn-reverse small-btn" @click="newPost">
              Create
            </button>
            <button
              class="form-btn-reverse small-btn"
              @click="toggleManager('newChapterPopupToggle', false)"
            >
              Close
            </button>
          </div>
        </div>
      </transition>
      <button
        class="form-btn"
        @click="toggleManager('newChapterPopupToggle', true)"
      >
        New Chapter
      </button>
    </div>
    <div v-if="toggleObj.postEditModel && formInput.postId" class="overlay">
      <div class="post-edit-model flex-row">
        <div class="flex-row">
          <div>
            {{ formInput.tileTitle }}
            <span class="post-edit-model-text-alt">></span>
            {{ formInput.topicTitle }}
            <span class="post-edit-model-text-alt">></span>
            {{ formInput.postTitle }}
          </div>
          <div
            class="post-edit-model-btn post-edit-model-btn-small"
            @click="editChapterTitleBtn"
          >
            edit
          </div>
        </div>
        <div
          class="post-edit-model-btn-group flex-row"
          v-if="!toggleObj.closeEditPostWithoutSaveToggle"
        >
          <div
            @click="
              savePostEdit(formInput.postId, $store.getters.localSavePostEdit)
            "
            class="flex-row"
          >
            <div
              class="post-edit-model-btn"
              v-if="$store.getters.localSavePostEdit"
            >
              Save
            </div>
          </div>
          <div @click="closePostEdit(false)" class="flex-row">
            <div class="post-edit-model-btn">
              Close
            </div>
          </div>
        </div>
        <div
          class="post-edit-model-btn-group-wide flex-row"
          v-if="toggleObj.closeEditPostWithoutSaveToggle"
        >
          <div>Close without saving?</div>
          <div @click="closePostEdit(true)" class="flex-row">
            <div class="post-edit-model-btn">
              Yes
            </div>
          </div>
          <div
            @click="toggleObj.closeEditPostWithoutSaveToggle = false"
            class="flex-row"
          >
            <div class="post-edit-model-btn">
              No
            </div>
          </div>
        </div>
      </div>
      <div class="post-edit-window">
        <transition name="edit-chapter-title-transition">
          <div
            v-if="toggleObj.editChapterTitleToggle"
            class="edit-chapter-title-container"
          >
            <label for="editChapterTitleInput">Change chapter title:</label>
            <form @submit.prevent class="flex-row">
              <input
                class="form-text-input-small"
                id="editChapterTitleInput"
                type="text"
                v-model="formInput.editChapterTitleInput"
              />
              <div
                v-if="
                  formInput.editChapterTitleInputOrginal ===
                    formInput.editChapterTitleInput
                "
                class="post-edit-model-btn-alt edit-chapter-title-btn-width"
                @click="toggleObj.editChapterTitleToggle = false"
              >
                close
              </div>
              <div
                v-if="
                  formInput.editChapterTitleInputOrginal !==
                    formInput.editChapterTitleInput
                "
                class="post-edit-model-btn-alt edit-chapter-title-btn-width"
                @click="
                  editChapterTitleSubmit(
                    formInput.postId,
                    formInput.topicId,
                    formInput.editChapterTitleInput
                  )
                "
              >
                change
              </div>
            </form>
          </div>
        </transition>
        <post-edit :post-id="formInput.postId" />
      </div>
    </div>
  </div>
</template>

<script>
  import PostEdit from "./EditPost.vue";

  export default {
    components: {
      "post-edit": PostEdit
    },
    data() {
      return {
        formInput: {
          editTopicTitleInput: null,
          editChapterTitleInput: null
        },
        categorySelect: {
          image: null,
          title: "Select Category",
          id: null
        },
        topicSelect: {
          title: "Select Topic",
          id: null
        },
        toggleObj: {
          categorySelectToggle: false,
          topicSelectToggle: false,
          newTopicPopupToggle: false,
          newChapterPopupToggle: false,
          postEditModel: false,
          editChapterTitleToggle: false,
          closeEditPostWithoutSaveToggle: false
        }
      };
    },
    computed: {
      user() {
        return this.$store.getters.user;
      },
      tiles() {
        return this.$store.getters.allTiles;
      },
      topicsForTileData() {
        return this.$store.getters.topicsForTileData;
      },
      topicData() {
        return this.$store.getters.topicData;
      }
    },
    mounted() {
      if (!this.user.userId) {
        this.$router.push({ name: "home" });
      }
      this.$store.commit("CLEAR_TOPIC");
    },
    methods: {
      categorySelection(tile) {
        this.categorySelect = {
          image: tile.tileImage,
          title: tile.title,
          id: tile._id
        };
        this.toggleManager("CloseAll", false);
        this.formInput.tileId = tile._id;
        this.formInput.tileTitle = tile.title;
        this.topicSelect = {
          title: "Select Topic",
          id: null
        };
        this.formInput.topicId = null;
        this.formInput.topicTitle = null;
        this.$store.dispatch("topicsForTile", tile._id);
        this.$store.commit("CLEAR_TOPIC");
      },
      topicSelection(topic) {
        this.topicSelect = {
          title: topic.title,
          id: topic._id
        };
        this.formInput.topicId = topic._id;
        this.formInput.topicTitle = topic.title;
        this.$store.dispatch("loadTopic", this.formInput.topicId);
        this.toggleManager("CloseAll", false);
      },
      newTopic() {
        this.$store.dispatch("createNewTopic", {
          tile: this.formInput.tileId,
          title: this.formInput.newTopicTitle
        });
        this.toggleManager("CloseAll", false);
        this.topicSelect = {
          title: "Select Topic",
          id: null
        };
        this.formInput.newTopicTitle = null;
        this.formInput.topicId = null;
        this.$store.commit("CLEAR_TOPIC");
      },
      newPost() {
        if (this.formInput.newChapterTitle !== "") {
          this.newChapterPopupToggle = false;
          this.$store.dispatch("createNewPost", {
            tileId: this.formInput.tileId,
            topicId: this.formInput.topicId,
            title: this.formInput.newChapterTitle
          });
          this.formInput.newChapterTitle = "";
          this.toggleManager("CloseAll", false);
        }
      },
      deleteThisPost(postId) {
        this.formInput.postId = postId;
        this.$store.dispatch("deletePost", this.formInput);
      },
      deleteThisTopic() {
        this.$store.dispatch("deleteTopic", {
          topicId: this.formInput.topicId,
          tileId: this.formInput.tileId
        });
        this.topicSelect = {
          title: "Select Topic",
          id: null
        };
        this.formInput.topicId = null;
        this.$store.commit("CLEAR_TOPIC");
      },
      openPostEditModel(post) {
        this.$store.dispatch("loadPost", post._id);
        this.toggleManager("postEditModel", true);
        this.formInput.postId = post._id;
        this.formInput.postTitle = post.order.toString() + ". " + post.title;
        this.formInput.postOrder = post.order;
      },
      savePostEdit(postId, htmlString) {
        if (this.$store.getters.localSavePostEdit) {
          this.$store.dispatch("savePostEdit", {
            postId,
            htmlString
          });
          this.$store.dispatch("cacheEditPost", null);
        } else {
          console.log("No new content to save!");
        }
      },
      closePostEdit(closeOverride) {
        if (!this.$store.getters.localSavePostEdit || closeOverride) {
          this.toggleObj.closeEditPostWithoutSaveToggle = false;
          this.toggleManager("CloseAll", false);
          this.formInput.postId = null;
        } else {
          this.toggleObj.closeEditPostWithoutSaveToggle = true;
        }
      },
      incrementOrder(post, increment) {
        this.$store.dispatch("incrementOrder", {
          postId: post._id,
          topicId: this.formInput.topicId,
          increment
        });
      },
      editChapterTitleBtn() {
        this.toggleObj.editChapterTitleToggle = !this.toggleObj
          .editChapterTitleToggle;
        this.formInput.editChapterTitleInput = this.topicData.posts.find(
          post => post.order === this.formInput.postOrder
        ).title;
        this.formInput.editChapterTitleInputOrginal = this.formInput.editChapterTitleInput;
      },
      editChapterTitleSubmit(postId, topicId, editedTitle) {
        this.$store.dispatch("updateChapterTitle", {
          postId,
          topicId,
          editedTitle
        });
        this.formInput.postTitle =
          this.formInput.postOrder.toString() + ". " + editedTitle;
        this.toggleObj.editChapterTitleToggle = false;
      },
      editTopicTitleBtn(topic) {
        this.topicsForTileData.forEach(thisTopic => {
          if (thisTopic._id === topic._id) {
            thisTopic.editTitleToggle = true;
            this.formInput.editTopicTitleInput = thisTopic.title;
          } else {
            thisTopic.editTitleToggle = false;
          }
        });
      },
      editTopicTitleSubmit(topicId, tileId, originalTitle, editedTitle) {
        this.editTopicTitleBtn({ _id: null });
        this.$store.dispatch("updateTopicTitle", {
          topicId,
          tileId,
          editedTitle
        });
        if (this.topicSelect.title === originalTitle) {
          this.topicSelect.title = editedTitle;
        }
      },
      toggleManager(targetToggle, state) {
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

  #content {
    header {
      width: 80%;
      margin: 1rem auto;
      text-align: center;
    }

    .form-element {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      padding: 0.75rem 0;
    }

    .no-padding {
      padding: 0;
    }

    .flex-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .form-btn {
      height: 4rem;
      padding: 0 1rem;
      margin: 0 1.5rem;
      background-color: map-get($colors, main);
      border: 2px solid map-get($colors, default-border);
      color: map-get($colors, default-text);
      border-radius: 5px;
      font-family: "Sansita";
      font-size: 1rem;
      cursor: pointer;
      transition: background-color $default-dropdown-animation-duration;

      &:hover {
        background-color: map-get($colors, default-border);
      }

      &:focus {
        outline: none;
      }
    }

    .form-btn-reverse {
      height: 4rem;
      padding: 0 1rem;
      margin: 0 1.5rem;
      background-color: map-get($colors, default-border);
      border: 2px solid map-get($colors, secondary);
      color: map-get($colors, default-text);
      border-radius: 5px;
      font-family: "Sansita";
      font-size: 1rem;
      cursor: pointer;
      transition: background-color $default-dropdown-animation-duration;

      &:hover {
        background-color: map-get($colors, secondary);
      }

      &:focus {
        outline: none;
      }
    }

    .small-btn {
      padding: 0.5rem 0.75rem;
      margin: 0.25rem;
    }

    .form-text-input {
      height: 4rem;
      width: 38rem;
      margin: 0.25rem;
      padding-left: 0.5rem;
      background-color: map-get($colors, secondary);
      color: map-get($colors, default-text);
      border: 2px solid map-get($colors, secondary);
      border-radius: 5px;
      font-family: "Sansita";
      font-size: 1.75rem;

      &:focus {
        outline: none;
      }
    }

    .form-text-input-small {
      height: 2rem;
      width: 18rem;
      margin: 0.25rem;
      padding-left: 0.5rem;
      background-color: map-get($colors, secondary);
      color: map-get($colors, default-text);
      border: 2px solid map-get($colors, secondary);
      border-radius: 5px;
      font-family: "Sansita";
      font-size: 1rem;

      &:focus {
        outline: none;
      }
    }

    .category-select-container {
      width: 14rem;
      height: 4rem;
      border: 2px solid map-get($colors, default-border);
      border-radius: 5px;
    }

    .category-select-image {
      width: 3rem;
      border-radius: 6px;
      margin: 0.5rem;
    }

    .category-select-image-blank {
      height: 3rem;
      background-color: map-get($colors, secondary);
      margin: 0.25rem 0.5rem;
      border: 2px solid map-get($colors, default-border);
    }

    .category-select-text {
      color: map-get($colors, default-text);
    }

    .dropdown-arrow {
      padding: 0.5rem;
      font-size: 1.2rem;
    }

    .select-container-hover {
      border-radius: 5px 5px 0 0 !important;
    }

    #categorySelection {
      position: absolute;
      z-index: 4;
      width: 14rem;
      height: 20rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      background-color: map-get($colors, main);
      border: 2px solid map-get($colors, default-border);
      border-radius: 0 0 5px 5px;
      border-top: 0;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .tile-container {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      transition: background-color $default-dropdown-animation-duration;

      &:hover {
        background-color: map-get($colors, default-border);
        cursor: pointer;
      }
    }

    .selector-transition-enter,
    .selector-transition-leave-to {
      opacity: 0;
    }

    .selector-transition-enter-active,
    .selector-transition-leave-active {
      transition: opacity $long-toggle-animation-duration ease-in;
    }

    .topic-select-container {
      width: 40rem;
      height: 4rem;
      border: 2px solid map-get($colors, default-border);
      border-radius: 5px;
    }

    .topic-select-cell {
      width: 100%;
      height: 3.5rem;
    }

    .topic-select-text {
      color: map-get($colors, default-text);
      width: 100%;
      height: 100%;
      padding-left: 1.25rem;
    }

    .topic-edit-input-container {
      position: absolute;
      z-index: 30;
      height: 3.5rem;
      width: 100%;
      background-color: map-get($colors, secondary-text);
    }

    .topic-edit-title-input {
      width: 34rem;
      margin-left: 1rem;
    }

    .topic-edit-title-btn {
      z-index: 20;
      color: map-get($colors, secondary-text);
      margin: 0 0.25rem;
      padding-right: 0.75rem;
      text-align: end;
      cursor: pointer;

      &:hover {
        color: map-get($colors, default-text);
        text-decoration: underline;
      }
    }

    .topic-edit-title-btn-alt {
      color: map-get($colors, main);

      &:hover {
        color: map-get($colors, default-border);
      }
    }

    .topic-edit-title-transition-enter,
    .topic-edit-title-transition-leave-to {
      transform: translateX(-100%);
    }

    .topic-edit-title-transition-enter-active,
    .topic-edit-title-transition-leave-active {
      transition: transform $default-dropdown-animation-duration ease;
    }

    .topic-edit-title-transition-enter-to,
    .topic-edit-title-transition-leave {
      transform: translateX(0);
    }

    #topicSelection {
      position: absolute;
      z-index: 3;
      width: 40rem;
      height: 20rem;
      margin: 0;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: flex-start;
      background-color: map-get($colors, main);
      border: 2px solid map-get($colors, default-border);
      border-radius: 0 0 5px 5px;
      border-top: 0;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .topic-container {
      position: relative;
      z-index: 20;
      justify-content: flex-start;
      transition: background-color $default-dropdown-animation-duration;

      &:hover {
        background-color: map-get($colors, default-border);
        cursor: pointer;
      }
    }

    .posts-dashboard-container {
      position: relative;
      z-index: 2;
      width: 65rem;
      height: 25rem;
      background-color: map-get($colors, secondary);
      border: 2px solid map-get($colors, default-border);
      color: map-get($colors, default-text);
      border-radius: 5px;
      overflow-x: hidden;
      overflow-y: scroll;
    }

    .posts-dashboard-cell {
      padding: 0.5rem;
    }

    .posts-dashboard-cell:nth-child(even) {
      background-color: map-get($colors, main);
    }

    .dashboard-cell-btn {
      margin-right: 1rem;
      color: map-get($colors, secondary-text);
      cursor: pointer;
      text-decoration: underline;

      &:hover {
        color: map-get($colors, default-text);
      }
    }

    .dashboard-order-group {
      width: 3rem;
    }

    .dashboard-icon {
      color: map-get($colors, secondary-text);
      margin-left: 0.25rem;
      font-size: 0.75rem;
      cursor: pointer;

      &:hover {
        color: map-get($colors, default-text);
      }
    }

    .dashboard-icon-dummy {
      color: map-get($colors, default-border);
      margin-left: 0.25rem;
      font-size: 0.75rem;
    }

    .new-topic-popup {
      position: absolute;
      z-index: 1;
      bottom: 0;
      right: 22rem;
      left: 22rem;
      border-radius: 8px 8px 0 0;
      padding: 0.5rem;
      background-color: map-get($colors, default-border);
    }

    .new-chapter-popup {
      position: absolute;
      z-index: 1;
      top: 0;
      right: 22rem;
      left: 22rem;
      border-radius: 0 0 8px 8px;
      padding: 0.5rem;
      background-color: map-get($colors, default-border);
    }

    .new-topic-popup-transition-enter,
    .new-topic-popup-transition-leave-to {
      transform: translateY(+100%);
    }

    .new-topic-popup-transition-enter-active {
      transition: transform $default-dropdown-animation-duration ease-in-out;
    }

    .new-topic-popup-transition-enter-to,
    .new-topic-popup-transition-leave {
      transform: translateY(0);
    }

    .new-topic-popup-transition-leave-active {
      transition: transform $default-dropdown-animation-duration ease-in;
    }

    .new-chapter-popup-transition-enter,
    .new-chapter-popup-transition-leave-to {
      transform: translateY(-100%);
    }

    .new-chapter-popup-transition-enter-active {
      transition: transform $default-dropdown-animation-duration ease-in-out;
    }

    .new-chapter-popup-transition-enter-to,
    .new-chapter-popup-transition-leave {
      transform: translateY(0);
    }

    .new-chapter-popup-transition-leave-active {
      transition: transform $default-dropdown-animation-duration ease-in;
    }

    .post-edit-model {
      z-index: 10;
      position: relative;
      top: 8rem;
      width: 60rem;
      height: 2.5rem;
      margin: auto;
      padding: 0 1rem;
      background-color: map-get($colors, default-border);
      border: 3px solid map-get($colors, secondary-text);
      color: map-get($colors, default-text);
      border-bottom: none;
      border-radius: 4px 4px 0 0;
    }

    .post-edit-window {
      position: relative;
      top: 8rem;
      overflow: auto;
      margin: auto;
      background-color: map-get($colors, main);
      border: 3px solid map-get($colors, secondary-text);
      border-radius: 0 0 4px 4px;
      border-top: none;
      width: 60rem;
      height: 36rem;
    }

    .post-edit-model-text-alt {
      color: map-get($colors, secondary-text);
      margin: 0 0.25rem;
    }

    .post-edit-model-btn {
      color: map-get($colors, secondary-text);
      margin: 0 0.25rem;
      cursor: pointer;
    }

    .post-edit-model-btn-alt {
      color: map-get($colors, main);
      margin: 0 0.75rem;
      padding-bottom: 0.25rem;
      cursor: pointer;
      text-decoration: underline;
    }

    .post-edit-model-btn-small {
      font-size: 0.75rem;
      text-decoration: underline;
      margin-bottom: 0.1rem;
      margin-left: 0.5rem;
    }

    .post-edit-model-btn-group {
      width: 5rem;
    }

    .post-edit-model-btn-group-wide {
      width: 13rem;
    }

    .edit-chapter-title-container {
      z-index: 20;
      position: absolute;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      left: 0;
      top: 0;
      padding: 0.65rem 1rem;
      background-color: map-get($colors, secondary-text);
      border-radius: 0 0 15px 0;

      label {
        margin: 0 0 0.25rem 0.5rem;
        color: map-get($colors, main);
        font-size: 0.85rem;
      }
    }

    .edit-chapter-title-btn-width {
      width: 2.5rem;
      text-align: center;
    }

    .edit-chapter-title-transition-enter,
    .edit-chapter-title-transition-leave-to {
      transform: translateX(-100%);
    }

    .edit-chapter-title-transition-enter-active,
    .edit-chapter-title-transition-leave-active {
      transition: transform $default-dropdown-animation-duration ease;
    }

    .edit-chapter-title-transition-enter-to,
    .edit-chapter-title-transition-leave {
      transform: translateX(0);
    }
  }
</style>