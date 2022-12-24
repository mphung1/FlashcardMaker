<template>
  <div class="">
    <p class="my-5 text-xl">Paste in some text to generate or print study questions.</p>

    <div>
      <textarea class="shadow-xl p-5 rounded-lg w-full h-72" id="inputText" name="inputText" v-model="$parent.inputText"></textarea>
    </div>
    <div>
      <button class="text-lg shadow-md ml-0 px-3 py-2 mt-5 rounded-lg font-bold m-3" v-on:click="sendRequest">Generate flashcards</button>
      <button class="text-lg shadow-md ml-0 px-3 py-2 mt-5 rounded-lg font-bold m-3" v-on:click="printQuestions">Print questions</button>
      <button class="text-lg shadow-md ml-0 px-3 py-2 mt-5 rounded-lg font-bold m-3" v-on:click="setExample">Example text</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentSubmit',
  methods: {
    sendRequest: function () {
      const input = this.$parent.inputText;

      const endpoint = "http://localhost:8081/";

      const jsonBody = { text: input };
      const stringed = JSON.stringify(jsonBody);

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: stringed,
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);

        let tempFlashcards = data.flashcards;

        for (let i = 0; i < tempFlashcards.length; i++) {
          let blankSize = tempFlashcards[i].answer.length;
          let blankSpot = "{" + blankSize + "}";

          let blanks = "";
          for (let j = 0; j < blankSize; j++) {
            blanks = blanks + "_";
          }

          tempFlashcards[i].question = tempFlashcards[i].question.replace(blankSpot, blanks);
        }

        this.$parent.flashcards = tempFlashcards;
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    printQuestions: function () {
      const input = this.$parent.inputText;

      const endpoint = "http://localhost:8081/pdf";

      const jsonBody = { text: input };
      const stringed = JSON.stringify(jsonBody);

      fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: stringed,
      })
      .then(response => response.json())
      .then(data => {
        let pdfLink = data.pdfDownload;
        window.open(pdfLink);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    },
    setExample: function () {
      this.$parent.inputText = "The New York Times is a daily newspaper based in New York City with a worldwide readership reported in 2020 to comprise a declining 840,000 paid print subscribers, and a growing 6 million paid digital subscribers. It also is a producer of popular podcasts such as The Daily."
    }
  }
}
</script>
