export const state = () => ({
  questions: [], // すべての質問データを格納する配列
  question: {} // 1件の質問データ
});

export const mutations = {
  setQuestionsAll(state: { questions: any }, payload: any) {
    state.questions = payload;
  },
  setQuestion(state: { question: any }, payload: any) {
    state.question = payload;
  }
};

export const actions = {
  addQuestion(
    { commit, _state, dispatch }: any,
    payload: { question: any; userId: any }
  ) {
    commit("setBusy", true, {
      root: true
    });
    commit("clearError", null, {
      root: true
    });
    const db = this.$fireApp.firestore();
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
  async fetchQuestionsAll({ commit, _state }: any, _payload: any) {
    const db = this.$fireApp.firestore();

    // 登録した全データを管理
    const questions = [];
    const querySnapshot = await db.collection("questions").get();

    // 質問データをfetch
    querySnapshot.forEach((doc: { id: any; data: () => any }) => {
      questions.push({
        id: doc.id, // 質問ごとのID
        ...doc.data()
      });
    });

    // storeのデータを作成
    const storeData = [];
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
    { commit, _state, dispatch }: any,
    payload: { id: any; updateText: any }
  ) {
    const db = this.$fireApp.firestore();
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
  async removeQuestion({ commit, _state, dispatch }: any, payload: any) {
    commit("setBusy", true, { root: true });
    commit("clearError", null, { root: true });
    const db = this.$fireApp.firestore();
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
  async fetchQuestion({ commit, _state }: any, questionId: any) {
    const db = this.$fireApp.firestore();
    const querySnapshot = await db
      .collection("questions")
      .doc(questionId)
      .get();
    // リレーションのユーザデータを取得
    const userQuerySnapshot = await querySnapshot.data().userRef.get();
    // ユーザーIDを取得
    const userID = await querySnapshot.data().userRef.id;

    // 1件の質問データをmutationsにコミット
    commit("setQuestion", {
      title: querySnapshot.data().title,
      id: questionId,
      createdAt: querySnapshot.data().createdAt,
      user: {
        ...userQuerySnapshot.data(),
        id: userID
      }
    });
  }
};

export const getters = {
  questionsAll(state: { questions: any }) {
    return state.questions;
  },
  question(state: { question: any }) {
    return state.question;
  }
};
