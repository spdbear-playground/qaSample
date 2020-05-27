import Vue from "vue";
export default Vue.extend({
  methods: {
    removeErrors() {
      this.$validator.reset();
      this.$accessor.clearError;
    }
  },
  computed: {
    error() {
      return this.$accessor.error;
    },
    busy() {
      return this.$accessor.busy;
    },
    jobDone() {
      return this.$accessor.jobDone;
    },
    isLogin() {
      const loggedIn = this.$accessor.loginStatus;
      if (loggedIn) {
        return true;
      } else {
        return false;
      }
    }
  },
  watch: {
    jobDone(value) {
      if (value) {
        this.$accessor.setJobDone(false);
        this.jobsDone();
      }
    }
  }
});
