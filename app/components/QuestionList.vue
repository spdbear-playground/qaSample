<template>
  <article class="media">
    <div class="media-content">
      <div class="content">
        <nuxt-link :to="`/question/${question.id}`">
          <p>
            <strong>{{ question.title }}</strong>
          </p>
        </nuxt-link>
      </div>
      <nav class="level is-mobile">
        <div class="level-left">
          <p>
            <strong>@{{ question.user.name }}</strong>
            <small>
              {{
                this.$moment(question.createdAt).format("YYYY.MM.DD - h:mm a")
              }}
            </small>
          </p>
        </div>
        <!-- ここに編集・削除ボタンが入る -->
        <div v-if="isQuestionUser" class="level-left buttons">
          <a class="button is-small is-rounded" @click="toggleEditModal"
            >編集</a
          >
          <a class="button is-small is-rounded" @click="toggleRemoveModal"
            >削除</a
          >
        </div>
      </nav>
    </div>
    <!-- 編集・削除モーダルが入る -->
    <div :class="`modal ${removeModalActive ? 'is-active' : ''}`">
      <div class="modal-background" @click="toggleRemoveModal"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <p>削除しますか？</p>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="toggleRemoveModal">閉じる</button>
          <button
            class="button is-danger"
            @click="
              () => {
                removeQuestion(question.id);
              }
            "
          >
            削除する
          </button>
        </footer>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggleRemoveModal"
      ></button>
    </div>

    <div :class="`modal ${editModalActive ? 'is-active' : ''}`">
      <div class="modal-background" @click="toggleEditModal"></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <p>質問の編集</p>
          <textarea
            v-model="questionTitle"
            class="textarea"
            placeholder="質問を入力してください"
          ></textarea>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="toggleEditModal">閉じる</button>
          <button
            class="button is-primary"
            @click="
              () => {
                updateQuestion(question.id, questionTitle);
              }
            "
          >
            編集する
          </button>
        </footer>
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="toggleEditModal"
      ></button>
    </div>
  </article>
</template>

<script lang="ts">
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      questionTitle: "",
      removeModalActive: false,
      editModalActive: false
    };
  },
  computed: {
    isQuestionUser() {
      if (!this.$store.getters.user) {
        return false;
      }
      return this.$store.getters.user.id === this.question.user.id;
    }
  },
  methods: {
    toggleRemoveModal() {
      this.removeModalActive = !this.removeModalActive;
    },
    toggleEditModal() {
      this.questionTitle = this.question.title;
      this.editModalActive = !this.editModalActive;
    },
    removeQuestion(id) {
      this.$store.dispatch("question/removeQuestion", id);
      this.toggleRemoveModal();
    },
    updateQuestion(id, updateText) {
      this.$store.dispatch("question/updateQuestion", {
        id,
        updateText
      });
      this.toggleEditModal();
    }
  }
};
</script>
