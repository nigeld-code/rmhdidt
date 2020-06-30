import { axiosAPI } from '../helpers/axiosAPI';

const state = {
  allTiles: null,
  singleTile: {
    title: '',
  }
};

const mutations = {
  LOAD_TILES_DATA(state, tilesData) {
    state.allTiles = tilesData;
  },
  LOAD_TILE_DATA(state, tileData) {
    state.singleTile = tileData;
  }
};

const actions = {
  loadTiles: ({ commit }) => {
    axiosAPI({
      query: `
        query {
          tiles {
            _id
            order
            title
            tileImage
            leftWallColor
            rightWallColor
            xPos
            yPos
            scale
          }
        }
       `
    })
      .then(res => {
        res.data.data.tiles.forEach(tile => {
          tile.height = 50;
          tile.growHover = 0;
          tile.growClick = 0;
          tile.heightClick = 0;
          tile.randomRotation = Math.round(Math.random())
            ? 'matrix(0.87,-0.5,0.87,0.5,1,64)'
            : 'matrix(0.87, 0.5, -0.87, 0.5, 111, 0)';
        });
        commit('LOAD_TILES_DATA', res.data.data.tiles);
      })
      .catch(err => console.log(err));
  },
  loadSingleTile: ({ commit, dispatch }, tileId) => {
    axiosAPI({
      query: `
        query getTile($id: ID!) {
          tile(id: $id) {
            _id
            title
            tileImage
            leftWallColor
            rightWallColor     
          }
        }
      `,
      variables: {
        id: tileId
      }
    })
      .then(res => {
        commit('LOAD_TILE_DATA', res.data.data.tile);
        dispatch('topicsForTile', tileId);
      })
      .catch(err => console.log(err));
  }
};

const getters = {
  allTiles(state) {
    return state.allTiles;
  },
  singleTile(state) {
    return state.singleTile;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};


