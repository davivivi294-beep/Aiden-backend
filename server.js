const express = require('express');
const app = express();
app.use(express.json());

// Guarda o estado atual do Aiden (o ESP32 vai consultar isso)
let estadoAtual = "neutro";

// Rota que a Alexa Skill vai chamar
app.post('/alexa', (req, res) => {
  const tipoRequisicao = req.body.request.type;

  if (tipoRequisicao === "LaunchRequest") {
    estadoAtual = "ouvindo";
    return res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Oi, tudo bem? Quer que eu ligue o computador ou coloque uma música?"
        },
        shouldEndSession: false
      }
    });
  }

  if (tipoRequisicao === "IntentRequest") {
    const nomeI
