export const state = () => ({
  answers: []
})

export const mutations = {
  setAnswersAll(state, payload) {
    state.answers = payload
  }
}

export const actions = {
  async addAnswer({ commit, state, dispatch }, payload) {
    commit('setBusy', true, { root: true })
    commit('clearError', null, { root: true })
    const db = this.$fireApp.firestore()
    // 質問を登録
    const answerRef = db.collection('answers').doc(payload.questionId)
    const pushData = {}
    const uniqID = this.$uniqStr()
    pushData[uniqID] = {
      id: uniqID,
      title: payload.answer,
      userRef: await db.collection('users').doc(payload.userId),
      createdAt: new Date().toISOString()
    }
    answerRef
      .set({ answer: pushData }, { merge: true })
      .then(() => {
        dispatch('fetchAnswersAll', payload.questionId)
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => console.log(error))
  },
  async fetchAnswersAll({ commit, state }, questionId) {
    const db = this.$fireApp.firestore()
    // 登録した全データを取得
    const answers = []
    await db
      .collection('answers')
      .doc(questionId)
      .get()
      .then((doc) => {
        if (doc.data() && doc.data().answer) {
          const answerObj = doc.data().answer
          for (const key of Object.keys(answerObj)) {
            answers.push(answerObj[key])
          }
        }
      })
    // storeのデータを作成
    const storeData = []
    for (let i = 0; i < answers.length; i++) {
      const answer = answers[i]
      // リレーションデータの取得
      const userQuerySnapshot = await answer.userRef.get()
      const userID = await answer.userRef.id
      storeData.push({
        title: answer && answer.title,
        id: answer && answer.id,
        createdAt: answer && answer.createdAt,
        user: {
          ...userQuerySnapshot.data(),
          id: userID
        }
      })
    }
    commit('setAnswersAll', storeData)
  }
}

export const getters = {
  answersAll(state) {
    return state.answers
  }
}
