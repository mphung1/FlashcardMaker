const express = require('express')
const app = express();
const path = require("path");
const fs = require("fs");
require('dotenv').config()
const PDFDocument = require('pdfkit');
const { Storage } = require('@google-cloud/storage');

const PORT = process.env.PORT || 8081

const cors = require('cors');
app.use(cors({
  origin: "*"
}));
app.use(express.json());

const projectId = process.env.PROJECT_ID;
const keyFilename = path.join(__dirname, process.env.STORAGE_KEY)

const storage = new Storage({
  projectId: projectId,
  keyFilename: keyFilename
});

const bucket  = storage.bucket("study-files-pdf")

const language = require('@google-cloud/language');
const client = new language.LanguageServiceClient({
  projectId: projectId,
  keyFilename: keyFilename
});

app.post('/', async (req, res) => {
  const text = req.body.text;

  let response = await getQandA(text);

  res.send(JSON.stringify(response));
});

app.post('/pdf', async (req, res) => {
  const text = req.body.text;

  const response = await getQandA(text);

  const fileCode = parseInt(Math.random() * 10000000000)
  const filePath = `generatedFiles/${fileCode}.pdf`

  const doc = new PDFDocument();

  const pdfStream = await fs.createWriteStream(filePath, { metadata: {
          contentType: 'application/pdf'
    }});

  doc.pipe(pdfStream);

  for (i in response.flashcards) {
    let question = response.flashcards[i].question;
    let answer = response.flashcards[i].answer;

    let blankSize = answer.length;
    let blankSpot = "{" + blankSize + "}";

    let blanks = "";
    for (let j = 0; j < blankSize; j++) {
      blanks = blanks + "_";
    }

    let questionNumber = parseInt(i) + 1;
    let fixedQuestion = question.replace(blankSpot, blanks);

    doc.font('Helvetica-Bold').text('Question #' + questionNumber, {
      lineGap: 3
    });
    doc.font('Helvetica').text(fixedQuestion, {
      lineGap: 3
    });
    doc.font('Helvetica-Bold').text('Answer #' + questionNumber, {
      lineGap: 3
    });
    doc.font('Helvetica').text(answer, {
      lineGap: 3
    });
    doc.text(' ');
  }

  await doc.end();


  const data = fs.createReadStream(filePath, 'utf-8')
  // console.log(data)
  await bucket.upload("generatedFiles/" + fileCode + ".pdf")
//
//   const blob = bucket.file(data.path);
//   const blobStream = blob.createWriteStream({
//       resumable: false,
//   });
//
//   blobStream.on("error", (err) => {
//       res.status(500).send({ message: err.message });
//   });
//
//   blobStream.on("finish", async (data) => {
//   // Create URL for direct file access via HTTP.
//   const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
//   try {
//     await bucket.file(fileCode + ".pdf").makePublic();
//   } catch {
//     return res.status(500).send({
//       message:
//         `Public access is denied!`,
//       url: publicUrl,
//     });
//   }
//
//   res.status(200).send({
//     message: "Uploaded the file successfully",
//     url: publicUrl,
//   });
// });
//
//   blobStream.end(data.buffer);
//
// //   // fs.unlink(filePath, (err) => {
// //   //   if (err) {
// //   //     console.error(err)
// //   //     return
// //   //   }
// //   // })
// //

  let newResponse = {
    pdfDownload: `https://storage.googleapis.com/${bucket.name}/${fileCode}.pdf`
  }

  res.send(JSON.stringify(newResponse));
});

async function getQandA(text) {
  let response = { flashcards: [] };
  let sentences = getSentences(text);
  let obj = null;

  for (let i in sentences) {

    let s = sentences[i];

    if (s.length > 0) {
      console.log("S : " + s);
      const document = {
        content: s,
        type: 'PLAIN_TEXT'
      };

      const [result] = await client.analyzeEntities({document});
      const entities = result.entities;

      let max = 0;
      let found = false;

      entities.every(entity => {
        console.log(entity)
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
  console.log('Listening on port ' + PORT + '.');
});
