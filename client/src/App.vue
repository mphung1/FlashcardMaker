<template>
  <div class="flex flex-row" id="app">
    <div class="flex-1 p-10">
      <h1 class="text-8xl font-bold">Study Helper</h1>
      <ContentSubmit />
    </div>
    <div class="flex-1 p-10">
      <FlashCard v-if="flashcards !== null" />
    </div>
  </div>
</template>

<script>
import ContentSubmit from './components/ContentSubmit.vue'
import FlashCard from './components/FlashCard.vue'

export default {
  name: 'App',
  data() {
    return {
      inputText: "",
      flashcards: null
    }
  },
  components: {
    ContentSubmit,
    FlashCard
  }
}
</script>
