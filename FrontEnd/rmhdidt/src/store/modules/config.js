const state = {
  pageConfig: {
    dropdowns: {
      overlay: false,
      loginDropdown: false,
      signupDropdown: false
    }
  }
};

const mutations = {
  CHANGE_CONFIG(state, elementId) {
    if (elementId.includes('Trigger')) {
      for (const config in state.pageConfig.dropdowns) {
        if (
          config === elementId.replace('Trigger', '')
        ) {
          state.pageConfig.dropdowns[config] = !state.pageConfig.dropdowns[
            config
          ];
          if (state.pageConfig.dropdowns[config] === true) {
            state.pageConfig.dropdowns.overlay = true; 
          } else {
            state.pageConfig.dropdowns.overlay = false;
          }
        } else if (config === 'overlay') {
          state.pageConfig.dropdowns.overlay = false;
        } else {
          state.pageConfig.dropdowns[config] = false;
        }
      }
    } else if (elementId.match(/^(overlay|header|homeLink|submit)$/)) {
      for (const config in state.pageConfig.dropdowns) {
        state.pageConfig.dropdowns[config] = false;
      }
    }
  }
};

const actions = {
  changeConfig: ({ commit }, elementId) => {
    commit('CHANGE_CONFIG', elementId);
  }
  // resetDropdowns: ({ commit }, toggleId) => {
  //   commit('RESET_DROPDOWNS', toggleId);
  // }
};

const getters = {
  overlay(state) {
    return state.pageConfig.dropdowns.overlay;
  },
  loginDropdownOpen(state) {
    return state.pageConfig.dropdowns.loginDropdown;
  },
  signupDropdownOpen(state) {
    return state.pageConfig.dropdowns.signupDropdown;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
