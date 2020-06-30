<template>
  <div @click="toggleDropdowns($event)">
    <header id="header">
      <router-link to="/" class="nav-cell" id="homeLink">
        Rmhdidt
      </router-link>
      <span v-if="!user.userId" class="nav-grouping">
        <a id="loginDropdownTrigger" href="#" class="nav-cell">
          Login
        </a>
        <a id="signupDropdownTrigger" href="#" class="nav-cell">
          Signup
        </a>
      </span>
      <span v-if="user.userId" class="nav-grouping">
        <router-link to="/user/content" class="nav-cell">
          Content
        </router-link>
        <a id="logoutTrigger" href="#" class="nav-cell">
          Logout
        </a>
      </span>
    </header>
    <transition name="overlay-transition" @enter="animateDropdown = true">
      <div id="overlay" v-if="overlayActive" class="overlay"></div>
    </transition>
    <div class="dropdown">
      <login-dropdown />
      <signup-dropdown />
    </div>
  </div>
</template>

<script>
  import Login from "../auth/Login.vue";
  import Signup from "../auth/Signup.vue";

  export default {
    components: {
      "login-dropdown": Login,
      "signup-dropdown": Signup
    },
    computed: {
      overlayActive() {
        return this.$store.getters.overlay;
      },
      user() {
        return this.$store.getters.user;
      }
    },
    methods: {
      toggleDropdowns(event) {
        if (event.target.id === "logoutTrigger") {
          this.$store.dispatch("logoutUser");
        } else {
          this.$store.dispatch("changeConfig", event.target.id);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";

  #header {
    height: 2rem;
    display: flex;
    position: relative;
    z-index: 20;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: map-get($colors, main);
    padding: 0 4rem;
    border: 0.5px solid map-get($colors, default-border);
    border-top: none;
    border-radius: 0 0 0.25rem 0.25rem;

    @media (max-width: $minimum-min-width) {
      justify-content: center;
    }

    .nav-grouping {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      height: 100%;
    }

    .nav-cell {
      height: 100%;
      padding: 0 0.5rem;
      display: flex;
      align-items: center;
      text-decoration: none;
      color: map-get($colors, secondary-text);
      transition: background-color 250ms;

      &:hover,
      &:active {
        color: map-get($colors, default-text);
        background-color: map-get($colors, default-border);
      }
    }

    @media (max-width: $content-min-width) {
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
  }

  .overlay {
    position: fixed;
    z-index: 5;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(125, 125, 125, 0.5);
  }

  .overlay-transition-enter {
    opacity: 0;
  }

  .overlay-transition-enter-active {
    transition: opacity $default-dropdown-animation-duration;
  }

  .overlay-transition-leave-to {
    opacity: 0;
  }

  .overlay-transition-leave-active {
    transition: opacity $default-dropdown-animation-duration;
  }

  .dropdown {
    position: relative;
    z-index: 10;
  }
</style>