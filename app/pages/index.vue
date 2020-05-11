<template>
  <div>
    <section class="section no-top pad">
      <div class="columns is-centered is-mobile">
        <div
          v-if="isLogin"
          class="column is-half-desktop is-full-mobile is-full-tablet"
        >
          <form @submit.prevent="onQuestion">
            <div class="field">
              <label class="label">あなたの質問は？</label>
              <div class="control">
                <textarea
                  v-model="question"
                  class="textarea"
                  placeholder="質問を入力してください"
                ></textarea>
              </div>
            </div>
            <div class="field">
              <div class="control">
                <button
                  class="button is-primary"
                  :class="{ 'is-loading': busy }"
                  :disabled="busy"
                >
                  質問する
                </button>
              </div>
            </div>
          </form>
        </div>
        <div v-else>アカウントを作成して質問をしましょう！</div>
      </div>
      <div class="is-centered is-mobile">
        <!-- ここに質問リストを入れる -->
        <QuestionList
          v-for="(q, index) in allQuestions"
          :key="index"
          :question="q"
        />
      </div>
    </section>
  </div>
</template>

<script>
import apiJobMixin from '@/mixins/apiJobMixin'
import QuestionList from '@/components/QuestionList'

export default {
  components: {
    QuestionList
  },
  mixins: [apiJobMixin],
  async fetch({ _, store }) {
    if (store.getters['question/questionsAll'].length > 0) {
      return
    }
    await store.dispatch('question/fetchQuestionsAll')
  },
  data() {
    return {
      question: '',
      questions: []
    }
  },
  computed: {
    allQuestions() {
      return this.$store.getters['question/questionsAll']
    }
  },
  methods: {
    onQuestion() {
      const userID = this.$store.getters.user.id
      const payload = {
        question: this.question,
        userId: userID
      }
      this.$store.dispatch('question/addQuestion', payload)
    },
    jobsDone() {
      console.log('job done')
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
