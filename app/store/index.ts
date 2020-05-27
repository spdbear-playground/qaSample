import {
  getAccessorType,
  mutationTree,
  actionTree,
  getterTree
} from "typed-vuex";

import fireApp from "~/plugins/firebase";
import * as answer from "./answer";
import * as question from "./question";

// アプリケーションの状態（情報）
// dataオプションのイメージに近い
type userType = {
  id: string;
  createdAt: string;
  email: string;
  name: string;
};

type stateType = () => {
  user: null | userType;
  error: null | Error;
  busy: boolean;
  jobDone: boolean;
};

export const state: stateType = () => ({
  user: null,
  error: null,
  busy: false,
  jobDone: false
});

// stateの一部やstateから返された値を保持する
// 算出プロパティ(computed) のイメージに近い
export const getters = getterTree(state, {
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
});

// stateを更新（変化）させる
// 原則としてstateの更新はここだけで行う
// すべて同期的な処理にする必要がある
export const mutations = mutationTree(state, {
  setUser(state, payload: userType | null) {
    state.user = payload;
  },
  setError(state, payload: Error) {
    state.error = payload;
  },
  clearError(state) {
    state.error = null;
  },
  setBusy(state, payload: boolean) {
    state.busy = payload;
  },
  setJobDone(state, payload: boolean) {
    state.jobDone = payload;
  }
});

// 非同期通信や外部APIとのやりとりを行う
// 最終的にmutationを呼び出すために使われる
export const actions = actionTree(
  { state, getters, mutations },
  {
    signUpUser(
      { commit },
      payload: { email: string; password: string; displayName: string }
    ) {
      commit("setBusy", true);
      commit("clearError");
      let newUser: firebase.User | null = null;
      // 新規ユーザーの登録(firestoreのauth)
      // DBの呼び出し
      const db = fireApp.firestore();
      // injectを利用してfireAppを呼び出している
      // nuxt.config.js に書いたとおり
      fireApp
        .auth()
        .createUserWithEmailAndPassword(payload.email, payload.password)
        .then(async data => {
          newUser = data.user;
          // ここでアカウント名(displayName)を登録
          await data.user?.updateProfile({
            displayName: payload.displayName
          });
          const authUser = {
            id: data.user?.uid,
            email: data.user?.email,
            name: data.user?.displayName
          };
          // サインアップ処理の終了をmutationに伝える
          commit("setUser", authUser);
          commit("setJobDone", true);
          commit("setBusy", false);
        })
        .then(() => {
          // ユーザーをデータベース(Firestore)に登録
          // (主にデータ⽤)
          const userRef = db.collection("users").doc(newUser?.uid); // ここでしかnewUser使ってないの謎
          return userRef.set({
            email: payload.email,
            name: payload.displayName,
            createdAt: new Date().toISOString()
          });
        })
        .catch((error: Error) => {
          commit("setBusy", false);
          commit("setError", error);
        });
    },
    loginUser({ commit }: any, payload: { email: string; password: string }) {
      commit("setBusy", true);
      commit("clearError");
      fireApp
        .auth()
        .signInWithEmailAndPassword(payload.email, payload.password)
        .then(data => {
          const authUser = {
            id: data.user?.uid,
            email: data.user?.email,
            name: data.user?.displayName
          };
          commit("setUser", authUser);
          commit("setJobDone", true);
          commit("setBusy", false);
        })
        .catch((error: Error) => {
          commit("setBusy", false);
          commit("setError", error);
        });
    },
    logOut({ commit }) {
      fireApp.auth().signOut();
      commit("setUser", null);
    }
  }
);

export const accessorType = getAccessorType({
  state,
  mutations,
  actions,
  getters,
  modules: {
    question,
    answer
  }
});
