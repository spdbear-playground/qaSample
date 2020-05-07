export const state = () => ({

});

export const mutations = {

};

export const actions = {
  addQuestion({
    commit,
    state,
    dispatch
  }, payload) {
    commit("setBusy", true, {
      root: true
    });
    commit("clearError", null, {
      root: true
    });
    const db = this.$fireApp.firestore();
    let questionRef = db.collection("questions");
    questionRef.add({
      title: payload.question,
      userRef: db.collection("users").doc(payload.userId),
      createdAt: new Date().toISOString()
    }).then(() => {
      commit("setBusy", false, {
        root: true
      });
      commit("setJobDone", true, {
        root: true
      });
    });
  }
}

export const getters = {

};
