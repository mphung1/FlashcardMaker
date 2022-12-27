const express = require('express')
const app = express();
const path = require("path");
const fs = require("fs");
require('dotenv').config()
const language = require('@google-cloud/language');

const PORT = process.env.PORT || 8081

const cors = require('cors');
app.use(cors({
  origin: "*"
}));
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.json());

const projectId = process.env.PROJECT_ID;
const keyFilename = "gc-key.json"

const client = new language.LanguageServiceClient({
  projectId: projectId,
  keyFilename: keyFilename
});

app.post('/flashcards', async (req, res) => {
  const text = req.body.text;

  let response = await getQandA(text);

  res.send(JSON.stringify(response));
});

async function getQandA(text) {
  let response = { flashcards: [] };
  let sentences = getSentences(text);
  let obj = null;

  for (let i in sentences) {
    let s = sentences[i];

    if (s.length > 0) {
      const document = {
        content: s,
        type: 'PLAIN_TEXT'
      };

      const [result] = await client.analyzeEntities({document});
      const entities = result.entities;

      let max = 0;
      let found = false;

      entities.every(entity => {
        if (entity.type == "PERSON" || entity.type == "LOCATION" || entity.type == "ORGANIZATION") {
          obj = entity;
          found = true;
          return false;
        }
      });

      if (!found) {
        entities.every(entity => {
          if (entity.salience > max) {
            max = entity.salience;
            obj = entity;
          }
        });
      }

      let question = s;
      const answer = obj.name;

      question = question.replace(answer, "{" + answer.length + "}")

      if (!response.flashcards.some(e => e.answer == answer)) {
        response['flashcards'].push({ question: question, answer: answer })
      }
    }
  }

  return response;
}

function getSentences(s) {
  return s.split('.');
}

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
