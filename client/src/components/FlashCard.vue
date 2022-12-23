<template>
  <div class="shadow-xl rounded-lg p-10 h-72 mt-64">
      <div>
        <p class="text-center text-xl" v-if="cardSide == 0 && this.newQuestion.length == 0">{{ this.$parent.flashcards[cardNumber].question }}</p>
        <p class="text-center text-xl" v-if="cardSide == 0 && this.newQuestion.length != 0">{{ this.newQuestion }}</p>
        <p class="text-center text-xl" v-if="cardSide == 1">{{ this.$parent.flashcards[cardNumber].answer }}</p>
      </div>
      <div class="">
        <button class="font-bold p-5" v-on:click="shuffle">Shuffle</button>
        <button class="font-bold px-5 py-2 mr-2 shadow-md rounded-lg" v-on:click="previous">Previous</button>
        <button class="font-bold px-5 py-2 mr-2 shadow-md rounded-lg" v-on:click="flip">Flip</button>
        <button class="font-bold px-5 py-2 mr-2 shadow-md rounded-lg" v-on:click="next">Next</button>
        <button class="font-bold p-5" v-if="this.hintUsed === false && this.cardSide == 0" v-on:click="hint">Stuck? Get a hint.</button>
      </div>
    </div>
</template>

<script>
export default {
  name: 'FlashCard',
  data() {
    return {
      cardNumber: 0,
      cardSide: 0,
      hintUsed: false,
      newQuestion: ""
    }
  },
  methods: {
    flip: function () {
      if (this.cardSide == 0) {
        this.cardSide = 1;
      } else {
        this.cardSide = 0;
      }
    },
    next: function () {
      if (this.cardNumber + 1 < this.$parent.flashcards.length) {
        this.cardNumber++;
        this.cardSide = 0;
        this.hintUsed = false;
        this.newQuestion = "";
      }
    },
    previous: function () {
      if (this.cardNumber - 1 >= 0) {
        this.cardNumber--;
        this.cardSide = 0;
        this.newQuestion = "";
      }
    },
    hint: function () {
      let hintLetter = this.$parent.flashcards[this.cardNumber].answer.charAt(0);
      let hintLetterLocation = this.$parent.flashcards[this.cardNumber].question.indexOf('_');

      let question = this.$parent.flashcards[this.cardNumber].question;

      this.newQuestion = question.substr(0, hintLetterLocation) + hintLetter + question.substr(hintLetterLocation, question.length);
      this.hintUsed = true;
    },
    shuffle: function() {
      console.log(this.$parent.flashcards)
      var m = this.$parent.flashcards.length, t, i;
      console.log(m);
      while (m) {

        i = Math.floor(Math.random() * m--);

        t = this.$parent.flashcards[m];
        this.$parent.flashcards[m] = this.$parent.flashcards[i];
        this.$parent.flashcards[i] = t;
        console.log(i + " " + m)
      }
    }
  }
}
</script>
