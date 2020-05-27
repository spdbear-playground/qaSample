import { mutationTree, actionTree, getterTree } from "typed-vuex";
import fireApp from "~/plugins/firebase";

type QuestionType = {
  createdAt: string;
  id: string;
  title: string;
  userRef: firebase.firestore.DocumentReference<
    firebase.firestore.DocumentData
  >;
};

type StateType = () => {
  questions: QuestionType[];
  question: QuestionType;
};

export const state: StateType = () => ({
  questions: [], // すべての質問データを格納する配列
  question: { createdAt: "", title: "", userRef: "" } // 1件の質問データ
});

export const getters = getterTree(state, {
  questionsAll(state) {
    return state.questions;
  },
  question(state) {
    return state.question;
  }
});

export const mutations = mutationTree(state, {
  setQuestionsAll(state, payload: QuestionType[]) {
    state.questions = payload;
  },
  setQuestion(state, payload: QuestionType) {
    state.question = payload;
  }
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    addQuestion(
      { commit, dispatch },
      payload: { question: string; userId: string }
    ) {
      commit("setBusy", true, {
        root: true
      });
      commit("clearError", null, {
        root: true
      });
      const db = fireApp.firestore();
      const questionRef = db.collection("questions");
      questionRef
        .add({
          title: payload.question,
          userRef: db.collection("users").doc(payload.userId),
          createdAt: new Date().toISOString()
        })
        .then(() => {
          dispatch("fetchQuestionsAll");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
    },
    async fetchQuestionsAll({ commit }, _payload) {
      const db = fireApp.firestore();

      // 登録した全データを管理
      const questions: QuestionType[] = [];
      const querySnapshot = await db.collection("questions").get();

      // 質問データをfetch
      querySnapshot.forEach(doc => {
        questions.push({
          id: doc.id, // 質問ごとのID
          ...doc.data()
        });
      });

      // storeのデータを作成
      const storeData: QuestionType[] = [];
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        // リレーションデータの取得
        const userQuerySnapshot = await q.userRef.get();
        const userID = await q.userRef.id;
        storeData.push({
          title: q && q.title,
          id: q && q.id,
          createdAt: q && q.createdAt,
          user: {
            ...userQuerySnapshot.data(),
            id: userID
          }
        });
      }
      commit("setQuestionsAll", storeData);
    },
    async updateQuestion(
      { commit, dispatch },
      payload: { id: string; updateText: string }
    ) {
      const db = fireApp.firestore();
      await db
        .collection("questions")
        .doc(payload.id)
        .update({
          title: payload.updateText,
          updateAt: new Date().toISOString()
        })
        .then(() => {
          console.log("Document successfully updated!");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
      dispatch("fetchQuestionsAll");
    },
    async removeQuestion({ commit, dispatch }, payload: string) {
      commit("setBusy", true, { root: true });
      commit("clearError", null, { root: true });
      const db = fireApp.firestore();
      await db
        .collection("questions")
        .doc(payload)
        .delete()
        .then(() => {
          console.log("Document successfully detele question!");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
      await db
        .collection("answers")
        .doc(payload)
        .delete()
        .then(() => {
          console.log("Document successfully delete answers!");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
      dispatch("fetchQuestionsAll");
    },
    async fetchQuestion({ commit }, questionId: string) {
      const db = fireApp.firestore();
      const querySnapshot = await db
        .collection("questions")
        .doc(questionId)
        .get();
      // リレーションのユーザデータを取得
      const userQuerySnapshot = await querySnapshot.data()?.userRef.get();
      // ユーザーIDを取得
      const userID = await querySnapshot.data()?.userRef.id;

      // 1件の質問データをmutationsにコミット
      commit("setQuestion", {
        title: querySnapshot.data()?.title,
        id: questionId,
        createdAt: querySnapshot.data()?.createdAt,
        user: {
          ...userQuerySnapshot.data(),
          id: userID
        }
      });
    }
  }
);
