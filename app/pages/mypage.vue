<template>
  <div>
    <section class="section no-top-pad">
      <h5 class="title is-5">マイページ</h5>
      <hr />
      <div class="is-centered is-mobile">
        <div class="box">
          <p>{{ user.name }}</p>
          <p>{{ user.email }}</p>
        </div>
        <p class="button is-outlined" @click="logOut">ログアウト</p>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  computed: {
    user(): { name: string; email: string } {
      if (this.$accessor.user) {
        return this.$accessor.user;
      }
      return {
        name: "",
        email: ""
      };
    }
  },
  methods: {
    logOut() {
      this.$accessor.logOut;
      this.$router.push("/");
    }
  }
});
</script>
