export const state = () => ({})

export const mutations = {}

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
        commit('setBusy', false, { root: true })
        commit('setJobDone', true, { root: true })
      })
      .catch((error) => console.log(error))
  }
}

export const getters = {}
