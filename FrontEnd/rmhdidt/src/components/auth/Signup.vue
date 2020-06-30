<template>
  <div id="signupForm">
    <transition name="dropdown-transition">
      <div class="signupDropdown-content" v-if="signupDropdown">
        <form @submit.prevent class="signup-form">
          <transition name="form-transition" mode="out-in">
            <div key="formPage1" v-if="inputPage === 0">
              <div style="font-size: 1.8rem; padding-bottom: 0.5rem;">
                Signup
              </div>
              <div class="input">
                <label for="username">Username: </label>
                <input
                  type="text"
                  ref="username"
                  id="username"
                  v-model.trim.lazy="$v.inputData.username.$model"
                />
              </div>
              <div v-if="$v.inputData.username.$error" class="form-error">
                <div v-if="!$v.inputData.username.required">
                  Username is Required
                </div>
                <div
                  v-if="
                    !$v.inputData.username.minLength ||
                      !$v.inputData.username.maxLength
                  "
                >
                  Username must between
                  {{ $v.inputData.username.$params.minLength.min }} and
                  {{ $v.inputData.username.$params.maxLength.max }} characters
                  in length
                </div>
                <div v-if="!$v.inputData.username.alphaNum">
                  Username can only accept letters and numbers
                </div>
              </div>
              <div class="input">
                <label for="email">Email: </label>
                <input
                  type="text"
                  id="email"
                  v-model.lazy="$v.inputData.email.$model"
                />
              </div>
              <div v-if="$v.inputData.email.$error" class="form-error">
                <div v-if="!$v.inputData.email.required">
                  Email is Required
                </div>
                <div v-if="!$v.inputData.email.email">
                  Must be a vaild email
                </div>
              </div>
              <div class="input">
                <label for="password">Password: </label>
                <input
                  type="password"
                  id="password"
                  v-model.lazy="$v.inputData.password.$model"
                />
              </div>
              <div v-if="$v.inputData.password.$error" class="form-error">
                <div v-if="!$v.inputData.password.required">
                  Password is Required
                </div>
                <div
                  v-if="
                    !$v.inputData.password.minLength ||
                      !$v.inputData.password.maxLength
                  "
                >
                  Password must between
                  {{ $v.inputData.password.$params.minLength.min }} and
                  {{ $v.inputData.password.$params.maxLength.max }} characters
                  in length
                </div>
                <div
                  v-if="
                    !$v.inputData.password.strongPassword &&
                      $v.inputData.password.required
                  "
                >
                  Password must contain upper and lower case letters and numbers
                </div>
                <div v-if="!$v.inputData.username.alphaNum">
                  Username can only accept letters and numbers
                </div>
              </div>
              <div class="input">
                <label for="confirmPassword">Confirm Password: </label>
                <input
                  type="password"
                  id="confirmPassword"
                  v-model.lazy="$v.inputData.confirmPassword.$model"
                />
              </div>
              <div
                v-if="$v.inputData.confirmPassword.$error"
                class="form-error"
              >
                <div v-if="!$v.inputData.confirmPassword.sameAsPassword">
                  Passwords don't match
                </div>
              </div>
              <div class="input">
                <label for="secretPin">Signup PIN: </label>
                <input
                  type="password"
                  id="secretPin"
                  v-model="$v.inputData.secretPin.$model"
                />
              </div>
              <div
                v-if="$v.inputData.secretPin.$error"
                class="form-error"
                style="padding-bottom: 1rem;"
              >
                <div v-if="!$v.inputData.secretPin.required">
                  Signup PIN required
                </div>
              </div>
            </div>
            <div key="formPage2" v-if="inputPage === 1">
              <div class="signup-welcome">
                Welcome,<br />
                <div style="font-size: 2rem; padding: 0.5rem;">
                  {{ signupUser.username }}
                </div>
                Please check your ({{ signupUser.email }}) inbox to verify your
                email and to complete signing up to Rmhdidt!
              </div>
            </div>
          </transition>
          <div key="btn1" v-if="inputPage === 0">
            <div v-if="signupErrors" class="form-error" style="padding-bottom: 1rem;">
              {{ signupErrors.errors }}
            </div>
            <button class="signup-btn" @click="signupBtnClick">
              Signup
            </button>
          </div>
          <div key="btns2" v-if="inputPage === 1">
            <button class="signup-btn" @click="closeSignup">
              Close
            </button>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
  import {
    required,
    minLength,
    maxLength,
    alphaNum,
    email,
    sameAs
  } from "vuelidate/lib/validators";

  export default {
    data() {
      return {
        inputData: {
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          secretPin: ""
        },
        inputPage: 0
      };
    },
    validations: {
      inputData: {
        username: {
          required,
          minLength: minLength(4),
          maxLength: maxLength(30),
          alphaNum
        },
        email: {
          required,
          email
        },
        password: {
          required,
          minLength: minLength(6),
          maxLength: maxLength(30),
          strongPassword(password) {
            return (
              /[a-z]/.test(password) &&
              /[A-Z]/.test(password) &&
              /[0-9]/.test(password)
            );
          }
        },
        confirmPassword: {
          required,
          sameAsPassword: sameAs("password")
        },
        secretPin: {
          required
        }
      }
    },
    computed: {
      signupDropdown() {
        return this.$store.getters.signupDropdownOpen;
      },
      signupUser() {
        return this.$store.getters.signupUser;
      },
      signupErrors() {
        return this.$store.getters.signupError;
      }
    },
    methods: {
      signupBtnClick() {
        this.$v.inputData.$touch();
        if (!this.$v.inputData.$invalid) {
          this.$store.commit("CLEAR_SIGNUP_USER");
          this.$store.dispatch("createUser", this.inputData).then(success => {
            if (success) {
              this.inputPage = 1;
              this.inputData = {};
              this.$v.inputData.$reset();
            }
          });
        }
      },
      closeSignup() {
        this.$store.dispatch("changeConfig", "submit");
      }
    },
    watch: {
      signupDropdown() {
        this.inputPage = 0;
        if (this.signupDropdown && !this.inputData.username) {
          this.$nextTick(() => this.$refs.username.focus());
        }
      }
    }
  };
</script>

<style lang="scss">
  @import "../../styles/_variables";
  @import url("https://fonts.googleapis.com/css?family=Sansita:400,700&display=swap");

  #signupForm {
    text-align: center;

    .input {
      margin: 0.5rem;
    }

    .signupDropdown-content {
      position: absolute;
      right: 4rem;
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

    .signup-form {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 32rem;

      @media (max-width: $dropdown-min-width) {
        width: auto;
      }
    }

    .input {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;

      label {
        font-size: 1.2rem;
        margin: 0 1rem;
      }

      input[type="text"],
      input[type="password"] {
        width: 300px;
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
          margin: calc(0.5rem - 0.75px) 0;
          border: 1.5px solid map-get($colors, secondary-text);
        }

        @media (max-width: $dropdown-min-width) {
          width: 100%;
        }
      }
    }

    .form-error {
      color: map-get($colors, error-text);
    }

    .signup-welcome {
      padding: 2rem;
      text-align: center;
    }

    .signup-btn {
      display: inline-block;
      border-radius: 5px;
      background-color: map-get($colors, main);
      border: 2px solid map-get($colors, secondary-text);
      color: map-get($colors, secondary-text);
      text-align: center;
      cursor: pointer;
      font-family: "Sansita";
      font-size: 1.2rem;
      margin: 0 0.25rem;
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

    .dropdown-transition-leave-to,
    .form-transition-leave-to,
    .dropdown-transition-enter {
      transform: translateY(-100%);
    }

    .form-transition-enter {
      transform: translateX(100%);
    }

    .form-transition-enter-to,
    .form-transition-leave {
      transform: translateX(0);
    }

    .form-transition-enter-active,
    .form-transition-leave-active {
      transition: all 0.5s ease-in-out;
      transition-property: transform;
    }
  }
</style>