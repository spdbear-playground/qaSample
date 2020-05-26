<template>
  <div>
    <strong>{{ answer.title }}</strong>
    <br />
    <small>{{ answer.user && answer.user.name }}</small>
    <small>{{ createdatFormatted }}</small>
    <!-- ここに編集・削除ボタンが入る -->
    <span v-if="isLoginUser" class="level-left buttons">
      <a class="button is-small is-rounded" @click="toggleEditModal">編集</a>
      <a class="button is-small is-rounded" @click="toggleRemoveModal">削除</a>
    </span>
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
                removeAnswer(questionId, answer.id);
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
          <p>回答の編集</p>
          <textarea
            v-model="answerTitle"
            class="textarea"
            placeholder="回答を編集してください"
          ></textarea>
        </section>
        <footer class="modal-card-foot">
          <button class="button" @click="toggleEditModal">閉じる</button>
          <button
            class="button is-primary"
            @click="
              () => {
                updateAnswer(questionId, answer.id, answerTitle);
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import moment from "moment";
export default Vue.extend({
  props: {
    answer: {
      type: Object
    },
    questionId: {
      type: String
    }
  },
  data(): {
    removeModalActive: boolean;
    editModalActive: boolean;
    answerTitle: string;
  } {
    return {
      removeModalActive: false,
      editModalActive: false,
      answerTitle: ""
    };
  },
  computed: {
    isLoginUser(): boolean {
      if (!this.$store.getters.user) return false;
      return this.$store.getters.user.id === this.answer.user.id;
    },

    createdatFormatted(): string {
      return moment(this.answer.createdAt).format("YYYY.MM.DD - h:mm a");
    }
  },
  methods: {
    toggleRemoveModal() {
      this.removeModalActive = !this.removeModalActive;
    },
    toggleEditModal() {
      this.editModalActive = !this.editModalActive;
    },
    removeAnswer(questionId: string, answerId: string) {
      this.$store.dispatch("answer/removeAnswer", {
        questionId,
        answerId
      });
      this.toggleRemoveModal();
    },
    updateAnswer(questionId: string, answerId: string, updateText: string) {
      this.$store.dispatch("answer/updateAnswer", {
        questionId,
        answerId,
        updateText
      });
      this.toggleEditModal();
    }
  }
});
</script>
