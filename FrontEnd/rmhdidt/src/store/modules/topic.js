import { axiosAPI } from '../helpers/axiosAPI';

const state = {
  topicData: {},
  topicsForTileData: []
};

const mutations = {
  LOAD_TOPIC(state, topicData) {
    state.topicData = topicData;
  },
  CLEAR_TOPIC(state) {
    state.topicData = {};
  },
  LOAD_TOPICS_FOR_TILE(state, topicsData) {
    state.topicsForTileData = topicsData;
  }
};

const actions = {
  loadTopic: ({ rootState, commit, dispatch }, pageId) => {
    axiosAPI({
      query: `
        query loadTopic($id: ID!) {
          topic(id: $id) {
            _id
            tile {
              _id
            }
            title
            posts {
              _id
              order
              title
              author {
                _id
              }
            }
          }
        }
      `,
      variables: {
        id: pageId
      }
    })
      .then(res => {
        commit('LOAD_TOPIC', res.data.data.topic);
        if (rootState.tiles.singleTile._id !== res.data.data.topic.tile._id) {
          dispatch('loadSingleTile', res.data.data.topic.tile._id);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  topicsForTile: ({ commit }, tileId) => {
    axiosAPI({
      query: `
        query loadTopics($id: ID!) {
          topicsForTile(tileId: $id) {
            _id
            title
            author {
              _id
            }
          }
        }
      `,
      variables: {
        id: tileId
      }
    })
      .then(res => {
        res.data.data.topicsForTile.forEach(topic => {
          topic.editTitleToggle = false;
        });
        commit('LOAD_TOPICS_FOR_TILE', res.data.data.topicsForTile);
      })
      .catch(err => {
        console.log(err);
      });
  },
  createNewTopic: ({ rootState, dispatch }, newTopicData) => {
    axiosAPI(
      {
        query: `
          mutation sendCreateTopic($tile: String!, $title: String!) {
            createTopic(topicInput: {tile: $tile, title: $title}) {
              _id   
            }
          }
        `,
        variables: {
          tile: newTopicData.tile,
          title: newTopicData.title
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('topicsForTile', newTopicData.tile);
        } else {
          console.log('Fail to load Topic');
        }
      })
      .catch(err => console.log(err));
  },
  deleteTopic: ({ rootState, dispatch }, topicData) => {
    axiosAPI(
      {
        query: `
        mutation sendDeleteTopic($id: ID!) {
          deleteTopic(id: $id) {
            _id
          }
        }
      `,
        variables: {
          id: topicData.topicId
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('topicsForTile', topicData.tileId);
        } else {
          console.log('Failed to delete to delete topic');
        }
      })
      .catch(err => console.log(err));
  },
  updateTopicTitle: ({ rootState, dispatch }, input) => {
    axiosAPI(
      {
        query: `
          mutation sendUpdateTopicTitle($topicId: String, $editedTitle: String) {
            updateTopicTitle(updateTitleInput: {id: $topicId, editedTitle: $editedTitle}) {
              _id
            }
          }
        `,
        variables: {
          topicId: input.topicId,
          editedTitle: input.editedTitle
        }
      },
      {
        Authorization: 'Bearer ' + rootState.auth.user.token
      }
    )
      .then(res => {
        if (res) {
          dispatch('topicsForTile', input.tileId);
        } else {
          console.log('Failed to update Topic title');
        }
      })
      .catch(err => {
        throw err;
      });
  }
};

const getters = {
  topicsForTileData(state) {
    return state.topicsForTileData;
  },
  topicData(state) {
    return state.topicData;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
