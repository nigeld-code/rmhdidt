import { axiosAPI } from '../helpers/axiosAPI';

const state = {
  user: {},
  loginError: false,
  signupUser: {},
  signupError: {}
};

const mutations = {
  LOAD_USER(state, userData) {
    state.user = userData;
  },
  LOAD_LOGIN_ERROR(state, loginError) {
    state.loginError = loginError;
  },
  LOAD_SIGNUP_USER(state, signupUserData) {
    state.signupUser = signupUserData;
  },
  CLEAR_SIGNUP_USER(state) {
    state.signupUser = {};
  },
  LOAD_SIGNUP_ERROR(state, signupErrorData) {
    state.signupError = signupErrorData;
  },
  LOGOUT_USER(state) {
    state.user = {};
  }
};

const actions = {
  loginUser: ({ commit, dispatch }, userInput) => {
    return axiosAPI({
      query: `
        query login($email: String!, $password: String!) {
          loginUser(email: $email, password: $password) {
            userId
            username
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: userInput.email,
        password: userInput.password
      }
    })
      .then(res => {
        if (res.data.errors) {
          dispatch('loginErrorToggle', true);
          return false;
        }
        commit('LOAD_USER', res.data.data.loginUser);
        return true;
      })
      .catch(err => console.log(err));
  },
  createUser: ({ commit }, userInput) => {
    return axiosAPI({
      query: `
        mutation signup($username: String!, $email: String!, $password: String!, $secretPin: String!) {
          createUser(userInput: {username: $username, email: $email, password: $password, secretPin: $secretPin}) {
            username
            email
          }
        }
      `,
      variables: {
        username: userInput.username,
        email: userInput.email,
        password: userInput.password,
        secretPin: userInput.secretPin
      }
    })
      .then(res => {
        if (res.data.errors) {
          const signupErrors = {
            errors: ''
          };
          res.data.errors.forEach(error => {
            signupErrors.errors += error.message;
          });
          commit('LOAD_SIGNUP_ERROR', signupErrors);
          return false;
        }
        commit('LOAD_SIGNUP_USER', res.data.data.createUser);
        commit('LOAD_SIGNUP_ERROR', null);
        return true;
      })
      .catch(err => console.log(err));
  },
  loginErrorToggle: ({ commit }, toggle) => {
    commit('LOAD_LOGIN_ERROR', toggle);
  },
  logoutUser: ({ commit }) => {
    commit('LOGOUT_USER');
  }
};

const getters = {
  user(state) {
    return state.user;
  },
  loginError(state) {
    return state.loginError;
  },
  signupUser(state) {
    return state.signupUser;
  },
  signupError(state) {
    return state.signupError;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
