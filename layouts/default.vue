<template>
  <div>
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img
            src="https://bulma.io/images/bulma-logo.png"
            width="112"
            height="28"
          />
        </a>
      </div>
      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/">ホーム</nuxt-link>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <!-- ここにログインボタンを入れる -->
              <nuxt-link v-if="!isLogin" class="button is-light" to="/login"
                >ログイン</nuxt-link
              >
              <nuxt-link v-else class="button is-light" to="/mypage"
                >{{ userName }}さん</nuxt-link
              >
              <nuxt-link class="button is-primary" to="/signup">
                <strong>アカウント作成</strong></nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="main-body">
      <!-- ここがページのレンダリング要素 -->
      <nuxt />
    </div>

    <footer class="footer">
      <div>
        <div class="content has-text-centered">
          <p>&copy; qaSample</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
export default {
  computed: {
    isLogin() {
      const loggedIn = this.$store.getters.loginStatus;
      if (loggedIn) {
        return true;
      } else {
        return false;
      }
    },
    userName() {
      return this.$store.getters.user ? this.$store.getters.user.name : "";
    }
  },
  created() {
    this.$fireApp.auth().onAuthStateChanged(user => {
      if (user) {
        const authUser = {
          id: user.uid,
          email: user.email,
          name: user.displayName
        };
        this.setUser(authUser);
      }
    });
  },
  methods: {
    ...mapMutations({
      setUser: "setUser"
    })
  }
};
</script>

<style>
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}
</style>
