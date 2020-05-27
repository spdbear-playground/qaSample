<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">サインアップ</h5>
      <hr />
      <div class="columns is-centered is-mobile">
        <div class="column is-half-desktop is-full-mobile is-full-tablet">
          <!-- @submit は v-on:submitのこと
          .preventはイベント修飾子で、Event.preventDefault()が呼び出される
          ここではsubmit標準の意図しない画面遷移、画面更新を避けるのが目的-->
          <form @submit.prevent="onSignUp">
            <div class="field">
              <label class="label">Name</label>
              <div class="control">
                <!-- 
                  v-validateで指定した条件に合わない場合、errors.has('input.name')がtrueになる
                  classはオブジェクト構文で、valueがtrueであればkeyのclassが適用される -->
                <input
                  v-model="displayName"
                  v-validate="'required|min:4'"
                  class="input"
                  type="text"
                  name="displayName"
                  :class="{ 'is-danger': errors.has('displayName') }"
                />
                <p v-show="errors.has('displayName')" class="help is-danger">
                  {{ errors.first("displayName") }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">Email</label>
              <div class="control">
                <input
                  v-model="email"
                  v-validate="'required|email'"
                  class="input"
                  type="email"
                  name="email"
                  :class="{ 'is-danger': errors.has('email') }"
                />
                <p v-show="errors.has('email')" class="help is-danger">
                  {{ errors.first("email") }}
                </p>
              </div>
            </div>
            <div class="field">
              <label class="label">Password</label>

              <div class="control">
                <input
                  v-model="password"
                  v-validate="'required|min:6'"
                  class="input"
                  type="password"
                  name="password"
                  :class="{ 'is-danger': errors.has('password') }"
                />
                <p v-show="errors.has('password')" class="help is-danger">
                  {{ errors.first("password") }}
                </p>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button
                  class="button is-primary"
                  :class="{ 'is-loading': busy }"
                  :disabled="busy"
                >
                  Signup
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import apiJobMixin from "@/mixins/apiJobMixin";
export default Vue.extend({
  mixins: [apiJobMixin],
  data(): { displayName: string; email: string; password: string } {
    return {
      displayName: "",
      email: "",
      password: ""
    };
  },
  methods: {
    onSignUp() {
      this.$validator.validateAll().then(result => {
        if (result) {
          const signUpData = {
            displayName: this.displayName,
            email: this.email,
            password: this.password
          };
          this.$accessor.signUpUser(signUpData);
        }
      });
    },
    jobsDone() {
      this.removeErrors();
      this.$router.replace("/");
    }
  }
});
</script>
