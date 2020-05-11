<template>
  <div>
    <strong>{{ answer.title }}</strong>
    <br />
    <small>{{ answer.user && answer.user.name }}</small>
    <small>{{
      this.$moment(answer.createdAt).format('YYYY.MM.DD - h:mm a')
    }}</small>
    <!-- ここに編集・削除ボタンが入る -->
    <!-- 編集・削除モーダルが入る -->
  </div>
</template>

<script>
export default {
  props: {
    answer: {
      type: Object
    },
    questionId: {
      type: String
    }
  }
}
</script>
