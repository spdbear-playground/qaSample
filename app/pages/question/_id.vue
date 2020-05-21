<template>
  <section class="section no-top-pad">
    <div class="box">
      <article class="media">
        <div class="media-content">
          <div class="content">
            <p>
              <strong> {{ question.title }} </strong><br />
              <small>
                {{ question.user && question.user.name }}
              </small>
              <small>
                {{
                  this.$moment(question.createdAt).format(
                    "YYYY.MM.DD - hh:mm a"
                  )
                }}
              </small>
            </p>
          </div>
        </div>
      </article>
    </div>
    <div>
      <article class="media">
        <figure class="media-left">
          <p class="image is-48x48"></p>
        </figure>
        <div class="media-content">
          <div class="content">
            <!-- ここに回答が入る -->
            <AnswerList
              v-for="(a, index) in allAnswers"
              :key="index"
              :answer="a"
              :question-id="question.id"
            />
          </div>
        </div>
      </article>
    </div>
    <!-- ここに回答の入力が入る -->
    <br />
    <article class="media">
      <div v-if="isLogin" class="media-content">
        <div class="field">
          <p class="control">
            <textarea
              v-model="answer"
              class="textarea"
              placeholder="回答を入力してください"
            ></textarea>
          </p>
        </div>
        <div class="field">
          <p class="control">
            <button class="button" @click="onAnswer">質問に回答</button>
          </p>
        </div>
      </div>
      <div v-else>
        アカウントを作成して質問に回答しましょう！
      </div>
    </article>
  </section>
</template>

<script lang="ts">
import apiJobMixin from "@/mixins/apiJobMixin";
import AnswerList from "@/components/AnswerList.vue";
import Vue from "vue";
export default Vue.extend({
  components: {
    AnswerList
  },
  mixins: [apiJobMixin],
  async fetch({ route, store }) {
    // URLから質問IDを取得
    const questionId = route.params.id;
    // アクションにdispatch
    await store.dispatch("question/fetchQuestion", questionId);
    await store.dispatch("answer/fetchAnswersAll", questionId);
  },
  data(): { answer: string } {
    return {
      answer: ""
    };
  },
  computed: {
    question() {
      return this.$store.getters["question/question"];
    },
    allAnswers() {
      return this.$store.getters["answer/answersAll"];
    }
  },
  methods: {
    onAnswer() {
      this.$store.dispatch("answer/addAnswer", {
        answer: this.answer,
        userId: this.$store.getters.user.id,
        questionId: this.question.id
      });
    },
    jobsDone() {
      // console.log('job done')
    }
  }
});
</script>
