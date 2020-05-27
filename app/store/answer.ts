import { mutationTree, actionTree, getterTree } from "typed-vuex";
import fireApp from "~/plugins/firebase";
import uniqStr from "~/plugins/uniqStr";

type AnswerType = {
  createdAt: string;
  id: string;
  title: string;
  userRef: firebase.firestore.DocumentReference<
    firebase.firestore.DocumentData
  >;
  updateAt?: string;
};

type AnswersType = {
  [key: string]: {
    answer: AnswerType;
  };
};

type StateType = () => {
  answers: AnswersType[];
};

export const state: StateType = () => ({
  answers: []
});

export const getters = getterTree(state, {
  answersAll(state) {
    return state.answers;
  }
});

export const mutations = mutationTree(state, {
  setAnswersAll(state, payload: AnswersType[]) {
    state.answers = payload;
  }
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async addAnswer(
      { commit, dispatch },
      payload: { questionId: string; answer: string; userId: string }
    ) {
      commit("setBusy", true, { root: true });
      commit("clearError", null, { root: true });
      const db = fireApp.firestore();
      // 質問を登録
      const answerRef = db.collection("answers").doc(payload.questionId);
      let pushData = {};
      const uniqID = uniqStr();
      pushData[uniqID] = {
        id: uniqID,
        title: payload.answer,
        userRef: db.collection("users").doc(payload.userId),
        createdAt: new Date().toISOString()
      };
      answerRef
        .set({ answer: pushData }, { merge: true })
        .then(() => {
          dispatch("fetchAnswersAll", payload.questionId);
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        })
        .catch((error: Error) => console.log(error));
    },
    async fetchAnswersAll({ commit }, questionId: string) {
      const db = fireApp.firestore();
      // 登録した全データを取得
      const answers: AnswersType[] = [];
      await db
        .collection("answers")
        .doc(questionId)
        .get()
        .then(doc => {
          if (doc.data() && doc.data()?.answer) {
            const answerObj = doc.data()?.answer;
            for (const key of Object.keys(answerObj)) {
              answers.push(answerObj[key]);
            }
          }
        });
      // storeのデータを作成
      const storeData: AnswersType[] = [];
      for (let i = 0; i < answers.length; i++) {
        const answer = answers[i];
        // リレーションデータの取得
        const userQuerySnapshot = await answer.userRef.get();
        const userID = await answer.userRef.id;
        storeData.push({
          title: answer && answer.title,
          id: answer && answer.id,
          createdAt: answer && answer.createdAt,
          user: {
            ...userQuerySnapshot.data(),
            id: userID
          }
        });
      }
      commit("setAnswersAll", storeData);
    },
    async updateAnswer(
      { commit, dispatch },
      payload: { questionId: string; answerId: string; updateText: string }
    ) {
      commit("setBusy", true, { root: true });
      commit("clearError", null, { root: true });
      const db = fireApp.firestore();

      const docRef = db.collection("answers").doc(payload.questionId);
      await docRef
        .get()
        .then(doc => {
          const data = doc.data()?.answer;
          data[payload.answerId] = {
            ...data[payload.answerId],
            title: payload.updateText,
            updateAt: new Date().toISOString()
          };
          docRef.update({ answer: data });
        })
        .then(() => {
          console.log("Document successfully updated!");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
      dispatch("fetchAnswersAll", payload.questionId);
    },
    async removeAnswer(
      { commit, dispatch },
      payload: { questionId: string; answerId: string }
    ) {
      commit("setBusy", true, { root: true });
      commit("clearError", null, { root: true });
      const db = fireApp.firestore();
      const docRef = await db.collection("answers").doc(payload.questionId);
      await docRef
        .get()
        .then(doc => {
          const data = doc.data()?.answer;
          delete data[payload.answerId];
          docRef.update({ answer: data });
        })
        .then(() => {
          console.log("Document successfully removed!");
          commit("setBusy", false, { root: true });
          commit("setJobDone", true, { root: true });
        });
      dispatch("fetchAnswersAll", payload.questionId);
    }
  }
);
