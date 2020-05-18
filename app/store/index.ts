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
  setUser(state: { user: any }, payload: any) {
    state.user = payload;
  },
  setError(state: { error: any }, payload: any) {
    state.error = payload;
  },
  clearError(state: { error: null }) {
    state.error = null;
  },
  setBusy(state: { busy: any }, payload: any) {
    state.busy = payload;
  },
  setJobDone(state: { jobDone: any }, payload: any) {
    state.jobDone = payload;
  }
};

// 非同期通信や外部APIとのやりとりを行う
// 最終的にmutationを呼び出すために使われる
export const actions = {
  signUpUser(
    { commit }: any,
    payload: { email: any; password: any; displayName: any }
  ) {
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
      .then(
        (data: {
          user: {
            updateProfile: (arg0: { displayName: any }) => Promise<any>;
            uid: any;
            email: any;
            displayName: any;
          } | null;
        }) => {
          newUser = data.user;
          // ここでアカウント名(displayName)を登録
          return data.user
            .updateProfile({
              displayName: payload.displayName
            })
            .then(() => {
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
        }
      )
      .then(() => {
        // ユーザーをデータベース(Firestore)に登録
        // (主にデータ⽤)
        const userRef = db.collection("users").doc(newUser.uid); // ここでしかnewUser使ってないの謎
        return userRef.set({
          email: payload.email,
          name: payload.displayName,
          createdAt: new Date().toISOString()
        });
      })
      .catch((error: any) => {
        commit("setBusy", false);
        commit("setError", error);
      });
  },
  loginUser({ commit }: any, payload: { email: any; password: any }) {
    commit("setBusy", true);
    commit("clearError");
    this.$fireApp
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then((data: { user: { uid: any; email: any; displayName: any } }) => {
        const authUser = {
          id: data.user.uid,
          email: data.user.email,
          name: data.user.displayName
        };
        commit("setUser", authUser);
        commit("setJobDone", true);
        commit("setBusy", false);
      })
      .catch((error: any) => {
        commit("setBusy", false);
        commit("setError", error);
      });
  },
  logOut({ commit }) {
    this.$fireApp.auth().signOut();
    commit("setUser", null);
  }
};

// stateの一部やstateから返された値を保持する
// 算出プロパティ(computed) のイメージに近い
export const getters = {
  user(state: { user: any }) {
    return state.user;
  },
  loginStatus(state: { user: null | undefined }) {
    return state.user !== null && state.user !== undefined;
  },
  error(state: { error: any }) {
    return state.error;
  },
  busy(state: { busy: any }) {
    return state.busy;
  },
  jobDone(state: { jobDone: any }) {
    return state.jobDone;
  }
};
