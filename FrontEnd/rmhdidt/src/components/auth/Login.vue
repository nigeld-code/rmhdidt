<template>
  <div id="loginForm">
    <transition name="dropdown-transition">
      <div class="loginDropdown-content" v-if="loginDropdown">
        <form @submit.prevent="onSubmit">
          <div style="font-size: 1.8rem; padding-bottom: 0.5rem;">
            Login
          </div>
          <div class="input">
            <label for="email">Email: </label>
            <input
              type="text"
              id="email"
              ref="email"
              v-model.trim="$v.inputData.email.$model"
              placeholder="Email"
            />
            <div v-if="$v.inputData.email.$error" class="form-error">
              <div v-if="!$v.inputData.email.required">Email is required</div>
            </div>
          </div>
          <div class="input">
            <label for="password">Password: </label>
            <input
              type="password"
              id="password"
              v-model="$v.inputData.password.$model"
              placeholder="Password"
            />
            <div v-if="$v.inputData.password.$error" class="form-error">
              <div v-if="!$v.inputData.password.required">
                Password is required
              </div>
            </div>
            <div v-if="$store.getters.loginError" class="form-error">
              Invalid email and/or password
            </div>
          </div>
          <div class="submit">
            <button type="submit" class="submit-btn">Login</button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
  import { required } from "vuelidate/lib/validators";

  export default {
    data() {
      return {
        inputData: {
          email: "",
          password: ""
        }
      };
    },
    validations: {
      inputData: {
        email: {
          required
        },
        password: {
          required
        }
      }
    },
    computed: {
      loginDropdown() {
        return this.$store.getters.loginDropdownOpen;
      }
    },
    methods: {
      onSubmit() {
        this.$v.inputData.$touch();
        if (!this.$v.inputData.$invalid) {
          this.$store.dispatch("loginUser", this.inputData).then(success => {
            if (success) {
              this.$store.dispatch("changeConfig", "submit");
              this.$store.dispatch("loginErrorToggle", false);
              if (!this.$store.getters.allTiles) {
                this.$store.dispatch("loadTiles");
              }
              this.inputData.email = "";
              this.inputData.password = "";
              this.$v.inputData.$reset();
            }
          });
        }
      }
    },
    watch: {
      loginDropdown() {
        if (this.loginDropdown && !this.inputData.email) {
          this.$nextTick(() => this.$refs.email.focus());
        }
        if (!this.loginDropdown) {
          this.$store.dispatch("loginErrorToggle", false);
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";
  @import url("https://fonts.googleapis.com/css?family=Sansita:400,700&display=swap");

  #loginForm {
    text-align: center;

    .input {
      margin: 0.5rem;
    }

    .loginDropdown-content {
      position: absolute;
      right: 4rem;
      width: 320px;
      color: map-get($colors, secondary-text);
      background-color: map-get($colors, default-border);
      border: 2px solid map-get($colors, secondary-text);
      border-top: none;
      border-radius: 0 0 0.25rem 0.25rem;
      padding: 1rem;

      @media (max-width: $dropdown-min-width) {
        left: 1.75rem;
        right: 1.75rem;
        width: auto;
      }
    }

    .input {
      label {
        display: none;
      }

      input[type="text"],
      input[type="password"] {
        width: 100%;
        padding: 1rem;
        margin: 0.5rem 0;
        display: block;
        border: 1px solid map-get($colors, secondary-text);
        border-radius: 5px;
        color: map-get($colors, secondary-text);
        font-family: "Sansita";
        font-size: 1rem;

        &:focus {
          outline: none;
          border: 1.5px solid map-get($colors, secondary-text);
        }
      }
    }

    .form-error {
      color: map-get($colors, error-text);
    }

    .submit-btn {
      display: inline-block;
      border-radius: 5px;
      background-color: map-get($colors, main);
      border: 2px solid map-get($colors, secondary-text);
      color: map-get($colors, secondary-text);
      text-align: center;
      cursor: pointer;
      font-family: "Sansita";
      font-size: 1.2rem;
      padding: 0.5rem 1.5rem;
      padding-bottom: 0.8rem;

      &:focus {
        outline: none;
        background-color: map-get($colors, secondary-text);
        color: map-get($colors, main);
      }

      &:hover {
        background-color: map-get($colors, secondary-text);
        color: map-get($colors, main);
      }
    }

    .dropdown-transition-enter,
    .dropdown-transition-leave-to {
      transform: translateY(-100%);
    }

    .dropdown-transition-enter-active {
      transition: transform $default-dropdown-animation-duration ease-in-out;
    }

    .dropdown-transition-enter-to,
    .dropdown-transition-leave {
      transform: translateY(0);
    }

    .dropdown-transition-leave-active {
      transition: transform $default-dropdown-animation-duration ease-in;
    }
  }
</style>