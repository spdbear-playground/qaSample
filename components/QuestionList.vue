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
            <small>{{
              this.$moment(question.createdAt).format('YYYY.MM.DD - h:mm a')
            }}</small>
          </p>
        </div>
        <!-- ここに編集・削除ボタンが入る -->
      </nav>
    </div>
    <!-- 編集・削除モーダルが入る -->
  </article>
</template>

<script>
export default {
  props: {
    question: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      questionTitle: ''
    }
  }
}
</script>
