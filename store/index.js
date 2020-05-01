// アプリケーションの状態（情報）
// dataオプションのイメージに近い
export const state = () => ({
  user: null,
  error: null,
  busy: false,
  jobDone: false
});

// stateを更新（変化）させる
// 原則としてstateの更新はここだけで行う
// すべて同期的な処理にする必要がある
export const mutations = {
  setUser(state, payload) {
    state.user = payload;
  },
  setError(state, payload) {
    state.error = payload;
  },
  clearError(state) {
    state.error = null;
  },
  setBusy(state, payload) {
    state.busy = payload;
  },
  setJobDone(state, payload) {
    state.jobDone = payload;
  }
};

// 非同期通信や外部APIとのやりとりを行う
// 最終的にmutationを呼び出すために使われる
export const actions = {
  signUpUser({
    commit
  }, payload) {
    commit("setBusy", true);
    commit("clearError");
    let newUser = null;
    // 新規ユーザーの登録(firestoreのauth)
    // DBの呼び出し
    const db = this.$fireApp.firestore();
    // injectを利用してfireAppを呼び出している
    // nuxt.config.js に書いたとおり
    this.$fireApp
      .auth()
      .createUserWithEmailAndPassword(payload.email, payload.password)
      .then(data => {
        newUser = data.user;
        // ここでアカウント名(displayName)を登録
        return data.user.updateProfile({
          displayName: payload.displayName
        }).then(() => {
          const authUser = {
            id: data.user.uid,
            email: data.user.email,
            name: data.user.displayName
          };
          // サインアップ処理の終了をmutationに伝える
          commit("setUser", authUser);
          commit("setJobDone", true);
          commit("setBusy", false);
        });
      })
      .then(() => {
        // ユーザーをデータベース(Firestore)に登録
        // (主にデータ⽤)
        let userRef = db.collection("users").doc(newUser.uid);
        return userRef.set({
          email: payload.email,
          name: payload.displayName,
          createdAt: new Date().toISOString()
        });
      })
      .catch(error => {
        commit("setBusy", false);
        commit("setError", error);
      });
  }
};

// stateの一部やstateから返された値を保持する
// 算出プロパティ(computed) のイメージに近い
export const getters = {
  user(state) {
    return state.user;
  },
  loginStatus(state) {
    return state.user !== null && state.user !== undefined;
  },
  error(state) {
    return state.error;
  },
  busy(state) {
    return state.busy;
  },
  jobDone(state) {
    return state.jobDone;
  }
};
