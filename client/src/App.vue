<template>
  <div class="bg-white flex flex-row" id="app">
    <div class="flex-1 p-10">
      <ContentSubmit />
    </div>
    <div class="flex-1 p-10">
      <Flashcard v-if="flashcards !== null" />
    </div>
  </div>
</template>

<script>
import ContentSubmit from './components/ContentSubmit.vue'
import Flashcard from './components/Flashcard.vue'

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
    Flashcard
  }
}
</script>
