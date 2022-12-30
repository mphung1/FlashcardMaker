<template>
  <div>
    <p class="my-5 text-xl">Input some text below</p>
    <div>
      <textarea class="border-black border-2 p-5 rounded-lg w-full h-72" id="inputText" name="inputText" v-model="$parent.inputText"></textarea>
    </div>
    <div>
      <button class="text-lg border-black border-2 hover:bg-slate-300 px-3 py-2 mt-5 rounded-lg font-bold m-3" v-on:click="makeFlashcards">Generate flashcards</button>
      <button class="text-lg border-black border-2 hover:bg-slate-300 px-3 py-2 mt-5 rounded-lg font-bold m-3" v-on:click="setExample">Example text</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ContentSubmit',
  methods: {
    makeFlashcards: function () {
      const input = this.$parent.inputText;

      const endpoint = "https://study-assistant.herokuapp.com/flashcards";

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
    makeQuizzes: function () {
    },
    setExample: function () {
      this.$parent.inputText = "A black hole is a region of spacetime where gravity is so strong that nothing, including light or other electromagnetic waves, has enough energy to escape it. The theory of general relativity predicts that a sufficiently compact mass can deform spacetime to form a black hole. The boundary of no escape is called the event horizon. Although it has a great effect on the fate and circumstances of an object crossing it, it has no locally detectable features according to general relativity. In many ways, a black hole acts like an ideal black body, as it reflects no light. Moreover, quantum field theory in curved spacetime predicts that event horizons emit Hawking radiation, with the same spectrum as a black body of a temperature inversely proportional to its mass. This temperature is of the order of billionths of a kelvin for stellar black holes, making it essentially impossible to observe directly. Objects whose gravitational fields are too strong for light to escape were first considered in the 18th century by John Michell and Pierre-Simon Laplace. In 1916, Karl Schwarzschild found the first modern solution of general relativity that would characterize a black hole. David Finkelstein, in 1958, first published the interpretation of black hole as a region of space from which nothing can escape. Black holes were long considered a mathematical curiosity; it was not until the 1960s that theoretical work showed they were a generic prediction of general relativity. The discovery of neutron stars by Jocelyn Bell Burnell in 1967 sparked interest in gravitationally collapsed compact objects as a possible astrophysical reality. The first black hole known was Cygnus X-1, identified by several researchers independently in 1971. Black holes of stellar mass form when massive stars collapse at the end of their life cycle. After a black hole has formed, it can grow by absorbing mass from its surroundings. Supermassive black holes of millions of solar masses (M☉) may form by absorbing other stars and merging with other black holes. There is consensus that supermassive black holes exist in the centres of most galaxies."
    }
  }
}
</script>
