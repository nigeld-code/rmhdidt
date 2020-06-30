import { axiosAPI } from '../helpers/axiosAPI';

const state = {
  post: {},
  postsForTopicData: [],
  localSavePostEdit: null
};

const mutations = {
  LOAD_POST(state, postData) {
    state.post = postData;
  },
  LOAD_POSTS_FOR_TOPIC(state, postsData) {
    state.postsForTopicData = postsData;
  },
  LOCAL_SAVE_POST_EDIT(state, htmlString) {
    state.localSavePostEdit = htmlString;
  }
};

const actions = {
  loadPost: ({ commit }, postId) => {
    axiosAPI({
      query: `
          query sendLoadPost($id: ID!) {
            loadPost(id: $id) {
              _id
              author {
                _id
              }
              topic {
                _id
              }
              order
              title
              content
            }
          }
        `,
      variables: {
        id: postId
      }
    })
      .then(res => {
        if (res) {
          return commit('LOAD_POST', res.data.data.loadPost);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  createNewPost: ({ rootState, dispatch }, newPostData) => {
    axiosAPI(
      {
        query: `
          mutation sendCreatePost($topic: String!, $title: String!) {
            createPost(postInput: {topic: $topic, title: $title}) {
              _id
            }
          }
        `,
        variables: {
          topic: newPostData.topicId,
          title: newPostData.title
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('loadTopic', newPostData.topicId);
        } else {
          console.log('Fail to load Post');
        }
      })
      .catch(err => console.log(err));
  },
  deletePost: ({ rootState, dispatch }, formInput) => {
    axiosAPI(
      {
        query: `
          mutation sendDeletePost($id: ID!) {
            deletePost(id: $id) {
              _id
            }
          }
        `,
        variables: {
          id: formInput.postId
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('loadTopic', formInput.topicId);
        } else {
          console.log('Failed to delete Post');
        }
      })
      .catch(err => {
        throw err;
      });
  },
  incrementOrder: ({ rootState, dispatch }, inputData) => {
    axiosAPI(
      {
        query: `
          mutation sendIncrementOrder($postId: String!, $increment: Boolean!) {
            incrementOrder(incrementOrderInput: {postId: $postId, increment: $increment}) {
              _id
            }
          }
        `,
        variables: {
          postId: inputData.postId,
          increment: inputData.increment
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('loadTopic', inputData.topicId);
        } else {
          console.log('Failed to change order');
        }
      })
      .catch(err => {
        throw err;
      });
  },
  updateChapterTitle: ({ rootState, dispatch }, input) => {
    axiosAPI(
      {
        query: `
          mutation sendUpdateChapterTitle($postId: String, $editedTitle: String) {
            updateChapterTitle(updateTitleInput: {id: $postId, editedTitle: $editedTitle}) {
              _id
            }
          }
        `,
        variables: {
          postId: input.postId,
          editedTitle: input.editedTitle
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('loadTopic', input.topicId);
          dispatch('loadPostEdit', input.postId);
        } else {
          console.log('Failed to update Chapter title');
        }
      })
      .catch(err => {
        throw err;
      });
  },
  cacheEditPost: ({ commit }, htmlString) => {
    commit('LOCAL_SAVE_POST_EDIT', htmlString);
  },
  savePostEdit: ({ rootState }, postEditInput) => {
    axiosAPI(
      {
        query: `
          mutation sendSavePostEdit($postId: String, $htmlString: String) {
            savePostEdit(savePostEditInput: {postId: $postId, htmlString: $htmlString}) {
              _id
            }
          }
        `,
        variables: {
          postId: postEditInput.postId,
          htmlString: postEditInput.htmlString
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (!res) {
          console.log('Failed to save edit');
        }
      })
      .catch(err => {
        throw err;
      });
  }
};

const getters = {
  post(state) {
    return state.post;
  },
  localSavePostEdit(state) {
    return state.localSavePostEdit;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
