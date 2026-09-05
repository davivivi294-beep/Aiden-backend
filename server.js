const express = require('express');
const Alexa = require('ask-sdk-core');
const { ExpressAdapter } = require('ask-sdk-express-adapter');

const app = express();

// Estado compartilhado entre a Alexa e o Aiden
let estadoAiden = { emocao: "normal" };

// ---------- Handlers dos Intents ----------

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Oi, eu sou o Aiden! Pode falar comigo.')
      .reprompt('Tô aqui, pode falar.')
      .getResponse();
  }
};

const ChegueiIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'ChegueiIntent';
  },
  handle(handlerInput) {
    estadoAiden.emocao = "feliz";
    return handlerInput.responseBuilder
      .speak('Que bom que você chegou! Como foi seu dia?')
      .reprompt('Como foi seu dia?')
      .getResponse();
  }
};

const BoaNoiteIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'BoaNoiteIntent';
  },
  handle(handlerInput) {
    estadoAiden.emocao = "dormir";
    return handlerInput.responseBuilder
      .speak('Boa noite! Vou dormir também.')
      .withShouldEndSession(true)
      .getResponse();
  }
};

const MudarEmocaoIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'MudarEmocaoIntent';
  },
  handle(handlerInput) {
    const emocao = Alexa.getSlotValue(handlerInput.requestEnvelope, 'emocao') || 'normal';
    estadoAiden.emocao = emocao;
    return handlerInput.responseBuilder
      .speak(`Beleza, ficando ${emocao}. Mais alguma coisa?`)
      .reprompt('Pode falar.')
      .getResponse();
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Você pode falar cheguei, boa noite, ou pedir pra eu mudar de emoção.')
      .reprompt('O que você quer que eu faça?')
      .getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    const req = handlerInput.requestEnvelope;
    return Alexa.getRequestType(req) === 'IntentRequest'
      && (Alexa.getIntentName(req) === 'AMAZON.CancelIntent' || Alexa.getIntentName(req) === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak('Até mais!').withShouldEndSession(true).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() { return true; },
  handle(handlerInput, error) {
    console.log(`Erro: ${error.message}`);
    return handlerInput.responseBuilder
      .speak('Desculpa, não entendi. Pode repetir?')
      .reprompt('Pode repetir?')
      .getResponse();
  }
};

// ---------- Monta a skill ----------
const skill = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    ChegueiIntentHandler,
    BoaNoiteIntentHandler,
    MudarEmocaoIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .create();

const adapter = new ExpressAdapter(skill, true, true);

// ---------- Rotas ----------
app.post('/alexa', adapter.getRequestHandlers());

app.get('/estado', (req, res) => {
  res.json(estadoAiden);
});

// ---------- Sobe o servidor ----------
const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
  console.log(`Aiden backend rodando na porta ${PORTA}`);
});
