import Vue from 'vue';
import Vuex from 'vuex';

import auth from './modules/auth';
import config from './modules/config';
import tiles from './modules/tiles';
import topics from './modules/topic';
import posts from './modules/post';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    config,
    tiles,
    topics,
    posts
  }
});
